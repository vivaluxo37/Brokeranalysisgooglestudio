// Test script to verify broker filtering functionality
const { getBrokersForCategory, enhancedCategories } = require('./data/enhancedCategoryMappings');
const { brokers } = require('./data/brokers');

console.log('=== BROKER FILTERING TEST ===\n');

console.log(`Total brokers available: ${brokers.length}`);
console.log(`Total categories: ${enhancedCategories.length}\n`);

// Test a few popular categories
const testCategories = [
  'ecn-brokers',
  'mt4-brokers',
  'islamic-accounts-brokers',
  'scalping-brokers',
  'brokers-for-beginners'
];

testCategories.forEach(categoryId => {
  console.log(`\n=== Testing category: ${categoryId} ===`);

  try {
    const filteredBrokers = getBrokersForCategory(brokers, categoryId);
    console.log(`✓ Success: ${filteredBrokers.length} brokers found`);

    if (filteredBrokers.length > 0) {
      console.log('Top 3 brokers:');
      filteredBrokers.slice(0, 3).forEach((broker, index) => {
        console.log(`  ${index + 1}. ${broker.name} (score: ${broker.score})`);
      });
    }
  } catch (error) {
    console.error(`✗ Error: ${error.message}`);
  }
});

console.log('\n=== TEST COMPLETE ===');