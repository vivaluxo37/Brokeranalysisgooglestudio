import { Broker } from '../types';

export interface SEOPageConfig {
  title: string;
  description: string;
  heading: string;
  subheading: string;
  path: string;
  filters: {
    regulators?: string[];
    platforms?: string[];
    accountTypes?: string[];
    minDeposit?: number;
    maxDeposit?: number;
    leverage?: number;
    features?: string[];
    regions?: string[];
    specialties?: string[];
  };
  highlights: string[];
  faqs: Array<{ question: string; answer: string }>;
  relatedPages?: Array<{ title: string; url: string }>;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly';
}

// Deposit-based pages
export const depositPages: SEOPageConfig[] = [
  {
    title: 'No Minimum Deposit Forex Brokers',
    description: 'Compare forex brokers with no minimum deposit requirements. Start trading with as little as $1 and find the best zero deposit brokers for 2025.',
    heading: 'Best Forex Brokers with No Minimum Deposit',
    subheading: 'Start trading forex with no minimum deposit requirement. These brokers allow you to begin with any amount, making forex trading accessible to everyone.',
    path: '/brokers/no-minimum-deposit',
    filters: { maxDeposit: 0 },
    highlights: ['No Minimum Deposit', 'Start with $1', 'Beginner Friendly', 'Risk-Free Testing'],
    faqs: [
      {
        question: 'Can I really start forex trading with no money?',
        answer: 'While you can open an account with no minimum deposit, you\'ll need some funds to actually place trades. Most brokers require at least $1-10 to start trading.'
      },
      {
        question: 'Are no deposit brokers safe?',
        answer: 'Yes, as long as they\'re regulated by reputable authorities like FCA, ASIC, or NFA. Always check a broker\'s regulatory status before depositing funds.'
      }
    ],
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    title: 'Low Deposit Forex Brokers ($1-50)',
    description: 'Find the best low deposit forex brokers requiring just $1-50 to start trading. Perfect for beginners and those testing strategies with minimal risk.',
    heading: 'Best Low Deposit Forex Brokers',
    subheading: 'Start your forex trading journey with minimal capital. These brokers require deposits between $1-50, making forex trading accessible to everyone.',
    path: '/brokers/low-deposit',
    filters: { minDeposit: 1, maxDeposit: 50 },
    highlights: ['Deposit from $1', 'Low Risk Entry', 'Beginner Friendly', 'Test Strategies'],
    faqs: [
      {
        question: 'What can I do with a $50 forex account?',
        answer: 'With $50, you can practice trading, test strategies, and learn the market. Use micro lots (0.01) to manage risk properly and gain real trading experience.'
      }
    ],
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    title: '$100 Deposit Forex Brokers',
    description: 'Top forex brokers accepting $100 minimum deposits. Find regulated brokers where you can start trading with just $100 and access professional trading conditions.',
    heading: 'Best Forex Brokers with $100 Minimum Deposit',
    subheading: 'Start trading with $100 and access professional forex trading conditions. These regulated brokers offer competitive spreads and reliable platforms.',
    path: '/brokers/100-deposit',
    filters: { minDeposit: 50, maxDeposit: 200 },
    highlights: ['$100 Minimum', 'Regulated Brokers', 'Professional Trading', 'Good Value'],
    faqs: [
      {
        question: 'Is $100 enough to trade forex profitably?',
        answer: 'While $100 is enough to start, proper risk management means risking only 1-2% per trade ($1-2). This limits position sizes but is excellent for learning.'
      }
    ],
    priority: 0.8,
    changefreq: 'weekly'
  }
];

