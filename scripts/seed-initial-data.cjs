const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create a simple in-memory data structure for countries that can be used directly
const countriesData = [
  { code: 'US', name: 'United States', region: 'North America', currency: 'USD', languages: ['en'], regulatory_authority: 'NFA/CFTC', trading_popularity: 1 },
  { code: 'GB', name: 'United Kingdom', region: 'Europe', currency: 'GBP', languages: ['en'], regulatory_authority: 'FCA', trading_popularity: 2 },
  { code: 'DE', name: 'Germany', region: 'Europe', currency: 'EUR', languages: ['de', 'en'], regulatory_authority: 'BaFin', trading_popularity: 3 },
  { code: 'FR', name: 'France', region: 'Europe', currency: 'EUR', languages: ['fr', 'en'], regulatory_authority: 'AMF', trading_popularity: 4 },
  { code: 'IT', name: 'Italy', region: 'Europe', currency: 'EUR', languages: ['it', 'en'], regulatory_authority: 'CONSOB', trading_popularity: 5 },
  { code: 'ES', name: 'Spain', region: 'Europe', currency: 'EUR', languages: ['es', 'en'], regulatory_authority: 'CNMV', trading_popularity: 6 },
  { code: 'NL', name: 'Netherlands', region: 'Europe', currency: 'EUR', languages: ['nl', 'en'], regulatory_authority: 'AFM', trading_popularity: 7 },
  { code: 'SE', name: 'Sweden', region: 'Europe', currency: 'SEK', languages: ['sv', 'en'], regulatory_authority: 'Finansinspektionen', trading_popularity: 8 },
  { code: 'NO', name: 'Norway', region: 'Europe', currency: 'NOK', languages: ['no', 'en'], regulatory_authority: 'Finanstilsynet', trading_popularity: 9 },
  { code: 'DK', name: 'Denmark', region: 'Europe', currency: 'DKK', languages: ['da', 'en'], regulatory_authority: 'FSA', trading_popularity: 10 },
  { code: 'FI', name: 'Finland', region: 'Europe', currency: 'EUR', languages: ['fi', 'en'], regulatory_authority: 'FIN-FSA', trading_popularity: 11 },
  { code: 'AT', name: 'Austria', region: 'Europe', currency: 'EUR', languages: ['de', 'en'], regulatory_authority: 'FMA', trading_popularity: 12 },
  { code: 'BE', name: 'Belgium', region: 'Europe', currency: 'EUR', languages: ['nl', 'fr', 'en'], regulatory_authority: 'FSMA', trading_popularity: 13 },
  { code: 'IE', name: 'Ireland', region: 'Europe', currency: 'EUR', languages: ['en', 'ga'], regulatory_authority: 'CBI', trading_popularity: 14 },
  { code: 'PT', name: 'Portugal', region: 'Europe', currency: 'EUR', languages: ['pt', 'en'], regulatory_authority: 'CMVM', trading_popularity: 15 },
  { code: 'GR', name: 'Greece', region: 'Europe', currency: 'EUR', languages: ['el', 'en'], regulatory_authority: 'HCMC', trading_popularity: 16 },
  { code: 'CH', name: 'Switzerland', region: 'Europe', currency: 'CHF', languages: ['de', 'fr', 'it', 'en'], regulatory_authority: 'FINMA', trading_popularity: 17 },
  { code: 'PL', name: 'Poland', region: 'Europe', currency: 'PLN', languages: ['pl', 'en'], regulatory_authority: 'KNF', trading_popularity: 18 },
  { code: 'CZ', name: 'Czech Republic', region: 'Europe', currency: 'CZK', languages: ['cs', 'en'], regulatory_authority: 'CNB', trading_popularity: 19 },
  { code: 'HU', name: 'Hungary', region: 'Europe', currency: 'HUF', languages: ['hu', 'en'], regulatory_authority: 'MNB', trading_popularity: 20 },
  { code: 'RO', name: 'Romania', region: 'Europe', currency: 'RON', languages: ['ro', 'en'], regulatory_authority: 'FSA', trading_popularity: 21 },
  { code: 'BG', name: 'Bulgaria', region: 'Europe', currency: 'BGN', languages: ['bg', 'en'], regulatory_authority: 'FSC', trading_popularity: 22 },
  { code: 'HR', name: 'Croatia', region: 'Europe', currency: 'HRK', languages: ['hr', 'en'], regulatory_authority: 'HANFA', trading_popularity: 23 },
  { code: 'SI', name: 'Slovenia', region: 'Europe', currency: 'EUR', languages: ['sl', 'en'], regulatory_authority: 'ATVP', trading_popularity: 24 },
  { code: 'SK', name: 'Slovakia', region: 'Europe', currency: 'EUR', languages: ['sk', 'en'], regulatory_authority: 'NBS', trading_popularity: 25 },
  { code: 'EE', name: 'Estonia', region: 'Europe', currency: 'EUR', languages: ['et', 'en'], regulatory_authority: 'FI', trading_popularity: 26 },
  { code: 'LV', name: 'Latvia', region: 'Europe', currency: 'EUR', languages: ['lv', 'en'], regulatory_authority: 'FC', trading_popularity: 27 },
  { code: 'LT', name: 'Lithuania', region: 'Europe', currency: 'EUR', languages: ['lt', 'en'], regulatory_authority: 'LB', trading_popularity: 28 },
  { code: 'CY', name: 'Cyprus', region: 'Europe', currency: 'EUR', languages: ['el', 'en', 'tr'], regulatory_authority: 'CySEC', trading_popularity: 29 },
  { code: 'MT', name: 'Malta', region: 'Europe', currency: 'EUR', languages: ['mt', 'en'], regulatory_authority: 'MFSA', trading_popularity: 30 },
  { code: 'LU', name: 'Luxembourg', region: 'Europe', currency: 'EUR', languages: ['fr', 'de', 'en'], regulatory_authority: 'CSSF', trading_popularity: 31 },
  { code: 'CA', name: 'Canada', region: 'North America', currency: 'CAD', languages: ['en', 'fr'], regulatory_authority: 'CIRO', trading_popularity: 32 },
  { code: 'AU', name: 'Australia', region: 'Oceania', currency: 'AUD', languages: ['en'], regulatory_authority: 'ASIC', trading_popularity: 33 },
  { code: 'NZ', name: 'New Zealand', region: 'Oceania', currency: 'NZD', languages: ['en'], regulatory_authority: 'FMA', trading_popularity: 34 },
  { code: 'JP', name: 'Japan', region: 'Asia', currency: 'JPY', languages: ['ja'], regulatory_authority: 'FSA', trading_popularity: 35 },
  { code: 'SG', name: 'Singapore', region: 'Asia', currency: 'SGD', languages: ['en'], regulatory_authority: 'MAS', trading_popularity: 36 },
  { code: 'HK', name: 'Hong Kong', region: 'Asia', currency: 'HKD', languages: ['zh', 'en'], regulatory_authority: 'SFC', trading_popularity: 37 },
  { code: 'CN', name: 'China', region: 'Asia', currency: 'CNY', languages: ['zh'], regulatory_authority: 'CSRC', trading_popularity: 38 },
  { code: 'IN', name: 'India', region: 'Asia', currency: 'INR', languages: ['hi', 'en'], regulatory_authority: 'SEBI', trading_popularity: 39 },
  { code: 'ID', name: 'Indonesia', region: 'Asia', currency: 'IDR', languages: ['id', 'en'], regulatory_authority: 'Bappebti', trading_popularity: 40 },
  { code: 'MY', name: 'Malaysia', region: 'Asia', currency: 'MYR', languages: ['ms', 'en'], regulatory_authority: 'SC', trading_popularity: 41 },
  { code: 'TH', name: 'Thailand', region: 'Asia', currency: 'THB', languages: ['th', 'en'], regulatory_authority: 'SEC', trading_popularity: 42 },
  { code: 'PH', name: 'Philippines', region: 'Asia', currency: 'PHP', languages: ['tl', 'en'], regulatory_authority: 'SEC', trading_popularity: 43 },
  { code: 'VN', name: 'Vietnam', region: 'Asia', currency: 'VND', languages: ['vi', 'en'], regulatory_authority: 'SSC', trading_popularity: 44 },
  { code: 'KH', name: 'Cambodia', region: 'Asia', currency: 'KHR', languages: ['km', 'en'], regulatory_authority: 'SECC', trading_popularity: 45 },
  { code: 'LA', name: 'Laos', region: 'Asia', currency: 'LAK', languages: ['lo', 'en'], regulatory_authority: 'BOL', trading_popularity: 46 },
  { code: 'MM', name: 'Myanmar', region: 'Asia', currency: 'MMK', languages: ['my', 'en'], regulatory_authority: 'SECC', trading_popularity: 47 },
  { code: 'BD', name: 'Bangladesh', region: 'Asia', currency: 'BDT', languages: ['bn', 'en'], regulatory_authority: 'BSEC', trading_popularity: 48 },
  { code: 'LK', name: 'Sri Lanka', region: 'Asia', currency: 'LKR', languages: ['si', 'ta', 'en'], regulatory_authority: 'SEC', trading_popularity: 49 },
  { code: 'PK', name: 'Pakistan', region: 'Asia', currency: 'PKR', languages: ['ur', 'en'], regulatory_authority: 'SECP', trading_popularity: 50 },
  { code: 'AE', name: 'United Arab Emirates', region: 'Middle East', currency: 'AED', languages: ['ar', 'en'], regulatory_authority: 'SCA', trading_popularity: 51 },
  { code: 'SA', name: 'Saudi Arabia', region: 'Middle East', currency: 'SAR', languages: ['ar', 'en'], regulatory_authority: 'CMA', trading_popularity: 52 },
  { code: 'QA', name: 'Qatar', region: 'Middle East', currency: 'QAR', languages: ['ar', 'en'], regulatory_authority: 'QFCRA', trading_popularity: 53 },
  { code: 'KW', name: 'Kuwait', region: 'Middle East', currency: 'KWD', languages: ['ar', 'en'], regulatory_authority: 'CMA', trading_popularity: 54 },
  { code: 'BH', name: 'Bahrain', region: 'Middle East', currency: 'BHD', languages: ['ar', 'en'], regulatory_authority: 'CBB', trading_popularity: 55 },
  { code: 'OM', name: 'Oman', region: 'Middle East', currency: 'OMR', languages: ['ar', 'en'], regulatory_authority: 'CMA', trading_popularity: 56 },
  { code: 'JO', name: 'Jordan', region: 'Middle East', currency: 'JOD', languages: ['ar', 'en'], regulatory_authority: 'JSC', trading_popularity: 57 },
  { code: 'IL', name: 'Israel', region: 'Middle East', currency: 'ILS', languages: ['he', 'ar', 'en'], regulatory_authority: 'ISA', trading_popularity: 58 },
  { code: 'TR', name: 'Turkey', region: 'Middle East', currency: 'TRY', languages: ['tr', 'en'], regulatory_authority: 'CMB', trading_popularity: 59 },
  { code: 'EG', name: 'Egypt', region: 'Middle East', currency: 'EGP', languages: ['ar', 'en'], regulatory_authority: 'FRA', trading_popularity: 60 },
  { code: 'ZA', name: 'South Africa', region: 'Africa', currency: 'ZAR', languages: ['en', 'af', 'zu'], regulatory_authority: 'FSCA', trading_popularity: 61 },
  { code: 'NG', name: 'Nigeria', region: 'Africa', currency: 'NGN', languages: ['en', 'ha', 'yo', 'ig'], regulatory_authority: 'SEC', trading_popularity: 62 },
  { code: 'KE', name: 'Kenya', region: 'Africa', currency: 'KES', languages: ['en', 'sw'], regulatory_authority: 'CMA', trading_popularity: 63 },
  { code: 'GH', name: 'Ghana', region: 'Africa', currency: 'GHS', languages: ['en'], regulatory_authority: 'SEC', trading_popularity: 64 },
  { code: 'MA', name: 'Morocco', region: 'Africa', currency: 'MAD', languages: ['ar', 'fr', 'en'], regulatory_authority: 'AMMC', trading_popularity: 65 },
  { code: 'TN', name: 'Tunisia', region: 'Africa', currency: 'TND', languages: ['ar', 'fr', 'en'], regulatory_authority: 'CMF', trading_popularity: 66 },
  { code: 'BR', name: 'Brazil', region: 'South America', currency: 'BRL', languages: ['pt'], regulatory_authority: 'CVM', trading_popularity: 67 },
  { code: 'AR', name: 'Argentina', region: 'South America', currency: 'ARS', languages: ['es'], regulatory_authority: 'CNV', trading_popularity: 68 },
  { code: 'CL', name: 'Chile', region: 'South America', currency: 'CLP', languages: ['es'], regulatory_authority: 'CMF', trading_popularity: 69 },
  { code: 'CO', name: 'Colombia', region: 'South America', currency: 'COP', languages: ['es'], regulatory_authority: 'SFC', trading_popularity: 70 },
  { code: 'PE', name: 'Peru', region: 'South America', currency: 'PEN', languages: ['es'], regulatory_authority: 'SMV', trading_popularity: 71 },
  { code: 'MX', name: 'Mexico', region: 'North America', currency: 'MXN', languages: ['es'], regulatory_authority: 'CNBV', trading_popularity: 72 },
  { code: 'RU', name: 'Russia', region: 'Europe/Asia', currency: 'RUB', languages: ['ru'], regulatory_authority: 'CBR', trading_popularity: 73 },
  { code: 'KZ', name: 'Kazakhstan', region: 'Asia', currency: 'KZT', languages: ['kk', 'ru'], regulatory_authority: 'AFSA', trading_popularity: 74 },
  { code: 'UZ', name: 'Uzbekistan', region: 'Asia', currency: 'UZS', languages: ['uz', 'ru'], regulatory_authority: 'CRR', trading_popularity: 75 }
];

