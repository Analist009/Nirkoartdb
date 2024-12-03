import { z } from 'zod';
import { IMAGE_CONFIG } from './config';

export const ImageGenerationOptionsSchema = z.object({
  prompt: z.string()
    .min(1, 'הפרומפט לא יכול להיות ריק')
    .max(4000, 'הפרומפט ארוך מדי')
    .refine(text => !text.includes('<') && !text.includes('>'), {
      message: 'הפרומפט מכיל תווים לא חוקיים'
    }),
  artistStyle: z.string().nullable(),
  artStyle: z.string().nullable(),
  model: z.enum([IMAGE_CONFIG.models.DALLE2, IMAGE_CONFIG.models.DALLE3])
    .default(IMAGE_CONFIG.defaults.model),
  size: z.enum([
    IMAGE_CONFIG.sizes.SQUARE,
    IMAGE_CONFIG.sizes.LANDSCAPE,
    IMAGE_CONFIG.sizes.PORTRAIT
  ]).default(IMAGE_CONFIG.defaults.size),
  quality: z.enum([IMAGE_CONFIG.quality.STANDARD, IMAGE_CONFIG.quality.HD])
    .default(IMAGE_CONFIG.defaults.quality),
  temperature: z.number().min(0).max(2).default(IMAGE_CONFIG.defaults.temperature),
  responseFormat: z.enum([IMAGE_CONFIG.formats.URL, IMAGE_CONFIG.formats.BASE64])
    .default(IMAGE_CONFIG.defaults.responseFormat)
});

export type ImageGenerationOptions = z.infer<typeof ImageGenerationOptionsSchema>;