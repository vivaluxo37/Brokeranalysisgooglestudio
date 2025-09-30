import { NextApiRequest, NextApiResponse } from 'next';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  long_description?: string;
  icon?: string;
  color?: string;
  broker_count: number;
  featured_brokers: string[];
  benefits?: string[];
  considerations?: string[];
  metadata?: {
    created_at: string;
    updated_at: string;
    status: 'active' | 'inactive';
  };
}

interface CategoriesResponse {
  categories: Category[];
  total_count: number;
  featured_categories: Category[];
}

const mockCategories: Category[] = [
  {
    id: 'ecn-brokers',
    name: 'ECN Brokers',
    slug: 'ecn-brokers',
    description: 'Electronic Communication Network brokers offering direct market access with tight spreads and transparent pricing.',
    long_description: 'ECN (Electronic Communication Network) brokers provide traders with direct access to the interbank market through an electronic trading network. This model offers transparent pricing, tight spreads, and allows traders to see market depth. ECN brokers typically charge a commission per trade rather than marking up spreads.',
    icon: '📊',
    color: 'bg-blue-600',
    broker_count: 45,
    featured_brokers: ['IC Markets', 'Pepperstone', 'FP Markets', 'Dukascopy', 'FXCM Pro'],
    benefits: [
      'Direct market access with transparent pricing',
      'Tight spreads, often starting from 0 pips',
      'No conflicts of interest as brokers don\'t take opposite trades',
      'Access to market depth and Level II pricing',
      'Faster execution speeds'
    ],
    considerations: [
      'Commission charges in addition to spreads',
      'Higher minimum deposits typically required',
      'More suitable for active traders',
      'May have wider spreads during low liquidity periods'
    ],
    metadata: {
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      status: 'active'
    }
  },
  {
    id: 'market-makers',
    name: 'Market Makers',
    slug: 'market-makers',
    description: 'Brokers that provide liquidity by taking the opposite side of your trades, often with fixed spreads.',
    long_description: 'Market maker brokers provide liquidity to their clients by taking the opposite side of trades. They typically offer fixed spreads and may not charge separate commissions. While this model can create potential conflicts of interest, many market makers are well-regulated and provide excellent trading conditions.',
    icon: '💱',
    color: 'bg-green-600',
    broker_count: 38,
    featured_brokers: ['OANDA', 'FXCM', 'Plus500', 'AvaTrade', 'Admiral Markets'],
    benefits: [
      'Fixed spreads provide cost certainty',
      'No commission charges on most accounts',
      'Lower minimum deposits typically accepted',
      'Good for beginners and casual traders',
      'Guaranteed liquidity even in volatile markets'
    ],
    considerations: [
      'Potential conflicts of interest',
      'Spreads may be wider than ECN brokers',
      'Less transparency in pricing',
      'May experience requotes during high volatility'
    ],
    metadata: {
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      status: 'active'
    }
  },
  {
    id: 'stp-brokers',
    name: 'STP Brokers',
    slug: 'stp-brokers',
    description: 'Straight Through Processing brokers that route orders directly to liquidity providers without dealing desk intervention.',
    long_description: 'STP (Straight Through Processing) brokers route client orders directly to liquidity providers such as banks, financial institutions, and ECNs without manual intervention. This model combines elements of both ECN and market maker models, offering competitive spreads while maintaining execution transparency.',
    icon: '🌐',
    color: 'bg-purple-600',
    broker_count: 52,
    featured_brokers: ['XM', 'FXTM', 'Admiral Markets', 'HotForex', 'FxPro'],
    benefits: [
      'Direct routing to multiple liquidity providers',
      'Competitive variable spreads',
      'No dealing desk intervention',
      'Fast order execution',
      'Access to institutional liquidity'
    ],
    considerations: [
      'Spreads can vary based on market conditions',
      'May experience wider spreads during news events',
      'Execution speed depends on liquidity provider response',
      'Some brokers may still have conflicts of interest'
    ],
    metadata: {
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      status: 'active'
    }
  },
  {
    id: 'regulated-brokers',
    name: 'Highly Regulated',
    slug: 'regulated-brokers',
    description: 'Brokers regulated by top-tier financial authorities like FCA, ASIC, CySEC, and CFTC.',
    long_description: 'Highly regulated brokers operate under the oversight of prestigious financial regulators such as the FCA (UK), ASIC (Australia), CySEC (Cyprus), and CFTC (USA). These brokers must meet strict capital requirements, segregate client funds, and adhere to comprehensive operational standards.',
    icon: '🛡️',
    color: 'bg-red-600',
    broker_count: 67,
    featured_brokers: ['eToro', 'Interactive Brokers', 'Saxo Bank', 'IG', 'CMC Markets'],
    benefits: [
      'Strong regulatory oversight and compliance',
      'Client fund segregation and protection',
      'Compensation schemes available',
      'Regular audits and financial reporting',
      'Dispute resolution mechanisms'
    ],
    considerations: [
      'May have more restrictions on leverage and products',
      'Higher operational costs may lead to higher fees',
      'Stricter KYC and verification processes',
      'Limited availability in some jurisdictions'
    ],
    metadata: {
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      status: 'active'
    }
  },
  {
    id: 'social-trading',
    name: 'Social Trading',
    slug: 'social-trading',
    description: 'Brokers offering copy trading and social trading features to follow and copy successful traders.',
    long_description: 'Social trading brokers provide platforms where traders can follow, interact with, and copy the strategies of successful traders. This approach democratizes trading by allowing novice traders to benefit from the expertise of experienced professionals.',
    icon: '👥',
    color: 'bg-indigo-600',
    broker_count: 23,
    featured_brokers: ['eToro', 'ZuluTrade', 'Darwinex', 'NAGA', 'Ayondo'],
    benefits: [
      'Learn from successful traders',
      'Automated copying of trades',
      'Social interaction and community',
      'Performance transparency',
      'Diversification opportunities'
    ],
    considerations: [
      'Past performance doesn\'t guarantee future results',
      'Additional fees for copying trades',
      'Risk of following poor strategies',
      'Limited control over individual trades'
    ],
    metadata: {
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      status: 'active'
    }
  },
  {
    id: 'micro-account',
    name: 'Micro Accounts',
    slug: 'micro-account',
    description: 'Brokers offering micro accounts with low minimum deposits, perfect for beginners and small-scale traders.',
    long_description: 'Micro account brokers cater to beginners and small-scale traders by offering very low minimum deposits, often as little as $1-$50. These accounts allow traders to start with small capital while learning the markets and testing strategies.',
    icon: '⚙️',
    color: 'bg-yellow-600',
    broker_count: 41,
    featured_brokers: ['XM', 'Exness', 'HotForex', 'InstaForex', 'FBS'],
    benefits: [
      'Very low minimum deposits',
      'Perfect for beginners to start learning',
      'Small position sizes available',
      'Lower risk exposure',
      'Affordable way to test strategies'
    ],
    considerations: [
      'Higher spreads relative to standard accounts',
      'Limited features compared to premium accounts',
      'Smaller profit potential',
      'May have restrictions on certain instruments'
    ],
    metadata: {
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      status: 'active'
    }
  },
  {
    id: 'educational-brokers',
    name: 'Educational Resources',
    slug: 'educational-brokers',
    description: 'Brokers providing comprehensive educational materials, webinars, and trading courses for skill development.',
    long_description: 'Educational brokers prioritize trader education by offering comprehensive learning resources including webinars, video courses, eBooks, market analysis, and one-on-one training sessions. These brokers are ideal for traders who want to continuously improve their skills.',
    icon: '🎓',
    color: 'bg-teal-600',
    broker_count: 29,
    featured_brokers: ['XM', 'Admiral Markets', 'AvaTrade', 'FXTM', 'FP Markets'],
    benefits: [
      'Comprehensive educational materials',
      'Regular webinars and seminars',
      'Personal account managers',
      'Market analysis and insights',
      'Demo accounts with extended access'
    ],
    considerations: [
      'Educational quality varies between brokers',
      'May require higher deposits for premium education',
      'Time investment required to benefit fully',
      'Some resources may be marketing-focused'
    ],
    metadata: {
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      status: 'active'
    }
  },
  {
    id: 'mobile-trading',
    name: 'Mobile Trading',
    slug: 'mobile-trading',
    description: 'Brokers with excellent mobile trading apps and platforms optimized for smartphone and tablet trading.',
    long_description: 'Mobile trading specialists offer cutting-edge mobile applications with full trading functionality, advanced charting, real-time notifications, and intuitive interfaces designed for trading on smartphones and tablets.',
    icon: '📱',
    color: 'bg-pink-600',
    broker_count: 56,
    featured_brokers: ['IG', 'Plus500', 'Capital.com', 'eToro', 'XTB'],
    benefits: [
      'Trade anywhere, anytime',
      'Advanced mobile charting tools',
      'Push notifications for market events',
      'Touch-optimized interfaces',
      'Offline chart analysis'
    ],
    considerations: [
      'Smaller screens may limit analysis',
      'Data usage concerns',
      'Battery life impact during active trading',
      'Internet connectivity requirements'
    ],
    metadata: {
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-20T10:00:00Z',
      status: 'active'
    }
  }
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CategoriesResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { featured_only, status } = req.query;

    let filteredCategories = [...mockCategories];

    // Filter by status if specified
    if (status && typeof status === 'string') {
      filteredCategories = filteredCategories.filter(
        cat => cat.metadata?.status === status
      );
    }

    // Get featured categories (top by broker count)
    const featuredCategories = [...filteredCategories]
      .sort((a, b) => b.broker_count - a.broker_count)
      .slice(0, 4);

    // If only featured categories requested
    if (featured_only === 'true') {
      filteredCategories = featuredCategories;
    }

    // Sort all categories by broker count (descending)
    filteredCategories.sort((a, b) => b.broker_count - a.broker_count);

    const response: CategoriesResponse = {
      categories: filteredCategories,
      total_count: filteredCategories.length,
      featured_categories: featuredCategories
    };

    // Set cache headers for performance
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');

    return res.status(200).json(response);

  } catch (error) {
    console.error('Categories API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}