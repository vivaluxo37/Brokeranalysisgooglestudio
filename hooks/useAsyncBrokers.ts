import { useState, useEffect } from 'react'

import { BrokerSummary } from '../data/brokerSummaries'
import { loadBrokers, loadBrokerSummaries, getBrokerById, getBrokerBySlug, searchBrokers, getBrokersByCountry, getBrokersByCategory, preloadBrokersData } from '../services/asyncBrokerService'
import { Broker } from '../types'

export interface UseAsyncBrokersOptions {
  preload?: boolean;
  useSummary?: boolean;
}

export function useAsyncBrokers(options: UseAsyncBrokersOptions = {}) {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [brokerSummaries, setBrokerSummaries] = useState<BrokerSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)

        if (options.useSummary) {
          const summaries = await loadBrokerSummaries()
          setBrokerSummaries(summaries)
        } else {
          const fullBrokers = await loadBrokers()
          setBrokers(fullBrokers)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load brokers')
      } finally {
        setLoading(false)
      }
    }

    loadData()

    // Preload in background if requested
    if (options.preload && !options.useSummary) {
      preloadBrokersData()
    }
  }, [options.preload, options.useSummary])

  return {
    brokers,
    brokerSummaries,
    loading,
    error,
    refetch: () => {
      setLoading(true)
      setError(null)
      if (options.useSummary) {
        return loadBrokerSummaries().then(setBrokerSummaries)
      }
      return loadBrokers().then(setBrokers)

    },
  }
}

// Hook for getting a single broker by ID
export function useBroker(brokerId: string) {
  const [broker, setBroker] = useState<Broker | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBroker = async () => {
      try {
        setLoading(true)
        setError(null)
        const brokerData = await getBrokerById(brokerId)
        setBroker(brokerData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load broker')
      } finally {
        setLoading(false)
      }
    }

    if (brokerId) {
      loadBroker()
    }
  }, [brokerId])

  return { broker, loading, error }
}

// Hook for getting a single broker by slug
export function useBrokerBySlug(slug: string) {
  const [broker, setBroker] = useState<Broker | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBroker = async () => {
      try {
        setLoading(true)
        setError(null)
        const brokerData = await getBrokerBySlug(slug)
        setBroker(brokerData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load broker')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      loadBroker()
    }
  }, [slug])

  return { broker, loading, error }
}

// Hook for searching brokers
export function useBrokerSearch(query: string) {
  const [results, setResults] = useState<Broker[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const searchBrokersData = async () => {
      if (!query.trim()) {
        setResults([])
        return
      }

      try {
        setLoading(true)
        setError(null)
        const searchResults = await searchBrokers(query)
        setResults(searchResults)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to search brokers')
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchBrokersData, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  return { results, loading, error }
}

// Hook for getting brokers by country
export function useBrokersByCountry(country: string) {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBrokersByCountry = async () => {
      if (!country.trim()) {
        setBrokers([])
        return
      }

      try {
        setLoading(true)
        setError(null)
        const countryBrokers = await getBrokersByCountry(country)
        setBrokers(countryBrokers)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load brokers by country')
      } finally {
        setLoading(false)
      }
    }

    loadBrokersByCountry()
  }, [country])

  return { brokers, loading, error }
}

// Hook for searching broker summaries (faster than full broker search)
export function useBrokerSummarySearch(query: string) {
  const [results, setResults] = useState<BrokerSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const searchSummaries = async () => {
      if (!query.trim()) {
        setResults([])
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const summaries = await loadBrokerSummaries()
        const lowercaseQuery = query.toLowerCase()
        const filtered = summaries.filter(summary =>
          summary.name.toLowerCase().includes(lowercaseQuery) ||
          summary.description.toLowerCase().includes(lowercaseQuery) ||
          summary.brokerType.toLowerCase().includes(lowercaseQuery) ||
          summary.platforms.some(p => p.toLowerCase().includes(lowercaseQuery)),
        )
        setResults(filtered)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Search failed')
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(searchSummaries, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  return { results, loading, error }
}

// Hook for getting brokers by category
export function useBrokersByCategory(category: string) {
  const [brokers, setBrokers] = useState<Broker[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadBrokersByCategory = async () => {
      if (!category.trim()) {
        setBrokers([])
        return
      }

      try {
        setLoading(true)
        setError(null)
        const categoryBrokers = await getBrokersByCategory(category)
        setBrokers(categoryBrokers)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load brokers by category')
      } finally {
        setLoading(false)
      }
    }

    loadBrokersByCategory()
  }, [category])

  return { brokers, loading, error }
}
