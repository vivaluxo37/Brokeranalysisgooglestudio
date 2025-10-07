import { Broker } from '../types';

// Helper functions for broker data parsing
const parseLeverage = (leverageStr: string): number => {
  try {
    if (!leverageStr || typeof leverageStr !== 'string') return 0;
    if (leverageStr.toLowerCase().includes('unlimited')) return Infinity;
    const num = parseInt(leverageStr.split(':')[1], 10);
    return isNaN(num) ? 0 : num;
  } catch (error) {
    console.warn('Error parsing leverage:', leverageStr, error);
    return 0;
  }
};

const parseCommission = (commissionStr: string): number => {
  try {
    if (!commissionStr || typeof commissionStr !== 'string') return 0;
    if (commissionStr.toLowerCase().includes('zero')) return 0;
    const match = commissionStr.match(/(\d+\.?\d*)/);
    if (match) {
      return parseFloat(match[1]) * 2; // Round-trip commission
    }
    return 0;
  } catch (error) {
    console.warn('Error parsing commission:', commissionStr, error);
    return 0;
  }
};

const parseSpread = (spreadStr: string): number => {
  try {
    if (!spreadStr || typeof spreadStr !== 'string') return 0;
    const match = spreadStr.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  } catch (error) {
    console.warn('Error parsing spread:', spreadStr, error);
    return 0;
  }
};

// Enhanced category interface
export interface EnhancedCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon?: string;
  color?: string;
  categoryGroup: 'general' | 'execution' | 'strategy' | 'feature';
  filterFn: (broker: Broker) => boolean;
  minimumBrokers: number;
  seoTitle: string;
  metaDescription: string;
  localContext: {
    advantages: string[];
    disadvantages: string[];
    bestFor: string[];
    keyFeatures: string[];
  };
}

// General Broker Types
const generalBrokerTypes: EnhancedCategory[] = [
  {
    id: 'top-online-trading',
    name: 'Top Online Trading Brokers',
    slug: 'top-10-online-trading-brokers',
    description: 'The best overall online trading platforms with superior technology, reliability, and comprehensive trading features.',
    icon: '🌐',
    color: '#3B82F6',
    categoryGroup: 'general',
    filterFn: (b) => b.score >= 8.5 && b.coreInfo.mobileTrading && b.coreInfo.demoAccount,
    minimumBrokers: 10,
    seoTitle: 'Best Online Trading Brokers 2025 | Top 10 Trading Platforms',
    metaDescription: 'Compare the 10 best online trading brokers in 2025. Superior platforms, low fees, and excellent regulation. Find your perfect trading partner today.',
    localContext: {
      advantages: [
        'Comprehensive trading platforms with advanced charting',
        'Wide range of tradable instruments',
        'Strong regulatory protection and investor compensation',
        'Professional trading tools and analysis'
      ],
      disadvantages: [
        'May have higher minimum deposits for premium features',
        'Can be overwhelming for absolute beginners',
        'May require verification processes'
      ],
      bestFor: ['Serious traders', 'Investors seeking diverse markets', 'Traders wanting professional tools'],
      keyFeatures: ['Advanced platforms', 'Multiple asset classes', 'Professional support', 'Educational resources']
    }
  },
  {
    id: 'top-cfd-brokers',
    name: 'Top CFD Brokers & Platforms',
    slug: 'top-10-cfd-brokers-platforms',
    description: 'Leading CFD trading platforms offering competitive spreads, leverage, and extensive market access across global indices, stocks, and commodities.',
    icon: '📊',
    color: '#10B981',
    categoryGroup: 'general',
    filterFn: (b) => (b.tradableInstruments?.indices?.total ?? 0) >= 20 &&
                     (b.tradableInstruments?.stocks?.total ?? 0) >= 100,
    minimumBrokers: 10,
    seoTitle: 'Best CFD Brokers 2025 | Top Trading Platforms for Contracts for Difference',
    metaDescription: 'Discover the top CFD brokers and platforms for 2025. Trade indices, stocks, commodities with competitive spreads and reliable regulation.',
    localContext: {
      advantages: [
        'Access to global markets without owning underlying assets',
        'Ability to profit from both rising and falling markets',
        'Leverage trading with relatively low capital requirements',
        'Wide range of trading instruments'
      ],
      disadvantages: [
        'High risk due to leverage and market volatility',
        'Overnight financing charges for held positions',
        'Complex tax treatment in some jurisdictions',
        'Risk of losing more than initial investment'
      ],
      bestFor: ['Experienced traders', 'Short-term speculators', 'Traders seeking market diversity'],
      keyFeatures: ['Leverage trading', 'Short selling allowed', 'Global market access', 'No ownership required']
    }
  },
  {
    id: 'top-forex-brokers',
    name: 'Top Forex Brokers',
    slug: 'top-10-forex-brokers',
    description: 'The premier forex trading brokers with exceptional liquidity, tight spreads, and robust currency pair offerings for all trading strategies.',
    icon: '💱',
    color: '#F59E0B',
    categoryGroup: 'general',
    filterFn: (b) => (b.tradableInstruments?.forexPairs?.total ?? 0) >= 40,
    minimumBrokers: 10,
    seoTitle: 'Best Forex Brokers 2025 | Top 10 Currency Trading Platforms',
    metaDescription: 'Find the best forex brokers for 2025. Compare spreads, regulation, and platforms. Trade EUR/USD, GBP/USD and 50+ currency pairs safely.',
    localContext: {
      advantages: [
        'Highly liquid market with 24/5 trading',
        'Low transaction costs and tight spreads',
        'High leverage opportunities for small capital',
        'Easy to understand market dynamics'
      ],
      disadvantages: [
        'High volatility can lead to rapid losses',
        'Complex factors affecting currency movements',
        'Overnight swap fees for held positions',
        'Requires constant market monitoring'
      ],
      bestFor: ['Currency traders', 'Beginners seeking simple markets', 'High-frequency traders'],
      keyFeatures: ['24/5 market access', 'High liquidity', 'Low costs', 'Leverage available']
    }
  }
];

