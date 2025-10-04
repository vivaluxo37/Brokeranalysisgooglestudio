// Simple validation script to check for unauthorized brokers
const fs = require('fs');
const path = require('path');

// Define the authorized broker IDs (copy from authorizedBrokers.ts)
const AUTHORIZED_BROKER_IDS = [
  'pepperstone', 'ic-markets', 'xtb', 'forex-com', 'ig', 'saxo-bank',
  'interactive-brokers', 'etoro', 'plus500', 'avatrade', 'oanda', 'fxpro',
  'axi', 'fp-markets', 'cmc-markets', 'admirals', 'tickmill', 'swissquote',
  'dukascopy', 'thinkmarkets', 'fxcm', 'xm', 'exness', 'hf-markets', 'fbs',
  'octafx', 'roboforex', 'hycm', 'city-index', 'activtrades', 'atfx', 'lcg',
  'markets-com', 'ironfx', 'gmo-click', 'gkfx', 'bitget', 'tradeview',
  'nordfx', 'fxopen', 'royal', 'captrader', 'mexem', 'trading212',
  'vt-markets', 'tmgm', 'trade-nation', 'fx-trading', 'multibank',
  'tradestation-global', 'spreadex', 'fusion-markets', 'eightcap',
  'hantec-markets', 'global-prime', 'go-markets', 'moneta-markets',
  'blackbull', 'startrader', 'libertex', 'capital-com', 'blackbull-markets',
  'ictrading', 'easymarkets', 'freedom24', 'fxoro', 'startrader-global',
  'puprime', 'gbe-brokers', 'thunder-markets', 'superforex', 'instaforex',
  'lifefinance', 'fxgt', 'traderstrust', 'freshforex', 'windsor-broker',
  'tastyfx'
];

console.log('=== VALIDATING AUTHORIZED BROKERS ===');
console.log(`Expected authorized brokers: ${AUTHORIZED_BROKER_IDS.length}`);
console.log('');

// Read the main brokers file
const brokersPath = path.join(__dirname, '../data/brokers.ts');
const brokersContent = fs.readFileSync(brokersPath, 'utf8');

// Extract broker IDs
const brokerIdRegex = /id:\s*'([^']+)'/g;
const allBrokerIds = [];
let match;

while ((match = brokerIdRegex.exec(brokersContent)) !== null) {
  const id = match[1];
  // Filter out review IDs and user IDs
  if (!id.startsWith('rev') && !id.startsWith('user')) {
    allBrokerIds.push(id);
  }
}

const uniqueBrokerIds = [...new Set(allBrokerIds)];
console.log(`Total unique brokers found: ${uniqueBrokerIds.length}`);

// Find unauthorized brokers
const unauthorizedBrokers = uniqueBrokerIds.filter(id => !AUTHORIZED_BROKER_IDS.includes(id));
const missingBrokers = AUTHORIZED_BROKER_IDS.filter(id => !uniqueBrokerIds.includes(id));

console.log('');
console.log('=== RESULTS ===');

if (unauthorizedBrokers.length > 0) {
  console.log('❌ UNAUTHORIZED BROKERS FOUND:');
  unauthorizedBrokers.forEach(broker => {
    console.log(`  - ${broker}`);
  });
  console.log(`\nTotal unauthorized: ${unauthorizedBrokers.length}`);
} else {
  console.log('✅ No unauthorized brokers found');
}

if (missingBrokers.length > 0) {
  console.log('\n⚠️  MISSING AUTHORIZED BROKERS:');
  missingBrokers.forEach(broker => {
    console.log(`  - ${broker}`);
  });
  console.log(`\nTotal missing: ${missingBrokers.length}`);
}

// Save validation report
const report = {
  timestamp: new Date().toISOString(),
  expectedCount: AUTHORIZED_BROKER_IDS.length,
  actualCount: uniqueBrokerIds.length,
  unauthorizedBrokers: unauthorizedBrokers,
  missingBrokers: missingBrokers,
  validationPassed: unauthorizedBrokers.length === 0
};

fs.writeFileSync(
  path.join(__dirname, 'broker-validation-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('\nValidation report saved to broker-validation-report.json');

if (report.validationPassed) {
  console.log('\n🎉 VALIDATION PASSED: All brokers are authorized!');
  process.exit(0);
} else {
  console.log('\n❌ VALIDATION FAILED: Unauthorized brokers detected!');
  process.exit(1);
}