const fs = require('fs');
const path = require('path');

const brokersFile = path.join(__dirname, '..', 'data', 'brokers.ts');
const content = fs.readFileSync(brokersFile, 'utf8');

// Extract all broker IDs
const regex = /^\s+id:\s*['"]([^'"]+)['"]/gm;
const matches = [];
let match;

while ((match = regex.exec(content)) !== null) {
  matches.push(match[1]);
}

// Remove duplicates
const uniqueBrokers = [...new Set(matches)];

console.log('Total brokers found:', uniqueBrokers.length);
console.log('\nBroker IDs:');
uniqueBrokers.forEach((id, index) => {
  console.log(`${index + 1}. ${id}`);
});