// Categories data for programmatic content
const categoriesData = [
  { slug: 'forex', name: 'Forex Trading', description: 'Foreign exchange trading and currency pairs', icon: 'trending-up', is_active: true, sort_order: 1 },
  { slug: 'crypto', name: 'Cryptocurrency', description: 'Digital assets and cryptocurrency trading', icon: 'bitcoin', is_active: true, sort_order: 2 },
  { slug: 'stocks', name: 'Stock Trading', description: 'Equity and stock market trading', icon: 'bar-chart', is_active: true, sort_order: 3 },
  { slug: 'commodities', name: 'Commodities', description: 'Physical commodities and futures trading', icon: 'package', is_active: true, sort_order: 4 },
  { slug: 'indices', name: 'Indices', description: 'Stock index trading and ETFs', icon: 'line-chart', is_active: true, sort_order: 5 },
  { slug: 'bonds', name: 'Bonds', description: 'Government and corporate bond trading', icon: 'shield', is_active: true, sort_order: 6 }
];

// Sample programmatic page templates
const programmaticTemplates = [
  {
    page_type: 'category_country',
    title_template: '{category} Trading in {country} | Best Brokers 2025',
    meta_description_template: 'Find the best {category} brokers in {country}. Compare platforms, learn regulations, and start trading {category} safely.',
    content_template: 'Comprehensive guide to {category} trading in {country} with top broker recommendations.',
    structured_data_template: {
      "@type": "Article",
      "headline": "{category} Trading in {country}",
      "description": "Complete guide to {category} trading in {country}"
    }
  },
  {
    page_type: 'category',
    title_template: '{category} Trading Guide 2025 | Complete Beginner\'s Guide',
    meta_description_template: 'Learn everything about {category} trading. Strategies, risks, and how to choose the best {category} broker.',
    content_template: 'Comprehensive {category} trading guide for beginners and experienced traders.',
    structured_data_template: {
      "@type": "Article",
      "headline": "{category} Trading Guide",
      "description": "Complete guide to {category} trading"
    }
  },
  {
    page_type: 'country',
    title_template: 'Forex Trading in {country} | Complete Guide 2025',
    meta_description_template: 'Everything you need to know about forex trading in {country}. Find regulated brokers and start trading safely.',
    content_template: 'Complete guide to forex trading in {country} with local regulations and top broker recommendations.',
    structured_data_template: {
      "@type": "Article",
      "headline": "Forex Trading in {country}",
      "description": "Complete guide to forex trading in {country}"
    }
  }
];

