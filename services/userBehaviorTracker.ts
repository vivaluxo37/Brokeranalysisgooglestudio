/**
 * Enhanced User Behavior Tracking Service
 * 
 * Provides comprehensive user journey mapping with SEO correlation,
 * real-time behavior analytics, and conversion funnel analysis.
 * Integrates seamlessly with Phase 2 caching and Phase 3 SEO services.
 */

import { CacheService } from './cacheService';
import { PerformanceMonitor } from './performanceMonitor';
import { SEOAnalytics } from './seoAnalytics';

// Types and Interfaces
export interface UserSession {
  sessionId: string;
  userId?: string;
  deviceId: string;
  startTime: number;
  lastActivity: number;
  totalDuration: number;
  pageViews: number;
  interactions: UserInteraction[];
  source: TrafficSource;
  seoAttribution: SEOAttribution;
  conversionEvents: ConversionEvent[];
  performanceMetrics: SessionPerformanceMetrics;
}

export interface UserInteraction {
  type: InteractionType;
  timestamp: number;
  pageUrl: string;
  elementId?: string;
  coordinates?: { x: number; y: number };
  metadata?: Record<string, any>;
  seoContext?: SEOContext;
}

export interface TrafficSource {
  medium: 'organic' | 'direct' | 'referral' | 'social' | 'email' | 'paid';
  source: string;
  campaign?: string;
  keyword?: string;
  referrer?: string;
  landingPage: string;
  seoPage?: string;
}

export interface SEOAttribution {
  entryPage: string;
  seoCategory?: string;
  seoCountry?: string;
  searchQuery?: string;
  rankingPosition?: number;
  metaTagsUsed: string[];
  structuredDataTypes: string[];
  contentQualityScore?: number;
}

export interface ConversionEvent {
  type: ConversionType;
  timestamp: number;
  value?: number;
  currency?: string;
  seoAttribution: SEOAttribution;
  funnelStep: number;
  metadata?: Record<string, any>;
}

export interface SessionPerformanceMetrics {
  averagePageLoadTime: number;
  cacheHitRate: number;
  totalDataTransfer: number;
  errorCount: number;
  performanceScore: number;
}

export interface UserJourney {
  sessionId: string;
  steps: JourneyStep[];
  totalDuration: number;
  conversionOutcome: boolean;
  seoImpact: SEOImpactMetrics;
  funnelDropOffPoints: number[];
}

export interface JourneyStep {
  pageUrl: string;
  timestamp: number;
  duration: number;
  scrollDepth: number;
  interactions: number;
  seoMetrics: PageSEOMetrics;
  performanceMetrics: PagePerformanceMetrics;
  exitPoint?: boolean;
  conversionEvent?: ConversionEvent;
}

export interface SEOImpactMetrics {
  seoPagesVisited: number;
  totalSEOEngagement: number;
  conversionFromSEO: boolean;
  seoRevenueAttribution: number;
  keywordAttribution: string[];
}

export interface UserBehaviorInsights {
  overallEngagement: number;
  bounceRate: number;
  averageSessionDuration: number;
  pagesPerSession: number;
  conversionRate: number;
  seoEffectiveness: number;
  topPerformingContent: string[];
  optimizationOpportunities: OptimizationOpportunity[];
}

export interface OptimizationOpportunity {
  type: 'content' | 'performance' | 'seo' | 'conversion';
  priority: 'high' | 'medium' | 'low';
  description: string;
  potentialImpact: number;
  implementation: string;
  affectedPages: string[];
}

export interface RealTimeMetrics {
  activeUsers: number;
  currentSessions: UserSession[];
  liveInteractions: UserInteraction[];
  performanceAlerts: PerformanceAlert[];
  conversionEvents: ConversionEvent[];
  topPages: PageActivity[];
}

export interface PerformanceAlert {
  type: 'high_bounce_rate' | 'slow_page_load' | 'high_exit_rate' | 'conversion_drop';
  severity: 'critical' | 'warning' | 'info';
  message: string;
  affectedPages: string[];
  timestamp: number;
  autoFix?: string;
}

type InteractionType = 'click' | 'scroll' | 'hover' | 'focus' | 'form_submit' | 'download' | 'video_play' | 'search';
type ConversionType = 'lead' | 'signup' | 'purchase' | 'download' | 'contact' | 'view_product';

