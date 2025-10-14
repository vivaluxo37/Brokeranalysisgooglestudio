/**
 * Performance Monitoring Service
 * Tracks Core Web Vitals and custom performance metrics
 */

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint
  ttfb: number; // Time to First Byte
  
  // Custom metrics
  pageLoadTime: number;
  domContentLoaded: number;
  renderTime: number;
  apiResponseTime: number;
  bundleSize: number;
  
  // User interactions
  clickToAction: number;
  formSubmitTime: number;
  searchResponseTime: number;
  
  // Resource loading
  imageLoadTime: number;
  scriptLoadTime: number;
  styleLoadTime: number;
}

export interface PerformanceEntry {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url?: string;
}

export interface PerformanceReport {
  url: string;
  userAgent: string;
  timestamp: number;
  metrics: PerformanceMetrics;
  entries: PerformanceEntry[];
  deviceInfo: {
    isMobile: boolean;
    connectionType?: string;
    memory?: number;
    hardwareConcurrency?: number;
  };
  recommendations: string[];
}

interface PageLoadMetric {
  timestamp: number;
  loadTime: number;
  cacheHit: boolean;
  brokerCount: number;
  filters?: number;
  generationTime?: number;
  error?: string;
}

interface RecentPageLoad {
  type: string;
  slug: string;
  loadTime: number;
  cacheHit: boolean;
  timestamp: number;
  brokerCount: number;
  filters?: number;
}

interface CacheAccessStats {
  hits: number;
  misses: number;
  totalTime: number;
  samples: number;
  lastAccess: number;
}

interface PreloadStats {
  count: number;
  totalGenerationTime: number;
  totalBrokerCount: number;
  lastGenerationTime: number;
}

interface BatchPreloadRecord {
  pageCount: number;
  totalTime: number;
  currentPage?: string;
  timestamp: number;
}

interface ErrorLogEntry {
  pageKey: string;
  message: string;
  timestamp: number;
}

class PerformanceMonitoring {
  private isSupported = typeof window !== 'undefined' && 'performance' in window;
  private observer: PerformanceObserver | null = null;
  private metrics: Partial<PerformanceMetrics> = {};
  private entries: PerformanceEntry[] = [];
  private startTimes: Map<string, number> = new Map();
  private readonly MAX_PAGE_HISTORY = 50;
  private readonly REALTIME_WINDOW = 5 * 60 * 1000;
  private readonly MAX_RECENT_PAGES = 50;
  private readonly MAX_ERROR_LOG = 50;
  private pageLoadStartTimes: Map<string, number> = new Map();
  private pageLoadHistory: Map<string, PageLoadMetric[]> = new Map();
  private recentPageLoads: RecentPageLoad[] = [];
  private cacheAccessStats: Map<string, CacheAccessStats> = new Map();
  private preloadStats: Map<string, PreloadStats> = new Map();
  private batchPreloadHistory: BatchPreloadRecord[] = [];
  private errorLog: ErrorLogEntry[] = [];

  constructor() {
    if (this.isSupported) {
      this.initializeObservers();
      this.trackPageLoad();
      this.trackResourceTiming();
    }
  }

