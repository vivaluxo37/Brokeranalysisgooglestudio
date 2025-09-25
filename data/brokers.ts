import { Broker } from '../types';

export const brokers: Broker[] = [
  {
    id: 'pepperstone',
    name: 'Pepperstone',
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233075/Broker_Logos/Pepperstone_logo_logotype_2022_bkgw0d.svg',
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
        { name: 'Razor Account', type: 'ECN', minDeposit: 0, spreads: 'From 0.0 pips', commission: '~$3.50 per lot per side', bestFor: 'Scalpers and algorithmic traders' },
    ],
    fees: {
        trading: {
            spreadType: 'Raw',
            averageSpreads: [
                { pair: 'EUR/USD', spread: '0.1 pips + commission' },
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
      spreads: { eurusd: 0.1, gbpusd: 0.4, usdjpy: 0.2 },
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233074/Broker_Logos/IC_Markets_logo_logotype_2022_h1csy2.svg',
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
        stocks: { total: 730, details: "ASX, NASDAQ, and NYSE stocks" },
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
            { regulator: 'FSA', licenseNumber: 'SD018' }
        ],
        segregatedAccounts: true,
        investorCompensationScheme: { available: true, amount: 'Up to €20,000 (CySEC)' },
        twoFactorAuth: true
    },
     tradingEnvironment: {
        executionSpeedMs: 40,
        slippage: "Very low due to deep liquidity",
        requotes: false,
        liquidityProviders: ['50+ different bank and dark pool liquidity sources'],
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233076/Broker_Logos/XTB_logo_logotype_2022_q4m2ac.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233074/Broker_Logos/Forex.com_logo_logotype_2022_m2fyia.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233074/Broker_Logos/IG_logo_logotype_2022_v4w8vx.svg',
    websiteUrl: 'https://www.ig.com/',
    score: 9.5,
    foundingYear: 1974,
    headquarters: 'London, UK',
    description: 'IG is a global leader in online trading, providing access to over 17,000 financial markets. It is heavily regulated and listed on the London Stock Exchange.',
    summary: "With an unparalleled range of tradable instruments and a history stretching back to 1974, IG is one of the most trusted and comprehensive brokers available. Its excellent platform and top-tier regulation make it a premium choice for traders who want access to everything.",
    pros: ["Publicly traded (LSE) and highly trusted", "Massive range of 17,000+ tradable markets", "Excellent proprietary trading platform with great tools", "Top-tier regulation from FCA, ASIC, NFA, and more", "Superb research and educational resources"],
    cons: ["High minimum deposit for some account types", "Can be complex for absolute beginners"],
    coreInfo: { brokerType: 'Market Maker', mobileTrading: true, demoAccount: true },
    fees: { trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '0.6 pips' }], commissionStructure: 'Spread-based for most assets, commission on shares', overnightSwapFees: 'Standard' }, nonTrading: { inactivityFee: '£12/month after 2 years of no activity', withdrawalFee: 'None', depositFee: 'None' } },
    tradableInstruments: { forexPairs: { total: 80, details: "Majors, Minors, Exotics" }, commodities: { total: 25, details: "Full range" }, indices: { total: 30, details: "Global indices" }, stocks: { total: 12000, details: "Global shares" }, cryptocurrencies: { total: 10, details: "Major cryptos" } },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "75%" },
    depositWithdrawal: { depositMethods: ['Credit Card', 'Bank Transfer', 'PayPal'], withdrawalMethods: ['Credit Card', 'Bank Transfer', 'PayPal'], depositFees: 'None', withdrawalFees: 'None', processingTime: { deposits: 'Instant', withdrawals: '1-3 days' }, minWithdrawal: 1 },
    customerSupport: { languages: ['English', 'German', 'French', 'Spanish', 'Italian'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: { regulatedBy: [{ regulator: 'FCA' }, { regulator: 'ASIC' }, { regulator: 'NFA' }, { regulator: 'FINMA' }], segregatedAccounts: true, investorCompensationScheme: { available: true, amount: '£85,000' }, twoFactorAuth: true },
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
    regulation: { regulators: ['FCA', 'ASIC', 'NFA', 'FINMA'] },
    ratings: { regulation: 9.9, costs: 8.2, platforms: 9.3, support: 9.0 },
    tradingConditions: { spreads: { eurusd: 0.6, gbpusd: 0.9, usdjpy: 0.7 }, commission: 'Included in spread', swapFeeCategory: 'Standard', maxLeverage: '1:200', minLotSize: 0.01 },
    accessibility: { minDeposit: 250, depositMethods: ['Credit Card', 'Bank Transfer', 'PayPal'], withdrawalMethods: ['Credit Card', 'Bank Transfer', 'PayPal'], customerSupport: ['24/5 Live Chat', 'Phone', 'Email'] },
    technology: { platforms: ['Web Platform', 'MT4', 'ProRealTime', 'L2 Dealer'], executionType: 'Market Maker', apiAccess: true, eaSupport: true },
    reviews: [],
    isIslamic: true,
    copyTrading: true,
    providesSignals: true
  },
   {
    id: 'saxo-bank',
    name: 'Saxo Bank',
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233076/Broker_Logos/Saxo_Bank_logo_logotype_2022_b3mluj.svg',
    websiteUrl: 'https://www.home.saxo/',
    score: 9.4,
    foundingYear: 1992,
    headquarters: 'Copenhagen, Denmark',
    description: 'A Danish investment bank, Saxo Bank offers a premium trading experience with its award-winning platform and vast range of tradable instruments.',
    summary: "Saxo Bank is a premium choice for serious investors, functioning as a fully licensed Danish bank. It offers an incredible range of over 40,000 instruments on its world-class SaxoTraderPRO platform, making it suitable for professionals who demand the best in technology and market access.",
    pros: ["Licensed as a bank, offering top-tier security", "Massive product range (40,000+ instruments)", "Award-winning SaxoTraderPRO platform", "Excellent research and analysis tools", "Competitive pricing for active traders"],
    cons: ["High minimum deposit ($2,000)", "High inactivity and custody fees", "Platform can be overwhelming for beginners"],
    coreInfo: { brokerType: 'Hybrid', mobileTrading: true, demoAccount: true },
    fees: { trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '0.7 pips' }], commissionStructure: 'Commission or spread based depending on account', overnightSwapFees: 'Standard' }, nonTrading: { inactivityFee: '$100 after 6 months of no activity', withdrawalFee: 'None', depositFee: 'None' } },
    tradableInstruments: { forexPairs: { total: 182, details: "Majors, Minors, Exotics" }, commodities: { total: 19, details: "Futures, Options, Spot" }, indices: { total: 29, details: "CFDs, Futures, Options" }, stocks: { total: 22000, details: "Global shares from 50+ exchanges" }, cryptocurrencies: { total: 9, details: "Crypto ETPs" } },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: false, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: { depositMethods: ['Bank Transfer', 'Credit Card'], withdrawalMethods: ['Bank Transfer'], depositFees: 'None', withdrawalFees: 'None', processingTime: { deposits: '1-2 days', withdrawals: '1-3 days' }, minWithdrawal: 1 },
    customerSupport: { languages: ['English', 'Danish', 'German', 'French', 'Italian'], channels: ['Phone', 'Email'], hours: '24/5' },
    security: { regulatedBy: [{ regulator: 'FSA (Denmark)' }, { regulator: 'FCA' }, { regulator: 'FINMA' }], segregatedAccounts: true, investorCompensationScheme: { available: true, amount: '€100,000' }, twoFactorAuth: true },
    tradingEnvironment: { executionSpeedMs: 90, slippage: 'Low', requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop', 'Trailing Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
        charting: { indicators: 50, drawingTools: 20 },
        automatedTrading: ['API'],
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
    regulation: { regulators: ['FSA (Denmark)', 'FCA', 'FINMA'] },
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233075/Broker_Logos/Interactive_Brokers_logo_logotype_2022_vjdlmw.svg',
    websiteUrl: 'https://www.interactivebrokers.com/',
    score: 9.3,
    foundingYear: 1978,
    headquarters: 'Greenwich, USA',
    description: 'A top choice for professional and institutional traders, offering unparalleled market access, low costs, and sophisticated trading tools.',
    summary: "Interactive Brokers is the undisputed leader for professional and institutional traders. With direct access to an incredible number of global markets, rock-bottom commissions, and the highly sophisticated Trader Workstation (TWS) platform, it's built for serious performance.",
    pros: ["Publicly listed (NASDAQ: IBKR) with a very strong balance sheet", "Unmatched access to global markets (stocks, options, futures, forex)", "Extremely low trading costs for active traders", "Powerful and sophisticated Trader Workstation (TWS) platform", "Excellent API for algorithmic trading"],
    cons: ["Trader Workstation platform has a steep learning curve", "Tiered pricing can be complex to understand", "Customer service can be hard to reach"],
    coreInfo: { brokerType: 'ECN', mobileTrading: true, demoAccount: true },
    fees: { trading: { spreadType: 'Raw', averageSpreads: [{ pair: 'EUR/USD', spread: '0.1 pips' }], commissionStructure: 'From $2.00 per lot, round turn', overnightSwapFees: 'Very Low, based on benchmark rates' }, nonTrading: { inactivityFee: 'None', withdrawalFee: 'One free withdrawal per month', depositFee: 'None' } },
    tradableInstruments: { forexPairs: { total: 100, details: "All major and minor pairs" }, commodities: { total: 10, details: "Futures and options" }, indices: { total: 13, details: "Global index futures and options" }, stocks: { total: 9000, details: "Access to 150+ global markets" }, cryptocurrencies: { total: 4, details: "BTC, ETH, LTC, BCH futures" } },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: { depositMethods: ['Bank Transfer', 'ACH'], withdrawalMethods: ['Bank Transfer', 'ACH'], depositFees: 'None', withdrawalFees: 'One free per month, then fees apply', processingTime: { deposits: '1-3 days', withdrawals: '1-3 days' }, minWithdrawal: 0 },
    customerSupport: { languages: ['English', 'Chinese', 'Spanish', 'French', 'German'], channels: ['Phone', 'Email', 'Chat'], hours: '24/5' },
    security: { regulatedBy: [{ regulator: 'SEC' }, { regulator: 'NYSE' }, { regulator: 'FCA' }, { regulator: 'ASIC' }], segregatedAccounts: true, investorCompensationScheme: { available: true, amount: '$500,000 (SIPC)' }, twoFactorAuth: true },
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
    regulation: { regulators: ['SEC', 'NYSE', 'FCA', 'ASIC'] },
    ratings: { regulation: 9.9, costs: 9.8, platforms: 9.0, support: 8.5 },
    tradingConditions: { spreads: { eurusd: 0.1, gbpusd: 0.3, usdjpy: 0.1 }, commission: '$2.00 per lot', swapFeeCategory: 'Low', maxLeverage: '1:50', minLotSize: 0.01 },
    accessibility: { minDeposit: 0, depositMethods: ['Bank Transfer'], withdrawalMethods: ['Bank Transfer'], customerSupport: ['Phone', 'Email', 'Chat'] },
    technology: { platforms: ['Trader Workstation (TWS)', 'IBKR Mobile'], executionType: 'ECN', apiAccess: true, eaSupport: true },
    reviews: [],
    isIslamic: false,
    copyTrading: false,
    providesSignals: false
  },
  {
    id: 'etoro',
    name: 'eToro',
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233074/Broker_Logos/eToro_logo_logotype_2022_z30x3d.svg',
    websiteUrl: 'https://www.etoro.com/',
    score: 8.9,
    foundingYear: 2007,
    headquarters: 'Tel Aviv, Israel',
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
    tradableInstruments: { forexPairs: { total: 49, details: "Majors, Minors" }, commodities: { total: 32, details: "Metals, Energies, Agriculture" }, indices: { total: 13, details: "Global indices" }, stocks: { total: 2700, details: "Real stocks and CFDs" }, cryptocurrencies: { total: 70, details: "Real crypto and CFDs" }, etfs: { total: 260, details: "Global ETFs" } },
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
    socialTrading: { popularityScore: 95, topTradersCount: 10000, platforms: ['CopyTrader'] }
  },
  {
    id: 'plus500',
    name: 'Plus500',
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233075/Broker_Logos/Plus500_logo_logotype_2022_y9xfrk.svg',
    websiteUrl: 'https://www.plus500.com/',
    score: 8.4,
    foundingYear: 2008,
    headquarters: 'Haifa, Israel',
    description: "Plus500 is a global CFD provider, listed on the London Stock Exchange. It offers a simple, user-friendly platform with a wide range of tradable instruments.",
    summary: "Plus500 provides a streamlined and easy-to-use trading platform focused exclusively on CFDs. It's a great option for traders who value simplicity and a massive range of markets, backed by the security of a publicly-traded company.",
    pros: ["Publicly-listed company (LSE)", "Regulated by FCA, ASIC, CySEC", "Intuitive and easy-to-use proprietary platform", "Guaranteed Stop-Loss Orders available", "Huge selection of CFD instruments"],
    cons: ["Only offers CFDs", "No MetaTrader platform support", "Limited research and educational tools", "Customer support lacks a phone option"],
    coreInfo: { brokerType: 'Market Maker', mobileTrading: true, demoAccount: true },
    accountTypes: [{ name: 'Standard', type: 'Standard', minDeposit: 100, spreads: 'From 0.8 pips', commission: 'Zero', bestFor: 'CFD Traders' }],
    fees: {
        trading: { spreadType: 'Variable', averageSpreads: [{ pair: 'EUR/USD', spread: '0.8 pips' }], commissionStructure: 'Spread-based', overnightSwapFees: 'Standard' },
        nonTrading: { inactivityFee: '$10/month after 3 months', withdrawalFee: 'None', depositFee: 'None' }
    },
    tradableInstruments: { forexPairs: { total: 70, details: "Full range" }, commodities: { total: 20, details: "Full range" }, indices: { total: 30, details: "Global indices" }, stocks: { total: 1500, details: "Global stock CFDs" }, cryptocurrencies: { total: 15, details: "Major cryptos" }, etfs: { total: 80, details: "Popular ETFs" } },
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
    tradingConditions: { spreads: { eurusd: 0.8, gbpusd: 1.2, usdjpy: 0.9 }, commission: 'Included in spread', swapFeeCategory: 'Standard', maxLeverage: '1:300', minLotSize: 0.01 },
    accessibility: { minDeposit: 100, depositMethods: ['Credit Card', 'PayPal', 'Skrill'], withdrawalMethods: ['Credit Card', 'PayPal'], customerSupport: ['24/7 Live Chat', 'Email'] },
    technology: { platforms: ['Plus500 Platform'], executionType: 'Market Maker', apiAccess: false, eaSupport: false },
    reviews: [], isIslamic: false, copyTrading: false, providesSignals: false
  },
  {
    id: 'avatrade',
    name: 'AvaTrade',
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233073/Broker_Logos/AvaTrade_logo_logotype_2022_o3mh1w.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233075/Broker_Logos/OANDA_logo_logotype_2022_u1qjny.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233074/Broker_Logos/FxPro_logo_logotype_2022_l9rbvq.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233073/Broker_Logos/Axi_logo_logotype_2022_h1luna.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233074/Broker_Logos/FP_Markets_logo_logotype_2022_bbt7yl.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233073/Broker_Logos/CMC_Markets_logo_logotype_2022_bhmhsn.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233073/Broker_Logos/Admirals_logo_logotype_2022_b0kfsx.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233076/Broker_Logos/Tickmill_logo_logotype_2022_yzr6k9.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233076/Broker_Logos/Swissquote_logo_logotype_2022_bbtlkh.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233074/Broker_Logos/Dukascopy_logo_logotype_2022_z2wvyz.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233076/Broker_Logos/ThinkMarkets_logo_logotype_2022_z2wvys.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233074/Broker_Logos/FXCM_logo_logotype_2022_b8x9zc.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233076/Broker_Logos/XM_logo_logotype_2022_b3mluj.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233074/Broker_Logos/Exness_logo_logotype_2022_z2wvyz.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233075/Broker_Logos/HFM_logo_logotype_2022_z2wvyz.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233074/Broker_Logos/FBS_logo_logotype_2022_bbt7yl.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233075/Broker_Logos/OctaFX_logo_logotype_2022_u1qjny.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233075/Broker_Logos/RoboForex_logo_logotype_2022_b3mluj.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233075/Broker_Logos/HYCM_logo_logotype_2022_z2wvyz.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233073/Broker_Logos/City_Index_logo_logotype_2022_bbt7yl.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233073/Broker_Logos/ActivTrades_logo_logotype_2022_z2wvyz.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233073/Broker_Logos/ATFX_logo_logotype_2022_u1qjny.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233075/Broker_Logos/LCG_logo_logotype_2022_z2wvyz.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233075/Broker_Logos/Markets.com_logo_logotype_2022_bbt7yl.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233075/Broker_Logos/IronFX_logo_logotype_2022_b3mluj.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233074/Broker_Logos/GMO_Click_logo_logotype_2022_bbt7yl.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233074/Broker_Logos/GKFX_logo_logotype_2022_z2wvyz.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233073/Broker_Logos/Bitget_logo_logotype_2022_bbt7yl.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233076/Broker_Logos/Tradeview_logo_logotype_2022_bbt7yl.svg',
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
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233075/Broker_Logos/NordFX_logo_logotype_2022_yzr6k9.svg',
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
        { name: 'Fix', type: 'Standard', minDeposit: 10, spreads: 'Fixed from 2.0 pips', commission: 'Zero', bestFor: 'Beginners' },
        { name: 'Pro', type: 'STP', minDeposit: 250, spreads: 'From 0.9 pips', commission: 'Zero', bestFor: 'Standard traders' },
        { name: 'Zero', type: 'ECN', minDeposit: 500, spreads: 'From 0.0 pips', commission: '$3.50 per lot side', bestFor: 'Active traders' },
    ],
    fees: {
        trading: { spreadType: 'Raw', averageSpreads: [{ pair: 'EUR/USD', spread: '0.0 pips + commission' }], commissionStructure: '$3.50 per lot side on Zero account', overnightSwapFees: 'Standard' },
        nonTrading: { inactivityFee: 'None', withdrawalFee: 'Varies by method', depositFee: 'None' }
    },
    tradableInstruments: {
        forexPairs: { total: 33, details: "Majors, Minors" },
        commodities: { total: 4, details: "Metals, Oil" },
        indices: { total: 11, details: "Global indices" },
        stocks: { total: 68, details: "US stock CFDs" },
        cryptocurrencies: { total: 11, details: "Major crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "50%", stopOutLevel: "20%" },
    depositWithdrawal: {
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Crypto'],
        depositFees: 'None', withdrawalFees: 'Varies', processingTime: { deposits: 'Instant', withdrawals: '1-3 days' }, minWithdrawal: 10
    },
    customerSupport: { languages: ['English', 'Russian', 'Chinese', 'Hindi'], channels: ['Live Chat', 'Phone', 'Email'], hours: '24/5' },
    security: { regulatedBy: [{ regulator: 'VFSC' }], segregatedAccounts: true, investorCompensationScheme: { available: false }, twoFactorAuth: true },
    tradingEnvironment: { executionSpeedMs: 120, slippage: 'Standard', requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
        charting: { indicators: 50, drawingTools: 30 },
        automatedTrading: ['EAs (MT4)'],
        copyTrading: { available: true, platforms: ['PAMM', 'Copy Trading'] },
        backtesting: true,
        newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: true }, baseCurrencies: ['USD', 'EUR'], mamPammSupport: true, corporateAccounts: true },
    transparency: { audited: false, yearsInBusiness: new Date().getFullYear() - 2008, tradingVolumeDisclosed: false },
    regulation: { regulators: ['VFSC'] },
    ratings: { regulation: 6.0, costs: 8.5, platforms: 8.0, support: 8.2 },
    tradingConditions: { spreads: { eurusd: 0.0, gbpusd: 0.3, usdjpy: 0.2 }, commission: '$3.50 per side', swapFeeCategory: 'Standard', maxLeverage: '1:1000', minLotSize: 0.01 },
    accessibility: { minDeposit: 10, depositMethods: ['Credit Card', 'Bank Transfer', 'Crypto'], withdrawalMethods: ['Credit Card', 'Bank Transfer', 'Crypto'], customerSupport: ['24/5 Live Chat', 'Phone'] },
    technology: { platforms: ['MT4'], executionType: 'Hybrid', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: true, providesSignals: true
  },
  {
    id: 'fxopen',
    name: 'FXOpen',
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233074/Broker_Logos/FXOpen_logo_logotype_2022_l9rbvq.svg',
    websiteUrl: 'https://www.fxopen.com/',
    score: 8.4,
    foundingYear: 2005,
    headquarters: 'London, UK',
    description: 'A pioneer in ECN trading for retail clients, FXOpen offers true ECN liquidity, crypto trading, and PAMM services.',
    summary: 'FXOpen is a veteran in the ECN space, providing a transparent trading environment with competitive costs. It is particularly strong for crypto CFD traders and those looking for PAMM investment options.',
    pros: ["One of the first retail ECN brokers", "Regulated by the FCA", "Extensive cryptocurrency CFD offering", "PAMM accounts for investors"],
    cons: ["Spreads can be wider on the STP account", "Website can be complex to navigate"],
    coreInfo: { brokerType: 'ECN', mobileTrading: true, demoAccount: true },
    accountTypes: [
        { name: 'STP', type: 'STP', minDeposit: 10, spreads: 'From 1.2 pips', commission: 'Zero', bestFor: 'Beginners' },
        { name: 'ECN', type: 'ECN', minDeposit: 100, spreads: 'From 0.0 pips', commission: '$1.50 per lot side', bestFor: 'Active traders' }
    ],
    fees: {
        trading: { spreadType: 'Raw', averageSpreads: [{ pair: 'EUR/USD', spread: '0.0 pips + commission' }], commissionStructure: '$1.50 per lot side on ECN accounts', overnightSwapFees: 'Standard' },
        nonTrading: { inactivityFee: '$10 after 90 days', withdrawalFee: 'Varies', depositFee: 'Varies' }
    },
    tradableInstruments: {
        forexPairs: { total: 50, details: "Majors, Minors" },
        commodities: { total: 8, details: "Metals, Energies" },
        indices: { total: 10, details: "Global indices" },
        stocks: { total: 600, details: "US stock CFDs" },
        cryptocurrencies: { total: 43, details: "Wide range of crypto pairs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: true, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "100%", stopOutLevel: "50%" },
    depositWithdrawal: {
        depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Crypto'],
        withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller', 'Crypto'],
        depositFees: 'Varies', withdrawalFees: 'Varies', processingTime: { deposits: 'Instant', withdrawals: '1 day' }, minWithdrawal: 10
    },
    customerSupport: { languages: ['English', 'Russian', 'Spanish', 'Chinese'], channels: ['Live Chat', 'Email', 'Tickets'], hours: '24/5' },
    security: { regulatedBy: [{ regulator: 'FCA', licenseNumber: '579202' }, { regulator: 'ASIC' }], segregatedAccounts: true, investorCompensationScheme: { available: true, amount: '£85,000 (FCA)' }, twoFactorAuth: true },
    tradingEnvironment: { executionSpeedMs: 70, slippage: 'Low', requotes: false, marketDepth: true, orderTypes: ['Market', 'Limit', 'Stop'], guaranteedStopLoss: { available: false } },
    platformFeatures: {
        charting: { indicators: 50, drawingTools: 30 },
        automatedTrading: ['EAs (MT4/5)'],
        copyTrading: { available: true, platforms: ['PAMM', 'ZuluTrade', 'Myfxbook'] },
        backtesting: true,
        newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: true }, baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD'], mamPammSupport: true, corporateAccounts: true },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2005, tradingVolumeDisclosed: false },
    regulation: { regulators: ['FCA', 'ASIC'] },
    ratings: { regulation: 9.0, costs: 8.6, platforms: 8.2, support: 8.3 },
    tradingConditions: { spreads: { eurusd: 0.0, gbpusd: 0.2, usdjpy: 0.1 }, commission: '$1.50 per side', swapFeeCategory: 'Standard', maxLeverage: '1:500', minLotSize: 0.01 },
    accessibility: { minDeposit: 10, depositMethods: ['Credit Card', 'Skrill', 'Crypto'], withdrawalMethods: ['Credit Card', 'Skrill', 'Crypto'], customerSupport: ['24/5 Live Chat'] },
    technology: { platforms: ['MT4', 'MT5', 'TickTrader'], executionType: 'ECN', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: true, providesSignals: true
  },
  {
    id: 'easymarkets',
    name: 'EasyMarkets',
    logoUrl: 'https://res.cloudinary.com/tradiiing/image/upload/v1689233073/Broker_Logos/easyMarkets_logo_logotype_2022_b0kfsx.svg',
    websiteUrl: 'https://www.easymarkets.com/',
    score: 8.3,
    foundingYear: 2001,
    headquarters: 'Limassol, Cyprus',
    description: 'EasyMarkets is a well-regulated market maker known for its unique risk management tools like dealCancellation and Freeze Rate, and its commitment to fixed spreads.',
    summary: 'EasyMarkets carves a niche with its innovative risk management tools and guaranteed fixed spreads, making it an excellent choice for beginners who want predictable costs and the ability to undo losing trades.',
    pros: ["Regulated by ASIC and CySEC", "Guaranteed fixed spreads", "Unique risk tools: dealCancellation & Freeze Rate", "Guaranteed stop loss on all platforms"],
    cons: ["Fixed spreads are wider than variable ECN spreads", "Limited number of instruments", "Not ideal for scalpers"],
    coreInfo: { brokerType: 'Market Maker', mobileTrading: true, demoAccount: true },
    accountTypes: [
      { name: 'Standard', type: 'Standard', minDeposit: 25, spreads: 'Fixed from 0.8 pips', commission: 'Zero', bestFor: 'Beginners' },
      { name: 'Premium', type: 'Standard', minDeposit: 2000, spreads: 'Fixed from 0.8 pips', commission: 'Zero', bestFor: 'Standard traders' },
      { name: 'VIP', type: 'Standard', minDeposit: 10000, spreads: 'Fixed from 0.8 pips', commission: 'Zero', bestFor: 'High volume traders' },
    ],
    fees: {
      trading: { spreadType: 'Fixed', averageSpreads: [{ pair: 'EUR/USD', spread: '0.8 pips' }], commissionStructure: 'Zero commission', overnightSwapFees: 'Standard' },
      nonTrading: { inactivityFee: 'None', withdrawalFee: 'None', depositFee: 'None' }
    },
    tradableInstruments: {
      forexPairs: { total: 103, details: "Majors, Minors, Exotics" },
      commodities: { total: 15, details: "Metals, Energies, Softs" },
      indices: { total: 23, details: "Global indices" },
      stocks: { total: 50, details: "US stock CFDs" },
      cryptocurrencies: { total: 11, details: "Major crypto CFDs" }
    },
    tradingConditionsExtended: { minTradeSize: 0.01, scalpingAllowed: false, hedgingAllowed: true, eaAllowed: true, negativeBalanceProtection: true, marginCallLevel: "50%", stopOutLevel: "30%" },
    depositWithdrawal: {
      depositMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller'],
      withdrawalMethods: ['Credit/Debit Card', 'Bank Transfer', 'Skrill', 'Neteller'],
      depositFees: 'None', withdrawalFees: 'None', processingTime: { deposits: 'Instant', withdrawals: '1-2 days' }, minWithdrawal: 50
    },
    customerSupport: { languages: ['English', 'Arabic', 'Chinese', 'Spanish'], channels: ['Live Chat', 'Phone', 'Email', 'WhatsApp'], hours: '24/5' },
    security: { regulatedBy: [{ regulator: 'ASIC' }, { regulator: 'CySEC' }], segregatedAccounts: true, investorCompensationScheme: { available: true, amount: '€20,000 (ICF)' }, twoFactorAuth: false },
    tradingEnvironment: { executionSpeedMs: 130, slippage: 'None (due to fixed spreads)', requotes: false, marketDepth: false, orderTypes: ['Market', 'Limit', 'Stop'], guaranteedStopLoss: { available: true } },
    platformFeatures: {
      charting: { indicators: 80, drawingTools: 50 },
      automatedTrading: ['EAs (MT4)'],
      copyTrading: { available: false, platforms: [] },
      backtesting: true,
      newsIntegration: true
    },
    accountManagement: { islamicAccount: { available: true }, baseCurrencies: ['USD', 'EUR', 'GBP', 'AUD'], mamPammSupport: false, corporateAccounts: true },
    transparency: { audited: true, yearsInBusiness: new Date().getFullYear() - 2001, tradingVolumeDisclosed: false },
    regulation: { regulators: ['ASIC', 'CySEC'] },
    ratings: { regulation: 9.0, costs: 7.8, platforms: 8.5, support: 8.8 },
    tradingConditions: { spreads: { eurusd: 0.8, gbpusd: 1.2, usdjpy: 1.0 }, commission: 'Zero', swapFeeCategory: 'Standard', maxLeverage: '1:400', minLotSize: 0.01 },
    accessibility: { minDeposit: 25, depositMethods: ['Credit Card', 'Skrill', 'Neteller'], withdrawalMethods: ['Credit Card', 'Skrill', 'Neteller'], customerSupport: ['24/5 Live Chat', 'WhatsApp'] },
    technology: { platforms: ['easyMarkets Platform', 'MT4'], executionType: 'Market Maker', apiAccess: false, eaSupport: true },
    reviews: [], isIslamic: true, copyTrading: false, providesSignals: true
  }
];