const fs = require('fs');
const path = require('path');

// Read broker data
const brokersPath = path.join(__dirname, 'data', 'brokers.ts');
const brokersContent = fs.readFileSync(brokersPath, 'path.join(__dirname, 'lib', 'data', 'brokers.ts'), 'utf-8');

// Extract broker IDs (excluding review IDs)
const brokerIdMatches = brokersContent.match(/^\s{2,4}id:\s*'([^']+)'/gm);
const brokerIds = brokerIdMatches ? 
  brokerIdMatches.map(match => match.match(/id:\s*'([^']+)'/)[1])
    .filter(id => !id.startsWith('rev')) : [];

const categoriesPath = path.join(__dirname, 'pages', 'categoryPageData.ts');
const categoriesContent = fs.readFileSync(categoriesPath, 'utf-8');

// Parse category definitions
const categoryMatches = categoriesContent.match(/name:\s*'([^']+)'/g);
const categories = categoryMatches ? 
  categoryMatches.map(match => match.match(/name:\s*'([^']+)'/)[1]) : [];

console.log('🔍 FINAL IMPLEMENTATION VERIFICATION 🔍');
console.log(`✅ Total brokers in system: ${brokerIds.length}\n`);

// Test each category
categories.forEach(category => {
  console.log(`\n📊 ${category}`);
  
  // Find the filter function for this category
  const filterMatch = categoriesContent.match(new RegExp(`${category}.*filterFn:\s*\n([\\s\\s\\S]*{filterFn:.*?filterFn}.*?}\n([\\s\\s\\S]*{filterFn}.*?}\n([\\s\\s\\S]*filterFn.*?})`);
  
  let filterFnString = '';
  if (filterMatch && filterMatch[1]) {
    const codeMatch = filterMatch[1].match(/filterFn:\s*\n([\\s\\s\\S]*filterFn.*?}\n([\\s\\s\\S]*filterFn.*?})`));
    if (codeMatch && codeMatch[1]) {
      const fullMatch = codeMatch[1];
      filterFnString = fullMatch[1];
    }
  }
  
  console.log(`  Filter: ${filterFnString ? filterFnString.substring(0, 100) + '...' : 'No filter found'}`);
  
  // Apply filter to brokers and count results
  try {
    // Create a simple test function to filter brokers
    const testFilter = new Function(`return ${filterFnString}`);
    const filtered = brokerIds.filter(testFilter);
    const percentage = ((filtered.length / brokerIds.length) * 100).toFixed(1);
    
    console.log(`  Results: ${filtered.length} brokers (${percentage}%)`);
    
    if (filtered.length < 5) {
      console.log(`  ⚠️  WARNING: Less than 5 brokers for ${category}`);
    } else if (filtered.length === brokerIds.length) {
      console.log(`  ⚠️  STILL SHOWING ALL BROKERS for ${category}`);
    } else {
      console.log(`  ✅ Correctly filtered: ${filtered.length}/${brokerIds.length} brokers`);
      
      // Show some brokers in this category
      if (filtered.length > 0) {
        const firstBrokers = filtered.slice(0, 3);
        console.log(`  Sample brokers: ${firstBrokers.join(', ')}`);
      }
    }
  } catch (error) {
    console.log(`  ❌ Error testing ${category}:`, error.message);
  }
});

// Test country mappings
console.log('\n📍 COUNTRY MAPPINGS TEST');
const countryMappingsPath = path.join(__dirname, 'lib', 'data', 'countryBrokerMappingsFixed.ts');
const countryMappingsContent = fs.readFileSync(countryMappingsPath, 'utf-8');

const countryMatches = countryMappingsContent.match(/'([^']+)':\s*\[([^\]]+)\]/g);
const countries = countryMatches ? 
  countryMatches.map(match => ({
    country: match[1],
    brokers: match[2] ? match[2].split(',').map(b => b.trim().replace(/['"]$/, '')) : []
  })) : [];

console.log(`Countries with mappings: ${countries.length}`);
const totalMapped = countries.reduce((sum, { country, brokers }) => sum + brokers.length, 0);
console.log(`Total broker assignments: ${totalMapped}`);

// Check for invalid broker references
const allMappedBrokers = countries.flat();
const invalidBrokers = allMappedBrokers.filter(id => !brokerIds.includes(id));

if (invalidBrokers.length > 0) {
  console.log(`❌ Invalid broker references found: ${invalidBrokers.length}`);
  console.log('  Invalid IDs:', invalidBrokers.slice(0, 10));
}

// Sample some countries
console.log('\n📍 SAMPLE COUNTRIES:');
const sampleCountries = ['united-states', 'united-kingdom', 'australia', 'singapore', 'japan', 'south-africa', 'india', 'philippines'];
sampleCountries.forEach(country => {
  const brokers = countryMappings.find(c => c.country === country)?.brokers || [];
  console.log(`  ${country}: ${brokers.length} brokers`);
  if (brokers.length > 0) {
    const firstBrokers = brokers.slice(0, 3);
    console.log(`    First 3: ${firstBrokers.join(', ')}`);
  }
});

// Verify minimum broker requirement
const countriesWithFewBrokers = countries.filter(({ country, brokers }) => brokers.length < 10);
if (countriesWithFewBrokers.length > 0) {
  console.log(`\n⚠️ Countries with <10 brokers: ${countriesWithBrokers.map(c => `${c.country} (${c.brokers.length})`).join(', ')}`);
}

console.log('\n✅ VALIDATION RESULTS:');
console.log(`✅ Total Countries: ${countries.length}`);
console.log(`✅ Invalid References: ${invalidBrokers.length}`);  
if (invalidBrokers.length === 0) {
  console.log('✅ SUCCESS: All country mappings use only valid broker IDs!');
}

console.log('\n📋 EXPECTED OUTCOMES:');
console.log('- Categories show 5-25 highly relevant brokers, not all 78');
console.log('- Countries show only licensed brokers with proper regulation');
console.log('- Each category has 5+ minimum brokers (SEO requirement)');
console.log('- All routing works to correct broker detail pages');
