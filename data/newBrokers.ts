// New broker data structures created from web research
// These brokers will be added to the main brokers.ts file

import { Broker } from '../types';

// Royal (OneRoyal) Broker Data
export const royalBroker: Broker = {
  id: 'royal',
  name: 'Royal Financial Trading (OneRoyal)',
  logoUrl: '/broker-logos/royal.png',
  websiteUrl: 'https://www.oneroyal.com/',
  score: 8.5,
  foundingYear: 2004,
  headquarters: 'Sydney, Australia',
  description: 'OneRoyal is a well-established forex and CFD broker with over 20 years of experience, offering access to 2000+ trading instruments across multiple asset classes. Regulated by ASIC, VFSC, and FSA, the company provides competitive trading conditions with low spreads and no deposit/withdrawal fees.',
  summary: "OneRoyal stands out as a reliable multi-regulated broker offering competitive trading conditions with spreads starting from 0.0 pips and no deposit/withdrawal fees. With 20+ years of experience and regulation from ASIC, VFSC, and FSA, it provides excellent access to forex, CFDs, cryptocurrencies, and more through MT4 and MT5 platforms.",
  pros: [
    "Low forex trading fees with spreads from 0.0 pips",
    "No deposit or withdrawal fees",
    "Multi-regulated broker (ASIC, VFSC, FSA)",
    "Wide range of trading instruments (2000+)",
    "Supports MT4 and MT5 trading platforms",
    "No inactivity fees charged",
    "24/7 customer support available"
  ],
  cons: [
    "CFD fees are around industry average",
    "Limited educational and research tools",
    "Minimum deposit requirements vary by entity",
    "Not available for US clients"
  ],

  coreInfo: {
    brokerType: 'ECN/STP',
    mobileTrading: true,
    demoAccount: true,
  },
  accountTypes: [
    { name: 'Classic Account', type: 'STP', minDeposit: 50, spreads: 'From 0.6 pips', commission: 'Zero commission', bestFor: 'Beginners and casual traders' },
    { name: 'ECN Account', type: 'ECN', minDeposit: 50, spreads: 'From 0.0 pips', commission: '$7 round turn per lot', bestFor: 'Scalpers and active traders' },
  ],
  fees: {
    trading: {
      spreadType: 'Variable',
      averageSpreads: [
        { pair: 'EUR/USD', spread: '0.6 pips (Classic), 0.0 pips (ECN)' },
        { pair: 'GBP/USD', spread: '1.0 pips (Classic), 0.2 pips (ECN)' },
        { pair: 'Gold', spread: '25 cents (Classic), 15 cents (ECN)' }
      ],
      commissionStructure: "Zero commission on Classic account. $7 round turn per lot on ECN account.",
      overnightSwapFees: "Competitive swap rates. Islamic accounts available."
    },
    nonTrading: {
      inactivityFee: "None",
      withdrawalFee: "None",
      depositFee: "None"
    }
  },
  tradableInstruments: {
    forexPairs: { total: 60, details: "Major, Minor, and Exotic currency pairs" },
    commodities: { total: 20, details: "Gold, silver, oil, and other commodities" },
    indices: { total: 15, details: "Major global indices" },
    stocks: { total: 500, details: "Stock CFDs from major exchanges" },
    cryptocurrencies: { total: 15, details: "Bitcoin, Ethereum, and other crypto CFDs" },
    etfs: { total: 50, details: "Various ETF CFDs" }
  },
  tradingConditionsExtended: {
    minTradeSize: 0.01,
    scalpingAllowed: true,
    hedgingAllowed: true,
    eaAllowed: true,
    negativeBalanceProtection: true,
    marginCallLevel: "100%",
    stopOutLevel: "50%"
  },
  depositWithdrawal: {
    depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
    withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
    depositFees: "None",
    withdrawalFees: "None",
    processingTime: {
      deposits: "Instant for cards and e-wallets",
      withdrawals: "1-3 business days"
    },
    minWithdrawal: 10
  },
  customerSupport: {
    languages: ['English', 'Arabic', 'Chinese', 'Spanish', 'Russian', 'Thai'],
    channels: ['Live Chat', 'Phone', 'Email'],
    hours: '24/7'
  },
  security: {
    regulatedBy: [
      { regulator: 'ASIC', licenseNumber: '420268' },
      { regulator: 'VFSC', licenseNumber: '700284' },
      { regulator: 'FSA', licenseNumber: 'SD008' }
    ],
    segregatedAccounts: true,
    investorCompensationScheme: { available: true, amount: 'Varies by jurisdiction' },
    twoFactorAuth: true
  },
  tradingEnvironment: {
    executionSpeedMs: 50,
    slippage: "Low",
    requotes: false,
    marketDepth: true,
    orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop', 'OCO'],
    guaranteedStopLoss: {
      available: false,
      cost: "N/A"
    }
  },
  platformFeatures: {
    charting: {
      indicators: 50,
      drawingTools: 30
    },
    automatedTrading: ['EAs', 'API'],
    copyTrading: {
      available: false,
      platforms: []
    },
    backtesting: true,
    newsIntegration: true
  },
  accountManagement: {
    islamicAccount: {
      available: true,
      conditions: "Swap-free trading available"
    },
    baseCurrencies: ['USD', 'EUR', 'GBP', 'PLN'],
    mamPammSupport: false,
    corporateAccounts: true
  },
  transparency: {
    audited: true,
    yearsInBusiness: 20,
    tradingVolumeDisclosed: false,
    clientBase: "Global client base"
  },
  regulation: {
    regulators: ['ASIC', 'VFSC', 'FSA']
  },
  ratings: {
    regulation: 9.0,
    costs: 8.0,
    platforms: 8.0,
    support: 8.5
  },
  accessibility: {
    minDeposit: 50,
    depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
    withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
    customerSupport: ['24/7 Live Chat', 'Phone', 'Email']
  },
  technology: {
    platforms: ['MT4', 'MT5'],
    executionType: 'Market Execution',
    apiAccess: true,
    eaSupport: true
  },
  tradingConditions: {
    spreads: { eurusd: 0.6, gbpusd: 1.0, usdjpy: 0.8 },
    commission: "$7 round turn per lot on ECN account",
    swapFeeCategory: 'Low',
    maxLeverage: "1:1000",
    minLotSize: 0.01
  }
};

// CapTrader Broker Data
export const captraderBroker: Broker = {
  id: 'captrader',
  name: 'CapTrader',
  logoUrl: '/broker-logos/captrader.png',
  websiteUrl: 'https://www.captrader.com/',
  score: 8.2,
  foundingYear: 2009,
  headquarters: 'Kiel, Germany',
  description: 'CapTrader is a German-based broker operating as an introducing broker for Interactive Brokers, providing access to over 150 markets worldwide with competitive pricing and professional trading platforms.',
  summary: "CapTrader offers German traders direct access to Interactive Brokers' extensive market coverage with floating spreads from 0.0 pips and €2 commission. Regulated by BaFin, it provides professional trading conditions with a €2,000 minimum deposit requirement.",
  pros: [
    "Low stock and ETF fees",
    "Access to 150+ markets worldwide",
    "Professional trading platforms through Interactive Brokers",
    "Strong regulatory protection under BaFin",
    "Excellent research tools and market data",
    "Competitive floating spreads from 0.0 pips"
  ],
  cons: [
    "High minimum deposit requirement (€2,000)",
    "Not ideal for beginners due to complexity",
    "Limited educational resources",
    "Primarily focused on professional traders"
  ],

  coreInfo: {
    brokerType: 'ECN/STP',
    mobileTrading: true,
    demoAccount: true,
  },
  accountTypes: [
    { name: 'Individual Account', type: 'ECN', minDeposit: 2000, spreads: 'From 0.0 pips', commission: '€2 per lot', bestFor: 'Professional and experienced traders' },
  ],
  fees: {
    trading: {
      spreadType: 'Floating',
      averageSpreads: [
        { pair: 'EUR/USD', spread: '0.0-0.2 pips + commission' },
        { pair: 'GBP/USD', spread: '0.1-0.3 pips + commission' },
        { pair: 'DAX', spread: 'Market dependent' }
      ],
      commissionStructure: "€2 per lot round turn for forex. Variable commissions for other instruments.",
      overnightSwapFees: "Competitive rates, varies by instrument"
    },
    nonTrading: {
      inactivityFee: "None",
      withdrawalFee: "None",
      depositFee: "None"
    }
  },
  tradableInstruments: {
    forexPairs: { total: 100, details: "Major, Minor, and Exotic pairs" },
    commodities: { total: 30, details: "Energy, metals, and agricultural products" },
    indices: { total: 40, details: "Global stock indices" },
    stocks: { total: 10000, details: "Stocks from major exchanges worldwide" },
    cryptocurrencies: { total: 10, details: "Major cryptocurrency CFDs" },
    etfs: { total: 5000, details: "ETFs from major exchanges" }
  },
  tradingConditionsExtended: {
    minTradeSize: 0.01,
    scalpingAllowed: true,
    hedgingAllowed: true,
    eaAllowed: true,
    negativeBalanceProtection: true,
    marginCallLevel: "100%",
    stopOutLevel: "50%"
  },
  depositWithdrawal: {
    depositMethods: ['Bank Transfer', 'SOFORT', 'Credit Card'],
    withdrawalMethods: ['Bank Transfer'],
    depositFees: "None",
    withdrawalFees: "None",
    processingTime: {
      deposits: "1-3 business days",
      withdrawals: "2-5 business days"
    },
    minWithdrawal: 50
  },
  customerSupport: {
    languages: ['English', 'German'],
    channels: ['Phone', 'Email', 'Live Chat'],
    hours: '24/5'
  },
  security: {
    regulatedBy: [
      { regulator: 'BaFin', licenseNumber: 'Registration required' }
    ],
    segregatedAccounts: true,
    investorCompensationScheme: { available: true, amount: 'Up to €20,000' },
    twoFactorAuth: true
  },
  tradingEnvironment: {
    slippage: "Low",
    requotes: false,
    marketDepth: true,
    orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop', 'OCO'],
    guaranteedStopLoss: {
      available: false,
      cost: "N/A"
    }
  },
  platformFeatures: {
    charting: {
      indicators: 120,
      drawingTools: 50
    },
    automatedTrading: ['API', 'EAs'],
    copyTrading: {
      available: false,
      platforms: []
    },
    backtesting: true,
    newsIntegration: true
  },
  accountManagement: {
    islamicAccount: {
      available: false,
      conditions: "N/A"
    },
    baseCurrencies: ['EUR', 'USD', 'GBP', 'CHF'],
    mamPammSupport: false,
    corporateAccounts: true
  },
  transparency: {
    audited: true,
    yearsInBusiness: 15,
    tradingVolumeDisclosed: false,
    clientBase: "Professional and institutional clients"
  },
  regulation: {
    regulators: ['BaFin']
  },
  ratings: {
    regulation: 9.5,
    costs: 8.0,
    platforms: 9.0,
    support: 8.0
  },
  accessibility: {
    minDeposit: 2000,
    depositMethods: ['Bank Transfer', 'SOFORT', 'Credit Card'],
    withdrawalMethods: ['Bank Transfer'],
    customerSupport: ['Phone', 'Email', 'Live Chat']
  },
  technology: {
    platforms: ['Interactive Brokers TWS', 'Interactive Brokers Web'],
    executionType: 'ECN',
    apiAccess: true,
    eaSupport: true
  },
  tradingConditions: {
    spreads: { eurusd: 0.1, gbpusd: 0.2, usdjpy: 0.15 },
    commission: "€2 per lot round turn",
    swapFeeCategory: 'Low',
    maxLeverage: "1:30",
    minLotSize: 0.01
  }
};

