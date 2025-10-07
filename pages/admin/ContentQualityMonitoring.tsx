import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  DocumentTextIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  SparklesIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import SEOHead from '../../components/seo/SEOHead';

interface ContentQualityScore {
  id: string;
  pageUrl: string;
  pageTitle: string;
  pageType: 'category_country' | 'strategy' | 'feature' | 'country';
  overallScore: number;
  readabilityScore: number;
  seoScore: number;
  engagementScore: number;
  technicalScore: number;
  lastUpdated: string;
  status: 'excellent' | 'good' | 'needs-improvement' | 'poor';
  wordCount: number;
  issues: ContentIssue[];
  recommendations: string[];
}

interface ContentIssue {
  type: 'readability' | 'seo' | 'technical' | 'engagement';
  severity: 'high' | 'medium' | 'low';
  description: string;
  suggestion: string;
}

interface QualityTrend {
  date: string;
  avgScore: number;
  pageCount: number;
  issuesCount: number;
}

const ContentQualityMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const [contentScores, setContentScores] = useState<ContentQualityScore[]>([]);
  const [qualityTrends, setQualityTrends] = useState<QualityTrend[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedContent, setSelectedContent] = useState<ContentQualityScore | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadContentQualityData();
    if (autoRefresh) {
      const interval = setInterval(loadContentQualityData, 60000); // Refresh every minute
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadContentQualityData = async () => {
    try {
      setLoading(true);

      // Simulate loading content quality scores
      const mockContentScores: ContentQualityScore[] = [
        {
          id: '1',
          pageUrl: '/forex/us',
          pageTitle: 'Forex Trading in United States | Best Brokers 2025',
          pageType: 'category_country',
          overallScore: 9.2,
          readabilityScore: 8.8,
          seoScore: 9.5,
          engagementScore: 9.1,
          technicalScore: 9.4,
          lastUpdated: '2025-01-03T10:30:00Z',
          status: 'excellent',
          wordCount: 1250,
          issues: [],
          recommendations: ['Consider adding more internal links', 'Add FAQ section for better engagement']
        },
        {
          id: '2',
          pageUrl: '/crypto/gb',
          pageTitle: 'Cryptocurrency Trading in United Kingdom | Best Brokers 2025',
          pageType: 'category_country',
          overallScore: 7.8,
          readabilityScore: 8.2,
          seoScore: 7.5,
          engagementScore: 7.1,
          technicalScore: 8.4,
          lastUpdated: '2025-01-03T09:15:00Z',
          status: 'good',
          wordCount: 980,
          issues: [
            {
              type: 'seo',
              severity: 'medium',
              description: 'Meta description could be more compelling',
              suggestion: 'Rewrite meta description to include stronger call-to-action'
            },
            {
              type: 'engagement',
              severity: 'low',
              description: 'Limited use of multimedia elements',
              suggestion: 'Add relevant images or videos to improve engagement'
            }
          ],
          recommendations: ['Improve meta description', 'Add multimedia content', 'Include more examples']
        },
        {
          id: '3',
          pageUrl: '/forex/strategy/scalping',
          pageTitle: 'Scalping Strategy Guide | How to Trade Scalping',
          pageType: 'strategy',
          overallScore: 6.2,
          readabilityScore: 7.5,
          seoScore: 5.8,
          engagementScore: 5.9,
          technicalScore: 5.6,
          lastUpdated: '2025-01-02T16:45:00Z',
          status: 'needs-improvement',
          wordCount: 850,
          issues: [
            {
              type: 'seo',
              severity: 'high',
              description: 'Missing primary keywords in H1 and first paragraph',
              suggestion: 'Include "scalping strategy" keywords in key sections'
            },
            {
              type: 'readability',
              severity: 'medium',
              description: 'Sentences are too long on average',
              suggestion: 'Break down long sentences for better readability'
            },
            {
              type: 'engagement',
              severity: 'medium',
              description: 'No clear call-to-action',
              suggestion: 'Add clear CTAs for broker comparison or strategy tools'
            }
          ],
          recommendations: ['Add primary keywords', 'Improve sentence structure', 'Add clear CTAs', 'Include practical examples']
        },
        {
          id: '4',
          pageUrl: '/stocks/ca',
          pageTitle: 'Stock Trading in Canada | Complete Guide 2025',
          pageType: 'country',
          overallScore: 4.1,
          readabilityScore: 4.5,
          seoScore: 3.8,
          engagementScore: 4.2,
          technicalScore: 3.9,
          lastUpdated: '2025-01-01T12:00:00Z',
          status: 'poor',
          wordCount: 450,
          issues: [
            {
              type: 'readability',
              severity: 'high',
              description: 'Content is too short for comprehensive coverage',
              suggestion: 'Expand content to at least 1000 words with detailed information'
            },
            {
              type: 'seo',
              severity: 'high',
              description: 'Missing structured data and proper heading hierarchy',
              suggestion: 'Add structured data and optimize heading structure'
            },
            {
              type: 'engagement',
              severity: 'high',
              description: 'No internal links or related content',
              suggestion: 'Add internal linking to related pages and broker comparisons'
            }
          ],
          recommendations: [
            'Expand content significantly',
            'Add structured data',
            'Improve SEO optimization',
            'Add internal links',
            'Include practical examples'
          ]
        }
      ];

      setContentScores(mockContentScores);

      // Simulate loading quality trends
      const mockTrends: QualityTrend[] = [
        { date: '2025-01-01', avgScore: 7.2, pageCount: 120, issuesCount: 45 },
        { date: '2025-01-02', avgScore: 7.8, pageCount: 145, issuesCount: 38 },
        { date: '2025-01-03', avgScore: 8.1, pageCount: 168, issuesCount: 32 },
      ];

      setQualityTrends(mockTrends);

    } catch (error) {
      console.error('Error loading content quality data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContent = contentScores.filter(content => {
    const matchesSearch = content.pageTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         content.pageUrl.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || content.pageType === filterType;
    const matchesStatus = filterStatus === 'all' || content.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-100';
      case 'good': return 'text-blue-600 bg-blue-100';
      case 'needs-improvement': return 'text-yellow-600 bg-yellow-100';
      case 'poor': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 7) return 'text-blue-600';
    if (score >= 5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getIssueSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatLastUpdated = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const handleRegenerateContent = async (contentId: string) => {
    try {
      // Simulate content regeneration
      setContentScores(prev => prev.map(content =>
        content.id === contentId
          ? { ...content, overallScore: Math.min(10, content.overallScore + 1.5), lastUpdated: new Date().toISOString() }
          : content
      ));
    } catch (error) {
      console.error('Error regenerating content:', error);
    }
  };

  const excellentContent = contentScores.filter(c => c.status === 'excellent').length;
  const goodContent = contentScores.filter(c => c.status === 'good').length;
  const needsImprovement = contentScores.filter(c => c.status === 'needs-improvement').length;
  const poorContent = contentScores.filter(c => c.status === 'poor').length;
  const avgQualityScore = contentScores.length > 0
    ? contentScores.reduce((sum, c) => sum + c.overallScore, 0) / contentScores.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Content Quality Monitoring | Admin"
        description="Monitor and manage content quality across programmatic pages"
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
              <h1 className="text-2xl font-bold text-gray-900">Content Quality Monitoring</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/programmatic-seo"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Programmatic SEO
              </Link>
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

      {/* Quality Summary Cards */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
                  <StarIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{avgQualityScore.toFixed(1)}</div>
                  <div className="text-sm text-gray-500">Avg Quality Score</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mr-4">
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">{excellentContent}</div>
                  <div className="text-sm text-gray-500">Excellent</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
                  <CheckCircleIcon className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">{goodContent}</div>
                  <div className="text-sm text-gray-500">Good</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg mr-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600">{needsImprovement}</div>
                  <div className="text-sm text-gray-500">Needs Improvement</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mr-4">
                  <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-red-600">{poorContent}</div>
                  <div className="text-sm text-gray-500">Poor</div>
                </div>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                  />
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="category_country">Category-Country</option>
                  <option value="strategy">Strategy</option>
                  <option value="feature">Feature</option>
                  <option value="country">Country</option>
                </select>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="needs-improvement">Needs Improvement</option>
                  <option value="poor">Poor</option>
                </select>
              </div>
              <button
                onClick={() => window.location.reload()}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>

          {/* Content Quality Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Content
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Overall Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Scores Breakdown
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Word Count
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issues
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-3"></div>
                          Loading content quality data...
                        </div>
                      </td>
                    </tr>
                  ) : filteredContent.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        No content found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredContent.map((content) => (
                      <tr key={content.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                              <Link to={content.pageUrl} className="hover:text-blue-600">
                                {content.pageTitle}
                              </Link>
                            </div>
                            <div className="text-sm text-gray-500">{content.pageUrl}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900 capitalize">
                            {content.pageType.replace('_', '-')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className={`text-lg font-semibold ${getScoreColor(content.overallScore)}`}>
                              {content.overallScore.toFixed(1)}
                            </span>
                            <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(content.status)}`}>
                              {content.status.replace('-', ' ')}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            <div className="flex items-center text-xs">
                              <span className="w-16 text-gray-500">Readability:</span>
                              <span className={`font-medium ${getScoreColor(content.readabilityScore)}`}>
                                {content.readabilityScore.toFixed(1)}
                              </span>
                            </div>
                            <div className="flex items-center text-xs">
                              <span className="w-16 text-gray-500">SEO:</span>
                              <span className={`font-medium ${getScoreColor(content.seoScore)}`}>
                                {content.seoScore.toFixed(1)}
                              </span>
                            </div>
                            <div className="flex items-center text-xs">
                              <span className="w-16 text-gray-500">Engagement:</span>
                              <span className={`font-medium ${getScoreColor(content.engagementScore)}`}>
                                {content.engagementScore.toFixed(1)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {content.wordCount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {content.issues.length > 0 ? (
                            <div className="flex items-center">
                              <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 mr-1" />
                              <span className="text-sm text-gray-900">{content.issues.length}</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-1" />
                              <span className="text-sm text-gray-500">None</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatLastUpdated(content.lastUpdated)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedContent(content)}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="View details"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleRegenerateContent(content.id)}
                              className="p-1 text-green-600 hover:text-green-800"
                              title="Regenerate content"
                            >
                              <SparklesIcon className="h-4 w-4" />
                            </button>
                            <button
                              className="p-1 text-gray-600 hover:text-gray-800"
                              title="Edit content"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Content Detail Modal */}
          {selectedContent && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
              <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Content Quality Details
                    </h3>
                    <button
                      onClick={() => setSelectedContent(null)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ×
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">Overall Quality Score</h4>
                      <div className="flex items-center">
                        <span className={`text-3xl font-bold ${getScoreColor(selectedContent.overallScore)}`}>
                          {selectedContent.overallScore.toFixed(1)}/10
                        </span>
                        <span className={`ml-3 inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(selectedContent.status)}`}>
                          {selectedContent.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>

                    {/* Score Breakdown */}
                    <div>
                      <h4 className="font-medium text-gray-900 mb-3">Score Breakdown</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600">Readability</span>
                          <span className={`font-semibold ${getScoreColor(selectedContent.readabilityScore)}`}>
                            {selectedContent.readabilityScore.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600">SEO</span>
                          <span className={`font-semibold ${getScoreColor(selectedContent.seoScore)}`}>
                            {selectedContent.seoScore.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600">Engagement</span>
                          <span className={`font-semibold ${getScoreColor(selectedContent.engagementScore)}`}>
                            {selectedContent.engagementScore.toFixed(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600">Technical</span>
                          <span className={`font-semibold ${getScoreColor(selectedContent.technicalScore)}`}>
                            {selectedContent.technicalScore.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Issues */}
                    {selectedContent.issues.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Issues ({selectedContent.issues.length})</h4>
                        <div className="space-y-3">
                          {selectedContent.issues.map((issue, index) => (
                            <div key={index} className={`p-3 rounded-lg border ${getIssueSeverityColor(issue.severity)}`}>
                              <div className="flex items-start">
                                <ExclamationTriangleIcon className="h-5 w-5 mr-2 mt-0.5" />
                                <div className="flex-1">
                                  <div className="font-medium text-sm mb-1">{issue.description}</div>
                                  <div className="text-sm opacity-75">{issue.suggestion}</div>
                                </div>
                                <span className="text-xs px-2 py-1 rounded bg-white bg-opacity-50">
                                  {issue.severity}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Recommendations */}
                    {selectedContent.recommendations.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-3">Recommendations</h4>
                        <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                          {selectedContent.recommendations.map((rec, index) => (
                            <li key={index}>{rec}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end space-x-3 pt-4 border-t">
                      <button
                        onClick={() => {
                          handleRegenerateContent(selectedContent.id);
                          setSelectedContent(null);
                        }}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                      >
                        Regenerate Content
                      </button>
                      <button
                        onClick={() => setSelectedContent(null)}
                        className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentQualityMonitoring;