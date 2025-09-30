import { NextApiRequest, NextApiResponse } from 'next';

interface SuggestionItem {
  id: string;
  name: string;
  slug: string;
  type: 'broker' | 'category' | 'country' | 'platform' | 'feature';
  logo_url?: string;
  flag_emoji?: string;
  icon?: string;
  count?: number; // For categories/countries - how many brokers
  rating?: number; // For brokers
}

interface SuggestResponse {
  suggestions: SuggestionItem[];
  query: string;
  total_count: number;
}

// Mock data for suggestions
const mockSuggestions = {
  brokers: [
    { id: '1', name: 'IC Markets', slug: 'ic-markets', logo_url: '/images/brokers/ic-markets.png', rating: 4.8 },
    { id: '2', name: 'Pepperstone', slug: 'pepperstone', logo_url: '/images/brokers/pepperstone.png', rating: 4.7 },
    { id: '3', name: 'XM', slug: 'xm', logo_url: '/images/brokers/xm.png', rating: 4.5 },
    { id: '4', name: 'OANDA', slug: 'oanda', logo_url: '/images/brokers/oanda.png', rating: 4.6 },
    { id: '5', name: 'eToro', slug: 'etoro', logo_url: '/images/brokers/etoro.png', rating: 4.3 },
    { id: '6', name: 'Plus500', slug: 'plus500', logo_url: '/images/brokers/plus500.png', rating: 4.1 },
    { id: '7', name: 'AvaTrade', slug: 'avatrade', logo_url: '/images/brokers/avatrade.png', rating: 4.2 },
    { id: '8', name: 'Admiral Markets', slug: 'admiral-markets', logo_url: '/images/brokers/admiral-markets.png', rating: 4.4 },
    { id: '9', name: 'HotForex', slug: 'hotforex', logo_url: '/images/brokers/hotforex.png', rating: 4.3 },
    { id: '10', name: 'FxPro', slug: 'fxpro', logo_url: '/images/brokers/fxpro.png', rating: 4.2 },
    { id: '11', name: 'FP Markets', slug: 'fp-markets', logo_url: '/images/brokers/fp-markets.png', rating: 4.6 },
    { id: '12', name: 'Interactive Brokers', slug: 'interactive-brokers', logo_url: '/images/brokers/ib.png', rating: 4.5 },
    { id: '13', name: 'IG', slug: 'ig', logo_url: '/images/brokers/ig.png', rating: 4.4 },
    { id: '14', name: 'CMC Markets', slug: 'cmc-markets', logo_url: '/images/brokers/cmc-markets.png', rating: 4.3 },
    { id: '15', name: 'Saxo Bank', slug: 'saxo-bank', logo_url: '/images/brokers/saxo-bank.png', rating: 4.7 },
  ],
  categories: [
    { id: 'ecn-brokers', name: 'ECN Brokers', slug: 'ecn-brokers', icon: '📊', count: 45 },
    { id: 'market-makers', name: 'Market Makers', slug: 'market-makers', icon: '💱', count: 38 },
    { id: 'stp-brokers', name: 'STP Brokers', slug: 'stp-brokers', icon: '🌐', count: 52 },
    { id: 'regulated-brokers', name: 'Regulated Brokers', slug: 'regulated-brokers', icon: '🛡️', count: 67 },
    { id: 'social-trading', name: 'Social Trading', slug: 'social-trading', icon: '👥', count: 23 },
    { id: 'micro-account', name: 'Micro Accounts', slug: 'micro-account', icon: '⚙️', count: 41 },
    { id: 'educational-brokers', name: 'Educational Resources', slug: 'educational-brokers', icon: '🎓', count: 29 },
    { id: 'mobile-trading', name: 'Mobile Trading', slug: 'mobile-trading', icon: '📱', count: 56 },
  ],
  countries: [
    { id: 'us', name: 'United States', slug: 'united-states', flag_emoji: '🇺🇸', count: 45 },
    { id: 'uk', name: 'United Kingdom', slug: 'united-kingdom', flag_emoji: '🇬🇧', count: 67 },
    { id: 'au', name: 'Australia', slug: 'australia', flag_emoji: '🇦🇺', count: 38 },
    { id: 'de', name: 'Germany', slug: 'germany', flag_emoji: '🇩🇪', count: 29 },
    { id: 'cy', name: 'Cyprus', slug: 'cyprus', flag_emoji: '🇨🇾', count: 156 },
    { id: 'jp', name: 'Japan', slug: 'japan', flag_emoji: '🇯🇵', count: 23 },
    { id: 'sg', name: 'Singapore', slug: 'singapore', flag_emoji: '🇸🇬', count: 34 },
    { id: 'ch', name: 'Switzerland', slug: 'switzerland', flag_emoji: '🇨🇭', count: 18 },
    { id: 'ca', name: 'Canada', slug: 'canada', flag_emoji: '🇨🇦', count: 28 },
    { id: 'fr', name: 'France', slug: 'france', flag_emoji: '🇫🇷', count: 21 },
  ],
  platforms: [
    { id: 'mt4', name: 'MetaTrader 4', slug: 'metatrader-4', icon: '🔧', count: 120 },
    { id: 'mt5', name: 'MetaTrader 5', slug: 'metatrader-5', icon: '🔧', count: 98 },
    { id: 'ctrader', name: 'cTrader', slug: 'ctrader', icon: '📈', count: 35 },
    { id: 'tradingview', name: 'TradingView', slug: 'tradingview', icon: '📊', count: 28 },
    { id: 'proprietary', name: 'Proprietary Platform', slug: 'proprietary', icon: '🏢', count: 45 },
  ],
  features: [
    { id: 'demo-account', name: 'Demo Account', slug: 'demo-account', icon: '🎮', count: 150 },
    { id: 'copy-trading', name: 'Copy Trading', slug: 'copy-trading', icon: '📋', count: 42 },
    { id: 'social-trading', name: 'Social Trading', slug: 'social-trading', icon: '👥', count: 23 },
    { id: 'islamic-accounts', name: 'Islamic Accounts', slug: 'islamic-accounts', icon: '🕌', count: 67 },
    { id: 'ecn-execution', name: 'ECN Execution', slug: 'ecn-execution', icon: '⚡', count: 45 },
    { id: 'educational-resources', name: 'Educational Resources', slug: 'educational-resources', icon: '📚', count: 89 },
    { id: 'live-chat', name: 'Live Chat Support', slug: 'live-chat', icon: '💬', count: 134 },
    { id: 'phone-support', name: 'Phone Support', slug: 'phone-support', icon: '📞', count: 112 },
  ]
};