// Mexem Broker Data
export const mexemBroker: Broker = {
  id: 'mexem',
  name: 'Mexem',
  logoUrl: '/broker-logos/mexem.png',
  websiteUrl: 'https://www.mexem.com/',
  score: 8.0,
  foundingYear: 2018,
  headquarters: 'Tel Aviv, Israel',
  description: 'Mexem is an Israeli-based broker that provides access to global markets through its partnership with Interactive Brokers, offering low-commission trading across stocks, ETFs, options, and futures.',
  summary: "Mexem offers Israeli traders direct access to Interactive Brokers' global markets with competitive low commissions and zero-fee accounts. Regulated by the Israel Securities Authority, it provides excellent multilingual support and extensive product selection.",
  pros: [
    "Low stock and ETF fees",
    "Zero-fee account option available",
    "Excellent multilingual customer support",
    "Access to 150+ global markets",
    "No minimum deposit requirement",
    "Extensive product selection",
    "Innovative trading platform"
  ],
  cons: [
    "Limited to $2,000 leverage for margin accounts",
    "Higher futures margin requirements",
    "Primarily focused on stock and ETF trading",
    "Limited forex and CFD offerings"
  ],

  coreInfo: {
    brokerType: 'ECN',
    mobileTrading: true,
    demoAccount: true,
  },
  accountTypes: [
    { name: 'Zero Fee Account', type: 'Standard', minDeposit: 0, spreads: 'Variable', commission: 'Zero commission on stocks/ETFs', bestFor: 'Stock and ETF traders' },
    { name: 'Margin Account', type: 'Standard', minDeposit: 2000, spreads: 'Variable', commission: 'Low commissions', bestFor: 'Traders seeking leverage' },
  ],
  fees: {
    trading: {
      spreadType: 'Variable',
      averageSpreads: [
        { pair: 'EUR/USD', spread: 'Market dependent' },
        { pair: 'Stocks', spread: 'N/A - commission based' },
        { pair: 'ETFs', spread: 'N/A - zero commission' }
      ],
      commissionStructure: "Zero commission on stocks and ETFs. Low commissions on options and futures.",
      overnightSwapFees: "Standard swap rates for leveraged positions"
    },
    nonTrading: {
      inactivityFee: "None",
      withdrawalFee: "None",
      depositFee: "None"
    }
  },
  tradableInstruments: {
    forexPairs: { total: 20, details: "Major currency pairs" },
    commodities: { total: 10, details: "Basic commodity offerings" },
    indices: { total: 25, details: "Major global indices" },
    stocks: { total: 10000, details: "Stocks from major exchanges" },
    cryptocurrencies: { total: 0, details: "Not offered" },
    etfs: { total: 5000, details: "ETFs from major exchanges" }
  },
  tradingConditionsExtended: {
    minTradeSize: 1,
    scalpingAllowed: true,
    hedgingAllowed: true,
    eaAllowed: true,
    negativeBalanceProtection: true,
    marginCallLevel: "100%",
    stopOutLevel: "50%"
  },
  depositWithdrawal: {
    depositMethods: ['Bank Transfer', 'Credit Card'],
    withdrawalMethods: ['Bank Transfer'],
    depositFees: "None",
    withdrawalFees: "None",
    processingTime: {
      deposits: "1-3 business days",
      withdrawals: "2-5 business days"
    },
    minWithdrawal: 50
  },
  customerSupport: {
    languages: ['English', 'Hebrew', 'Arabic', 'Russian'],
    channels: ['Phone', 'Email', 'Live Chat'],
    hours: '24/5'
  },
  security: {
    regulatedBy: [
      { regulator: 'Israel Securities Authority', licenseNumber: 'Licensed member' }
    ],
    segregatedAccounts: true,
    investorCompensationScheme: { available: true, amount: 'Up to ILS 150,000' },
    twoFactorAuth: true
  },
  tradingEnvironment: {
    slippage: "Low",
    requotes: false,
    marketDepth: true,
    orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
    guaranteedStopLoss: {
      available: false,
      cost: "N/A"
    }
  },
  platformFeatures: {
    charting: {
      indicators: 100,
      drawingTools: 40
    },
    automatedTrading: ['API'],
    copyTrading: {
      available: false,
      platforms: []
    },
    backtesting: true,
    newsIntegration: true
  },
  accountManagement: {
    islamicAccount: {
      available: false,
      conditions: "N/A"
    },
    baseCurrencies: ['USD', 'EUR', 'ILS'],
    mamPammSupport: false,
    corporateAccounts: true
  },
  transparency: {
    audited: true,
    yearsInBusiness: 7,
    tradingVolumeDisclosed: false,
    clientBase: "Israeli and international clients"
  },
  regulation: {
    regulators: ['Israel Securities Authority']
  },
  ratings: {
    regulation: 8.5,
    costs: 9.0,
    platforms: 8.0,
    support: 9.0
  },
  accessibility: {
    minDeposit: 0,
    depositMethods: ['Bank Transfer', 'Credit Card'],
    withdrawalMethods: ['Bank Transfer'],
    customerSupport: ['Phone', 'Email', 'Live Chat']
  },
  technology: {
    platforms: ['Interactive Brokers TWS', 'Web Platform', 'Mobile App'],
    executionType: 'Market Execution',
    apiAccess: true,
    eaSupport: true
  },
  tradingConditions: {
    spreads: { eurusd: 0.8, gbpusd: 1.0, usdjpy: 0.9 },
    commission: "Variable based on instrument",
    swapFeeCategory: 'Standard',
    maxLeverage: "1:40",
    minLotSize: 1
  }
};

