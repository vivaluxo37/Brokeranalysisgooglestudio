import React, { createContext, useContext, useEffect, useState } from 'react';
import type { User, Session, AuthError, SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseClient } from '../lib/supabase';

interface AdminAuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  checkAdminStatus: () => Promise<boolean>;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

interface AdminAuthProviderProps {
  children: React.ReactNode;
}

export const AdminAuthProvider: React.FC<AdminAuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    let isMounted = true;
    const initializeClient = async () => {
      try {
        const client = await getSupabaseClient();
        if (isMounted) {
          setSupabaseClient(client);
        }
      } catch (error) {
        console.error('Error initializing Supabase client:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    initializeClient();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      if (!supabaseClient) {
        setIsLoading(false);
        return;
      }
      try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (error) {
          console.error('Error getting session:', error);
          return;
        }

        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          const adminStatus = await checkAdminStatus();
          setIsAdmin(adminStatus);
        }
      } catch (error) {
        console.error('Error in getSession:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user || null);

        if (session?.user) {
          const adminStatus = await checkAdminStatus();
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false);
        }

        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabaseClient]);

  const checkAdminStatus = async (): Promise<boolean> => {
    if (!user || !supabaseClient) return false;

    try {
      // Check if user has admin role in user metadata or a separate admin table
      const { data, error } = await supabaseClient
        .from('admin_users')
        .select('id, role')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single();

      if (error) {
        // If no admin_users table, check user metadata
        const isAdminFromMetadata = user.user_metadata?.role === 'admin' || 
                                   user.app_metadata?.role === 'admin';
        return isAdminFromMetadata || false;
      }

      return data && (data.role === 'admin' || data.role === 'super_admin');
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!supabaseClient) {
        return { error: { name: 'SupabaseClientError', message: 'Supabase client not initialized' } as AuthError };
      }
      const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

      return { error };
    } catch (error) {
      return { error: error as AuthError };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      await supabaseClient?.auth.signOut();
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AdminAuthContextType = {
    user,
    session,
    isAdmin,
    isLoading,
    signIn,
    signOut,
    checkAdminStatus,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};