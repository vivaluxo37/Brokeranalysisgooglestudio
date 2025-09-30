const fs = require('fs');
const path = require('path');

// Read the TypeScript file content
const mappingsFile = path.join(__dirname, '..', 'lib', 'data', 'countryBrokerMappings.ts');
const content = fs.readFileSync(mappingsFile, 'utf8');

// Extract country counts
const countryMatches = content.match(/'[\w-]+': \[/g);
const countryCount = countryMatches ? countryMatches.length : 0;

console.log('=== Country-Broker Mapping Validation ===\n');
console.log(`Total countries mapped: ${countryCount}`);

// Extract and validate each country's broker list
const countryBlockRegex = /'([\w-]+)':\s*\[([\s\S]*?)\]/g;
let match;
const results = [];

while ((match = countryBlockRegex.exec(content)) !== null) {
  const countrySlug = match[1];
  const brokersString = match[2];
  const brokerMatches = brokersString.match(/'[\w-]+'/g);
  const brokerCount = brokerMatches ? brokerMatches.length : 0;
  
  results.push({
    country: countrySlug,
    count: brokerCount,
    valid: brokerCount >= 10
  });
}

console.log('\n=== Broker Count Per Country ===');
results.forEach(r => {
  const status = r.valid ? '✓' : '✗';
  console.log(`${status} ${r.country}: ${r.count} brokers`);
});

const invalid = results.filter(r => !r.valid);
if (invalid.length > 0) {
  console.log(`\n⚠️  ${invalid.length} countries with fewer than 10 brokers!`);
} else {
  console.log('\n✅ All countries have at least 10 brokers!');
}

console.log(`\n=== Summary ===`);
console.log(`Total countries: ${results.length}`);
console.log(`Valid (≥10 brokers): ${results.filter(r => r.valid).length}`);
console.log(`Invalid (<10 brokers): ${invalid.length}`);