import { capitalize } from './utils';

export function generateImageTitle(prompt: string): string {
  // Remove common words and clean up the prompt
  const commonWords = new Set(['את', 'של', 'עם', 'על', 'צייר', 'צור', 'תמונה', 'the', 'a', 'an', 'in', 'of', 'with']);
  
  // Extract key words from the prompt
  const words = prompt
    .split(' ')
    .filter(word => word.length > 2 && !commonWords.has(word.toLowerCase()))
    .slice(0, 3); // Take up to 3 significant words
  
  if (words.length === 0) {
    return 'יצירה חדשה';
  }

  // Create a descriptive title
  const title = words.map(capitalize).join(' ');
  return title;
}