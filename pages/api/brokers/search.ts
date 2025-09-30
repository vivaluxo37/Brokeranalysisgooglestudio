import { NextApiRequest, NextApiResponse } from 'next';

interface BrokerSearchQuery {
  q?: string; // search query
  category?: string;
  country?: string;
  regulated?: string; // 'true' | 'false'
  min_deposit?: string;
  max_leverage?: string;
  platform?: string;
  features?: string; // comma-separated
  rating?: string; // minimum rating
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  page?: string;
  limit?: string;
}

interface Broker {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  website_url: string;
  overall_rating: number;
  min_deposit?: number;
  min_deposit_currency?: string;
  max_leverage?: number;
  spreads_from?: number;
  commission?: string;
  regulated?: boolean;
  regulations?: Array<{
    regulator: string;
    license_number?: string;
    country: string;
  }>;
  platforms?: string[];
  instruments_total?: number;
  pros?: string[];
  cons?: string[];
  founded_year?: number;
  headquarters?: string;
  demo_account?: boolean;
  swap_free?: boolean;
  live_chat?: boolean;
  phone_support?: boolean;
  features?: string[];
  country_availability?: {
    available?: string[];
    restricted?: string[];
  };
  categories?: string[];
  cta_text?: string;
  cta_url?: string;
}

interface SearchResponse {
  brokers: Broker[];
  total_count: number;
  page: number;
  limit: number;
  total_pages: number;
  filters_applied: {
    [key: string]: any;
  };
  facets: {
    categories: Array<{ name: string; count: number }>;
    countries: Array<{ name: string; count: number }>;
    platforms: Array<{ name: string; count: number }>;
    regulators: Array<{ name: string; count: number }>;
  };
}

