export const IMAGE_CONFIG = {
  models: {
    DALLE2: 'dall-e-2',
    DALLE3: 'dall-e-3'
  },
  sizes: {
    SQUARE: '1024x1024',
    LANDSCAPE: '1792x1024', 
    PORTRAIT: '1024x1792'
  },
  quality: {
    STANDARD: 'standard',
    HD: 'hd'
  },
  formats: {
    URL: 'url',
    BASE64: 'b64_json'
  },
  defaults: {
    model: 'dall-e-3',
    size: '1024x1024',
    quality: 'hd', // Pro users get HD by default
    temperature: 1,
    responseFormat: 'url'
  },
  proFeatures: {
    maxImagesPerRequest: 10,
    maxPromptLength: 4000,
    allowedModels: ['dall-e-2', 'dall-e-3'],
    allowedSizes: ['1024x1024', '1792x1024', '1024x1792'],
    allowedQualities: ['standard', 'hd']
  }
} as const;

export const QUALITY_MODIFIERS = [
  'high quality',
  'detailed',
  'professional',
  'artistic',
  'masterpiece',
  'high resolution',
  'sharp focus',
  'studio lighting'
] as const;