import type { GeneratedImage } from '../../types/image';

export interface Schema {
  images: GeneratedImage;
}

export const DB_CONFIG = {
  name: 'NirkoArtDB',
  version: 1,
  stores: {
    images: '++id, userId, timestamp, artistStyle, artStyle'
  }
} as const;

export const STORE_NAMES = {
  IMAGES: 'images'
} as const;