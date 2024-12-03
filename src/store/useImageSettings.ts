import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ImageSettings {
  model: 'dall-e-2' | 'dall-e-3';
  size: '1024x1024' | '1792x1024' | '1024x1792';
  quality: 'standard' | 'hd';
  temperature: number;
  responseFormat: 'url' | 'b64_json';
  setModel: (model: 'dall-e-2' | 'dall-e-3') => void;
  setSize: (size: '1024x1024' | '1792x1024' | '1024x1792') => void;
  setQuality: (quality: 'standard' | 'hd') => void;
  setTemperature: (temperature: number) => void;
  setResponseFormat: (format: 'url' | 'b64_json') => void;
}

export const useImageSettings = create<ImageSettings>()(
  persist(
    (set) => ({
      model: 'dall-e-3',
      size: '1024x1024',
      quality: 'standard',
      temperature: 1,
      responseFormat: 'url',
      setModel: (model) => set({ model }),
      setSize: (size) => set({ size }),
      setQuality: (quality) => set({ quality }),
      setTemperature: (temperature) => set({ temperature }),
      setResponseFormat: (format) => set({ responseFormat: format }),
    }),
    {
      name: 'image-settings',
    }
  )
);