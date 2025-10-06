import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useBrokers } from '../hooks/useBrokers';
import { useOptimizedBrokers } from '../hooks/useOptimizedBrokers';
import { useApiData } from '../hooks/useApiData';
import BrokerCard from '../components/brokers/BrokerCard';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { getAIRecommendation } from '../services/geminiService';
import { AIRecommendation, Broker } from '../types';
import Icon from '../components/ui/Icon';
import Spinner from '../components/ui/Spinner';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { useTranslation } from '../hooks/useTranslation';
import BrokerCardSkeleton from '../components/brokers/BrokerCardSkeleton';
import StarRating from '../components/ui/StarRating';
import Tag from '../components/ui/Tag';
import Tooltip from '../components/ui/Tooltip';
import { useComparison } from '../hooks/useComparison';
import { PerformanceOptimizer, usePerformanceOptimizer } from '../components/performance/PerformanceOptimizer';
import { OptimizedLazyImage } from '../components/performance/LazyImage';

// Mobile optimization imports
import {
  useMobileOptimization,
  useTouchGestures,
  useViewportManager,
  useMobilePerformance
} from '../lib/mobileOptimization';
import {
  useResponsiveDesign,
  useBreakpointManager,
  useResponsiveImage
} from '../lib/responsiveDesign';
import MobileNavigation from '../components/mobile/MobileNavigation';
import MobileBrokerCard from '../components/mobile/MobileBrokerCard';
import MobileSearch from '../components/mobile/MobileSearch';
import MobileFilters from '../components/mobile/MobileFilters';
// Progressive Enhancement imports
import {
  ProgressiveEnhancement,
  FeatureGuard,
  NetworkAware,
  DeviceAware,
  ProgressiveSearch
} from '../components/ui/ProgressiveEnhancement';
import {
  initializeProgressiveEnhancement,
  progressiveEnhancement
} from '../lib/progressiveEnhancement';
import {
  detectFeatures,
  detectNetworkCondition,
  assessDeviceCapability
} from '../lib/featureDetection';
import {
  BrokerCardSkeleton as NewBrokerCardSkeleton,
  TableSkeleton,
  FormSkeleton,
  CardSkeleton
} from '../components/ui/skeleton/SkeletonComponents';
import {
  LoadingOverlay,
  LoadingMessage,
  SkeletonWrapper,
  ProgressIndicator
} from '../components/ui/loading/LoadingIndicators';
import { useLoadingState, useAsyncLoading } from '../hooks/useLoadingState';
import { countries } from '../data/countries';
import { useAuth } from '../hooks/useAuth';
import BrokerQuickViewModal from '../components/brokers/BrokerQuickViewModal';
import { debounce } from '../lib/utils';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useSearchTracking, useCustomEventTracking, useBrokerInteractionTracking } from '../hooks/useAnalytics';

// Memory management imports
import {
  registerComponent,
  unregisterComponent,
  startMemoryMonitoring,
  stopMemoryMonitoring,
  trackMemoryUsage,
  getMemoryInfo
} from '../lib/memoryMonitor';
import {
  createObjectPool,
  createCleanupManager,
  createEfficientMap,
  createEfficientSet,
  createDebouncedFunction,
  createThrottledFunction
} from '../lib/resourceOptimizer';
import {
  trackComponentLifecycle,
  trackEventListener,
  trackTimer,
  trackSubscription
} from '../lib/memoryLeakDetector';

// Utility to parse leverage string like "1:500" into a number 500
const parseLeverage = (leverageStr: string): number => {
  if (!leverageStr || typeof leverageStr !== 'string') return 0;
  if (leverageStr.toLowerCase().includes('unlimited')) return Infinity;
  const num = parseInt(leverageStr.split(':')[1], 10);
  return isNaN(num) ? 0 : num;
};

// This will be populated from live broker data
let allRegulators: string[] = [];

const initialFilters = {
    searchTerm: '',
    minDeposit: 'any',
    maxLeverage: 'any',
    regulator: 'any',
    executionTypes: [] as string[],
    spread: 'any',
    commission: 'any',
    platforms: [] as string[],
    algoSupport: [] as string[],
    copyTrading: 'any',
    minLotSize: 'any',
    riskProfile: 'all', // New filter for risk
    socialTradingFeatures: [] as string[],
    country: 'any',
};

// New type for saved filters
interface SavedFilterSet {
    name: string;
    filters: typeof initialFilters;
}


type TradingStyle = 'Scalping' | 'Algorithmic' | 'Copy Trading' | 'Swing Trading' | 'News Trading' | 'Low Cost';
type FilterKeys = keyof typeof initialFilters;

const Accordion: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    return (
        <div className="border-b border-input last:border-b-0">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between items-center w-full py-3 text-left font-semibold text-card-foreground"
                aria-expanded={isOpen}
            >
                <span>{title}</span>
                <Icon name="chevronDown" className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                <div className="overflow-hidden">
                    <div className="pb-4 pt-2 space-y-3">{children}</div>
                </div>
            </div>
        </div>
    );
};

type SortableBrokerKeys = 'name' | 'score' | 'minDeposit';