export class UserBehaviorTracker {
  private static instance: UserBehaviorTracker;
  private cacheService: CacheService;
  private performanceMonitor: PerformanceMonitor;
  private seoAnalytics: SEOAnalytics;
  private activeSessions: Map<string, UserSession> = new Map();
  private realTimeMetrics: RealTimeMetrics;
  private analyticsQueue: UserInteraction[] = [];
  private isTracking: boolean = false;

  private constructor() {
    this.cacheService = CacheService.getInstance();
    this.performanceMonitor = PerformanceMonitor.getInstance();
    this.seoAnalytics = SEOAnalytics.getInstance();
    this.initializeRealTimeMetrics();
    this.setupEventListeners();
    this.startAnalyticsProcessing();
  }

  public static getInstance(): UserBehaviorTracker {
    if (!UserBehaviorTracker.instance) {
      UserBehaviorTracker.instance = new UserBehaviorTracker();
    }
    return UserBehaviorTracker.instance;
  }

  /**
   * Initialize real-time metrics tracking
   */
  private initializeRealTimeMetrics(): void {
    this.realTimeMetrics = {
      activeUsers: 0,
      currentSessions: [],
      liveInteractions: [],
      performanceAlerts: [],
      conversionEvents: [],
      topPages: []
    };
  }