// Execution Types
const executionTypes: EnhancedCategory[] = [
  {
    id: 'ecn-brokers',
    name: 'ECN Brokers',
    slug: 'ecn-brokers',
    description: 'True ECN brokers providing direct market access with ultra-tight spreads, lightning-fast execution, and no dealing desk intervention.',
    icon: '⚡',
    color: '#EF4444',
    categoryGroup: 'execution',
    filterFn: (b) => b.coreInfo.brokerType?.includes('ECN') ||
                     b.accountTypes.some(acc => acc.type.includes('ECN')),
    minimumBrokers: 7,
    seoTitle: 'Best ECN Brokers 2025 | True Electronic Communication Network Trading',
    metaDescription: 'Compare the best ECN brokers for 2025. Enjoy raw spreads from 0.0 pips, direct market access, and transparent pricing with no dealing desk.',
    localContext: {
      advantages: [
        'Direct access to liquidity providers and interbank market',
        'Ultra-tight spreads, often starting from 0.0 pips',
        'No conflict of interest with broker',
        'Anonymous trading with no dealing desk intervention'
      ],
      disadvantages: [
        'Commission-based pricing structure',
        'Higher minimum deposits for ECN accounts',
        'Not ideal for very small trade sizes',
        'Can be complex for beginners to understand'
      ],
      bestFor: ['Scalpers', 'Day traders', 'Algorithmic traders', 'High-volume traders'],
      keyFeatures: ['Raw spreads', 'Direct market access', 'Fast execution', 'Transparent pricing']
    }
  },
  {
    id: 'dma-brokers',
    name: 'DMA (Direct Market Access) Brokers',
    slug: 'dma-direct-market-access-brokers',
    description: 'DMA brokers offering direct access to financial markets with true market depth, instant execution, and complete trade transparency.',
    icon: '🎯',
    color: '#8B5CF6',
    categoryGroup: 'execution',
    filterFn: (b) => b.technology?.executionType?.includes('DMA') ||
                     b.accountTypes.some(acc => acc.type.includes('DMA')),
    minimumBrokers: 5,
    seoTitle: 'Best DMA Brokers 2025 | Direct Market Access Trading Platforms',
    metaDescription: 'Find top DMA brokers offering direct market access in 2025. Real market pricing, instant execution, and complete trading transparency.',
    localContext: {
      advantages: [
        'Direct access to order books and market depth',
        'Complete price transparency and fair execution',
        'No re-quotes or broker intervention',
        'Ability to place orders inside the spread'
      ],
      disadvantages: [
        'Higher commission costs',
        'Complex fee structures',
        'Limited broker selection',
        'Not suitable for beginners'
      ],
      bestFor: ['Professional traders', 'Institutional traders', 'Advanced retail traders'],
      keyFeatures: ['Market depth access', 'No re-quotes', 'Transparent pricing', 'Advanced order types']
    }
  },
  {
    id: 'stp-brokers',
    name: 'STP Brokers',
    slug: 'stp-brokers',
    description: 'Straight Through Processing brokers that route client orders directly to liquidity providers without intervention, ensuring fast execution and fair pricing.',
    icon: '🔄',
    color: '#06B6D4',
    categoryGroup: 'execution',
    filterFn: (b) => b.coreInfo.brokerType?.includes('STP') ||
                     b.accountTypes.some(acc => acc.type.includes('STP')),
    minimumBrokers: 7,
    seoTitle: 'Best STP Brokers 2025 | Straight Through Processing Forex Trading',
    metaDescription: 'Discover top STP brokers with direct order routing to liquidity providers. Fast execution, transparent pricing, and no dealing desk intervention.',
    localContext: {
      advantages: [
        'No dealing desk intervention',
        'Fast trade execution',
        'Transparent pricing from liquidity providers',
        'No conflict of interest'
      ],
      disadvantages: [
        'Slightly wider spreads than ECN',
        'Variable spreads during volatility',
        'Limited order types compared to DMA',
        'Dependence on liquidity provider quality'
      ],
      bestFor: ['Day traders', 'Swing traders', 'Traders wanting reliability'],
      keyFeatures: ['Direct routing', 'Fast execution', 'No dealing desk', 'Transparent pricing']
    }
  },
  {
    id: 'no-dealing-desk-brokers',
    name: 'No Dealing Desk Brokers',
    slug: 'no-dealing-desk-brokers',
    description: 'NDD brokers eliminating conflict of interest by routing trades directly to liquidity providers, ensuring fair execution and transparent pricing.',
    icon: '🚫',
    color: '#F97316',
    categoryGroup: 'execution',
    filterFn: (b) => b.coreInfo.brokerType?.includes('NDD') ||
                     b.coreInfo.brokerType?.includes('ECN') ||
                     b.coreInfo.brokerType?.includes('STP'),
    minimumBrokers: 8,
    seoTitle: 'Best No Dealing Desk (NDD) Brokers 2025 | Conflict-Free Trading',
    metaDescription: 'Compare the best NDD brokers offering conflict-free trading. Direct market access, transparent pricing, and fair execution without dealer intervention.',
    localContext: {
      advantages: [
        'No conflict of interest with broker',
        'Transparent and fair execution',
        'Access to real market prices',
        'No re-quotes or price manipulation'
      ],
      disadvantages: [
        'Commission-based or wider spreads',
        'Less flexibility in order execution',
        'Dependent on liquidity providers',
        'May have higher minimum deposits'
      ],
      bestFor: ['Traders wanting fairness', 'Scalpers', 'Day traders', 'Professional traders'],
      keyFeatures: ['No conflict of interest', 'Transparent execution', 'Real market prices', 'Fair trading']
    }
  },
  {
    id: 'raw-spread-brokers',
    name: 'Raw Spread Brokers',
    slug: 'raw-spread-brokers',
    description: 'Brokers offering raw, institutional-grade spreads starting from 0.0 pips with transparent commission-based pricing for serious traders.',
    icon: '📉',
    color: '#14B8A6',
    categoryGroup: 'execution',
    filterFn: (b) => {
      const avgSpread = b.tradingConditionsExtended?.averageSpread ??
                       parseSpread(b.fees?.trading?.averageSpreads?.[0]?.spread || '1.0');
      return avgSpread <= 0.2 && (b.fees?.trading?.commissionStructure?.includes('$') || false);
    },
    minimumBrokers: 6,
    seoTitle: 'Best Raw Spread Brokers 2025 | Spreads from 0.0 Pips',
    metaDescription: 'Find brokers with raw spreads from 0.0 pips in 2025. Institutional-grade pricing, transparent commissions, and ideal for scalping.',
    localContext: {
      advantages: [
        'Institutional-grade spreads from 0.0 pips',
        'Transparent commission-based pricing',
        'Ideal for high-frequency trading',
        'Direct access to liquidity providers'
      ],
      disadvantages: [
        'Commission fees on every trade',
        'Higher minimum deposits required',
        'Not cost-effective for occasional traders',
        'Requires high trading volume to be profitable'
      ],
      bestFor: ['Scalpers', 'High-frequency traders', 'Professional traders', 'EA traders'],
      keyFeatures: ['0.0 pip spreads', 'Commission pricing', 'Liquidity access', 'Fast execution']
    }
  },
  {
    id: 'instant-execution-brokers',
    name: 'Instant Execution Brokers',
    slug: 'instant-execution-brokers',
    description: 'Brokers providing immediate order execution at requested prices, ensuring traders enter and exit positions without delays.',
    icon: '⚡',
    color: '#EC4899',
    categoryGroup: 'execution',
    filterFn: (b) => b.technology?.executionType?.includes('Instant') ||
                     b.tradingConditionsExtended?.instantExecution === true,
    minimumBrokers: 7,
    seoTitle: 'Best Instant Execution Brokers 2025 | Immediate Order Filling',
    metaDescription: 'Compare top brokers offering instant execution. No requotes, immediate order filling, and reliable trade execution for all strategies.',
    localContext: {
      advantages: [
        'Immediate order execution at requested price',
        'No re-quotes or order delays',
        'Predictable trading experience',
        'Excellent for news trading and scalping'
      ],
      disadvantages: [
        'May have wider spreads to compensate for execution guarantee',
        'Slippage can still occur during high volatility',
        'Limited order types compared to market execution',
        'Brokers may reject orders during extreme volatility'
      ],
      bestFor: ['Scalpers', 'News traders', 'Beginners', 'Traders wanting certainty'],
      keyFeatures: ['Instant execution', 'No re-quotes', 'Price certainty', 'Reliable filling']
    }
  },
  {
    id: 'fixed-spread-brokers',
    name: 'Fixed Spread Brokers',
    slug: 'fixed-spread-brokers',
    description: 'Brokers offering consistent, predictable spreads that don\'t change with market volatility, providing cost certainty for trading strategies.',
    icon: '📏',
    color: '#6366F1',
    categoryGroup: 'execution',
    filterFn: (b) => b.fees?.trading?.spreadType?.includes('Fixed') ||
                     b.accountTypes.some(acc => acc.spreads?.includes('Fixed')),
    minimumBrokers: 6,
    seoTitle: 'Best Fixed Spread Brokers 2025 | Predictable Trading Costs',
    metaDescription: 'Find brokers with fixed spreads for predictable trading costs. Ideal for beginners and news trading. Compare the best fixed spread accounts.',
    localContext: {
      advantages: [
        'Predictable trading costs regardless of market conditions',
        'Easier cost calculation for strategy planning',
        'No spread widening during news events',
        'Beginner-friendly pricing model'
      ],
      disadvantages: [
        'Generally wider spreads than variable accounts',
        'Commission may still apply',
        'Limited to major currency pairs',
        'Not ideal for scalping due to wider costs'
      ],
      bestFor: ['Beginners', 'News traders', 'Strategy planners', 'Risk-averse traders'],
      keyFeatures: ['Fixed costs', 'Predictable pricing', 'News trading friendly', 'Beginner suitable']
    }
  },
  {
    id: 'no-spread-brokers',
    name: 'No Spread Brokers',
    slug: 'no-spread-brokers',
    description: 'Brokers offering zero spread accounts with transparent commission-only pricing, minimizing trading costs for high-frequency strategies.',
    icon: '0️⃣',
    color: '#059669',
    categoryGroup: 'execution',
    filterFn: (b) => {
      const avgSpread = parseSpread(b.fees?.trading?.averageSpreads?.[0]?.spread || '0.0');
      return avgSpread === 0 && b.fees?.trading?.commissionStructure?.includes('$');
    },
    minimumBrokers: 5,
    seoTitle: 'Best Zero Spread Brokers 2025 | No Spread Trading Accounts',
    metaDescription: 'Discover brokers offering zero spread accounts in 2025. Commission-only pricing, ideal for scalping and high-frequency trading strategies.',
    localContext: {
      advantages: [
        'Zero spreads on major pairs',
        'Transparent commission-only pricing',
        'Lowest possible trading costs',
        'Perfect for scalping strategies'
      ],
      disadvantages: [
        'Commission on every trade increases costs',
        'High minimum deposits often required',
        'Limited to major currency pairs',
        'Not cost-effective for low-frequency trading'
      ],
      bestFor: ['Scalpers', 'High-frequency traders', 'Professional traders', 'EA users'],
      keyFeatures: ['Zero spreads', 'Commission pricing', 'Lowest costs', 'Scalping ideal']
    }
  }
];

