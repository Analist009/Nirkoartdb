import { uploadImageToBlob } from './blob';
import { toast } from 'sonner';
import type { GeneratedImage } from '../types/image';
import { addWatermark } from './watermark';

export async function uploadImage(imageUrl: string, metadata: GeneratedImage): Promise<string> {
  try {
    // Add watermark
    const watermarkedUrl = await addWatermark(imageUrl);
    
    // Convert data URL to blob
    const response = await fetch(watermarkedUrl);
    const blob = await response.blob();

    // Upload to Vercel Blob
    const url = await uploadImageToBlob(metadata, blob);
    
    toast.success('התמונה נשמרה בהצלחה');
    return url;
  } catch (error) {
    console.error('Failed to upload image:', error);
    toast.error('שגיאה בשמירת התמונה');
    return imageUrl;
  }
}

export async function storeImageMetadata(image: GeneratedImage): Promise<void> {
  try {
    const stored = JSON.parse(localStorage.getItem('stored-images') || '[]');
    stored.unshift(image);
    localStorage.setItem('stored-images', JSON.stringify(stored.slice(0, 50)));
  } catch (error) {
    console.error('Failed to store image metadata:', error);
    toast.error('שגיאה בשמירת מידע התמונה');
  }
}