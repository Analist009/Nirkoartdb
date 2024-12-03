export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      images: {
        Row: {
          id: string
          url: string
          title: string
          prompt: string
          original_prompt: string
          timestamp: string
          artist_style: string | null
          art_style: string | null
          rating: number
          views: number
          prompt_copies: number
          shares: number
          creator: string
          tags: Json
          categories: Json
          user_id: string
        }
        Insert: {
          id: string
          url: string
          title: string
          prompt: string
          original_prompt: string
          timestamp?: string
          artist_style?: string | null
          art_style?: string | null
          rating?: number
          views?: number
          prompt_copies?: number
          shares?: number
          creator: string
          tags?: Json
          categories?: Json
          user_id: string
        }
        Update: {
          id?: string
          url?: string
          title?: string
          prompt?: string
          original_prompt?: string
          timestamp?: string
          artist_style?: string | null
          art_style?: string | null
          rating?: number
          views?: number
          prompt_copies?: number
          shares?: number
          creator?: string
          tags?: Json
          categories?: Json
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment: {
        Args: {
          row_id: string
          column_name: string
        }
        Returns: number
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}