import { GeneratedImage } from '../types/image';

const CACHE_PREFIX = 'nirkoart:';
const IMAGE_CACHE_KEY = `${CACHE_PREFIX}images`;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface CacheItem<T> {
  data: T;
  timestamp: number;
  expiry: number;
}

export const cache = {
  set: <T>(key: string, data: T, duration = CACHE_DURATION) => {
    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      expiry: Date.now() + duration
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(item));
  },

  get: <T>(key: string): T | null => {
    const item = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!item) return null;

    const cached = JSON.parse(item) as CacheItem<T>;
    if (Date.now() > cached.expiry) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }

    return cached.data;
  },

  clear: (key?: string) => {
    if (key) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } else {
      Object.keys(localStorage)
        .filter(key => key.startsWith(CACHE_PREFIX))
        .forEach(key => localStorage.removeItem(key));
    }
  }
};

export const imageCache = {
  set: (images: GeneratedImage[]) => {
    cache.set('images', images);
  },

  get: (): GeneratedImage[] | null => {
    const cached = cache.get<GeneratedImage[]>('images');
    if (!cached) return null;
    
    return cached.map(img => ({
      ...img,
      timestamp: new Date(img.timestamp)
    }));
  },

  clear: () => cache.clear('images')
};