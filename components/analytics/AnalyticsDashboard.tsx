/**
 * Analytics Dashboard Component
 * 
 * Real-time analytics dashboard providing comprehensive business intelligence
 * with executive insights, operational metrics, and cross-service correlations.
 * Integrates with all Phase 4 analytics services for unified data visualization.
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  AnalyticsAggregator, 
  UnifiedAnalyticsData, 
  AnalyticsCorrelation, 
  CrossServiceInsight,
  AnalyticsHealth 
} from '../../services/analyticsAggregator';
import { BusinessIntelligence } from '../../services/businessIntelligence';
import { useUserBehavior } from '../../hooks/useUserBehavior';

// Component Props
interface AnalyticsDashboardProps {
  audience?: 'executive' | 'operational' | 'technical';
  refreshInterval?: number;
  timeRange?: { start: number; end: number };
  customFilters?: Record<string, any>;
  onInsightClick?: (insight: CrossServiceInsight) => void;
  onCorrelationClick?: (correlation: AnalyticsCorrelation) => void;
  className?: string;
}

// Dashboard State Interface
interface DashboardState {
  unifiedData: UnifiedAnalyticsData | null;
  correlations: AnalyticsCorrelation[];
  insights: CrossServiceInsight[];
  health: AnalyticsHealth | null;
  executiveDashboard: any;
  loading: boolean;
  error: string | null;
  lastUpdated: number;
}

// KPI Card Component
interface KPICardProps {
  title: string;
  value: number | string;
  trend?: 'up' | 'down' | 'stable';
  trendValue?: number;
  target?: number;
  format?: 'number' | 'percentage' | 'currency' | 'duration';
  status?: 'excellent' | 'good' | 'warning' | 'critical';
  onClick?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  trend,
  trendValue,
  target,
  format = 'number',
  status = 'good',
  onClick
}) => {
  const formatValue = (val: number | string): string => {
    if (typeof val === 'string') return val;
    
    switch (format) {
      case 'percentage':
        return `${val.toFixed(1)}%`;
      case 'currency':
        return `$${val.toLocaleString()}`;
      case 'duration':
        return `${(val / 1000).toFixed(1)}s`;
      default:
        return val.toLocaleString();
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'excellent':
        return 'border-green-500 bg-green-50';
      case 'good':
        return 'border-blue-500 bg-blue-50';
      case 'warning':
        return 'border-yellow-500 bg-yellow-50';
      case 'critical':
        return 'border-red-500 bg-red-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable'): string => {
    switch (trend) {
      case 'up':
        return '↗️';
      case 'down':
        return '↘️';
      case 'stable':
        return '→';
      default:
        return '';
    }
  };

  return (
    <div 
      className={`p-4 rounded-lg border-2 cursor-pointer hover:shadow-md transition-shadow ${getStatusColor(status)}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        {trend && (
          <span className="text-xs flex items-center">
            {getTrendIcon(trend)}
            {trendValue && (
              <span className={`ml-1 ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                {Math.abs(trendValue).toFixed(1)}%
              </span>
            )}
          </span>
        )}
      </div>
      <div className="flex justify-between items-end">
        <span className="text-2xl font-bold">{formatValue(value)}</span>
        {target && (
          <span className="text-xs text-gray-500">
            Target: {formatValue(target)}
          </span>
        )}
      </div>
    </div>
  );
};

// Insight Card Component
interface InsightCardProps {
  insight: CrossServiceInsight;
  onClick?: (insight: CrossServiceInsight) => void;
}

const InsightCard: React.FC<InsightCardProps> = ({ insight, onClick }) => {
  const getPriorityColor = (priority: string): string => {
    switch (priority) {
      case 'critical':
        return 'border-red-500 bg-red-50';
      case 'high':
        return 'border-orange-500 bg-orange-50';
      case 'medium':
        return 'border-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-blue-500 bg-blue-50';
      default:
        return 'border-gray-300 bg-white';
    }
  };

  return (
    <div 
      className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-shadow ${getPriorityColor(insight.priority)}`}
      onClick={() => onClick?.(insight)}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-800">{insight.title}</h4>
        <div className="flex space-x-2">
          <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(insight.priority)}`}>
            {insight.priority.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500">
            {Math.round(insight.confidence * 100)}% confidence
          </span>
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3">{insight.description}</p>
      <div className="flex flex-wrap gap-2">
        {insight.services.map(service => (
          <span key={service} className="px-2 py-1 bg-gray-100 text-xs rounded">
            {service}
          </span>
        ))}
      </div>
      {insight.recommendations.length > 0 && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs font-medium text-gray-700">Top Recommendation:</p>
          <p className="text-xs text-gray-600">{insight.recommendations[0].title}</p>
        </div>
      )}
    </div>
  );
};

// Correlation Visualization Component
interface CorrelationVizProps {
  correlations: AnalyticsCorrelation[];
  onCorrelationClick?: (correlation: AnalyticsCorrelation) => void;
}

const CorrelationVisualization: React.FC<CorrelationVizProps> = ({ correlations, onCorrelationClick }) => {
  const strongCorrelations = correlations.filter(c => c.strength > 0.6);
  
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">Strong Correlations</h3>
      <div className="space-y-3">
        {strongCorrelations.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No strong correlations detected</p>
        ) : (
          strongCorrelations.map(correlation => (
            <div 
              key={correlation.correlationId}
              className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => onCorrelationClick?.(correlation)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <span className="text-sm font-medium">
                    {correlation.primaryMetric.metric} ↔ {correlation.secondaryMetric.metric}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {correlation.primaryMetric.service} • {correlation.secondaryMetric.service}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold">
                    {(correlation.strength * 100).toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">strength</div>
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${
                    correlation.correlationType === 'positive' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${correlation.strength * 100}%` }}
                />
              </div>
              {correlation.businessImplications.length > 0 && (
                <p className="text-xs text-gray-600 mt-2">
                  Impact: {correlation.businessImplications[0].description}
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// Health Status Component
interface HealthStatusProps {
  health: AnalyticsHealth | null;
}

const HealthStatus: React.FC<HealthStatusProps> = ({ health }) => {
  if (!health) {
    return (
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">System Health</h3>
        <div className="text-center py-8 text-gray-500">Loading health data...</div>
      </div>
    );
  }

  const getHealthColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getHealthStatus = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 75) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-4">System Health</h3>
      
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Overall Health</span>
          <span className={`font-bold ${getHealthColor(health.overallHealth)}`}>
            {getHealthStatus(health.overallHealth)} ({health.overallHealth.toFixed(1)})
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className={`h-3 rounded-full ${
              health.overallHealth >= 90 ? 'bg-green-500' :
              health.overallHealth >= 75 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${health.overallHealth}%` }}
          />
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(health.serviceHealth).map(([service, serviceHealth]) => (
          <div key={service} className="flex justify-between items-center">
            <span className="text-sm capitalize">{service.replace('_', ' ')}</span>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 text-xs rounded-full ${
                serviceHealth.status === 'healthy' ? 'bg-green-100 text-green-800' :
                serviceHealth.status === 'degraded' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {serviceHealth.status}
              </span>
              <span className="text-xs text-gray-500">
                {serviceHealth.uptime.toFixed(1)}% uptime
              </span>
            </div>
          </div>
        ))}
      </div>

      {health.alerts.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium text-red-600 mb-2">Active Alerts</h4>
          <div className="space-y-2">
            {health.alerts.slice(0, 3).map((alert, index) => (
              <div key={index} className="p-2 bg-red-50 border border-red-200 rounded">
                <p className="text-sm text-red-800">{alert.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Main Analytics Dashboard Component
const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  audience = 'operational',
  refreshInterval = 30000, // 30 seconds
  timeRange,
  customFilters,
  onInsightClick,
  onCorrelationClick,
  className = ''
}) => {
  const [state, setState] = useState<DashboardState>({
    unifiedData: null,
    correlations: [],
    insights: [],
    health: null,
    executiveDashboard: null,
    loading: true,
    error: null,
    lastUpdated: 0
  });

  // Analytics service instances
  const analyticsAggregator = useMemo(() => AnalyticsAggregator.getInstance(), []);
  const businessIntelligence = useMemo(() => BusinessIntelligence.getInstance(), []);
  
  // User behavior hook for session tracking
  const [userBehaviorState] = useUserBehavior({ autoStart: true });

  /**
   * Refresh all dashboard data
   */
  const refreshDashboard = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Aggregate all analytics data
      const [
        unifiedData,
        correlations,
        insights,
        health,
        executiveDashboard
      ] = await Promise.all([
        analyticsAggregator.aggregateAnalytics(
          userBehaviorState.sessionId || undefined,
          undefined,
          window.location.href
        ),
        analyticsAggregator.getAnalyticsCorrelations(timeRange),
        analyticsAggregator.getCrossServiceInsights('high', undefined, 10),
        analyticsAggregator.getAnalyticsHealth(),
        businessIntelligence.getExecutiveDashboard('1m', customFilters)
      ]);

      setState({
        unifiedData,
        correlations,
        insights,
        health,
        executiveDashboard,
        loading: false,
        error: null,
        lastUpdated: Date.now()
      });
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: error instanceof Error ? error.message : 'Failed to load dashboard data'
      }));
    }
  }, [
    analyticsAggregator,
    businessIntelligence,
    userBehaviorState.sessionId,
    timeRange,
    customFilters
  ]);

  /**
   * Handle insight selection
   */
  const handleInsightClick = useCallback((insight: CrossServiceInsight) => {
    onInsightClick?.(insight);
    
    // Could open detailed insight modal or navigate to specific view
    console.log('Insight clicked:', insight);
  }, [onInsightClick]);

  /**
   * Handle correlation selection
   */
  const handleCorrelationClick = useCallback((correlation: AnalyticsCorrelation) => {
    onCorrelationClick?.(correlation);
    
    // Could open correlation analysis modal
    console.log('Correlation clicked:', correlation);
  }, [onCorrelationClick]);

  /**
   * Calculate KPIs from unified data
   */
  const kpis = useMemo(() => {
    if (!state.unifiedData) return [];

    const { unifiedData } = state;
    
    return [
      {
        title: 'User Engagement',
        value: unifiedData.userBehavior.engagementScore,
        trend: 'up' as const,
        trendValue: 12.5,
        target: 80,
        format: 'number' as const,
        status: unifiedData.userBehavior.engagementScore > 70 ? 'good' as const : 'warning' as const
      },
      {
        title: 'SEO Performance',
        value: (unifiedData.seoPerformance.contentQualityScore + unifiedData.seoPerformance.technicalSEOScore) / 2,
        trend: 'stable' as const,
        trendValue: 2.1,
        target: 85,
        format: 'number' as const,
        status: 'good' as const
      },
      {
        title: 'Conversion Rate',
        value: unifiedData.conversionData.conversionProbability * 100,
        trend: 'up' as const,
        trendValue: 8.3,
        target: 5,
        format: 'percentage' as const,
        status: 'excellent' as const
      },
      {
        title: 'Page Load Time',
        value: unifiedData.performanceMetrics.pageLoadTime,
        trend: 'down' as const,
        trendValue: -15.2,
        target: 2000,
        format: 'duration' as const,
        status: unifiedData.performanceMetrics.pageLoadTime < 3000 ? 'good' as const : 'warning' as const
      },
      {
        title: 'Business Impact',
        value: unifiedData.businessContext.businessImpact,
        trend: 'up' as const,
        trendValue: 6.7,
        target: 85,
        format: 'number' as const,
        status: 'good' as const
      },
      {
        title: 'System Health',
        value: state.health?.overallHealth || 0,
        trend: 'stable' as const,
        target: 95,
        format: 'number' as const,
        status: (state.health?.overallHealth || 0) > 90 ? 'excellent' as const : 'good' as const
      }
    ];
  }, [state.unifiedData, state.health]);

  /**
   * Initialize dashboard on mount
   */
  useEffect(() => {
    refreshDashboard();
  }, [refreshDashboard]);

  /**
   * Setup auto-refresh interval
   */
  useEffect(() => {
    if (refreshInterval > 0) {
      const interval = setInterval(refreshDashboard, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshDashboard, refreshInterval]);

  if (state.loading && !state.unifiedData) {
    return (
      <div className={`analytics-dashboard ${className}`}>
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analytics dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className={`analytics-dashboard ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium">Failed to load dashboard</p>
          <p className="text-red-600 text-sm mt-2">{state.error}</p>
          <button 
            onClick={refreshDashboard}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`analytics-dashboard space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">
            {audience.charAt(0).toUpperCase() + audience.slice(1)} view • 
            Last updated: {new Date(state.lastUpdated).toLocaleTimeString()}
          </p>
        </div>
        <div className="flex space-x-3">
          <button 
            onClick={refreshDashboard}
            disabled={state.loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {state.loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Insights */}
        <div className="lg:col-span-2 space-y-6">
          {/* Cross-Service Insights */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Key Insights</h3>
            <div className="space-y-4">
              {state.insights.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No insights available</p>
              ) : (
                state.insights.slice(0, 5).map(insight => (
                  <InsightCard 
                    key={insight.insightId} 
                    insight={insight} 
                    onClick={handleInsightClick} 
                  />
                ))
              )}
            </div>
          </div>

          {/* Correlations */}
          <CorrelationVisualization 
            correlations={state.correlations}
            onCorrelationClick={handleCorrelationClick}
          />
        </div>

        {/* Right Column - Health & Stats */}
        <div className="space-y-6">
          {/* System Health */}
          <HealthStatus health={state.health} />

          {/* Quick Stats */}
          {state.unifiedData && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active Sessions</span>
                  <span className="font-medium">{state.unifiedData.userBehavior.pageViews}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Cache Hit Rate</span>
                  <span className="font-medium">
                    {(state.unifiedData.performanceMetrics.cacheHitRate * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active A/B Tests</span>
                  <span className="font-medium">{state.unifiedData.experimentData.activeTests.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Strong Correlations</span>
                  <span className="font-medium">
                    {state.correlations.filter(c => c.strength > 0.6).length}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Additional Actions */}
      {audience === 'executive' && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              Showing {audience} dashboard • Real-time data with {refreshInterval / 1000}s refresh
            </span>
            <div className="flex space-x-2">
              <button className="text-sm text-blue-600 hover:underline">
                Export Report
              </button>
              <button className="text-sm text-blue-600 hover:underline">
                Schedule Updates
              </button>
              <button className="text-sm text-blue-600 hover:underline">
                Configure Alerts
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;