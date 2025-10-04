// Comprehensive validation script for ongoing broker compliance
const fs = require('fs');
const path = require('path');

// Configuration
const EXPECTED_BROKER_COUNT = 78;
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

console.log('🔍 COMPREHENSIVE BROKER VALIDATION');
console.log('='.repeat(50));
console.log(`Expected authorized brokers: ${EXPECTED_BROKER_COUNT}`);
console.log(`Authorized list contains: ${AUTHORIZED_BROKER_IDS.length} brokers`);
console.log('');

// Validation results
const results = {
  timestamp: new Date().toISOString(),
  expectedCount: EXPECTED_BROKER_COUNT,
  authorizedCount: AUTHORIZED_BROKER_IDS.length,
  validations: {},
  summary: { passed: 0, failed: 0, warnings: 0 }
};

// Helper function to log results
function logValidation(name, passed, message, details = {}) {
  const status = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`${status} ${name}: ${message}`);

  if (passed) {
    results.summary.passed++;
  } else {
    results.summary.failed++;
  }

  results.validations[name] = {
    passed,
    message,
    details,
    timestamp: new Date().toISOString()
  };

  return passed;
}

// Validation 1: Check main brokers file
console.log('1. Validating main brokers data file...');
try {
  const brokersPath = path.join(__dirname, '../data/brokers.ts');
  const brokersContent = fs.readFileSync(brokersPath, 'utf8');

  // Extract broker IDs
  const brokerIdRegex = /id:\s*'([^']+)'/g;
  const allBrokerIds = [];
  let match;

  while ((match = brokerIdRegex.exec(brokersContent)) !== null) {
    const id = match[1];
    if (!id.startsWith('rev') && !id.startsWith('user')) {
      allBrokerIds.push(id);
    }
  }

  const uniqueBrokerIds = [...new Set(allBrokerIds)];
  const unauthorizedBrokers = uniqueBrokerIds.filter(id => !AUTHORIZED_BROKER_IDS.includes(id));
  const missingBrokers = AUTHORIZED_BROKER_IDS.filter(id => !uniqueBrokerIds.includes(id));

  const passed = unauthorizedBrokers.length === 0 && missingBrokers.length === 0;
  const message = `Found ${uniqueBrokerIds.length} brokers, ${unauthorizedBrokers.length} unauthorized, ${missingBrokers.length} missing`;

  logValidation('Main Brokers File', passed, message, {
    found: uniqueBrokerIds.length,
    unauthorized: unauthorizedBrokers,
    missing: missingBrokers
  });

} catch (error) {
  logValidation('Main Brokers File', false, `Error reading file: ${error.message}`);
}

// Validation 2: Check newBrokers file
console.log('\n2. Validating newBrokers data file...');
try {
  const newBrokersPath = path.join(__dirname, '../data/newBrokers.ts');

  if (fs.existsSync(newBrokersPath)) {
    const newBrokersContent = fs.readFileSync(newBrokersPath, 'utf8');

    // Extract broker IDs from newBrokers
    const brokerIdRegex = /id:\s*'([^']+)'/g;
    const newBrokerIds = [];
    let match;

    while ((match = brokerIdRegex.exec(newBrokersContent)) !== null) {
      newBrokerIds.push(match[1]);
    }

    const uniqueNewBrokerIds = [...new Set(newBrokerIds)];
    const unauthorizedNewBrokers = uniqueNewBrokerIds.filter(id => !AUTHORIZED_BROKER_IDS.includes(id));

    const passed = unauthorizedNewBrokers.length === 0;
    const message = `Found ${uniqueNewBrokerIds.length} new brokers, ${unauthorizedNewBrokers.length} unauthorized`;

    logValidation('New Brokers File', passed, message, {
      found: uniqueNewBrokerIds.length,
      unauthorized: unauthorizedNewBrokers
    });
  } else {
    logValidation('New Brokers File', true, 'File does not exist (no new brokers to validate)');
  }

} catch (error) {
  logValidation('New Brokers File', false, `Error reading file: ${error.message}`);
}

// Validation 3: Check sitemap generation script
console.log('\n3. Validating sitemap generation script...');
try {
  const sitemapPath = path.join(__dirname, '../scripts/generate-sitemap.js');
  const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');

  // Check if sitemap script has authorized broker list
  const hasAuthorizedList = sitemapContent.includes('AUTHORIZED_BROKER_IDS');
  const hasFiltering = sitemapContent.includes('AUTHORIZED_BROKER_IDS.includes(id)');

  const passed = hasAuthorizedList && hasFiltering;
  const message = passed ? 'Sitemap script includes authorized broker filtering' : 'Sitemap script missing authorized broker filtering';

  logValidation('Sitemap Generation', passed, message, {
    hasAuthorizedList,
    hasFiltering
  });

} catch (error) {
  logValidation('Sitemap Generation', false, `Error reading sitemap script: ${error.message}`);
}

