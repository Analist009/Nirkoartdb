import { OpenAI } from 'openai';
import { ImageGenerationOptionsSchema } from './validation';
import { generatePrompt, sanitizePrompt } from './promptEngineering';
import { analyzePrompt } from './promptAnalysis';
import { uploadImage } from './storage';
import { ImageGenerationError } from './errors';
import { useSession } from './session';
import { useUserStore } from '../store/useUserStore';
import { useImageSettings } from '../store/useImageSettings';
import { toast } from 'sonner';
import type { GeneratedImage } from '../types/image';
import { artistStyles, artStyles } from '../data/styles';

export async function generateImage(options: ImageGenerationOptions): Promise<GeneratedImage> {
  const userStore = useUserStore.getState();
  const imageSettings = useImageSettings.getState();
  
  if (!userStore.id) {
    throw new ImageGenerationError('נדרשת התחברות ליצירת תמונות');
  }

  if (userStore.credits <= 0) {
    throw new ImageGenerationError('אין לך מספיק קרדיטים ליצירת תמונה חדשה');
  }

  try {
    // Validate input
    const validatedOptions = ImageGenerationOptionsSchema.parse(options);
    
    // Get style prompts
    const artistStyle = validatedOptions.artistStyle 
      ? artistStyles.find(s => s.id === validatedOptions.artistStyle)?.prompt 
      : null;
    
    const artStyle = validatedOptions.artStyle
      ? artStyles.find(s => s.id === validatedOptions.artStyle)?.prompt
      : null;

    // Generate base prompt
    let finalPrompt = generatePrompt(validatedOptions.prompt, artistStyle, artStyle);

    // Sanitize prompt
    finalPrompt = sanitizePrompt(finalPrompt);

    // Generate image
    const session = useSession.getState();
    if (!session.isValid()) {
      throw new ImageGenerationError('מפתח API לא תקף');
    }

    const openai = new OpenAI({
      apiKey: session.apiKey!,
      dangerouslyAllowBrowser: true
    });

    try {
      const response = await openai.images.generate({
        model: imageSettings.model,
        prompt: finalPrompt,
        n: 1,
        size: imageSettings.size,
        quality: imageSettings.quality,
        response_format: imageSettings.responseFormat,
      });

      if (!response.data?.[0]?.url) {
        throw new ImageGenerationError('תגובה לא תקינה מ-OpenAI');
      }

      // Analyze prompt for tags and summary
      const analysis = await analyzePrompt(finalPrompt);

      // Create image metadata
      const image: GeneratedImage = {
        id: Date.now().toString(),
        url: response.data[0].url,
        userId: userStore.id,
        prompt: finalPrompt,
        originalPrompt: validatedOptions.prompt,
        timestamp: new Date(),
        title: analysis.summary,
        tags: analysis.tags.map(tag => ({ id: tag.replace(/\s+/g, '-'), name: tag })),
        categories: analysis.categories,
        rating: 0,
        artistStyle: validatedOptions.artistStyle,
        artStyle: validatedOptions.artStyle,
        views: 0,
        promptCopies: 0,
        shares: 0,
        creator: userStore.name || 'אנונימי'
      };

      // Upload to storage with watermark
      const storedUrl = await uploadImage(image.url, image);
      image.url = storedUrl;

      toast.success('התמונה נוצרה בהצלחה!');
      return image;
    } catch (error: any) {
      if (error.response?.status === 429) {
        throw new ImageGenerationError('הגעת למגבלת הבקשות היומית');
      }
      if (error.response?.status === 400) {
        throw new ImageGenerationError('הפרומפט לא תקין או מכיל תוכן לא מורשה');
      }
      throw error;
    }
  } catch (error) {
    if (error instanceof Error) {
      throw new ImageGenerationError(
        error.message || 'שגיאה ביצירת התמונה. אנא נסה שוב.',
        error
      );
    }
    throw new ImageGenerationError('אירעה שגיאה לא צפויה');
  }
}