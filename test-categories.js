// Test script to verify category configurations
// Test by accessing the development server directly

const testUrls = [
  'http://localhost:3000/#/best-brokers/crypto-cfd-brokers',
  'http://localhost:3000/#/best-brokers/crypto-trading', 
  'http://localhost:3000/#/best-brokers/ecn-brokers',
  'http://localhost:3000/#/best-brokers/metatrader4-mt4',
  'http://localhost:3000/#/best-brokers/mt5',
  'http://localhost:3000/#/best-brokers/beginners',
  'http://localhost:3000/#/best-brokers/us-forex-brokers',
  'http://localhost:3000/#/best-brokers/uk-forex-brokers',
];

console.log('Testing category URLs:\n');
console.log('='.repeat(50));

console.log('Please manually test the following URLs in your browser:');
console.log('(The dev server should be running on port 3000)\n');

testUrls.forEach((url, index) => {
  console.log(`${index + 1}. ${url}`);
});

console.log('\n' + '='.repeat(50));
console.log('\nExpected result: All URLs should show broker category pages');
console.log('If a URL shows "Category Not Found", that category needs to be added to seoPageConfigs.ts');