// Mock data - In production, this would come from your database
const mockBrokers: Broker[] = [
  {
    id: '1',
    name: 'IC Markets',
    slug: 'ic-markets',
    logo_url: '/images/brokers/ic-markets.png',
    website_url: 'https://icmarkets.com',
    overall_rating: 4.8,
    min_deposit: 200,
    min_deposit_currency: 'USD',
    max_leverage: 500,
    spreads_from: 0.0,
    commission: '$3.50 per lot',
    regulated: true,
    regulations: [
      { regulator: 'ASIC', license_number: '335692', country: 'Australia' },
      { regulator: 'CySEC', license_number: '362/18', country: 'Cyprus' }
    ],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader'],
    instruments_total: 232,
    pros: ['Raw spreads from 0.0 pips', 'Excellent execution speeds'],
    cons: ['Higher minimum deposit'],
    founded_year: 2007,
    headquarters: 'Sydney, Australia',
    demo_account: true,
    swap_free: true,
    live_chat: true,
    phone_support: true,
    features: ['ECN Execution', 'Raw Spreads', 'Copy Trading'],
    country_availability: {
      available: ['Australia', 'Cyprus', 'South Africa', 'Kenya'],
      restricted: ['United States', 'Canada', 'Belgium']
    },
    categories: ['ecn-brokers', 'regulated-brokers'],
    cta_text: 'Visit IC Markets',
    cta_url: 'https://icmarkets.com'
  },
  {
    id: '2',
    name: 'Pepperstone',
    slug: 'pepperstone',
    logo_url: '/images/brokers/pepperstone.png',
    website_url: 'https://pepperstone.com',
    overall_rating: 4.7,
    min_deposit: 200,
    min_deposit_currency: 'USD',
    max_leverage: 400,
    spreads_from: 0.1,
    commission: '$3.50 per lot',
    regulated: true,
    regulations: [
      { regulator: 'ASIC', license_number: '414530', country: 'Australia' },
      { regulator: 'FCA', license_number: '684312', country: 'United Kingdom' }
    ],
    platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'TradingView'],
    instruments_total: 1200,
    pros: ['TradingView integration', 'Fast execution'],
    cons: ['Limited educational resources'],
    founded_year: 2010,
    headquarters: 'Melbourne, Australia',
    demo_account: true,
    swap_free: true,
    live_chat: true,
    phone_support: true,
    features: ['TradingView', 'Copy Trading', 'Social Trading'],
    country_availability: {
      available: ['Australia', 'United Kingdom', 'Germany', 'Kenya'],
      restricted: ['United States', 'Iran', 'North Korea']
    },
    categories: ['ecn-brokers', 'regulated-brokers', 'social-trading'],
    cta_text: 'Visit Pepperstone',
    cta_url: 'https://pepperstone.com'
  },
  {
    id: '3',
    name: 'XM',
    slug: 'xm',
    logo_url: '/images/brokers/xm.png',
    website_url: 'https://xm.com',
    overall_rating: 4.5,
    min_deposit: 5,
    min_deposit_currency: 'USD',
    max_leverage: 1000,
    spreads_from: 0.6,
    commission: 'None on standard',
    regulated: true,
    regulations: [
      { regulator: 'CySEC', license_number: '120/10', country: 'Cyprus' },
      { regulator: 'ASIC', license_number: '443670', country: 'Australia' }
    ],
    platforms: ['MetaTrader 4', 'MetaTrader 5'],
    instruments_total: 1000,
    pros: ['Very low minimum deposit', 'Excellent education'],
    cons: ['Higher spreads on standard account'],
    founded_year: 2009,
    headquarters: 'Cyprus',
    demo_account: true,
    swap_free: true,
    live_chat: true,
    phone_support: true,
    features: ['Educational Resources', 'Multilingual Support', 'Islamic Accounts'],
    country_availability: {
      available: ['Cyprus', 'Australia', 'South Africa', 'Nigeria'],
      restricted: ['United States', 'Belgium', 'Iran']
    },
    categories: ['market-makers', 'regulated-brokers', 'micro-account', 'educational-brokers'],
    cta_text: 'Visit XM',
    cta_url: 'https://xm.com'
  },
  {
    id: '4',
    name: 'OANDA',
    slug: 'oanda',
    logo_url: '/images/brokers/oanda.png',
    website_url: 'https://oanda.com',
    overall_rating: 4.6,
    min_deposit: 0,
    min_deposit_currency: 'USD',
    max_leverage: 50, // US regulation
    spreads_from: 0.8,
    commission: 'None on standard',
    regulated: true,
    regulations: [
      { regulator: 'CFTC', license_number: '1234567', country: 'United States' },
      { regulator: 'FCA', license_number: '542574', country: 'United Kingdom' }
    ],
    platforms: ['OANDA Trade', 'MetaTrader 4', 'TradingView'],
    instruments_total: 70,
    pros: ['No minimum deposit', 'Excellent research', 'US regulated'],
    cons: ['Lower leverage for US clients', 'Limited cryptocurrency pairs'],
    founded_year: 1996,
    headquarters: 'New York, USA',
    demo_account: true,
    swap_free: false,
    live_chat: true,
    phone_support: true,
    features: ['Advanced Charting', 'Economic Calendar', 'Position Book'],
    country_availability: {
      available: ['United States', 'United Kingdom', 'Canada', 'Singapore'],
      restricted: ['Belgium', 'Iran', 'North Korea']
    },
    categories: ['market-makers', 'regulated-brokers', 'micro-account'],
    cta_text: 'Visit OANDA',
    cta_url: 'https://oanda.com'
  },
  {
    id: '5',
    name: 'eToro',
    slug: 'etoro',
    logo_url: '/images/brokers/etoro.png',
    website_url: 'https://etoro.com',
    overall_rating: 4.3,
    min_deposit: 200,
    min_deposit_currency: 'USD',
    max_leverage: 30, // ESMA regulation
    spreads_from: 1.0,
    commission: 'None on forex',
    regulated: true,
    regulations: [
      { regulator: 'CySEC', license_number: '109/10', country: 'Cyprus' },
      { regulator: 'FCA', license_number: '583263', country: 'United Kingdom' }
    ],
    platforms: ['eToro Platform', 'eToro Mobile App'],
    instruments_total: 3000,
    pros: ['Social trading features', 'Copy trading', 'Multi-asset platform'],
    cons: ['Limited MetaTrader support', 'Withdrawal fees'],
    founded_year: 2007,
    headquarters: 'Tel Aviv, Israel',
    demo_account: true,
    swap_free: false,
    live_chat: true,
    phone_support: false,
    features: ['Social Trading', 'Copy Trading', 'Multi-Asset', 'CopyPortfolios'],
    country_availability: {
      available: ['United Kingdom', 'Cyprus', 'Germany', 'Australia'],
      restricted: ['United States', 'Belgium', 'Canada']
    },
    categories: ['social-trading', 'regulated-brokers', 'market-makers'],
    cta_text: 'Visit eToro',
    cta_url: 'https://etoro.com'
  }
];

