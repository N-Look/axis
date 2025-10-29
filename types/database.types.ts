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
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          program: string
          year_of_study: string
          bio: string | null
          avatar_url: string | null
          phone_number: string | null
          rating: number | null
          total_reviews: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          program: string
          year_of_study: string
          bio?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          rating?: number | null
          total_reviews?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          program?: string
          year_of_study?: string
          bio?: string | null
          avatar_url?: string | null
          phone_number?: string | null
          rating?: number | null
          total_reviews?: number
          created_at?: string
          updated_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          seller_id: string
          title: string
          description: string
          price: number
          category: string
          condition: string
          images: string[]
          status: 'pending' | 'approved' | 'rejected' | 'sold'
          location: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          title: string
          description: string
          price: number
          category: string
          condition: string
          images: string[]
          status?: 'pending' | 'approved' | 'rejected' | 'sold'
          location: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          title?: string
          description?: string
          price?: number
          category?: string
          condition?: string
          images?: string[]
          status?: 'pending' | 'approved' | 'rejected' | 'sold'
          location?: string
          created_at?: string
          updated_at?: string
        }
      }
      saved_listings: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string
          created_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_id: string
          content: string
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_id: string
          content: string
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          sender_id?: string
          content?: string
          read?: boolean
          created_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          listing_id: string
          buyer_id: string
          seller_id: string
          last_message_at: string
          created_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          buyer_id: string
          seller_id: string
          last_message_at?: string
          created_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          buyer_id?: string
          seller_id?: string
          last_message_at?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          reviewer_id: string
          reviewed_user_id: string
          listing_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reviewer_id: string
          reviewed_user_id: string
          listing_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reviewer_id?: string
          reviewed_user_id?: string
          listing_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
