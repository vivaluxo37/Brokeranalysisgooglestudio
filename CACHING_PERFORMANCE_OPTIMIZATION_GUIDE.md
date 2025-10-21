# Caching and Performance Optimization Guide

## Overview
This guide provides comprehensive strategies for implementing multi-level caching and performance optimizations for the programmatic SEO system.

## Current Caching Implementation

### ✅ Already Implemented
- Basic `ContentCache` service with memory and database caching
- Cache invalidation and expiration
- Cache statistics and monitoring

### 🔄 Needs Enhancement
- Redis integration for distributed caching
- CDN caching strategy
- Performance monitoring
- Cache warming strategies

## 1. Enhanced Caching Architecture

### File: `services/cache/enhancedCacheService.ts`

```typescript
/**
 * Enhanced Cache Service
 * 
 * Multi-level caching with Redis, memory, and CDN integration
 */

import Redis from 'ioredis';
import { createClient } from '@supabase/supabase-js';

interface CacheConfig {
  ttl: number;
  tags: string[];
  priority: 'low' | 'medium' | 'high';
  compress: boolean;
}

interface CacheEntry<T = any> {
  data: T;
  metadata: {
    createdAt: Date;
    expiresAt: Date;
    accessCount: number;
    lastAccessed: Date;
    size: number;
    tags: string[];
    version: number;
  };
}

interface CacheStats {
  totalEntries: number;
  hitRate: number;
  missRate: number;
  memoryUsage: number;
  redisUsage: number;
  avgResponseTime: number;
  topKeys: Array<{ key: string; hits: number }>;
}

export class EnhancedCacheService {
  private memoryCache: Map<string, CacheEntry> = new Map();
  private redis: Redis | null = null;
  private supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
  );
  
  private config = {
    maxMemorySize: 100 * 1024 * 1024, // 100MB
    maxRedisSize: 500 * 1024 * 1024, // 500MB
    defaultTtl: 24 * 60 * 60 * 1000, // 24 hours
    compressionThreshold: 1024, // 1KB
    statsInterval: 60 * 1000 // 1 minute
  };

  private stats: CacheStats = {
    totalEntries: 0,
    hitRate: 0,
    missRate: 0,
    memoryUsage: 0,
    redisUsage: 0,
    avgResponseTime: 0,
    topKeys: []
  };

  constructor() {
    this.initializeRedis();
    this.startStatsCollection();
    this.startCleanupTimer();
  }

  /**
   * Initialize Redis connection
   */
  private async initializeRedis() {
    try {
      if (process.env.REDIS_URL) {
        this.redis = new Redis(process.env.REDIS_URL, {
          retryDelayOnFailover: 100,
          maxRetriesPerRequest: 3,
          lazyConnect: true
        });

        this.redis.on('connect', () => {
          console.log('Redis connected');
        });

        this.redis.on('error', (error) => {
          console.error('Redis error:', error);
        });

        await this.redis.connect();
      }
    } catch (error) {
      console.error('Failed to initialize Redis:', error);
    }
  }

  /**
   * Get cached data with multi-level fallback
   */
  async get<T = any>(key: string): Promise<T | null> {
    const startTime = Date.now();
    
    try {
      // Level 1: Memory cache
      const memoryEntry = this.getFromMemory<T>(key);
      if (memoryEntry) {
        this.updateStats('hit', Date.now() - startTime);
        return memoryEntry;
      }

      // Level 2: Redis cache
      if (this.redis) {
        const redisEntry = await this.getFromRedis<T>(key);
        if (redisEntry) {
          // Store in memory for faster future access
          this.setToMemory(key, redisEntry);
          this.updateStats('hit', Date.now() - startTime);
          return redisEntry;
        }
      }

      // Level 3: Database cache
      const dbEntry = await this.getFromDatabase<T>(key);
      if (dbEntry) {
        // Store in higher-level caches
        if (this.redis) {
          await this.setToRedis(key, dbEntry);
        }
        this.setToMemory(key, dbEntry);
        this.updateStats('hit', Date.now() - startTime);
        return dbEntry;
      }

      this.updateStats('miss', Date.now() - startTime);
      return null;

    } catch (error) {
      console.error('Cache get error:', error);
      this.updateStats('miss', Date.now() - startTime);
      return null;
    }
  }

  /**
   * Set cached data across all levels
   */
  async set<T = any>(
    key: string, 
    data: T, 
    config: Partial<CacheConfig> = {}
  ): Promise<void> {
    try {
      const cacheConfig: CacheConfig = {
        ttl: this.config.defaultTtl,
        tags: [],
        priority: 'medium',
        compress: false,
        ...config
      };

      const entry: CacheEntry<T> = {
        data,
        metadata: {
          createdAt: new Date(),
          expiresAt: new Date(Date.now() + cacheConfig.ttl),
          accessCount: 0,
          lastAccessed: new Date(),
          size: this.calculateSize(data),
          tags: cacheConfig.tags,
          version: 1
        }
      };

      // Set in memory cache
      this.setToMemory(key, entry, cacheConfig);

      // Set in Redis
      if (this.redis) {
        await this.setToRedis(key, entry, cacheConfig);
      }

      // Set in database
      await this.setToDatabase(key, entry, cacheConfig);

    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Delete cached data from all levels
   */
  async delete(key: string): Promise<boolean> {
    try {
      let deleted = false;

      // Delete from memory
      if (this.memoryCache.delete(key)) {
        deleted = true;
      }

      // Delete from Redis
      if (this.redis) {
        const redisResult = await this.redis.del(key);
        if (redisResult > 0) {
          deleted = true;
        }
      }

      // Delete from database
      const { error } = await this.supabase
        .from('content_cache')
        .delete()
        .eq('cache_key', key);

      if (!error) {
        deleted = true;
      }

      return deleted;

    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  /**
   * Clear cache by tags
   */
  async clearByTags(tags: string[]): Promise<number> {
    let deletedCount = 0;

    try {
      // Clear from memory
      for (const [key, entry] of this.memoryCache.entries()) {
        if (entry.metadata.tags.some(tag => tags.includes(tag))) {
          this.memoryCache.delete(key);
          deletedCount++;
        }
      }

      // Clear from Redis
      if (this.redis) {
        const keys = await this.redis.keys('*');
        for (const key of keys) {
          const entryData = await this.redis.hgetall(key);
          if (entryData.tags) {
            const entryTags = JSON.parse(entryData.tags);
            if (entryTags.some((tag: string) => tags.includes(tag))) {
              await this.redis.del(key);
              deletedCount++;
            }
          }
        }
      }

      // Clear from database
      const { error } = await this.supabase
        .from('content_cache')
        .delete()
        .contains('tags', tags);

      if (!error) {
        deletedCount += 10; // Estimate
      }

    } catch (error) {
      console.error('Cache clear by tags error:', error);
    }

    return deletedCount;
  }

  /**
   * Warm cache with common keys
   */
  async warmCache(keys: string[]): Promise<void> {
    const batchSize = 10;
    
    for (let i = 0; i < keys.length; i += batchSize) {
      const batch = keys.slice(i, i + batchSize);
      
      await Promise.allSettled(
        batch.map(async (key) => {
          try {
            await this.get(key); // This will populate caches
          } catch (error) {
            console.error(`Cache warming error for key ${key}:`, error);
          }
        })
      );

      // Small delay to prevent overwhelming the system
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return { ...this.stats };
  }

  /**
   * Memory cache operations
   */
  private getFromMemory<T>(key: string): T | null {
    const entry = this.memoryCache.get(key);
    
    if (!entry) {
      return null;
    }

    // Check if expired
    if (entry.metadata.expiresAt < new Date()) {
      this.memoryCache.delete(key);
      return null;
    }

    // Update access metadata
    entry.metadata.accessCount++;
    entry.metadata.lastAccessed = new Date();

    return entry.data as T;
  }

  private setToMemory<T>(key: string, entry: CacheEntry<T>, config?: CacheConfig): void {
    // Check memory size limits
    if (this.shouldEvictFromMemory()) {
      this.evictLeastUsedFromMemory();
    }

    this.memoryCache.set(key, entry);
  }

  private shouldEvictFromMemory(): boolean {
    let totalSize = 0;
    for (const entry of this.memoryCache.values()) {
      totalSize += entry.metadata.size;
    }
    return totalSize > this.config.maxMemorySize;
  }

  private evictLeastUsedFromMemory(): void {
    const entries = Array.from(this.memoryCache.entries())
      .sort(([, a], [, b]) => 
        a.metadata.lastAccessed.getTime() - b.metadata.lastAccessed.getTime()
      );

    const targetSize = this.config.maxMemorySize * 0.8;
    let currentSize = 0;

    for (const [key, entry] of entries) {
      currentSize += entry.metadata.size;
      if (currentSize > targetSize) {
        this.memoryCache.delete(key);
      }
    }
  }

  /**
   * Redis cache operations
   */
  private async getFromRedis<T>(key: string): Promise<T | null> {
    if (!this.redis) return null;

    try {
      const data = await this.redis.hgetall(key);
      
      if (!data || Object.keys(data).length === 0) {
        return null;
      }

      // Check if expired
      if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
        await this.redis.del(key);
        return null;
      }

      const entry: CacheEntry<T> = {
        data: JSON.parse(data.data),
        metadata: {
          createdAt: new Date(data.createdAt),
          expiresAt: new Date(data.expiresAt),
          accessCount: parseInt(data.accessCount) || 0,
          lastAccessed: new Date(data.lastAccessed),
          size: parseInt(data.size) || 0,
          tags: JSON.parse(data.tags || '[]'),
          version: parseInt(data.version) || 1
        }
      };

      // Update access stats
      await this.redis.hincrby(key, 'accessCount', 1);
      await this.redis.hset(key, 'lastAccessed', new Date().toISOString());

      return entry.data;

    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  private async setToRedis<T>(
    key: string, 
    entry: CacheEntry<T>, 
    config?: CacheConfig
  ): Promise<void> {
    if (!this.redis) return;

    try {
      const data = {
        data: JSON.stringify(entry.data),
        createdAt: entry.metadata.createdAt.toISOString(),
        expiresAt: entry.metadata.expiresAt.toISOString(),
        accessCount: entry.metadata.accessCount.toString(),
        lastAccessed: entry.metadata.lastAccessed.toISOString(),
        size: entry.metadata.size.toString(),
        tags: JSON.stringify(entry.metadata.tags),
        version: entry.metadata.version.toString()
      };

      await this.redis.hmset(key, data);
      
      // Set expiration
      const ttlSeconds = Math.floor((entry.metadata.expiresAt.getTime() - Date.now()) / 1000);
      if (ttlSeconds > 0) {
        await this.redis.expire(key, ttlSeconds);
      }

    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  /**
   * Database cache operations
   */
  private async getFromDatabase<T>(key: string): Promise<T | null> {
    try {
      const { data, error } = await this.supabase
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

      return data.content as T;

    } catch (error) {
      console.error('Database get error:', error);
      return null;
    }
  }

  private async setToDatabase<T>(
    key: string, 
    entry: CacheEntry<T>, 
    config?: CacheConfig
  ): Promise<void> {
    try {
      await this.supabase
        .from('content_cache')
        .upsert({
          cache_key: key,
          content_type: 'json',
          content: entry.data,
          source: 'programmatic_seo',
          quality_score: 1.0,
          usage_count: entry.metadata.accessCount,
          expires_at: entry.metadata.expiresAt.toISOString(),
          tags: entry.metadata.tags
        });

    } catch (error) {
      console.error('Database set error:', error);
    }
  }

  /**
   * Performance monitoring
   */
  private updateStats(type: 'hit' | 'miss', responseTime: number): void {
    if (type === 'hit') {
      this.stats.hitRate = (this.stats.hitRate * 0.9) + (1 * 0.1);
    } else {
      this.stats.missRate = (this.stats.missRate * 0.9) + (1 * 0.1);
    }

    // Update average response time
    this.stats.avgResponseTime = (this.stats.avgResponseTime * 0.9) + (responseTime * 0.1);
  }

  private startStatsCollection(): void {
    setInterval(() => {
      this.collectStats();
    }, this.config.statsInterval);
  }

  private collectStats(): void {
    // Memory usage
    let memoryUsage = 0;
    for (const entry of this.memoryCache.values()) {
      memoryUsage += entry.metadata.size;
    }
    this.stats.memoryUsage = memoryUsage;

    // Total entries
    this.stats.totalEntries = this.memoryCache.size;

    // Redis usage (if available)
    if (this.redis) {
      this.redis.info('memory').then(info => {
        const match = info.match(/used_memory:(\d+)/);
        if (match) {
          this.stats.redisUsage = parseInt(match[1]);
        }
      });
    }
  }

  /**
   * Cleanup expired entries
   */
  private startCleanupTimer(): void {
    setInterval(() => {
      this.cleanupExpiredEntries();
    }, 60 * 60 * 1000); // Every hour
  }

  private async cleanupExpiredEntries(): Promise<void> {
    const now = new Date();
    let cleanedCount = 0;

    // Clean memory cache
    for (const [key, entry] of this.memoryCache.entries()) {
      if (entry.metadata.expiresAt < now) {
        this.memoryCache.delete(key);
        cleanedCount++;
      }
    }

    // Clean Redis cache
    if (this.redis) {
      try {
        const keys = await this.redis.keys('*');
        for (const key of keys) {
          const expiresAt = await this.redis.hget(key, 'expiresAt');
          if (expiresAt && new Date(expiresAt) < now) {
            await this.redis.del(key);
            cleanedCount++;
          }
        }
      } catch (error) {
        console.error('Redis cleanup error:', error);
      }
    }

    // Clean database cache
    try {
      const { error } = await this.supabase
        .from('content_cache')
        .delete()
        .lt('expires_at', now.toISOString());

      if (!error) {
        cleanedCount += 10; // Estimate
      }
    } catch (error) {
      console.error('Database cleanup error:', error);
    }

    if (cleanedCount > 0) {
      console.log(`Cleaned up ${cleanedCount} expired cache entries`);
    }
  }

  /**
   * Calculate data size
   */
  private calculateSize(data: any): number {
    try {
      return JSON.stringify(data).length * 2; // Rough estimate in bytes
    } catch {
      return 1024; // Default 1KB
    }
  }

  /**
   * Close connections
   */
  async close(): Promise<void> {
    if (this.redis) {
      await this.redis.quit();
    }
  }
}

// Export singleton instance
export const enhancedCacheService = new EnhancedCacheService();
export default enhancedCacheService;
```

