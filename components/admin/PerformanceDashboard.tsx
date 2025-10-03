import React, { useState, useEffect } from 'react';
import {
  ChartBarIcon,
  ClockIcon,
  CpuChipIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowPathIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import { performanceMonitoring, usePerformanceMonitoring } from '../../services/performanceMonitoring';

interface PerformanceDashboardProps {
  className?: string;
}

export default function PerformanceDashboard({ className = '' }: PerformanceDashboardProps) {
  const [systemReport, setSystemReport] = useState<any>(null);
  const [realtimeStats, setRealtimeStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const { getSystemReport, getRealtimeStats, exportMetrics } = usePerformanceMonitoring();

  // Load performance data
  const loadData = async () => {
    try {
      setLoading(true);
      const [report, realtime] = await Promise.all([
        getSystemReport(),
        getRealtimeStats()
      ]);
      
      setSystemReport(report);
      setRealtimeStats(realtime);
    } catch (error) {
      console.error('Failed to load performance data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-refresh effect
  useEffect(() => {
    loadData();
    
    if (autoRefresh) {
      const interval = setInterval(loadData, 30000); // 30 seconds
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  // Export metrics
  const handleExport = async (format: 'json' | 'csv') => {
    try {
      const data = await exportMetrics(format);
      const blob = new Blob([data], { 
        type: format === 'json' ? 'application/json' : 'text/csv' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `performance-metrics-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export metrics:', error);
    }
  };

  if (loading && !systemReport) {
    return (
      <div className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'good': return CheckCircleIcon;
      case 'warning': case 'critical': return ExclamationTriangleIcon;
      default: return CpuChipIcon;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
            <ChartBarIcon className="h-8 w-8 mr-3 text-blue-600" />
            Performance Dashboard
          </h2>
          <div className="flex items-center space-x-3">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Auto-refresh</span>
            </label>
            <button
              onClick={loadData}
              className="p-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              title="Refresh now"
            >
              <ArrowPathIcon className="h-5 w-5" />
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => handleExport('json')}
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                JSON
              </button>
              <button
                onClick={() => handleExport('csv')}
                className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
              >
                <DocumentArrowDownIcon className="h-4 w-4 mr-1" />
                CSV
              </button>
            </div>
          </div>
        </div>

        {/* System Health Overview */}
        {realtimeStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* System Health */}
            <div className={`p-4 rounded-lg ${getHealthColor(realtimeStats.systemHealth)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">System Health</p>
                  <p className="text-2xl font-bold capitalize">{realtimeStats.systemHealth}</p>
                </div>
                {React.createElement(getHealthIcon(realtimeStats.systemHealth), {
                  className: 'h-8 w-8'
                })}
              </div>
            </div>

            {/* Current Load */}
            <div className="p-4 bg-blue-100 text-blue-600 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Active Pages</p>
                  <p className="text-2xl font-bold">{realtimeStats.currentLoad}</p>
                </div>
                <CpuChipIcon className="h-8 w-8" />
              </div>
            </div>

            {/* Cache Hit Rate */}
            <div className="p-4 bg-purple-100 text-purple-600 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Cache Hit Rate</p>
                  <p className="text-2xl font-bold">
                    {systemReport?.overall?.cacheHitRate 
                      ? `${Math.round(systemReport.overall.cacheHitRate * 100)}%`
                      : 'N/A'
                    }
                  </p>
                </div>
                <ChartBarIcon className="h-8 w-8" />
              </div>
            </div>

            {/* Average Load Time */}
            <div className="p-4 bg-orange-100 text-orange-600 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Avg Load Time</p>
                  <p className="text-2xl font-bold">
                    {systemReport?.overall?.avgLoadTime || 0}ms
                  </p>
                </div>
                <ClockIcon className="h-8 w-8" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Performance by Page Type */}
      {systemReport?.byPageType && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Performance by Page Type
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(systemReport.byPageType).map(([type, stats]: [string, any]) => (
              <div key={type} className="border dark:border-gray-700 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900 dark:text-white capitalize mb-2">
                  {type} Pages
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Avg Load:</span>
                    <span className="font-medium">{stats.avgLoadTime}ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Cache Hit:</span>
                    <span className="font-medium">{Math.round(stats.cacheHitRate * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Total Views:</span>
                    <span className="font-medium">{stats.totalViews}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top & Slow Pages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performing Pages */}
        {systemReport?.topPerformingPages?.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <CheckCircleIcon className="h-5 w-5 mr-2 text-green-500" />
              Top Performing Pages
            </h3>
            <div className="space-y-3">
              {systemReport.topPerformingPages.map((page: any, index: number) => (
                <div key={index} className="flex items-center justify-between py-2 border-b dark:border-gray-700 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {page.type}/{page.slug}
                    </p>
                  </div>
                  <span className="text-sm text-green-600 font-medium">
                    {page.avgLoadTime}ms
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Slowest Pages */}
        {systemReport?.slowestPages?.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-red-500" />
              Slowest Pages
            </h3>
            <div className="space-y-3">
              {systemReport.slowestPages.map((page: any, index: number) => (
                <div key={index} className="flex items-center justify-between py-2 border-b dark:border-gray-700 last:border-b-0">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {page.type}/{page.slug}
                    </p>
                  </div>
                  <span className="text-sm text-red-600 font-medium">
                    {page.avgLoadTime}ms
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      {systemReport?.recommendations?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Performance Recommendations
          </h3>
          <div className="space-y-2">
            {systemReport.recommendations.map((rec: string, index: number) => (
              <div key={index} className="flex items-start space-x-2">
                <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-300">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {realtimeStats?.recentPages?.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Recent Activity
          </h3>
          <div className="space-y-2">
            {realtimeStats.recentPages.map((page: any, index: number) => (
              <div key={index} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {page.type}/{page.slug}
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600 dark:text-gray-400">
                    {new Date(page.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`font-medium ${
                    page.loadTime < 500 ? 'text-green-600' :
                    page.loadTime < 1000 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {page.loadTime}ms
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}