import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Lightbulb,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  X,
  RefreshCw
} from 'lucide-react';

interface SEOInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'success' | 'error';
  category: 'technical' | 'content' | 'performance' | 'backlinks' | 'keywords';
  title: string;
  description: string;
  action: string;
  impact: 'high' | 'medium' | 'low';
  priority: number;
  url?: string;
}

const SEOInsights: React.FC = () => {
  const [insights, setInsights] = useState<SEOInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      generateInsights();
    }
  }, [isVisible]);

  const generateInsights = async () => {
    setLoading(true);

    // Simulate analysis
    await new Promise(resolve => setTimeout(resolve, 1500));

    const newInsights: SEOInsight[] = [];

    // Technical SEO Analysis
    const titleLength = document.title.length;
    const metaDescription = document.querySelector('meta[name="description"]')?.getAttribute('content') || '';
    const h1Tags = document.querySelectorAll('h1').length;
    const images = document.querySelectorAll('img');
    const imagesWithoutAlt = Array.from(images).filter(img => !img.alt).length;
    const structuredData = document.querySelectorAll('script[type="application/ld+json"]').length;

    if (titleLength < 30 || titleLength > 60) {
      newInsights.push({
        id: 'title-length',
        type: 'warning',
        category: 'technical',
        title: 'Title Length Optimization',
        description: `Current title length is ${titleLength} characters. Optimal length is 50-60 characters.`,
        action: 'Update your page title to be between 50-60 characters for better SEO performance.',
        impact: 'high',
        priority: 1
      });
    }

    if (metaDescription.length < 120 || metaDescription.length > 160) {
      newInsights.push({
        id: 'meta-description',
        type: 'warning',
        category: 'technical',
        title: 'Meta Description Optimization',
        description: `Current meta description is ${metaDescription.length} characters. Optimal length is 150-160 characters.`,
        action: 'Write a compelling meta description between 150-160 characters to improve click-through rates.',
        impact: 'high',
        priority: 2
      });
    }

    if (h1Tags === 0) {
      newInsights.push({
        id: 'missing-h1',
        type: 'error',
        category: 'technical',
        title: 'Missing H1 Tag',
        description: 'No H1 tag found on the page.',
        action: 'Add a single H1 tag with your primary keyword to improve content structure.',
        impact: 'high',
        priority: 1
      });
    } else if (h1Tags > 1) {
      newInsights.push({
        id: 'multiple-h1',
        type: 'warning',
        category: 'technical',
        title: 'Multiple H1 Tags',
        description: `Found ${h1Tags} H1 tags on the page.`,
        action: 'Use only one H1 tag per page and structure content with H2-H6 tags.',
        impact: 'medium',
        priority: 3
      });
    }

    if (imagesWithoutAlt > 0) {
      newInsights.push({
        id: 'missing-alt',
        type: 'warning',
        category: 'technical',
        title: 'Missing Alt Text',
        description: `${imagesWithoutAlt} images are missing alt text.`,
        action: 'Add descriptive alt text to all images for better accessibility and image search SEO.',
        impact: 'medium',
        priority: 4
      });
    }

    if (structuredData === 0) {
      newInsights.push({
        id: 'structured-data',
        type: 'opportunity',
        category: 'technical',
        title: 'Add Structured Data',
        description: 'No structured data found on the page.',
        action: 'Implement JSON-LD structured data to help search engines understand your content better.',
        impact: 'high',
        priority: 2
      });
    }

    // Content Analysis
    const wordCount = document.body.innerText.split(/\s+/).length;
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const links = document.querySelectorAll('a');
    const internalLinks = Array.from(links).filter(link =>
      link.href.includes(window.location.hostname)
    ).length;
    const externalLinks = Array.from(links).filter(link =>
      !link.href.includes(window.location.hostname) && link.href !== '#'
    ).length;

    if (wordCount < 300) {
      newInsights.push({
        id: 'content-length',
        type: 'warning',
        category: 'content',
        title: 'Content Length',
        description: `Current content has ${wordCount} words. Comprehensive content should have 1000+ words.`,
        action: 'Expand your content to provide more comprehensive information and improve SEO rankings.',
        impact: 'medium',
        priority: 5
      });
    }

    if (internalLinks < 5) {
      newInsights.push({
        id: 'internal-links',
        type: 'opportunity',
        category: 'content',
        title: 'Internal Linking',
        description: `Only ${internalLinks} internal links found.`,
        action: 'Add more internal links to improve site structure and help search engines discover content.',
        impact: 'medium',
        priority: 6
      });
    }

    // Performance Analysis
    const pageLoadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    const domContentLoaded = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;

    if (pageLoadTime > 3000) {
      newInsights.push({
        id: 'page-load-time',
        type: 'warning',
        category: 'performance',
        title: 'Page Load Time',
        description: `Page loads in ${(pageLoadTime / 1000).toFixed(2)}s. Target is under 3s.`,
        action: 'Optimize images, minify CSS/JS, and consider lazy loading to improve page speed.',
        impact: 'high',
        priority: 3
      });
    }

    if (domContentLoaded > 2000) {
      newInsights.push({
        id: 'dom-content-loaded',
        type: 'warning',
        category: 'performance',
        title: 'First Contentful Paint',
        description: `DOM content loaded in ${(domContentLoaded / 1000).toFixed(2)}s. Target is under 2s.`,
        action: 'Reduce render-blocking resources and optimize critical rendering path.',
        impact: 'high',
        priority: 4
      });
    }

    // Success insights
    if (titleLength >= 50 && titleLength <= 60) {
      newInsights.push({
        id: 'title-optimal',
        type: 'success',
        category: 'technical',
        title: 'Optimal Title Length',
        description: 'Title length is optimal for SEO.',
        action: 'Great job! Your title length is perfect for search engines.',
        impact: 'high',
        priority: 10
      });
    }

    if (structuredData > 0) {
      newInsights.push({
        id: 'structured-data-present',
        type: 'success',
        category: 'technical',
        title: 'Structured Data Present',
        description: `${structuredData} structured data elements found.`,
        action: 'Excellent! Structured data will help search engines understand your content better.',
        impact: 'high',
        priority: 10
      });
    }

    setInsights(newInsights.sort((a, b) => a.priority - b.priority));
    setLoading(false);
  };

  const getInsightIcon = (type: SEOInsight['type']) => {
    switch (type) {
      case 'opportunity':
        return <Lightbulb className="w-5 h-5 text-yellow-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <X className="w-5 h-5 text-red-600" />;
    }
  };

  const getImpactColor = (impact: SEOInsight['impact']) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
    }
  };

  const getCategoryIcon = (category: SEOInsight['category']) => {
    switch (category) {
      case 'technical':
        return '⚙️';
      case 'content':
        return '📝';
      case 'performance':
        return '⚡';
      case 'backlinks':
        return '🔗';
      case 'keywords':
        return '🔍';
    }
  };

  const getInsightsByType = (type: SEOInsight['type']) => {
    return insights.filter(insight => insight.type === type);
  };

  if (!isVisible) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsVisible(true)}
          className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          SEO Insights
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">SEO Insights & Recommendations</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={generateInsights}
              disabled={loading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Analyze
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
              <RefreshCw className="w-8 h-8 animate-spin text-green-600" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {getInsightsByType('error').length}
                      </div>
                      <div className="text-sm text-gray-500">Errors</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">
                        {getInsightsByType('warning').length}
                      </div>
                      <div className="text-sm text-gray-500">Warnings</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {getInsightsByType('opportunity').length}
                      </div>
                      <div className="text-sm text-gray-500">Opportunities</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {getInsightsByType('success').length}
                      </div>
                      <div className="text-sm text-gray-500">Success</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Insights List */}
              {insights.length > 0 ? (
                <div className="space-y-4">
                  {insights.map((insight) => (
                    <Card key={insight.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 mt-1">
                            {getInsightIcon(insight.type)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {getCategoryIcon(insight.category)} {insight.title}
                              </h3>
                              <Badge className={getImpactColor(insight.impact)}>
                                {insight.impact} impact
                              </Badge>
                            </div>
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                              {insight.description}
                            </p>
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-1">
                                Recommended Action:
                              </h4>
                              <p className="text-blue-800 dark:text-blue-200 text-sm">
                                {insight.action}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    No SEO Issues Found
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Your page appears to be well-optimized for SEO!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SEOInsights;