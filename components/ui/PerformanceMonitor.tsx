import React, { useEffect, useState } from 'react';
import { performanceMonitor } from '../../utils/performance';

interface PerformanceMetrics {
  LCP?: number;
  FID?: number;
  CLS?: number;
  FCP?: number;
  TTFB?: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in development mode
    if (process.env.NODE_ENV !== 'development') {
      return;
    }

    // Track Core Web Vitals
    performanceMonitor.trackCoreWebVitals((newMetrics) => {
      setMetrics(newMetrics);
    });

    // Show/hide with keyboard shortcut (Ctrl+Shift+P)
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'P') {
        setIsVisible(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, []);

  if (process.env.NODE_ENV !== 'development' || !isVisible) {
    return null;
  }

  const formatMetric = (value?: number): string => {
    if (value === undefined) return 'N/A';

    if (value < 1000) {
      return `${Math.round(value)}ms`;
    }
    return `${(value / 1000).toFixed(2)}s`;
  };

  const getMetricStatus = (metric: keyof PerformanceMetrics, value?: number): 'good' | 'needs-improvement' | 'poor' => {
    if (value === undefined) return 'needs-improvement';

    switch (metric) {
      case 'LCP':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
      case 'FID':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
      case 'CLS':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
      case 'FCP':
        return value <= 1800 ? 'good' : value <= 3000 ? 'needs-improvement' : 'poor';
      default:
        return 'needs-improvement';
    }
  };

  const getStatusColor = (status: 'good' | 'needs-improvement' | 'poor'): string => {
    switch (status) {
      case 'good':
        return 'text-green-600 bg-green-100';
      case 'needs-improvement':
        return 'text-yellow-600 bg-yellow-100';
      case 'poor':
        return 'text-red-600 bg-red-100';
    }
  };

  const metricsData = [
    { key: 'LCP', label: 'Largest Contentful Paint', description: 'Loading performance', value: metrics.LCP },
    { key: 'FID', label: 'First Input Delay', description: 'Interactivity', value: metrics.FID },
    { key: 'CLS', label: 'Cumulative Layout Shift', description: 'Visual stability', value: metrics.CLS },
    { key: 'FCP', label: 'First Contentful Paint', description: 'Perceived load speed', value: metrics.FCP },
  ];

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Performance Metrics</h3>
        <button
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {metricsData.map(({ key, label, description, value }) => {
          const status = getMetricStatus(key as keyof PerformanceMetrics, value);
          return (
            <div key={key} className="flex items-center justify-between">
              <div className="flex-1">
                <div className="text-xs font-medium text-gray-900 dark:text-white">{label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>
              </div>
              <div className="text-right">
                <div className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(status)}`}>
                  {formatMetric(value)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {status === 'good' ? 'Good' : status === 'needs-improvement' ? 'Needs Improvement' : 'Poor'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Press <kbd className="px-1 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded">Ctrl+Shift+P</kbd> to toggle
        </div>
      </div>
    </div>
  );
};

export default PerformanceMonitor;