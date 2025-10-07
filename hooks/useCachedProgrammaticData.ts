/**
 * React Hook for Cached Programmatic Data
 * Provides intelligent caching for programmatic directory pages
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Broker } from '../types';
import { useBrokers } from './useBrokers';
import { allSEOPageConfigs, SEOPageConfig, generatePageContent } from '../data/seoPageConfigs';
import { getCountryBySlug, CountryConfig } from '../lib/constants/countries';
import { programmaticCache, ProgrammaticPageData } from '../services/programmaticCache';
import { performanceMonitoring } from '../services/performanceMonitoring';

export interface CachedProgrammaticResult {
  data: ProgrammaticPageData | null;
  loading: boolean;
  error: string | null;
  isFromCache: boolean;
  cacheStats: {
    hitRate: number;
    totalEntries: number;
  };
  performanceStats: {
    avgLoadTime: number;
    recentLoadTime: number;
    systemHealth: 'good' | 'warning' | 'critical';
  };
  refresh: () => Promise<void>;
  preload: () => Promise<void>;
}

interface UseCachedProgrammaticDataOptions {
  type: 'category' | 'country' | 'seo';
  slug: string;
  filters?: Record<string, any>;
  enabled?: boolean;
  preloadRelated?: boolean;
}

export function useCachedProgrammaticData({
  type,
  slug,
  filters = {},
  enabled = true,
  preloadRelated = false
}: UseCachedProgrammaticDataOptions): CachedProgrammaticResult {
  const [data, setData] = useState<ProgrammaticPageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const { brokers: allBrokers, loading: brokersLoading, error: brokersError } = useBrokers();

  /**
   * Generate page data from brokers and configuration
   */
  const generatePageData = useCallback(async (
    pageType: 'category' | 'country' | 'seo',
    pageSlug: string,
    userFilters: Record<string, any> = {}
  ): Promise<ProgrammaticPageData | null> => {
    if (!allBrokers.length) return null;

    let config: SEOPageConfig | CountryConfig | null = null;
    let filteredBrokers: Broker[] = [];

    try {
      // Get configuration based on page type
      if (pageType === 'category') {
        config = allSEOPageConfigs.find(page => {
          const pathSegment = page.path.split('/').pop();
          return pathSegment === pageSlug;
        }) || null;
      } else if (pageType === 'country') {
        config = getCountryBySlug(pageSlug);
      } else if (pageType === 'seo') {
        config = allSEOPageConfigs.find(page => {
          const pathSegment = page.path.split('/').pop();
          return pathSegment === pageSlug;
        }) || null;
      }

      if (!config) {
        throw new Error(`Configuration not found for ${pageType}: ${pageSlug}`);
      }

      // Filter brokers based on configuration and user filters
      filteredBrokers = await filterBrokers(allBrokers, config, userFilters, pageType);

      // Generate metadata
      const metadata = generatePageMetadata(filteredBrokers);

      // Generate SEO data
      const seoData = generateSEOData(config, filteredBrokers, pageType);

      return {
        brokers: filteredBrokers,
        config,
        metadata,
        seo: seoData
      };

    } catch (err) {
      console.error(`Error generating ${pageType} data for ${pageSlug}:`, err);
      throw err;
    }
  }, [allBrokers]);

  /**
   * Filter brokers based on configuration
   */
  const filterBrokers = async (
    brokers: Broker[],
    config: SEOPageConfig | CountryConfig,
    userFilters: Record<string, any>,
    pageType: string
  ): Promise<Broker[]> => {
    let filtered = [...brokers];

    // Apply configuration-based filtering
    if ('filters' in config && config.filters) {
      filtered = applyConfigFilters(filtered, config.filters);
    }

    // Apply country-specific filtering
    if (pageType === 'country' && 'code' in config) {
      filtered = applyCountryFilters(filtered, config);
    }

    // Apply user filters
    filtered = applyUserFilters(filtered, userFilters);

    // Sort brokers
    return sortBrokers(filtered, userFilters.sortBy || 'score');
  };

  /**
   * Apply configuration filters to brokers
   */
  const applyConfigFilters = (brokers: Broker[], filters: any): Broker[] => {
    return brokers.filter(broker => {
      // Regulatory filter
      if (filters.regulators?.length > 0) {
        const hasRequiredRegulator = filters.regulators.some((regulator: string) =>
          broker.regulation.regulators.includes(regulator)
        );
        if (!hasRequiredRegulator) return false;
      }

      // Platform filter
      if (filters.platforms?.length > 0) {
        const hasRequiredPlatform = filters.platforms.some((platform: string) =>
          broker.technology.platforms.includes(platform)
        );
        if (!hasRequiredPlatform) return false;
      }

      // Deposit filters
      if (filters.minDeposit !== undefined) {
        if (broker.accessibility.minDeposit < filters.minDeposit) return false;
      }
      if (filters.maxDeposit !== undefined) {
        if (broker.accessibility.minDeposit > filters.maxDeposit) return false;
      }

      // Features filter
      if (filters.features?.length > 0) {
        const hasRequiredFeatures = filters.features.every((feature: string) => {
          switch (feature.toLowerCase()) {
            case 'copytrading':
              return broker.copyTrading || broker.platformFeatures?.copyTrading?.available;
            case 'islamic':
              return broker.isIslamic || broker.accountManagement?.islamicAccount?.available;
            case 'scalping':
              return broker.technology.executionType.includes('ECN') ||
                     broker.tradingConditions.spreads.eurusd < 1.0;
            default:
              return true;
          }
        });
        if (!hasRequiredFeatures) return false;
      }

      return true;
    });
  };

  /**
   * Apply country-specific filters
   */
  const applyCountryFilters = (brokers: Broker[], country: CountryConfig): Broker[] => {
    return brokers.filter(broker => {
      // Check regulatory compatibility
      const countryRegulators = getCountryRegulators(country.code);
      const hasCompatibleRegulation = broker.regulation.regulators.some(reg => 
        countryRegulators.includes(reg) || isGloballyAccepted(reg)
      );

      // Check if broker excludes this country
      if (broker.restrictions?.excludedCountries?.includes(country.code)) {
        return false;
      }

      return hasCompatibleRegulation;
    });
  };

  /**
   * Apply user filters
   */
  const applyUserFilters = (brokers: Broker[], filters: Record<string, any>): Broker[] => {
    return brokers.filter(broker => {
      if (filters.minDeposit > 0 && broker.accessibility.minDeposit < filters.minDeposit) {
        return false;
      }
      
      if (filters.regulation && filters.regulation !== 'all') {
        if (filters.regulation === 'regulated' && !broker.regulation.regulators.length) {
          return false;
        }
      }

      return true;
    });
  };

  /**
   * Sort brokers by specified criteria
   */
  const sortBrokers = (brokers: Broker[], sortBy: string): Broker[] => {
    return [...brokers].sort((a, b) => {
      switch (sortBy) {
        case 'score':
          return (b.score || 0) - (a.score || 0);
        case 'minDeposit':
          return a.accessibility.minDeposit - b.accessibility.minDeposit;
        case 'spreads':
          return a.tradingConditions.spreads.eurusd - b.tradingConditions.spreads.eurusd;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  };

  /**
   * Generate page metadata
   */
  const generatePageMetadata = (brokers: Broker[]) => {
    if (!brokers.length) {
      return {
        totalCount: 0,
        avgRating: 0,
        minDeposit: 0,
        avgSpread: 0,
        topRegulators: [],
        lastUpdated: Date.now()
      };
    }

    const avgRating = brokers.reduce((sum, b) => sum + (b.score || 0), 0) / brokers.length;
    const minDeposit = Math.min(...brokers.map(b => b.accessibility.minDeposit));
    const avgSpread = brokers.reduce((sum, b) => sum + b.tradingConditions.spreads.eurusd, 0) / brokers.length;
    const allRegulators = brokers.flatMap(b => b.regulation.regulators);
    const regulatorCounts = allRegulators.reduce((acc, reg) => {
      acc[reg] = (acc[reg] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    const topRegulators = Object.entries(regulatorCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([reg]) => reg);

    return {
      totalCount: brokers.length,
      avgRating: Math.round(avgRating * 10) / 10,
      minDeposit,
      avgSpread: Math.round(avgSpread * 10) / 10,
      topRegulators,
      lastUpdated: Date.now()
    };
  };

  /**
   * Generate SEO data
   */
  const generateSEOData = (
    config: SEOPageConfig | CountryConfig,
    brokers: Broker[],
    pageType: string
  ) => {
    const title = 'title' in config ? config.title : 
                  'seoTitle' in config ? config.seoTitle : 
                  `Best Forex Brokers - ${config.name}`;

    const description = 'description' in config ? config.description :
                       'metaDescription' in config ? config.metaDescription :
                       `Compare the best forex brokers. Find regulated platforms with competitive spreads.`;

    const keywords = 'keywords' in config ? config.keywords :
                    'highlights' in config ? config.highlights : [];

    // Generate structured data
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": title,
      "description": description,
      "numberOfItems": brokers.length,
      "itemListElement": brokers.slice(0, 10).map((broker, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "FinancialProduct",
          "name": broker.name,
          "url": `https://brokeranalysis.com/broker/${broker.id}`,
          "description": `${broker.name} forex broker with ${broker.regulation.regulators.join(', ')} regulation`
        }
      }))
    };

    return {
      title,
      description,
      keywords: Array.isArray(keywords) ? keywords : [],
      structuredData
    };
  };

  // Helper functions
  const getCountryRegulators = (countryCode: string): string[] => {
    const regulatorMap: Record<string, string[]> = {
      'US': ['NFA', 'CFTC'],
      'GB': ['FCA'],
      'AU': ['ASIC'],
      'DE': ['BaFin'],
      'CY': ['CySEC']
    };
    return regulatorMap[countryCode] || [];
  };

  const isGloballyAccepted = (regulator: string): boolean => {
    const globalRegulators = ['FCA', 'ASIC', 'CySEC', 'NFA', 'BaFin', 'FINMA'];
    return globalRegulators.includes(regulator);
  };

  /**
   * Load data with caching
   */
  const loadData = useCallback(async (forceRefresh: boolean = false) => {
    if (!enabled || brokersLoading || !allBrokers.length) return;

    setLoading(true);
    setError(null);

    // Start performance tracking
    const pageKey = `${type}:${slug}`;
    const loadStartTime = Date.now();
    performanceMonitoring.startPageLoad(pageKey);

    try {
      // Try cache first
      let cachedData: ProgrammaticPageData | null = null;
      
      if (!forceRefresh) {
        const cacheStartTime = Date.now();
        cachedData = await programmaticCache.get(type, slug, filters);
        const cacheTime = Date.now() - cacheStartTime;
        
        // Track cache performance
        performanceMonitoring.trackCacheAccess(
          pageKey,
          cachedData !== null,
          cacheTime
        );
      }

      if (cachedData) {
        setData(cachedData);
        setIsFromCache(true);
        setLoading(false);
        
        // Track successful cache hit
        performanceMonitoring.endPageLoad(pageKey, {
          loadTime: Date.now() - loadStartTime,
          cacheHit: true,
          brokerCount: cachedData.brokers.length,
          filters: Object.keys(filters).length
        });
        return;
      }

      // Generate new data
      const generationStartTime = Date.now();
      const newData = await generatePageData(type, slug, filters);
      const generationTime = Date.now() - generationStartTime;
      
      if (newData) {
        // Cache the data
        await programmaticCache.set(type, slug, newData, {
          filters,
          dependencies: [`brokers:all`],
          version: '1.0'
        });

        setData(newData);
        setIsFromCache(false);
        
        // Track successful generation
        performanceMonitoring.endPageLoad(pageKey, {
          loadTime: Date.now() - loadStartTime,
          cacheHit: false,
          brokerCount: newData.brokers.length,
          filters: Object.keys(filters).length,
          generationTime
        });
      } else {
        throw new Error('Failed to generate page data');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error('Error loading programmatic data:', err);
      
      // Track error
      performanceMonitoring.trackError(pageKey, errorMessage);
    } finally {
      setLoading(false);
    }
  }, [enabled, brokersLoading, allBrokers, type, slug, filters, generatePageData]);

  /**
   * Refresh data (bypass cache)
   */
  const refresh = useCallback(async () => {
    await loadData(true);
  }, [loadData]);

  /**
   * Preload related pages
   */
  const preload = useCallback(async () => {
    if (preloadRelated && data?.config) {
      // Preload related pages based on current page type
      const relatedPages = getRelatedPages(type, slug);
      const preloadStartTime = Date.now();
      
      for (const page of relatedPages) {
        const pageKey = `${page.type}:${page.slug}`;
        
        try {
          const existingCache = await programmaticCache.get(page.type, page.slug);
          if (!existingCache) {
            const generationStart = Date.now();
            const generatedData = await generatePageData(page.type, page.slug);
            const generationTime = Date.now() - generationStart;
            
            if (generatedData) {
              // Cache the preloaded data
              await programmaticCache.set(page.type, page.slug, generatedData, {
                dependencies: [`brokers:all`],
                version: '1.0'
              });
              
              // Track preload performance
              performanceMonitoring.trackPreload(pageKey, {
                generationTime,
                brokerCount: generatedData.brokers.length
              });
            }
          }
        } catch (error) {
          console.warn(`Failed to preload ${page.type}/${page.slug}:`, error);
          performanceMonitoring.trackError(pageKey, 'Preload failed');
        }
      }
      
      const totalPreloadTime = Date.now() - preloadStartTime;
      performanceMonitoring.trackBatchPreload({
        pageCount: relatedPages.length,
        totalTime: totalPreloadTime,
        currentPage: `${type}:${slug}`
      });
    }
  }, [preloadRelated, data?.config, type, slug, generatePageData]);

  /**
   * Get related pages for preloading
   */
  const getRelatedPages = (pageType: string, pageSlug: string) => {
    // Return related pages based on current page
    const related: Array<{ type: 'category' | 'country' | 'seo'; slug: string }> = [];
    
    if (pageType === 'category') {
      // Add related SEO pages
      related.push({ type: 'seo', slug: pageSlug });
    }
    
    return related.slice(0, 3); // Limit preloading
  };

  // Cache stats
  const cacheStats = useMemo(() => {
    const stats = programmaticCache.getStats();
    return {
      hitRate: stats.hitRate,
      totalEntries: stats.totalEntries
    };
  }, [data]);

  // Load data on mount and when dependencies change
  useEffect(() => {
    if (enabled && !brokersLoading && allBrokers.length > 0) {
      loadData();
    }
  }, [loadData, enabled, brokersLoading, allBrokers.length]);

  // Handle broker data errors
  useEffect(() => {
    if (brokersError) {
      setError(`Failed to load brokers: ${brokersError}`);
    }
  }, [brokersError]);

  // Performance stats
  const performanceStats = useMemo(() => {
    const pageKey = `${type}:${slug}`;
    const pageStats = performanceMonitoring.getPageStats(pageKey);
    const realtimeStats = performanceMonitoring.getRealtimeStats();
    
    return {
      avgLoadTime: pageStats?.avgLoadTime || 0,
      recentLoadTime: realtimeStats.recentPages.find(p => 
        p.type === type && p.slug === slug
      )?.loadTime || 0,
      systemHealth: realtimeStats.systemHealth
    };
  }, [type, slug, data]);

  return {
    data,
    loading: loading || brokersLoading,
    error,
    isFromCache,
    cacheStats,
    performanceStats,
    refresh,
    preload
  };
}