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
    title: 'Best Crypto CFD Brokers 2025',
    description: 'Compare the best cryptocurrency CFD brokers for 2025. Trade Bitcoin, Ethereum, and other crypto CFDs with leverage, competitive spreads, and advanced platforms.',
    heading: 'Top Cryptocurrency CFD Brokers',
    subheading: 'Trade crypto CFDs with leverage on regulated platforms. Access Bitcoin, Ethereum, and 50+ cryptocurrencies with competitive spreads and professional tools.',
    path: '/brokers/crypto-cfd-brokers',
    filters: { specialties: ['crypto'] },
    highlights: ['Crypto CFDs', 'Leverage Trading', 'Regulated Platforms', '50+ Cryptos', 'Low Spreads'],
    faqs: [
      {
        question: 'What are cryptocurrency CFDs?',
        answer: 'Crypto CFDs (Contracts for Difference) allow you to speculate on cryptocurrency price movements without owning the actual coins. You can go long or short with leverage, making profits from both rising and falling markets.'
      },
      {
        question: 'Are crypto CFD brokers safe?',
        answer: 'Yes, when you choose regulated brokers. Look for brokers regulated by FCA, ASIC, CySEC, or other reputable authorities. These brokers must follow strict rules for client fund protection and fair trading practices.'
      },
      {
        question: 'What\'s the difference between crypto CFDs and real crypto?',
        answer: 'With CFDs, you don\'t own the actual cryptocurrency - you\'re trading a contract based on the price. CFDs offer leverage, the ability to short sell, and no wallet security concerns, but you can\'t transfer or use the crypto for payments.'
      }
    ],
    relatedPages: [
      { title: 'Best MT4 Crypto Brokers', url: '/brokers/metatrader4-mt4' },
      { title: 'Best High Leverage Brokers', url: '/brokers/high-leverage' }
    ],
    priority: 0.9,
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
  },
  {
    title: 'Top 10 CFD Brokers & Trading Platforms 2025',
    description: 'Compare the top 10 CFD brokers and trading platforms for 2025. Find the best CFD brokers for stocks, forex, indices, commodities, and cryptocurrencies with competitive spreads and advanced platforms.',
    heading: 'Top 10 CFD Brokers & Trading Platforms',
    subheading: 'Discover the best CFD brokers offering diverse asset classes including stocks, forex, indices, commodities, and crypto CFDs. Trade multiple markets from one platform with competitive pricing.',
    path: '/brokers/top-10-cfd-brokers-platforms',
    filters: { 
      specialties: ['stocks', 'crypto', 'indices', 'commodities'],
      minDeposit: 0 
    },
    highlights: ['Multi-Asset Trading', 'Stock CFDs', 'Forex CFDs', 'Crypto CFDs', 'Indices & Commodities'],
    faqs: [
      {
        question: 'What is a CFD broker?',
        answer: 'A CFD (Contract for Difference) broker allows you to trade on price movements of various assets without owning them. You can trade stocks, forex, indices, commodities, and cryptocurrencies as CFDs with leverage.'
      },
      {
        question: 'What makes a top CFD broker?',
        answer: 'Top CFD brokers offer diverse asset classes, competitive spreads, reliable platforms, strong regulation, and good customer support. They should provide access to global markets with transparent pricing and fast execution.'
      },
      {
        question: 'Can I trade multiple asset types with one CFD broker?',
        answer: 'Yes, most modern CFD brokers offer multi-asset trading platforms where you can trade stocks, forex, indices, commodities, and cryptocurrencies all from one account with a single platform.'
      }
    ],
    relatedPages: [
      { title: 'Best Stock CFD Brokers', url: '/brokers/stock-cfds' },
      { title: 'Best Crypto Trading Brokers', url: '/brokers/crypto-trading' },
      { title: 'Best MT4 Brokers', url: '/brokers/metatrader4-mt4' }
    ],
    priority: 0.9,
    changefreq: 'weekly'
  }
];

