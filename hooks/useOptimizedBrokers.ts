import { useMemo, useCallback, useDeferredValue, useState, useEffect } from 'react'

import { BrokerSummary as BrokerSummaryType, loadBrokerSummaries, getBrokerById, getBrokerBySlug, searchBrokers } from '../services/asyncBrokerService'
import { Broker } from '../types'

// Extended BrokerSummary interface for filtering
export interface BrokerSummary extends Omit<BrokerSummaryType, 'regulation'> {
  regulation: string[];
  spreadType?: string;
  maxLeverage?: number;
  tradingPlatforms?: string[];
  assets?: string[];
}

// Define missing types locally
export interface BrokerFilters {
  search?: string;
  regulation?: string;
  spreadType?: string;
  minDeposit?: number;
  leverage?: number;
  tradingPlatforms?: string[];
  assets?: string[];
}

export interface BrokerSortOption {
  field: string;
  direction: 'asc' | 'desc';
}

interface UseOptimizedBrokersOptions {
  initialFilters?: BrokerFilters;
  initialSort?: BrokerSortOption;
  pageSize?: number;
}

interface UseOptimizedBrokersReturn {
  brokers: BrokerSummary[];
  loading: boolean;
  error: string | null;
  filters: BrokerFilters;
  sort: BrokerSortOption;
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasMore: boolean;
  updateFilters: (filters: Partial<BrokerFilters>) => void;
  updateSort: (sort: BrokerSortOption) => void;
  loadMore: () => void;
  refresh: () => void;
  debouncedFilters: BrokerFilters;
  debouncedSort: BrokerSortOption;
}

export function useOptimizedBrokers(options: UseOptimizedBrokersOptions = {}): UseOptimizedBrokersReturn {
  const {
    initialFilters = {},
    initialSort = { field: 'name', direction: 'asc' },
    pageSize = 20,
  } = options

  const [filters, setFilters] = useState<BrokerFilters>(initialFilters)
  const [sort, setSort] = useState<BrokerSortOption>(initialSort)
  const [currentPage, setCurrentPage] = useState(1)
  const [allBrokers, setAllBrokers] = useState<BrokerSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Defer filter and sort updates to prevent blocking the UI
  const debouncedFilters = useDeferredValue(filters)
  const debouncedSort = useDeferredValue(sort)

  // Memoized filter function
  const filterBrokers = useCallback((brokers: BrokerSummary[], filters: BrokerFilters) => {
    return brokers.filter(broker => {
      if (filters.search && !broker.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !broker.description?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false
      }
      if (filters.regulation && broker.regulation && !broker.regulation.includes(filters.regulation)) {
        return false
      }
      if (filters.spreadType && broker.spreadType !== filters.spreadType) {
        return false
      }
      if (filters.minDeposit && broker.minDeposit > filters.minDeposit) {
        return false
      }
      if (filters.leverage && broker.maxLeverage !== undefined && broker.maxLeverage < filters.leverage) {
        return false
      }
      if (filters.tradingPlatforms && filters.tradingPlatforms.length > 0 && broker.tradingPlatforms) {
        const hasPlatform = filters.tradingPlatforms.some((platform: string) =>
          broker.tradingPlatforms.includes(platform),
        )
        if (!hasPlatform) {return false}
      }
      if (filters.assets && filters.assets.length > 0 && broker.assets) {
        const hasAsset = filters.assets.some((asset: string) =>
          broker.assets.includes(asset),
        )
        if (!hasAsset) {return false}
      }
      return true
    })
  }, [])

  // Memoized sort function
  const sortBrokers = useCallback((brokers: BrokerSummary[], sort: BrokerSortOption) => {
    return [...brokers].sort((a, b) => {
      let aValue: any = a[sort.field as keyof BrokerSummary]
      let bValue: any = b[sort.field as keyof BrokerSummary]

      // Handle nested objects
      if (sort.field === 'regulation') {
        aValue = a.regulation
        bValue = b.regulation
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }

      if (aValue < bValue) {return sort.direction === 'asc' ? -1 : 1}
      if (aValue > bValue) {return sort.direction === 'asc' ? 1 : -1}
      return 0
    })
  }, [])

  // Memoized filtered and sorted brokers
  const filteredAndSortedBrokers = useMemo(() => {
    let result = filterBrokers(allBrokers, debouncedFilters)
    result = sortBrokers(result, debouncedSort)
    return result
  }, [allBrokers, debouncedFilters, debouncedSort, filterBrokers, sortBrokers])

  // Paginated brokers
  const brokers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredAndSortedBrokers.slice(startIndex, startIndex + pageSize)
  }, [filteredAndSortedBrokers, currentPage, pageSize])

  // Pagination metadata
  const totalPages = Math.ceil(filteredAndSortedBrokers.length / pageSize)
  const totalCount = filteredAndSortedBrokers.length
  const hasMore = currentPage < totalPages

  // Load initial data
  useEffect(() => {
    let isMounted = true

    const loadBrokers = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await loadBrokerSummaries()
        if (isMounted) {
          setAllBrokers(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load brokers')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadBrokers()

    return () => {
      isMounted = false
    }
  }, [])

  // Reset page when filters or sort change
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedFilters, debouncedSort])

  const updateFilters = useCallback((newFilters: Partial<BrokerFilters>) => {
    setFilters((prev: BrokerFilters) => ({ ...prev, ...newFilters }))
  }, [])

  const updateSort = useCallback((newSort: BrokerSortOption) => {
    setSort(newSort)
  }, [])

  const loadMore = useCallback(() => {
    if (hasMore) {
      setCurrentPage(prev => prev + 1)
    }
  }, [hasMore])

  const refresh = useCallback(() => {
    const loadBrokers = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await loadBrokerSummaries()
        setAllBrokers(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load brokers')
      } finally {
        setLoading(false)
      }
    }

    loadBrokers()
  }, [])

  return {
    brokers,
    loading,
    error,
    filters,
    sort,
    currentPage,
    totalPages,
    totalCount,
    hasMore,
    updateFilters,
    updateSort,
    loadMore,
    refresh,
    debouncedFilters,
    debouncedSort,
  }
}

