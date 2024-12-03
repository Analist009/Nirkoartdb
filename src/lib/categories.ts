import { OpenAI } from 'openai';
import { useSession } from './session';
import { toast } from 'sonner';
import type { GeneratedImage } from '../types/image';

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export async function categorizeImage(image: GeneratedImage): Promise<string[]> {
  const session = useSession.getState();
  
  if (!session.isValid()) {
    return ['כללי'];
  }

  try {
    const openai = new OpenAI({
      apiKey: session.apiKey!,
      dangerouslyAllowBrowser: true
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{
        role: "system",
        content: `Analyze the image prompt and suggest up to 3 relevant categories in Hebrew from the following list:
          - נוף
          - דיוקן
          - אבסטרקט
          - אמנות דיגיטלית
          - טבע
          - אדריכלות
          - פנטזיה
          - אנימה
          - מודרני
          - קלאסי
          
          Return only the category names, separated by commas.`
      }, {
        role: "user",
        content: `Categorize this image based on its prompt: "${image.prompt}"`
      }],
      temperature: 0.3,
      max_tokens: 50
    });

    const categories = response.choices[0].message.content?.split(',').map(c => c.trim()) || ['כללי'];
    return categories;
  } catch (error) {
    console.error('Failed to categorize image:', error);
    return ['כללי'];
  }
}

export const predefinedCategories: Category[] = [
  { id: 'landscape', name: 'נוף', description: 'נופים וטבע', icon: '🌄' },
  { id: 'portrait', name: 'דיוקן', description: 'דיוקנאות ודמויות', icon: '👤' },
  { id: 'abstract', name: 'אבסטרקט', description: 'אמנות מופשטת', icon: '🎨' },
  { id: 'digital', name: 'אמנות דיגיטלית', description: 'אמנות דיגיטלית', icon: '💻' },
  { id: 'nature', name: 'טבע', description: 'טבע וחיות', icon: '🌿' },
  { id: 'architecture', name: 'אדריכלות', description: 'מבנים ואדריכלות', icon: '🏛️' },
  { id: 'fantasy', name: 'פנטזיה', description: 'פנטזיה ודמיון', icon: '🦄' },
  { id: 'anime', name: 'אנימה', description: 'סגנון אנימה', icon: '👾' },
  { id: 'modern', name: 'מודרני', description: 'אמנות מודרנית', icon: '🎭' },
  { id: 'classical', name: 'קלאסי', description: 'אמנות קלאסית', icon: '🗿' },
  { id: 'general', name: 'כללי', description: 'קטגוריה כללית', icon: '📁' }
];