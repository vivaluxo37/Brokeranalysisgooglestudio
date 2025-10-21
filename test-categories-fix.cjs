const fs = require('fs');
const path = require('path');

// Read brokers data
const brokersPath = path.join(__dirname, 'data', 'brokers.ts');
const brokersContent = fs.readFileSync(brokersPath, 'utf-8');

// Extract broker IDs (excluding review IDs)
const brokerIdMatches = brokersContent.match(/^\s{2,4}id:\s*'([^']+)'/gm);
const brokerIds = brokerIdMatches ? 
  brokerIdMatches.map(match => match.match(/id:\s*'([^']+)'/)[1])
    .filter(id => !id.startsWith('rev')) : [];

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

const parseCommission = (commissionStr) => {
  if (!commissionStr || typeof commissionStr !== 'string') return 0;
  const lower = commissionStr.toLowerCase();
  if (lower.includes('zero')) return 0;
  const match = commissionStr.match(/(\d+\.?\d*)/);
  if (!match) return 0;
  const value = parseFloat(match[1]);
  return Number.isFinite(value) ? value * 2 : 0;
};

const getRegulators = (broker) => {
  const regulators = broker?.security?.regulatedBy;
  if (Array.isArray(regulators)) {
    return regulators.map((reg) => reg.regulator).filter((reg) => typeof reg === 'string' && reg.trim().length > 0);
  }
  return [];
};

const hasRegulator = (broker, regulators) => {
  if (!regulators.length) return false;
  const brokerRegs = getRegulators(broker).map(reg => reg.toUpperCase());
  return regulators.some(reg => brokerRegs.includes(reg.toUpperCase()));
};

const hasAnyExecutionType = (broker, keywords) => {
  const execution = normalizeString(broker?.coreInfo?.brokerType || broker?.technology?.executionType);
  return keywords.some(keyword => execution.includes(keyword.toLowerCase()));
};

const hasPlatform = (broker, platforms) => {
  const platformList = Array.isArray(broker?.technology?.platforms) ? broker.technology.platforms : [];
  const normalizedPlatformList = platformList.map(platform => normalizeString(String(platform)));
  return platforms.some(platform => normalizedPlatformList.includes(platform.toLowerCase()));
};

const getSpread = (broker, pair = 'eurusd') => {
  const spreads = broker?.tradingConditions?.spreads;
  if (typeof spreads === 'number') return spreads;
  if (typeof spreads === 'string') {
    const match = spreads.match(/(\d+\.?\d*)/);
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
  if (typeof (section)?.total === 'number') return (section).total;
  if (Array.isArray((section)?.symbols)) return (section).symbols.length;
  return 0;
};

const supportsCopyTrading = (broker) => {
  if (broker?.copyTrading === true) return true;
  const platformCopy = broker?.platformFeatures?.copyTrading;
  return Boolean(platformCopy && typeof platformCopy === 'object' && platformCopy.available);
};

const hasIslamicAccount = (broker) => {
  if (broker?.isIslamic) return true;
  const islamic = broker?.accountManagement?.islamicAccount;
  return Boolean(islamic && typeof islamic === 'object' && islamic.available);
};

// Parse broker data
const parseBrokers = () => {
  const brokerDataStart = brokersContent.indexOf('export const brokers: Broker[] = [');
  const brokerDataEnd = brokersContent.lastIndexOf('];');
  
  if (brokerDataStart === -1 || brokerDataEnd === -1) return [];
  
  const brokersArray = brokersContent.substring(brokerDataStart + 30, brokerDataEnd);
  const brokerObjects = brokersArray.split('},\n  {\n').map(broker => {
    const brokerMatch = broker.match(/id:\s*'([^']+)'/);
    if (!brokerMatch) return null;
    
    // Extract basic properties we need for filtering
    const id = brokerMatch[1];
    const nameMatch = broker.match(/name:\s*'([^']+)'/);
    const scoreMatch = broker.match(/score:\s*([\d.]+)/);
    const minDepositMatch = broker.match(/minDeposit:\s*([\d]+)/);
    const executionMatch = broker.match(/brokerType:\s*'([^']+)'/);
    
    return {
      id,
      name: nameMatch ? nameMatch[1] : id,
      score: scoreMatch ? parseFloat(scoreMatch[1]) : 0,
      minDeposit: minDepositMatch ? parseInt(minDepositMatch[1]) : Infinity,
      brokerType: executionMatch ? executionMatch[1] : '',
      // Extract regulation info
      regulatedBy: [],
      // Extract platform info
      platforms: [],
      // Extract trading conditions
      tradingConditions: {},
      // Extract other properties
      copyTrading: broker.includes('copyTrading: true'),
      isIslamic: broker.includes('isIslamic') || broker.includes('isIslamic: true'),
      tradableInstruments: {},
      technology: {}
    };
  }).filter(Boolean);
  
  return brokerObjects;
};