// FX Trading.com Broker Data
export const fxTradingBroker: Broker = {
  id: 'fx-trading',
  name: 'FX Trading.com',
  logoUrl: '/broker-logos/fx-trading.png',
  websiteUrl: 'https://www.fxtrading.com/',
  score: 7.8,
  foundingYear: 2010,
  headquarters: 'London, UK',
  description: 'FX Trading.com is a UK-based forex and CFD broker offering trading services across multiple asset classes with FCA regulation and competitive trading conditions.',
  summary: "FX Trading.com provides UK traders with FCA-regulated access to forex, indices, commodities, and cryptocurrencies. With competitive spreads and no commission pricing, it offers straightforward trading conditions suitable for beginners and intermediate traders.",
  pros: [
    "FCA regulated for UK client protection",
    "Competitive spreads with no commission",
    "Wide range of tradable instruments",
    "User-friendly trading platform",
    "No minimum deposit requirement",
    "Islamic account options available"
  ],
  cons: [
    "Limited educational resources",
    "Research tools could be more comprehensive",
    "Customer support hours limited to market hours",
    "No proprietary trading platform"
  ],

  coreInfo: {
    brokerType: 'Market Maker',
    mobileTrading: true,
    demoAccount: true,
  },
  accountTypes: [
    { name: 'Standard Account', type: 'Standard', minDeposit: 0, spreads: 'From 0.8 pips', commission: 'Zero commission', bestFor: 'Beginners and casual traders' },
  ],
  fees: {
    trading: {
      spreadType: 'Variable',
      averageSpreads: [
        { pair: 'EUR/USD', spread: '0.8 pips' },
        { pair: 'GBP/USD', spread: '1.2 pips' },
        { pair: 'Gold', spread: '30 cents' }
      ],
      commissionStructure: "No commission, spreads only",
      overnightSwapFees: "Standard swap rates. Islamic accounts available."
    },
    nonTrading: {
      inactivityFee: "None",
      withdrawalFee: "None",
      depositFee: "None"
    }
  },
  tradableInstruments: {
    forexPairs: { total: 50, details: "Major and Minor currency pairs" },
    commodities: { total: 15, details: "Gold, silver, oil, and other commodities" },
    indices: { total: 20, details: "Major global indices" },
    stocks: { total: 100, details: "Stock CFDs from major exchanges" },
    cryptocurrencies: { total: 10, details: "Bitcoin, Ethereum, and other crypto CFDs" },
    etfs: { total: 0, details: "Not offered" }
  },
  tradingConditionsExtended: {
    minTradeSize: 0.01,
    scalpingAllowed: true,
    hedgingAllowed: true,
    eaAllowed: false,
    negativeBalanceProtection: true,
    marginCallLevel: "100%",
    stopOutLevel: "50%"
  },
  depositWithdrawal: {
    depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
    withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
    depositFees: "None",
    withdrawalFees: "None",
    processingTime: {
      deposits: "Instant for cards and e-wallets",
      withdrawals: "1-3 business days"
    },
    minWithdrawal: 50
  },
  customerSupport: {
    languages: ['English'],
    channels: ['Phone', 'Email', 'Live Chat'],
    hours: '24/5'
  },
  security: {
    regulatedBy: [
      { regulator: 'FCA', licenseNumber: 'License required' }
    ],
    segregatedAccounts: true,
    investorCompensationScheme: { available: true, amount: 'Up to £85,000' },
    twoFactorAuth: true
  },
  tradingEnvironment: {
    slippage: "Low to Moderate",
    requotes: true,
    marketDepth: false,
    orderTypes: ['Market', 'Limit', 'Stop'],
    guaranteedStopLoss: {
      available: false,
      cost: "N/A"
    }
  },
  platformFeatures: {
    charting: {
      indicators: 30,
      drawingTools: 15
    },
    automatedTrading: [],
    copyTrading: {
      available: false,
      platforms: []
    },
    backtesting: false,
    newsIntegration: true
  },
  accountManagement: {
    islamicAccount: {
      available: true,
      conditions: "Swap-free trading available"
    },
    baseCurrencies: ['USD', 'EUR', 'GBP'],
    mamPammSupport: false,
    corporateAccounts: false
  },
  transparency: {
    audited: true,
    yearsInBusiness: 15,
    tradingVolumeDisclosed: false,
    clientBase: "Primarily UK and European clients"
  },
  regulation: {
    regulators: ['FCA']
  },
  ratings: {
    regulation: 8.5,
    costs: 7.5,
    platforms: 7.0,
    support: 7.5
  },
  accessibility: {
    minDeposit: 0,
    depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
    withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
    customerSupport: ['Phone', 'Email', 'Live Chat']
  },
  technology: {
    platforms: ['Web Trader', 'Mobile App'],
    executionType: 'Market Execution',
    apiAccess: false,
    eaSupport: false
  },
  tradingConditions: {
    spreads: { eurusd: 0.8, gbpusd: 1.2, usdjpy: 1.0 },
    commission: "No commission",
    swapFeeCategory: 'Standard',
    maxLeverage: "1:30",
    minLotSize: 0.01
  }
};

// Multibank Broker Data
export const multibankBroker: Broker = {
  id: 'multibank',
  name: 'Multibank',
  logoUrl: '/broker-logos/multibank.png',
  websiteUrl: 'https://www.multibank.com/',
  score: 8.3,
  foundingYear: 2005,
  headquarters: 'Limassol, Cyprus',
  description: 'Multibank is a global forex and CFD broker with multiple regulatory licenses worldwide, offering trading services across forex, commodities, indices, and cryptocurrencies.',
  summary: "Multibank offers global traders access to multiple regulatory jurisdictions with competitive trading conditions and extensive market coverage. With licenses from CySEC, FCA, ASIC, and others, it provides secure trading environments with advanced platform options.",
  pros: [
    "Multi-regulated broker (CySEC, FCA, ASIC, etc.)",
    "Competitive spreads with ECN pricing",
    "Wide range of trading instruments",
    "Advanced trading platforms including MT4 and MT5",
    "Strong global presence and reputation",
    "24/7 customer support"
  ],
  cons: [
    "High minimum deposit for some account types",
    "Complex fee structure for different regions",
    "Educational resources could be more comprehensive",
    "Withdrawal processing times can be slow"
  ],

  coreInfo: {
    brokerType: 'ECN/STP',
    mobileTrading: true,
    demoAccount: true,
  },
  accountTypes: [
    { name: 'Standard Account', type: 'STP', minDeposit: 500, spreads: 'From 1.0 pip', commission: 'Zero commission', bestFor: 'Beginners and casual traders' },
    { name: 'ECN Account', type: 'ECN', minDeposit: 1000, spreads: 'From 0.0 pips', commission: '$6 per lot', bestFor: 'Active traders and scalpers' },
  ],
  fees: {
    trading: {
      spreadType: 'Variable',
      averageSpreads: [
        { pair: 'EUR/USD', spread: '1.0 pip (Standard), 0.0 pips (ECN)' },
        { pair: 'GBP/USD', spread: '1.5 pips (Standard), 0.2 pips (ECN)' },
        { pair: 'Gold', spread: '30 cents (Standard), 20 cents (ECN)' }
      ],
      commissionStructure: "No commission on Standard. $6 per lot round turn on ECN.",
      overnightSwapFees: "Competitive rates. Islamic accounts available."
    },
    nonTrading: {
      inactivityFee: "$10 per month after 6 months",
      withdrawalFee: "None",
      depositFee: "None"
    }
  },
  tradableInstruments: {
    forexPairs: { total: 80, details: "Major, Minor, and Exotic pairs" },
    commodities: { total: 25, details: "Energy, metals, and agricultural products" },
    indices: { total: 30, details: "Global stock indices" },
    stocks: { total: 500, details: "Stock CFDs from major exchanges" },
    cryptocurrencies: { total: 20, details: "Major cryptocurrency CFDs" },
    etfs: { total: 100, details: "Various ETF CFDs" }
  },
  tradingConditionsExtended: {
    minTradeSize: 0.01,
    scalpingAllowed: true,
    hedgingAllowed: true,
    eaAllowed: true,
    negativeBalanceProtection: true,
    marginCallLevel: "100%",
    stopOutLevel: "50%"
  },
  depositWithdrawal: {
    depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
    withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
    depositFees: "None",
    withdrawalFees: "None",
    processingTime: {
      deposits: "Instant for cards and e-wallets",
      withdrawals: "2-5 business days"
    },
    minWithdrawal: 50
  },
  customerSupport: {
    languages: ['English', 'Arabic', 'Chinese', 'Spanish', 'Russian', 'German'],
    channels: ['Live Chat', 'Phone', 'Email'],
    hours: '24/7'
  },
  security: {
    regulatedBy: [
      { regulator: 'CySEC', licenseNumber: '391/18' },
      { regulator: 'FCA', licenseNumber: '776058' },
      { regulator: 'ASIC', licenseNumber: '416279' },
      { regulator: 'DFSA', licenseNumber: 'F004874' }
    ],
    segregatedAccounts: true,
    investorCompensationScheme: { available: true, amount: 'Up to €20,000 (CySEC)' },
    twoFactorAuth: true
  },
  tradingEnvironment: {
    executionSpeedMs: 100,
    slippage: "Low",
    requotes: false,
    marketDepth: true,
    orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop', 'OCO'],
    guaranteedStopLoss: {
      available: false,
      cost: "N/A"
    }
  },
  platformFeatures: {
    charting: {
      indicators: 50,
      drawingTools: 30
    },
    automatedTrading: ['EAs', 'API'],
    copyTrading: {
      available: false,
      platforms: []
    },
    backtesting: true,
    newsIntegration: true
  },
  accountManagement: {
    islamicAccount: {
      available: true,
      conditions: "Swap-free trading available"
    },
    baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'JPY'],
    mamPammSupport: false,
    corporateAccounts: true
  },
  transparency: {
    audited: true,
    yearsInBusiness: 20,
    tradingVolumeDisclosed: false,
    clientBase: "Global clients in 150+ countries"
  },
  regulation: {
    regulators: ['CySEC', 'FCA', 'ASIC', 'DFSA']
  },
  ratings: {
    regulation: 9.5,
    costs: 8.0,
    platforms: 8.5,
    support: 8.5
  },
  accessibility: {
    minDeposit: 500,
    depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
    withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
    customerSupport: ['24/7 Live Chat', 'Phone', 'Email']
  },
  technology: {
    platforms: ['MT4', 'MT5', 'Web Trader'],
    executionType: 'ECN/STP',
    apiAccess: true,
    eaSupport: true
  },
  tradingConditions: {
    spreads: { eurusd: 1.0, gbpusd: 1.5, usdjpy: 1.2 },
    commission: "$6 per lot round turn on ECN",
    swapFeeCategory: 'Low',
    maxLeverage: "1:500",
    minLotSize: 0.01
  }
};

