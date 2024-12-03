import React from 'react';
import { Wand2 } from 'lucide-react';
import type { EditableImage, Effect } from '../../types/image';

interface EffectsPanelProps {
  image: EditableImage;
  onSave: (effects: Effect[]) => void;
  isProcessing: boolean;
}

const effectPresets = [
  { id: 'vignette', label: 'וינייט', icon: '🎨' },
  { id: 'grain', label: 'גרעיניות', icon: '🌫️' },
  { id: 'duotone', label: 'דו-גוני', icon: '🎨' },
  { id: 'gradient', label: 'גרדיאנט', icon: '🌈' },
  { id: 'overlay', label: 'שכבת-על', icon: '📦' }
];

export function EffectsPanel({ image, onSave, isProcessing }: EffectsPanelProps) {
  const handleEffectToggle = (effectType: Effect['type']) => {
    const existingEffect = image.effects.find(e => e.type === effectType);
    
    if (existingEffect) {
      onSave(image.effects.filter(e => e.type !== effectType));
    } else {
      onSave([...image.effects, { id: Date.now().toString(), type: effectType, options: {} }]);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {effectPresets.map(effect => (
        <button
          key={effect.id}
          onClick={() => handleEffectToggle(effect.id as Effect['type'])}
          disabled={isProcessing}
          className={`
            p-4 rounded-lg border-2 transition-all
            ${image.effects.some(e => e.type === effect.id)
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-200 hover:border-indigo-200'}
          `}
        >
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl">{effect.icon}</span>
            <span className="text-sm font-medium">{effect.label}</span>
          </div>
        </button>
      ))}
    </div>
  );
}