const brokers = parseBrokers();

// Define category filters
const categories = [
  {
    name: 'ECN Brokers',
    filterFn: (b) => hasAnyExecutionType(b, ['ecn'])
  },
  {
    name: 'MT4 Brokers',
    filterFn: (b) => hasPlatform(b, ['mt4', 'meta trader 4', 'metatrader 4'])
  },
  {
    name: 'Beginners',
    filterFn: (b) => getMinDeposit(b) <= 100 && b.score > 8.0
  },
  {
    name: 'Scalping Brokers',
    filterFn: (b) => {
      const commissionCost = parseCommission(b.tradingConditions?.commission) / 10;
      const totalCost = getSpread(b) + commissionCost;
      return hasAnyExecutionType(b, ['ecn', 'stp']) && totalCost < 0.8;
    }
  },
  {
    name: 'Copy Trading',
    filterFn: (b) => supportsCopyTrading(b)
  },
  {
    name: 'Islamic Brokers',
    filterFn: (b) => hasIslamicAccount(b)
  },
  {
    name: 'High Leverage',
    filterFn: (b) => parseLeverage(b.tradingConditions?.maxLeverage) >= 500
  },
  {
    name: 'Stock Trading',
    filterFn: (b) => getTradableInstrumentCount(b, 'stocks') > 100
  }
];

console.log('=== CATEGORY FILTER ANALYSIS ===');
console.log(`Total brokers: ${brokerIds.length}`);
console.log(`Parsed brokers: ${brokers.length}\n`);

categories.forEach(category => {
  const filtered = brokers.filter(category.filterFn);
  const percentage = ((filtered.length / brokers.length) * 100).toFixed(1);
  console.log(`${category.name}: ${filtered.length} brokers (${percentage}%)`);
  
  if (filtered.length < 10) {
    console.log(`  ⚠️  WARNING: Less than 10 brokers for ${category.name}`);
  }
  
  // Show first 5 brokers for this category
  console.log(`  Top brokers: ${filtered.slice(0, 5).map(b => b.name).join(', ')}\n`);
});

// Check for platform and execution type data
console.log('=== BROKER DATA ISSUES ===');
const noExecutionType = brokers.filter(b => !b.brokerType);
const noPlatforms = brokers.filter(b => !b.platforms || b.platforms.length === 0);

if (noExecutionType.length > 0) {
  console.log(`Brokers without execution type: ${noExecutionType.length}`);
  noExecutionType.slice(0, 5).forEach(b => console.log(`  - ${b.name}`));
}

if (noPlatforms.length > 0) {
  console.log(`Brokers without platforms: ${noPlatforms.length}`);
  noPlatforms.slice(0, 5).forEach(b => console.log(`  - ${b.name}`));
}

console.log('\n=== RECOMMENDATIONS ===');
console.log('1. Need to extract more detailed broker data from brokers.ts');
console.log('2. Add missing execution types and platforms');
console.log('3. Fix category filters to be more specific');
console.log('4. Create country-specific mappings based on actual licensing');
