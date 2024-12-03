import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import { cn } from '../../lib/utils';
import type { EditableImage, ImageFilter } from '../../types/image';

interface FilterPanelProps {
  image: EditableImage;
  onSave: (filters: Partial<ImageFilter>) => void;
  isProcessing: boolean;
}

const filterControls = [
  { id: 'brightness', label: 'בהירות', min: -100, max: 100 },
  { id: 'contrast', label: 'ניגודיות', min: -100, max: 100 },
  { id: 'saturation', label: 'רוויה', min: -100, max: 100 },
  { id: 'exposure', label: 'חשיפה', min: -100, max: 100 },
  { id: 'highlights', label: 'הדגשות', min: -100, max: 100 },
  { id: 'shadows', label: 'צללים', min: -100, max: 100 },
  { id: 'temperature', label: 'טמפרטורה', min: -100, max: 100 },
  { id: 'tint', label: 'גוון', min: -100, max: 100 },
  { id: 'sharpness', label: 'חדות', min: 0, max: 100 },
  { id: 'blur', label: 'טשטוש', min: 0, max: 100 },
  { id: 'noise', label: 'רעש', min: 0, max: 100 },
  { id: 'vibrance', label: 'חיות', min: -100, max: 100 }
];

export function FilterPanel({ image, onSave, isProcessing }: FilterPanelProps) {
  const handleChange = (key: keyof ImageFilter, value: number) => {
    onSave({ [key]: value });
  };

  return (
    <div className="space-y-6">
      {filterControls.map(({ id, label, min, max }) => (
        <div key={id} className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <span className="text-sm text-gray-500">
              {image.filters[id as keyof ImageFilter] || 0}
            </span>
          </div>
          <Slider.Root
            value={[image.filters[id as keyof ImageFilter] || 0]}
            onValueChange={([value]) => handleChange(id as keyof ImageFilter, value)}
            min={min}
            max={max}
            step={1}
            className={cn(
              "relative flex items-center w-full h-5",
              isProcessing && "opacity-50 cursor-not-allowed"
            )}
            disabled={isProcessing}
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
              <Slider.Range className="absolute bg-indigo-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-indigo-500 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </Slider.Root>
        </div>
      ))}
    </div>
  );
}