import { ImageTag } from '../types/image';

export async function generateImageTags(prompt: string): Promise<ImageTag[]> {
  // Extract key concepts from the prompt
  const words = prompt.toLowerCase().split(' ');
  const tags = new Set<string>();
  
  // Remove common words and keep meaningful ones
  const commonWords = new Set(['את', 'של', 'עם', 'על', 'the', 'a', 'an', 'in', 'of', 'with']);
  
  words.forEach(word => {
    if (word.length > 2 && !commonWords.has(word)) {
      tags.add(word);
    }
  });
  
  // Take up to 4 most relevant tags
  return Array.from(tags)
    .slice(0, 4)
    .map(tag => ({
      id: tag.replace(/\s+/g, '-'),
      name: tag
    }));
}