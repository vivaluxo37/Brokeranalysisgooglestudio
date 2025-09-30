import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types for the Broker Analysis Application
export interface Database {
  public: {
    Tables: {
      brokers: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          website_url: string | null;
          logo_url: string | null;
          min_deposit: number | null;
          max_leverage: number | null;
          spreads_from: number | null;
          commission: number | null;
          regulation: string | null;
          platforms: string | null;
          account_types: string | null;
          customer_support: string | null;
          rating: number | null;
          founded_year: number | null;
          headquarters: string | null;
          countries_available: string[] | null;
          has_promotions: boolean | null;
          features: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          website_url?: string | null;
          logo_url?: string | null;
          min_deposit?: number | null;
          max_leverage?: number | null;
          spreads_from?: number | null;
          commission?: number | null;
          regulation?: string | null;
          platforms?: string | null;
          account_types?: string | null;
          customer_support?: string | null;
          rating?: number | null;
          founded_year?: number | null;
          headquarters?: string | null;
          countries_available?: string[] | null;
          has_promotions?: boolean | null;
          features?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['brokers']['Insert']>;
      };
      categories: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          slug: string;
          criteria: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          slug: string;
          criteria?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['categories']['Insert']>;
      };
      countries: {
        Row: {
          id: string;
          name: string;
          code: string;
          region: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          region?: string | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['countries']['Insert']>;
      };
      broker_country_verification: {
        Row: {
          id: string;
          broker_id: string;
          country_code: string;
          verification_status: 'pending' | 'verified' | 'rejected' | 'needs_review';
          last_checked: string | null;
          verification_details: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          broker_id: string;
          country_code: string;
          verification_status?: 'pending' | 'verified' | 'rejected' | 'needs_review';
          last_checked?: string | null;
          verification_details?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['broker_country_verification']['Insert']>;
      };
      ranking_weights: {
        Row: {
          id: string;
          factor: string;
          weight: number;
          description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          factor: string;
          weight: number;
          description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['ranking_weights']['Insert']>;
      };
      activity_logs: {
        Row: {
          id: string;
          activity_type: string;
          user_id: string | null;
          entity_type: string | null;
          entity_id: string | null;
          details: any | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          activity_type: string;
          user_id?: string | null;
          entity_type?: string | null;
          entity_id?: string | null;
          details?: any | null;
          created_at?: string;
        };
        Update: Partial<Database['public']['Tables']['activity_logs']['Insert']>;
      };
      reviews: {
        Row: {
          id: string;
          broker_id: string;
          user_id: string;
          rating: number;
          title: string;
          content: string;
          verified: boolean | null;
          helpful_count: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          broker_id: string;
          user_id: string;
          rating: number;
          title: string;
          content: string;
          verified?: boolean | null;
          helpful_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['reviews']['Insert']>;
      };
      users: {
        Row: {
          id: string;
          email: string;
          role: 'user' | 'admin' | 'moderator';
          profile: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role?: 'user' | 'admin' | 'moderator';
          profile?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database['public']['Tables']['users']['Insert']>;
      };
    };
  };
}

// Type helpers for better TypeScript support
export type Broker = Database['public']['Tables']['brokers']['Row'];
export type Category = Database['public']['Tables']['categories']['Row'];
export type Country = Database['public']['Tables']['countries']['Row'];
export type BrokerCountryVerification = Database['public']['Tables']['broker_country_verification']['Row'];
export type RankingWeight = Database['public']['Tables']['ranking_weights']['Row'];
export type ActivityLog = Database['public']['Tables']['activity_logs']['Row'];
export type Review = Database['public']['Tables']['reviews']['Row'];
export type User = Database['public']['Tables']['users']['Row'];

// Admin authentication helper functions
export const adminAuth = {
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getCurrentSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Check if current user is admin
  async isAdmin() {
    const { user } = await this.getCurrentUser();
    if (!user) return false;

    const { data, error } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error checking admin status:', error);
      return false;
    }

    return data?.role === 'admin';
  }
};

export default supabase;