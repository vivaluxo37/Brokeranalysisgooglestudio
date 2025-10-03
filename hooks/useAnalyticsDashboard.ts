/**
 * Analytics Dashboard Hook
 * 
 * React hook for managing analytics dashboard state, data aggregation,
 * and real-time updates across all Phase 4 analytics services.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  AnalyticsAggregator, 
  UnifiedAnalyticsData, 
  AnalyticsCorrelation, 
  CrossServiceInsight,
  AnalyticsHealth 
} from '../services/analyticsAggregator';
import { BusinessIntelligence } from '../services/businessIntelligence';
import { UserBehaviorTracker } from '../services/userBehaviorTracker';
import { ConversionOptimizer } from '../services/conversionOptimizer';
import { ABTestingFramework } from '../services/abTestingFramework';

// Hook configuration interface
export interface AnalyticsDashboardConfig {
  audience?: 'executive' | 'operational' | 'technical';
  refreshInterval?: number;
  autoStart?: boolean;
  enableRealTime?: boolean;
  timeRange?: { start: number; end: number };
  customFilters?: Record<string, any>;
  maxInsights?: number;
  maxCorrelations?: number;
  cacheTimeout?: number;
}

// Dashboard state interface
export interface DashboardState {
  // Data
  unifiedData: UnifiedAnalyticsData | null;
  correlations: AnalyticsCorrelation[];
  insights: CrossServiceInsight[];
  health: AnalyticsHealth | null;
  executiveDashboard: any;
  
  // Status
  loading: boolean;
  error: string | null;
  lastUpdated: number;
  nextRefresh: number;
  
  // Metadata
  totalMetrics: number;
  activeServices: string[];
  dataQuality: number;
}

// Dashboard actions interface
export interface DashboardActions {
  // Data management
  refresh: () => Promise<void>;
  refreshService: (service: string) => Promise<void>;
  clearCache: () => Promise<void>;
  
  // Insights and correlations
  getInsightDetails: (insightId: string) => Promise<any>;
  getCorrelationDetails: (correlationId: string) => Promise<any>;
  dismissInsight: (insightId: string) => void;
  
  // Configuration
  updateConfig: (newConfig: Partial<AnalyticsDashboardConfig>) => void;
  setTimeRange: (range: { start: number; end: number }) => void;
  setFilters: (filters: Record<string, any>) => void;
  
  // Export and sharing
  exportDashboard: (format: 'json' | 'csv' | 'pdf') => Promise<string>;
  shareDashboard: (recipients: string[]) => Promise<void>;
  
  // Real-time controls
  startRealTime: () => void;
  stopRealTime: () => void;
  
  // Health monitoring
  checkServiceHealth: () => Promise<AnalyticsHealth>;
  resolveHealthIssue: (issueId: string) => Promise<boolean>;
}

// Performance metrics for the dashboard itself
export interface DashboardPerformance {
  loadTime: number;
  refreshTime: number;
  errorRate: number;
  cacheHitRate: number;
  apiCallCount: number;
  memoryUsage: number;
}

// Hook return type
export type UseAnalyticsDashboardReturn = [
  DashboardState,
  DashboardActions,
  DashboardPerformance
];

/**
 * Main analytics dashboard hook
 */
