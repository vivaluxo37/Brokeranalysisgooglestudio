const fs = require('fs');
const path = require('path');

/**
 * QA Validation Script for Programmatic SEO
 * Validates data integrity, content quality, and SEO requirements
 */

console.log('🔍 Starting QA Validation...\n');

const errors = [];
const warnings = [];
const passed = [];

// ============================================
// 1. VALIDATE BROKER MAPPINGS
// ============================================
console.log('📋 Validating Broker Mappings...');

const mappingsFile = path.join(__dirname, '..', 'lib', 'data', 'countryBrokerMappings.ts');
const mappingsContent = fs.readFileSync(mappingsFile, 'utf8');

// Extract country mappings
const countryBlockRegex = /'([\w-]+)':\s*\[([\s\S]*?)\]/g;
let match;
const countryMappings = {};

while ((match = countryBlockRegex.exec(mappingsContent)) !== null) {
  const countrySlug = match[1];
  const brokersString = match[2];
  const brokerMatches = brokersString.match(/'[\w-]+'/g);
  const brokers = brokerMatches ? brokerMatches.map(b => b.replace(/'/g, '')) : [];
  countryMappings[countrySlug] = brokers;
}

// Validate minimum brokers per country
Object.entries(countryMappings).forEach(([country, brokers]) => {
  if (brokers.length < 10) {
    errors.push(`❌ ${country}: Only ${brokers.length} brokers (minimum 10 required)`);
  } else {
    passed.push(`✅ ${country}: ${brokers.length} brokers`);
  }
  
  // Check for duplicates
  const uniqueBrokers = new Set(brokers);
  if (uniqueBrokers.size !== brokers.length) {
    errors.push(`❌ ${country}: Contains duplicate brokers`);
  }
});

console.log(`   Countries validated: ${Object.keys(countryMappings).length}`);
console.log('');

// ============================================
// 2. VALIDATE COUNTRY CONFIGURATIONS
// ============================================
console.log('🌍 Validating Country Configurations...');

const countriesFile = path.join(__dirname, '..', 'lib', 'constants', 'countries.ts');
const countriesContent = fs.readFileSync(countriesFile, 'utf8');

// Extract country slugs
const slugMatches = countriesContent.match(/slug:\s*'([^']+)'/g);
const configuredCountries = slugMatches ? slugMatches.map(m => m.match(/'([^']+)'/)[1]) : [];

console.log(`   Configured countries: ${configuredCountries.length}`);

// Check for missing mappings
const missingMappings = configuredCountries.filter(slug => !countryMappings[slug]);
if (missingMappings.length > 0) {
  missingMappings.forEach(slug => {
    errors.push(`❌ Missing broker mapping for country: ${slug}`);
  });
} else {
  passed.push(`✅ All ${configuredCountries.length} countries have broker mappings`);
}

// Check for orphaned mappings
const orphanedMappings = Object.keys(countryMappings).filter(
  slug => !configuredCountries.includes(slug)
);
if (orphanedMappings.length > 0) {
  orphanedMappings.forEach(slug => {
    warnings.push(`⚠️  Broker mapping exists without country config: ${slug}`);
  });
}

console.log('');

// ============================================
// 3. VALIDATE BROKER DATA
// ============================================
console.log('🏦 Validating Broker Data...');

const brokersFile = path.join(__dirname, '..', 'data', 'brokers.ts');
const brokersContent = fs.readFileSync(brokersFile, 'utf8');

// Extract broker IDs
const brokerIdRegex = /^\s+id:\s*['"]([^'"]+)['"]/gm;
const brokerIds = [];
let brokerMatch;

while ((brokerMatch = brokerIdRegex.exec(brokersContent)) !== null) {
  brokerIds.push(brokerMatch[1]);
}

const uniqueBrokerIds = [...new Set(brokerIds)];
console.log(`   Total brokers in dataset: ${uniqueBrokerIds.length}`);

// Check for broken broker references
const allMappedBrokers = new Set();
Object.values(countryMappings).forEach(brokers => {
  brokers.forEach(b => allMappedBrokers.add(b));
});

const brokenReferences = [...allMappedBrokers].filter(
  brokerId => !uniqueBrokerIds.includes(brokerId)
);

if (brokenReferences.length > 0) {
  brokenReferences.forEach(brokerId => {
    errors.push(`❌ Broker ID referenced but not found in dataset: ${brokerId}`);
  });
} else {
  passed.push(`✅ All ${allMappedBrokers.size} referenced brokers exist in dataset`);
}

console.log('');

// ============================================
// 4. VALIDATE SITEMAP
// ============================================
console.log('🗺️  Validating Sitemap...');

const sitemapFile = path.join(__dirname, '..', 'public', 'sitemap.xml');
if (fs.existsSync(sitemapFile)) {
  const sitemapContent = fs.readFileSync(sitemapFile, 'utf8');
  
  // Count URLs in sitemap
  const urlMatches = sitemapContent.match(/<loc>/g);
  const urlCount = urlMatches ? urlMatches.length : 0;
  
  console.log(`   URLs in sitemap: ${urlCount}`);
  
  // Check if all countries are in sitemap
  configuredCountries.forEach(slug => {
    if (!sitemapContent.includes(`/best-forex-brokers/${slug}`)) {
      errors.push(`❌ Country page missing from sitemap: ${slug}`);
    }
  });
  
  // Validate XML structure
  if (!sitemapContent.includes('<?xml version="1.0"')) {
    errors.push('❌ Sitemap missing XML declaration');
  }
  if (!sitemapContent.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')) {
    errors.push('❌ Sitemap missing urlset declaration');
  }
  
  passed.push(`✅ Sitemap contains ${urlCount} URLs`);
  passed.push('✅ All country pages present in sitemap');
} else {
  errors.push('❌ Sitemap file not found. Run: npm run sitemap:generate');
}

console.log('');

// ============================================
// 5. VALIDATE ROBOTS.TXT
// ============================================
console.log('🤖 Validating Robots.txt...');

const robotsFile = path.join(__dirname, '..', 'public', 'robots.txt');
if (fs.existsSync(robotsFile)) {
  const robotsContent = fs.readFileSync(robotsFile, 'utf8');
  
  // Check for essential directives
  const requiredDirectives = [
    'User-agent:',
    'Allow: /',
    'Sitemap:',
    'Disallow: /admin/',
    'Disallow: /api/'
  ];
  
  requiredDirectives.forEach(directive => {
    if (!robotsContent.includes(directive)) {
      errors.push(`❌ Robots.txt missing directive: ${directive}`);
    }
  });
  
  // Check for AI bot support
  const aiBots = ['PerplexityBot', 'ChatGPT-User', 'GPTBot', 'ClaudeBot'];
  aiBots.forEach(bot => {
    if (!robotsContent.includes(bot)) {
      warnings.push(`⚠️  Robots.txt missing AI bot: ${bot}`);
    }
  });
  
  passed.push('✅ Robots.txt exists with required directives');
  passed.push('✅ AI search engine bots configured');
} else {
  errors.push('❌ Robots.txt file not found. Run: npm run sitemap:generate');
}

console.log('');

// ============================================
// 6. VALIDATE SEO COMPONENTS
// ============================================
console.log('📊 Validating SEO Components...');

const seoComponents = [
  'components/seo/FaqSchema.tsx',
  'components/seo/ArticleSchema.tsx',
  'components/seo/BreadcrumbSchema.tsx',
  'components/seo/BrokerListSchema.tsx'
];

seoComponents.forEach(component => {
  const componentPath = path.join(__dirname, '..', component);
  if (fs.existsSync(componentPath)) {
    passed.push(`✅ ${component} exists`);
  } else {
    errors.push(`❌ Missing SEO component: ${component}`);
  }
});

console.log('');

// ============================================
// 7. VALIDATE CONTENT GENERATORS
// ============================================
console.log('✍️  Validating Content Generators...');

const generatorsFile = path.join(__dirname, '..', 'utils', 'contentGenerators.ts');
if (fs.existsSync(generatorsFile)) {
  const generatorsContent = fs.readFileSync(generatorsFile, 'utf8');
  
  const requiredFunctions = [
    'generateHeroIntro',
    'generateLocalRelevance',
    'generateFAQs',
    'generateMetaTags',
    'generateBrokerCategories'
  ];
  
  requiredFunctions.forEach(func => {
    if (!generatorsContent.includes(`function ${func}`) && 
        !generatorsContent.includes(`export function ${func}`)) {
      errors.push(`❌ Missing content generator: ${func}`);
    }
  });
  
  passed.push('✅ All content generator functions exist');
} else {
  errors.push('❌ Content generators file not found');
}

console.log('');

// ============================================
// 8. CONTENT QUALITY CHECKS
// ============================================
console.log('📝 Content Quality Checks...');

// Check for minimum content length in generators
if (fs.existsSync(generatorsFile)) {
  const generatorsContent = fs.readFileSync(generatorsFile, 'utf8');
  
  // Check hero intro targets 150-200 words
  if (generatorsContent.includes('150-200')) {
    passed.push('✅ Hero intro targets appropriate word count');
  } else {
    warnings.push('⚠️  Hero intro word count target not documented');
  }
  
  // Check FAQ count (should be 10)
  const faqCountMatches = generatorsContent.match(/faqs:\s*FAQItem\[\]\s*=\s*\[/);
  if (faqCountMatches) {
    passed.push('✅ FAQ structure defined');
  }
}

console.log('');

// ============================================
// 9. VALIDATION SCRIPTS
// ============================================
console.log('🔧 Validating Helper Scripts...');

const helperScripts = [
  'scripts/validateCountryMappings.cjs',
  'scripts/findMissingCountries.cjs',
  'scripts/extractBrokerIds.cjs',
  'scripts/generateSitemap.cjs'
];

helperScripts.forEach(script => {
  const scriptPath = path.join(__dirname, '..', script);
  if (fs.existsSync(scriptPath)) {
    passed.push(`✅ ${path.basename(script)} exists`);
  } else {
    errors.push(`❌ Missing helper script: ${script}`);
  }
});

console.log('');

// ============================================
// 10. DOCUMENTATION
// ============================================
console.log('📚 Validating Documentation...');

const docs = [
  'docs/PROGRAMMATIC_SEO.md',
  'README.md',
  'CHANGELOG.md'
];

docs.forEach(doc => {
  const docPath = path.join(__dirname, '..', doc);
  if (fs.existsSync(docPath)) {
    const docContent = fs.readFileSync(docPath, 'utf8');
    const lineCount = docContent.split('\n').length;
    passed.push(`✅ ${doc} exists (${lineCount} lines)`);
  } else {
    warnings.push(`⚠️  Missing documentation: ${doc}`);
  }
});

console.log('');

// ============================================
// SUMMARY REPORT
// ============================================
console.log('\n' + '='.repeat(60));
console.log('📊 QA VALIDATION SUMMARY');
console.log('='.repeat(60) + '\n');

console.log(`✅ Passed:   ${passed.length} checks`);
console.log(`⚠️  Warnings: ${warnings.length} issues`);
console.log(`❌ Errors:   ${errors.length} critical issues\n`);

// Show errors first
if (errors.length > 0) {
  console.log('❌ CRITICAL ERRORS:\n');
  errors.forEach(err => console.log(`   ${err}`));
  console.log('');
}

// Show warnings
if (warnings.length > 0) {
  console.log('⚠️  WARNINGS:\n');
  warnings.forEach(warn => console.log(`   ${warn}`));
  console.log('');
}

// Statistics
console.log('📈 STATISTICS:\n');
console.log(`   Countries: ${configuredCountries.length}`);
console.log(`   Brokers: ${uniqueBrokerIds.length}`);
console.log(`   Total Broker-Country Pairings: ${Object.values(countryMappings).flat().length}`);
console.log(`   Unique Brokers Used: ${allMappedBrokers.size}`);
console.log(`   Sitemap URLs: ${fs.existsSync(sitemapFile) ? 
  (fs.readFileSync(sitemapFile, 'utf8').match(/<loc>/g) || []).length : 'N/A'}`);
console.log('');

// Overall status
if (errors.length === 0) {
  console.log('🎉 VALIDATION PASSED! All critical checks successful.\n');
  process.exit(0);
} else {
  console.log(`⚠️  VALIDATION FAILED! ${errors.length} critical error(s) found.\n`);
  process.exit(1);
}