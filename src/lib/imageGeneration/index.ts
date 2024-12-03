import { ImageGenerationOptionsSchema, type ImageGenerationOptions } from './validation';
import { generatePrompt, enhancePrompt } from './prompt';
import { generateImageWithAPI } from './api';
import { analyzePrompt } from '../promptAnalysis';
import { uploadImage } from '../storage';
import { ImageGenerationError } from '../errors';
import { useUserStore } from '../../store/useUserStore';
import { toast } from 'sonner';
import type { GeneratedImage } from '../../types/image';
import { artistStyles, artStyles } from '../../data/styles';
import { performanceMonitor } from '../performance';

export async function generateImage(options: ImageGenerationOptions): Promise<GeneratedImage> {
  const userStore = useUserStore.getState();
  
  if (!userStore.id) {
    throw new ImageGenerationError('נדרשת התחברות ליצירת תמונות');
  }

  if (userStore.credits <= 0) {
    throw new ImageGenerationError('אין לך מספיק קרדיטים ליצירת תמונה חדשה');
  }

  try {
    // Start performance monitoring
    performanceMonitor.start('generateImage');

    // Validate input
    const validatedOptions = ImageGenerationOptionsSchema.parse(options);
    
    // Get style prompts
    const artistStyle = validatedOptions.artistStyle 
      ? artistStyles.find(s => s.id === validatedOptions.artistStyle)?.prompt 
      : null;
    
    const artStyle = validatedOptions.artStyle
      ? artStyles.find(s => s.id === validatedOptions.artStyle)?.prompt
      : null;

    // Generate and enhance prompt
    let finalPrompt = generatePrompt(validatedOptions.prompt, artistStyle, artStyle);
    finalPrompt = await enhancePrompt(finalPrompt);

    // Generate image
    const imageUrl = await generateImageWithAPI(finalPrompt);

    // Analyze prompt for tags and summary
    const analysis = await analyzePrompt(finalPrompt);

    // Create image metadata
    const image: GeneratedImage = {
      id: Date.now().toString(),
      url: imageUrl,
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

    // Log performance
    const duration = performanceMonitor.end('generateImage');
    console.debug(`Image generation took ${duration}ms`);

    toast.success('התמונה נוצרה בהצלחה!');
    return image;
  } catch (error) {
    if (error instanceof Error) {
      throw new ImageGenerationError(error.message);
    }
    throw new ImageGenerationError('אירעה שגיאה לא צפויה');
  }
}