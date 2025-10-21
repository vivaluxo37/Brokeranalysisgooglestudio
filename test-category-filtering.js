/**
 * Test script to verify category filtering logic
 * Checks if brokers appear in correct categories based on their features
 */

import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load broker data
const brokersData = JSON.parse(readFileSync(path.join(__dirname, 'data/brokers.ts'), 'utf8'));
const brokers = brokersData.brokers;

// Load SEO page configs
const seoConfigData = JSON.parse(readFileSync(path.join(__dirname, 'data/seoPageConfigs.ts'), 'utf8'));

// Helper functions from useCachedProgrammaticData.ts
const ensureArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const getBrokerRegulators = (broker) => {
  const fromSecurity = ensureArray(broker.security?.regulatedBy)
    .map(entry => entry?.regulator)
    .filter(Boolean);
  const fromLegacy = ensureArray(broker.regulation?.regulators).filter(Boolean);
  return Array.from(new Set([...fromSecurity, ...fromLegacy]));
};

const getBrokerPlatforms = (broker) => {
  return ensureArray(broker.technology?.platforms).filter(Boolean);
};

const getBrokerMinDeposit = (broker) => {
  const deposits = [];

  if (typeof broker.accessibility?.minDeposit !== 'undefined') {
    deposits.push(Number(broker.accessibility.minDeposit));
  }

  if (Array.isArray(broker.accountTypes)) {
    broker.accountTypes.forEach(account => {
      if (typeof account?.minDeposit !== 'undefined') {
        deposits.push(Number(account.minDeposit));
      }
    });
  }

  const numericDeposits = deposits.filter(value => Number.isFinite(value));
  return numericDeposits.length ? Math.min(...numericDeposits) : 0;
};

const getBrokerSpread = (broker) => {
  const spread = broker.tradingConditions?.spreads?.eurusd;
  return Number(spread) || 0;
};

const hasRequiredFeatures = (broker, features) => {
  return features.every((feature) => {
    switch (feature.toLowerCase()) {
      case 'copytrading':
        return Boolean(broker.copyTrading || broker.platformFeatures?.copyTrading?.available);
      case 'islamic':
        return Boolean(broker.isIslamic || broker.accountManagement?.islamicAccount?.available);
      case 'scalping': {
        const executionType = broker.technology?.executionType?.toLowerCase() || '';
        const spreads = getBrokerSpread(broker);
        return executionType.includes('ecn') || spreads < 1.0;
      }
      case 'offshore':
        return isOffshoreBroker(broker);
      default:
        return true;
    }
  });
};

const isOffshoreBroker = (broker) => {
  const regulators = getBrokerRegulators(broker).map(reg => reg.toLowerCase());
  const headquarters = (broker.headquarters || '').toLowerCase();

  const offshoreRegulatorKeywords = [
    'seychelles', 'belize', 'svg', 'st. vincent', 'saint vincent',
    'grenadines', 'vanuatu', 'vfsc', 'mauritius', 'labuan',
    'bahamas', 'bvi', 'british virgin', 'cayman', 'marshall islands',
    'dominica', 'curacao', 'panama'
  ];

  const offshoreHeadquartersKeywords = [
    'seychelles', 'belize', 'vanuatu', 'st. vincent', 'saint vincent',
    'grenadines', 'mauritius', 'bahamas', 'cayman', 'bvi'
  ];

  const hasOffshoreRegulator = regulators.some(reg =>
    offshoreRegulatorKeywords.some(keyword => reg.includes(keyword))
  );

  const hasOffshoreHeadquarters = offshoreHeadquartersKeywords.some(keyword =>
    headquarters.includes(keyword)
  );

  return hasOffshoreRegulator || hasOffshoreHeadquarters;
};

