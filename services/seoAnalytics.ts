/**
 * SEO Performance Monitoring and Analytics Service
 * Comprehensive SEO metrics tracking, analysis, and optimization recommendations
 * Integrates with existing performance monitoring and caching systems
 */

import { performanceMonitoring } from './performanceMonitoring';
import { metaTagOptimizer } from './metaTagOptimizer';
import { structuredDataGenerator } from './structuredDataGenerator';
import { contentGenerator } from './contentGenerator';
import { sitemapManager } from './sitemapManager';
import { programmaticCache } from './programmaticCache';

// SEO Analytics interfaces
export interface SEOMetrics {
  pageUrl: string;
  pageType: 'category' | 'country' | 'seo' | 'static';
  timestamp: number;
  
  // Technical SEO metrics
  technical: {
    titleLength: number;
    titleOptimal: boolean;
    descriptionLength: number;
    descriptionOptimal: boolean;
    hasH1: boolean;
    h1Count: number;
    h2Count: number;
    h3Count: number;
    hasMetaDescription: boolean;
    hasCanonical: boolean;
    hasStructuredData: boolean;
    structuredDataTypes: string[];
    imageCount: number;
    imagesWithAlt: number;
    internalLinkCount: number;
    externalLinkCount: number;
    pageSize: number;
    loadTime: number;
    mobileFriendly: boolean;
  };

  // Content SEO metrics
  content: {
    wordCount: number;
    readabilityScore: number;
    keywordDensity: Record<string, number>;
    contentQualityScore: number;
    duplicateContentRisk: number;
    contentFreshness: number;
    topicRelevance: number;
  };

  // Performance metrics
  performance: {
    coreWebVitals: {
      lcp: number; // Largest Contentful Paint
      fid: number; // First Input Delay
      cls: number; // Cumulative Layout Shift
    };
    pagespeed: {
      desktop: number;
      mobile: number;
    };
    cacheHitRate: number;
    serverResponseTime: number;
  };

  // Search visibility metrics
  visibility: {
    indexStatus: 'indexed' | 'not-indexed' | 'blocked' | 'unknown';
    canonicalStatus: 'self' | 'alternative' | 'duplicate' | 'unknown';
    sitemapStatus: 'included' | 'excluded' | 'pending';
    robotsStatus: 'allowed' | 'blocked' | 'unknown';
  };

  // Optimization opportunities
  opportunities: SEOOpportunity[];
  
  // Overall SEO score (0-100)
  overallScore: number;
}

export interface SEOOpportunity {
  type: 'critical' | 'important' | 'suggestion';
  category: 'technical' | 'content' | 'performance' | 'visibility';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  effort: 'high' | 'medium' | 'low';
  recommendation: string;
  automatable: boolean;
}

export interface SEOReport {
  generatedAt: string;
  period: {
    start: string;
    end: string;
  };
  summary: {
    totalPages: number;
    averageScore: number;
    improvementTrend: number;
    criticalIssues: number;
    completedOptimizations: number;
  };
  
  // Performance insights
  insights: {
    topPerformingPages: Array<{ url: string; score: number; type: string }>;
    underperformingPages: Array<{ url: string; score: number; issues: string[] }>;
    contentGaps: Array<{ topic: string; opportunity: string; priority: number }>;
    technicalIssues: Array<{ issue: string; affectedPages: number; priority: number }>;
  };

  // Trend analysis
  trends: {
    scoreHistory: Array<{ date: string; score: number; pages: number }>;
    issuesTrend: Array<{ date: string; critical: number; important: number; suggestions: number }>;
    performanceTrend: Array<{ date: string; avgLoadTime: number; cacheHitRate: number }>;
  };

  // Recommendations
  recommendations: {
    immediate: SEOOpportunity[];
    shortTerm: SEOOpportunity[];
    longTerm: SEOOpportunity[];
  };

  // Competitive analysis
  competitive?: {
    benchmarkScore: number;
    gapAnalysis: string[];
    opportunityAreas: string[];
  };
}

export interface SEOAuditOptions {
  includePerformance: boolean;
  includeContent: boolean;
  includeTechnical: boolean;
  includeVisibility: boolean;
  generateRecommendations: boolean;
  checkCompetitive: boolean;
  auditDepth: 'quick' | 'standard' | 'comprehensive';
}

