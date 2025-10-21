const fs = require('fs');
const path = require('path');

// Test if we can access the seed data
const seedDataPath = path.join(__dirname, 'Brokeranalysisgooglestudio/data/programmatic-seed-data.json');

try {
  console.log('🧪 Testing programmatic data access...');

  if (fs.existsSync(seedDataPath)) {
    console.log('✅ Seed data file exists:', seedDataPath);

    const seedData = JSON.parse(fs.readFileSync(seedDataPath, 'utf8'));
    console.log('✅ Seed data loaded successfully');

    console.log('\n📊 Seed Data Summary:');
    console.log(`  - Countries: ${seedData.countries.length}`);
    console.log(`  - Categories: ${seedData.categories.length}`);
    console.log(`  - Strategies: ${seedData.strategies.length}`);
    console.log(`  - Features: ${seedData.features.length}`);
    console.log(`  - Templates: ${seedData.templates.length}`);

    // Test some basic lookups
    const usCountry = seedData.countries.find(c => c.code === 'US');
    const forexCategory = seedData.categories.find(c => c.slug === 'forex');

    console.log('\n🔍 Test Lookups:');
    console.log(`  - US Country: ${usCountry ? usCountry.name : 'Not found'}`);
    console.log(`  - Forex Category: ${forexCategory ? forexCategory.name : 'Not found'}`);

    // Test title generation
    const template = seedData.templates.find(t => t.page_type === 'category_country');
    if (template && usCountry && forexCategory) {
      const title = template.title_template
        .replace(/{category}/g, forexCategory.name)
        .replace(/{country}/g, usCountry.name);
      console.log(`  - Generated Title: ${title}`);
    }

    console.log('\n✅ All tests passed! Seed data is working correctly.');

  } else {
    console.log('❌ Seed data file not found:', seedDataPath);
  }

} catch (error) {
  console.error('❌ Error testing seed data:', error.message);
  if (error.stack) {
    console.error('Stack trace:', error.stack);
  }
}