// Tradestation Global Broker Data
export const tradestationGlobalBroker: Broker = {
  id: 'tradestation-global',
  name: 'TradeStation Global',
  logoUrl: '/broker-logos/tradestation-global.png',
  websiteUrl: 'https://www.tradestation.com/global/',
  score: 8.1,
  foundingYear: 2019,
  headquarters: 'London, UK',
  description: 'TradeStation Global is the international division of TradeStation, offering UK and European traders access to US markets with competitive pricing and advanced trading technology.',
  summary: "TradeStation Global provides international traders with access to TradeStation's powerful trading platform and US market coverage. With FCA regulation and competitive commissions, it offers professional-grade tools for active traders.",
  pros: [
    "Access to TradeStation's advanced trading platform",
    "Competitive commissions for US stocks and options",
    "FCA regulation for UK client protection",
    "Excellent charting and analysis tools",
    "Access to US markets including stocks and options",
    "Powerful API and automation capabilities"
  ],
  cons: [
    "Higher minimum deposit requirement",
    "Limited forex and CFD offerings",
    "Complex platform for beginners",
    "Limited customer support hours",
    "No cryptocurrency trading"
  ],

  coreInfo: {
    brokerType: 'ECN',
    mobileTrading: true,
    demoAccount: true,
  },
  accountTypes: [
    { name: 'Individual Account', type: 'ECN', minDeposit: 2000, spreads: 'N/A', commission: '$0.01 per share (stocks)', bestFor: 'Active stock and options traders' },
  ],
  fees: {
    trading: {
      spreadType: 'N/A - Commission based',
      averageSpreads: [
        { pair: 'Stocks', spread: 'N/A - $0.01 per share' },
        { pair: 'Options', spread: 'N/A - $0.60 per contract' },
        { pair: 'Futures', spread: 'N/A - Exchange fees' }
      ],
      commissionStructure: "$0.01 per share for stocks, $0.60 per contract for options, exchange fees for futures.",
      overnightSwapFees: "Not applicable for US securities"
    },
    nonTrading: {
      inactivityFee: "$50 per quarter if no trading activity",
      withdrawalFee: "None",
      depositFee: "None"
    }
  },
  tradableInstruments: {
    forexPairs: { total: 20, details: "Major currency pairs only" },
    commodities: { total: 5, details: "Basic commodities" },
    indices: { total: 15, details: "Major US indices" },
    stocks: { total: 10000, details: "US stocks and ETFs" },
    cryptocurrencies: { total: 0, details: "Not offered" },
    etfs: { total: 3000, details: "US ETFs" }
  },
  tradingConditionsExtended: {
    minTradeSize: 1,
    scalpingAllowed: true,
    hedgingAllowed: true,
    eaAllowed: true,
    negativeBalanceProtection: true,
    marginCallLevel: "100%",
    stopOutLevel: "50%"
  },
  depositWithdrawal: {
    depositMethods: ['Bank Transfer', 'Credit/Debit Card'],
    withdrawalMethods: ['Bank Transfer'],
    depositFees: "None",
    withdrawalFees: "None",
    processingTime: {
      deposits: "1-3 business days",
      withdrawals: "3-5 business days"
    },
    minWithdrawal: 100
  },
  customerSupport: {
    languages: ['English'],
    channels: ['Phone', 'Email', 'Live Chat'],
    hours: '24/5'
  },
  security: {
    regulatedBy: [
      { regulator: 'FCA', licenseNumber: '776058' }
    ],
    segregatedAccounts: true,
    investorCompensationScheme: { available: true, amount: 'Up to £85,000' },
    twoFactorAuth: true
  },
  tradingEnvironment: {
    executionSpeedMs: 50,
    slippage: "Very Low",
    requotes: false,
    marketDepth: true,
    orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop', 'OCO', 'Conditional'],
    guaranteedStopLoss: {
      available: false,
      cost: "N/A"
    }
  },
  platformFeatures: {
    charting: {
      indicators: 300,
      drawingTools: 100
    },
    automatedTrading: ['EasyLanguage', 'API'],
    copyTrading: {
      available: false,
      platforms: []
    },
    backtesting: true,
    newsIntegration: true
  },
  accountManagement: {
    islamicAccount: {
      available: false,
      conditions: "N/A"
    },
    baseCurrencies: ['USD', 'EUR', 'GBP'],
    mamPammSupport: false,
    corporateAccounts: true
  },
  transparency: {
    audited: true,
    yearsInBusiness: 6,
    tradingVolumeDisclosed: true,
    clientBase: "Professional and institutional traders"
  },
  regulation: {
    regulators: ['FCA']
  },
  ratings: {
    regulation: 9.0,
    costs: 7.5,
    platforms: 9.5,
    support: 7.0
  },
  accessibility: {
    minDeposit: 2000,
    depositMethods: ['Bank Transfer', 'Credit/Debit Card'],
    withdrawalMethods: ['Bank Transfer'],
    customerSupport: ['Phone', 'Email', 'Live Chat']
  },
  technology: {
    platforms: ['TradeStation Desktop', 'Web Platform', 'Mobile App'],
    executionType: 'Direct Market Access',
    apiAccess: true,
    eaSupport: true
  },
  tradingConditions: {
    spreads: { eurusd: 1.0, gbpusd: 1.5, usdjpy: 1.2 },
    commission: "$0.01 per share, $0.60 per contract",
    swapFeeCategory: 'Not applicable',
    maxLeverage: "1:6",
    minLotSize: 1
  }
};

// Spreadex Broker Data
export const spreadexBroker: Broker = {
  id: 'spreadex',
  name: 'Spreadex',
  logoUrl: '/broker-logos/spreadex.png',
  websiteUrl: 'https://www.spreadex.com/',
  score: 7.9,
  foundingYear: 1999,
  headquarters: 'Stoke-on-Trent, UK',
  description: 'Spreadex is a UK-based spread betting and CFD broker with over 25 years of experience, offering sports spread betting alongside financial trading services.',
  summary: "Spreadex is a unique UK broker combining financial spread betting with sports spread betting. With FCA regulation and tax-free spread betting for UK residents, it offers competitive spreads and comprehensive market coverage.",
  pros: [
    "Tax-free spread betting for UK residents",
    "Combined financial and sports spread betting",
    "FCA regulated for client protection",
    "Competitive spreads on major markets",
    "25+ years of market experience",
    "User-friendly trading platform"
  ],
  cons: [
    "Spread betting only available to UK residents",
    "Limited international market access",
    "Higher spreads on some markets",
    "No automated trading capabilities",
    "Limited educational resources"
  ],

  coreInfo: {
    brokerType: 'Market Maker',
    mobileTrading: true,
    demoAccount: true,
  },
  accountTypes: [
    { name: 'Spread Betting Account', type: 'Spread Betting', minDeposit: 0, spreads: 'Variable', commission: 'Built into spread', bestFor: 'UK traders seeking tax-free profits' },
    { name: 'CFD Account', type: 'CFD', minDeposit: 0, spreads: 'Variable', commission: 'No commission', bestFor: 'International traders and tax reporting' },
  ],
  fees: {
    trading: {
      spreadType: 'Variable',
      averageSpreads: [
        { pair: 'EUR/USD', spread: '1.0 points' },
        { pair: 'GBP/USD', spread: '1.2 points' },
        { pair: 'FTSE 100', spread: '2 points' }
      ],
      commissionStructure: "No commission, spreads only (built into spread betting)",
      overnightSwapFees: "Built into spread financing"
    },
    nonTrading: {
      inactivityFee: "None",
      withdrawalFee: "None",
      depositFee: "None"
    }
  },
  tradableInstruments: {
    forexPairs: { total: 30, details: "Major currency pairs" },
    commodities: { total: 20, details: "Energy, metals, and agricultural products" },
    indices: { total: 25, details: "Global stock indices" },
    stocks: { total: 500, details: "Stock CFDs from major exchanges" },
    cryptocurrencies: { total: 0, details: "Not offered" },
    etfs: { total: 100, details: "Major ETFs" }
  },
  tradingConditionsExtended: {
    minTradeSize: 0.10,
    scalpingAllowed: true,
    hedgingAllowed: true,
    eaAllowed: false,
    negativeBalanceProtection: true,
    marginCallLevel: "100%",
    stopOutLevel: "50%"
  },
  depositWithdrawal: {
    depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'PayPal'],
    withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'PayPal'],
    depositFees: "None",
    withdrawalFees: "None",
    processingTime: {
      deposits: "Instant for cards and PayPal",
      withdrawals: "2-3 business days"
    },
    minWithdrawal: 25
  },
  customerSupport: {
    languages: ['English'],
    channels: ['Phone', 'Email', 'Live Chat'],
    hours: '24/5'
  },
  security: {
    regulatedBy: [
      { regulator: 'FCA', licenseNumber: '124721' }
    ],
    segregatedAccounts: true,
    investorCompensationScheme: { available: true, amount: 'Up to £85,000' },
    twoFactorAuth: true
  },
  tradingEnvironment: {
    slippage: "Low",
    requotes: true,
    marketDepth: false,
    orderTypes: ['Market', 'Limit', 'Stop', 'Guaranteed Stop'],
    guaranteedStopLoss: {
      available: true,
      cost: "Built into wider spread"
    }
  },
  platformFeatures: {
    charting: {
      indicators: 40,
      drawingTools: 20
    },
    automatedTrading: [],
    copyTrading: {
      available: false,
      platforms: []
    },
    backtesting: false,
    newsIntegration: true
  },
  accountManagement: {
    islamicAccount: {
      available: false,
      conditions: "N/A"
    },
    baseCurrencies: ['GBP', 'EUR', 'USD'],
    mamPammSupport: false,
    corporateAccounts: false
  },
  transparency: {
    audited: true,
    yearsInBusiness: 26,
    tradingVolumeDisclosed: false,
    clientBase: "Primarily UK spread bettors"
  },
  regulation: {
    regulators: ['FCA']
  },
  ratings: {
    regulation: 9.0,
    costs: 7.5,
    platforms: 7.5,
    support: 8.0
  },
  accessibility: {
    minDeposit: 0,
    depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'PayPal'],
    withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'PayPal'],
    customerSupport: ['Phone', 'Email', 'Live Chat']
  },
  technology: {
    platforms: ['Spreadex Platform', 'Mobile App'],
    executionType: 'Market Execution',
    apiAccess: false,
    eaSupport: false
  },
  tradingConditions: {
    spreads: { eurusd: 1.0, gbpusd: 1.2, usdjpy: 1.1 },
    commission: "Built into spread",
    swapFeeCategory: 'Built into financing',
    maxLeverage: "1:200",
    minLotSize: 0.10
  }
};