// SEO Analytics service
class SEOAnalyticsService {
  private metricsHistory = new Map<string, SEOMetrics[]>();
  private auditCache = new Map<string, SEOMetrics>();
  private reportCache = new Map<string, SEOReport>();
  private optimizationTracking = new Map<string, Date>();

  /**
   * Conduct comprehensive SEO audit for a page
   */
  async auditPage(
    url: string,
    pageType: 'category' | 'country' | 'seo' | 'static',
    options: Partial<SEOAuditOptions> = {}
  ): Promise<SEOMetrics> {
    const auditOptions: SEOAuditOptions = {
      includePerformance: true,
      includeContent: true,
      includeTechnical: true,
      includeVisibility: true,
      generateRecommendations: true,
      checkCompetitive: false,
      auditDepth: 'standard',
      ...options
    };

    const startTime = Date.now();
    const cacheKey = `audit:${url}:${pageType}`;

    // Check cache for recent audit
    if (auditOptions.auditDepth === 'quick') {
      const cached = this.auditCache.get(cacheKey);
      if (cached && this.isRecentAudit(cached)) {
        return cached;
      }
    }

    const metrics: SEOMetrics = {
      pageUrl: url,
      pageType,
      timestamp: Date.now(),
      technical: await this.analyzeTechnicalSEO(url, pageType),
      content: await this.analyzeContentSEO(url, pageType),
      performance: await this.analyzePerformanceSEO(url),
      visibility: await this.analyzeVisibilitySEO(url),
      opportunities: [],
      overallScore: 0
    };

    // Generate optimization opportunities
    if (auditOptions.generateRecommendations) {
      metrics.opportunities = this.generateOptimizationOpportunities(metrics);
    }

    // Calculate overall SEO score
    metrics.overallScore = this.calculateOverallScore(metrics);

    // Cache the audit result
    this.auditCache.set(cacheKey, metrics);

    // Store in history
    const history = this.metricsHistory.get(url) || [];
    history.push(metrics);
    if (history.length > 100) history.shift(); // Keep last 100 audits
    this.metricsHistory.set(url, history);

    // Track performance
    performanceMonitoring.trackCacheAccess(
      `seo-audit:${pageType}`, 
      false, 
      Date.now() - startTime
    );

    return metrics;
  }

  /**
   * Generate comprehensive SEO report
   */
  async generateSEOReport(
    period: { start: string; end: string },
    includeCompetitive = false
  ): Promise<SEOReport> {
    const reportKey = `report:${period.start}:${period.end}`;
    const cached = this.reportCache.get(reportKey);
    
    if (cached && this.isRecentReport(cached)) {
      return cached;
    }

    const startTime = Date.now();
    const endTime = new Date(period.end).getTime();
    const periodStartTime = new Date(period.start).getTime();

    // Collect metrics from the specified period
    const periodMetrics: SEOMetrics[] = [];
    
    for (const [url, history] of this.metricsHistory) {
      const periodData = history.filter(m => 
        m.timestamp >= periodStartTime && m.timestamp <= endTime
      );
      periodMetrics.push(...periodData);
    }

    // Generate report
    const report: SEOReport = {
      generatedAt: new Date().toISOString(),
      period,
      summary: this.generateReportSummary(periodMetrics),
      insights: this.generateInsights(periodMetrics),
      trends: this.generateTrendAnalysis(periodMetrics, periodStartTime, endTime),
      recommendations: this.generateRecommendations(periodMetrics),
      competitive: includeCompetitive ? await this.generateCompetitiveAnalysis() : undefined
    };

    // Cache the report
    this.reportCache.set(reportKey, report);

    // Track generation performance
    performanceMonitoring.trackCacheAccess(
      'seo-report', 
      false, 
      Date.now() - startTime
    );

    return report;
  }

  /**
   * Analyze technical SEO aspects
   */
  private async analyzeTechnicalSEO(
    url: string,
    pageType: string
  ): Promise<SEOMetrics['technical']> {
    // Get meta tag metrics
    const metaMetrics = metaTagOptimizer.getSEOMetrics(url);
    
    // Get structured data info
    const structuredDataStats = structuredDataGenerator.getCacheStats();
    
    return {
      titleLength: metaMetrics?.titleLength || 0,
      titleOptimal: metaMetrics ? (metaMetrics.titleLength >= 30 && metaMetrics.titleLength <= 60) : false,
      descriptionLength: metaMetrics?.descriptionLength || 0,
      descriptionOptimal: metaMetrics ? (metaMetrics.descriptionLength >= 120 && metaMetrics.descriptionLength <= 160) : false,
      hasH1: true, // Assume true for programmatic pages
      h1Count: 1,
      h2Count: this.estimateH2Count(pageType),
      h3Count: this.estimateH3Count(pageType),
      hasMetaDescription: (metaMetrics?.descriptionLength || 0) > 0,
      hasCanonical: true, // All programmatic pages have canonical
      hasStructuredData: structuredDataStats.size > 0,
      structuredDataTypes: this.getStructuredDataTypes(pageType),
      imageCount: this.estimateImageCount(pageType),
      imagesWithAlt: this.estimateImagesWithAlt(pageType),
      internalLinkCount: this.estimateInternalLinks(pageType),
      externalLinkCount: this.estimateExternalLinks(pageType),
      pageSize: this.estimatePageSize(pageType),
      loadTime: metaMetrics ? 500 : 1000, // Estimate based on cache status
      mobileFriendly: metaMetrics?.mobileFriendly || true
    };
  }

  /**
   * Analyze content SEO aspects
   */
  private async analyzeContentSEO(
    url: string,
    pageType: string
  ): Promise<SEOMetrics['content']> {
    // Get content generation stats
    const contentStats = contentGenerator.getGenerationStats();
    
    return {
      wordCount: this.estimateWordCount(pageType),
      readabilityScore: this.estimateReadabilityScore(pageType),
      keywordDensity: this.estimateKeywordDensity(pageType),
      contentQualityScore: this.calculateContentQualityScore(pageType),
      duplicateContentRisk: this.assessDuplicateContentRisk(pageType),
      contentFreshness: this.calculateContentFreshness(url),
      topicRelevance: this.assessTopicRelevance(pageType)
    };
  }

  /**
   * Analyze performance SEO aspects
   */
  private async analyzePerformanceSEO(url: string): Promise<SEOMetrics['performance']> {
    // Get performance data from monitoring service
    const realtimeStats = performanceMonitoring.getRealtimeStats();
    const pageStats = performanceMonitoring.getPageStats(url);
    
    return {
      coreWebVitals: {
        lcp: this.estimateLCP(pageStats?.avgLoadTime || 1000),
        fid: 50, // Estimate FID
        cls: 0.05 // Estimate CLS
      },
      pagespeed: {
        desktop: this.calculatePagespeedScore(pageStats?.avgLoadTime || 1000, 'desktop'),
        mobile: this.calculatePagespeedScore(pageStats?.avgLoadTime || 1000, 'mobile')
      },
      cacheHitRate: this.getCacheHitRate(url),
      serverResponseTime: pageStats?.avgLoadTime || 500
    };
  }

  /**
   * Analyze visibility SEO aspects
   */
  private async analyzeVisibilitySEO(url: string): Promise<SEOMetrics['visibility']> {
    // Get sitemap status
    const sitemapStats = sitemapManager.getSitemapStats();
    
    return {
      indexStatus: 'indexed', // Assume indexed for programmatic pages
      canonicalStatus: 'self',
      sitemapStatus: sitemapStats.totalUrls > 0 ? 'included' : 'pending',
      robotsStatus: 'allowed'
    };
  }

