import { OpenAI } from 'openai';
import { useSession } from './session';
import { toast } from 'sonner';
import { z } from 'zod';

const PromptAnalysisSchema = z.object({
  summary: z.string(),
  tags: z.array(z.string()),
  enhancedPrompt: z.string(),
  categories: z.array(z.string())
});

interface PromptAnalysis {
  summary: string;
  tags: string[];
  enhancedPrompt: string;
  categories: string[];
}

const DEFAULT_ANALYSIS: PromptAnalysis = {
  summary: 'יצירה חדשה',
  tags: ['אמנות', 'יצירה', 'דיגיטלי', 'AI'],
  enhancedPrompt: '',
  categories: ['general']
};

const SYSTEM_PROMPT = `You are a helpful assistant that analyzes image generation prompts and provides:
1. A concise 10-word summary in Hebrew
2. 4 relevant tags in Hebrew
3. An enhanced version of the prompt with additional artistic details
4. Up to 3 categories from: landscape, portrait, abstract, digital, nature, architecture, fantasy, anime, modern, classical

Format your response exactly as follows:
Summary: [summary]
Tags: [tag1], [tag2], [tag3], [tag4]
Enhanced: [enhanced prompt]
Categories: [category1], [category2], [category3]`;

export async function analyzePrompt(originalPrompt: string): Promise<PromptAnalysis> {
  if (!originalPrompt?.trim()) {
    return { ...DEFAULT_ANALYSIS, enhancedPrompt: originalPrompt || '' };
  }

  const session = useSession.getState();
  if (!session.isValid()) {
    return { ...DEFAULT_ANALYSIS, enhancedPrompt: originalPrompt };
  }

  try {
    const openai = new OpenAI({
      apiKey: session.apiKey!,
      dangerouslyAllowBrowser: true
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analyze this image generation prompt: "${originalPrompt}"` }
      ],
      temperature: 0.7,
      max_tokens: 300,
      presence_penalty: 0.3,
      frequency_penalty: 0.3
    });

    const analysis = response.choices[0].message.content;
    if (!analysis) {
      console.error('Empty response from OpenAI');
      return { ...DEFAULT_ANALYSIS, enhancedPrompt: originalPrompt };
    }

    // Parse the response
    const lines = analysis.split('\n').filter(Boolean);
    const parsedAnalysis = {
      summary: lines[0]?.replace('Summary: ', '').trim() || DEFAULT_ANALYSIS.summary,
      tags: lines[1]?.replace('Tags: ', '')
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean) || DEFAULT_ANALYSIS.tags,
      enhancedPrompt: lines[2]?.replace('Enhanced: ', '').trim() || originalPrompt,
      categories: lines[3]?.replace('Categories: ', '')
        .split(',')
        .map(c => c.trim().toLowerCase())
        .filter(Boolean) || DEFAULT_ANALYSIS.categories
    };

    // Validate the parsed response
    const validatedAnalysis = PromptAnalysisSchema.parse(parsedAnalysis);
    return validatedAnalysis;
  } catch (error) {
    console.error('Failed to analyze prompt:', error);
    
    // Provide more specific error messages
    if (error instanceof z.ZodError) {
      toast.error('תגובת הניתוח לא תקינה');
    } else if (error instanceof Error) {
      toast.error(`שגיאה בניתוח הפרומפט: ${error.message}`);
    } else {
      toast.error('שגיאה לא צפויה בניתוח הפרומפט');
    }

    // Return default analysis with original prompt
    return { ...DEFAULT_ANALYSIS, enhancedPrompt: originalPrompt };
  }
}