
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
    