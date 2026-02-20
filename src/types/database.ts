export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          username: string;
          avatar: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          avatar?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          avatar?: string | null;
          updated_at?: string;
        };
      };
      scores: {
        Row: {
          id: string;
          user_id: string;
          game_slug: string;
          score: number;
          difficulty: string | null;
          moves: number | null;
          duration: number | null;
          won: boolean;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          game_slug: string;
          score: number;
          difficulty?: string | null;
          moves?: number | null;
          duration?: number | null;
          won?: boolean;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: {
          score?: number;
          difficulty?: string | null;
          moves?: number | null;
          duration?: number | null;
          won?: boolean;
          metadata?: Json | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