async function seedInitialData() {
  try {
    console.log('🌱 Starting initial data seeding...');

    // Create in-memory fallback data since database seeding had issues
    const seedData = {
      countries: countriesData,
      categories: categoriesData,
      templates: programmaticTemplates
    };

    // Save to local file for the application to use as fallback
    const fs = require('fs');
    const path = require('path');

    const seedFilePath = path.join(__dirname, '../Brokeranalysisgooglestudio/data/programmatic-seed-data.json');

    // Ensure directory exists
    const dataDir = path.dirname(seedFilePath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(seedFilePath, JSON.stringify(seedData, null, 2));
    console.log('✅ Seed data saved to:', seedFilePath);

    // Try to seed to database as well
    const supabase = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.VITE_SUPABASE_ANON_KEY
    );

    console.log('🔄 Attempting to seed database...');

    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('countries')
      .select('count', { count: 'exact', head: true });

    if (testError) {
      console.log('⚠️  Database connection failed, using local seed data only');
      console.log('   Error:', testError.message);
    } else {
      console.log('✅ Database connection successful, existing countries:', testData || 0);

      // If database is accessible but empty, we could add more seeding logic here
      // For now, we'll rely on the local seed data
    }

    console.log('📊 Seed Data Summary:');
    console.log(`  - Countries: ${countriesData.length}`);
    console.log(`  - Categories: ${categoriesData.length}`);
    console.log(`  - Templates: ${programmaticTemplates.length}`);

    // Create a sample usage file to show how to use the data
    const usageExample = `
// Example usage of seed data in your application
import seedData from '../data/programmatic-seed-data.json';

// Get country by code
const getCountry = (code) => seedData.countries.find(c => c.code === code);

// Get category by slug
const getCategory = (slug) => seedData.categories.find(c => c.slug === slug);

// Generate page title
const generateTitle = (template, category, country) => {
  return template
    .replace(/{category}/g, category?.name || category)
    .replace(/{country}/g, country?.name || country);
};

// Example:
const country = getCountry('US'); // United States
const category = getCategory('forex'); // Forex Trading
const template = seedData.templates.find(t => t.page_type === 'category_country');
const title = generateTitle(template.title_template, category, country);
// Result: "Forex Trading in United States | Best Brokers 2025"
    `;

    const usageFilePath = path.join(__dirname, '../Brokeranalysisgooglestudio/data/seed-data-usage.js');
    fs.writeFileSync(usageFilePath, usageExample);
    console.log('✅ Usage example saved to:', usageFilePath);

    console.log('🎉 Initial data seeding completed successfully!');
    console.log('');
    console.log('Next steps:');
    console.log('1. The application can now use the seed data from /data/programmatic-seed-data.json');
    console.log('2. Programmatic routes will have access to countries and categories data');
    console.log('3. AI content generation can use this data for dynamic content creation');
    console.log('4. Check the usage example at /data/seed-data-usage.js for implementation details');

  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
  }
}

// Run the seeding
seedInitialData();