import { createClient } from '@supabase/supabase-js';

// Cache configuration
const CACHE_CONFIG = {
  DEFAULT_TTL: 24 * 60 * 60 * 1000, // 24 hours
  SHORT_TTL: 5 * 60 * 1000,         // 5 minutes
  LONG_TTL: 7 * 24 * 60 * 60 * 1000, // 7 days
  MAX_CACHE_SIZE: 1000,              // Max cached items
};

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
  stale: boolean;
}

interface CacheOptions {
  ttl?: number;
  staleWhileRevalidate?: boolean;
  forceRefresh?: boolean;
  tags?: string[];
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();
  private accessOrder: string[] = [];

  set<T>(key: string, data: T, ttl: number = CACHE_CONFIG.DEFAULT_TTL): void {
    // Implement LRU eviction
    if (this.cache.size >= CACHE_CONFIG.MAX_CACHE_SIZE && !this.cache.has(key)) {
      const oldestKey = this.accessOrder.shift();
      if (oldestKey) {
        this.cache.delete(oldestKey);
      }
    }

    const item: CacheItem<T> = {
      data,
      timestamp: Date.now(),
      ttl,
      stale: false
    };

    this.cache.set(key, item);
    this.updateAccessOrder(key);
  }

  get<T>(key: string): CacheItem<T> | null {
    const item = this.cache.get(key);
    if (!item) return null;

    const now = Date.now();
    const isExpired = now - item.timestamp > item.ttl;

    if (isExpired) {
      // Mark as stale but don't delete yet (for SWR)
      item.stale = true;
    }

    this.updateAccessOrder(key);
    return item;
  }

  delete(key: string): boolean {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  invalidateByTag(tag: string): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((item, key) => {
      if (key.includes(`tag:${tag}`)) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.delete(key));
  }

  private updateAccessOrder(key: string): void {
    const index = this.accessOrder.indexOf(key);
    if (index > -1) {
      this.accessOrder.splice(index, 1);
    }
    this.accessOrder.push(key);
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let fresh = 0;
    let stale = 0;
    let expired = 0;

    this.cache.forEach(item => {
      const age = now - item.timestamp;
      if (age > item.ttl) {
        expired++;
      } else if (item.stale) {
        stale++;
      } else {
        fresh++;
      }
    });

    return {
      total: this.cache.size,
      fresh,
      stale,
      expired,
      hitRate: 0 // Would need to track hits/misses
    };
  }
}

// Global cache instance
const memoryCache = new MemoryCache();

/**
 * Enhanced cache utility with SWR support
 */
export class CacheManager {
  private supabase;

  constructor(supabaseUrl?: string, supabaseKey?: string) {
    // Initialize Supabase for persistent cache if needed
    if (supabaseUrl && supabaseKey) {
      this.supabase = createClient(supabaseUrl, supabaseKey);
    }
  }

  /**
   * Fetch with cache - implements stale-while-revalidate pattern
   */
  async fetchWithCache<T>(
    key: string,
    fetchFn: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const {
      ttl = CACHE_CONFIG.DEFAULT_TTL,
      staleWhileRevalidate = true,
      forceRefresh = false,
      tags = []
    } = options;

    // Generate cache key with tags
    const cacheKey = tags.length > 0 
      ? `${key}:${tags.map(t => `tag:${t}`).join(':')}`
      : key;

    // Check memory cache first
    if (!forceRefresh) {
      const cached = memoryCache.get<T>(cacheKey);
      
      if (cached) {
        if (!cached.stale) {
          // Fresh data - return immediately
          return cached.data;
        }
        
        if (staleWhileRevalidate) {
          // Return stale data immediately, revalidate in background
          this.revalidateInBackground(cacheKey, fetchFn, ttl, tags);
          return cached.data;
        }
      }
    }

    // Fetch fresh data
    try {
      const freshData = await fetchFn();
      memoryCache.set(cacheKey, freshData, ttl);
      
      // Store in persistent cache if available
      if (this.supabase && ttl > CACHE_CONFIG.SHORT_TTL) {
        await this.storePersistentCache(cacheKey, freshData, ttl);
      }
      
      return freshData;
      
    } catch (error) {
      // If fetch fails, return stale data if available
      const cached = memoryCache.get<T>(cacheKey);
      if (cached && staleWhileRevalidate) {
        console.warn('Fetch failed, returning stale data:', error);
        return cached.data;
      }
      
      throw error;
    }
  }

  /**
   * Revalidate data in background (non-blocking)
   */
  private async revalidateInBackground<T>(
    cacheKey: string,
    fetchFn: () => Promise<T>,
    ttl: number,
    tags: string[]
  ): Promise<void> {
    try {
      const freshData = await fetchFn();
      memoryCache.set(cacheKey, freshData, ttl);
      
      if (this.supabase && ttl > CACHE_CONFIG.SHORT_TTL) {
        await this.storePersistentCache(cacheKey, freshData, ttl);
      }
      
    } catch (error) {
      console.error('Background revalidation failed:', error);
      // Don't throw - background revalidation should be silent
    }
  }