## 2. Performance Monitoring Service

### File: `services/performance/performanceMonitoringService.ts`

```typescript
/**
 * Performance Monitoring Service
 * 
 * Monitors application performance and provides optimization insights
 */

interface PerformanceMetrics {
  pageLoadTime: number;
  timeToInteractive: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  cacheHitRate: number;
  apiResponseTime: number;
  memoryUsage: number;
}

interface PerformanceAlert {
  type: 'warning' | 'error';
  metric: string;
  value: number;
  threshold: number;
  message: string;
  timestamp: Date;
}

export class PerformanceMonitoringService {
  private metrics: PerformanceMetrics = {
    pageLoadTime: 0,
    timeToInteractive: 0,
    firstContentfulPaint: 0,
    largestContentfulPaint: 0,
    cumulativeLayoutShift: 0,
    firstInputDelay: 0,
    cacheHitRate: 0,
    apiResponseTime: 0,
    memoryUsage: 0
  };

  private alerts: PerformanceAlert[] = [];
  private observers: PerformanceObserver[] = [];
  private thresholds = {
    pageLoadTime: 3000,
    timeToInteractive: 5000,
    firstContentfulPaint: 2000,
    largestContentfulPaint: 2500,
    cumulativeLayoutShift: 0.1,
    firstInputDelay: 100,
    cacheHitRate: 0.8,
    apiResponseTime: 1000,
    memoryUsage: 50 * 1024 * 1024 // 50MB
  };

  constructor() {
    this.initializeObservers();
    this.startMetricsCollection();
  }

  /**
   * Initialize performance observers
   */
  private initializeObservers(): void {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Observe navigation timing
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.entryType === 'navigation') {
            const navEntry = entry as PerformanceNavigationTiming;
            this.metrics.pageLoadTime = navEntry.loadEventEnd - navEntry.loadEventStart;
            this.metrics.timeToInteractive = navEntry.domInteractive - navEntry.loadEventStart;
          }
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);

      // Observe paint timing
      const paintObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.name === 'first-contentful-paint') {
            this.metrics.firstContentfulPaint = entry.startTime;
          }
        }
      });
      paintObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(paintObserver);

      // Observe largest contentful paint
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.largestContentfulPaint = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);

      // Observe layout shift
      const clsObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!(entry as any).hadRecentInput) {
            this.metrics.cumulativeLayoutShift += (entry as any).value;
          }
        }
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);

      // Observe first input delay
      const fidObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          this.metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
        }
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    }
  }

  /**
   * Start metrics collection
   */
  private startMetricsCollection(): void {
    setInterval(() => {
      this.collectMetrics();
      this.checkThresholds();
    }, 5000); // Every 5 seconds
  }

  /**
   * Collect current metrics
   */
  private collectMetrics(): void {
    // Memory usage
    if ('memory' in performance) {
      this.metrics.memoryUsage = (performance as any).memory.usedJSHeapSize;
    }

    // Cache hit rate (would be injected from cache service)
    this.metrics.cacheHitRate = this.getCacheHitRate();

    // API response time (would be tracked from API calls)
    this.metrics.apiResponseTime = this.getAverageApiResponseTime();
  }

  /**
   * Check thresholds and create alerts
   */
  private checkThresholds(): void {
    Object.entries(this.metrics).forEach(([metric, value]) => {
      const threshold = this.thresholds[metric as keyof PerformanceMetrics];
      if (threshold && value > threshold) {
        this.createAlert(metric, value, threshold);
      }
    });
  }

  /**
   * Create performance alert
   */
  private createAlert(metric: string, value: number, threshold: number): void {
    const alert: PerformanceAlert = {
      type: value > threshold * 1.5 ? 'error' : 'warning',
      metric,
      value,
      threshold,
      message: `${metric} (${value}) exceeds threshold (${threshold})`,
      timestamp: new Date()
    };

    // Avoid duplicate alerts
    const recentAlert = this.alerts.find(a => 
      a.metric === metric && 
      a.timestamp.getTime() > Date.now() - 60000 // Last minute
    );

    if (!recentAlert) {
      this.alerts.push(alert);
      console.warn('Performance alert:', alert);
    }
  }

  /**
   * Get performance report
   */
  getPerformanceReport(): {
    metrics: PerformanceMetrics;
    alerts: PerformanceAlert[];
    score: number;
    recommendations: string[];
  } {
    const score = this.calculatePerformanceScore();
    const recommendations = this.generateRecommendations();

    return {
      metrics: this.metrics,
      alerts: this.alerts.slice(-10), // Last 10 alerts
      score,
      recommendations
    };
  }

  /**
   * Calculate performance score
   */
  private calculatePerformanceScore(): number {
    let score = 100;
    
    Object.entries(this.metrics).forEach(([metric, value]) => {
      const threshold = this.thresholds[metric as keyof PerformanceMetrics];
      if (threshold) {
        const ratio = Math.min(value / threshold, 2);
        score -= (ratio - 1) * 20; // Deduct up to 20 points per metric
      }
    });

    return Math.max(0, Math.round(score));
  }

  /**
   * Generate optimization recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.metrics.pageLoadTime > this.thresholds.pageLoadTime) {
      recommendations.push('Optimize images and reduce bundle size to improve page load time');
    }

    if (this.metrics.firstContentfulPaint > this.thresholds.firstContentfulPaint) {
      recommendations.push('Implement lazy loading and optimize critical rendering path');
    }

    if (this.metrics.largestContentfulPaint > this.thresholds.largestContentfulPaint) {
      recommendations.push('Optimize largest content element and reduce server response time');
    }

    if (this.metrics.cumulativeLayoutShift > this.thresholds.cumulativeLayoutShift) {
      recommendations.push('Specify dimensions for images and ads to reduce layout shift');
    }

    if (this.metrics.firstInputDelay > this.thresholds.firstInputDelay) {
      recommendations.push('Reduce JavaScript execution time and break up long tasks');
    }

    if (this.metrics.cacheHitRate < this.thresholds.cacheHitRate) {
      recommendations.push('Implement better caching strategies and increase cache TTL');
    }

    if (this.metrics.apiResponseTime > this.thresholds.apiResponseTime) {
      recommendations.push('Optimize API endpoints and implement response caching');
    }

    if (this.metrics.memoryUsage > this.thresholds.memoryUsage) {
      recommendations.push('Optimize memory usage and implement proper cleanup');
    }

    return recommendations;
  }

  /**
   * Helper methods (would be implemented with actual integration)
   */
  private getCacheHitRate(): number {
    // This would integrate with the cache service
    return 0.85;
  }

  private getAverageApiResponseTime(): number {
    // This would track actual API response times
    return 450;
  }

  /**
   * Track API response time
   */
  trackApiResponseTime(url: string, responseTime: number): void {
    // Update moving average
    this.metrics.apiResponseTime = (this.metrics.apiResponseTime * 0.9) + (responseTime * 0.1);
  }

  /**
   * Track custom metric
   */
  trackCustomMetric(name: string, value: number): void {
    (this.metrics as any)[name] = value;
  }

  /**
   * Clear alerts
   */
  clearAlerts(): void {
    this.alerts = [];
  }

  /**
   * Disconnect observers
   */
  disconnect(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Export singleton instance
export const performanceMonitoringService = new PerformanceMonitoringService();
export default performanceMonitoringService;
```

