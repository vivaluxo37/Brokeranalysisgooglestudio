import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  ChartBarIcon,
  ClockIcon,
  ServerIcon,
  GlobeAltIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  Cog6ToothIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import SEOHead from '../../components/seo/SEOHead';

interface PerformanceMetric {
  id: string;
  name: string;
  value: number;
  unit: string;
  status: 'good' | 'warning' | 'critical';
  threshold: {
    warning: number;
    critical: number;
  };
  trend: 'up' | 'down' | 'stable';
  previousValue: number;
}

interface SystemAlert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  description: string;
  timestamp: string;
  resolved: boolean;
  severity: 'high' | 'medium' | 'low';
}

interface PagePerformance {
  url: string;
  title: string;
  loadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  visits: number;
  status: 'good' | 'needs-improvement' | 'poor';
}

const PerformanceMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const [metrics, setMetrics] = useState<PerformanceMetric[]>([]);
  const [alerts, setAlerts] = useState<SystemAlert[]>([]);
  const [pagePerformance, setPagePerformance] = useState<PagePerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h');
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadPerformanceData();
    if (autoRefresh) {
      const interval = setInterval(loadPerformanceData, 30000); // Refresh every 30 seconds
      return () => clearInterval(interval);
    }
  }, [selectedTimeRange, autoRefresh]);

  const loadPerformanceData = async () => {
    try {
      setLoading(true);

      // Simulate loading performance metrics
      const mockMetrics: PerformanceMetric[] = [
        {
          id: '1',
          name: 'Page Load Time',
          value: 1.8,
          unit: 'seconds',
          status: 'good',
          threshold: { warning: 2.5, critical: 4.0 },
          trend: 'down',
          previousValue: 2.1
        },
        {
          id: '2',
          name: 'Cache Hit Rate',
          value: 94.7,
          unit: '%',
          status: 'good',
          threshold: { warning: 85, critical: 70 },
          trend: 'up',
          previousValue: 92.3
        },
        {
          id: '3',
          name: 'Server Response Time',
          value: 145,
          unit: 'ms',
          status: 'good',
          threshold: { warning: 300, critical: 500 },
          trend: 'stable',
          previousValue: 148
        },
        {
          id: '4',
          name: 'Error Rate',
          value: 0.12,
          unit: '%',
          status: 'warning',
          threshold: { warning: 0.1, critical: 0.5 },
          trend: 'up',
          previousValue: 0.08
        },
        {
          id: '5',
          name: 'Database Query Time',
          value: 28,
          unit: 'ms',
          status: 'good',
          threshold: { warning: 50, critical: 100 },
          trend: 'down',
          previousValue: 35
        },
        {
          id: '6',
          name: 'Content Generation Time',
          value: 2.3,
          unit: 'seconds',
          status: 'warning',
          threshold: { warning: 2.0, critical: 5.0 },
          trend: 'up',
          previousValue: 1.9
        }
      ];

      // Update status based on thresholds
      mockMetrics.forEach(metric => {
        if (metric.value >= metric.threshold.critical) {
          metric.status = 'critical';
        } else if (metric.value >= metric.threshold.warning) {
          metric.status = 'warning';
        } else {
          metric.status = 'good';
        }
      });

      setMetrics(mockMetrics);

      // Simulate loading alerts
      const mockAlerts: SystemAlert[] = [
        {
          id: '1',
          type: 'warning',
          title: 'Content Generation Time High',
          description: 'AI content generation averaging 2.3s, exceeding the 2.0s threshold',
          timestamp: '2025-01-03T14:30:00Z',
          resolved: false,
          severity: 'medium'
        },
        {
          id: '2',
          type: 'info',
          title: 'Cache Performance Improved',
          description: 'Cache hit rate increased by 2.4% in the last hour',
          timestamp: '2025-01-03T13:15:00Z',
          resolved: true,
          severity: 'low'
        },
        {
          id: '3',
          type: 'error',
          title: 'Database Connection Pool Exhausted',
          description: 'Database connection pool reached 90% capacity',
          timestamp: '2025-01-03T12:45:00Z',
          resolved: false,
          severity: 'high'
        }
      ];

      setAlerts(mockAlerts);

      // Simulate loading page performance data
      const mockPagePerformance: PagePerformance[] = [
        {
          url: '/forex/us',
          title: 'Forex Trading in United States',
          loadTime: 1.2,
          firstContentfulPaint: 0.8,
          largestContentfulPaint: 1.5,
          cumulativeLayoutShift: 0.1,
          firstInputDelay: 45,
          visits: 342,
          status: 'good'
        },
        {
          url: '/crypto/gb',
          title: 'Cryptocurrency Trading in United Kingdom',
          loadTime: 2.1,
          firstContentfulPaint: 1.4,
          largestContentfulPaint: 2.8,
          cumulativeLayoutShift: 0.3,
          firstInputDelay: 89,
          visits: 218,
          status: 'needs-improvement'
        },
        {
          url: '/stocks/ca',
          title: 'Stock Trading in Canada',
          loadTime: 3.4,
          firstContentfulPaint: 2.1,
          largestContentfulPaint: 4.2,
          cumulativeLayoutShift: 0.6,
          firstInputDelay: 156,
          visits: 145,
          status: 'poor'
        },
        {
          url: '/forex/strategy/scalping',
          title: 'Scalping Strategy Guide',
          loadTime: 1.6,
          firstContentfulPaint: 1.0,
          largestContentfulPaint: 1.9,
          cumulativeLayoutShift: 0.05,
          firstInputDelay: 32,
          visits: 567,
          status: 'good'
        }
      ];

      setPagePerformance(mockPagePerformance);

    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error': return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'warning': return <ExclamationTriangleIcon className="h-5 w-5" />;
      case 'info': return <DocumentTextIcon className="h-5 w-5" />;
      default: return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'error': return 'bg-red-100 text-red-600 border-red-200';
      case 'warning': return 'bg-yellow-100 text-yellow-600 border-yellow-200';
      case 'info': return 'bg-blue-100 text-blue-600 border-blue-200';
      default: return 'bg-gray-100 text-gray-600 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowTrendingUpIcon className="h-4 w-4 text-green-600" />;
      case 'down': return <ArrowTrendingDownIcon className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  const activeAlerts = alerts.filter(alert => !alert.resolved);
  const criticalMetrics = metrics.filter(metric => metric.status === 'critical');
  const warningMetrics = metrics.filter(metric => metric.status === 'warning');

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Performance Monitoring | Admin"
        description="Monitor system performance and health metrics"
      />

      {/* Header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/admin')}
                className="mr-4 p-2 rounded-md hover:bg-gray-100"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Performance Monitoring</h1>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm"
              >
                <option value="1h">Last Hour</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-3 py-1 rounded-md text-sm ${
                  autoRefresh ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {autoRefresh ? 'Auto-refresh ON' : 'Auto-refresh OFF'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Banner */}
      {criticalMetrics.length > 0 && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                {criticalMetrics.length} Critical Performance Issue{criticalMetrics.length > 1 ? 's' : ''} Detected
              </h3>
              <div className="mt-2 text-sm text-red-700">
                {criticalMetrics.map(metric => (
                  <span key={metric.id} className="mr-4">
                    {metric.name}: {metric.value} {metric.unit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <ServerIcon className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">{metrics.length}</div>
                  <div className="text-sm text-gray-500">Metrics Monitored</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <ExclamationTriangleIcon className="h-8 w-8 text-red-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-red-600">{activeAlerts.length}</div>
                  <div className="text-sm text-gray-500">Active Alerts</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <ClockIcon className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {metrics.length > 0 ? metrics[0].value.toFixed(1) : '0'}s
                  </div>
                  <div className="text-sm text-gray-500">Avg Load Time</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <GlobeAltIcon className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {pagePerformance.reduce((sum, page) => sum + page.visits, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">Page Visits</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Performance Metrics */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Performance Metrics</h3>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {metrics.map((metric) => (
                      <div key={metric.id} className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-900">{metric.name}</span>
                            <div className="flex items-center space-x-2">
                              <span className={`text-lg font-semibold ${
                                metric.status === 'good' ? 'text-green-600' :
                                metric.status === 'warning' ? 'text-yellow-600' :
                                'text-red-600'
                              }`}>
                                {metric.value} {metric.unit}
                              </span>
                              {getTrendIcon(metric.trend)}
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${
                                metric.status === 'good' ? 'bg-green-500' :
                                metric.status === 'warning' ? 'bg-yellow-500' :
                                'bg-red-500'
                              }`}
                              style={{
                                width: `${Math.min(100, (metric.value / metric.threshold.critical) * 100)}%`
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Alerts */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Recent Alerts</h3>
                <Link
                  to="/admin/alerts"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  View All →
                </Link>
              </div>
              <div className="p-6">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                ) : alerts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No alerts in the selected time range.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {alerts.slice(0, 5).map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-4 rounded-lg border ${getAlertColor(alert.type)} ${
                          alert.resolved ? 'opacity-60' : ''
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            {getAlertIcon(alert.type)}
                          </div>
                          <div className="ml-3 flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="text-sm font-medium">{alert.title}</h4>
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(alert.timestamp)}
                              </span>
                            </div>
                            <p className="text-sm mt-1">{alert.description}</p>
                            <div className="flex items-center justify-between mt-2">
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                alert.severity === 'high' ? 'bg-red-100 text-red-600' :
                                alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                'bg-blue-100 text-blue-600'
                              }`}>
                                {alert.severity}
                              </span>
                              {alert.resolved && (
                                <span className="text-xs text-green-600 flex items-center">
                                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                                  Resolved
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Page Performance Table */}
          <div className="mt-8 bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Page Performance</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Load Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      FCP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      LCP
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      CLS
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      FID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visits
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pagePerformance.map((page, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {page.title}
                          </div>
                          <div className="text-sm text-gray-500">{page.url}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {page.loadTime}s
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {page.firstContentfulPaint}s
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {page.largestContentfulPaint}s
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {page.cumulativeLayoutShift}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {page.firstInputDelay}ms
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {page.visits.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(page.status)}`}>
                          {page.status.replace('-', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitoring;