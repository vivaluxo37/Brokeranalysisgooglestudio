/**
 * Programmatic Page Caching Service
 * Implements intelligent caching for programmatic directory pages
 * with automatic invalidation and background regeneration
 */

import { Broker } from '../types';
import { SEOPageConfig } from '../data/seoPageConfigs';
import { CountryConfig } from '../lib/constants/countries';

export interface CacheEntry<T = any> {
  key: string;
  data: T;
  generatedAt: number;
  expiresAt: number;
  hits: number;
  lastAccessed: number;
  version: string;
  dependencies: string[];
}

export interface CacheStats {
  totalEntries: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
  cacheSize: number; // in bytes
  oldestEntry: number;
  newestEntry: number;
}

export interface ProgrammaticPageData {
  brokers: Broker[];
  config: SEOPageConfig | CountryConfig;
  metadata: {
    totalCount: number;
    avgRating: number;
    minDeposit: number;
    avgSpread: number;
    topRegulators: string[];
    lastUpdated: number;
  };
  seo: {
    title: string;
    description: string;
    keywords: string[];
    structuredData: any;
  };
}

class ProgrammaticCacheService {
  private cache = new Map<string, CacheEntry>();
  private stats = {
    totalHits: 0,
    totalMisses: 0,
    totalWrites: 0,
    totalInvalidations: 0
  };

  // Cache configuration
  private readonly DEFAULT_TTL = 1000 * 60 * 60 * 2; // 2 hours
  private readonly MAX_CACHE_SIZE = 1000; // Maximum number of entries
  private readonly BACKGROUND_REFRESH_THRESHOLD = 0.8; // Refresh when 80% expired

  /**
   * Generate cache key for programmatic page
   */
  private generateCacheKey(
    type: 'category' | 'country' | 'seo',
    slug: string,
    filters?: Record<string, any>
  ): string {
    const baseKey = `programmatic:${type}:${slug}`;
    if (filters && Object.keys(filters).length > 0) {
      const filterHash = this.hashObject(filters);
      return `${baseKey}:${filterHash}`;
    }
    return baseKey;
  }

  /**
   * Hash object for consistent cache keys
   */
  private hashObject(obj: Record<string, any>): string {
    const sortedKeys = Object.keys(obj).sort();
    const serialized = sortedKeys.map(key => `${key}:${obj[key]}`).join('|');
    return btoa(serialized).slice(0, 16);
  }

  /**
   * Get cached page data
   */
  async get<T = ProgrammaticPageData>(
    type: 'category' | 'country' | 'seo',
    slug: string,
    filters?: Record<string, any>
  ): Promise<T | null> {
    const key = this.generateCacheKey(type, slug, filters);
    const entry = this.cache.get(key);

    if (!entry) {
      this.stats.totalMisses++;
      return null;
    }

    // Check if expired
    const now = Date.now();
    if (now > entry.expiresAt) {
      this.cache.delete(key);
      this.stats.totalMisses++;
      return null;
    }

    // Update access stats
    entry.hits++;
    entry.lastAccessed = now;
    this.stats.totalHits++;

    // Schedule background refresh if close to expiration
    const timeUntilExpiry = entry.expiresAt - now;
    const totalTTL = entry.expiresAt - entry.generatedAt;
    if (timeUntilExpiry / totalTTL < this.BACKGROUND_REFRESH_THRESHOLD) {
      this.scheduleBackgroundRefresh(type, slug, filters);
    }

    return entry.data;
  }

  /**
   * Store page data in cache
   */
  async set<T = ProgrammaticPageData>(
    type: 'category' | 'country' | 'seo',
    slug: string,
    data: T,
    options: {
      filters?: Record<string, any>;
      ttl?: number;
      dependencies?: string[];
      version?: string;
    } = {}
  ): Promise<void> {
    const key = this.generateCacheKey(type, slug, options.filters);
    const now = Date.now();
    const ttl = options.ttl || this.DEFAULT_TTL;

    const entry: CacheEntry<T> = {
      key,
      data,
      generatedAt: now,
      expiresAt: now + ttl,
      hits: 0,
      lastAccessed: now,
      version: options.version || '1.0',
      dependencies: options.dependencies || []
    };

    // Enforce cache size limit
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.evictOldestEntries();
    }

