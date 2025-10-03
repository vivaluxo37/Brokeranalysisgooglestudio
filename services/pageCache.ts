/**
 * Dynamic Page Caching Service
 * Provides in-memory and persistent caching for programmatic pages
 */

interface CacheEntry<T = any> {
  data: T;
  timestamp: number;
  expiresAt: number;
  key: string;
  tags?: string[];
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  tags?: string[]; // Cache tags for invalidation
  persistent?: boolean; // Whether to persist to localStorage/sessionStorage
}

class PageCacheService {
  private memoryCache = new Map<string, CacheEntry>();
  private defaultTTL = 15 * 60 * 1000; // 15 minutes
  private maxCacheSize = 100; // Maximum cache entries
  
  /**
   * Generate cache key for a page
   */
  private generateKey(path: string, params?: Record<string, any>): string {
    const baseKey = path.toLowerCase();
    if (!params || Object.keys(params).length === 0) {
      return baseKey;
    }
    
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${encodeURIComponent(params[key])}`)
      .join('&');
    
    return `${baseKey}?${sortedParams}`;
  }

  /**
   * Set cache entry
   */
  set<T>(
    path: string, 
    data: T, 
    options: CacheOptions = {},
    params?: Record<string, any>
  ): void {
    const key = this.generateKey(path, params);
    const ttl = options.ttl || this.defaultTTL;
    const timestamp = Date.now();
    
    const entry: CacheEntry<T> = {
      data,
      timestamp,
      expiresAt: timestamp + ttl,
      key,
      tags: options.tags || []
    };

    // Cleanup old entries if cache is full
    if (this.memoryCache.size >= this.maxCacheSize) {
      this.cleanup();
    }

    this.memoryCache.set(key, entry);

    // Persistent caching for static content
    if (options.persistent && typeof window !== 'undefined') {
      try {
        const persistentData = {
          data,
          timestamp,
          expiresAt: entry.expiresAt
        };
        sessionStorage.setItem(`page_cache_${key}`, JSON.stringify(persistentData));
      } catch (error) {
        console.warn('Failed to persist cache entry:', error);
      }
    }
  }

  /**
   * Get cache entry
   */
  get<T>(path: string, params?: Record<string, any>): T | null {
    const key = this.generateKey(path, params);
    
    // Check memory cache first
    const entry = this.memoryCache.get(key);
    if (entry) {
      if (Date.now() < entry.expiresAt) {
        return entry.data as T;
      } else {
        // Entry expired
        this.memoryCache.delete(key);
      }
    }

    // Check persistent cache
    if (typeof window !== 'undefined') {
      try {
        const persistentData = sessionStorage.getItem(`page_cache_${key}`);
        if (persistentData) {
          const parsed = JSON.parse(persistentData);
          if (Date.now() < parsed.expiresAt) {
            // Restore to memory cache
            this.memoryCache.set(key, {
              data: parsed.data,
              timestamp: parsed.timestamp,
              expiresAt: parsed.expiresAt,
              key,
              tags: []
            });
            return parsed.data as T;
          } else {
            // Remove expired persistent cache
            sessionStorage.removeItem(`page_cache_${key}`);
          }
        }
      } catch (error) {
        console.warn('Failed to retrieve persistent cache:', error);
      }
    }

    return null;
  }

  /**
   * Check if entry exists and is valid
   */
  has(path: string, params?: Record<string, any>): boolean {
    return this.get(path, params) !== null;
  }

  /**
   * Invalidate cache by path
   */
  invalidate(path: string, params?: Record<string, any>): void {
    const key = this.generateKey(path, params);
    this.memoryCache.delete(key);
    
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(`page_cache_${key}`);
    }
  }

  /**
   * Invalidate cache by tags
   */
  invalidateByTags(tags: string[]): void {
    const keysToDelete: string[] = [];
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.tags && entry.tags.some(tag => tags.includes(tag))) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach(key => {
      this.memoryCache.delete(key);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(`page_cache_${key}`);
      }
    });
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.memoryCache.clear();
    
    if (typeof window !== 'undefined') {
      // Remove all page cache entries from sessionStorage
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i);
        if (key && key.startsWith('page_cache_')) {
          sessionStorage.removeItem(key);
        }
      }
    }
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    for (const [key, entry] of this.memoryCache.entries()) {
      if (now >= entry.expiresAt) {
        keysToDelete.push(key);
      }
    }

    // If still too many entries, remove oldest
    if (this.memoryCache.size - keysToDelete.length >= this.maxCacheSize) {
      const sortedEntries = Array.from(this.memoryCache.entries())
        .sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const additionalToRemove = Math.min(
        10, // Remove up to 10 at once
        this.memoryCache.size - keysToDelete.length - this.maxCacheSize + 10
      );
      
      for (let i = 0; i < additionalToRemove; i++) {
        keysToDelete.push(sortedEntries[i][0]);
      }
    }

    keysToDelete.forEach(key => {
      this.memoryCache.delete(key);
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem(`page_cache_${key}`);
      }
    });
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    oldestEntry: number;
    newestEntry: number;
  } {
    const entries = Array.from(this.memoryCache.values());
    const timestamps = entries.map(e => e.timestamp);
    
    return {
      size: this.memoryCache.size,
      maxSize: this.maxCacheSize,
      hitRate: 0, // Would need to track hits/misses
      oldestEntry: timestamps.length ? Math.min(...timestamps) : 0,
      newestEntry: timestamps.length ? Math.max(...timestamps) : 0
    };
  }

  /**
   * Preload cache for common routes
   */
  async preloadCommonRoutes(routes: Array<{
    path: string;
    params?: Record<string, any>;
    loader: () => Promise<any>;
  }>): Promise<void> {
    const loadPromises = routes.map(async ({ path, params, loader }) => {
      const key = this.generateKey(path, params);
      
      if (!this.has(path, params)) {
        try {
          const data = await loader();
          this.set(path, data, {
            ttl: this.defaultTTL * 2, // Cache preloaded content longer
            tags: ['preloaded']
          }, params);
        } catch (error) {
          console.warn(`Failed to preload route ${path}:`, error);
        }
      }
    });

    await Promise.allSettled(loadPromises);
  }
}

// Singleton instance
export const pageCache = new PageCacheService();

/**
 * React hook for cached data
 */
export function useCachedData<T>(
  path: string,
  loader: () => Promise<T>,
  options: CacheOptions = {},
  params?: Record<string, any>,
  dependencies: any[] = []
): {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
} {
  const [data, setData] = React.useState<T | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadData = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cachedData = pageCache.get<T>(path, params);
      if (cachedData) {
        setData(cachedData);
        setLoading(false);
        return;
      }

      // Load fresh data
      const freshData = await loader();
      pageCache.set(path, freshData, options, params);
      setData(freshData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [path, JSON.stringify(params), ...dependencies]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const refetch = React.useCallback(async () => {
    pageCache.invalidate(path, params);
    await loadData();
  }, [path, params, loadData]);

  return { data, loading, error, refetch };
}

// Performance monitoring
export class CacheMetrics {
  private hits = 0;
  private misses = 0;
  private totalLoadTime = 0;
  private loadCount = 0;

  recordHit(): void {
    this.hits++;
  }

  recordMiss(): void {
    this.misses++;
  }

  recordLoadTime(milliseconds: number): void {
    this.totalLoadTime += milliseconds;
    this.loadCount++;
  }

  getHitRate(): number {
    const total = this.hits + this.misses;
    return total > 0 ? this.hits / total : 0;
  }

  getAverageLoadTime(): number {
    return this.loadCount > 0 ? this.totalLoadTime / this.loadCount : 0;
  }

  getStats(): {
    hits: number;
    misses: number;
    hitRate: number;
    averageLoadTime: number;
    totalRequests: number;
  } {
    return {
      hits: this.hits,
      misses: this.misses,
      hitRate: this.getHitRate(),
      averageLoadTime: this.getAverageLoadTime(),
      totalRequests: this.hits + this.misses
    };
  }

  reset(): void {
    this.hits = 0;
    this.misses = 0;
    this.totalLoadTime = 0;
    this.loadCount = 0;
  }
}

export const cacheMetrics = new CacheMetrics();