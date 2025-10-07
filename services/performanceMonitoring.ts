/**
 * Performance Monitoring Service
 * Tracks performance metrics for programmatic directory pages
 * including load times, cache hit rates, and user experience metrics
 */

export interface PerformanceMetric {
  id?: string;
  timestamp: number;
  pageType: 'category' | 'country' | 'seo' | 'batch-preload' | string;
  pageSlug: string;
  loadTime: number;
  cacheHit: boolean;
  brokerCount: number;
  filters?: number;
  userAgent?: string;
  viewport?: { width: number; height: number };
  connection?: string;
  isPreload?: boolean;
  isBatchPreload?: boolean;
}

export interface PagePerformanceStats {
  pageType: string;
  pageSlug: string;
  metrics: {
    avgLoadTime: number;
    p95LoadTime: number;
    p99LoadTime: number;
    cacheHitRate: number;
    totalViews: number;
    avgBrokerCount: number;
  };
  trends: {
    loadTimeTrend: number[]; // Last 24 hours
    cacheHitTrend: number[]; // Last 24 hours
  };
}

export interface SystemPerformanceReport {
  overall: {
    avgLoadTime: number;
    cacheHitRate: number;
    totalPages: number;
    totalViews: number;
  };
  byPageType: Record<string, PagePerformanceStats['metrics']>;
  topPerformingPages: Array<{ slug: string; type: string; avgLoadTime: number }>;
  slowestPages: Array<{ slug: string; type: string; avgLoadTime: number }>;
  recommendations: string[];
}

class PerformanceMonitoringService {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 10000; // Keep last 10k metrics
  private aggregationCache = new Map<string, PagePerformanceStats>();
  private lastAggregation = 0;
  private readonly AGGREGATION_INTERVAL = 5 * 60 * 1000; // 5 minutes

  /**
   * Record page load performance
   */
  recordPageLoad(
    pageType: 'category' | 'country' | 'seo',
    pageSlug: string,
    loadTime: number,
    cacheHit: boolean,
    brokerCount: number,
    additionalData?: {
      userAgent?: string;
      viewport?: { width: number; height: number };
      connection?: string;
    }
  ): void {
    const metric: PerformanceMetric = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      pageType,
      pageSlug,
      loadTime,
      cacheHit,
      brokerCount,
      ...additionalData
    };

    this.metrics.push(metric);

    // Maintain metrics size limit
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Trigger aggregation if needed
    if (Date.now() - this.lastAggregation > this.AGGREGATION_INTERVAL) {
      this.aggregateMetrics();
    }

