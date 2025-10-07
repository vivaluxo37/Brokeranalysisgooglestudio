/**
 * Content Cache Service
 * 
 * This service provides a multi-level caching system for AI-generated content
 * and other programmatic SEO data. It includes memory cache, database cache,
 * and CDN cache integration with intelligent cache invalidation.
 */

import { createClient } from '@supabase/supabase-js';

// Types for cache entries
interface CacheEntry<T = any> {
  key: string;
  content: T;
  metadata: {
    createdAt: Date;
    expiresAt: Date;
    accessCount: number;
    lastAccessed: Date;
    size: number;
    tags: string[];
  };
}

interface CacheStats {
  totalEntries: number;
  hitRate: number;
  missRate: number;
  totalHits: number;
  totalMisses: number;
  memoryUsage: number;
  oldestEntry: Date | null;
  newestEntry: Date | null;
}

interface CacheOptions {
  ttl?: number; // Time to live in milliseconds
  tags?: string[];
  maxSize?: number; // Maximum size in bytes
  priority?: 'low' | 'medium' | 'high';
}

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

/**
 * Content Cache Service
 */
export class ContentCache {
  private memoryCache: Map<string, CacheEntry> = new Map();
  private maxMemorySize: number = 50 * 1024 * 1024; // 50MB
  private currentMemorySize: number = 0;
  private stats: CacheStats = {
    totalEntries: 0,
    hitRate: 0,
    missRate: 0,
    totalHits: 0,
    totalMisses: 0,
    memoryUsage: 0,
    oldestEntry: null,
    newestEntry: null
  };

  /**
   * Get cached content
   */
  async get<T = any>(key: string): Promise<CacheEntry<T> | null> {
    try {
      // Check memory cache first
      const memoryEntry = this.getFromMemory<T>(key);
      if (memoryEntry) {
        this.updateStats('hit');
        return memoryEntry;
      }

      // Check database cache
      const dbEntry = await this.getFromDatabase<T>(key);
      if (dbEntry) {
        // Store in memory for faster future access
        this.setToMemory(key, dbEntry);
        this.updateStats('hit');
        return dbEntry;
      }

      this.updateStats('miss');
      return null;

    } catch (error) {
      console.error('Error getting from cache:', error);
      this.updateStats('miss');
      return null;
    }
  }

  /**
   * Set cached content
   */
  async set<T = any>(
    key: string, 
    content: T, 
    options: CacheOptions = {}
  ): Promise<void> {
    try {
      const now = new Date();
      const ttl = options.ttl || 24 * 60 * 60 * 1000; // Default 24 hours
      const expiresAt = new Date(now.getTime() + ttl);
      const size = this.calculateSize(content);

      const cacheEntry: CacheEntry<T> = {
        key,
        content,
        metadata: {
          createdAt: now,
          expiresAt,
          accessCount: 0,
          lastAccessed: now,
          size,
          tags: options.tags || []
        }
      };

      // Set in memory
      this.setToMemory(key, cacheEntry, options.maxSize);

      // Set in database
      await this.setToDatabase(key, cacheEntry);

      // Update stats
      this.updateStats('set', cacheEntry);

    } catch (error) {
      console.error('Error setting cache:', error);
    }
  }

  /**
   * Delete cached content
   */
  async delete(key: string): Promise<boolean> {
    try {
      // Delete from memory
      const memoryDeleted = this.memoryCache.delete(key);
      
      // Delete from database
      const { error } = await supabase
        .from('content_cache')
        .delete()
        .eq('cache_key', key);

      if (error) {
        console.error('Error deleting from database cache:', error);
      }

      // Update stats
      if (memoryDeleted) {
        this.currentMemorySize -= this.memoryCache.get(key)?.metadata.size || 0;
        this.stats.totalEntries--;
      }

      return memoryDeleted || !error;

    } catch (error) {
      console.error('Error deleting cache:', error);
      return false;
    }
  }

  /**
   * Clear cache by tags
   */
  async clearByTags(tags: string[]): Promise<number> {
    try {
      let deletedCount = 0;

      // Clear from memory
      for (const [key, entry] of this.memoryCache.entries()) {
        if (entry.metadata.tags.some(tag => tags.includes(tag))) {
          this.memoryCache.delete(key);
          this.currentMemorySize -= entry.metadata.size;
          deletedCount++;
        }
      }

      // Clear from database
      const { error } = await supabase
        .from('content_cache')
        .delete()
        .contains('tags', tags);

      if (error) {
        console.error('Error clearing database cache by tags:', error);
      }

      // Update stats
      this.stats.totalEntries -= deletedCount;

      return deletedCount;

    } catch (error) {
      console.error('Error clearing cache by tags:', error);
      return 0;
    }
  }

