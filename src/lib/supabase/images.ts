import { supabase } from './client';
import { toast } from 'sonner';
import type { GeneratedImage } from '../../types/image';

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
        categories: image.categories,
        user_id: image.userId
      }]);

    if (error) throw error;
    toast.success('התמונה נשמרה בהצלחה');
  } catch (error) {
    console.error('Error saving image to Supabase:', error);
    toast.error('שגיאה בשמירת התמונה');
    throw error;
  }
}

export async function getImagesFromSupabase(userId?: string): Promise<GeneratedImage[]> {
  try {
    let query = supabase
      .from('images')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);

    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query;
    if (error) throw error;

    return data.map(row => ({
      ...row,
      timestamp: new Date(row.timestamp),
      userId: row.user_id,
      originalPrompt: row.original_prompt,
      artistStyle: row.artist_style,
      artStyle: row.art_style,
      promptCopies: row.prompt_copies
    }));
  } catch (error) {
    console.error('Error fetching images from Supabase:', error);
    toast.error('שגיאה בטעינת התמונות');
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
      userId: row.user_id,
      originalPrompt: row.original_prompt,
      artistStyle: row.artist_style,
      artStyle: row.art_style,
      promptCopies: row.prompt_copies
    }));
  } catch (error) {
    console.error('Error searching images in Supabase:', error);
    toast.error('שגיאה בחיפוש תמונות');
    return [];
  }
}

export async function updateImageStatsInSupabase(
  id: string,
  stats: { views?: number; promptCopies?: number; shares?: number; rating?: number }
): Promise<void> {
  try {
    const updates: Record<string, any> = {};
    
    if (stats.views !== undefined) updates.views = supabase.rpc('increment', { row_id: id, column_name: 'views' });
    if (stats.promptCopies !== undefined) updates.prompt_copies = supabase.rpc('increment', { row_id: id, column_name: 'prompt_copies' });
    if (stats.shares !== undefined) updates.shares = supabase.rpc('increment', { row_id: id, column_name: 'shares' });
    if (stats.rating !== undefined) updates.rating = stats.rating;

    const { error } = await supabase
      .from('images')
      .update(updates)
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error updating image stats in Supabase:', error);
    toast.error('שגיאה בעדכון נתוני התמונה');
    throw error;
  }
}