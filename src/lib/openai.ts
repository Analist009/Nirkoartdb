import OpenAI from 'openai';
import { ImageResponseSchema } from './validation';
import { OpenAIError } from './errors';
import { useSession } from './session';

const OPENAI_CONFIG = {
  model: "dall-e-3",
  size: "1024x1024",
  quality: "standard",
  response_format: "url",
} as const;

export async function generateImageWithOpenAI(prompt: string): Promise<ImageResponseSchema> {
  const session = useSession.getState();
  
  if (!session.isValid()) {
    throw new OpenAIError('Invalid or missing API key', 'invalid_api_key', 401);
  }

  try {
    const openai = new OpenAI({
      apiKey: session.apiKey!,
      dangerouslyAllowBrowser: true
    });

    const response = await openai.images.generate({
      ...OPENAI_CONFIG,
      prompt,
      n: 1,
    });

    if (!response.data?.[0]?.url) {
      throw new OpenAIError('Invalid response from OpenAI');
    }

    const result = ImageResponseSchema.safeParse({
      url: response.data[0].url,
      revisedPrompt: response.data[0].revised_prompt,
    });

    if (!result.success) {
      throw new OpenAIError('Invalid response format from OpenAI');
    }

    return result.data;
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      if (error.status === 401) {
        session.clearApiKey();
        throw new OpenAIError('Invalid API key', 'invalid_api_key', 401);
      }
      if (error.status === 429) {
        throw new OpenAIError('Rate limit exceeded', 'rate_limit_exceeded', 429);
      }
      throw new OpenAIError(error.message, error.code, error.status);
    }
    throw error;
  }
}