// Strategy Types
const strategyTypes: EnhancedCategory[] = [
  {
    id: 'pamm-brokers',
    name: 'PAMM Brokers',
    slug: 'pamm-brokers',
    description: 'Brokers offering Percentage Allocation Management Module accounts, allowing investors to copy successful traders and managers to trade multiple accounts.',
    icon: '👥',
    color: '#7C3AED',
    categoryGroup: 'strategy',
    filterFn: (b) => b.copyTrading === true || b.platformFeatures?.pamm?.available,
    minimumBrokers: 6,
    seoTitle: 'Best PAMM Brokers 2025 | Percentage Allocation Management Module Accounts',
    metaDescription: 'Find top PAMM brokers for managed trading accounts. Copy successful traders or become a money manager. Compare the best PAMM platforms.',
    localContext: {
      advantages: [
        'Access to professional traders\' expertise',
        'Passive investment opportunity',
        'Performance-based fee structure',
        'Professional risk management'
      ],
      disadvantages: [
        'Management fees reduce returns',
        'Limited control over trading decisions',
        'Risk of manager underperformance',
        'Due diligence required for manager selection'
      ],
      bestFor: ['Passive investors', 'Beginners', 'Investors seeking diversification'],
      keyFeatures: ['Managed trading', 'Professional traders', 'Performance fees', 'Passive income']
    }
  },
  {
    id: 'hft-brokers',
    name: 'HFT Brokers',
    slug: 'hft-brokers',
    description: 'High-frequency trading optimized brokers with ultra-low latency, co-location services, and infrastructure designed for algorithmic trading.',
    icon: '🚀',
    color: '#DC2626',
    categoryGroup: 'strategy',
    filterFn: (b) => {
      const avgSpread = parseSpread(b.fees?.trading?.averageSpreads?.[0]?.spread || '0.1');
      return avgSpread <= 0.1 && b.technology?.executionType?.includes('ECN') &&
             b.tradingConditionsExtended?.eaAllowed === true;
    },
    minimumBrokers: 5,
    seoTitle: 'Best High-Frequency Trading (HFT) Brokers 2025 | Algorithmic Trading',
    metaDescription: 'Compare top brokers for HFT and algorithmic trading. Ultra-low latency, co-location, VPS hosting, and raw spreads for automated systems.',
    localContext: {
      advantages: [
        'Ultra-low latency execution',
        'Co-location services available',
        'VPS hosting for reduced latency',
        'Raw spreads and high liquidity'
      ],
      disadvantages: [
        'High minimum deposits and volume requirements',
        'Complex fee structures',
        'Requires sophisticated trading systems',
        'High competition from other HFT firms'
      ],
      bestFor: ['Algorithmic traders', 'HFT firms', 'Quantitative traders', 'Institutional traders'],
      keyFeatures: ['Low latency', 'Co-location', 'VPS hosting', 'Raw spreads']
    }
  },
  {
    id: 'scalping-brokers',
    name: 'Scalping Brokers',
    slug: 'scalping-brokers',
    description: 'Scalper-friendly brokers with tight spreads, instant execution, and policies specifically designed to support high-frequency short-term trading strategies.',
    icon: '⚡',
    color: '#F59E0B',
    categoryGroup: 'strategy',
    filterFn: (b) => {
      const commissionCost = parseCommission(b.fees?.trading?.commissionStructure || '$0') / 10;
      const avgSpread = parseSpread(b.fees?.trading?.averageSpreads?.[0]?.spread || '1.0');
      const totalCost = avgSpread + commissionCost;
      return b.tradingConditionsExtended?.scalpingAllowed === true && totalCost < 0.8;
    },
    minimumBrokers: 7,
    seoTitle: 'Best Scalping Brokers 2025 | Low Spread High-Frequency Trading',
    metaDescription: 'Find the best brokers for scalping in 2025. Tight spreads, instant execution, no dealing desk, and scalper-friendly policies for profitable short-term trading.',
    localContext: {
      advantages: [
        'Tight spreads minimizing trading costs',
        'Fast execution for quick entries/exits',
        'No restrictions on short-term trading',
        'High liquidity for instant order filling'
      ],
      disadvantages: [
        'High trading frequency increases commission costs',
        'Requires constant market monitoring',
        'Stressful trading style requiring discipline',
        'Small profits per trade need high volume'
      ],
      bestFor: ['Active traders', 'Day traders', 'Traders with quick decision-making'],
      keyFeatures: ['Tight spreads', 'Fast execution', 'No trading restrictions', 'High liquidity']
    }
  },
  {
    id: 'swing-trading-brokers',
    name: 'Swing Trading Brokers',
    slug: 'swing-trading-brokers',
    description: 'Brokers optimized for swing trading with competitive overnight rates, reliable platforms, and features supporting medium-term trading strategies.',
    icon: '📈',
    color: '#10B981',
    categoryGroup: 'strategy',
    filterFn: (b) => b.tradingConditionsExtended?.hedgingAllowed === true &&
                     (b.tradableInstruments?.indices?.total ?? 0) >= 20,
    minimumBrokers: 7,
    seoTitle: 'Best Swing Trading Brokers 2025 | Medium-Term Trading Platforms',
    metaDescription: 'Compare top brokers for swing trading strategies. Competitive swap rates, reliable platforms, and tools for multi-day position holding.',
    localContext: {
      advantages: [
        'Less time-intensive than day trading',
        'Ability to capture larger market moves',
        'Reduced impact of short-term noise',
        'More relaxed trading schedule'
      ],
      disadvantages: [
        'Overnight financing charges apply',
        'Weekend gap risks',
        'Requires patience and discipline',
        'Market can reverse overnight'
      ],
      bestFor: ['Part-time traders', 'Patient traders', 'Position traders'],
      keyFeatures: ['Multi-day holding', 'Technical analysis tools', 'Risk management', 'Flexible scheduling']
    }
  },
  {
    id: 'hedging-brokers',
    name: 'Hedging Brokers',
    slug: 'hedging-brokers',
    description: 'Brokers allowing hedging strategies where traders can hold opposite positions in the same instrument simultaneously for risk management.',
    icon: '🛡️',
    color: '#3B82F6',
    categoryGroup: 'strategy',
    filterFn: (b) => b.tradingConditionsExtended?.hedgingAllowed === true,
    minimumBrokers: 8,
    seoTitle: 'Best Hedging Brokers 2025 | Simultaneous Buy/Sell Position Trading',
    metaDescription: 'Find brokers allowing hedging strategies in 2025. Open opposite positions simultaneously, manage risk effectively, and implement advanced trading strategies.',
    localContext: {
      advantages: [
        'Risk management through opposite positions',
        'Flexibility in trading strategies',
        'Ability to lock in profits or limit losses',
        'No need to close positions to reverse direction'
      ],
      disadvantages: [
        'Double spread costs for hedged positions',
        'Complex margin requirements',
        'May not be available in all jurisdictions',
        'Requires sophisticated understanding of risk'
      ],
      bestFor: ['Risk managers', 'Advanced traders', 'Institutional traders'],
      keyFeatures: ['Hedging allowed', 'Risk management', 'Flexible strategies', 'Opposite positions']
    }
  },
  {
    id: 'brokers-for-beginners',
    name: 'Brokers for Beginners',
    slug: 'brokers-for-beginners',
    description: 'Beginner-friendly brokers offering educational resources, low minimum deposits, demo accounts, and intuitive platforms designed for new traders.',
    icon: '🎓',
    color: '#22C55E',
    categoryGroup: 'strategy',
    filterFn: (b) => {
      const minDeposit = b.accountTypes?.[0]?.minDeposit ?? 0;
      return b.coreInfo.demoAccount === true && minDeposit <= 200 && b.score >= 8.0;
    },
    minimumBrokers: 7,
    seoTitle: 'Best Forex Brokers for Beginners 2025 | Start Trading Safely',
    metaDescription: 'Find the best forex brokers for beginners in 2025. Low deposits, educational resources, demo accounts, and beginner-friendly platforms with strong regulation.',
    localContext: {
      advantages: [
        'Low minimum deposits reduce entry barriers',
        'Comprehensive educational resources available',
        'Demo accounts for practice trading',
        'Intuitive, user-friendly platforms'
      ],
      disadvantages: [
        'May have limited advanced features',
        'Higher spreads than professional accounts',
        'Limited customization options',
        'May lack sophisticated trading tools'
      ],
      bestFor: ['New traders', 'Students', 'Career changers', 'Risk-averse beginners'],
      keyFeatures: ['Low deposits', 'Educational content', 'Demo accounts', 'Simple platforms']
    }
  },
  {
    id: 'day-trading-brokers',
    name: 'Day Trading Brokers',
    slug: 'day-trading-brokers',
    description: 'Brokers optimized for day trading with tight spreads, fast execution, reliable platforms, and policies supporting frequent intraday trading.',
    icon: '☀️',
    color: '#F97316',
    categoryGroup: 'strategy',
    filterFn: (b) => {
      const avgSpread = parseSpread(b.fees?.trading?.averageSpreads?.[0]?.spread || '1.0');
      return b.tradingConditionsExtended?.scalpingAllowed === true && avgSpread <= 1.0;
    },
    minimumBrokers: 7,
    seoTitle: 'Best Day Trading Brokers 2025 | Intraday Trading Platforms',
    metaDescription: 'Compare top brokers for day trading strategies. Tight spreads, fast execution, reliable platforms, and intraday trading support for active traders.',
    localContext: {
      advantages: [
        'No overnight financing charges',
        'Quick profit realization from intraday moves',
        'Reduced market risk with no overnight exposure',
        'High trading frequency opportunities'
      ],
      disadvantages: [
        'Requires constant market monitoring',
        'High-stress trading environment',
        'Commission costs can accumulate quickly',
        'Limited profit potential per trade'
      ],
      bestFor: ['Active traders', 'Full-time traders', 'Disciplined traders'],
      keyFeatures: ['Intraday focus', 'No overnight risk', 'Quick profits', 'Active monitoring required']
    }
  },
  {
    id: 'api-trading-brokers',
    name: 'API Trading Brokers',
    slug: 'api-trading-brokers',
    description: 'Brokers providing robust API access for automated trading, custom application development, and integration with third-party trading systems.',
    icon: '🔌',
    color: '#8B5CF6',
    categoryGroup: 'strategy',
    filterFn: (b) => b.technology?.apiSupport === true || b.technology?.apiAvailable === true,
    minimumBrokers: 5,
    seoTitle: 'Best API Trading Brokers 2025 | REST/FIX API for Automated Trading',
    metaDescription: 'Find top brokers offering API access for automated trading. REST API, FIX protocol, custom applications, and algorithmic trading support.',
    localContext: {
      advantages: [
        'Full automation of trading strategies',
        'Custom application development',
        'Real-time market data access',
        'Integration with existing systems'
      ],
      disadvantages: [
        'Requires programming knowledge',
        'Complex setup and maintenance',
        'API rate limits may apply',
        'Limited support for API issues'
      ],
      bestFor: ['Developers', 'Quantitative traders', 'Institutional traders'],
      keyFeatures: ['API access', 'Automated trading', 'Custom development', 'Real-time data']
    }
  }
];

