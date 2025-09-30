import { NextApiRequest, NextApiResponse } from 'next';

interface Country {
  id: string;
  code: string;
  name: string;
  slug: string;
  flag_emoji: string;
  description?: string;
  regulatory_body?: string;
  regulatory_body_full_name?: string;
  broker_count: number;
  regulated_broker_count: number;
  top_brokers: string[];
  is_popular: boolean;
  region: string;
  timezone?: string;
  currency?: string;
  language?: string;
  metadata?: {
    created_at: string;
    updated_at: string;
    status: 'active' | 'inactive';
  };
}

interface Region {
  id: string;
  name: string;
  slug: string;
  description: string;
  total_countries: number;
  total_brokers: number;
  countries: string[]; // Array of country IDs
  color: string;
}

interface CountriesResponse {
  countries: Country[];
  regions: Region[];
  popular_countries: Country[];
  total_count: number;
  stats: {
    total_countries: number;
    total_brokers: number;
    total_regulated_brokers: number;
  };
}

const mockCountries: Country[] = [
  {
    id: 'us',
    code: 'US',
    name: 'United States',
    slug: 'united-states',
    flag_emoji: '🇺🇸',
    description: 'Find regulated forex brokers operating in the United States under CFTC and NFA oversight.',
    regulatory_body: 'CFTC/NFA',
    regulatory_body_full_name: 'Commodity Futures Trading Commission',
    broker_count: 45,
    regulated_broker_count: 32,
    top_brokers: ['OANDA', 'Interactive Brokers', 'TD Ameritrade', 'Forex.com', 'Charles Schwab'],
    is_popular: true,
    region: 'north-america',
    timezone: 'EST/EDT',
    currency: 'USD',
    language: 'English',
    metadata: {
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      status: 'active'
    }
  },
  {
    id: 'uk',
    code: 'GB',
    name: 'United Kingdom',
    slug: 'united-kingdom',
    flag_emoji: '🇬🇧',
    description: 'Discover FCA-regulated forex brokers serving UK residents with comprehensive investor protection.',
    regulatory_body: 'FCA',
    regulatory_body_full_name: 'Financial Conduct Authority',
    broker_count: 67,
    regulated_broker_count: 54,
    top_brokers: ['IG', 'CMC Markets', 'Plus500', 'Saxo Bank', 'Admiral Markets'],
    is_popular: true,
    region: 'europe',
    timezone: 'GMT/BST',
    currency: 'GBP',
    language: 'English',
    metadata: {
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      status: 'active'
    }
  },
  {
    id: 'au',
    code: 'AU',
    name: 'Australia',
    slug: 'australia',
    flag_emoji: '🇦🇺',
    description: 'Explore ASIC-regulated forex brokers in Australia with strong consumer protection and transparent pricing.',
    regulatory_body: 'ASIC',
    regulatory_body_full_name: 'Australian Securities and Investments Commission',
    broker_count: 38,
    regulated_broker_count: 31,
    top_brokers: ['IC Markets', 'Pepperstone', 'FP Markets', 'IG Australia', 'CMC Markets'],
    is_popular: true,
    region: 'asia-pacific',
    timezone: 'AEST/AEDT',
    currency: 'AUD',
    language: 'English',
    metadata: {
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      status: 'active'
    }
  },
  {
    id: 'de',
    code: 'DE',
    name: 'Germany',
    slug: 'germany',
    flag_emoji: '🇩🇪',
    description: 'Find BaFin-regulated forex brokers in Germany with strict European regulatory standards.',
    regulatory_body: 'BaFin',
    regulatory_body_full_name: 'Federal Financial Supervisory Authority',
    broker_count: 29,
    regulated_broker_count: 25,
    top_brokers: ['Admiral Markets', 'XTB', 'eToro', 'Plus500', 'IG Germany'],
    is_popular: true,
    region: 'europe',
    timezone: 'CET/CEST',
    currency: 'EUR',
    language: 'German',
    metadata: {
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      status: 'active'
    }
  },
  {
    id: 'cy',
    code: 'CY',
    name: 'Cyprus',
    slug: 'cyprus',
    flag_emoji: '🇨🇾',
    description: 'Discover CySEC-regulated forex brokers in Cyprus, the forex trading hub of Europe.',
    regulatory_body: 'CySEC',
    regulatory_body_full_name: 'Cyprus Securities and Exchange Commission',
    broker_count: 156,
    regulated_broker_count: 142,
    top_brokers: ['XM', 'HotForex', 'FxPro', 'AvaTrade', 'IronFX'],
    is_popular: true,
    region: 'europe',
    timezone: 'EET/EEST',
    currency: 'EUR',
    language: 'Greek/English',
    metadata: {
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      status: 'active'
    }
  },
  {
    id: 'jp',
    code: 'JP',
    name: 'Japan',
    slug: 'japan',
    flag_emoji: '🇯🇵',
    description: 'Explore JFSA-regulated forex brokers in Japan with some of the world\'s highest leverage limits.',
    regulatory_body: 'JFSA',
    regulatory_body_full_name: 'Japan Financial Services Agency',
    broker_count: 23,
    regulated_broker_count: 23,
    top_brokers: ['GMO Click', 'DMMFX', 'SBI FXTrade', 'MATSUI FX', 'Hirose Tusyo'],
    is_popular: true,
    region: 'asia-pacific',
    timezone: 'JST',
    currency: 'JPY',
    language: 'Japanese',
    metadata: {
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      status: 'active'
    }
  },
  {
    id: 'sg',
    code: 'SG',
    name: 'Singapore',
    slug: 'singapore',
    flag_emoji: '🇸🇬',
    description: 'Find MAS-regulated forex brokers in Singapore, Asia\'s premier financial center.',
    regulatory_body: 'MAS',
    regulatory_body_full_name: 'Monetary Authority of Singapore',
    broker_count: 34,
    regulated_broker_count: 28,
    top_brokers: ['Saxo Bank', 'IG', 'FXCM', 'OANDA', 'Interactive Brokers'],
    is_popular: true,
    region: 'asia-pacific',
    timezone: 'SGT',
    currency: 'SGD',
    language: 'English',
    metadata: {
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      status: 'active'
    }
  },
  {
    id: 'ch',
    code: 'CH',
    name: 'Switzerland',
    slug: 'switzerland',
    flag_emoji: '🇨🇭',
    description: 'Discover FINMA-regulated forex brokers in Switzerland with premium banking standards.',
    regulatory_body: 'FINMA',
    regulatory_body_full_name: 'Swiss Financial Market Supervisory Authority',
    broker_count: 18,
    regulated_broker_count: 16,
    top_brokers: ['Dukascopy', 'Swissquote', 'Bank Vontobel', 'Cornèr Bank', 'PostFinance'],
    is_popular: true,
    region: 'europe',
    timezone: 'CET/CEST',
    currency: 'CHF',
    language: 'German/French/Italian',
    metadata: {
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      status: 'active'
    }
  },
  {
    id: 'ca',
    code: 'CA',
    name: 'Canada',
    slug: 'canada',
    flag_emoji: '🇨🇦',
    description: 'Find IIROC-regulated forex brokers serving Canadian traders.',
    regulatory_body: 'IIROC',
    regulatory_body_full_name: 'Investment Industry Regulatory Organization of Canada',
    broker_count: 28,
    regulated_broker_count: 22,
    top_brokers: ['OANDA', 'Interactive Brokers', 'Forex.com', 'CMC Markets', 'IG Canada'],
    is_popular: false,
    region: 'north-america',
    timezone: 'EST/EDT',
    currency: 'CAD',
    language: 'English/French',
    metadata: {
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      status: 'active'
    }
  },
  {
    id: 'fr',
    code: 'FR',
    name: 'France',
    slug: 'france',
    flag_emoji: '🇫🇷',
    description: 'Explore AMF-regulated forex brokers in France with European investor protection.',
    regulatory_body: 'AMF',
    regulatory_body_full_name: 'Autorité des Marchés Financiers',
    broker_count: 21,
    regulated_broker_count: 18,
    top_brokers: ['IG France', 'Admiral Markets', 'AvaTrade', 'XTB', 'Plus500'],
    is_popular: false,
    region: 'europe',
    timezone: 'CET/CEST',
    currency: 'EUR',
    language: 'French',
    metadata: {
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      status: 'active'
    }
  }
];

