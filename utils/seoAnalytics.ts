// SEO Performance Tracking and Analytics

interface SEOAnalyticsEvent {
  event: string;
  timestamp: number;
  url: string;
  userAgent?: string;
  referrer?: string;
  metadata?: Record<string, any>;
}

interface SEOPerformanceMetrics {
  pageLoadTime: number;
  timeToFirstByte: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  organicSearch: boolean;
  searchKeywords?: string;
  landingPage: string;
  bounceRate: number;
  sessionDuration: number;
  pagesPerSession: number;
}

interface SEORankingData {
  keyword: string;
  position: number;
  url: string;
  clickThroughRate: number;
  impressions: number;
  date: string;
}

interface BacklinkData {
  sourceUrl: string;
  targetUrl: string;
  anchorText: string;
  domainAuthority: number;
  follow: boolean;
  discoveredDate: string;
}

/**
 * SEO Performance Tracker
 */
export class SEOPerformanceTracker {
  private events: SEOAnalyticsEvent[] = [];
  private metrics: SEOPerformanceMetrics[] = [];
  private rankings: SEORankingData[] = [];
  private backlinks: BacklinkData[] = [];

  constructor() {
    this.initializeTracking();
  }

  /**
   * Initialize SEO tracking
   */
  private initializeTracking(): void {
    // Track page views
    this.trackPageView();

    // Track search engine traffic
    this.trackSearchTraffic();

    // Monitor Core Web Vitals
    this.monitorCoreWebVitals();

    // Track scroll depth
    this.trackScrollDepth();

    // Track outbound links
    this.trackOutboundLinks();

    // Track social shares
    this.trackSocialShares();
  }

  /**
   * Track page views with SEO metadata
   */
  public trackPageView(): void {
    const event: SEOAnalyticsEvent = {
      event: 'page_view',
      timestamp: Date.now(),
      url: window.location.href,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      metadata: {
        title: document.title,
        metaDescription: this.getMetaDescription(),
        canonicalUrl: this.getCanonicalUrl(),
        structuredData: this.getStructuredDataCount(),
        wordCount: this.getWordCount(),
        headingCount: this.getHeadingCount()
      }
    };

    this.trackEvent(event);
  }

  /**
   * Track search engine traffic
   */
  private trackSearchTraffic(): void {
    const referrer = document.referrer;
    if (!referrer) return;

    const searchEngines = [
      { name: 'google', pattern: /google\./ },
      { name: 'bing', pattern: /bing\./ },
      { name: 'yahoo', pattern: /yahoo\./ },
      { name: 'duckduckgo', pattern: /duckduckgo\./ },
      { name: 'baidu', pattern: /baidu\./ },
      { name: 'yandex', pattern: /yandex\./ }
    ];

    const searchEngine = searchEngines.find(engine => engine.pattern.test(referrer));
    if (searchEngine) {
      const searchParams = new URL(referrer).searchParams;
      const keywords = searchParams.get('q') || searchParams.get('p') || '';

      this.trackEvent({
        event: 'search_traffic',
        timestamp: Date.now(),
        url: window.location.href,
        referrer,
        metadata: {
          searchEngine: searchEngine.name,
          keywords,
          organic: true
        }
      });
    }
  }

  /**
   * Monitor Core Web Vitals
   */
  private monitorCoreWebVitals(): void {
    if ('PerformanceObserver' in window) {
      // Largest Contentful Paint
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lcp = entries[entries.length - 1];

        this.trackEvent({
          event: 'core_web_vital',
          timestamp: Date.now(),
          url: window.location.href,
          metadata: {
            metric: 'LCP',
            value: lcp.startTime,
            target: lcp.element
          }
        });
      }).observe({ entryTypes: ['largest-contentful-paint'] });

