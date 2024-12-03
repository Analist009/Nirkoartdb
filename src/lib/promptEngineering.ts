import { OpenAI } from 'openai';
import { useSession } from './session';
import { toast } from 'sonner';

const QUALITY_MODIFIERS = [
  'high quality',
  'detailed',
  'professional',
  'artistic',
  'masterpiece',
  'high resolution',
  'sharp focus',
  'studio lighting'
] as const;

export function generatePrompt(
  text: string,
  artistStyle: string | null,
  artStyle: string | null
): string {
  if (!text || typeof text !== 'string') {
    throw new Error('פרומפט לא תקין');
  }

  let prompt = `Create a professional artistic image: ${text.trim()}.`;
  
  // Add style prompts
  if (artistStyle) {
    prompt += ` ${artistStyle}.`;
  }
  
  if (artStyle) {
    prompt += ` ${artStyle}.`;
  }

  prompt += ` Ensure the image has ${QUALITY_MODIFIERS.join(', ')}.`;

  return sanitizePrompt(prompt);
}

export function sanitizePrompt(prompt: string): string {
  if (!prompt || typeof prompt !== 'string') {
    throw new Error('פרומפט לא תקין');
  }

  return prompt
    .replace(/[\n\r]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function enhancePrompt(prompt: string): Promise<string> {
  const session = useSession.getState();
  
  if (!session.isValid()) {
    return prompt;
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
        content: `You are an expert at enhancing image generation prompts. 
          Take the given prompt and enhance it with additional artistic details 
          while maintaining the original intent. Keep the enhanced prompt concise 
          and focused.`
      }, {
        role: "user",
        content: `Enhance this image generation prompt: "${prompt}"`
      }],
      temperature: 0.7,
      max_tokens: 200
    });

    const enhancedPrompt = response.choices[0].message.content;
    if (!enhancedPrompt) {
      return prompt;
    }

    return sanitizePrompt(enhancedPrompt);
  } catch (error) {
    console.error('Failed to enhance prompt:', error);
    return prompt;
  }
}