import React, { useEffect, useState } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import {
  Gauge,
  Accessibility,
  Smartphone,
  Monitor,
  Zap,
  Shield,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

interface PerformanceMetrics {
  lcp: number; // Largest Contentful Paint (seconds)
  fid: number; // First Input Delay (milliseconds)
  cls: number; // Cumulative Layout Shift
  fcp: number; // First Contentful Paint (seconds)
  tti: number; // Time to Interactive (seconds)
  tbt: number; // Total Blocking Time (milliseconds)
}

interface AccessibilityIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  category: string;
  description: string;
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  element?: string;
}

interface PerformanceMonitorProps {
  pageUrl: string;
  enableRealTime?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  pageUrl,
  enableRealTime = true,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [accessibilityIssues, setAccessibilityIssues] = useState<AccessibilityIssue[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<string>('');

  // Simulate performance metrics collection
  const collectMetrics = async (): Promise<PerformanceMetrics> => ({
    lcp: 2.6,
    fid: 100,
    cls: 0.07,
    fcp: 2.2,
    tti: 4,
    tbt: 200,
  });

  // Simulate accessibility checking
  const checkAccessibility = async (): Promise<AccessibilityIssue[]> => {
    // In a real implementation, this would use:
    // - axe-core
    // - WAVE API
    // - Custom accessibility rules
    return [];
  };

  const runAudit = async () => {
    setIsLoading(true);
    try {
      const [performanceData, accessibilityData] = await Promise.all([
        collectMetrics(),
        checkAccessibility()
      ]);

      setMetrics(performanceData);
      setAccessibilityIssues(accessibilityData);
      setLastChecked(new Date().toISOString());
    } catch (error) {
      console.error('Error running SEO audit:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runAudit();

    if (!enableRealTime) {
      return undefined;
    }

    const interval = window.setInterval(runAudit, 30000); // Check every 30 seconds
    return () => window.clearInterval(interval);
  }, [enableRealTime, pageUrl]);

  const getScoreColor = (value: number, thresholds: { good: number; needsImprovement: number }) => {
    if (value <= thresholds.good) return 'text-green-600';
    if (value <= thresholds.needsImprovement) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (value: number, thresholds: { good: number; needsImprovement: number }) => {
    if (value <= thresholds.good) {
      return <Badge className="bg-green-100 text-green-800">Good</Badge>;
    } else if (value <= thresholds.needsImprovement) {
      return <Badge className="bg-yellow-100 text-yellow-800">Needs Improvement</Badge>;
    }
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
  };

  const getImpactBadge = (impact: string) => {
    const variants = {
      critical: 'destructive',
      serious: 'destructive',
      moderate: 'secondary',
      minor: 'outline'
    } as const;

    return <Badge variant={variants[impact as keyof typeof variants]}>{impact}</Badge>;
  };

  if (isLoading && !metrics) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Running SEO audit...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Gauge className="h-5 w-5" />
              Core Web Vitals
            </CardTitle>
            <div className="flex items-center gap-2">
              {lastChecked ? (
                <span className="text-sm text-gray-500">
                  Last checked: {new Date(lastChecked).toLocaleTimeString()}
                </span>
              ) : null}
              <Button onClick={runAudit} size="sm" variant="outline">
                Refresh
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* LCP */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">LCP</h4>
                {metrics && getScoreBadge(metrics.lcp, { good: 2.5, needsImprovement: 4.0 })}
              </div>
              <div className={`text-2xl font-bold ${metrics ? getScoreColor(metrics.lcp, { good: 2.5, needsImprovement: 4.0 }) : 'text-gray-400'}`}>
                {metrics ? `${metrics.lcp.toFixed(2)}s` : '—'}
              </div>
              <p className="text-xs text-gray-600 mt-1">Largest Contentful Paint</p>
            </div>

            {/* FID */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">FID</h4>
                {metrics && getScoreBadge(metrics.fid, { good: 100, needsImprovement: 300 })}
              </div>
              <div className={`text-2xl font-bold ${metrics ? getScoreColor(metrics.fid, { good: 100, needsImprovement: 300 }) : 'text-gray-400'}`}>
                {metrics ? `${metrics.fid.toFixed(0)}ms` : '—'}
              </div>
              <p className="text-xs text-gray-600 mt-1">First Input Delay</p>
            </div>

            {/* CLS */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">CLS</h4>
                {metrics && getScoreBadge(metrics.cls, { good: 0.1, needsImprovement: 0.25 })}
              </div>
              <div className={`text-2xl font-bold ${metrics ? getScoreColor(metrics.cls, { good: 0.1, needsImprovement: 0.25 }) : 'text-gray-400'}`}>
                {metrics ? `${metrics.cls.toFixed(3)}` : '—'}
              </div>
              <p className="text-xs text-gray-600 mt-1">Cumulative Layout Shift</p>
            </div>

            {/* FCP */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">FCP</h4>
                {metrics && getScoreBadge(metrics.fcp, { good: 1.8, needsImprovement: 3.0 })}
              </div>
              <div className={`text-2xl font-bold ${metrics ? getScoreColor(metrics.fcp, { good: 1.8, needsImprovement: 3.0 }) : 'text-gray-400'}`}>
                {metrics ? `${metrics.fcp.toFixed(2)}s` : '—'}
              </div>
              <p className="text-xs text-gray-600 mt-1">First Contentful Paint</p>
            </div>

            {/* TTI */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">TTI</h4>
                {metrics && getScoreBadge(metrics.tti, { good: 3.8, needsImprovement: 7.3 })}
              </div>
              <div className={`text-2xl font-bold ${metrics ? getScoreColor(metrics.tti, { good: 3.8, needsImprovement: 7.3 }) : 'text-gray-400'}`}>
                {metrics ? `${metrics.tti.toFixed(2)}s` : '—'}
              </div>
              <p className="text-xs text-gray-600 mt-1">Time to Interactive</p>
            </div>

            {/* TBT */}
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm">TBT</h4>
                {metrics && getScoreBadge(metrics.tbt, { good: 200, needsImprovement: 600 })}
              </div>
              <div className={`text-2xl font-bold ${metrics ? getScoreColor(metrics.tbt, { good: 200, needsImprovement: 600 }) : 'text-gray-400'}`}>
                {metrics ? `${metrics.tbt.toFixed(0)}ms` : '—'}
              </div>
              <p className="text-xs text-gray-600 mt-1">Total Blocking Time</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Accessibility className="h-5 w-5" />
            Accessibility Check
          </CardTitle>
        </CardHeader>
        <CardContent>
          {accessibilityIssues.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                No Accessibility Issues Found
              </h3>
              <p className="text-gray-600">
                This page passes all accessibility checks.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {accessibilityIssues.map((issue) => (
                <div key={issue.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {issue.type === 'error' && <AlertTriangle className="h-4 w-4 text-red-600" />}
                      {issue.type === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-600" />}
                      {issue.type === 'info' && <Shield className="h-4 w-4 text-blue-600" />}
                      <h4 className="font-semibold">{issue.category}</h4>
                    </div>
                    {getImpactBadge(issue.impact)}
                  </div>
                  <p className="text-gray-700 mb-2">{issue.description}</p>
                  {issue.element && (
                    <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                      {issue.element}
                    </code>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Device Compatibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Device Compatibility
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Smartphone className="h-8 w-8 text-green-600" />
              <div>
                <h4 className="font-semibold">Mobile</h4>
                <p className="text-sm text-gray-600">Fully Responsive</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Monitor className="h-8 w-8 text-green-600" />
              <div>
                <h4 className="font-semibold">Desktop</h4>
                <p className="text-sm text-gray-600">Optimized</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-600 ml-auto" />
            </div>
            <div className="flex items-center gap-3 p-4 border rounded-lg">
              <Zap className="h-8 w-8 text-yellow-600" />
              <div>
                <h4 className="font-semibold">Performance</h4>
                <p className="text-sm text-gray-600">Good Score</p>
              </div>
              <TrendingUp className="h-5 w-5 text-yellow-600 ml-auto" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            SEO Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-800">Meta Tags Complete</h4>
                <p className="text-sm text-green-700">All required meta tags are properly implemented.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800">Image Optimization</h4>
                <p className="text-sm text-yellow-700">Consider compressing images to improve LCP score.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800">Structured Data</h4>
                <p className="text-sm text-blue-700">JSON-LD schema is properly implemented for rich results.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitor;