import { OpenAI } from 'openai';
import { useSession } from '../session';
import { useImageSettings } from '../../store/useImageSettings';
import { ImageGenerationError } from '../errors';

export async function generateImageWithAPI(prompt: string): Promise<string> {
  const session = useSession.getState();
  const settings = useImageSettings.getState();
  
  if (!session.isValid()) {
    throw new ImageGenerationError('מפתח API לא תקף');
  }

  try {
    const openai = new OpenAI({
      apiKey: session.apiKey!,
      dangerouslyAllowBrowser: true
    });

    const response = await openai.images.generate({
      model: settings.model,
      prompt,
      n: 1,
      size: settings.size,
      quality: settings.quality,
      response_format: settings.responseFormat,
    });

    if (!response.data?.[0]?.url) {
      throw new ImageGenerationError('תגובה לא תקינה מ-OpenAI');
    }

    return response.data[0].url;
  } catch (error: any) {
    if (error.response?.status === 429) {
      throw new ImageGenerationError('הגעת למגבלת הבקשות היומית');
    }
    if (error.response?.status === 400) {
      throw new ImageGenerationError('הפרומפט לא תקין או מכיל תוכן לא מורשה');
    }
    throw new ImageGenerationError(error.message || 'שגיאה ביצירת התמונה');
  }
}