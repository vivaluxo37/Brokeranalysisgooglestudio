/**
 * Broker Directory Categories Configuration
 * All categories for the Best Brokers Directory with SEO metadata
 */

export interface CategoryConfig {
  slug: string;
  name: string;
  shortName: string;
  type: 'general' | 'execution' | 'strategy' | 'features';
  description: string;
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  filterCriteria: {
    [key: string]: any;
  };
  priority: number; // 0-100, higher = more important
  isPopular?: boolean;
}

export const BROKER_CATEGORIES: CategoryConfig[] = [
  // General Broker Types
  {
    slug: 'top-10-online-trading-brokers',
    name: 'Top 10 Online Trading Brokers',
    shortName: 'Online Trading Brokers',
    type: 'general',
    description: 'The best online trading brokers offering comprehensive trading services across multiple asset classes with excellent platforms and competitive pricing.',
    seoTitle: 'Best Online Trading Brokers — Top 10 Trading Platforms 2025 | BrokerAnalysis',
    metaDescription: 'Discover the top 10 online trading brokers of 2025. Compare platforms, fees, and features from leading brokers. Expert reviews and ratings.',
    keywords: ['best online trading brokers', 'top trading platforms', 'online brokers 2025', 'trading platform comparison'],
    filterCriteria: {
      isActive: true,
      score: { min: 8.0 }
    },
    priority: 100,
    isPopular: true
  },
  {
    slug: 'top-10-cfd-brokers-platforms',
    name: 'Top 10 CFD Brokers & Platforms',
    shortName: 'CFD Brokers',
    type: 'general',
    description: 'Leading CFD brokers offering contracts for difference trading with competitive spreads, multiple markets, and professional platforms.',
    seoTitle: 'Best CFD Brokers — Top 10 CFD Trading Platforms 2025 | BrokerAnalysis',
    metaDescription: 'Find the best CFD brokers of 2025. Compare spreads, platforms, and regulation for top CFD trading brokers. Expert analysis and reviews.',
    keywords: ['best cfd brokers', 'cfd trading platforms', 'contracts for difference', 'cfd broker comparison'],
    filterCriteria: {
      isActive: true,
      offersCfds: true,
      score: { min: 7.5 }
    },
    priority: 95,
    isPopular: true
  },
  {
    slug: 'top-10-forex-brokers',
    name: 'Top 10 Forex Brokers',
    shortName: 'Forex Brokers',
    type: 'general',
    description: 'The leading forex brokers providing currency trading with tight spreads, fast execution, and professional platforms for all trading styles.',
    seoTitle: 'Best Forex Brokers — Top 10 FX Trading Brokers 2025 | BrokerAnalysis',
    metaDescription: 'Discover the top 10 forex brokers of 2025. Compare spreads, execution, regulation, and features. Expert reviews of the best FX brokers.',
    keywords: ['best forex brokers', 'top fx brokers', 'forex trading platforms', 'currency trading brokers'],
    filterCriteria: {
      isActive: true,
      score: { min: 8.0 }
    },
    priority: 100,
    isPopular: true
  },

  // Execution Types
  {
    slug: 'ecn-brokers',
    name: 'ECN Brokers',
    shortName: 'ECN Brokers',
    type: 'execution',
    description: 'Electronic Communication Network brokers providing direct market access with raw spreads and transparent pricing.',
    seoTitle: 'Best ECN Brokers — Top ECN Trading Platforms 2025 | BrokerAnalysis',
    metaDescription: 'Find the best ECN brokers offering raw spreads and direct market access. Compare top ECN trading platforms with transparent pricing.',
    keywords: ['ecn brokers', 'electronic communication network', 'raw spread brokers', 'direct market access'],
    filterCriteria: {
      executionType: 'ECN',
      isActive: true
    },
    priority: 90,
    isPopular: true
  },
  {
    slug: 'dma-direct-market-access-brokers',
    name: 'DMA (Direct Market Access) Brokers',
    shortName: 'DMA Brokers',
    type: 'execution',
    description: 'Direct Market Access brokers allowing institutional-level trading with direct access to interbank markets.',
    seoTitle: 'Best DMA Brokers — Top Direct Market Access Platforms 2025 | BrokerAnalysis',
    metaDescription: 'Discover the best DMA brokers offering direct market access for professional traders. Compare institutional-level trading platforms.',
    keywords: ['dma brokers', 'direct market access', 'institutional trading', 'interbank access'],
    filterCriteria: {
      dmaAccess: true,
      isActive: true
    },
    priority: 85
  },
  {
    slug: 'no-dealing-desk',
    name: 'No Dealing Desk',
    shortName: 'No Dealing Desk',
    type: 'execution',
    description: 'No Dealing Desk brokers that route orders directly to liquidity providers without dealer intervention.',
    seoTitle: 'Best No Dealing Desk Brokers — NDD Trading Platforms 2025 | BrokerAnalysis',
    metaDescription: 'Find the best No Dealing Desk brokers with direct liquidity provider access. Compare NDD execution and transparent pricing.',
    keywords: ['no dealing desk brokers', 'ndd brokers', 'straight through processing', 'dealer intervention free'],
    filterCriteria: {
      noDealingDesk: true,
      isActive: true
    },
    priority: 80
  },
  {
    slug: 'forex-brokers-without-requotes',
    name: 'Forex Brokers Without Requotes',
    shortName: 'No Requotes',
    type: 'execution',
    description: 'Forex brokers guaranteeing order execution without requotes, ensuring price certainty for all trading styles.',
    seoTitle: 'Best No Requote Brokers — Forex Brokers Without Requotes 2025 | BrokerAnalysis',
    metaDescription: 'Trade without requotes at top forex brokers. Compare brokers offering guaranteed execution and price certainty for all orders.',
    keywords: ['no requote brokers', 'guaranteed execution', 'forex without requotes', 'price certainty'],
    filterCriteria: {
      noRequotes: true,
      isActive: true
    },
    priority: 75
  },
  {
    slug: 'fixed-spread-brokers',
    name: 'Fixed Spread Brokers',
    shortName: 'Fixed Spreads',
    type: 'execution',
    description: 'Brokers offering fixed spreads that remain constant regardless of market conditions, ideal for consistent trading costs.',
    seoTitle: 'Best Fixed Spread Brokers — Constant Spread Trading 2025 | BrokerAnalysis',
    metaDescription: 'Trade with fixed spreads at top brokers. Compare constant spread brokers offering predictable trading costs in all market conditions.',
    keywords: ['fixed spread brokers', 'constant spreads', 'predictable costs', 'fixed pricing'],
    filterCriteria: {
      fixedSpreads: true,
      isActive: true
    },
    priority: 70
  },
  {
    slug: 'no-spread-forex-brokers',
    name: 'No Spread Forex Brokers',
    shortName: 'Zero Spreads',
    type: 'execution',
    description: 'Forex brokers offering zero or near-zero spreads, typically charging commission instead for ultra-low trading costs.',
    seoTitle: 'Best Zero Spread Brokers — No Spread Forex Trading 2025 | BrokerAnalysis',
    metaDescription: 'Trade with zero spreads at top forex brokers. Compare no-spread brokers offering the lowest possible trading costs with commission-based pricing.',
    keywords: ['zero spread brokers', 'no spread forex', 'commission based trading', 'lowest cost brokers'],
    filterCriteria: {
      hasRawSpreads: true,
      eurusdSpread: { max: 0.2 },
      isActive: true
    },
    priority: 85
  },
  {
    slug: 'a-book-forex-brokers',
    name: 'A-Book Forex Brokers',
    shortName: 'A-Book Brokers',
    type: 'execution',
    description: 'A-Book brokers that pass all client orders to liquidity providers, ensuring no conflict of interest.',
    seoTitle: 'Best A-Book Brokers — Agency Model Forex Trading 2025 | BrokerAnalysis',
    metaDescription: 'Trade with A-Book brokers offering transparent execution. Compare agency model brokers with no conflict of interest.',
    keywords: ['a-book brokers', 'agency model', 'no conflict of interest', 'transparent execution'],
    filterCriteria: {
      aBookExecution: true,
      isActive: true
    },
    priority: 80
  },
  {
    slug: 'forex-brokers-with-raw-spreads',
    name: 'Forex Brokers With Raw Spreads',
    shortName: 'Raw Spreads',
    type: 'execution',
    description: 'Brokers providing raw interbank spreads with minimal markup, offering the most competitive pricing available.',
    seoTitle: 'Best Raw Spread Brokers — Interbank Forex Spreads 2025 | BrokerAnalysis',
    metaDescription: 'Access raw interbank spreads at top forex brokers. Compare brokers offering minimal markup on currency pairs.',
    keywords: ['raw spread brokers', 'interbank spreads', 'minimal markup', 'competitive pricing'],
    filterCriteria: {
      hasRawSpreads: true,
      isActive: true
    },
    priority: 85
  },
  {
    slug: 'stp-forex-brokers',
    name: 'STP Forex Brokers',
    shortName: 'STP Brokers',
    type: 'execution',
    description: 'Straight Through Processing brokers routing orders directly to liquidity providers for transparent execution.',
    seoTitle: 'Best STP Brokers — Straight Through Processing 2025 | BrokerAnalysis',
    metaDescription: 'Trade with STP brokers offering direct liquidity provider access. Compare Straight Through Processing brokers for transparent execution.',
    keywords: ['stp brokers', 'straight through processing', 'liquidity providers', 'transparent execution'],
    filterCriteria: {
      stpExecution: true,
      isActive: true
    },
    priority: 80
  },
  {
    slug: 'instant-execution-brokers',
    name: 'Instant Execution Brokers',
    shortName: 'Instant Execution',
    type: 'execution',
    description: 'Brokers providing instant order execution for fast-paced trading strategies requiring immediate order fills.',
    seoTitle: 'Best Instant Execution Brokers — Fast Order Execution 2025 | BrokerAnalysis',
    metaDescription: 'Trade with instant execution brokers offering the fastest order processing. Compare brokers with sub-second execution speeds.',
    keywords: ['instant execution brokers', 'fast execution', 'immediate order fills', 'speed trading'],
    filterCriteria: {
      instantExecution: true,
      isActive: true
    },
    priority: 75
  },

  // Strategy-Based Categories
  {
    slug: 'pamm-brokers',
    name: 'PAMM Brokers',
    shortName: 'PAMM',
    type: 'strategy',
    description: 'Percentage Allocation Management Module brokers allowing professional money management and copy trading services.',
    seoTitle: 'Best PAMM Brokers — Money Management Platforms 2025 | BrokerAnalysis',
    metaDescription: 'Find the best PAMM brokers for professional money management. Compare platforms offering Percentage Allocation Management services.',
    keywords: ['pamm brokers', 'money management', 'professional trading', 'allocation management'],
    filterCriteria: {
      offersPamm: true,
      isActive: true
    },
    priority: 70
  },
  {
    slug: 'hft-brokers',
    name: 'HFT Brokers',
    shortName: 'HFT',
    type: 'strategy',
    description: 'High-Frequency Trading brokers providing ultra-fast execution and low latency for algorithmic trading strategies.',
    seoTitle: 'Best HFT Brokers — High Frequency Trading Platforms 2025 | BrokerAnalysis',
    metaDescription: 'Discover the best HFT brokers for algorithmic trading. Compare high-frequency trading platforms with ultra-low latency.',
    keywords: ['hft brokers', 'high frequency trading', 'algorithmic trading', 'low latency'],
    filterCriteria: {
      supportsHft: true,
      isActive: true
    },
    priority: 75
  },
  {
    slug: 'scalping-brokers',
    name: 'Scalping Brokers',
    shortName: 'Scalping',
    type: 'strategy',
    description: 'Brokers that allow and support scalping strategies with fast execution, tight spreads, and no restrictions.',
    seoTitle: 'Best Scalping Brokers — Top Scalping Trading Platforms 2025 | BrokerAnalysis',
    metaDescription: 'Find the best brokers for scalping strategies. Compare platforms allowing scalping with fast execution and tight spreads.',
    keywords: ['scalping brokers', 'scalping allowed', 'fast execution', 'tight spreads'],
    filterCriteria: {
      supportsScalping: true,
      isActive: true
    },
    priority: 90,
    isPopular: true
  },
  {
    slug: 'trading-api-brokers',
    name: 'Trading API Brokers',
    shortName: 'API Trading',
    type: 'strategy',
    description: 'Brokers offering robust trading APIs for algorithmic trading, automated strategies, and third-party integrations.',
    seoTitle: 'Best API Trading Brokers — Algorithmic Trading Platforms 2025 | BrokerAnalysis',
    metaDescription: 'Connect via API to top trading brokers. Compare platforms offering robust trading APIs for algorithmic and automated trading.',
    keywords: ['api trading brokers', 'algorithmic trading', 'trading api', 'automated trading'],
    filterCriteria: {
      supportsApiTrading: true,
      isActive: true
    },
    priority: 80
  },
  {
    slug: 'swing-trading-brokers',
    name: 'Swing Trading Brokers',
    shortName: 'Swing Trading',
    type: 'strategy',
    description: 'Brokers ideal for swing trading with competitive overnight fees, flexible position sizes, and medium-term trading focus.',
    seoTitle: 'Best Swing Trading Brokers — Medium-Term Trading 2025 | BrokerAnalysis',
    metaDescription: 'Find the best brokers for swing trading strategies. Compare platforms optimized for medium-term trading with low overnight fees.',
    keywords: ['swing trading brokers', 'medium term trading', 'overnight fees', 'position trading'],
    filterCriteria: {
      swapFeeCategory: 'Low',
      isActive: true
    },
    priority: 75
  },
  {
    slug: 'forex-brokers-for-hedging',
    name: 'Forex Brokers for Hedging',
    shortName: 'Hedging',
    type: 'strategy',
    description: 'Brokers allowing hedging strategies where traders can hold both long and short positions simultaneously.',
    seoTitle: 'Best Hedging Brokers — Forex Hedging Strategies 2025 | BrokerAnalysis',
    metaDescription: 'Trade with brokers allowing hedging strategies. Compare platforms supporting simultaneous long and short positions.',
    keywords: ['hedging brokers', 'hedge trading', 'long short positions', 'risk management'],
    filterCriteria: {
      supportsHedging: true,
      isActive: true
    },
    priority: 70
  },
  {
    slug: 'forex-brokers-for-beginners',
    name: 'Forex Brokers for Beginners',
    shortName: 'Beginner Friendly',
    type: 'strategy',
    description: 'Beginner-friendly brokers with educational resources, low minimum deposits, and user-friendly platforms.',
    seoTitle: 'Best Forex Brokers for Beginners — Beginner Trading 2025 | BrokerAnalysis',
    metaDescription: 'Start trading with the best beginner-friendly forex brokers. Compare platforms with education, low deposits, and easy-to-use interfaces.',
    keywords: ['beginner forex brokers', 'forex for beginners', 'educational resources', 'low minimum deposit'],
    filterCriteria: {
      suitableForBeginners: true,
      minDepositAmount: { max: 100 },
      isActive: true
    },
    priority: 95,
    isPopular: true
  },
  {
    slug: 'day-trading-broker',
    name: 'Day Trading Broker',
    shortName: 'Day Trading',
    type: 'strategy',
    description: 'Optimal brokers for day trading with fast execution, competitive spreads, and platforms designed for active trading.',
    seoTitle: 'Best Day Trading Brokers — Intraday Trading Platforms 2025 | BrokerAnalysis',
    metaDescription: 'Find the best brokers for day trading. Compare platforms optimized for intraday trading with fast execution and competitive spreads.',
    keywords: ['day trading brokers', 'intraday trading', 'active trading', 'fast execution'],
    filterCriteria: {
      instantExecution: true,
      eurusdSpread: { max: 1.0 },
      isActive: true
    },
    priority: 85
  },

  // Feature-Based Categories
  {
    slug: 'most-regulated-forex-brokers',
    name: 'Most Regulated Forex Brokers',
    shortName: 'Highly Regulated',
    type: 'features',
    description: 'The most regulated forex brokers with licenses from multiple tier-1 regulatory authorities for maximum security.',
    seoTitle: 'Most Regulated Forex Brokers — Multi-Licensed Platforms 2025 | BrokerAnalysis',
    metaDescription: 'Trade with the most regulated forex brokers. Compare multi-licensed platforms with tier-1 regulatory oversight for maximum security.',
    keywords: ['most regulated brokers', 'multi licensed', 'tier 1 regulation', 'regulatory oversight'],
    filterCriteria: {
      regulationRating: { min: 9.0 },
      isActive: true
    },
    priority: 95,
    isPopular: true
  },
  {
    slug: 'trailing-stop-loss-brokers',
    name: 'Trailing Stop Loss Brokers',
    shortName: 'Trailing Stops',
    type: 'features',
    description: 'Brokers offering advanced trailing stop loss functionality for automatic profit protection and risk management.',
    seoTitle: 'Best Trailing Stop Brokers — Advanced Risk Management 2025 | BrokerAnalysis',
    metaDescription: 'Use trailing stops at top forex brokers. Compare platforms offering advanced trailing stop loss for automated risk management.',
    keywords: ['trailing stop brokers', 'trailing stop loss', 'risk management', 'profit protection'],
    filterCriteria: {
      hasTrailingStops: true,
      isActive: true
    },
    priority: 70
  },
  {
    slug: 'micro-accounts',
    name: 'Micro Accounts',
    shortName: 'Micro Accounts',
    type: 'features',
    description: 'Brokers offering micro account options with smaller position sizes perfect for new traders and risk management.',
    seoTitle: 'Best Micro Account Brokers — Small Position Trading 2025 | BrokerAnalysis',
    metaDescription: 'Start small with micro account brokers. Compare platforms offering micro lots and flexible position sizing for new traders.',
    keywords: ['micro account brokers', 'micro lots', 'small positions', 'flexible sizing'],
    filterCriteria: {
      offersMicroAccounts: true,
      isActive: true
    },
    priority: 75
  },
  {
    slug: 'offshore-forex-brokers',
    name: 'Offshore Forex Brokers',
    shortName: 'Offshore',
    type: 'features',
    description: 'Offshore forex brokers providing flexible trading conditions and higher leverage options for international traders.',
    seoTitle: 'Best Offshore Forex Brokers — International Trading 2025 | BrokerAnalysis',
    metaDescription: 'Trade with offshore forex brokers offering flexible conditions. Compare international brokers with higher leverage and fewer restrictions.',
    keywords: ['offshore forex brokers', 'international trading', 'high leverage', 'flexible conditions'],
    filterCriteria: {
      isOffshore: true,
      isActive: true
    },
    priority: 60
  },
  {
    slug: 'corporate-accounts',
    name: 'Corporate Accounts',
    shortName: 'Corporate',
    type: 'features',
    description: 'Brokers offering corporate account solutions for institutional clients, hedge funds, and trading companies.',
    seoTitle: 'Best Corporate Account Brokers — Institutional Trading 2025 | BrokerAnalysis',
    metaDescription: 'Open corporate accounts at top brokers. Compare institutional trading solutions for companies and hedge funds.',
    keywords: ['corporate account brokers', 'institutional trading', 'business accounts', 'hedge fund brokers'],
    filterCriteria: {
      offersCorporateAccounts: true,
      isActive: true
    },
    priority: 65
  },
  {
    slug: 'no-deposit-forex-brokers',
    name: 'No Deposit Forex Brokers',
    shortName: 'No Deposit',
    type: 'features',
    description: 'Forex brokers offering no deposit bonuses and demo trading opportunities to start trading without initial capital.',
    seoTitle: 'Best No Deposit Forex Brokers — Start Trading Free 2025 | BrokerAnalysis',
    metaDescription: 'Start trading without deposits at top forex brokers. Compare no deposit bonuses and free trading opportunities.',
    keywords: ['no deposit forex brokers', 'no deposit bonus', 'free trading', 'demo accounts'],
    filterCriteria: {
      noDepositRequired: true,
      isActive: true
    },
    priority: 80
  },
  {
    slug: 'forex-brokers-with-high-leverage',
    name: 'Forex Brokers With High Leverage',
    shortName: 'High Leverage',
    type: 'features',
    description: 'Brokers offering high leverage ratios up to 1:3000 for traders seeking maximum capital efficiency.',
    seoTitle: 'Best High Leverage Brokers — Maximum Leverage Trading 2025 | BrokerAnalysis',
    metaDescription: 'Trade with high leverage at top forex brokers. Compare platforms offering maximum leverage ratios up to 1:3000.',
    keywords: ['high leverage brokers', 'maximum leverage', 'leverage trading', 'capital efficiency'],
    filterCriteria: {
      maxLeverage: { min: 500 },
      isActive: true
    },
    priority: 85,
    isPopular: true
  },
  {
    slug: 'forex-brokers-with-no-minimum-deposit',
    name: 'Forex Brokers With No Minimum Deposit',
    shortName: 'No Minimum',
    type: 'features',
    description: 'Brokers with no minimum deposit requirements, allowing traders to start with any amount they choose.',
    seoTitle: 'Best No Minimum Deposit Brokers — Start With Any Amount 2025 | BrokerAnalysis',
    metaDescription: 'Start trading with any amount at no minimum deposit brokers. Compare platforms with zero deposit requirements.',
    keywords: ['no minimum deposit brokers', 'start with any amount', 'flexible deposits', 'low barrier entry'],
    filterCriteria: {
      minDepositAmount: { max: 1 },
      isActive: true
    },
    priority: 90,
    isPopular: true
  },
  {
    slug: 'crypto-cfd-brokers',
    name: 'Crypto CFD Brokers',
    shortName: 'Crypto CFDs',
    type: 'features',
    description: 'Brokers offering cryptocurrency CFD trading with leverage on Bitcoin, Ethereum, and other digital assets.',
    seoTitle: 'Best Crypto CFD Brokers — Cryptocurrency Trading 2025 | BrokerAnalysis',
    metaDescription: 'Trade crypto CFDs at top brokers. Compare platforms offering leveraged cryptocurrency trading on Bitcoin, Ethereum, and more.',
    keywords: ['crypto cfd brokers', 'cryptocurrency trading', 'bitcoin trading', 'crypto leverage'],
    filterCriteria: {
      supportsCryptoCfds: true,
      isActive: true
    },
    priority: 85,
    isPopular: true
  },
  {
    slug: 'islamic-accounts',
    name: 'Islamic Accounts',
    shortName: 'Islamic/Swap-Free',
    type: 'features',
    description: 'Sharia-compliant Islamic accounts with no swap fees for Muslim traders following Islamic finance principles.',
    seoTitle: 'Best Islamic Account Brokers — Swap-Free Trading 2025 | BrokerAnalysis',
    metaDescription: 'Trade with Islamic accounts at top brokers. Compare Sharia-compliant, swap-free trading platforms for Muslim traders.',
    keywords: ['islamic account brokers', 'swap free trading', 'sharia compliant', 'muslim traders'],
    filterCriteria: {
      offersIslamicAccounts: true,
      isActive: true
    },
    priority: 80
  },
  {
    slug: 'mt4-brokers',
    name: 'MT4 Brokers',
    shortName: 'MetaTrader 4',
    type: 'features',
    description: 'Brokers offering MetaTrader 4 platform with expert advisors, custom indicators, and automated trading capabilities.',
    seoTitle: 'Best MT4 Brokers — MetaTrader 4 Trading Platforms 2025 | BrokerAnalysis',
    metaDescription: 'Trade on MetaTrader 4 with top brokers. Compare MT4 platforms offering expert advisors and automated trading.',
    keywords: ['mt4 brokers', 'metatrader 4', 'expert advisors', 'automated trading'],
    filterCriteria: {
      supportsMt4: true,
      isActive: true
    },
    priority: 90,
    isPopular: true
  },
  {
    slug: 'mt5-brokers',
    name: 'MT5 Brokers',
    shortName: 'MetaTrader 5',
    type: 'features',
    description: 'Brokers supporting MetaTrader 5 with advanced features, more timeframes, and enhanced analytical tools.',
    seoTitle: 'Best MT5 Brokers — MetaTrader 5 Trading Platforms 2025 | BrokerAnalysis',
    metaDescription: 'Access MetaTrader 5 at leading brokers. Compare MT5 platforms with advanced features and enhanced analytical tools.',
    keywords: ['mt5 brokers', 'metatrader 5', 'advanced trading', 'analytical tools'],
    filterCriteria: {
      supportsMt5: true,
      isActive: true
    },
    priority: 90,
    isPopular: true
  },
  {
    slug: 'tradingview-brokers',
    name: 'TradingView Brokers',
    shortName: 'TradingView',
    type: 'features',
    description: 'Brokers integrated with TradingView for advanced charting, social trading, and comprehensive market analysis.',
    seoTitle: 'Best TradingView Brokers — Advanced Charting Trading 2025 | BrokerAnalysis',
    metaDescription: 'Trade with TradingView integration at top brokers. Compare platforms offering advanced charting and social trading features.',
    keywords: ['tradingview brokers', 'advanced charting', 'social trading', 'market analysis'],
    filterCriteria: {
      supportsTradingview: true,
      isActive: true
    },
    priority: 85
  },
  {
    slug: 'stock-cfd-brokers',
    name: 'Stock CFD Brokers',
    shortName: 'Stock CFDs',
    type: 'features',
    description: 'Brokers offering stock CFD trading on major exchanges with leverage and the ability to go long or short.',
    seoTitle: 'Best Stock CFD Brokers — Equity CFD Trading 2025 | BrokerAnalysis',
    metaDescription: 'Trade stock CFDs at leading brokers. Compare platforms offering leveraged equity trading on major global exchanges.',
    keywords: ['stock cfd brokers', 'equity cfds', 'stock trading', 'share cfds'],
    filterCriteria: {
      offersStockCfds: true,
      isActive: true
    },
    priority: 80
  }
];

export const CATEGORY_TYPES = {
  general: 'General',
  execution: 'Execution',
  strategy: 'Strategy',  
  features: 'Features'
} as const;

export const POPULAR_CATEGORIES = BROKER_CATEGORIES.filter(cat => cat.isPopular);

export const getCategoryBySlug = (slug: string): CategoryConfig | undefined => {
  return BROKER_CATEGORIES.find(cat => cat.slug === slug);
};

export const getCategoriesByType = (type: CategoryConfig['type']): CategoryConfig[] => {
  return BROKER_CATEGORIES.filter(cat => cat.type === type);
};

export const generateCategoryTitle = (categoryName: string, brokerCount?: number): string => {
  const count = brokerCount || 10;
  return `Best ${categoryName} — Top ${count} ${categoryName} 2025`;
};

export const generateCategoryMetaDescription = (category: CategoryConfig, brokerCount?: number): string => {
  const count = brokerCount || 10;
  return `Compare the top ${count} ${category.shortName.toLowerCase()} of 2025. Expert reviews, detailed analysis & ratings. ${category.description.slice(0, 100)}...`;
};