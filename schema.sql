CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  original_prompt TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
  artist_style TEXT,
  art_style TEXT,
  rating INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  prompt_copies INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  creator TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]',
  categories JSONB NOT NULL DEFAULT '[]'
);

CREATE INDEX IF NOT EXISTS idx_images_timestamp ON images (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_images_prompt_gin ON images USING gin (prompt gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_images_categories ON images USING gin (categories);
CREATE INDEX IF NOT EXISTS idx_images_tags ON images USING gin (tags);