// Hook for broker search with debouncing
export function useOptimizedBrokerSearch(query: string, delay = 300) {
  const [results, setResults] = useState<BrokerSummary[]>([])
  const [loading, setLoading] = useState(false)
  const deferredQuery = useDeferredValue(query)

  useEffect(() => {
    if (!deferredQuery.trim()) {
      setResults([])
      return
    }

    const searchTimer = setTimeout(async () => {
      try {
        setLoading(true)
        const searchResults = await searchBrokers(deferredQuery)
        // Convert Broker results to BrokerSummary format
        const summaryResults: BrokerSummary[] = searchResults.map(broker => ({
          id: broker.id,
          name: broker.name,
          logoUrl: broker.logoUrl,
          websiteUrl: broker.websiteUrl,
          score: broker.score,
          foundingYear: broker.foundingYear,
          headquarters: broker.headquarters,
          description: broker.description,
          rating: broker.ratings.regulation, // Use regulation rating as fallback
          regulation: broker.regulation.regulators,
          minDeposit: broker.accessibility.minDeposit,
          spreads: broker.tradingConditions.spreads,
          accessibility: broker.accessibility,
          // Add optional fields for filtering
          spreadType: broker.fees.trading.spreadType,
          maxLeverage: parseInt(broker.tradingConditions.maxLeverage) || undefined,
          tradingPlatforms: broker.technology.platforms,
          assets: [], // Would need to be populated from tradableInstruments
        } as BrokerSummary))
        setResults(summaryResults)
      } catch (err) {
        console.error('Search failed:', err)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, delay)

    return () => clearTimeout(searchTimer)
  }, [deferredQuery, delay])

  return { results, loading, query: deferredQuery }
}

// Hook for broker comparison with memoization
export function useOptimizedBrokerComparison(brokerIds: string[]) {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const memoizedBrokerIds = useMemo(() => brokerIds.sort(), [brokerIds])

  useEffect(() => {
    if (memoizedBrokerIds.length === 0) {
      setBrokers([])
      return
    }

    let isMounted = true

    const loadBrokers = async () => {
      try {
        setLoading(true)
        setError(null)
        const brokerData = await Promise.all(
          memoizedBrokerIds.map(id => getBrokerById(id)),
        )
        if (isMounted) {
          setBrokers(brokerData.filter(Boolean) as Broker[])
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Failed to load brokers for comparison')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadBrokers()

    return () => {
      isMounted = false
    }
  }, [memoizedBrokerIds])

  return { brokers, loading, error }
}
