/**
 * Lightweight Broker Summaries
 *
 * This file contains minimal broker data for fast initial loading.
 * Full broker details are loaded on-demand when users click on specific brokers.
 */

export interface BrokerSummary {
  id: string;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  score: number;
  foundingYear: number;
  headquarters: string;
  description: string;
  rating: number;
  regulation: string[];
  minDeposit: number;
  spreads: {
    eurusd: number;
    gbpusd: number;
    usdjpy: number;
  };
  accessibility: {
    minDeposit: number;
    depositMethods: string[];
    withdrawalMethods: string[];
    customerSupport: string[];
  };
  // Additional lightweight fields for filtering
  brokerType: string;
  platforms: string[];
  countries: string[];
  features: string[];
}

// This will be populated by a build script
export const brokerSummaries: BrokerSummary[] = []

// Export function to get summaries with caching
let summariesCache: BrokerSummary[] | null = null
let summariesPromise: Promise<BrokerSummary[]> | null = null

export async function loadBrokerSummaries(): Promise<BrokerSummary[]> {
  if (summariesCache) {
    return summariesCache
  }

  if (summariesPromise) {
    return summariesPromise
  }

  summariesPromise = Promise.resolve().then(async () => {
    // Try to load from API first (for production)
    try {
      if (typeof window !== 'undefined' && window.location) {
        // Browser environment - use fetch
        const response = await fetch('/api/brokers-summaries', {
          headers: {
            'Cache-Control': 'no-cache',
            Pragma: 'no-cache',
          },
        })

        if (response.ok) {
          const data = await response.json()
          summariesCache = data.data
          console.log(`✅ Loaded ${data.data.length} broker summaries from API`)
          return data.data
        }
      }
    } catch (error) {
      console.warn('Failed to load summaries from API:', error)
    }

    // Fallback to generated file
    try {
      const module = await import('./generated/brokerSummariesGenerated')
      summariesCache = module.brokerSummaries
      console.log(`✅ Loaded ${module.brokerSummaries.length} broker summaries from generated file`)
      return module.brokerSummaries
    } catch (error) {
      console.warn('Generated broker summaries not found, using empty array')
      summariesCache = []
      return []
    }
  })

  return summariesPromise
}

// Export function to clear cache (useful for development)
export function clearSummariesCache(): void {
  summariesCache = null
  summariesPromise = null
}
