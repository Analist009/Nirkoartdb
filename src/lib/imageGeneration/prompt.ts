import { OpenAI } from 'openai';
import { useSession } from '../session';
import { QUALITY_MODIFIERS } from './config';
import { sanitizeText } from '../utils/string';

export function generatePrompt(
  text: string,
  artistStyle: string | null,
  artStyle: string | null
): string {
  if (!text?.trim()) {
    throw new Error('פרומפט לא יכול להיות ריק');
  }

  let prompt = `Create a professional artistic image: ${text.trim()}.`;
  
  if (artistStyle) {
    prompt += ` ${artistStyle}.`;
  }
  
  if (artStyle) {
    prompt += ` ${artStyle}.`;
  }

  prompt += ` Ensure the image has ${QUALITY_MODIFIERS.join(', ')}.`;

  return sanitizeText(prompt);
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

    return sanitizeText(enhancedPrompt);
  } catch (error) {
    console.error('Failed to enhance prompt:', error);
    return prompt;
  }
}