const BrokerTable: React.FC<{ brokers: Broker[], t: (key: string) => string }> = ({ brokers, t }) => {
    const [sortConfig, setSortConfig] = useState<{ key: SortableBrokerKeys; direction: 'asc' | 'desc' }>({ key: 'score', direction: 'desc' });
    const { addBrokerToComparison, removeBrokerFromComparison, isBrokerInComparison } = useComparison();

    const sortedBrokers = useMemo(() => {
        let sortableItems = [...brokers];
        sortableItems.sort((a, b) => {
            let aValue: string | number, bValue: string | number;

            switch (sortConfig.key) {
                case 'minDeposit':
                    aValue = a.accessibility.minDeposit;
                    bValue = b.accessibility.minDeposit;
                    break;
                case 'score':
                    aValue = a.score;
                    bValue = b.score;
                    break;
                case 'name':
                default:
                    aValue = a.name;
                    bValue = b.name;
                    break;
            }

            if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
        return sortableItems;
    }, [brokers, sortConfig]);

    const requestSort = (key: SortableBrokerKeys) => {
        let direction: 'asc' | 'desc' = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const SortIcon: React.FC<{ direction?: 'asc' | 'desc' }> = ({ direction }) => {
      const commonProps: React.SVGProps<SVGSVGElement> = { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "inline-block ml-1" };
      if (direction === 'asc') return <svg {...commonProps}><path d="m18 15-6-6-6 6"/></svg>;
      if (direction === 'desc') return <svg {...commonProps}><path d="m6 9 6 6 6-6"/></svg>;
      return <svg {...commonProps} className={`${commonProps.className} opacity-30 group-hover:opacity-100`}><path d="M8 9l4-4 4 4"/><path d="M16 15l-4 4-4-4"/></svg>;
    };

    const SortableHeader: React.FC<{ children: React.ReactNode; sortKey: SortableBrokerKeys; className?: string }> = ({ children, sortKey, className = '' }) => (
      <th className={`p-4 ${className}`}>
        <button className="flex items-center group" onClick={() => requestSort(sortKey)}>
          <span className={sortConfig.key === sortKey ? 'text-primary-400' : ''}>{children}</span>
          <SortIcon direction={sortConfig.key === sortKey ? sortConfig.direction : undefined} />
        </button>
      </th>
    );

    return (
        <div className="overflow-x-auto bg-card rounded-lg border border-input animate-fade-in">
            <table className="w-full min-w-max text-left">
                <thead>
                    <tr className="border-b border-input">
                        <SortableHeader sortKey="name" className="sticky left-0 bg-card z-10">Broker</SortableHeader>
                        <SortableHeader sortKey="score">Score</SortableHeader>
                        <th className="p-4">Regulators</th>
                        <SortableHeader sortKey="minDeposit">Min. Deposit</SortableHeader>
                        <th className="p-4 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedBrokers.map(broker => {
                        const inCompare = isBrokerInComparison(broker.id);
                        return (
                            <tr key={`table-${broker.id}`} className="border-b border-input last:border-b-0 hover:bg-input/30 group">
                                <td className="p-4 sticky left-0 bg-card group-hover:bg-input/30 transition-colors z-10">
                                    <Link to={`/broker/${broker.id}`} className="flex items-center gap-3 group">
                                        <OptimizedLazyImage
                                          src={broker.logoUrl}
                                          alt={broker.name}
                                          className="h-10 bg-white p-1 rounded-md"
                                          width={40}
                                          height={40}
                                          loading="lazy"
                                          format="webp"
                                          quality={80}
                                          placeholder="blur"
                                        />
                                        <span className="font-semibold text-card-foreground group-hover:text-primary-400 transition-colors">{broker.name}</span>
                                    </Link>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-lg text-primary-400">{broker.score.toFixed(1)}</span>
                                        <StarRating score={broker.score} />
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="flex flex-wrap gap-1">
                                        {broker.regulation.regulators.slice(0, 2).map(reg => <Tag key={reg}>{reg}</Tag>)}
                                        {broker.regulation.regulators.length > 2 && <Tag>+{broker.regulation.regulators.length - 2}</Tag>}
                                    </div>
                                </td>
                                <td className="p-4 font-semibold">${broker.accessibility.minDeposit}</td>
                                <td className="p-4">
                                    <div className="flex justify-center items-center gap-2">
                                        <a href={broker.websiteUrl} target="_blank" rel="noopener noreferrer">
                                            <Button variant="primary" size="sm">Visit</Button>
                                        </a>
                                        <Tooltip content={inCompare ? 'Remove from comparison' : 'Add to comparison'}>
                                            <Button onClick={(e) => { e.stopPropagation(); inCompare ? removeBrokerFromComparison(broker.id) : addBrokerToComparison(broker.id) }} variant="secondary" size="sm" className="p-2">
                                                {inCompare ? <Icon name="compareRemove" size="sm" /> : <Icon name="compare" size="sm" />}
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};


const AllBrokersPage: React.FC = () => {
  // Component ID for memory tracking
  const componentId = useRef(`AllBrokersPage-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  
  // Memory management refs
  const cleanupManager = useRef(createCleanupManager());
  const memoryTracker = useRef<NodeJS.Timeout | null>(null);
  const isMounted = useRef(true);
  
  // Use efficient data structures
  const brokerCache = useRef(createEfficientMap<string, Broker>());
  const filterCache = useRef(createEfficientMap<string, Broker[]>());
  const subscriptionTracker = useRef(createEfficientSet<string>());
  
  // Performance optimization
  const {
    addCriticalResource,
    optimizeImages,
    addPerformanceObserver,
    log: performanceLog
  } = usePerformanceOptimizer({
    componentId: 'AllBrokersPage',
    enableLogging: process.env.NODE_ENV === 'development',
    coreWebVitalsConfig: {
      lcp: {
        target: 2000, // Slightly relaxed for content-heavy pages
        aggressive: true
      },
      fid: {
        target: 100,
        aggressive: true
      },
      cls: {
        target: 0.2, // Slightly relaxed for dynamic content
        aggressive: true
      },
      fcp: {
        target: 1500,
        aggressive: true
      },
      ttfb: {
        target: 600,
        aggressive: true
      }
    },
    performanceMetricsConfig: {
      ttfb: {
        target: 600,
        enableOptimization: true,
        enableCaching: true
      },
      fcp: {
        target: 1500,
        enableOptimization: true
      },
      budget: {
        enableTracking: true,
        enableOptimization: true,
        jsBudget: 250 * 1024, // 250KB
        cssBudget: 100 * 1024, // 100KB
        imageBudget: 500 * 1024, // 500KB
        fontBudget: 150 * 1024 // 150KB
      }
    }
  });
  
  // Progressive enhancement state
  const [enhancementLevel, setEnhancementLevel] = useState<'basic' | 'standard' | 'enhanced'>('standard');
  const [networkCondition, setNetworkCondition] = useState<any>('standard');
  const [deviceCapability, setDeviceCapability] = useState<any>('medium');
  const [features, setFeatures] = useState<any>({});
  
  const [filters, setFilters] = useState(initialFilters);
  const [aiRecommendation, setAiRecommendation] = useState<AIRecommendation | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const { t } = useTranslation();
  const [view, setView] = useState<'grid' | 'table'>('grid');
  const { user } = useAuth();
  const [savedFilters, setSavedFilters] = useState<SavedFilterSet[]>([]);
  const [selectedBroker, setSelectedBroker] = useState<Broker | null>(null);
  
  // Mobile optimization hooks
  const { isMobile, isTablet, orientation } = useMobileOptimization();
  const { addSwipeGesture, removeSwipeGesture } = useTouchGestures();
  const { viewportHeight, viewportWidth } = useViewportManager();
  const { optimizeImages: mobileOptimizeImages, enableHardwareAcceleration } = useMobilePerformance();
  
  // Responsive design hooks
  const { currentBreakpoint, isBreakpointActive } = useBreakpointManager();
  const { getResponsiveImage } = useResponsiveImage();
  
  // Mobile state
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeView, setActiveView] = useState<'grid' | 'list'>('grid');
  const [mobileSortOption, setMobileSortOption] = useState('score');
  
  // Analytics hooks
  const { trackSearch, trackSearchResults, trackSearchFilter } = useSearchTracking();
  const { trackEvent } = useCustomEventTracking();
  const { trackBrokerView, trackBrokerCompare } = useBrokerInteractionTracking();

  // Loading states for different sections
  const brokersListLoading = useLoadingState('brokers-list');
  const filtersLoading = useLoadingState('filters');
  const aiRecommendationLoading = useLoadingState('ai-recommendation');
  const searchLoading = useLoadingState('search');

  // Debounced functions to prevent excessive re-renders
  const debouncedTrackEvent = useRef(createDebouncedFunction((...args: any[]) => {
    if (isMounted.current) {
      trackEvent(...args);
    }
  }, 300));
  
  const throttledTrackMemory = useRef(createThrottledFunction(() => {
    if (isMounted.current) {
      trackMemoryUsage(componentId.current, 'AllBrokersPage');
    }
  }, 5000));

  // Async loading for AI recommendation with memory optimization
  const { execute: loadAIRecommendation, isLoading: isAILoading } = useAsyncLoading(
    async () => {
      if (!isMounted.current || filteredBrokers.length < 2) return;
      
      aiRecommendationLoading.start('Analyzing brokers with AI...');
      const result = await getAIRecommendation(filteredBrokers);
      
      if (isMounted.current) {
        setAiRecommendation(result);
      }
      aiRecommendationLoading.complete();
    },
    {
      onError: (error) => {
        if (isMounted.current) {
          setAiError(t('allBrokersPage.results.aiError'));
          aiRecommendationLoading.error('Failed to get AI recommendation');
        }
      }
    }
  );
  
  // Reference for the virtual scrolling container
  const parentRef = useRef<HTMLDivElement>(null);
  
  // Use optimized broker data with fallback to original hook
  const {
    brokers: allBrokers,
    loading: brokersLoading,
    error: brokersError,
    refetch,
    isUsingFallback
  } = useOptimizedBrokers();
  
  // Fetch additional data with API optimization
  const {
    data: countriesData,
    loading: countriesLoading,
    error: countriesError
  } = useApiData({
    url: '/api/countries',
    deduplicationKey: 'all-countries',
    immediate: true,
    cacheTTL: 30 * 60 * 1000, // 30 minutes
    fallbackData: countries
  });
  
  const {
    data: regulatorsData,
    loading: regulatorsLoading
  } = useApiData({
    url: '/api/regulators',
    deduplicationKey: 'all-regulators',
    immediate: true,
    cacheTTL: 60 * 60 * 1000, // 1 hour
    fallbackData: []
  });

  const handleOpenQuickView = useCallback((broker: Broker) => {
    if (!isMounted.current) return;
    
    setSelectedBroker(broker);
    
    // Track broker quick view with analytics
    trackBrokerView(broker.id, broker.name, {
      page: 'all_brokers',
      source: 'quick_view',
      position: 'broker_card'
    });
    
    debouncedTrackEvent.current('broker_quick_view', 'engagement', 'click', broker.name, undefined, {
      broker_id: broker.id,
      broker_name: broker.name,
      action: 'open_quick_view',
      page: 'all_brokers',
      section: 'broker_grid'
    });
  }, [trackBrokerView]);

  const handleCloseQuickView = useCallback(() => {
    if (isMounted.current) {
      setSelectedBroker(null);
    }
  }, []);


  // Update allRegulators when brokers data is loaded
  useMemo(() => {
    if (allBrokers.length > 0) {
      allRegulators = [...new Set(allBrokers.flatMap(b => b.regulation?.regulators || []))].sort();
    }
  }, [allBrokers]);
  
  // Combine regulators from API with broker data
  const availableRegulators = useMemo(() => {
    const brokerRegulators = allRegulators;
    const apiRegulators = regulatorsData || [];
    const combined = [...new Set([...brokerRegulators, ...apiRegulators])].sort();
    return combined;
  }, [allBrokers, regulatorsData]);

  // Component lifecycle tracking
  useEffect(() => {
    // Register component for memory monitoring
    registerComponent(componentId.current);
    trackComponentLifecycle(componentId.current, 'AllBrokersPage', 'mount');
    
    // Start memory monitoring
    startMemoryMonitoring();
    
    // Set up periodic memory tracking
    memoryTracker.current = setInterval(() => {
      if (isMounted.current) {
        throttledTrackMemory.current();
      }
    }, 10000); // Track every 10 seconds
    
    // Mark critical resources for performance optimization
    addCriticalResource({
      type: 'script',
      url: '/api/brokers',
      priority: 'high',
      preload: true
    });
    
    // Optimize images for better LCP
    mobileOptimizeImages({
      selector: '.broker-logo',
      format: 'webp',
      quality: 80,
      loading: 'lazy',
      placeholder: 'blur'
    });
    
    // Add performance observer for Core Web Vitals
    addPerformanceObserver('largest-contentful-paint', (entry) => {
      performanceLog('LCP measured', { value: entry.startTime, target: 2000 });
    });
    
    addPerformanceObserver('first-input', (entry) => {
      performanceLog('FID measured', { value: entry.processingStart - entry.startTime, target: 100 });
    });
    
    addPerformanceObserver('layout-shift', (entry) => {
      if (!entry.hadRecentInput) {
        performanceLog('CLS detected', { value: entry.value, target: 0.2 });
      }
    });
    
    // Cleanup function
    return () => {
      isMounted.current = false;
      
      // Clear all tracked resources
      cleanupManager.current.cleanup();
      
      // Clear memory tracker
      if (memoryTracker.current) {
        clearInterval(memoryTracker.current);
      }
      
      // Unregister component
      unregisterComponent(componentId.current);
      trackComponentLifecycle(componentId.current, 'AllBrokersPage', 'unmount');
      
      // Clear caches
      brokerCache.current.clear();
      filterCache.current.clear();
      subscriptionTracker.current.clear();
    };
  }, [addCriticalResource, optimizeImages, addPerformanceObserver, performanceLog]);

  // Progressive Enhancement Initialization
  useEffect(() => {
    const initProgressiveEnhancement = async () => {
      try {
        // Initialize progressive enhancement
        await initializeProgressiveEnhancement({
          enableLogging: process.env.NODE_ENV === 'development',
          enableAnalytics: true,
          enableExperimental: false
        });

        // Detect features and capabilities
        const detectedFeatures = detectFeatures();
        const networkConditionResult = await detectNetworkCondition();
        const deviceCapabilityResult = await assessDeviceCapability();

        // Set state based on detected capabilities
        setFeatures(detectedFeatures);
        setNetworkCondition(networkConditionResult);
        setDeviceCapability(deviceCapabilityResult);

        // Determine enhancement level based on capabilities
        let level: 'basic' | 'standard' | 'enhanced' = 'standard';
        
        if (networkConditionResult === 'slow' || deviceCapabilityResult === 'low') {
          level = 'basic';
        } else if (networkConditionResult === 'fast' && deviceCapabilityResult === 'high') {
          level = 'enhanced';
        }

        setEnhancementLevel(level);
        
        // Log enhancement level in development
        if (process.env.NODE_ENV === 'development') {
          console.log(`Progressive Enhancement Level: ${level}`);
          console.log('Network Condition:', networkCondition);
          console.log('Device Capability:', deviceCapability);
          console.log('Detected Features:', detectedFeatures);
        }
      } catch (error) {
        console.error('Failed to initialize progressive enhancement:', error);
        // Fallback to basic level if initialization fails
        setEnhancementLevel('basic');
      }
    };

    initProgressiveEnhancement();
  }, []);

  useEffect(() => {
    if (!isMounted.current) return;
    
    if (user) {
        try {
            const storedFilters = localStorage.getItem(`savedFilters_${user.id}`);
            if (storedFilters) {
                const parsedFilters = JSON.parse(storedFilters);
                // Validate parsed data before setting it
                if (Array.isArray(parsedFilters) && parsedFilters.every(
                    filter => filter && typeof filter === 'object' &&
                    'name' in filter && 'filters' in filter
                )) {
                    setSavedFilters(parsedFilters);
                } else {
                    // Clear corrupted data
                    console.warn("Invalid filter data found, clearing corrupted data");
                    localStorage.removeItem(`savedFilters_${user.id}`);
                    setSavedFilters([]);
                }
            } else {
                setSavedFilters([]);
            }
        } catch (e) {
            console.error("Failed to load saved filters:", e);
            // Clear corrupted data
            try {
                localStorage.removeItem(`savedFilters_${user.id}`);
            } catch (removeError) {
                console.error("Failed to clear corrupted data:", removeError);
            }
            setSavedFilters([]);
        }
    } else {
        setSavedFilters([]); // Clear for logged out users
    }
  }, [user]);

  const persistSavedFilters = (newFilters: SavedFilterSet[]) => {
      if (user) {
          setSavedFilters(newFilters);
          try {
              localStorage.setItem(`savedFilters_${user.id}`, JSON.stringify(newFilters));
          } catch (e) {
              console.error("Failed to save filters:", e);
              // Handle quota exceeded error or other localStorage issues
              if (e instanceof Error && e.name === 'QuotaExceededError') {
                  console.warn("LocalStorage quota exceeded, trying to clear old data");
                  try {
                      // Try to clear old data and save again
                      const oldFilters = localStorage.getItem(`savedFilters_${user.id}`);
                      if (oldFilters) {
                          localStorage.removeItem(`savedFilters_${user.id}`);
                          localStorage.setItem(`savedFilters_${user.id}`, JSON.stringify(newFilters));
                      }
                  } catch (retryError) {
                      console.error("Failed to save filters after retry:", retryError);
                  }
              }
          }
      }
  };

  const handleSaveFilters = useCallback(() => {
      if (!isMounted.current) return;
      
      const name = prompt("Enter a name for this filter set:");
      if (name && name.trim()) {
          const newFilterSet: SavedFilterSet = { name: name.trim(), filters };
          const existing = savedFilters.filter(f => f.name.toLowerCase() !== name.trim().toLowerCase());
          persistSavedFilters([...existing, newFilterSet]);
          
          // Track filter save with analytics
          debouncedTrackEvent.current('filter_set_saved', 'engagement', 'save', name.trim(), undefined, {
            filter_set_name: name.trim(),
            filter_count: Object.keys(filters).length,
            action: 'save_filter_set',
            page: 'all_brokers',
            section: 'filters_sidebar'
          });
      }
  }, [filters, savedFilters]);

  const handleApplyFilterSet = useCallback((filterSet: SavedFilterSet) => {
      if (!isMounted.current) return;
      
      setFilters(filterSet.filters);
      
      // Track filter set application with analytics
      debouncedTrackEvent.current('filter_set_applied', 'engagement', 'apply', filterSet.name, undefined, {
        filter_set_name: filterSet.name,
        filter_count: Object.keys(filterSet.filters).length,
        action: 'apply_filter_set',
        page: 'all_brokers',
        section: 'saved_filters'
      });
  }, []);

  const handleDeleteFilterSet = useCallback((e: React.MouseEvent, name: string) => {
      if (!isMounted.current) return;
      
      e.stopPropagation();
      if (window.confirm(`Are you sure you want to delete the filter set "${name}"?`)) {
          const updatedFilters = savedFilters.filter(f => f.name !== name);
          persistSavedFilters(updatedFilters);
      }
  }, [savedFilters]);


  const handleCheckboxChange = useCallback((group: FilterKeys, value: string) => {
    if (!isMounted.current) return;
    
    setFilters(prev => {
        const currentGroup = prev[group as 'executionTypes' | 'platforms' | 'algoSupport' | 'socialTradingFeatures'];
        const isAdding = !currentGroup.includes(value);
        const newGroup = isAdding
            ? [...currentGroup, value]
            : currentGroup.filter(item => item !== value);
        
        // Track filter change with analytics
        trackSearchFilter(group, value);
        debouncedTrackEvent.current('filter_change', 'filter', isAdding ? 'add' : 'remove', value, undefined, {
          filter_group: group,
          filter_value: value,
          action: isAdding ? 'add_filter' : 'remove_filter',
          page: 'all_brokers',
          section: 'filters_sidebar'
        });
        
        return { ...prev, [group]: newGroup };
    });
  }, [trackSearchFilter]);

  const handleRadioChange = useCallback((group: FilterKeys, value: string) => {
      if (!isMounted.current) return;
      
      setFilters(prev => ({ ...prev, [group]: value }));
      
      // Track filter change with analytics
      trackSearchFilter(group, value);
      debouncedTrackEvent.current('filter_change', 'filter', 'select', value, undefined, {
        filter_group: group,
        filter_value: value,
        action: 'select_filter',
        page: 'all_brokers',
        section: 'filters_sidebar'
      });
  }, [trackSearchFilter]);

  const applyStylePreset = useCallback((style: TradingStyle) => {
      if (!isMounted.current) return;
      
      let newFilters = { ...initialFilters };
      switch(style) {
          case 'Scalping':
              newFilters = { ...newFilters, executionTypes: ['ECN', 'STP'], spread: 'ultra-low', commission: 'commission', minLotSize: 'micro' };
              break;
          case 'Algorithmic':
              newFilters = { ...newFilters, executionTypes: ['ECN'], algoSupport: ['EAs', 'API'] };
              break;
          case 'Copy Trading':
              newFilters = { ...newFilters, socialTradingFeatures: ['copyTrading'] };
              break;
          case 'Swing Trading':
               newFilters = { ...newFilters, maxLeverage: 'low' }; // Low leverage for long-term holds
              break;
          case 'News Trading':
               newFilters = { ...newFilters, executionTypes: ['ECN', 'STP'], spread: 'ultra-low' };
               break;
          case 'Low Cost':
               newFilters = { ...newFilters, spread: 'ultra-low', commission: 'commission' };
               break;
      }
      setFilters(newFilters);
      
      // Track preset application with analytics
      debouncedTrackEvent.current('preset_applied', 'filter', 'select', style, undefined, {
        preset_name: style,
        preset_filters: newFilters,
        action: 'apply_preset',
        page: 'all_brokers',
        section: 'filter_presets'
      });
  }, []);

  // Create debounced search function with memory optimization
  const debouncedSearch = useMemo(
    () => createDebouncedFunction((searchTerm: string) => {
      if (!isMounted.current) return;
      
      setFilters(prev => ({ ...prev, searchTerm }));
      // Track search with analytics
      if (searchTerm.trim()) {
        trackSearch(searchTerm, 'brokers', filters);
      }
    }, 300),
    [filters, trackSearch]
  );

  // Handle search change with debouncing
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isMounted.current) return;
    
    const searchTerm = e.target.value;
    debouncedSearch(searchTerm);
    
    // Track search initiation
    debouncedTrackEvent.current('search_initiated', 'search', 'input', 'broker_search', undefined, {
      search_term: searchTerm,
      page: 'all_brokers',
      section: 'search_input'
    });
  }, [debouncedSearch]);

  // Optimized broker filtering with memoization and caching
  const filteredBrokers = useMemo(() => {
    if (!isMounted.current) return [];
    
    // Create cache key from filters
    const filterKey = JSON.stringify(filters);
    
    // Check cache first
    const cached = filterCache.current.get(filterKey);
    if (cached) {
      return cached;
    }

    // Reset AI recommendation when filters change
    if (isMounted.current) {
      setAiRecommendation(null);
      setAiError(null);
    }

    if (!allBrokers || allBrokers.length === 0) {
      console.log('🔍 No brokers available yet, allBrokers:', allBrokers);
      return [];
    }

    console.log('🔍 Filtering', allBrokers.length, 'brokers with filters:', filters);
    
    // Apply all filters with proper optimization
    const filtered = allBrokers.filter(broker => {
      // Search filter
      if (filters.searchTerm && !broker.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
          return false;
      }
      
      // Regulation filter
      if (filters.regulator !== 'any' && !broker.regulation?.regulators.includes(filters.regulator)) {
          return false;
      }
      
      // Minimum deposit filter
      if (filters.minDeposit !== 'any') {
          const minDepositAmount = parseInt(filters.minDeposit, 10);
          if (broker.accessibility.minDeposit > minDepositAmount) {
              return false;
          }
      }
      
      // Country filter - using restrictedCountries as that's what's available in the Broker interface
      if (filters.country !== 'any' && broker.restrictedCountries) {
          if (broker.restrictedCountries.includes(filters.country)) {
              return false;
          }
      }
      
      // Risk profile filter - using riskProfile from the Broker interface
      if (filters.riskProfile === 'exclude_high' && broker.riskProfile) {
          if (broker.riskProfile.level === 'High' || broker.riskProfile.level === 'Critical') {
              return false;
          }
      }
      
      // Execution types filter - using technology.executionType from the Broker interface
      if (filters.executionTypes.length > 0 && broker.technology?.executionType) {
          if (!filters.executionTypes.includes(broker.technology.executionType)) {
              return false;
          }
      }
      
      // Platform filter - using technology.platforms from the Broker interface
      if (filters.platforms.length > 0 && broker.technology?.platforms) {
          const hasMatchingPlatform = filters.platforms.some(platform =>
              broker.technology.platforms.includes(platform)
          );
          if (!hasMatchingPlatform) {
              return false;
          }
      }
      
      // Spread filter - using fees.trading.spreadType from the Broker interface
      if (filters.spread !== 'any' && broker.fees?.trading?.spreadType) {
          if (filters.spread === 'ultra-low' && !['Variable', 'Raw'].includes(broker.fees.trading.spreadType)) {
              return false;
          }
          if (filters.spread === 'low' && broker.fees.trading.spreadType === 'Fixed') {
              return false;
          }
      }
      
      // Commission filter - using tradingConditions.commission from the Broker interface
      if (filters.commission !== 'any' && broker.tradingConditions?.commission) {
          if (filters.commission === 'commission' && broker.tradingConditions.commission === 'None') {
              return false;
          }
          if (filters.commission === 'zero' && broker.tradingConditions.commission !== 'None') {
              return false;
          }
      }
      
      return true;
    });
    
    console.log('🔍 Filtered result:', filtered.length, 'brokers');
    
    // Cache the result
    filterCache.current.set(filterKey, filtered);
    
    // Track search results with analytics
    if (filters.searchTerm) {
      trackSearchResults(filters.searchTerm, filtered.length);
    }
    
    return filtered;
  }, [filters, allBrokers, trackSearchResults]);

  const handleReset = useCallback(() => {
    if (!isMounted.current) return;
    
    setFilters(initialFilters);
    setAiRecommendation(null);
    setAiError(null);
    
    // Track filter reset with analytics
    debouncedTrackEvent.current('filters_reset', 'filter', 'reset', 'all_filters', undefined, {
      action: 'reset_filters',
      page: 'all_brokers',
      section: 'filters_sidebar'
    });
  }, []);
  
  const handleGetAIRecommendation = useCallback(() => {
    if (!isMounted.current) return;
    
    // Track AI recommendation request with analytics
    debouncedTrackEvent.current('ai_recommendation_requested', 'engagement', 'click', 'ai_recommendation', undefined, {
      broker_count: filteredBrokers.length,
      filters_applied: filtersAreDirty,
      action: 'request_ai_recommendation',
      page: 'all_brokers',
      section: 'results_header'
    });
    
    loadAIRecommendation();
  }, [filteredBrokers.length, filtersAreDirty, loadAIRecommendation]);

  const recommendedBrokers = useMemo(() => {
    if (!aiRecommendation) return [];
    return aiRecommendation.recommendedBrokerIds
        .map(id => allBrokers.find(b => b.id === id))
        .filter((b): b is Broker => !!b);
  }, [aiRecommendation]);

  const filtersAreDirty = useMemo(() => {
      return JSON.stringify(filters) !== JSON.stringify(initialFilters);
  }, [filters]);

  // Virtual scrolling configuration for large broker lists
  const virtualizer = useVirtualizer({
    count: Math.ceil(filteredBrokers.length / 3), // Divide by 3 for grid layout
    getScrollElement: () => parentRef.current,
    estimateSize: () => 350, // Estimated height for each row of 3 cards
    overscan: 5, // Render 5 extra rows outside the viewport
  });


  return (
    <PerformanceOptimizer>
        <BrokerQuickViewModal broker={selectedBroker} onClose={handleCloseQuickView} />
        
        {/* Mobile Header */}
        <div className="text-center mb-6 md:mb-10 px-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold">{t('allBrokersPage.title')}</h1>
          <p className="text-sm md:text-lg text-foreground/80 mt-2 max-w-3xl mx-auto">{t('allBrokersPage.subtitle')}</p>
        </div>

        {/* Mobile Search Bar */}
      <div className="lg:hidden px-4 mb-4">
        <MobileSearch
          placeholder={t('allBrokersPage.searchPlaceholder')}
          onSearch={(query) => {
            if (isMounted.current) {
              setFilters(prev => ({ ...prev, searchTerm: query }));
              if (query.trim()) {
                trackSearch(query, 'brokers', filters);
              }
            }
          }}
          onFilterClick={() => setShowMobileFilters(true)}
          showFilterButton={true}
        />
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute inset-x-0 top-0 h-full max-h-[80vh] overflow-y-auto bg-background">
            <div className="sticky top-0 bg-background border-b p-4 flex justify-between items-center">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowMobileFilters(false)}>
                <Icon name="x" />
              </Button>
            </div>
            <div className="p-4">
              <MobileFilters
                filters={filters}
                onFilterChange={(group, value) => {
                  if (Array.isArray(filters[group as keyof typeof filters])) {
                    handleCheckboxChange(group as FilterKeys, value);
                  } else {
                    handleRadioChange(group as FilterKeys, value);
                  }
                }}
                onReset={handleReset}
                onApply={() => setShowMobileFilters(false)}
                availableRegulators={availableRegulators}
                countries={countriesData || countries}
              />
            </div>
          </div>
        </div>
      )}

          <main className="grid lg:grid-cols-4 gap-6 md:gap-8 items-start px-4 lg:px-0">
        <SkeletonWrapper
          isLoading={filtersLoading.isLoading}
          skeleton={<div className="lg:col-span-1"><FormSkeleton /></div>}
        >
          <aside id="filters-sidebar" className="lg:col-span-1 lg:sticky lg:top-24 hidden lg:block">
              <Card className="flex flex-col lg:max-h-[calc(100vh-8rem)]">
                  <CardHeader className="flex justify-between items-center">
                      <h2 className="text-xl font-bold">{t('allBrokersPage.filtersTitle')}</h2>
                      <div className="flex items-center gap-1">
                          {user && filtersAreDirty && (
                              <Button variant="ghost" size="sm" onClick={handleSaveFilters}>Save</Button>
                          )}
                          <Button variant="ghost" size="sm" onClick={handleReset}>{t('allBrokersPage.reset')}</Button>
                      </div>
                  </CardHeader>
                  <CardContent className="overflow-y-auto">
                      <ProgressiveSearch
                        onSearch={(query) => {
                          if (isMounted.current) {
                            setFilters(prev => ({ ...prev, searchTerm: query }));
                            if (query.trim()) {
                              trackSearch(query, 'brokers', filters);
                            }
                          }
                        }}
                        placeholder={t('allBrokersPage.searchPlaceholder')}
                        defaultValue={filters.searchTerm}
                        className="mb-4"
                        fallback={
                          <Input
                            type="text"
                            placeholder={t('allBrokersPage.searchPlaceholder')}
                            defaultValue={filters.searchTerm}
                            onChange={handleSearchChange}
                            className="mb-4"
                          />
                        }
                      />
                     {user && (
                        <Accordion title="My Saved Filters">
                            {savedFilters.length > 0 ? (
                                <div className="space-y-1">
                                    {savedFilters.map(set => (
                                        <div key={set.name} className="flex items-center justify-between group p-1 rounded hover:bg-input/50">
                                            <button onClick={() => handleApplyFilterSet(set)} className="text-left text-sm text-foreground/80 group-hover:text-primary-400 flex-grow truncate pr-2">
                                                {set.name}
                                            </button>
                                            <button onClick={(e) => handleDeleteFilterSet(e, set.name)} className="p-1 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-400 transition-opacity flex-shrink-0">
                                                <Icon name="trash" size="sm" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-xs text-center text-foreground/60 p-2">Save your filter combinations for quick access later.</p>
                            )}
                        </Accordion>
                    )}
                    <Accordion title="Country Availability">
                        <label className="text-sm font-semibold">I am trading from</label>
                        <select
                          value={filters.country}
                          onChange={(e) => setFilters(p => ({...p, country: e.target.value}))}
                          className="w-full mt-1 bg-input border-input rounded-md shadow-sm p-2"
                          disabled={countriesLoading}
                        >
                            <option value="any">Any Country</option>
                            {(countriesData || countries).map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        {countriesLoading && (
                          <div className="mt-1 text-xs text-foreground/60 flex items-center gap-1">
                            <Spinner size="xs" />
                            Loading countries...
                          </div>
                        )}
                    </Accordion>
                     <Accordion title="Risk Profile">
                        {[{v: 'all', l: 'Show All Brokers'}, {v: 'exclude_high', l: 'Exclude High & Critical Risk'}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="radio" name="riskProfile" value={opt.v} checked={filters.riskProfile === opt.v} onChange={(e) => handleRadioChange('riskProfile', e.target.value)} className="form-radio h-4 w-4 bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}
                    </Accordion>
                    <Accordion title={t('allBrokersPage.presetsTitle')}>
                        <div className="grid grid-cols-2 gap-2">
                            {(['Scalping', 'Algorithmic', 'Copy Trading', 'Swing Trading', 'News Trading', 'Low Cost'] as TradingStyle[]).map(style => (
                                <Button key={style} variant="secondary" size="sm" onClick={() => applyStylePreset(style)}>{t(`allBrokersPage.presets.${style.toLowerCase().replace(' ', '')}`)}</Button>
                            ))}
                        </div>
                    </Accordion>
                    <Accordion title={t('allBrokersPage.generalTitle')}>
                        <label className="text-sm font-semibold">{t('allBrokersPage.minDeposit')}</label>
                        <select value={filters.minDeposit} onChange={(e) => setFilters(p => ({...p, minDeposit: e.target.value}))} className="w-full mt-1 bg-input border-input rounded-md shadow-sm p-2">
                            <option value="any">{t('allBrokersPage.minDepositOptions.any')}</option>
                            <option value="100">{t('allBrokersPage.minDepositOptions.100')}</option>
                            <option value="250">{t('allBrokersPage.minDepositOptions.250')}</option>
                            <option value="1000">{t('allBrokersPage.minDepositOptions.1000')}</option>
                        </select>
                        <label className="text-sm font-semibold mt-3 block">{t('allBrokersPage.regulator')}</label>
                        <select
                          value={filters.regulator}
                          onChange={(e) => setFilters(p => ({...p, regulator: e.target.value}))}
                          className="w-full mt-1 bg-input border-input rounded-md shadow-sm p-2"
                          disabled={regulatorsLoading}
                        >
                            <option value="any">{t('allBrokersPage.regulatorOptions.any')}</option>
                            {availableRegulators.map(reg => <option key={reg} value={reg}>{reg}</option>)}
                        </select>
                        {regulatorsLoading && (
                          <div className="mt-1 text-xs text-foreground/60 flex items-center gap-1">
                            <Spinner size="xs" />
                            Loading regulators...
                          </div>
                        )}
                    </Accordion>
                     <Accordion title={t('allBrokersPage.executionCostsTitle')}>
                        <h4 className="font-semibold text-sm mb-2">{t('allBrokersPage.executionType')}</h4>
                        {['ECN', 'STP', 'NDD', 'Market Maker'].map(val => <label key={val} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.executionTypes.includes(val)} onChange={() => handleCheckboxChange('executionTypes', val)} className="form-checkbox h-4 w-4 rounded bg-input border-input text-primary-600 focus:ring-primary-500"/>{val}</label>)}
                        
                        <h4 className="font-semibold text-sm mb-2 mt-4">{t('allBrokersPage.spread')}</h4>
                        {[{v: 'any', l: t('allBrokersPage.spreadOptions.any')}, {v: 'ultra-low', l: t('allBrokersPage.spreadOptions.ultraLow')}, {v: 'low', l: t('allBrokersPage.spreadOptions.low')}, {v: 'standard', l: t('allBrokersPage.spreadOptions.standard')}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="radio" name="spread" value={opt.v} checked={filters.spread === opt.v} onChange={(e) => handleRadioChange('spread', e.target.value)} className="form-radio h-4 w-4 bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}
                       
                        <h4 className="font-semibold text-sm mb-2 mt-4">{t('allBrokersPage.commissions')}</h4>
                        {[{v: 'any', l: t('allBrokersPage.commissionOptions.any')}, {v: 'commission', l: t('allBrokersPage.commissionOptions.commission')}, {v: 'zero', l: t('allBrokersPage.commissionOptions.zero')}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="radio" name="commission" value={opt.v} checked={filters.commission === opt.v} onChange={(e) => handleRadioChange('commission', e.target.value)} className="form-radio h-4 w-4 bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}
                     </Accordion>
                     <Accordion title={t('allBrokersPage.techPlatformsTitle')}>
                        <h4 className="font-semibold text-sm mb-2">{t('allBrokersPage.platform')}</h4>
                        {['MT4', 'MT5', 'cTrader', 'TradingView'].map(val => <label key={val} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.platforms.includes(val)} onChange={() => handleCheckboxChange('platforms', val)} className="form-checkbox h-4 w-4 rounded bg-input border-input text-primary-600 focus:ring-primary-500"/>{val}</label>)}

                        <h4 className="font-semibold text-sm mb-2 mt-4">{t('allBrokersPage.algoTrading')}</h4>
                        {[{v: 'EAs', l: 'EA Support'}, {v: 'API', l: 'API Access'}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={filters.algoSupport.includes(opt.v)} onChange={() => handleCheckboxChange('algoSupport', opt.v)} className="form-checkbox h-4 w-4 rounded bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}
                     </Accordion>
                    <Accordion title="Social & Copy Trading">
                        <h4 className="font-semibold text-sm mb-2">Features</h4>
                        {[
                            { v: 'copyTrading', l: 'Supports Copy Trading' },
                            { v: 'pammMam', l: 'PAMM/MAM Accounts' },
                            { v: 'zuluTrade', l: 'ZuluTrade Integration' },
                            { v: 'myfxbook', l: 'Myfxbook Integration' },
                        ].map(opt => (
                            <label key={opt.v} className="flex items-center gap-2 text-sm">
                                <input
                                    type="checkbox"
                                    checked={filters.socialTradingFeatures.includes(opt.v)}
                                    onChange={() => handleCheckboxChange('socialTradingFeatures', opt.v)}
                                    className="form-checkbox h-4 w-4 rounded bg-input border-input text-primary-600 focus:ring-primary-500"
                                />
                                {opt.l}
                            </label>
                        ))}
                    </Accordion>
                     <Accordion title={t('allBrokersPage.tradingConditionsTitle')}>
                         <h4 className="font-semibold text-sm mb-2">{t('allBrokersPage.minLotSize')}</h4>
                        {[{v: 'any', l: t('allBrokersPage.minLotSizeOptions.any')}, {v: 'micro', l: t('allBrokersPage.minLotSizeOptions.micro')}, {v: 'mini', l: t('allBrokersPage.minLotSizeOptions.mini')}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="radio" name="minLotSize" value={opt.v} checked={filters.minLotSize === opt.v} onChange={(e) => handleRadioChange('minLotSize', e.target.value)} className="form-radio h-4 w-4 bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}
                         
                         <h4 className="font-semibold text-sm mb-2 mt-4">{t('allBrokersPage.maxLeverage')}</h4>
                        {[{v: 'any', l: t('allBrokersPage.maxLeverageOptions.any')}, {v: 'low', l: t('allBrokersPage.maxLeverageOptions.low')}, {v: 'medium', l: t('allBrokersPage.maxLeverageOptions.medium')}, {v: 'high', l: t('allBrokersPage.maxLeverageOptions.high')}].map(opt => <label key={opt.v} className="flex items-center gap-2 text-sm"><input type="radio" name="maxLeverage" value={opt.v} checked={filters.maxLeverage === opt.v} onChange={(e) => handleRadioChange('maxLeverage', e.target.value)} className="form-radio h-4 w-4 bg-input border-input text-primary-600 focus:ring-primary-500"/>{opt.l}</label>)}
                     </Accordion>
                  </CardContent>
              </Card>
          </aside>
        </SkeletonWrapper>

        <main className="lg:col-span-3">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
                <div className="flex items-center gap-2 sm:gap-4">
                  {/* Loading and status indicators */}
                  {brokersLoading && (
                    <div className="flex items-center gap-2 text-sm text-foreground/70">
                      <Spinner size="sm" />
                      <span className="hidden sm:inline">Loading brokers...</span>
                      <span className="sm:hidden">Loading...</span>
                    </div>
                  )}
                  
                  {!brokersLoading && allBrokers.length > 0 && (
                      <p className="text-sm text-foreground/70">
                          <span className="hidden sm:inline">{t('allBrokersPage.results.showing', { count: filteredBrokers.length, total: allBrokers.length })}</span>
                          <span className="sm:inline">{filteredBrokers.length} of {allBrokers.length}</span>
                          {isUsingFallback && (
                            <span className="ml-2 text-amber-500">
                              <Icon name="alert" size="sm" className="inline mr-1" />
                              <span className="hidden sm:inline">Using cached data</span>
                              <span className="sm:hidden">Cached</span>
                            </span>
                          )}
                      </p>
                  )}
                  
                  {/* Error handling */}
                  {brokersError && (
                      <div className="flex items-center gap-2 text-red-500 text-sm">
                        <Icon name="alert" size="sm" />
                        <span className="hidden sm:inline">Failed to load brokers</span>
                        <span className="sm:inline">Error</span>
                        <Button variant="secondary" size="sm" onClick={refetch}>
                          <span className="hidden sm:inline">Retry</span>
                          <span className="sm:inline">↻</span>
                        </Button>
                      </div>
                  )}
                </div>
                
                {/* Mobile View Toggle */}
                <div className="flex items-center gap-2">
                  {/* View Toggle - Hidden on Desktop */}
                  <div className="lg:hidden flex items-center bg-input p-1 rounded-md">
                    <button
                      onClick={() => {
                        setActiveView('grid');
                        trackEvent('view_change', 'engagement', 'click', 'mobile_grid_view', undefined, {
                          view_type: 'mobile_grid',
                          action: 'change_mobile_view',
                          page: 'all_brokers',
                          section: 'results_header'
                        });
                      }}
                      className={`p-1.5 rounded-md transition-colors ${activeView === 'grid' ? 'bg-card shadow-md' : 'text-foreground/60 hover:bg-card/50'}`}
                      aria-label="Grid View"
                    >
                      <Icon name="grid" />
                    </button>
                    <button
                      onClick={() => {
                        setActiveView('list');
                        trackEvent('view_change', 'engagement', 'click', 'mobile_list_view', undefined, {
                          view_type: 'mobile_list',
                          action: 'change_mobile_view',
                          page: 'all_brokers',
                          section: 'results_header'
                        });
                      }}
                      className={`p-1.5 rounded-md transition-colors ${activeView === 'list' ? 'bg-card shadow-md' : 'text-foreground/60 hover:bg-card/50'}`}
                      aria-label="List View"
                    >
                      <Icon name="list" />
                    </button>
                  </div>
                  
                  {/* Desktop View Toggle - Hidden on Mobile */}
                  <div className="hidden lg:flex items-center bg-input p-1 rounded-md">
                    <Tooltip content="Grid View">
                      <button onClick={() => {
                        setView('grid');
                        trackEvent('view_change', 'engagement', 'click', 'grid_view', undefined, {
                          view_type: 'grid',
                          action: 'change_view',
                          page: 'all_brokers',
                          section: 'results_header'
                        });
                      }} className={`p-1.5 rounded-md transition-colors ${view === 'grid' ? 'bg-card shadow-md' : 'text-foreground/60 hover:bg-card/50'}`} aria-label="Grid View">
                        <Icon name="grid" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Table View">
                      <button onClick={() => {
                        setView('table');
                        trackEvent('view_change', 'engagement', 'click', 'table_view', undefined, {
                          view_type: 'table',
                          action: 'change_view',
                          page: 'all_brokers',
                          section: 'results_header'
                        });
                      }} className={`p-1.5 rounded-md transition-colors ${view === 'table' ? 'bg-card shadow-md' : 'text-foreground/60 hover:bg-card/50'}`} aria-label="Table View">
                        <Icon name="list" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <FeatureGuard
                  features={features}
                  requiredFeatures={['aiRecommendations']}
                  fallback={
                    <Button
                      variant="outline"
                      size={isMobile ? "sm" : "default"}
                      disabled={true}
                      title="AI recommendations not available on this device"
                    >
                      <Icon name="bot" className="mr-2" />
                      <span className="hidden sm:inline">{t('allBrokersPage.results.getAiRec')} (Unavailable)</span>
                      <span className="sm:inline">AI (Unavailable)</span>
                    </Button>
                  }
                >
                  <NetworkAware
                    networkCondition={networkCondition}
                    slowNetworkFallback={
                      <Button
                        variant="outline"
                        size={isMobile ? "sm" : "default"}
                        disabled={true}
                        title="AI recommendations require better network connection"
                      >
                        <Icon name="bot" className="mr-2" />
                        <span className="hidden sm:inline">{t('allBrokersPage.results.getAiRec')} (Poor Connection)</span>
                        <span className="sm:inline">AI (Poor Connection)</span>
                      </Button>
                    }
                  >
                    <DeviceAware
                      deviceCapability={deviceCapability}
                      lowDeviceFallback={
                        <Button
                          variant="outline"
                          size={isMobile ? "sm" : "default"}
                          onClick={handleGetAIRecommendation}
                          disabled={isAILoading || filteredBrokers.length < 2 || brokersLoading}
                          title="AI recommendations may be slower on this device"
                        >
                          {isAILoading ? <Spinner size="sm" /> : <><Icon name="bot" className="mr-2"/><span className="hidden sm:inline">{t('allBrokersPage.results.getAiRec')} (Basic)</span><span className="sm:inline">AI (Basic)</span></>}
                        </Button>
                      }
                    >
                      <Button
                          id="ai-rec-button"
                          size={isMobile ? "sm" : "default"}
                          onClick={handleGetAIRecommendation}
                          disabled={isAILoading || filteredBrokers.length < 2 || brokersLoading}
                      >
                          {isAILoading ? <Spinner size="sm" /> : <><Icon name="bot" className="mr-2"/><span className="hidden sm:inline">{t('allBrokersPage.results.getAiRec')}</span><span className="sm:inline">AI Picks</span></>}
                      </Button>
                    </DeviceAware>
                  </NetworkAware>
                </FeatureGuard>
            </div>
             {filteredBrokers.length < 2 && !isAILoading && <p className="text-xs text-center sm:text-right mt-1 text-foreground/60">{t('allBrokersPage.results.aiRecTooltip')}</p>}
             
             {aiError && <p className="text-center text-red-500 my-6">{aiError}</p>}
       
             <SkeletonWrapper
               isLoading={aiRecommendationLoading.isLoading}
               skeleton={<div className="mb-12"><div className="h-32 bg-muted rounded-lg animate-pulse"></div></div>}
             >
               {aiRecommendation && recommendedBrokers.length > 0 && (
                <div className="mb-12 animate-fade-in">
                    <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-500">{t('allBrokersPage.results.aiPicksTitle')}</h2>
                    <div className="max-w-4xl mx-auto mb-6">
                       <Card className="flex flex-col">
                            <CardHeader><h3 className="text-xl font-bold flex items-center gap-2"><Icon name="bot" size="lg" color="text-primary-400" /> {t('allBrokersPage.results.aiAnalysisTitle')}</h3></CardHeader>
                            <CardContent>
                                <p className="text-card-foreground/90 italic">{aiRecommendation.reasoning}</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {recommendedBrokers.map(broker => (
                            <BrokerCard key={`recommended-${broker.id}`} broker={broker} isRecommended={true} onQuickView={handleOpenQuickView} />
                        ))}
                    </div>
                    <hr className="my-8 border-input"/>
                  </div>
                )}
             </SkeletonWrapper>

            <SkeletonWrapper
              isLoading={brokersLoading}
              skeleton={
                <div className="space-y-6">
                    <div className="text-center py-8">
                        <Spinner size="lg" />
                        <p className="mt-4 text-foreground/70">Loading brokers...</p>
                        {isUsingFallback && (
                            <p className="mt-2 text-sm text-amber-500">
                                Using cached data while fetching latest information
                            </p>
                        )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <BrokerCardSkeleton key={index} />
                        ))}
                    </div>
                </div>
              }
            >
              {filteredBrokers.length > 0 ? (
                <DeviceAware
                  deviceCapability={deviceCapability}
                  lowDeviceFallback={
                    // Simplified grid for low-end devices
                    <div className="grid grid-cols-1 gap-4">
                      {filteredBrokers.slice(0, 10).map(broker => (
                        <Card key={`simple-${broker.id}`} className="p-4">
                          <div className="flex items-center gap-3">
                            <OptimizedLazyImage
                              src={broker.logoUrl}
                              alt={broker.name}
                              className="h-10 bg-white p-1 rounded-md"
                              width={40}
                              height={40}
                              loading="lazy"
                              format="webp"
                              quality={80}
                              placeholder="blur"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold">{broker.name}</h3>
                              <p className="text-sm text-muted-foreground">Score: {broker.score.toFixed(1)}/10</p>
                              <p className="text-sm">Min Deposit: ${broker.accessibility.minDeposit}</p>
                            </div>
                            <Button size="sm" onClick={() => window.open(broker.websiteUrl, '_blank')}>
                              Visit
                            </Button>
                          </div>
                        </Card>
                      ))}
                      {filteredBrokers.length > 10 && (
                        <div className="text-center">
                          <Button variant="outline" onClick={() => setEnhancementLevel('standard')}>
                            Show All {filteredBrokers.length} Brokers
                          </Button>
                        </div>
                      )}
                    </div>
                  }
                >
                  <NetworkAware
                    networkCondition={networkCondition}
                    slowNetworkFallback={
                      // Pagination for slow networks
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {filteredBrokers.slice(0, 6).map(broker => <BrokerCard key={`slow-${broker.id}`} broker={broker} onQuickView={handleOpenQuickView} />)}
                        </div>
                        {filteredBrokers.length > 6 && (
                          <div className="text-center">
                            <Button variant="outline">
                              Load More Brokers
                            </Button>
                          </div>
                        )}
                      </div>
                    }
                  >
                    {/* Mobile View */}
                    {isMobile ? (
                      activeView === 'grid' ? (
                        <div id="mobile-broker-grid" className="grid grid-cols-1 gap-4">
                          {filteredBrokers.map(broker => (
                            <MobileBrokerCard
                              key={`mobile-grid-${broker.id}`}
                              broker={broker}
                              onQuickView={handleOpenQuickView}
                              compact={true}
                            />
                          ))}
                        </div>
                      ) : (
                        <div id="mobile-broker-list" className="space-y-4">
                          {filteredBrokers.map(broker => (
                            <MobileBrokerCard
                              key={`mobile-list-${broker.id}`}
                              broker={broker}
                              onQuickView={handleOpenQuickView}
                              compact={false}
                            />
                          ))}
                        </div>
                      )
                    ) : (
                      /* Desktop View */
                      view === 'grid' ? (
                        <FeatureGuard
                          features={features}
                          requiredFeatures={['virtualScrolling']}
                          fallback={
                            // Regular grid for browsers without virtual scrolling support
                            <div id="broker-grid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                              {filteredBrokers.map(broker => <BrokerCard key={`grid-${broker.id}`} broker={broker} onQuickView={handleOpenQuickView} />)}
                            </div>
                          }
                        >
                          {filteredBrokers.length > 20 ? (
                            // Virtual scrolling for large lists
                            <div className="relative">
                              <div
                                ref={parentRef}
                                className="h-[800px] overflow-auto"
                                style={{
                                  contain: 'strict',
                                }}
                              >
                                <div
                                  style={{
                                    height: `${virtualizer.getTotalSize()}px`,
                                    width: '100%',
                                    position: 'relative',
                                  }}
                                >
                                  {virtualizer.getVirtualItems().map((virtualItem) => (
                                    <div
                                      key={virtualItem.index}
                                      style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: `${virtualItem.size}px`,
                                        transform: `translateY(${virtualItem.start}px)`,
                                      }}
                                    >
                                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 px-1">
                                        {filteredBrokers.slice(virtualItem.index * 3, (virtualItem.index + 1) * 3).map((broker, index) => (
                                          <BrokerCard
                                            key={`virtual-${virtualItem.index}-${index}-${broker.id}`}
                                            broker={broker}
                                            onQuickView={handleOpenQuickView}
                                          />
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ) : (
                            // Regular grid for smaller lists
                            <div id="broker-grid" className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {filteredBrokers.map(broker => <BrokerCard key={`grid-${broker.id}`} broker={broker} onQuickView={handleOpenQuickView} />)}
                            </div>
                          )}
                        </FeatureGuard>
                      ) : (
                        <SkeletonWrapper
                          isLoading={searchLoading.isLoading}
                          skeleton={<TableSkeleton rows={5} />}
                        >
                          <BrokerTable brokers={filteredBrokers} t={t} />
                        </SkeletonWrapper>
                      )
                    )}
                  </NetworkAware>
                </DeviceAware>
              ) : (
                <div className="text-center py-20 bg-card rounded-lg border border-input">
                    <h3 className="text-xl font-semibold">{t('allBrokersPage.results.noResultsTitle')}</h3>
                    <p className="mt-2 text-card-foreground/70">{t('allBrokersPage.results.noResultsSubtitle')}</p>
                </div>
              )}
            </SkeletonWrapper>
        </main>
      </main>
    </PerformanceOptimizer>
  );
};

export default AllBrokersPage;