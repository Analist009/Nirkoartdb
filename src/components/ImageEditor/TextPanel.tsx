import React, { useState } from 'react';
import { Type, Plus, Trash2 } from 'lucide-react';
import type { EditableImage, TextLayer } from '../../types/image';

interface TextPanelProps {
  image: EditableImage;
  onSave: (text: TextLayer[]) => void;
  isProcessing: boolean;
}

const defaultTextLayer: Omit<TextLayer, 'id'> = {
  text: 'טקסט חדש',
  x: 50,
  y: 50,
  fontSize: 24,
  fontFamily: 'Arial',
  color: '#000000',
  rotation: 0,
  opacity: 1
};

export function TextPanel({ image, onSave, isProcessing }: TextPanelProps) {
  const [selectedLayer, setSelectedLayer] = useState<string | null>(null);

  const handleAddText = () => {
    const newLayer: TextLayer = {
      id: Date.now().toString(),
      ...defaultTextLayer
    };
    onSave([...image.text, newLayer]);
    setSelectedLayer(newLayer.id);
  };

  const handleUpdateLayer = (id: string, updates: Partial<TextLayer>) => {
    onSave(
      image.text.map(layer =>
        layer.id === id ? { ...layer, ...updates } : layer
      )
    );
  };

  const handleRemoveLayer = (id: string) => {
    onSave(image.text.filter(layer => layer.id !== id));
    setSelectedLayer(null);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={handleAddText}
        disabled={isProcessing}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        <Plus className="h-4 w-4" />
        <span>הוסף טקסט</span>
      </button>

      <div className="space-y-4">
        {image.text.map(layer => (
          <div
            key={layer.id}
            className={`
              p-4 rounded-lg border-2 transition-all cursor-pointer
              ${selectedLayer === layer.id
                ? 'border-indigo-500 bg-indigo-50'
                : 'border-gray-200 hover:border-indigo-200'}
            `}
            onClick={() => setSelectedLayer(layer.id)}
          >
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={layer.text}
                onChange={e => handleUpdateLayer(layer.id, { text: e.target.value })}
                className="bg-transparent border-none focus:outline-none"
                disabled={isProcessing}
              />
              <button
                onClick={() => handleRemoveLayer(layer.id)}
                className="text-red-500 hover:text-red-600"
                disabled={isProcessing}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            {selectedLayer === layer.id && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700">גודל גופן</label>
                  <input
                    type="number"
                    value={layer.fontSize}
                    onChange={e => handleUpdateLayer(layer.id, { fontSize: Number(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    disabled={isProcessing}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700">צבע</label>
                  <input
                    type="color"
                    value={layer.color}
                    onChange={e => handleUpdateLayer(layer.id, { color: e.target.value })}
                    className="mt-1 block w-full h-9 rounded-md"
                    disabled={isProcessing}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}