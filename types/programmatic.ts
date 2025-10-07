/**
 * Programmatic SEO Types
 * 
 * This file contains all TypeScript types and interfaces for the
 * programmatic SEO system.
 */

export type PageType = 'category' | 'country' | 'category-country' | 'strategy' | 'feature' | 'broker' | 'home';

export interface PageDetectionResult {
  type: PageType;
  params: Record<string, string | number>;
  slug: string;
  template: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

export interface BrokerFilter {
  category?: string;
  country?: string;
  features?: string[];
  regulation?: string[];
  minDeposit?: number;
  maxLeverage?: number;
}

export interface PageData {
  title: string;
  description: string;
  content: string;
  meta: {
    keywords: string[];
    structuredData: Record<string, any>;
    canonical: string;
    robots: string;
  };
  brokers: any[];
  faqs?: Array<{ question: string; answer: string }>;
  comparison?: Array<{ feature: string; value: string }>;
  breadcrumbs: Array<{ label: string; href?: string }>;
  relatedPages: Array<{ title: string; href: string }>;
  analytics: {
    pageType: string;
    category?: string;
    country?: string;
    generatedAt: string;
    contentQuality: number;
  };
}

export interface Country {
  id: number;
  code: string;
  name: string;
  region: string;
  currency: string;
  languages: string[];
  regulatoryAuthority: string;
  tradingPopularity: number;
  metaTitle?: string;
  metaDescription?: string;
  content?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgrammaticPage {
  id: number;
  pageType: PageType;
  categoryId?: number;
  countryCode?: string;
  slug: string;
  title: string;
  metaDescription: string;
  metaKeywords: string[];
  content: Record<string, any>;
  structuredData: Record<string, any>;
  status: 'pending' | 'generating' | 'completed' | 'failed';
  qualityScore: number;
  lastGenerated?: Date;
  nextUpdate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentCache {
  id: number;
  cacheKey: string;
  contentType: string;
  content: Record<string, any>;
  source: 'ai_generated' | 'manual' | 'imported';
  qualityScore: number;
  usageCount: number;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface PageAnalytics {
  id: number;
  pageId: number;
  date: Date;
  views: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgTimeOnPage: number;
  conversionRate: number;
  createdAt: Date;
}

export interface ContentGenerationRequest {
  type: 'page_content' | 'meta_description' | 'article' | 'comparison' | 'faq';
  context: {
    pageType: string;
    category?: string;
    country?: string;
    broker?: string;
    strategy?: string;
    feature?: string;
    keywords?: string[];
    targetAudience?: string;
    tone?: 'professional' | 'friendly' | 'technical' | 'promotional' | 'educational' | 'analytical';
    length?: 'short' | 'medium' | 'long';
    region?: string;
    topic?: string;
  };
  options?: {
    includeStructuredData?: boolean;
    includeFAQs?: boolean;
    includeComparison?: boolean;
    maxTokens?: number;
    temperature?: number;
    length?: 'short' | 'medium' | 'long';
  };
}

export interface ContentGenerationResult {
  content: string;
  structuredData?: Record<string, any>;
  faqs?: Array<{ question: string; answer: string }>;
  comparison?: Array<{ feature: string; value: string }>;
  metadata: {
    wordCount: number;
    readingTime: number;
    qualityScore: number;
    generatedAt: string;
    model: string;
  };
}

export interface ContentTemplate {
  id: string;
  name: string;
  type: ContentGenerationRequest['type'];
  prompt: string;
  variables: string[];
  examples?: Array<{
    input: Record<string, any>;
    output: string;
  }>;
}

export interface CacheEntry<T = any> {
  key: string;
  content: T;
  metadata: {
    createdAt: Date;
    expiresAt: Date;
    accessCount: number;
    lastAccessed: Date;
    size: number;
    tags: string[];
  };
}

export interface CacheOptions {
  ttl?: number;
  tags?: string[];
  maxSize?: number;
  priority?: 'low' | 'medium' | 'high';
}

export interface CacheStats {
  totalEntries: number;
  hitRate: number;
  missRate: number;
  totalHits: number;
  totalMisses: number;
  memoryUsage: number;
  oldestEntry: Date | null;
  newestEntry: Date | null;
}

export interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
  keyGenerator?: (identifier: string) => string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: Date;
  retryAfter?: number;
}

export interface BrokerData {
  id: number;
  name: string;
  slug: string;
  yearFounded: number;
  headquarters: string;
  regulation: string[];
  platforms: string[];
  instruments: string[];
  minDeposit: number;
  maxLeverage: number;
  supportedCountries?: string[];
  countrySpecificRegulations?: Record<string, any>;
  localFeatures?: Record<string, any>;
  contentPriority?: number;
  lastContentUpdate?: Date;
  contentGenerated?: boolean;
  contentQualityScore?: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  metaTitle?: string;
  metaDescription?: string;
  content?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Strategy {
  id: number;
  name: string;
  slug: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  timeframes: string[];
  instruments: string[];
  content?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Feature {
  id: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  content?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SEOAuditResult {
  pageId: number;
  pageType: PageType;
  score: number;
  issues: Array<{
    type: 'error' | 'warning' | 'info';
    category: 'technical' | 'content' | 'performance';
    message: string;
    recommendation?: string;
  }>;
  recommendations: Array<{
    priority: 'high' | 'medium' | 'low';
    action: string;
    impact: string;
    effort: string;
  }>;
  auditedAt: Date;
}

export interface ProgrammaticSEOConfig {
  enabled: boolean;
  aiContentGeneration: {
    enabled: boolean;
    apiKey?: string;
    model: string;
    temperature: number;
    maxTokens: number;
  };
  caching: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
  rateLimiting: {
    enabled: boolean;
    requestsPerMinute: number;
    requestsPerHour: number;
  };
  analytics: {
    enabled: boolean;
    trackingId?: string;
  };
  seo: {
    autoGenerateMeta: boolean;
    includeStructuredData: boolean;
    generateFAQs: boolean;
  };
}