// Feature Types
const featureTypes: EnhancedCategory[] = [
  {
    id: 'most-regulated-brokers',
    name: 'Most Regulated Brokers',
    slug: 'most-regulated-brokers',
    description: 'Highly regulated brokers with multiple top-tier licenses, offering maximum investor protection and financial security for traders.',
    icon: '🛡️',
    color: '#059669',
    categoryGroup: 'feature',
    filterFn: (b) => (b.security?.regulatedBy?.length ?? 0) >= 3 &&
                     b.security?.regulatedBy?.some(r => ['FCA', 'ASIC', 'NFA'].includes(r.regulator)),
    minimumBrokers: 7,
    seoTitle: 'Most Regulated Forex Brokers 2025 | Top Tier Regulatory Protection',
    metaDescription: 'Find the most regulated forex brokers with FCA, ASIC, NFA licenses. Maximum investor protection, segregated funds, and financial security.',
    localContext: {
      advantages: [
        'Maximum investor protection funds',
        'Segregated client funds for security',
        'Regular audits and compliance checks',
        'Transparent business practices'
      ],
      disadvantages: [
        'Lower leverage due to regulations',
        'Stricter verification requirements',
        'Limited promotional offers',
        'May restrict certain trading strategies'
      ],
      bestFor: ['Risk-averse traders', 'Large account holders', 'Long-term investors'],
      keyFeatures: ['Multiple regulations', 'Investor protection', 'Segregated funds', 'Regular audits']
    }
  },
  {
    id: 'micro-accounts-brokers',
    name: 'Micro Accounts Brokers',
    slug: 'micro-accounts-brokers',
    description: 'Brokers offering micro lot trading (0.01 lots) with low minimum deposits, perfect for beginners and traders wanting to test strategies with minimal risk.',
    icon: '🔬',
    color: '#3B82F6',
    categoryGroup: 'feature',
    filterFn: (b) => b.tradingConditionsExtended?.minTradeSize <= 0.01 &&
                     (b.accountTypes?.[0]?.minDeposit ?? 0) <= 100,
    minimumBrokers: 8,
    seoTitle: 'Best Micro Account Brokers 2025 | Trade from 0.01 Lots',
    metaDescription: 'Compare brokers offering micro accounts from 0.01 lots. Low minimum deposits, perfect for beginners and strategy testing with minimal capital risk.',
    localContext: {
      advantages: [
        'Start trading with as little as $10',
        'Test strategies with minimal risk',
        'Perfect position sizing for small accounts',
        'Gradual account growth possible'
      ],
      disadvantages: [
        'Limited profit potential per trade',
        'May not offer all features on micro accounts',
        'Higher spreads on very small positions',
        'Not suitable for income generation'
      ],
      bestFor: ['Beginners', 'Strategy testers', 'Small account traders'],
      keyFeatures: ['0.01 lot trading', 'Low deposits', 'Minimal risk', 'Position sizing']
    }
  },
  {
    id: 'high-leverage-brokers',
    name: 'High Leverage Brokers',
    slug: 'high-leverage-brokers',
    description: 'Brokers offering high leverage options (1:500+) for traders seeking amplified market exposure with relatively small capital requirements.',
    icon: '💪',
    color: '#DC2626',
    categoryGroup: 'feature',
    filterFn: (b) => parseLeverage(b.tradingConditionsExtended?.maxLeverage || '1:100') >= 500,
    minimumBrokers: 6,
    seoTitle: 'High Leverage Forex Brokers 2025 | 1:500+ Leverage Trading',
    metaDescription: 'Find brokers offering high leverage 1:500+ in 2025. Amplify your trading power, but understand the increased risks. Compare high leverage accounts.',
    localContext: {
      advantages: [
        'Amplified profit potential with small capital',
        'Access to larger position sizes',
        'More trading opportunities with limited funds',
        'Flexibility in position sizing'
      ],
      disadvantages: [
        'Extremely high risk of total loss',
        'Rapid account depletion during losses',
        'Psychological pressure from amplified risks',
        'Not suitable for inexperienced traders'
      ],
      bestFor: ['Experienced traders', 'Risk-tolerant traders', 'Short-term speculators'],
      keyFeatures: ['High leverage', 'Amplified profits', 'Small capital trading', 'High risk']
    }
  },
  {
    id: 'islamic-accounts-brokers',
    name: 'Islamic Account Brokers',
    slug: 'islamic-accounts-brokers',
    description: 'Brokers offering Sharia-compliant Islamic swap-free accounts, enabling Muslim traders to participate in forex trading without violating religious principles.',
    icon: '☪️',
    color: '#0891B2',
    categoryGroup: 'feature',
    filterFn: (b) => b.isIslamic === true || b.accountManagement?.islamicAccount?.available,
    minimumBrokers: 7,
    seoTitle: 'Best Islamic (Swap-Free) Forex Brokers 2025 | Sharia Compliant Trading',
    metaDescription: 'Find top Islamic forex brokers offering swap-free accounts. Sharia-compliant trading, no overnight interest, and Muslim trader support.',
    localContext: {
      advantages: [
        'Compliant with Islamic finance principles',
        'No overnight swap fees or interest',
        'Same trading conditions as standard accounts',
        'Religious peace of mind for Muslim traders'
      ],
      disadvantages: [
        'May have wider spreads to compensate',
        'Administrative fees might apply',
        'Limited account types available',
        'Some brokers restrict certain instruments'
      ],
      bestFor: ['Muslim traders', 'Sharia-compliant investors', 'Religious traders'],
      keyFeatures: ['Swap-free trading', 'Sharia compliant', 'No interest charges', 'Islamic principles']
    }
  },
  {
    id: 'no-deposit-brokers',
    name: 'No Deposit Brokers',
    slug: 'no-deposit-brokers',
    description: 'Brokers offering no-deposit welcome bonuses, allowing traders to start trading with free capital and experience real market conditions without risking their own money.',
    icon: '🎁',
    color: '#16A34A',
    categoryGroup: 'feature',
    filterFn: (b) => b.bonuses?.welcomeBonus?.includes('No Deposit') ||
                     b.promotions?.some(p => p.type?.includes('No Deposit')),
    minimumBrokers: 5,
    seoTitle: 'No Deposit Bonus Forex Brokers 2025 | Start Trading Free',
    metaDescription: 'Find forex brokers offering no deposit bonuses in 2025. Start trading with free capital, no risk required. Compare the best no-deposit offers.',
    localContext: {
      advantages: [
        'Risk-free trading with broker funds',
        'Test real trading conditions',
        'Withdraw profits after meeting conditions',
        'No personal capital required to start'
      ],
      disadvantages: [
        'Strict withdrawal conditions',
        'High trading volume requirements',
        'Limited bonus amounts',
        'Time restrictions on bonus usage'
      ],
      bestFor: ['Risk-averse beginners', 'Bonus hunters', 'Strategy testers'],
      keyFeatures: ['Free capital', 'Risk-free trading', 'Profit withdrawal', 'Welcome bonus']
    }
  },
  {
    id: 'no-minimum-deposit-brokers',
    name: 'No Minimum Deposit Brokers',
    slug: 'no-minimum-deposit-brokers',
    description: 'Brokers with no minimum deposit requirements, allowing traders to start with any amount and build their accounts gradually.',
    icon: '💰',
    color: '#9333EA',
    categoryGroup: 'feature',
    filterFn: (b) => (b.accountTypes?.[0]?.minDeposit ?? 0) === 0,
    minimumBrokers: 7,
    seoTitle: 'No Minimum Deposit Forex Brokers 2025 | Start Trading Any Amount',
    metaDescription: 'Compare forex brokers with no minimum deposit requirements. Start trading with $1, test strategies, and build your account gradually with trusted brokers.',
    localContext: {
      advantages: [
        'Start with any amount you can afford',
        'Perfect for testing strategies',
        'Gradual account building possible',
        'Financial flexibility for all budgets'
      ],
      disadvantages: [
        'Limited trading features with tiny deposits',
        'High commission percentage on small trades',
        'Slow account growth with minimal capital',
        'May not access all account types'
      ],
      bestFor: ['Budget-conscious traders', 'Strategy testers', 'Beginners'],
      keyFeatures: ['No minimum deposit', 'Start small', 'Flexible budgeting', 'Gradual growth']
    }
  },
  {
    id: 'mt4-brokers',
    name: 'MT4 Brokers',
    slug: 'mt4-brokers',
    description: 'Brokers supporting MetaTrader 4, the industry\'s most popular trading platform with advanced charting, automated trading, and extensive technical analysis tools.',
    icon: '📱',
    color: '#0EA5E9',
    categoryGroup: 'feature',
    filterFn: (b) => b.technology?.platforms?.includes('MT4'),
    minimumBrokers: 10,
    seoTitle: 'Best MT4 Forex Brokers 2025 | MetaTrader 4 Trading Platforms',
    metaDescription: 'Find the best MT4 forex brokers in 2025. Compare MetaTrader 4 platforms, EAs, custom indicators, and automated trading capabilities.',
    localContext: {
      advantages: [
        'Industry-standard platform with huge community',
        'Extensive library of EAs and custom indicators',
        'Advanced charting and technical analysis',
        'Mobile and web versions available'
      ],
      disadvantages: [
        'Older platform technology',
        'Limited development and updates',
        'Not as modern as newer platforms',
        'May lack some advanced features'
      ],
      bestFor: ['Algorithmic traders', 'Technical analysts', 'EA users'],
      keyFeatures: ['MT4 platform', 'Expert advisors', 'Custom indicators', 'Mobile trading']
    }
  },
  {
    id: 'mt5-brokers',
    name: 'MT5 Brokers',
    slug: 'mt5-brokers',
    description: 'Brokers offering MetaTrader 5, the next-generation trading platform with advanced features, more asset classes, and improved performance.',
    icon: '🚀',
    color: '#F59E0B',
    categoryGroup: 'feature',
    filterFn: (b) => b.technology?.platforms?.includes('MT5'),
    minimumBrokers: 8,
    seoTitle: 'Best MT5 Forex Brokers 2025 | MetaTrader 5 Trading Platforms',
    metaDescription: 'Compare top MT5 forex brokers for 2025. Advanced platform, more asset classes, improved performance, and enhanced trading capabilities.',
    localContext: {
      advantages: [
        'More advanced features than MT4',
        'Access to additional asset classes',
        'Better performance and speed',
        'Modern, updated platform technology'
      ],
      disadvantages: [
        'Smaller community than MT4',
        'Fewer third-party tools available',
        'Learning curve for MT4 users',
        'Not all brokers support all features'
      ],
      bestFor: ['Multi-asset traders', 'Advanced traders', 'Platform power users'],
      keyFeatures: ['MT5 platform', 'Multi-asset trading', 'Advanced features', 'Modern technology']
    }
  },
  {
    id: 'tradingview-brokers',
    name: 'TradingView Brokers',
    slug: 'tradingview-brokers',
    description: 'Brokers integrated with TradingView, offering seamless connection to the world\'s most advanced charting platform and social trading community.',
    icon: '📊',
    color: '#1E40AF',
    categoryGroup: 'feature',
    filterFn: (b) => b.technology?.platforms?.includes('TradingView') ||
                     b.technology?.tradingViewIntegration === true,
    minimumBrokers: 6,
    seoTitle: 'Best TradingView Brokers 2025 | Chart & Trade Direct Integration',
    metaDescription: 'Find brokers with TradingView integration in 2025. Advanced charting, social trading, and direct execution from TradingView charts.',
    localContext: {
      advantages: [
        'World\'s best charting platform',
        'Large social trading community',
        'Extensive library of indicators and strategies',
        'Seamless chart-to-trade execution'
      ],
      disadvantages: [
        'May require TradingView subscription',
        'Limited broker integration',
        'Dependency on third-party platform',
        'Potential execution delays'
      ],
      bestFor: ['Technical analysts', 'Chart traders', 'Social traders'],
      keyFeatures: ['TradingView charts', 'Social trading', 'Advanced indicators', 'Chart trading']
    }
  },
  {
    id: 'crypto-cfd-brokers',
    name: 'Crypto CFD Brokers',
    slug: 'crypto-cfd-brokers',
    description: 'Brokers offering cryptocurrency CFD trading with high leverage, allowing traders to speculate on crypto prices without owning the actual assets.',
    icon: '₿',
    color: '#F97316',
    categoryGroup: 'feature',
    filterFn: (b) => (b.tradableInstruments?.cryptocurrencies?.total ?? 0) >= 10,
    minimumBrokers: 7,
    seoTitle: 'Best Crypto CFD Brokers 2025 | Cryptocurrency Trading with Leverage',
    metaDescription: 'Compare top crypto CFD brokers for 2025. Trade Bitcoin, Ethereum, and more with high leverage. No wallet required, just speculate on prices.',
    localContext: {
      advantages: [
        'Trade crypto with high leverage',
        'No need for crypto wallets',
        'Profit from falling prices (short selling)',
        'Regulated broker protection'
      ],
      disadvantages: [
        'High volatility increases risk',
        'Overnight financing charges',
        'Limited crypto selection vs exchanges',
        'Not owning actual cryptocurrency'
      ],
      bestFor: ['Crypto speculators', 'Leverage traders', 'Price action traders'],
      keyFeatures: ['Crypto CFDs', 'High leverage', 'Short selling', 'No wallet needed']
    }
  },
  {
    id: 'stock-cfd-brokers',
    name: 'Stock CFD Brokers',
    slug: 'stock-cfd-brokers',
    description: 'Brokers offering stock CFD trading with access to global equity markets, allowing traders to speculate on stock prices without owning shares.',
    icon: '📈',
    color: '#059669',
    categoryGroup: 'feature',
    filterFn: (b) => (b.tradableInstruments?.stocks?.total ?? 0) >= 500,
    minimumBrokers: 7,
    seoTitle: 'Best Stock CFD Brokers 2025 | Trade Global Stock Markets with Leverage',
    metaDescription: 'Find top stock CFD brokers for 2025. Trade Apple, Tesla, and 1000+ global stocks with leverage. No ownership required, just price speculation.',
    localContext: {
      advantages: [
        'Access to global stock markets',
        'Trade with leverage for amplified returns',
        'Profit from falling stock prices',
        'No need to own actual shares'
      ],
      disadvantages: [
        'Overnight financing charges',
        'Dividend adjustments on CFDs',
        'Limited voting rights or ownership benefits',
        'Market hours restrictions'
      ],
      bestFor: ['Stock traders', 'Market speculators', 'Leverage traders'],
      keyFeatures: ['Stock CFDs', 'Global markets', 'Leverage trading', 'Short selling']
    }
  },
  {
    id: 'offshore-brokers',
    name: 'Offshore Brokers',
    slug: 'offshore-brokers',
    description: 'Internationally regulated brokers offering higher leverage, flexible trading conditions, and services to global traders outside strict regulatory jurisdictions.',
    icon: '🌊',
    color: '#6B7280',
    categoryGroup: 'feature',
    filterFn: (b) => {
      const regulators = b.security?.regulatedBy?.map(r => r.regulator) || [];
      return regulators.some(r => ['IFSC', 'FSC Belize', 'SCB', 'FSA'].includes(r)) &&
             !regulators.some(r => ['FCA', 'ASIC', 'NFA'].includes(r));
    },
    minimumBrokers: 6,
    seoTitle: 'Best Offshore Forex Brokers 2025 | High Leverage International Trading',
    metaDescription: 'Compare top offshore forex brokers for 2025. Higher leverage, flexible conditions, and international regulation. Perfect for experienced traders.',
    localContext: {
      advantages: [
        'Higher leverage options available',
        'Flexible trading conditions',
        'Fewer trading restrictions',
        'International market access'
      ],
      disadvantages: [
        'Less investor protection than top-tier regulators',
        'Higher risk of broker default',
        'Limited regulatory oversight',
        'Potential withdrawal issues'
      ],
      bestFor: ['Experienced traders', 'High leverage seekers', 'International traders'],
      keyFeatures: ['High leverage', 'Flexible conditions', 'International regulation', 'Fewer restrictions']
    }
  },
  {
    id: 'corporate-account-brokers',
    name: 'Corporate Account Brokers',
    slug: 'corporate-account-brokers',
    description: 'Brokers offering specialized corporate and business trading accounts with features designed for companies, partnerships, and institutional traders.',
    icon: '🏢',
    color: '#1F2937',
    categoryGroup: 'feature',
    filterFn: (b) => b.accountManagement?.corporateAccount?.available ||
                     b.support?.services?.includes('Corporate Accounts'),
    minimumBrokers: 5,
    seoTitle: 'Best Corporate Account Forex Brokers 2025 | Business Trading Accounts',
    metaDescription: 'Find top brokers offering corporate accounts for businesses. Multi-user access, specialized support, and business-friendly trading conditions.',
    localContext: {
      advantages: [
        'Multi-user access and management',
        'Specialized business support',
        'Consolidated reporting for accounting',
        'Higher trading limits and credit facilities'
      ],
      disadvantages: [
        'Complex verification process',
        'Higher minimum deposits required',
        'Extensive documentation needed',
        'May have additional compliance requirements'
      ],
      bestFor: ['Trading companies', 'Investment firms', 'Corporate traders'],
      keyFeatures: ['Business accounts', 'Multi-user access', 'Corporate support', 'Specialized services']
    }
  },
  {
    id: 'trailing-stop-brokers',
    name: 'Trailing Stop Loss Brokers',
    slug: 'trailing-stop-loss-brokers',
    description: 'Brokers offering trailing stop loss orders, allowing traders to lock in profits while giving trades room to grow in profitable direction.',
    icon: '🎯',
    color: '#DC2626',
    categoryGroup: 'feature',
    filterFn: (b) => b.tradingConditionsExtended?.trailingStopAvailable === true ||
                     b.platformFeatures?.orderTypes?.includes('Trailing Stop'),
    minimumBrokers: 6,
    seoTitle: 'Best Trailing Stop Loss Brokers 2025 | Automated Profit Protection',
    metaDescription: 'Find brokers offering trailing stop loss orders in 2025. Automated profit protection, trend following, and advanced risk management features.',
    localContext: {
      advantages: [
        'Automated profit protection as price moves favorably',
        'Locks in gains while allowing for continued growth',
        'Reduces need for constant monitoring',
        'Perfect for trend-following strategies'
      ],
      disadvantages: [
        'May trigger prematurely in volatile markets',
        'Limited to certain order types and platforms',
        'Requires understanding of optimal distance settings',
        'Not available from all brokers'
      ],
      bestFor: ['Trend traders', 'Swing traders', 'Part-time traders'],
      keyFeatures: ['Trailing stops', 'Automated protection', 'Trend following', 'Profit locking']
    }
  }
];

