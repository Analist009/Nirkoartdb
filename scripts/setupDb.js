import Database from 'better-sqlite3';

try {
  const db = new Database('nirkoart.db');

  // Create tables
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

  console.log('Database setup completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Failed to setup database:', error);
  process.exit(1);
}