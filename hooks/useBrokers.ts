/**
 * React Hooks for Broker Data
 * Provides database-driven broker data with caching and error handling
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { unifiedBrokerService } from '../services/unifiedBrokerService';
import type { Broker } from '../types';


interface BrokerHookState {
  brokers: Broker[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

interface BrokerDetailsState {
  broker: Broker | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}


/**
 * Hook to get all brokers with database-first approach and file fallback
 */
export const useBrokers = (): BrokerHookState => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrokers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const brokerData = await unifiedBrokerService.getBrokers();
      setBrokers(brokerData);
      console.log(`✅ Loaded ${brokerData.length} brokers via unified service`);

    } catch (err) {
      console.error('💥 Error fetching brokers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch brokers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrokers();
  }, [fetchBrokers]);

  return { brokers, loading, error, refetch: fetchBrokers };
};

/**
 * Hook to get a single broker by slug/id
 */
export const useBroker = (slug: string): BrokerDetailsState => {
  const [broker, setBroker] = useState<Broker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBroker = useCallback(async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);

      const brokerData = await unifiedBrokerService.getBrokerById(slug);
      setBroker(brokerData);

    } catch (err) {
      console.error(`Error fetching broker ${slug}:`, err);
      setError(err instanceof Error ? err.message : 'Failed to fetch broker');
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    fetchBroker();
  }, [fetchBroker]);

  return { broker, loading, error, refetch: fetchBroker };
};

/**
 * Hook to get featured brokers
 */
export const useFeaturedBrokers = (): BrokerHookState => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFeaturedBrokers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const featuredBrokers = await unifiedBrokerService.getFeaturedBrokers(5);
      setBrokers(featuredBrokers);

    } catch (err) {
      console.error('Error fetching featured brokers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch featured brokers');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeaturedBrokers();
  }, [fetchFeaturedBrokers]);

  return { brokers, loading, error, refetch: fetchFeaturedBrokers };
};

/**
 * Hook to search brokers
 */
export const useSearchBrokers = (query: string): BrokerHookState => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchBrokers = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setBrokers([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const results = await unifiedBrokerService.searchBrokers(searchQuery);
      setBrokers(results);

    } catch (err) {
      console.error('Error searching brokers:', err);
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchBrokers(query);
    }, 300); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [query, searchBrokers]);

  return { brokers, loading, error, refetch: () => searchBrokers(query) };
};

/**
 * Hook to get broker statistics
 */
export const useBrokerStats = () => {
  const [stats, setStats] = useState({
    totalBrokers: 0,
    featuredBrokers: 0,
    averageRating: 0,
    topRatedBroker: 'Loading...'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        const allBrokers = await unifiedBrokerService.getBrokers();
        const totalBrokers = allBrokers.length;
        const averageRating = allBrokers.reduce((sum, b) => sum + (b.score || 0), 0) / totalBrokers;
        const topRated = allBrokers.reduce((top, current) => 
          (current.score || 0) > (top.score || 0) ? current : top
        );

        setStats({
          totalBrokers,
          featuredBrokers: Math.floor(totalBrokers * 0.3), // Assume 30% are featured
          averageRating: Math.round(averageRating * 100) / 100,
          topRatedBroker: topRated.name
        });

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, loading, error };
};

/**
 * Hook for broker comparison functionality
 */
export const useCompareBrokers = (brokerIds: string[]) => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompareBrokers = useCallback(async () => {
    if (brokerIds.length === 0) {
      setBrokers([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Get brokers for comparison using unified service
      const allBrokers = await unifiedBrokerService.getBrokers();
      const compareBrokers = brokerIds
        .map(id => allBrokers.find(b => b.id === id))
        .filter(Boolean) as Broker[];

      setBrokers(compareBrokers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Comparison failed');
    } finally {
      setLoading(false);
    }
  }, [brokerIds]);

  useEffect(() => {
    fetchCompareBrokers();
  }, [fetchCompareBrokers]);

  return { brokers, loading, error, refetch: fetchCompareBrokers };
};

export default useBrokers;