// Test category filtering
const testCategoryFiltering = () => {
  console.log('🔍 Testing Category Filtering Logic\n');

  // Test specific categories
  const testCategories = [
    { name: 'MT4 Brokers', platforms: ['MT4'] },
    { name: 'MT5 Brokers', platforms: ['MT5'] },
    { name: 'ECN Brokers', accountTypes: ['ECN'], features: ['scalping'] },
    { name: 'Copy Trading Brokers', features: ['copytrading'] },
    { name: 'Islamic Brokers', features: ['islamic'] },
    { name: 'Scalping Brokers', features: ['scalping'] },
    { name: 'No Minimum Deposit', maxDeposit: 0 },
    { name: 'Low Deposit ($1-50)', minDeposit: 1, maxDeposit: 50 },
  ];

  const results = {};

  testCategories.forEach(category => {
    console.log(`\n📋 Testing: ${category.name}`);

    const filteredBrokers = brokers.filter(broker => {
      // Platform filter
      if (category.platforms?.length > 0) {
        const brokerPlatforms = getBrokerPlatforms(broker).map(platform => platform.toLowerCase());
        const hasRequiredPlatform = category.platforms.some(platform =>
          brokerPlatforms.includes(platform.toLowerCase())
        );
        if (!hasRequiredPlatform) return false;
      }

      // Account type filter
      if (category.accountTypes?.length > 0) {
        const brokerAccountTypes = ensureArray(broker.accountTypes).map(at => at.type?.toLowerCase());
        const hasRequiredAccountType = category.accountTypes.some(type =>
          brokerAccountTypes.includes(type.toLowerCase())
        );
        if (!hasRequiredAccountType) return false;
      }

      // Deposit filters
      const brokerMinDeposit = getBrokerMinDeposit(broker);
      if (typeof category.minDeposit !== 'undefined' && brokerMinDeposit < category.minDeposit) {
        return false;
      }
      if (typeof category.maxDeposit !== 'undefined' && brokerMinDeposit > category.maxDeposit) {
        return false;
      }

      // Features filter
      if (category.features?.length > 0) {
        if (!hasRequiredFeatures(broker, category.features)) {
          return false;
        }
      }

      return true;
    });

    const brokerNames = filteredBrokers.map(b => b.name);
    console.log(`   Found ${filteredBrokers.length} brokers: ${brokerNames.join(', ')}`);

    results[category.name] = {
      count: filteredBrokers.length,
      brokers: brokerNames
    };
  });

  // Specifically check Pepperstone
  console.log('\n🎯 Pepperstone Category Analysis:');
  const pepperstone = brokers.find(b => b.id === 'pepperstone');
  if (pepperstone) {
    const pepperstoneFeatures = {
      platforms: getBrokerPlatforms(pepperstone),
      regulators: getBrokerRegulators(pepperstone),
      hasCopyTrading: Boolean(pepperstone.copyTrading || pepperstone.platformFeatures?.copyTrading?.available),
      hasIslamic: Boolean(pepperstone.isIslamic || pepperstone.accountManagement?.islamicAccount?.available),
      executionType: pepperstone.technology?.executionType,
      minDeposit: getBrokerMinDeposit(pepperstone),
      spread: getBrokerSpread(pepperstone),
      accountTypes: ensureArray(pepperstone.accountTypes).map(at => at.type)
    };

    console.log('   Features:', pepperstoneFeatures);

    // Check which categories Pepperstone should appear in
    console.log('\n   Should appear in these categories:');
    testCategories.forEach(category => {
      let shouldAppear = false;

      if (category.platforms?.some(p => pepperstoneFeatures.platforms.includes(p))) {
        shouldAppear = true;
      }
      if (category.features?.includes('copytrading') && pepperstoneFeatures.hasCopyTrading) {
        shouldAppear = true;
      }
      if (category.features?.includes('islamic') && pepperstoneFeatures.hasIslamic) {
        shouldAppear = true;
      }
      if (category.features?.includes('scalping') && (pepperstoneFeatures.executionType?.includes('ECN') || pepperstoneFeatures.spread < 1.0)) {
        shouldAppear = true;
      }
      if (category.accountTypes?.some(at => pepperstoneFeatures.accountTypes.includes(at))) {
        shouldAppear = true;
      }
      if (category.maxDeposit === 0 && pepperstoneFeatures.minDeposit === 0) {
        shouldAppear = true;
      }
      if (category.minDeposit <= pepperstoneFeatures.minDeposit && pepperstoneFeatures.minDeposit <= category.maxDeposit) {
        shouldAppear = true;
      }

      console.log(`   ${category.name}: ${shouldAppear ? '✅ YES' : '❌ NO'}`);

      if (results[category.name] && shouldAppear && !results[category.name].brokers.includes('Pepperstone')) {
        console.log(`     ⚠️  ERROR: Pepperstone should appear but is missing!`);
      }
      if (results[category.name] && !shouldAppear && results[category.name].brokers.includes('Pepperstone')) {
        console.log(`     ⚠️  ERROR: Pepperstone appears but shouldn't!`);
      }
    });
  }

  return results;
};

// Run the test
const results = testCategoryFiltering();

console.log('\n📊 Summary:');
console.log('================');
Object.entries(results).forEach(([category, data]) => {
  console.log(`${category}: ${data.count} brokers`);
});

console.log('\n✅ Category filtering test completed!');