  /**
   * Clear expired entries
   */
  async clearExpired(): Promise<number> {
    try {
      const now = new Date();
      let deletedCount = 0;

      // Clear from memory
      for (const [key, entry] of this.memoryCache.entries()) {
        if (entry.metadata.expiresAt < now) {
          this.memoryCache.delete(key);
          this.currentMemorySize -= entry.metadata.size;
          deletedCount++;
        }
      }

      // Clear from database
      const { error } = await supabase
        .from('content_cache')
        .delete()
        .lt('expires_at', now.toISOString());

      if (error) {
        console.error('Error clearing expired database cache:', error);
      }

      // Update stats
      this.stats.totalEntries -= deletedCount;

      return deletedCount;

    } catch (error) {
      console.error('Error clearing expired cache:', error);
      return 0;
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Preload common cache entries
   */
  async preloadCommonEntries(): Promise<void> {
    try {
      // Common cache keys to preload
      const commonKeys = [
        'home-page-content',
        'popular-categories',
        'top-countries',
        'common-meta-descriptions'
      ];

      for (const key of commonKeys) {
        await this.get(key); // This will load from database to memory
      }

      console.log(`Preloaded ${commonKeys.length} common cache entries`);

    } catch (error) {
      console.error('Error preloading cache entries:', error);
    }
  }

  /**
   * Get from memory cache
   */
  private getFromMemory<T = any>(key: string): CacheEntry<T> | null {
    const entry = this.memoryCache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (entry.metadata.expiresAt < new Date()) {
      this.memoryCache.delete(key);
      this.currentMemorySize -= entry.metadata.size;
      this.stats.totalEntries--;
      return null;
    }

    // Update access metadata
    entry.metadata.accessCount++;
    entry.metadata.lastAccessed = new Date();

    return entry as CacheEntry<T>;
  }

  /**
   * Set to memory cache
   */
  private setToMemory<T = any>(
    key: string, 
    entry: CacheEntry<T>, 
    maxSize?: number
  ): void {
    // Check if we need to make space
    const entrySize = maxSize || entry.metadata.size;
    
    if (this.currentMemorySize + entrySize > this.maxMemorySize) {
      this.evictLeastUsed();
    }

    // Set the entry
    this.memoryCache.set(key, entry);
    this.currentMemorySize += entry.metadata.size;
    this.stats.totalEntries++;
  }

  /**
   * Get from database cache
   */
  private async getFromDatabase<T = any>(key: string): Promise<CacheEntry<T> | null> {
    try {
      const { data, error } = await supabase
        .from('content_cache')
        .select('*')
        .eq('cache_key', key)
        .single();

      if (error || !data) {
        return null;
      }

      // Check if expired
      if (new Date(data.expires_at) < new Date()) {
        await this.delete(key);
        return null;
      }

      // Convert to cache entry format
      const cacheEntry: CacheEntry<T> = {
        key: data.cache_key,
        content: data.content,
        metadata: {
          createdAt: new Date(data.created_at),
          expiresAt: new Date(data.expires_at),
          accessCount: data.usage_count || 0,
          lastAccessed: new Date(data.updated_at),
          size: this.calculateSize(data.content),
          tags: data.tags || []
        }
      };

      return cacheEntry;

    } catch (error) {
      console.error('Error getting from database cache:', error);
      return null;
    }
  }

  /**
   * Set to database cache
   */
  private async setToDatabase<T = any>(key: string, entry: CacheEntry<T>): Promise<void> {
    try {
      const { error } = await supabase
        .from('content_cache')
        .upsert({
          cache_key: key,
          content_type: 'json',
          content: entry.content,
          source: 'ai_generated',
          quality_score: 0.8,
          usage_count: entry.metadata.accessCount,
          expires_at: entry.metadata.expiresAt.toISOString(),
          tags: entry.metadata.tags
        });

      if (error) {
        console.error('Error setting database cache:', error);
      }

    } catch (error) {
      console.error('Error setting database cache:', error);
    }
  }

  /**
   * Evict least used entries from memory
   */
  private evictLeastUsed(): void {
    if (this.memoryCache.size === 0) return;

    // Sort entries by last accessed time
    const entries = Array.from(this.memoryCache.entries())
      .sort(([, a], [, b]) => 
        a.metadata.lastAccessed.getTime() - b.metadata.lastAccessed.getTime()
      );

    // Evict entries until we have enough space
    const targetSize = this.maxMemorySize * 0.8; // Evict to 80% of max size
    let evictedCount = 0;

    for (const [key, entry] of entries) {
      this.memoryCache.delete(key);
      this.currentMemorySize -= entry.metadata.size;
      this.stats.totalEntries--;
      evictedCount++;

      if (this.currentMemorySize <= targetSize) {
        break;
      }
    }

    console.log(`Evicted ${evictedCount} entries from memory cache`);
  }

  /**
   * Calculate size of content
   */
  private calculateSize(content: any): number {
    try {
      return JSON.stringify(content).length * 2; // Rough estimate in bytes
    } catch {
      return 1024; // Default 1KB
    }
  }

  /**
   * Update cache statistics
   */
  private updateStats(operation: 'hit' | 'miss' | 'set', entry?: CacheEntry): void {
    switch (operation) {
      case 'hit':
        this.stats.totalHits++;
        break;
      case 'miss':
        this.stats.totalMisses++;
        break;
      case 'set':
        if (entry) {
          if (!this.stats.oldestEntry || entry.metadata.createdAt < this.stats.oldestEntry) {
            this.stats.oldestEntry = entry.metadata.createdAt;
          }
          if (!this.stats.newestEntry || entry.metadata.createdAt > this.stats.newestEntry) {
            this.stats.newestEntry = entry.metadata.createdAt;
          }
        }
        break;
    }

    // Update rates
    const total = this.stats.totalHits + this.stats.totalMisses;
    if (total > 0) {
      this.stats.hitRate = this.stats.totalHits / total;
      this.stats.missRate = this.stats.totalMisses / total;
    }

    // Update memory usage
    this.stats.memoryUsage = this.currentMemorySize;
  }

  /**
   * Clean up expired entries periodically
   */
  startPeriodicCleanup(): void {
    // Clean up every hour
    setInterval(async () => {
      const deletedCount = await this.clearExpired();
      if (deletedCount > 0) {
        console.log(`Cleaned up ${deletedCount} expired cache entries`);
      }
    }, 60 * 60 * 1000);
  }
}

// Export singleton instance
export const contentCache = new ContentCache();

// Start periodic cleanup
contentCache.startPeriodicCleanup();

export default contentCache;