import { useState, useEffect } from 'react';
import { getSupabaseClient } from '../lib/supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

/**
 * React hook for accessing Supabase client
 * Handles async initialization and provides loading states
 */
export function useSupabase() {
  const [client, setClient] = useState<SupabaseClient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initializeClient = async () => {
      try {
        setLoading(true);
        setError(null);
        const supabaseClient = await getSupabaseClient();

        if (mounted) {
          setClient(supabaseClient);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize Supabase');
          setLoading(false);
        }
      }
    };

    initializeClient();

    return () => {
      mounted = false;
    };
  }, []);

  return { client, loading, error };
}

/**
 * Hook for executing Supabase queries with proper error handling
 */
export function useSupabaseQuery<T = any>(
  queryFn: (client: SupabaseClient) => Promise<T>,
  dependencies: any[] = []
) {
  const { client, loading: clientLoading, error: clientError } = useSupabase();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!client || clientLoading) return;

    let mounted = true;

    const executeQuery = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await queryFn(client);

        if (mounted) {
          setData(result);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Query failed');
          setLoading(false);
        }
      }
    };

    executeQuery();

    return () => {
      mounted = false;
    };
  }, [client, clientLoading, ...dependencies]);

  return { data, loading: loading || clientLoading, error: error || clientError };
}