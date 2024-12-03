-- Create images table
CREATE TABLE IF NOT EXISTS images (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  prompt TEXT NOT NULL,
  original_prompt TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  artist_style TEXT,
  art_style TEXT,
  rating INTEGER DEFAULT 0,
  views INTEGER DEFAULT 0,
  prompt_copies INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  creator TEXT NOT NULL,
  tags JSONB NOT NULL DEFAULT '[]',
  categories JSONB NOT NULL DEFAULT '[]',
  user_id TEXT NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_images_timestamp ON images(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_images_user_id ON images(user_id);
CREATE INDEX IF NOT EXISTS idx_images_prompt_gin ON images USING gin(prompt gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_images_categories ON images USING gin(categories);
CREATE INDEX IF NOT EXISTS idx_images_tags ON images USING gin(tags);

-- Create increment function
CREATE OR REPLACE FUNCTION increment(row_id TEXT, column_name TEXT)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  new_value INTEGER;
BEGIN
  EXECUTE format('
    UPDATE images 
    SET %I = COALESCE(%I, 0) + 1 
    WHERE id = $1
    RETURNING %I', 
    column_name, column_name, column_name)
  INTO new_value
  USING row_id;
  
  RETURN new_value;
END;
$$;

-- Enable row level security
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public images are viewable by everyone"
  ON images FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own images"
  ON images FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own images"
  ON images FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images"
  ON images FOR DELETE
  USING (auth.uid() = user_id);