const mockRegions: Region[] = [
  {
    id: 'europe',
    name: 'Europe',
    slug: 'europe',
    description: 'Major financial centers with strong regulatory frameworks and ESMA compliance.',
    total_countries: 12,
    total_brokers: 291,
    countries: ['uk', 'de', 'cy', 'ch', 'fr'],
    color: 'bg-gradient-to-r from-blue-600 to-blue-700'
  },
  {
    id: 'asia-pacific',
    name: 'Asia Pacific',
    slug: 'asia-pacific',
    description: 'Dynamic markets with growing retail trading participation and diverse regulatory approaches.',
    total_countries: 8,
    total_brokers: 95,
    countries: ['au', 'jp', 'sg'],
    color: 'bg-gradient-to-r from-green-600 to-green-700'
  },
  {
    id: 'north-america',
    name: 'North America',
    slug: 'north-america',
    description: 'Mature markets with stringent regulatory oversight and high consumer protection standards.',
    total_countries: 3,
    total_brokers: 73,
    countries: ['us', 'ca'],
    color: 'bg-gradient-to-r from-purple-600 to-purple-700'
  },
  {
    id: 'middle-east-africa',
    name: 'Middle East & Africa',
    slug: 'middle-east-africa',
    description: 'Emerging markets with Islamic finance options and growing trader adoption.',
    total_countries: 6,
    total_brokers: 89,
    countries: [],
    color: 'bg-gradient-to-r from-orange-600 to-red-600'
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CountriesResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { popular_only, region, status } = req.query;

    let filteredCountries = [...mockCountries];

    // Filter by status if specified
    if (status && typeof status === 'string') {
      filteredCountries = filteredCountries.filter(
        country => country.metadata?.status === status
      );
    }

    // Filter by region if specified
    if (region && typeof region === 'string') {
      filteredCountries = filteredCountries.filter(
        country => country.region === region
      );
    }

    // Get popular countries
    const popularCountries = filteredCountries.filter(country => country.is_popular);

    // If only popular countries requested
    if (popular_only === 'true') {
      filteredCountries = popularCountries;
    }

    // Sort countries by broker count (descending)
    filteredCountries.sort((a, b) => b.broker_count - a.broker_count);

    // Calculate stats
    const stats = {
      total_countries: filteredCountries.length,
      total_brokers: filteredCountries.reduce((sum, country) => sum + country.broker_count, 0),
      total_regulated_brokers: filteredCountries.reduce((sum, country) => sum + country.regulated_broker_count, 0)
    };

    const response: CountriesResponse = {
      countries: filteredCountries,
      regions: mockRegions,
      popular_countries: popularCountries,
      total_count: filteredCountries.length,
      stats
    };

    // Set cache headers for performance
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');

    return res.status(200).json(response);

  } catch (error) {
    console.error('Countries API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}