// Fusion Markets Broker Data
export const fusionMarketsBroker: Broker = {
  id: 'fusion-markets',
  name: 'Fusion Markets',
  logoUrl: '/broker-logos/fusion-markets.png',
  websiteUrl: 'https://www.fusionmarkets.com/',
  score: 8.7,
  foundingYear: 2017,
  headquarters: 'Melbourne, Australia',
  description: 'Fusion Markets is an Australian ECN broker known for its extremely low trading costs, fast execution, and transparent pricing with ASIC and VFSC regulation.',
  summary: "Fusion Markets stands out for offering some of the lowest trading costs in the industry with spreads from 0.0 pips and just $2.25 commission per lot. With ASIC and VFSC regulation and excellent execution speeds, it's ideal for cost-conscious traders.",
  pros: [
    "Extremely low trading costs - $2.25 per lot commission",
    "Spreads from 0.0 pips on major pairs",
    "ASIC and VFSC regulated for client protection",
    "Fast execution speeds (avg. 40ms)",
    "No minimum deposit requirement",
    "Free deposits and withdrawals"
  ],
  cons: [
    "Limited platform options (MT4/MT5 only)",
    "Smaller range of tradable instruments",
    "No proprietary trading platform",
    "Limited educational resources",
    "No guaranteed stop loss orders"
  ],

  coreInfo: {
    brokerType: 'ECN',
    mobileTrading: true,
    demoAccount: true,
  },
  accountTypes: [
    { name: 'ECN Account', type: 'ECN', minDeposit: 0, spreads: 'From 0.0 pips', commission: '$2.25 per lot per side', bestFor: 'All trader types seeking low costs' },
  ],
  fees: {
    trading: {
      spreadType: 'Raw',
      averageSpreads: [
        { pair: 'EUR/USD', spread: '0.0 pips + commission' },
        { pair: 'GBP/USD', spread: '0.2 pips + commission' },
        { pair: 'Gold', spread: '10 cents + commission' }
      ],
      commissionStructure: "$2.25 per lot per side ($4.50 round turn)",
      overnightSwapFees: "Competitive rates. Islamic accounts available."
    },
    nonTrading: {
      inactivityFee: "None",
      withdrawalFee: "None",
      depositFee: "None"
    }
  },
  tradableInstruments: {
    forexPairs: { total: 50, details: "Major and Minor currency pairs" },
    commodities: { total: 15, details: "Gold, silver, oil, and basic commodities" },
    indices: { total: 15, details: "Major global indices" },
    stocks: { total: 100, details: "Stock CFDs from major exchanges" },
    cryptocurrencies: { total: 10, details: "Major crypto CFDs" },
    etfs: { total: 0, details: "Not offered" }
  },
  tradingConditionsExtended: {
    minTradeSize: 0.01,
    scalpingAllowed: true,
    hedgingAllowed: true,
    eaAllowed: true,
    negativeBalanceProtection: true,
    marginCallLevel: "100%",
    stopOutLevel: "50%"
  },
  depositWithdrawal: {
    depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'Sticpay'],
    withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'Sticpay'],
    depositFees: "None",
    withdrawalFees: "None",
    processingTime: {
      deposits: "Instant for cards and e-wallets",
      withdrawals: "1-3 business days"
    },
    minWithdrawal: 1
  },
  customerSupport: {
    languages: ['English'],
    channels: ['Live Chat', 'Email'],
    hours: '24/5'
  },
  security: {
    regulatedBy: [
      { regulator: 'ASIC', licenseNumber: '446296' },
      { regulator: 'VFSC', licenseNumber: '700543' }
    ],
    segregatedAccounts: true,
    investorCompensationScheme: { available: true, amount: 'Varies by jurisdiction' },
    twoFactorAuth: true
  },
  tradingEnvironment: {
    executionSpeedMs: 40,
    slippage: "Very Low",
    requotes: false,
    marketDepth: true,
    orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop', 'OCO'],
    guaranteedStopLoss: {
      available: false,
      cost: "N/A"
    }
  },
  platformFeatures: {
    charting: {
      indicators: 50,
      drawingTools: 30
    },
    automatedTrading: ['EAs', 'API'],
    copyTrading: {
      available: false,
      platforms: []
    },
    backtesting: true,
    newsIntegration: true
  },
  accountManagement: {
    islamicAccount: {
      available: true,
      conditions: "Swap-free trading available"
    },
    baseCurrencies: ['USD', 'EUR', 'AUD', 'GBP'],
    mamPammSupport: false,
    corporateAccounts: false
  },
  transparency: {
    audited: true,
    yearsInBusiness: 8,
    tradingVolumeDisclosed: false,
    clientBase: "Cost-conscious traders globally"
  },
  regulation: {
    regulators: ['ASIC', 'VFSC']
  },
  ratings: {
    regulation: 8.5,
    costs: 9.5,
    platforms: 7.5,
    support: 7.5
  },
  accessibility: {
    minDeposit: 0,
    depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
    withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
    customerSupport: ['Live Chat', 'Email']
  },
  technology: {
    platforms: ['MT4', 'MT5'],
    executionType: 'ECN',
    apiAccess: true,
    eaSupport: true
  },
  tradingConditions: {
    spreads: { eurusd: 0.0, gbpusd: 0.2, usdjpy: 0.1 },
    commission: "$2.25 per lot per side",
    swapFeeCategory: 'Low',
    maxLeverage: "1:500",
    minLotSize: 0.01
  }
};

