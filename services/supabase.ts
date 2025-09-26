import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      brokers: {
        Row: {
          id: number;
          name: string;
          description: string;
          website: string;
          min_deposit: number;
          max_leverage: number;
          spreads: number;
          commission: number;
          regulation: string[];
          platforms: string[];
          customer_support: string;
          rating: number;
          features: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          name: string;
          description: string;
          website: string;
          min_deposit: number;
          max_leverage: number;
          spreads: number;
          commission: number;
          regulation: string[];
          platforms: string[];
          customer_support: string;
          rating: number;
          features: string[];
        };
        Update: Partial<Database['public']['Tables']['brokers']['Insert']>;
      };
      reviews: {
        Row: {
          id: number;
          broker_id: number;
          user_id: string;
          rating: number;
          title: string;
          content: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          broker_id: number;
          user_id: string;
          rating: number;
          title: string;
          content: string;
        };
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          email: string;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
      trading_journals: {
        Row: {
          id: number;
          user_id: string;
          broker_id: number;
          symbol: string;
          action: 'buy' | 'sell';
          entry_price: number;
          exit_price: number | null;
          position_size: number;
          profit_loss: number | null;
          notes: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          broker_id: number;
          symbol: string;
          action: 'buy' | 'sell';
          entry_price: number;
          position_size: number;
          notes?: string;
        };
        Update: Partial<Database['public']['Tables']['trading_journals']['Insert']>;
      };
      favorites: {
        Row: {
          id: number;
          user_id: string;
          broker_id: number;
          created_at: string;
        };
        Insert: {
          user_id: string;
          broker_id: number;
        };
        Update: Partial<Database['public']['Tables']['favorites']['Insert']>;
      };
    };
  };
}