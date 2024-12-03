import { fabric } from 'fabric';
import type { ImageFilter, ImageCrop, Effect, TextLayer, ImageAdjustments } from '../types/image';

export async function applyImageFilters(
  imageUrl: string,
  filters: Partial<ImageFilter> = {},
  crop: ImageCrop | null = null,
  text: TextLayer[] = [],
  effects: Effect[] = [],
  adjustments: Partial<ImageAdjustments> = {}
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = new fabric.Canvas(document.createElement('canvas'));
    
    fabric.Image.fromURL(imageUrl, (img) => {
      if (!img) {
        reject(new Error('Failed to load image'));
        return;
      }

      // Set canvas dimensions
      const width = img.width || 800;
      const height = img.height || 600;
      canvas.setDimensions({ width, height });

      // Apply filters
      const filterInstances: fabric.IBaseFilter[] = [];
      
      if (filters.brightness) {
        filterInstances.push(new fabric.Image.filters.Brightness({
          brightness: filters.brightness / 100
        }));
      }
      if (filters.contrast) {
        filterInstances.push(new fabric.Image.filters.Contrast({
          contrast: filters.contrast / 100
        }));
      }
      if (filters.saturation) {
        filterInstances.push(new fabric.Image.filters.Saturation({
          saturation: filters.saturation / 100
        }));
      }
      if (filters.blur) {
        filterInstances.push(new fabric.Image.filters.Blur({
          blur: filters.blur / 10
        }));
      }

      img.filters = filterInstances;
      img.applyFilters();

      // Apply crop if specified
      if (crop) {
        img.set({
          left: -crop.x,
          top: -crop.y,
          angle: crop.rotate,
          scaleX: crop.scaleX,
          scaleY: crop.scaleY,
          clipPath: new fabric.Rect({
            left: crop.x,
            top: crop.y,
            width: crop.width,
            height: crop.height,
            absolutePositioned: true
          })
        });
      }

      canvas.add(img);

      // Add text layers
      text.forEach(layer => {
        const textObj = new fabric.Text(layer.text, {
          left: layer.x,
          top: layer.y,
          fontSize: layer.fontSize,
          fontFamily: layer.fontFamily,
          fill: layer.color,
          angle: layer.rotation,
          opacity: layer.opacity
        });
        canvas.add(textObj);
      });

      // Apply effects
      effects.forEach(effect => {
        switch (effect.type) {
          case 'vignette':
            // Add vignette effect
            break;
          case 'grain':
            // Add grain effect
            break;
          // Add other effects
        }
      });

      // Apply adjustments
      if (adjustments.perspective) {
        // Apply perspective transformation
      }

      // Render and get result
      canvas.renderAll();
      resolve(canvas.toDataURL('image/jpeg', 0.95));

      // Clean up
      canvas.dispose();
    }, { crossOrigin: 'anonymous' });
  });
}

export const presetFilters = {
  vintage: {
    brightness: -10,
    contrast: 10,
    saturation: -20
  },
  dramatic: {
    contrast: 30,
    brightness: -10,
    saturation: 20
  },
  bw: {
    brightness: 10,
    contrast: 20,
    saturation: -100
  },
  warm: {
    brightness: 5,
    saturation: 10
  },
  cool: {
    brightness: -5,
    saturation: -10
  }
} as const;