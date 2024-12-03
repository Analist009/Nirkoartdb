export const API_CONFIG = {
  MODELS: {
    GPT35: 'gpt-3.5-turbo',
    DALLE3: 'dall-e-3'
  },
  MAX_TOKENS: {
    PROMPT_ANALYSIS: 300,
    PROMPT_ENHANCEMENT: 200
  },
  TEMPERATURE: {
    ANALYSIS: 0.7,
    ENHANCEMENT: 0.7
  }
} as const;

export const IMAGE_CONFIG = {
  MAX_PROMPT_LENGTH: 4000,
  DEFAULT_SIZE: '1024x1024',
  DEFAULT_QUALITY: 'standard',
  DEFAULT_FORMAT: 'url',
  MAX_BATCH_SIZE: 50
} as const;

export const CACHE_CONFIG = {
  TTL: 24 * 60 * 60 * 1000, // 24 hours
  MAX_SIZE: 100,
  PREFIX: 'nirkoart:'
} as const;

export const PERFORMANCE_CONFIG = {
  DEBOUNCE_DELAY: 500,
  THROTTLE_LIMIT: 1000,
  MONITORING_INTERVAL: 30000 // 30 seconds
} as const;