    this.cache.set(key, entry);
    this.stats.totalWrites++;
  }

  /**
   * Invalidate cache entries by pattern or dependency
   */
  async invalidate(pattern?: string | RegExp, dependency?: string): Promise<number> {
    let invalidated = 0;

    for (const [key, entry] of this.cache.entries()) {
      let shouldInvalidate = false;

      if (pattern) {
        if (typeof pattern === 'string') {
          shouldInvalidate = key.includes(pattern);
        } else {
          shouldInvalidate = pattern.test(key);
        }
      }

      if (dependency && entry.dependencies.includes(dependency)) {
        shouldInvalidate = true;
      }

      if (shouldInvalidate) {
        this.cache.delete(key);
        invalidated++;
      }
    }

    this.stats.totalInvalidations += invalidated;
    return invalidated;
  }

  /**
   * Invalidate all broker-related cache entries
   */
  async invalidateBrokerData(): Promise<number> {
    return this.invalidate(/programmatic:(category|country|seo)/);
  }

  /**
   * Invalidate specific broker cache entries
   */
  async invalidateBroker(brokerId: string): Promise<number> {
    return this.invalidate(undefined, `broker:${brokerId}`);
  }

  /**
   * Pre-warm cache with popular pages
   */
  async preWarmCache(
    popularPages: Array<{
      type: 'category' | 'country' | 'seo';
      slug: string;
      priority: number;
    }>
  ): Promise<void> {
    console.log('🔥 Pre-warming cache for popular pages...');
    
    // Sort by priority
    const sortedPages = popularPages.sort((a, b) => b.priority - a.priority);

    for (const page of sortedPages) {
      try {
        // Check if already cached
        const cached = await this.get(page.type, page.slug);
        if (!cached) {
          // Generate and cache the page
          await this.generateAndCache(page.type, page.slug);
          console.log(`✅ Pre-warmed: ${page.type}/${page.slug}`);
        }
      } catch (error) {
        console.warn(`⚠️ Failed to pre-warm ${page.type}/${page.slug}:`, error);
      }
    }

    console.log('🎯 Cache pre-warming complete');
  }

  /**
   * Generate and cache page data
   */
  private async generateAndCache(
    type: 'category' | 'country' | 'seo',
    slug: string,
    filters?: Record<string, any>
  ): Promise<ProgrammaticPageData> {
    // This would integrate with your existing broker filtering logic
    // For now, return a placeholder structure
    
    const data: ProgrammaticPageData = {
      brokers: [], // Would be filtered brokers
      config: {} as any, // Would be the page config
      metadata: {
        totalCount: 0,
        avgRating: 0,
        minDeposit: 0,
        avgSpread: 0,
        topRegulators: [],
        lastUpdated: Date.now()
      },
      seo: {
        title: `Generated ${type} page for ${slug}`,
        description: `Auto-generated description for ${slug}`,
        keywords: [],
        structuredData: {}
      }
    };

    await this.set(type, slug, data, { filters });
    return data;
  }

  /**
   * Schedule background refresh for expiring entries
   */
  private scheduleBackgroundRefresh(
    type: 'category' | 'country' | 'seo',
    slug: string,
    filters?: Record<string, any>
  ): void {
    // Schedule async refresh without blocking current request
    setTimeout(async () => {
      try {
        await this.generateAndCache(type, slug, filters);
        console.log(`🔄 Background refresh completed for ${type}/${slug}`);
      } catch (error) {
        console.warn(`⚠️ Background refresh failed for ${type}/${slug}:`, error);
      }
    }, 100);
  }

  /**
   * Evict oldest cache entries to maintain size limit
   */
  private evictOldestEntries(evictCount: number = 10): void {
    const entries = Array.from(this.cache.entries())
      .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);

    for (let i = 0; i < Math.min(evictCount, entries.length); i++) {
      this.cache.delete(entries[i][0]);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const entries = Array.from(this.cache.values());
    const now = Date.now();

    return {
      totalEntries: this.cache.size,
      hitRate: this.stats.totalHits / (this.stats.totalHits + this.stats.totalMisses) || 0,
      totalHits: this.stats.totalHits,
      totalMisses: this.stats.totalMisses,
      cacheSize: this.estimateCacheSize(),
      oldestEntry: Math.min(...entries.map(e => e.generatedAt)),
      newestEntry: Math.max(...entries.map(e => e.generatedAt))
    };
  }

  /**
   * Estimate cache size in bytes
   */
  private estimateCacheSize(): number {
    let size = 0;
    for (const entry of this.cache.values()) {
      size += JSON.stringify(entry).length * 2; // Rough estimate
    }
    return size;
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    this.cache.clear();
    this.stats = {
      totalHits: 0,
      totalMisses: 0,
      totalWrites: 0,
      totalInvalidations: 0
    };
  }

  /**
   * Get cache health report
   */
  getHealthReport(): {
    status: 'healthy' | 'warning' | 'critical';
    issues: string[];
    recommendations: string[];
    stats: CacheStats;
  } {
    const stats = this.getStats();
    const issues: string[] = [];
    const recommendations: string[] = [];
    let status: 'healthy' | 'warning' | 'critical' = 'healthy';

    // Check hit rate
    if (stats.hitRate < 0.5) {
      status = 'warning';
      issues.push('Low cache hit rate (< 50%)');
      recommendations.push('Consider pre-warming more pages or increasing TTL');
    }

    // Check cache size
    if (stats.cacheSize > 50 * 1024 * 1024) { // 50MB
      status = 'warning';
      issues.push('Cache size is large (> 50MB)');
      recommendations.push('Consider reducing TTL or implementing compression');
    }

    // Check entry count
    if (stats.totalEntries > this.MAX_CACHE_SIZE * 0.9) {
      status = 'warning';
      issues.push('Cache is near capacity');
      recommendations.push('Consider increasing MAX_CACHE_SIZE or more aggressive eviction');
    }

    if (issues.length === 0) {
      recommendations.push('Cache is performing well');
    }

    return { status, issues, recommendations, stats };
  }
}

// Create singleton instance
export const programmaticCache = new ProgrammaticCacheService();

// Export cache management hooks
export const useProgrammaticCache = () => {
  return {
    get: programmaticCache.get.bind(programmaticCache),
    set: programmaticCache.set.bind(programmaticCache),
    invalidate: programmaticCache.invalidate.bind(programmaticCache),
    getStats: programmaticCache.getStats.bind(programmaticCache),
    getHealthReport: programmaticCache.getHealthReport.bind(programmaticCache)
  };
};

export default programmaticCache;