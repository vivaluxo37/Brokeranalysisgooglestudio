import React, { useState, useCallback, useMemo, useTransition } from 'react'

import { useOptimizedBrokerSearch, BrokerFilters, BrokerSummary } from '../../hooks/useOptimizedBrokers'
import { Broker } from '../../types'
import VirtualizedBrokerGrid from '../brokers/VirtualizedBrokerGrid'

import { DebouncedInput } from './DebouncedInput'
import { FilterDropdown } from './FilterDropdown'

interface OptimizedBrokerSearchProps {
  onBrokerSelect?: (broker: BrokerSummary) => void;
  placeholder?: string;
  showFilters?: boolean;
  className?: string;
}

const REGULATION_OPTIONS = [
  { value: 'FCA', label: 'FCA (UK)' },
  { value: 'CySEC', label: 'CySEC (Cyprus)' },
  { value: 'ASIC', label: 'ASIC (Australia)' },
  { value: 'NFA', label: 'NFA (USA)' },
  { value: 'FINMA', label: 'FINMA (Switzerland)' },
]

const SPREAD_TYPE_OPTIONS = [
  { value: 'Fixed', label: 'Fixed Spreads' },
  { value: 'Variable', label: 'Variable Spreads' },
  { value: 'Raw', label: 'Raw Spreads' },
]

const PLATFORM_OPTIONS = [
  { value: 'MetaTrader 4', label: 'MetaTrader 4' },
  { value: 'MetaTrader 5', label: 'MetaTrader 5' },
  { value: 'cTrader', label: 'cTrader' },
  { value: 'TradingView', label: 'TradingView' },
  { value: 'WebTrader', label: 'Web Trader' },
]

const ASSET_OPTIONS = [
  { value: 'Forex', label: 'Forex' },
  { value: 'Stocks', label: 'Stocks' },
  { value: 'Commodities', label: 'Commodities' },
  { value: 'Cryptocurrencies', label: 'Cryptocurrencies' },
  { value: 'Indices', label: 'Indices' },
]

export function OptimizedBrokerSearch({
  onBrokerSelect,
  placeholder = 'Search brokers...',
  showFilters = true,
  className = '',
}: OptimizedBrokerSearchProps) {
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<BrokerFilters>({})
  const [isPending, startTransition] = useTransition()

  const { results, loading, query: deferredQuery } = useOptimizedBrokerSearch(query, 300)

  // Memoized filtered results
  const filteredResults = useMemo(() => {
    if (!results.length) {return []}

    return results.filter(broker => {
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
        const hasPlatform = filters.tradingPlatforms.some(platform =>
          broker.tradingPlatforms?.includes(platform),
        )
        if (!hasPlatform) {return false}
      }
      if (filters.assets && filters.assets.length > 0 && broker.assets) {
        const hasAsset = filters.assets.some(asset =>
          broker.assets?.includes(asset),
        )
        if (!hasAsset) {return false}
      }
      return true
    })
  }, [results, filters])

  // Debounced filter updates
  const updateFilters = useCallback((newFilters: Partial<BrokerFilters>) => {
    startTransition(() => {
      setFilters(prev => ({ ...prev, ...newFilters }))
    })
  }, [])

  const clearFilters = useCallback(() => {
    startTransition(() => {
      setFilters({})
    })
  }, [])

  const handleBrokerClick = useCallback((broker: BrokerSummary) => {
    onBrokerSelect?.(broker)
  }, [onBrokerSelect])

  // Filter state for UI
  const activeFiltersCount = useMemo(() => {
    return Object.values(filters).filter(value =>
      value !== undefined && value !== null &&
      (Array.isArray(value) ? value.length > 0 : value !== ''),
    ).length
  }, [filters])

  return (
    <div className={`optimized-broker-search ${className}`}>
      {/* Search Input */}
      <div className="relative mb-6">
        <DebouncedInput
          type="text"
          value={query}
          onChange={(value: string) => setQuery(value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 pr-12 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          debounceMs={300}
        />
        <div className="absolute right-3 top-3.5">
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500" />
          ) : (
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Clear all ({activeFiltersCount})
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <FilterDropdown
              label="Regulation"
              value={filters.regulation || ''}
              onChange={(value: string) => {
                const newFilters: Partial<BrokerFilters> = {}
                if (value) {newFilters.regulation = value}
                updateFilters(newFilters)
              }}
              options={REGULATION_OPTIONS}
              placeholder="Any Regulation"
            />

            <FilterDropdown
              label="Spread Type"
              value={filters.spreadType || ''}
              onChange={(value: string) => {
                const newFilters: Partial<BrokerFilters> = {}
                if (value) {newFilters.spreadType = value}
                updateFilters(newFilters)
              }}
              options={SPREAD_TYPE_OPTIONS}
              placeholder="Any Spread Type"
            />

            <DebouncedInput
              type="number"
              label="Min Deposit ($)"
              value={filters.minDeposit?.toString() || ''}
              onChange={(value: string) => {
                const newFilters: Partial<BrokerFilters> = {}
                if (value) {newFilters.minDeposit = parseInt(value)}
                updateFilters(newFilters)
              }}
              placeholder="Min deposit"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              debounceMs={500}
            />

            <DebouncedInput
              type="number"
              label="Max Leverage"
              value={filters.leverage?.toString() || ''}
              onChange={(value: string) => {
                const newFilters: Partial<BrokerFilters> = {}
                if (value) {newFilters.leverage = parseInt(value)}
                updateFilters(newFilters)
              }}
              placeholder="Max leverage"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              debounceMs={500}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FilterDropdown
              label="Trading Platforms"
              value=""
              onChange={() => {}} // Handle multi-select separately
              options={PLATFORM_OPTIONS}
              placeholder="Select Platforms"
              multiSelect
              selectedValues={filters.tradingPlatforms || []}
              onMultiChange={(values: string[]) => {
                const newFilters: Partial<BrokerFilters> = {}
                if (values.length > 0) {newFilters.tradingPlatforms = values}
                updateFilters(newFilters)
              }}
            />

            <FilterDropdown
              label="Assets"
              value=""
              onChange={() => {}} // Handle multi-select separately
              options={ASSET_OPTIONS}
              placeholder="Select Assets"
              multiSelect
              selectedValues={filters.assets || []}
              onMultiChange={(values: string[]) => {
                const newFilters: Partial<BrokerFilters> = {}
                if (values.length > 0) {newFilters.assets = values}
                updateFilters(newFilters)
              }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      <div className="results-section">
        {deferredQuery && (
          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {loading ? 'Searching...' : `Found ${filteredResults.length} brokers for "${deferredQuery}"`}
            </p>
          </div>
        )}

        {isPending && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        )}

        {!loading && !isPending && filteredResults.length > 0 && (
          <VirtualizedBrokerGrid
            brokerSummaries={filteredResults}
            onBrokerClick={(broker: BrokerSummary | Broker) => handleBrokerClick(broker as BrokerSummary)}
            className="brokers-grid"
          />
        )}

        {!loading && !isPending && deferredQuery && filteredResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No brokers found</h3>
            <p className="text-gray-600">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  )
}
