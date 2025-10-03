/**
 * React Hook for User Behavior Tracking
 * 
 * Provides React components with comprehensive user behavior tracking capabilities,
 * SEO correlation analytics, and real-time performance monitoring.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  UserBehaviorTracker,
  UserSession,
  UserBehaviorInsights,
  RealTimeMetrics,
  UserJourney,
  ConversionType,
  InteractionType,
  OptimizationOpportunity
} from '../services/userBehaviorTracker';

// Hook interfaces
export interface UseUserBehaviorOptions {
  autoStart?: boolean;
  userId?: string;
  trackScrollDepth?: boolean;
  trackClicks?: boolean;
  trackFormInteractions?: boolean;
  enableRealTimeMetrics?: boolean;
  seoCorrelation?: boolean;
  conversionTracking?: boolean;
}

export interface UserBehaviorState {
  sessionId: string | null;
  isTracking: boolean;
  currentSession: UserSession | null;
  realTimeMetrics: RealTimeMetrics | null;
  behaviorInsights: UserBehaviorInsights | null;
  userJourney: UserJourney | null;
  seoCorrelation: any | null;
  optimizationOpportunities: OptimizationOpportunity[];
  loading: boolean;
  error: string | null;
}

export interface UserBehaviorActions {
  startTracking: (userId?: string) => Promise<void>;
  stopTracking: () => void;
  trackConversion: (type: ConversionType, value?: number, metadata?: any) => Promise<void>;
  trackCustomEvent: (type: string, metadata?: any) => Promise<void>;
  getUserJourney: () => Promise<UserJourney | null>;
  getBehaviorInsights: (timeRange?: { start: number; end: number }) => Promise<UserBehaviorInsights | null>;
  getSEOCorrelation: (pageUrl?: string) => Promise<any>;
  refreshMetrics: () => Promise<void>;
  exportAnalytics: (format?: 'json' | 'csv') => Promise<any>;
}

export type UseUserBehaviorReturn = [UserBehaviorState, UserBehaviorActions];

/**
 * Main user behavior tracking hook
 */
