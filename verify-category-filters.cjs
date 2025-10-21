const fs = require('fs');
const path = require('path');

// Read broker data file directly and parse it
const brokersFile = fs.readFileSync('./data/brokers.ts', 'utf8');
// Extract the brokers array from the TypeScript file
const brokersMatch = brokersFile.match(/export const brokers: Broker\[\] = (\[[\s\S]*\]);/);
let brokers = [];

if (brokersMatch) {
  try {
    // Convert TypeScript to JavaScript for eval
    const brokersJs = brokersMatch[1]
      .replace(/(\w+):/g, '"$1":') // Convert object keys to strings
      .replace(/(\w+):/g, '"$1":') // Double conversion to catch missed ones
      .replace(/true/g, 'true')
      .replace(/false/g, 'false')
      .replace(/Infinity/g, 'Infinity');

    brokers = eval('(' + brokersJs + ')');
  } catch (error) {
    console.error('Error parsing broker data:', error.message);
  }
} else {
  console.error('Could not find brokers array in file');
}

// Helper functions from categoryPageData.ts
const normalizeString = (value) => (value || '').toLowerCase();

const parseLeverage = (leverageStr) => {
  if (!leverageStr || typeof leverageStr !== 'string') return 0;
  const lower = leverageStr.toLowerCase();
  if (lower.includes('unlimited')) return Infinity;
  const parts = leverageStr.split(':');
  if (parts.length !== 2) return 0;
  const num = parseInt(parts[1], 10);
  return Number.isFinite(num) ? num : 0;
};

const getRegulators = (broker) => {
  const regulators = broker?.regulation?.regulators;
  if (Array.isArray(regulators)) {
    return regulators.filter((reg) => typeof reg === 'string' && reg.trim().length > 0);
  }
  return [];
};

const hasRegulator = (broker, regulators) => {
  if (!regulators.length) return false;
  const brokerRegs = getRegulators(broker).map(reg => reg.toUpperCase());
  return regulators.some(reg => brokerRegs.includes(reg.toUpperCase()));
};

const hasAnyExecutionType = (broker, keywords) => {
  const execution = normalizeString(broker?.technology?.executionType);
  return keywords.some(keyword => execution.includes(keyword.toLowerCase()));
};

const hasPlatform = (broker, platforms) => {
  const platformList = Array.isArray(broker?.technology?.platforms) ? broker.technology.platforms : [];
  const normalizedPlatformList = platformList.map(platform => normalizeString(platform));
  return platforms.some(platform => normalizedPlatformList.includes(platform.toLowerCase()));
};

const getSpread = (broker, pair = 'eurusd') => {
  const spreads = broker?.tradingConditions?.spreads || {};
  const rawSpread = spreads[pair];
  if (typeof rawSpread === 'number') return rawSpread;
  if (typeof rawSpread === 'string') {
    const match = rawSpread.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : 0;
  }
  return 0;
};

const getMinDeposit = (broker) => {
  const min = broker?.accessibility?.minDeposit;
  if (typeof min === 'number') return min;
  if (typeof min === 'string') {
    const match = min.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : Infinity;
  }
  return Infinity;
};

const getTradableInstrumentCount = (broker, asset) => {
  const section = broker?.tradableInstruments?.[asset];
  if (!section) return 0;
  if (typeof section === 'number') return section;
  if (typeof section?.total === 'number') return section.total;
  if (Array.isArray(section?.symbols)) return section.symbols.length;
  return 0;
};

const supportsCopyTrading = (broker) => {
  if (broker?.copyTrading === true) return true;
  const platformCopy = broker?.platformFeatures?.copyTrading;
  return Boolean(platformCopy && typeof platformCopy === 'object' && platformCopy.available);
};

const hasIslamicAccount = (broker) => {
  if (broker?.isIslamic === true) return true;
  const islamic = broker?.accountManagement?.islamicAccount;
  return Boolean(islamic && typeof islamic === 'object' && islamic.available);
};

const allowsScalping = (broker) => {
  return broker?.tradingConditionsExtended?.scalpingAllowed === true;
};

const hasMT4Platform = (broker) => {
  const platforms = Array.isArray(broker?.technology?.platforms) ? broker.technology.platforms : [];
  const platformStrings = platforms.map(p => String(p).toLowerCase());
  return platformStrings.some(p => p.includes('mt4') || p.includes('metatrader 4'));
};

const hasTrueECNAccount = (broker) => {
  return broker?.accountTypes?.some(acc => acc.type?.toLowerCase() === 'ecn');
};

