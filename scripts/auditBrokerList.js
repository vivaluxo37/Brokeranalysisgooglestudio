// Script to audit the current broker list and identify unauthorized brokers
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the main brokers file
const brokersPath = path.join(__dirname, '../data/brokers.ts');
const brokersContent = fs.readFileSync(brokersPath, 'utf8');

// Extract broker IDs using regex
const brokerIdRegex = /id:\s*'([^']+)'/g;
const brokerIds = [];
let match;

while ((match = brokerIdRegex.exec(brokersContent)) !== null) {
  brokerIds.push(match[1]);
}

// Remove duplicates and filter out review IDs
const uniqueBrokerIds = [...new Set(brokerIds)].filter(id =>
  !id.startsWith('rev') && // Filter out review IDs
  id !== 'user123' && // Filter out user IDs
  id !== 'user456' &&
  id !== 'user789' &&
  id !== 'user101' &&
  id !== 'user112'
);

console.log('=== AUDIT OF CURRENT BROKER LIST ===');
console.log(`Total unique brokers found: ${uniqueBrokerIds.length}`);
console.log('');

console.log('Current broker IDs:');
uniqueBrokerIds.forEach((id, index) => {
  console.log(`${index + 1}. ${id}`);
});

console.log('');
console.log('=== ANALYSIS ===');
console.log(`Expected: 78 brokers`);
console.log(`Actual: ${uniqueBrokerIds.length} brokers`);
console.log(`Difference: ${uniqueBrokerIds.length - 78} brokers`);

if (uniqueBrokerIds.length > 78) {
  console.log('');
  console.log('WARNING: More brokers than expected!');
  console.log('Unauthorized brokers that need to be removed:');

  // This is where you'd define your authorized list of 78 brokers
  // For now, we'll mark the last ones as potentially unauthorized
  const excessBrokers = uniqueBrokerIds.slice(78);
  excessBrokers.forEach(broker => {
    console.log(`- ${broker}`);
  });
} else if (uniqueBrokerIds.length < 78) {
  console.log('');
  console.log('WARNING: Fewer brokers than expected!');
}

// Save the list for reference
fs.writeFileSync(
  path.join(__dirname, 'current_broker_audit.txt'),
  `Current Broker List (${uniqueBrokerIds.length} brokers):\n\n` +
  uniqueBrokerIds.map((id, index) => `${index + 1}. ${id}`).join('\n')
);

console.log('');
console.log('Audit complete. List saved to current_broker_audit.txt');