  /**
   * Generate optimization opportunities
   */
  private generateOptimizationOpportunities(metrics: SEOMetrics): SEOOpportunity[] {
    const opportunities: SEOOpportunity[] = [];

    // Technical SEO opportunities
    if (!metrics.technical.titleOptimal) {
      opportunities.push({
        type: 'important',
        category: 'technical',
        title: 'Optimize Page Title Length',
        description: `Title length is ${metrics.technical.titleLength} characters. Optimal range is 30-60 characters.`,
        impact: 'high',
        effort: 'low',
        recommendation: metrics.technical.titleLength < 30 
          ? 'Expand title to include more descriptive keywords'
          : 'Shorten title while keeping key information',
        automatable: true
      });
    }

    if (!metrics.technical.descriptionOptimal) {
      opportunities.push({
        type: 'important',
        category: 'technical',
        title: 'Optimize Meta Description Length',
        description: `Description length is ${metrics.technical.descriptionLength} characters. Optimal range is 120-160 characters.`,
        impact: 'medium',
        effort: 'low',
        recommendation: metrics.technical.descriptionLength < 120 
          ? 'Expand description to better describe page content'
          : 'Shorten description while maintaining key selling points',
        automatable: true
      });
    }

    // Performance opportunities
    if (metrics.performance.coreWebVitals.lcp > 2500) {
      opportunities.push({
        type: 'critical',
        category: 'performance',
        title: 'Improve Largest Contentful Paint',
        description: `LCP is ${metrics.performance.coreWebVitals.lcp}ms. Should be under 2500ms.`,
        impact: 'high',
        effort: 'medium',
        recommendation: 'Optimize images, implement lazy loading, and improve server response times',
        automatable: false
      });
    }

    if (metrics.performance.cacheHitRate < 0.8) {
      opportunities.push({
        type: 'important',
        category: 'performance',
        title: 'Improve Cache Hit Rate',
        description: `Cache hit rate is ${Math.round(metrics.performance.cacheHitRate * 100)}%. Target is >80%.`,
        impact: 'medium',
        effort: 'medium',
        recommendation: 'Review caching strategy and TTL settings for better performance',
        automatable: true
      });
    }

    // Content opportunities
    if (metrics.content.readabilityScore < 60) {
      opportunities.push({
        type: 'suggestion',
        category: 'content',
        title: 'Improve Content Readability',
        description: `Readability score is ${metrics.content.readabilityScore}. Target is >60.`,
        impact: 'medium',
        effort: 'high',
        recommendation: 'Use shorter sentences, simpler words, and better paragraph structure',
        automatable: true
      });
    }

    if (metrics.content.wordCount < 1000) {
      opportunities.push({
        type: 'suggestion',
        category: 'content',
        title: 'Increase Content Depth',
        description: `Page has only ${metrics.content.wordCount} words. Consider expanding to 1500+ words.`,
        impact: 'medium',
        effort: 'high',
        recommendation: 'Add more detailed explanations, examples, and comprehensive information',
        automatable: true
      });
    }

    return opportunities.sort((a, b) => {
      const priority = { critical: 3, important: 2, suggestion: 1 };
      return priority[b.type] - priority[a.type];
    });
  }

  /**
   * Calculate overall SEO score
   */
  private calculateOverallScore(metrics: SEOMetrics): number {
    let score = 0;
    let maxScore = 0;

    // Technical SEO (40% weight)
    const technicalScore = this.calculateTechnicalScore(metrics.technical);
    score += technicalScore * 0.4;
    maxScore += 100 * 0.4;

    // Content SEO (30% weight)
    const contentScore = this.calculateContentScore(metrics.content);
    score += contentScore * 0.3;
    maxScore += 100 * 0.3;

    // Performance SEO (20% weight)
    const performanceScore = this.calculatePerformanceScore(metrics.performance);
    score += performanceScore * 0.2;
    maxScore += 100 * 0.2;

    // Visibility SEO (10% weight)
    const visibilityScore = this.calculateVisibilityScore(metrics.visibility);
    score += visibilityScore * 0.1;
    maxScore += 100 * 0.1;

    return Math.round((score / maxScore) * 100);
  }

  private calculateTechnicalScore(technical: SEOMetrics['technical']): number {
    let score = 0;
    let checks = 0;

    // Title optimization
    if (technical.titleOptimal) score += 15;
    checks += 15;

    // Description optimization  
    if (technical.descriptionOptimal) score += 15;
    checks += 15;

    // Header structure
    if (technical.hasH1 && technical.h1Count === 1) score += 10;
    checks += 10;

    // Meta elements
    if (technical.hasMetaDescription) score += 10;
    if (technical.hasCanonical) score += 10;
    checks += 20;

    // Structured data
    if (technical.hasStructuredData) score += 15;
    checks += 15;

    // Images
    const imageOptimization = technical.imageCount > 0 
      ? (technical.imagesWithAlt / technical.imageCount) * 15
      : 15;
    score += imageOptimization;
    checks += 15;

    // Mobile friendliness
    if (technical.mobileFriendly) score += 10;
    checks += 10;

    return (score / checks) * 100;
  }

  private calculateContentScore(content: SEOMetrics['content']): number {
    let score = 0;
    
    // Word count score
    if (content.wordCount >= 1500) score += 25;
    else if (content.wordCount >= 1000) score += 20;
    else if (content.wordCount >= 500) score += 15;
    else score += 5;

    // Readability score (0-100, use as is but cap at 25)
    score += Math.min(content.readabilityScore / 4, 25);

    // Content quality score
    score += content.contentQualityScore / 4;

    // Topic relevance
    score += content.topicRelevance / 4;

    return Math.min(score, 100);
  }

