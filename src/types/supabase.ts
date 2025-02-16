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
      comments: {
        Row: {
          id: string
          content: string
          created_at: string
          user_id: string
          post_slug: string
        }
        Insert: {
          id?: string
          content: string
          created_at?: string
          user_id: string
          post_slug: string
        }
        Update: {
          id?: string
          content?: string
          created_at?: string
          user_id?: string
          post_slug?: string
        }
      }
      posts: {
        Row: {
          id: string
          title: string
          content: string
          excerpt: string
          slug: string
          featured_image: string | null
          published_at: string | null
          created_at: string
          updated_at: string
          status: 'draft' | 'published'
          author_id: string
        }
        Insert: {
          id?: string
          title: string
          content: string
          excerpt?: string
          slug: string
          featured_image?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          status?: 'draft' | 'published'
          author_id: string
        }
        Update: {
          id?: string
          title?: string
          content?: string
          excerpt?: string
          slug?: string
          featured_image?: string | null
          published_at?: string | null
          created_at?: string
          updated_at?: string
          status?: 'draft' | 'published'
          author_id?: string
        }
      }
      profiles: {
        Row: {
          id: string
          username: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      comments_with_user: {
        Row: {
          id: string
          content: string
          created_at: string
          user_id: string
          post_slug: string
          username: string | null
          avatar_url: string | null
        }
      }
    }
    Functions: {}
    Enums: {}
  }
} 