      // First Input Delay
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach(entry => {
          if (entry instanceof PerformanceEventTiming) {
            this.trackEvent({
              event: 'core_web_vital',
              timestamp: Date.now(),
              url: window.location.href,
              metadata: {
                metric: 'FID',
                value: entry.processingStart - entry.startTime,
                eventType: entry.name
              }
            });
          }
        });
      }).observe({ entryTypes: ['first-input'] });

      // Cumulative Layout Shift
      let clsValue = 0;
      new PerformanceObserver((entryList) => {
        entryList.getEntries().forEach(entry => {
          if (entry && !entry.hadRecentInput) {
            clsValue += (entry as any).value;
            this.trackEvent({
              event: 'core_web_vital',
              timestamp: Date.now(),
              url: window.location.href,
              metadata: {
                metric: 'CLS',
                value: clsValue,
                sources: (entry as any).sources
              }
            });
          }
        });
      }).observe({ entryTypes: ['layout-shift'] });
    }
  }

  /**
   * Track scroll depth
   */
  private trackScrollDepth(): void {
    let maxScroll = 0;
    const scrollThresholds = [25, 50, 75, 90];

    const handleScroll = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      if (scrollPercent > maxScroll) {
        maxScroll = scrollPercent;

        scrollThresholds.forEach(threshold => {
          if (scrollPercent >= threshold && !this.hasTrackedScrollDepth(threshold)) {
            this.trackEvent({
              event: 'scroll_depth',
              timestamp: Date.now(),
              url: window.location.href,
              metadata: {
                depth: threshold
              }
            });
          }
        });
      }
    };

    window.addEventListener('scroll', this.debounce(handleScroll, 100));
  }

  /**
   * Track outbound links
   */
  private trackOutboundLinks(): void {
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href && !link.href.includes(window.location.hostname)) {
        this.trackEvent({
          event: 'outbound_click',
          timestamp: Date.now(),
          url: window.location.href,
          metadata: {
            destination: link.href,
            linkText: link.textContent?.trim(),
            linkType: this.getLinkType(link.href)
          }
        });
      }
    });
  }

  /**
   * Track social shares
   */
  private trackSocialShares(): void {
    const socialPlatforms = [
      { name: 'twitter', pattern: /twitter\.com\/intent\/tweet/ },
      { name: 'facebook', pattern: /facebook\.com\/sharer/ },
      { name: 'linkedin', pattern: /linkedin\.com\/share/ },
      { name: 'reddit', pattern: /reddit\.com\/submit/ }
    ];

    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a');

      if (link && link.href) {
        const platform = socialPlatforms.find(p => p.pattern.test(link.href));
        if (platform) {
          this.trackEvent({
            event: 'social_share',
            timestamp: Date.now(),
            url: window.location.href,
            metadata: {
              platform: platform.name,
              sharedUrl: link.href
            }
          });
        }
      }
    });
  }

  /**
   * Track custom SEO events
   */
  public trackCustomEvent(event: string, metadata?: Record<string, any>): void {
    this.trackEvent({
      event,
      timestamp: Date.now(),
      url: window.location.href,
      metadata
    });
  }

  /**
   * Track SEO ranking changes
   */
  public trackRanking(keyword: string, position: number, url: string): void {
    const ranking: SEORankingData = {
      keyword,
      position,
      url,
      clickThroughRate: 0,
      impressions: 0,
      date: new Date().toISOString().split('T')[0]
    };

    this.rankings.push(ranking);
    this.saveToLocalStorage();
  }

  /**
   * Track backlinks
   */
  public trackBacklink(backlink: BacklinkData): void {
    this.backlinks.push(backlink);
    this.saveToLocalStorage();
  }

  /**
   * Get SEO performance report
   */
  public getPerformanceReport(): {
    events: SEOAnalyticsEvent[];
    metrics: SEOPerformanceMetrics[];
    rankings: SEORankingData[];
    backlinks: BacklinkData[];
    summary: {
      totalEvents: number;
      organicTraffic: number;
      averageCoreWebVitals: Record<string, number>;
      topPages: Array<{ url: string; views: number }>;
      topKeywords: Array<{ keyword: string; avgPosition: number }>;
    };
  } {
    const organicTraffic = this.events.filter(e =>
      e.event === 'search_traffic' && e.metadata?.organic
    ).length;

    const pageViews = this.events.filter(e => e.event === 'page_view');
    const pageViewCounts = pageViews.reduce((acc, event) => {
      acc[event.url] = (acc[event.url] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const topPages = Object.entries(pageViewCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([url, views]) => ({ url, views }));

    const keywordPositions = this.rankings.reduce((acc, ranking) => {
      if (!acc[ranking.keyword]) {
        acc[ranking.keyword] = [];
      }
      acc[ranking.keyword].push(ranking.position);
      return acc;
    }, {} as Record<string, number[]>);

    const topKeywords = Object.entries(keywordPositions)
      .map(([keyword, positions]) => ({
        keyword,
        avgPosition: positions.reduce((sum, pos) => sum + pos, 0) / positions.length
      }))
      .sort((a, b) => a.avgPosition - b.avgPosition)
      .slice(0, 10);

    return {
      events: this.events,
      metrics: this.metrics,
      rankings: this.rankings,
      backlinks: this.backlinks,
      summary: {
        totalEvents: this.events.length,
        organicTraffic,
        averageCoreWebVitals: this.calculateAverageCoreWebVitals(),
        topPages,
        topKeywords
      }
    };
  }

  /**
   * Export analytics data
   */
  public exportData(format: 'json' | 'csv' = 'json'): string {
    const report = this.getPerformanceReport();

    if (format === 'json') {
      return JSON.stringify(report, null, 2);
    }

    if (format === 'csv') {
      // Convert events to CSV
      const headers = ['Event', 'Timestamp', 'URL', 'Metadata'];
      const rows = report.events.map(event => [
        event.event,
        new Date(event.timestamp).toISOString(),
        event.url,
        JSON.stringify(event.metadata || {})
      ]);

      return [headers, ...rows]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
    }

    return '';
  }

  /**
   * Clear analytics data
   */
  public clearData(): void {
    this.events = [];
    this.metrics = [];
    this.rankings = [];
    this.backlinks = [];
    localStorage.removeItem('seo_analytics_events');
    localStorage.removeItem('seo_analytics_rankings');
    localStorage.removeItem('seo_analytics_backlinks');
  }

  /**
   * Private helper methods
   */
  private trackEvent(event: SEOAnalyticsEvent): void {
    this.events.push(event);

    // Keep only last 1000 events to prevent memory issues
    if (this.events.length > 1000) {
      this.events = this.events.slice(-1000);
    }

    this.saveToLocalStorage();
  }

  private getMetaDescription(): string {
    const meta = document.querySelector('meta[name="description"]');
    return meta?.getAttribute('content') || '';
  }

  private getCanonicalUrl(): string {
    const link = document.querySelector('link[rel="canonical"]');
    return link?.getAttribute('href') || window.location.href;
  }

  private getStructuredDataCount(): number {
    return document.querySelectorAll('script[type="application/ld+json"]').length;
  }

  private getWordCount(): number {
    return document.body.innerText.split(/\s+/).length;
  }

  private getHeadingCount(): Record<string, number> {
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const count: Record<string, number> = {};

    headings.forEach(heading => {
      const level = heading.tagName.toLowerCase();
      count[level] = (count[level] || 0) + 1;
    });

    return count;
  }

  private hasTrackedScrollDepth(depth: number): boolean {
    return this.events.some(event =>
      event.event === 'scroll_depth' && event.metadata?.depth === depth
    );
  }

  private getLinkType(href: string): string {
    if (href.includes('broker')) return 'broker';
    if (href.includes('blog')) return 'blog';
    if (href.includes('compare')) return 'comparison';
    return 'external';
  }

  private calculateAverageCoreWebVitals(): Record<string, number> {
    const vitals = this.events.filter(e => e.event === 'core_web_vital');
    const metrics: Record<string, number[]> = {};

    vitals.forEach(vital => {
      const metric = vital.metadata?.metric;
      const value = vital.metadata?.value;

      if (metric && typeof value === 'number') {
        if (!metrics[metric]) {
          metrics[metric] = [];
        }
        metrics[metric].push(value);
      }
    });

    const averages: Record<string, number> = {};
    Object.entries(metrics).forEach(([metric, values]) => {
      averages[metric] = values.reduce((sum, val) => sum + val, 0) / values.length;
    });

    return averages;
  }

  private debounce(func: Function, wait: number): Function {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }

  private saveToLocalStorage(): void {
    try {
      localStorage.setItem('seo_analytics_events', JSON.stringify(this.events));
      localStorage.setItem('seo_analytics_rankings', JSON.stringify(this.rankings));
      localStorage.setItem('seo_analytics_backlinks', JSON.stringify(this.backlinks));
    } catch (error) {
      console.warn('Failed to save SEO analytics to localStorage:', error);
    }
  }

  private loadFromLocalStorage(): void {
    try {
      const savedEvents = localStorage.getItem('seo_analytics_events');
      const savedRankings = localStorage.getItem('seo_analytics_rankings');
      const savedBacklinks = localStorage.getItem('seo_analytics_backlinks');

      if (savedEvents) {
        this.events = JSON.parse(savedEvents);
      }
      if (savedRankings) {
        this.rankings = JSON.parse(savedRankings);
      }
      if (savedBacklinks) {
        this.backlinks = JSON.parse(savedBacklinks);
      }
    } catch (error) {
      console.warn('Failed to load SEO analytics from localStorage:', error);
    }
  }
}

// Export singleton instance
export const seoTracker = new SEOPerformanceTracker();

// Export types
export type {
  SEOAnalyticsEvent,
  SEOPerformanceMetrics,
  SEORankingData,
  BacklinkData
};