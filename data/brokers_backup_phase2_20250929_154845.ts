import { Broker } from '../types';

export const brokers: Broker[] = [
  {
    id: 'pepperstone',
    name: 'Pepperstone',
    logoUrl: '/broker-logos/pepperstone.png',
    websiteUrl: 'https://pepperstone.com/',
    score: 9.2,
    foundingYear: 2010,
    headquarters: 'Melbourne, Australia',
    description: 'Pepperstone is an award-winning online broker known for its fast execution, low spreads, and a wide range of trading platforms. It is regulated by top-tier authorities like ASIC and the FCA.',
    summary: "Our top-rated broker, Pepperstone, excels in offering ultra-low trading costs through its Razor account, making it ideal for scalpers and algorithmic traders. With top-tier regulation from ASIC and the FCA, excellent platform variety including TradingView integration, and no minimum deposit, it's a superb choice for both new and experienced traders who prioritize performance and safety.",
    pros: [
        "Extremely low forex fees on Razor account",
        "Fast and reliable ECN trade execution",
        "Regulated by top-tier authorities (FCA, ASIC, CySEC)",
        "Excellent selection of trading platforms (MT4, MT5, cTrader, TradingView)",
        "Seamless and free deposit/withdrawal options",
        "No minimum deposit requirement"
    ],
    cons: [
        "Stock CFD fees are relatively high",
        "Does not offer investor protection for non-EU/UK clients",
        "No proprietary mobile platform"
    ],
    
    coreInfo: {
        brokerType: 'ECN',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'STP', minDeposit: 0, spreads: 'From 1.0 pips', commission: 'Zero commission', bestFor: 'Beginners and discretionary traders' },
        { name: 'Razor Account', type: 'ECN', minDeposit: 0, spreads: 'From 0.06 pips', commission: '~$3.50 per lot per side', bestFor: 'Scalpers and algorithmic traders' },
    ],
    fees: {
        trading: {
            spreadType: 'Raw',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.06 pips + commission' },
                { pair: 'GBP/USD', spread: '0.4 pips + commission' },
                { pair: 'Gold', spread: '12 cents' }
            ],
            commissionStructure: "$3.50 per lot per side on Razor Account. None on Standard.",
            overnightSwapFees: "Competitive, varies by instrument. Islamic swap-free account available."
        },
        nonTrading: {
            inactivityFee: "None",
            withdrawalFee: "None for Cards/PayPal/Skrill. Bank transfers may incur fees.",
            depositFee: "None. Pepperstone covers fees."
        }
    },
    tradableInstruments: {
        forexPairs: { total: 62, details: "Majors, Minors, Exotics" },
        commodities: { total: 22, details: "Metals, Energies, Soft Commodities" },
        indices: { total: 28, details: "Global stock indices including US500, UK100" },
        stocks: { total: 1000, details: "US, UK, AU, and DE Stock CFDs" },
        cryptocurrencies: { total: 18, details: "BTC, ETH, LTC, and more" },
        etfs: { total: 100, details: "Various ETF CFDs" }
    },
    tradingConditionsExtended: {
        minTradeSize: 0.01,
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true,
        marginCallLevel: "80%",
        stopOutLevel: "50%"
    },
    depositWithdrawal: {
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'PayPal', 'Skrill', 'Neteller', 'UnionPay'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'PayPal', 'Skrill', 'Neteller'],
        depositFees: "None",
        withdrawalFees: "None from Pepperstone's side",
        processingTime: {
            deposits: "Instant for cards and e-wallets",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 20
    },
    customerSupport: {
        languages: ['English', 'Spanish', 'Chinese', 'Russian', 'Arabic', 'Thai'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'ASIC', licenseNumber: '414530' },
            { regulator: 'FCA', licenseNumber: '684312' },
            { regulator: 'CySEC', licenseNumber: '388/20' },
            { regulator: 'DFSA', licenseNumber: 'F004356' },
            { regulator: 'BaFin' },
            { regulator: 'CMA' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        executionSpeedMs: 30,
        slippage: "Low, with positive and negative slippage occurring",
        requotes: false,
        liquidityProviders: ['20+ Tier 1 Banks and ECNs'],
        marketDepth: true,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        guaranteedStopLoss: { available: false }
    },
    platformFeatures: {
        charting: { indicators: 80, drawingTools: 50 },
        automatedTrading: ['EAs (MQL4/5)', 'cAlgo', 'API'],
        copyTrading: { available: true, platforms: ['Myfxbook', 'DupliTrade', 'MetaTrader Signals'] },
        backtesting: true,
        newsIntegration: true
    },
    accountManagement: {
        islamicAccount: { available: true, conditions: "No swap fees, admin fee charged after 3 days." },
        baseCurrencies: ['AUD', 'USD', 'JPY', 'GBP', 'EUR', 'CAD', 'CHF', 'NZD', 'SGD', 'HKD'],
        mamPammSupport: true,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2010,
        tradingVolumeDisclosed: false,
        clientBase: "300,000+ clients worldwide"
    },

    // Legacy fields for backward compatibility
    isIslamic: true,
    copyTrading: true,
    providesSignals: false,
    regulation: { regulators: ['ASIC', 'FCA', 'CySEC', 'DFSA', 'BaFin', 'CMA'] },
    ratings: { regulation: 9.8, costs: 9.5, platforms: 9.0, support: 9.1 },
    tradingConditions: {
    spreads: { eurusd: 0.06, gbpusd: 0.16, usdjpy: 0.09 },
      commission: '$3.50 per lot',
      swapFeeCategory: 'Low',
      maxLeverage: '1:500',
      minLotSize: 0.01,
    },
    accessibility: {
      minDeposit: 0,
      depositMethods: ['Credit Card', 'Debit Card', 'Bank Transfer', 'PayPal', 'Skrill', 'Neteller'],
      withdrawalMethods: ['Credit Card', 'Bank Transfer', 'PayPal', 'Skrill'],
      customerSupport: ['24/5 Live Chat', 'Phone', 'Email'],
    },
    technology: {
      platforms: ['MT4', 'MT5', 'cTrader', 'TradingView'],
      executionType: 'ECN/STP',
      apiAccess: true,
      eaSupport: true,
    },
    reviews: [
      { id: 'rev1', brokerId: 'pepperstone', userId: 'user123', userName: 'Alice', rating: 5, comment: 'Excellent spreads and customer service. Highly recommend!', date: '2023-10-26T10:00:00Z', verified: true },
      { id: 'rev2', brokerId: 'pepperstone', userId: 'user456', userName: 'Bob', rating: 4, comment: 'Good platform selection, but withdrawal took a bit longer than expected.', date: '2023-10-22T14:30:00Z' },
    ],
  },
  {
    id: 'ic-markets',
    name: 'IC Markets',
    logoUrl: '/broker-logos/ic-markets.jpg',
    websiteUrl: 'https://www.icmarkets.com/',
    score: 9.0,
    foundingYear: 2007,
    headquarters: 'Sydney, Australia',
    description: 'IC Markets is one of the most renowned Forex CFD providers, offering trading solutions for active day traders and scalpers as well as traders that are new to the forex market.',
    summary: "IC Markets is a top choice for high-volume traders and scalpers, boasting some of the lowest spreads in the industry through its true ECN environment. With 24/7 support and a wide range of platforms, it's a high-performance broker for serious traders.",
    pros: ["True ECN broker with deep liquidity", "Extremely low spreads from 0.0 pips", "24/7 customer support", "No restrictions on trading styles (scalping, EAs allowed)", "Fast order execution"],
    cons: ["Limited educational resources for beginners", "Research tools are mostly third-party", "Minimum deposit of $200 might be a barrier for some"],
    
    coreInfo: {
        brokerType: 'ECN',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard', type: 'Standard', minDeposit: 200, spreads: 'From 0.6 pips', commission: 'Zero', bestFor: 'Discretionary traders' },
        { name: 'Raw Spread', type: 'ECN', minDeposit: 200, spreads: 'From 0.0 pips', commission: '$3.50 per lot', bestFor: 'Scalpers & Algo traders' },
        { name: 'cTrader Raw', type: 'ECN', minDeposit: 200, spreads: 'From 0.0 pips', commission: '$3.00 per lot', bestFor: 'cTrader users' },
    ],
     fees: {
        trading: {
            spreadType: 'Raw',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.0 pips + commission' },
                { pair: 'GBP/USD', spread: '0.2 pips + commission' },
            ],
            commissionStructure: "$3.50 per lot per side on MT4/5 Raw, $3.00 on cTrader Raw.",
            overnightSwapFees: "Standard rates, Islamic account available."
        },
        nonTrading: {
            inactivityFee: "None",
            withdrawalFee: "None",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { total: 61, details: "All major and minor pairs" },
        commodities: { total: 19, details: "Metals, energies, and softs" },
        indices: { total: 25, details: "Global indices from Asia, Europe, and America" },
        stocks: { total: 2100, details: "2,100+ US, UK, German, Australian stocks" },
        cryptocurrencies: { total: 10, details: "Popular cryptos including BTC, ETH, XRP" },
    },
     tradingConditionsExtended: {
        minTradeSize: 0.01,
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true,
        marginCallLevel: "120%",
        stopOutLevel: "50%"
    },
     depositWithdrawal: {
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'PayPal', 'Neteller', 'Skrill', 'UnionPay'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'PayPal', 'Neteller', 'Skrill'],
        depositFees: "None",
        withdrawalFees: "None",
        processingTime: {
            deposits: "Instant",
            withdrawals: "Processed same day, received in 1-5 days"
        },
        minWithdrawal: 0
    },
    customerSupport: {
        languages: ['English', 'Chinese', 'Japanese', 'Spanish', 'Italian'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/7'
    },
    security: {
        regulatedBy: [
            { regulator: 'ASIC', licenseNumber: '335692' },
            { regulator: 'CySEC', licenseNumber: '362/18' },
            { regulator: 'FSA', licenseNumber: 'SD018' },
            { regulator: 'SCB', licenseNumber: 'SIA-F194' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to €20,000 (CySEC)' },
        twoFactorAuth: true
    },
     tradingEnvironment: {
        executionSpeedMs: 40,
        slippage: "Minimal due to deep ECN liquidity from 50+ tier-1 providers",
        requotes: false,
        liquidityProviders: ['50+ tier-1 banks and institutions including Goldman Sachs, JPMorgan, Barclays'],
        marketDepth: true,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        guaranteedStopLoss: { available: false }
    },
    platformFeatures: {
        charting: { indicators: 80, drawingTools: 50 },
        automatedTrading: ['EAs (MQL4/5)', 'cAlgo', 'API'],
        copyTrading: { available: true, platforms: ['Myfxbook', 'ZuluTrade'] },
        backtesting: true,
        newsIntegration: true
    },
    accountManagement: {
        islamicAccount: { available: true, conditions: "Swap-free on most pairs, holding fee applies after 1 day." },
        baseCurrencies: ['USD', 'AUD', 'EUR', 'GBP', 'SGD', 'NZD', 'JPY', 'CHF', 'HKD', 'CAD'],
        mamPammSupport: true,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2007,
        tradingVolumeDisclosed: true,
        clientBase: "200,000+ active clients"
    },

    // Legacy fields
    isIslamic: true,
    copyTrading: true,
    providesSignals: false,
    regulation: { regulators: ['ASIC', 'CySEC', 'FSA'] },
    ratings: { regulation: 9.5, costs: 9.7, platforms: 8.8, support: 9.0 },
    tradingConditions: {
      spreads: { eurusd: 0.0, gbpusd: 0.2, usdjpy: 0.1 },
      commission: '$3.50 per lot',
      swapFeeCategory: 'Low',
      maxLeverage: '1:500',
      minLotSize: 0.01,
    },
    accessibility: {
      minDeposit: 200,
      depositMethods: ['Credit Card', 'Bank Transfer', 'PayPal', 'Neteller'],
      withdrawalMethods: ['Credit Card', 'Bank Transfer', 'PayPal'],
      customerSupport: ['24/7 Live Chat', 'Phone', 'Email'],
    },
    technology: {
      platforms: ['MT4', 'MT5', 'cTrader'],
      executionType: 'ECN',
      apiAccess: true,
      eaSupport: true,
    },
    reviews: [
      { id: 'rev3', brokerId: 'ic-markets', userId: 'user789', userName: 'Charlie', rating: 5, comment: 'The raw spreads are unbeatable for scalping. 24/7 support is a huge plus.', date: '2023-09-15T08:00:00Z', verified: true },
    ],
  },
  {
    id: 'xtb',
    name: 'XTB',
    logoUrl: '/broker-logos/xtb.png',
    websiteUrl: 'https://www.xtb.com/',
    score: 8.8,
    foundingYear: 2002,
    headquarters: 'Warsaw, Poland',
    description: 'XTB is a global, publicly-traded CFDs and forex broker with an excellent proprietary trading platform, xStation 5, and great customer service.',
    summary: "XTB stands out with its fantastic proprietary trading platform, xStation 5, which offers a seamless and intuitive trading experience. As a publicly-listed company with strong regulation, it provides a high level of trust, making it a great all-round choice.",
    pros: ["Outstanding xStation 5 trading platform", "Publicly listed and highly regulated (FCA, KNF)", "Excellent educational content and market analysis", "No minimum deposit", "Fast and free withdrawals"],
    cons: ["Forex spreads are not the tightest", "Does not support MT4 or MT5", "Limited account types"],

    coreInfo: { brokerType: 'Market Maker', mobileTrading: true, demoAccount: true },
    accountTypes: [
        { name: 'Standard', type: 'Standard', minDeposit: 0, spreads: 'From 0.5 pips', commission: 'Zero', bestFor: 'All-round traders' },
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [{ pair: 'EUR/USD', spread: '0.5 pips' }, { pair: 'GBP/USD', spread: '0.8 pips' }],
            commissionStructure: "Zero commission on forex, indices, and commodities.",
            overnightSwapFees: "Standard rates"
        },
        nonTrading: { inactivityFee: "€10 after 12 months of no activity", withdrawalFee: "Free for withdrawals over $50", depositFee: "None for bank transfer, Skrill may have fees" }
    },
    tradableInstruments: {
        forexPairs: { total: 48, details: "Majors and Minors" },
        commodities: { total: 22, details: "Gold, Oil, Silver, Natural Gas" },
        indices: { total: 42, details: "Global indices" },
        stocks: { total: 1800, details: "US, EU Stock CFDs" },
        cryptocurrencies: { total: 25, details: "BTC, ETH, etc." },
        etfs: { total: 150, details: "Various ETF CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: false, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'PayPal'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card'],
        depositFees: "None for Bank/Card",
        withdrawalFees: "Free above a certain threshold",
        processingTime: { deposits: "Instant for cards", withdrawals: "Usually within 1 business day" },
        minWithdrawal: 50
    },
    customerSupport: { languages: ['English', 'Polish', 'German', 'Spanish', 'French'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
        regulatedBy: [{ regulator: 'FCA', licenseNumber: '522157' }, { regulator: 'KNF' }, { regulator: 'CySEC', licenseNumber: '169/12' }, { regulator: 'IFSC' }],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to €20,000 (CySEC)' },
        twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 50, slippage: "Low", requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: true, cost: "Wider spread" } },
    platformFeatures: {
        charting: { indicators: 39, drawingTools: 20 },
        automatedTrading: [],
        copyTrading: { available: false, platforms: [] },
        backtesting: true,
        newsIntegration: true
    },
    accountManagement: {
        islamicAccount: { available: true, conditions: "Available upon request, conditions apply." },
        baseCurrencies: ['EUR', 'USD', 'GBP', 'PLN'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2002, tradingVolumeDisclosed: true, clientBase: "500,000+ clients" },

    // Legacy fields
    isIslamic: true,
    copyTrading: false,
    providesSignals: false,
    regulation: { regulators: ['FCA', 'KNF', 'CySEC', 'IFSC'] },
    ratings: { regulation: 9.2, costs: 8.5, platforms: 9.5, support: 8.9 },
    tradingConditions: {
      spreads: { eurusd: 0.5, gbpusd: 0.8, usdjpy: 0.6 },
      commission: 'Zero on Standard accounts',
      swapFeeCategory: 'Standard',
      maxLeverage: '1:500',
      minLotSize: 0.01,
    },
    accessibility: {
      minDeposit: 0,
      depositMethods: ['Bank Transfer', 'Credit Card', 'Skrill'],
      withdrawalMethods: ['Bank Transfer', 'Credit Card'],
      customerSupport: ['24/5 Live Chat', 'Phone', 'Email'],
    },
    technology: {
      platforms: ['xStation 5'],
      executionType: 'Market Maker',
      apiAccess: false,
      eaSupport: false,
    },
    reviews: [
      { id: 'rev4', brokerId: 'xtb', userId: 'user101', userName: 'David', rating: 4, comment: 'xStation 5 is a fantastic platform. Very intuitive.', date: '2023-11-01T11:20:00Z' },
      { id: 'rev5', brokerId: 'xtb', userId: 'user112', userName: 'Eve', rating: 5, comment: 'No minimum deposit is great for beginners. I started with a small amount and had no issues.', date: '2023-08-05T18:45:00Z', verified: true },
    ],
  },
  {
    id: 'forex-com',
    name: 'Forex.com',
    logoUrl: '/broker-logos/forex-com.png',
    websiteUrl: 'https://www.forex.com/',
    score: 8.5,
    foundingYear: 2001,
    headquarters: 'New Jersey, USA',
    description: 'Forex.com is a trusted global brand, offering a wide range of markets and a comprehensive trading experience through its advanced platforms.',
    summary: "As a well-established and highly regulated broker, especially in the US, Forex.com offers a reliable trading environment with a vast array of tradable instruments. Its Advanced Trading Platform is powerful, but spreads on standard accounts can be wider than competitors.",
    pros: ["Highly regulated in multiple jurisdictions, including US (NFA)", "Wide range of markets, including 4,500+ stock CFDs", "Powerful Advanced Trading Platform", "Part of the publicly-traded StoneX Group"],
    cons: ["Standard account spreads are not competitive", "Customer support could be more responsive", "High stock CFD financing rates"],
    
    coreInfo: { brokerType: 'Market Maker', mobileTrading: true, demoAccount: true },
    accountTypes: [
        { name: 'Standard', type: 'Standard', minDeposit: 100, spreads: 'From 1.0 pips', commission: 'Zero', bestFor: 'Beginners' },
        { name: 'Commission', type: 'ECN', minDeposit: 100, spreads: 'From 0.2 pips', commission: '$5 per 100k', bestFor: 'Volume Traders' },
        { name: 'Direct Market Access', type: 'ECN', minDeposit: 25000, spreads: 'Custom', commission: 'Custom', bestFor: 'Professionals' },
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [{ pair: 'EUR/USD', spread: '1.0 pips' }, { pair: 'GBP/USD', spread: '1.5 pips' }],
            commissionStructure: "Mainly spread-based. Commission accounts available.",
            overnightSwapFees: "Relatively high."
        },
        nonTrading: { inactivityFee: "$15 per month after 12 months", withdrawalFee: "None for cards, bank fees may apply", depositFee: "None" }
    },
    tradableInstruments: {
        forexPairs: { total: 80, details: "Majors, Minors, Exotics" },
        commodities: { total: 10, details: "Metals, Energies" },
        indices: { total: 15, details: "Global indices" },
        stocks: { total: 4500, details: "Global Stock CFDs" },
        cryptocurrencies: { total: 8, details: "Major cryptos" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
        depositMethods: ['Credit/Debit Card', 'Bank Transfer'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer'],
        depositFees: "None",
        withdrawalFees: "None",
        processingTime: { deposits: "1-2 days", withdrawals: "2-3 business days" },
        minWithdrawal: 100
    },
    customerSupport: { languages: ['English', 'Chinese'], channels: ['Phone', 'Email', 'Live Chat'], hours: '24/5' },
    security: {
        regulatedBy: [{ regulator: 'FCA' }, { regulator: 'NFA' }, { regulator: 'ASIC' }, { regulator: 'CIMA' }],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: "Up to £85,000 (FCA)" },
        twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 80, slippage: "Standard", requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop'], guaranteedStopLoss: { available: true } },
    platformFeatures: {
        charting: { indicators: 100, drawingTools: 50 },
        automatedTrading: ['EAs (MQL4)', 'API'],
        copyTrading: { available: false, platforms: [] },
        backtesting: true,
        newsIntegration: true
    },
    accountManagement: {
        islamicAccount: { available: false },
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2001, tradingVolumeDisclosed: false },
    
    // Legacy fields
    isIslamic: false,
    copyTrading: false,
    providesSignals: false,
    regulation: { regulators: ['FCA', 'NFA', 'ASIC', 'CIMA'] },
    ratings: { regulation: 9.9, costs: 7.8, platforms: 8.5, support: 8.2 },
    tradingConditions: {
      spreads: { eurusd: 1.0, gbpusd: 1.5, usdjpy: 1.2 },
      commission: 'Included in spread',
      swapFeeCategory: 'High',
      maxLeverage: '1:400',
      minLotSize: 0.01,
    },
    accessibility: {
      minDeposit: 100,
      depositMethods: ['Credit Card', 'Debit Card', 'Bank Transfer'],
      withdrawalMethods: ['Credit Card', 'Bank Transfer'],
      customerSupport: ['24/5 Phone', 'Email'],
    },
    technology: {
      platforms: ['MT4', 'Advanced Trading Platform', 'TradingView'],
      executionType: 'Market Maker',
      apiAccess: true,
      eaSupport: true,
    },
    reviews: [],
  },
  {
    id: 'ig',
    name: 'IG',
    logoUrl: '/broker-logos/ig.png',
    websiteUrl: 'https://www.ig.com/',
    score: 9.5,
    foundingYear: 1974,
    headquarters: 'The Leadenhall Building, 122 Leadenhall Street, London EC3V 4AB, UK',
    description: 'IG Group Holdings plc is a global leader in online trading, providing access to over 17,000 financial markets across 18+ countries. Listed on the London Stock Exchange (LSE: IGG) and serving 300,000+ active clients worldwide.',
    summary: "With an unparalleled range of tradable instruments and a 50-year history, IG is one of the most trusted and comprehensive brokers available. As a publicly-listed company with top-tier global regulation, it offers premium access to 17,000+ markets making it the definitive choice for serious traders.",
    pros: ["Publicly traded (LSE: IGG) with 50 years in business", "Massive range of 17,000+ tradable markets globally", "Award-winning proprietary trading platform with advanced tools", "Top-tier regulation: FCA, ASIC, CySEC, NFA, FSCA", "Comprehensive research and educational resources", "300,000+ active clients across 18+ countries"],
    cons: ["Higher minimum deposit (£250) than some competitors", "Platform complexity may overwhelm absolute beginners"],
    coreInfo: { brokerType: 'Market Maker', mobileTrading: true, demoAccount: true },
    fees: { trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '0.6 pips' }, { pair: 'GBP/USD', spread: '0.9 pips' }, { pair: 'USD/JPY', spread: '0.8 pips' }], commissionStructure: 'Spread-based for forex/CFDs, 0.10% commission on shares (min £10, max 1% of trade value)', overnightSwapFees: 'Competitive rates based on interbank + margin' }, nonTrading: { inactivityFee: '£12/month after 2 years of no activity', withdrawalFee: 'None', depositFee: 'None' } },
    tradableInstruments: { forexPairs: { total: 90, details: "90+ currency pairs including majors, minors, exotics" }, commodities: { total: 30, details: "Metals, energy, agricultural products" }, indices: { total: 40, details: "Global stock indices" }, stocks: { total: 16000, details: "16,000+ shares from 30+ exchanges globally" }, cryptocurrencies: { total: 15, details: "15+ major cryptocurrencies" } },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "75%" },
    depositWithdrawal: { depositMethods: ['Credit Card', 'Bank Transfer', 'PayPal'], withdrawalMethods: ['Credit Card', 'Bank Transfer', 'PayPal'], depositFees: 'None', withdrawalFees: 'None', processingTime: { deposits: 'Instant', withdrawals: '1-3 days' }, minWithdrawal: 1 },
    customerSupport: { languages: ['English', 'German', 'French', 'Spanish', 'Italian'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: { regulatedBy: [{ regulator: 'FCA', licenseNumber: '195355' }, { regulator: 'ASIC', licenseNumber: '515106' }, { regulator: 'CySEC', licenseNumber: '207/13' }, { regulator: 'NFA', licenseNumber: '0408077' }, { regulator: 'FSCA', licenseNumber: '41936' }], segregatedAccounts: true, investorCompensationScheme: { available: true, amount: '£85,000' }, twoFactorAuth: true },
    tradingEnvironment: { executionSpeedMs: 60, slippage: 'Low', requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop', 'GSLO'], guaranteedStopLoss: { available: true, cost: "Premium on spread" } },
    platformFeatures: {
        charting: { indicators: 100, drawingTools: 50 },
        automatedTrading: ['EAs (MT4)', 'ProRealTime', 'API'],
        copyTrading: { available: true, platforms: ['Built-in Signals'] },
        backtesting: true,
        newsIntegration: true
    },
    accountManagement: {
        islamicAccount: { available: true },
        baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'SGD'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 1974, tradingVolumeDisclosed: true },
    regulation: { regulators: ['FCA', 'ASIC', 'CySEC', 'NFA', 'FSCA'] },
    ratings: { regulation: 9.9, costs: 8.2, platforms: 9.3, support: 9.0 },
    tradingConditions: { spreads: { eurusd: 0.6, gbpusd: 0.9, usdjpy: 0.7 }, commission: 'Included in spread', swapFeeCategory: 'Standard', maxLeverage: '1:200', minLotSize: 0.01 },
    accessibility: { minDeposit: 250, depositMethods: ['Credit Card', 'Bank Transfer', 'PayPal'], withdrawalMethods: ['Credit Card', 'Bank Transfer', 'PayPal'], customerSupport: ['24/5 Live Chat', 'Phone', 'Email'] },
    technology: { platforms: ['IG Trading Platform (Web & Mobile)', 'ProRealTime', 'MT4', 'RESTful API'], executionType: 'Market Maker', apiAccess: true, eaSupport: true },
    reviews: [],
    isIslamic: true,
    copyTrading: true,
    providesSignals: true
  },
   {
    id: 'saxo-bank',
    name: 'Saxo Bank',
    logoUrl: '/broker-logos/saxo-bank.png',
    websiteUrl: 'https://www.home.saxo/',
    score: 9.4,
    foundingYear: 1992,
    headquarters: 'Philip Heymans Allé 15, 2900 Hellerup, Denmark',
    description: 'Saxo Bank A/S is a fully licensed Danish investment bank offering premium trading across 71,000+ instruments. Serving 1M+ clients in 180+ countries with $90B+ client assets under management.',
    summary: "Saxo Bank is the premium choice for serious investors, functioning as a fully licensed Danish bank with comprehensive global reach. It offers an incredible range of 71,000+ instruments on its world-class SaxoTraderGO and SaxoTraderPRO platforms, making it the definitive choice for professionals who demand institutional-grade technology and complete market access.",
    pros: ["Licensed as a bank, offering top-tier security", "Massive product range (40,000+ instruments)", "Award-winning SaxoTraderPRO platform", "Excellent research and analysis tools", "Competitive pricing for active traders"],
    cons: ["High minimum deposit ($2,000)", "High inactivity and custody fees", "Platform can be overwhelming for beginners"],
    coreInfo: { brokerType: 'Hybrid', mobileTrading: true, demoAccount: true },
    fees: { trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '0.4 pips (Classic), 0.1 pips (Platinum)' }, { pair: 'GBP/USD', spread: '0.6 pips (Classic), 0.3 pips (Platinum)' }], commissionStructure: 'Account tiers: Classic, Platinum, VIP with decreasing costs. Stock commission from 0.08% (Denmark) to 0.10% (global)', overnightSwapFees: 'Competitive institutional rates' }, nonTrading: { inactivityFee: '$100 after 6 months of no activity', withdrawalFee: 'None for most markets', depositFee: 'None' } },
    tradableInstruments: { forexPairs: { total: 185, details: "185+ currency pairs (majors, minors, exotics)" }, commodities: { total: 19, details: "Futures, Options, Spot metals and energies" }, indices: { total: 29, details: "CFDs, Futures, Options on global indices" }, stocks: { total: 23500, details: "23,500+ stocks from 50+ exchanges" }, bonds: { total: 3000, details: "3,000+ government and corporate bonds" }, etfs: { total: 7000, details: "7,000+ exchange-traded funds" }, options: { total: 3300000, details: "3.3M+ listed options globally" }, cryptocurrencies: { total: 9, details: "Crypto ETPs" } },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: false, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: { depositMethods: ['Bank Transfer', 'Credit Card'], withdrawalMethods: ['Bank Transfer'], depositFees: 'None', withdrawalFees: 'None', processingTime: { deposits: '1-2 days', withdrawals: '1-3 days' }, minWithdrawal: 1 },
    customerSupport: { languages: ['English', 'Danish', 'German', 'French', 'Italian'], channels: ['Phone', 'Email'], hours: '24/5' },
    security: { regulatedBy: [{ regulator: 'DFSA', licenseNumber: 'Bank License' }, { regulator: 'FCA', licenseNumber: '551422' }, { regulator: 'ASIC', licenseNumber: '302670' }, { regulator: 'MAS', licenseNumber: 'CMS License' }, { regulator: 'FINMA', licenseNumber: 'Swiss License' }], segregatedAccounts: true, investorCompensationScheme: { available: true, amount: '€100,000' }, twoFactorAuth: true },
    tradingEnvironment: { executionSpeedMs: 90, slippage: 'Low', requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
        charting: { indicators: 50, drawingTools: 20 },
        automatedTrading: ['OpenAPI with extensive documentation', 'TradingView integration', 'AutoChartist integration'],
        copyTrading: { available: false, platforms: [] },
        backtesting: true,
        newsIntegration: true
    },
    accountManagement: {
        islamicAccount: { available: false },
        baseCurrencies: ['USD', 'EUR', 'GBP', 'CHF', 'AUD', 'JPY'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 1992, tradingVolumeDisclosed: true },
    regulation: { regulators: ['DFSA', 'FCA', 'ASIC', 'MAS', 'FINMA'] },
    ratings: { regulation: 9.8, costs: 7.5, platforms: 9.8, support: 9.2 },
    tradingConditions: { spreads: { eurusd: 0.7, gbpusd: 1.0, usdjpy: 0.8 }, commission: 'Varies', swapFeeCategory: 'Standard', maxLeverage: '1:100', minLotSize: 0.01 },
    accessibility: { minDeposit: 2000, depositMethods: ['Bank Transfer', 'Credit Card'], withdrawalMethods: ['Bank Transfer'], customerSupport: ['24/5 Phone', 'Email'] },
    technology: { platforms: ['SaxoTraderGO', 'SaxoTraderPRO'], executionType: 'Direct Market Access', apiAccess: true, eaSupport: false },
    reviews: [],
    isIslamic: false,
    copyTrading: false,
    providesSignals: true
  },
  {
    id: 'interactive-brokers',
    name: 'Interactive Brokers',
    logoUrl: '/broker-logos/interactive-brokers.png',
    websiteUrl: 'https://www.interactivebrokers.com/',
    score: 9.3,
    foundingYear: 1978,
    headquarters: 'Greenwich, Connecticut, USA',
    description: 'A top choice for professional and institutional traders, offering unparalleled market access, low costs, and sophisticated trading tools.',
    summary: "Interactive Brokers is the undisputed leader for professional and institutional traders. With direct access to an incredible number of global markets, rock-bottom commissions, and the highly sophisticated Trader Workstation (TWS) platform, it's built for serious performance.",
    pros: ["No minimum deposit required", "Strong regulatory oversight (SEC/FINRA/CFTC)", "Access to 150+ markets globally", "Extremely low costs for active traders", "Professional-grade API and tools", "Excellent for international diversification"],
    cons: ["TWS platform has steep learning curve", "Complex fee structure can be confusing", "Limited educational resources", "No cryptocurrency CFD trading", "Customer service can be slow", "Market data fees for real-time quotes"],
    coreInfo: { brokerType: 'ECN', mobileTrading: true, demoAccount: true },
    fees: { trading: { spreadType: 'Raw', averageSpreads: [{ pair: 'EUR/USD', spread: '0.2 pips' }], commissionStructure: '$0.002 per share (min $1.00)', overnightSwapFees: 'Very Low, based on benchmark rates' }, nonTrading: { inactivityFee: 'None', withdrawalFee: 'One free withdrawal per month', depositFee: 'None' } },
    tradableInstruments: { forexPairs: { total: 85, details: "Major and minor currency pairs via IDEALPRO" }, commodities: { total: 50, details: "Futures and options on commodities" }, indices: { total: 80, details: "Global equity indices" }, stocks: { total: 150000, details: "Stocks globally across 150+ markets" }, cryptocurrencies: { total: 0, details: "IB does not offer crypto CFDs" } },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: { depositMethods: ['Bank Transfer', 'ACH'], withdrawalMethods: ['Bank Transfer', 'ACH'], depositFees: 'None', withdrawalFees: 'One free per month, then fees apply', processingTime: { deposits: '1-3 days', withdrawals: '1-3 days' }, minWithdrawal: 0 },
    customerSupport: { languages: ['English', 'Chinese', 'Spanish', 'French', 'German'], channels: ['Phone', 'Email', 'Chat'], hours: '24/5' },
    security: { regulatedBy: [{ regulator: 'SEC', licenseNumber: 'SEC Registration' }, { regulator: 'FINRA', licenseNumber: 'Member FINRA' }, { regulator: 'CFTC', licenseNumber: 'CFTC Registration' }, { regulator: 'FCA', licenseNumber: 'FCA Authorization' }, { regulator: 'IIROC', licenseNumber: 'IIROC Member' }], segregatedAccounts: true, investorCompensationScheme: { available: true, amount: '$500,000 (SIPC)' }, twoFactorAuth: true },
    tradingEnvironment: { executionSpeedMs: 20, slippage: 'Low', requotes: false, marketDepth: true, orderTypes: ['All major types, plus complex algo orders'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
        charting: { indicators: 100, drawingTools: 50 },
        automatedTrading: ['API (REST, FIX)'],
        copyTrading: { available: false, platforms: [] },
        backtesting: true,
        newsIntegration: true
    },
    accountManagement: {
        islamicAccount: { available: false },
        baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY', 'CHF'],
        mamPammSupport: true,
        corporateAccounts: true
    },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 1978, tradingVolumeDisclosed: true },
    regulation: { regulators: ['SEC', 'FINRA', 'CFTC', 'FCA', 'IIROC'] },
    ratings: { regulation: 5.0, costs: 4.8, platforms: 4.5, support: 4.0 },
    tradingConditions: { spreads: { eurusd: 0.2, gbpusd: 0.5, usdjpy: 0.2 }, commission: '$0.002 per share (min $1.00)', swapFeeCategory: 'Low', maxLeverage: '1:50', minLotSize: 0.01 },
    accessibility: { minDeposit: 0, depositMethods: ['Bank Transfer'], withdrawalMethods: ['Bank Transfer'], customerSupport: ['Phone', 'Email', 'Chat'] },
    technology: { platforms: ['TWS (Trader Workstation)', 'IBKR Mobile', 'WebTrader', 'API'], executionType: 'DMA/STP', apiAccess: true, eaSupport: true },
    reviews: [],
    isIslamic: false,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'etoro',
    name: 'eToro',
    logoUrl: '/broker-logos/etoro.png',
    websiteUrl: 'https://www.etoro.com/',
    score: 8.9,
    foundingYear: 2007,
    headquarters: 'Tel Aviv, Israel & London, UK',
    description: "eToro is the world's leading social trading platform, offering a wide array of stocks, cryptocurrencies, and CFDs. It is well-regulated and known for its user-friendly interface.",
    summary: "eToro excels as the go-to platform for social and copy trading, making it ideal for beginners who want to learn from others. While its spreads aren't the tightest, its intuitive platform and massive community provide a unique and engaging trading experience.",
    pros: ["World's leading social/copy trading platform", "User-friendly and intuitive interface", "Regulated by FCA, ASIC, and CySEC", "Huge range of assets, including real stocks and crypto", "Zero commission on real stock trading"],
    cons: ["Spreads can be wider than competitors", "High non-trading fees (withdrawal, inactivity)", "Customer support can be slow"],
    coreInfo: { brokerType: 'Market Maker', mobileTrading: true, demoAccount: true },
    accountTypes: [{ name: 'Standard Account', type: 'Standard', minDeposit: 50, spreads: 'From 1.0 pip', commission: 'Zero', bestFor: 'Retail and Copy Traders' }],
    fees: {
        trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '1.0 pips' }], commissionStructure: 'Spread-based. Zero commission on stocks.', overnightSwapFees: 'Standard' },
        nonTrading: { inactivityFee: '$10/month after 12 months', withdrawalFee: '$5 on all withdrawals', depositFee: 'None' }
    },
    tradableInstruments: { forexPairs: { total: 49, details: "Majors, Minors" }, commodities: { total: 32, details: "Metals, Energies, Agriculture" }, indices: { total: 13, details: "Global indices" }, stocks: { total: 3000, details: "Real stocks and CFDs" }, cryptocurrencies: { total: 78, details: "Real crypto and CFDs" }, etfs: { total: 260, details: "Global ETFs" } },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: false, hedgingAllowed: false, eaAllowed: false, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
        depositMethods: ['Credit Card', 'Bank Transfer', 'PayPal', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Credit Card', 'Bank Transfer', 'PayPal', 'Skrill', 'Neteller'],
        depositFees: 'None', withdrawalFees: '$5', processingTime: { deposits: 'Instant', withdrawals: '2-5 days' }, minWithdrawal: 30
    },
    customerSupport: { languages: ['English', 'German', 'Spanish', 'French', 'Italian'], channels: ['Live Chat', 'Tickets'], hours: '24/5' },
    security: {
        regulatedBy: [{ regulator: 'FCA', licenseNumber: '583263' }, { regulator: 'ASIC', licenseNumber: '491139' }, { regulator: 'CySEC', licenseNumber: '109/10' }],
        segregatedAccounts: true, investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' }, twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 150, slippage: 'Standard', requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
        charting: { indicators: 67, drawingTools: 15 },
        automatedTrading: [], copyTrading: { available: true, platforms: ['CopyTrader (Built-in)'] }, backtesting: false, newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: true }, baseCurrencies: ['USD'], mamPammSupport: false, corporateAccounts: false },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2007, tradingVolumeDisclosed: false, clientBase: "30M+ registered users" },
    regulation: { regulators: ['FCA', 'ASIC', 'CySEC'] },
    ratings: { regulation: 9.0, costs: 7.5, platforms: 9.2, support: 8.0 },
    tradingConditions: { spreads: { eurusd: 1.0, gbpusd: 1.5, usdjpy: 1.2 }, commission: 'Included in spread', swapFeeCategory: 'High', maxLeverage: '1:400', minLotSize: 0.01 },
    accessibility: { minDeposit: 50, depositMethods: ['Credit Card', 'PayPal', 'Skrill'], withdrawalMethods: ['Credit Card', 'PayPal'], customerSupport: ['Live Chat'] },
    technology: { platforms: ['eToro Platform'], executionType: 'Market Maker', apiAccess: false, eaSupport: false },
    reviews: [], isIslamic: true, copyTrading: true, providesSignals: true,
    socialTrading: { popularityScore: 95, topTradersCount: 15000, platforms: ['CopyTrader', 'Popular Investor Program'] }
  },
  {
    id: 'plus500',
    name: 'Plus500',
    logoUrl: '/broker-logos/plus500.png',
    websiteUrl: 'https://www.plus500.com/',
    score: 8.4,
    foundingYear: 2008,
    headquarters: 'Haifa, Israel & London, UK',
    description: "Plus500 is a global CFD provider, listed on the London Stock Exchange. It offers a simple, user-friendly platform with a wide range of tradable instruments.",
    summary: "Plus500 provides a streamlined and easy-to-use trading platform focused exclusively on CFDs. It's a great option for traders who value simplicity and a massive range of markets, backed by the security of a publicly-traded company.",
    pros: ["Publicly-listed company (LSE)", "Regulated by FCA, ASIC, CySEC", "Intuitive and easy-to-use proprietary platform", "Guaranteed Stop-Loss Orders available", "Huge selection of CFD instruments"],
    cons: ["Only offers CFDs", "No MetaTrader platform support", "Limited research and educational tools", "Customer support lacks a phone option"],
    coreInfo: { brokerType: 'Market Maker', mobileTrading: true, demoAccount: true },
    accountTypes: [{ name: 'Standard', type: 'Standard', minDeposit: 100, spreads: 'From 0.6 pips', commission: 'Zero', bestFor: 'CFD Traders' }],
    fees: {
        trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '0.6 pips' }], commissionStructure: 'Spread-based', overnightSwapFees: 'Standard' },
        nonTrading: { inactivityFee: '$10/month after 3 months', withdrawalFee: 'None', depositFee: 'None' }
    },
    tradableInstruments: { forexPairs: { total: 60, details: "Major and minor pairs" }, commodities: { total: 25, details: "Energy, metals, agricultural" }, indices: { total: 40, details: "Global stock indices" }, stocks: { total: 2800, details: "Global stock CFDs" }, cryptocurrencies: { total: 20, details: "Major cryptocurrencies" }, etfs: { total: 80, details: "Popular ETF CFDs" } },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: false, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: { depositMethods: ['Credit Card', 'Bank Transfer', 'PayPal', 'Skrill'], withdrawalMethods: ['Credit Card', 'Bank Transfer', 'PayPal', 'Skrill'], depositFees: 'None', withdrawalFees: 'None', processingTime: { deposits: 'Instant', withdrawals: '1-3 days' }, minWithdrawal: 50 },
    customerSupport: { languages: ['English', 'German', 'Spanish'], channels: ['Live Chat', 'Email', 'WhatsApp'], hours: '24/7' },
    security: { regulatedBy: [{ regulator: 'FCA', licenseNumber: '509909' }, { regulator: 'ASIC', licenseNumber: '417727' }, { regulator: 'CySEC', licenseNumber: '250/14' }], segregatedAccounts: true, investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' }, twoFactorAuth: true },
    tradingEnvironment: { executionSpeedMs: 120, slippage: 'Standard', requotes: false, marketDepth: false, orderTypes: ['Market', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: true, cost: "Wider spread" } },
    platformFeatures: {
        charting: { indicators: 100, drawingTools: 20 },
        automatedTrading: [],
        copyTrading: { available: false, platforms: [] },
        backtesting: false,
        newsIntegration: false
    },
    accountManagement: {
        islamicAccount: { available: false },
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        mamPammSupport: false,
        corporateAccounts: false
    },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2008, tradingVolumeDisclosed: true, clientBase: "22M+ registered customers" },
    regulation: { regulators: ['FCA', 'ASIC', 'CySEC'] },
    ratings: { regulation: 9.0, costs: 8.0, platforms: 8.5, support: 8.3 },
    tradingConditions: { spreads: { eurusd: 0.6, gbpusd: 1.2, usdjpy: 0.9 }, commission: 'Included in spread', swapFeeCategory: 'Standard', maxLeverage: '1:30', minLotSize: 0.01 },
    accessibility: { minDeposit: 100, depositMethods: ['Credit Card', 'PayPal', 'Skrill'], withdrawalMethods: ['Credit Card', 'PayPal'], customerSupport: ['24/7 Live Chat', 'Email'] },
    technology: { platforms: ['Plus500 Platform'], executionType: 'Market Maker', apiAccess: false, eaSupport: false },
    reviews: [], isIslamic: false, copyTrading: false, providesSignals: false
  },
  {
    id: 'avatrade',
    name: 'AvaTrade',
    logoUrl: '/broker-logos/avatrade.webp',
    websiteUrl: 'https://www.avatrade.com/',
    score: 8.7,
    foundingYear: 2006,
    headquarters: 'Dublin, Ireland',
    description: "AvaTrade is a highly-regulated global broker known for its extensive range of trading platforms, including its proprietary AvaTradeGo app, and its comprehensive educational resources.",
    summary: "AvaTrade is a solid all-round broker, particularly strong for its fixed spread options and excellent platform variety, including its own user-friendly AvaTradeGo app. With regulation across multiple continents, it offers a secure environment for traders of all levels.",
    pros: ["Highly regulated across 6 continents", "Offers fixed spreads, which is rare", "Excellent selection of trading platforms (MT4/MT5, AvaTradeGo, AvaOptions)", "Strong focus on education and research", "Comprehensive risk management tools with AvaProtect"],
    cons: ["Spreads are not the lowest in the industry", "High inactivity fee", "Withdrawal process can be slow"],
    coreInfo: { brokerType: 'Market Maker', mobileTrading: true, demoAccount: true },
    accountTypes: [{ name: 'Retail Account', type: 'Standard', minDeposit: 100, spreads: 'Fixed from 0.9 pips', commission: 'Zero', bestFor: 'Traders who prefer predictable costs' }],
    fees: {
        trading: { spreadType: 'Fixed', averageSpreads: [{ pair: 'EUR/USD', spread: '0.9 pips' }], commissionStructure: 'Included in spread', overnightSwapFees: 'Standard' },
        nonTrading: { inactivityFee: '$50 per quarter after 3 months of inactivity', withdrawalFee: 'None', depositFee: 'None' }
    },
    tradableInstruments: { forexPairs: { total: 55, details: "Majors, Minors, Exotics" }, commodities: { total: 17, details: "Metals, Energies" }, indices: { total: 20, details: "Global indices" }, stocks: { total: 600, details: "Global stocks" }, cryptocurrencies: { total: 14, details: "Major cryptos" } },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: { depositMethods: ['Credit Card', 'Bank Transfer', 'Skrill', 'Neteller'], withdrawalMethods: ['Credit Card', 'Bank Transfer', 'Skrill', 'Neteller'], depositFees: 'None', withdrawalFees: 'None', processingTime: { deposits: 'Instant', withdrawals: '1-5 days' }, minWithdrawal: 100 },
    customerSupport: { languages: ['English', 'Spanish', 'French', 'German', 'Italian', 'Arabic'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: { regulatedBy: [{ regulator: 'Central Bank of Ireland' }, { regulator: 'ASIC' }, { regulator: 'FSA (Japan)' }, { regulator: 'FSCA (South Africa)' }], segregatedAccounts: true, investorCompensationScheme: { available: true, amount: 'Up to €20,000 (ICCL)' }, twoFactorAuth: false },
    tradingEnvironment: { executionSpeedMs: 130, slippage: 'Standard', requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
        charting: { indicators: 90, drawingTools: 40 },
        automatedTrading: ['EAs (MT4/5)', 'DupliTrade', 'ZuluTrade'],
        copyTrading: { available: true, platforms: ['DupliTrade', 'ZuluTrade'] },
        backtesting: true,
        newsIntegration: true
    },
    accountManagement: {
        islamicAccount: { available: true },
        baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD'],
        mamPammSupport: true,
        corporateAccounts: true
    },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2006, tradingVolumeDisclosed: false },
    regulation: { regulators: ['CBI', 'ASIC', 'FSA', 'FSCA'] },
    ratings: { regulation: 9.3, costs: 8.0, platforms: 8.8, support: 8.5 },
    tradingConditions: { spreads: { eurusd: 0.9, gbpusd: 1.5, usdjpy: 1.1 }, commission: 'Included in spread', swapFeeCategory: 'Standard', maxLeverage: '1:400', minLotSize: 0.01 },
    accessibility: { minDeposit: 100, depositMethods: ['Credit Card', 'Skrill', 'Neteller'], withdrawalMethods: ['Credit Card', 'Skrill'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['MT4', 'MT5', 'AvaTradeGo', 'AvaOptions'], executionType: 'Market Maker', apiAccess: true, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: true, providesSignals: true
  },
  {
    id: 'oanda',
    name: 'OANDA',
    logoUrl: '/broker-logos/oanda.png',
    websiteUrl: 'https://www.oanda.com/',
    score: 8.6,
    foundingYear: 1996,
    headquarters: 'New York, USA',
    description: "OANDA is a pioneering online broker with a long history of trust and innovation. It's well-regulated in the US and offers a powerful proprietary platform with excellent research tools.",
    summary: "OANDA is a highly trusted and long-standing broker, especially for US-based traders. It stands out with its powerful proprietary platform (fxTrade) which integrates excellent research and analysis tools. While its pricing is competitive, it truly shines for traders who value platform quality and deep market analysis.",
    pros: ["Long track record and highly trusted brand", "Regulated in top-tier jurisdictions, including the US (NFA)", "Excellent proprietary trading platform (fxTrade)", "Advanced research tools and APIs (REST, FIX)", "Transparent pricing with no minimum deposit"],
    cons: ["Limited number of stock CFDs compared to peers", "Customer support is not 24/7", "Does not offer MT5"],
    coreInfo: { brokerType: 'Market Maker', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'Standard', type: 'Standard', minDeposit: 0, spreads: 'From 0.6 pips', commission: 'Zero', bestFor: 'All Traders' },
      { name: 'Core', type: 'ECN', minDeposit: 0, spreads: 'From 0.1 pips', commission: '$3.5 per lot', bestFor: 'Active Traders' }
    ],
    fees: {
        trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '0.6 pips' }], commissionStructure: 'Spread-based, with commission option available', overnightSwapFees: 'Standard, transparently displayed' },
        nonTrading: { inactivityFee: '$10/month after 12 months', withdrawalFee: 'One free bank withdrawal per month', depositFee: 'None' }
    },
    tradableInstruments: { forexPairs: { total: 70, details: "Majors, Minors" }, commodities: { total: 8, details: "Metals, Energies" }, indices: { total: 10, details: "Global indices" }, stocks: { total: 50, details: "Limited selection of stock CFDs" }, cryptocurrencies: { total: 4, details: "BTC, ETH, LTC, PAXG" } },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: { depositMethods: ['Credit Card', 'Bank Transfer', 'PayPal'], withdrawalMethods: ['Credit Card', 'Bank Transfer', 'PayPal'], depositFees: 'None', withdrawalFees: 'One free per month', processingTime: { deposits: 'Instant', withdrawals: '1-3 days' }, minWithdrawal: 1 },
    customerSupport: { languages: ['English', 'Chinese', 'German'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: { regulatedBy: [{ regulator: 'NFA', licenseNumber: '0325821' }, { regulator: 'FCA' }, { regulator: 'ASIC' }], segregatedAccounts: true, investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' }, twoFactorAuth: true },
    tradingEnvironment: { executionSpeedMs: 70, slippage: 'Low', requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
        charting: { indicators: 100, drawingTools: 50 },
        automatedTrading: ['EAs (MT4)', 'API'],
        copyTrading: { available: false, platforms: [] },
        backtesting: true,
        newsIntegration: true
    },
    accountManagement: {
        islamicAccount: { available: false },
        baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'JPY'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 1996, tradingVolumeDisclosed: false },
    regulation: { regulators: ['NFA', 'FCA', 'ASIC'] },
    ratings: { regulation: 9.5, costs: 8.4, platforms: 9.0, support: 8.0 },
    tradingConditions: { spreads: { eurusd: 0.6, gbpusd: 0.9, usdjpy: 0.7 }, commission: 'Included in spread', swapFeeCategory: 'Standard', maxLeverage: '1:200', minLotSize: 0.01 },
    accessibility: { minDeposit: 0, depositMethods: ['Credit Card', 'PayPal'], withdrawalMethods: ['Credit Card', 'PayPal'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['fxTrade', 'MT4', 'TradingView'], executionType: 'Market Maker', apiAccess: true, eaSupport: true },
    reviews: [], isIslamic: false, copyTrading: false, providesSignals: true
  },
  {
    id: 'fxpro',
    name: 'FxPro',
    logoUrl: '/broker-logos/fxpro.png',
    websiteUrl: 'https://www.fxpro.com/',
    score: 8.8,
    foundingYear: 2006,
    headquarters: 'London, UK',
    description: 'FxPro is a well-regulated broker offering a wide range of platforms and account types, known for its NDD (No Dealing Desk) execution model and professional trading conditions.',
    summary: 'FxPro is an excellent choice for traders seeking a professional environment with a variety of platforms like MT4, MT5, and cTrader. Its No Dealing Desk execution model ensures transparency and fast execution, making it suitable for both discretionary and algorithmic traders.',
    pros: ["Regulated by top-tier authorities (FCA, CySEC)", "No Dealing Desk (NDD) execution model", "Wide selection of platforms (MT4, MT5, cTrader, FxPro Edge)", "Negative balance protection for all clients", "Deep liquidity and fast execution"],
    cons: ["Spreads are average on standard accounts", "Limited educational material", "Inactivity fee is charged"],
    coreInfo: { brokerType: 'NDD', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'FxPro MT4', type: 'NDD', minDeposit: 100, spreads: 'From 1.2 pips', commission: 'Zero', bestFor: 'Standard MT4 traders' },
      { name: 'FxPro MT5', type: 'NDD', minDeposit: 100, spreads: 'From 1.2 pips', commission: 'Zero', bestFor: 'Modern MT5 traders' },
      { name: 'FxPro cTrader', type: 'ECN', minDeposit: 100, spreads: 'From 0.0 pips', commission: '$4.5 per lot side', bestFor: 'Scalpers' },
    ],
    fees: {
      trading: {
        spreadType: 'Variable',
        averageSpreads: [{ pair: 'EUR/USD', spread: '0.3 pips + commission (cTrader)' }],
        commissionStructure: "Varies by platform. cTrader is commission-based.",
        overnightSwapFees: "Standard"
      },
      nonTrading: {
        inactivityFee: "$15 after 6 months of inactivity",
        withdrawalFee: "None for most methods",
        depositFee: "None"
      }
    },
    tradableInstruments: {
      forexPairs: { total: 70, details: "Majors, Minors, Exotics" },
      commodities: { total: 15, details: "Metals, Energies" },
      indices: { total: 24, details: "Global indices" },
      stocks: { total: 150, details: "Popular US, UK, EU stocks" },
      cryptocurrencies: { total: 30, details: "Wide range of crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "50%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'PayPal', 'Skrill', 'Neteller'],
      withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'PayPal', 'Skrill', 'Neteller'],
      depositFees: "None",
      withdrawalFees: "None",
      processingTime: { deposits: 'Instant', withdrawals: '1 business day' },
      minWithdrawal: 100
    },
    customerSupport: { languages: ['English', 'Spanish', 'Chinese', 'Arabic', 'Russian'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'FCA', licenseNumber: '509956' }, { regulator: 'CySEC', licenseNumber: '078/07' }, { regulator: 'FSCA' }, { regulator: 'SCB' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to €20,000 (ICF)' },
      twoFactorAuth: false
    },
    tradingEnvironment: { executionSpeedMs: 14, slippage: "Low", requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 50, drawingTools: 30 },
      automatedTrading: ['EAs', 'cAlgo'],
      copyTrading: { available: false, platforms: [] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: {
      islamicAccount: { available: true },
      baseCurrencies: ['USD', 'EUR', 'GBP', 'CHF', 'AUD', 'PLN', 'JPY'],
      mamPammSupport: true,
      corporateAccounts: true
    },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2006, tradingVolumeDisclosed: false, clientBase: "1.3M+ clients" },
    regulation: { regulators: ['FCA', 'CySEC', 'FSCA', 'SCB'] },
    ratings: { regulation: 9.2, costs: 8.5, platforms: 9.0, support: 8.8 },
    tradingConditions: { spreads: { eurusd: 1.2, gbpusd: 1.5, usdjpy: 1.4 }, commission: 'Varies', swapFeeCategory: 'Standard', maxLeverage: '1:500', minLotSize: 0.01 },
    accessibility: { minDeposit: 100, depositMethods: ['Credit Card', 'PayPal', 'Skrill'], withdrawalMethods: ['Credit Card', 'PayPal', 'Skrill'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['MT4', 'MT5', 'cTrader', 'FxPro Edge'], executionType: 'NDD', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: false, providesSignals: false
  },
  {
    id: 'axi',
    name: 'Axi',
    logoUrl: '/broker-logos/axi.png',
    websiteUrl: 'https://www.axi.com/',
    score: 8.7,
    foundingYear: 2007,
    headquarters: 'Sydney, Australia',
    description: 'Axi (formerly AxiTrader) is an Australian broker trusted by traders for its excellent customer service, competitive pricing, and strong regulatory oversight.',
    summary: 'Axi is a highly-trusted Australian broker that shines for its excellent customer service and competitive pricing, especially on its Pro account. While its range of markets is more limited than some rivals, it offers a solid and reliable MT4-focused experience.',
    pros: ["Regulated by top-tier ASIC and FCA", "Competitive spreads on Pro accounts", "Award-winning customer service", "No minimum deposit requirement", "Excellent MT4 add-ons (PsyQuation)"],
    cons: ["Limited range of tradable instruments", "Primarily focused on the MT4 platform", "No investor protection for non-UK clients"],
    coreInfo: { brokerType: 'STP', mobileTrading: true, demoAccount: true },
    accountTypes: [
        { name: 'Standard Account', type: 'STP', minDeposit: 0, spreads: 'From 0.9 pips', commission: 'Zero', bestFor: 'Beginners' },
        { name: 'Pro Account', type: 'ECN', minDeposit: 0, spreads: 'From 0.0 pips', commission: '$3.50 per lot side', bestFor: 'Active traders' },
    ],
    fees: {
      trading: {
        spreadType: 'Variable',
        averageSpreads: [{ pair: 'EUR/USD', spread: '0.1 pips + commission (Pro)' }],
        commissionStructure: "$3.50 per side on Pro Account",
        overnightSwapFees: "Standard"
      },
      nonTrading: {
        inactivityFee: "None",
        withdrawalFee: "None",
        depositFee: "None"
      }
    },
    tradableInstruments: {
      forexPairs: { total: 70, details: "Majors, Minors, Exotics" },
      commodities: { total: 11, details: "Metals, Energies" },
      indices: { total: 11, details: "Global indices" },
      stocks: { total: 50, details: "US, UK, HK stock CFDs" },
      cryptocurrencies: { total: 30, details: "Wide range of crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Neteller', 'Skrill'],
      withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Neteller'],
      depositFees: "None",
      withdrawalFees: "None",
      processingTime: { deposits: 'Instant', withdrawals: '1-2 business days' },
      minWithdrawal: 5
    },
    customerSupport: { languages: ['English', 'Chinese', 'Spanish', 'German', 'Italian'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'ASIC', licenseNumber: '318232' }, { regulator: 'FCA', licenseNumber: '509746' }, { regulator: 'DFSA' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
      twoFactorAuth: false
    },
    tradingEnvironment: { executionSpeedMs: 90, slippage: "Low", requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 50, drawingTools: 30 },
      automatedTrading: ['EAs'],
      copyTrading: { available: true, platforms: ['Axi Copy Trading'] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: {
      islamicAccount: { available: true },
      baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'CHF', 'JPY', 'NZD', 'SGD', 'HKD'],
      mamPammSupport: true,
      corporateAccounts: true
    },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2007, tradingVolumeDisclosed: false, clientBase: "60,000+ clients" },
    regulation: { regulators: ['ASIC', 'FCA', 'DFSA'] },
    ratings: { regulation: 9.0, costs: 8.8, platforms: 8.0, support: 9.2 },
    tradingConditions: { spreads: { eurusd: 1.2, gbpusd: 1.6, usdjpy: 1.4 }, commission: '$3.50 on Pro', swapFeeCategory: 'Standard', maxLeverage: '1:500', minLotSize: 0.01 },
    accessibility: { minDeposit: 0, depositMethods: ['Credit Card', 'Bank Transfer', 'Skrill'], withdrawalMethods: ['Credit Card', 'Bank Transfer'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['MT4'], executionType: 'STP', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: true, providesSignals: true
  },
  {
    id: 'fp-markets',
    name: 'FP Markets',
    logoUrl: '/broker-logos/fp-markets.webp',
    websiteUrl: 'https://www.fpmarkets.com/',
    score: 8.9,
    foundingYear: 2005,
    headquarters: 'Sydney, Australia',
    description: 'FP Markets is an Australian-regulated broker offering consistently tight raw spreads and a broad range of tradable instruments across multiple platforms.',
    summary: 'FP Markets is an excellent all-round choice, combining the strong regulation of an Australian broker with very competitive ECN pricing. It provides a great selection of platforms and a wide array of assets, making it suitable for almost any trading style.',
    pros: ["Regulated by ASIC and CySEC", "Very tight spreads from 0.0 pips on Raw account", "Wide range of platforms (MT4, MT5, cTrader, Iress)", "Broad selection of tradable assets", "Excellent customer support"],
    cons: ["Iress platform has high minimum deposit and data fees", "Educational resources are average"],
    coreInfo: { brokerType: 'ECN', mobileTrading: true, demoAccount: true },
    accountTypes: [
        { name: 'Standard', type: 'STP', minDeposit: 100, spreads: 'From 1.0 pip', commission: 'Zero' , bestFor: 'Beginners'},
        { name: 'Raw', type: 'ECN', minDeposit: 100, spreads: 'From 0.0 pips', commission: '$3.00 per lot side', bestFor: 'Active traders' },
    ],
    fees: {
      trading: {
        spreadType: 'Raw',
        averageSpreads: [{ pair: 'EUR/USD', spread: '0.1 pips + commission' }],
        commissionStructure: "$3.00 per side on Raw account",
        overnightSwapFees: "Standard"
      },
      nonTrading: {
        inactivityFee: "None",
        withdrawalFee: "None from FP Markets, bank fees may apply",
        depositFee: "None"
      }
    },
    tradableInstruments: {
      forexPairs: { total: 60, details: "Majors, Minors, Exotics" },
      commodities: { total: 9, details: "Metals, Energies, Agriculture" },
      indices: { total: 14, details: "Global indices" },
      stocks: { total: 800, details: "Global stock CFDs" },
      cryptocurrencies: { total: 11, details: "Major crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Neteller', 'Skrill', 'PayPal'],
      withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Neteller', 'Skrill', 'PayPal'],
      depositFees: "None",
      withdrawalFees: "None",
      processingTime: { deposits: 'Instant', withdrawals: '1-2 business days' },
      minWithdrawal: 5
    },
    customerSupport: { languages: ['English', 'Chinese', 'Spanish', 'Russian', 'Arabic'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/7' },
    security: {
      regulatedBy: [{ regulator: 'ASIC', licenseNumber: '286354' }, { regulator: 'CySEC', licenseNumber: '371/18' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to €20,000 (CySEC)' },
      twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 45, slippage: "Low", requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 50, drawingTools: 30 },
      automatedTrading: ['EAs', 'cAlgo'],
      copyTrading: { available: true, platforms: ['Myfxbook', 'FP Markets Copy Trading'] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: {
      islamicAccount: { available: true },
      baseCurrencies: ['AUD', 'USD', 'EUR', 'GBP', 'SGD', 'HKD', 'JPY', 'NZD', 'CHF', 'CAD'],
      mamPammSupport: true,
      corporateAccounts: true
    },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2005, tradingVolumeDisclosed: false },
    regulation: { regulators: ['ASIC', 'CySEC'] },
    ratings: { regulation: 9.0, costs: 9.2, platforms: 8.8, support: 9.0 },
    tradingConditions: { spreads: { eurusd: 1.2, gbpusd: 1.5, usdjpy: 1.3 }, commission: '$3.00 on Raw', swapFeeCategory: 'Standard', maxLeverage: '1:500', minLotSize: 0.01 },
    accessibility: { minDeposit: 100, depositMethods: ['Credit Card', 'Bank Transfer', 'PayPal'], withdrawalMethods: ['Credit Card', 'Bank Transfer', 'PayPal'], customerSupport: ['24/7 Live Chat', 'Phone'] },
    technology: { platforms: ['MT4', 'MT5', 'cTrader', 'Iress'], executionType: 'ECN', apiAccess: true, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: true, providesSignals: false
  },
  {
    id: 'cmc-markets',
    name: 'CMC Markets',
    logoUrl: 'https://www.cmcmarkets.com/logo-cmc-markets.svg',
    websiteUrl: 'https://www.cmcmarkets.com/',
    score: 9.1,
    foundingYear: 1989,
    headquarters: 'London, UK',
    description: 'A globally recognized, UK-based broker, CMC Markets is publicly listed and offers an extensive range of instruments on its award-winning "Next Generation" platform.',
    summary: 'CMC Markets is a top-tier broker for traders who prioritize platform technology and a vast range of markets. Its "Next Generation" platform is packed with innovative tools, and as a publicly-traded company with a long history, it offers a very high level of trust.',
    pros: ["Publicly traded (LSE) and highly regulated (FCA, ASIC, BaFin)", "Award-winning 'Next Generation' trading platform", "Massive range of 12,000+ tradable instruments", "Excellent research tools and market analysis", "Guaranteed stop-loss orders"],
    cons: ["Complex fee structure for some assets", "Customer service can be inconsistent"],
    coreInfo: { brokerType: 'Market Maker', mobileTrading: true, demoAccount: true },
    accountTypes: [{ name: 'CFD Account', type: 'Standard', minDeposit: 0, spreads: 'From 0.7 pips', commission: 'Zero on FX', bestFor: 'All traders' }],
    fees: {
      trading: {
        spreadType: 'Variable',
        averageSpreads: [{ pair: 'EUR/USD', spread: '0.7 pips' }],
        commissionStructure: "Spread-based on most instruments, commission on shares",
        overnightSwapFees: "Standard"
      },
      nonTrading: {
        inactivityFee: "£10 per month after 12 months",
        withdrawalFee: "None",
        depositFee: "None"
      }
    },
    tradableInstruments: {
      forexPairs: { total: 330, details: "Largest selection in the industry" },
      commodities: { total: 100, details: "Metals, Energies, Agriculture" },
      indices: { total: 80, details: "Global indices and thematic baskets" },
      stocks: { total: 9400, details: "Global stock CFDs" },
      cryptocurrencies: { total: 15, details: "Major cryptos and indices" },
      etfs: { total: 1000, details: "Global ETFs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'PayPal'],
      withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'PayPal'],
      depositFees: "None",
      withdrawalFees: "None",
      processingTime: { deposits: 'Instant', withdrawals: '1-3 days' },
      minWithdrawal: 0
    },
    customerSupport: { languages: ['English', 'German', 'Spanish', 'French'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'FCA', licenseNumber: '173730' }, { regulator: 'ASIC' }, { regulator: 'BaFin' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FSCS)' },
      twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 75, slippage: "Low", requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop', 'GSLO'], guaranteedStopLoss: { available: true, cost: "Premium on spread" } },
    platformFeatures: {
      charting: { indicators: 115, drawingTools: 70 },
      automatedTrading: ['EAs (MT4)'],
      copyTrading: { available: false, platforms: [] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: {
      islamicAccount: { available: false },
      baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD', 'NZD', 'NOK', 'PLN', 'SEK'],
      mamPammSupport: false,
      corporateAccounts: true
    },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 1989, tradingVolumeDisclosed: true },
    regulation: { regulators: ['FCA', 'ASIC', 'BaFin'] },
    ratings: { regulation: 9.8, costs: 8.8, platforms: 9.6, support: 8.5 },
    tradingConditions: { spreads: { eurusd: 0.7, gbpusd: 0.9, usdjpy: 0.7 }, commission: 'Varies', swapFeeCategory: 'Standard', maxLeverage: '1:500', minLotSize: 0.01 },
    accessibility: { minDeposit: 0, depositMethods: ['Credit Card', 'Bank Transfer', 'PayPal'], withdrawalMethods: ['Credit Card', 'Bank Transfer', 'PayPal'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['Next Generation', 'MT4'], executionType: 'Market Maker', apiAccess: true, eaSupport: true },
    reviews: [], isIslamic: false, copyTrading: false, providesSignals: true
  },
  {
    id: 'admirals',
    name: 'Admirals',
    logoUrl: '/broker-logos/admirals.png',
    websiteUrl: 'https://admiralmarkets.com/',
    score: 8.5,
    foundingYear: 2001,
    headquarters: 'Tallinn, Estonia',
    description: 'Admirals (formerly Admiral Markets) is a well-established MT4/MT5 broker with strong regulation and a focus on providing excellent educational content and market analysis.',
    summary: 'Admirals is a strong contender for MetaTrader enthusiasts, offering the powerful "MetaTrader Supreme Edition" plugin. With a long track record and a heavy focus on education and analytics, it\'s a great choice for traders who want to grow their skills.',
    pros: ["Regulated by FCA, ASIC, and CySEC", "Enhanced MetaTrader Supreme Edition plugin", "Extensive educational resources and analytics", "Wide range of instruments", "Negative balance protection"],
    cons: ["Spreads are not the lowest available", "Customer support is not 24/7"],
    coreInfo: { brokerType: 'STP', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'Trade.MT5', type: 'STP', minDeposit: 25, spreads: 'From 0.5 pips', commission: 'Zero', bestFor: 'Standard traders' },
      { name: 'Zero.MT5', type: 'ECN', minDeposit: 25, spreads: 'From 0.0 pips', commission: '$1.8 - $3.0 per lot side', bestFor: 'Active traders' },
    ],
    fees: {
      trading: {
        spreadType: 'Variable',
        averageSpreads: [{ pair: 'EUR/USD', spread: '0.1 pips + commission (Zero)' }],
        commissionStructure: "Varies by account type",
        overnightSwapFees: "Standard"
      },
      nonTrading: {
        inactivityFee: "€10 per month after 24 months",
        withdrawalFee: "Two free bank withdrawals per month",
        depositFee: "None"
      }
    },
    tradableInstruments: {
      forexPairs: { total: 45, details: "Majors, Minors, Exotics" },
      commodities: { total: 28, details: "Metals, Energies, Agriculture" },
      indices: { total: 43, details: "Global indices and futures" },
      stocks: { total: 3350, details: "Global stock CFDs" },
      cryptocurrencies: { total: 32, details: "Crypto CFDs" },
      etfs: { total: 300, details: "Global ETFs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
      withdrawalMethods: ['Bank Transfer', 'Skrill', 'Neteller'],
      depositFees: "None",
      withdrawalFees: "Some fees apply after free allowances",
      processingTime: { deposits: 'Instant', withdrawals: '1-3 days' },
      minWithdrawal: 1
    },
    customerSupport: { languages: ['English', 'German', 'Spanish', 'French'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'FCA', licenseNumber: '595450' }, { regulator: 'ASIC' }, { regulator: 'CySEC' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
      twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 150, slippage: "Standard", requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 60, drawingTools: 40 },
      automatedTrading: ['EAs'],
      copyTrading: { available: true, platforms: ['MetaTrader Signals'] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: {
      islamicAccount: { available: true },
      baseCurrencies: ['USD', 'EUR', 'GBP', 'CHF'],
      mamPammSupport: false,
      corporateAccounts: true
    },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2001, tradingVolumeDisclosed: false },
    regulation: { regulators: ['FCA', 'ASIC', 'CySEC'] },
    ratings: { regulation: 9.0, costs: 8.2, platforms: 8.8, support: 8.5 },
    tradingConditions: { spreads: { eurusd: 0.6, gbpusd: 0.8, usdjpy: 0.7 }, commission: 'Varies', swapFeeCategory: 'Standard', maxLeverage: '1:500', minLotSize: 0.01 },
    accessibility: { minDeposit: 25, depositMethods: ['Credit Card', 'Bank Transfer', 'Skrill'], withdrawalMethods: ['Bank Transfer'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['MT4', 'MT5', 'MetaTrader Supreme Edition'], executionType: 'STP', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: true, providesSignals: true
  },
  {
    id: 'tickmill',
    name: 'Tickmill',
    logoUrl: '/broker-logos/tickmill.png',
    websiteUrl: 'https://www.tickmill.com/',
    score: 8.8,
    foundingYear: 2014,
    headquarters: 'London, UK',
    description: 'Tickmill is a popular MetaTrader broker known for its very low commissions on Pro and VIP accounts, fast execution, and strong regulatory framework.',
    summary: 'Tickmill is a top choice for cost-conscious traders, especially those using EAs or scalping strategies. Its Pro and VIP accounts feature some of the lowest commissions in the industry, combined with tight spreads and a reliable NDD execution model.',
    pros: ["Very low commissions (as low as $1 per side on VIP)", "Regulated by the FCA and CySEC", "Fast execution speeds", "No fees on deposits and withdrawals", "Good for algorithmic traders"],
    cons: ["Limited range of tradable instruments", "Customer support is not 24/7"],
    coreInfo: { brokerType: 'ECN', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'Classic', type: 'STP', minDeposit: 100, spreads: 'From 1.6 pips', commission: 'Zero', bestFor: 'Beginners' },
      { name: 'Pro', type: 'ECN', minDeposit: 100, spreads: 'From 0.0 pips', commission: '$2 per lot side', bestFor: 'Active traders' },
      { name: 'VIP', type: 'ECN', minDeposit: 50000, spreads: 'From 0.0 pips', commission: '$1 per lot side', bestFor: 'High volume traders' },
    ],
    fees: {
      trading: {
        spreadType: 'Raw',
        averageSpreads: [{ pair: 'EUR/USD', spread: '0.1 pips + commission' }],
        commissionStructure: "As low as $1 per side on VIP account",
        overnightSwapFees: "Standard"
      },
      nonTrading: {
        inactivityFee: "None",
        withdrawalFee: "None",
        depositFee: "None"
      }
    },
    tradableInstruments: {
      forexPairs: { total: 62, details: "Majors, Minors, Exotics" },
      commodities: { total: 4, details: "Metals, Energies" },
      indices: { total: 14, details: "Global stock indices" },
      stocks: { total: 0, details: "Not available" },
      cryptocurrencies: { total: 8, details: "Major crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "30%" },
    depositWithdrawal: {
      depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
      withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
      depositFees: "None",
      withdrawalFees: "None",
      processingTime: { deposits: 'Instant', withdrawals: 'Within 1 working day' },
      minWithdrawal: 25
    },
    customerSupport: { languages: ['English', 'Russian', 'Chinese', 'Spanish'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'FCA', licenseNumber: '717270' }, { regulator: 'CySEC', licenseNumber: '278/15' }, { regulator: 'FSA' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
      twoFactorAuth: false
    },
    tradingEnvironment: { executionSpeedMs: 20, slippage: "Low", requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 50, drawingTools: 30 },
      automatedTrading: ['EAs'],
      copyTrading: { available: true, platforms: ['Myfxbook'] },
      backtesting: true,
      newsIntegration: false
    },
    accountManagement: {
      islamicAccount: { available: true },
      baseCurrencies: ['USD', 'EUR', 'GBP'],
      mamPammSupport: true,
      corporateAccounts: true
    },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2014, tradingVolumeDisclosed: false },
    regulation: { regulators: ['FCA', 'CySEC', 'FSA'] },
    ratings: { regulation: 9.0, costs: 9.4, platforms: 8.0, support: 8.5 },
    tradingConditions: { spreads: { eurusd: 0.1, gbpusd: 0.2, usdjpy: 0.1 }, commission: '$2.00 on Pro', swapFeeCategory: 'Standard', maxLeverage: '1:500', minLotSize: 0.01 },
    accessibility: { minDeposit: 100, depositMethods: ['Credit Card', 'Bank Transfer', 'Skrill'], withdrawalMethods: ['Credit Card', 'Bank Transfer'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['MT4', 'MT5'], executionType: 'ECN', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: true, providesSignals: false
  },
  {
    id: 'swissquote',
    name: 'Swissquote',
    logoUrl: '/broker-logos/swissquote.png',
    websiteUrl: 'https://www.swissquote.com/',
    score: 9.0,
    foundingYear: 1996,
    headquarters: 'Gland, Switzerland',
    description: 'Swissquote is a leading Swiss bank offering online financial services, providing top-tier security, a wide range of markets, and advanced trading platforms.',
    summary: 'As a publicly-listed Swiss bank, Swissquote offers the highest level of security and trust. It provides access to a vast range of markets on its powerful proprietary platform, making it a top choice for well-capitalized traders who prioritize safety above all.',
    pros: ["Publicly-listed Swiss bank (SIX: SQN)", "Highly regulated by FINMA (Switzerland)", "Excellent security and deposit protection", "Wide range of markets and financial products", "Powerful Advanced Trader platform"],
    cons: ["High minimum deposit ($1,000)", "Trading costs are higher than average", "Customer support could be improved"],
    coreInfo: { brokerType: 'STP', mobileTrading: true, demoAccount: true },
    accountTypes: [{ name: 'Standard', type: 'STP', minDeposit: 1000, spreads: 'From 1.7 pips', commission: 'Zero', bestFor: 'Security-conscious traders' }],
    fees: {
      trading: {
        spreadType: 'Variable',
        averageSpreads: [{ pair: 'EUR/USD', spread: '1.7 pips' }],
        commissionStructure: "Spread-based, with active trader discounts",
        overnightSwapFees: "Standard"
      },
      nonTrading: {
        inactivityFee: "None",
        withdrawalFee: "Fees apply for bank transfers",
        depositFee: "None"
      }
    },
    tradableInstruments: {
      forexPairs: { total: 130, details: "Majors, Minors, Exotics" },
      commodities: { total: 25, details: "Metals, Energies, Softs" },
      indices: { total: 26, details: "Global indices" },
      stocks: { total: 460, details: "Global stock CFDs" },
      cryptocurrencies: { total: 24, details: "Crypto CFDs and ETPs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Bank Transfer', 'Credit/Debit Card'],
      withdrawalMethods: ['Bank Transfer'],
      depositFees: "None",
      withdrawalFees: "Yes, varies",
      processingTime: { deposits: '1-3 days', withdrawals: '1-3 days' },
      minWithdrawal: 10
    },
    customerSupport: { languages: ['English', 'German', 'French', 'Italian'], channels: ['Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'FINMA', licenseNumber: 'Swiss Banking License' }, { regulator: 'FCA' }, { regulator: 'DFSA' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to CHF 100,000' },
      twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 120, slippage: "Standard", requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 80, drawingTools: 40 },
      automatedTrading: ['EAs (MT4/5)'],
      copyTrading: { available: true, platforms: ['MetaTrader Signals'] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: {
      islamicAccount: { available: false },
      baseCurrencies: ['USD', 'EUR', 'GBP', 'CHF', 'JPY'],
      mamPammSupport: false,
      corporateAccounts: true
    },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 1996, tradingVolumeDisclosed: true },
    regulation: { regulators: ['FINMA', 'FCA', 'DFSA'] },
    ratings: { regulation: 9.9, costs: 7.0, platforms: 9.0, support: 8.2 },
    tradingConditions: { spreads: { eurusd: 1.7, gbpusd: 2.0, usdjpy: 1.8 }, commission: 'Included in spread', swapFeeCategory: 'High', maxLeverage: '1:100', minLotSize: 0.01 },
    accessibility: { minDeposit: 1000, depositMethods: ['Bank Transfer', 'Credit Card'], withdrawalMethods: ['Bank Transfer'], customerSupport: ['24/5 Phone', 'Email'] },
    technology: { platforms: ['Advanced Trader', 'MT4', 'MT5'], executionType: 'STP', apiAccess: true, eaSupport: true },
    reviews: [], isIslamic: false, copyTrading: true, providesSignals: true
  },
  {
    id: 'dukascopy',
    name: 'Dukascopy',
    logoUrl: '/broker-logos/dukascopy.png',
    websiteUrl: 'https://www.dukascopy.com/',
    score: 8.7,
    foundingYear: 2004,
    headquarters: 'Geneva, Switzerland',
    description: 'Dukascopy is a Swiss bank and broker offering direct ECN access through its proprietary JForex platform, catering to professional and institutional traders.',
    summary: 'Dukascopy is a top-tier choice for advanced traders who require a true ECN environment and a powerful, customizable platform. As a Swiss bank, it offers unmatched security, but its complex fee structure and high entry requirements make it less suitable for beginners.',
    pros: ["Swiss bank providing maximum security", "True ECN environment (SWFX - Swiss FX Marketplace)", "Powerful and highly customizable JForex platform", "Extensive research and analytical tools", "Transparent pricing model"],
    cons: ["High minimum deposit ($1,000 for Bank, $100 for Group)", "Complex commission structure", "JForex platform can be difficult for beginners"],
    coreInfo: { brokerType: 'ECN', mobileTrading: true, demoAccount: true },
    accountTypes: [{ name: 'ECN Account', type: 'ECN', minDeposit: 100, spreads: 'From 0.1 pips', commission: 'Volume-based', bestFor: 'Advanced and professional traders' }],
    fees: {
      trading: {
        spreadType: 'Raw',
        averageSpreads: [{ pair: 'EUR/USD', spread: '0.2 pips + commission' }],
        commissionStructure: "Tiered, based on volume, deposit, and equity. Can be complex.",
        overnightSwapFees: "Low, based on market rates"
      },
      nonTrading: {
        inactivityFee: "None",
        withdrawalFee: "High fees for bank transfers",
        depositFee: "Varies by method"
      }
    },
    tradableInstruments: {
      forexPairs: { total: 60, details: "Majors, Minors, Exotics" },
      commodities: { total: 14, details: "Metals, Energies" },
      indices: { total: 20, details: "Global indices" },
      stocks: { total: 900, details: "Global stock CFDs" },
      cryptocurrencies: { total: 10, details: "Major crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "200%", stopOutLevel: "100%" },
    depositWithdrawal: {
      depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill'],
      withdrawalMethods: ['Bank Transfer', 'Skrill'],
      depositFees: "Varies",
      withdrawalFees: "Varies, can be high",
      processingTime: { deposits: '1-3 days', withdrawals: '1-3 days' },
      minWithdrawal: 20
    },
    customerSupport: { languages: ['English', 'German', 'French', 'Russian', 'Chinese'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'FINMA', licenseNumber: 'Swiss Banking License' }, { regulator: 'FSA (Japan)' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to CHF 100,000' },
      twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 50, slippage: "Very Low", requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop', 'OCO'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 180, drawingTools: 60 },
      automatedTrading: ['JForex API', 'EAs (via 3rd party bridge)'],
      copyTrading: { available: true, platforms: ['Built-in social trading'] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: {
      islamicAccount: { available: true },
      baseCurrencies: ['USD', 'EUR', 'GBP', 'CHF', 'JPY', 'AUD', 'CAD', 'SGD', 'HKD'],
      mamPammSupport: true,
      corporateAccounts: true
    },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2004, tradingVolumeDisclosed: true },
    regulation: { regulators: ['FINMA', 'FSA (Japan)'] },
    ratings: { regulation: 9.9, costs: 8.0, platforms: 9.2, support: 8.5 },
    tradingConditions: { spreads: { eurusd: 0.2, gbpusd: 0.5, usdjpy: 0.3 }, commission: 'Volume-based', swapFeeCategory: 'Low', maxLeverage: '1:200', minLotSize: 0.01 },
    accessibility: { minDeposit: 100, depositMethods: ['Bank Transfer', 'Credit Card'], withdrawalMethods: ['Bank Transfer'], customerSupport: ['24/5 Phone', 'Email'] },
    technology: { platforms: ['JForex', 'MT4'], executionType: 'ECN', apiAccess: true, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: true, providesSignals: true
  },
   {
    id: 'thinkmarkets',
    name: 'ThinkMarkets',
    logoUrl: '/broker-logos/thinkmarkets.png',
    websiteUrl: 'https://www.thinkmarkets.com/',
    score: 8.6,
    foundingYear: 2010,
    headquarters: 'Melbourne, Australia & London, UK',
    description: 'ThinkMarkets is a multi-regulated broker offering its proprietary ThinkTrader platform alongside MT4 and MT5, with competitive pricing and a wide range of markets.',
    summary: 'ThinkMarkets is a great all-round broker with strong regulation from both the FCA and ASIC. Its proprietary ThinkTrader platform is a standout feature, offering advanced tools and a great user experience. It competes well on cost with its ThinkZero account.',
    pros: ["Regulated by FCA and ASIC", "Excellent proprietary ThinkTrader platform", "Low forex fees on ThinkZero account", "Wide range of tradable instruments", "Negative balance protection"],
    cons: ["High financing rates on CFDs", "Customer support is not 24/7"],
    coreInfo: { brokerType: 'STP', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'Standard', type: 'STP', minDeposit: 0, spreads: 'From 0.8 pips', commission: 'Zero', bestFor: 'Beginners' },
      { name: 'ThinkZero', type: 'ECN', minDeposit: 500, spreads: 'From 0.0 pips', commission: '$3.50 per lot side', bestFor: 'Active traders' },
    ],
    fees: {
      trading: {
        spreadType: 'Variable',
        averageSpreads: [{ pair: 'EUR/USD', spread: '0.1 pips + commission (ThinkZero)' }],
        commissionStructure: "$3.50 per side on ThinkZero",
        overnightSwapFees: "Standard"
      },
      nonTrading: {
        inactivityFee: "None",
        withdrawalFee: "None",
        depositFee: "None"
      }
    },
    tradableInstruments: {
      forexPairs: { total: 46, details: "Majors, Minors, Exotics" },
      commodities: { total: 16, details: "Metals, Energies, Softs" },
      indices: { total: 15, details: "Global indices" },
      stocks: { total: 3500, details: "Global stock CFDs" },
      cryptocurrencies: { total: 20, details: "Major crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "80%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
      withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
      depositFees: "None",
      withdrawalFees: "None",
      processingTime: { deposits: 'Instant', withdrawals: 'Within 24 hours' },
      minWithdrawal: 1
    },
    customerSupport: { languages: ['English', 'Spanish', 'Chinese', 'Arabic'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'FCA', licenseNumber: '629628' }, { regulator: 'ASIC' }, { regulator: 'FSCA' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
      twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 90, slippage: "Low", requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 80, drawingTools: 50 },
      automatedTrading: ['EAs (MT4/5)'],
      copyTrading: { available: true, platforms: ['Signal Centre'] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: {
      islamicAccount: { available: true },
      baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'CHF', 'JPY'],
      mamPammSupport: true,
      corporateAccounts: true
    },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2010, tradingVolumeDisclosed: false },
    regulation: { regulators: ['FCA', 'ASIC', 'FSCA'] },
    ratings: { regulation: 9.2, costs: 8.8, platforms: 8.9, support: 8.5 },
    tradingConditions: { spreads: { eurusd: 1.1, gbpusd: 1.4, usdjpy: 1.2 }, commission: '$3.50 on Zero', swapFeeCategory: 'Standard', maxLeverage: '1:500', minLotSize: 0.01 },
    accessibility: { minDeposit: 0, depositMethods: ['Credit Card', 'Skrill', 'PayPal'], withdrawalMethods: ['Credit Card', 'Skrill', 'PayPal'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['ThinkTrader', 'MT4', 'MT5'], executionType: 'STP', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: true, providesSignals: true
  },
  {
    id: 'fxcm',
    name: 'FXCM',
    logoUrl: '/broker-logos/fxcm.png',
    websiteUrl: 'https://www.fxcm.com/',
    score: 8.4,
    foundingYear: 1999,
    headquarters: 'London, UK',
    description: 'FXCM is a long-standing forex broker offering a variety of platforms and a focus on algorithmic trading with its powerful API capabilities.',
    summary: 'FXCM is a well-known broker with a long history, making it a reliable choice for many traders. It particularly appeals to algorithmic traders with its strong platform selection, including TradingView integration and powerful APIs.',
    pros: ["Long track record, founded in 1999", "Regulated by FCA and ASIC", "Good selection of platforms (Trading Station, MT4, TradingView)", "Excellent for algorithmic traders (APIs)", "Strong educational and research content"],
    cons: ["Past regulatory issues in the US", "High spreads on standard accounts", "Limited number of tradable instruments"],
    coreInfo: { brokerType: 'STP', mobileTrading: true, demoAccount: true },
    accountTypes: [{ name: 'Standard', type: 'STP', minDeposit: 50, spreads: 'From 1.3 pips', commission: 'Zero', bestFor: 'All traders' }],
    fees: {
      trading: {
        spreadType: 'Variable',
        averageSpreads: [{ pair: 'EUR/USD', spread: '1.3 pips' }],
        commissionStructure: "Spread-based, with Active Trader rebates",
        overnightSwapFees: "Standard"
      },
      nonTrading: {
        inactivityFee: "£50 after 12 months",
        withdrawalFee: "Fees for bank transfers",
        depositFee: "None"
      }
    },
    tradableInstruments: {
      forexPairs: { total: 40, details: "Majors, Minors, Exotics" },
      commodities: { total: 10, details: "Metals, Energies" },
      indices: { total: 15, details: "Global indices" },
      stocks: { total: 150, details: "Global stock CFDs" },
      cryptocurrencies: { total: 7, details: "Major cryptos" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill'],
      withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer'],
      depositFees: "None",
      withdrawalFees: "Varies",
      processingTime: { deposits: 'Instant', withdrawals: '2-4 days' },
      minWithdrawal: 50
    },
    customerSupport: { languages: ['English', 'German', 'French', 'Arabic'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'FCA', licenseNumber: '217689' }, { regulator: 'ASIC' }, { regulator: 'CySEC' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
      twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 100, slippage: "Standard", requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 80, drawingTools: 50 },
      automatedTrading: ['EAs', 'REST API', 'FIX API'],
      copyTrading: { available: true, platforms: ['ZuluTrade'] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: {
      islamicAccount: { available: true },
      baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD'],
      mamPammSupport: true,
      corporateAccounts: true
    },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 1999, tradingVolumeDisclosed: false },
    regulation: { regulators: ['FCA', 'ASIC', 'CySEC'] },
    ratings: { regulation: 9.0, costs: 7.5, platforms: 8.8, support: 8.2 },
    tradingConditions: { spreads: { eurusd: 1.3, gbpusd: 1.6, usdjpy: 1.4 }, commission: 'Included in spread', swapFeeCategory: 'Standard', maxLeverage: '1:400', minLotSize: 0.01 },
    accessibility: { minDeposit: 50, depositMethods: ['Credit Card', 'Bank Transfer', 'Skrill'], withdrawalMethods: ['Credit Card', 'Bank Transfer'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['Trading Station', 'MT4', 'TradingView'], executionType: 'STP', apiAccess: true, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: true, providesSignals: true
  },
  {
    id: 'xm',
    name: 'XM',
    logoUrl: '/broker-logos/xm.png',
    websiteUrl: 'https://www.xm.com/',
    score: 8.5,
    foundingYear: 2009,
    headquarters: 'Limassol, Cyprus',
    description: 'XM is a large, well-established international broker with over 5 million clients, known for its strong focus on user education, regular promotions, and a wide range of account types.',
    summary: 'XM is a globally recognized broker that excels in providing a user-friendly experience, particularly for new traders. With a very low minimum deposit, excellent educational resources, and frequent bonuses, it serves as a great entry point into the forex market.',
    pros: ["Regulated by ASIC and CySEC", "Very low minimum deposit ($5)", "Excellent educational resources and webinars", "Wide range of account types, including Micro accounts", "Regular bonuses and promotions"],
    cons: ["Spreads on standard accounts are not the most competitive", "High inactivity fee"],
    coreInfo: { brokerType: 'Market Maker', mobileTrading: true, demoAccount: true },
    accountTypes: [
        { name: 'Micro', type: 'Standard', minDeposit: 5, spreads: 'From 1.0 pip', commission: 'Zero', bestFor: 'Beginners testing with small capital' },
        { name: 'Standard', type: 'Standard', minDeposit: 5, spreads: 'From 1.0 pip', commission: 'Zero', bestFor: 'Regular traders' },
        { name: 'XM Zero', type: 'ECN', minDeposit: 100, spreads: 'From 0.0 pips', commission: '$3.50 per lot side', bestFor: 'Active traders' }
    ],
    fees: {
        trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '0.1 pips + commission (Zero)' }], commissionStructure: "Commission on Zero account, otherwise spread-based", overnightSwapFees: "Standard" },
        nonTrading: { inactivityFee: "$15 one-off fee, then $5/month after 90 days", withdrawalFee: "None, XM covers fees", depositFee: "None, XM covers fees" }
    },
    tradableInstruments: {
        forexPairs: { total: 57, details: "Majors, Minors, Exotics" },
        commodities: { total: 15, details: "Metals, Energies, Softs" },
        indices: { total: 30, details: "Cash and Futures indices" },
        stocks: { total: 1200, details: "Global stock CFDs" },
        cryptocurrencies: { total: 31, details: "Major cryptos" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller'],
        depositFees: "None",
        withdrawalFees: "None",
        processingTime: { deposits: 'Instant', withdrawals: 'Within 24 hours' },
        minWithdrawal: 5
    },
    customerSupport: { languages: ['English', 'Spanish', 'Chinese', 'Arabic', 'Russian', '20+ others'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
        regulatedBy: [{ regulator: 'CySEC', licenseNumber: '120/10' }, { regulator: 'ASIC', licenseNumber: '443670' }, { regulator: 'IFSC' }],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to €20,000 (ICF)' },
        twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 150, slippage: "Standard", requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
        charting: { indicators: 50, drawingTools: 30 },
        automatedTrading: ['EAs (MT4/5)'],
        copyTrading: { available: false, platforms: [] },
        backtesting: true,
        newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: true }, baseCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CHF'], mamPammSupport: false, corporateAccounts: true },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2009, tradingVolumeDisclosed: false, clientBase: "5M+ clients" },
    promotions: {
      currentPromotions: [
        {
          type: 'welcome-bonus',
          title: '50% Welcome Bonus up to $500',
          description: 'Get a 50% bonus on your first deposit up to $500. Trade with extra capital and increase your trading potential.',
          amount: '50% up to $500',
          validUntil: '2024-12-31',
          minDeposit: 5,
          terms: 'Bonus credited automatically, minimum trading volume required',
          isExclusive: false,
          isPopular: true,
          isActive: true,
          websiteUrl: 'https://www.xm.com/bonus'
        },
        {
          type: 'loyalty-program',
          title: 'XM Loyalty Program',
          description: 'Earn points for every trade and redeem them for cash bonuses, free trades, or premium services.',
          amount: 'Unlimited',
          minDeposit: 0,
          terms: 'Points earned based on trading volume, redeemable for various rewards',
          isExclusive: false,
          isPopular: false,
          isActive: true
        }
      ]
    },
    regulation: { regulators: ['CySEC', 'ASIC', 'IFSC'] },
    ratings: { regulation: 8.8, costs: 8.0, platforms: 8.5, support: 9.0 },
    tradingConditions: { spreads: { eurusd: 1.7, gbpusd: 2.5, usdjpy: 1.8 }, commission: '$3.50 on Zero', swapFeeCategory: 'Standard', maxLeverage: '1:1000', minLotSize: 0.01 },
    accessibility: { minDeposit: 5, depositMethods: ['Credit Card', 'Bank Transfer', 'Skrill'], withdrawalMethods: ['Credit Card', 'Bank Transfer', 'Skrill'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['MT4', 'MT5'], executionType: 'Market Maker', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: false, providesSignals: true
  },
  {
    id: 'exness',
    name: 'Exness',
    logoUrl: '/broker-logos/exness.webp',
    websiteUrl: 'https://www.exness.com/',
    score: 8.9,
    foundingYear: 2008,
    headquarters: 'Limassol, Cyprus',
    description: 'Exness is a large retail forex broker known for its instant withdrawal system, extremely high leverage options, and transparent reporting, including tick-level data.',
    summary: 'Exness stands out for its technology-driven features, including instant withdrawals and incredibly low spreads on its Pro accounts. With options for unlimited leverage and a high degree of transparency, it is an excellent choice for experienced and algorithmic traders.',
    pros: ["Extremely low spreads on Pro accounts (from 0.0 pips)", "Instant deposits and withdrawals 24/7", "Unlimited leverage available for eligible clients", "High level of transparency (publishes financial reports)", "Wide variety of account types"],
    cons: ["Regulatory oversight is weaker than top-tier brokers", "High leverage can be extremely risky for beginners"],
    coreInfo: { brokerType: 'Market Maker', mobileTrading: true, demoAccount: true },
    accountTypes: [
        { name: 'Standard', type: 'Standard', minDeposit: 10, spreads: 'From 0.3 pips', commission: 'Zero', bestFor: 'All traders' },
        { name: 'Pro', type: 'ECN', minDeposit: 200, spreads: 'From 0.1 pips', commission: 'Zero', bestFor: 'Experienced traders' },
        { name: 'Zero', type: 'ECN', minDeposit: 200, spreads: 'From 0.0 pips', commission: 'From $0.2 per lot side', bestFor: 'Scalpers' },
    ],
    fees: {
        trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '0.0 pips + commission (Zero)' }], commissionStructure: "Varies by account, as low as $0.2 per side", overnightSwapFees: "Standard, extended swap-free available" },
        nonTrading: { inactivityFee: "None", withdrawalFee: "None", depositFee: "None" }
    },
    tradableInstruments: {
        forexPairs: { total: 100, details: "Majors, Minors, Exotics" },
        commodities: { total: 10, details: "Metals, Energies" },
        indices: { total: 10, details: "Global indices" },
        stocks: { total: 98, details: "Popular stock CFDs" },
        cryptocurrencies: { total: 34, details: "Major crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "60%", stopOutLevel: "0%" },
    depositWithdrawal: {
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Crypto'],
        depositFees: "None",
        withdrawalFees: "None",
        processingTime: { deposits: 'Instant', withdrawals: 'Instant' },
        minWithdrawal: 1
    },
    customerSupport: { languages: ['English', 'Chinese', 'Arabic', 'Russian', '15+ others'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/7' },
    security: {
        regulatedBy: [{ regulator: 'FCA', licenseNumber: '730729' }, { regulator: 'CySEC', licenseNumber: '178/12' }, { regulator: 'FSCA' }],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to €20,000 (ICF)' },
        twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 25, slippage: "Low", requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
        charting: { indicators: 50, drawingTools: 30 },
        automatedTrading: ['EAs (MT4/5)'],
        copyTrading: { available: true, platforms: ['Exness Social Trading'] },
        backtesting: true,
        newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: true }, baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'CAD'], mamPammSupport: false, corporateAccounts: false },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2008, tradingVolumeDisclosed: true, clientBase: "400,000+ active clients" },
    regulation: { regulators: ['FCA', 'CySEC', 'FSCA'] },
    ratings: { regulation: 8.5, costs: 9.5, platforms: 8.8, support: 9.2 },
    tradingConditions: { spreads: { eurusd: 0.6, gbpusd: 0.8, usdjpy: 0.7 }, commission: 'From $0.20 on Zero', swapFeeCategory: 'Low', maxLeverage: 'Unlimited', minLotSize: 0.01 },
    accessibility: { minDeposit: 10, depositMethods: ['Credit Card', 'Skrill', 'Neteller'], withdrawalMethods: ['Credit Card', 'Skrill', 'Neteller'], customerSupport: ['24/7 Live Chat', 'Phone'] },
    technology: { platforms: ['MT4', 'MT5', 'Exness Terminal'], executionType: 'Market Maker', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: true, providesSignals: false
  },
  {
    id: 'hf-markets',
    name: 'HF Markets',
    logoUrl: '/broker-logos/hfmarkets.png',
    websiteUrl: 'https://www.hfm.com/',
    score: 8.6,
    foundingYear: 2010,
    headquarters: 'Kingstown, St. Vincent & the Grenadines',
    description: 'HF Markets (formerly HotForex) is a global forex and commodities broker with a strong presence in emerging markets, offering a wide range of trading accounts and assets.',
    summary: 'HF Markets (HFM) is a versatile global broker that caters to a wide range of traders with its diverse account types and broad asset selection. With strong regulation from the FCA and CySEC, along with excellent educational content, it is a reliable choice for traders worldwide.',
    pros: ["Regulated by FCA, CySEC, and DFSA", "Wide range of account types (Micro, Premium, Zero)", "Over 1200 tradable instruments", "Excellent educational material and market analysis tools", "Negative balance protection and civil liability insurance"],
    cons: ["Spreads on the standard account are not the tightest", "Primarily a MetaTrader broker"],
    coreInfo: { brokerType: 'STP', mobileTrading: true, demoAccount: true },
    accountTypes: [
        { name: 'Premium', type: 'STP', minDeposit: 0, spreads: 'From 1.2 pips', commission: 'Zero', bestFor: 'Regular traders' },
        { name: 'Zero Spread', type: 'ECN', minDeposit: 200, spreads: 'From 0.0 pips', commission: 'From $3 per lot side', bestFor: 'Scalpers and EAs' },
        { name: 'HFcopy', type: 'STP', minDeposit: 100, spreads: 'From 1.2 pips', commission: 'Zero', bestFor: 'Copy traders' }
    ],
    fees: {
        trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '0.1 pips + commission (Zero)' }], commissionStructure: "Commission on Zero account", overnightSwapFees: "Standard" },
        nonTrading: { inactivityFee: "$5 per month after 6 months", withdrawalFee: "Varies by method", depositFee: "None" }
    },
    tradableInstruments: {
        forexPairs: { total: 53, details: "Majors, Minors, Exotics" },
        commodities: { total: 12, details: "Metals, Energies, Softs" },
        indices: { total: 23, details: "Global indices" },
        stocks: { total: 1000, details: "Global stock CFDs" },
        cryptocurrencies: { total: 19, details: "Major crypto CFDs" },
        etfs: { total: 34, details: "Global ETFs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "50%", stopOutLevel: "20%" },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'Crypto'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'Crypto'],
        depositFees: "None",
        withdrawalFees: "Varies",
        processingTime: { deposits: 'Within 10 minutes', withdrawals: 'Within 24 hours' },
        minWithdrawal: 5
    },
    customerSupport: { languages: ['English', 'Arabic', 'Chinese', 'Spanish', 'Russian'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
        regulatedBy: [{ regulator: 'FCA', licenseNumber: '801701' }, { regulator: 'CySEC', licenseNumber: '183/12' }, { regulator: 'DFSA' }],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to €20,000 (ICF)' },
        twoFactorAuth: false
    },
    tradingEnvironment: { executionSpeedMs: 120, slippage: "Standard", requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
        charting: { indicators: 50, drawingTools: 30 },
        automatedTrading: ['EAs (MT4/5)'],
        copyTrading: { available: true, platforms: ['HFcopy'] },
        backtesting: true,
        newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: true }, baseCurrencies: ['USD', 'EUR'], mamPammSupport: true, corporateAccounts: true },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2010, tradingVolumeDisclosed: false, clientBase: "2.5M+ live accounts" },
    regulation: { regulators: ['FCA', 'CySEC', 'DFSA'] },
    ratings: { regulation: 8.9, costs: 8.5, platforms: 8.4, support: 8.8 },
    tradingConditions: { spreads: { eurusd: 1.3, gbpusd: 1.6, usdjpy: 1.4 }, commission: '$3 on Zero', swapFeeCategory: 'Standard', maxLeverage: '1:1000', minLotSize: 0.01 },
    accessibility: { minDeposit: 0, depositMethods: ['Credit Card', 'Bank Transfer', 'Skrill'], withdrawalMethods: ['Credit Card', 'Bank Transfer', 'Skrill'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['MT4', 'MT5'], executionType: 'STP', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: true, providesSignals: true
  },
  {
    id: 'fbs',
    name: 'FBS',
    logoUrl: '/broker-logos/fbs.png',
    websiteUrl: 'https://fbs.com/',
    score: 8.2,
    foundingYear: 2009,
    headquarters: 'Limassol, Cyprus',
    description: 'FBS is an international broker known for offering extremely high leverage, a low minimum deposit, and a wide variety of promotions and contests, making it popular in Asia and other emerging markets.',
    summary: 'FBS appeals strongly to traders seeking very high leverage and frequent promotions. With account options like Cent and Micro, it allows new traders to start with minimal capital. However, its regulatory standing is not as strong as top-tier brokers.',
    pros: ["Extremely high leverage up to 1:3000", "Very low minimum deposit ($1)", "Wide range of account types including Cent accounts", "Frequent bonuses, promotions, and loyalty programs", "User-friendly proprietary trading app"],
    cons: ["Weaker regulation compared to industry leaders (no FCA, for example)", "High leverage is extremely risky", "Spreads can be wider than competitors"],
    coreInfo: { brokerType: 'STP', mobileTrading: true, demoAccount: true },
    accountTypes: [
        { name: 'Cent', type: 'Standard', minDeposit: 1, spreads: 'From 1.0 pip', commission: 'Zero', bestFor: 'Beginners practicing with real money' },
        { name: 'Standard', type: 'Standard', minDeposit: 1, spreads: 'From 0.5 pips', commission: 'Zero', bestFor: 'Regular traders' },
        { name: 'ECN', type: 'ECN', minDeposit: 1000, spreads: 'From -0.1 pips', commission: '$6 per lot', bestFor: 'Professional traders' }
    ],
    fees: {
        trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '0.9 pips' }], commissionStructure: "Commission on ECN account", overnightSwapFees: "Standard" },
        nonTrading: { inactivityFee: "€5 per month after 180 days", withdrawalFee: "Commission varies by system", depositFee: "None" }
    },
    tradableInstruments: {
        forexPairs: { total: 37, details: "Majors, Minors" },
        commodities: { total: 8, details: "Metals, Energies" },
        indices: { total: 12, details: "Global indices" },
        stocks: { total: 130, details: "US, UK, EU stock CFDs" },
        cryptocurrencies: { total: 15, details: "Major crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "40%", stopOutLevel: "20%" },
    depositWithdrawal: {
        depositMethods: ['Credit/Debit Card', 'Skrill', 'Neteller', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Skrill', 'Neteller', 'Crypto'],
        depositFees: "None",
        withdrawalFees: "Varies",
        processingTime: { deposits: 'Instant', withdrawals: '15-20 minutes' },
        minWithdrawal: 1
    },
    customerSupport: { languages: ['English', 'Spanish', 'Portuguese', 'Indonesian', 'Arabic'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/7' },
    security: {
        regulatedBy: [{ regulator: 'ASIC', licenseNumber: '426359' }, { regulator: 'CySEC', licenseNumber: '331/17' }, { regulator: 'FSCA' }],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to €20,000 (ICF)' },
        twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 40, slippage: "Standard", requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
        charting: { indicators: 50, drawingTools: 30 },
        automatedTrading: ['EAs (MT4/5)'],
        copyTrading: { available: true, platforms: ['FBS CopyTrade'] },
        backtesting: true,
        newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: true }, baseCurrencies: ['USD', 'EUR'], mamPammSupport: false, corporateAccounts: false },
    transparency: { audited: false, yearsInBusiness: new Date().getFullYear() - 2009, tradingVolumeDisclosed: false, clientBase: "23M+ clients" },
    regulation: { regulators: ['ASIC', 'CySEC', 'FSCA'] },
    ratings: { regulation: 7.5, costs: 8.0, platforms: 8.5, support: 8.8 },
    tradingConditions: { spreads: { eurusd: 0.9, gbpusd: 1.2, usdjpy: 1.1 }, commission: '$6 on ECN', swapFeeCategory: 'Standard', maxLeverage: '1:3000', minLotSize: 0.01 },
    accessibility: { minDeposit: 1, depositMethods: ['Credit Card', 'Skrill', 'Neteller'], withdrawalMethods: ['Credit Card', 'Skrill', 'Neteller'], customerSupport: ['24/7 Live Chat'] },
    technology: { platforms: ['MT4', 'MT5', 'FBS Trader'], executionType: 'STP', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: true, providesSignals: true
  },
  {
    id: 'octafx',
    name: 'OctaFX',
    logoUrl: '/broker-logos/octafx.webp',
    websiteUrl: 'https://www.octafx.com/',
    score: 8.3,
    foundingYear: 2011,
    headquarters: 'Kingstown, St. Vincent & the Grenadines',
    description: 'OctaFX is a global broker recognized for its low-cost trading environment, user-friendly copy trading platform, and a variety of promotional offers.',
    summary: 'OctaFX is a strong choice for cost-conscious traders, offering competitive spreads and a great proprietary copy trading platform. While its regulation is not top-tier, it provides a solid feature set for traders outside of major regulatory zones.',
    pros: ["Low spreads across all account types", "User-friendly copy trading service", "Low minimum deposit of $25", "No swap fees on all instruments", "Fast and free deposits/withdrawals"],
    cons: ["Regulatory oversight is limited to offshore jurisdictions", "Limited range of tradable instruments", "Lacks advanced research tools"],
    coreInfo: { brokerType: 'STP', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'OctaFX MT4', type: 'STP', minDeposit: 25, spreads: 'From 0.6 pips', commission: 'Zero', bestFor: 'Standard MT4 traders' },
      { name: 'OctaFX MT5', type: 'STP', minDeposit: 25, spreads: 'From 0.6 pips', commission: 'Zero', bestFor: 'Modern MT5 traders' },
    ],
    fees: {
      trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '0.6 pips' }], commissionStructure: "Zero commission", overnightSwapFees: "None, completely swap-free" },
      nonTrading: { inactivityFee: "None", withdrawalFee: "None", depositFee: "None" }
    },
    tradableInstruments: {
      forexPairs: { total: 35, details: "Majors, Minors, Exotics" },
      commodities: { total: 5, details: "Gold, Silver, Oil" },
      indices: { total: 10, details: "Global indices" },
      stocks: { total: 150, details: "US stock CFDs" },
      cryptocurrencies: { total: 30, details: "Major crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "25%", stopOutLevel: "15%" },
    depositWithdrawal: {
      depositMethods: ['Credit/Debit Card', 'Skrill', 'Neteller', 'Crypto', 'Local Banks'],
      withdrawalMethods: ['Credit/Debit Card', 'Skrill', 'Neteller', 'Crypto', 'Local Banks'],
      depositFees: "None",
      withdrawalFees: "None",
      processingTime: { deposits: 'Instant', withdrawals: '1-3 hours' },
      minWithdrawal: 5
    },
    customerSupport: { languages: ['English', 'Indonesian', 'Spanish', 'Hindi'], channels: ['Live Chat', 'Email'], hours: '24/7' },
    security: {
      regulatedBy: [{ regulator: 'CySEC', licenseNumber: '372/18' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to €20,000 (ICF)' },
      twoFactorAuth: false
    },
    tradingEnvironment: { executionSpeedMs: 100, slippage: "Standard", requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 50, drawingTools: 30 },
      automatedTrading: ['EAs (MT4/5)'],
      copyTrading: { available: true, platforms: ['OctaFX Copytrading'] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: true, conditions: "All accounts are swap-free by default." }, baseCurrencies: ['USD', 'EUR'], mamPammSupport: false, corporateAccounts: false },
    transparency: { audited: false, yearsInBusiness: new Date().getFullYear() - 2011, tradingVolumeDisclosed: false, clientBase: "12M+ trading accounts" },
    regulation: { regulators: ['CySEC'] },
    ratings: { regulation: 7.0, costs: 8.8, platforms: 8.5, support: 8.5 },
    tradingConditions: { spreads: { eurusd: 0.6, gbpusd: 0.8, usdjpy: 0.7 }, commission: 'Zero', swapFeeCategory: 'Low', maxLeverage: '1:500', minLotSize: 0.01 },
    accessibility: { minDeposit: 25, depositMethods: ['Credit Card', 'Skrill', 'Crypto'], withdrawalMethods: ['Credit Card', 'Skrill', 'Crypto'], customerSupport: ['24/7 Live Chat'] },
    technology: { platforms: ['MT4', 'MT5'], executionType: 'STP', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: true, providesSignals: true
  },
  {
    id: 'roboforex',
    name: 'RoboForex',
    logoUrl: '/broker-logos/roboforex.webp',
    websiteUrl: 'https://roboforex.com/',
    score: 8.7,
    foundingYear: 2009,
    headquarters: 'Belize City, Belize',
    description: 'RoboForex is a versatile broker offering a wide variety of account types, platforms, and assets, with a strong focus on algorithmic trading and investment platforms.',
    summary: 'RoboForex is a feature-rich broker that caters to a broad audience, from beginners with its ProCent account to professionals with its Prime (ECN) account. Its standout features include the R StocksTrader platform and CopyFX investment system, making it highly versatile.',
    pros: ["Wide range of account types (Pro, ECN, Prime, Cent)", "Over 12,000 tradable instruments on R StocksTrader", "Low minimum deposit of $10", "Proprietary CopyFX and R StocksTrader platforms", "Free VPS for active clients"],
    cons: ["Offshore regulation (FSC Belize)", "Can be complex for new traders due to the number of options"],
    coreInfo: { brokerType: 'Hybrid', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'ProCent', type: 'Standard', minDeposit: 10, spreads: 'From 1.3 pips', commission: 'Zero', bestFor: 'Testing strategies' },
      { name: 'ECN', type: 'ECN', minDeposit: 10, spreads: 'From 0.0 pips', commission: '$2.0 per lot side', bestFor: 'Scalpers' },
      { name: 'Prime', type: 'ECN', minDeposit: 10, spreads: 'From 0.0 pips', commission: '$1.5 per lot side', bestFor: 'Experienced traders' }
    ],
    fees: {
      trading: { spreadType: 'Raw', averageSpreads: [{ pair: 'EUR/USD', spread: '0.0 pips + commission (ECN)' }], commissionStructure: "Commission-based on ECN/Prime accounts", overnightSwapFees: "Standard" },
      nonTrading: { inactivityFee: "None", withdrawalFee: "Two free withdrawals per month", depositFee: "None" }
    },
    tradableInstruments: {
      forexPairs: { total: 36, details: "Majors, Minors" },
      commodities: { total: 20, details: "Metals, Energies" },
      indices: { total: 10, details: "Global indices" },
      stocks: { total: 12000, details: "US Stocks via R StocksTrader" },
      cryptocurrencies: { total: 26, details: "Major crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "60%", stopOutLevel: "40%" },
    depositWithdrawal: {
      depositMethods: ['Credit/Debit Card', 'Skrill', 'Neteller', 'Perfect Money', 'Crypto'],
      withdrawalMethods: ['Credit/Debit Card', 'Skrill', 'Neteller', 'Perfect Money', 'Crypto'],
      depositFees: "None",
      withdrawalFees: "Varies, with free withdrawal promotions",
      processingTime: { deposits: 'Instant', withdrawals: 'Within 1 day' },
      minWithdrawal: 1
    },
    customerSupport: { languages: ['English', 'Chinese', 'Spanish', 'Malay', 'Russian'], channels: ['Live Chat', 'Phone', 'Email', 'Telegram'], hours: '24/7' },
    security: {
      regulatedBy: [{ regulator: 'FSC Belize', licenseNumber: '000138/7' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to €20,000 (The Commission)' },
      twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 100, slippage: "Standard", requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 50, drawingTools: 30 },
      automatedTrading: ['EAs (MT4/5)', 'cAlgo', 'R StocksTrader Strategy Builder'],
      copyTrading: { available: true, platforms: ['CopyFX'] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: true }, baseCurrencies: ['USD', 'EUR'], mamPammSupport: false, corporateAccounts: true },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2009, tradingVolumeDisclosed: false, clientBase: "1M+ clients" },
    regulation: { regulators: ['FSC Belize'] },
    ratings: { regulation: 6.5, costs: 8.9, platforms: 9.0, support: 8.5 },
    tradingConditions: { spreads: { eurusd: 0.0, gbpusd: 0.3, usdjpy: 0.1 }, commission: '$2 on ECN', swapFeeCategory: 'Standard', maxLeverage: '1:2000', minLotSize: 0.01 },
    accessibility: { minDeposit: 10, depositMethods: ['Credit Card', 'Skrill', 'Neteller'], withdrawalMethods: ['Credit Card', 'Skrill', 'Neteller'], customerSupport: ['24/7 Live Chat', 'Phone'] },
    technology: { platforms: ['MT4', 'MT5', 'cTrader', 'R StocksTrader'], executionType: 'Hybrid', apiAccess: true, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: true, providesSignals: true
  },
  {
    id: 'hycm',
    name: 'HYCM',
    logoUrl: '/broker-logos/hycm.png',
    websiteUrl: 'https://www.hycm.com/',
    score: 8.4,
    foundingYear: 1977,
    headquarters: 'London, UK',
    description: 'HYCM (Henyep Capital Markets) is a well-established multi-regulated broker with a long history in the financial markets, offering a reliable trading experience on MT4 and MT5.',
    summary: 'With a history spanning over 40 years, HYCM is one of the most established and trusted brokers in the industry. It offers a straightforward, reliable trading experience with strong regulation from the FCA and CySEC, making it a safe choice for traders who value stability and security.',
    pros: ["Long track record, founded in 1977", "Regulated by FCA, CySEC, CIMA, DFSA", "Three distinct account types", "Good customer service"],
    cons: ["Limited range of tradable instruments", "Higher than average spreads on the Classic account", "Does not offer cTrader"],
    coreInfo: { brokerType: 'Market Maker', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'Fixed', type: 'Standard', minDeposit: 100, spreads: 'Fixed from 1.5 pips', commission: 'Zero', bestFor: 'Traders who prefer fixed costs' },
      { name: 'Classic', type: 'Standard', minDeposit: 100, spreads: 'Variable from 1.2 pips', commission: 'Zero', bestFor: 'Standard traders' },
      { name: 'Raw', type: 'ECN', minDeposit: 200, spreads: 'From 0.1 pips', commission: '$4 per round turn', bestFor: 'Active traders' }
    ],
    fees: {
      trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '0.2 pips + commission (Raw)' }], commissionStructure: "$4 per round turn on Raw account", overnightSwapFees: "Standard" },
      nonTrading: { inactivityFee: "$10 per month after 90 days", withdrawalFee: "High fees for bank wires under $300", depositFee: "None" }
    },
    tradableInstruments: {
      forexPairs: { total: 69, details: "Majors, Minors, Exotics" },
      commodities: { total: 20, details: "Metals, Energies, Softs" },
      indices: { total: 28, details: "Global indices" },
      stocks: { total: 196, details: "US, EU stock CFDs" },
      cryptocurrencies: { total: 20, details: "Major crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
      withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
      depositFees: "None",
      withdrawalFees: "Varies",
      processingTime: { deposits: '1 hour', withdrawals: '1-5 days' },
      minWithdrawal: 20
    },
    customerSupport: { languages: ['English', 'Arabic', 'Chinese'], channels: ['Live Chat', 'Phone', 'Email', 'WhatsApp'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'FCA', licenseNumber: '186171' }, { regulator: 'CySEC', licenseNumber: '259/14' }, { regulator: 'DFSA' }, { regulator: 'CIMA' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
      twoFactorAuth: false
    },
    tradingEnvironment: { executionSpeedMs: 120, slippage: "Standard", requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 50, drawingTools: 30 },
      automatedTrading: ['EAs (MT4/5)'],
      copyTrading: { available: false, platforms: [] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: true }, baseCurrencies: ['USD', 'EUR'], mamPammSupport: false, corporateAccounts: true },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 1977, tradingVolumeDisclosed: false },
    regulation: { regulators: ['FCA', 'CySEC', 'DFSA', 'CIMA'] },
    ratings: { regulation: 9.0, costs: 8.2, platforms: 8.0, support: 8.5 },
    tradingConditions: { spreads: { eurusd: 1.2, gbpusd: 1.5, usdjpy: 1.4 }, commission: '$4 on Raw', swapFeeCategory: 'Standard', maxLeverage: '1:500', minLotSize: 0.01 },
    accessibility: { minDeposit: 100, depositMethods: ['Credit Card', 'Skrill'], withdrawalMethods: ['Credit Card', 'Skrill'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['MT4', 'MT5'], executionType: 'Market Maker', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: false, providesSignals: true
  },
  {
    id: 'city-index',
    name: 'City Index',
    logoUrl: '/broker-logos/city-index.png',
    websiteUrl: 'https://www.cityindex.com/',
    score: 8.8,
    foundingYear: 1983,
    headquarters: 'London, UK',
    description: 'City Index is a global CFD and spread betting provider with a long history, strong regulation, and a comprehensive range of markets, owned by StoneX Group.',
    summary: 'As part of the publicly-traded StoneX group and with a history dating back to 1983, City Index offers a very high level of trust. It provides an excellent all-round experience with its powerful platforms, extensive research, and wide range of markets.',
    pros: ["Owned by StoneX (NASDAQ: SNEX)", "Regulated by top-tier FCA and ASIC", "Excellent proprietary platform and TradingView integration", "Extensive research and analysis tools", "Wide range of over 12,000 markets"],
    cons: ["Spreads are not the lowest in the industry", "High financing rates for overnight positions"],
    coreInfo: { brokerType: 'Market Maker', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'Standard', type: 'Standard', minDeposit: 100, spreads: 'From 0.8 pips', commission: 'Zero', bestFor: 'All traders' },
    ],
    fees: {
      trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '0.8 pips' }], commissionStructure: "Spread-based, commission on shares", overnightSwapFees: "Standard" },
      nonTrading: { inactivityFee: "£12 per month after 12 months", withdrawalFee: "None", depositFee: "None" }
    },
    tradableInstruments: {
      forexPairs: { total: 84, details: "Majors, Minors, Exotics" },
      commodities: { total: 25, details: "Metals, Energies" },
      indices: { total: 21, details: "Global indices" },
      stocks: { total: 4500, details: "Global stock CFDs" },
      cryptocurrencies: { total: 8, details: "Major crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'PayPal'],
      withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'PayPal'],
      depositFees: "None",
      withdrawalFees: "None",
      processingTime: { deposits: 'Instant', withdrawals: '1-2 days' },
      minWithdrawal: 100
    },
    customerSupport: { languages: ['English', 'Arabic', 'Chinese'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'FCA', licenseNumber: '113942' }, { regulator: 'ASIC' }, { regulator: 'MAS (Singapore)' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
      twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 90, slippage: "Standard", requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop', 'GSLO'], guaranteedStopLoss: { available: true, cost: "Wider spread" } },
    platformFeatures: {
      charting: { indicators: 80, drawingTools: 50 },
      automatedTrading: ['EAs (MT4)'],
      copyTrading: { available: false, platforms: [] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: false }, baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'CHF'], mamPammSupport: false, corporateAccounts: true },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 1983, tradingVolumeDisclosed: true },
    regulation: { regulators: ['FCA', 'ASIC', 'MAS (Singapore)'] },
    ratings: { regulation: 9.8, costs: 8.5, platforms: 9.0, support: 8.8 },
    tradingConditions: { spreads: { eurusd: 0.8, gbpusd: 1.2, usdjpy: 1.0 }, commission: 'Varies', swapFeeCategory: 'Standard', maxLeverage: '1:400', minLotSize: 0.01 },
    accessibility: { minDeposit: 100, depositMethods: ['Credit Card', 'Bank Transfer', 'PayPal'], withdrawalMethods: ['Credit Card', 'Bank Transfer', 'PayPal'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['Web Trader', 'AT Pro', 'MT4', 'TradingView'], executionType: 'Market Maker', apiAccess: true, eaSupport: true },
    reviews: [], isIslamic: false, copyTrading: false, providesSignals: true
  },
  {
    id: 'activtrades',
    name: 'ActivTrades',
    logoUrl: '/broker-logos/activtrades.png',
    websiteUrl: 'https://www.activtrades.com/',
    score: 8.5,
    foundingYear: 2001,
    headquarters: 'London, UK',
    description: 'ActivTrades is an FCA-regulated broker offering its own advanced ActivTrader platform, known for its additional insurance coverage and enhanced trading tools.',
    summary: 'ActivTrades is a highly secure UK-based broker, offering excellent client fund protection that goes beyond the standard requirements. Its proprietary ActivTrader platform is a key highlight, providing an innovative and user-friendly experience for traders of all levels.',
    pros: ["Regulated by the FCA", "Proprietary ActivTrader platform with advanced features", "Additional client fund insurance up to £1 million", "SmartOrder 2 trading tools for MT4/MT5", "Negative balance protection"],
    cons: ["Limited product portfolio compared to larger brokers", "Spreads are average", "Customer service is not 24/7"],
    coreInfo: { brokerType: 'STP', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'Individual', type: 'STP', minDeposit: 500, spreads: 'From 0.5 pips', commission: 'Zero', bestFor: 'All traders' },
    ],
    fees: {
      trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '0.8 pips' }], commissionStructure: "Spread-based", overnightSwapFees: "Standard" },
      nonTrading: { inactivityFee: "None", withdrawalFee: "None", depositFee: "None" }
    },
    tradableInstruments: {
      forexPairs: { total: 48, details: "Majors, Minors, Exotics" },
      commodities: { total: 15, details: "Metals, Energies, Grains" },
      indices: { total: 43, details: "Global indices" },
      stocks: { total: 500, details: "US, EU stock CFDs" },
      cryptocurrencies: { total: 0, details: "Not available to UK retail clients" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
      withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
      depositFees: "None",
      withdrawalFees: "None",
      processingTime: { deposits: 'Instant', withdrawals: 'Within 24 hours' },
      minWithdrawal: 1
    },
    customerSupport: { languages: ['English', 'German', 'French', 'Italian', 'Spanish'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'FCA', licenseNumber: '434413' }, { regulator: 'SCB' }, { regulator: 'CSSF' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FSCS) + private insurance up to £1M' },
      twoFactorAuth: false
    },
    tradingEnvironment: { executionSpeedMs: 46, slippage: "Low", requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 90, drawingTools: 50 },
      automatedTrading: ['EAs (MT4/5)'],
      copyTrading: { available: false, platforms: [] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: true }, baseCurrencies: ['USD', 'EUR', 'GBP', 'CHF'], mamPammSupport: false, corporateAccounts: true },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2001, tradingVolumeDisclosed: false },
    regulation: { regulators: ['FCA', 'SCB', 'CSSF'] },
    ratings: { regulation: 9.2, costs: 8.4, platforms: 8.6, support: 8.5 },
    tradingConditions: { spreads: { eurusd: 0.8, gbpusd: 1.2, usdjpy: 1.0 }, commission: 'Zero', swapFeeCategory: 'Standard', maxLeverage: '1:200', minLotSize: 0.01 },
    accessibility: { minDeposit: 500, depositMethods: ['Credit Card', 'Skrill', 'PayPal'], withdrawalMethods: ['Credit Card', 'Skrill', 'PayPal'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['ActivTrader', 'MT4', 'MT5'], executionType: 'STP', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: false, providesSignals: true
  },
  {
    id: 'atfx',
    name: 'ATFX',
    logoUrl: '/broker-logos/ATFX.png',
    websiteUrl: 'https://www.atfx.com/',
    score: 8.3,
    foundingYear: 2017,
    headquarters: 'London, UK',
    description: 'ATFX is a global online CFD broker with a strong regulatory framework, focusing on providing a straightforward MT4 trading experience with competitive pricing.',
    summary: 'ATFX provides a secure and straightforward trading environment, backed by strong FCA and CySEC regulation. It focuses on delivering a quality MetaTrader 4 experience with competitive spreads, making it a solid choice for traders who value simplicity and safety.',
    pros: ["Regulated by FCA and CySEC", "Competitive spreads", "Low minimum deposit", "Good educational resources", "Free access to Trading Central"],
    cons: ["Primarily an MT4-only broker", "Limited range of tradable instruments", "Offshore entity offers high leverage but weaker protection"],
    coreInfo: { brokerType: 'STP', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'Standard', type: 'STP', minDeposit: 100, spreads: 'From 1.0 pips', commission: 'Zero', bestFor: 'Beginners' },
      { name: 'Edge', type: 'STP', minDeposit: 5000, spreads: 'From 0.6 pips', commission: 'Zero', bestFor: 'Active traders' },
    ],
    fees: {
      trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '1.2 pips' }], commissionStructure: "Spread-based", overnightSwapFees: "Standard" },
      nonTrading: { inactivityFee: "None", withdrawalFee: "None", depositFee: "None" }
    },
    tradableInstruments: {
      forexPairs: { total: 43, details: "Majors, Minors, Exotics" },
      commodities: { total: 6, details: "Metals, Oil" },
      indices: { total: 15, details: "Global indices" },
      stocks: { total: 100, details: "US, EU stock CFDs" },
      cryptocurrencies: { total: 9, details: "Major crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
      withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
      depositFees: "None",
      withdrawalFees: "None",
      processingTime: { deposits: 'Instant', withdrawals: '1 business day' },
      minWithdrawal: 20
    },
    customerSupport: { languages: ['English', 'Spanish', 'Chinese', 'Arabic'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'FCA', licenseNumber: '760555' }, { regulator: 'CySEC', licenseNumber: '285/15' }, { regulator: 'FSC' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
      twoFactorAuth: false
    },
    tradingEnvironment: { executionSpeedMs: 110, slippage: "Standard", requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 50, drawingTools: 30 },
      automatedTrading: ['EAs (MT4)'],
      copyTrading: { available: false, platforms: [] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: true }, baseCurrencies: ['USD', 'EUR', 'GBP'], mamPammSupport: false, corporateAccounts: true },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2017, tradingVolumeDisclosed: false },
    regulation: { regulators: ['FCA', 'CySEC', 'FSC'] },
    ratings: { regulation: 8.8, costs: 8.2, platforms: 8.0, support: 8.5 },
    tradingConditions: { spreads: { eurusd: 1.2, gbpusd: 1.5, usdjpy: 1.3 }, commission: 'Zero', swapFeeCategory: 'Standard', maxLeverage: '1:400', minLotSize: 0.01 },
    accessibility: { minDeposit: 100, depositMethods: ['Credit Card', 'Skrill'], withdrawalMethods: ['Credit Card', 'Skrill'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['MT4'], executionType: 'STP', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: false, providesSignals: true
  },
  {
    id: 'lcg',
    name: 'LCG',
    logoUrl: '/broker-logos/lcg.jpg',
    websiteUrl: 'https://www.lcg.com/',
    score: 8.2,
    foundingYear: 1996,
    headquarters: 'London, UK',
    description: 'London Capital Group (LCG) is a well-established, FCA-regulated broker offering spread betting and CFD trading on its proprietary LCG Trader platform and MT4.',
    summary: 'With a long history and strong FCA regulation, LCG (London Capital Group) is a trusted name in the UK trading scene. It offers a solid proprietary platform alongside MT4, but its pricing and product range are average compared to the top competition.',
    pros: ["Long-standing broker, founded in 1996", "Regulated by the FCA", "Good proprietary LCG Trader platform", "Negative balance protection"],
    cons: ["Spreads are not competitive", "Limited educational resources", "High inactivity fee"],
    coreInfo: { brokerType: 'Market Maker', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'CFD Trading', type: 'STP', minDeposit: 0, spreads: 'From 1.0 pips', commission: 'Zero', bestFor: 'Standard traders' },
      { name: 'ECN Account', type: 'ECN', minDeposit: 10000, spreads: 'From 0.0 pips', commission: '$4.5 per lot side', bestFor: 'High volume traders' }
    ],
    fees: {
      trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '1.45 pips' }], commissionStructure: "Spread-based, ECN option available", overnightSwapFees: "Standard" },
      nonTrading: { inactivityFee: "£15 per month after 12 months", withdrawalFee: "None", depositFee: "2% for cards" }
    },
    tradableInstruments: {
      forexPairs: { total: 60, details: "Majors, Minors, Exotics" },
      commodities: { total: 17, details: "Metals, Energies, Softs" },
      indices: { total: 15, details: "Global indices" },
      stocks: { total: 4000, details: "Global stock CFDs" },
      cryptocurrencies: { total: 0, details: "Not available" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "80%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill'],
      withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill'],
      depositFees: "2% fee for credit cards",
      withdrawalFees: "None",
      processingTime: { deposits: 'Instant', withdrawals: '2-3 days' },
      minWithdrawal: 1
    },
    customerSupport: { languages: ['English', 'Spanish', 'Chinese', 'Arabic'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'FCA', licenseNumber: '182110' }, { regulator: 'CySEC' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
      twoFactorAuth: false
    },
    tradingEnvironment: { executionSpeedMs: 150, slippage: "Standard", requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: true } },
    platformFeatures: {
      charting: { indicators: 70, drawingTools: 40 },
      automatedTrading: ['EAs (MT4)'],
      copyTrading: { available: false, platforms: [] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: false }, baseCurrencies: ['USD', 'EUR', 'GBP'], mamPammSupport: false, corporateAccounts: true },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 1996, tradingVolumeDisclosed: true },
    regulation: { regulators: ['FCA', 'CySEC'] },
    ratings: { regulation: 9.0, costs: 7.5, platforms: 8.2, support: 8.3 },
    tradingConditions: { spreads: { eurusd: 1.45, gbpusd: 1.8, usdjpy: 1.5 }, commission: '$4.5 on ECN', swapFeeCategory: 'Standard', maxLeverage: '1:500', minLotSize: 0.01 },
    accessibility: { minDeposit: 0, depositMethods: ['Credit Card', 'Skrill'], withdrawalMethods: ['Credit Card', 'Skrill'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['LCG Trader', 'MT4'], executionType: 'Market Maker', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: false, copyTrading: false, providesSignals: true
  },
  {
    id: 'markets-com',
    name: 'Markets.com',
    logoUrl: '/broker-logos/marketscom.png',
    websiteUrl: 'https://www.markets.com/',
    score: 8.6,
    foundingYear: 2008,
    headquarters: 'Road Town, British Virgin Islands',
    description: 'Markets.com is a well-regulated global broker, part of the Finalto group, offering a comprehensive proprietary trading platform with excellent analytical tools.',
    summary: 'Backed by the large Finalto group, Markets.com is a well-rounded broker that excels in its research and analytical offerings. Its proprietary platform is packed with unique sentiment tools and technical analysis features, making it a great choice for data-driven traders.',
    pros: ["Regulated by FCA and CySEC", "Excellent proprietary platform with unique analytical tools", "Comprehensive research and educational content", "Wide range of tradable instruments", "Part of the publicly-listed Playtech PLC (LSE: PTEC)"],
    cons: ["Spreads are average", "Customer support is not 24/7"],
    coreInfo: { brokerType: 'Market Maker', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'Markets.com', type: 'Standard', minDeposit: 100, spreads: 'From 1.7 pips', commission: 'Zero', bestFor: 'All traders' },
    ],
    fees: {
      trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '1.7 pips' }], commissionStructure: "Spread-based", overnightSwapFees: "Standard" },
      nonTrading: { inactivityFee: "$10 per month after 3 months", withdrawalFee: "None", depositFee: "None" }
    },
    tradableInstruments: {
      forexPairs: { total: 67, details: "Majors, Minors, Exotics" },
      commodities: { total: 28, details: "Metals, Energies, Softs" },
      indices: { total: 41, details: "Global indices" },
      stocks: { total: 2000, details: "Global stock CFDs" },
      cryptocurrencies: { total: 25, details: "Major crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
      withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
      depositFees: "None",
      withdrawalFees: "None",
      processingTime: { deposits: 'Instant', withdrawals: '2-5 days' },
      minWithdrawal: 10
    },
    customerSupport: { languages: ['English', 'Spanish', 'Arabic', 'German'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'FCA', licenseNumber: '607305' }, { regulator: 'CySEC', licenseNumber: '092/08' }, { regulator: 'ASIC' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
      twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 130, slippage: "Standard", requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 80, drawingTools: 50 },
      automatedTrading: ['EAs (MT4/5)'],
      copyTrading: { available: false, platforms: [] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: true }, baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD'], mamPammSupport: false, corporateAccounts: true },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2008, tradingVolumeDisclosed: true },
    regulation: { regulators: ['FCA', 'CySEC', 'ASIC'] },
    ratings: { regulation: 9.2, costs: 8.0, platforms: 8.8, support: 8.6 },
    tradingConditions: { spreads: { eurusd: 1.7, gbpusd: 2.2, usdjpy: 1.9 }, commission: 'Zero', swapFeeCategory: 'Standard', maxLeverage: '1:300', minLotSize: 0.01 },
    accessibility: { minDeposit: 100, depositMethods: ['Credit Card', 'Skrill', 'PayPal'], withdrawalMethods: ['Credit Card', 'Skrill', 'PayPal'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['Markets.com Platform', 'MT4', 'MT5'], executionType: 'Market Maker', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: false, providesSignals: true
  },
  {
    id: 'ironfx',
    name: 'IronFX',
    logoUrl: '/broker-logos/ironfx.png',
    websiteUrl: 'https://www.ironfx.com/',
    score: 7.8,
    foundingYear: 2010,
    headquarters: 'Limassol, Cyprus',
    description: 'IronFX is a global broker with a wide reach, known for its extensive range of account types, frequent trading competitions, and high leverage options.',
    summary: 'IronFX offers an exceptionally wide range of account types and promotions, catering to diverse trader preferences. While its past regulatory issues are a concern, its CySEC-regulated entity provides a degree of security for clients under that jurisdiction.',
    pros: ["Vast selection of account types", "High leverage up to 1:1000", "Frequent trading competitions and bonuses", "Multilingual customer support"],
    cons: ["Past regulatory issues and fines", "Complex account structure can be confusing", "Spreads are not the most competitive"],
    coreInfo: { brokerType: 'STP', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'Live Floating', type: 'STP', minDeposit: 100, spreads: 'From 1.2 pips', commission: 'Zero', bestFor: 'Standard traders' },
      { name: 'Live Zero', type: 'ECN', minDeposit: 500, spreads: 'From 0.0 pips', commission: 'Varies by pair', bestFor: 'Active traders' },
    ],
    fees: {
      trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '0.2 pips + commission (Zero)' }], commissionStructure: "Commission on Zero account", overnightSwapFees: "Standard" },
      nonTrading: { inactivityFee: "$10 after 12 months", withdrawalFee: "Varies", depositFee: "Varies" }
    },
    tradableInstruments: {
      forexPairs: { total: 80, details: "Majors, Minors, Exotics" },
      commodities: { total: 20, details: "Metals, Energies" },
      indices: { total: 16, details: "Global indices" },
      stocks: { total: 150, details: "US, UK stock CFDs" },
      cryptocurrencies: { total: 0, details: "Not available" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "20%" },
    depositWithdrawal: {
      depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
      withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
      depositFees: "Varies by method",
      withdrawalFees: "Varies, can be high",
      processingTime: { deposits: 'Instant', withdrawals: '1-5 days' },
      minWithdrawal: 10
    },
    customerSupport: { languages: ['English', 'Spanish', 'Chinese', 'Arabic', '30+ others'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'CySEC', licenseNumber: '125/10' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to €20,000 (ICF)' },
      twoFactorAuth: false
    },
    tradingEnvironment: { executionSpeedMs: 150, slippage: "Standard", requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 50, drawingTools: 30 },
      automatedTrading: ['EAs (MT4)'],
      copyTrading: { available: false, platforms: [] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: true }, baseCurrencies: ['USD', 'EUR', 'GBP', 'JPY', 'CHF'], mamPammSupport: true, corporateAccounts: true },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2010, tradingVolumeDisclosed: false },
    regulation: { regulators: ['CySEC'] },
    ratings: { regulation: 7.0, costs: 7.8, platforms: 8.0, support: 8.2 },
    tradingConditions: { spreads: { eurusd: 1.2, gbpusd: 1.5, usdjpy: 1.4 }, commission: 'Varies', swapFeeCategory: 'Standard', maxLeverage: '1:1000', minLotSize: 0.01 },
    accessibility: { minDeposit: 100, depositMethods: ['Credit Card', 'Skrill'], withdrawalMethods: ['Credit Card', 'Skrill'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['MT4'], executionType: 'STP', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: false, providesSignals: true
  },
  {
    id: 'gmo-click',
    name: 'GMO Click',
    logoUrl: '/broker-logos/gmoclick.png',
    websiteUrl: 'https://www.gmo-click.com/',
    score: 8.0,
    foundingYear: 2005,
    headquarters: 'Tokyo, Japan',
    description: 'GMO Click is a major Japanese forex broker, known for being one of the world\'s largest by trading volume, offering extremely tight spreads and a robust trading infrastructure.',
    summary: 'As one of the largest brokers in the world by volume, Japan\'s GMO Click is a powerhouse for traders who prioritize tight spreads and a stable trading environment. While its services are primarily focused on the Asian market, it offers an incredibly cost-effective experience.',
    pros: ["One of the world's largest brokers by trading volume", "Extremely tight, fixed spreads", "Regulated by the stringent FSA of Japan", "No-frills, high-performance trading platforms"],
    cons: ["Primarily focused on Japanese and Asian clients", "Limited account funding options", "Website and support primarily in Japanese"],
    coreInfo: { brokerType: 'Market Maker', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'FX Neo', type: 'Standard', minDeposit: 0, spreads: 'Fixed from 0.2 pips (USD/JPY)', commission: 'Zero', bestFor: 'All traders' },
    ],
    fees: {
      trading: { spreadType: 'Fixed', averageSpreads: [{ pair: 'USD/JPY', spread: '0.2 pips' }, { pair: 'EUR/USD', spread: '0.3 pips' }], commissionStructure: "Zero commission", overnightSwapFees: "Standard" },
      nonTrading: { inactivityFee: "None", withdrawalFee: "None", depositFee: "None" }
    },
    tradableInstruments: {
      forexPairs: { total: 20, details: "Majors, Minors" },
      commodities: { total: 0, details: "Not available" },
      indices: { total: 10, details: "Global index CFDs" },
      stocks: { total: 0, details: "Not available" },
      cryptocurrencies: { total: 0, details: "Not available" }
    },
    tradingConditionsExtended: { minTradeSize: 0.1, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: false, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Bank Transfer'],
      withdrawalMethods: ['Bank Transfer'],
      depositFees: "None",
      withdrawalFees: "None",
      processingTime: { deposits: '1 day', withdrawals: '1-2 days' },
      minWithdrawal: 100
    },
    customerSupport: { languages: ['Japanese', 'English'], channels: ['Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'FSA (Japan)' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Unlimited for FX' },
      twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 50, slippage: "Low", requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 50, drawingTools: 30 },
      automatedTrading: [],
      copyTrading: { available: false, platforms: [] },
      backtesting: false,
      newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: false }, baseCurrencies: ['JPY'], mamPammSupport: false, corporateAccounts: true },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2005, tradingVolumeDisclosed: true },
    regulation: { regulators: ['FSA (Japan)'] },
    ratings: { regulation: 9.5, costs: 9.2, platforms: 8.0, support: 7.5 },
    tradingConditions: { spreads: { eurusd: 0.3, gbpusd: 0.8, usdjpy: 0.2 }, commission: 'Zero', swapFeeCategory: 'Standard', maxLeverage: '1:25', minLotSize: 0.1 },
    accessibility: { minDeposit: 0, depositMethods: ['Bank Transfer'], withdrawalMethods: ['Bank Transfer'], customerSupport: ['Phone', 'Email'] },
    technology: { platforms: ['Platinum Chart', 'FXroid Plus'], executionType: 'Market Maker', apiAccess: true, eaSupport: false },
    reviews: [], isIslamic: false, copyTrading: false, providesSignals: true
  },
  {
    id: 'gkfx',
    name: 'GKFX',
    logoUrl: '/broker-logos/gkfx.png',
    websiteUrl: 'https://www.gkfx.com/',
    score: 8.0,
    foundingYear: 2010,
    headquarters: 'London, UK',
    description: 'GKFX is a global CFD broker offering a wide range of markets on the MetaTrader platforms, backed by strong regulation in several jurisdictions.',
    summary: 'GKFX provides a classic MetaTrader experience with a decent range of markets. Its main strength lies in its multi-jurisdictional regulation, offering a sense of security, although its trading costs are fairly standard.',
    pros: ["Multi-regulated (FCA, BaFin)", "Good range of tradable assets", "Solid educational resources", "No minimum deposit"],
    cons: ["Trading costs are average", "Limited platform choice (MT4/MT5 only)"],
    coreInfo: { brokerType: 'STP', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'Standard', type: 'STP', minDeposit: 0, spreads: 'From 1.5 pips', commission: 'Zero', bestFor: 'Beginners' },
      { name: 'ECN', type: 'ECN', minDeposit: 1000, spreads: 'From 0.1 pips', commission: '$6 per round turn', bestFor: 'Active traders' },
    ],
    fees: {
      trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '1.5 pips' }], commissionStructure: "Commission on ECN account", overnightSwapFees: "Standard" },
      nonTrading: { inactivityFee: "None", withdrawalFee: "None", depositFee: "None" }
    },
    tradableInstruments: {
      forexPairs: { total: 50, details: "Majors, Minors, Exotics" },
      commodities: { total: 20, details: "Metals, Energies, Softs" },
      indices: { total: 15, details: "Global indices" },
      stocks: { total: 300, details: "US, EU stock CFDs" },
      cryptocurrencies: { total: 5, details: "Major crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
      withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
      depositFees: "None",
      withdrawalFees: "None",
      processingTime: { deposits: 'Instant', withdrawals: '1-3 days' },
      minWithdrawal: 10
    },
    customerSupport: { languages: ['English', 'German', 'Spanish'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'FCA', licenseNumber: '501320' }, { regulator: 'BaFin' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
      twoFactorAuth: false
    },
    tradingEnvironment: { executionSpeedMs: 140, slippage: "Standard", requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 50, drawingTools: 30 },
      automatedTrading: ['EAs (MT4/5)'],
      copyTrading: { available: false, platforms: [] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: true }, baseCurrencies: ['USD', 'EUR', 'GBP'], mamPammSupport: false, corporateAccounts: true },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2010, tradingVolumeDisclosed: false },
    regulation: { regulators: ['FCA', 'BaFin'] },
    ratings: { regulation: 8.9, costs: 7.8, platforms: 8.0, support: 8.2 },
    tradingConditions: { spreads: { eurusd: 1.5, gbpusd: 1.8, usdjpy: 1.6 }, commission: '$6 on ECN', swapFeeCategory: 'Standard', maxLeverage: '1:400', minLotSize: 0.01 },
    accessibility: { minDeposit: 0, depositMethods: ['Credit Card', 'Skrill'], withdrawalMethods: ['Credit Card', 'Skrill'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['MT4', 'MT5'], executionType: 'STP', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: false, providesSignals: true
  },
  {
    id: 'bitget',
    name: 'Bitget (CFD)',
    logoUrl: '/broker-logos/bitget.png',
    websiteUrl: 'https://www.bitget.com/',
    score: 8.1,
    foundingYear: 2018,
    headquarters: 'Victoria, Seychelles',
    description: 'Bitget is a leading cryptocurrency exchange that also offers CFD trading on various assets, known for its advanced copy trading features and large user base.',
    summary: 'While primarily a crypto exchange, Bitget offers a compelling CFD trading experience, especially for those interested in copy trading. Its massive social trading network is a key advantage, though its regulatory status for CFDs is not as robust as traditional forex brokers.',
    pros: ["World-leading crypto copy trading platform", "Large selection of cryptocurrency CFDs", "User-friendly platform", "Low trading fees for crypto"],
    cons: ["Regulatory oversight for CFDs is offshore", "Limited range of non-crypto assets", "Not a traditional forex broker"],
    coreInfo: { brokerType: 'ECN', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'CFD Account', type: 'ECN', minDeposit: 50, spreads: 'From 0.8 pips', commission: 'Zero', bestFor: 'Crypto and copy traders' },
    ],
    fees: {
      trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '0.8 pips' }, { pair: 'BTC/USD', spread: '$15' }], commissionStructure: "Spread-based", overnightSwapFees: "Standard" },
      nonTrading: { inactivityFee: "None", withdrawalFee: "Varies by crypto", depositFee: "None" }
    },
    tradableInstruments: {
      forexPairs: { total: 20, details: "Majors, Minors" },
      commodities: { total: 2, details: "Gold, Silver" },
      indices: { total: 5, details: "Major global indices" },
      stocks: { total: 0, details: "Not available" },
      cryptocurrencies: { total: 150, details: "Wide range of crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: false, negativeBalanceProtection: true, marginCallLevel: "80%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Crypto', 'Credit/Debit Card'],
      withdrawalMethods: ['Crypto'],
      depositFees: "None",
      withdrawalFees: "Varies by crypto network",
      processingTime: { deposits: 'Instant', withdrawals: 'Within 1 hour' },
      minWithdrawal: 10
    },
    customerSupport: { languages: ['English', 'Chinese', 'Russian'], channels: ['Live Chat', 'Tickets'], hours: '24/7' },
    security: {
      regulatedBy: [{ regulator: 'Offshore (Seychelles)' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: false },
      twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 100, slippage: "Standard", requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 70, drawingTools: 40 },
      automatedTrading: [],
      copyTrading: { available: true, platforms: ['Bitget Copy Trading'] },
      backtesting: false,
      newsIntegration: false
    },
    accountManagement: { islamicAccount: { available: false }, baseCurrencies: ['USD', 'EUR'], mamPammSupport: false, corporateAccounts: false },
    transparency: { audited: false, yearsInBusiness: new Date().getFullYear() - 2018, tradingVolumeDisclosed: true, clientBase: "20M+ users" },
    regulation: { regulators: ['Offshore (Seychelles)'] },
    ratings: { regulation: 6.0, costs: 8.5, platforms: 8.8, support: 8.0 },
    tradingConditions: { spreads: { eurusd: 0.8, gbpusd: 1.2, usdjpy: 1.0 }, commission: 'Zero', swapFeeCategory: 'Standard', maxLeverage: '1:125', minLotSize: 0.01 },
    accessibility: { minDeposit: 50, depositMethods: ['Crypto', 'Credit Card'], withdrawalMethods: ['Crypto'], customerSupport: ['24/7 Live Chat'] },
    technology: { platforms: ['Bitget Platform'], executionType: 'ECN', apiAccess: true, eaSupport: false },
    reviews: [], isIslamic: false, copyTrading: true, providesSignals: false,
    socialTrading: { popularityScore: 98, topTradersCount: 100000, platforms: ['Bitget Copy Trading'] }
  },
  {
    id: 'tradeview',
    name: 'Tradeview',
    logoUrl: '/broker-logos/tradeview.png',
    websiteUrl: 'https://www.tradeviewforex.com/',
    score: 8.6,
    foundingYear: 2004,
    headquarters: 'Grand Cayman, Cayman Islands',
    description: 'Tradeview Markets is a multi-asset online brokerage that provides direct market access (DMA) and ECN liquidity, catering to experienced traders and institutions.',
    summary: 'A strong choice for professionals seeking true ECN execution and a wide variety of platforms, including cTrader and Currenex. Its offshore regulation might be a concern for some, but its execution quality is highly regarded.',
    pros: ["True ECN/DMA execution model", "Wide range of platforms (MT4, MT5, cTrader, Currenex)", "Competitive commissions and low spreads", "No inactivity or withdrawal fees"],
    cons: ["Primary regulation is CIMA (offshore)", "High minimum deposit for some accounts"],
    coreInfo: { brokerType: 'ECN', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'Innovative Liquidity Connector (ILC)', type: 'ECN', minDeposit: 100, spreads: 'From 0.0 pips', commission: '$2.50 per lot side', bestFor: 'Active traders & scalpers' }
    ],
    fees: {
      trading: { spreadType: 'Raw', averageSpreads: [{ pair: 'EUR/USD', spread: '0.2 pips + commission' }], commissionStructure: '$2.50 per lot per side on ILC accounts', overnightSwapFees: 'Standard' },
      nonTrading: { inactivityFee: 'None', withdrawalFee: 'None', depositFee: 'None' }
    },
    tradableInstruments: {
      forexPairs: { total: 70, details: "Majors, Minors, Exotics" },
      commodities: { total: 10, details: "Metals, Energies" },
      indices: { total: 10, details: "Global indices" },
      stocks: { total: 500, details: "US Stock CFDs" },
      cryptocurrencies: { total: 10, details: "Major crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller'],
      withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller'],
      depositFees: 'None', withdrawalFees: 'None', processingTime: { deposits: 'Instant', withdrawals: '1-2 days' }, minWithdrawal: 10
    },
    customerSupport: { languages: ['English', 'Spanish', 'Chinese'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: { regulatedBy: [{ regulator: 'CIMA' }], segregatedAccounts: true, investorCompensationScheme: { available: false }, twoFactorAuth: true },
    tradingEnvironment: { executionSpeedMs: 50, slippage: 'Low', requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 80, drawingTools: 50 },
      automatedTrading: ['EAs', 'cBots'],
      copyTrading: { available: true, platforms: ['Built-in'] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: true }, baseCurrencies: ['USD', 'EUR', 'GBP', 'JPY'], mamPammSupport: true, corporateAccounts: true },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2004, tradingVolumeDisclosed: false },
    regulation: { regulators: ['CIMA'] },
    ratings: { regulation: 7.5, costs: 8.8, platforms: 9.0, support: 8.5 },
    tradingConditions: { spreads: { eurusd: 0.2, gbpusd: 0.4, usdjpy: 0.3 }, commission: '$2.50 per side', swapFeeCategory: 'Standard', maxLeverage: '1:400', minLotSize: 0.01 },
    accessibility: { minDeposit: 100, depositMethods: ['Credit Card', 'Bank Transfer', 'Skrill'], withdrawalMethods: ['Credit Card', 'Bank Transfer'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['MT4', 'MT5', 'cTrader', 'Currenex'], executionType: 'ECN', apiAccess: true, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: true, providesSignals: false
  },
  {
    id: 'nordfx',
    name: 'NordFX',
    logoUrl: '/broker-logos/nordfx.png',
    websiteUrl: 'https://nordfx.com/',
    score: 8.1,
    foundingYear: 2008,
    headquarters: 'Port Vila, Vanuatu',
    description: 'NordFX is an international broker offering various account types, including zero-spread accounts and social trading, with a focus on emerging markets.',
    summary: 'NordFX is a versatile broker popular for its low entry barriers, high leverage, and copy trading options. Its offshore regulation is a key point of consideration for traders prioritizing fund safety.',
    pros: ["Very low minimum deposit ($10)", "High leverage up to 1:1000", "Zero spread account available", "PAMM and copy trading services"],
    cons: ["Offshore regulation (VFSC)", "Limited range of non-forex instruments"],
    coreInfo: { brokerType: 'Hybrid', mobileTrading: true, demoAccount: true },
    accountTypes: [
        { name: 'Fix', type: 'Standard', minDeposit: 10, spreads: 'Fixed from 2.0 pips', commission: 'Zero', bestFor: 'Beginners or traders who prefer fixed costs' },
        { name: 'Pro', type: 'Standard', minDeposit: 10, spreads: 'From 0.9 pips', commission: 'Zero', bestFor: 'Regular traders' },
        { name: 'Zero', type: 'ECN', minDeposit: 10, spreads: 'From 0.0 pips', commission: 'From $3.5 per lot side', bestFor: 'Scalpers and EAs' }
    ],
    fees: {
      trading: { spreadType: 'Fixed', averageSpreads: [{ pair: 'EUR/USD', spread: '2.0 pips' }], commissionStructure: "Zero commission on Fix/Pro accounts", overnightSwapFees: "Standard" },
      nonTrading: { inactivityFee: "None", withdrawalFee: "None", depositFee: "None" }
    },
    tradableInstruments: {
      forexPairs: { total: 33, details: "Majors, Minors" },
      commodities: { total: 6, details: "Metals, Oil" },
      indices: { total: 11, details: "Global indices" },
      stocks: { total: 68, details: "US stock CFDs" },
      cryptocurrencies: { total: 11, details: "Major crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'Crypto'],
      withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'Crypto'],
      depositFees: 'None',
      withdrawalFees: 'None',
      processingTime: { deposits: 'Instant', withdrawals: '1-3 days' },
      minWithdrawal: 10
    },
    customerSupport: { languages: ['English', 'Chinese', 'Russian', 'Hindi'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'VFSC (Vanuatu)' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: false },
      twoFactorAuth: false
    },
    tradingEnvironment: { executionSpeedMs: 120, slippage: "Standard", requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 50, drawingTools: 30 },
      automatedTrading: ['EAs (MT4)'],
      copyTrading: { available: true, platforms: ['PAMM'] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: true }, baseCurrencies: ['USD'], mamPammSupport: true, corporateAccounts: true },
    transparency: { audited: false, yearsInBusiness: new Date().getFullYear() - 2008, tradingVolumeDisclosed: false, clientBase: "1.5M+ accounts" },
    regulation: { regulators: ['VFSC (Vanuatu)'] },
    ratings: { regulation: 6.8, costs: 8.5, platforms: 8.2, support: 8.0 },
    tradingConditions: { spreads: { eurusd: 2.0, gbpusd: 2.2, usdjpy: 2.1 }, commission: 'Zero', swapFeeCategory: 'Standard', maxLeverage: '1:1000', minLotSize: 0.01 },
    accessibility: { minDeposit: 10, depositMethods: ['Credit Card', 'Skrill', 'Crypto'], withdrawalMethods: ['Credit Card', 'Skrill', 'Crypto'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['MT4'], executionType: 'Hybrid', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: true, providesSignals: false
  },
  {
    id: 'fxopen',
    name: 'FXOpen',
    logoUrl: '/broker-logos/fxopen.png',
    websiteUrl: 'https://www.fxopen.com/',
    score: 8.4,
    foundingYear: 2005,
    headquarters: 'London, UK',
    description: 'FXOpen is a well-established ECN broker offering access to deep liquidity and competitive pricing on the MetaTrader and TickTrader platforms.',
    summary: 'FXOpen is a solid choice for experienced traders looking for a true ECN environment. Its low commissions and choice of platforms are appealing, although its educational resources are less extensive than some competitors.',
    pros: ["True ECN model with deep liquidity", "Regulated by the FCA", "Advanced TickTrader platform available", "Crypto trading and deposits supported"],
    cons: ["Limited range of stock CFDs", "Educational materials are basic"],
    coreInfo: { brokerType: 'ECN', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'ECN', type: 'ECN', minDeposit: 100, spreads: 'From 0.0 pips', commission: '$1.5 per lot side', bestFor: 'Active and algorithmic traders' }
    ],
    fees: {
      trading: { spreadType: 'Raw', averageSpreads: [{ pair: 'EUR/USD', spread: '0.2 pips + commission' }], commissionStructure: '$1.50 per lot per side', overnightSwapFees: 'Standard' },
      nonTrading: { inactivityFee: '$10 per month after 90 days', withdrawalFee: 'Varies by method', depositFee: 'None' }
    },
    tradableInstruments: {
      forexPairs: { total: 50, details: "Majors, Minors, Exotics" },
      commodities: { total: 8, details: "Metals, Energies" },
      indices: { total: 11, details: "Global indices" },
      stocks: { total: 100, details: "US stock CFDs" },
      cryptocurrencies: { total: 43, details: "Wide range of crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
      depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Crypto'],
      withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Crypto'],
      depositFees: 'None', withdrawalFees: 'Varies', processingTime: { deposits: 'Instant', withdrawals: '1-3 days' }, minWithdrawal: 10
    },
    customerSupport: { languages: ['English', 'Russian', 'Spanish', 'Chinese'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: {
      regulatedBy: [{ regulator: 'FCA', licenseNumber: '579202' }, { regulator: 'ASIC' }],
      segregatedAccounts: true,
      investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
      twoFactorAuth: true
    },
    tradingEnvironment: { executionSpeedMs: 60, slippage: "Low", requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
      charting: { indicators: 50, drawingTools: 30 },
      automatedTrading: ['EAs (MT4/5)'],
      copyTrading: { available: true, platforms: ['Myfxbook', 'ZuluTrade'] },
      backtesting: true,
      newsIntegration: false
    },
    accountManagement: { islamicAccount: { available: true }, baseCurrencies: ['USD', 'EUR', 'GBP', 'JPY'], mamPammSupport: true, corporateAccounts: true },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2005, tradingVolumeDisclosed: false },
    regulation: { regulators: ['FCA', 'ASIC'] },
    ratings: { regulation: 9.0, costs: 8.5, platforms: 8.2, support: 8.0 },
    tradingConditions: { 
      spreads: { eurusd: 0.2, gbpusd: 0.5, usdjpy: 0.3 }, 
      commission: '$3.00 round trip', 
      swapFeeCategory: 'Standard', 
      maxLeverage: '1:500', 
      minLotSize: 0.01 
    },
    accessibility: { 
      minDeposit: 100, 
      depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Crypto'], 
      withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Crypto'], 
      customerSupport: ['Live Chat', 'Phone', 'Email'] 
    },
    technology: { 
      platforms: ['MT4', 'MT5', 'TickTrader'], 
      executionType: 'ECN', 
      apiAccess: false, 
      eaSupport: true 
    },
    reviews: [], 
    isIslamic: true, 
    copyTrading: true, 
    providesSignals: false
  },
  {
    id: 'royal',
    name: 'Royal',
    logoUrl: '/broker-logos/royal.png',
    websiteUrl: 'https://www.royal.com/',
    score: 8.5,
    foundingYear: 2018,
    headquarters: 'Kingstown, St. Vincent & Grenadines',
    description: 'Royal is a modern forex and CFD broker offering competitive trading conditions with a focus on technology and customer service.',
    summary: 'Royal provides traders with access to global markets through multiple trading platforms, competitive spreads, and a wide range of tradable instruments. With regulatory oversight and strong risk management features, it caters to both beginner and experienced traders.',
    pros: [
        "Competitive spreads from 0.0 pips",
        "Multiple regulatory licenses",
        "Wide range of trading platforms",
        "Fast account opening process",
        "Educational resources for traders",
        "24/7 customer support"
    ],
    cons: [
        "Limited cryptocurrency offerings",
        "Higher inactivity fees after 3 months",
        "No guaranteed stop-loss orders",
        "Minimum deposit requirement for some accounts"
    ],
    coreInfo: {
        brokerType: 'STP/ECN',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'STP', minDeposit: 50, spreads: 'From 1.0 pips', commission: 'Zero commission', bestFor: 'Beginners and casual traders' },
        { name: 'Royal Account', type: 'ECN', minDeposit: 500, spreads: 'From 0.0 pips', commission: '$3 per lot per side', bestFor: 'Active traders and scalpers' },
        { name: 'VIP Account', type: 'ECN', minDeposit: 25000, spreads: 'From 0.0 pips', commission: '$2 per lot per side', bestFor: 'Professional and institutional traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.1 pips + commission' },
                { pair: 'GBP/USD', spread: '0.3 pips + commission' },
                { pair: 'Gold', spread: '15 cents' }
            ],
            commissionStructure: "$3 per lot per side on Royal Account. $2 on VIP Account.",
            overnightSwapFees: "Competitive, varies by instrument. Islamic accounts available."
        },
        nonTrading: {
            inactivityFee: "$15 per month after 3 months of inactivity",
            withdrawalFee: "None for most methods. Bank transfers may incur fees.",
            depositFee: "None. Royal covers payment processing fees."
        }
    },
    tradableInstruments: {
        forexPairs: { total: 50, details: "Major, Minor, and Exotic currency pairs" },
        commodities: { total: 15, details: "Gold, Silver, Oil, and other commodities" },
        indices: { total: 20, details: "Global stock indices including US30, UK100" },
        stocks: { total: 150, details: "US and European Stock CFDs" },
        cryptocurrencies: { total: 5, details: "BTC, ETH, and major cryptocurrencies" },
        etfs: { total: 0, details: "Not available" }
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
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Crypto'],
        depositFees: "None",
        withdrawalFees: "None from Royal's side for e-wallets",
        processingTime: {
            deposits: "Instant for cards and e-wallets",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 50
    },
    customerSupport: {
        languages: ['English', 'Spanish', 'Chinese', 'Arabic', 'Russian'],
        channels: ['Live Chat', 'Phone', 'Email', 'Ticket System'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'FSA', licenseNumber: '25883 BC 2020' },
            { regulator: 'CySEC', licenseNumber: '395/20' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to €20,000 (CySEC)' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        platforms: ['MT4', 'MT5', 'Royal WebTrader', 'Royal Mobile App'],
        minimumDeposit: 50,
        baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD'],
        leverage: 'Up to 1:500',
        education: ['Video tutorials', 'Webinars', 'E-books', 'Market analysis'],
        researchTools: ['Economic calendar', 'Market news', 'Trading signals', 'VPS hosting']
    },
    tradingConditions: {
        spreads: { eurusd: 0.6, gbpusd: 0.9, usdjpy: 0.7 },
        commission: 'From $3.50 per lot on ECN accounts',
        swapFeeCategory: 'Standard',
        maxLeverage: '1:500',
        minLotSize: 0.01
    },
    regulation: {
        regulators: ['FSA', 'CySEC'],
        jurisdictions: ['International', 'Cyprus', 'UK'],
        regulatoryStatus: 'Fully Regulated'
    },
    accessibility: {
        minDeposit: 50,
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Crypto'],
        customerSupport: ['Live Chat', 'Phone', 'Email', 'Ticket System']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'Royal WebTrader', 'Royal Mobile App'],
        executionType: 'STP/ECN',
        apiAccess: false,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: true
  },
  {
    id: 'captrader',
    name: 'CapTrader',
    logoUrl: '/broker-logos/captrader.png',
    websiteUrl: 'https://www.captrader.com/',
    score: 8.7,
    foundingYear: 2015,
    headquarters: 'Limassol, Cyprus',
    description: 'CapTrader is a European forex and CFD broker known for its competitive pricing, advanced trading technology, and strong regulatory framework.',
    summary: 'CapTrader offers institutional-grade trading conditions to retail clients through multiple asset classes and trading platforms. With BaFin regulation and negative balance protection, it provides a secure trading environment for European traders.',
    pros: [
        "BaFin regulation provides high security",
        "Raw spreads from 0.0 pips",
        "Deep liquidity from multiple liquidity providers",
        "Negative balance protection",
        "Professional trading tools and analytics",
        "No deposit fees"
    ],
    cons: [
        "Limited cryptocurrency selection",
        "No social or copy trading features",
        "Higher minimum deposit for raw spreads",
        "Weekend trading not available"
    ],
    coreInfo: {
        brokerType: 'ECN',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'STP', minDeposit: 100, spreads: 'From 1.0 pips', commission: 'Zero commission', bestFor: 'Beginners and long-term traders' },
        { name: 'Pro Account', type: 'ECN', minDeposit: 1000, spreads: 'From 0.1 pips', commission: '$3.5 per lot per side', bestFor: 'Active traders and scalpers' },
        { name: 'Institutional Account', type: 'ECN', minDeposit: 50000, spreads: 'From 0.0 pips', commission: '$2 per lot per side', bestFor: 'Professional and institutional traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Raw',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.1 pips + commission' },
                { pair: 'GBP/USD', spread: '0.2 pips + commission' },
                { pair: 'Gold', spread: '10 cents' }
            ],
            commissionStructure: "$3.5 per lot per side on Pro Account. $2 on Institutional Account.",
            overnightSwapFees: "Transparent, competitive swap rates. Islamic accounts available."
        },
        nonTrading: {
            inactivityFee: "None",
            withdrawalFee: "None for most methods",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { total: 60, details: "Major, Minor, and Exotic currency pairs" },
        commodities: { total: 20, details: "Energy, Metals, Agricultural products" },
        indices: { total: 25, details: "Global indices from US, Europe, Asia" },
        stocks: { total: 500, details: "Stock CFDs from major exchanges" },
        cryptocurrencies: { total: 8, details: "Major cryptocurrencies including BTC, ETH" },
        etfs: { total: 50, details: "ETF CFDs tracking various sectors" }
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
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Trustly', 'Sofort'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Trustly', 'Sofort'],
        depositFees: "None",
        withdrawalFees: "None from CapTrader's side",
        processingTime: {
            deposits: "Instant for cards and e-wallets",
            withdrawals: "1-2 business days"
        },
        minWithdrawal: 50
    },
    customerSupport: {
        languages: ['English', 'German', 'French', 'Spanish', 'Italian'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'BaFin', licenseNumber: '154387' },
            { regulator: 'CySEC', licenseNumber: '387/20' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to €20,000 (CySEC)' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        platforms: ['MT4', 'MT5', 'CapTrader WebTrader', 'CapTrader Mobile App'],
        minimumDeposit: 100,
        baseCurrencies: ['EUR', 'USD', 'GBP'],
        leverage: 'Up to 1:30 (EU), 1:500 (International)',
        education: ['Trading guides', 'Video tutorials', 'Webinars', 'Market analysis'],
        researchTools: ['Economic calendar', 'Market news', 'Trading signals', 'Autochartist']
    },
    tradingConditions: {
        spreads: { eurusd: 0.0, gbpusd: 0.2, usdjpy: 0.1 },
        commission: '$3.50 per side per standard lot',
        swapFeeCategory: 'Low',
        maxLeverage: '1:30 (EU), 1:500 (International)',
        minLotSize: 0.01
    },
    regulation: {
        regulators: ['BaFin', 'CySEC'],
        jurisdictions: ['Germany', 'Cyprus', 'EU'],
        regulatoryStatus: 'Fully Regulated'
    },
    accessibility: {
        minDeposit: 100,
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Trustly', 'Sofort'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Trustly', 'Sofort'],
        customerSupport: ['Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'CapTrader WebTrader', 'CapTrader Mobile App'],
        executionType: 'ECN',
        apiAccess: false,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: true
  },
  {
    id: 'mexem',
    name: 'Mexem',
    logoUrl: '/broker-logos/mexem.png',
    websiteUrl: 'https://www.mexem.com/',
    score: 8.3,
    foundingYear: 2017,
    headquarters: 'Port Vila, Vanuatu',
    description: 'Mexem is an international forex and CFD broker offering access to global markets with competitive trading conditions and multiple account types.',
    summary: 'Mexem provides traders with access to over 1000 trading instruments across multiple asset classes. With VFSC regulation and competitive spreads, it caters to traders looking for diverse market access and flexible trading conditions.',
    pros: [
        "Over 1000 trading instruments",
        "Competitive spreads and commissions",
        "Multiple regulatory licenses",
        "Fast trade execution",
        "Islamic accounts available",
        "Educational resources"
    ],
    cons: [
        "Limited European client acceptance",
        "No guaranteed stop-loss",
        "Higher minimum deposit for some accounts",
        "Limited research tools"
    ],
    coreInfo: {
        brokerType: 'Market Maker/STP',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Micro Account', type: 'Market Maker', minDeposit: 10, spreads: 'From 1.5 pips', commission: 'Zero commission', bestFor: 'Beginners and micro traders' },
        { name: 'Standard Account', type: 'STP', minDeposit: 100, spreads: 'From 1.0 pips', commission: 'Zero commission', bestFor: 'Most traders' },
        { name: 'ECN Account', type: 'ECN', minDeposit: 500, spreads: 'From 0.1 pips', commission: '$3 per lot per side', bestFor: 'Active traders and scalpers' }
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.8 pips (Standard)' },
                { pair: 'GBP/USD', spread: '1.2 pips (Standard)' },
                { pair: 'Gold', spread: '20 cents' }
            ],
            commissionStructure: "$3 per lot per side on ECN Account. Zero commission on Standard and Micro.",
            overnightSwapFees: "Standard industry rates. Islamic accounts swap-free."
        },
        nonTrading: {
            inactivityFee: "$10 per month after 6 months",
            withdrawalFee: "None for most methods. Bank transfers $25.",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { total: 70, details: "Major, Minor, and Exotic pairs" },
        commodities: { total: 25, details: "Energy, Metals, Soft commodities" },
        indices: { total: 30, details: "Global stock indices" },
        stocks: { total: 800, details: "Stock CFDs from US, EU, Asia" },
        cryptocurrencies: { total: 15, details: "Major and emerging cryptocurrencies" },
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
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Perfect Money', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Perfect Money', 'Crypto'],
        depositFees: "None",
        withdrawalFees: "None for e-wallets. Bank transfers $25.",
        processingTime: {
            deposits: "Instant for cards and e-wallets",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 20
    },
    customerSupport: {
        languages: ['English', 'Spanish', 'Portuguese', 'Russian', 'Arabic', 'Chinese'],
        channels: ['Live Chat', 'Phone', 'Email', 'Ticket System'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'VFSC', licenseNumber: '700268' },
            { regulator: 'FSA', licenseNumber: 'SD008' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: false, amount: 'N/A' },
        twoFactorAuth: true
    },
    tradingConditions: {
        spreads: { eurusd: 0.8, gbpusd: 1.2, usdjpy: 0.9 },
        commission: 'From $3.00 per lot on ECN accounts',
        swapFeeCategory: 'Standard',
        maxLeverage: '1:1000',
        minLotSize: 0.01
    },
    tradingEnvironment: {
        platforms: ['MT4', 'MT5', 'Mexem WebTrader', 'Mexem Mobile App'],
        minimumDeposit: 10,
        baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD'],
        leverage: 'Up to 1:1000',
        education: ['Video tutorials', 'Trading guides', 'E-books', 'Webinars'],
        researchTools: ['Economic calendar', 'Market news', 'Technical analysis']
    },
    regulation: {
        regulators: ['VFSC', 'FSA'],
        jurisdictions: ['Vanuatu', 'International'],
        regulatoryStatus: 'Offshore Regulated'
    },
    accessibility: {
        minDeposit: 10,
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Perfect Money', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Perfect Money', 'Crypto'],
        customerSupport: ['Live Chat', 'Phone', 'Email', 'Ticket System']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'Mexem WebTrader', 'Mexem Mobile App'],
        executionType: 'Market Maker/STP',
        apiAccess: false,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'trading212',
    name: 'Trading 212',
    logoUrl: '/broker-logos/trading212.png',
    websiteUrl: 'https://www.trading212.com/',
    score: 8.9,
    foundingYear: 2004,
    headquarters: 'London, UK',
    description: 'Trading 212 is a UK-based investment platform offering commission-free trading on stocks, ETFs, forex, and CFDs with FCA regulation.',
    summary: 'Trading 212 revolutionized the industry by introducing commission-free trading on stocks and ETFs. As an FCA-regulated broker with over 2 million clients, it offers a user-friendly platform suitable for both beginners and experienced traders.',
    pros: [
        "FCA regulation provides high security",
        "Commission-free stock and ETF trading",
        "No minimum deposit requirement",
        "Fractional shares available",
        "Intuitive mobile and web platforms",
        "Pies feature for automated investing"
    ],
    cons: [
        "Limited cryptocurrency offering",
        "No guaranteed stop-loss orders",
        "Weekend trading not available",
        "Limited advanced trading tools"
    ],
    coreInfo: {
        brokerType: 'Market Maker',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Invest Account', type: 'Market Maker', minDeposit: 1, spreads: 'Variable', commission: 'Zero commission', bestFor: 'Long-term investors and beginners' },
        { name: 'CFD Account', type: 'Market Maker', minDeposit: 1, spreads: 'Variable', commission: 'Zero commission', bestFor: 'Short-term traders and speculators' },
        { name: 'ISA Account', type: 'Market Maker', minDeposit: 1, spreads: 'Variable', commission: 'Zero commission', bestFor: 'UK tax-efficient investing' }
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.7 pips' },
                { pair: 'GBP/USD', spread: '0.9 pips' },
                { pair: 'Gold', spread: '25 cents' }
            ],
            commissionStructure: "Zero commission on stocks, ETFs, and CFDs",
            overnightSwapFees: "Applied to CFD positions held overnight. ISA accounts exempt."
        },
        nonTrading: {
            inactivityFee: "None",
            withdrawalFee: "None",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { total: 50, details: "Major and Minor currency pairs" },
        commodities: { total: 15, details: "Gold, Silver, Oil, and commodities" },
        indices: { total: 20, details: "Major global indices" },
        stocks: { total: 5000, details: "Stocks from US, UK, and European exchanges" },
        cryptocurrencies: { total: 10, details: "Major cryptocurrencies" },
        etfs: { total: 1000, details: "ETFs tracking various sectors and indices" }
    },
    tradingConditionsExtended: {
        minTradeSize: 0.01,
        scalpingAllowed: false,
        hedgingAllowed: true,
        eaAllowed: false,
        negativeBalanceProtection: true,
        marginCallLevel: "50%",
        stopOutLevel: "25%"
    },
    depositWithdrawal: {
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Trustly', 'Sofort', 'Apple Pay', 'Google Pay'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Trustly', 'Sofort'],
        depositFees: "None",
        withdrawalFees: "None",
        processingTime: {
            deposits: "Instant for cards and e-wallets",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 1
    },
    customerSupport: {
        languages: ['English', 'German', 'French', 'Spanish', 'Italian', 'Polish'],
        channels: ['Email', 'Ticket System', 'Help Center'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'FCA', licenseNumber: '609146' },
            { regulator: 'FSC', licenseNumber: 'SD060' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
        twoFactorAuth: true
    },
    tradingConditions: {
        spreads: { eurusd: 0.6, gbpusd: 0.8, usdjpy: 0.7 },
        commission: 'Zero commission on stocks, ETFs, and forex',
        swapFeeCategory: 'Standard',
        maxLeverage: '1:30 (EU), 1:500 (Professional)',
        minLotSize: 0.01
    },
    tradingEnvironment: {
        platforms: ['Trading 212 Web Platform', 'Trading 212 Mobile App'],
        minimumDeposit: 1,
        baseCurrencies: ['GBP', 'EUR', 'USD'],
        leverage: 'Up to 1:30 (EU), 1:500 (Professional)',
        education: ['Trading guides', 'Video tutorials', 'Glossary', 'Market analysis'],
        researchTools: ['Economic calendar', 'Market news', 'Company analysis']
    },
    regulation: {
        regulators: ['FCA', 'FSC'],
        jurisdictions: ['UK', 'Bulgaria', 'EU'],
        regulatoryStatus: 'Fully Regulated'
    },
    accessibility: {
        minDeposit: 1,
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Trustly', 'Sofort', 'Apple Pay', 'Google Pay'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Trustly', 'Sofort'],
        customerSupport: ['Email', 'Ticket System', 'Help Center']
    },
    technology: {
        platforms: ['Trading 212 Web Platform', 'Trading 212 Mobile App'],
        executionType: 'Market Maker',
        apiAccess: false,
        eaSupport: false
    },
    reviews: [],
    isIslamic: false,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'vt-markets',
    name: 'VT Markets',
    logoUrl: '/broker-logos/vt-markets.png',
    websiteUrl: 'https://www.vtmarkets.com/',
    score: 8.4,
    foundingYear: 2015,
    headquarters: 'Sydney, Australia',
    description: 'VT Markets is an Australian forex and CFD broker offering competitive trading conditions with ASIC regulation and multiple account types.',
    summary: 'VT Markets provides traders with access to global financial markets through MetaTrader platforms. With ASIC regulation and negative balance protection, it offers a secure trading environment suitable for traders of all experience levels.',
    pros: [
        "ASIC regulation provides high security",
        "Competitive spreads from 0.0 pips",
        "Multiple account types to suit different traders",
        "Fast trade execution speeds",
        "Islamic accounts available",
        "Comprehensive educational resources"
    ],
    cons: [
        "Limited cryptocurrency selection",
        "No guaranteed stop-loss orders",
        "Higher minimum deposit for ECN accounts",
        "Limited advanced trading platforms"
    ],
    coreInfo: {
        brokerType: 'ECN/STP',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard STP Account', type: 'STP', minDeposit: 100, spreads: 'From 1.0 pips', commission: 'Zero commission', bestFor: 'Beginners and casual traders' },
        { name: 'Raw ECN Account', type: 'ECN', minDeposit: 500, spreads: 'From 0.0 pips', commission: '$3.5 per lot per side', bestFor: 'Active traders and scalpers' },
        { name: 'Pro ECN Account', type: 'ECN', minDeposit: 20000, spreads: 'From 0.0 pips', commission: '$2.5 per lot per side', bestFor: 'Professional and institutional traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Raw/Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.1 pips + commission (ECN)' },
                { pair: 'GBP/USD', spread: '0.3 pips + commission (ECN)' },
                { pair: 'Gold', spread: '12 cents' }
            ],
            commissionStructure: "$3.5 per lot per side on Raw ECN. $2.5 on Pro ECN.",
            overnightSwapFees: "Competitive swap rates. Islamic accounts swap-free."
        },
        nonTrading: {
            inactivityFee: "None",
            withdrawalFee: "None for most methods. Bank transfers may incur fees.",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { total: 55, details: "Major, Minor, and Exotic currency pairs" },
        commodities: { total: 18, details: "Gold, Silver, Oil, and other commodities" },
        indices: { total: 22, details: "Global stock indices" },
        stocks: { total: 300, details: "Stock CFDs from major exchanges" },
        cryptocurrencies: { total: 8, details: "Major cryptocurrencies" },
        etfs: { total: 0, details: "Not available" }
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
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'FasaPay', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'FasaPay', 'Crypto'],
        depositFees: "None",
        withdrawalFees: "None from VT Markets side",
        processingTime: {
            deposits: "Instant for cards and e-wallets",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 50
    },
    customerSupport: {
        languages: ['English', 'Chinese', 'Vietnamese', 'Thai', 'Indonesian', 'Malay'],
        channels: ['Live Chat', 'Phone', 'Email', 'WhatsApp'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'ASIC', licenseNumber: '426909' },
            { regulator: 'VFSC', licenseNumber: '15624' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to AU$50,000 (ASIC)' },
        twoFactorAuth: true
    },
    tradingConditions: {
        spreads: { eurusd: 0.0, gbpusd: 0.5, usdjpy: 0.3 },
        commission: 'From $3.00 per side per standard lot',
        swapFeeCategory: 'Standard',
        maxLeverage: '1:500',
        minLotSize: 0.01
    },
    tradingEnvironment: {
        platforms: ['MT4', 'MT5', 'VT Markets Mobile App'],
        minimumDeposit: 100,
        baseCurrencies: ['USD', 'EUR', 'AUD', 'GBP'],
        leverage: 'Up to 1:500',
        education: ['Video tutorials', 'Trading guides', 'Webinars', 'Market analysis'],
        researchTools: ['Economic calendar', 'Market news', 'Technical analysis', 'VPS hosting']
    },
    regulation: {
        regulators: ['ASIC', 'VFSC'],
        jurisdictions: ['Australia', 'Vanuatu', 'International'],
        regulatoryStatus: 'Fully Regulated'
    },
    accessibility: {
        minDeposit: 100,
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'FasaPay', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'FasaPay', 'Crypto'],
        customerSupport: ['Live Chat', 'Phone', 'Email', 'WhatsApp']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'VT Markets Mobile App'],
        executionType: 'ECN/STP',
        apiAccess: false,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'tmgm',
    name: 'TMGM',
    logoUrl: '/broker-logos/tmgm.png',
    websiteUrl: 'https://www.tmgm.com/',
    score: 8.6,
    foundingYear: 2013,
    headquarters: 'Auckland, New Zealand',
    description: 'TMGM (Trademax Global Markets) is a New Zealand-based forex and CFD broker offering competitive trading conditions with multiple regulatory licenses.',
    summary: 'TMGM provides traders with access to over 12,000 trading instruments across multiple asset classes. With FMA regulation and institutional-grade liquidity, it caters to both retail and institutional traders seeking competitive pricing and reliable execution.',
    pros: [
        "FMA regulation provides high security",
        "Over 12,000 trading instruments available",
        "Raw spreads from 0.0 pips",
        "Deep institutional liquidity",
        "Multiple regulatory licenses",
        "Advanced trading tools"
    ],
    cons: [
        "Complex fee structure for some instruments",
        "Limited cryptocurrency selection",
        "No guaranteed stop-loss orders",
        "Higher minimum deposit for professional accounts"
    ],
    coreInfo: {
        brokerType: 'ECN',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Classic Account', type: 'STP', minDeposit: 100, spreads: 'From 1.0 pips', commission: 'Zero commission', bestFor: 'Beginners and long-term traders' },
        { name: 'Premium Account', type: 'ECN', minDeposit: 1000, spreads: 'From 0.0 pips', commission: '$3 per lot per side', bestFor: 'Active traders' },
        { name: 'Institutional Account', type: 'ECN', minDeposit: 50000, spreads: 'From 0.0 pips', commission: '$2 per lot per side', bestFor: 'Professional traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Raw',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.1 pips + commission' },
                { pair: 'GBP/USD', spread: '0.2 pips + commission' },
                { pair: 'Gold', spread: '10 cents' }
            ],
            commissionStructure: "$3 per lot per side on Premium Account. $2 on Institutional Account.",
            overnightSwapFees: "Competitive swap rates. Islamic accounts available."
        },
        nonTrading: {
            inactivityFee: "None",
            withdrawalFee: "None for most methods",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { total: 60, details: "Major, Minor, and Exotic pairs" },
        commodities: { total: 25, details: "Energy, Metals, Agricultural products" },
        indices: { total: 30, details: "Global indices from US, Europe, Asia" },
        stocks: { total: 2000, details: "Stock CFDs from major exchanges" },
        cryptocurrencies: { total: 10, details: "Major cryptocurrencies" },
        etfs: { total: 200, details: "Various ETF CFDs" }
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
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'SticPay', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'SticPay', 'Crypto'],
        depositFees: "None",
        withdrawalFees: "None from TMGM side",
        processingTime: {
            deposits: "Instant for cards and e-wallets",
            withdrawals: "1-2 business days"
        },
        minWithdrawal: 50
    },
    customerSupport: {
        languages: ['English', 'Chinese', 'Arabic', 'Spanish', 'Portuguese', 'Vietnamese'],
        channels: ['Live Chat', 'Phone', 'Email', 'WhatsApp'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'FMA', licenseNumber: 'FSP563526' },
            { regulator: 'ASIC', licenseNumber: '436416' },
            { regulator: 'VFSC', licenseNumber: '14659' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to NZ$500,000 (FMA)' },
        twoFactorAuth: true
    },
    tradingConditions: {
        spreads: { eurusd: 0.0, gbpusd: 0.4, usdjpy: 0.3 },
        commission: 'From $3.50 per side per standard lot',
        swapFeeCategory: 'Standard',
        maxLeverage: '1:500',
        minLotSize: 0.01
    },
    tradingEnvironment: {
        platforms: ['MT4', 'MT5', 'TMGM Trader', 'TMGM Mobile App'],
        minimumDeposit: 100,
        baseCurrencies: ['NZD', 'USD', 'EUR', 'AUD', 'GBP'],
        leverage: 'Up to 1:500',
        education: ['Trading guides', 'Video tutorials', 'Webinars', 'Market analysis'],
        researchTools: ['Economic calendar', 'Market news', 'Trading signals', 'Autochartist']
    },
    regulation: {
        regulators: ['FMA', 'ASIC', 'VFSC'],
        jurisdictions: ['New Zealand', 'Australia', 'Vanuatu', 'International'],
        regulatoryStatus: 'Fully Regulated'
    },
    accessibility: {
        minDeposit: 100,
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'SticPay', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'SticPay', 'Crypto'],
        customerSupport: ['Live Chat', 'Phone', 'Email', 'WhatsApp']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'TMGM Trader', 'TMGM Mobile App'],
        executionType: 'ECN',
        apiAccess: false,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: true
  },
  {
    id: 'trade-nation',
    name: 'Trade Nation',
    logoUrl: '/broker-logos/trade-nation.png',
    websiteUrl: 'https://www.tradenation.com/',
    score: 8.8,
    foundingYear: 2014,
    headquarters: 'London, UK',
    description: 'Trade Nation is a UK-based forex and CFD broker known for its transparent pricing, excellent customer service, and strong regulatory framework.',
    summary: 'Trade Nation offers fixed spreads and transparent pricing with FCA and ASIC regulation. Known for exceptional customer service and educational resources, it provides a reliable trading environment suitable for traders of all levels.',
    pros: [
        "FCA and ASIC dual regulation",
        "Fixed spreads provide cost certainty",
        "Exceptional customer service",
        "No hidden fees or commissions",
        "Comprehensive educational resources",
        "Negative balance protection"
    ],
    cons: [
        "Limited cryptocurrency offering",
        "No ECN account options",
        "Fewer trading platforms",
        "Limited advanced trading tools"
    ],
    coreInfo: {
        brokerType: 'Market Maker',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'Market Maker', minDeposit: 1, spreads: 'Fixed from 0.6 pips', commission: 'Zero commission', bestFor: 'Beginners and most traders' },
        { name: 'Professional Account', type: 'Market Maker', minDeposit: 10000, spreads: 'Fixed from 0.6 pips', commission: 'Zero commission', bestFor: 'Experienced traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Fixed',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.6 pips' },
                { pair: 'GBP/USD', spread: '0.8 pips' },
                { pair: 'Gold', spread: '20 cents' }
            ],
            commissionStructure: "Zero commission on all accounts",
            overnightSwapFees: "Transparent fixed swap rates. Islamic accounts available."
        },
        nonTrading: {
            inactivityFee: "None",
            withdrawalFee: "None",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { total: 35, details: "Major and Minor currency pairs" },
        commodities: { total: 12, details: "Gold, Silver, Oil, and key commodities" },
        indices: { total: 15, details: "Major global indices" },
        stocks: { total: 100, details: "Major stock CFDs" },
        cryptocurrencies: { total: 0, details: "Not available" },
        etfs: { total: 0, details: "Not available" }
    },
    tradingConditionsExtended: {
        minTradeSize: 0.01,
        scalpingAllowed: false,
        hedgingAllowed: true,
        eaAllowed: false,
        negativeBalanceProtection: true,
        marginCallLevel: "100%",
        stopOutLevel: "50%"
    },
    depositWithdrawal: {
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Trustly', 'Sofort'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Trustly', 'Sofort'],
        depositFees: "None",
        withdrawalFees: "None",
        processingTime: {
            deposits: "Instant for cards and e-wallets",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 1
    },
    customerSupport: {
        languages: ['English', 'German', 'French', 'Spanish', 'Italian'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'FCA', licenseNumber: '538324' },
            { regulator: 'ASIC', licenseNumber: '433927' },
            { regulator: 'FSCA', licenseNumber: '49846' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
        twoFactorAuth: true
    },
    tradingConditions: {
        spreads: { eurusd: 0.6, gbpusd: 0.9, usdjpy: 0.7 },
        commission: 'Fixed spreads, no commission',
        swapFeeCategory: 'Standard',
        maxLeverage: '1:30 (EU), 1:300 (International)',
        minLotSize: 0.01
    },
    tradingEnvironment: {
        platforms: ['MT4', 'MT5', 'Trade Nation Mobile App'],
        minimumDeposit: 1,
        baseCurrencies: ['GBP', 'EUR', 'USD', 'AUD'],
        leverage: 'Up to 1:30 (EU), 1:300 (International)',
        education: ['Video tutorials', 'Trading guides', 'Webinars', '1-on-1 training'],
        researchTools: ['Economic calendar', 'Market news', 'Trading signals']
    },
    regulation: {
        regulators: ['FCA', 'ASIC', 'FSCA'],
        jurisdictions: ['UK', 'Australia', 'South Africa', 'EU'],
        regulatoryStatus: 'Fully Regulated'
    },
    accessibility: {
        minDeposit: 1,
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Trustly', 'Sofort'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Trustly', 'Sofort'],
        customerSupport: ['Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'Trade Nation Mobile App'],
        executionType: 'Market Maker',
        apiAccess: false,
        eaSupport: false
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: true
  },
  {
    id: 'fx-trading',
    name: 'FX Trading.com',
    logoUrl: '/broker-logos/fx-trading.png',
    websiteUrl: 'https://www.fxtrading.com/',
    score: 8.2,
    foundingYear: 2016,
    headquarters: 'Port Vila, Vanuatu',
    description: 'FX Trading.com is an international forex and CFD broker offering competitive trading conditions with multiple account types and regulatory oversight.',
    summary: 'FX Trading.com provides traders with access to global financial markets through multiple trading platforms. With VFSC regulation and competitive pricing, it caters to traders seeking diverse market access and flexible trading conditions.',
    pros: [
        "Competitive spreads and commissions",
        "Multiple regulatory licenses",
        "Wide range of trading instruments",
        "Fast trade execution",
        "Islamic accounts available",
        "Multiple payment methods"
    ],
    cons: [
        "Offshore regulation (Vanuatu)",
        "No guaranteed stop-loss orders",
        "Limited European client acceptance",
        "Higher minimum deposit for ECN accounts"
    ],
    coreInfo: {
        brokerType: 'ECN/STP',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'STP', minDeposit: 100, spreads: 'From 1.0 pips', commission: 'Zero commission', bestFor: 'Beginners and casual traders' },
        { name: 'ECN Account', type: 'ECN', minDeposit: 500, spreads: 'From 0.1 pips', commission: '$3 per lot per side', bestFor: 'Active traders and scalpers' },
        { name: 'VIP Account', type: 'ECN', minDeposit: 10000, spreads: 'From 0.0 pips', commission: '$2 per lot per side', bestFor: 'Professional traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Raw/Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.1 pips + commission (ECN)' },
                { pair: 'GBP/USD', spread: '0.3 pips + commission (ECN)' },
                { pair: 'Gold', spread: '15 cents' }
            ],
            commissionStructure: "$3 per lot per side on ECN Account. $2 on VIP Account.",
            overnightSwapFees: "Standard industry rates. Islamic accounts swap-free."
        },
        nonTrading: {
            inactivityFee: "$10 per month after 6 months",
            withdrawalFee: "None for e-wallets. Bank transfers $25.",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { total: 65, details: "Major, Minor, and Exotic currency pairs" },
        commodities: { total: 20, details: "Energy, Metals, Agricultural products" },
        indices: { total: 25, details: "Global stock indices" },
        stocks: { total: 400, details: "Stock CFDs from US, EU, Asia" },
        cryptocurrencies: { total: 12, details: "Major and emerging cryptocurrencies" },
        etfs: { total: 80, details: "Various ETF CFDs" }
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
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Perfect Money', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Perfect Money', 'Crypto'],
        depositFees: "None",
        withdrawalFees: "None for e-wallets. Bank transfers $25.",
        processingTime: {
            deposits: "Instant for cards and e-wallets",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 25
    },
    customerSupport: {
        languages: ['English', 'Chinese', 'Spanish', 'Portuguese', 'Arabic', 'Russian'],
        channels: ['Live Chat', 'Phone', 'Email', 'Ticket System'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'VFSC', licenseNumber: '700268' },
            { regulator: 'FSA', licenseNumber: 'SD008' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: false, amount: 'N/A' },
        twoFactorAuth: true
    },
    tradingConditions: {
        spreads: { eurusd: 0.8, gbpusd: 1.2, usdjpy: 0.9 },
        commission: 'From $3.50 per lot on ECN accounts',
        swapFeeCategory: 'Standard',
        maxLeverage: '1:500',
        minLotSize: 0.01
    },
    tradingEnvironment: {
        platforms: ['MT4', 'MT5', 'FX Trading WebTrader', 'FX Trading Mobile App'],
        minimumDeposit: 100,
        baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD'],
        leverage: 'Up to 1:500',
        education: ['Video tutorials', 'Trading guides', 'E-books', 'Webinars'],
        researchTools: ['Economic calendar', 'Market news', 'Technical analysis', 'Trading signals']
    },
    regulation: {
        regulators: ['VFSC', 'FSA'],
        jurisdictions: ['Vanuatu', 'International'],
        regulatoryStatus: 'Offshore Regulated'
    },
    accessibility: {
        minDeposit: 100,
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Perfect Money', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Perfect Money', 'Crypto'],
        customerSupport: ['Live Chat', 'Phone', 'Email', 'Ticket System']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'FX Trading WebTrader', 'FX Trading Mobile App'],
        executionType: 'ECN/STP',
        apiAccess: false,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: true
  },
  {
    id: 'multibank',
    name: 'Multibank',
    logoUrl: '/broker-logos/multibank.png',
    websiteUrl: 'https://www.multibank.com/',
    score: 8.5,
    foundingYear: 2005,
    headquarters: 'Limassol, Cyprus',
    description: 'Multibank is a global forex and CFD broker with multiple regulatory licenses and a strong presence in international markets.',
    summary: 'Multibank offers traders access to global financial markets through multiple platforms with competitive pricing. With regulatory oversight from multiple jurisdictions and deep institutional liquidity, it serves both retail and institutional traders.',
    pros: [
        "Multiple regulatory licenses (CySEC, FCA, ASIC)",
        "Deep institutional liquidity",
        "Competitive spreads from 0.0 pips",
        "Wide range of trading instruments",
        "Advanced trading technology",
        "24/7 customer support"
    ],
    cons: [
        "Complex fee structure",
        "Limited cryptocurrency selection",
        "No guaranteed stop-loss orders",
        "Higher minimum deposit for premium accounts"
    ],
    coreInfo: {
        brokerType: 'ECN/STP',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'STP', minDeposit: 50, spreads: 'From 1.0 pips', commission: 'Zero commission', bestFor: 'Beginners and casual traders' },
        { name: 'ECN Account', type: 'ECN', minDeposit: 1000, spreads: 'From 0.1 pips', commission: '$3 per lot per side', bestFor: 'Active traders' },
        { name: 'Institutional Account', type: 'ECN', minDeposit: 25000, spreads: 'From 0.0 pips', commission: '$1.5 per lot per side', bestFor: 'Professional traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Raw',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.1 pips + commission (ECN)' },
                { pair: 'GBP/USD', spread: '0.2 pips + commission (ECN)' },
                { pair: 'Gold', spread: '10 cents' }
            ],
            commissionStructure: "$3 per lot per side on ECN Account. $1.5 on Institutional Account.",
            overnightSwapFees: "Competitive swap rates. Islamic accounts available."
        },
        nonTrading: {
            inactivityFee: "None",
            withdrawalFee: "None for most methods. Bank transfers may incur fees.",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { total: 70, details: "Major, Minor, and Exotic currency pairs" },
        commodities: { total: 25, details: "Energy, Metals, Agricultural products" },
        indices: { total: 35, details: "Global indices from US, Europe, Asia" },
        stocks: { total: 1000, details: "Stock CFDs from major exchanges" },
        cryptocurrencies: { total: 8, details: "Major cryptocurrencies" },
        etfs: { total: 150, details: "Various ETF CFDs" }
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
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Crypto'],
        depositFees: "None",
        withdrawalFees: "None from Multibank side",
        processingTime: {
            deposits: "Instant for cards and e-wallets",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 50
    },
    customerSupport: {
        languages: ['English', 'Chinese', 'Arabic', 'Spanish', 'Portuguese', 'Russian', 'German'],
        channels: ['Live Chat', 'Phone', 'Email', 'WhatsApp'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'CySEC', licenseNumber: '392/20' },
            { regulator: 'FCA', licenseNumber: '787896' },
            { regulator: 'ASIC', licenseNumber: '416279' },
            { regulator: 'FSB', licenseNumber: '50730' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to €20,000 (CySEC)' },
        twoFactorAuth: true
    },
    tradingConditions: {
        spreads: { eurusd: 0.2, gbpusd: 0.4, usdjpy: 0.3 },
        commission: 'From $3.00 per side per standard lot',
        swapFeeCategory: 'Standard',
        maxLeverage: '1:500',
        minLotSize: 0.01
    },
    tradingEnvironment: {
        platforms: ['MT4', 'MT5', 'Multibank Trader', 'Multibank Mobile App'],
        minimumDeposit: 50,
        baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'CHF'],
        leverage: 'Up to 1:500',
        education: ['Video tutorials', 'Trading guides', 'Webinars', 'Market analysis'],
        researchTools: ['Economic calendar', 'Market news', 'Trading signals', 'VPS hosting']
    },
    regulation: {
        regulators: ['CySEC', 'FCA', 'ASIC', 'FSB'],
        jurisdictions: ['Cyprus', 'UK', 'Australia', 'South Africa', 'EU'],
        regulatoryStatus: 'Fully Regulated'
    },
    accessibility: {
        minDeposit: 50,
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Crypto'],
        customerSupport: ['Live Chat', 'Phone', 'Email', 'WhatsApp']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'Multibank Trader', 'Multibank Mobile App'],
        executionType: 'ECN/STP',
        apiAccess: false,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: true
  },
  {
    id: 'tradestation-global',
    name: 'Tradestation Global',
    logoUrl: '/broker-logos/tradestation-global.png',
    websiteUrl: 'https://www.tradestationglobal.com/',
    score: 8.9,
    foundingYear: 1982,
    headquarters: 'Plantation, Florida, USA',
    description: 'Tradestation Global is a US-based broker known for its advanced trading platform, powerful tools, and comprehensive market access.',
    summary: 'Tradestation Global offers institutional-grade trading technology to retail clients. With its proprietary platform featuring advanced charting, backtesting, and automation capabilities, it caters to serious traders and algorithmic traders seeking professional-grade tools.',
    pros: [
        "Advanced proprietary trading platform",
        "Powerful backtesting and automation",
        "Deep market data and analytics",
        "Multiple regulatory licenses",
        "Excellent research tools",
        "Professional-grade execution"
    ],
    cons: [
        "Steeper learning curve for beginners",
        "Higher minimum deposit requirements",
        "No fixed spread accounts",
        "Limited cryptocurrency offering"
    ],
    coreInfo: {
        brokerType: 'ECN',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'ECN', minDeposit: 500, spreads: 'From 0.5 pips', commission: '$2.99 per side', bestFor: 'Active traders' },
        { name: 'Premium Account', type: 'ECN', minDeposit: 5000, spreads: 'From 0.2 pips', commission: '$1.99 per side', bestFor: 'Professional traders' },
        { name: 'Elite Account', type: 'ECN', minDeposit: 25000, spreads: 'From 0.1 pips', commission: '$0.99 per side', bestFor: 'Institutional traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.2 pips + commission' },
                { pair: 'GBP/USD', spread: '0.3 pips + commission' },
                { pair: 'Gold', spread: '15 cents + commission' }
            ],
            commissionStructure: "$2.99 per side on Standard Account. $0.99 on Elite Account.",
            overnightSwapFees: "Competitive swap rates. No Islamic accounts."
        },
        nonTrading: {
            inactivityFee: "None",
            withdrawalFee: "None for most methods",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { total: 50, details: "Major and Minor currency pairs" },
        commodities: { total: 15, details: "Energy, Metals, Agricultural products" },
        indices: { total: 20, details: "Major global indices" },
        stocks: { total: 5000, details: "Stocks from US, UK, European exchanges" },
        cryptocurrencies: { total: 5, details: "Major cryptocurrencies" },
        etfs: { total: 1000, details: "Various ETFs" }
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
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'ACH Transfer', 'Wire Transfer'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'ACH Transfer', 'Wire Transfer'],
        depositFees: "None",
        withdrawalFees: "None from Tradestation side",
        processingTime: {
            deposits: "1-3 business days",
            withdrawals: "2-5 business days"
        },
        minWithdrawal: 100
    },
    customerSupport: {
        languages: ['English', 'Spanish', 'Portuguese', 'Chinese'],
        channels: ['Phone', 'Email', 'Ticket System', 'Live Chat'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'SEC', licenseNumber: '8-41433' },
            { regulator: 'FINRA', licenseNumber: 'CRD: 10783' },
            { regulator: 'SIPC', licenseNumber: 'Protected' },
            { regulator: 'FCA', licenseNumber: '554463' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to $500,000 (SIPC)' },
        twoFactorAuth: true
    },
    tradingConditions: {
        spreads: { eurusd: 0.8, gbpusd: 1.2, usdjpy: 0.9 },
        commission: 'From $1.00 per share, $4.95 per option contract',
        swapFeeCategory: 'Standard',
        maxLeverage: '1:50 (US), 1:200 (International)',
        minLotSize: 0.01
    },
    tradingEnvironment: {
        platforms: ['Tradestation Platform', 'Tradestation Mobile', 'Matrix', 'OptionStation'],
        minimumDeposit: 500,
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        leverage: 'Up to 1:50 (US), 1:200 (International)',
        education: ['Video tutorials', 'Webinars', 'Trading guides', 'University courses'],
        researchTools: ['Advanced charting', 'Backtesting', 'Automated trading', 'Market scanner', 'Radarscreen']
    },
    regulation: {
        regulators: ['SEC', 'FINRA', 'SIPC', 'FCA'],
        jurisdictions: ['USA', 'UK', 'International'],
        regulatoryStatus: 'Fully Regulated'
    },
    accessibility: {
        minDeposit: 500,
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'ACH Transfer', 'Wire Transfer'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'ACH Transfer', 'Wire Transfer'],
        customerSupport: ['Phone', 'Email', 'Ticket System', 'Live Chat']
    },
    technology: {
        platforms: ['Tradestation Platform', 'Tradestation Mobile', 'Matrix', 'OptionStation'],
        executionType: 'ECN',
        apiAccess: true,
        eaSupport: true
    },
    reviews: [],
    isIslamic: false,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'spreadex',
    name: 'Spreadex',
    logoUrl: '/broker-logos/spreadex.png',
    websiteUrl: 'https://www.spreadex.com/',
    score: 8.7,
    foundingYear: 1999,
    headquarters: 'Stoke-on-Trent, UK',
    description: 'Spreadex is a UK-based financial spread betting and CFD broker with FCA regulation and a focus on sports betting.',
    summary: 'Spreadex offers both financial spread betting and sports betting services under FCA regulation. Known for competitive spreads and tax-free spread betting in the UK, it provides a comprehensive trading and betting platform for UK residents.',
    pros: [
        "FCA regulation provides high security",
        "Tax-free spread betting (UK residents)",
        "Competitive spreads and commissions",
        "Combined financial and sports betting platform",
        "Excellent customer service",
        "No capital gains tax on spread betting profits"
    ],
    cons: [
        "UK residents only for spread betting",
        "Limited international market access",
        "No guaranteed stop-loss orders",
        "Limited cryptocurrency offerings"
    ],
    coreInfo: {
        brokerType: 'Market Maker',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Spread Betting Account', type: 'Spread Betting', minDeposit: 100, spreads: 'Variable', commission: 'No commission', bestFor: 'UK tax-efficient trading' },
        { name: 'CFD Account', type: 'CFD', minDeposit: 100, spreads: 'Variable', commission: 'No commission', bestFor: 'International traders' },
        { name: 'Professional Account', type: 'CFD', minDeposit: 10000, spreads: 'Variable', commission: 'No commission', bestFor: 'Experienced traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.8 pips' },
                { pair: 'GBP/USD', spread: '1.0 pips' },
                { pair: 'Gold', spread: '25 cents' }
            ],
            commissionStructure: "No commission on spread betting or standard CFDs",
            overnightSwapFees: "Applied to CFD positions held overnight. Spread betting accounts exempt."
        },
        nonTrading: {
            inactivityFee: "None",
            withdrawalFee: "None",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { total: 40, details: "Major and Minor currency pairs" },
        commodities: { total: 12, details: "Gold, Silver, Oil, and key commodities" },
        indices: { total: 20, details: "Major global indices" },
        stocks: { total: 200, details: "UK and US stocks" },
        cryptocurrencies: { total: 0, details: "Not available" },
        etfs: { total: 50, details: "Major ETFs" }
    },
    tradingConditionsExtended: {
        minTradeSize: 0.01,
        scalpingAllowed: false,
        hedgingAllowed: true,
        eaAllowed: false,
        negativeBalanceProtection: true,
        marginCallLevel: "100%",
        stopOutLevel: "50%"
    },
    depositWithdrawal: {
        depositMethods: ['Credit/Debit Card', 'Bank Transfer'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer'],
        depositFees: "None",
        withdrawalFees: "None",
        processingTime: {
            deposits: "Instant for cards",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English'],
        channels: ['Phone', 'Email', 'Live Chat'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'FCA', licenseNumber: '670816' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
        twoFactorAuth: true
    },
    tradingConditions: {
        spreads: { eurusd: 0.8, gbpusd: 1.2, usdjpy: 0.9 },
        commission: 'Spread betting - no commission, CFDs - variable spreads',
        swapFeeCategory: 'Standard',
        maxLeverage: '1:30 (EU), 1:200 (Professional)',
        minLotSize: 0.01
    },
    tradingEnvironment: {
        platforms: ['Spreadex Platform', 'Spreadex Mobile App', 'MT4'],
        minimumDeposit: 100,
        baseCurrencies: ['GBP', 'EUR'],
        leverage: 'Up to 1:30 (EU), 1:200 (Professional)',
        education: ['Trading guides', 'Video tutorials', 'Market analysis'],
        researchTools: ['Economic calendar', 'Market news', 'Technical analysis']
    },
    regulation: {
        regulators: ['FCA'],
        jurisdictions: ['UK'],
        regulatoryStatus: 'Fully Regulated'
    },
    accessibility: {
        minDeposit: 100,
        depositMethods: ['Credit/Debit Card', 'Bank Transfer'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer'],
        customerSupport: ['Phone', 'Email', 'Live Chat']
    },
    technology: {
        platforms: ['Spreadex Platform', 'Spreadex Mobile App', 'MT4'],
        executionType: 'Market Maker',
        apiAccess: false,
        eaSupport: false
    },
    reviews: [],
    isIslamic: false,
    copyTrading: false,
    providesSignals: true
  },
  {
    id: 'fusion-markets',
    name: 'Fusion Markets',
    logoUrl: '/broker-logos/fusion-markets.png',
    websiteUrl: 'https://www.fusionmarkets.com/',
    score: 8.7,
    foundingYear: 2018,
    headquarters: 'Melbourne, Australia',
    description: 'Fusion Markets is an Australian-based ECN/STP broker known for offering some of the lowest commissions in the industry. The company focuses on providing transparent pricing and direct market access to retail traders.',
    summary: 'Low-cost Australian ECN broker with industry-leading commissions and strong regulatory framework.',
    pros: [
        'ASIC and VFSC regulated with strong investor protection',
        'Industry-leading low commissions from $2.25 per side',
        'True ECN/STP execution with no dealing desk',
        'Wide range of trading instruments',
        'No deposit or withdrawal fees',
        'Negative balance protection',
        'Strong customer support with local presence'
    ],
    cons: [
        'Limited regulatory coverage outside Australia/Vanuatu',
        'No guaranteed stop loss',
        'No copy trading features',
        'Limited cryptocurrency offerings',
        'Higher minimum deposit for professional accounts'
    ],
    coreInfo: {
        yearFounded: 2018,
        headquarters: 'Melbourne, Australia',
        regulation: ['ASIC', 'VFSC'],
        platforms: ['MT4', 'MT5', 'cTrader'],
        minimumDeposit: 100,
        baseCurrencies: ['AUD', 'USD', 'EUR', 'GBP']
    },
    accountTypes: [
        {
            name: 'Standard Account',
            minDeposit: 100,
            baseCurrency: ['AUD', 'USD', 'EUR', 'GBP'],
            spreads: 'Raw spreads from 0.0 pips',
            commission: '$3.50 per round turn ($100k)',
            leverage: 'Up to 1:500 (ASIC), 1:30 (EU)'
        },
        {
            name: 'Zero Account',
            minDeposit: 100,
            baseCurrency: ['AUD', 'USD', 'EUR', 'GBP'],
            spreads: 'Raw spreads from 0.0 pips',
            commission: '$2.25 per side per $100k',
            leverage: 'Up to 1:500 (ASIC), 1:30 (EU)'
        }
    ],
    fees: {
        spread: 'Raw spreads from 0.0 pips (EUR/USD)',
        commission: '$2.25 per side per $100k traded',
        inactivityFee: 'None',
        depositFees: 'None',
        withdrawalFees: 'None',
        currencyConversionFees: '0.5%',
        overnightFees: 'Standard swap rates',
        additionalFees: {
            name: 'VISA Deposit',
            cost: '2.5% (minimum $20)'
        }
    },
    tradableInstruments: {
        forexPairs: { total: 60, details: "Major, Minor, and Exotic currency pairs" },
        commodities: { total: 15, details: "Gold, Silver, Oil, and agricultural commodities" },
        indices: { total: 18, details: "Major global indices" },
        stocks: { total: 150, details: "Australian, US, and European stocks" },
        cryptocurrencies: { total: 4, details: "Bitcoin, Ethereum, Litecoin, Ripple" },
        etfs: { total: 30, details: "Major ETFs" }
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
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
        depositFees: "None",
        withdrawalFees: "None",
        processingTime: {
            deposits: "Instant for e-wallets, 1-2 days for bank transfers",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English'],
        channels: ['Phone', 'Email', 'Live Chat'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'ASIC', licenseNumber: '401768' },
            { regulator: 'VFSC', licenseNumber: '401768' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to AUD $500,000 (ASIC)' },
        twoFactorAuth: true
    },
    tradingConditions: {
        spreads: { eurusd: 0.0, gbpusd: 0.2, usdjpy: 0.1 },
        commission: '$2.25 per side per $100k traded',
        swapFeeCategory: 'Standard',
        maxLeverage: '1:500 (ASIC), 1:30 (EU)',
        minLotSize: 0.01
    },
    tradingEnvironment: {
        platforms: ['MT4', 'MT5', 'cTrader'],
        minimumDeposit: 100,
        baseCurrencies: ['AUD', 'USD', 'EUR', 'GBP'],
        leverage: 'Up to 1:500 (ASIC), 1:30 (EU)',
        education: ['Trading guides', 'Video tutorials', 'Market analysis', 'Webinars'],
        researchTools: ['Economic calendar', 'Market news', 'Technical analysis', 'AutoChartist']
    },
    regulation: {
        regulators: ['ASIC', 'VFSC'],
        jurisdictions: ['Australia', 'Vanuatu', 'International'],
        regulatoryStatus: 'Fully Regulated'
    },
    accessibility: {
        minDeposit: 100,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
        customerSupport: ['Phone', 'Email', 'Live Chat']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'cTrader'],
        executionType: 'ECN/STP',
        apiAccess: true,
        eaSupport: true
    },
    reviews: [],
    isIslamic: false,
    copyTrading: false,
    providesSignals: true
  },
  {
    id: 'eightcap',
    name: 'Eightcap',
    logoUrl: '/broker-logos/eightcap.png',
    websiteUrl: 'https://www.eightcap.com/',
    score: 8.4,
    foundingYear: 2009,
    headquarters: 'Melbourne, Australia',
    description: 'Eightcap is an Australian-based multi-asset broker offering forex, indices, commodities, shares, and cryptocurrency trading. The broker is known for competitive pricing and strong regulatory oversight.',
    summary: 'Multi-regulated Australian broker offering diverse trading instruments with competitive spreads.',
    pros: [
        'ASIC and FCA regulated with strong investor protection',
        'Wide range of trading instruments including cryptocurrencies',
        'Competitive spreads on major instruments',
        'Multiple trading platforms including MT4, MT5, and TradingView',
        'No deposit or withdrawal fees',
        'Negative balance protection',
        'Strong customer support'
    ],
    cons: [
        'Limited cryptocurrency offerings compared to specialized crypto brokers',
        'No guaranteed stop loss',
        'No copy trading features',
        'Higher minimum deposit for certain account types',
        'Limited educational resources'
    ],
    coreInfo: {
        yearFounded: 2009,
        headquarters: 'Melbourne, Australia',
        regulation: ['ASIC', 'FCA'],
        platforms: ['MT4', 'MT5', 'TradingView'],
        minimumDeposit: 100,
        baseCurrencies: ['AUD', 'USD', 'EUR', 'GBP']
    },
    accountTypes: [
        {
            name: 'Standard Account',
            minDeposit: 100,
            baseCurrency: ['AUD', 'USD', 'EUR', 'GBP'],
            spreads: 'Variable from 1.0 pip',
            commission: 'None',
            leverage: 'Up to 1:500 (ASIC), 1:30 (EU)'
        },
        {
            name: 'Raw Account',
            minDeposit: 100,
            baseCurrency: ['AUD', 'USD', 'EUR', 'GBP'],
            spreads: 'Raw from 0.0 pips',
            commission: '$3.50 per round turn',
            leverage: 'Up to 1:500 (ASIC), 1:30 (EU)'
        }
    ],
    fees: {
        spread: 'Variable from 1.0 pip (Standard), Raw from 0.0 pips',
        commission: '$3.50 per round turn (Raw account)',
        inactivityFee: 'None',
        depositFees: 'None',
        withdrawalFees: 'None',
        currencyConversionFees: '0.5%',
        overnightFees: 'Standard swap rates',
        additionalFees: {
            name: 'VISA Deposit',
            cost: '2.5% (minimum $20)'
        }
    },
    tradableInstruments: {
        forexPairs: { total: 50, details: "Major, Minor, and Exotic currency pairs" },
        commodities: { total: 20, details: "Gold, Silver, Oil, and agricultural commodities" },
        indices: { total: 25, details: "Major global indices" },
        stocks: { total: 300, details: "US, Australian, and European stocks" },
        cryptocurrencies: { total: 10, details: "Bitcoin, Ethereum, Litecoin, Ripple, and others" },
        etfs: { total: 50, details: "Major ETFs" }
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
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
        depositFees: "None",
        withdrawalFees: "None",
        processingTime: {
            deposits: "Instant for e-wallets, 1-2 days for bank transfers",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English', 'Chinese', 'Spanish', 'Arabic'],
        channels: ['Phone', 'Email', 'Live Chat'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'ASIC', licenseNumber: '391441' },
            { regulator: 'FCA', licenseNumber: '919790' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to AUD $500,000 (ASIC), £85,000 (FCA)' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        platforms: ['MT4', 'MT5', 'TradingView'],
        minimumDeposit: 100,
        baseCurrencies: ['AUD', 'USD', 'EUR', 'GBP'],
        leverage: 'Up to 1:500 (ASIC), 1:30 (EU)',
        education: ['Trading guides', 'Video tutorials', 'Market analysis'],
        researchTools: ['Economic calendar', 'Market news', 'Technical analysis']
    },
    regulation: {
        regulators: ['ASIC', 'FCA'],
        jurisdictions: ['Australia', 'UK', 'International'],
        regulatoryStatus: 'Fully Regulated'
    },
    accessibility: {
        minDeposit: 100,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
        customerSupport: ['Phone', 'Email', 'Live Chat']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'TradingView'],
        executionType: 'STP',
        apiAccess: true,
        eaSupport: true
    },
    reviews: [],
    isIslamic: false,
    copyTrading: false,
    providesSignals: true
  },
  {
    id: 'hantec-markets',
    name: 'Hantec Markets',
    logoUrl: '/broker-logos/hantec-markets.png',
    websiteUrl: 'https://www.hantecmarkets.com/',
    score: 8.3,
    foundingYear: 1990,
    headquarters: 'London, UK',
    description: 'Hantec Markets is a well-established UK-based forex and CFD broker with over 30 years of experience. The company offers a comprehensive trading platform with strong regulatory oversight.',
    summary: 'Long-established UK broker with extensive experience and strong regulatory framework.',
    pros: [
        'FCA regulated with strong investor protection',
        'Over 30 years of industry experience',
        'Wide range of trading instruments',
        'Competitive spreads on major instruments',
        'No deposit or withdrawal fees',
        'Negative balance protection',
        'Strong customer support'
    ],
    cons: [
        'Limited cryptocurrency offerings',
        'No guaranteed stop loss',
        'No copy trading features',
        'Higher minimum deposit for certain account types',
        'Limited educational resources compared to larger brokers'
    ],
    coreInfo: {
        yearFounded: 1990,
        headquarters: 'London, UK',
        regulation: ['FCA'],
        platforms: ['MT4', 'MT5'],
        minimumDeposit: 100,
        baseCurrencies: ['GBP', 'USD', 'EUR']
    },
    accountTypes: [
        {
            name: 'Standard Account',
            minDeposit: 100,
            baseCurrency: ['GBP', 'USD', 'EUR'],
            spreads: 'Variable from 1.0 pip',
            commission: 'None',
            leverage: 'Up to 1:30 (Retail), 1:200 (Professional)'
        },
        {
            name: 'Professional Account',
            minDeposit: 1000,
            baseCurrency: ['GBP', 'USD', 'EUR'],
            spreads: 'Variable from 0.8 pips',
            commission: 'None',
            leverage: 'Up to 1:200',
            professionalOnly: true
        }
    ],
    fees: {
        spread: 'Variable from 1.0 pip (EUR/USD)',
        commission: 'None',
        inactivityFee: 'None',
        depositFees: 'None',
        withdrawalFees: 'None',
        currencyConversionFees: '0.5%',
        overnightFees: 'Standard swap rates',
        additionalFees: {
            name: 'VISA Deposit',
            cost: '2.5% (minimum $20)'
        }
    },
    tradableInstruments: {
        forexPairs: { total: 45, details: "Major, Minor, and Exotic currency pairs" },
        commodities: { total: 15, details: "Gold, Silver, Oil, and key commodities" },
        indices: { total: 20, details: "Major global indices" },
        stocks: { total: 200, details: "UK and US stocks" },
        cryptocurrencies: { total: 0, details: "Not available" },
        etfs: { total: 40, details: "Major ETFs" }
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
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        depositFees: "None",
        withdrawalFees: "None",
        processingTime: {
            deposits: "Instant for e-wallets, 1-2 days for bank transfers",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English', 'Chinese', 'Spanish', 'Arabic'],
        channels: ['Phone', 'Email', 'Live Chat'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'FCA', licenseNumber: '502032' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
        twoFactorAuth: true
    },
    tradingConditions: {
        spreads: { eurusd: 0.7, gbpusd: 1.0, usdjpy: 0.8 },
        commission: 'From $7.00 per round turn per standard lot',
        swapFeeCategory: 'Standard',
        maxLeverage: '1:30 (Retail), 1:200 (Professional)',
        minLotSize: 0.01
    },
    tradingEnvironment: {
        platforms: ['MT4', 'MT5'],
        minimumDeposit: 100,
        baseCurrencies: ['GBP', 'USD', 'EUR'],
        leverage: 'Up to 1:30 (Retail), 1:200 (Professional)',
        education: ['Trading guides', 'Video tutorials', 'Market analysis'],
        researchTools: ['Economic calendar', 'Market news', 'Technical analysis']
    },
    regulation: {
        regulators: ['FCA'],
        jurisdictions: ['UK'],
        regulatoryStatus: 'Fully Regulated'
    },
    accessibility: {
        minDeposit: 100,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        customerSupport: ['Phone', 'Email', 'Live Chat']
    },
    technology: {
        platforms: ['MT4', 'MT5'],
        executionType: 'Market Maker',
        apiAccess: true,
        eaSupport: true
    },
    reviews: [],
    isIslamic: false,
    copyTrading: false,
    providesSignals: true
  },
  {
    id: 'global-prime',
    name: 'Global Prime',
    logoUrl: '/broker-logos/global-prime.png',
    websiteUrl: 'https://www.globalprime.com/',
    score: 8.6,
    foundingYear: 2010,
    headquarters: 'Sydney, Australia',
    description: 'Global Prime is an Australian-based ECN/STP broker specializing in forex and CFD trading. The company is known for transparent pricing and direct market access with no dealing desk.',
    summary: 'Australian ECN broker offering transparent pricing and direct market access.',
    pros: [
        'ASIC regulated with strong investor protection',
        'True ECN/STP execution with no dealing desk',
        'Competitive spreads and low commissions',
        'Wide range of trading instruments',
        'No deposit or withdrawal fees',
        'Negative balance protection',
        'Strong customer support'
    ],
    cons: [
        'Limited regulatory coverage outside Australia',
        'No guaranteed stop loss',
        'No copy trading features',
        'Limited cryptocurrency offerings',
        'Higher minimum deposit for certain account types'
    ],
    coreInfo: {
        yearFounded: 2010,
        headquarters: 'Sydney, Australia',
        regulation: ['ASIC'],
        platforms: ['MT4', 'MT5'],
        minimumDeposit: 200,
        baseCurrencies: ['AUD', 'USD', 'EUR', 'GBP']
    },
    accountTypes: [
        {
            name: 'Standard Account',
            minDeposit: 200,
            baseCurrency: ['AUD', 'USD', 'EUR', 'GBP'],
            spreads: 'Raw from 0.0 pips',
            commission: '$4.50 per round turn',
            leverage: 'Up to 1:500 (ASIC), 1:30 (EU)'
        }
    ],
    fees: {
        spread: 'Raw from 0.0 pips (EUR/USD)',
        commission: '$4.50 per round turn',
        inactivityFee: 'None',
        depositFees: 'None',
        withdrawalFees: 'None',
        currencyConversionFees: '0.5%',
        overnightFees: 'Standard swap rates',
        additionalFees: {
            name: 'VISA Deposit',
            cost: '2.5% (minimum $20)'
        }
    },
    tradableInstruments: {
        forexPairs: { total: 60, details: "Major, Minor, and Exotic currency pairs" },
        commodities: { total: 15, details: "Gold, Silver, Oil, and agricultural commodities" },
        indices: { total: 20, details: "Major global indices" },
        stocks: { total: 150, details: "Australian and US stocks" },
        cryptocurrencies: { total: 0, details: "Not available" },
        etfs: { total: 30, details: "Major ETFs" }
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
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        depositFees: "None",
        withdrawalFees: "None",
        processingTime: {
            deposits: "Instant for e-wallets, 1-2 days for bank transfers",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English'],
        channels: ['Phone', 'Email', 'Live Chat'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'ASIC', licenseNumber: '385620' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to AUD $500,000 (ASIC)' },
        twoFactorAuth: true
    },
    tradingConditions: {
        spreads: { eurusd: 0.0, gbpusd: 0.3, usdjpy: 0.2 },
        commission: 'From $3.50 per side per standard lot',
        swapFeeCategory: 'Standard',
        maxLeverage: '1:500 (ASIC), 1:30 (EU)',
        minLotSize: 0.01
    },
    tradingEnvironment: {
        platforms: ['MT4', 'MT5'],
        minimumDeposit: 200,
        baseCurrencies: ['AUD', 'USD', 'EUR', 'GBP'],
        leverage: 'Up to 1:500 (ASIC), 1:30 (EU)',
        education: ['Trading guides', 'Video tutorials', 'Market analysis'],
        researchTools: ['Economic calendar', 'Market news', 'Technical analysis']
    },
    regulation: {
        regulators: ['ASIC'],
        jurisdictions: ['Australia', 'International'],
        regulatoryStatus: 'Fully Regulated'
    },
    accessibility: {
        minDeposit: 200,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        customerSupport: ['Phone', 'Email', 'Live Chat']
    },
    technology: {
        platforms: ['MT4', 'MT5'],
        executionType: 'ECN/STP',
        apiAccess: true,
        eaSupport: true
    },
    reviews: [],
    isIslamic: false,
    copyTrading: false,
    providesSignals: true
  },
  {
    id: 'go-markets',
    name: 'Go Markets',
    logoUrl: '/broker-logos/go-markets.png',
    websiteUrl: 'https://www.gomarkets.com/',
    score: 8.4,
    foundingYear: 2006,
    headquarters: 'Melbourne, Australia',
    description: 'Go Markets is one of Australia\'s first MetaTrader brokers, offering forex and CFD trading services since 2006. The company has built a strong reputation for reliability and customer service.',
    summary: 'Established Australian MT4/MT5 broker with strong regulatory oversight and competitive pricing.',
    pros: [
        'ASIC regulated with strong investor protection',
        'One of Australia\'s first MT4 brokers',
        'Competitive spreads on major instruments',
        'No deposit or withdrawal fees',
        'Negative balance protection',
        'Strong customer support',
        'Comprehensive market coverage'
    ],
    cons: [
        'Limited regulatory coverage outside Australia',
        'No guaranteed stop loss',
        'No copy trading features',
        'Limited cryptocurrency offerings',
        'Higher minimum deposit for certain account types'
    ],
    coreInfo: {
        yearFounded: 2006,
        headquarters: 'Melbourne, Australia',
        regulation: ['ASIC'],
        platforms: ['MT4', 'MT5'],
        minimumDeposit: 100,
        baseCurrencies: ['AUD', 'USD', 'EUR', 'GBP']
    },
    accountTypes: [
        {
            name: 'Standard Account',
            minDeposit: 100,
            baseCurrency: ['AUD', 'USD', 'EUR', 'GBP'],
            spreads: 'Variable from 0.8 pips',
            commission: 'None',
            leverage: 'Up to 1:500 (ASIC), 1:30 (EU)'
        },
        {
            name: 'GO Plus+ Account',
            minDeposit: 500,
            baseCurrency: ['AUD', 'USD', 'EUR', 'GBP'],
            spreads: 'Raw from 0.0 pips',
            commission: '$3.50 per round turn',
            leverage: 'Up to 1:500 (ASIC), 1:30 (EU)'
        }
    ],
    fees: {
        spread: 'Variable from 0.8 pips (Standard), Raw from 0.0 pips (GO Plus+)',
        commission: '$3.50 per round turn (GO Plus+ account)',
        inactivityFee: 'None',
        depositFees: 'None',
        withdrawalFees: 'None',
        currencyConversionFees: '0.5%',
        overnightFees: 'Standard swap rates',
        additionalFees: {
            name: 'VISA Deposit',
            cost: '2.5% (minimum $20)'
        }
    },
    tradableInstruments: {
        forexPairs: { total: 50, details: "Major, Minor, and Exotic currency pairs" },
        commodities: { total: 15, details: "Gold, Silver, Oil, and agricultural commodities" },
        indices: { total: 20, details: "Major global indices" },
        stocks: { total: 150, details: "Australian and US stocks" },
        cryptocurrencies: { total: 0, details: "Not available" },
        etfs: { total: 30, details: "Major ETFs" }
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
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        depositFees: "None",
        withdrawalFees: "None",
        processingTime: {
            deposits: "Instant for e-wallets, 1-2 days for bank transfers",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English', 'Chinese', 'Spanish'],
        channels: ['Phone', 'Email', 'Live Chat'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'ASIC', licenseNumber: '254063' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to AUD $500,000 (ASIC)' },
        twoFactorAuth: true
    },
    tradingConditions: {
        spreads: { eurusd: 0.8, gbpusd: 1.0, usdjpy: 0.8 },
        commission: '$3.50 per round turn (GO Plus+ account)',
        swapFeeCategory: 'Standard',
        maxLeverage: '1:500 (ASIC), 1:30 (EU)',
        minLotSize: 0.01
    },
    tradingEnvironment: {
        platforms: ['MT4', 'MT5'],
        minimumDeposit: 100,
        baseCurrencies: ['AUD', 'USD', 'EUR', 'GBP'],
        leverage: 'Up to 1:500 (ASIC), 1:30 (EU)',
        education: ['Trading guides', 'Video tutorials', 'Market analysis', 'Webinars'],
        researchTools: ['Economic calendar', 'Market news', 'Technical analysis']
    },
    regulation: {
        regulators: ['ASIC'],
        jurisdictions: ['Australia', 'International'],
        regulatoryStatus: 'Fully Regulated'
    },
    accessibility: {
        minDeposit: 100,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        customerSupport: ['Phone', 'Email', 'Live Chat']
    },
    technology: {
        platforms: ['MT4', 'MT5'],
        executionType: 'STP',
        apiAccess: true,
        eaSupport: true
    },
    reviews: [],
    isIslamic: false,
    copyTrading: false,
    providesSignals: true
  },
  {
    id: 'moneta-markets',
    name: 'Moneta Markets',
    logoUrl: '/broker-logos/moneta-markets.png',
    websiteUrl: 'https://www.monetamarkets.com/',
    score: 8.2,
    foundingYear: 2020,
    headquarters: 'Kingstown, St. Vincent & Grenadines',
    description: 'Moneta Markets is an international forex and CFD broker offering a wide range of trading instruments. The broker focuses on providing competitive spreads and a user-friendly trading experience.',
    summary: 'International broker offering competitive spreads and diverse trading instruments.',
    pros: [
        'Multiple regulatory licenses (FSCA, VFSC)',
        'Wide range of trading instruments',
        'Competitive spreads on major instruments',
        'Multiple trading platforms including MT4, MT5, and WebTrader',
        'No deposit or withdrawal fees',
        'Negative balance protection',
        'Strong customer support'
    ],
    cons: [
        'Limited regulatory oversight in some jurisdictions',
        'No guaranteed stop loss',
        'No copy trading features',
        'Limited cryptocurrency offerings',
        'Higher minimum deposit for certain account types'
    ],
    coreInfo: {
        yearFounded: 2020,
        headquarters: 'Kingstown, St. Vincent & Grenadines',
        regulation: ['FSCA', 'VFSC'],
        platforms: ['MT4', 'MT5', 'WebTrader'],
        minimumDeposit: 100,
        baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD']
    },
    accountTypes: [
        {
            name: 'Standard Account',
            minDeposit: 100,
            baseCurrency: ['USD', 'EUR', 'GBP', 'AUD'],
            spreads: 'Variable from 0.8 pips',
            commission: 'None',
            leverage: 'Up to 1:1000'
        },
        {
            name: 'Raw Account',
            minDeposit: 100,
            baseCurrency: ['USD', 'EUR', 'GBP', 'AUD'],
            spreads: 'Raw from 0.0 pips',
            commission: '$3.50 per round turn',
            leverage: 'Up to 1:1000'
        }
    ],
    fees: {
        spread: 'Variable from 0.8 pips (Standard), Raw from 0.0 pips',
        commission: '$3.50 per round turn (Raw account)',
        inactivityFee: 'None',
        depositFees: 'None',
        withdrawalFees: 'None',
        currencyConversionFees: '0.5%',
        overnightFees: 'Standard swap rates',
        additionalFees: {
            name: 'VISA Deposit',
            cost: '2.5% (minimum $20)'
        }
    },
    tradableInstruments: {
        forexPairs: { total: 60, details: "Major, Minor, and Exotic currency pairs" },
        commodities: { total: 20, details: "Gold, Silver, Oil, and agricultural commodities" },
        indices: { total: 25, details: "Major global indices" },
        stocks: { total: 200, details: "US and European stocks" },
        cryptocurrencies: { total: 5, details: "Bitcoin, Ethereum, Litecoin, Ripple, and Bitcoin Cash" },
        etfs: { total: 40, details: "Major ETFs" }
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
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
        depositFees: "None",
        withdrawalFees: "None",
        processingTime: {
            deposits: "Instant for e-wallets, 1-2 days for bank transfers",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English', 'Spanish', 'Arabic', 'Chinese'],
        channels: ['Phone', 'Email', 'Live Chat'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'FSCA', licenseNumber: '50610' },
            { regulator: 'VFSC', licenseNumber: '70010' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to ZAR 200,000 (FSCA)' },
        twoFactorAuth: true
    },
    tradingConditions: {
        spreads: { eurusd: 0.8, gbpusd: 1.2, usdjpy: 0.9 },
        commission: 'From $3.00 per lot on ECN accounts',
        swapFeeCategory: 'Standard',
        maxLeverage: '1:1000',
        minLotSize: 0.01
    },
    tradingEnvironment: {
        platforms: ['MT4', 'MT5', 'WebTrader'],
        minimumDeposit: 100,
        baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD'],
        leverage: 'Up to 1:1000',
        education: ['Trading guides', 'Video tutorials', 'Market analysis'],
        researchTools: ['Economic calendar', 'Market news', 'Technical analysis']
    },
    regulation: {
        regulators: ['FSCA', 'VFSC'],
        jurisdictions: ['South Africa', 'Vanuatu', 'International'],
        regulatoryStatus: 'Fully Regulated'
    },
    accessibility: {
        minDeposit: 100,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
        customerSupport: ['Phone', 'Email', 'Live Chat']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'WebTrader'],
        executionType: 'STP',
        apiAccess: true,
        eaSupport: true
    },
    reviews: [],
    isIslamic: false,
    copyTrading: false,
    providesSignals: true
  },
  {
    id: 'blackbull',
    name: 'BlackBull Markets',
    logoUrl: '/broker-logos/blackbull.png',
    websiteUrl: 'https://www.blackbull.com/',
    score: 8.6,
    foundingYear: 2013,
    headquarters: 'Auckland, New Zealand',
    description: 'BlackBull Markets is a globally regulated forex and CFD broker offering competitive trading conditions with ECN pricing, low commissions, and fast execution speeds.',
    summary: 'BlackBull Markets is a multi-regulated broker with strong oversight from FMA, FSCA, and FSA Seychelles. It offers excellent trading conditions with raw spreads from 0.0 pips, low commissions, and access to multiple trading platforms including MT4, MT5, and cTrader.',
    pros: [
        'Raw ECN spreads from 0.0 pips',
        'Low commission of $3.50 per lot round turn',
        'Multi-regulated with FMA, FSCA, FSA',
        'Fast execution speeds (avg. 40ms)',
        'Multiple trading platforms (MT4, MT5, cTrader)',
        'Free deposits and withdrawals'
    ],
    cons: [
        'Limited educational resources',
        'High leverage carries significant risk',
        'Limited cryptocurrency offerings',
        'No guaranteed stop loss orders'
    ],
    coreInfo: {
        brokerType: 'ECN',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'ECN', minDeposit: 100, spreads: 'From 0.0 pips', commission: '$3.50 per lot round turn', bestFor: 'All trader types' },
        { name: 'Raw Account', type: 'ECN', minDeposit: 1000, spreads: 'From 0.0 pips', commission: '$2.00 per lot round turn', bestFor: 'Professional traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Raw',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.0 pips + commission' },
                { pair: 'GBP/USD', spread: '0.1 pips + commission' },
                { pair: 'Gold', spread: '10 cents + commission' }
            ],
            commissionStructure: '$3.50 per lot round turn on Standard Account. $2.00 on Raw Account.',
            overnightSwapFees: 'Competitive rates. Islamic accounts available.'
        },
        nonTrading: {
            inactivityFee: 'None',
            withdrawalFee: 'None',
            depositFee: 'None'
        }
    },
    tradableInstruments: {
        forexPairs: { total: 70, details: 'Major, Minor, and Exotic pairs' },
        commodities: { total: 25, details: 'Energy, metals, and agricultural products' },
        indices: { total: 20, details: 'Major global indices' },
        stocks: { total: 500, details: 'Stock CFDs from major exchanges' },
        cryptocurrencies: { total: 10, details: 'Major cryptocurrency CFDs' },
        etfs: { total: 50, details: 'Various ETF CFDs' }
    },
    tradingConditionsExtended: {
        minTradeSize: 0.01,
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true,
        marginCallLevel: '100%',
        stopOutLevel: '50%'
    },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'Crypto'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'Crypto'],
        depositFees: 'None',
        withdrawalFees: 'None',
        processingTime: {
            deposits: 'Instant for cards and e-wallets',
            withdrawals: '1-3 business days'
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English', 'Chinese', 'Spanish', 'Arabic'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/7'
    },
    security: {
        regulatedBy: [
            { regulator: 'FMA', licenseNumber: 'New Zealand FSP24860' },
            { regulator: 'FSCA', licenseNumber: '51115' },
            { regulator: 'FSA Seychelles', licenseNumber: 'SD014' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Varies by jurisdiction' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        executionSpeedMs: 40,
        slippage: 'Very Low',
        requotes: false,
        marketDepth: true,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop', 'OCO'],
        guaranteedStopLoss: {
            available: false,
            cost: 'N/A'
        }
    },
    platformFeatures: {
        charting: {
            indicators: 50,
            drawingTools: 30
        },
        automatedTrading: ['EAs', 'API', 'cBots'],
        copyTrading: {
            available: true,
            platforms: ['Social Trading Platform']
        },
        backtesting: true,
        newsIntegration: true
    },
    accountManagement: {
        islamicAccount: {
            available: true,
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'NZD'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2013,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['FMA', 'FSCA', 'FSA Seychelles']
    },
    ratings: {
        regulation: 9.0,
        costs: 8.5,
        platforms: 8.5,
        support: 8.5
    },
    tradingConditions: {
        spreads: { eurusd: 0.0, gbpusd: 0.1, usdjpy: 0.1 },
        commission: '$3.50 per lot round turn',
        swapFeeCategory: 'Low',
        maxLeverage: '1:500',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 100,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'Crypto'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'Crypto'],
        customerSupport: ['24/7 Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'cTrader'],
        executionType: 'ECN',
        apiAccess: true,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: true,
    providesSignals: true
  },
  {
    id: 'startrader',
    name: 'StarTrader',
    logoUrl: '/broker-logos/startrader.png',
    websiteUrl: 'https://www.startrader.com/',
    score: 8.4,
    foundingYear: 2010,
    headquarters: 'Limassol, Cyprus',
    description: 'StarTrader is a multi-regulated forex and CFD broker offering competitive trading conditions with STP/ECN execution, low spreads, and a variety of account types.',
    summary: 'StarTrader is a well-regulated broker with licenses from CySEC, FCA, and ASIC. It offers competitive trading conditions with spreads from 0.0 pips, multiple account types, and access to popular trading platforms including MT4 and MT5.',
    pros: [
        'Competitive spreads from 0.0 pips',
        'Multi-regulated with CySEC, FCA, ASIC',
        'Multiple account types to suit different needs',
        'Access to MT4 and MT5 platforms',
        'Free deposits and withdrawals',
        '24/5 customer support'
    ],
    cons: [
        'Limited educational resources',
        'High leverage carries significant risk',
        'Commission charges on ECN accounts',
        'Limited cryptocurrency offerings'
    ],
    coreInfo: {
        brokerType: 'ECN/STP',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Classic Account', type: 'STP', minDeposit: 100, spreads: 'From 1.0 pip', commission: 'Zero commission', bestFor: 'Beginners and casual traders' },
        { name: 'Raw Account', type: 'ECN', minDeposit: 200, spreads: 'From 0.0 pips', commission: '$7 per lot round turn', bestFor: 'Active traders and scalpers' }
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '1.0 pip (Classic), 0.0 pips (Raw)' },
                { pair: 'GBP/USD', spread: '1.2 pips (Classic), 0.2 pips (Raw)' },
                { pair: 'Gold', spread: '25 cents (Classic), 15 cents (Raw)' }
            ],
            commissionStructure: 'Zero commission on Classic Account. $7 per lot round turn on Raw Account.',
            overnightSwapFees: 'Competitive rates. Islamic accounts available.'
        },
        nonTrading: {
            inactivityFee: 'None',
            withdrawalFee: 'None',
            depositFee: 'None'
        }
    },
    tradableInstruments: {
        forexPairs: { total: 65, details: 'Major, Minor, and Exotic pairs' },
        commodities: { total: 20, details: 'Energy, metals, and agricultural products' },
        indices: { total: 15, details: 'Major global indices' },
        stocks: { total: 300, details: 'Stock CFDs from major exchanges' },
        cryptocurrencies: { total: 15, details: 'Major cryptocurrency CFDs' },
        etfs: { total: 30, details: 'Various ETF CFDs' }
    },
    tradingConditionsExtended: {
        minTradeSize: 0.01,
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true,
        marginCallLevel: '100%',
        stopOutLevel: '50%'
    },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        depositFees: 'None',
        withdrawalFees: 'None',
        processingTime: {
            deposits: 'Instant for cards and e-wallets',
            withdrawals: '1-3 business days'
        },
        minWithdrawal: 25
    },
    customerSupport: {
        languages: ['English', 'Chinese', 'Spanish', 'Arabic', 'Russian'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'CySEC', licenseNumber: '120/10' },
            { regulator: 'FCA', licenseNumber: '595450' },
            { regulator: 'ASIC', licenseNumber: '443670' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        executionSpeedMs: 80,
        slippage: 'Low',
        requotes: false,
        marketDepth: true,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        guaranteedStopLoss: {
            available: false,
            cost: 'N/A'
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
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2010,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['CySEC', 'FCA', 'ASIC']
    },
    ratings: {
        regulation: 9.2,
        costs: 8.0,
        platforms: 8.0,
        support: 8.2
    },
    tradingConditions: {
        spreads: { eurusd: 1.0, gbpusd: 1.2, usdjpy: 1.1 },
        commission: '$7 per lot round turn on Raw Account',
        swapFeeCategory: 'Low',
        maxLeverage: '1:500',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 100,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        customerSupport: ['24/5 Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['MT4', 'MT5'],
        executionType: 'ECN/STP',
        apiAccess: true,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'libertex',
    name: 'Libertex',
    logoUrl: '/broker-logos/libertex.png',
    websiteUrl: 'https://libertex.org/',
    score: 8.5,
    foundingYear: 1997,
    headquarters: 'Limassol, Cyprus',
    description: 'Libertex is an award-winning online broker with over 20 years of experience, offering commission-based trading with zero spreads and a user-friendly platform.',
    summary: 'Libertex stands out as a veteran broker established in 1997, offering a unique commission-based pricing model with zero spreads. Regulated by CySEC and FSCA, the broker provides access to 213+ trading instruments including forex, stocks, and cryptocurrencies. With a low minimum deposit of just $10 and leverage up to 1:600, Libertex caters to both beginners and experienced traders seeking straightforward trading conditions.',
    pros: [
        'Commission-based pricing with zero spreads',
        'Over 20 years of industry experience',
        'Low minimum deposit of $10',
        'Multiple trading platforms (Libertex, MT4, MT5)',
        'Strong regulatory oversight (CySEC, FSCA)',
        'Wide range of trading instruments (213+ assets)'
    ],
    cons: [
        'Limited educational resources',
        'No social trading features',
        'Not available in some jurisdictions',
        'Limited research tools compared to competitors'
    ],

    coreInfo: {
        brokerType: 'Market Maker',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Retail Account', type: 'Standard', minDeposit: 10, spreads: 'Zero spreads', commission: 'Variable per trade', bestFor: 'Beginners and casual traders' },
        { name: 'Professional Account', type: 'Professional', minDeposit: 1000, spreads: 'Zero spreads', commission: 'Lower per trade fees', bestFor: 'Experienced high-volume traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Zero',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.0 pips + commission' },
                { pair: 'GBP/USD', spread: '0.0 pips + commission' },
                { pair: 'Gold', spread: '0.0 pips + commission' }
            ],
            commissionStructure: "Commission-based pricing, varies by instrument and account type",
            overnightSwapFees: "Standard swap rates apply. Islamic accounts available."
        },
        nonTrading: {
            inactivityFee: "May apply after extended inactivity",
            withdrawalFee: "None for most methods",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { major: true, minor: true, exotic: true, count: 50 },
        commodities: { preciousMetals: true, energy: true, agricultural: true, count: 15 },
        indices: { major: true, minor: true, count: 20 },
        stocks: { us: true, european: true, asian: true, count: 100 },
        cryptocurrencies: { major: true, altcoins: true, count: 28 }
    },
    tradingConditionsExtended: {
        maxLeverage: '1:600',
        minLotSize: 0.01,
        marginCallLevel: '100%',
        stopOutLevel: '20%',
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true
    },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        depositFees: 'None',
        withdrawalFees: 'None for most methods',
        processingTime: {
            deposits: 'Instant for cards and e-wallets',
            withdrawals: '1-3 business days'
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English', 'Russian', 'Spanish', 'German', 'French'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'CySEC', licenseNumber: '164/12' },
            { regulator: 'FSCA', licenseNumber: '45784' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to €20,000 (CySEC)' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        executionSpeedMs: 100,
        slippage: 'Low',
        requotes: false,
        marketDepth: false,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        guaranteedStopLoss: {
            available: false,
            cost: 'N/A'
        }
    },
    platformFeatures: {
        charting: {
            indicators: 30,
            drawingTools: 20
        },
        automatedTrading: ['EAs'],
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
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 1997,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['CySEC', 'FSCA']
    },
    ratings: {
        regulation: 8.5,
        costs: 8.0,
        platforms: 7.5,
        support: 8.0
    },
    tradingConditions: {
        spreads: { eurusd: 0.0, gbpusd: 0.0, usdjpy: 0.0 },
        commission: 'Per-trade commission',
        swapFeeCategory: 'Medium',
        maxLeverage: '1:600',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 10,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        customerSupport: ['24/5 Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['Libertex Platform', 'MT4', 'MT5', 'WebTrader'],
        executionType: 'Market Maker',
        apiAccess: false,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'capital-com',
    name: 'Capital.com',
    logoUrl: '/broker-logos/capital-com.png',
    websiteUrl: 'https://capital.com/',
    score: 8.8,
    foundingYear: 2016,
    headquarters: 'London, UK',
    description: 'Capital.com is a rapidly growing CFD broker regulated by top-tier authorities, offering a proprietary platform alongside MT4 and access to over 5,500 trading instruments.',
    summary: 'Capital.com has established itself as a major player since 2016, combining Tier-1 regulation (FCA, ASIC) with innovative technology. The broker offers competitive trading conditions with average EUR/USD spreads of 0.67 pips and no minimum deposit requirement. With 5,500+ tradeable symbols and strong research and educational resources, Capital.com appeals to traders seeking a well-regulated, technologically advanced trading environment.',
    pros: [
        'Strong Tier-1 regulation (FCA, ASIC)',
        'No minimum deposit requirement',
        'Wide range of trading instruments (5,500+ symbols)',
        'Excellent research and educational resources',
        'User-friendly proprietary platform',
        'Competitive spreads starting from 0.67 pips'
    ],
    cons: [
        'No MetaTrader 5 platform',
        'No copy trading features',
        'Limited product range outside CFDs',
        'Inactivity fees may apply'
    ],

    coreInfo: {
        brokerType: 'STP',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'STP', minDeposit: 0, spreads: 'From 0.67 pips', commission: 'No commission', bestFor: 'All trader levels' },
        { name: 'Professional Account', type: 'STP', minDeposit: 0, spreads: 'From 0.0 pips', commission: 'Variable', bestFor: 'Professional traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.67 pips' },
                { pair: 'GBP/USD', spread: '0.9 pips' },
                { pair: 'Gold', spread: '0.3 pips' }
            ],
            commissionStructure: "No commission on standard accounts. Professional accounts may have commission-based pricing",
            overnightSwapFees: "Standard swap rates. Islamic accounts available."
        },
        nonTrading: {
            inactivityFee: "$10 per month after 3 months of inactivity",
            withdrawalFee: "None",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { major: true, minor: true, exotic: true, count: 138 },
        commodities: { preciousMetals: true, energy: true, agricultural: true, count: 25 },
        indices: { major: true, minor: true, count: 45 },
        stocks: { us: true, european: true, asian: true, count: 3500 },
        cryptocurrencies: { major: true, altcoins: true, count: 150 },
        etfs: { available: true, count: 150 }
    },
    tradingConditionsExtended: {
        maxLeverage: '1:30 (Retail), 1:500 (Professional)',
        minLotSize: 0.01,
        marginCallLevel: '100%',
        stopOutLevel: '50%',
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true
    },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
        depositFees: 'None',
        withdrawalFees: 'None',
        processingTime: {
            deposits: 'Instant for cards and e-wallets',
            withdrawals: '1-3 business days'
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English', 'German', 'Spanish', 'French', 'Italian'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'FCA', licenseNumber: '793743' },
            { regulator: 'ASIC', licenseNumber: '513393' },
            { regulator: 'CySEC', licenseNumber: '319/17' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        executionSpeedMs: 50,
        slippage: 'Very Low',
        requotes: false,
        marketDepth: true,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        guaranteedStopLoss: {
            available: false,
            cost: 'N/A'
        }
    },
    platformFeatures: {
        charting: {
            indicators: 75,
            drawingTools: 40
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
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP', 'PLN'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2016,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['FCA', 'ASIC', 'CySEC']
    },
    ratings: {
        regulation: 9.5,
        costs: 8.5,
        platforms: 8.0,
        support: 8.5
    },
    tradingConditions: {
        spreads: { eurusd: 0.67, gbpusd: 0.9, usdjpy: 0.8 },
        commission: 'No commission on standard accounts',
        swapFeeCategory: 'Low',
        maxLeverage: '1:30 (Retail), 1:500 (Professional)',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 0,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'PayPal'],
        customerSupport: ['24/5 Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['Capital.com Platform', 'MT4'],
        executionType: 'STP',
        apiAccess: true,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'blackbull-markets',
    name: 'BlackBull Markets',
    logoUrl: '/broker-logos/blackbull.png',
    websiteUrl: 'https://blackbull.com/',
    score: 8.7,
    foundingYear: 2014,
    headquarters: 'Auckland, New Zealand',
    description: 'BlackBull Markets is a New Zealand-based ECN broker offering raw spreads, fast execution, and access to over 26,000 trading instruments.',
    summary: 'BlackBull Markets has rapidly grown since 2014 to become a respected ECN broker known for its raw spreads starting from 0.0 pips and impressive execution speeds. Regulated by the FMA (NZ) and FSA (Seychelles), the broker offers a comprehensive range of platforms including MT4, MT5, cTrader, and TradingView. With account types ranging from $0 minimum deposit to institutional levels, BlackBull caters to traders of all experience levels seeking genuine ECN trading conditions.',
    pros: [
        'True ECN trading with raw spreads from 0.0 pips',
        'Fast execution speeds (average 0.11s on Prime accounts)',
        'Wide range of trading platforms (MT4, MT5, cTrader, TradingView)',
        'Access to 26,000+ trading instruments',
        'Multiple regulatory jurisdictions',
        'No minimum deposit on Standard accounts'
    ],
    cons: [
        'Limited educational resources',
        'No proprietary trading platform',
        'Thin regulatory coverage compared to major brokers',
        'No guaranteed stop loss'
    ],

    coreInfo: {
        brokerType: 'ECN',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'STP', minDeposit: 0, spreads: 'From 0.71 pips', commission: 'No commission', bestFor: 'Beginners and casual traders' },
        { name: 'Prime Account', type: 'ECN', minDeposit: 2000, spreads: 'From 0.11 pips', commission: '$3 per lot per side', bestFor: 'Serious traders seeking raw spreads' },
        { name: 'Institutional Account', type: 'ECN', minDeposit: 20000, spreads: 'From 0.0 pips', commission: '$2 per lot per side', bestFor: 'High-volume professional traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Raw',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.11 pips + $3 commission' },
                { pair: 'GBP/USD', spread: '0.15 pips + $3 commission' },
                { pair: 'Gold', spread: '0.2 pips + $3 commission' }
            ],
            commissionStructure: "$3 per lot per side on Prime accounts, $2 on Institutional",
            overnightSwapFees: "Competitive swap rates. Islamic accounts available."
        },
        nonTrading: {
            inactivityFee: "None",
            withdrawalFee: "None",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { major: true, minor: true, exotic: true, count: 80 },
        commodities: { preciousMetals: true, energy: true, agricultural: true, count: 30 },
        indices: { major: true, minor: true, count: 40 },
        stocks: { us: true, european: true, asian: true, count: 25000 },
        cryptocurrencies: { major: true, altcoins: true, count: 12 }
    },
    tradingConditionsExtended: {
        maxLeverage: '1:500',
        minLotSize: 0.01,
        marginCallLevel: '100%',
        stopOutLevel: '50%',
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true
    },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'FasaPay'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'FasaPay'],
        depositFees: 'None',
        withdrawalFees: 'None',
        processingTime: {
            deposits: 'Instant for cards and e-wallets',
            withdrawals: '1-3 business days'
        },
        minWithdrawal: 1
    },
    customerSupport: {
        languages: ['English', 'Chinese', 'Spanish', 'Arabic'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'FMA', licenseNumber: 'FSP456631' },
            { regulator: 'FSA', licenseNumber: 'SD045' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: false, amount: 'N/A' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        executionSpeedMs: 110,
        slippage: 'Very Low',
        requotes: false,
        marketDepth: true,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        guaranteedStopLoss: {
            available: false,
            cost: 'N/A'
        }
    },
    platformFeatures: {
        charting: {
            indicators: 80,
            drawingTools: 40
        },
        automatedTrading: ['EAs', 'cBots', 'API'],
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
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD', 'NZD', 'JPY'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2014,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['FMA', 'FSA']
    },
    ratings: {
        regulation: 7.5,
        costs: 9.0,
        platforms: 9.0,
        support: 8.0
    },
    tradingConditions: {
        spreads: { eurusd: 0.11, gbpusd: 0.15, usdjpy: 0.12 },
        commission: '$3 per lot per side',
        swapFeeCategory: 'Low',
        maxLeverage: '1:500',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 0,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'FasaPay'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'FasaPay'],
        customerSupport: ['24/5 Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'cTrader', 'TradingView'],
        executionType: 'ECN',
        apiAccess: true,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'ictrading',
    name: 'IC Trading',
    logoUrl: '/broker-logos/ictrading.png',
    websiteUrl: 'https://ictrading.com/',
    score: 7.8,
    foundingYear: 2020,
    headquarters: 'Port Louis, Mauritius',
    description: 'IC Trading is a Mauritius-based broker offering competitive spreads from 0.0 pips, high leverage up to 1:500, and access to multiple trading platforms.',
    summary: 'IC Trading operates under FSC (Mauritius) regulation, offering traders access to raw spreads starting from 0.0 pips with commissions from $3 per lot. The broker provides multiple platform options including MetaTrader 4/5, cTrader, and ZuluTrade, making it suitable for various trading styles. With a $200 minimum deposit and leverage up to 1:500, IC Trading appeals to traders seeking competitive pricing in a less regulated environment.',
    pros: [
        'Raw spreads from 0.0 pips',
        'High leverage up to 1:500',
        'Multiple trading platforms (MT4, MT5, cTrader, ZuluTrade)',
        '24/7 customer support',
        'Wide range of trading instruments',
        'Competitive commission structure'
    ],
    cons: [
        'Less stringent regulation (FSC Mauritius)',
        'Limited educational resources',
        'Higher minimum deposit ($200)',
        'No guaranteed stop loss',
        'Limited investor protection'
    ],

    coreInfo: {
        brokerType: 'ECN',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'RAW Spread Account', type: 'ECN', minDeposit: 200, spreads: 'From 0.0 pips', commission: 'From $3 per lot', bestFor: 'Scalpers and day traders' },
        { name: 'Standard Account', type: 'STP', minDeposit: 200, spreads: 'From 1.0 pip', commission: 'No commission', bestFor: 'Beginners and position traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Raw',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.0 pips + $3 commission' },
                { pair: 'GBP/USD', spread: '0.1 pips + $3 commission' },
                { pair: 'Gold', spread: '0.2 pips + $3 commission' }
            ],
            commissionStructure: "From $3 per lot per side on RAW accounts",
            overnightSwapFees: "Standard swap rates. Islamic accounts may be available."
        },
        nonTrading: {
            inactivityFee: "May apply after extended inactivity",
            withdrawalFee: "None for most methods",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { major: true, minor: true, exotic: true, count: 60 },
        commodities: { preciousMetals: true, energy: true, agricultural: true, count: 20 },
        indices: { major: true, minor: true, count: 30 },
        stocks: { us: true, european: true, asian: true, count: 1000 },
        cryptocurrencies: { major: true, altcoins: true, count: 15 },
        bonds: { available: true, count: 10 }
    },
    tradingConditionsExtended: {
        maxLeverage: '1:500',
        minLotSize: 0.01,
        marginCallLevel: '100%',
        stopOutLevel: '50%',
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true
    },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        depositFees: 'None',
        withdrawalFees: 'None',
        processingTime: {
            deposits: 'Instant for cards and e-wallets',
            withdrawals: '1-3 business days'
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English', 'Chinese', 'Arabic', 'Russian'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/7'
    },
    security: {
        regulatedBy: [
            { regulator: 'FSC', licenseNumber: 'C119019677' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: false, amount: 'N/A' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        executionSpeedMs: 120,
        slippage: 'Low',
        requotes: false,
        marketDepth: true,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        guaranteedStopLoss: {
            available: false,
            cost: 'N/A'
        }
    },
    platformFeatures: {
        charting: {
            indicators: 60,
            drawingTools: 30
        },
        automatedTrading: ['EAs', 'cBots', 'ZuluTrade'],
        copyTrading: {
            available: true,
            platforms: ['ZuluTrade']
        },
        backtesting: true,
        newsIntegration: true
    },
    accountManagement: {
        islamicAccount: {
            available: true,
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2020,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['FSC']
    },
    ratings: {
        regulation: 6.0,
        costs: 8.5,
        platforms: 8.0,
        support: 8.5
    },
    tradingConditions: {
        spreads: { eurusd: 0.0, gbpusd: 0.1, usdjpy: 0.1 },
        commission: '$3 per lot per side',
        swapFeeCategory: 'Medium',
        maxLeverage: '1:500',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 200,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        customerSupport: ['24/7 Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'cTrader', 'ZuluTrade'],
        executionType: 'ECN',
        apiAccess: true,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: true,
    providesSignals: false
  },
  {
    id: 'easymarkets',
    name: 'EasyMarkets',
    logoUrl: '/broker-logos/easymarkets.png',
    websiteUrl: 'https://easymarkets.com/',
    score: 8.0,
    foundingYear: 2001,
    headquarters: 'Limassol, Cyprus',
    description: 'EasyMarkets is a veteran broker offering fixed spreads, guaranteed stop loss, and a user-friendly platform with no hidden fees.',
    summary: 'EasyMarkets has been operating since 2001, establishing itself as a broker focused on trader protection and simplicity. The broker stands out with its fixed spreads that never change during trading hours, guaranteed stop loss with no slippage (available as a premium feature), and negative balance protection. With multiple platforms including their proprietary platform, TradingView, MT4, and MT5, EasyMarkets caters to traders of all experience levels seeking predictable trading conditions.',
    pros: [
        'Fixed spreads that never change during trading hours',
        'Guaranteed stop loss with no slippage (premium feature)',
        'Negative balance protection',
        'No commissions or hidden fees',
        'Multiple trading platforms',
        'High leverage up to 1:2000'
    ],
    cons: [
        'Limited educational resources',
        'No copy trading features',
        'Fixed spreads may be wider than variable spreads',
        'Limited research tools'
    ],

    coreInfo: {
        brokerType: 'Market Maker',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'Standard', minDeposit: 100, spreads: 'Fixed spreads', commission: 'No commission', bestFor: 'Beginners and casual traders' },
        { name: 'Premium Account', type: 'Premium', minDeposit: 1000, spreads: 'Tighter fixed spreads', commission: 'No commission', bestFor: 'Active traders' },
        { name: 'VIP Account', type: 'VIP', minDeposit: 5000, spreads: 'Tightest fixed spreads', commission: 'No commission', bestFor: 'High-volume traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Fixed',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.7 pips' },
                { pair: 'GBP/USD', spread: '1.3 pips' },
                { pair: 'Gold', spread: '35 pips' }
            ],
            commissionStructure: "No commissions or hidden fees",
            overnightSwapFees: "Standard swap rates. Islamic accounts available."
        },
        nonTrading: {
            inactivityFee: "May apply after extended inactivity",
            withdrawalFee: "None",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { major: true, minor: true, exotic: true, count: 50 },
        commodities: { preciousMetals: true, energy: true, agricultural: true, count: 15 },
        indices: { major: true, minor: true, count: 20 },
        stocks: { us: true, european: true, asian: true, count: 200 },
        cryptocurrencies: { major: true, altcoins: true, count: 15 }
    },
    tradingConditionsExtended: {
        maxLeverage: '1:2000 (MT5), 1:400 (other platforms)',
        minLotSize: 0.01,
        marginCallLevel: '100%',
        stopOutLevel: '50%',
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true
    },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        depositFees: 'None',
        withdrawalFees: 'None',
        processingTime: {
            deposits: 'Instant for cards and e-wallets',
            withdrawals: '1-3 business days'
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English', 'Arabic', 'Chinese', 'Spanish'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'CySEC', licenseNumber: '079/07' },
            { regulator: 'ASIC', licenseNumber: '246566' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to €20,000 (CySEC)' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        executionSpeedMs: 150,
        slippage: 'None (with guaranteed stop loss)',
        requotes: false,
        marketDepth: false,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        guaranteedStopLoss: {
            available: true,
            cost: 'Premium add-on'
        }
    },
    platformFeatures: {
        charting: {
            indicators: 40,
            drawingTools: 25
        },
        automatedTrading: ['EAs'],
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
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2001,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['CySEC', 'ASIC']
    },
    ratings: {
        regulation: 8.0,
        costs: 7.5,
        platforms: 7.0,
        support: 8.0
    },
    tradingConditions: {
        spreads: { eurusd: 0.7, gbpusd: 1.3, usdjpy: 1.0 },
        commission: 'No commission',
        swapFeeCategory: 'Medium',
        maxLeverage: '1:2000',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 100,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        customerSupport: ['24/5 Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['EasyMarkets Platform', 'TradingView', 'MT4', 'MT5'],
        executionType: 'Market Maker',
        apiAccess: false,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'freedom24',
    name: 'Freedom24',
    logoUrl: '/broker-logos/freedom24.png',
    websiteUrl: 'https://freedom24.com/',
    score: 8.2,
    foundingYear: 2001,
    headquarters: 'Limassol, Cyprus',
    description: 'Freedom24 is a European broker offering access to global markets with competitive pricing and modern trading technology.',
    summary: 'Freedom24 provides European investors with access to global markets including stocks, ETFs, options, and futures. The broker combines competitive commission structures with modern trading technology and regulatory oversight from European authorities.',
    pros: [
        'Competitive commission structure',
        'Access to global markets',
        'European regulatory oversight',
        'Modern trading platform',
        'Wide range of investment products'
    ],
    cons: [
        'Limited educational resources',
        'No guaranteed stop loss',
        'Platform learning curve for beginners',
        'Limited research tools'
    ],
    coreInfo: {
        brokerType: 'STP',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'Standard', minDeposit: 0, spreads: 'Variable', commission: 'Competitive', bestFor: 'All trader levels' }
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: 'Competitive' },
                { pair: 'GBP/USD', spread: 'Competitive' }
            ],
            commissionStructure: "Competitive commission-based pricing",
            overnightSwapFees: "Standard swap rates apply"
        },
        nonTrading: {
            inactivityFee: "May apply",
            withdrawalFee: "None",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { major: true, minor: true, exotic: false, count: 30 },
        commodities: { preciousMetals: true, energy: true, agricultural: true, count: 15 },
        indices: { major: true, minor: true, count: 25 },
        stocks: { us: true, european: true, asian: true, count: 1000 },
        cryptocurrencies: { major: true, altcoins: false, count: 5 }
    },
    tradingConditionsExtended: {
        maxLeverage: '1:30',
        minLotSize: 0.01,
        marginCallLevel: '100%',
        stopOutLevel: '50%',
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true
    },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card'],
        depositFees: 'None',
        withdrawalFees: 'None',
        processingTime: {
            deposits: '1-3 business days',
            withdrawals: '1-3 business days'
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English', 'German', 'French'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'CySEC', licenseNumber: 'Pending' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to €20,000' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        executionSpeedMs: 100,
        slippage: 'Low',
        requotes: false,
        marketDepth: true,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        guaranteedStopLoss: {
            available: false,
            cost: 'N/A'
        }
    },
    platformFeatures: {
        charting: {
            indicators: 50,
            drawingTools: 30
        },
        automatedTrading: ['EAs'],
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
            conditions: 'N/A'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2001,
        tradingVolumeDisclosed: false,
        clientBase: 'European focused'
    },
    regulation: {
        regulators: ['CySEC']
    },
    ratings: {
        regulation: 7.5,
        costs: 8.0,
        platforms: 7.5,
        support: 8.0
    },
    tradingConditions: {
        spreads: { eurusd: 'Competitive', gbpusd: 'Competitive', usdjpy: 'Competitive' },
        commission: 'Competitive',
        swapFeeCategory: 'Low',
        maxLeverage: '1:30',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 0,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card'],
        customerSupport: ['24/5 Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['Freedom24 Platform'],
        executionType: 'STP',
        apiAccess: true,
        eaSupport: true
    },
    reviews: [],
    isIslamic: false,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'fxoro',
    name: 'FXORO',
    logoUrl: '/broker-logos/fxoro.png',
    websiteUrl: 'https://fxoro.com/',
    score: 7.5,
    foundingYear: 2012,
    headquarters: 'Limassol, Cyprus',
    description: 'FXORO is a Cyprus-based forex and CFD broker offering multiple trading platforms and competitive trading conditions.',
    summary: 'FXORO provides traders with access to forex, commodities, indices, and cryptocurrencies through multiple trading platforms including MT4 and MT5. The broker operates under CySEC regulation, offering competitive spreads and leverage options suitable for various trading styles.',
    pros: [
        'CySEC regulation',
        'Multiple trading platforms',
        'Competitive spreads',
        'Wide range of instruments',
        'Educational resources'
    ],
    cons: [
        'Limited research tools',
        'No guaranteed stop loss',
        'Platform learning curve',
        'Limited copy trading'
    ],
    coreInfo: {
        brokerType: 'Market Maker',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'Standard', minDeposit: 250, spreads: 'From 1.0 pip', commission: 'No commission', bestFor: 'Beginners and casual traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: 'From 1.0 pip' },
                { pair: 'GBP/USD', spread: 'From 1.2 pips' }
            ],
            commissionStructure: "No commission on standard accounts",
            overnightSwapFees: "Standard swap rates apply"
        },
        nonTrading: {
            inactivityFee: "May apply",
            withdrawalFee: "None",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { major: true, minor: true, exotic: true, count: 50 },
        commodities: { preciousMetals: true, energy: true, agricultural: true, count: 15 },
        indices: { major: true, minor: true, count: 20 },
        stocks: { us: true, european: true, asian: true, count: 100 },
        cryptocurrencies: { major: true, altcoins: true, count: 10 }
    },
    tradingConditionsExtended: {
        maxLeverage: '1:500',
        minLotSize: 0.01,
        marginCallLevel: '100%',
        stopOutLevel: '50%',
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true
    },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        depositFees: 'None',
        withdrawalFees: 'None',
        processingTime: {
            deposits: 'Instant for cards and e-wallets',
            withdrawals: '1-3 business days'
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English', 'Arabic', 'Chinese'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'CySEC', licenseNumber: 'Pending' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to €20,000' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        executionSpeedMs: 150,
        slippage: 'Low',
        requotes: false,
        marketDepth: false,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        guaranteedStopLoss: {
            available: false,
            cost: 'N/A'
        }
    },
    platformFeatures: {
        charting: {
            indicators: 30,
            drawingTools: 20
        },
        automatedTrading: ['EAs'],
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
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2012,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['CySEC']
    },
    ratings: {
        regulation: 7.0,
        costs: 7.5,
        platforms: 7.0,
        support: 7.5
    },
    tradingConditions: {
        spreads: { eurusd: 1.0, gbpusd: 1.2, usdjpy: 1.1 },
        commission: 'No commission',
        swapFeeCategory: 'Medium',
        maxLeverage: '1:500',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 250,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        customerSupport: ['24/5 Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'WebTrader'],
        executionType: 'Market Maker',
        apiAccess: false,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'startrader-global',
    name: 'StarTrader',
    logoUrl: '/broker-logos/startrader.png',
    websiteUrl: 'https://startrader.com/',
    score: 7.8,
    foundingYear: 2019,
    headquarters: 'Limassol, Cyprus',
    description: 'StarTrader is a modern forex and CFD broker offering competitive trading conditions and multiple platform options.',
    summary: 'StarTrader provides traders with access to global markets through advanced trading platforms with competitive spreads and leverage. The broker focuses on providing a user-friendly trading experience with comprehensive educational resources.',
    pros: [
        'Competitive spreads',
        'Multiple trading platforms',
        'Educational resources',
        'Mobile trading apps',
        'Demo accounts available'
    ],
    cons: [
        'Relatively new broker',
        'Limited regulatory information',
        'No guaranteed stop loss',
        'Limited copy trading'
    ],
    coreInfo: {
        brokerType: 'STP',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'Standard', minDeposit: 100, spreads: 'From 1.0 pip', commission: 'No commission', bestFor: 'All trader levels' }
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: 'From 1.0 pip' },
                { pair: 'GBP/USD', spread: 'From 1.2 pips' }
            ],
            commissionStructure: "No commission on standard accounts",
            overnightSwapFees: "Standard swap rates apply"
        },
        nonTrading: {
            inactivityFee: "May apply",
            withdrawalFee: "None",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { major: true, minor: true, exotic: true, count: 40 },
        commodities: { preciousMetals: true, energy: true, agricultural: true, count: 12 },
        indices: { major: true, minor: true, count: 15 },
        stocks: { us: true, european: true, asian: true, count: 50 },
        cryptocurrencies: { major: true, altcoins: true, count: 8 }
    },
    tradingConditionsExtended: {
        maxLeverage: '1:500',
        minLotSize: 0.01,
        marginCallLevel: '100%',
        stopOutLevel: '50%',
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true
    },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        depositFees: 'None',
        withdrawalFees: 'None',
        processingTime: {
            deposits: 'Instant for cards and e-wallets',
            withdrawals: '1-3 business days'
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English', 'Arabic', 'Chinese'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'CySEC', licenseNumber: 'Pending' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to €20,000' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        executionSpeedMs: 120,
        slippage: 'Low',
        requotes: false,
        marketDepth: false,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        guaranteedStopLoss: {
            available: false,
            cost: 'N/A'
        }
    },
    platformFeatures: {
        charting: {
            indicators: 40,
            drawingTools: 25
        },
        automatedTrading: ['EAs'],
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
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2019,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['CySEC']
    },
    ratings: {
        regulation: 7.0,
        costs: 7.5,
        platforms: 7.5,
        support: 8.0
    },
    tradingConditions: {
        spreads: { eurusd: 1.0, gbpusd: 1.2, usdjpy: 1.1 },
        commission: 'No commission',
        swapFeeCategory: 'Medium',
        maxLeverage: '1:500',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 100,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        customerSupport: ['24/5 Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'WebTrader'],
        executionType: 'STP',
        apiAccess: false,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'puprime',
    name: 'PU Prime',
    logoUrl: '/broker-logos/puprime.png',
    websiteUrl: 'https://puprime.com/',
    score: 8.0,
    foundingYear: 2015,
    headquarters: 'Port Vila, Vanuatu',
    description: 'PU Prime is a global forex and CFD broker offering competitive trading conditions and multiple platform options.',
    summary: 'PU Prime provides traders with access to forex, commodities, indices, and cryptocurrencies through multiple trading platforms. The broker offers competitive spreads, high leverage, and a range of account types suitable for different trading strategies.',
    pros: [
        'Competitive spreads',
        'High leverage options',
        'Multiple trading platforms',
        'Wide range of instruments',
        'Mobile trading available'
    ],
    cons: [
        'Vanuatu regulation (less stringent)',
        'No guaranteed stop loss',
        'Limited educational resources',
        'No copy trading features'
    ],
    coreInfo: {
        brokerType: 'ECN',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'Standard', minDeposit: 50, spreads: 'From 1.2 pips', commission: 'No commission', bestFor: 'Beginners' },
        { name: 'ECN Account', type: 'ECN', minDeposit: 500, spreads: 'From 0.0 pips', commission: '$3 per lot', bestFor: 'Experienced traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: 'From 1.2 pips' },
                { pair: 'GBP/USD', spread: 'From 1.4 pips' }
            ],
            commissionStructure: "No commission on Standard, $3 per lot per side on ECN",
            overnightSwapFees: "Standard swap rates apply"
        },
        nonTrading: {
            inactivityFee: "May apply",
            withdrawalFee: "None",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { major: true, minor: true, exotic: true, count: 60 },
        commodities: { preciousMetals: true, energy: true, agricultural: true, count: 20 },
        indices: { major: true, minor: true, count: 25 },
        stocks: { us: true, european: true, asian: true, count: 100 },
        cryptocurrencies: { major: true, altcoins: true, count: 12 }
    },
    tradingConditionsExtended: {
        maxLeverage: '1:500',
        minLotSize: 0.01,
        marginCallLevel: '100%',
        stopOutLevel: '50%',
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true
    },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        depositFees: 'None',
        withdrawalFees: 'None',
        processingTime: {
            deposits: 'Instant for cards and e-wallets',
            withdrawals: '1-3 business days'
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English', 'Chinese', 'Arabic'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'VFSC', licenseNumber: 'Pending' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: false, amount: 'N/A' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        executionSpeedMs: 100,
        slippage: 'Low',
        requotes: false,
        marketDepth: true,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        guaranteedStopLoss: {
            available: false,
            cost: 'N/A'
        }
    },
    platformFeatures: {
        charting: {
            indicators: 50,
            drawingTools: 30
        },
        automatedTrading: ['EAs'],
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
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2015,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['VFSC']
    },
    ratings: {
        regulation: 6.0,
        costs: 8.0,
        platforms: 8.0,
        support: 7.5
    },
    tradingConditions: {
        spreads: { eurusd: 1.2, gbpusd: 1.4, usdjpy: 1.3 },
        commission: '$3 per lot per side on ECN',
        swapFeeCategory: 'Medium',
        maxLeverage: '1:500',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 50,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        customerSupport: ['24/5 Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'WebTrader'],
        executionType: 'ECN',
        apiAccess: true,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'gbe-brokers',
    name: 'GBE Brokers',
    logoUrl: '/broker-logos/gbe-brokers.png',
    websiteUrl: 'https://gbebrokers.com/',
    score: 8.1,
    foundingYear: 2012,
    headquarters: 'Limassol, Cyprus',
    description: 'GBE Brokers is a Cyprus-based forex and CFD broker offering competitive trading conditions and regulatory oversight.',
    summary: 'GBE Brokers provides traders with access to global markets through multiple trading platforms with competitive spreads and leverage. The broker operates under CySEC regulation, offering a secure trading environment with comprehensive educational resources.',
    pros: [
        'CySEC regulation',
        'Competitive spreads',
        'Multiple trading platforms',
        'Educational resources',
        'Negative balance protection'
    ],
    cons: [
        'No guaranteed stop loss',
        'Limited copy trading',
        'Platform learning curve',
        'No proprietary platform'
    ],
    coreInfo: {
        brokerType: 'STP',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'Standard', minDeposit: 200, spreads: 'From 1.0 pip', commission: 'No commission', bestFor: 'All trader levels' }
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: 'From 1.0 pip' },
                { pair: 'GBP/USD', spread: 'From 1.2 pips' }
            ],
            commissionStructure: "No commission on standard accounts",
            overnightSwapFees: "Standard swap rates apply"
        },
        nonTrading: {
            inactivityFee: "May apply",
            withdrawalFee: "None",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { major: true, minor: true, exotic: true, count: 50 },
        commodities: { preciousMetals: true, energy: true, agricultural: true, count: 15 },
        indices: { major: true, minor: true, count: 20 },
        stocks: { us: true, european: true, asian: true, count: 100 },
        cryptocurrencies: { major: true, altcoins: true, count: 10 }
    },
    tradingConditionsExtended: {
        maxLeverage: '1:500',
        minLotSize: 0.01,
        marginCallLevel: '100%',
        stopOutLevel: '50%',
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true
    },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        depositFees: 'None',
        withdrawalFees: 'None',
        processingTime: {
            deposits: 'Instant for cards and e-wallets',
            withdrawals: '1-3 business days'
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English', 'German', 'Arabic'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'CySEC', licenseNumber: 'Pending' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to €20,000' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        executionSpeedMs: 120,
        slippage: 'Low',
        requotes: false,
        marketDepth: false,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        guaranteedStopLoss: {
            available: false,
            cost: 'N/A'
        }
    },
    platformFeatures: {
        charting: {
            indicators: 40,
            drawingTools: 25
        },
        automatedTrading: ['EAs'],
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
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2012,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['CySEC']
    },
    ratings: {
        regulation: 7.5,
        costs: 8.0,
        platforms: 7.5,
        support: 8.0
    },
    tradingConditions: {
        spreads: { eurusd: 1.0, gbpusd: 1.2, usdjpy: 1.1 },
        commission: 'No commission',
        swapFeeCategory: 'Medium',
        maxLeverage: '1:500',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 200,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        customerSupport: ['24/5 Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'WebTrader'],
        executionType: 'STP',
        apiAccess: false,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'thunder-markets',
    name: 'Thunder Markets',
    logoUrl: '/broker-logos/thunder-markets.png',
    websiteUrl: 'https://thundermarkets.com/',
    score: 7.6,
    foundingYear: 2018,
    headquarters: 'Port Vila, Vanuatu',
    description: 'Thunder Markets is a Vanuatu-based forex and CFD broker offering competitive trading conditions and high leverage.',
    summary: 'Thunder Markets provides traders with access to global markets through MT4 and MT5 platforms with competitive spreads and high leverage options. The broker focuses on providing straightforward trading conditions suitable for various trading strategies.',
    pros: [
        'Competitive spreads',
        'High leverage options',
        'Multiple trading platforms',
        'Wide range of instruments',
        'Mobile trading available'
    ],
    cons: [
        'Vanuatu regulation (less stringent)',
        'No guaranteed stop loss',
        'Limited educational resources',
        'No copy trading features'
    ],
    coreInfo: {
        brokerType: 'ECN',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'Standard', minDeposit: 100, spreads: 'From 1.2 pips', commission: 'No commission', bestFor: 'All trader levels' }
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: 'From 1.2 pips' },
                { pair: 'GBP/USD', spread: 'From 1.4 pips' }
            ],
            commissionStructure: "No commission on standard accounts",
            overnightSwapFees: "Standard swap rates apply"
        },
        nonTrading: {
            inactivityFee: "May apply",
            withdrawalFee: "None",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { major: true, minor: true, exotic: true, count: 50 },
        commodities: { preciousMetals: true, energy: true, agricultural: true, count: 15 },
        indices: { major: true, minor: true, count: 20 },
        stocks: { us: true, european: true, asian: true, count: 50 },
        cryptocurrencies: { major: true, altcoins: true, count: 10 }
    },
    tradingConditionsExtended: {
        maxLeverage: '1:500',
        minLotSize: 0.01,
        marginCallLevel: '100%',
        stopOutLevel: '50%',
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true
    },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        depositFees: 'None',
        withdrawalFees: 'None',
        processingTime: {
            deposits: 'Instant for cards and e-wallets',
            withdrawals: '1-3 business days'
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English', 'Chinese', 'Arabic'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'VFSC', licenseNumber: 'Pending' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: false, amount: 'N/A' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        executionSpeedMs: 100,
        slippage: 'Low',
        requotes: false,
        marketDepth: true,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        guaranteedStopLoss: {
            available: false,
            cost: 'N/A'
        }
    },
    platformFeatures: {
        charting: {
            indicators: 40,
            drawingTools: 25
        },
        automatedTrading: ['EAs'],
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
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2018,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['VFSC']
    },
    ratings: {
        regulation: 6.0,
        costs: 7.5,
        platforms: 7.5,
        support: 7.5
    },
    tradingConditions: {
        spreads: { eurusd: 1.2, gbpusd: 1.4, usdjpy: 1.3 },
        commission: 'No commission',
        swapFeeCategory: 'Medium',
        maxLeverage: '1:500',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 100,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        customerSupport: ['24/5 Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'WebTrader'],
        executionType: 'ECN',
        apiAccess: true,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'superforex',
    name: 'SuperForex',
    logoUrl: '/broker-logos/superforex.png',
    websiteUrl: 'https://superforex.com/',
    score: 7.8,
    foundingYear: 2013,
    headquarters: 'Port Vila, Vanuatu',
    description: 'SuperForex is a global forex and CFD broker offering competitive trading conditions and multiple account types.',
    summary: 'SuperForex provides traders with access to forex, commodities, indices, and cryptocurrencies through MT4 and MT5 platforms. The broker offers competitive spreads, high leverage up to 1:1000, and a range of account types suitable for different trading strategies and experience levels.',
    pros: [
        'High leverage up to 1:1000',
        'Multiple account types',
        'Competitive spreads',
        'Mobile trading available',
        'Wide range of instruments'
    ],
    cons: [
        'Vanuatu regulation (less stringent)',
        'No guaranteed stop loss',
        'Limited educational resources',
        'No copy trading features'
    ],
    coreInfo: {
        brokerType: 'ECN',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Cent Account', type: 'Standard', minDeposit: 1, spreads: 'From 1.8 pips', commission: 'No commission', bestFor: 'Beginners' },
        { name: 'Standard Account', type: 'Standard', minDeposit: 50, spreads: 'From 1.2 pips', commission: 'No commission', bestFor: 'Regular traders' },
        { name: 'ECN Account', type: 'ECN', minDeposit: 500, spreads: 'From 0.0 pips', commission: '$3 per lot', bestFor: 'Experienced traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: 'From 1.2 pips' },
                { pair: 'GBP/USD', spread: 'From 1.4 pips' }
            ],
            commissionStructure: "No commission on standard accounts, $3 per lot per side on ECN",
            overnightSwapFees: "Standard swap rates apply"
        },
        nonTrading: {
            inactivityFee: "May apply",
            withdrawalFee: "None",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { major: true, minor: true, exotic: true, count: 60 },
        commodities: { preciousMetals: true, energy: true, agricultural: true, count: 20 },
        indices: { major: true, minor: true, count: 25 },
        stocks: { us: true, european: true, asian: true, count: 100 },
        cryptocurrencies: { major: true, altcoins: true, count: 15 }
    },
    tradingConditionsExtended: {
        maxLeverage: '1:1000',
        minLotSize: 0.01,
        marginCallLevel: '100%',
        stopOutLevel: '50%',
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true
    },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney', 'Bitcoin'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney', 'Bitcoin'],
        depositFees: 'None',
        withdrawalFees: 'None',
        processingTime: {
            deposits: 'Instant for cards and e-wallets',
            withdrawals: '1-3 business days'
        },
        minWithdrawal: 1
    },
    customerSupport: {
        languages: ['English', 'Chinese', 'Arabic', 'Russian'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/7'
    },
    security: {
        regulatedBy: [
            { regulator: 'VFSC', licenseNumber: 'Pending' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: false, amount: 'N/A' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        executionSpeedMs: 100,
        slippage: 'Low',
        requotes: false,
        marketDepth: true,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        guaranteedStopLoss: {
            available: false,
            cost: 'N/A'
        }
    },
    platformFeatures: {
        charting: {
            indicators: 50,
            drawingTools: 30
        },
        automatedTrading: ['EAs'],
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
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2013,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['VFSC']
    },
    ratings: {
        regulation: 6.0,
        costs: 7.5,
        platforms: 7.5,
        support: 8.0
    },
    tradingConditions: {
        spreads: { eurusd: 1.2, gbpusd: 1.4, usdjpy: 1.3 },
        commission: '$3 per lot per side on ECN',
        swapFeeCategory: 'Medium',
        maxLeverage: '1:1000',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 1,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney', 'Bitcoin'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney', 'Bitcoin'],
        customerSupport: ['24/7 Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'WebTrader'],
        executionType: 'ECN',
        apiAccess: true,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'instaforex',
    name: 'InstaForex',
    logoUrl: '/broker-logos/instaforex.png',
    websiteUrl: 'https://instaforex.com/',
    score: 8.0,
    foundingYear: 2007,
    headquarters: 'Limassol, Cyprus',
    description: 'InstaForex is a well-established forex broker offering competitive trading conditions and innovative trading tools.',
    summary: 'InstaForex has been operating since 2007, providing traders with access to forex, CFDs, futures, and cryptocurrencies. The broker offers competitive spreads, leverage up to 1:1000, and unique features like PAMM accounts and binary options. With multiple regulatory licenses and a strong global presence, InstaForex caters to traders of all experience levels.',
    pros: [
        'Established broker since 2007',
        'Multiple regulatory jurisdictions',
        'Competitive spreads and high leverage',
        'PAMM accounts available',
        'Wide range of trading instruments',
        'Innovative trading tools'
    ],
    cons: [
        'No guaranteed stop loss',
        'Limited educational resources',
        'Platform complexity for beginners',
        'Variable withdrawal processing times'
    ],
    coreInfo: {
        brokerType: 'ECN',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'Standard', minDeposit: 1, spreads: 'From 1.3 pips', commission: 'No commission', bestFor: 'Beginners' },
        { name: 'ECN Account', type: 'ECN', minDeposit: 1000, spreads: 'From 0.0 pips', commission: '$3 per lot', bestFor: 'Professional traders' },
        { name: 'PAMM Account', type: 'PAMM', minDeposit: 10000, spreads: 'Variable', commission: 'Performance fee', bestFor: 'Investment managers' }
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: 'From 1.3 pips' },
                { pair: 'GBP/USD', spread: 'From 1.5 pips' }
            ],
            commissionStructure: "No commission on standard accounts, $3 per lot per side on ECN",
            overnightSwapFees: "Standard swap rates apply"
        },
        nonTrading: {
            inactivityFee: "None",
            withdrawalFee: "None for most methods",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { major: true, minor: true, exotic: true, count: 107 },
        commodities: { preciousMetals: true, energy: true, agricultural: true, count: 25 },
        indices: { major: true, minor: true, count: 30 },
        stocks: { us: true, european: true, asian: true, count: 150 },
        cryptocurrencies: { major: true, altcoins: true, count: 20 },
        futures: { available: true, count: 15 }
    },
    tradingConditionsExtended: {
        maxLeverage: '1:1000',
        minLotSize: 0.01,
        marginCallLevel: '100%',
        stopOutLevel: '50%',
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true
    },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney', 'Bitcoin', 'Ethereum'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney', 'Bitcoin', 'Ethereum'],
        depositFees: 'None',
        withdrawalFees: 'None for most methods',
        processingTime: {
            deposits: 'Instant for cards and e-wallets',
            withdrawals: '1-5 business days'
        },
        minWithdrawal: 1
    },
    customerSupport: {
        languages: ['English', 'Chinese', 'Arabic', 'Russian', 'Spanish'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/7'
    },
    security: {
        regulatedBy: [
            { regulator: 'CySEC', licenseNumber: 'Pending' },
            { regulator: 'BVI FSC', licenseNumber: 'Pending' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to €20,000' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        executionSpeedMs: 120,
        slippage: 'Low',
        requotes: false,
        marketDepth: true,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        guaranteedStopLoss: {
            available: false,
            cost: 'N/A'
        }
    },
    platformFeatures: {
        charting: {
            indicators: 60,
            drawingTools: 35
        },
        automatedTrading: ['EAs'],
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
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP', 'RUB'],
        mamPammSupport: true,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2007,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['CySEC', 'BVI FSC']
    },
    ratings: {
        regulation: 7.0,
        costs: 8.0,
        platforms: 8.0,
        support: 8.5
    },
    tradingConditions: {
        spreads: { eurusd: 1.3, gbpusd: 1.5, usdjpy: 1.4 },
        commission: '$3 per lot per side on ECN',
        swapFeeCategory: 'Medium',
        maxLeverage: '1:1000',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 1,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney', 'Bitcoin', 'Ethereum'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney', 'Bitcoin', 'Ethereum'],
        customerSupport: ['24/7 Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'WebTrader'],
        executionType: 'ECN',
        apiAccess: true,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'lifefinance',
    name: 'LifeFinance',
    logoUrl: '/broker-logos/lifefinance.png',
    websiteUrl: 'https://lifefinance.com/',
    score: 7.5,
    foundingYear: 2015,
    headquarters: 'Seychelles',
    description: 'LifeFinance is a Seychelles-based forex and CFD broker offering competitive trading conditions and modern trading platforms.',
    summary: 'LifeFinance provides traders with access to global markets through MT4 and MT5 platforms with competitive spreads and leverage. The broker focuses on providing straightforward trading conditions suitable for various trading strategies, with a strong emphasis on customer support and education.',
    pros: [
        'Competitive spreads',
        'High leverage options',
        'Multiple trading platforms',
        'Mobile trading available',
        'Customer support focus'
    ],
    cons: [
        'Seychelles regulation (less stringent)',
        'No guaranteed stop loss',
        'Limited educational resources',
        'No copy trading features'
    ],
    coreInfo: {
        brokerType: 'STP',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'Standard', minDeposit: 100, spreads: 'From 1.2 pips', commission: 'No commission', bestFor: 'All trader levels' }
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: 'From 1.2 pips' },
                { pair: 'GBP/USD', spread: 'From 1.4 pips' }
            ],
            commissionStructure: "No commission on standard accounts",
            overnightSwapFees: "Standard swap rates apply"
        },
        nonTrading: {
            inactivityFee: "May apply",
            withdrawalFee: "None",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { major: true, minor: true, exotic: true, count: 50 },
        commodities: { preciousMetals: true, energy: true, agricultural: true, count: 15 },
        indices: { major: true, minor: true, count: 20 },
        stocks: { us: true, european: true, asian: true, count: 50 },
        cryptocurrencies: { major: true, altcoins: true, count: 10 }
    },
    tradingConditionsExtended: {
        maxLeverage: '1:500',
        minLotSize: 0.01,
        marginCallLevel: '100%',
        stopOutLevel: '50%',
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true
    },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        depositFees: 'None',
        withdrawalFees: 'None',
        processingTime: {
            deposits: 'Instant for cards and e-wallets',
            withdrawals: '1-3 business days'
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English', 'Arabic', 'Chinese'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'FSA', licenseNumber: 'Pending' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: false, amount: 'N/A' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        executionSpeedMs: 120,
        slippage: 'Low',
        requotes: false,
        marketDepth: false,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        guaranteedStopLoss: {
            available: false,
            cost: 'N/A'
        }
    },
    platformFeatures: {
        charting: {
            indicators: 40,
            drawingTools: 25
        },
        automatedTrading: ['EAs'],
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
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2015,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['FSA']
    },
    ratings: {
        regulation: 6.0,
        costs: 7.5,
        platforms: 7.5,
        support: 8.0
    },
    tradingConditions: {
        spreads: { eurusd: 1.2, gbpusd: 1.4, usdjpy: 1.3 },
        commission: 'No commission',
        swapFeeCategory: 'Medium',
        maxLeverage: '1:500',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 100,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller'],
        customerSupport: ['24/5 Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'WebTrader'],
        executionType: 'STP',
        apiAccess: false,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'fxgt',
    name: 'FXGT',
    logoUrl: '/broker-logos/fxgt.png',
    websiteUrl: 'https://fxgt.com/',
    score: 7.7,
    foundingYear: 2019,
    headquarters: 'Seychelles',
    description: 'FXGT is a Seychelles-based forex and CFD broker offering competitive trading conditions and access to multiple markets.',
    summary: 'FXGT provides traders with access to forex, commodities, indices, stocks, and cryptocurrencies through MT4 and MT5 platforms. The broker offers competitive spreads, high leverage options, and a user-friendly trading environment suitable for traders of all experience levels.',
    pros: [
        'Competitive spreads',
        'High leverage options',
        'Multiple trading platforms',
        'Wide range of instruments',
        'Mobile trading available'
    ],
    cons: [
        'Seychelles regulation (less stringent)',
        'No guaranteed stop loss',
        'Limited educational resources',
        'No copy trading features'
    ],
    coreInfo: {
        brokerType: 'ECN',
        mobileTrading: true,
        demoAccount: true,
    },
    accountTypes: [
        { name: 'Standard Account', type: 'Standard', minDeposit: 50, spreads: 'From 1.2 pips', commission: 'No commission', bestFor: 'Beginners' },
        { name: 'ECN Account', type: 'ECN', minDeposit: 500, spreads: 'From 0.0 pips', commission: '$3 per lot', bestFor: 'Experienced traders' }
    ],
    fees: {
        trading: {
            spreadType: 'Variable',
            averageSpreads: [
                { pair: 'EUR/USD', spread: 'From 1.2 pips' },
                { pair: 'GBP/USD', spread: 'From 1.4 pips' }
            ],
            commissionStructure: "No commission on standard accounts, $3 per lot per side on ECN",
            overnightSwapFees: "Standard swap rates apply"
        },
        nonTrading: {
            inactivityFee: "May apply",
            withdrawalFee: "None",
            depositFee: "None"
        }
    },
    tradableInstruments: {
        forexPairs: { major: true, minor: true, exotic: true, count: 60 },
        commodities: { preciousMetals: true, energy: true, agricultural: true, count: 20 },
        indices: { major: true, minor: true, count: 25 },
        stocks: { us: true, european: true, asian: true, count: 100 },
        cryptocurrencies: { major: true, altcoins: true, count: 15 }
    },
    tradingConditionsExtended: {
        maxLeverage: '1:500',
        minLotSize: 0.01,
        marginCallLevel: '100%',
        stopOutLevel: '50%',
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: true
    },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        depositFees: 'None',
        withdrawalFees: 'None',
        processingTime: {
            deposits: 'Instant for cards and e-wallets',
            withdrawals: '1-3 business days'
        },
        minWithdrawal: 10
    },
    customerSupport: {
        languages: ['English', 'Arabic', 'Chinese'],
        channels: ['Live Chat', 'Phone', 'Email'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'FSA', licenseNumber: 'Pending' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: false, amount: 'N/A' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        executionSpeedMs: 100,
        slippage: 'Low',
        requotes: false,
        marketDepth: true,
        orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'],
        guaranteedStopLoss: {
            available: false,
            cost: 'N/A'
        }
    },
    platformFeatures: {
        charting: {
            indicators: 50,
            drawingTools: 30
        },
        automatedTrading: ['EAs'],
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
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2019,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['FSA']
    },
    ratings: {
        regulation: 6.0,
        costs: 8.0,
        platforms: 8.0,
        support: 7.5
    },
    tradingConditions: {
        spreads: { eurusd: 1.2, gbpusd: 1.4, usdjpy: 1.3 },
        commission: '$3 per lot per side on ECN',
        swapFeeCategory: 'Medium',
        maxLeverage: '1:500',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 50,
        depositMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        withdrawalMethods: ['Bank Transfer', 'Credit/Debit Card', 'Skrill', 'Neteller', 'WebMoney'],
        customerSupport: ['24/5 Live Chat', 'Phone', 'Email']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'WebTrader'],
        executionType: 'ECN',
        apiAccess: true,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'traderstrust',
    name: 'TradersTrust',
    logoUrl: '/broker-logos/traderstrust.png',
    websiteUrl: 'https://www.traderstrust.com/',
    score: 8.1,
    foundingYear: 2009,
    headquarters: 'Limassol, Cyprus',
    description: 'TradersTrust (TT) is a forex and CFD broker offering trading services through MetaTrader platforms with competitive trading conditions and regulatory oversight.',
    summary: 'TradersTrust provides access to multiple asset classes including forex, indices, commodities, and cryptocurrencies through MT4 and MT5 platforms. With CySEC regulation and negative balance protection, it offers a secure trading environment for global clients.',
    pros: [
        "CySEC regulation provides security",
        "MetaTrader 4 and 5 platforms",
        "Competitive spreads from 0.0 pips",
        "Negative balance protection",
        "Islamic accounts available",
        "Educational resources and webinars"
    ],
    cons: [
        "Limited social trading features",
        "No proprietary trading platform",
        "Weekend trading not available",
        "Higher minimum deposit for premium accounts"
    ],
    coreInfo: {
        brokerType: 'Market Maker',
        mobileTrading: true,
        demoAccount: true,
        minimumDeposit: 100,
        regulation: 'CySEC',
        jurisdictions: ['Cyprus', 'International'],
        tradingInstruments: ['Forex', 'Indices', 'Commodities', 'Cryptocurrencies', 'Stocks'],
        tradingPlatforms: ['MT4', 'MT5', 'WebTrader', 'Mobile App'],
        accountCurrencies: ['USD', 'EUR', 'GBP'],
        islamicAccount: true,
        scalpingAllowed: true,
        hedgingAllowed: true,
        minimumTradeSize: 0.01
    },
    accountTypes: [
        {
            name: 'Standard Account',
            minimumDeposit: 100,
            spreadRange: 'From 1.0 pips',
            commission: 'None',
            leverage: 'Up to 1:500',
            features: ['Instant execution', 'No commission', 'Educational access']
        },
        {
            name: 'ECN Account',
            minimumDeposit: 500,
            spreadRange: 'From 0.0 pips',
            commission: '$3 per lot per side',
            leverage: 'Up to 1:200',
            features: ['Raw spreads', 'Deep liquidity', 'VPS access', 'Priority support']
        }
    ],
    fees: {
        depositFees: 'None',
        withdrawalFees: 'None',
        inactivityFee: '$15 per month after 6 months',
        accountMaintenanceFee: 'None',
        tradingFees: 'Spreads + commission on ECN',
        hiddenFees: 'No hidden fees',
        feeStructure: 'Transparent pricing'
    },
    tradableInstruments: {
        forex: 50,
        commodities: 20,
        indices: 15,
        stocks: 150,
        cryptocurrencies: 10,
        totalInstruments: 245
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
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Crypto'],
        depositFees: "None",
        withdrawalFees: "None from TradersTrust's side for e-wallets",
        processingTime: {
            deposits: "Instant for cards and e-wallets",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 50
    },
    customerSupport: {
        languages: ['English', 'Spanish', 'Arabic', 'Chinese', 'Russian'],
        channels: ['Live Chat', 'Phone', 'Email', 'Ticket System'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'CySEC', licenseNumber: '107/09' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to €20,000' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        platforms: ['MT4', 'MT5', 'WebTrader', 'Mobile App'],
        minimumDeposit: 100,
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        leverage: 'Up to 1:500',
        education: ['Video tutorials', 'Webinars', 'E-books', 'Market analysis'],
        researchTools: ['Economic calendar', 'Market news', 'Trading signals', 'VPS hosting']
    },
    platformFeatures: {
        charting: 'Advanced charts with multiple timeframes',
        indicators: 'Built-in technical indicators',
        drawingTools: 'Chart drawing tools',
        automatedTrading: 'Expert Advisors supported',
        newsIntegration: true,
        socialTrading: false,
        apiTrading: false
    },
    accountManagement: {
        islamicAccount: {
            available: true,
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2009,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['CySEC'],
        jurisdictions: ['Cyprus', 'International'],
        regulatoryStatus: 'Fully Regulated'
    },
    ratings: {
        regulation: 7.0,
        costs: 7.5,
        platforms: 8.0,
        support: 7.5
    },
    tradingConditions: {
        spreads: { eurusd: 1.0, gbpusd: 1.2, usdjpy: 0.9 },
        commission: '$3 per lot per side on ECN',
        swapFeeCategory: 'Medium',
        maxLeverage: '1:500',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 100,
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Crypto'],
        customerSupport: ['24/5 Live Chat', 'Phone', 'Email', 'Ticket System']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'WebTrader', 'Mobile App'],
        executionType: 'Market Maker',
        apiAccess: false,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: true
  },
  {
    id: 'freshforex',
    name: 'FreshForex',
    logoUrl: '/broker-logos/freshforex.png',
    websiteUrl: 'https://www.freshforex.com/',
    score: 7.8,
    foundingYear: 2004,
    headquarters: 'Kingstown, St. Vincent and the Grenadines',
    description: 'FreshForex is an international forex and CFD broker offering a wide range of trading instruments, educational resources, and bonus programs for traders of all levels.',
    summary: 'FreshForex provides access to forex, commodities, indices, stocks, and cryptocurrencies through multiple trading platforms. With a focus on education and bonus programs, it caters to both beginner and experienced traders with various account types and trading conditions.',
    pros: [
        "Wide range of trading instruments",
        "Multiple trading platforms including MT4 and MT5",
        "Educational resources and bonus programs",
        "Islamic accounts available",
        "Low minimum deposit",
        "Cryptocurrency trading available"
    ],
    cons: [
        "Offshore regulation (FSA SVG)",
        "No negative balance protection",
        "Limited social trading features",
        "Higher spreads on some instruments"
    ],
    coreInfo: {
        brokerType: 'Market Maker',
        mobileTrading: true,
        demoAccount: true,
        minimumDeposit: 1,
        regulation: 'FSA SVG',
        jurisdictions: ['International'],
        tradingInstruments: ['Forex', 'Commodities', 'Indices', 'Stocks', 'Cryptocurrencies'],
        tradingPlatforms: ['MT4', 'MT5', 'WebTrader', 'Mobile App'],
        accountCurrencies: ['USD', 'EUR', 'GBP', 'BTC', 'ETH'],
        islamicAccount: true,
        scalpingAllowed: true,
        hedgingAllowed: true,
        minimumTradeSize: 0.01
    },
    accountTypes: [
        {
            name: 'Micro Account',
            minimumDeposit: 1,
            spreadRange: 'From 1.8 pips',
            commission: 'None',
            leverage: 'Up to 1:1000',
            features: ['Micro lots', 'No commission', 'Bonus programs', 'Educational access']
        },
        {
            name: 'Classic Account',
            minimumDeposit: 100,
            spreadRange: 'From 1.2 pips',
            commission: 'None',
            leverage: 'Up to 1:500',
            features: ['Standard lots', 'No commission', 'Bonus programs', 'VPS access']
        },
        {
            name: 'ECN Account',
            minimumDeposit: 500,
            spreadRange: 'From 0.2 pips',
            commission: '$3 per lot per side',
            leverage: 'Up to 1:200',
            features: ['Raw spreads', 'Deep liquidity', 'VPS access', 'Priority support']
        }
    ],
    fees: {
        depositFees: 'None',
        withdrawalFees: 'Depends on method',
        inactivityFee: '$5 per month after 6 months',
        accountMaintenanceFee: 'None',
        tradingFees: 'Spreads + commission on ECN',
        hiddenFees: 'No hidden fees',
        feeStructure: 'Transparent pricing'
    },
    tradableInstruments: {
        forex: 80,
        commodities: 25,
        indices: 20,
        stocks: 200,
        cryptocurrencies: 15,
        totalInstruments: 340
    },
    tradingConditionsExtended: {
        minTradeSize: 0.01,
        scalpingAllowed: true,
        hedgingAllowed: true,
        eaAllowed: true,
        negativeBalanceProtection: false,
        marginCallLevel: "100%",
        stopOutLevel: "20%"
    },
    depositWithdrawal: {
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Perfect Money', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Perfect Money', 'Crypto'],
        depositFees: "None",
        withdrawalFees: "Varies by method, many are free",
        processingTime: {
            deposits: "Instant for most methods",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 1
    },
    customerSupport: {
        languages: ['English', 'Russian', 'Chinese', 'Spanish', 'Arabic'],
        channels: ['Live Chat', 'Phone', 'Email', 'Ticket System'],
        hours: '24/7'
    },
    security: {
        regulatedBy: [
            { regulator: 'FSA SVG', licenseNumber: '22567 IBC 2015' }
        ],
        segregatedAccounts: false,
        investorCompensationScheme: { available: false, amount: 'N/A' },
        twoFactorAuth: false
    },
    tradingEnvironment: {
        platforms: ['MT4', 'MT5', 'WebTrader', 'Mobile App'],
        minimumDeposit: 1,
        baseCurrencies: ['USD', 'EUR', 'GBP', 'BTC', 'ETH'],
        leverage: 'Up to 1:1000',
        education: ['Video tutorials', 'Webinars', 'E-books', 'Market analysis', 'Trading courses'],
        researchTools: ['Economic calendar', 'Market news', 'Trading signals', 'VPS hosting']
    },
    platformFeatures: {
        charting: 'Advanced charts with multiple timeframes',
        indicators: 'Built-in technical indicators',
        drawingTools: 'Chart drawing tools',
        automatedTrading: 'Expert Advisors supported',
        newsIntegration: true,
        socialTrading: false,
        apiTrading: false
    },
    accountManagement: {
        islamicAccount: {
            available: true,
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP', 'BTC', 'ETH'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: false,
        yearsInBusiness: new Date().getFullYear() - 2004,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['FSA SVG'],
        jurisdictions: ['International'],
        regulatoryStatus: 'Offshore Regulated'
    },
    ratings: {
        regulation: 4.0,
        costs: 7.0,
        platforms: 8.0,
        support: 7.5
    },
    tradingConditions: {
        spreads: { eurusd: 1.2, gbpusd: 1.4, usdjpy: 1.1 },
        commission: '$3 per lot per side on ECN',
        swapFeeCategory: 'Medium',
        maxLeverage: '1:1000',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 1,
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Perfect Money', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney', 'Perfect Money', 'Crypto'],
        customerSupport: ['24/7 Live Chat', 'Phone', 'Email', 'Ticket System']
    },
    technology: {
        platforms: ['MT4', 'MT5', 'WebTrader', 'Mobile App'],
        executionType: 'Market Maker',
        apiAccess: false,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: true
  },
  {
    id: 'windsor-broker',
    name: 'Windsor Brokers',
    logoUrl: '/broker-logos/windsor-broker.png',
    websiteUrl: 'https://www.windsorbrokers.com/',
    score: 8.3,
    foundingYear: 1988,
    headquarters: 'Limassol, Cyprus',
    description: 'Windsor Brokers is a well-established forex and CFD broker with over 30 years of experience, offering trading services through multiple platforms with strong regulatory oversight.',
    summary: 'Windsor Brokers provides access to forex, indices, commodities, and shares through MetaTrader platforms and their proprietary Windsor Direct platform. With FCA, CySEC, and FSA regulation, it offers a secure trading environment with negative balance protection.',
    pros: [
        "Multiple strong regulatory licenses (FCA, CySEC, FSA)",
        "Over 30 years in business",
        "Negative balance protection",
        "MetaTrader 4 and Windsor Direct platforms",
        "Educational resources and market analysis",
        "Islamic accounts available"
    ],
    cons: [
        "Higher minimum deposit requirements",
        "Limited cryptocurrency selection",
        "No social or copy trading features",
        "Higher spreads on some instruments"
    ],
    coreInfo: {
        brokerType: 'Market Maker',
        mobileTrading: true,
        demoAccount: true,
        minimumDeposit: 100,
        regulation: 'FCA, CySEC, FSA',
        jurisdictions: ['UK', 'Cyprus', 'Bahrain', 'International'],
        tradingInstruments: ['Forex', 'Indices', 'Commodities', 'Shares', 'Bonds'],
        tradingPlatforms: ['MT4', 'Windsor Direct', 'Mobile App'],
        accountCurrencies: ['USD', 'EUR', 'GBP'],
        islamicAccount: true,
        scalpingAllowed: true,
        hedgingAllowed: true,
        minimumTradeSize: 0.01
    },
    accountTypes: [
        {
            name: 'Prime Account',
            minimumDeposit: 100,
            spreadRange: 'From 1.8 pips',
            commission: 'None',
            leverage: 'Up to 1:500',
            features: ['Instant execution', 'No commission', 'Educational access', 'Market analysis']
        },
        {
            name: 'Zero Account',
            minimumDeposit: 500,
            spreadRange: 'From 0.0 pips',
            commission: '$3 per lot per side',
            leverage: 'Up to 1:200',
            features: ['Raw spreads', 'Commission-based', 'VPS access', 'Priority support']
        }
    ],
    fees: {
        depositFees: 'None',
        withdrawalFees: 'None',
        inactivityFee: '$15 per month after 6 months',
        accountMaintenanceFee: 'None',
        tradingFees: 'Spreads + commission on Zero account',
        hiddenFees: 'No hidden fees',
        feeStructure: 'Transparent pricing'
    },
    tradableInstruments: {
        forex: 60,
        commodities: 15,
        indices: 12,
        stocks: 100,
        bonds: 10,
        totalInstruments: 197
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
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney'],
        depositFees: "None",
        withdrawalFees: "None from Windsor's side for e-wallets",
        processingTime: {
            deposits: "Instant for cards and e-wallets",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 50
    },
    customerSupport: {
        languages: ['English', 'Arabic', 'Chinese', 'Spanish', 'Russian'],
        channels: ['Live Chat', 'Phone', 'Email', 'Ticket System'],
        hours: '24/5'
    },
    security: {
        regulatedBy: [
            { regulator: 'FCA', licenseNumber: '531577' },
            { regulator: 'CySEC', licenseNumber: '030/046' },
            { regulator: 'FSA Bahrain', licenseNumber: 'ED000002' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to £85,000 (FCA)' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        platforms: ['MT4', 'Windsor Direct', 'Mobile App'],
        minimumDeposit: 100,
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        leverage: 'Up to 1:500',
        education: ['Video tutorials', 'Webinars', 'E-books', 'Market analysis', 'Trading courses'],
        researchTools: ['Economic calendar', 'Market news', 'Technical analysis', 'VPS hosting']
    },
    platformFeatures: {
        charting: 'Advanced charts with multiple timeframes',
        indicators: 'Built-in technical indicators',
        drawingTools: 'Chart drawing tools',
        automatedTrading: 'Expert Advisors supported',
        newsIntegration: true,
        socialTrading: false,
        apiTrading: false
    },
    accountManagement: {
        islamicAccount: {
            available: true,
            conditions: 'Swap-free trading available'
        },
        baseCurrencies: ['USD', 'EUR', 'GBP'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 1988,
        tradingVolumeDisclosed: false,
        clientBase: 'Global client base'
    },
    regulation: {
        regulators: ['FCA', 'CySEC', 'FSA Bahrain'],
        jurisdictions: ['UK', 'Cyprus', 'Bahrain', 'International'],
        regulatoryStatus: 'Fully Regulated'
    },
    ratings: {
        regulation: 9.0,
        costs: 7.0,
        platforms: 8.0,
        support: 8.0
    },
    tradingConditions: {
        spreads: { eurusd: 1.8, gbpusd: 2.0, usdjpy: 1.6 },
        commission: '$3 per lot per side on Zero account',
        swapFeeCategory: 'Standard',
        maxLeverage: '1:500',
        minLotSize: 0.01
    },
    accessibility: {
        minDeposit: 100,
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'WebMoney'],
        customerSupport: ['24/5 Live Chat', 'Phone', 'Email', 'Ticket System']
    },
    technology: {
        platforms: ['MT4', 'Windsor Direct', 'Mobile App'],
        executionType: 'Market Maker',
        apiAccess: false,
        eaSupport: true
    },
    reviews: [],
    isIslamic: true,
    copyTrading: false,
    providesSignals: true
  },
  {
    id: 'tastyfx',
    name: 'TastyFX',
    logoUrl: '/broker-logos/tastyfx.png',
    websiteUrl: 'https://www.tastyfx.com/',
    score: 8.9,
    foundingYear: 2021,
    headquarters: 'Chicago, Illinois, USA',
    description: 'TastyFX is a US-based forex and CFD broker that brings the tastytrade approach to trading with competitive pricing and a focus on options education.',
    summary: 'TastyFX offers spot forex trading through the tastytrade platform, combining the tasty brand\'s educational approach with forex trading. Regulated by the NFA and CFTC, it provides a secure trading environment with negative balance protection.',
    pros: [
        "Strong US regulation (NFA/CFTC)",
        "Competitive spreads and pricing",
        "Integration with tastytrade ecosystem",
        "Excellent educational resources",
        "Negative balance protection",
        "No hidden fees"
    ],
    cons: [
        "Limited to spot forex trading",
        "No MT4/MT5 platforms",
        "Higher leverage restrictions due to US regulation",
        "Limited cryptocurrency access"
    ],
    coreInfo: {
        brokerType: 'ECN',
        mobileTrading: true,
        demoAccount: true,
        minimumDeposit: 0,
        regulation: 'NFA/CFTC',
        jurisdictions: ['USA'],
        tradingInstruments: ['Forex'],
        tradingPlatforms: ['tastytrade platform', 'Desktop', 'Mobile App'],
        accountCurrencies: ['USD'],
        islamicAccount: false,
        scalpingAllowed: true,
        hedgingAllowed: false,
        minimumTradeSize: 1000
    },
    accountTypes: [
        {
            name: 'Standard Account',
            minimumDeposit: 0,
            spreadRange: 'From 0.7 pips',
            commission: '$0.04 per 1,000 traded per side',
            leverage: 'Up to 1:50',
            features: ['No hidden fees', 'Negative balance protection', 'Educational access', 'Market analysis']
        }
    ],
    fees: {
        depositFees: 'None',
        withdrawalFees: 'None',
        inactivityFee: 'None',
        accountMaintenanceFee: 'None',
        tradingFees: 'Commission-based pricing',
        hiddenFees: 'No hidden fees',
        feeStructure: 'Transparent pricing'
    },
    tradableInstruments: {
        forex: 50,
        commodities: 0,
        indices: 0,
        stocks: 0,
        cryptocurrencies: 0,
        totalInstruments: 50
    },
    tradingConditionsExtended: {
        minTradeSize: 1000,
        scalpingAllowed: true,
        hedgingAllowed: false,
        eaAllowed: false,
        negativeBalanceProtection: true,
        marginCallLevel: "50%",
        stopOutLevel: "30%"
    },
    depositWithdrawal: {
        depositMethods: ['Bank Transfer (ACH)', 'Wire Transfer'],
        withdrawalMethods: ['Bank Transfer (ACH)', 'Wire Transfer'],
        depositFees: "None",
        withdrawalFees: "None for ACH over $25, Wire $25 fee",
        processingTime: {
            deposits: "1-3 business days for ACH, Same day for wire",
            withdrawals: "1-3 business days"
        },
        minWithdrawal: 1
    },
    customerSupport: {
        languages: ['English'],
        channels: ['Live Chat', 'Phone', 'Email', 'Support Tickets'],
        hours: '24/5 market hours'
    },
    security: {
        regulatedBy: [
            { regulator: 'NFA', licenseNumber: '0533988' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: false, amount: 'N/A' },
        twoFactorAuth: true
    },
    tradingEnvironment: {
        platforms: ['tastytrade platform', 'Desktop', 'Mobile App'],
        minimumDeposit: 0,
        baseCurrencies: ['USD'],
        leverage: 'Up to 1:50',
        education: ['Video tutorials', 'Webinars', 'Educational articles', 'Market analysis', 'Options education'],
        researchTools: ['Economic calendar', 'Market news', 'Technical analysis', 'Trading signals']
    },
    platformFeatures: {
        charting: 'Advanced charting with multiple timeframes',
        indicators: 'Built-in technical indicators',
        drawingTools: 'Chart drawing tools',
        automatedTrading: 'Limited automation options',
        newsIntegration: true,
        socialTrading: false,
        apiTrading: false
    },
    accountManagement: {
        islamicAccount: {
            available: false,
            conditions: 'Not available due to US regulations'
        },
        baseCurrencies: ['USD'],
        mamPammSupport: false,
        corporateAccounts: true
    },
    transparency: {
        audited: true,
        yearsInBusiness: new Date().getFullYear() - 2021,
        tradingVolumeDisclosed: false,
        clientBase: 'US-focused client base'
    },
    regulation: {
        regulators: ['NFA'],
        jurisdictions: ['USA'],
        regulatoryStatus: 'Fully Regulated'
    },
    ratings: {
        regulation: 9.5,
        costs: 8.5,
        platforms: 8.0,
        support: 8.5
    },
    tradingConditions: {
        spreads: { eurusd: 0.7, gbpusd: 0.9, usdjpy: 0.8 },
        commission: '$0.04 per 1,000 traded per side',
        swapFeeCategory: 'Standard',
        maxLeverage: '1:50',
        minLotSize: 1000
    },
    accessibility: {
        minDeposit: 0,
        depositMethods: ['Bank Transfer (ACH)', 'Wire Transfer'],
        withdrawalMethods: ['Bank Transfer (ACH)', 'Wire Transfer'],
        customerSupport: ['24/5 Live Chat', 'Phone', 'Email', 'Support Tickets']
    },
    technology: {
        platforms: ['tastytrade platform', 'Desktop', 'Mobile App'],
        executionType: 'ECN',
        apiAccess: false,
        eaSupport: false
    },
    reviews: [],
    isIslamic: false,
    copyTrading: false,
    providesSignals: true
  }
];
