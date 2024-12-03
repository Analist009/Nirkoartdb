export interface ImageTag {
  id: string;
  name: string;
}

export interface GeneratedImage {
  id: string;
  url: string;
  userId: string;
  artistStyle: string | null;
  artStyle: string | null;
  timestamp: Date;
  tags: ImageTag[];
  rating: number;
  prompt: string;
  originalPrompt: string;
  title: string;
  categories: string[];
  views: number;
  promptCopies: number;
  shares: number;
  creator: string;
}

export interface ImageFilter {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  highlights: number;
  shadows: number;
  temperature: number;
  tint: number;
  sharpness: number;
  blur: number;
  noise: number;
  vibrance: number;
}

export interface ImageStats {
  totalGenerated: number;
  totalViews: number;
  totalShares: number;
  averageRating: number;
  mostUsedStyles: string[];
  mostUsedCategories: string[];
}