// Platform-based pages
export const platformPages: SEOPageConfig[] = [
  {
    title: 'Best MetaTrader 4 (MT4) Forex Brokers',
    description: 'Compare the best MT4 forex brokers with tight spreads, fast execution, and reliable trading conditions. Find top-rated brokers offering MetaTrader 4.',
    heading: 'Top MetaTrader 4 Forex Brokers',
    subheading: 'Discover the best forex brokers offering MT4 platform. Enjoy advanced charting, automated trading, and thousands of expert advisors.',
    path: '/brokers/metatrader4-mt4',
    filters: { platforms: ['MT4'] },
    highlights: ['MT4 Platform', 'Expert Advisors', 'Advanced Charts', 'Automated Trading'],
    faqs: [
      {
        question: 'Why is MT4 so popular?',
        answer: 'MT4 is popular due to its reliability, extensive charting tools, support for automated trading through EAs, and the large community of traders and developers.'
      }
    ],
    relatedPages: [
      { title: 'Best MT5 Brokers', url: '/brokers/metatrader5-mt5' },
      { title: 'Best cTrader Brokers', url: '/brokers/ctrader' }
    ],
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    title: 'Best MetaTrader 5 (MT5) Forex Brokers',
    description: 'Find the best MT5 forex brokers offering the latest MetaTrader 5 platform with advanced features, more timeframes, and improved trading tools.',
    heading: 'Top MetaTrader 5 Forex Brokers',
    subheading: 'Trade with the most advanced forex platform. MT5 offers more timeframes, indicators, and better performance than MT4.',
    path: '/brokers/metatrader5-mt5',
    filters: { platforms: ['MT5'] },
    highlights: ['MT5 Platform', 'Advanced Features', 'More Timeframes', 'Better Performance'],
    faqs: [
      {
        question: 'Should I choose MT4 or MT5?',
        answer: 'MT5 is newer with more features, but MT4 has more EAs and indicators. Choose MT5 if you want advanced features, MT4 if you need specific EAs.'
      }
    ],
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    title: 'Best cTrader Forex Brokers',
    description: 'Compare top cTrader forex brokers known for transparency, fast execution, and advanced charting. Find ECN brokers offering cTrader platform.',
    heading: 'Best cTrader Forex Brokers',
    subheading: 'Experience transparent trading with cTrader. These ECN brokers offer level II pricing, advanced charts, and fast execution.',
    path: '/brokers/ctrader',
    filters: { platforms: ['cTrader'] },
    highlights: ['cTrader Platform', 'ECN Trading', 'Level II Pricing', 'Fast Execution'],
    faqs: [
      {
        question: 'What makes cTrader different from MT4/MT5?',
        answer: 'cTrader offers more transparent pricing, built-in level II market depth, and cleaner interface. It\'s preferred by many professional traders for ECN trading.'
      }
    ],
    priority: 0.8,
    changefreq: 'weekly'
  }
];

// Feature-based pages
export const featurePages: SEOPageConfig[] = [
  {
    title: 'Best ECN Forex Brokers',
    description: 'Compare the best true ECN forex brokers with direct market access, tight spreads, and fast execution. Find ECN/STP brokers for serious traders.',
    heading: 'Top ECN Forex Brokers',
    subheading: 'Trade with direct market access through true ECN brokers. Enjoy tight spreads, fast execution, and no dealing desk intervention.',
    path: '/brokers/ecn-brokers',
    filters: {
      accountTypes: ['ECN'],
      features: ['scalping'],
      minDeposit: 0
    },
    highlights: ['True ECN', 'DMA Trading', 'Tight Spreads', 'No Dealing Desk'],
    faqs: [
      {
        question: 'What is a true ECN broker?',
        answer: 'A true ECN broker connects your trades directly to the market through electronic communication networks, with no dealing desk intervention. You get real market prices.'
      }
    ],
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    title: 'Best STP Forex Brokers',
    description: 'Find top STP (Straight Through Processing) forex brokers that route your orders directly to liquidity providers without intervention.',
    heading: 'Best STP Forex Brokers',
    subheading: 'Trade with STP brokers for transparent order execution. Your trades are processed directly to liquidity providers without dealing desk intervention.',
    path: '/brokers/stp-brokers',
    filters: { accountTypes: ['STP'] },
    highlights: ['STP Execution', 'No Requotes', 'Transparent Pricing', 'Fast Execution'],
    faqs: [
      {
        question: 'What\'s the difference between STP and ECN?',
        answer: 'STP brokers route orders to liquidity providers but may mark up spreads. ECN brokers connect you directly to the market and typically charge commission instead of markup.'
      }
    ],
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    title: 'Best Islamic (Swap-Free) Forex Brokers',
    description: 'Compare top Islamic forex brokers offering Sharia-compliant swap-free accounts. Find brokers that comply with Islamic finance principles.',
    heading: 'Best Islamic Forex Brokers',
    subheading: 'Trade forex in compliance with Islamic finance principles. These brokers offer swap-free accounts with no interest charges.',
    path: '/brokers/islamic-swap-free',
    filters: { features: ['islamic'] },
    highlights: ['Swap-Free', 'Sharia Compliant', 'No Interest', 'Islamic Accounts'],
    faqs: [
      {
        question: 'Are Islamic accounts really free of interest?',
        answer: 'Yes, legitimate Islamic accounts don\'t charge or pay overnight swaps (interest). However, brokers may compensate through slightly wider spreads or administrative fees.'
      }
    ],
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    title: 'Best Copy Trading Forex Brokers',
    description: 'Find the best forex brokers for copy trading and social trading. Copy professional traders automatically and learn from their strategies.',
    heading: 'Top Copy Trading Forex Brokers',
    subheading: 'Copy the trades of successful professionals automatically. These brokers offer advanced social and copy trading platforms.',
    path: '/brokers/copy-trading',
    filters: { features: ['copytrading'] },
    highlights: ['Copy Trading', 'Social Trading', 'Auto Trading', 'Follow Experts'],
    faqs: [
      {
        question: 'How does copy trading work?',
        answer: 'Copy trading allows you to automatically copy the trades of experienced traders. You allocate funds to copy a trader, and their positions are replicated in your account proportionally.'
      }
    ],
    priority: 0.9,
    changefreq: 'weekly'
  }
];

