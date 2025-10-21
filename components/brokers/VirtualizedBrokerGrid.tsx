/**
 * Virtualized Broker Grid Component
 *
 * Uses intersection observer for lazy loading and virtualization
 * to efficiently render large lists of brokers.
 */

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react'

import { useAsyncBrokers } from '../../hooks/useAsyncBrokers'
import { BrokerSummary } from '../../services/asyncBrokerService'
import { Broker } from '../../types'

import BrokerCard from './BrokerCard'
import BrokerCardSkeleton from './BrokerCardSkeleton'

interface VirtualizedBrokerGridProps {
  brokers?: Broker[];
  brokerSummaries?: BrokerSummary[];
  loading?: boolean;
  onBrokerClick?: (broker: Broker | BrokerSummary) => void;
  className?: string;
  itemsPerPage?: number;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

const VirtualizedBrokerGrid: React.FC<VirtualizedBrokerGridProps> = ({
  brokers,
  brokerSummaries,
  loading = false,
  onBrokerClick,
  className = '',
  itemsPerPage = 12,
  columns = { sm: 1, md: 2, lg: 3, xl: 4 },
}) => {
  const [visibleItems, setVisibleItems] = useState<(Broker | BrokerSummary)[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

  // Use summaries if provided, otherwise use full brokers
  const allItems = brokerSummaries || brokers || []

  // Initialize visible items
  useEffect(() => {
    const initialItems = allItems.slice(0, itemsPerPage)
    setVisibleItems(initialItems)
    setHasMore(allItems.length > itemsPerPage)
    setPage(1)
  }, [allItems, itemsPerPage])

  // Load more items when intersection observer triggers
  const loadMore = useCallback(() => {
    if (!hasMore || loading) {return}

    const nextPage = page + 1
    const startIndex = page * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const nextItems = allItems.slice(startIndex, endIndex)

    if (nextItems.length > 0) {
      setVisibleItems(prev => [...prev, ...nextItems])
      setPage(nextPage)
      setHasMore(endIndex < allItems.length)
    } else {
      setHasMore(false)
    }
  }, [page, itemsPerPage, allItems, hasMore, loading])

  // Set up intersection observer for infinite loading
  useEffect(() => {
    if (!loadMoreRef.current) {return}

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const target = entries[0]
        if (target?.isIntersecting && hasMore && !loading) {
          loadMore()
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px',
      },
    )

    observerRef.current.observe(loadMoreRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [hasMore, loading, loadMore])

  // Memoize grid classes based on column props
  const gridClasses = useMemo(() => {
    const cols = Object.entries(columns)
      .map(([breakpoint, count]) => `${breakpoint === 'sm' ? '' : `${breakpoint }:`}grid-cols-${count}`)
      .join(' ')
    return `grid ${cols} gap-6`
  }, [columns])

  // If no items, show empty state
  if (allItems.length === 0 && !loading) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <div className="text-gray-500 text-center">
          <p className="text-lg font-medium">No brokers found</p>
          <p className="text-sm mt-2">Try adjusting your filters or search criteria</p>
        </div>
      </div>
    )
  }

  return (
    <div className={className}>
      <div className={gridClasses}>
        {visibleItems.map((broker, index) => (
          <div
            key={broker.id}
            className="transform transition-all duration-300 ease-out"
            style={{
              animationDelay: `${index * 50}ms`,
              animation: 'fadeInUp 0.5s ease-out forwards',
            }}
          >
            <BrokerCard
              broker={broker as Broker}
              onQuickView={() => onBrokerClick?.(broker)}
            />
          </div>
        ))}

        {/* Loading skeletons */}
        {loading && Array.from({ length: Math.min(itemsPerPage, 4) }).map((_, index) => (
          <div
            key={`skeleton-${index}`}
            className="transform transition-all duration-300"
            style={{
              animationDelay: `${index * 50}ms`,
            }}
          >
            <BrokerCardSkeleton />
          </div>
        ))}
      </div>

      {/* Load more trigger */}
      <div
        ref={loadMoreRef}
        className="mt-8 text-center"
        style={{ height: '1px' }}
      >
        {hasMore && !loading && (
          <button
            onClick={loadMore}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Load More Brokers
          </button>
        )}
        {!hasMore && visibleItems.length > 0 && (
          <p className="text-gray-500 text-sm">
            Showing all {visibleItems.length} brokers
          </p>
        )}
      </div>

      {/* Add fade-in animation styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `,
      }} />
    </div>
  )
}

// Hook for virtualized broker grid
export const useVirtualizedBrokerGrid = (options: {
  useSummaries?: boolean;
  itemsPerPage?: number;
} = {}) => {
  const { useSummaries = true, itemsPerPage = 12 } = options

  // Use summaries for better performance
  const { brokerSummaries, brokers, loading, error } = useAsyncBrokers({
    useSummary: useSummaries,
    preload: true,
  })

  const items = useSummaries ? brokerSummaries : brokers

  return {
    items: items || [],
    loading,
    error,
    hasItems: items && items.length > 0,
    totalCount: items?.length || 0,
  }
}

export default VirtualizedBrokerGrid