export function useUserBehavior(options: UseUserBehaviorOptions = {}): UseUserBehaviorReturn {
  const {
    autoStart = true,
    userId,
    trackScrollDepth = true,
    trackClicks = true,
    trackFormInteractions = true,
    enableRealTimeMetrics = true,
    seoCorrelation = true,
    conversionTracking = true
  } = options;

  const trackerRef = useRef<UserBehaviorTracker>(UserBehaviorTracker.getInstance());
  const metricsIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  const [state, setState] = useState<UserBehaviorState>({
    sessionId: null,
    isTracking: false,
    currentSession: null,
    realTimeMetrics: null,
    behaviorInsights: null,
    userJourney: null,
    seoCorrelation: null,
    optimizationOpportunities: [],
    loading: false,
    error: null
  });

  /**
   * Start user behavior tracking session
   */
  const startTracking = useCallback(async (overrideUserId?: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const newSessionId = await trackerRef.current.startSession({
        userId: overrideUserId || userId,
        source: {
          medium: 'direct' // This would be determined by the tracker
        }
      });

      setSessionId(newSessionId);
      setState(prev => ({ 
        ...prev, 
        sessionId: newSessionId,
        isTracking: true,
        loading: false 
      }));

      // Start real-time metrics updates if enabled
      if (enableRealTimeMetrics) {
        startRealTimeUpdates();
      }

      // Get initial SEO correlation data
      if (seoCorrelation && typeof window !== 'undefined') {
        const correlationData = await trackerRef.current.getSEOCorrelation(window.location.href);
        setState(prev => ({ ...prev, seoCorrelation: correlationData }));
      }

    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to start tracking' 
      }));
    }
  }, [userId, enableRealTimeMetrics, seoCorrelation]);

  /**
   * Stop user behavior tracking
   */
  const stopTracking = useCallback(() => {
    setState(prev => ({ 
      ...prev, 
      isTracking: false,
      sessionId: null 
    }));
    setSessionId(null);

    if (metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current);
      metricsIntervalRef.current = null;
    }
  }, []);

  /**
   * Track conversion events
   */
  const trackConversion = useCallback(async (
    type: ConversionType,
    value?: number,
    metadata?: any
  ) => {
    if (!sessionId || !conversionTracking) return;

    try {
      await trackerRef.current.trackConversion(sessionId, type, value, 'USD', metadata);
      
      // Refresh metrics after conversion
      await refreshMetrics();
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to track conversion' 
      }));
    }
  }, [sessionId, conversionTracking]);

  /**
   * Track custom events
   */
  const trackCustomEvent = useCallback(async (type: string, metadata?: any) => {
    if (!sessionId) return;

    try {
      await trackerRef.current.trackInteraction(sessionId, type as InteractionType, metadata);
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to track custom event' 
      }));
    }
  }, [sessionId]);

  /**
   * Get comprehensive user journey analysis
   */
  const getUserJourney = useCallback(async (): Promise<UserJourney | null> => {
    if (!sessionId) return null;

    try {
      setState(prev => ({ ...prev, loading: true }));
      const journey = await trackerRef.current.getUserJourney(sessionId);
      
      setState(prev => ({ 
        ...prev, 
        userJourney: journey, 
        loading: false 
      }));

      return journey;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to get user journey' 
      }));
      return null;
    }
  }, [sessionId]);

  /**
   * Get behavior insights with optional time range filtering
   */
  const getBehaviorInsights = useCallback(async (
    timeRange?: { start: number; end: number }
  ): Promise<UserBehaviorInsights | null> => {
    try {
      setState(prev => ({ ...prev, loading: true }));
      const insights = await trackerRef.current.getBehaviorInsights(timeRange);
      
      setState(prev => ({ 
        ...prev, 
        behaviorInsights: insights, 
        optimizationOpportunities: insights.optimizationOpportunities,
        loading: false 
      }));

      return insights;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to get behavior insights' 
      }));
      return null;
    }
  }, []);

  /**
   * Get SEO correlation data for specified page
   */
  const getSEOCorrelation = useCallback(async (pageUrl?: string): Promise<any> => {
    const url = pageUrl || (typeof window !== 'undefined' ? window.location.href : '');
    if (!url) return null;

    try {
      const correlationData = await trackerRef.current.getSEOCorrelation(url);
      setState(prev => ({ ...prev, seoCorrelation: correlationData }));
      return correlationData;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to get SEO correlation' 
      }));
      return null;
    }
  }, []);

  /**
   * Refresh all metrics and analytics data
   */
  const refreshMetrics = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      // Refresh real-time metrics
      if (enableRealTimeMetrics) {
        const realTimeData = trackerRef.current.getRealTimeMetrics();
        setState(prev => ({ ...prev, realTimeMetrics: realTimeData }));
      }

      // Refresh behavior insights
      const insights = await trackerRef.current.getBehaviorInsights();
      setState(prev => ({ 
        ...prev, 
        behaviorInsights: insights,
        optimizationOpportunities: insights.optimizationOpportunities
      }));

      // Refresh SEO correlation
      if (seoCorrelation && typeof window !== 'undefined') {
        const correlationData = await trackerRef.current.getSEOCorrelation(window.location.href);
        setState(prev => ({ ...prev, seoCorrelation: correlationData }));
      }

      setState(prev => ({ ...prev, loading: false }));
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Failed to refresh metrics' 
      }));
    }
  }, [enableRealTimeMetrics, seoCorrelation]);

  /**
   * Export analytics data in specified format
   */
  const exportAnalytics = useCallback(async (format: 'json' | 'csv' = 'json'): Promise<any> => {
    try {
      const insights = await trackerRef.current.getBehaviorInsights();
      const journey = sessionId ? await trackerRef.current.getUserJourney(sessionId) : null;
      
      const exportData = {
        timestamp: Date.now(),
        sessionId,
        behaviorInsights: insights,
        userJourney: journey,
        seoCorrelation: state.seoCorrelation,
        realTimeMetrics: state.realTimeMetrics
      };

      if (format === 'csv') {
        return convertToCSV(exportData);
      }

      return exportData;
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Failed to export analytics' 
      }));
      return null;
    }
  }, [sessionId, state.seoCorrelation, state.realTimeMetrics]);

  /**
   * Start real-time metrics updates
   */
  const startRealTimeUpdates = useCallback(() => {
    if (metricsIntervalRef.current) {
      clearInterval(metricsIntervalRef.current);
    }

    metricsIntervalRef.current = setInterval(() => {
      const realTimeData = trackerRef.current.getRealTimeMetrics();
      setState(prev => ({ ...prev, realTimeMetrics: realTimeData }));
    }, 5000); // Update every 5 seconds
  }, []);

  /**
   * Auto-start tracking on mount if enabled
   */
  useEffect(() => {
    if (autoStart && !sessionId) {
      startTracking();
    }

    // Cleanup on unmount
    return () => {
      if (metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
      }
    };
  }, [autoStart, startTracking, sessionId]);

  /**
   * Setup page visibility change handling
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && enableRealTimeMetrics) {
        startRealTimeUpdates();
      } else if (document.visibilityState === 'hidden' && metricsIntervalRef.current) {
        clearInterval(metricsIntervalRef.current);
        metricsIntervalRef.current = null;
      }
    };

    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, [enableRealTimeMetrics, startRealTimeUpdates]);

  /**
   * Track page navigation changes
   */
  useEffect(() => {
    if (!sessionId) return;

    const handlePopState = () => {
      // Track navigation as a custom event
      trackCustomEvent('navigation', { 
        url: window.location.href,
        timestamp: Date.now()
      });

      // Update SEO correlation for new page
      if (seoCorrelation) {
        getSEOCorrelation();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('popstate', handlePopState);
      return () => window.removeEventListener('popstate', handlePopState);
    }
  }, [sessionId, trackCustomEvent, getSEOCorrelation, seoCorrelation]);

  const actions: UserBehaviorActions = {
    startTracking,
    stopTracking,
    trackConversion,
    trackCustomEvent,
    getUserJourney,
    getBehaviorInsights,
    getSEOCorrelation,
    refreshMetrics,
    exportAnalytics
  };

  return [state, actions];
}

