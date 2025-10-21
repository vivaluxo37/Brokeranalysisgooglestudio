const fs = require('fs');
const path = require('path');

// Countries data for programmatic content
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

// Trading strategies
const strategiesData = [
  { slug: 'scalping', name: 'Scalping', description: 'Short-term trading strategy for small profits', difficulty: 'advanced' },
  { slug: 'day-trading', name: 'Day Trading', description: 'Buy and sell within the same trading day', difficulty: 'intermediate' },
  { slug: 'swing-trading', name: 'Swing Trading', description: 'Hold positions for several days to weeks', difficulty: 'beginner' },
  { slug: 'position-trading', name: 'Position Trading', description: 'Long-term trading strategy', difficulty: 'beginner' },
  { slug: 'carry-trade', name: 'Carry Trade', description: 'Profit from interest rate differentials', difficulty: 'intermediate' },
  { slug: 'breakout-trading', name: 'Breakout Trading', description: 'Trade price breakouts from consolidation', difficulty: 'intermediate' },
  { slug: 'mean-reversion', name: 'Mean Reversion', description: 'Trade price returns to historical averages', difficulty: 'advanced' },
  { slug: 'algorithmic-trading', name: 'Algorithmic Trading', description: 'Use computer programs for trading', difficulty: 'advanced' }
];

// Trading features
const featuresData = [
  { slug: 'leverage', name: 'Leverage', description: 'Ability to control larger positions with less capital', importance: 'high' },
  { slug: 'spreads', name: 'Spreads', description: 'Difference between bid and ask prices', importance: 'high' },
  { slug: 'regulation', name: 'Regulation', description: 'Regulatory oversight and protection', importance: 'high' },
  { slug: 'customer-support', name: 'Customer Support', description: 'Quality and availability of support services', importance: 'medium' },
  { slug: 'trading-platforms', name: 'Trading Platforms', description: 'Software and tools for trading', importance: 'medium' },
  { slug: 'payment-methods', name: 'Payment Methods', description: 'Available deposit and withdrawal options', importance: 'medium' },
  { slug: 'educational-resources', name: 'Educational Resources', description: 'Learning materials and analysis tools', importance: 'low' },
  { slug: 'mobile-trading', name: 'Mobile Trading', description: 'Mobile app availability and functionality', importance: 'low' }
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
  },
  {
    page_type: 'strategy',
    title_template: '{strategy} Strategy Guide | How to Trade {strategy}',
    meta_description_template: 'Master the {strategy} trading strategy. Learn entry/exit signals, risk management, and practical examples.',
    content_template: 'Complete guide to {strategy} trading strategy with detailed explanations and examples.',
    structured_data_template: {
      "@type": "Article",
      "headline": "{strategy} Trading Strategy",
      "description": "Complete guide to {strategy} trading strategy"
    }
  },
  {
    page_type: 'feature',
    title_template: '{feature} in Trading | What You Need to Know',
    meta_description_template: 'Understanding {feature} in trading. Compare broker offerings, learn best practices, and make informed decisions.',
    content_template: 'Comprehensive guide to {feature} in trading with practical tips and broker comparisons.',
    structured_data_template: {
      "@type": "Article",
      "headline": "{feature} in Trading",
      "description": "Complete guide to {feature} in trading"
    }
  }
];

