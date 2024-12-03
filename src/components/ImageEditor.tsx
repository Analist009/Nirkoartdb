import React, { useState } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { Sliders, Wand2, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../lib/utils';
import { applyImageFilters, type ImageFilters, presetFilters } from '../lib/imageEditor';

interface ImageEditorProps {
  imageUrl: string;
  onSave: (editedUrl: string) => void;
}

const DEFAULT_FILTERS: ImageFilters = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  blur: 0,
  grayscale: 0,
  sepia: 0
};

export function ImageEditor({ imageUrl, onSave }: ImageEditorProps) {
  const [filters, setFilters] = useState<ImageFilters>(DEFAULT_FILTERS);
  const [activeTab, setActiveTab] = useState<'filters' | 'presets'>('filters');
  const [isApplying, setIsApplying] = useState(false);

  const handleFilterChange = async (key: keyof ImageFilters, value: number) => {
    try {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      setIsApplying(true);
      const editedUrl = await applyImageFilters(imageUrl, newFilters);
      onSave(editedUrl);
    } catch (error) {
      console.error('Failed to apply filter:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handlePresetClick = async (presetName: keyof typeof presetFilters) => {
    try {
      setIsApplying(true);
      const preset = presetFilters[presetName];
      const editedUrl = await applyImageFilters(imageUrl, preset);
      setFilters({ ...DEFAULT_FILTERS, ...preset });
      onSave(editedUrl);
    } catch (error) {
      console.error('Failed to apply preset:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleReset = async () => {
    try {
      setIsApplying(true);
      setFilters(DEFAULT_FILTERS);
      const editedUrl = await applyImageFilters(imageUrl, DEFAULT_FILTERS);
      onSave(editedUrl);
    } catch (error) {
      console.error('Failed to reset filters:', error);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('filters')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
            activeTab === 'filters' ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <Sliders className="h-4 w-4" />
          <span>פילטרים</span>
        </button>
        <button
          onClick={() => setActiveTab('presets')}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg transition-colors",
            activeTab === 'presets' ? "bg-indigo-100 text-indigo-700" : "text-gray-600 hover:bg-gray-100"
          )}
        >
          <Wand2 className="h-4 w-4" />
          <span>פילטרים מוכנים</span>
        </button>
      </div>

      {activeTab === 'filters' && (
        <div className="space-y-6">
          {Object.entries(filters).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex justify-between">
                <span>{key}</span>
                <span className="text-gray-500">{value}</span>
              </label>
              <Slider.Root
                value={[value]}
                onValueChange={([newValue]) => handleFilterChange(key as keyof ImageFilters, newValue)}
                min={-100}
                max={100}
                step={1}
                className="relative flex items-center w-full h-5"
                disabled={isApplying}
              >
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                  <Slider.Range className="absolute bg-indigo-500 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-indigo-500 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </Slider.Root>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'presets' && (
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(presetFilters).map(([name]) => (
            <button
              key={name}
              onClick={() => handlePresetClick(name as keyof typeof presetFilters)}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors disabled:opacity-50"
              disabled={isApplying}
            >
              {name}
            </button>
          ))}
        </div>
      )}

      <motion.div 
        className="mt-6 flex justify-end gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          disabled={isApplying}
        >
          <RotateCcw className="h-4 w-4" />
          <span>אפס</span>
        </button>
      </motion.div>

      {isApplying && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
        </div>
      )}
    </div>
  );
}