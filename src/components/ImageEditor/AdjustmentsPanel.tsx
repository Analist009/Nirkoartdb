import React from 'react';
import * as Slider from '@radix-ui/react-slider';
import type { EditableImage, ImageAdjustments } from '../../types/image';
import { cn } from '../../lib/utils';

interface AdjustmentsPanelProps {
  image: EditableImage;
  onSave: (adjustments: Partial<ImageAdjustments>) => void;
  isProcessing: boolean;
}

const adjustmentControls = [
  { id: 'perspective.x', label: 'פרספקטיבה X', min: -45, max: 45 },
  { id: 'perspective.y', label: 'פרספקטיבה Y', min: -45, max: 45 },
  { id: 'distortion', label: 'עיוות', min: -100, max: 100 },
  { id: 'vignette', label: 'וינייט', min: 0, max: 100 },
  { id: 'grain', label: 'גרעיניות', min: 0, max: 100 }
];

export function AdjustmentsPanel({ image, onSave, isProcessing }: AdjustmentsPanelProps) {
  const getValue = (id: string) => {
    if (id.includes('.')) {
      const [key, subKey] = id.split('.');
      return image.adjustments[key as keyof ImageAdjustments]?.[subKey as 'x' | 'y'] || 0;
    }
    return image.adjustments[id as keyof ImageAdjustments] || 0;
  };

  const handleChange = (id: string, value: number) => {
    if (id.includes('.')) {
      const [key, subKey] = id.split('.');
      onSave({
        ...image.adjustments,
        [key]: {
          ...image.adjustments[key as keyof ImageAdjustments],
          [subKey]: value
        }
      });
    } else {
      onSave({ ...image.adjustments, [id]: value });
    }
  };

  return (
    <div className="space-y-6">
      {adjustmentControls.map(({ id, label, min, max }) => (
        <div key={id} className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <span className="text-sm text-gray-500">{getValue(id)}</span>
          </div>
          <Slider.Root
            value={[getValue(id)]}
            onValueChange={([value]) => handleChange(id, value)}
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