// Regional pages
export const regionalPages: SEOPageConfig[] = [
  {
    title: 'Best Forex Brokers in USA',
    description: 'Compare the best NFA-regulated forex brokers for US traders. Find brokers accepting US clients with high leverage and excellent trading conditions.',
    heading: 'Top Forex Brokers for US Traders',
    subheading: 'Trade with confidence using NFA-regulated brokers. These brokers accept US clients and comply with strict regulatory requirements.',
    path: '/brokers/usa-traders',
    filters: { regulators: ['NFA', 'CFTC'] },
    highlights: ['NFA Regulated', 'US Clients Accepted', 'High Protection', 'Reliable'],
    faqs: [
      {
        question: 'Why are there limited brokers in the US?',
        answer: 'US regulations are very strict, requiring high capital requirements and limiting leverage to 50:1. Many international brokers choose not to accept US clients due to these regulations.'
      }
    ],
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    title: 'Best UK Forex Brokers (FCA Regulated)',
    description: 'Find the best FCA-regulated forex brokers for UK traders. Compare top UK brokers with negative balance protection and £85k investor compensation.',
    heading: 'Top FCA-Regulated Forex Brokers in the UK',
    subheading: 'Trade safely with FCA-regulated brokers offering negative balance protection and £85,000 investor compensation scheme protection.',
    path: '/brokers/uk-fca-regulated',
    filters: { regulators: ['FCA'] },
    highlights: ['FCA Regulated', '£85k Protection', 'Negative Balance Protection', 'UK Based'],
    faqs: [
      {
        question: 'What protection do FCA brokers offer?',
        answer: 'FCA-regulated brokers offer negative balance protection and are covered by the FSCS up to £85,000 per client. This means your funds are protected if the broker goes bankrupt.'
      }
    ],
    priority: 0.9,
    changefreq: 'weekly'
  }
];

