export interface ArtistStyle {
  id: string;
  label: string;
  prompt: string;
}

export interface ArtStyle {
  id: string;
  label: string;
  prompt: string;
}

export interface StyleCombination {
  artistStyle: ArtistStyle | null;
  artStyle: ArtStyle | null;
}