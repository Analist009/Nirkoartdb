import { OpenAI } from 'openai';
import { useSession } from '../session';
import { useImageSettings } from '../../store/useImageSettings';
import { ImageGenerationOptions } from './validation';
import { generatePrompt, enhancePrompt } from './prompt';
import { ImageGenerationError, AuthenticationError, ApiError } from '../errors/types';
import { withErrorHandling } from '../errors/handlers';
import { performanceMonitor } from '../utils/performance';

export async function generateImage(options: ImageGenerationOptions): Promise<string> {
  return withErrorHandling(async () => {
    const session = useSession.getState();
    const settings = useImageSettings.getState();

    if (!session.isValid()) {
      throw new AuthenticationError('נדרש מפתח API תקף');
    }

    performanceMonitor.start('generateImage');

    try {
      // Generate and enhance prompt
      const basePrompt = generatePrompt(
        options.prompt,
        options.artistStyle,
        options.artStyle
      );
      const finalPrompt = await enhancePrompt(basePrompt);

      // Initialize OpenAI client
      const openai = new OpenAI({
        apiKey: session.apiKey!,
        dangerouslyAllowBrowser: true
      });

      // Generate image
      const response = await openai.images.generate({
        model: settings.model,
        prompt: finalPrompt,
        n: 1,
        size: settings.size,
        quality: settings.quality,
        response_format: settings.responseFormat,
      });

      if (!response.data?.[0]?.url) {
        throw new ImageGenerationError('לא התקבלה תמונה מהשרת');
      }

      return response.data[0].url;
    } catch (error) {
      if (error instanceof OpenAI.APIError) {
        if (error.status === 429) {
          throw new ApiError('הגעת למגבלת הבקשות היומית', 429);
        }
        if (error.status === 400) {
          throw new ImageGenerationError('הפרומפט לא תקין או מכיל תוכן לא מורשה');
        }
        throw new ApiError(error.message, error.status);
      }
      throw error;
    } finally {
      const duration = performanceMonitor.end('generateImage');
      console.debug(`Image generation took ${duration}ms`);
    }
  });
}