  /**
   * Initialize performance observers
   */
  private initializeObservers(): void {
    try {
      // Observe Largest Contentful Paint
      if ('PerformanceObserver' in window) {
        const lcpObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          const lastEntry = entries[entries.length - 1] as PerformanceEntry;
          if (lastEntry) {
            this.metrics.lcp = lastEntry.startTime;
            this.addEntry('lcp', lastEntry.startTime, this.rateLCPLCP(lastEntry.startTime));
          }
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // Observe First Input Delay
        const fidObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (entry.processingStart) {
              this.metrics.fid = entry.processingStart - entry.startTime;
              this.addEntry('fid', this.metrics.fid, this.rateFID(this.metrics.fid));
            }
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // Observe Cumulative Layout Shift
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
              this.metrics.cls = clsValue;
            }
          });
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });

        // Observe navigation timing
        const navObserver = new PerformanceObserver((entryList) => {
          const entries = entryList.getEntries();
          entries.forEach((entry: any) => {
            if (entry.entryType === 'navigation') {
              this.metrics.fcp = entry.loadEventStart - entry.fetchStart;
              this.metrics.ttfb = entry.responseStart - entry.requestStart;
              this.metrics.domContentLoaded = entry.domContentLoadedEventEnd - entry.navigationStart;
              this.metrics.pageLoadTime = entry.loadEventEnd - entry.navigationStart;
            }
          });
        });
        navObserver.observe({ entryTypes: ['navigation'] });
      }
    } catch (error) {
      console.warn('Performance monitoring initialization failed:', error);
    }
  }

  /**
   * Track page load performance
   */
  private trackPageLoad(): void {
    if (!this.isSupported) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          this.metrics.renderTime = navigation.loadEventEnd - navigation.domContentLoadedEventEnd;
          this.metrics.bundleSize = this.calculateBundleSize();
        }
      }, 0);
    });
  }

  /**
   * Track resource loading performance
   */
  private trackResourceTiming(): void {
    if (!this.isSupported) return;

    const observer = new PerformanceObserver((entryList) => {
      const entries = entryList.getEntries();
      entries.forEach((entry: PerformanceResourceTiming) => {
        const loadTime = entry.responseEnd - entry.startTime;
        
        if (entry.initiatorType === 'img') {
          this.addEntry('imageLoad', loadTime, this.rateResourceLoad(loadTime, 'image'));
        } else if (entry.initiatorType === 'script') {
          this.addEntry('scriptLoad', loadTime, this.rateResourceLoad(loadTime, 'script'));
        } else if (entry.initiatorType === 'link' && entry.name.includes('.css')) {
          this.addEntry('styleLoad', loadTime, this.rateResourceLoad(loadTime, 'style'));
        }
      });
    });
    
    try {
      observer.observe({ entryTypes: ['resource'] });
    } catch (e) {
      // Resource timing observer might not be supported
    }
  }

  /**
   * Start tracking a programmatic page load
   */
  startPageLoad(pageKey: string, slug?: string): void {
    const { key } = this.normalizePageKey(pageKey, slug);
    this.pageLoadStartTimes.set(key, Date.now());
  }

  /**
   * Finish tracking a programmatic page load and record metrics
   */
  endPageLoad(
    pageKey: string,
    details: {
      loadTime?: number;
      cacheHit?: boolean;
      brokerCount?: number;
      filters?: number;
      generationTime?: number;
      error?: string;
    } = {}
  ): void {
    const { key, type, slug } = this.normalizePageKey(pageKey);
    const start = this.pageLoadStartTimes.get(key);
    const now = Date.now();
    let loadTime = typeof details.loadTime === 'number' && Number.isFinite(details.loadTime)
      ? details.loadTime
      : start ? now - start : 0;

    if (!Number.isFinite(loadTime) || loadTime < 0) {
      loadTime = 0;
    }

    this.pageLoadStartTimes.delete(key);

    const metric: PageLoadMetric = {
      timestamp: now,
      loadTime,
      cacheHit: Boolean(details.cacheHit),
      brokerCount: typeof details.brokerCount === 'number' ? details.brokerCount : 0,
      filters: details.filters,
      generationTime: details.generationTime,
      error: details.error
    };

    this.recordPageLoadMetric(key, metric);
    this.updateRecentPageLoads({
      type,
      slug,
      loadTime,
      cacheHit: metric.cacheHit,
      timestamp: now,
      brokerCount: metric.brokerCount,
      filters: metric.filters
    });

    if (details.error) {
      this.trackError(key, details.error);
    }
  }

  /**
   * Record cache access performance stats
   */
  trackCacheAccess(pageKey: string, cacheHit: boolean, accessTime: number): void {
    const { key } = this.normalizePageKey(pageKey);
    const stats = this.cacheAccessStats.get(key) || {
      hits: 0,
      misses: 0,
      totalTime: 0,
      samples: 0,
      lastAccess: 0
    };

    if (cacheHit) {
      stats.hits += 1;
    } else {
      stats.misses += 1;
    }

    if (Number.isFinite(accessTime) && accessTime >= 0) {
      stats.totalTime += accessTime;
    }

    stats.samples += 1;
    stats.lastAccess = Date.now();
    this.cacheAccessStats.set(key, stats);
  }

  /**
   * Track individual preload events
   */
  trackPreload(
    pageKey: string,
    data: { generationTime?: number; brokerCount?: number } = {}
  ): void {
    const { key } = this.normalizePageKey(pageKey);
    const stats = this.preloadStats.get(key) || {
      count: 0,
      totalGenerationTime: 0,
      totalBrokerCount: 0,
      lastGenerationTime: 0
    };

    stats.count += 1;

    if (typeof data.generationTime === 'number' && data.generationTime >= 0) {
      stats.totalGenerationTime += data.generationTime;
      stats.lastGenerationTime = data.generationTime;
    }

    if (typeof data.brokerCount === 'number' && data.brokerCount >= 0) {
      stats.totalBrokerCount += data.brokerCount;
    }

    this.preloadStats.set(key, stats);
  }

  /**
   * Track batch preload operations
   */
  trackBatchPreload(batch: { pageCount: number; totalTime: number; currentPage?: string }): void {
    const record: BatchPreloadRecord = {
      pageCount: batch.pageCount,
      totalTime: batch.totalTime,
      currentPage: batch.currentPage,
      timestamp: Date.now()
    };

    this.batchPreloadHistory.push(record);

    if (this.batchPreloadHistory.length > this.MAX_PAGE_HISTORY) {
      this.batchPreloadHistory = this.batchPreloadHistory.slice(-this.MAX_PAGE_HISTORY);
    }
  }

  /**
   * Track errors encountered during programmatic operations
   */
  trackError(pageKey: string, message: string): void {
    if (!message) return;

    const entry: ErrorLogEntry = {
      pageKey: this.normalizePageKey(pageKey).key,
      message,
      timestamp: Date.now()
    };

    this.errorLog.push(entry);

    if (this.errorLog.length > this.MAX_ERROR_LOG) {
      this.errorLog = this.errorLog.slice(-this.MAX_ERROR_LOG);
    }

    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Performance monitoring error for ${entry.pageKey}:`, message);
    }
  }

  /**
   * Retrieve aggregated stats for a specific page
   */
  getPageStats(pageKey: string, slug?: string): {
    pageKey: string;
    pageType: string;
    pageSlug: string;
    avgLoadTime: number;
    p95LoadTime: number;
    p99LoadTime: number;
    cacheHitRate: number;
    totalViews: number;
    avgBrokerCount: number;
    lastLoad?: PageLoadMetric;
    cacheStats?: {
      hits: number;
      misses: number;
      averageTime: number;
      totalTime: number;
      lastAccess: number;
    };
  } | null {
    const { key, type, slug: resolvedSlug } = this.normalizePageKey(pageKey, slug);
    const metrics = this.pageLoadHistory.get(key);

    if (!metrics || metrics.length === 0) {
      return null;
    }

    const loadTimes = metrics
      .map(m => m.loadTime)
      .filter(time => Number.isFinite(time) && time >= 0)
      .sort((a, b) => a - b);

    const sumLoadTimes = loadTimes.reduce((sum, time) => sum + time, 0);
    const avgLoadTime = loadTimes.length ? sumLoadTimes / loadTimes.length : 0;

    const percentile = (p: number) => {
      if (!loadTimes.length) return 0;
      const index = Math.min(loadTimes.length - 1, Math.floor(p * (loadTimes.length - 1)));
      return loadTimes[index];
    };

    const cacheHits = metrics.filter(m => m.cacheHit).length;
    const avgBrokerCount = metrics.reduce((sum, m) => sum + (Number.isFinite(m.brokerCount) ? m.brokerCount : 0), 0) / metrics.length;
    const cacheStats = this.cacheAccessStats.get(key);

    return {
      pageKey: key,
      pageType: type,
      pageSlug: resolvedSlug,
      avgLoadTime: Math.round(avgLoadTime),
      p95LoadTime: Math.round(percentile(0.95)),
      p99LoadTime: Math.round(percentile(0.99)),
      cacheHitRate: metrics.length ? Math.round((cacheHits / metrics.length) * 100) / 100 : 0,
      totalViews: metrics.length,
      avgBrokerCount: Math.round((avgBrokerCount || 0) * 10) / 10,
      lastLoad: metrics[metrics.length - 1],
      cacheStats: cacheStats ? {
        hits: cacheStats.hits,
        misses: cacheStats.misses,
        averageTime: cacheStats.samples ? Math.round((cacheStats.totalTime / cacheStats.samples) * 100) / 100 : 0,
        totalTime: Math.round(cacheStats.totalTime),
        lastAccess: cacheStats.lastAccess
      } : undefined
    };
  }

  /**
   * Get recent real-time performance stats
   */
  getRealtimeStats(): {
    currentLoad: number;
    recentPages: Array<{ type: string; slug: string; loadTime: number; cacheHit: boolean; timestamp: number; brokerCount: number; filters?: number }>;
    systemHealth: 'good' | 'warning' | 'critical';
    recentErrors: ErrorLogEntry[];
  } {
    const now = Date.now();
    const cutoff = now - this.REALTIME_WINDOW;

    this.recentPageLoads = this.recentPageLoads
      .filter(entry => entry.timestamp >= cutoff)
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, this.MAX_RECENT_PAGES);

    const recentPages = [...this.recentPageLoads];
    const avgLoad = recentPages.length
      ? recentPages.reduce((sum, entry) => sum + entry.loadTime, 0) / recentPages.length
      : 0;

    let systemHealth: 'good' | 'warning' | 'critical' = 'good';
    if (avgLoad > 4500) {
      systemHealth = 'critical';
    } else if (avgLoad > 2500) {
      systemHealth = 'warning';
    }

    const recentErrors = this.errorLog.filter(entry => entry.timestamp >= cutoff);
    if (recentErrors.length && systemHealth === 'good') {
      systemHealth = 'warning';
    }

    return {
      currentLoad: recentPages.length,
      recentPages,
      systemHealth,
      recentErrors: recentErrors.slice(-this.MAX_ERROR_LOG)
    };
  }

  /**
   * Start timing an operation
   */
  startTiming(name: string): void {
    this.startTimes.set(name, performance.now());
  }

  /**
   * End timing an operation and record the duration
   */
  endTiming(name: string, metadata?: any): number {
    const startTime = this.startTimes.get(name);
    if (!startTime) return 0;

    const duration = performance.now() - startTime;
    this.startTimes.delete(name);

    this.addEntry(name, duration, this.rateCustomMetric(name, duration));
    
    // Store specific metrics
    switch (name) {
      case 'apiResponse':
        this.metrics.apiResponseTime = duration;
        break;
      case 'clickToAction':
        this.metrics.clickToAction = duration;
        break;
      case 'formSubmit':
        this.metrics.formSubmitTime = duration;
        break;
      case 'searchResponse':
        this.metrics.searchResponseTime = duration;
        break;
    }

    return duration;
  }

  /**
   * Measure the time between two points
   */
  measure(name: string, startMark: string, endMark: string): void {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name, 'measure')[0];
      if (measure) {
        this.addEntry(name, measure.duration, this.rateCustomMetric(name, measure.duration));
      }
    } catch (error) {
      console.warn(`Failed to measure ${name}:`, error);
    }
  }

  /**
   * Create a performance mark
   */
  mark(name: string): void {
    try {
      performance.mark(name);
    } catch (error) {
      console.warn(`Failed to create mark ${name}:`, error);
    }
  }

  /**
   * Add performance entry
   */
  private addEntry(name: string, value: number, rating: 'good' | 'needs-improvement' | 'poor'): void {
    this.entries.push({
      name,
      value,
      rating,
      timestamp: Date.now(),
      url: window.location.href
    });

    // Keep only last 100 entries
    if (this.entries.length > 100) {
      this.entries = this.entries.slice(-100);
    }
  }

  /**
   * Get current performance metrics
   */
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  /**
   * Get performance entries
   */
  getEntries(): PerformanceEntry[] {
    return [...this.entries];
  }

  /**
   * Generate performance report
   */
  generateReport(): PerformanceReport {
    return {
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      metrics: this.metrics as PerformanceMetrics,
      entries: this.entries,
      deviceInfo: this.getDeviceInfo(),
      recommendations: this.generateRecommendations()
    };
  }

  /**
   * Get device information
   */
  private getDeviceInfo() {
    return {
      isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
      connectionType: (navigator as any).connection?.effectiveType,
      memory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency
    };
  }

  /**
   * Generate performance recommendations
   */
  private generateRecommendations(): string[] {
    const recommendations: string[] = [];

    if (this.metrics.lcp && this.metrics.lcp > 2500) {
      recommendations.push('Largest Contentful Paint is slow. Optimize images and server response time.');
    }

    if (this.metrics.fid && this.metrics.fid > 100) {
      recommendations.push('First Input Delay is high. Reduce JavaScript execution time.');
    }

    if (this.metrics.cls && this.metrics.cls > 0.1) {
      recommendations.push('Cumulative Layout Shift is high. Ensure proper image dimensions and avoid layout changes.');
    }

    if (this.metrics.bundleSize && this.metrics.bundleSize > 1024 * 1024) {
      recommendations.push('Bundle size is over 1MB. Consider code splitting and tree shaking.');
    }

    if (this.metrics.apiResponseTime && this.metrics.apiResponseTime > 1000) {
      recommendations.push('API response time is slow. Consider caching and optimization.');
    }

    return recommendations;
  }

  /**
   * Calculate estimated bundle size
   */
  private calculateBundleSize(): number {
    try {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
      const jsResources = resources.filter(r => r.name.includes('.js') || r.name.includes('.mjs'));
      return jsResources.reduce((total, resource) => total + resource.transferSize, 0);
    } catch {
      return 0;
    }
  }

  private normalizePageKey(identifier: string, slug?: string): { key: string; type: string; slug: string } {
    if (slug) {
      return {
        key: `${identifier}:${slug}`,
        type: identifier || 'unknown',
        slug: slug || 'unknown'
      };
    }

    const colonIndex = identifier.indexOf(':');
    if (colonIndex !== -1) {
      const type = identifier.slice(0, colonIndex) || 'unknown';
      const resolvedSlug = identifier.slice(colonIndex + 1) || 'unknown';
      return {
        key: identifier,
        type,
        slug: resolvedSlug
      };
    }

    return {
      key: identifier,
      type: 'unknown',
      slug: identifier
    };
  }

  private recordPageLoadMetric(pageKey: string, metric: PageLoadMetric): void {
    const existing = this.pageLoadHistory.get(pageKey) || [];
    existing.push(metric);

    if (existing.length > this.MAX_PAGE_HISTORY) {
      existing.splice(0, existing.length - this.MAX_PAGE_HISTORY);
    }

    this.pageLoadHistory.set(pageKey, existing);
  }

  private updateRecentPageLoads(load: RecentPageLoad): void {
    this.recentPageLoads.push(load);

    const cutoff = load.timestamp - this.REALTIME_WINDOW;
    if (cutoff > 0) {
      this.recentPageLoads = this.recentPageLoads.filter(entry => entry.timestamp >= cutoff);
    }

    if (this.recentPageLoads.length > this.MAX_RECENT_PAGES) {
      this.recentPageLoads = this.recentPageLoads.slice(-this.MAX_RECENT_PAGES);
    }
  }

  // Rating methods for Core Web Vitals
  private rateLCPLCP(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 2500) return 'good';
    if (value <= 4000) return 'needs-improvement';
    return 'poor';
  }

  private rateFID(value: number): 'good' | 'needs-improvement' | 'poor' {
    if (value <= 100) return 'good';
    if (value <= 300) return 'needs-improvement';
    return 'poor';
  }

  private rateResourceLoad(value: number, type: string): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, { good: number; poor: number }> = {
      image: { good: 500, poor: 2000 },
      script: { good: 300, poor: 1000 },
      style: { good: 200, poor: 800 }
    };

    const threshold = thresholds[type] || { good: 500, poor: 2000 };
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private rateCustomMetric(name: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    // Define thresholds for custom metrics
    const thresholds: Record<string, { good: number; poor: number }> = {
      apiResponse: { good: 200, poor: 1000 },
      clickToAction: { good: 100, poor: 500 },
      formSubmit: { good: 500, poor: 2000 },
      searchResponse: { good: 300, poor: 1500 }
    };

    const threshold = thresholds[name] || { good: 500, poor: 2000 };
    
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Send performance data to analytics
   */
  async sendToAnalytics(endpoint?: string): Promise<void> {
    const report = this.generateReport();
    
    try {
      const url = endpoint || '/api/analytics/performance';
      await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
      });
    } catch (error) {
      console.warn('Failed to send performance data:', error);
    }
  }

  /**
   * Clear all metrics and entries
   */
  clear(): void {
    this.metrics = {};
    this.entries = [];
    this.startTimes.clear();
  }

  /**
   * Get Core Web Vitals summary
   */
  getWebVitals(): {
    lcp: { value: number; rating: string } | null;
    fid: { value: number; rating: string } | null;
    cls: { value: number; rating: string } | null;
    fcp: { value: number; rating: string } | null;
  } {
    return {
      lcp: this.metrics.lcp ? { value: this.metrics.lcp, rating: this.rateLCPLCP(this.metrics.lcp) } : null,
      fid: this.metrics.fid ? { value: this.metrics.fid, rating: this.rateFID(this.metrics.fid) } : null,
      cls: this.metrics.cls ? { value: this.metrics.cls, rating: this.metrics.cls > 0.1 ? 'poor' : this.metrics.cls > 0.025 ? 'needs-improvement' : 'good' } : null,
      fcp: this.metrics.fcp ? { value: this.metrics.fcp, rating: this.rateLCPLCP(this.metrics.fcp) } : null
    };
  }
}

// Create singleton instance
const performanceMonitoring = new PerformanceMonitoring();

export { performanceMonitoring };
export default performanceMonitoring;
