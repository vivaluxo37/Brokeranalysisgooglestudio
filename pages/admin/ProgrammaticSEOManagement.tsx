import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  GlobeAltIcon,
  SparklesIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentArrowDownIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import SEOHead from '../../components/seo/SEOHead';
import { contentCache } from '../../services/cache/contentCache';

interface ProgrammaticPage {
  id: string;
  type: 'category_country' | 'strategy' | 'feature' | 'country';
  url: string;
  title: string;
  status: 'generated' | 'cached' | 'error' | 'pending';
  qualityScore: number;
  lastUpdated: string;
  hits: number;
  cacheExpiry: string;
  metadata: {
    category?: string;
    country?: string;
    strategy?: string;
    feature?: string;
  };
}

const ProgrammaticSEOManagement: React.FC = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState<ProgrammaticPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedPages, setSelectedPages] = useState<string[]>([]);
  const [cacheStats, setCacheStats] = useState<any>(null);
  const [regenerating, setRegenerating] = useState<string[]>([]);

  useEffect(() => {
    loadProgrammaticPages();
    loadCacheStats();
  }, []);

  const loadProgrammaticPages = async () => {
    try {
      setLoading(true);
      // Simulate loading programmatic pages data
      const mockPages: ProgrammaticPage[] = [
        {
          id: '1',
          type: 'category_country',
          url: '/forex/us',
          title: 'Forex Trading in United States | Best Brokers 2025',
          status: 'generated',
          qualityScore: 9.2,
          lastUpdated: '2025-01-03T10:30:00Z',
          hits: 145,
          cacheExpiry: '2025-01-04T10:30:00Z',
          metadata: { category: 'forex', country: 'US' }
        },
        {
          id: '2',
          type: 'category_country',
          url: '/crypto/gb',
          title: 'Cryptocurrency Trading in United Kingdom | Best Brokers 2025',
          status: 'cached',
          qualityScore: 8.8,
          lastUpdated: '2025-01-03T08:15:00Z',
          hits: 89,
          cacheExpiry: '2025-01-04T08:15:00Z',
          metadata: { category: 'crypto', country: 'GB' }
        },
        {
          id: '3',
          type: 'strategy',
          url: '/forex/strategy/scalping',
          title: 'Scalping Strategy Guide | How to Trade Scalping',
          status: 'generated',
          qualityScore: 9.5,
          lastUpdated: '2025-01-03T12:00:00Z',
          hits: 234,
          cacheExpiry: '2025-01-04T12:00:00Z',
          metadata: { strategy: 'scalping' }
        },
        {
          id: '4',
          type: 'feature',
          url: '/forex/feature/leverage',
          title: 'Leverage in Trading | What You Need to Know',
          status: 'pending',
          qualityScore: 0,
          lastUpdated: '',
          hits: 0,
          cacheExpiry: '',
          metadata: { feature: 'leverage' }
        },
        {
          id: '5',
          type: 'country',
          url: '/country/trading/de',
          title: 'Forex Trading in Germany | Complete Guide 2025',
          status: 'error',
          qualityScore: 0,
          lastUpdated: '2025-01-02T16:45:00Z',
          hits: 12,
          cacheExpiry: '',
          metadata: { country: 'DE' }
        }
      ];

      setPages(mockPages);
    } catch (error) {
      console.error('Error loading programmatic pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCacheStats = async () => {
    try {
      const stats = contentCache.getStats();
      setCacheStats(stats);
    } catch (error) {
      console.error('Error loading cache stats:', error);
    }
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         page.url.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || page.type === filterType;
    const matchesStatus = filterStatus === 'all' || page.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleRegeneratePage = async (pageId: string) => {
    try {
      setRegenerating(prev => [...prev, pageId]);
      // Simulate regeneration process
      await new Promise(resolve => setTimeout(resolve, 2000));

      setPages(prev => prev.map(page =>
        page.id === pageId
          ? { ...page, status: 'generated', qualityScore: Math.random() * 2 + 8, lastUpdated: new Date().toISOString() }
          : page
      ));
    } catch (error) {
      console.error('Error regenerating page:', error);
    } finally {
      setRegenerating(prev => prev.filter(id => id !== pageId));
    }
  };

  const handleClearCache = async (pageId: string) => {
    try {
      const cacheKey = `page-data:${pageId}`;
      await contentCache.delete(cacheKey);
      loadCacheStats();

      setPages(prev => prev.map(page =>
        page.id === pageId ? { ...page, status: 'pending' } : page
      ));
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  };

  const handleBulkRegenerate = async () => {
    try {
      setRegenerating(selectedPages);
      // Simulate bulk regeneration
      await new Promise(resolve => setTimeout(resolve, 3000));

      setPages(prev => prev.map(page =>
        selectedPages.includes(page.id)
          ? { ...page, status: 'generated', qualityScore: Math.random() * 2 + 8, lastUpdated: new Date().toISOString() }
          : page
      ));
      setSelectedPages([]);
    } catch (error) {
      console.error('Error in bulk regeneration:', error);
    } finally {
      setRegenerating([]);
    }
  };

  const handleBulkClearCache = async () => {
    try {
      for (const pageId of selectedPages) {
        const cacheKey = `page-data:${pageId}`;
        await contentCache.delete(cacheKey);
      }
      loadCacheStats();

      setPages(prev => prev.map(page =>
        selectedPages.includes(page.id) ? { ...page, status: 'pending' } : page
      ));
      setSelectedPages([]);
    } catch (error) {
      console.error('Error in bulk cache clear:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'generated': return 'text-green-600 bg-green-100';
      case 'cached': return 'text-blue-600 bg-blue-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getQualityColor = (score: number) => {
    if (score >= 9) return 'text-green-600';
    if (score >= 7) return 'text-yellow-600';
    if (score > 0) return 'text-red-600';
    return 'text-gray-400';
  };

  const formatLastUpdated = (dateString: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEOHead
        title="Programmatic SEO Management | Admin"
        description="Manage programmatic SEO content and performance"
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
              <h1 className="text-2xl font-bold text-gray-900">Programmatic SEO Management</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/admin/content-quality"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Content Quality
              </Link>
              <Link
                to="/admin/performance"
                className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              >
                Performance
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Stats Overview */}
          {cacheStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <GlobeAltIcon className="h-8 w-8 text-blue-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{pages.length}</div>
                    <div className="text-sm text-gray-500">Total Pages</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ClockIcon className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{cacheStats.hitRate.toFixed(1)}%</div>
                    <div className="text-sm text-gray-500">Cache Hit Rate</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-8 w-8 text-green-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {pages.filter(p => p.status === 'generated').length}
                    </div>
                    <div className="text-sm text-gray-500">Generated Pages</div>
                  </div>
                </div>
              </div>
              <div className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center">
                  <ExclamationCircleIcon className="h-8 w-8 text-red-600 mr-3" />
                  <div>
                    <div className="text-2xl font-bold text-gray-900">
                      {pages.filter(p => p.status === 'error' || p.status === 'pending').length}
                    </div>
                    <div className="text-sm text-gray-500">Need Attention</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Filters and Actions */}
          <div className="bg-white p-6 rounded-lg shadow mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search pages..."
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
                  <option value="generated">Generated</option>
                  <option value="cached">Cached</option>
                  <option value="pending">Pending</option>
                  <option value="error">Error</option>
                </select>
              </div>
              <div className="flex gap-2">
                {selectedPages.length > 0 && (
                  <>
                    <button
                      onClick={handleBulkRegenerate}
                      disabled={regenerating.length > 0}
                      className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                    >
                      <ArrowPathIcon className="h-4 w-4 mr-2" />
                      Regenerate ({selectedPages.length})
                    </button>
                    <button
                      onClick={handleBulkClearCache}
                      className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                    >
                      <TrashIcon className="h-4 w-4 mr-2" />
                      Clear Cache ({selectedPages.length})
                    </button>
                  </>
                )}
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  <ArrowPathIcon className="h-4 w-4 mr-2" />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Pages Table */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedPages.length === filteredPages.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPages(filteredPages.map(p => p.id));
                          } else {
                            setSelectedPages([]);
                          }
                        }}
                        className="rounded border-gray-300"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Page
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quality Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Updated
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hits
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
                          <ArrowPathIcon className="h-6 w-6 animate-spin text-blue-600 mr-3" />
                          Loading programmatic pages...
                        </div>
                      </td>
                    </tr>
                  ) : filteredPages.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                        No programmatic pages found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredPages.map((page) => (
                      <tr key={page.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <input
                            type="checkbox"
                            checked={selectedPages.includes(page.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedPages(prev => [...prev, page.id]);
                              } else {
                                setSelectedPages(prev => prev.filter(id => id !== page.id));
                              }
                            }}
                            className="rounded border-gray-300"
                          />
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              <Link to={page.url} className="hover:text-blue-600">
                                {page.title}
                              </Link>
                            </div>
                            <div className="text-sm text-gray-500">{page.url}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-900 capitalize">
                            {page.type.replace('_', '-')}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(page.status)}`}>
                            {page.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {page.qualityScore > 0 ? (
                            <div className={`text-sm font-medium ${getQualityColor(page.qualityScore)}`}>
                              {page.qualityScore.toFixed(1)}/10
                            </div>
                          ) : (
                            <div className="text-sm text-gray-400">-</div>
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {formatLastUpdated(page.lastUpdated)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {page.hits.toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleRegeneratePage(page.id)}
                              disabled={regenerating.includes(page.id)}
                              className="p-1 text-blue-600 hover:text-blue-800 disabled:opacity-50"
                              title="Regenerate content"
                            >
                              <ArrowPathIcon className={`h-4 w-4 ${regenerating.includes(page.id) ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                              onClick={() => handleClearCache(page.id)}
                              className="p-1 text-red-600 hover:text-red-800"
                              title="Clear cache"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                            <button
                              className="p-1 text-gray-600 hover:text-gray-800"
                              title="View details"
                            >
                              <MagnifyingGlassIcon className="h-4 w-4" />
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
        </div>
      </div>
    </div>
  );
};

export default ProgrammaticSEOManagement;