// Trading212 Broker Data
export const trading212Broker: Broker = {
  id: 'trading212',
  name: 'Trading 212',
  logoUrl: '/broker-logos/trading212.png',
  websiteUrl: 'https://www.trading212.com/',
  score: 9.0,
  foundingYear: 2004,
  headquarters: 'London, United Kingdom',
  description: 'Trading 212 is a leading fintech company that has democratized financial markets with commission-free investing and trading. Offering both Invest/ISA accounts for long-term investing and CFD accounts for leveraged trading, Trading 212 serves over 5 million clients globally with £25 billion in client assets.',
  summary: "Trading 212 revolutionized the industry by introducing commission-free stock trading in the UK and Europe. With top-tier FCA regulation, zero-commission investing, competitive CFD trading, and innovative features like fractional shares and automated investing, it's an excellent choice for both beginners and experienced traders.",
  pros: [
    "Commission-free stock and ETF trading (Invest accounts)",
    "Zero-commission CFD trading with tight spreads",
    "Top-tier FCA regulation with £85,000 FSCS protection",
    "Innovative mobile app with excellent user experience",
    "Fractional shares and automated investing (Pies)",
    "No minimum deposit for Invest accounts",
    "No inactivity or account fees",
    "Multi-currency accounts available"
  ],
  cons: [
    "0.5% FX fee on non-base currency transactions",
    "Limited range of educational resources",
    "CFD trading carries high risk (77% lose money)",
    "No phone support available",
    "Limited advanced trading tools for professionals",
    "Stock research tools are basic compared to dedicated platforms"
  ],

  coreInfo: {
    brokerType: 'Market Maker',
    mobileTrading: true,
    demoAccount: true,
  },
  accountTypes: [
    { name: 'Invest Account', type: 'Standard', minDeposit: 1, spreads: 'Variable', commission: 'Zero commission', bestFor: 'Long-term investors and beginners' },
    { name: 'Stocks & Shares ISA', type: 'Standard', minDeposit: 1, spreads: 'Variable', commission: 'Zero commission', bestFor: 'UK tax-efficient investing' },
    { name: 'CFD Account', type: 'Standard', minDeposit: 1, spreads: 'Dynamic', commission: 'Zero commission', bestFor: 'Active traders and speculators' },
    { name: 'Cash ISA', type: 'Standard', minDeposit: 1, spreads: 'N/A', commission: 'Zero commission', bestFor: 'Cash savings with interest' }
  ],
  fees: {
    trading: {
      spreadType: 'Dynamic',
      averageSpreads: [
        { pair: 'EUR/USD', spread: '1.2 pips' },
        { pair: 'GBP/USD', spread: '1.7 pips' },
        { pair: 'Gold', spread: 'Variable' }
      ],
      commissionStructure: "Zero commission on all trading. 0.5% FX fee applies to trades in currencies other than account base currency.",
      overnightSwapFees: "Positions held past 22:00 GMT incur overnight financing fees, which can be positive or negative depending on position direction."
    },
    nonTrading: {
      inactivityFee: "None",
      withdrawalFee: "None",
      depositFee: "Most methods free, 0.7% fee on card/e-wallet deposits over €2,000 for Invest accounts"
    }
  },
  tradableInstruments: {
    forexPairs: { total: 180, details: "180+ forex pairs including major, minor and exotic pairs" },
    commodities: { total: 50, details: "Precious metals, oils, and agricultural products" },
    indices: { total: 20, details: "Major global indices including S&P 500, FTSE 100, DAX" },
    stocks: { total: 10000, details: "10,000+ stocks and ETFs from major global exchanges" },
    cryptocurrencies: { total: 0, details: "No cryptocurrency trading available" }
  },
  tradingConditionsExtended: {
    minTradeSize: 0.01,
    scalpingAllowed: true,
    hedgingAllowed: true,
    eaAllowed: false,
    negativeBalanceProtection: true,
    marginCallLevel: "100%",
    stopOutLevel: "50%"
  },
  depositWithdrawal: {
    depositMethods: ["Bank Transfer", "Credit/Debit Card", "Skrill", "Neteller", "PayPal"],
    withdrawalMethods: ["Bank Transfer", "Credit/Debit Card", "Skrill", "Neteller", "PayPal"],
    depositFees: "Free for most methods, 0.7% on card/e-wallet deposits over €2,000",
    withdrawalFees: "Free",
    processingTime: {
      deposits: "Instant for cards/e-wallets, 1-3 days for bank transfers",
      withdrawals: "1-3 business days"
    },
    minWithdrawal: 10
  },
  promotions: {
    welcomeBonus: "Free fractional share worth up to £100 with qualifying deposit",
    depositBonus: "None",
    loyaltyProgram: false
  },
  customerSupport: {
    languages: ["English", "German", "Spanish", "French", "Italian", "Polish"],
    channels: ["Live Chat", "Email", "FAQ"],
    hours: "24/5 for trading, 24/7 for account support"
  },
  security: {
    regulatedBy: [
      { regulator: "Financial Conduct Authority (FCA)", licenseNumber: "609146" },
      { regulator: "Cyprus Securities and Exchange Commission (CySEC)", licenseNumber: "398/21" },
      { regulator: "Financial Supervision Commission (FSC) Bulgaria", licenseNumber: "RG-03-0237" },
      { regulator: "Australian Securities and Investments Commission (ASIC)", licenseNumber: "541122" }
    ],
    segregatedAccounts: true,
    investorCompensationScheme: {
      available: true,
      amount: "Up to £85,000 (UK), €20,000 (Cyprus/Bulgaria)"
    },
    twoFactorAuth: true
  },
  tradingEnvironment: {
    executionSpeedMs: 100,
    slippage: "Low",
    requotes: false,
    liquidityProviders: ["Multiple tier-1 banks"],
    marketDepth: true,
    orderTypes: ["Market", "Limit", "Stop Loss", "Take Profit", "Trailing Stop"],
    guaranteedStopLoss: {
      available: false,
      cost: "N/A"
    }
  },
  platformFeatures: {
    charting: {
      indicators: 100,
      drawingTools: 20
    },
    automatedTrading: ["API Access", "Pies (Automated Investing)"],
    copyTrading: {
      available: false,
      platforms: []
    },
    backtesting: false,
    newsIntegration: true
  },
  accountManagement: {
    islamicAccount: {
      available: false,
      conditions: "N/A"
    },
    baseCurrencies: ["GBP", "EUR", "USD", "CHF", "HUF", "PLN", "CZK", "RON", "DKK", "NOK", "SEK", "CAD", "BGN"],
    mamPammSupport: false,
    corporateAccounts: false
  },
  transparency: {
    audited: true,
    yearsInBusiness: 21,
    tradingVolumeDisclosed: true,
    clientBase: "5 million+ funded accounts across 180+ countries"
  },
  regulation: {
    regulators: ["FCA", "CySEC", "FSC Bulgaria", "ASIC"]
  },
  ratings: {
    regulation: 9.5,
    costs: 9.0,
    platforms: 8.5,
    support: 8.0
  },
  accessibility: {
    minDeposit: 1,
    depositMethods: ["Bank Transfer", "Credit/Debit Card", "Skrill", "Neteller", "PayPal"],
    withdrawalMethods: ["Bank Transfer", "Credit/Debit Card", "Skrill", "Neteller", "PayPal"],
    customerSupport: ["Live Chat", "Email"]
  },
  technology: {
    platforms: ["Proprietary Mobile App", "Web Trader"],
    executionType: "Market Maker",
    apiAccess: true,
    eaSupport: false
  },
  tradingConditions: {
    spreads: { eurusd: 1.2, gbpusd: 1.7, usdjpy: 1.0 },
    commission: "Zero commission",
    swapFeeCategory: "Average",
    maxLeverage: "1:30 (Major pairs), 1:20 (Minor pairs), 1:5 (Stocks)",
    minLotSize: 0.01
  },
  socialTrading: {
    popularityScore: 85,
    topTradersCount: 0,
    platforms: ["Community Features", "Pie Sharing"]
  }
};

// VT Markets Broker Data
export const vtMarketsBroker: Broker = {
  id: 'vtmarkets',
  name: 'VT Markets',
  logoUrl: '/broker-logos/vtmarkets.png',
  websiteUrl: 'https://www.vtmarkets.com/',
  score: 8.2,
  foundingYear: 2015,
  headquarters: 'Sydney, Australia',
  description: 'VT Markets is a globally regulated forex and CFD broker established in 2015, offering competitive trading conditions with multiple account types. Serving clients in 160+ countries with over 4 million monthly trades and $200+ billion in trade volume.',
  summary: "VT Markets provides transparent trading conditions with RAW ECN spreads from 0.0 pips, leverage up to 500:1, and negative balance protection. Regulated by FSCA with strong customer satisfaction (4.3/5 on Trustpilot), they offer 1,000+ instruments through MT4, MT5, and their proprietary platforms.",
  pros: [
    "RAW ECN spreads from 0.0 pips with $6 round turn commission",
    "High leverage up to 500:1 available",
    "FSCA regulation with negative balance protection",
    "Wide range of account types (Standard, RAW ECN, PRO ECN, Swap Free, Cent)",
    "Fast execution with direct market access",
    "Multiple trading platforms (MT4, MT5, WebTrader, Mobile App)",
    "No deposit or withdrawal fees",
    "Copy trading available through VTrade platform"
  ],
  cons: [
    "Some reports of withdrawal delays and account issues",
    "Limited range of educational resources compared to larger brokers",
    "Regulatory attention noted by Trustpilot",
    "Minimum deposit $100 for most accounts",
    "High leverage carries significant risk",
    "Limited advanced research tools"
  ],

  coreInfo: {
    brokerType: 'ECN/STP',
    mobileTrading: true,
    demoAccount: true,
  },
  accountTypes: [
    { name: 'Standard STP', type: 'STP', minDeposit: 100, spreads: 'From 1.2 pips', commission: 'Zero commission', bestFor: 'Beginners and casual traders' },
    { name: 'RAW ECN', type: 'ECN', minDeposit: 100, spreads: 'From 0.0 pips', commission: '$6 round turn per lot', bestFor: 'Scalpers and active traders' },
    { name: 'PRO ECN', type: 'ECN', minDeposit: 200, spreads: 'From 0.0 pips', commission: '$3 per side per lot', bestFor: 'High-volume professional traders' },
    { name: 'Swap Free', type: 'Islamic', minDeposit: 100, spreads: 'From 1.2 pips', commission: 'Zero commission', bestFor: 'Shariah-compliant trading' },
    { name: 'Cent Account', type: 'Standard', minDeposit: 50, spreads: 'From 1.1 pips', commission: 'Zero commission', bestFor: 'Beginners wanting to trade with smaller amounts' }
  ],
  fees: {
    trading: {
      spreadType: 'Variable',
      averageSpreads: [
        { pair: 'EUR/USD', spread: '1.2 pips (Standard), 0.0 pips (RAW ECN)' },
        { pair: 'GBP/USD', spread: '1.5 pips (Standard), 0.1 pips (RAW ECN)' },
        { pair: 'Gold', spread: '25 cents (Standard), 15 cents (RAW ECN)' }
      ],
      commissionStructure: "Zero commission on Standard accounts. $6 round turn per lot on RAW ECN ($3 per side). $3 per side per lot on PRO ECN.",
      overnightSwapFees: "Swap-free options available. Standard swap fees apply to other accounts, varying by instrument."
    },
    nonTrading: {
      inactivityFee: "None specified",
      withdrawalFee: "None",
      depositFee: "None"
    }
  },
  tradableInstruments: {
    forexPairs: { total: 60, details: "60+ major, minor and exotic currency pairs" },
    commodities: { total: 15, details: "Energy, precious metals, and soft commodities" },
    indices: { total: 20, details: "Global indices including S&P 500, FTSE 100, DAX" },
    stocks: { total: 200, details: "Share CFDs from major global exchanges" },
    cryptocurrencies: { total: 0, details: "Limited cryptocurrency offerings" }
  },
  tradingConditionsExtended: {
    minTradeSize: 0.01,
    scalpingAllowed: true,
    hedgingAllowed: true,
    eaAllowed: true,
    negativeBalanceProtection: true,
    marginCallLevel: "100%",
    stopOutLevel: "50%"
  },
  depositWithdrawal: {
    depositMethods: ["Bank Transfer", "Credit/Debit Card", "Skrill", "Neteller", "FasaPay"],
    withdrawalMethods: ["Bank Transfer", "Credit/Debit Card", "Skrill", "Neteller", "FasaPay"],
    depositFees: "None",
    withdrawalFees: "None",
    processingTime: {
      deposits: "Instant for cards/e-wallets, 1-3 days for bank transfers",
      withdrawals: "1 business day"
    },
    minWithdrawal: 10
  },
  promotions: {
    welcomeBonus: "50% welcome bonus on qualifying deposits",
    depositBonus: "20% bonus on deposits over $1,000",
    loyaltyProgram: "ClubBleu loyalty program available"
  },
  customerSupport: {
    languages: ["English", "Chinese", "Malay", "Indonesian", "Arabic"],
    channels: ["Live Chat", "Email", "Phone", "WhatsApp", "Telegram"],
    hours: "24/5 customer support"
  },
  security: {
    regulatedBy: [
      { regulator: "Financial Sector Conduct Authority (FSCA)", licenseNumber: "51124" }
    ],
    segregatedAccounts: true,
    investorCompensationScheme: {
      available: false,
      amount: "Not specified"
    },
    twoFactorAuth: true
  },
  tradingEnvironment: {
    executionSpeedMs: 50,
    slippage: "Low",
    requotes: false,
    liquidityProviders: ["Multiple tier-1 banks and liquidity providers"],
    marketDepth: true,
    orderTypes: ["Market", "Limit", "Stop Loss", "Take Profit", "Trailing Stop"],
    guaranteedStopLoss: {
      available: false,
      cost: "N/A"
    }
  },
  platformFeatures: {
    charting: {
      indicators: 50,
      drawingTools: 30
    },
    automatedTrading: ["Expert Advisors (EAs)", "VTrade Copy Trading"],
    copyTrading: {
      available: true,
      platforms: ["VTrade Platform"]
    },
    backtesting: true,
    newsIntegration: true
  },
  accountManagement: {
    islamicAccount: {
      available: true,
      conditions: "Swap-free trading with no admin fees on major forex pairs"
    },
    baseCurrencies: ["USD", "AUD", "EUR", "GBP", "CAD", "HKD", "USC (Cent)"],
    mamPammSupport: false,
    corporateAccounts: false
  },
  transparency: {
    audited: true,
    yearsInBusiness: 10,
    tradingVolumeDisclosed: true,
    clientBase: "4+ million monthly trades, clients in 160+ countries"
  },
  regulation: {
    regulators: ["FSCA"]
  },
  ratings: {
    regulation: 8.0,
    costs: 8.5,
    platforms: 8.0,
    support: 8.5
  },
  accessibility: {
    minDeposit: 50,
    depositMethods: ["Bank Transfer", "Credit/Debit Card", "Skrill", "Neteller", "FasaPay"],
    withdrawalMethods: ["Bank Transfer", "Credit/Debit Card", "Skrill", "Neteller", "FasaPay"],
    customerSupport: ["Live Chat", "Email", "Phone", "WhatsApp", "Telegram"]
  },
  technology: {
    platforms: ["MetaTrader 4", "MetaTrader 5", "WebTrader Plus", "VT Markets App"],
    executionType: "ECN/STP",
    apiAccess: true,
    eaSupport: true
  },
  tradingConditions: {
    spreads: { eurusd: 1.2, gbpusd: 1.5, usdjpy: 1.0 },
    commission: "Varies by account type",
    swapFeeCategory: "Low",
    maxLeverage: "1:500",
    minLotSize: 0.01
  },
  socialTrading: {
    popularityScore: 70,
    topTradersCount: 0,
    platforms: ["VTrade Copy Trading"]
  }
};

// TMGM Broker Data
export const tmgmBroker: Broker = {
  id: 'tmgm',
  name: 'TMGM (TradeMax Global Markets)',
  logoUrl: '/broker-logos/tmgm.png',
  websiteUrl: 'https://www.tmgm.com/',
  score: 8.6,
  foundingYear: 2013,
  headquarters: 'Sydney, Australia',
  description: 'TMGM (TradeMax Global Markets) is a highly regulated forex and CFD broker with ASIC, FMA, VFSC, and FSC Mauritius licenses. Offering 12,000+ tradable instruments including forex, indices, commodities, and cryptocurrencies with competitive spreads from 0.0 pips.',
  summary: "TMGM stands out as a multi-regulated broker offering exceptional trading conditions with spreads from 0.0 pips, leverage up to 1:1000, and access to 12,000+ instruments. With top-tier ASIC regulation, $10 million professional indemnity insurance, and ultra-fast execution (<30ms), it provides secure and efficient trading for all levels.",
  pros: [
    "Highly regulated by ASIC, FMA, VFSC, and FSC Mauritius",
    "Competitive spreads from 0.0 pips on EDGE accounts",
    "Ultra-fast execution speed under 30 milliseconds",
    "12,000+ tradable instruments across multiple asset classes",
    "No deposit or withdrawal fees",
    "24/7 multilingual customer support",
    "Advanced trading platforms including MT4, MT5, and IRESS",
    "Copy trading and social trading features available"
  ],
  cons: [
    "Commission charges on ECN accounts ($7 round trip)",
    "Limited educational content compared to previous offerings",
    "Some withdrawal delays reported by users",
    "IRESS platform not optimized for forex trading",
    "Mixed employee satisfaction reviews"
  ],

  coreInfo: {
    brokerType: 'ECN/STP',
    mobileTrading: true,
    demoAccount: true,
  },
  accountTypes: [
    { name: 'EDGE Account', type: 'ECN', minDeposit: 100, spreads: 'From 0.0 pips', commission: '$3.50 per side ($7 round trip)', bestFor: 'Active traders and scalpers' },
    { name: 'CLASSIC Account', type: 'STP', minDeposit: 100, spreads: 'From 1.0 pip', commission: 'Zero commission', bestFor: 'Beginners and casual traders' },
    { name: 'Standard Account', type: 'STP', minDeposit: 1000, spreads: 'From 1.6 pips', commission: 'Zero commission', bestFor: 'Traders seeking stability' },
    { name: 'Premium Account', type: 'STP', minDeposit: 50000, spreads: 'From 1.1 pips', commission: 'Zero commission', bestFor: 'High-volume traders' },
    { name: 'Pro Account', type: 'STP', minDeposit: 100000, spreads: 'From 0.7 pips', commission: 'Zero commission', bestFor: 'Professional traders' },
    { name: 'Raw Spread Account', type: 'ECN', minDeposit: 100000, spreads: 'From 0.0 pips', commission: '$3.50 per side', bestFor: 'Institutional traders' }
  ],
  fees: {
    trading: {
      spreadType: 'Variable',
      averageSpreads: [
        { pair: 'EUR/USD', spread: '0.0 pips (EDGE), 1.0 pip (CLASSIC)' },
        { pair: 'GBP/USD', spread: '0.0 pips (EDGE), 1.2 pips (CLASSIC)' },
        { pair: 'Gold', spread: '15 cents (EDGE), 25 cents (CLASSIC)' }
      ],
      commissionStructure: "$3.50 per side ($7 round trip) on EDGE and Raw Spread accounts. No commission on CLASSIC, Standard, Premium, and Pro accounts.",
      overnightSwapFees: "Competitive swap rates. Islamic accounts available on EDGE accounts."
    },
    nonTrading: {
      inactivityFee: "None",
      withdrawalFee: "None",
      depositFee: "None"
    }
  },
  tradableInstruments: {
    forexPairs: { total: 60, details: "60+ major, minor and exotic currency pairs" },
    commodities: { total: 25, details: "Energy, precious metals, and agricultural products" },
    indices: { total: 30, details: "Global stock indices" },
    stocks: { total: 5000, details: "Share CFDs from major exchanges" },
    cryptocurrencies: { total: 10, details: "Major cryptocurrency CFDs" },
    etfs: { total: 1000, details: "ETF CFDs from global exchanges" }
  },
  tradingConditionsExtended: {
    minTradeSize: 0.01,
    scalpingAllowed: true,
    hedgingAllowed: true,
    eaAllowed: true,
    negativeBalanceProtection: true,
    marginCallLevel: "100%",
    stopOutLevel: "50%"
  },
  depositWithdrawal: {
    depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'FasaPay', 'Cryptocurrency'],
    withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'FasaPay', 'Cryptocurrency'],
    depositFees: "None",
    withdrawalFees: "None",
    processingTime: {
      deposits: "Instant for cards/e-wallets/crypto, 1-4 days for bank transfers",
      withdrawals: "1-4 business days"
    },
    minWithdrawal: 100
  },
  promotions: {
    welcomeBonus: "Varies by region and account type",
    depositBonus: "Periodic promotional offers",
    loyaltyProgram: "TMGM Rewards Program with points per trade"
  },
  customerSupport: {
    languages: ['English', 'Chinese', 'Arabic', 'Spanish', 'Russian', 'German', 'Thai'],
    channels: ['Live Chat', 'Phone', 'Email'],
    hours: '24/7'
  },
  security: {
    regulatedBy: [
      { regulator: 'ASIC', licenseNumber: '436416' },
      { regulator: 'FMA', licenseNumber: 'FSP610021' },
      { regulator: 'VFSC', licenseNumber: '40356' },
      { regulator: 'FSC Mauritius', licenseNumber: 'GB22201012' }
    ],
    segregatedAccounts: true,
    investorCompensationScheme: { available: true, amount: '$10 million AUD Professional Indemnity Insurance' },
    twoFactorAuth: true
  },
  tradingEnvironment: {
    executionSpeedMs: 30,
    slippage: "Very Low",
    requotes: false,
    liquidityProviders: ["Top-tier banks and liquidity providers"],
    marketDepth: true,
    orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop', 'OCO'],
    guaranteedStopLoss: {
      available: false,
      cost: "N/A"
    }
  },
  platformFeatures: {
    charting: {
      indicators: 50,
      drawingTools: 30
    },
    automatedTrading: ['EAs', 'API', 'Copy Trading'],
    copyTrading: {
      available: true,
      platforms: ['Built-in copy trading', 'Signal Centre']
    },
    backtesting: true,
    newsIntegration: true
  },
  accountManagement: {
    islamicAccount: {
      available: true,
      conditions: "Swap-free trading available on EDGE accounts"
    },
    baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD', 'HKD', 'SGD', 'JPY'],
    mamPammSupport: false,
    corporateAccounts: true
  },
  transparency: {
    audited: true,
    yearsInBusiness: 12,
    tradingVolumeDisclosed: true,
    clientBase: "350,000+ active traders worldwide"
  },
  regulation: {
    regulators: ['ASIC', 'FMA', 'VFSC', 'FSC Mauritius']
  },
  ratings: {
    regulation: 9.5,
    costs: 8.5,
    platforms: 8.5,
    support: 8.5
  },
  accessibility: {
    minDeposit: 100,
    depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'Cryptocurrency'],
    withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'Cryptocurrency'],
    customerSupport: ['24/7 Live Chat', 'Phone', 'Email']
  },
  technology: {
    platforms: ['MT4', 'MT5', 'IRESS', 'WebTrader', 'Mobile App'],
    executionType: 'ECN/STP',
    apiAccess: true,
    eaSupport: true
  },
  tradingConditions: {
    spreads: { eurusd: 0.0, gbpusd: 0.2, usdjpy: 0.1 },
    commission: "$7 round trip on EDGE accounts",
    swapFeeCategory: 'Low',
    maxLeverage: "1:1000",
    minLotSize: 0.01
  },
  socialTrading: {
    popularityScore: 75,
    topTradersCount: 0,
    platforms: ['Built-in copy trading', 'Signal Centre']
  }
};