const hasHighLeverage = (broker) => {
  const leverage = broker?.tradingConditions?.maxLeverage;
  if (!leverage) return false;

  const lowerLeverage = leverage.toLowerCase();
  if (lowerLeverage.includes('unlimited')) return true;

  const match = lowerLeverage.match(/:(\d+)/);
  if (!match) return false;

  const leverageValue = parseInt(match[1], 10);
  return Number.isFinite(leverageValue) && leverageValue >= 500;
};

// Category filter functions from categoryPageData.ts
const categoryFilters = [
  {
    name: 'Europe (FCA, CySEC)',
    path: '/brokers/region/europe',
    title: 'Best Forex Brokers in Europe',
    filterFn: (b) => hasRegulator(b, ['FCA', 'CySEC', 'BaFin', 'FINMA', 'KNF', 'FSA (Denmark)', 'Central Bank of Ireland', 'CSSF']),
  },
  {
    name: 'North America (NFA, CIRO)',
    path: '/brokers/region/north-america',
    title: 'Best Forex Brokers in North America',
    filterFn: (b) => hasRegulator(b, ['NFA', 'CFTC', 'CIRO']),
  },
  {
    name: 'Asia-Pacific (ASIC, MAS)',
    path: '/brokers/region/asia-pacific',
    title: 'Best Forex Brokers in Asia-Pacific',
    filterFn: (b) => hasRegulator(b, ['ASIC', 'MAS (Singapore)', 'FSA (Japan)']),
  },
  {
    name: 'Best for Beginners',
    path: '/brokers/type/beginners',
    title: 'Best Forex Brokers for Beginners',
    filterFn: (b) => {
      const minDeposit = getMinDeposit(b);
      const score = typeof b?.score === 'number' ? b.score : 0;
      const hasEducation = b?.platformFeatures?.newsIntegration === true;
      const hasDemoAccount = b?.coreInfo?.demoAccount === true;
      return minDeposit <= 100 && score >= 8.5 && (hasEducation || hasDemoAccount);
    },
  },
  {
    name: 'MT4 Brokers',
    path: '/brokers/platform/mt4',
    title: 'Best MT4 Forex Brokers',
    filterFn: (b) => hasMT4Platform(b),
  },
  {
    name: 'ECN Brokers',
    path: '/brokers/type/ecn',
    title: 'Best ECN Forex Brokers',
    filterFn: (b) => {
      const isECNType = hasAnyExecutionType(b, ['ecn']);
      const hasECNAccount = hasTrueECNAccount(b);
      return isECNType || hasECNAccount;
    },
  },
  {
    name: 'Scalping Brokers',
    path: '/brokers/type/scalping',
    title: 'Best Brokers for Scalping',
    filterFn: (b) => {
      if (!allowsScalping(b)) return false;
      const isECN = hasAnyExecutionType(b, ['ecn']) || hasTrueECNAccount(b);
      const spread = getSpread(b, 'eurusd');
      return isECN && spread < 1.0;
    },
  },
  {
    name: 'Copy Trading',
    path: '/brokers/type/copy-trading',
    title: 'Best Copy Trading Brokers',
    filterFn: (b) => supportsCopyTrading(b),
  },
  {
    name: 'Islamic Brokers',
    path: '/brokers/type/islamic',
    title: 'Best Islamic (Swap-Free) Forex Brokers',
    filterFn: (b) => hasIslamicAccount(b),
  },
  {
    name: 'High Leverage',
    path: '/brokers/type/high-leverage',
    title: 'High Leverage Forex Brokers',
    filterFn: (b) => hasHighLeverage(b),
  },
  {
    name: 'Stock Trading',
    path: '/brokers/type/stock-trading',
    title: 'Best Brokers for Stock Trading',
    filterFn: (b) => getTradableInstrumentCount(b, 'stocks') >= 100,
  },
  {
    name: 'Gold (XAU/USD) Trading',
    path: '/brokers/type/gold-trading',
    title: 'Best Brokers for Gold (XAU/USD) Trading',
    filterFn: (b) => getTradableInstrumentCount(b, 'commodities') > 0,
  },
];

console.log('='.repeat(80));
console.log('🔍 CATEGORY FILTER VERIFICATION REPORT');
console.log('='.repeat(80));

console.log(`\n📊 Found ${brokers.length} brokers in database`);

