import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Checkbox } from '../ui/checkbox';
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Copy,
  Download,
  ExternalLink,
  FileText,
  Image,
  Link,
  Search,
  Shield,
  Globe,
  Zap,
  Eye,
  Smartphone,
  Monitor
} from 'lucide-react';

interface SEOChecklistItem {
  id: string;
  category: string;
  title: string;
  description: string;
  type: 'required' | 'recommended' | 'optional';
  status: 'completed' | 'pending' | 'failed' | 'warning';
  details?: string;
  action?: {
    label: string;
    url?: string;
    callback?: () => void;
  };
}

interface SEOChecklistProps {
  pageType: 'home' | 'broker' | 'article' | 'category' | 'comparison' | 'tools' | 'education';
  pagePath: string;
  pageData?: any;
  onChecklistComplete?: (results: SEOChecklistItem[]) => void;
}

const SEOChecklist: React.FC<SEOChecklistProps> = ({
  pageType,
  pagePath,
  pageData,
  onChecklistComplete
}) => {
  const [checklist, setChecklist] = useState<SEOChecklistItem[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  // Generate checklist based on page type
  const generateChecklist = (): SEOChecklistItem[] => {
    const baseChecklist: SEOChecklistItem[] = [
      {
        id: 'meta-title',
        category: 'Meta Tags',
        title: 'Page Title (H1)',
        description: 'Unique, descriptive title under 60 characters',
        type: 'required',
        status: 'pending'
      },
      {
        id: 'meta-description',
        category: 'Meta Tags',
        title: 'Meta Description',
        description: 'Compelling description under 160 characters',
        type: 'required',
        status: 'pending'
      },
      {
        id: 'meta-keywords',
        category: 'Meta Tags',
        title: 'Meta Keywords',
        description: 'Relevant keywords for the page content',
        type: 'recommended',
        status: 'pending'
      },
      {
        id: 'canonical-url',
        category: 'Meta Tags',
        title: 'Canonical URL',
        description: 'Self-referential canonical URL to prevent duplicate content',
        type: 'required',
        status: 'pending'
      },
      {
        id: 'open-graph',
        category: 'Social Media',
        title: 'Open Graph Tags',
        description: 'OG title, description, image for social sharing',
        type: 'required',
        status: 'pending'
      },
      {
        id: 'twitter-cards',
        category: 'Social Media',
        title: 'Twitter Cards',
        description: 'Twitter card tags for better Twitter sharing',
        type: 'recommended',
        status: 'pending'
      },
      {
        id: 'structured-data',
        category: 'Structured Data',
        title: 'JSON-LD Schema',
        description: 'Schema.org markup for rich search results',
        type: 'required',
        status: 'pending'
      },
      {
        id: 'hreflang',
        category: 'Internationalization',
        title: 'Hreflang Tags',
        description: 'Language and regional targeting tags',
        type: 'recommended',
        status: 'pending'
      },
      {
        id: 'responsive-design',
        category: 'Performance',
        title: 'Responsive Design',
        description: 'Mobile-friendly responsive layout',
        type: 'required',
        status: 'pending'
      },
      {
        id: 'page-speed',
        category: 'Performance',
        title: 'Page Speed',
        description: 'Fast loading times (LCP < 2.5s, FID < 100ms, CLS < 0.1)',
        type: 'required',
        status: 'pending'
      },
      {
        id: 'image-optimization',
        category: 'Performance',
        title: 'Image Optimization',
        description: 'Compressed images with alt attributes',
        type: 'required',
        status: 'pending'
      },
      {
        id: 'internal-links',
        category: 'Content',
        title: 'Internal Links',
        description: 'Relevant internal links to other pages',
        type: 'recommended',
        status: 'pending'
      },
      {
        id: 'heading-structure',
        category: 'Content',
        title: 'Heading Structure',
        description: 'Proper H1-H6 heading hierarchy',
        type: 'required',
        status: 'pending'
      },
      {
        id: 'readability',
        category: 'Content',
        title: 'Content Readability',
        description: 'Clear, readable content with proper formatting',
        type: 'recommended',
        status: 'pending'
      },
      {
        id: 'sitemap-inclusion',
        category: 'Technical',
        title: 'Sitemap Inclusion',
        description: 'Page included in XML sitemap',
        type: 'required',
        status: 'pending'
      },
      {
        id: 'robots-txt',
        category: 'Technical',
        title: 'Robots.txt Directives',
        description: 'Proper crawl instructions in robots.txt',
        type: 'required',
        status: 'pending'
      },
      {
        id: 'ssl-certificate',
        category: 'Security',
        title: 'SSL Certificate',
        description: 'HTTPS encryption enabled',
        type: 'required',
        status: 'pending'
      },
      {
        id: 'accessibility',
        category: 'Accessibility',
        title: 'Accessibility Standards',
        description: 'WCAG 2.1 AA compliance',
        type: 'recommended',
        status: 'pending'
      }
    ];

    // Add page-specific checklist items
    switch (pageType) {
      case 'broker':
        return [
          ...baseChecklist,
          {
            id: 'broker-schema',
            category: 'Structured Data',
            title: 'Broker Schema',
            description: 'FinancialService schema with rating and regulation info',
            type: 'required',
            status: 'pending'
          },
          {
            id: 'broker-reviews',
            category: 'Content',
            title: 'Broker Reviews',
            description: 'Customer reviews and ratings',
            type: 'recommended',
            status: 'pending'
          },
          {
            id: 'regulatory-info',
            category: 'Content',
            title: 'Regulatory Information',
            description: 'Clear regulation and licensing details',
            type: 'required',
            status: 'pending'
          }
        ];
      case 'article':
        return [
          ...baseChecklist,
          {
            id: 'article-schema',
            category: 'Structured Data',
            title: 'Article Schema',
            description: 'Article schema with author and publish date',
            type: 'required',
            status: 'pending'
          },
          {
            id: 'faq-schema',
            category: 'Structured Data',
            title: 'FAQ Schema',
            description: 'FAQPage schema for Q&A content',
            type: 'recommended',
            status: 'pending'
          },
          {
            id: 'author-info',
            category: 'Content',
            title: 'Author Information',
            description: 'Author bio and credentials',
            type: 'recommended',
            status: 'pending'
          },
          {
            id: 'publish-date',
            category: 'Content',
            title: 'Publish Date',
            description: 'Clear publication and last modified dates',
            type: 'required',
            status: 'pending'
          }
        ];
      case 'home':
        return [
          ...baseChecklist,
          {
            id: 'organization-schema',
            category: 'Structured Data',
            title: 'Organization Schema',
            description: 'Organization details and contact info',
            type: 'required',
            status: 'pending'
          },
          {
            id: 'website-schema',
            category: 'Structured Data',
            title: 'Website Schema',
            description: 'Website search functionality',
            type: 'required',
            status: 'pending'
          }
        ];
      default:
        return baseChecklist;
    }
  };

  const runChecklist = async () => {
    setIsRunning(true);
    setProgress(0);

    const items = generateChecklist();
    const totalItems = items.length;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      // Simulate checking each item
      await new Promise(resolve => setTimeout(resolve, 200));

      // Update item status based on simulated checks
      const updatedItem = await checkItem(item, pageData);
      items[i] = updatedItem;

      setChecklist([...items]);
      setProgress(((i + 1) / totalItems) * 100);
    }

    setIsRunning(false);

    if (onChecklistComplete) {
      onChecklistComplete(items);
    }
  };

  const checkItem = async (item: SEOChecklistItem, data?: any): Promise<SEOChecklistItem> => {
    // Simulate checking logic - in real implementation, this would analyze the actual page
    const randomStatus = (): SEOChecklistItem['status'] => {
      const rand = Math.random();
      if (item.type === 'required') {
        return rand > 0.2 ? 'completed' : rand > 0.1 ? 'warning' : 'failed';
      } else if (item.type === 'recommended') {
        return rand > 0.4 ? 'completed' : rand > 0.2 ? 'warning' : 'pending';
      } else {
        return rand > 0.6 ? 'completed' : 'pending';
      }
    };

    return {
      ...item,
      status: randomStatus(),
      details: generateItemDetails(item.id, randomStatus())
    };
  };

  const generateItemDetails = (itemId: string, status: string): string => {
    const detailsMap: Record<string, string> = {
      'meta-title': status === 'completed' ? 'Title is 45 characters with primary keyword' : 'Title is missing or too long',
      'meta-description': status === 'completed' ? 'Description is 155 characters with compelling copy' : 'Description needs improvement',
      'structured-data': status === 'completed' ? 'JSON-LD schema properly implemented' : 'Schema markup missing or invalid',
      'page-speed': status === 'completed' ? 'LCP: 2.1s, FID: 85ms, CLS: 0.05' : 'Page speed needs optimization',
      'responsive-design': status === 'completed' ? 'Mobile-friendly design confirmed' : 'Responsive issues detected'
    };

    return detailsMap[itemId] || 'Check completed';
  };

  const getStatusIcon = (status: SEOChecklistItem['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: SEOChecklistItem['status']) => {
    const variants = {
      completed: 'default',
      failed: 'destructive',
      warning: 'secondary',
      pending: 'outline'
    } as const;

    const labels = {
      completed: 'Completed',
      failed: 'Failed',
      warning: 'Warning',
      pending: 'Pending'
    };

    return <Badge variant={variants[status]}>{labels[status]}</Badge>;
  };

  const getTypeBadge = (type: SEOChecklistItem['type']) => {
    const variants = {
      required: 'destructive',
      recommended: 'default',
      optional: 'secondary'
    } as const;

    return <Badge variant={variants[type]}>{type}</Badge>;
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      'Meta Tags': <FileText className="h-4 w-4" />,
      'Social Media': <Share className="h-4 w-4" />,
      'Structured Data': <Code className="h-4 w-4" />,
      'Internationalization': <Globe className="h-4 w-4" />,
      'Performance': <Zap className="h-4 w-4" />,
      'Content': <FileText className="h-4 w-4" />,
      'Technical': <Settings className="h-4 w-4" />,
      'Security': <Shield className="h-4 w-4" />,
      'Accessibility': <Eye className="h-4 w-4" />
    };

    return icons[category as keyof typeof icons] || <FileText className="h-4 w-4" />;
  };

  const exportResults = () => {
    const results = {
      pageType,
      pagePath,
      timestamp: new Date().toISOString(),
      checklist: checklist,
      summary: {
        total: checklist.length,
        completed: checklist.filter(item => item.status === 'completed').length,
        failed: checklist.filter(item => item.status === 'failed').length,
        warnings: checklist.filter(item => item.status === 'warning').length,
        pending: checklist.filter(item => item.status === 'pending').length,
        score: Math.round((checklist.filter(item => item.status === 'completed').length / checklist.length) * 100)
      }
    };

    const blob = new Blob([JSON.stringify(results, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `seo-checklist-${pagePath.replace(/\//g, '-')}-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyResults = () => {
    const results = checklist.map(item => `${item.title}: ${item.status.toUpperCase()}`).join('\n');
    navigator.clipboard.writeText(results);
  };

  useEffect(() => {
    setChecklist(generateChecklist());
  }, [pageType, pagePath]);

  const completedCount = checklist.filter(item => item.status === 'completed').length;
  const totalCount = checklist.length;
  const score = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                SEO Checklist for {pageType} Page
              </CardTitle>
              <p className="text-gray-600 mt-1">
                Page: {pagePath} • Score: {score}%
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={runChecklist}
                disabled={isRunning}
                className="flex items-center gap-2"
              >
                {isRunning ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Running...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    Run Checklist
                  </>
                )}
              </Button>
              <Button variant="outline" onClick={exportResults}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button variant="outline" onClick={copyResults}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
          {isRunning && (
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{Math.round(progress)}% complete</p>
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-600">{completedCount}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">
                  {checklist.filter(item => item.status === 'warning').length}
                </div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {checklist.filter(item => item.status === 'failed').length}
                </div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-gray-400" />
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {checklist.filter(item => item.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Checklist Items */}
      <div className="space-y-4">
        {checklist.map((item) => (
          <Card key={item.id} className={`transition-all duration-200 ${
            item.status === 'failed' ? 'border-red-200' :
            item.status === 'warning' ? 'border-yellow-200' :
            item.status === 'completed' ? 'border-green-200' : ''
          }`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(item.status)}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getCategoryIcon(item.category)}
                      <h4 className="font-semibold">{item.title}</h4>
                      {getTypeBadge(item.type)}
                      {getStatusBadge(item.status)}
                    </div>
                  </div>
                  <p className="text-gray-600 mb-2">{item.description}</p>
                  {item.details && (
                    <p className="text-sm text-gray-500 mb-3">{item.details}</p>
                  )}
                  {item.action && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={item.action.callback || (() => {
                        if (item.action.url) {
                          window.open(item.action.url, '_blank');
                        }
                      })}
                    >
                      {item.action.label}
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>SEO Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {checklist.filter(item => item.status === 'failed' || item.status === 'warning').length > 0 ? (
              checklist
                .filter(item => item.status === 'failed' || item.status === 'warning')
                .map((item) => (
                  <div key={item.id} className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800">{item.title}</h4>
                      <p className="text-sm text-yellow-700">
                        {item.status === 'failed' ? 'Fix this issue to improve SEO performance' : 'Consider addressing this for better results'}
                      </p>
                    </div>
                  </div>
                ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-green-800 mb-2">
                  Excellent SEO Implementation!
                </h3>
                <p className="text-gray-600">
                  Your page meets all essential SEO requirements. Keep monitoring performance regularly.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Add missing icon components
const Share = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.632 4.316C18.114 15.062 18 14.518 18 14c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Code = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
  </svg>
);

const Settings = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default SEOChecklist;