import { BrokerSummary as BrokerSummaryType, loadBrokerSummaries as loadSummariesFromFile } from '../data/brokerSummaries'
import { Broker } from '../types'

// Cache for loaded brokers data
let brokersCache: Broker[] | null = null
let brokersPromise: Promise<Broker[]> | null = null

// Cache for broker summaries
let summariesCache: BrokerSummaryType[] | null = null
let summariesPromise: Promise<BrokerSummaryType[]> | null = null

// Lightweight broker summary for initial load
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
}

// Load brokers data asynchronously
export async function loadBrokers(): Promise<Broker[]> {
  if (brokersCache) {
    return brokersCache
  }

  if (brokersPromise) {
    return brokersPromise
  }

  brokersPromise = import('../data/brokers').then(module => {
    brokersCache = module.brokers
    return module.brokers
  })

  return brokersPromise
}

// Load broker summaries (lightweight version)
export async function loadBrokerSummaries(): Promise<BrokerSummaryType[]> {
  if (summariesCache) {
    return summariesCache
  }

  if (summariesPromise) {
    return summariesPromise
  }

  summariesPromise = loadSummariesFromFile().then(summaries => {
    summariesCache = summaries
    return summaries
  })

  return summariesPromise
}

// Get a single broker by ID
export async function getBrokerById(id: string): Promise<Broker | null> {
  const brokers = await loadBrokers()
  return brokers.find(broker => broker.id === id) || null
}

// Get a single broker by slug (using name as slug since there's no slug field)
export async function getBrokerBySlug(slug: string): Promise<Broker | null> {
  const brokers = await loadBrokers()
  return brokers.find(broker => broker.name.toLowerCase().replace(/\s+/g, '-') === slug) || null
}

// Search brokers
export async function searchBrokers(query: string): Promise<Broker[]> {
  const brokers = await loadBrokers()
  const lowercaseQuery = query.toLowerCase()

  return brokers.filter(broker =>
    broker.name.toLowerCase().includes(lowercaseQuery) ||
    broker.description.toLowerCase().includes(lowercaseQuery) ||
    broker.name.toLowerCase().replace(/\s+/g, '-').includes(lowercaseQuery),
  )
}

// Get brokers by country
export async function getBrokersByCountry(country: string): Promise<Broker[]> {
  const brokers = await loadBrokers()
  return brokers.filter(broker =>
    broker.restrictedCountries?.includes(country) === false ||
    broker.regulation.regulators.some((reg: string) => reg.toLowerCase().includes(country.toLowerCase())),
  )
}

// Get brokers by category (using coreInfo.brokerType as category)
export async function getBrokersByCategory(category: string): Promise<Broker[]> {
  const brokers = await loadBrokers()
  return brokers.filter(broker =>
    broker.coreInfo?.brokerType?.toLowerCase().includes(category.toLowerCase()) ||
    broker.technology?.platforms?.some((platform: string) => platform.toLowerCase().includes(category.toLowerCase())),
  )
}

// Preload brokers data in the background
export function preloadBrokersData(): void {
  // Start loading in the background without blocking
  loadBrokers().catch(error => {
    console.warn('Failed to preload brokers data:', error)
  })
}

// Clear cache (useful for development or data updates)
export function clearBrokersCache(): void {
  brokersCache = null
  brokersPromise = null
  summariesCache = null
  summariesPromise = null
}
