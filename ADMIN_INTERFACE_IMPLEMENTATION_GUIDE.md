# Admin Interface Implementation Guide

## Overview
This guide provides detailed implementation instructions for the admin interface components needed to manage the programmatic SEO system.

## Admin Interface Structure

### Required Components
1. **ProgrammaticSEOAdmin** - Main dashboard
2. **ContentGenerationPanel** - Control content generation
3. **PageManagementPanel** - Manage generated pages
4. **AnalyticsDashboard** - View performance metrics
5. **CacheManagementPanel** - Control caching
6. **RankingWeightsPanel** - Configure ranking factors

## 1. Main Admin Dashboard

### File: `components/admin/ProgrammaticSEOAdmin.tsx`

```typescript
/**
 * Programmatic SEO Admin Dashboard
 * 
 * Main dashboard for managing the programmatic SEO system
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import { ContentGenerationPanel } from './ContentGenerationPanel';
import { PageManagementPanel } from './PageManagementPanel';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { CacheManagementPanel } from './CacheManagementPanel';
import { RankingWeightsPanel } from './RankingWeightsPanel';
import { pageDataService } from '../../services/programmatic/pageDataService';
import { contentCache } from '../../services/cache/contentCache';

interface AdminStats {
  totalPages: number;
  generatedPages: number;
  pendingPages: number;
  failedPages: number;
  cacheHitRate: number;
  avgContentQuality: number;
  lastGenerated: string;
}

export const ProgrammaticSEOAdmin: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      // Load statistics from various services
      const cacheStats = contentCache.getStats();
      
      // This would fetch from your API
      const pageStats = await fetchPageStats();
      
      setStats({
        totalPages: pageStats.total || 0,
        generatedPages: pageStats.generated || 0,
        pendingPages: pageStats.pending || 0,
        failedPages: pageStats.failed || 0,
        cacheHitRate: cacheStats.hitRate || 0,
        avgContentQuality: pageStats.avgQuality || 0,
        lastGenerated: pageStats.lastGenerated || new Date().toISOString()
      });
    } catch (error) {
      console.error('Error loading admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPageStats = async () => {
    // This would be an actual API call
    return {
      total: 1000,
      generated: 750,
      pending: 150,
      failed: 100,
      avgQuality: 0.85,
      lastGenerated: new Date().toISOString()
    };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Programmatic SEO Admin</h1>
        <Button onClick={loadStats}>Refresh</Button>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Pages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalPages}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.generatedPages} generated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Cache Hit Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((stats?.cacheHitRate || 0) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Performance indicator
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Content Quality</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((stats?.avgContentQuality || 0) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average quality score
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Last Generated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.lastGenerated ? 
                new Date(stats.lastGenerated).toLocaleDateString() : 
                'Never'
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Content generation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="pages">Pages</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>Pages generated today</span>
                    <span className="font-medium">24</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Cache cleared</span>
                    <span className="font-medium">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Ranking updated</span>
                    <span className="font-medium">1 day ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>System Health</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span>AI API Status</span>
                    <span className="text-green-600 font-medium">Healthy</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Database Connection</span>
                    <span className="text-green-600 font-medium">Connected</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Cache Service</span>
                    <span className="text-green-600 font-medium">Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <ContentGenerationPanel onRefresh={loadStats} />
        </TabsContent>

        <TabsContent value="pages">
          <PageManagementPanel onRefresh={loadStats} />
        </TabsContent>

        <TabsContent value="analytics">
          <AnalyticsDashboard />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CacheManagementPanel onRefresh={loadStats} />
            <RankingWeightsPanel />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProgrammaticSEOAdmin;
```

## 2. Content Generation Panel

### File: `components/admin/ContentGenerationPanel.tsx`