// Additional category pages for enhanced coverage
export const additionalCategoryPages: SEOPageConfig[] = [
  // Direct Market Access category that was missing
  {
    title: 'Best DMA (Direct Market Access) Forex Brokers',
    description: 'Find the best DMA brokers offering direct market access for professional traders. Compare institutional-level trading platforms with direct interbank access.',
    heading: 'Top DMA (Direct Market Access) Brokers',
    subheading: 'Trade with institutional-level access through DMA brokers. Get direct market access to interbank markets with professional trading conditions.',
    path: '/brokers/dma-direct-market-access-brokers',
    filters: { features: ['dma'] },
    highlights: ['Direct Market Access', 'Institutional Trading', 'Interbank Access', 'Professional Tools'],
    faqs: [
      {
        question: 'What is Direct Market Access (DMA)?',
        answer: 'DMA allows traders to place buy and sell orders directly in the exchange order book, bypassing broker dealing desks for true market prices and transparency.'
      },
      {
        question: 'Who should use DMA brokers?',
        answer: 'DMA is ideal for professional traders, institutions, and high-volume traders who need direct market access, transparency, and the ability to see market depth.'
      }
    ],
    priority: 0.85,
    changefreq: 'weekly'
  },
  // Top 10 Online Trading Brokers
  {
    title: 'Top 10 Online Trading Brokers 2025',
    description: 'Discover the best online trading brokers of 2025. Compare platforms, fees, and features from leading brokers. Expert reviews and ratings.',
    heading: 'Top 10 Online Trading Brokers',
    subheading: 'The best online trading brokers offering comprehensive trading services across multiple asset classes with excellent platforms.',
    path: '/brokers/top-10-online-trading-brokers',
    filters: { minDeposit: 0 },
    highlights: ['Top Rated', 'Multi-Asset', 'Best Platforms', 'Competitive Pricing'],
    faqs: [
      {
        question: 'What makes a top online trading broker?',
        answer: 'Top brokers offer competitive fees, reliable platforms, strong regulation, diverse assets, excellent customer support, and educational resources.'
      }
    ],
    priority: 1.0,
    changefreq: 'weekly'
  },
  // Top 10 Forex Brokers
  {
    title: 'Top 10 Forex Brokers 2025',
    description: 'Discover the top 10 forex brokers of 2025. Compare spreads, execution, regulation, and features. Expert reviews of the best FX brokers.',
    heading: 'Top 10 Forex Brokers',
    subheading: 'The leading forex brokers providing currency trading with tight spreads, fast execution, and professional platforms.',
    path: '/brokers/top-10-forex-brokers',
    filters: { minDeposit: 0 },
    highlights: ['Best Forex', 'Tight Spreads', 'Fast Execution', 'Professional Trading'],
    faqs: [
      {
        question: 'How do I choose a forex broker?',
        answer: 'Consider regulation, spreads, execution speed, platform features, customer support, and whether they suit your trading style and experience level.'
      }
    ],
    priority: 1.0,
    changefreq: 'weekly'
  },
  // No Dealing Desk
  {
    title: 'Best No Dealing Desk (NDD) Brokers',
    description: 'Find the best No Dealing Desk brokers with direct liquidity provider access. Compare NDD execution and transparent pricing.',
    heading: 'Top No Dealing Desk Brokers',
    subheading: 'Trade with NDD brokers that route orders directly to liquidity providers without dealer intervention.',
    path: '/brokers/no-dealing-desk',
    filters: { features: ['ndd'] },
    highlights: ['No Dealing Desk', 'Direct Liquidity', 'Transparent Pricing', 'No Intervention'],
    faqs: [
      {
        question: 'What is a No Dealing Desk broker?',
        answer: 'NDD brokers route client orders directly to liquidity providers without intervention, ensuring transparent pricing and no conflict of interest.'
      }
    ],
    priority: 0.8,
    changefreq: 'weekly'
  },
  // Forex Brokers Without Requotes
  {
    title: 'Best Forex Brokers Without Requotes',
    description: 'Trade without requotes at top forex brokers. Compare brokers offering guaranteed execution and price certainty for all orders.',
    heading: 'Forex Brokers Without Requotes',
    subheading: 'Get guaranteed order execution without requotes, ensuring price certainty for all trading styles.',
    path: '/brokers/forex-brokers-without-requotes',
    filters: { features: ['no-requotes'] },
    highlights: ['No Requotes', 'Guaranteed Execution', 'Price Certainty', 'Fair Trading'],
    faqs: [
      {
        question: 'What are requotes in forex?',
        answer: 'Requotes occur when a broker cannot execute your order at the requested price and offers a different price, which can disrupt trading strategies.'
      }
    ],
    priority: 0.75,
    changefreq: 'weekly'
  },
  // Fixed Spread Brokers
  {
    title: 'Best Fixed Spread Brokers',
    description: 'Trade with fixed spreads at top brokers. Compare constant spread brokers offering predictable trading costs in all market conditions.',
    heading: 'Top Fixed Spread Brokers',
    subheading: 'Brokers offering fixed spreads that remain constant regardless of market conditions, ideal for consistent trading costs.',
    path: '/brokers/fixed-spread-brokers',
    filters: { features: ['fixed-spreads'] },
    highlights: ['Fixed Spreads', 'Predictable Costs', 'Stable Pricing', 'No Surprises'],
    faqs: [
      {
        question: 'Are fixed spreads better than variable?',
        answer: 'Fixed spreads offer predictability and are better during volatile markets, while variable spreads can be tighter during calm conditions.'
      }
    ],
    priority: 0.7,
    changefreq: 'weekly'
  },
  // No Spread Forex Brokers
  {
    title: 'Best Zero Spread Forex Brokers',
    description: 'Trade with zero spreads at top forex brokers. Compare no-spread brokers offering the lowest possible trading costs with commission-based pricing.',
    heading: 'Zero Spread Forex Brokers',
    subheading: 'Forex brokers offering zero or near-zero spreads, typically charging commission instead for ultra-low trading costs.',
    path: '/brokers/no-spread-forex-brokers',
    filters: { features: ['zero-spread'] },
    highlights: ['Zero Spreads', 'Commission-Based', 'Lowest Costs', 'Raw Pricing'],
    faqs: [
      {
        question: 'How do zero spread brokers make money?',
        answer: 'Zero spread brokers charge a fixed commission per trade instead of marking up spreads, providing transparent and often lower overall costs.'
      }
    ],
    priority: 0.85,
    changefreq: 'weekly'
  },
  // A-Book Forex Brokers
  {
    title: 'Best A-Book Forex Brokers',
    description: 'Trade with A-Book brokers offering transparent execution. Compare agency model brokers with no conflict of interest.',
    heading: 'Top A-Book Forex Brokers',
    subheading: 'A-Book brokers pass all client orders to liquidity providers, ensuring no conflict of interest and transparent execution.',
    path: '/brokers/a-book-forex-brokers',
    filters: { features: ['a-book'] },
    highlights: ['A-Book Model', 'No Conflict', 'Transparent', 'Agency Execution'],
    faqs: [
      {
        question: 'What is an A-Book broker?',
        answer: 'A-Book brokers pass all client trades directly to liquidity providers without taking the opposite side, eliminating conflicts of interest.'
      }
    ],
    priority: 0.8,
    changefreq: 'weekly'
  },
  // Raw Spreads
  {
    title: 'Best Raw Spread Forex Brokers',
    description: 'Access raw interbank spreads at top forex brokers. Compare brokers offering minimal markup on currency pairs.',
    heading: 'Forex Brokers With Raw Spreads',
    subheading: 'Get raw interbank spreads with minimal markup, offering the most competitive pricing available.',
    path: '/brokers/forex-brokers-with-raw-spreads',
    filters: { features: ['raw-spreads'] },
    highlights: ['Raw Spreads', 'Interbank Pricing', 'Minimal Markup', 'Best Prices'],
    faqs: [
      {
        question: 'What are raw spreads?',
        answer: 'Raw spreads are the actual interbank spreads without broker markup, typically offered with a commission for transparent pricing.'
      }
    ],
    priority: 0.85,
    changefreq: 'weekly'
  },
  // STP Brokers
  {
    title: 'Best STP Forex Brokers',
    description: 'Trade with STP brokers offering direct liquidity provider access. Compare Straight Through Processing brokers for transparent execution.',
    heading: 'Top STP (Straight Through Processing) Brokers',
    subheading: 'STP brokers route orders directly to liquidity providers for transparent execution without dealing desk intervention.',
    path: '/brokers/stp-forex-brokers',
    filters: { accountTypes: ['STP'] },
    highlights: ['STP Execution', 'Direct Routing', 'No Dealing Desk', 'Transparent'],
    faqs: [
      {
        question: 'How do STP brokers work?',
        answer: 'STP brokers automatically route all orders to liquidity providers without manual intervention, ensuring fast and transparent execution.'
      }
    ],
    priority: 0.8,
    changefreq: 'weekly'
  },
  // Instant Execution
  {
    title: 'Best Instant Execution Brokers',
    description: 'Trade with instant execution brokers offering the fastest order processing. Compare brokers with sub-second execution speeds.',
    heading: 'Top Instant Execution Brokers',
    subheading: 'Get instant order execution for fast-paced trading strategies requiring immediate order fills.',
    path: '/brokers/instant-execution-brokers',
    filters: { features: ['instant-execution'] },
    highlights: ['Instant Execution', 'Fast Processing', 'No Delays', 'Speed Trading'],
    faqs: [
      {
        question: 'What is instant execution?',
        answer: 'Instant execution means orders are filled immediately at the price shown when you click, ideal for scalping and fast trading strategies.'
      }
    ],
    priority: 0.75,
    changefreq: 'weekly'
  },
  // PAMM Brokers
  {
    title: 'Best PAMM Brokers',
    description: 'Find the best PAMM brokers for professional money management. Compare platforms offering Percentage Allocation Management services.',
    heading: 'Top PAMM Brokers',
    subheading: 'PAMM brokers allow professional money management and copy trading services through percentage allocation.',
    path: '/brokers/pamm-brokers',
    filters: { features: ['pamm'] },
    highlights: ['PAMM Accounts', 'Money Management', 'Professional Trading', 'Passive Income'],
    faqs: [
      {
        question: 'What is PAMM in forex?',
        answer: 'PAMM (Percentage Allocation Management Module) allows investors to allocate funds to professional traders who manage them for a percentage of profits.'
      }
    ],
    priority: 0.7,
    changefreq: 'weekly'
  },
  // HFT Brokers
  {
    title: 'Best HFT (High-Frequency Trading) Brokers',
    description: 'Discover the best HFT brokers for algorithmic trading. Compare high-frequency trading platforms with ultra-low latency.',
    heading: 'Top HFT Brokers',
    subheading: 'HFT brokers provide ultra-fast execution and low latency for algorithmic and high-frequency trading strategies.',
    path: '/brokers/hft-brokers',
    filters: { features: ['hft'] },
    highlights: ['HFT Support', 'Ultra-Low Latency', 'Algorithmic Trading', 'VPS Services'],
    faqs: [
      {
        question: 'What do HFT brokers offer?',
        answer: 'HFT brokers provide ultra-low latency connections, VPS services, API access, and infrastructure optimized for high-frequency trading strategies.'
      }
    ],
    priority: 0.75,
    changefreq: 'weekly'
  },
  // Scalping Brokers (additional entry)
  {
    title: 'Best Scalping Forex Brokers',
    description: 'Find the best brokers for scalping strategies. Compare platforms allowing scalping with fast execution and tight spreads.',
    heading: 'Top Scalping Brokers',
    subheading: 'Trade with brokers that allow and support scalping strategies with fast execution, tight spreads, and no restrictions.',
    path: '/brokers/scalping-brokers',
    filters: { features: ['scalping'] },
    highlights: ['Scalping Allowed', 'Fast Execution', 'Tight Spreads', 'No Restrictions'],
    faqs: [
      {
        question: 'What makes a good scalping broker?',
        answer: 'Good scalping brokers offer tight spreads, fast execution, no restrictions on short-term trading, and preferably ECN/STP execution models.'
      }
    ],
    priority: 0.9,
    changefreq: 'weekly'
  },
  // Trading API Brokers
  {
    title: 'Best Trading API Brokers',
    description: 'Connect via API to top trading brokers. Compare platforms offering robust trading APIs for algorithmic and automated trading.',
    heading: 'Top Trading API Brokers',
    subheading: 'Brokers offering robust trading APIs for algorithmic trading, automated strategies, and third-party integrations.',
    path: '/brokers/trading-api-brokers',
    filters: { features: ['api-trading'] },
    highlights: ['Trading APIs', 'Algorithmic Trading', 'Automation', 'Integration'],
    faqs: [
      {
        question: 'Why use a trading API?',
        answer: 'Trading APIs enable automated trading, custom platform development, algorithmic strategies, and integration with third-party tools and analytics.'
      }
    ],
    priority: 0.8,
    changefreq: 'weekly'
  },
  // Swing Trading Brokers
  {
    title: 'Best Swing Trading Brokers',
    description: 'Find the best brokers for swing trading strategies. Compare platforms optimized for medium-term trading with low overnight fees.',
    heading: 'Top Swing Trading Brokers',
    subheading: 'Ideal brokers for swing trading with competitive overnight fees and platforms designed for medium-term strategies.',
    path: '/brokers/swing-trading-brokers',
    filters: { features: ['low-swap'] },
    highlights: ['Swing Trading', 'Low Swap Fees', 'Medium-Term', 'Position Trading'],
    faqs: [
      {
        question: 'What do swing traders need in a broker?',
        answer: 'Swing traders need low overnight swap fees, good charting tools, reliable execution, and platforms that support multi-day position holding.'
      }
    ],
    priority: 0.75,
    changefreq: 'weekly'
  },
  // Hedging Brokers
  {
    title: 'Best Forex Brokers for Hedging',
    description: 'Trade with brokers allowing hedging strategies. Compare platforms supporting simultaneous long and short positions.',
    heading: 'Top Hedging Brokers',
    subheading: 'Brokers allowing hedging strategies where traders can hold both long and short positions simultaneously.',
    path: '/brokers/forex-brokers-for-hedging',
    filters: { features: ['hedging'] },
    highlights: ['Hedging Allowed', 'Risk Management', 'Long/Short', 'Advanced Strategies'],
    faqs: [
      {
        question: 'What is hedging in forex?',
        answer: 'Hedging involves opening opposite positions on the same currency pair to protect against adverse price movements and manage risk.'
      }
    ],
    priority: 0.7,
    changefreq: 'weekly'
  },
  // Beginners (moved and updated)
  {
    title: 'Best Forex Brokers for Beginners',
    description: 'Start trading with the best beginner-friendly forex brokers. Compare platforms with education, low deposits, and easy-to-use interfaces.',
    heading: 'Top Forex Brokers for Beginners',
    subheading: 'Beginner-friendly brokers with educational resources, low minimum deposits, and user-friendly platforms.',
    path: '/brokers/forex-brokers-for-beginners',
    filters: { maxDeposit: 100, minDeposit: 0 },
    highlights: ['Beginner Friendly', 'Education', 'Demo Accounts', 'Low Deposits'],
    faqs: [
      {
        question: 'What should beginners look for in a forex broker?',
        answer: 'Beginners should prioritize education, demo accounts, low minimum deposits, user-friendly platforms, and responsive customer support.'
      }
    ],
    priority: 0.95,
    changefreq: 'weekly'
  },
  // Day Trading
  {
    title: 'Best Day Trading Brokers',
    description: 'Find the best brokers for day trading. Compare platforms optimized for intraday trading with fast execution and competitive spreads.',
    heading: 'Top Day Trading Brokers',
    subheading: 'Optimal brokers for day trading with fast execution, competitive spreads, and platforms designed for active trading.',
    path: '/brokers/day-trading-broker',
    filters: { features: ['day-trading'] },
    highlights: ['Day Trading', 'Fast Execution', 'Low Costs', 'Active Trading'],
    faqs: [
      {
        question: 'What makes a broker good for day trading?',
        answer: 'Day trading brokers should offer fast execution, tight spreads, reliable platforms, real-time data, and tools for quick market analysis.'
      }
    ],
    priority: 0.85,
    changefreq: 'weekly'
  },
  // Most Regulated
  {
    title: 'Most Regulated Forex Brokers',
    description: 'Trade with the most regulated forex brokers. Compare multi-licensed platforms with tier-1 regulatory oversight for maximum security.',
    heading: 'Most Regulated Forex Brokers',
    subheading: 'The most regulated forex brokers with licenses from multiple tier-1 regulatory authorities for maximum security.',
    path: '/brokers/most-regulated-forex-brokers',
    filters: { regulators: ['FCA', 'ASIC', 'NFA', 'CySEC'] },
    highlights: ['Multi-Licensed', 'Tier-1 Regulation', 'Maximum Security', 'Client Protection'],
    faqs: [
      {
        question: 'Why choose highly regulated brokers?',
        answer: 'Highly regulated brokers offer better client fund protection, transparency, dispute resolution, and are subject to strict financial requirements.'
      }
    ],
    priority: 0.95,
    changefreq: 'weekly'
  },
  // Trailing Stop Loss
  {
    title: 'Best Trailing Stop Loss Brokers',
    description: 'Use trailing stops at top forex brokers. Compare platforms offering advanced trailing stop loss for automated risk management.',
    heading: 'Top Trailing Stop Loss Brokers',
    subheading: 'Brokers offering advanced trailing stop loss functionality for automatic profit protection and risk management.',
    path: '/brokers/trailing-stop-loss-brokers',
    filters: { features: ['trailing-stops'] },
    highlights: ['Trailing Stops', 'Risk Management', 'Profit Protection', 'Automated'],
    faqs: [
      {
        question: 'How do trailing stops work?',
        answer: 'Trailing stops automatically adjust your stop loss as the price moves in your favor, locking in profits while limiting downside risk.'
      }
    ],
    priority: 0.7,
    changefreq: 'weekly'
  },
  // Micro Accounts
  {
    title: 'Best Micro Account Brokers',
    description: 'Start small with micro account brokers. Compare platforms offering micro lots and flexible position sizing for new traders.',
    heading: 'Top Micro Account Brokers',
    subheading: 'Brokers offering micro account options with smaller position sizes perfect for new traders and risk management.',
    path: '/brokers/micro-accounts',
    filters: { features: ['micro-accounts'] },
    highlights: ['Micro Accounts', 'Small Positions', 'Low Risk', 'Flexible Sizing'],
    faqs: [
      {
        question: 'What is a micro account?',
        answer: 'Micro accounts allow trading with micro lots (0.01 lots or 1,000 units), enabling traders to start with smaller capital and lower risk.'
      }
    ],
    priority: 0.75,
    changefreq: 'weekly'
  },
  // Offshore Brokers
  {
    title: 'Best Offshore Forex Brokers',
    description: 'Trade with offshore forex brokers offering flexible conditions. Compare international brokers with higher leverage and fewer restrictions.',
    heading: 'Top Offshore Forex Brokers',
    subheading: 'Offshore forex brokers providing flexible trading conditions and higher leverage options for international traders.',
    path: '/brokers/offshore-forex-brokers',
    filters: { features: ['offshore'] },
    highlights: ['Offshore Trading', 'High Leverage', 'Flexible Conditions', 'International'],
    faqs: [
      {
        question: 'Are offshore brokers safe?',
        answer: 'Offshore broker safety varies. While some are reputable, they typically have less stringent regulations. Research thoroughly and check client reviews.'
      }
    ],
    priority: 0.6,
    changefreq: 'weekly'
  },
  // Corporate Accounts
  {
    title: 'Best Corporate Account Brokers',
    description: 'Open corporate accounts at top brokers. Compare institutional trading solutions for companies and hedge funds.',
    heading: 'Top Corporate Account Brokers',
    subheading: 'Brokers offering corporate account solutions for institutional clients, hedge funds, and trading companies.',
    path: '/brokers/corporate-accounts',
    filters: { features: ['corporate'] },
    highlights: ['Corporate Accounts', 'Institutional', 'Business Trading', 'Professional'],
    faqs: [
      {
        question: 'What are corporate trading accounts?',
        answer: 'Corporate accounts are designed for businesses, offering features like multiple users, segregated funds, institutional pricing, and tax documentation.'
      }
    ],
    priority: 0.65,
    changefreq: 'weekly'
  },
  // No Deposit Bonus
  {
    title: 'Best No Deposit Forex Brokers',
    description: 'Start trading without deposits at top forex brokers. Compare no deposit bonuses and free trading opportunities.',
    heading: 'Top No Deposit Forex Brokers',
    subheading: 'Forex brokers offering no deposit bonuses and demo trading opportunities to start trading without initial capital.',
    path: '/brokers/no-deposit-forex-brokers',
    filters: { features: ['no-deposit-bonus'] },
    highlights: ['No Deposit Bonus', 'Free Trading', 'Start Free', 'Demo Accounts'],
    faqs: [
      {
        question: 'How do no deposit bonuses work?',
        answer: 'No deposit bonuses provide free trading capital to new clients, allowing them to trade real money without making a deposit, though withdrawal conditions apply.'
      }
    ],
    priority: 0.8,
    changefreq: 'weekly'
  },
  // High Leverage (updated path)
  {
    title: 'Best High Leverage Forex Brokers',
    description: 'Trade with high leverage at top forex brokers. Compare platforms offering maximum leverage ratios up to 1:3000.',
    heading: 'Top High Leverage Forex Brokers',
    subheading: 'Brokers offering high leverage ratios up to 1:3000 for traders seeking maximum capital efficiency.',
    path: '/brokers/forex-brokers-with-high-leverage',
    filters: { leverage: 500 },
    highlights: ['High Leverage', '1:500+', 'Capital Efficiency', 'Professional'],
    faqs: [
      {
        question: 'Is high leverage risky?',
        answer: 'Yes, high leverage amplifies both profits and losses. It requires strict risk management and is best suited for experienced traders.'
      }
    ],
    priority: 0.85,
    changefreq: 'weekly'
  },
  // No Minimum Deposit (updated path)
  {
    title: 'Best No Minimum Deposit Forex Brokers',
    description: 'Start trading with any amount at no minimum deposit brokers. Compare platforms with zero deposit requirements.',
    heading: 'Forex Brokers With No Minimum Deposit',
    subheading: 'Brokers with no minimum deposit requirements, allowing traders to start with any amount they choose.',
    path: '/brokers/forex-brokers-with-no-minimum-deposit',
    filters: { maxDeposit: 0 },
    highlights: ['No Minimum', 'Start Any Amount', 'Flexible', 'Accessible'],
    faqs: [
      {
        question: 'Can I really start with $1?',
        answer: 'Yes, brokers with no minimum deposit allow you to start with any amount, though you need sufficient funds to open positions based on margin requirements.'
      }
    ],
    priority: 0.9,
    changefreq: 'weekly'
  },
  // Islamic Accounts (updated path)
  {
    title: 'Best Islamic Account Forex Brokers',
    description: 'Trade with Islamic accounts at top brokers. Compare Sharia-compliant, swap-free trading platforms for Muslim traders.',
    heading: 'Top Islamic Account Brokers',
    subheading: 'Sharia-compliant Islamic accounts with no swap fees for Muslim traders following Islamic finance principles.',
    path: '/brokers/islamic-accounts',
    filters: { features: ['islamic'] },
    highlights: ['Islamic Accounts', 'Swap-Free', 'Sharia Compliant', 'Halal Trading'],
    faqs: [
      {
        question: 'Are Islamic accounts truly Sharia-compliant?',
        answer: 'Legitimate Islamic accounts eliminate interest (riba) by removing overnight swap fees, though brokers may charge admin fees or adjust spreads.'
      }
    ],
    priority: 0.8,
    changefreq: 'weekly'
  },
  // MetaTrader 4 (updated path)
  {
    title: 'Best MT4 Forex Brokers',
    description: 'Trade on MetaTrader 4 with top brokers. Compare MT4 platforms offering expert advisors and automated trading.',
    heading: 'Top MT4 Brokers',
    subheading: 'Brokers offering MetaTrader 4 platform with expert advisors, custom indicators, and automated trading capabilities.',
    path: '/brokers/mt4-brokers',
    filters: { platforms: ['MT4'] },
    highlights: ['MetaTrader 4', 'Expert Advisors', 'Automated Trading', 'Custom Indicators'],
    faqs: [
      {
        question: 'Why is MT4 so popular?',
        answer: 'MT4 is popular for its stability, extensive library of indicators and EAs, user-friendly interface, and large community of traders and developers.'
      }
    ],
    priority: 0.9,
    changefreq: 'weekly'
  },
  // MetaTrader 5 (updated path)
  {
    title: 'Best MT5 Forex Brokers',
    description: 'Access MetaTrader 5 at leading brokers. Compare MT5 platforms with advanced features and enhanced analytical tools.',
    heading: 'Top MT5 Brokers',
    subheading: 'Brokers supporting MetaTrader 5 with advanced features, more timeframes, and enhanced analytical tools.',
    path: '/brokers/mt5-brokers',
    filters: { platforms: ['MT5'] },
    highlights: ['MetaTrader 5', 'Advanced Features', 'Multi-Asset', 'Enhanced Tools'],
    faqs: [
      {
        question: 'What are the advantages of MT5 over MT4?',
        answer: 'MT5 offers more timeframes, advanced order types, built-in economic calendar, market depth, and support for more asset classes beyond forex.'
      }
    ],
    priority: 0.9,
    changefreq: 'weekly'
  },
  // TradingView Brokers
  {
    title: 'Best TradingView Brokers',
    description: 'Trade with TradingView integration at top brokers. Compare platforms offering advanced charting and social trading features.',
    heading: 'Top TradingView Brokers',
    subheading: 'Brokers integrated with TradingView for advanced charting, social trading, and comprehensive market analysis.',
    path: '/brokers/tradingview-brokers',
    filters: { platforms: ['TradingView'] },
    highlights: ['TradingView', 'Advanced Charts', 'Social Trading', 'Pine Script'],
    faqs: [
      {
        question: 'Can I trade directly from TradingView?',
        answer: 'Yes, many brokers offer direct TradingView integration, allowing you to analyze and execute trades within the TradingView platform.'
      }
    ],
    priority: 0.85,
    changefreq: 'weekly'
  },
  // Stock CFD Brokers (updated path)
  {
    title: 'Best Stock CFD Brokers',
    description: 'Trade stock CFDs at leading brokers. Compare platforms offering leveraged equity trading on major global exchanges.',
    heading: 'Top Stock CFD Brokers',
    subheading: 'Brokers offering stock CFD trading on major exchanges with leverage and the ability to go long or short.',
    path: '/brokers/stock-cfd-brokers',
    filters: { specialties: ['stocks'] },
    highlights: ['Stock CFDs', 'Global Markets', 'Go Long/Short', 'Leverage'],
    faqs: [
      {
        question: 'What\'s the advantage of stock CFDs over stocks?',
        answer: 'Stock CFDs offer leverage, the ability to short sell easily, no stamp duty in many jurisdictions, and access to global markets from one platform.'
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
  ...assetPages,
  ...additionalCategoryPages
];

const slugFromPath = (path: string): string => {
  const cleanedPath = path.split('?')[0]?.replace(/\/+$/, '') || '';
  const segments = cleanedPath.split('/').filter(Boolean);
  return segments.pop()?.toLowerCase() || '';
};

const seoConfigBySlug = new Map<string, SEOPageConfig>();

allSEOPageConfigs.forEach(config => {
  const slug = slugFromPath(config.path);
  if (slug) {
    seoConfigBySlug.set(slug, config);
  }
});


export const getSEOPageConfigBySlug = (slug: string): SEOPageConfig | null => {
  if (!slug) return null;
  const normalizedSlug = slug.split('?')[0]?.toLowerCase() || '';
  return seoConfigBySlug.get(normalizedSlug) || null;
};

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