## 3. CDN Integration Service

### File: `services/cdn/cdnIntegrationService.ts`

```typescript
/**
 * CDN Integration Service
 * 
 * Manages CDN caching and invalidation for static and dynamic content
 */

interface CDNConfig {
  provider: 'cloudflare' | 'aws' | 'custom';
  zoneId?: string;
  apiKey?: string;
  distributionId?: string;
  customEndpoint?: string;
}

interface CacheRule {
  pattern: string;
  ttl: number;
  bypass: boolean;
  headers: Record<string, string>;
}

interface CDNStats {
  requests: number;
  hits: number;
  misses: number;
  bandwidth: number;
  avgResponseTime: number;
}

export class CDNIntegrationService {
  private config: CDNConfig;
  private cacheRules: CacheRule[] = [];

  constructor(config: CDNConfig) {
    this.config = config;
    this.initializeCacheRules();
  }

  /**
   * Initialize default cache rules
   */
  private initializeCacheRules(): void {
    this.cacheRules = [
      {
        pattern: '/api/*',
        ttl: 300, // 5 minutes
        bypass: false,
        headers: {
          'Cache-Control': 'public, max-age=300',
          'X-Cache-Status': 'API'
        }
      },
      {
        pattern: '/static/*',
        ttl: 86400, // 24 hours
        bypass: false,
        headers: {
          'Cache-Control': 'public, max-age=86400, immutable',
          'X-Cache-Status': 'STATIC'
        }
      },
      {
        pattern: '/images/*',
        ttl: 604800, // 7 days
        bypass: false,
        headers: {
          'Cache-Control': 'public, max-age=604800, immutable',
          'X-Cache-Status': 'IMAGES'
        }
      },
      {
        pattern: '/*.html',
        ttl: 3600, // 1 hour
        bypass: false,
        headers: {
          'Cache-Control': 'public, max-age=3600',
          'X-Cache-Status': 'HTML'
        }
      },
      {
        pattern: '/admin/*',
        ttl: 0,
        bypass: true,
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'X-Cache-Status': 'BYPASS'
        }
      }
    ];
  }

  /**
   * Get cache headers for a URL
   */
  getCacheHeaders(url: string): Record<string, string> {
    const rule = this.findMatchingRule(url);
    return rule ? rule.headers : {};
  }

  /**
   * Find matching cache rule
   */
  private findMatchingRule(url: string): CacheRule | null {
    return this.cacheRules.find(rule => this.matchesPattern(url, rule.pattern)) || null;
  }

  /**
   * Check if URL matches pattern
   */
  private matchesPattern(url: string, pattern: string): boolean {
    // Simple pattern matching (can be enhanced)
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      return regex.test(url);
    }
    return url === pattern;
  }

  /**
   * Invalidate CDN cache
   */
  async invalidateCache(urls: string[]): Promise<boolean> {
    try {
      switch (this.config.provider) {
        case 'cloudflare':
          return await this.invalidateCloudflareCache(urls);
        case 'aws':
          return await this.invalidateAWSCache(urls);
        case 'custom':
          return await this.invalidateCustomCache(urls);
        default:
          console.warn('Unknown CDN provider:', this.config.provider);
          return false;
      }
    } catch (error) {
      console.error('CDN cache invalidation error:', error);
      return false;
    }
  }

  /**
   * Invalidate Cloudflare cache
   */
  private async invalidateCloudflareCache(urls: string[]): Promise<boolean> {
    if (!this.config.zoneId || !this.config.apiKey) {
      console.error('Cloudflare configuration missing');
      return false;
    }

    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.config.zoneId}/purge_cache`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            files: urls
          })
        }
      );

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('Cloudflare cache invalidation error:', error);
      return false;
    }
  }

  /**
   * Invalidate AWS CloudFront cache
   */
  private async invalidateAWSCache(urls: string[]): Promise<boolean> {
    if (!this.config.distributionId) {
      console.error('AWS CloudFront configuration missing');
      return false;
    }

    try {
      // This would use AWS SDK
      console.log('AWS CloudFront invalidation for:', urls);
      return true;
    } catch (error) {
      console.error('AWS CloudFront cache invalidation error:', error);
      return false;
    }
  }

  /**
   * Invalidate custom CDN cache
   */
  private async invalidateCustomCache(urls: string[]): Promise<boolean> {
    if (!this.config.customEndpoint) {
      console.error('Custom CDN endpoint missing');
      return false;
    }

    try {
      const response = await fetch(this.config.customEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'invalidate',
          urls
        })
      });

      return response.ok;
    } catch (error) {
      console.error('Custom CDN cache invalidation error:', error);
      return false;
    }
  }

  /**
   * Get CDN statistics
   */
  async getStats(): Promise<CDNStats | null> {
    try {
      switch (this.config.provider) {
        case 'cloudflare':
          return await this.getCloudflareStats();
        case 'aws':
          return await this.getAWSStats();
        case 'custom':
          return await this.getCustomStats();
        default:
          return null;
      }
    } catch (error) {
      console.error('CDN stats error:', error);
      return null;
    }
  }

  /**
   * Get Cloudflare statistics
   */
  private async getCloudflareStats(): Promise<CDNStats | null> {
    if (!this.config.zoneId || !this.config.apiKey) {
      return null;
    }

    try {
      const response = await fetch(
        `https://api.cloudflare.com/client/v4/zones/${this.config.zoneId}/analytics/dashboard`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      const data = await response.json();
      
      return {
        requests: data.result?.totals?.requests?.all || 0,
        hits: data.result?.totals?.requests?.cached || 0,
        misses: data.result?.totals?.requests?.uncached || 0,
        bandwidth: data.result?.totals?.bandwidth?.all || 0,
        avgResponseTime: data.result?.totals?.http_requests?.avg_response_time || 0
      };
    } catch (error) {
      console.error('Cloudflare stats error:', error);
      return null;
    }
  }

  /**
   * Get AWS CloudFront statistics
   */
  private async getAWSStats(): Promise<CDNStats | null> {
    // This would use AWS SDK
    return {
      requests: 0,
      hits: 0,
      misses: 0,
      bandwidth: 0,
      avgResponseTime: 0
    };
  }

  /**
   * Get custom CDN statistics
   */
  private async getCustomStats(): Promise<CDNStats | null> {
    if (!this.config.customEndpoint) {
      return null;
    }

    try {
      const response = await fetch(`${this.config.customEndpoint}/stats`);
      return await response.json();
    } catch (error) {
      console.error('Custom CDN stats error:', error);
      return null;
    }
  }

  /**
   * Warm CDN cache
   */
  async warmCache(urls: string[]): Promise<void> {
    const batchSize = 5;
    
    for (let i = 0; i < urls.length; i += batchSize) {
      const batch = urls.slice(i, i + batchSize);
      
      await Promise.allSettled(
        batch.map(async (url) => {
          try {
            await fetch(url, { method: 'HEAD' });
          } catch (error) {
            console.error(`Cache warming error for ${url}:`, error);
          }
        })
      );

      // Small delay to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  /**
   * Add custom cache rule
   */
  addCacheRule(rule: CacheRule): void {
    this.cacheRules.push(rule);
  }

  /**
   * Remove cache rule
   */
  removeCacheRule(pattern: string): void {
    this.cacheRules = this.cacheRules.filter(rule => rule.pattern !== pattern);
  }

  /**
   * Get all cache rules
   */
  getCacheRules(): CacheRule[] {
    return [...this.cacheRules];
  }
}

// Export singleton instance
export const cdnIntegrationService = new CDNIntegrationService({
  provider: 'cloudflare', // Configure based on your CDN
  zoneId: process.env.CLOUDFLARE_ZONE_ID,
  apiKey: process.env.CLOUDFLARE_API_KEY
});

export default cdnIntegrationService;
```

## 4. Performance Optimization Middleware

### File: `middleware/performanceOptimizationMiddleware.ts`

```typescript
/**
 * Performance Optimization Middleware
 * 
 * Express middleware for performance optimization
 */

import { Request, Response, NextFunction } from 'express';
import { enhancedCacheService } from '../cache/enhancedCacheService';
import { performanceMonitoringService } from '../performance/performanceMonitoringService';
import { cdnIntegrationService } from '../cdn/cdnIntegrationService';

interface PerformanceOptions {
  enableCaching: boolean;
  enableCompression: boolean;
  enableCDN: boolean;
  cacheTtl: number;
  compressionThreshold: number;
}

export const performanceOptimizationMiddleware = (options: PerformanceOptions) => {
  return {
    /**
     * Cache middleware
     */
    cache: async (req: Request, res: Response, next: NextFunction) => {
      if (!options.enableCaching) {
        return next();
      }

      const cacheKey = `cache:${req.method}:${req.originalUrl}`;
      
      try {
        // Try to get from cache
        const cachedResponse = await enhancedCacheService.get(cacheKey);
        
        if (cachedResponse) {
          // Set cache headers
          const headers = cdnIntegrationService.getCacheHeaders(req.originalUrl);
          Object.entries(headers).forEach(([key, value]) => {
            res.setHeader(key, value);
          });

          res.setHeader('X-Cache', 'HIT');
          return res.json(cachedResponse);
        }

        // Intercept response to cache it
        const originalJson = res.json;
        res.json = (data) => {
          // Cache the response
          enhancedCacheService.set(cacheKey, data, {
            ttl: options.cacheTtl,
            tags: ['api', req.path.split('/')[1]]
          });

          // Set cache headers
          const headers = cdnIntegrationService.getCacheHeaders(req.originalUrl);
          Object.entries(headers).forEach(([key, value]) => {
            res.setHeader(key, value);
          });

          res.setHeader('X-Cache', 'MISS');
          return originalJson.call(res, data);
        };

        next();
      } catch (error) {
        console.error('Cache middleware error:', error);
        next();
      }
    },

    /**
     * Compression middleware
     */
    compression: (req: Request, res: Response, next: NextFunction) => {
      if (!options.enableCompression) {
        return next();
      }

      // This would integrate with a compression library
      res.setHeader('X-Compression', 'enabled');
      next();
    },

    /**
     * Performance monitoring middleware
     */
    monitoring: (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();

      // Track response
      const originalSend = res.send;
      res.send = (data) => {
        const responseTime = Date.now() - startTime;
        
        // Track performance metrics
        performanceMonitoringService.trackApiResponseTime(req.originalUrl, responseTime);
        
        // Add performance headers
        res.setHeader('X-Response-Time', responseTime.toString());
        res.setHeader('X-Server-Timestamp', new Date().toISOString());

        return originalSend.call(res, data);
      };

      next();
    },

    /**
     * CDN middleware
     */
    cdn: (req: Request, res: Response, next: NextFunction) => {
      if (!options.enableCDN) {
        return next();
      }

      // Set CDN headers
      const headers = cdnIntegrationService.getCacheHeaders(req.originalUrl);
      Object.entries(headers).forEach(([key, value]) => {
        res.setHeader(key, value);
      });

      next();
    }
  };
};

// Default options
export const defaultPerformanceOptions: PerformanceOptions = {
  enableCaching: true,
  enableCompression: true,
  enableCDN: true,
  cacheTtl: 5 * 60 * 1000, // 5 minutes
  compressionThreshold: 1024 // 1KB
};
```

## Implementation Steps

1. **Install required dependencies**:
   ```bash
   npm install ioredis recharts
   ```

2. **Set up Redis** for distributed caching
3. **Implement the enhanced cache service**
4. **Add performance monitoring**
5. **Configure CDN integration**
6. **Add performance middleware**
7. **Monitor and optimize**

## Performance Targets

- **Page Load Time**: <2 seconds
- **Time to Interactive**: <3 seconds
- **Cache Hit Rate**: >80%
- **API Response Time**: <500ms
- **Memory Usage**: <50MB

## Monitoring and Alerting

1. **Set up performance dashboards**
2. **Configure alert thresholds**
3. **Monitor cache hit rates**
4. **Track API response times**
5. **Optimize based on metrics**

This comprehensive caching and performance optimization system will significantly improve the speed and reliability of the programmatic SEO system.