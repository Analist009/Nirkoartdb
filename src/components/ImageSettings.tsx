import React from 'react';
import { motion } from 'framer-motion';
import * as Slider from '@radix-ui/react-slider';
import * as Select from '@radix-ui/react-select';
import { Settings, Sliders, Thermometer, Image as ImageIcon } from 'lucide-react';
import { cn } from '../lib/utils';
import { useImageSettings } from '../store/useImageSettings';

export function ImageSettings() {
  const {
    model,
    setModel,
    size,
    setSize,
    quality,
    setQuality,
    temperature,
    setTemperature,
    responseFormat,
    setResponseFormat
  } = useImageSettings();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-indigo-600" />
        <h2 className="text-lg font-semibold">הגדרות יצירת תמונה</h2>
      </div>

      <div className="space-y-6">
        {/* Model Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">מודל</label>
          <Select.Root value={model} onValueChange={setModel}>
            <Select.Trigger className="w-full px-3 py-2 text-right border rounded-lg">
              <Select.Value />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white rounded-lg shadow-lg border p-1">
                <Select.Viewport>
                  <Select.Item value="dall-e-3" className="px-3 py-2 outline-none cursor-pointer hover:bg-indigo-50 rounded">
                    <Select.ItemText>DALL-E 3 (איכות גבוהה)</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="dall-e-2" className="px-3 py-2 outline-none cursor-pointer hover:bg-indigo-50 rounded">
                    <Select.ItemText>DALL-E 2 (מהירות)</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {/* Image Size */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">גודל תמונה</label>
          <Select.Root value={size} onValueChange={setSize}>
            <Select.Trigger className="w-full px-3 py-2 text-right border rounded-lg">
              <Select.Value />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white rounded-lg shadow-lg border p-1">
                <Select.Viewport>
                  <Select.Item value="1024x1024" className="px-3 py-2 outline-none cursor-pointer hover:bg-indigo-50 rounded">
                    <Select.ItemText>1024x1024 (ריבוע)</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="1792x1024" className="px-3 py-2 outline-none cursor-pointer hover:bg-indigo-50 rounded">
                    <Select.ItemText>1792x1024 (רחב)</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="1024x1792" className="px-3 py-2 outline-none cursor-pointer hover:bg-indigo-50 rounded">
                    <Select.ItemText>1024x1792 (גבוה)</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {/* Quality */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">איכות</label>
          <Select.Root value={quality} onValueChange={setQuality}>
            <Select.Trigger className="w-full px-3 py-2 text-right border rounded-lg">
              <Select.Value />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white rounded-lg shadow-lg border p-1">
                <Select.Viewport>
                  <Select.Item value="standard" className="px-3 py-2 outline-none cursor-pointer hover:bg-indigo-50 rounded">
                    <Select.ItemText>רגילה</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="hd" className="px-3 py-2 outline-none cursor-pointer hover:bg-indigo-50 rounded">
                    <Select.ItemText>HD (איכות גבוהה)</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <label className="text-sm font-medium text-gray-700">יצירתיות</label>
            <span className="text-sm text-gray-500">{temperature}</span>
          </div>
          <Slider.Root
            value={[temperature]}
            onValueChange={([value]) => setTemperature(value)}
            min={0}
            max={2}
            step={0.1}
            className="relative flex items-center w-full h-5"
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
              <Slider.Range className="absolute bg-indigo-500 rounded-full h-full" />
            </Slider.Track>
            <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-indigo-500 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400" />
          </Slider.Root>
          <div className="flex justify-between text-xs text-gray-500">
            <span>מדויק</span>
            <span>יצירתי</span>
          </div>
        </div>

        {/* Response Format */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">פורמט תגובה</label>
          <Select.Root value={responseFormat} onValueChange={setResponseFormat}>
            <Select.Trigger className="w-full px-3 py-2 text-right border rounded-lg">
              <Select.Value />
            </Select.Trigger>
            <Select.Portal>
              <Select.Content className="bg-white rounded-lg shadow-lg border p-1">
                <Select.Viewport>
                  <Select.Item value="url" className="px-3 py-2 outline-none cursor-pointer hover:bg-indigo-50 rounded">
                    <Select.ItemText>URL</Select.ItemText>
                  </Select.Item>
                  <Select.Item value="b64_json" className="px-3 py-2 outline-none cursor-pointer hover:bg-indigo-50 rounded">
                    <Select.ItemText>Base64 JSON</Select.ItemText>
                  </Select.Item>
                </Select.Viewport>
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </div>
    </div>
  );
}