/**
 * Hook for specific SEO correlation tracking
 */
export function useSEOCorrelation(pageUrl?: string) {
  const [state, { getSEOCorrelation }] = useUserBehavior({ 
    autoStart: false, 
    seoCorrelation: true 
  });
  
  const [correlationData, setCorrelationData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCorrelation = useCallback(async (url?: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getSEOCorrelation(url || pageUrl);
      setCorrelationData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch SEO correlation');
    } finally {
      setLoading(false);
    }
  }, [getSEOCorrelation, pageUrl]);

  useEffect(() => {
    if (pageUrl || (typeof window !== 'undefined' && window.location.href)) {
      fetchCorrelation();
    }
  }, [pageUrl, fetchCorrelation]);

  return {
    correlationData,
    loading,
    error,
    refetch: fetchCorrelation
  };
}

/**
 * Hook for conversion funnel tracking
 */
export function useConversionFunnel(funnelSteps: string[]) {
  const [state, { trackConversion }] = useUserBehavior({ conversionTracking: true });
  const [funnelData, setFunnelData] = useState<any>(null);
  const [currentStep, setCurrentStep] = useState(0);

  const advanceToStep = useCallback((stepIndex: number, metadata?: any) => {
    if (stepIndex < funnelSteps.length) {
      setCurrentStep(stepIndex);
      
      // Track step advancement as custom event
      if (state.sessionId) {
        const tracker = UserBehaviorTracker.getInstance();
        tracker.trackInteraction(state.sessionId, 'funnel_step' as any, {
          step: stepIndex,
          stepName: funnelSteps[stepIndex],
          metadata
        });
      }
    }
  }, [funnelSteps, state.sessionId]);

  const completeConversion = useCallback(async (
    type: ConversionType,
    value?: number,
    metadata?: any
  ) => {
    await trackConversion(type, value, { 
      ...metadata,
      funnelCompleted: true,
      finalStep: currentStep
    });
  }, [trackConversion, currentStep]);

  const getFunnelAnalysis = useCallback(async () => {
    const tracker = UserBehaviorTracker.getInstance();
    const analysis = await tracker.getFunnelAnalysis(funnelSteps);
    setFunnelData(analysis);
    return analysis;
  }, [funnelSteps]);

  return {
    currentStep,
    funnelData,
    advanceToStep,
    completeConversion,
    getFunnelAnalysis,
    isTracking: state.isTracking
  };
}

/**
 * Hook for real-time analytics monitoring
 */
export function useRealTimeAnalytics(refreshInterval: number = 5000) {
  const [state, { refreshMetrics }] = useUserBehavior({ 
    enableRealTimeMetrics: true,
    autoStart: false 
  });
  
  const [metrics, setMetrics] = useState<RealTimeMetrics | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      refreshMetrics();
      setMetrics(state.realTimeMetrics);
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshMetrics, refreshInterval, state.realTimeMetrics]);

  return {
    metrics: metrics || state.realTimeMetrics,
    loading: state.loading,
    error: state.error
  };
}

/**
 * Hook for behavior insights with caching
 */
export function useBehaviorInsights(
  timeRange?: { start: number; end: number },
  refreshInterval?: number
) {
  const [state, { getBehaviorInsights }] = useUserBehavior({ autoStart: false });
  const [insights, setInsights] = useState<UserBehaviorInsights | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchInsights = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getBehaviorInsights(timeRange);
      setInsights(data);
    } finally {
      setLoading(false);
    }
  }, [getBehaviorInsights, timeRange]);

  useEffect(() => {
    fetchInsights();

    if (refreshInterval) {
      const interval = setInterval(fetchInsights, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchInsights, refreshInterval]);

  return {
    insights,
    loading,
    error: state.error,
    refetch: fetchInsights
  };
}

// Utility functions
function convertToCSV(data: any): string {
  // Simple CSV conversion for analytics data
  const headers = Object.keys(data).join(',');
  const values = Object.values(data).map(value => 
    typeof value === 'object' ? JSON.stringify(value) : String(value)
  ).join(',');
  
  return `${headers}\n${values}`;
}

// Export all hooks and types
export default useUserBehavior;