function applyFilters(brokers: Broker[], query: BrokerSearchQuery): Broker[] {
  let filtered = [...brokers];

  // Text search
  if (query.q && query.q.trim()) {
    const searchTerm = query.q.toLowerCase();
    filtered = filtered.filter(broker =>
      broker.name.toLowerCase().includes(searchTerm) ||
      broker.headquarters?.toLowerCase().includes(searchTerm) ||
      broker.pros?.some(pro => pro.toLowerCase().includes(searchTerm)) ||
      broker.features?.some(feature => feature.toLowerCase().includes(searchTerm)) ||
      broker.platforms?.some(platform => platform.toLowerCase().includes(searchTerm))
    );
  }

  // Category filter
  if (query.category) {
    filtered = filtered.filter(broker =>
      broker.categories?.includes(query.category!)
    );
  }

  // Country filter
  if (query.country) {
    filtered = filtered.filter(broker =>
      broker.country_availability?.available?.includes(query.country!) ||
      broker.headquarters?.toLowerCase().includes(query.country!.toLowerCase())
    );
  }

  // Regulation filter
  if (query.regulated === 'true') {
    filtered = filtered.filter(broker => broker.regulated === true);
  } else if (query.regulated === 'false') {
    filtered = filtered.filter(broker => broker.regulated !== true);
  }

  // Min deposit filter
  if (query.min_deposit) {
    const [min, max] = query.min_deposit.split('-').map(Number);
    filtered = filtered.filter(broker => {
      if (!broker.min_deposit) return query.min_deposit === '0';
      if (max) {
        return broker.min_deposit >= min && broker.min_deposit <= max;
      }
      return broker.min_deposit >= min;
    });
  }

  // Leverage filter
  if (query.max_leverage) {
    const leverage = parseInt(query.max_leverage);
    filtered = filtered.filter(broker =>
      broker.max_leverage && broker.max_leverage >= leverage
    );
  }

  // Platform filter
  if (query.platform) {
    filtered = filtered.filter(broker =>
      broker.platforms?.some(p => p.toLowerCase() === query.platform!.toLowerCase())
    );
  }

  // Features filter
  if (query.features) {
    const requiredFeatures = query.features.split(',').map(f => f.trim().toLowerCase());
    filtered = filtered.filter(broker => {
      const brokerFeatures = [
        ...(broker.features || []),
        broker.demo_account && 'Demo Account',
        broker.swap_free && 'Swap-Free Accounts',
        broker.live_chat && 'Live Chat',
        broker.phone_support && 'Phone Support'
      ].filter(Boolean).map(f => f!.toLowerCase());
      
      return requiredFeatures.some(feature =>
        brokerFeatures.some(bf => bf.includes(feature))
      );
    });
  }

  // Rating filter
  if (query.rating) {
    const minRating = parseFloat(query.rating);
    filtered = filtered.filter(broker => broker.overall_rating >= minRating);
  }

  return filtered;
}

function sortBrokers(brokers: Broker[], sortBy: string, sortOrder: 'asc' | 'desc' = 'desc'): Broker[] {
  const sorted = [...brokers];
  
  sorted.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'rating':
        comparison = a.overall_rating - b.overall_rating;
        break;
      case 'min_deposit':
        comparison = (a.min_deposit || 0) - (b.min_deposit || 0);
        break;
      case 'max_leverage':
        comparison = (a.max_leverage || 0) - (b.max_leverage || 0);
        break;
      case 'founded_year':
        comparison = (a.founded_year || 0) - (b.founded_year || 0);
        break;
      case 'spreads':
        comparison = (a.spreads_from || 0) - (b.spreads_from || 0);
        break;
      default:
        comparison = b.overall_rating - a.overall_rating; // Default to rating desc
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });
  
  return sorted;
}

function generateFacets(brokers: Broker[]): SearchResponse['facets'] {
  const categoryCount: { [key: string]: number } = {};
  const countryCount: { [key: string]: number } = {};
  const platformCount: { [key: string]: number } = {};
  const regulatorCount: { [key: string]: number } = {};

  brokers.forEach(broker => {
    // Categories
    broker.categories?.forEach(cat => {
      categoryCount[cat] = (categoryCount[cat] || 0) + 1;
    });

    // Countries
    broker.country_availability?.available?.forEach(country => {
      countryCount[country] = (countryCount[country] || 0) + 1;
    });

    // Platforms
    broker.platforms?.forEach(platform => {
      platformCount[platform] = (platformCount[platform] || 0) + 1;
    });

    // Regulators
    broker.regulations?.forEach(reg => {
      regulatorCount[reg.regulator] = (regulatorCount[reg.regulator] || 0) + 1;
    });
  });

  return {
    categories: Object.entries(categoryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    countries: Object.entries(countryCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    platforms: Object.entries(platformCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count),
    regulators: Object.entries(regulatorCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SearchResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const query: BrokerSearchQuery = req.query;
    
    // Apply filters
    let filteredBrokers = applyFilters(mockBrokers, query);
    
    // Apply sorting
    const sortBy = query.sort_by || 'rating';
    const sortOrder = query.sort_order || 'desc';
    filteredBrokers = sortBrokers(filteredBrokers, sortBy, sortOrder);
    
    // Pagination
    const page = parseInt(query.page || '1');
    const limit = parseInt(query.limit || '10');
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    const paginatedBrokers = filteredBrokers.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredBrokers.length / limit);
    
    // Generate facets from all filtered results (before pagination)
    const facets = generateFacets(filteredBrokers);
    
    // Build response
    const response: SearchResponse = {
      brokers: paginatedBrokers,
      total_count: filteredBrokers.length,
      page,
      limit,
      total_pages: totalPages,
      filters_applied: {
        search: query.q,
        category: query.category,
        country: query.country,
        regulated: query.regulated,
        min_deposit: query.min_deposit,
        max_leverage: query.max_leverage,
        platform: query.platform,
        features: query.features,
        rating: query.rating,
        sort_by: sortBy,
        sort_order: sortOrder
      },
      facets
    };
    
    // Add cache headers for performance
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
    
    return res.status(200).json(response);
    
  } catch (error) {
    console.error('Broker search error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}