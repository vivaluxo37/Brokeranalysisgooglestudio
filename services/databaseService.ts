import { supabase, Database } from './supabase';

// Broker services
export const brokerService = {
  async getAllBrokers() {
    const { data, error } = await supabase
      .from('brokers')
      .select('*')
      .order('rating', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getBrokerById(id: number) {
    const { data, error } = await supabase
      .from('brokers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async createBroker(broker: Database['public']['Tables']['brokers']['Insert']) {
    const { data, error } = await supabase
      .from('brokers')
      .insert([broker])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateBroker(id: number, updates: Database['public']['Tables']['brokers']['Update']) {
    const { data, error } = await supabase
      .from('brokers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteBroker(id: number) {
    const { error } = await supabase
      .from('brokers')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Review services
export const reviewService = {
  async getBrokerReviews(brokerId: number) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users (email)
      `)
      .eq('broker_id', brokerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createReview(review: Database['public']['Tables']['reviews']['Insert']) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([review])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateReview(id: number, updates: Database['public']['Tables']['reviews']['Update']) {
    const { data, error } = await supabase
      .from('reviews')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteReview(id: number) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// User services
export const userService = {
  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  },

  async createUserProfile(email: string) {
    const { data, error } = await supabase
      .from('users')
      .insert([{ email }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getUserProfile() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) throw error;
    return data;
  }
};

// Favorite services
export const favoriteService = {
  async getUserFavorites(userId: string) {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        brokers (*)
      `)
      .eq('user_id', userId);

    if (error) throw error;
    return data;
  },

  async addFavorite(userId: string, brokerId: number) {
    const { data, error } = await supabase
      .from('favorites')
      .insert([{ user_id: userId, broker_id: brokerId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async removeFavorite(userId: string, brokerId: number) {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('broker_id', brokerId);

    if (error) throw error;
  },

  async isFavorite(userId: string, brokerId: number) {
    const { data, error } = await supabase
      .from('favorites')
      .select('*')
      .eq('user_id', userId)
      .eq('broker_id', brokerId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  }
};

// Trading journal services
export const tradingJournalService = {
  async getUserTradingEntries(userId: string) {
    const { data, error } = await supabase
      .from('trading_journals')
      .select(`
        *,
        brokers (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createTradingEntry(entry: Database['public']['Tables']['trading_journals']['Insert']) {
    const { data, error } = await supabase
      .from('trading_journals')
      .insert([entry])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTradingEntry(id: number, updates: Database['public']['Tables']['trading_journals']['Update']) {
    const { data, error } = await supabase
      .from('trading_journals')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteTradingEntry(id: number) {
    const { error } = await supabase
      .from('trading_journals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};

// Auth services
export const authService = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },

  onAuthStateChange(callback: (event: string, session: any) => void) {
    return supabase.auth.onAuthStateChange(callback);
  }
};