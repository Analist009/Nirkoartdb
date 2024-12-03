import React from 'react';
import { fabric } from 'fabric';
import type { EditableImage, ImageCrop } from '../../types/image';

interface CropPanelProps {
  image: EditableImage;
  onSave: (crop: ImageCrop | null) => void;
  isProcessing: boolean;
}

export function CropPanel({ image, onSave, isProcessing }: CropPanelProps) {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const fabricRef = React.useRef<fabric.Canvas | null>(null);

  React.useEffect(() => {
    if (!canvasRef.current) return;

    fabricRef.current = new fabric.Canvas(canvasRef.current);
    const canvas = fabricRef.current;

    fabric.Image.fromURL(image.url, (img) => {
      canvas.setDimensions({
        width: img.width || 800,
        height: img.height || 600
      });

      img.set({
        left: 0,
        top: 0,
        selectable: false
      });

      canvas.add(img);
      canvas.renderAll();
    });

    return () => {
      canvas.dispose();
    };
  }, [image.url]);

  const handleCrop = () => {
    if (!fabricRef.current) return;

    const canvas = fabricRef.current;
    const cropRect = canvas.getActiveObject();
    
    if (cropRect && cropRect.type === 'rect') {
      const crop: ImageCrop = {
        x: cropRect.left || 0,
        y: cropRect.top || 0,
        width: cropRect.width || 0,
        height: cropRect.height || 0,
        rotate: cropRect.angle || 0,
        scaleX: cropRect.scaleX || 1,
        scaleY: cropRect.scaleY || 1
      };
      onSave(crop);
    }
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg overflow-hidden">
        <canvas ref={canvasRef} />
      </div>
      
      <div className="flex justify-end gap-2">
        <button
          onClick={() => onSave(null)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
          disabled={isProcessing}
        >
          בטל חיתוך
        </button>
        <button
          onClick={handleCrop}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          disabled={isProcessing}
        >
          החל חיתוך
        </button>
      </div>
    </div>
  );
}