import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GeneratedImage } from '../types/image';
import { categorizeImage } from '../lib/categories';
import { ensureValidDate } from '../lib/utils';
import { useUserStore } from './useUserStore';

interface ImageStore {
  images: GeneratedImage[];
  addImage: (image: GeneratedImage) => Promise<void>;
  getImagesByUser: (userId: string) => GeneratedImage[];
  getImagesByCategory: (categoryId: string) => GeneratedImage[];
  searchImages: (query: string) => GeneratedImage[];
  rateImage: (id: string, rating: number) => void;
  deleteImage: (id: string) => void;
  clearImages: () => void;
}

export const useImageStore = create<ImageStore>()(
  persist(
    (set, get) => ({
      images: [],
      addImage: async (image) => {
        const categories = await categorizeImage(image);
        const userStore = useUserStore.getState();
        
        if (userStore.credits <= 0) {
          throw new Error('אין לך מספיק קרדיטים ליצירת תמונה חדשה');
        }

        set((state) => ({
          images: [{
            ...image,
            userId: userStore.id,
            categories,
            timestamp: ensureValidDate(image.timestamp)
          }, ...state.images],
        }));

        userStore.decrementCredits();
        userStore.incrementImagesGenerated();
      },
      getImagesByUser: (userId) => {
        const { images } = get();
        return images.filter(img => img.userId === userId);
      },
      getImagesByCategory: (categoryId) => {
        const { images } = get();
        if (!categoryId || categoryId === 'all') return images;
        return images.filter(img => img.categories?.includes(categoryId));
      },
      searchImages: (query) => {
        const { images } = get();
        if (!query) return images;
        
        const searchTerms = query.toLowerCase().split(' ');
        return images.filter((image) => {
          const promptMatch = image.prompt.toLowerCase().includes(query.toLowerCase());
          const tagMatch = image.tags?.some((tag) =>
            searchTerms.some((term) => tag.name.toLowerCase().includes(term))
          );
          const categoryMatch = image.categories?.some((category) =>
            searchTerms.some((term) => category.toLowerCase().includes(term))
          );
          return promptMatch || tagMatch || categoryMatch;
        });
      },
      rateImage: (id, rating) => {
        set((state) => ({
          images: state.images.map((image) =>
            image.id === id ? { ...image, rating } : image
          ),
        }));
      },
      deleteImage: (id) => {
        set((state) => ({
          images: state.images.filter((image) => image.id !== id)
        }));
      },
      clearImages: () => set({ images: [] }),
    }),
    {
      name: 'image-storage',
    }
  )
);