// Trade Nation Broker Data
export const tradeNationBroker: Broker = {
  id: 'trade-nation',
  name: 'Trade Nation',
  logoUrl: '/broker-logos/trade-nation.png',
  websiteUrl: 'https://www.tradenation.com/',
  score: 8.4,
  foundingYear: 2014,
  headquarters: 'London, United Kingdom',
  description: 'Trade Nation is a multi-regulated forex and CFD broker known for its fixed spreads, zero-commission trading, and award-winning platforms. Operating under FCA, ASIC, FSCA, and other regulatory bodies with a focus on transparency and low trading costs.',
  summary: "Trade Nation stands out with its unique fixed spread model that doesn't widen during market volatility, offering competitive all-inclusive pricing with no hidden fees. With multiple regulatory licenses including FCA and ASIC, zero minimum deposit, and excellent mobile trading, it provides accessible trading for all levels.",
  pros: [
    "Fixed spreads that don't widen during volatility",
    "Zero commission trading with all-inclusive spreads",
    "Multi-regulated (FCA, ASIC, FSCA, FSA, SCB)",
    "No minimum deposit requirement ($0 minimum)",
    "No inactivity, deposit, or withdrawal fees",
    "Award-winning platforms including TN Trader and TradingView integration",
    "Extensive regional payment options including cryptocurrency",
    "Negative balance protection across all jurisdictions"
  ],
  cons: [
    "High overnight financing rates for leveraged positions",
    "Limited range of tradable instruments compared to larger brokers",
    "No 2FA authentication on mobile app",
    "Not listed on stock exchange",
    "Financial information not publicly available"
  ],

  coreInfo: {
    brokerType: 'Market Maker',
    mobileTrading: true,
    demoAccount: true,
  },
  accountTypes: [
    { name: 'Individual Account', type: 'Standard', minDeposit: 0, spreads: 'Fixed from 0.6 pips', commission: 'Zero commission', bestFor: 'All trader levels, especially beginners' },
    { name: 'Corporate Account', type: 'Standard', minDeposit: 0, spreads: 'Fixed from 0.6 pips', commission: 'Zero commission', bestFor: 'Business and institutional trading' },
    { name: 'Islamic Account', type: 'Islamic', minDeposit: 0, spreads: 'Fixed from 0.6 pips', commission: 'Zero commission', bestFor: 'Shariah-compliant trading' }
  ],
  fees: {
    trading: {
      spreadType: 'Fixed',
      averageSpreads: [
        { pair: 'EUR/USD', spread: '0.6 pips' },
        { pair: 'GBP/USD', spread: '0.8 pips' },
        { pair: 'S&P 500', spread: '0.3 points' },
        { pair: 'Apple Stock', spread: '0.4 points' }
      ],
      commissionStructure: "Zero commission - all fees built into fixed spreads",
      overnightSwapFees: "High financing rates for overnight positions. Islamic accounts available."
    },
    nonTrading: {
      inactivityFee: "None",
      withdrawalFee: "None",
      depositFee: "None"
    }
  },
  tradableInstruments: {
    forexPairs: { total: 36, details: "Major, minor, and exotic currency pairs" },
    commodities: { total: 8, details: "Gold, silver, oil, natural gas, and other commodities" },
    indices: { total: 19, details: "Global stock indices including S&P 500, Wall Street 30" },
    stocks: { total: 1100, details: "Stock CFDs from major global exchanges" },
    cryptocurrencies: { total: 9, details: "Bitcoin, Ethereum, Litecoin, Cardano, and more" },
    etfs: { total: 0, details: "Not offered" }
  },
  tradingConditionsExtended: {
    minTradeSize: 0.01,
    scalpingAllowed: true,
    hedgingAllowed: true,
    eaAllowed: true,
    negativeBalanceProtection: true,
    marginCallLevel: "100%",
    stopOutLevel: "50%"
  },
  depositWithdrawal: {
    depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'Cryptocurrency', 'Various regional methods'],
    withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'Cryptocurrency'],
    depositFees: "None",
    withdrawalFees: "None",
    processingTime: {
      deposits: "Instant for cards/e-wallets, 1-5 days for bank transfers",
      withdrawals: "1-5 business days"
    },
    minWithdrawal: 50
  },
  customerSupport: {
    languages: ['English', 'French', 'German', 'Spanish', 'Indonesian', 'Malay', 'Vietnamese', 'Chinese', 'Arabic'],
    channels: ['Live Chat', 'Email', 'Phone', 'FAQ'],
    hours: '24/5'
  },
  security: {
    regulatedBy: [
      { regulator: 'FCA', licenseNumber: '525524' },
      { regulator: 'ASIC', licenseNumber: '428941' },
      { regulator: 'FSCA', licenseNumber: '51351' },
      { regulator: 'FSA Seychelles', licenseNumber: 'SD037' },
      { regulator: 'SCB Bahamas', licenseNumber: 'SIA-F214' }
    ],
    segregatedAccounts: true,
    investorCompensationScheme: { available: true, amount: 'Up to £85,000 (UK), varies by jurisdiction' },
    twoFactorAuth: true
  },
  tradingEnvironment: {
    executionSpeedMs: 100,
    slippage: "Low",
    requotes: false,
    liquidityProviders: ["Multiple tier-1 banks"],
    marketDepth: true,
    orderTypes: ['Market', 'Limit', 'Stop', 'Stop Limit', 'Trailing Stop', 'Guaranteed Stop Loss'],
    guaranteedStopLoss: {
      available: true,
      cost: "Small fee per activation"
    }
  },
  platformFeatures: {
    charting: {
      indicators: 100,
      drawingTools: 50
    },
    automatedTrading: ['EAs', 'API', 'TradeCopier'],
    copyTrading: {
      available: true,
      platforms: ['TradeCopier with MT4']
    },
    backtesting: true,
    newsIntegration: true
  },
  accountManagement: {
    islamicAccount: {
      available: true,
      conditions: "Swap-free trading available through Seychelles and Bahamas entities"
    },
    baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'ZAR', 'SGD', 'MYR', 'IDR', 'VND', 'NOK'],
    mamPammSupport: false,
    corporateAccounts: true
  },
  transparency: {
    audited: true,
    yearsInBusiness: 11,
    tradingVolumeDisclosed: false,
    clientBase: "Global client base across 150+ countries"
  },
  regulation: {
    regulators: ['FCA', 'ASIC', 'FSCA', 'FSA Seychelles', 'SCB Bahamas']
  },
  ratings: {
    regulation: 9.0,
    costs: 9.0,
    platforms: 8.5,
    support: 8.5
  },
  accessibility: {
    minDeposit: 0,
    depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'Cryptocurrency', 'Regional methods'],
    withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'Cryptocurrency'],
    customerSupport: ['Live Chat', 'Email', 'Phone', 'FAQ']
  },
  technology: {
    platforms: ['TN Trader', 'TradingView', 'MetaTrader 4', 'Mobile App'],
    executionType: 'Market Execution',
    apiAccess: true,
    eaSupport: true
  },
  tradingConditions: {
    spreads: { eurusd: 0.6, gbpusd: 0.8, usdjpy: 0.7 },
    commission: "Zero commission",
    swapFeeCategory: "High",
    maxLeverage: "1:200 (UK), 1:500 (Seychelles)",
    minLotSize: 0.01
  },
  socialTrading: {
    popularityScore: 65,
    topTradersCount: 0,
    platforms: ['TradeCopier']
  }
};

// Export all new brokers as an array
export const newBrokers: Broker[] = [
  royalBroker,
  captraderBroker,
  mexemBroker,
  fxTradingBroker,
  multibankBroker,
  tradestationGlobalBroker,
  spreadexBroker,
  fusionMarketsBroker,
  trading212Broker,
  vtMarketsBroker,
  tmgmBroker,
  tradeNationBroker
];