export function useAnalyticsDashboard(
  config: AnalyticsDashboardConfig = {}
): UseAnalyticsDashboardReturn {
  const {
    audience = 'operational',
    refreshInterval = 30000,
    autoStart = true,
    enableRealTime = true,
    timeRange,
    customFilters,
    maxInsights = 10,
    maxCorrelations = 20,
    cacheTimeout = 60000
  } = config;

  // Service instances
  const analyticsAggregator = useRef(AnalyticsAggregator.getInstance());
  const businessIntelligence = useRef(BusinessIntelligence.getInstance());
  const userBehaviorTracker = useRef(UserBehaviorTracker.getInstance());
  const conversionOptimizer = useRef(ConversionOptimizer.getInstance());
  const abTestingFramework = useRef(ABTestingFramework.getInstance());

  // State management
  const [state, setState] = useState<DashboardState>({
    unifiedData: null,
    correlations: [],
    insights: [],
    health: null,
    executiveDashboard: null,
    loading: false,
    error: null,
    lastUpdated: 0,
    nextRefresh: 0,
    totalMetrics: 0,
    activeServices: [],
    dataQuality: 0
  });

  // Performance tracking
  const [performance, setPerformance] = useState<DashboardPerformance>({
    loadTime: 0,
    refreshTime: 0,
    errorRate: 0,
    cacheHitRate: 0,
    apiCallCount: 0,
    memoryUsage: 0
  });

  // Internal state
  const refreshTimer = useRef<NodeJS.Timeout | null>(null);
  const realTimeEnabled = useRef(enableRealTime);
  const dismissedInsights = useRef<Set<string>>(new Set());
  const [currentConfig, setCurrentConfig] = useState(config);

  /**
   * Refresh all dashboard data
   */
  const refresh = useCallback(async (): Promise<void> => {
    const startTime = Date.now();
    let apiCalls = 0;

    try {
      setState(prev => ({ 
        ...prev, 
        loading: true, 
        error: null 
      }));

      setPerformance(prev => ({ 
        ...prev, 
        apiCallCount: prev.apiCallCount + 1 
      }));

      // Get current session info
      const sessionId = await getCurrentSessionId();
      const userId = getCurrentUserId();
      const pageUrl = window.location.href;

      // Parallel data fetching for optimal performance
      const [
        unifiedData,
        correlations,
        insights,
        health,
        executiveDashboard
      ] = await Promise.all([
        analyticsAggregator.current.aggregateAnalytics(sessionId, userId, pageUrl)
          .then(data => { apiCalls++; return data; }),
        analyticsAggregator.current.getAnalyticsCorrelations(timeRange, undefined, 0.3)
          .then(data => { apiCalls++; return data; }),
        analyticsAggregator.current.getCrossServiceInsights('high', undefined, maxInsights)
          .then(data => { apiCalls++; return data; }),
        analyticsAggregator.current.getAnalyticsHealth()
          .then(data => { apiCalls++; return data; }),
        businessIntelligence.current.getExecutiveDashboard('1m', customFilters)
          .then(data => { apiCalls++; return data; })
      ]);

      // Filter out dismissed insights
      const filteredInsights = insights.filter(
        insight => !dismissedInsights.current.has(insight.insightId)
      );

      // Calculate data quality
      const dataQuality = calculateDataQuality(unifiedData, health);

      // Update state
      setState({
        unifiedData,
        correlations: correlations.slice(0, maxCorrelations),
        insights: filteredInsights,
        health,
        executiveDashboard,
        loading: false,
        error: null,
        lastUpdated: Date.now(),
        nextRefresh: Date.now() + refreshInterval,
        totalMetrics: calculateTotalMetrics(unifiedData),
        activeServices: getActiveServices(health),
        dataQuality
      });

      // Update performance metrics
      const loadTime = Date.now() - startTime;
      setPerformance(prev => ({
        ...prev,
        loadTime,
        refreshTime: loadTime,
        apiCallCount: prev.apiCallCount + apiCalls - 1,
        errorRate: Math.max(0, prev.errorRate - 0.1) // Decrease error rate on success
      }));

    } catch (error) {
      console.error('Dashboard refresh error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to refresh dashboard';
      
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
        lastUpdated: Date.now()
      }));

      setPerformance(prev => ({
        ...prev,
        errorRate: Math.min(100, prev.errorRate + 5),
        apiCallCount: prev.apiCallCount + apiCalls
      }));
    }
  }, [timeRange, customFilters, maxInsights, maxCorrelations, refreshInterval]);

  /**
   * Refresh specific service data
   */
  const refreshService = useCallback(async (service: string): Promise<void> => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      let updatedData: Partial<DashboardState> = {};

      switch (service) {
        case 'user_behavior':
          const behaviorInsights = await userBehaviorTracker.current.getBehaviorInsights();
          updatedData = { 
            unifiedData: state.unifiedData ? {
              ...state.unifiedData,
              userBehavior: {
                ...state.unifiedData.userBehavior,
                engagementScore: behaviorInsights?.overallEngagement || 0
              }
            } : null
          };
          break;

        case 'conversion':
          const conversionInsights = await conversionOptimizer.current.getOptimizationInsights();
          updatedData = {
            unifiedData: state.unifiedData ? {
              ...state.unifiedData,
              conversionData: {
                ...state.unifiedData.conversionData,
                conversionProbability: conversionInsights.conversionVelocity / 100
              }
            } : null
          };
          break;

        case 'health':
          const health = await analyticsAggregator.current.getAnalyticsHealth();
          updatedData = { health };
          break;

        default:
          console.warn(`Unknown service: ${service}`);
          return;
      }

      setState(prev => ({
        ...prev,
        ...updatedData,
        loading: false,
        lastUpdated: Date.now()
      }));

    } catch (error) {
      console.error(`Error refreshing ${service}:`, error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: `Failed to refresh ${service}`
      }));
    }
  }, [state.unifiedData]);

  /**
   * Clear dashboard cache
   */
  const clearCache = useCallback(async (): Promise<void> => {
    try {
      // This would integrate with the cache service to clear relevant caches
      console.log('Clearing dashboard cache...');
      
      // Force refresh after cache clear
      await refresh();
      
      setPerformance(prev => ({
        ...prev,
        cacheHitRate: 0 // Reset cache hit rate
      }));
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }, [refresh]);

  /**
   * Get detailed insight information
   */
  const getInsightDetails = useCallback(async (insightId: string): Promise<any> => {
    const insight = state.insights.find(i => i.insightId === insightId);
    if (!insight) return null;

    // This would fetch additional details for the insight
    return {
      ...insight,
      detailedAnalysis: 'Detailed analysis would be fetched here',
      recommendationDetails: insight.recommendations.map(rec => ({
        ...rec,
        detailedSteps: ['Step 1', 'Step 2', 'Step 3'],
        expectedTimeline: '2-4 weeks',
        resourceRequirements: ['Developer', 'Designer']
      })),
      historicalTrend: generateMockTrendData(),
      impactProjection: calculateImpactProjection(insight)
    };
  }, [state.insights]);

  /**
   * Get detailed correlation information
   */
  const getCorrelationDetails = useCallback(async (correlationId: string): Promise<any> => {
    const correlation = state.correlations.find(c => c.correlationId === correlationId);
    if (!correlation) return null;

    return {
      ...correlation,
      historicalData: generateMockHistoricalData(),
      predictiveModel: generateMockPredictiveModel(correlation),
      actionableInsights: generateActionableInsights(correlation),
      similarCorrelations: findSimilarCorrelations(correlation, state.correlations)
    };
  }, [state.correlations]);

  /**
   * Dismiss an insight
   */
  const dismissInsight = useCallback((insightId: string): void => {
    dismissedInsights.current.add(insightId);
    setState(prev => ({
      ...prev,
      insights: prev.insights.filter(insight => insight.insightId !== insightId)
    }));
  }, []);

  /**
   * Update dashboard configuration
   */
  const updateConfig = useCallback((newConfig: Partial<AnalyticsDashboardConfig>): void => {
    setCurrentConfig(prev => ({ ...prev, ...newConfig }));
    
    // Apply configuration changes that require immediate action
    if (newConfig.refreshInterval !== undefined) {
      setupRefreshTimer(newConfig.refreshInterval);
    }
    
    if (newConfig.enableRealTime !== undefined) {
      realTimeEnabled.current = newConfig.enableRealTime;
      if (newConfig.enableRealTime) {
        startRealTime();
      } else {
        stopRealTime();
      }
    }
  }, []);

  /**
   * Set dashboard time range
   */
  const setTimeRange = useCallback((range: { start: number; end: number }): void => {
    updateConfig({ timeRange: range });
    refresh(); // Refresh with new time range
  }, [updateConfig, refresh]);

  /**
   * Set dashboard filters
   */
  const setFilters = useCallback((filters: Record<string, any>): void => {
    updateConfig({ customFilters: filters });
    refresh(); // Refresh with new filters
  }, [updateConfig, refresh]);

  /**
   * Export dashboard data
   */
  const exportDashboard = useCallback(async (format: 'json' | 'csv' | 'pdf'): Promise<string> => {
    try {
      const exportData = {
        timestamp: Date.now(),
        config: currentConfig,
        state: {
          unifiedData: state.unifiedData,
          correlations: state.correlations,
          insights: state.insights,
          health: state.health,
          performance
        }
      };

      switch (format) {
        case 'json':
          return JSON.stringify(exportData, null, 2);
        
        case 'csv':
          return convertToCSV(exportData);
        
        case 'pdf':
          return await generatePDFReport(exportData);
        
        default:
          throw new Error(`Unsupported export format: ${format}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      throw error;
    }
  }, [currentConfig, state, performance]);

  /**
   * Share dashboard with recipients
   */
  const shareDashboard = useCallback(async (recipients: string[]): Promise<void> => {
    try {
      const shareableData = await exportDashboard('json');
      
      // This would integrate with sharing service
      console.log(`Sharing dashboard with ${recipients.join(', ')}`);
      
      // In a real implementation, this would:
      // 1. Generate a secure sharing link
      // 2. Send email notifications
      // 3. Set appropriate permissions
      
    } catch (error) {
      console.error('Share error:', error);
      throw error;
    }
  }, [exportDashboard]);

  /**
   * Start real-time updates
   */
  const startRealTime = useCallback((): void => {
    if (realTimeEnabled.current && refreshInterval > 0) {
      setupRefreshTimer(refreshInterval);
    }
  }, [refreshInterval]);

  /**
   * Stop real-time updates
   */
  const stopRealTime = useCallback((): void => {
    if (refreshTimer.current) {
      clearInterval(refreshTimer.current);
      refreshTimer.current = null;
    }
  }, []);

  /**
   * Check service health
   */
  const checkServiceHealth = useCallback(async (): Promise<AnalyticsHealth> => {
    const health = await analyticsAggregator.current.getAnalyticsHealth();
    
    setState(prev => ({ ...prev, health }));
    
    return health;
  }, []);

  /**
   * Resolve health issue
   */
  const resolveHealthIssue = useCallback(async (issueId: string): Promise<boolean> => {
    try {
      // This would integrate with health management system
      console.log(`Resolving health issue: ${issueId}`);
      
      // Refresh health status after resolution attempt
      await checkServiceHealth();
      
      return true;
    } catch (error) {
      console.error('Error resolving health issue:', error);
      return false;
    }
  }, [checkServiceHealth]);

  /**
   * Setup refresh timer
   */
  const setupRefreshTimer = useCallback((interval: number): void => {
    if (refreshTimer.current) {
      clearInterval(refreshTimer.current);
    }
    
    if (interval > 0) {
      refreshTimer.current = setInterval(refresh, interval);
    }
  }, [refresh]);

  /**
   * Initialize dashboard
   */
  useEffect(() => {
    if (autoStart) {
      refresh();
    }
  }, [autoStart, refresh]);

  /**
   * Setup refresh timer
   */
  useEffect(() => {
    if (enableRealTime) {
      startRealTime();
    }
    
    return () => {
      stopRealTime();
    };
  }, [enableRealTime, startRealTime, stopRealTime]);

  /**
   * Monitor memory usage
   */
  useEffect(() => {
    const updateMemoryUsage = () => {
      if ('performance' in window && 'memory' in (window.performance as any)) {
        const memory = (window.performance as any).memory;
        setPerformance(prev => ({
          ...prev,
          memoryUsage: memory.usedJSHeapSize / 1024 / 1024 // MB
        }));
      }
    };

    const memoryTimer = setInterval(updateMemoryUsage, 5000);
    return () => clearInterval(memoryTimer);
  }, []);

  // Compile actions object
  const actions: DashboardActions = {
    refresh,
    refreshService,
    clearCache,
    getInsightDetails,
    getCorrelationDetails,
    dismissInsight,
    updateConfig,
    setTimeRange,
    setFilters,
    exportDashboard,
    shareDashboard,
    startRealTime,
    stopRealTime,
    checkServiceHealth,
    resolveHealthIssue
  };

  return [state, actions, performance];
}

// Helper functions

async function getCurrentSessionId(): Promise<string | undefined> {
  // This would integrate with session management
  return 'session_' + Date.now();
}

function getCurrentUserId(): string | undefined {
  // This would integrate with user management
  return undefined;
}

function calculateDataQuality(
  unifiedData: UnifiedAnalyticsData | null,
  health: AnalyticsHealth | null
): number {
  if (!unifiedData || !health) return 0;

  // Simple data quality calculation
  const completeness = unifiedData.userBehavior.engagementScore > 0 ? 25 : 0;
  const accuracy = unifiedData.seoPerformance.contentQualityScore > 0 ? 25 : 0;
  const timeliness = Date.now() - unifiedData.timestamp < 300000 ? 25 : 0; // 5 minutes
  const healthScore = health.overallHealth > 80 ? 25 : health.overallHealth / 4;

  return completeness + accuracy + timeliness + healthScore;
}

function calculateTotalMetrics(unifiedData: UnifiedAnalyticsData | null): number {
  if (!unifiedData) return 0;
  
  // Count available metrics
  let count = 0;
  if (unifiedData.userBehavior.engagementScore > 0) count++;
  if (unifiedData.seoPerformance.contentQualityScore > 0) count++;
  if (unifiedData.conversionData.conversionProbability > 0) count++;
  if (unifiedData.performanceMetrics.pageLoadTime > 0) count++;
  if (unifiedData.businessContext.businessImpact > 0) count++;
  
  return count;
}

function getActiveServices(health: AnalyticsHealth | null): string[] {
  if (!health) return [];
  
  return Object.entries(health.serviceHealth)
    .filter(([, serviceHealth]) => serviceHealth.status === 'healthy')
    .map(([service]) => service);
}

function generateMockTrendData(): any[] {
  return Array.from({ length: 30 }, (_, i) => ({
    date: Date.now() - (29 - i) * 24 * 60 * 60 * 1000,
    value: Math.random() * 100
  }));
}

function calculateImpactProjection(insight: CrossServiceInsight): any {
  return {
    shortTerm: Math.random() * 30 + 10,
    mediumTerm: Math.random() * 60 + 20,
    longTerm: Math.random() * 100 + 30,
    confidence: insight.confidence
  };
}

function generateMockHistoricalData(): any[] {
  return Array.from({ length: 100 }, (_, i) => ({
    x: Math.random() * 100,
    y: Math.random() * 100,
    timestamp: Date.now() - i * 60 * 60 * 1000
  }));
}

function generateMockPredictiveModel(correlation: AnalyticsCorrelation): any {
  return {
    equation: `y = ${correlation.strength.toFixed(2)}x + ${Math.random().toFixed(2)}`,
    rSquared: Math.pow(correlation.strength, 2),
    confidence: correlation.confidence,
    predictions: generateMockTrendData()
  };
}

function generateActionableInsights(correlation: AnalyticsCorrelation): string[] {
  return [
    `Optimize ${correlation.primaryMetric.metric} to improve ${correlation.secondaryMetric.metric}`,
    `Monitor correlation strength for early trend detection`,
    `Consider A/B testing correlation-based optimizations`
  ];
}

function findSimilarCorrelations(
  correlation: AnalyticsCorrelation,
  allCorrelations: AnalyticsCorrelation[]
): AnalyticsCorrelation[] {
  return allCorrelations
    .filter(c => 
      c.correlationId !== correlation.correlationId &&
      Math.abs(c.strength - correlation.strength) < 0.2
    )
    .slice(0, 3);
}

function convertToCSV(data: any): string {
  // Simplified CSV conversion
  const headers = Object.keys(data).join(',');
  const values = Object.values(data).map(v => 
    typeof v === 'object' ? JSON.stringify(v) : String(v)
  ).join(',');
  
  return `${headers}\n${values}`;
}

async function generatePDFReport(data: any): Promise<string> {
  // This would integrate with PDF generation service
  console.log('Generating PDF report...', data);
  return 'pdf-report-url';
}

export default useAnalyticsDashboard;