```typescript
/**
 * Content Generation Panel
 * 
 * Control panel for AI content generation
 */

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Checkbox } from '../ui/Checkbox';
import { aiContentGenerator } from '../../services/content/AIContentGenerator';
import { contentValidationService } from '../../services/content/contentValidationService';

interface GenerationJob {
  id: string;
  type: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  startedAt: string;
  completedAt?: string;
  error?: string;
}

export const ContentGenerationPanel: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const [jobs, setJobs] = useState<GenerationJob[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationType, setGenerationType] = useState('category-country');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [includeFAQs, setIncludeFAQs] = useState(true);
  const [includeComparison, setIncludeComparison] = useState(true);
  const [qualityThreshold, setQualityThreshold] = useState(0.7);

  const categories = [
    'forex', 'stocks', 'crypto', 'commodities', 'indices', 
    'options', 'futures', 'cfd', 'etf', 'bonds'
  ];

  const countries = [
    'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'CH', 
    'AU', 'CA', 'JP', 'SG', 'HK', 'AE', 'ZA'
  ];

  const startGeneration = async () => {
    setIsGenerating(true);
    
    try {
      const jobId = `job-${Date.now()}`;
      const newJob: GenerationJob = {
        id: jobId,
        type: generationType,
        status: 'pending',
        progress: 0,
        startedAt: new Date().toISOString()
      };

      setJobs(prev => [...prev, newJob]);

      // Update job status to running
      setJobs(prev => 
        prev.map(job => 
          job.id === jobId ? { ...job, status: 'running' } : job
        )
      );

      // Generate content based on type
      if (generationType === 'category-country') {
        await generateCategoryCountryContent(jobId);
      } else if (generationType === 'category') {
        await generateCategoryContent(jobId);
      } else if (generationType === 'country') {
        await generateCountryContent(jobId);
      }

      // Mark job as completed
      setJobs(prev => 
        prev.map(job => 
          job.id === jobId ? { 
            ...job, 
            status: 'completed', 
            progress: 100,
            completedAt: new Date().toISOString()
          } : job
        )
      );

      onRefresh();
    } catch (error) {
      console.error('Generation failed:', error);
      setJobs(prev => 
        prev.map(job => 
          job.id === jobs[0].id ? { 
            ...job, 
            status: 'failed', 
            error: error instanceof Error ? error.message : 'Unknown error'
          } : job
        )
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCategoryCountryContent = async (jobId: string) => {
    const total = selectedCategories.length * selectedCountries.length;
    let completed = 0;

    for (const category of selectedCategories) {
      for (const country of selectedCountries) {
        try {
          // Generate content for this combination
          const request = {
            type: 'page_content' as const,
            context: {
              pageType: 'category-country',
              category: category,
              country: country,
              targetAudience: 'traders of all levels',
              tone: 'professional' as const,
              length: 'medium' as const,
              keywords: [category, country]
            },
            options: {
              includeStructuredData: true,
              includeFAQs,
              includeComparison
            }
          };

          const result = await aiContentGenerator.generateContent(request);

          // Validate content
          const validation = await contentValidationService.validateContent(
            result.content,
            {
              type: 'category-country',
              keywords: [category, country],
              targetLength: 1000,
              category,
              country
            }
          );

          // Only save if quality meets threshold
          if (validation.score >= qualityThreshold) {
            // Save to database
            await saveGeneratedContent({
              type: 'category-country',
              category,
              country,
              content: result.content,
              structuredData: result.structuredData,
              faqs: result.faqs,
              comparison: result.comparison,
              qualityScore: validation.score,
              validationIssues: validation.issues
            });
          }

          completed++;
          const progress = Math.round((completed / total) * 100);
          
          setJobs(prev => 
            prev.map(job => 
              job.id === jobId ? { ...job, progress } : job
            )
          );

        } catch (error) {
          console.error(`Error generating content for ${category}-${country}:`, error);
        }
      }
    }
  };

  const saveGeneratedContent = async (content: any) => {
    // This would save to your database
    console.log('Saving content:', content);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Content Generation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="generation-type">Generation Type</Label>
              <Select value={generationType} onValueChange={setGenerationType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="category-country">Category-Country Pages</SelectItem>
                  <SelectItem value="category">Category Pages</SelectItem>
                  <SelectItem value="country">Country Pages</SelectItem>
                  <SelectItem value="strategy">Strategy Pages</SelectItem>
                  <SelectItem value="feature">Feature Pages</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="quality-threshold">Quality Threshold</Label>
              <Select value={qualityThreshold.toString()} onValueChange={(v) => setQualityThreshold(parseFloat(v))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select threshold" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">50% - Low</SelectItem>
                  <SelectItem value="0.7">70% - Medium</SelectItem>
                  <SelectItem value="0.8">80% - High</SelectItem>
                  <SelectItem value="0.9">90% - Very High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {generationType.includes('category') && (
            <div>
              <Label>Categories</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                {categories.map(category => (
                  <div key={category} className="flex items-center space-x-2">
                    <Checkbox
                      id={category}
                      checked={selectedCategories.includes(category)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCategories(prev => [...prev, category]);
                        } else {
                          setSelectedCategories(prev => prev.filter(c => c !== category));
                        }
                      }}
                    />
                    <Label htmlFor={category} className="text-sm">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {generationType.includes('country') && (
            <div>
              <Label>Countries</Label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                {countries.map(country => (
                  <div key={country} className="flex items-center space-x-2">
                    <Checkbox
                      id={country}
                      checked={selectedCountries.includes(country)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedCountries(prev => [...prev, country]);
                        } else {
                          setSelectedCountries(prev => prev.filter(c => c !== country));
                        }
                      }}
                    />
                    <Label htmlFor={country} className="text-sm">
                      {country}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-faqs"
                checked={includeFAQs}
                onCheckedChange={(checked) => setIncludeFAQs(checked as boolean)}
              />
              <Label htmlFor="include-faqs">Include FAQs</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="include-comparison"
                checked={includeComparison}
                onCheckedChange={(checked) => setIncludeComparison(checked as boolean)}
              />
              <Label htmlFor="include-comparison">Include Comparison</Label>
            </div>
          </div>

          <Button 
            onClick={startGeneration} 
            disabled={isGenerating || selectedCategories.length === 0 || selectedCountries.length === 0}
            className="w-full"
          >
            {isGenerating ? 'Generating...' : 'Start Generation'}
          </Button>
        </CardContent>
      </Card>

      {/* Generation Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Generation Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <p className="text-muted-foreground">No jobs started yet</p>
          ) : (
            <div className="space-y-4">
              {jobs.map(job => (
                <div key={job.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{job.type}</span>
                    <span className={`text-sm px-2 py-1 rounded ${
                      job.status === 'completed' ? 'bg-green-100 text-green-800' :
                      job.status === 'running' ? 'bg-blue-100 text-blue-800' :
                      job.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {job.status}
                    </span>
                  </div>
                  
                  {job.status === 'running' && (
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${job.progress}%` }}
                      ></div>
                    </div>
                  )}
                  
                  {job.error && (
                    <p className="text-red-600 text-sm mt-2">{job.error}</p>
                  )}
                  
                  <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                    <span>Started: {new Date(job.startedAt).toLocaleString()}</span>
                    {job.completedAt && (
                      <span>Completed: {new Date(job.completedAt).toLocaleString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
```

## 3. Page Management Panel

### File: `components/admin/PageManagementPanel.tsx`

```typescript
/**
 * Page Management Panel
 * 
 * Interface for managing generated programmatic pages
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/Table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';

interface ProgrammaticPage {
  id: number;
  pageType: string;
  slug: string;
  title: string;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  qualityScore: number;
  lastGenerated?: string;
  nextUpdate?: string;
  category?: string;
  country?: string;
}

export const PageManagementPanel: React.FC<{ onRefresh: () => void }> = ({ onRefresh }) => {
  const [pages, setPages] = useState<ProgrammaticPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pageTypeFilter, setPageTypeFilter] = useState('all');

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    try {
      setLoading(true);
      // This would fetch from your API
      const mockPages: ProgrammaticPage[] = [
        {
          id: 1,
          pageType: 'category-country',
          slug: 'forex/us',
          title: 'Best Forex Brokers in United States 2025',
          status: 'completed',
          qualityScore: 0.85,
          lastGenerated: '2025-01-15T10:30:00Z',
          nextUpdate: '2025-01-22T10:30:00Z',
          category: 'forex',
          country: 'US'
        },
        {
          id: 2,
          pageType: 'category',
          slug: 'crypto',
          title: 'Best Crypto Brokers 2025',
          status: 'completed',
          qualityScore: 0.92,
          lastGenerated: '2025-01-14T15:45:00Z',
          nextUpdate: '2025-01-21T15:45:00Z',
          category: 'crypto'
        },
        {
          id: 3,
          pageType: 'country',
          slug: 'gb',
          title: 'Best Trading Brokers in United Kingdom 2025',
          status: 'failed',
          qualityScore: 0,
          lastGenerated: '2025-01-13T09:20:00Z',
          country: 'GB'
        }
      ];

      setPages(mockPages);
    } catch (error) {
      console.error('Error loading pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const regeneratePage = async (pageId: number) => {
    try {
      // Set status to generating
      setPages(prev => 
        prev.map(page => 
          page.id === pageId ? { ...page, status: 'generating' } : page
        )
      );

      // This would trigger regeneration
      console.log('Regenerating page:', pageId);

      // Simulate completion
      setTimeout(() => {
        setPages(prev => 
          prev.map(page => 
            page.id === pageId ? { 
              ...page, 
              status: 'completed',
              lastGenerated: new Date().toISOString(),
              qualityScore: Math.random() * 0.3 + 0.7
            } : page
          )
        );
        onRefresh();
      }, 2000);

    } catch (error) {
      console.error('Error regenerating page:', error);
      setPages(prev => 
        prev.map(page => 
          page.id === pageId ? { ...page, status: 'failed' } : page
        )
      );
    }
  };

  const deletePage = async (pageId: number) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      // This would delete from your API
      console.log('Deleting page:', pageId);
      
      setPages(prev => prev.filter(page => page.id !== pageId));
      onRefresh();
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  const filteredPages = pages.filter(page => {
    const matchesSearch = page.title.toLowerCase().includes(filter.toLowerCase()) ||
                         page.slug.toLowerCase().includes(filter.toLowerCase());
    const matchesStatus = statusFilter === 'all' || page.status === statusFilter;
    const matchesPageType = pageTypeFilter === 'all' || page.pageType === pageTypeFilter;
    
    return matchesSearch && matchesStatus && matchesPageType;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      pending: 'secondary',
      generating: 'default',
      completed: 'default',
      failed: 'destructive'
    };
    
    return (
      <Badge variant={variants[status] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  const getQualityBadge = (score: number) => {
    if (score >= 0.9) return <Badge variant="default">Excellent</Badge>;
    if (score >= 0.8) return <Badge variant="secondary">Good</Badge>;
    if (score >= 0.7) return <Badge variant="outline">Fair</Badge>;
    if (score > 0) return <Badge variant="destructive">Poor</Badge>;
    return <Badge variant="destructive">N/A</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Page Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Input
              placeholder="Search pages..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="max-w-sm"
            />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="generating">Generating</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={pageTypeFilter} onValueChange={setPageTypeFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="country">Country</SelectItem>
                <SelectItem value="category-country">Category-Country</SelectItem>
                <SelectItem value="strategy">Strategy</SelectItem>
                <SelectItem value="feature">Feature</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={loadPages}>Refresh</Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Page</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Quality</TableHead>
                <TableHead>Last Generated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.map(page => (
                <TableRow key={page.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{page.title}</div>
                      <div className="text-sm text-muted-foreground">{page.slug}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{page.pageType}</Badge>
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(page.status)}
                  </TableCell>
                  <TableCell>
                    {getQualityBadge(page.qualityScore)}
                  </TableCell>
                  <TableCell>
                    {page.lastGenerated ? 
                      new Date(page.lastGenerated).toLocaleDateString() : 
                      'Never'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => regeneratePage(page.id)}
                        disabled={page.status === 'generating'}
                      >
                        {page.status === 'generating' ? 'Generating...' : 'Regenerate'}
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deletePage(page.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredPages.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No pages found matching the current filters.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
```

## 4. Analytics Dashboard

### File: `components/admin/AnalyticsDashboard.tsx`

```typescript
/**
 * Analytics Dashboard
 * 
 * Display performance metrics and analytics for programmatic pages
 */

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface AnalyticsData {
  date: string;
  views: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgTimeOnPage: number;
  conversionRate: number;
}

interface PagePerformance {
  slug: string;
  title: string;
  views: number;
  avgTimeOnPage: number;
  bounceRate: number;
  conversionRate: number;
  qualityScore: number;
}

export const AnalyticsDashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [topPages, setTopPages] = useState<PagePerformance[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      
      // This would fetch from your analytics API
      const mockData: AnalyticsData[] = [
        { date: '2025-01-10', views: 1200, uniqueVisitors: 800, bounceRate: 45, avgTimeOnPage: 180, conversionRate: 3.2 },
        { date: '2025-01-11', views: 1350, uniqueVisitors: 900, bounceRate: 42, avgTimeOnPage: 195, conversionRate: 3.5 },
        { date: '2025-01-12', views: 1100, uniqueVisitors: 750, bounceRate: 48, avgTimeOnPage: 170, conversionRate: 2.8 },
        { date: '2025-01-13', views: 1400, uniqueVisitors: 950, bounceRate: 40, avgTimeOnPage: 200, conversionRate: 3.8 },
        { date: '2025-01-14', views: 1600, uniqueVisitors: 1100, bounceRate: 38, avgTimeOnPage: 210, conversionRate: 4.1 },
        { date: '2025-01-15', views: 1550, uniqueVisitors: 1050, bounceRate: 41, avgTimeOnPage: 205, conversionRate: 3.9 },
        { date: '2025-01-16', views: 1700, uniqueVisitors: 1200, bounceRate: 36, avgTimeOnPage: 220, conversionRate: 4.3 }
      ];

      const mockTopPages: PagePerformance[] = [
        { slug: 'forex/us', title: 'Best Forex Brokers in United States 2025', views: 2500, avgTimeOnPage: 240, bounceRate: 32, conversionRate: 5.2, qualityScore: 0.92 },
        { slug: 'crypto', title: 'Best Crypto Brokers 2025', views: 2200, avgTimeOnPage: 210, bounceRate: 38, conversionRate: 4.8, qualityScore: 0.88 },
        { slug: 'stocks/gb', title: 'Best Stock Brokers in United Kingdom 2025', views: 1800, avgTimeOnPage: 195, bounceRate: 42, conversionRate: 3.9, qualityScore: 0.85 },
        { slug: 'day-trading-strategy', title: 'Day Trading Strategy Guide', views: 1500, avgTimeOnPage: 300, bounceRate: 28, conversionRate: 2.1, qualityScore: 0.91 },
        { slug: 'low-spreads-feature', title: 'Brokers with Low Spreads', views: 1200, avgTimeOnPage: 180, bounceRate: 45, conversionRate: 3.2, qualityScore: 0.87 }
      ];

      setAnalyticsData(mockData);
      setTopPages(mockTopPages);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.reduce((sum, day) => sum + day.views, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +12% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData.reduce((sum, day) => sum + day.uniqueVisitors, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              +8% from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Time on Page</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatTime(Math.round(analyticsData.reduce((sum, day) => sum + day.avgTimeOnPage, 0) / analyticsData.length))}
            </div>
            <p className="text-xs text-muted-foreground">
              +15s from last period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(analyticsData.reduce((sum, day) => sum + day.conversionRate, 0) / analyticsData.length).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              +0.3% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Page Views Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Bounce Rate Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="bounceRate" stroke="#dc2626" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Pages */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div key={page.slug} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="font-medium">{page.title}</div>
                  <div className="text-sm text-muted-foreground">{page.slug}</div>
                </div>
                <div className="flex items-center space-x-6 text-sm">
                  <div className="text-center">
                    <div className="font-medium">{page.views.toLocaleString()}</div>
                    <div className="text-muted-foreground">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{formatTime(page.avgTimeOnPage)}</div>
                    <div className="text-muted-foreground">Time</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{page.bounceRate}%</div>
                    <div className="text-muted-foreground">Bounce</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{page.conversionRate}%</div>
                    <div className="text-muted-foreground">Conv.</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium">{Math.round(page.qualityScore * 100)}%</div>
                    <div className="text-muted-foreground">Quality</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
```

## Implementation Steps

1. **Create the UI components** needed for the admin interface
2. **Implement the admin panels** using the provided code
3. **Add routing** for the admin interface
4. **Integrate with existing services**
5. **Add authentication and authorization**
6. **Test the admin interface**
7. **Deploy and monitor**

## Next Steps

After implementing the admin interface:

1. Add comprehensive testing
2. Implement caching optimizations
3. Set up monitoring and alerting
4. Deploy to production
5. Train users on the admin interface

This admin interface will provide complete control over the programmatic SEO system, allowing administrators to manage content generation, monitor performance, and optimize the system for better results.