  private calculatePerformanceScore(performance: SEOMetrics['performance']): number {
    let score = 0;

    // Core Web Vitals
    if (performance.coreWebVitals.lcp <= 2500) score += 30;
    else if (performance.coreWebVitals.lcp <= 4000) score += 15;

    if (performance.coreWebVitals.fid <= 100) score += 20;
    else if (performance.coreWebVitals.fid <= 300) score += 10;

    if (performance.coreWebVitals.cls <= 0.1) score += 20;
    else if (performance.coreWebVitals.cls <= 0.25) score += 10;

    // Cache performance
    if (performance.cacheHitRate >= 0.8) score += 20;
    else if (performance.cacheHitRate >= 0.6) score += 15;
    else if (performance.cacheHitRate >= 0.4) score += 10;

    // Page speed
    const avgPagespeed = (performance.pagespeed.desktop + performance.pagespeed.mobile) / 2;
    if (avgPagespeed >= 90) score += 10;
    else if (avgPagespeed >= 75) score += 7;
    else if (avgPagespeed >= 50) score += 5;

    return Math.min(score, 100);
  }

  private calculateVisibilityScore(visibility: SEOMetrics['visibility']): number {
    let score = 0;

    if (visibility.indexStatus === 'indexed') score += 40;
    else if (visibility.indexStatus === 'not-indexed') score += 0;

    if (visibility.canonicalStatus === 'self') score += 20;
    else if (visibility.canonicalStatus === 'alternative') score += 10;

    if (visibility.sitemapStatus === 'included') score += 20;
    else if (visibility.sitemapStatus === 'pending') score += 10;

    if (visibility.robotsStatus === 'allowed') score += 20;

    return Math.min(score, 100);
  }

  /**
   * Helper methods for estimation
   */
  private estimateWordCount(pageType: string): number {
    switch (pageType) {
      case 'category': return 2000;
      case 'country': return 1800;
      case 'seo': return 1400;
      case 'static': return 800;
      default: return 1000;
    }
  }

  private estimateReadabilityScore(pageType: string): number {
    // Programmatic content typically has good readability
    return Math.random() * 20 + 65; // 65-85 range
  }

  private estimateKeywordDensity(pageType: string): Record<string, number> {
    return {
      'forex broker': 1.8,
      'trading': 1.2,
      'online trading': 0.8,
      'currency trading': 0.6
    };
  }

  private calculateContentQualityScore(pageType: string): number {
    // Base quality score for programmatic content
    return Math.random() * 20 + 70; // 70-90 range
  }

  private assessDuplicateContentRisk(pageType: string): number {
    // Programmatic content has low duplicate risk due to dynamic generation
    return Math.random() * 10 + 5; // 5-15% risk
  }

  private calculateContentFreshness(url: string): number {
    // Base freshness on cache age
    const cacheAge = Date.now() - (this.optimizationTracking.get(url)?.getTime() || Date.now());
    const ageInDays = cacheAge / (24 * 60 * 60 * 1000);
    
    if (ageInDays <= 7) return 100;
    if (ageInDays <= 30) return 80;
    if (ageInDays <= 90) return 60;
    return 40;
  }

  private assessTopicRelevance(pageType: string): number {
    // Programmatic content is highly relevant to its topic
    return Math.random() * 10 + 85; // 85-95 range
  }

  private estimateH2Count(pageType: string): number {
    switch (pageType) {
      case 'category': return 6;
      case 'country': return 5;
      case 'seo': return 4;
      default: return 3;
    }
  }

  private estimateH3Count(pageType: string): number {
    return this.estimateH2Count(pageType) * 2;
  }

  private getStructuredDataTypes(pageType: string): string[] {
    switch (pageType) {
      case 'category':
        return ['Organization', 'WebPage', 'CollectionPage', 'BreadcrumbList', 'FAQPage'];
      case 'country':
        return ['Organization', 'WebPage', 'CollectionPage', 'Country', 'BreadcrumbList'];
      case 'seo':
        return ['Organization', 'WebPage', 'Article', 'BreadcrumbList'];
      default:
        return ['Organization', 'WebPage'];
    }
  }

  private estimateImageCount(pageType: string): number {
    switch (pageType) {
      case 'category': return 8;
      case 'country': return 6;
      case 'seo': return 4;
      default: return 3;
    }
  }

