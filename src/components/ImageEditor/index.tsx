import React, { useState } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { Sliders, Crop, Wand2, Type, Image as ImageIcon, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { FilterPanel } from './FilterPanel';
import { CropPanel } from './CropPanel';
import { TextPanel } from './TextPanel';
import { EffectsPanel } from './EffectsPanel';
import { AdjustmentsPanel } from './AdjustmentsPanel';
import type { EditableImage } from '../../types/image';

interface ImageEditorProps {
  imageUrl: string;
  onSave: (editedImage: EditableImage) => void;
}

const tabs = [
  { id: 'filters', label: 'פילטרים', icon: Sliders },
  { id: 'crop', label: 'חיתוך', icon: Crop },
  { id: 'effects', label: 'אפקטים', icon: Wand2 },
  { id: 'text', label: 'טקסט', icon: Type },
  { id: 'adjustments', label: 'התאמות', icon: ImageIcon }
] as const;

export function ImageEditor({ imageUrl, onSave }: ImageEditorProps) {
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);
  const [isProcessing, setIsProcessing] = useState(false);
  const [editableImage, setEditableImage] = useState<EditableImage>({
    url: imageUrl,
    filters: {},
    crop: null,
    text: [],
    effects: [],
    adjustments: {}
  });

  const handleSave = async (changes: Partial<EditableImage>) => {
    try {
      setIsProcessing(true);
      const updatedImage = { ...editableImage, ...changes };
      setEditableImage(updatedImage);
      onSave(updatedImage);
    } catch (error) {
      console.error('Failed to apply changes:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setEditableImage({
      url: imageUrl,
      filters: {},
      crop: null,
      text: [],
      effects: [],
      adjustments: {}
    });
    onSave({
      url: imageUrl,
      filters: {},
      crop: null,
      text: [],
      effects: [],
      adjustments: {}
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-lg">
      <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
        <Tabs.List className="flex p-1 gap-1 bg-gray-50 rounded-t-lg border-b">
          {tabs.map(({ id, label, icon: Icon }) => (
            <Tabs.Trigger
              key={id}
              value={id}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors flex-1",
                "hover:bg-gray-100 focus:outline-none",
                activeTab === id ? "bg-white shadow-sm" : "text-gray-600"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Tabs.Trigger>
          ))}
        </Tabs.List>

        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Tabs.Content value="filters">
                <FilterPanel
                  image={editableImage}
                  onSave={(filters) => handleSave({ filters })}
                  isProcessing={isProcessing}
                />
              </Tabs.Content>

              <Tabs.Content value="crop">
                <CropPanel
                  image={editableImage}
                  onSave={(crop) => handleSave({ crop })}
                  isProcessing={isProcessing}
                />
              </Tabs.Content>

              <Tabs.Content value="effects">
                <EffectsPanel
                  image={editableImage}
                  onSave={(effects) => handleSave({ effects })}
                  isProcessing={isProcessing}
                />
              </Tabs.Content>

              <Tabs.Content value="text">
                <TextPanel
                  image={editableImage}
                  onSave={(text) => handleSave({ text })}
                  isProcessing={isProcessing}
                />
              </Tabs.Content>

              <Tabs.Content value="adjustments">
                <AdjustmentsPanel
                  image={editableImage}
                  onSave={(adjustments) => handleSave({ adjustments })}
                  isProcessing={isProcessing}
                />
              </Tabs.Content>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex justify-end gap-2">
            <button
              onClick={handleReset}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
              disabled={isProcessing}
            >
              <RotateCcw className="h-4 w-4" />
              <span>אפס הכל</span>
            </button>
          </div>
        </div>
      </Tabs.Root>

      {isProcessing && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      )}
    </div>
  );
}