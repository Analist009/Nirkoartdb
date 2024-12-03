import { z } from 'zod';

export const ImageGenerationOptionsSchema = z.object({
  prompt: z.string()
    .min(1, 'הפרומפט לא יכול להיות ריק')
    .max(4000, 'הפרומפט ארוך מדי')
    .refine(text => !text.includes('<') && !text.includes('>'), {
      message: 'הפרומפט מכיל תווים לא חוקיים'
    }),
  artistStyle: z.string().nullable(),
  artStyle: z.string().nullable(),
  model: z.enum(['dall-e-2', 'dall-e-3']),
  size: z.enum(['1024x1024', '1792x1024', '1024x1792']),
  quality: z.enum(['standard', 'hd']),
  temperature: z.number().min(0).max(2),
  responseFormat: z.enum(['url', 'b64_json'])
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().min(2, 'שם חייב להכיל לפחות 2 תווים'),
  email: z.string().email('כתובת אימייל לא תקינה'),
  credits: z.number().min(0),
  imagesGenerated: z.number().min(0)
});

export const ImageMetadataSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  userId: z.string(),
  title: z.string(),
  prompt: z.string(),
  originalPrompt: z.string(),
  timestamp: z.date(),
  artistStyle: z.string().nullable(),
  artStyle: z.string().nullable(),
  rating: z.number().min(0).max(5),
  views: z.number().min(0),
  promptCopies: z.number().min(0),
  shares: z.number().min(0),
  creator: z.string(),
  tags: z.array(z.object({
    id: z.string(),
    name: z.string()
  })),
  categories: z.array(z.string())
});

export type ImageGenerationOptions = z.infer<typeof ImageGenerationOptionsSchema>;
export type User = z.infer<typeof UserSchema>;
export type ImageMetadata = z.infer<typeof ImageMetadataSchema>;