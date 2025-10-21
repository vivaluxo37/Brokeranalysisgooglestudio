const fs = require('fs');
const path = require('path');

// Read brokers data
const brokersPath = path.join(__dirname, 'data', 'brokers.ts');
const brokersContent = fs.readFileSync(brokersPath, 'utf-8');

// Extract broker IDs from the brokers.ts file (excluding review IDs)
const brokerIdMatches = brokersContent.match(/^\s{2,4}id:\s*'([^']+)'/gm);
const brokerIds = brokerIdMatches ? 
  brokerIdMatches.map(match => match.match(/id:\s*'([^']+)'/)[1])
    .filter(id => !id.startsWith('rev')) : [];

console.log('=== BROKER SYSTEM VERIFICATION ===\n');
console.log(`Total brokers in system: ${brokerIds.length}`);
console.log('Broker IDs:', brokerIds.join(', '));

// Check for broker logos
const logosDir = path.join(__dirname, 'public', 'broker-logos');
const logoFiles = fs.readdirSync(logosDir).filter(file => file.endsWith('.png') || file.endsWith('.webp') || file.endsWith('.svg'));

console.log('\n=== LOGO VERIFICATION ===');
const missingLogos = [];
const extraLogos = [];

// Check which brokers are missing logos
brokerIds.forEach(brokerId => {
  const possibleLogoFiles = [
    `${brokerId}.png`,
    `${brokerId}.webp`,
    `${brokerId}.svg`,
    `${brokerId.replace(/-/g, '_')}.png`,
    `${brokerId.replace(/-/g, '_')}.webp`,
    `${brokerId.replace(/-/g, '')}.png`,
  ];
  
  const hasLogo = possibleLogoFiles.some(filename => logoFiles.includes(filename));
  if (!hasLogo) {
    missingLogos.push(brokerId);
  }
});

// Check for logos that don't match any broker
logoFiles.forEach(logoFile => {
  const nameWithoutExt = logoFile.replace(/\.(png|webp|svg)$/, '');
  const matchesBroker = brokerIds.some(id => {
    const variations = [
      id,
      id.replace(/-/g, '_'),
      id.replace(/-/g, ''),
      id.replace(/_/g, '-')
    ];
    return variations.includes(nameWithoutExt) || nameWithoutExt === 'default-broker';
  });
  
  if (!matchesBroker && nameWithoutExt !== 'default-broker') {
    extraLogos.push(logoFile);
  }
});

console.log(`\nLogos found: ${logoFiles.length}`);
console.log(`Missing logos for brokers: ${missingLogos.length > 0 ? missingLogos.join(', ') : 'None'}`);
console.log(`Extra logos (no matching broker): ${extraLogos.length > 0 ? extraLogos.join(', ') : 'None'}`);

// Read and verify categories
const categoryPageDataPath = path.join(__dirname, 'pages', 'categoryPageData.ts');
const categoryContent = fs.readFileSync(categoryPageDataPath, 'utf-8');

// Extract category paths
const categoryPathMatches = categoryContent.match(/path:\s*'([^']+)'/g);
const categoryPaths = categoryPathMatches ? categoryPathMatches.map(match => match.match(/path:\s*'([^']+)'/)[1]) : [];

console.log('\n=== CATEGORY PAGES ===');
console.log(`Total categories: ${categoryPaths.length}`);
console.log('Categories:', categoryPaths.join(', '));

// Read and verify country broker mappings
const mappingsPath = path.join(__dirname, 'lib', 'data', 'countryBrokerMappings.ts');
const mappingsContent = fs.readFileSync(mappingsPath, 'utf-8');

// Extract country-broker mappings
const countryMatches = mappingsContent.match(/'([^']+)':\s*\[([^\]]+)\]/g);
const countryBrokerMap = {};
let invalidBrokerReferences = [];

if (countryMatches) {
  countryMatches.forEach(match => {
    const [, country, brokerList] = match.match(/'([^']+)':\s*\[([^\]]+)\]/);
    const brokers = brokerList.match(/'([^']+)'/g)?.map(b => b.replace(/'/g, '')) || [];
    countryBrokerMap[country] = brokers;
    
    // Check for invalid broker references
    brokers.forEach(brokerId => {
      if (!brokerIds.includes(brokerId)) {
        invalidBrokerReferences.push({country, brokerId});
      }
    });
  });
}

console.log('\n=== COUNTRY BROKER MAPPINGS ===');
console.log(`Total countries with mappings: ${Object.keys(countryBrokerMap).length}`);
console.log(`Invalid broker references: ${invalidBrokerReferences.length}`);

if (invalidBrokerReferences.length > 0) {
  console.log('\n⚠️ INVALID BROKER REFERENCES (not in system):');
  invalidBrokerReferences.forEach(({country, brokerId}) => {
    console.log(`  - ${country}: ${brokerId}`);
  });
}

// Check countries with too few brokers
const countriesWithFewBrokers = Object.entries(countryBrokerMap)
  .filter(([country, brokers]) => brokers.length < 10)
  .map(([country, brokers]) => `${country} (${brokers.length} brokers)`);

if (countriesWithFewBrokers.length > 0) {
  console.log(`\n⚠️ Countries with less than 10 brokers: ${countriesWithFewBrokers.join(', ')}`);
}

// Create logo mapping fix suggestions
console.log('\n=== SUGGESTED LOGO FIXES ===');
if (missingLogos.length > 0) {
  console.log('Missing logos - create or rename existing files:');
  missingLogos.forEach(brokerId => {
    // Find potential matches in extra logos
    const potentialMatch = extraLogos.find(logo => {
      const logoName = logo.replace(/\.(png|webp|svg)$/, '').toLowerCase();
      const brokerName = brokerId.replace(/-/g, '').toLowerCase();
      return logoName.includes(brokerName) || brokerName.includes(logoName);
    });
    
    if (potentialMatch) {
      console.log(`  - ${brokerId}: rename "${potentialMatch}" to "${brokerId}.png"`);
    } else {
      console.log(`  - ${brokerId}: needs new logo file`);
    }
  });
}

console.log('\n=== ROUTING VERIFICATION ===');
console.log('Broker detail routes should be: /broker/{id}');
console.log('Sample routes:');
brokerIds.slice(0, 5).forEach(id => {
  console.log(`  - /broker/${id}`);
});

console.log('\n=== SUMMARY ===');
console.log(`✅ Total brokers: ${brokerIds.length}`);
console.log(`${missingLogos.length === 0 ? '✅' : '⚠️'} Missing logos: ${missingLogos.length}`);
console.log(`${extraLogos.length === 0 ? '✅' : '⚠️'} Extra logos: ${extraLogos.length}`);
console.log(`${invalidBrokerReferences.length === 0 ? '✅' : '❌'} Invalid broker references: ${invalidBrokerReferences.length}`);
console.log(`${countriesWithFewBrokers.length === 0 ? '✅' : '⚠️'} Countries with <10 brokers: ${countriesWithFewBrokers.length}`);
