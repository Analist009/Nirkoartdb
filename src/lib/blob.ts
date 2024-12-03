import { put, list, del } from '@vercel/blob';
import { toast } from 'sonner';
import type { GeneratedImage } from '../types/image';

interface UploadOptions {
  filename: string;
  data: Blob | File | ArrayBuffer | Buffer;
  access?: 'public' | 'private';
  addRandomSuffix?: boolean;
  token?: string;
}

export async function uploadToBlob({ 
  filename, 
  data, 
  access = 'public',
  addRandomSuffix = true,
  token = import.meta.env.VITE_VERCEL_BLOB_READ_WRITE_TOKEN 
}: UploadOptions) {
  try {
    if (!token) {
      throw new Error('Missing Vercel Blob token');
    }

    const blob = await put(filename, data, {
      access,
      addRandomSuffix,
      token
    });

    return blob.url;
  } catch (error) {
    console.error('Failed to upload to Vercel Blob:', error);
    toast.error('שגיאה בהעלאת הקובץ');
    throw error;
  }
}

export async function listBlobFiles() {
  try {
    const token = import.meta.env.VITE_VERCEL_BLOB_READ_WRITE_TOKEN;
    if (!token) {
      throw new Error('Missing Vercel Blob token');
    }

    const { blobs } = await list({ token });
    return blobs;
  } catch (error) {
    console.error('Failed to list Blob files:', error);
    toast.error('שגיאה בטעינת רשימת הקבצים');
    return [];
  }
}

export async function deleteFromBlob(url: string) {
  try {
    const token = import.meta.env.VITE_VERCEL_BLOB_READ_WRITE_TOKEN;
    if (!token) {
      throw new Error('Missing Vercel Blob token');
    }

    await del(url, { token });
    toast.success('הקובץ נמחק בהצלחה');
  } catch (error) {
    console.error('Failed to delete from Blob:', error);
    toast.error('שגיאה במחיקת הקובץ');
    throw error;
  }
}

export async function uploadImageToBlob(image: GeneratedImage, imageData: Blob) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `images/${timestamp}-${image.id}.jpg`;

    const url = await uploadToBlob({
      filename,
      data: imageData,
      access: 'public',
      addRandomSuffix: true
    });

    return url;
  } catch (error) {
    console.error('Failed to upload image to Blob:', error);
    toast.error('שגיאה בהעלאת התמונה');
    throw error;
  }
}