    // Log slow pages immediately
    if (loadTime > 2000) {
      console.warn(`⚠️ Slow page load detected: ${pageType}/${pageSlug} took ${loadTime}ms`);
    }
  }

  /**
   * Get performance statistics for a specific page
   */
  getPageStats(pageType: string, pageSlug: string): PagePerformanceStats | null {
    const cacheKey = `${pageType}:${pageSlug}`;
    
    // Check cache first
    const cached = this.aggregationCache.get(cacheKey);
    if (cached && Date.now() - this.lastAggregation < this.AGGREGATION_INTERVAL) {
      return cached;
    }

    // Calculate fresh stats
    return this.calculatePageStats(pageType, pageSlug);
  }

  /**
   * Get system-wide performance report
   */
  getSystemReport(): SystemPerformanceReport {
    this.aggregateMetrics(); // Ensure fresh data

    const now = Date.now();
    const last24Hours = now - (24 * 60 * 60 * 1000);
    const recentMetrics = this.metrics.filter(m => m.timestamp > last24Hours);

    if (recentMetrics.length === 0) {
      return this.getEmptyReport();
    }

    // Overall metrics
    const avgLoadTime = recentMetrics.reduce((sum, m) => sum + m.loadTime, 0) / recentMetrics.length;
    const cacheHits = recentMetrics.filter(m => m.cacheHit).length;
    const cacheHitRate = cacheHits / recentMetrics.length;

    // Group by page type
    const byPageType: Record<string, PagePerformanceStats['metrics']> = {};
    const pageTypes = ['category', 'country', 'seo'];

    for (const type of pageTypes) {
      const typeMetrics = recentMetrics.filter(m => m.pageType === type);
      if (typeMetrics.length > 0) {
        byPageType[type] = this.calculateMetricsFromArray(typeMetrics);
      }
    }

    // Top and slowest pages
    const pageGroups = this.groupMetricsByPage(recentMetrics);
    const pageStats = Object.entries(pageGroups).map(([key, metrics]) => {
      const [type, slug] = key.split(':');
      const avgTime = metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length;
      return { slug, type, avgLoadTime: avgTime };
    });

    const topPerformingPages = pageStats
      .sort((a, b) => a.avgLoadTime - b.avgLoadTime)
      .slice(0, 5);

    const slowestPages = pageStats
      .sort((a, b) => b.avgLoadTime - a.avgLoadTime)
      .slice(0, 5);

    // Generate recommendations
    const recommendations = this.generateRecommendations(recentMetrics, byPageType);

    return {
      overall: {
        avgLoadTime: Math.round(avgLoadTime),
        cacheHitRate: Math.round(cacheHitRate * 100) / 100,
        totalPages: new Set(recentMetrics.map(m => `${m.pageType}:${m.pageSlug}`)).size,
        totalViews: recentMetrics.length
      },
      byPageType,
      topPerformingPages,
      slowestPages,
      recommendations
    };
  }

  /**
   * Calculate statistics from metrics array
   */
  private calculateMetricsFromArray(metrics: PerformanceMetric[]): PagePerformanceStats['metrics'] {
    const loadTimes = metrics.map(m => m.loadTime).sort((a, b) => a - b);
    const cacheHits = metrics.filter(m => m.cacheHit).length;

    return {
      avgLoadTime: Math.round(metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length),
      p95LoadTime: Math.round(loadTimes[Math.floor(loadTimes.length * 0.95)] || 0),
      p99LoadTime: Math.round(loadTimes[Math.floor(loadTimes.length * 0.99)] || 0),
      cacheHitRate: Math.round((cacheHits / metrics.length) * 100) / 100,
      totalViews: metrics.length,
      avgBrokerCount: Math.round(metrics.reduce((sum, m) => sum + m.brokerCount, 0) / metrics.length)
    };
  }

  /**
   * Calculate page-specific statistics
   */
  private calculatePageStats(pageType: string, pageSlug: string): PagePerformanceStats | null {
    const pageMetrics = this.metrics.filter(m => 
      m.pageType === pageType && m.pageSlug === pageSlug
    );

    if (pageMetrics.length === 0) {
      return null;
    }

    const metrics = this.calculateMetricsFromArray(pageMetrics);
    const trends = this.calculateTrends(pageMetrics);

    const stats: PagePerformanceStats = {
      pageType,
      pageSlug,
      metrics,
      trends
    };

    // Cache the result
    this.aggregationCache.set(`${pageType}:${pageSlug}`, stats);
    
    return stats;
  }

  /**
   * Calculate performance trends
   */
  private calculateTrends(metrics: PerformanceMetric[]): PagePerformanceStats['trends'] {
    const now = Date.now();
    const hourMs = 60 * 60 * 1000;
    const loadTimeTrend: number[] = [];
    const cacheHitTrend: number[] = [];

    // Calculate hourly averages for last 24 hours
    for (let i = 23; i >= 0; i--) {
      const hourStart = now - (i * hourMs);
      const hourEnd = hourStart + hourMs;
      
      const hourMetrics = metrics.filter(m => 
        m.timestamp >= hourStart && m.timestamp < hourEnd
      );

      if (hourMetrics.length > 0) {
        const avgLoadTime = hourMetrics.reduce((sum, m) => sum + m.loadTime, 0) / hourMetrics.length;
        const cacheHits = hourMetrics.filter(m => m.cacheHit).length;
        const hitRate = cacheHits / hourMetrics.length;

        loadTimeTrend.push(Math.round(avgLoadTime));
        cacheHitTrend.push(Math.round(hitRate * 100) / 100);
      } else {
        loadTimeTrend.push(0);
        cacheHitTrend.push(0);
      }
    }

    return { loadTimeTrend, cacheHitTrend };
  }

  /**
   * Group metrics by page
   */
  private groupMetricsByPage(metrics: PerformanceMetric[]): Record<string, PerformanceMetric[]> {
    const groups: Record<string, PerformanceMetric[]> = {};
    
    for (const metric of metrics) {
      const key = `${metric.pageType}:${metric.pageSlug}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(metric);
    }

    return groups;
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(
    metrics: PerformanceMetric[],
    byPageType: Record<string, PagePerformanceStats['metrics']>
  ): string[] {
    const recommendations: string[] = [];

    // Overall cache hit rate
    const cacheHitRate = metrics.filter(m => m.cacheHit).length / metrics.length;
    if (cacheHitRate < 0.6) {
      recommendations.push('Cache hit rate is low (< 60%). Consider increasing cache TTL or pre-warming popular pages.');
    }

    // Page load times
    const avgLoadTime = metrics.reduce((sum, m) => sum + m.loadTime, 0) / metrics.length;
    if (avgLoadTime > 1500) {
      recommendations.push('Average page load time is high (> 1.5s). Consider optimizing broker filtering logic.');
    }

    // Page type performance
    for (const [type, stats] of Object.entries(byPageType)) {
      if (stats.avgLoadTime > 2000) {
        recommendations.push(`${type} pages are loading slowly (${stats.avgLoadTime}ms avg). Consider specialized optimization.`);
      }
      
      if (stats.cacheHitRate < 0.5) {
        recommendations.push(`${type} pages have low cache hit rate (${Math.round(stats.cacheHitRate * 100)}%). Review caching strategy.`);
      }
    }

    // Broker count correlation
    const highBrokerCountPages = metrics.filter(m => m.brokerCount > 50);
    if (highBrokerCountPages.length > 0) {
      const avgHighLoadTime = highBrokerCountPages.reduce((sum, m) => sum + m.loadTime, 0) / highBrokerCountPages.length;
      if (avgHighLoadTime > avgLoadTime * 1.5) {
        recommendations.push('Pages with high broker counts are significantly slower. Consider pagination or virtual scrolling.');
      }
    }

    if (recommendations.length === 0) {
      recommendations.push('Performance is within acceptable ranges. Continue monitoring.');
    }

    return recommendations;
  }

  /**
   * Get empty report structure
   */
  private getEmptyReport(): SystemPerformanceReport {
    return {
      overall: {
        avgLoadTime: 0,
        cacheHitRate: 0,
        totalPages: 0,
        totalViews: 0
      },
      byPageType: {},
      topPerformingPages: [],
      slowestPages: [],
      recommendations: ['No performance data available yet.']
    };
  }

  /**
   * Aggregate metrics periodically
   */
  private aggregateMetrics(): void {
    this.lastAggregation = Date.now();
    
    // Clear old cache entries
    this.aggregationCache.clear();
    
    // Could implement more sophisticated aggregation here
    console.log(`📊 Aggregated ${this.metrics.length} performance metrics`);
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(format: 'json' | 'csv' = 'json'): string {
    if (format === 'csv') {
      const headers = ['timestamp', 'pageType', 'pageSlug', 'loadTime', 'cacheHit', 'brokerCount'];
      const rows = this.metrics.map(m => [
        m.timestamp,
        m.pageType,
        m.pageSlug,
        m.loadTime,
        m.cacheHit,
        m.brokerCount
      ]);
      
      return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    }
    
    return JSON.stringify(this.metrics, null, 2);
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    this.aggregationCache.clear();
    this.lastAggregation = 0;
  }

  /**
   * Get real-time performance stats
   */
  getRealtimeStats(): {
    currentLoad: number;
    recentPages: Array<{ type: string; slug: string; loadTime: number; timestamp: number }>;
    systemHealth: 'good' | 'warning' | 'critical';
  } {
    const now = Date.now();
    const last5Minutes = now - (5 * 60 * 1000);
    const recentMetrics = this.metrics.filter(m => m.timestamp > last5Minutes);
    
    const recentPages = recentMetrics
      .slice(-10)
      .map(m => ({
        type: m.pageType,
        slug: m.pageSlug,
        loadTime: m.loadTime,
        timestamp: m.timestamp
      }));

    const avgRecentLoadTime = recentMetrics.length > 0 
      ? recentMetrics.reduce((sum, m) => sum + m.loadTime, 0) / recentMetrics.length
      : 0;

    let systemHealth: 'good' | 'warning' | 'critical' = 'good';
    if (avgRecentLoadTime > 3000) {
      systemHealth = 'critical';
    } else if (avgRecentLoadTime > 1500) {
      systemHealth = 'warning';
    }

    return {
      currentLoad: recentMetrics.length,
      recentPages,
      systemHealth
    };
  }

  /**
   * Track preload performance
   */
  trackPreload(pageKey: string, metadata: {
    generationTime: number;
    brokerCount: number;
  }): void {
    const [pageType, pageSlug] = pageKey.split(':');
    this.metrics.push({
      pageType,
      pageSlug,
      loadTime: metadata.generationTime,
      cacheHit: false,
      brokerCount: metadata.brokerCount,
      filters: 0,
      timestamp: Date.now(),
      isPreload: true
    });
  }

  /**
   * Track batch preload performance
   */
  trackBatchPreload(metadata: {
    pageCount: number;
    totalTime: number;
    currentPage: string;
  }): void {
    // Record batch preload as a special metric
    this.metrics.push({
      pageType: 'batch-preload',
      pageSlug: metadata.currentPage,
      loadTime: metadata.totalTime,
      cacheHit: false,
      brokerCount: metadata.pageCount,
      filters: 0,
      timestamp: Date.now(),
      isBatchPreload: true
    });
  }
}

// Create singleton instance
export const performanceMonitoring = new PerformanceMonitoringService();

// React hook for performance monitoring
export const usePerformanceMonitoring = () => {
  return {
    recordPageLoad: performanceMonitoring.recordPageLoad.bind(performanceMonitoring),
    getPageStats: performanceMonitoring.getPageStats.bind(performanceMonitoring),
    getSystemReport: performanceMonitoring.getSystemReport.bind(performanceMonitoring),
    getRealtimeStats: performanceMonitoring.getRealtimeStats.bind(performanceMonitoring),
    exportMetrics: performanceMonitoring.exportMetrics.bind(performanceMonitoring)
  };
};

export default performanceMonitoring;