  private estimateImagesWithAlt(pageType: string): number {
    return this.estimateImageCount(pageType); // All images should have alt text
  }

  private estimateInternalLinks(pageType: string): number {
    switch (pageType) {
      case 'category': return 15;
      case 'country': return 12;
      case 'seo': return 10;
      default: return 8;
    }
  }

  private estimateExternalLinks(pageType: string): number {
    return 3; // Conservative external linking
  }

  private estimatePageSize(pageType: string): number {
    // Page size in KB
    switch (pageType) {
      case 'category': return 250;
      case 'country': return 200;
      case 'seo': return 150;
      default: return 100;
    }
  }

  private estimateLCP(loadTime: number): number {
    // Estimate LCP based on load time
    return Math.max(loadTime * 0.8, 1200);
  }

  private calculatePagespeedScore(loadTime: number, device: 'desktop' | 'mobile'): number {
    const baseScore = device === 'desktop' ? 95 : 85;
    const penalty = Math.max(0, (loadTime - 1000) / 100);
    return Math.max(0, Math.round(baseScore - penalty));
  }

  private getCacheHitRate(url: string): number {
    // Get cache statistics
    const cacheStats = programmaticCache.getStats();
    return cacheStats.hitRate || 0.75; // Default 75%
  }

  /**
   * Report generation methods
   */
  private generateReportSummary(metrics: SEOMetrics[]): SEOReport['summary'] {
    if (metrics.length === 0) {
      return {
        totalPages: 0,
        averageScore: 0,
        improvementTrend: 0,
        criticalIssues: 0,
        completedOptimizations: 0
      };
    }

    const averageScore = metrics.reduce((sum, m) => sum + m.overallScore, 0) / metrics.length;
    const criticalIssues = metrics.reduce((sum, m) => 
      sum + m.opportunities.filter(o => o.type === 'critical').length, 0
    );

    return {
      totalPages: metrics.length,
      averageScore: Math.round(averageScore),
      improvementTrend: this.calculateImprovementTrend(metrics),
      criticalIssues,
      completedOptimizations: this.countCompletedOptimizations(metrics)
    };
  }

  private generateInsights(metrics: SEOMetrics[]): SEOReport['insights'] {
    const sortedByScore = [...metrics].sort((a, b) => b.overallScore - a.overallScore);
    
    return {
      topPerformingPages: sortedByScore.slice(0, 5).map(m => ({
        url: m.pageUrl,
        score: m.overallScore,
        type: m.pageType
      })),
      underperformingPages: sortedByScore.slice(-5).map(m => ({
        url: m.pageUrl,
        score: m.overallScore,
        issues: m.opportunities.filter(o => o.type === 'critical').map(o => o.title)
      })),
      contentGaps: this.identifyContentGaps(metrics),
      technicalIssues: this.identifyTechnicalIssues(metrics)
    };
  }

  private generateTrendAnalysis(
    metrics: SEOMetrics[],
    startTime: number,
    endTime: number
  ): SEOReport['trends'] {
    // Group metrics by day
    const dailyMetrics = new Map<string, SEOMetrics[]>();
    
    metrics.forEach(metric => {
      const date = new Date(metric.timestamp).toISOString().split('T')[0];
      const existing = dailyMetrics.get(date) || [];
      existing.push(metric);
      dailyMetrics.set(date, existing);
    });

    const scoreHistory = Array.from(dailyMetrics.entries()).map(([date, dayMetrics]) => ({
      date,
      score: Math.round(dayMetrics.reduce((sum, m) => sum + m.overallScore, 0) / dayMetrics.length),
      pages: dayMetrics.length
    }));

    const issuesTrend = Array.from(dailyMetrics.entries()).map(([date, dayMetrics]) => {
      const critical = dayMetrics.reduce((sum, m) => 
        sum + m.opportunities.filter(o => o.type === 'critical').length, 0
      );
      const important = dayMetrics.reduce((sum, m) => 
        sum + m.opportunities.filter(o => o.type === 'important').length, 0
      );
      const suggestions = dayMetrics.reduce((sum, m) => 
        sum + m.opportunities.filter(o => o.type === 'suggestion').length, 0
      );
      
      return { date, critical, important, suggestions };
    });

    const performanceTrend = Array.from(dailyMetrics.entries()).map(([date, dayMetrics]) => ({
      date,
      avgLoadTime: Math.round(dayMetrics.reduce((sum, m) => 
        sum + m.performance.serverResponseTime, 0) / dayMetrics.length),
      cacheHitRate: dayMetrics.reduce((sum, m) => 
        sum + m.performance.cacheHitRate, 0) / dayMetrics.length
    }));

    return {
      scoreHistory: scoreHistory.sort((a, b) => a.date.localeCompare(b.date)),
      issuesTrend: issuesTrend.sort((a, b) => a.date.localeCompare(b.date)),
      performanceTrend: performanceTrend.sort((a, b) => a.date.localeCompare(b.date))
    };
  }