  /**
   * Store in Supabase SEO cache table for persistence
   */
  private async storePersistentCache<T>(
    key: string,
    data: T,
    ttl: number
  ): Promise<void> {
    if (!this.supabase) return;

    try {
      const expiresAt = new Date(Date.now() + ttl);
      
      await this.supabase
        .from('seo_pages_cache')
        .upsert({
          page_type: 'api_cache',
          page_slug: key,
          intro_content: JSON.stringify(data),
          expires_at: expiresAt.toISOString(),
          last_generated_at: new Date().toISOString(),
          is_active: true
        }, { onConflict: 'page_type,page_slug' });
        
    } catch (error) {
      console.error('Failed to store persistent cache:', error);
      // Don't throw - caching failure shouldn't break the app
    }
  }

  /**
   * Get data from cache without fetching
   */
  getCached<T>(key: string): T | null {
    const cached = memoryCache.get<T>(key);
    return cached && !cached.stale ? cached.data : null;
  }

  /**
   * Manually invalidate cache entries
   */
  invalidate(key: string): boolean {
    return memoryCache.delete(key);
  }

  /**
   * Invalidate by tag
   */
  invalidateByTag(tag: string): void {
    memoryCache.invalidateByTag(tag);
    
    // Also invalidate persistent cache
    if (this.supabase) {
      this.supabase
        .from('seo_pages_cache')
        .delete()
        .like('page_slug', `%tag:${tag}%`)
        .then(() => console.log(`Invalidated persistent cache for tag: ${tag}`))
        .catch(error => console.error('Failed to invalidate persistent cache:', error));
    }
  }

  /**
   * Clear all cache
   */
  clear(): void {
    memoryCache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return memoryCache.getStats();
  }

  /**
   * Preload cache with data
   */
  async preload<T>(
    key: string,
    data: T,
    ttl: number = CACHE_CONFIG.DEFAULT_TTL,
    tags: string[] = []
  ): Promise<void> {
    const cacheKey = tags.length > 0 
      ? `${key}:${tags.map(t => `tag:${t}`).join(':')}`
      : key;
      
    memoryCache.set(cacheKey, data, ttl);
    
    if (this.supabase && ttl > CACHE_CONFIG.SHORT_TTL) {
      await this.storePersistentCache(cacheKey, data, ttl);
    }
  }
}

// Export singleton instance
let cacheManager: CacheManager | null = null;

export function getCacheManager(): CacheManager {
  if (!cacheManager) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    cacheManager = new CacheManager(supabaseUrl, supabaseKey);
  }
  return cacheManager;
}

// Convenience functions for common operations

/**
 * Cached broker data fetching
 */
export async function getCachedBrokers(
  categorySlug?: string,
  countrySlug?: string
): Promise<any[]> {
  const cache = getCacheManager();
  const key = `brokers:${categorySlug || 'all'}:${countrySlug || 'all'}`;
  
  return cache.fetchWithCache(
    key,
    async () => {
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );
      
      let query = supabase.from('brokers').select('*').eq('is_active', true);
      
      if (categorySlug) {
        // Add category filtering logic
        query = query.eq('broker_type', categorySlug); // Simplified
      }
      
      const { data, error } = await query.limit(30);
      
      if (error) throw error;
      return data || [];
    },
    {
      ttl: CACHE_CONFIG.DEFAULT_TTL,
      tags: ['brokers', categorySlug, countrySlug].filter(Boolean)
    }
  );
}

/**
 * Cached categories fetching
 */
export async function getCachedCategories(
  categoryType?: string
): Promise<any[]> {
  const cache = getCacheManager();
  const key = `categories:${categoryType || 'all'}`;
  
  return cache.fetchWithCache(
    key,
    async () => {
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );
      
      let query = supabase
        .from('broker_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (categoryType) {
        query = query.eq('category_type', categoryType);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
    {
      ttl: CACHE_CONFIG.LONG_TTL, // Categories change less frequently
      tags: ['categories', categoryType].filter(Boolean)
    }
  );
}

/**
 * Cached countries fetching
 */
export async function getCachedCountries(): Promise<any[]> {
  const cache = getCacheManager();
  
  return cache.fetchWithCache(
    'countries:all',
    async () => {
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );
      
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data || [];
    },
    {
      ttl: CACHE_CONFIG.LONG_TTL,
      tags: ['countries']
    }
  );
}

// Export constants for external use
export const CACHE_TTL = CACHE_CONFIG;