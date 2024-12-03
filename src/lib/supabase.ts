import { createClient } from '@supabase/supabase-js';
import type { GeneratedImage } from '../types/image';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function saveImageToSupabase(image: GeneratedImage): Promise<void> {
  try {
    const { error } = await supabase
      .from('images')
      .insert([{
        id: image.id,
        url: image.url,
        title: image.title,
        prompt: image.prompt,
        original_prompt: image.originalPrompt,
        timestamp: image.timestamp.toISOString(),
        artist_style: image.artistStyle,
        art_style: image.artStyle,
        rating: image.rating,
        views: image.views,
        prompt_copies: image.promptCopies,
        shares: image.shares,
        creator: image.creator,
        tags: image.tags,
        categories: image.categories
      }]);

    if (error) throw error;
  } catch (error) {
    console.error('Error saving image to Supabase:', error);
    throw error;
  }
}

export async function getImagesFromSupabase(category?: string): Promise<GeneratedImage[]> {
  try {
    let query = supabase
      .from('images')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    if (category && category !== 'all') {
      query = query.contains('categories', [category]);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(row => ({
      ...row,
      timestamp: new Date(row.timestamp),
      tags: row.tags,
      categories: row.categories
    }));
  } catch (error) {
    console.error('Error fetching images from Supabase:', error);
    return [];
  }
}

export async function searchImagesInSupabase(query: string): Promise<GeneratedImage[]> {
  try {
    const { data, error } = await supabase
      .from('images')
      .select('*')
      .or(`prompt.ilike.%${query}%,title.ilike.%${query}%`)
      .order('timestamp', { ascending: false })
      .limit(20);

    if (error) throw error;

    return data.map(row => ({
      ...row,
      timestamp: new Date(row.timestamp),
      tags: row.tags,
      categories: row.categories
    }));
  } catch (error) {
    console.error('Error searching images in Supabase:', error);
    return [];
  }
}

export async function updateImageStatsInSupabase(
  id: string,
  stats: { views?: number; promptCopies?: number; shares?: number; rating?: number }
): Promise<void> {
  try {
    const updates: any = {};
    
    if (stats.views !== undefined) updates.views = stats.views;
    if (stats.promptCopies !== undefined) updates.prompt_copies = stats.promptCopies;
    if (stats.shares !== undefined) updates.shares = stats.shares;
    if (stats.rating !== undefined) updates.rating = stats.rating;

    const { error } = await supabase
      .from('images')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating image stats in Supabase:', error);
    throw error;
  }
}