  /**
   * Setup browser event listeners for user behavior tracking
   */
  private setupEventListeners(): void {
    if (typeof window === 'undefined') return;

    // Page navigation tracking
    window.addEventListener('beforeunload', this.handlePageExit.bind(this));
    window.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));

    // User interaction tracking
    document.addEventListener('click', this.handleClick.bind(this), true);
    document.addEventListener('scroll', this.handleScroll.bind(this), true);
    document.addEventListener('mouseover', this.handleMouseOver.bind(this), true);
    document.addEventListener('focus', this.handleFocus.bind(this), true);

    // Form interaction tracking
    document.addEventListener('submit', this.handleFormSubmit.bind(this), true);
    document.addEventListener('input', this.handleFormInput.bind(this), true);

    // Performance event tracking
    window.addEventListener('load', this.handlePageLoad.bind(this));
    window.addEventListener('error', this.handleError.bind(this));
  }

  /**
   * Start or initialize user session tracking
   */
  public async startSession(options?: {
    userId?: string;
    source?: Partial<TrafficSource>;
    seoContext?: Partial<SEOContext>;
  }): Promise<string> {
    const sessionId = this.generateSessionId();
    const deviceId = this.getDeviceId();
    const currentUrl = window.location.href;

    // Determine traffic source
    const source = this.determineTrafficSource(options?.source);

    // Get SEO attribution
    const seoAttribution = await this.getSEOAttribution(currentUrl, source);

    // Create new session
    const session: UserSession = {
      sessionId,
      userId: options?.userId,
      deviceId,
      startTime: Date.now(),
      lastActivity: Date.now(),
      totalDuration: 0,
      pageViews: 1,
      interactions: [],
      source,
      seoAttribution,
      conversionEvents: [],
      performanceMetrics: {
        averagePageLoadTime: 0,
        cacheHitRate: 0,
        totalDataTransfer: 0,
        errorCount: 0,
        performanceScore: 0
      }
    };

    this.activeSessions.set(sessionId, session);
    this.realTimeMetrics.activeUsers = this.activeSessions.size;
    this.realTimeMetrics.currentSessions = Array.from(this.activeSessions.values());

    // Cache session data
    await this.cacheService.set(
      `user_session:${sessionId}`,
      session,
      { ttl: 30 * 60 * 1000, tags: ['user_sessions'] }
    );

    this.isTracking = true;
    return sessionId;
  }

  /**
   * Track user interaction with SEO context
   */
  public async trackInteraction(
    sessionId: string,
    type: InteractionType,
    metadata?: Record<string, any>
  ): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    const currentUrl = window.location.href;
    const seoContext = await this.getSEOContext(currentUrl);

    const interaction: UserInteraction = {
      type,
      timestamp: Date.now(),
      pageUrl: currentUrl,
      metadata,
      seoContext
    };

    // Add coordinates for click events
    if (type === 'click' && metadata?.event) {
      const event = metadata.event as MouseEvent;
      interaction.coordinates = { x: event.clientX, y: event.clientY };
      interaction.elementId = (event.target as HTMLElement)?.id;
    }

    session.interactions.push(interaction);
    session.lastActivity = Date.now();
    this.analyticsQueue.push(interaction);

    // Update real-time metrics
    this.realTimeMetrics.liveInteractions.push(interaction);
    if (this.realTimeMetrics.liveInteractions.length > 100) {
      this.realTimeMetrics.liveInteractions = this.realTimeMetrics.liveInteractions.slice(-100);
    }

    // Update cached session
    await this.updateSessionCache(sessionId, session);
  }

  /**
   * Track conversion events with SEO attribution
   */
  public async trackConversion(
    sessionId: string,
    type: ConversionType,
    value?: number,
    currency?: string,
    metadata?: Record<string, any>
  ): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) return;

    const conversionEvent: ConversionEvent = {
      type,
      timestamp: Date.now(),
      value,
      currency: currency || 'USD',
      seoAttribution: session.seoAttribution,
      funnelStep: this.calculateFunnelStep(session),
      metadata
    };

    session.conversionEvents.push(conversionEvent);
    this.realTimeMetrics.conversionEvents.push(conversionEvent);

    // Track conversion in analytics queue
    this.analyticsQueue.push({
      type: 'conversion' as any,
      timestamp: conversionEvent.timestamp,
      pageUrl: window.location.href,
      metadata: { conversionEvent }
    });

    await this.updateSessionCache(sessionId, session);
  }

  /**
   * Get comprehensive user journey analysis
   */
  public async getUserJourney(sessionId: string): Promise<UserJourney | null> {
    const cacheKey = `user_journey:${sessionId}`;
    
    // Check cache first
    const cached = await this.cacheService.get<UserJourney>(cacheKey);
    if (cached) return cached;

    const session = this.activeSessions.get(sessionId);
    if (!session) return null;

    const journey = await this.buildUserJourney(session);
    
    // Cache the journey analysis
    await this.cacheService.set(cacheKey, journey, { 
      ttl: 5 * 60 * 1000, 
      tags: ['user_journeys', sessionId] 
    });

    return journey;
  }

  /**
   * Generate comprehensive behavior insights
   */
  public async getBehaviorInsights(
    timeRange?: { start: number; end: number },
    filters?: { seoCategory?: string; trafficSource?: string; deviceType?: string }
  ): Promise<UserBehaviorInsights> {
    const cacheKey = `behavior_insights:${JSON.stringify({ timeRange, filters })}`;
    
    // Check cache first
    const cached = await this.cacheService.get<UserBehaviorInsights>(cacheKey);
    if (cached) return cached;

    const sessions = await this.getSessionsInRange(timeRange, filters);
    const insights = this.calculateBehaviorInsights(sessions);

    // Cache insights
    await this.cacheService.set(cacheKey, insights, { 
      ttl: 10 * 60 * 1000, 
      tags: ['behavior_insights'] 
    });

    return insights;
  }

  /**
   * Get real-time analytics metrics
   */
  public getRealTimeMetrics(): RealTimeMetrics {
    return { ...this.realTimeMetrics };
  }

  /**
   * Get SEO performance correlation data
   */
  public async getSEOCorrelation(pageUrl: string): Promise<{
    seoScore: number;
    userEngagement: number;
    conversionRate: number;
    bounceRate: number;
    avgSessionDuration: number;
    recommendations: string[];
  }> {
    const cacheKey = `seo_correlation:${pageUrl}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const pageMetrics = await this.getPageMetrics(pageUrl);
    const seoData = await this.seoAnalytics.auditPage(pageUrl);
    
    const correlation = {
      seoScore: seoData.overallScore,
      userEngagement: pageMetrics.engagement,
      conversionRate: pageMetrics.conversionRate,
      bounceRate: pageMetrics.bounceRate,
      avgSessionDuration: pageMetrics.avgDuration,
      recommendations: this.generateSEORecommendations(pageMetrics, seoData)
    };

    await this.cacheService.set(cacheKey, correlation, { 
      ttl: 15 * 60 * 1000, 
      tags: ['seo_correlation'] 
    });

    return correlation;
  }

  /**
   * Get funnel analysis with SEO attribution
   */
  public async getFunnelAnalysis(funnelSteps: string[]): Promise<{
    overallConversionRate: number;
    stepConversionRates: number[];
    dropOffPoints: { step: number; rate: number }[];
    seoContribution: { step: number; percentage: number }[];
    optimizationOpportunities: OptimizationOpportunity[];
  }> {
    const cacheKey = `funnel_analysis:${funnelSteps.join(',')}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const analysis = await this.performFunnelAnalysis(funnelSteps);
    
    await this.cacheService.set(cacheKey, analysis, { 
      ttl: 30 * 60 * 1000, 
      tags: ['funnel_analysis'] 
    });

    return analysis;
  }

  // Private helper methods

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private getDeviceId(): string {
    let deviceId = localStorage.getItem('device_id');
    if (!deviceId) {
      deviceId = `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('device_id', deviceId);
    }
    return deviceId;
  }

  private determineTrafficSource(provided?: Partial<TrafficSource>): TrafficSource {
    const urlParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer;
    
    return {
      medium: provided?.medium || this.classifyTrafficMedium(referrer, urlParams),
      source: provided?.source || this.extractTrafficSource(referrer),
      campaign: provided?.campaign || urlParams.get('utm_campaign') || undefined,
      keyword: provided?.keyword || urlParams.get('keyword') || urlParams.get('q') || undefined,
      referrer: referrer || undefined,
      landingPage: window.location.href,
      seoPage: this.isSEOPage(window.location.href) ? window.location.href : undefined
    };
  }

  private classifyTrafficMedium(referrer: string, params: URLSearchParams): TrafficSource['medium'] {
    if (params.get('utm_medium')) return params.get('utm_medium') as TrafficSource['medium'];
    if (!referrer || referrer === '') return 'direct';
    if (this.isSearchEngine(referrer)) return 'organic';
    if (this.isSocialMedia(referrer)) return 'social';
    return 'referral';
  }

  private extractTrafficSource(referrer: string): string {
    if (!referrer) return 'direct';
    try {
      const url = new URL(referrer);
      return url.hostname;
    } catch {
      return 'unknown';
    }
  }

  private isSearchEngine(referrer: string): boolean {
    const searchEngines = ['google', 'bing', 'yahoo', 'duckduckgo', 'baidu'];
    return searchEngines.some(engine => referrer.includes(engine));
  }

  private isSocialMedia(referrer: string): boolean {
    const socialPlatforms = ['facebook', 'twitter', 'linkedin', 'instagram', 'youtube'];
    return socialPlatforms.some(platform => referrer.includes(platform));
  }

  private isSEOPage(url: string): boolean {
    const seoPatterns = ['/best-brokers/', '/country/', '/category/'];
    return seoPatterns.some(pattern => url.includes(pattern));
  }

  private async getSEOAttribution(url: string, source: TrafficSource): Promise<SEOAttribution> {
    const seoContext = await this.getSEOContext(url);
    
    return {
      entryPage: url,
      seoCategory: this.extractSEOCategory(url),
      seoCountry: this.extractSEOCountry(url),
      searchQuery: source.keyword,
      rankingPosition: await this.estimateRankingPosition(source.keyword, url),
      metaTagsUsed: seoContext?.metaTags || [],
      structuredDataTypes: seoContext?.structuredData || [],
      contentQualityScore: seoContext?.contentScore
    };
  }

  private async getSEOContext(url: string): Promise<SEOContext | undefined> {
    try {
      const pageData = await this.seoAnalytics.auditPage(url);
      return {
        metaTags: Object.keys(pageData.technicalSEO.metaTags || {}),
        structuredData: Object.keys(pageData.technicalSEO.structuredData || {}),
        contentScore: pageData.contentQuality.overallScore
      };
    } catch (error) {
      console.warn('Failed to get SEO context:', error);
      return undefined;
    }
  }

  private extractSEOCategory(url: string): string | undefined {
    const match = url.match(/\/best-brokers\/([^\/]+)/);
    return match ? match[1] : undefined;
  }

  private extractSEOCountry(url: string): string | undefined {
    const match = url.match(/\/country\/([^\/]+)/);
    return match ? match[1] : undefined;
  }

  private async estimateRankingPosition(keyword?: string, url?: string): Promise<number | undefined> {
    // This would integrate with actual SEO ranking APIs in production
    return keyword && url ? Math.floor(Math.random() * 10) + 1 : undefined;
  }

  private calculateFunnelStep(session: UserSession): number {
    // Calculate current funnel step based on page URLs and interactions
    const pageViews = session.interactions.filter(i => i.type === 'click').length;
    const formSubmissions = session.interactions.filter(i => i.type === 'form_submit').length;
    
    if (formSubmissions > 0) return 4; // Conversion step
    if (pageViews > 3) return 3; // Consideration step
    if (pageViews > 1) return 2; // Interest step
    return 1; // Awareness step
  }

  private async updateSessionCache(sessionId: string, session: UserSession): Promise<void> {
    session.totalDuration = Date.now() - session.startTime;
    await this.cacheService.set(
      `user_session:${sessionId}`,
      session,
      { ttl: 30 * 60 * 1000, tags: ['user_sessions'] }
    );
  }

  private async buildUserJourney(session: UserSession): Promise<UserJourney> {
    // Group interactions by page to create journey steps
    const pageGroups = this.groupInteractionsByPage(session.interactions);
    const steps: JourneyStep[] = [];

    for (const [pageUrl, interactions] of pageGroups) {
      const pageMetrics = await this.getPageMetrics(pageUrl);
      const seoMetrics = await this.getPageSEOMetrics(pageUrl);
      
      steps.push({
        pageUrl,
        timestamp: Math.min(...interactions.map(i => i.timestamp)),
        duration: this.calculatePageDuration(interactions),
        scrollDepth: this.calculateScrollDepth(interactions),
        interactions: interactions.length,
        seoMetrics,
        performanceMetrics: pageMetrics.performance,
        exitPoint: pageUrl === session.interactions[session.interactions.length - 1]?.pageUrl,
        conversionEvent: session.conversionEvents.find(ce => 
          Math.abs(ce.timestamp - interactions[0].timestamp) < 60000 // Within 1 minute
        )
      });
    }

    return {
      sessionId: session.sessionId,
      steps,
      totalDuration: session.totalDuration,
      conversionOutcome: session.conversionEvents.length > 0,
      seoImpact: this.calculateSEOImpact(session, steps),
      funnelDropOffPoints: this.identifyDropOffPoints(steps)
    };
  }

  private groupInteractionsByPage(interactions: UserInteraction[]): Map<string, UserInteraction[]> {
    const groups = new Map<string, UserInteraction[]>();
    
    for (const interaction of interactions) {
      const existing = groups.get(interaction.pageUrl) || [];
      existing.push(interaction);
      groups.set(interaction.pageUrl, existing);
    }
    
    return groups;
  }

  private calculatePageDuration(interactions: UserInteraction[]): number {
    if (interactions.length < 2) return 0;
    const timestamps = interactions.map(i => i.timestamp).sort((a, b) => a - b);
    return timestamps[timestamps.length - 1] - timestamps[0];
  }

  private calculateScrollDepth(interactions: UserInteraction[]): number {
    const scrollInteractions = interactions.filter(i => i.type === 'scroll');
    if (scrollInteractions.length === 0) return 0;
    
    // Calculate based on scroll events (simplified)
    return Math.min(100, scrollInteractions.length * 10);
  }

  private calculateSEOImpact(session: UserSession, steps: JourneyStep[]): SEOImpactMetrics {
    const seoPages = steps.filter(step => this.isSEOPage(step.pageUrl));
    const totalEngagement = seoPages.reduce((sum, step) => sum + step.interactions, 0);
    
    return {
      'seoPages visited': seoPages.length,
      totalSEOEngagement: totalEngagement,
      conversionFromSEO: session.conversionEvents.some(ce => 
        seoPages.some(sp => Math.abs(ce.timestamp - sp.timestamp) < 300000) // Within 5 minutes
      ),
      seoRevenueAttribution: session.conversionEvents.reduce((sum, ce) => sum + (ce.value || 0), 0),
      keywordAttribution: session.seoAttribution.searchQuery ? [session.seoAttribution.searchQuery] : []
    };
  }

  private identifyDropOffPoints(steps: JourneyStep[]): number[] {
    const dropOffs: number[] = [];
    
    for (let i = 0; i < steps.length - 1; i++) {
      const currentStep = steps[i];
      const nextStep = steps[i + 1];
      
      // If there's a significant time gap between steps, it might be a drop-off point
      if (nextStep.timestamp - (currentStep.timestamp + currentStep.duration) > 300000) { // 5 minutes
        dropOffs.push(i);
      }
    }
    
    return dropOffs;
  }

  private async getSessionsInRange(
    timeRange?: { start: number; end: number },
    filters?: { seoCategory?: string; trafficSource?: string; deviceType?: string }
  ): Promise<UserSession[]> {
    // This would query the database or cache for sessions
    // For now, return active sessions that match the criteria
    const sessions = Array.from(this.activeSessions.values());
    
    return sessions.filter(session => {
      if (timeRange) {
        if (session.startTime < timeRange.start || session.startTime > timeRange.end) {
          return false;
        }
      }
      
      if (filters) {
        if (filters.seoCategory && session.seoAttribution.seoCategory !== filters.seoCategory) {
          return false;
        }
        if (filters.trafficSource && session.source.source !== filters.trafficSource) {
          return false;
        }
        // Device type filtering would require additional device detection
      }
      
      return true;
    });
  }

  private calculateBehaviorInsights(sessions: UserSession[]): UserBehaviorInsights {
    if (sessions.length === 0) {
      return {
        overallEngagement: 0,
        bounceRate: 0,
        averageSessionDuration: 0,
        pagesPerSession: 0,
        conversionRate: 0,
        seoEffectiveness: 0,
        topPerformingContent: [],
        optimizationOpportunities: []
      };
    }

    const totalSessions = sessions.length;
    const bounces = sessions.filter(s => s.pageViews === 1).length;
    const conversions = sessions.filter(s => s.conversionEvents.length > 0).length;
    const seoSessions = sessions.filter(s => s.seoAttribution.seoCategory).length;
    const seoConversions = sessions.filter(s => 
      s.seoAttribution.seoCategory && s.conversionEvents.length > 0
    ).length;

    return {
      overallEngagement: this.calculateOverallEngagement(sessions),
      bounceRate: (bounces / totalSessions) * 100,
      averageSessionDuration: sessions.reduce((sum, s) => sum + s.totalDuration, 0) / totalSessions,
      pagesPerSession: sessions.reduce((sum, s) => sum + s.pageViews, 0) / totalSessions,
      conversionRate: (conversions / totalSessions) * 100,
      seoEffectiveness: seoSessions > 0 ? (seoConversions / seoSessions) * 100 : 0,
      topPerformingContent: this.identifyTopPerformingContent(sessions),
      optimizationOpportunities: this.generateOptimizationOpportunities(sessions)
    };
  }

  private calculateOverallEngagement(sessions: UserSession[]): number {
    // Calculate engagement based on interactions, time spent, and page views
    const totalInteractions = sessions.reduce((sum, s) => sum + s.interactions.length, 0);
    const totalDuration = sessions.reduce((sum, s) => sum + s.totalDuration, 0);
    const totalPageViews = sessions.reduce((sum, s) => sum + s.pageViews, 0);
    
    // Normalized engagement score (0-100)
    const interactionScore = Math.min(100, (totalInteractions / sessions.length) * 5);
    const durationScore = Math.min(100, (totalDuration / sessions.length) / 1000 / 60 * 10); // 10 points per minute
    const pageViewScore = Math.min(100, (totalPageViews / sessions.length) * 20);
    
    return (interactionScore + durationScore + pageViewScore) / 3;
  }

  private identifyTopPerformingContent(sessions: UserSession[]): string[] {
    const pagePerformance = new Map<string, { visits: number; conversions: number; engagement: number }>();
    
    for (const session of sessions) {
      for (const interaction of session.interactions) {
        const current = pagePerformance.get(interaction.pageUrl) || { visits: 0, conversions: 0, engagement: 0 };
        current.visits++;
        current.engagement += 1; // Simple engagement increment per interaction
        pagePerformance.set(interaction.pageUrl, current);
      }
      
      for (const conversion of session.conversionEvents) {
        // Attribute conversion to the last visited page (simplified)
        const lastInteraction = session.interactions[session.interactions.length - 1];
        if (lastInteraction) {
          const current = pagePerformance.get(lastInteraction.pageUrl) || { visits: 0, conversions: 0, engagement: 0 };
          current.conversions++;
          pagePerformance.set(lastInteraction.pageUrl, current);
        }
      }
    }
    
    return Array.from(pagePerformance.entries())
      .sort((a, b) => {
        const scoreA = (a[1].conversions * 100) + (a[1].engagement * 10) + a[1].visits;
        const scoreB = (b[1].conversions * 100) + (b[1].engagement * 10) + b[1].visits;
        return scoreB - scoreA;
      })
      .slice(0, 10)
      .map(([url]) => url);
  }

  private generateOptimizationOpportunities(sessions: UserSession[]): OptimizationOpportunity[] {
    const opportunities: OptimizationOpportunity[] = [];
    
    // High bounce rate pages
    const pageBounces = new Map<string, { total: number; bounces: number }>();
    for (const session of sessions) {
      const landingPage = session.source.landingPage;
      const current = pageBounces.get(landingPage) || { total: 0, bounces: 0 };
      current.total++;
      if (session.pageViews === 1) current.bounces++;
      pageBounces.set(landingPage, current);
    }
    
    for (const [page, stats] of pageBounces) {
      const bounceRate = (stats.bounces / stats.total) * 100;
      if (bounceRate > 70 && stats.total >= 10) {
        opportunities.push({
          type: 'content',
          priority: 'high',
          description: `High bounce rate (${bounceRate.toFixed(1)}%) detected on ${page}`,
          potentialImpact: 85,
          implementation: 'Improve page content, loading speed, and user engagement elements',
          affectedPages: [page]
        });
      }
    }
    
    // Low conversion funnel performance
    const lowConversionPages = Array.from(pagePerformance.entries())
      .filter(([, stats]) => stats.visits >= 50 && (stats.conversions / stats.visits) < 0.02)
      .slice(0, 5);
    
    for (const [page] of lowConversionPages) {
      opportunities.push({
        type: 'conversion',
        priority: 'medium',
        description: `Low conversion rate detected on high-traffic page ${page}`,
        potentialImpact: 60,
        implementation: 'Add clear call-to-action elements, improve trust signals, optimize form placement',
        affectedPages: [page]
      });
    }
    
    return opportunities.slice(0, 10); // Return top 10 opportunities
  }

  private async getPageMetrics(pageUrl: string): Promise<any> {
    // This would integrate with actual page performance data
    return {
      engagement: Math.random() * 100,
      conversionRate: Math.random() * 10,
      bounceRate: Math.random() * 50,
      avgDuration: Math.random() * 300000,
      performance: {
        loadTime: Math.random() * 3000,
        cacheHit: Math.random() > 0.3,
        errorRate: Math.random() * 5
      }
    };
  }

  private async getPageSEOMetrics(pageUrl: string): Promise<PageSEOMetrics> {
    try {
      const seoData = await this.seoAnalytics.auditPage(pageUrl);
      return {
        seoScore: seoData.overallScore,
        keywordDensity: seoData.contentQuality.keywordOptimization || 0,
        metaTagsScore: seoData.technicalSEO.score || 0,
        structuredDataScore: Object.keys(seoData.technicalSEO.structuredData || {}).length * 20,
        contentQualityScore: seoData.contentQuality.overallScore || 0
      };
    } catch {
      return {
        seoScore: 0,
        keywordDensity: 0,
        metaTagsScore: 0,
        structuredDataScore: 0,
        contentQualityScore: 0
      };
    }
  }

  private generateSEORecommendations(pageMetrics: any, seoData: any): string[] {
    const recommendations: string[] = [];
    
    if (pageMetrics.bounceRate > 60) {
      recommendations.push('Improve page content engagement to reduce bounce rate');
    }
    
    if (seoData.overallScore < 70) {
      recommendations.push('Optimize SEO elements to improve search visibility');
    }
    
    if (pageMetrics.conversionRate < 2) {
      recommendations.push('Add conversion optimization elements');
    }
    
    return recommendations;
  }

  private async performFunnelAnalysis(funnelSteps: string[]): Promise<any> {
    // This would perform comprehensive funnel analysis
    // For now, return a simplified analysis structure
    return {
      overallConversionRate: Math.random() * 10,
      stepConversionRates: funnelSteps.map(() => Math.random() * 50 + 25),
      dropOffPoints: [{ step: 2, rate: 35 }, { step: 4, rate: 25 }],
      seoContribution: funnelSteps.map((_, index) => ({ step: index, percentage: Math.random() * 40 + 10 })),
      optimizationOpportunities: [
        {
          type: 'conversion' as const,
          priority: 'high' as const,
          description: 'Optimize step 2 conversion elements',
          potentialImpact: 25,
          implementation: 'Improve form design and trust signals',
          affectedPages: [funnelSteps[1]]
        }
      ]
    };
  }

  // Event handlers
  private handleClick(event: MouseEvent): void {
    if (this.isTracking) {
      const sessionId = this.getCurrentSessionId();
      if (sessionId) {
        this.trackInteraction(sessionId, 'click', { event });
      }
    }
  }

  private handleScroll(): void {
    if (this.isTracking) {
      const sessionId = this.getCurrentSessionId();
      if (sessionId) {
        this.trackInteraction(sessionId, 'scroll', { 
          scrollY: window.scrollY,
          scrollPercentage: (window.scrollY / document.body.scrollHeight) * 100
        });
      }
    }
  }

  private handleMouseOver(event: MouseEvent): void {
    if (this.isTracking && event.target) {
      const sessionId = this.getCurrentSessionId();
      if (sessionId) {
        this.trackInteraction(sessionId, 'hover', { 
          elementId: (event.target as HTMLElement).id,
          tagName: (event.target as HTMLElement).tagName
        });
      }
    }
  }

  private handleFocus(event: FocusEvent): void {
    if (this.isTracking && event.target) {
      const sessionId = this.getCurrentSessionId();
      if (sessionId) {
        this.trackInteraction(sessionId, 'focus', { 
          elementId: (event.target as HTMLElement).id,
          elementType: (event.target as HTMLElement).tagName
        });
      }
    }
  }

  private handleFormSubmit(event: SubmitEvent): void {
    if (this.isTracking) {
      const sessionId = this.getCurrentSessionId();
      const form = event.target as HTMLFormElement;
      if (sessionId) {
        this.trackInteraction(sessionId, 'form_submit', { 
          formId: form.id,
          formAction: form.action,
          formMethod: form.method
        });
      }
    }
  }

  private handleFormInput(event: Event): void {
    if (this.isTracking) {
      const sessionId = this.getCurrentSessionId();
      const input = event.target as HTMLInputElement;
      if (sessionId && input.type !== 'password') {
        this.trackInteraction(sessionId, 'form_input' as any, { 
          fieldName: input.name,
          fieldType: input.type
        });
      }
    }
  }

  private handlePageLoad(): void {
    if (this.isTracking) {
      const sessionId = this.getCurrentSessionId();
      if (sessionId) {
        const performanceData = this.performanceMonitor.getPageMetrics();
        this.trackInteraction(sessionId, 'page_load' as any, { 
          performance: performanceData,
          url: window.location.href
        });
      }
    }
  }

  private handleError(event: ErrorEvent): void {
    if (this.isTracking) {
      const sessionId = this.getCurrentSessionId();
      if (sessionId) {
        this.trackInteraction(sessionId, 'error' as any, { 
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno
        });
      }
    }
  }

  private handlePageExit(): void {
    // Save any pending analytics data before page unload
    this.flushAnalyticsQueue();
  }

  private handleVisibilityChange(): void {
    if (document.visibilityState === 'hidden') {
      this.flushAnalyticsQueue();
    }
  }

  private getCurrentSessionId(): string | null {
    // In a real implementation, this would retrieve the current session ID
    // For now, return the first active session
    const sessions = Array.from(this.activeSessions.keys());
    return sessions.length > 0 ? sessions[0] : null;
  }

  private flushAnalyticsQueue(): void {
    // In a real implementation, this would send pending analytics data to the server
    console.log('Flushing analytics queue:', this.analyticsQueue.length, 'events');
    this.analyticsQueue = [];
  }

  private startAnalyticsProcessing(): void {
    // Process analytics queue periodically
    setInterval(() => {
      if (this.analyticsQueue.length > 0) {
        this.processAnalyticsQueue();
      }
    }, 10000); // Process every 10 seconds
  }

  private processAnalyticsQueue(): void {
    // In a real implementation, this would batch and send analytics data
    const batchSize = Math.min(100, this.analyticsQueue.length);
    const batch = this.analyticsQueue.splice(0, batchSize);
    
    console.log('Processing analytics batch:', batch.length, 'events');
    // Send to analytics service
  }
}

// Additional interfaces for SEO context
interface SEOContext {
  metaTags: string[];
  structuredData: string[];
  contentScore: number;
}

interface PageSEOMetrics {
  seoScore: number;
  keywordDensity: number;
  metaTagsScore: number;
  structuredDataScore: number;
  contentQualityScore: number;
}

interface PagePerformanceMetrics {
  loadTime: number;
  cacheHit: boolean;
  errorRate: number;
}

interface PageActivity {
  url: string;
  activeUsers: number;
  interactions: number;
  conversionRate: number;
}

// Export the singleton instance
export const userBehaviorTracker = UserBehaviorTracker.getInstance();