function createSeedData() {
  try {
    console.log('🌱 Creating programmatic seed data...');

    const seedData = {
      countries: countriesData,
      categories: categoriesData,
      strategies: strategiesData,
      features: featuresData,
      templates: programmaticTemplates,
      metadata: {
        generated_at: new Date().toISOString(),
        total_countries: countriesData.length,
        total_categories: categoriesData.length,
        total_strategies: strategiesData.length,
        total_features: featuresData.length,
        total_templates: programmaticTemplates.length
      }
    };

    // Create data directory if it doesn't exist
    const dataDir = path.join(__dirname, 'Brokeranalysisgooglestudio/data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log('📁 Created data directory:', dataDir);
    }

    // Save main seed data file
    const seedFilePath = path.join(dataDir, 'programmatic-seed-data.json');
    fs.writeFileSync(seedFilePath, JSON.stringify(seedData, null, 2));
    console.log('✅ Seed data saved to:', seedFilePath);

    // Create utility functions file
    const utilsCode = `
/**
 * Programmatic SEO Data Utilities
 *
 * This file provides utility functions for accessing and using
 * the programmatic seed data in your React components.
 */

import seedData from './programmatic-seed-data.json';

// Export data directly
export const countries = seedData.countries;
export const categories = seedData.categories;
export const strategies = seedData.strategies;
export const features = seedData.features;
export const templates = seedData.templates;

// Utility functions
export const getCountryByCode = (code) => {
  return countries.find(country =>
    country.code.toLowerCase() === code.toLowerCase()
  );
};

export const getCategoryBySlug = (slug) => {
  return categories.find(category =>
    category.slug.toLowerCase() === slug.toLowerCase()
  );
};

export const getStrategyBySlug = (slug) => {
  return strategies.find(strategy =>
    strategy.slug.toLowerCase() === slug.toLowerCase()
  );
};

export const getFeatureBySlug = (slug) => {
  return features.find(feature =>
    feature.slug.toLowerCase() === slug.toLowerCase()
  );
};

export const getTemplateByType = (type) => {
  return templates.find(template =>
    template.page_type.toLowerCase() === type.toLowerCase()
  );
};

// Generate page title
export const generateTitle = (template, category, country, strategy, feature) => {
  let title = template.title_template;

  if (category) {
    const cat = getCategoryBySlug(category) || { name: category };
    title = title.replace(/{category}/g, cat.name);
  }

  if (country) {
    const cntry = getCountryByCode(country) || { name: country };
    title = title.replace(/{country}/g, cntry.name);
  }

  if (strategy) {
    const strat = getStrategyBySlug(strategy) || { name: strategy };
    title = title.replace(/{strategy}/g, strat.name);
  }

  if (feature) {
    const feat = getFeatureBySlug(feature) || { name: feature };
    title = title.replace(/{feature}/g, feat.name);
  }

  return title;
};

// Generate meta description
export const generateMetaDescription = (template, category, country, strategy, feature) => {
  let description = template.meta_description_template;

  if (category) {
    const cat = getCategoryBySlug(category) || { name: category };
    description = description.replace(/{category}/g, cat.name.toLowerCase());
  }

  if (country) {
    const cntry = getCountryByCode(country) || { name: country };
    description = description.replace(/{country}/g, cntry.name);
  }

  if (strategy) {
    const strat = getStrategyBySlug(strategy) || { name: strategy };
    description = description.replace(/{strategy}/g, strat.name.toLowerCase());
  }

  if (feature) {
    const feat = getFeatureBySlug(feature) || { name: feature };
    description = description.replace(/{feature}/g, feat.name.toLowerCase());
  }

  return description;
};

// Generate keywords
export const generateKeywords = (category, country, strategy, feature) => {
  const keywords = [];

  if (category) {
    const cat = getCategoryBySlug(category);
    keywords.push(cat ? cat.name : category, cat ? cat.name.toLowerCase() : category.toLowerCase());
  }

  if (country) {
    const cntry = getCountryByCode(country);
    keywords.push(cntry ? cntry.name : country);
  }

  if (strategy) {
    const strat = getStrategyBySlug(strategy);
    keywords.push(strat ? strat.name : strategy, 'trading strategy');
  }

  if (feature) {
    const feat = getFeatureBySlug(feature);
    keywords.push(feat ? feat.name : feature);
  }

  // Add common keywords
  keywords.push('forex trading', 'broker', 'trading', 'online trading', 'best brokers');

  return [...new Set(keywords)]; // Remove duplicates
};

// Get countries by region
export const getCountriesByRegion = (region) => {
  return countries.filter(country =>
    country.region.toLowerCase() === region.toLowerCase()
  );
};

// Get top trading countries
export const getTopTradingCountries = (limit = 10) => {
  return countries
    .sort((a, b) => a.trading_popularity - b.trading_popularity)
    .slice(0, limit);
};

// Get all regions
export const getAllRegions = () => {
  return [...new Set(countries.map(country => country.region))];
};

export default seedData;
    `;

    const utilsFilePath = path.join(dataDir, 'programmatic-data-utils.js');
    fs.writeFileSync(utilsFilePath, utilsCode);
    console.log('✅ Utility functions saved to:', utilsFilePath);

    // Create TypeScript definitions
    const typesCode = `
/**
 * Programmatic SEO Data Types
 *
 * TypeScript definitions for the programmatic seed data.
 */

export interface Country {
  code: string;
  name: string;
  region: string;
  currency: string;
  languages: string[];
  regulatory_authority: string;
  trading_popularity: number;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  icon: string;
  is_active: boolean;
  sort_order: number;
}

export interface Strategy {
  slug: string;
  name: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface Feature {
  slug: string;
  name: string;
  description: string;
  importance: 'low' | 'medium' | 'high';
}

export interface ProgrammaticTemplate {
  page_type: string;
  title_template: string;
  meta_description_template: string;
  content_template: string;
  structured_data_template: Record<string, any>;
}

export interface SeedData {
  countries: Country[];
  categories: Category[];
  strategies: Strategy[];
  features: Feature[];
  templates: ProgrammaticTemplate[];
  metadata: {
    generated_at: string;
    total_countries: number;
    total_categories: number;
    total_strategies: number;
    total_features: number;
    total_templates: number;
  };
}
    `;

    const typesFilePath = path.join(dataDir, 'programmatic-data-types.ts');
    fs.writeFileSync(typesFilePath, typesCode);
    console.log('✅ TypeScript definitions saved to:', typesFilePath);

    console.log('\n📊 Seed Data Summary:');
    console.log(`  - Countries: ${countriesData.length}`);
    console.log(`  - Categories: ${categoriesData.length}`);
    console.log(`  - Strategies: ${strategiesData.length}`);
    console.log(`  - Features: ${featuresData.length}`);
    console.log(`  - Templates: ${programmaticTemplates.length}`);

    console.log('\n📁 Files Created:');
    console.log(`  - ${seedFilePath}`);
    console.log(`  - ${utilsFilePath}`);
    console.log(`  - ${typesFilePath}`);

    console.log('\n🎉 Programmatic seed data created successfully!');
    console.log('\n📖 Usage Examples:');
    console.log('```javascript');
    console.log('import { getCountryByCode, getCategoryBySlug, generateTitle } from "./data/programmatic-data-utils.js";');
    console.log('');
    console.log('const country = getCountryByCode("US"); // United States');
    console.log('const category = getCategoryBySlug("forex"); // Forex Trading');
    console.log('const template = templates.find(t => t.page_type === "category_country");');
    console.log('const title = generateTitle(template, "forex", "US");');
    console.log('// Result: "Forex Trading in United States | Best Brokers 2025"');
    console.log('```');

    return true;

  } catch (error) {
    console.error('❌ Failed to create seed data:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    return false;
  }
}

// Run the seed data creation
const success = createSeedData();
if (success) {
  console.log('\n✅ Ready to use programmatic data in your application!');
} else {
  console.log('\n❌ Failed to create seed data. Please check the errors above.');
}