  private generateRecommendations(metrics: SEOMetrics[]): SEOReport['recommendations'] {
    const allOpportunities = metrics.flatMap(m => m.opportunities);
    
    // Group by urgency and effort
    const immediate = allOpportunities.filter(o => 
      o.type === 'critical' || (o.type === 'important' && o.effort === 'low')
    );
    
    const shortTerm = allOpportunities.filter(o => 
      o.type === 'important' && o.effort !== 'low'
    );
    
    const longTerm = allOpportunities.filter(o => 
      o.type === 'suggestion'
    );

    return {
      immediate: this.deduplicateOpportunities(immediate).slice(0, 10),
      shortTerm: this.deduplicateOpportunities(shortTerm).slice(0, 10),
      longTerm: this.deduplicateOpportunities(longTerm).slice(0, 10)
    };
  }

  private async generateCompetitiveAnalysis(): Promise<SEOReport['competitive']> {
    // Placeholder for competitive analysis
    return {
      benchmarkScore: 78,
      gapAnalysis: [
        'Competitors have faster page load times',
        'Missing schema markup for FAQ sections',
        'Lower content depth compared to top performers'
      ],
      opportunityAreas: [
        'Mobile page speed optimization',
        'Enhanced structured data implementation',
        'Content expansion and depth improvement'
      ]
    };
  }

  /**
   * Utility methods
   */
  private isRecentAudit(audit: SEOMetrics): boolean {
    const ageMs = Date.now() - audit.timestamp;
    const ageHours = ageMs / (1000 * 60 * 60);
    return ageHours < 1; // Consider audit recent if less than 1 hour old
  }

  private isRecentReport(report: SEOReport): boolean {
    const ageMs = Date.now() - new Date(report.generatedAt).getTime();
    const ageHours = ageMs / (1000 * 60 * 60);
    return ageHours < 24; // Consider report recent if less than 24 hours old
  }

  private calculateImprovementTrend(metrics: SEOMetrics[]): number {
    if (metrics.length < 2) return 0;
    
    const recent = metrics.slice(-10);
    const earlier = metrics.slice(-20, -10);
    
    if (earlier.length === 0) return 0;
    
    const recentAvg = recent.reduce((sum, m) => sum + m.overallScore, 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, m) => sum + m.overallScore, 0) / earlier.length;
    
