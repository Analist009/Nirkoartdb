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