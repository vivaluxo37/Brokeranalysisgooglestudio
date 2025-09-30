import { NextApiRequest, NextApiResponse } from 'next';

interface BrokerDetails {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  website_url: string;
  overall_rating: number;
  
  // Basic Info
  founded_year?: number;
  headquarters?: string;
  employees?: number;
  parent_company?: string;
  
  // Trading Conditions
  min_deposit?: number;
  min_deposit_currency?: string;
  max_leverage?: number;
  spreads_from?: number;
  commission?: string;
  base_currency?: string;
  instruments_total?: number;
  
  // Regulation
  regulated?: boolean;
  regulations?: Array<{
    regulator: string;
    license_number?: string;
    country: string;
    status: 'active' | 'suspended' | 'revoked';
    website_url?: string;
  }>;
  
  // Platforms & Technology
  platforms?: Array<{
    name: string;
    type: 'desktop' | 'web' | 'mobile';
    supported_os?: string[];
    features?: string[];
  }>;
  
  // Account Types
  account_types?: Array<{
    name: string;
    min_deposit?: number;
    spread_from?: number;
    commission?: string;
    leverage?: number;
    features?: string[];
  }>;
  
  // Features & Services
  demo_account?: boolean;
  swap_free?: boolean;
  copy_trading?: boolean;
  social_trading?: boolean;
  vps_hosting?: boolean;
  islamic_accounts?: boolean;
  managed_accounts?: boolean;
  
  // Support
  live_chat?: boolean;
  phone_support?: boolean;
  email_support?: boolean;
  support_languages?: string[];
  support_hours?: string;
  
  // Educational
  educational_resources?: {
    webinars?: boolean;
    video_tutorials?: boolean;
    ebooks?: boolean;
    market_analysis?: boolean;
    trading_tools?: boolean;
  };
  
  // Funding
  payment_methods?: Array<{
    type: 'bank_transfer' | 'credit_card' | 'debit_card' | 'e_wallet' | 'crypto';
    name: string;
    deposit_time?: string;
    withdrawal_time?: string;
    fees?: {
      deposit?: string;
      withdrawal?: string;
    };
  }>;
  
  // Costs & Fees
  fees?: {
    inactivity_fee?: string;
    withdrawal_fee?: string;
    currency_conversion?: string;
    overnight_fee?: string;
    guaranteed_stop_loss?: string;
  };
  
  // Ratings Breakdown
  ratings?: {
    trust: number;
    platform: number;
    costs: number;
    service: number;
    features: number;
  };
  
  // Pros & Cons
  pros?: string[];
  cons?: string[];
  
  // Country Availability
  country_availability?: {
    available?: string[];
    restricted?: string[];
  };
  
  // Categories
  categories?: string[];
  
  // Reviews Summary
  reviews_summary?: {
    total_reviews: number;
    average_rating: number;
    rating_distribution: {
      5: number;
      4: number;
      3: number;
      2: number;
      1: number;
    };
    recent_reviews?: Array<{
      id: string;
      rating: number;
      title: string;
      comment: string;
      author: string;
      date: string;
      verified: boolean;
    }>;
  };
  
  // Promotions
  promotions?: Array<{
    id: string;
    title: string;
    description: string;
    type: 'welcome_bonus' | 'deposit_bonus' | 'cashback' | 'competition';
    terms_url?: string;
    valid_until?: string;
    new_clients_only?: boolean;
  }>;
  
  // Call to Action
  cta_text?: string;
  cta_url?: string;
  
  // Metadata
  last_updated: string;
  status: 'active' | 'inactive' | 'under_review';
}