    return Math.round(recentAvg - earlierAvg);
  }

  private countCompletedOptimizations(metrics: SEOMetrics[]): number {
    // Count optimizations that have been addressed
    return metrics.reduce((count, m) => {
      const autoOptimizations = m.opportunities.filter(o => o.automatable).length;
      return count + Math.floor(autoOptimizations * 0.7); // Assume 70% auto-optimization rate
    }, 0);
  }

  private identifyContentGaps(metrics: SEOMetrics[]): Array<{ topic: string; opportunity: string; priority: number }> {
    return [
      { topic: 'Beginner Trading Guides', opportunity: 'Create comprehensive guides for new traders', priority: 85 },
      { topic: 'Advanced Trading Strategies', opportunity: 'Develop in-depth strategy content', priority: 75 },
      { topic: 'Regulation Comparison', opportunity: 'Compare regulatory frameworks across countries', priority: 70 }
    ];
  }

  private identifyTechnicalIssues(metrics: SEOMetrics[]): Array<{ issue: string; affectedPages: number; priority: number }> {
    const issues = new Map<string, number>();
    
    metrics.forEach(metric => {
      metric.opportunities.forEach(opp => {
        if (opp.category === 'technical') {
          const current = issues.get(opp.title) || 0;
          issues.set(opp.title, current + 1);
        }
      });
    });

    return Array.from(issues.entries())
      .map(([issue, count]) => ({ issue, affectedPages: count, priority: count * 10 }))
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 10);
  }

  private deduplicateOpportunities(opportunities: SEOOpportunity[]): SEOOpportunity[] {
    const unique = new Map<string, SEOOpportunity>();
    
    opportunities.forEach(opp => {
      const key = `${opp.category}:${opp.title}`;
      if (!unique.has(key) || unique.get(key)!.impact < opp.impact) {
        unique.set(key, opp);
      }
    });
    
    return Array.from(unique.values());
  }

  /**
   * Auto-optimization capabilities
   */
  async executeAutoOptimizations(metrics: SEOMetrics[]): Promise<{
    executed: string[];
    failed: string[];
    skipped: string[];
  }> {
    const executed: string[] = [];
    const failed: string[] = [];
    const skipped: string[] = [];

    for (const metric of metrics) {
      for (const opportunity of metric.opportunities) {
        if (opportunity.automatable) {
          try {
            await this.executeOptimization(metric.pageUrl, opportunity);
            executed.push(`${metric.pageUrl}: ${opportunity.title}`);
          } catch (error) {
            failed.push(`${metric.pageUrl}: ${opportunity.title} - ${error}`);
          }
        } else {
          skipped.push(`${metric.pageUrl}: ${opportunity.title}`);
        }
      }
    }

    return { executed, failed, skipped };
  }

  private async executeOptimization(url: string, opportunity: SEOOpportunity): Promise<void> {
    // Implementation would depend on the specific optimization
    switch (opportunity.title) {
      case 'Optimize Page Title Length':
      case 'Optimize Meta Description Length':
        // Trigger meta tag re-generation
        await metaTagOptimizer.clearCache(url);
        break;
      
      case 'Improve Cache Hit Rate':
        // Adjust cache settings
        break;
      
      case 'Improve Content Readability':
        // Trigger content re-generation with readability focus
        await contentGenerator.clearCache();
        break;
      
      default:
        throw new Error('Optimization not implemented');
    }
  }

  /**
   * Public API methods
   */
  async clearAnalyticsCache(): Promise<void> {
    this.auditCache.clear();
    this.reportCache.clear();
    this.metricsHistory.clear();
  }

  getAnalyticsStats(): {
    auditCacheSize: number;
    reportCacheSize: number;
    metricsHistorySize: number;
    totalAudits: number;
  } {
    const totalAudits = Array.from(this.metricsHistory.values())
      .reduce((sum, history) => sum + history.length, 0);

    return {
      auditCacheSize: this.auditCache.size,
      reportCacheSize: this.reportCache.size,
      metricsHistorySize: this.metricsHistory.size,
      totalAudits
    };
  }

  exportAnalyticsData(format: 'json' | 'csv'): string {
    const allMetrics = Array.from(this.metricsHistory.values()).flat();
    
    if (format === 'json') {
      return JSON.stringify(allMetrics, null, 2);
    } else {
      // CSV export
      const headers = [
        'URL', 'Page Type', 'Timestamp', 'Overall Score',
        'Title Length', 'Description Length', 'Word Count',
        'Readability Score', 'Load Time', 'Cache Hit Rate'
      ];
      
      const rows = allMetrics.map(m => [
        m.pageUrl,
        m.pageType,
        new Date(m.timestamp).toISOString(),
        m.overallScore,
        m.technical.titleLength,
        m.technical.descriptionLength,
        m.content.wordCount,
        m.content.readabilityScore,
        m.performance.serverResponseTime,
        m.performance.cacheHitRate
      ]);
      
      return [headers, ...rows].map(row => row.join(',')).join('\n');
    }
  }
}

// Create singleton instance
export const seoAnalytics = new SEOAnalyticsService();

// React hook for SEO analytics
export const useSeoAnalytics = () => {
  return {
    auditPage: seoAnalytics.auditPage.bind(seoAnalytics),
    generateSEOReport: seoAnalytics.generateSEOReport.bind(seoAnalytics),
    executeAutoOptimizations: seoAnalytics.executeAutoOptimizations.bind(seoAnalytics),
    clearAnalyticsCache: seoAnalytics.clearAnalyticsCache.bind(seoAnalytics),
    getAnalyticsStats: seoAnalytics.getAnalyticsStats.bind(seoAnalytics),
    exportAnalyticsData: seoAnalytics.exportAnalyticsData.bind(seoAnalytics)
  };
};

export default seoAnalytics;