// Validation 4: Check category filtering logic
console.log('\n4. Validating category filtering logic...');
try {
  const filterPath = path.join(__dirname, '../lib/brokerCategoryFilter.ts');
  const filterContent = fs.readFileSync(filterPath, 'utf8');

  // Check imports and filtering logic
  const hasAuthorizedImport = filterContent.includes("import { filterAuthorizedBrokers } from '../data/authorizedBrokers'");
  const hasAuthorizedFilter = filterContent.includes('filterAuthorizedBrokers(brokers)');

  const passed = hasAuthorizedImport && hasAuthorizedFilter;
  const message = passed ? 'Category filtering includes authorized broker check' : 'Category filtering missing authorized broker check';

  logValidation('Category Filtering', passed, message, {
    hasAuthorizedImport,
    hasAuthorizedFilter
  });

} catch (error) {
  logValidation('Category Filtering', false, `Error reading filter file: ${error.message}`);
}

// Validation 5: Check if generated sitemap exists and has correct count
console.log('\n5. Validating generated sitemap...');
try {
  const sitemapPath = path.join(__dirname, '../public/sitemap-brokers.xml');

  if (fs.existsSync(sitemapPath)) {
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
    const urlMatches = sitemapContent.match(/<loc>.*<\/loc>/g) || [];
    const brokerUrlCount = urlMatches.filter(url => url.includes('/broker/')).length;

    const passed = brokerUrlCount === AUTHORIZED_BROKER_IDS.length;
    const message = `Sitemap contains ${brokerUrlCount} broker URLs (expected ${AUTHORIZED_BROKER_IDS.length})`;

    logValidation('Generated Sitemap', passed, message, {
      brokerUrlCount,
      expectedCount: AUTHORIZED_BROKER_IDS.length
    });
  } else {
    logValidation('Generated Sitemap', false, 'Sitemap file does not exist');
  }

} catch (error) {
  logValidation('Generated Sitemap', false, `Error reading sitemap: ${error.message}`);
}

// Validation 6: Check for consistency across files
console.log('\n6. Validating cross-file consistency...');
try {
  const brokersContent = fs.readFileSync(path.join(__dirname, '../data/brokers.ts'), 'utf8');
  const authorizedContent = fs.readFileSync(path.join(__dirname, '../data/authorizedBrokers.ts'), 'utf8');

  // Extract counts from files
  const brokerIdRegex = /id:\s*'([^']+)'/g;
  const allBrokerIds = [];
  let match;

  while ((match = brokerIdRegex.exec(brokersContent)) !== null) {
    const id = match[1];
    if (!id.startsWith('rev') && !id.startsWith('user')) {
      allBrokerIds.push(id);
    }
  }

  const uniqueBrokerIds = [...new Set(allBrokerIds)];
  const countMatch = uniqueBrokerIds.length === AUTHORIZED_BROKER_IDS.length;

  const passed = countMatch;
  const message = countMatch ?
    `Broker count (${uniqueBrokerIds.length}) matches authorized list (${AUTHORIZED_BROKER_IDS.length})` :
    `Broker count mismatch: ${uniqueBrokerIds.length} vs ${AUTHORIZED_BROKER_IDS.length}`;

  logValidation('Cross-File Consistency', passed, message, {
    brokersFileCount: uniqueBrokerIds.length,
    authorizedListCount: AUTHORIZED_BROKER_IDS.length
  });

} catch (error) {
  logValidation('Cross-File Consistency', false, `Error checking consistency: ${error.message}`);
}

// Save comprehensive report
console.log('\n' + '='.repeat(50));
console.log('📊 VALIDATION SUMMARY');
console.log(`✅ Passed: ${results.summary.passed}`);
console.log(`❌ Failed: ${results.summary.failed}`);
console.log(`⚠️  Warnings: ${results.summary.warnings}`);

const overallSuccess = results.summary.failed === 0;
console.log(`\n🎯 Overall Result: ${overallSuccess ? '✅ SUCCESS' : '❌ FAILURE'}`);

// Save detailed report
const reportPath = path.join(__dirname, 'comprehensive-validation-report.json');
fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
console.log(`\n📄 Detailed report saved to: ${reportPath}`);

if (!overallSuccess) {
  console.log('\n⚠️  VALIDATION FAILED - Please review the issues above');
  process.exit(1);
} else {
  console.log('\n🎉 ALL VALIDATIONS PASSED - System is compliant!');
  process.exit(0);
}