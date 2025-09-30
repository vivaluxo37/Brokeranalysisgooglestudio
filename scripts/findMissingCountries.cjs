const fs = require('fs');
const path = require('path');

// Read countries config file
const countriesFile = path.join(__dirname, '..', 'lib', 'constants', 'countries.ts');
const countriesContent = fs.readFileSync(countriesFile, 'utf8');

// Read mappings file
const mappingsFile = path.join(__dirname, '..', 'lib', 'data', 'countryBrokerMappings.ts');
const mappingsContent = fs.readFileSync(mappingsFile, 'utf8');

// Extract country slugs from countries.ts
const slugMatches = countriesContent.match(/slug:\s*'([^']+)'/g);
const configuredSlugs = slugMatches ? slugMatches.map(m => m.match(/'([^']+)'/)[1]) : [];

// Extract country slugs from mappings
const mappedSlugsMatches = mappingsContent.match(/'([\w-]+)':\s*\[/g);
const mappedSlugs = mappedSlugsMatches ? mappedSlugsMatches.map(m => m.match(/'([\w-]+)'/)[1]) : [];

console.log('=== Country Mapping Analysis ===\n');
console.log(`Countries configured: ${configuredSlugs.length}`);
console.log(`Countries mapped: ${mappedSlugs.length}`);

// Find missing
const missing = configuredSlugs.filter(slug => !mappedSlugs.includes(slug));

if (missing.length > 0) {
  console.log(`\n⚠️  Missing ${missing.length} countries in broker mappings:`);
  missing.forEach(slug => console.log(`  - ${slug}`));
} else {
  console.log('\n✅ All configured countries are mapped!');
}

// Find extra (not in config but in mappings)
const extra = mappedSlugs.filter(slug => !configuredSlugs.includes(slug));
if (extra.length > 0) {
  console.log(`\n⚠️  Extra ${extra.length} countries in mappings (not in config):`);
  extra.forEach(slug => console.log(`  - ${slug}`));
}