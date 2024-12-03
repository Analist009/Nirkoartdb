import Database from 'better-sqlite3';
import { toast } from 'sonner';
import type { GeneratedImage } from '../types/image';

const db = new Database('nirkoart.db');

// Initialize database tables
db.exec(`
  CREATE TABLE IF NOT EXISTS images (
    id TEXT PRIMARY KEY,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    prompt TEXT NOT NULL,
    original_prompt TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    artist_style TEXT,
    art_style TEXT,
    rating INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    prompt_copies INTEGER DEFAULT 0,
    shares INTEGER DEFAULT 0,
    creator TEXT NOT NULL,
    tags JSON NOT NULL,
    categories JSON NOT NULL
  );

  CREATE INDEX IF NOT EXISTS idx_images_timestamp ON images(timestamp DESC);
`);

export async function saveImage(image: GeneratedImage): Promise<void> {
  try {
    const stmt = db.prepare(`
      INSERT INTO images (
        id, url, title, prompt, original_prompt, timestamp,
        artist_style, art_style, rating, views, prompt_copies, shares,
        creator, tags, categories
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);

    stmt.run(
      image.id,
      image.url,
      image.title,
      image.prompt,
      image.originalPrompt,
      image.timestamp.toISOString(),
      image.artistStyle,
      image.artStyle,
      image.rating,
      image.views,
      image.promptCopies,
      image.shares,
      image.creator,
      JSON.stringify(image.tags),
      JSON.stringify(image.categories)
    );

    toast.success('התמונה נשמרה בהצלחה');
  } catch (error) {
    console.error('Failed to save image:', error);
    toast.error('שגיאה בשמירת התמונה');
    throw error;
  }
}

export async function getImages(category?: string): Promise<GeneratedImage[]> {
  try {
    const stmt = category && category !== 'all'
      ? db.prepare('SELECT * FROM images WHERE json_extract(categories, "$") LIKE ? ORDER BY timestamp DESC LIMIT 50')
      : db.prepare('SELECT * FROM images ORDER BY timestamp DESC LIMIT 50');

    const rows = category && category !== 'all'
      ? stmt.all(`%${category}%`)
      : stmt.all();
    
    return rows.map(row => ({
      ...row,
      timestamp: new Date(row.timestamp),
      tags: JSON.parse(row.tags),
      categories: JSON.parse(row.categories)
    }));
  } catch (error) {
    console.error('Failed to get images:', error);
    toast.error('שגיאה בטעינת התמונות');
    return [];
  }
}

export async function searchImages(query: string): Promise<GeneratedImage[]> {
  try {
    const stmt = db.prepare(`
      SELECT * FROM images 
      WHERE prompt LIKE ? OR title LIKE ?
      ORDER BY timestamp DESC 
      LIMIT 20
    `);

    const searchPattern = `%${query}%`;
    const rows = stmt.all(searchPattern, searchPattern);

    return rows.map(row => ({
      ...row,
      timestamp: new Date(row.timestamp),
      tags: JSON.parse(row.tags),
      categories: JSON.parse(row.categories)
    }));
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
    const updates = [];
    const values = [];
    
    if (stats.views !== undefined) {
      updates.push('views = views + 1');
    }
    if (stats.promptCopies !== undefined) {
      updates.push('prompt_copies = prompt_copies + 1');
    }
    if (stats.shares !== undefined) {
      updates.push('shares = shares + 1');
    }
    if (stats.rating !== undefined) {
      updates.push('rating = ?');
      values.push(stats.rating);
    }

    if (updates.length > 0) {
      const stmt = db.prepare(`
        UPDATE images 
        SET ${updates.join(', ')}
        WHERE id = ?
      `);

      stmt.run(...values, id);
    }
  } catch (error) {
    console.error('Failed to update image stats:', error);
    toast.error('שגיאה בעדכון נתוני התמונה');
    throw error;
  }
}

export function checkDatabaseConnection(): boolean {
  try {
    db.prepare('SELECT 1').get();
    return true;
  } catch {
    return false;
  }
}