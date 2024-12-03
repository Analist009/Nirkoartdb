import { openDB, type IDBPDatabase } from 'idb';
import { toast } from 'sonner';
import type { GeneratedImage } from '../../types/image';
import { DB_CONFIG, STORE_NAMES, type Schema } from './schema';
import { performanceMonitor } from '../utils/performance';

let db: IDBPDatabase<Schema> | null = null;

async function getDB() {
  if (db) return db;

  try {
    performanceMonitor.start('dbConnection');
    
    db = await openDB<Schema>(DB_CONFIG.name, DB_CONFIG.version, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORE_NAMES.IMAGES)) {
          const store = db.createObjectStore(STORE_NAMES.IMAGES, { keyPath: 'id' });
          store.createIndex('userId', 'userId');
          store.createIndex('timestamp', 'timestamp');
          store.createIndex('categories', 'categories', { multiEntry: true });
        }
      },
    });

    const duration = performanceMonitor.end('dbConnection');
    console.debug(`Database connection established in ${duration}ms`);
    
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
    toast.error('שגיאה בהתחברות למסד הנתונים');
    throw error;
  }
}

export async function saveImage(image: GeneratedImage): Promise<void> {
  try {
    const db = await getDB();
    await db.put(STORE_NAMES.IMAGES, {
      ...image,
      timestamp: image.timestamp.toISOString()
    });
    toast.success('התמונה נשמרה בהצלחה');
  } catch (error) {
    console.error('Failed to save image:', error);
    toast.error('שגיאה בשמירת התמונה');
    throw error;
  }
}

export async function getImages(userId?: string): Promise<GeneratedImage[]> {
  try {
    const db = await getDB();
    let images: GeneratedImage[];

    if (userId) {
      const index = db.transaction(STORE_NAMES.IMAGES).store.index('userId');
      images = await index.getAll(userId);
    } else {
      images = await db.getAll(STORE_NAMES.IMAGES);
    }

    return images
      .map(img => ({
        ...img,
        timestamp: new Date(img.timestamp)
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 50);
  } catch (error) {
    console.error('Failed to get images:', error);
    toast.error('שגיאה בטעינת התמונות');
    return [];
  }
}

export async function searchImages(query: string): Promise<GeneratedImage[]> {
  try {
    const db = await getDB();
    const allImages = await db.getAll(STORE_NAMES.IMAGES);
    const searchPattern = query.toLowerCase();

    return allImages
      .filter(img => 
        img.prompt.toLowerCase().includes(searchPattern) ||
        img.title.toLowerCase().includes(searchPattern)
      )
      .map(img => ({
        ...img,
        timestamp: new Date(img.timestamp)
      }))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 20);
  } catch (error) {
    console.error('Failed to search images:', error);
    toast.error('שגיאה בחיפוש תמונות');
    return [];
  }
}

export async function updateImageStats(
  id: string,
  stats: { views?: number; promptCopies?: number; shares?: number; rating?: number }
): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(STORE_NAMES.IMAGES, 'readwrite');
    const store = tx.objectStore(STORE_NAMES.IMAGES);
    
    const image = await store.get(id);
    if (!image) return;

    const updates = {
      ...image,
      views: stats.views !== undefined ? (image.views || 0) + 1 : image.views,
      promptCopies: stats.promptCopies !== undefined ? (image.promptCopies || 0) + 1 : image.promptCopies,
      shares: stats.shares !== undefined ? (image.shares || 0) + 1 : image.shares,
      rating: stats.rating !== undefined ? stats.rating : image.rating
    };

    await store.put(updates);
    await tx.done;
  } catch (error) {
    console.error('Failed to update image stats:', error);
    toast.error('שגיאה בעדכון נתוני התמונה');
    throw error;
  }
}

export function checkDatabaseConnection(): boolean {
  return !!db;
}

// Initialize database connection
getDB().catch(error => {
  console.error('Failed to initialize database:', error);
  toast.error('שגיאה בהתחברות למסד הנתונים');
});