// Check each category
categoryFilters.forEach(category => {
  console.log(`\n📂 ${category.title}`);
  console.log('─'.repeat(60));

  const matchingBrokers = brokers.filter(category.filterFn);

  if (matchingBrokers.length === 0) {
    console.log('❌ NO BROKERS FOUND IN THIS CATEGORY');
  } else {
    console.log(`✅ Found ${matchingBrokers.length} broker(s):`);
    matchingBrokers.forEach(broker => {
      console.log(`   • ${broker.name} (Score: ${broker.score})`);

      // Show key features that qualify them
      if (category.name.includes('ECN')) {
        const executionType = broker?.technology?.executionType;
        const ecnAccount = broker?.accountTypes?.some(acc => acc.type?.toLowerCase() === 'ecn');
        console.log(`     Execution: ${executionType}, ECN Account: ${ecnAccount}`);
      }

      if (category.name.includes('Copy Trading')) {
        const copyTrading = broker?.platformFeatures?.copyTrading;
        const legacyCopy = broker?.copyTrading;
        console.log(`     Copy Trading: ${copyTrading?.available || legacyCopy}`);
      }

      if (category.name.includes('Islamic')) {
        const islamic = broker?.accountManagement?.islamicAccount;
        const legacyIslamic = broker?.isIslamic;
        console.log(`     Islamic Account: ${islamic?.available || legacyIslamic}`);
      }

      if (category.name.includes('Stock')) {
        const stockCount = getTradableInstrumentCount(broker, 'stocks');
        console.log(`     Stock CFDs: ${stockCount} instruments`);
      }

      if (category.name.includes('Scalping')) {
        const scalping = broker?.tradingConditionsExtended?.scalpingAllowed;
        const spread = getSpread(broker, 'eurusd');
        console.log(`     Scalping Allowed: ${scalping}, EUR/USD Spread: ${spread}`);
      }
    });
  }
});

console.log('\n' + '='.repeat(80));
console.log('🔍 DETAILED BROKER FEATURE ANALYSIS');
console.log('='.repeat(80));

// Detailed analysis of key brokers
const keyBrokers = ['pepperstone', 'ic-markets', 'xm', 'fxpro', 'admiral-markets'];

keyBrokers.forEach(brokerId => {
  const broker = brokers.find(b => b.id === brokerId);
  if (!broker) return;

  console.log(`\n🏢 ${broker.name}`);
  console.log('─'.repeat(40));

  // Check each important feature
  console.log(`   📊 Execution Type: ${broker?.technology?.executionType}`);
  console.log(`   💰 EUR/USD Spread: ${getSpread(broker, 'eurusd')}`);
  console.log(`   📈 Max Leverage: ${broker?.tradingConditions?.maxLeverage}`);
  console.log(`   📅 Min Deposit: $${getMinDeposit(broker)}`);
  console.log(`   ⚡ Scalping Allowed: ${allowsScalping(broker)}`);
  console.log(`   🤖 Copy Trading: ${supportsCopyTrading(broker)}`);
  console.log(`   ☪️ Islamic Account: ${hasIslamicAccount(broker)}`);
  console.log(`   📈 Stock CFDs: ${getTradableInstrumentCount(broker, 'stocks')} instruments`);
  console.log(`   💎 Commodities: ${getTradableInstrumentCount(broker, 'commodities')} instruments`);
  console.log(`   🌍 Regulators: ${getRegulators(broker).join(', ')}`);
  console.log(`   💻 Platforms: ${broker?.technology?.platforms?.join(', ')}`);

  // Account types
  const accountTypes = broker?.accountTypes || [];
  console.log(`   📋 Account Types: ${accountTypes.map(acc => `${acc.name} (${acc.type})`).join(', ')}`);
});

console.log('\n' + '='.repeat(80));
console.log('🔍 RECOMMENDATIONS FOR FIXES');
console.log('='.repeat(80));

// Find categories with no brokers
const emptyCategories = categoryFilters.filter(category => {
  const matchingBrokers = brokers.filter(category.filterFn);
  return matchingBrokers.length === 0;
});

if (emptyCategories.length > 0) {
  console.log('\n❌ CATEGORIES WITH NO BROKERS:');
  emptyCategories.forEach(category => {
    console.log(`   • ${category.title}`);
  });
} else {
  console.log('\n✅ All categories have at least one broker');
}

console.log('\n📝 RECOMMENDATIONS:');
console.log('1. Verify that broker data matches actual current offerings');
console.log('2. Update copy trading platforms to reflect new Pepperstone CopyTrading app');
console.log('3. Check if stock CFD counts are accurate for current offerings');
console.log('4. Verify Islamic account availability and conditions');
console.log('5. Ensure ECN account types are correctly identified');