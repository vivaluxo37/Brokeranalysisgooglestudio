/**
 * Virtualized Broker List Component
 *
 * Uses react-window to efficiently render large lists of brokers
 * without creating DOM nodes for off-screen items.
 */

import React, { useEffect, useState, useMemo, useCallback } from 'react'

import { FixedSizeList as List } from 'react-window'

import { BrokerSummary } from '../../data/brokerSummaries'
import { useAsyncBrokers } from '../../hooks/useAsyncBrokers'
import { Broker } from '../../types'

import BrokerCard from './BrokerCard'
import BrokerCardSkeleton from './BrokerCardSkeleton'


interface VirtualizedBrokerListProps {
  brokers?: Broker[];
  brokerSummaries?: BrokerSummary[];
  loading?: boolean;
  onBrokerClick?: (broker: Broker | BrokerSummary) => void;
  className?: string;
  itemHeight?: number;
  height?: number;
  pageSize?: number;
}

// Item renderer for the virtualized list
const BrokerListItem = ({
  index,
  style,
  data,
}: {
  index: number;
  style: React.CSSProperties;
  data: {
    items: (Broker | BrokerSummary[])[];
    loading?: boolean;
    onBrokerClick?: (broker: Broker | BrokerSummary) => void;
    pageSize: number;
    hasMore: boolean;
  };
}) => {
  const { items, loading, onBrokerClick, pageSize, hasMore } = data

  // Show loading skeleton at the end of the list
  if (loading && index >= items.length && index < items.length + pageSize) {
    return (
      <div style={style} className="px-4">
        <BrokerCardSkeleton />
      </div>
    )
  }

  // Show "load more" indicator
  if (!loading && hasMore && index === items.length) {
    return (
      <div style={style} className="flex items-center justify-center p-4">
        <div className="text-sm text-gray-500">Scroll to load more...</div>
      </div>
    )
  }

  // Don't render beyond available items
  if (index >= items.length) {
    return null
  }

  const broker = items[index]

  return (
    <div style={style} className="px-4">
      <BrokerCard
        broker={broker as Broker}
        onQuickView={() => data.onBrokerClick?.(broker)}
      />
    </div>
  )
}

export const VirtualizedBrokerList: React.FC<VirtualizedBrokerListProps> = ({
  brokers,
  brokerSummaries,
  loading = false,
  onBrokerClick,
  className = '',
  itemHeight = 280, // Height of each broker card + padding
  height = 600, // Default height of the container
  pageSize = 10,
}) => {
  const [page, setPage] = useState(1)
  const [displayedItems, setDisplayedItems] = useState<(Broker | BrokerSummary)[]>([])
  const [hasMore, setHasMore] = useState(true)

  // Use summaries if provided, otherwise use full brokers
  const items = brokerSummaries || brokers || []

  // Initialize displayed items
  useEffect(() => {
    const initialItems = items.slice(0, pageSize)
    setDisplayedItems(initialItems)
    setHasMore(items.length > pageSize)
    setPage(1)
  }, [items, pageSize])

  // Load more items when scrolling near the bottom
  const loadMore = useCallback(() => {
    if (!hasMore || loading) {return}

    const nextPage = page + 1
    const startIndex = page * pageSize
    const endIndex = startIndex + pageSize
    const nextItems = items.slice(startIndex, endIndex)

    if (nextItems.length > 0) {
      setDisplayedItems(prev => [...prev, ...nextItems])
      setPage(nextPage)
      setHasMore(endIndex < items.length)
    } else {
      setHasMore(false)
    }
  }, [page, pageSize, items, hasMore, loading])

  // Handle scroll to load more
  const handleScroll = useCallback(({ scrollOffset, scrollDirection }: { scrollOffset: number; scrollDirection: 'forward' | 'backward' }) => {
    if (scrollDirection === 'forward') {
      const listHeight = height
      const contentHeight = displayedItems.length * itemHeight
      const scrollPercentage = scrollOffset / (contentHeight - listHeight)

      // Load more when user scrolls to 80% of the content
      if (scrollPercentage > 0.8 && hasMore && !loading) {
        loadMore()
      }
    }
  }, [height, displayedItems.length, itemHeight, hasMore, loading, loadMore])

  // Memoize item data to prevent unnecessary re-renders
  const itemData = useMemo(() => ({
    items: displayedItems,
    loading,
    onBrokerClick,
    pageSize,
    hasMore,
  }), [displayedItems, loading, onBrokerClick, pageSize, hasMore])

  // If no items, show empty state
  if (items.length === 0 && !loading) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
        <div className="text-gray-500 text-center">
          <p className="text-lg font-medium">No brokers found</p>
          <p className="text-sm mt-2">Try adjusting your filters or search criteria</p>
        </div>
      </div>
    )
  }

  // Show initial loading state
  if (loading && displayedItems.length === 0) {
    return (
      <div className={`space-y-4 ${className}`}>
        {Array.from({ length: pageSize }).map((_, index) => (
          <BrokerCardSkeleton key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className={className}>
      <List
        height={height}
        itemCount={displayedItems.length + (loading ? pageSize : 0) + (hasMore ? 1 : 0)}
        itemSize={itemHeight}
        itemData={itemData}
        onScroll={handleScroll}
        overscanCount={5} // Render 5 extra items above/below viewport for smoother scrolling
      >
        {BrokerListItem}
      </List>

      {/* Load more button for accessibility */}
      {hasMore && !loading && (
        <div className="text-center mt-4">
          <button
            onClick={loadMore}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Load More Brokers
          </button>
        </div>
      )}
    </div>
  )
}

// Hook specifically for virtualized broker lists
export const useVirtualizedBrokers = (options: {
  useSummaries?: boolean;
  pageSize?: number;
} = {}) => {
  const { useSummaries = true, pageSize = 20 } = options

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
  }
}

export default VirtualizedBrokerList
