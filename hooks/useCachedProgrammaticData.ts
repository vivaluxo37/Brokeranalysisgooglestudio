/**
 * React Hook for Cached Programmatic Data
 * Provides intelligent caching for programmatic directory pages
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Broker } from '../types';
import { useBrokers } from './useBrokers';
import { SEOPageConfig, getSEOPageConfigBySlug } from '../data/seoPageConfigs';
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

const toNumber = (value: unknown, fallback = 0): number => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
};

const ensureArray = <T>(value: T | T[] | null | undefined): T[] => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const getBrokerRegulators = (broker: Broker): string[] => {
  const fromSecurity = ensureArray(broker.security?.regulatedBy)
    .map(entry => entry?.regulator)
    .filter(Boolean) as string[];
  const fromLegacy = ensureArray(broker.regulation?.regulators).filter(Boolean) as string[];
  return Array.from(new Set([...fromSecurity, ...fromLegacy]));
};

const getBrokerPlatforms = (broker: Broker): string[] => {
  return ensureArray(broker.technology?.platforms).filter(Boolean) as string[];
};

const OFFSHORE_REGULATOR_KEYWORDS = [
  'seychelles',
  'belize',
  'svg',
  'st. vincent',
  'saint vincent',
  'grenadines',
  'vanuatu',
  'vfsc',
  'mauritius',
  'labuan',
  'bahamas',
  'bvi',
  'british virgin',
  'cayman',
  'marshall islands',
  'dominica',
  'curacao',
  'panama',
  'cook islands'
];

const OFFSHORE_HEADQUARTERS_KEYWORDS = [
  'seychelles',
  'belize',
  'vanuatu',
  'st. vincent',
  'saint vincent',
  'grenadines',
  'mauritius',
  'bahamas',
  'cayman',
  'bvi',
  'british virgin',
  'marshall islands',
  'dominica',
  'curacao',
  'panama'
];

const parseMaxLeverage = (value?: string | number | null): number => {
  if (typeof value === 'number') {
    return value;
  }
  if (!value) {
    return 0;
  }

  const text = String(value).toLowerCase();
  if (text.includes('unlimited') || text.includes('no limit')) {
    return 10000;
  }
  const match = text.match(/1\s*[:\/\-]\s*(\d{1,5})/);
  if (match) {
    return parseInt(match[1], 10) || 0;
  }

  const numeric = parseInt(text.replace(/[^0-9]/g, ''), 10);
  return Number.isFinite(numeric) ? numeric : 0;
};

const isOffshoreBroker = (broker: Broker): boolean => {
  const regulators = getBrokerRegulators(broker).map(reg => reg.toLowerCase());
  const headquarters = (broker.headquarters || '').toLowerCase();

  const hasOffshoreRegulator = regulators.some(reg =>
    OFFSHORE_REGULATOR_KEYWORDS.some(keyword => reg.includes(keyword))
  );

  const hasOffshoreHeadquarters = OFFSHORE_HEADQUARTERS_KEYWORDS.some(keyword =>
    headquarters.includes(keyword)
  );

  const maxLeverageValue = parseMaxLeverage(broker.tradingConditions?.maxLeverage);
  const offersHighLeverage = maxLeverageValue >= 400;

  return hasOffshoreRegulator || hasOffshoreHeadquarters || offersHighLeverage;
};

const getBrokerScore = (broker: Broker): number => {
  if (typeof broker.score !== 'undefined') {
    const score = toNumber(broker.score);
    if (score) return score;
  }
  const fallback = broker.ratings?.regulation ?? broker.ratings?.platforms ?? broker.ratings?.costs;
  return toNumber(fallback, 0);
};

const getBrokerMinDeposit = (broker: Broker): number => {
  const deposits: number[] = [];

  if (typeof broker.accessibility?.minDeposit !== 'undefined') {
    deposits.push(toNumber(broker.accessibility.minDeposit));
  }

  if (Array.isArray(broker.accountTypes)) {
    broker.accountTypes.forEach(account => {
      if (typeof account?.minDeposit !== 'undefined') {
        deposits.push(toNumber(account.minDeposit));
      }
    });
  }

  const numericDeposits = deposits.filter(value => Number.isFinite(value));
  if (!numericDeposits.length) {
    return 0;
  }

  return Math.min(...numericDeposits);
};

const getBrokerSpread = (broker: Broker): number => {
  const spread = broker.tradingConditions?.spreads?.eurusd;
  return toNumber(spread, 0);
};

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

  const normalizedSlug = useMemo(() => {
    if (!slug) return '';
    return slug.split('?')[0].replace(/\/+$/, '').toLowerCase();
  }, [slug]);

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
    const normalizedPageSlug = pageSlug
      ? pageSlug.split('?')[0].replace(/\/+$/, '').toLowerCase()
      : '';

    try {
      // Get configuration based on page type
      if (pageType === 'category' || pageType === 'seo') {
        config = getSEOPageConfigBySlug(normalizedPageSlug);
      } else if (pageType === 'country') {
        config = getCountryBySlug(normalizedPageSlug);
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
        const brokerRegulators = getBrokerRegulators(broker);
        const hasRequiredRegulator = filters.regulators.some((regulator: string) =>
          brokerRegulators.includes(regulator)
        );
        if (!hasRequiredRegulator) return false;
      }

      // Platform filter
      if (filters.platforms?.length > 0) {
        const brokerPlatforms = getBrokerPlatforms(broker).map(platform => platform.toLowerCase());
        const hasRequiredPlatform = filters.platforms.some((platform: string) =>
          brokerPlatforms.includes(platform.toLowerCase())
        );
        if (!hasRequiredPlatform) return false;
      }

      // Deposit filters
      const brokerMinDeposit = getBrokerMinDeposit(broker);
      if (typeof filters.minDeposit !== 'undefined' && brokerMinDeposit < filters.minDeposit) {
        return false;
      }
      if (typeof filters.maxDeposit !== 'undefined' && brokerMinDeposit > filters.maxDeposit) {
        return false;
      }

      // Features filter
      if (filters.features?.length > 0) {
        const hasRequiredFeatures = filters.features.every((feature: string) => {
          switch (feature.toLowerCase()) {
            case 'copytrading':
              return Boolean(broker.copyTrading || broker.platformFeatures?.copyTrading?.available);
            case 'islamic':
              return Boolean(broker.isIslamic || broker.accountManagement?.islamicAccount?.available);
            case 'scalping': {
              const executionType = broker.technology?.executionType?.toLowerCase() || '';
              const spreads = getBrokerSpread(broker);
              return executionType.includes('ecn') || spreads < 1.0;
            }
            case 'offshore':
              return isOffshoreBroker(broker);
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
      const brokerRegulators = getBrokerRegulators(broker);
      const hasCompatibleRegulation = brokerRegulators.some(reg => 
        countryRegulators.includes(reg) || isGloballyAccepted(reg)
      );

      if (!hasCompatibleRegulation) {
        return false;
      }

      // Check if broker excludes this country
      if (broker.restrictions?.excludedCountries?.includes(country.code)) {
        return false;
      }

      return true;
    });
  };

  /**
   * Apply user filters
   */
  const applyUserFilters = (brokers: Broker[], filters: Record<string, any>): Broker[] => {
    return brokers.filter(broker => {
      const brokerMinDeposit = getBrokerMinDeposit(broker);
      if (filters.minDeposit > 0 && brokerMinDeposit < filters.minDeposit) {
        return false;
      }
      
      if (filters.regulation && filters.regulation !== 'all') {
        if (filters.regulation === 'regulated') {
          return getBrokerRegulators(broker).length > 0;
        }
        const brokerRegulators = getBrokerRegulators(broker).map(reg => reg.toLowerCase());
        return brokerRegulators.includes(filters.regulation.toLowerCase());
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
        case 'minDeposit':
          return getBrokerMinDeposit(a) - getBrokerMinDeposit(b);
        case 'spreads':
          return getBrokerSpread(a) - getBrokerSpread(b);
        case 'name':
          return a.name.localeCompare(b.name);
        case 'score':
        default:
          return getBrokerScore(b) - getBrokerScore(a);
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

    const ratingValues = brokers.map(getBrokerScore).filter(value => Number.isFinite(value) && value > 0);
    const avgRating = ratingValues.length
      ? ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length
      : 0;

    const depositValues = brokers.map(getBrokerMinDeposit).filter(value => Number.isFinite(value) && value >= 0);
    const minDeposit = depositValues.length ? Math.min(...depositValues) : 0;

    const spreadValues = brokers.map(getBrokerSpread).filter(value => Number.isFinite(value) && value >= 0);
    const avgSpread = spreadValues.length
      ? spreadValues.reduce((sum, spread) => sum + spread, 0) / spreadValues.length
      : 0;

    const allRegulators = brokers.flatMap(getBrokerRegulators);
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
          "description": `${broker.name} forex broker${getBrokerRegulators(broker).length ? ` with ${getBrokerRegulators(broker).join(', ')} regulation` : ''}`
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
    if (!enabled || brokersLoading || !allBrokers.length || !normalizedSlug) return;

    setLoading(true);
    setError(null);

    // Start performance tracking
    const pageKey = `${type}:${normalizedSlug}`;
    const loadStartTime = Date.now();
    // Call method safely to avoid runtime errors using optional chaining
    try {
      performanceMonitoring?.startPageLoad?.(pageKey);
    } catch (e) {
      console.warn('Failed to call startPageLoad:', e);
    }

    try {
      // Try cache first
      let cachedData: ProgrammaticPageData | null = null;
      
      if (!forceRefresh) {
        const cacheStartTime = Date.now();
        cachedData = await programmaticCache.get(type, normalizedSlug, filters);
        const cacheTime = Date.now() - cacheStartTime;
        
        // Track cache performance
        // Call method safely using optional chaining
        try {
          performanceMonitoring?.trackCacheAccess?.(
            pageKey,
            cachedData !== null,
            cacheTime
          );
        } catch (e) {
          console.warn('Failed to call trackCacheAccess:', e);
        }
      }

      if (cachedData) {
        setData(cachedData);
        setIsFromCache(true);
        setLoading(false);
        
        // Track successful cache hit
        // Call method safely using optional chaining
        try {
          performanceMonitoring?.endPageLoad?.(pageKey, {
            loadTime: Date.now() - loadStartTime,
            cacheHit: true,
            brokerCount: cachedData.brokers.length,
            filters: Object.keys(filters).length
          });
        } catch (e) {
          console.warn('Failed to call endPageLoad:', e);
        }
        return;
      }

      // Generate new data
      const generationStartTime = Date.now();
      const newData = await generatePageData(type, normalizedSlug, filters);
      const generationTime = Date.now() - generationStartTime;
      
      if (newData) {
        // Cache the data
        await programmaticCache.set(type, normalizedSlug, newData, {
          filters,
          dependencies: [`brokers:all`],
          version: '1.0'
        });

        setData(newData);
        setIsFromCache(false);
        
        // Track successful generation
        // Call method safely using optional chaining
        try {
          performanceMonitoring?.endPageLoad?.(pageKey, {
            loadTime: Date.now() - loadStartTime,
            cacheHit: false,
            brokerCount: newData.brokers.length,
            filters: Object.keys(filters).length,
            generationTime
          });
        } catch (e) {
          console.warn('Failed to call endPageLoad:', e);
        }
      } else {
        throw new Error('Failed to generate page data');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.error('Error loading programmatic data:', err);
      
      // Track error
      // Call method safely using optional chaining
      try {
        performanceMonitoring?.trackError?.(pageKey, errorMessage);
      } catch (e) {
        console.warn('Failed to call trackError:', e);
      }
    } finally {
      setLoading(false);
    }
  // Minimize dependencies - only essential ones that should trigger reload
  // Use stringified filters to avoid object reference changes
  // generatePageData is stable as it's created with useCallback
  }, [type, normalizedSlug, JSON.stringify(filters), generatePageData, enabled, brokersLoading, allBrokers.length]);

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
    if (preloadRelated && data?.config && normalizedSlug) {
      // Preload related pages based on current page type
      const relatedPages = getRelatedPages(type, normalizedSlug);
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
              try {
                performanceMonitoring?.trackPreload?.(pageKey, {
                  generationTime,
                  brokerCount: generatedData.brokers.length
                });
              } catch (e) {
                console.warn('Failed to call trackPreload:', e);
              }
            }
          }
        } catch (error) {
          console.warn(`Failed to preload ${page.type}/${page.slug}:`, error);
          try {
            performanceMonitoring?.trackError?.(pageKey, 'Preload failed');
          } catch (e) {
            console.warn('Failed to call trackError:', e);
          }
        }
      }
      
      const totalPreloadTime = Date.now() - preloadStartTime;
      try {
        performanceMonitoring?.trackBatchPreload?.({
          pageCount: relatedPages.length,
          totalTime: totalPreloadTime,
          currentPage: `${type}:${slug}`
        });
      } catch (e) {
        console.warn('Failed to call trackBatchPreload:', e);
      }
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
    if (enabled && !brokersLoading && allBrokers.length > 0 && normalizedSlug) {
      loadData();
    }
  }, [enabled, brokersLoading, normalizedSlug, allBrokers.length, loadData]);

  // Handle broker data errors
  useEffect(() => {
    if (brokersError) {
      setError(`Failed to load brokers: ${brokersError}`);
    }
  }, [brokersError]);

  // Performance stats
  const performanceStats = useMemo(() => {
    const pageKey = `${type}:${normalizedSlug}`;
    let pageStats = null;
    let realtimeStats = null;
    
    try {
      pageStats = performanceMonitoring?.getPageStats?.(pageKey);
    } catch (e) {
      console.warn('Failed to call getPageStats:', e);
    }
    
    try {
      realtimeStats = performanceMonitoring?.getRealtimeStats?.();
    } catch (e) {
      console.warn('Failed to call getRealtimeStats:', e);
    }
    
    return {
      avgLoadTime: pageStats?.avgLoadTime || 0,
      recentLoadTime: realtimeStats.recentPages.find(p => 
        p.type === type && p.slug === normalizedSlug
      )?.loadTime || 0,
      systemHealth: realtimeStats.systemHealth
    };
  }, [type, normalizedSlug, data]);

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