import { fabric } from 'fabric';
import { toast } from 'sonner';

interface WatermarkOptions {
  text?: string;
  fontSize?: number;
  opacity?: number;
  color?: string;
  position?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft' | 'center';
}

const defaultOptions: WatermarkOptions = {
  text: 'Network.io AI',
  fontSize: 24,
  opacity: 0.7,
  color: '#ffffff',
  position: 'bottomRight'
};

export async function addWatermark(
  imageUrl: string,
  options: WatermarkOptions = {}
): Promise<string> {
  const opts = { ...defaultOptions, ...options };

  return new Promise((resolve, reject) => {
    const canvas = new fabric.Canvas(null, {
      width: 1024,
      height: 1024
    });

    fabric.Image.fromURL(imageUrl, (img) => {
      if (!img) {
        reject(new Error('Failed to load image'));
        return;
      }

      // Scale image to fit canvas
      const scale = Math.min(
        canvas.width! / img.width!,
        canvas.height! / img.height!
      );
      img.scale(scale);

      // Center image
      img.set({
        left: (canvas.width! - img.width! * scale) / 2,
        top: (canvas.height! - img.height! * scale) / 2
      });

      canvas.add(img);

      // Add watermark text
      const watermark = new fabric.Text(opts.text!, {
        fontSize: opts.fontSize,
        fill: opts.color,
        opacity: opts.opacity,
        fontFamily: 'Arial',
        selectable: false
      });

      // Position watermark
      const padding = 20;
      switch (opts.position) {
        case 'bottomRight':
          watermark.set({
            left: canvas.width! - watermark.width! - padding,
            top: canvas.height! - watermark.height! - padding
          });
          break;
        case 'bottomLeft':
          watermark.set({
            left: padding,
            top: canvas.height! - watermark.height! - padding
          });
          break;
        case 'topRight':
          watermark.set({
            left: canvas.width! - watermark.width! - padding,
            top: padding
          });
          break;
        case 'topLeft':
          watermark.set({
            left: padding,
            top: padding
          });
          break;
        case 'center':
          watermark.set({
            left: (canvas.width! - watermark.width!) / 2,
            top: (canvas.height! - watermark.height!) / 2
          });
          break;
      }

      // Add shadow to watermark
      watermark.set({
        shadow: new fabric.Shadow({
          color: 'rgba(0,0,0,0.5)',
          blur: 5,
          offsetX: 2,
          offsetY: 2
        })
      });

      canvas.add(watermark);
      canvas.renderAll();

      try {
        const dataUrl = canvas.toDataURL({
          format: 'jpeg',
          quality: 0.95
        });
        resolve(dataUrl);
      } catch (error) {
        reject(error);
      } finally {
        canvas.dispose();
      }
    }, { crossOrigin: 'anonymous' });
  });
}

export async function processAndUploadImage(
  imageUrl: string,
  metadata: any
): Promise<string> {
  try {
    // Add watermark
    const watermarkedUrl = await addWatermark(imageUrl);
    
    // Convert data URL to blob
    const response = await fetch(watermarkedUrl);
    const blob = await response.blob();

    // Upload to Vercel Blob
    if (!process.env.VITE_VERCEL_BLOB_READ_WRITE_TOKEN) {
      console.warn('Vercel Blob token not found, using watermarked URL');
      return watermarkedUrl;
    }

    const { put } = await import('@vercel/blob');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `images/${timestamp}-${metadata.id}.jpg`;

    const { url } = await put(filename, blob, {
      access: 'public',
      addRandomSuffix: true,
      token: process.env.VITE_VERCEL_BLOB_READ_WRITE_TOKEN
    });

    toast.success('התמונה נשמרה בהצלחה');
    return url;
  } catch (error) {
    console.error('Failed to process and upload image:', error);
    toast.error('שגיאה בשמירת התמונה');
    return imageUrl;
  }
}