// Combine all categories
export const enhancedCategories: EnhancedCategory[] = [
  ...generalBrokerTypes,
  ...executionTypes,
  ...strategyTypes,
  ...featureTypes
];

// Group categories by type
export const categoryGroups = {
  general: generalBrokerTypes.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon,
    color: cat.color
  })),
  execution: executionTypes.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon,
    color: cat.color
  })),
  strategy: strategyTypes.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon,
    color: cat.color
  })),
  feature: featureTypes.map(cat => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    icon: cat.icon,
    color: cat.color
  }))
};

// Helper function to get brokers for a category
export const getBrokersForCategory = (brokers: Broker[], categoryId: string): Broker[] => {
  const category = enhancedCategories.find(cat => cat.id === categoryId);
  if (!category) {
    console.error(`Category with id "${categoryId}" not found. Available categories:`, enhancedCategories.map(c => c.id));
    return [];
  }

  console.log(`\n=== Filtering brokers for category: "${category.name}" (${category.id}) ===`);
  console.log(`Available brokers: ${brokers.length}`);
  console.log(`Category group: ${category.categoryGroup}`);
  console.log(`Minimum brokers required: ${category.minimumBrokers}`);

  // Filter brokers using the category's filter function
  const filteredBrokers = brokers.filter((broker, index) => {
    try {
      const result = category.filterFn(broker);
      if (result && index < 5) { // Log first few matches for debugging
        console.log(`✓ Match: "${broker.name}" (score: ${broker.score})`);
      }
      return result;
    } catch (error) {
      console.warn(`✗ Error filtering broker "${broker.name}" for category "${category.name}":`, error);
      return false;
    }
  });

  console.log(`Found ${filteredBrokers.length} brokers for category "${category.name}" after initial filtering.`);

  if (filteredBrokers.length > 0) {
    console.log(`Top brokers in this category:`, filteredBrokers.slice(0, 3).map(b => `${b.name} (${b.score})`));
  }

  // Ensure minimum broker count by adding fallback brokers if needed
  if (filteredBrokers.length < category.minimumBrokers) {
    console.warn(`Category "${category.name}" has only ${filteredBrokers.length} brokers, minimum required: ${category.minimumBrokers}. Adding fallbacks.`);

    // Add fallback brokers - top rated brokers that don't meet specific criteria
    const fallbackBrokers = brokers
      .filter(broker => !filteredBrokers.some(fb => fb.id === broker.id))
      .sort((a, b) => (b.score || 0) - (a.score || 0))
      .slice(0, category.minimumBrokers - filteredBrokers.length);

    if (fallbackBrokers.length > 0) {
      console.log(`Adding ${fallbackBrokers.length} fallback brokers:`, fallbackBrokers.map(b => `${b.name} (${b.score})`));
      filteredBrokers.push(...fallbackBrokers);
    } else {
      console.warn(`No fallback brokers available for category "${category.name}"`);
    }
  }

  // Sort by rating (score) and limit to reasonable number
  const sortedBrokers = filteredBrokers
    .sort((a, b) => (b.score || 0) - (a.score || 0))
    .slice(0, 50);

  console.log(`=== Final result: Returning ${sortedBrokers.length} brokers for category "${category.name}" ===`);
  if (sortedBrokers.length > 0) {
    console.log(`Final sorted brokers:`, sortedBrokers.map(b => `${b.name} (${b.score})`));
  }
  console.log(''); // Add empty line for readability

  return sortedBrokers;
};

// Helper function to get category by slug
export const getCategoryBySlug = (slug: string): EnhancedCategory | undefined => {
  return enhancedCategories.find(cat => cat.slug === slug);
};

// Helper function to get categories for broker
export const getCategoriesForBroker = (broker: Broker): EnhancedCategory[] => {
  return enhancedCategories.filter(category => category.filterFn(broker));
};