// Mock broker data - In production, this would come from your database
const mockBrokerData: { [key: string]: BrokerDetails } = {
  'ic-markets': {
    id: '1',
    name: 'IC Markets',
    slug: 'ic-markets',
    logo_url: '/images/brokers/ic-markets.png',
    website_url: 'https://icmarkets.com',
    overall_rating: 4.8,
    
    founded_year: 2007,
    headquarters: 'Sydney, Australia',
    employees: 200,
    parent_company: 'International Capital Markets Pty Ltd',
    
    min_deposit: 200,
    min_deposit_currency: 'USD',
    max_leverage: 500,
    spreads_from: 0.0,
    commission: '$3.50 per lot',
    base_currency: 'USD',
    instruments_total: 232,
    
    regulated: true,
    regulations: [
      {
        regulator: 'ASIC',
        license_number: '335692',
        country: 'Australia',
        status: 'active',
        website_url: 'https://asic.gov.au'
      },
      {
        regulator: 'CySEC',
        license_number: '362/18',
        country: 'Cyprus',
        status: 'active',
        website_url: 'https://cysec.gov.cy'
      }
    ],
    
    platforms: [
      {
        name: 'MetaTrader 4',
        type: 'desktop',
        supported_os: ['Windows', 'Mac'],
        features: ['Expert Advisors', 'Custom Indicators', 'Strategy Tester']
      },
      {
        name: 'MetaTrader 5',
        type: 'desktop',
        supported_os: ['Windows', 'Mac'],
        features: ['Market Depth', 'Economic Calendar', 'MQL5 IDE']
      },
      {
        name: 'cTrader',
        type: 'desktop',
        supported_os: ['Windows', 'Mac'],
        features: ['Level II Pricing', 'cBots', 'Advanced Charting']
      }
    ],
    
    account_types: [
      {
        name: 'Raw Spread',
        min_deposit: 200,
        spread_from: 0.0,
        commission: '$3.50 per side',
        leverage: 500,
        features: ['ECN Execution', 'Raw Spreads', 'No Requotes']
      },
      {
        name: 'Standard',
        min_deposit: 200,
        spread_from: 1.0,
        commission: 'None',
        leverage: 500,
        features: ['Market Maker Model', 'Fixed Spreads', 'Instant Execution']
      }
    ],
    
    demo_account: true,
    swap_free: true,
    copy_trading: true,
    social_trading: false,
    vps_hosting: true,
    islamic_accounts: true,
    managed_accounts: false,
    
    live_chat: true,
    phone_support: true,
    email_support: true,
    support_languages: ['English', 'Chinese', 'Arabic', 'Spanish'],
    support_hours: '24/5',
    
    educational_resources: {
      webinars: true,
      video_tutorials: true,
      ebooks: true,
      market_analysis: true,
      trading_tools: true
    },
    
    payment_methods: [
      {
        type: 'bank_transfer',
        name: 'Bank Wire Transfer',
        deposit_time: '1-3 business days',
        withdrawal_time: '3-5 business days',
        fees: { deposit: 'Free', withdrawal: 'Free' }
      },
      {
        type: 'credit_card',
        name: 'Visa/Mastercard',
        deposit_time: 'Instant',
        withdrawal_time: '3-5 business days',
        fees: { deposit: 'Free', withdrawal: 'Free' }
      },
      {
        type: 'e_wallet',
        name: 'Skrill',
        deposit_time: 'Instant',
        withdrawal_time: '1 business day',
        fees: { deposit: 'Free', withdrawal: 'Free' }
      }
    ],
    
    fees: {
      inactivity_fee: 'None',
      withdrawal_fee: 'Free',
      currency_conversion: '0.7%',
      overnight_fee: 'Variable',
      guaranteed_stop_loss: '$3 per order'
    },
    
    ratings: {
      trust: 4.9,
      platform: 4.8,
      costs: 4.7,
      service: 4.6,
      features: 4.8
    },
    
    pros: [
      'Raw spreads from 0.0 pips',
      'Excellent execution speeds',
      'Strong regulation (ASIC & CySEC)',
      'Professional trading platforms',
      'Comprehensive educational resources'
    ],
    
    cons: [
      'Higher minimum deposit than some competitors',
      'Limited social trading features',
      'Commission-based pricing on raw spread account'
    ],
    
    country_availability: {
      available: ['Australia', 'Cyprus', 'South Africa', 'Kenya', 'Nigeria'],
      restricted: ['United States', 'Canada', 'Belgium', 'Iran', 'North Korea']
    },
    
    categories: ['ecn-brokers', 'regulated-brokers'],
    
    reviews_summary: {
      total_reviews: 1247,
      average_rating: 4.8,
      rating_distribution: { 5: 890, 4: 267, 3: 67, 2: 15, 1: 8 },
      recent_reviews: [
        {
          id: '1',
          rating: 5,
          title: 'Excellent execution and spreads',
          comment: 'Been trading with IC Markets for 2 years. The spreads are truly raw and execution is lightning fast.',
          author: 'Sarah M.',
          date: '2024-01-15',
          verified: true
        },
        {
          id: '2',
          rating: 4,
          title: 'Great platforms, higher minimum deposit',
          comment: 'Love the cTrader platform but the $200 minimum deposit was a bit high when starting out.',
          author: 'James L.',
          date: '2024-01-12',
          verified: true
        }
      ]
    },
    
    promotions: [
      {
        id: '1',
        title: 'Welcome Trading Credit',
        description: 'Get up to $5,000 trading credit on your first deposit',
        type: 'welcome_bonus',
        terms_url: 'https://icmarkets.com/terms',
        valid_until: '2024-12-31',
        new_clients_only: true
      }
    ],
    
    cta_text: 'Visit IC Markets',
    cta_url: 'https://icmarkets.com',
    
    last_updated: '2024-01-20T10:00:00Z',
    status: 'active'
  },
  
  'oanda': {
    id: '4',
    name: 'OANDA',
    slug: 'oanda',
    logo_url: '/images/brokers/oanda.png',
    website_url: 'https://oanda.com',
    overall_rating: 4.6,
    
    founded_year: 1996,
    headquarters: 'New York, USA',
    employees: 800,
    parent_company: 'OANDA Corporation',
    
    min_deposit: 0,
    min_deposit_currency: 'USD',
    max_leverage: 50, // US regulation
    spreads_from: 0.8,
    commission: 'None',
    base_currency: 'USD',
    instruments_total: 70,
    
    regulated: true,
    regulations: [
      {
        regulator: 'CFTC',
        license_number: '1234567',
        country: 'United States',
        status: 'active',
        website_url: 'https://cftc.gov'
      },
      {
        regulator: 'FCA',
        license_number: '542574',
        country: 'United Kingdom',
        status: 'active',
        website_url: 'https://fca.org.uk'
      }
    ],
    
    platforms: [
      {
        name: 'OANDA Trade',
        type: 'web',
        supported_os: ['Browser-based'],
        features: ['Advanced Charting', 'Position Book', 'Economic Calendar']
      },
      {
        name: 'MetaTrader 4',
        type: 'desktop',
        supported_os: ['Windows', 'Mac'],
        features: ['Expert Advisors', 'Custom Indicators']
      }
    ],
    
    account_types: [
      {
        name: 'Core Pricing',
        min_deposit: 0,
        spread_from: 0.8,
        commission: 'None',
        leverage: 50,
        features: ['No Minimum Deposit', 'Fractional Pip Pricing']
      }
    ],
    
    demo_account: true,
    swap_free: false,
    copy_trading: false,
    social_trading: false,
    vps_hosting: false,
    islamic_accounts: false,
    managed_accounts: false,
    
    live_chat: true,
    phone_support: true,
    email_support: true,
    support_languages: ['English', 'Spanish', 'French', 'German', 'Japanese'],
    support_hours: '24/5',
    
    ratings: {
      trust: 4.8,
      platform: 4.5,
      costs: 4.3,
      service: 4.7,
      features: 4.4
    },
    
    pros: [
      'No minimum deposit requirement',
      'Excellent research and analysis',
      'Strong regulation in US and UK',
      'Fractional pip pricing',
      'Reliable execution'
    ],
    
    cons: [
      'Lower leverage for US clients (50:1 max)',
      'Limited cryptocurrency trading',
      'No social trading features',
      'Higher spreads than ECN brokers'
    ],
    
    country_availability: {
      available: ['United States', 'United Kingdom', 'Canada', 'Singapore', 'Japan'],
      restricted: ['Belgium', 'Iran', 'North Korea', 'Myanmar']
    },
    
    categories: ['market-makers', 'regulated-brokers', 'micro-account'],
    
    cta_text: 'Visit OANDA',
    cta_url: 'https://oanda.com',
    
    last_updated: '2024-01-20T10:00:00Z',
    status: 'active'
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<BrokerDetails | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { slug } = req.query;

    if (!slug || typeof slug !== 'string') {
      return res.status(400).json({ error: 'Broker slug is required' });
    }

    const brokerData = mockBrokerData[slug];

    if (!brokerData) {
      return res.status(404).json({ error: 'Broker not found' });
    }

    // Set cache headers for performance
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=7200');

    return res.status(200).json(brokerData);

  } catch (error) {
    console.error('Broker details API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}