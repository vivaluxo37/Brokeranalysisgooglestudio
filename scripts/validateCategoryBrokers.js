// Validation script to ensure categories only show authorized brokers
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the authorized brokers list (using dynamic import for TypeScript)
const { AUTHORIZED_BROKER_IDS } = await import('../data/authorizedBrokers.ts');

console.log('=== VALIDATING CATEGORY BROKERS ===');
console.log(`Authorized broker count: ${AUTHORIZED_BROKER_IDS.length}`);
console.log('');

// Check the main brokers file
const brokersPath = path.join(__dirname, '../data/brokers.ts');
const brokersContent = fs.readFileSync(brokersPath, 'utf8');

// Extract broker IDs from the main file
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
console.log(`Total unique brokers in data file: ${uniqueBrokerIds.length}`);

// Check for unauthorized brokers
const unauthorizedBrokers = uniqueBrokerIds.filter(id => !AUTHORIZED_BROKER_IDS.includes(id));
const missingBrokers = AUTHORIZED_BROKER_IDS.filter(id => !uniqueBrokerIds.includes(id));

if (unauthorizedBrokers.length > 0) {
  console.log('');
  console.log('❌ UNAUTHORIZED BROKERS FOUND:');
  unauthorizedBrokers.forEach(broker => {
    console.log(`  - ${broker}`);
  });
}

if (missingBrokers.length > 0) {
  console.log('');
  console.log('⚠️  MISSING AUTHORIZED BROKERS:');
  missingBrokers.forEach(broker => {
    console.log(`  - ${broker}`);
  });
}

if (unauthorizedBrokers.length === 0 && missingBrokers.length === 0) {
  console.log('✅ All brokers are authorized');
}

console.log('');
console.log('=== TESTING CATEGORY FILTERING ===');

// Test the category filtering logic
try {
  const { filterBrokersByCategory } = await import('../lib/brokerCategoryFilter.ts');
  const { brokers: allBrokers } = await import('../data/brokers.ts');

  // Create a mock category to test filtering
  const mockCategory = {
    slug: 'test-category',
    name: 'Test Category',
    filterCriteria: { score: { min: 7.0 } }
  };

  const filteredBrokers = filterBrokersByCategory(allBrokers, mockCategory);
  const filteredIds = filteredBrokers.map(b => b.id);
  const unauthorizedInFiltered = filteredIds.filter(id => !AUTHORIZED_BROKER_IDS.includes(id));

  console.log(`Filtered brokers count: ${filteredBrokers.length}`);

  if (unauthorizedInFiltered.length > 0) {
    console.log('❌ UNAUTHORIZED BROKERS IN FILTERED RESULTS:');
    unauthorizedInFiltered.forEach(broker => {
      console.log(`  - ${broker}`);
    });
  } else {
    console.log('✅ No unauthorized brokers in filtered results');
  }

} catch (error) {
  console.log('❌ Error testing category filtering:', error.message);
}

console.log('');
console.log('=== VALIDATION COMPLETE ===');

// Save validation report
const report = {
  timestamp: new Date().toISOString(),
  authorizedBrokerCount: AUTHORIZED_BROKER_IDS.length,
  totalBrokersInFile: uniqueBrokerIds.length,
  unauthorizedBrokers: unauthorizedBrokers,
  missingBrokers: missingBrokers,
  validationPassed: unauthorizedBrokers.length === 0 && missingBrokers.length === 0
};

fs.writeFileSync(
  path.join(__dirname, 'validation-report.json'),
  JSON.stringify(report, null, 2)
);

console.log('Validation report saved to validation-report.json');