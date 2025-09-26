import React, { useState, useEffect } from 'react';
import { seoTracker } from '../../utils/seoAnalytics';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  BarChart3,
  TrendingUp,
  Users,
  Search,
  Download,
  RefreshCw,
  Eye,
  MousePointer,
  Share2,
  ExternalLink
} from 'lucide-react';

interface AnalyticsSummary {
  totalEvents: number;
  organicTraffic: number;
  averageCoreWebVitals: Record<string, number>;
  topPages: Array<{ url: string; views: number }>;
  topKeywords: Array<{ keyword: string; avgPosition: number }>;
}

const SEOAnalyticsDashboard: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isVisible) {
      loadAnalytics();
    }
  }, [isVisible]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      // Simulate async loading
      await new Promise(resolve => setTimeout(resolve, 500));
      const report = seoTracker.getPerformanceReport();
      setSummary(report.summary);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportData = (format: 'json' | 'csv') => {
    const data = seoTracker.exportData(format);
    const blob = new Blob([data], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-analytics-${new Date().toISOString().split('T')[0]}.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatMetric = (value: number): string => {
    if (value < 1000) {
      return `${Math.round(value)}ms`;
    }
    return `${(value / 1000).toFixed(2)}s`;
  };

  const getMetricStatus = (metric: string, value: number): 'good' | 'needs-improvement' | 'poor' => {
    switch (metric) {
      case 'LCP':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs-improvement' : 'poor';
      case 'FID':
        return value <= 100 ? 'good' : value <= 300 ? 'needs-improvement' : 'poor';
      case 'CLS':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs-improvement' : 'poor';
      default:
        return 'needs-improvement';
    }
  };

  const getStatusColor = (status: 'good' | 'needs-improvement' | 'poor'): string => {
    switch (status) {
      case 'good':
        return 'bg-green-100 text-green-800';
      case 'needs-improvement':
        return 'bg-yellow-100 text-yellow-800';
      case 'poor':
        return 'bg-red-100 text-red-800';
    }
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 left-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <BarChart3 className="w-4 h-4 mr-2" />
          SEO Analytics
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">SEO Performance Analytics</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadAnalytics}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportData('json')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export JSON
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportData('csv')}
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsVisible(false)}
            >
              Close
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : summary ? (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total Events</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {summary.totalEvents.toLocaleString()}
                        </p>
                      </div>
                      <BarChart3 className="w-8 h-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Organic Traffic</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {summary.organicTraffic.toLocaleString()}
                        </p>
                      </div>
                      <Search className="w-8 h-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Top Pages</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {summary.topPages.length}
                        </p>
                      </div>
                      <Eye className="w-8 h-8 text-purple-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Keywords</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {summary.topKeywords.length}
                        </p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-orange-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Core Web Vitals */}
              {Object.keys(summary.averageCoreWebVitals).length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MousePointer className="w-5 h-5" />
                      Core Web Vitals Average
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(summary.averageCoreWebVitals).map(([metric, value]) => {
                        const status = getMetricStatus(metric, value);
                        return (
                          <div key={metric} className="flex items-center justify-between p-4 border rounded-lg">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{metric}</p>
                              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {metric === 'CLS' ? value.toFixed(3) : formatMetric(value)}
                              </p>
                            </div>
                            <Badge className={getStatusColor(status)}>
                              {status === 'good' ? 'Good' : status === 'needs-improvement' ? 'Needs Improvement' : 'Poor'}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Top Pages */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Top Pages by Views
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {summary.topPages.slice(0, 10).map((page, index) => (
                      <div key={page.url} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new URL(page.url).pathname}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              {page.views} views
                            </p>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Top Keywords */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Top Keywords by Position
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {summary.topKeywords.map((keyword, index) => (
                      <div key={keyword.keyword} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 bg-green-100 text-green-800 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </span>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {keyword.keyword}
                            </p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Avg Position: {keyword.avgPosition.toFixed(1)}
                            </p>
                          </div>
                        </div>
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Analytics Data</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Analytics data will appear as users interact with your site.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SEOAnalyticsDashboard;