// Trading style pages
export const tradingStylePages: SEOPageConfig[] = [
  {
    title: 'Best Forex Brokers for Scalping',
    description: 'Compare the best forex brokers for scalping with tight spreads, fast execution, and no restrictions. Find ECN brokers ideal for high-frequency trading.',
    heading: 'Top Forex Brokers for Scalping',
    subheading: 'Execute high-frequency trades with brokers designed for scalping. Enjoy tight spreads, fast execution, and no restrictions on short-term trading.',
    path: '/brokers/scalping',
    filters: {
      features: ['scalping'],
      accountTypes: ['ECN']
    },
    highlights: ['Scalping Allowed', 'Tight Spreads', 'Fast Execution', 'No Restrictions'],
    faqs: [
      {
        question: 'What makes a broker good for scalping?',
        answer: 'Good scalping brokers offer tight spreads (under 1 pip), fast execution (under 100ms), no restrictions on trading styles, and ECN execution to avoid conflicts of interest.'
      }
    ],
    priority: 0.9,
    changefreq: 'weekly'
  },
  {
    title: 'Best Forex Brokers for Swing Trading',
    description: 'Find the best forex brokers for swing trading with competitive overnight fees, reliable platforms, and good charting tools for multi-day trades.',
    heading: 'Best Forex Brokers for Swing Trading',
    subheading: 'Hold positions for days or weeks with brokers offering competitive swap rates, reliable platforms, and excellent technical analysis tools.',
    path: '/brokers/swing-trading',
    filters: { maxDeposit: 1000 },
    highlights: ['Low Swap Fees', 'Good Charting', 'Reliable Platforms', 'Swing Friendly'],
    faqs: [
      {
        question: 'What should swing traders look for in a broker?',
        answer: 'Swing traders should focus on competitive overnight swap fees, reliable platforms that don\'t disconnect, good charting tools, and brokers that allow multi-day positions without restrictions.'
      }
    ],
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    title: 'Best Forex Brokers for Day Trading',
    description: 'Compare the best forex brokers for day trading with fast execution, low commissions, and advanced platforms designed for active traders.',
    heading: 'Top Forex Brokers for Day Trading',
    subheading: 'Execute multiple trades per day with brokers optimized for active trading. Fast execution, low costs, and professional platforms.',
    path: '/brokers/day-trading',
    filters: { minDeposit: 0, features: ['scalping'] },
    highlights: ['Day Trading Friendly', 'Low Commissions', 'Fast Execution', 'Professional Tools'],
    faqs: [
      {
        question: 'How much capital do I need for day trading?',
        answer: 'While you can start with $500-1000, most successful day traders recommend at least $5000-10000 to properly manage risk and handle trading costs and drawdowns.'
      }
    ],
    priority: 0.9,
    changefreq: 'weekly'
  }
];

// Commission structure pages
export const commissionPages: SEOPageConfig[] = [
  {
    title: 'Best Zero Commission Forex Brokers',
    description: 'Compare forex brokers with zero commission trading. Find brokers that make money only from spreads, no commission charges on trades.',
    heading: 'Best Zero Commission Forex Brokers',
    subheading: 'Trade without commission charges. These brokers only earn from spreads, making it easier to calculate your trading costs.',
    path: '/brokers/zero-commission',
    filters: { accountTypes: ['STP'] },
    highlights: ['Zero Commission', 'Spread-Only', 'Simple Pricing', 'Cost Transparent'],
    faqs: [
      {
        question: 'Are zero commission brokers really cheaper?',
        answer: 'Not necessarily. Zero commission brokers often have wider spreads to compensate. Compare the total cost (spread + commission) to find the true cheapest option.'
      }
    ],
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    title: 'Best Low Commission Forex Brokers',
    description: 'Find forex brokers with the lowest commission rates. Compare ECN brokers offering tight spreads plus minimal commission charges.',
    heading: 'Best Low Commission Forex Brokers',
    subheading: 'Minimize your trading costs with brokers offering the lowest commission rates. Enjoy tight spreads plus minimal commissions.',
    path: '/brokers/low-commission',
    filters: { accountTypes: ['ECN'] },
    highlights: ['Low Commission', 'Tight Spreads', 'ECN Pricing', 'Cost Effective'],
    faqs: [
      {
        question: 'What is a typical forex commission?',
        answer: 'ECN brokers typically charge $3-7 per round-turn lot (100,000 units). Some offer volume discounts, and commission structures vary between brokers.'
      }
    ],
    priority: 0.8,
    changefreq: 'weekly'
  }
];