function searchSuggestions(query: string, limit: number = 10): SuggestionItem[] {
  const suggestions: SuggestionItem[] = [];
  const searchTerm = query.toLowerCase().trim();
  
  if (searchTerm.length < 2) {
    return suggestions;
  }

  // Helper function to check if text matches query
  const matches = (text: string) => text.toLowerCase().includes(searchTerm);

  // Search brokers (prioritize exact matches)
  const brokerMatches = mockSuggestions.brokers
    .filter(broker => matches(broker.name))
    .sort((a, b) => {
      const aExact = a.name.toLowerCase().startsWith(searchTerm);
      const bExact = b.name.toLowerCase().startsWith(searchTerm);
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return b.rating - a.rating; // Sort by rating if both exact or both partial
    })
    .slice(0, 5)
    .map(broker => ({
      ...broker,
      type: 'broker' as const
    }));

  suggestions.push(...brokerMatches);

  // Search categories
  const categoryMatches = mockSuggestions.categories
    .filter(category => matches(category.name))
    .slice(0, 3)
    .map(category => ({
      ...category,
      type: 'category' as const
    }));

  suggestions.push(...categoryMatches);

  // Search countries
  const countryMatches = mockSuggestions.countries
    .filter(country => matches(country.name))
    .slice(0, 3)
    .map(country => ({
      ...country,
      type: 'country' as const
    }));

  suggestions.push(...countryMatches);

  // Search platforms
  const platformMatches = mockSuggestions.platforms
    .filter(platform => matches(platform.name))
    .slice(0, 2)
    .map(platform => ({
      ...platform,
      type: 'platform' as const
    }));

  suggestions.push(...platformMatches);

  // Search features
  const featureMatches = mockSuggestions.features
    .filter(feature => matches(feature.name))
    .slice(0, 2)
    .map(feature => ({
      ...feature,
      type: 'feature' as const
    }));

  suggestions.push(...featureMatches);

  // Limit total results
  return suggestions.slice(0, limit);
}

function getPopularSuggestions(limit: number = 10): SuggestionItem[] {
  const suggestions: SuggestionItem[] = [];

  // Top brokers by rating
  const topBrokers = mockSuggestions.brokers
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4)
    .map(broker => ({
      ...broker,
      type: 'broker' as const
    }));

  suggestions.push(...topBrokers);

  // Popular categories
  const popularCategories = mockSuggestions.categories
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(category => ({
      ...category,
      type: 'category' as const
    }));

  suggestions.push(...popularCategories);

  // Popular countries
  const popularCountries = mockSuggestions.countries
    .sort((a, b) => b.count - a.count)
    .slice(0, 3)
    .map(country => ({
      ...country,
      type: 'country' as const
    }));

  suggestions.push(...popularCountries);

  return suggestions.slice(0, limit);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SuggestResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { q: query, limit = '10' } = req.query;
    const maxResults = parseInt(limit as string);

    let suggestions: SuggestionItem[] = [];

    if (query && typeof query === 'string' && query.trim().length >= 2) {
      // Search-based suggestions
      suggestions = searchSuggestions(query.trim(), maxResults);
    } else {
      // Popular suggestions when no query
      suggestions = getPopularSuggestions(maxResults);
    }

    const response: SuggestResponse = {
      suggestions,
      query: (query as string) || '',
      total_count: suggestions.length
    };

    // Set cache headers for performance
    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=1200');

    return res.status(200).json(response);

  } catch (error) {
    console.error('Suggestion API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}