// Leverage pages
export const leveragePages: SEOPageConfig[] = [
  {
    title: 'Best High Leverage Forex Brokers (1:500+)',
    description: 'Compare forex brokers offering high leverage up to 1:500, 1:1000, or unlimited. Find brokers with maximum leverage for experienced traders.',
    heading: 'Best High Leverage Forex Brokers',
    subheading: 'Access maximum leverage with brokers offering 1:500, 1:1000, or higher. Suitable for experienced traders who understand the risks.',
    path: '/brokers/high-leverage',
    filters: { leverage: 500 },
    highlights: ['High Leverage', '1:500+', 'Professional Trading', 'Margin Efficiency'],
    faqs: [
      {
        question: 'Is high leverage dangerous?',
        answer: 'Yes, high leverage amplifies both profits and losses. While it allows trading larger positions with less capital, it also increases the risk of rapid account depletion. Use with caution.'
      }
    ],
    priority: 0.8,
    changefreq: 'weekly'
  }
];

// Asset-specific pages
export const assetPages: SEOPageConfig[] = [
  {
    title: 'Best Crypto Forex Brokers',
    description: 'Compare forex brokers offering cryptocurrency trading. Find brokers with Bitcoin, Ethereum, and other crypto CFDs with competitive spreads.',
    heading: 'Best Forex Brokers for Cryptocurrency Trading',
    subheading: 'Trade cryptocurrencies alongside forex pairs. These brokers offer Bitcoin, Ethereum, and other crypto CFDs with competitive conditions.',
    path: '/brokers/crypto-trading',
    filters: { specialties: ['crypto'] },
    highlights: ['Crypto Trading', 'Bitcoin CFDs', 'Multiple Cryptos', 'One Platform'],
    faqs: [
      {
        question: 'Can I trade real crypto or just CFDs?',
        answer: 'Most forex brokers offer crypto CFDs (Contracts for Difference) rather than actual cryptocurrencies. This means you\'re speculating on price movements without owning the underlying asset.'
      }
    ],
    priority: 0.8,
    changefreq: 'weekly'
  },
  {
    title: 'Best Stock CFD Forex Brokers',
    description: 'Find forex brokers offering stock CFD trading. Trade major company stocks alongside forex pairs from the same trading platform.',
    heading: 'Best Forex Brokers for Stock CFD Trading',
    subheading: 'Diversify into stock CFDs while keeping your forex trading. Access major company stocks from global exchanges through your forex broker.',
    path: '/brokers/stock-cfds',
    filters: { specialties: ['stocks'] },
    highlights: ['Stock CFDs', 'Global Companies', 'Diversification', 'Single Platform'],
    faqs: [
      {
        question: 'What are stock CFDs?',
        answer: 'Stock CFDs (Contracts for Difference) allow you to speculate on stock price movements without owning the actual shares. You can go long or short with leverage.'
      }
    ],
    priority: 0.8,
    changefreq: 'weekly'
  }
];

// Combine all page configurations
export const allSEOPageConfigs: SEOPageConfig[] = [
  ...depositPages,
  ...platformPages,
  ...featurePages,
  ...regionalPages,
  ...tradingStylePages,
  ...commissionPages,
  ...leveragePages,
  ...assetPages
];

// Group by category for sitemap generation
export const seoPageCategories = {
  deposit: depositPages,
  platforms: platformPages,
  features: featurePages,
  regional: regionalPages,
  trading: tradingStylePages,
  commission: commissionPages,
  leverage: leveragePages,
  assets: assetPages
};

// Helper function to generate page content dynamically
export const generatePageContent = (config: SEOPageConfig, brokers: Broker[]) => {
  // This could be expanded to generate more detailed content based on the specific brokers that match the filters
  const brokerCount = brokers.length;
  const avgScore = brokerCount > 0 ? brokers.reduce((sum, b) => sum + b.score, 0) / brokerCount : 0;

  return {
    ...config,
    dynamicContent: {
      brokerCount,
      avgScore: Math.round(avgScore * 10) / 10,
      topRegulators: Array.from(new Set(brokers.flatMap(b => b.regulation.regulators))).slice(0, 3),
      avgSpread: brokerCount > 0 ? Math.round(brokers.reduce((sum, b) => sum + parseFloat(b.tradingConditions.spreads.eurusd), 0) / brokerCount * 100) / 100 : 0
    }
  };
};