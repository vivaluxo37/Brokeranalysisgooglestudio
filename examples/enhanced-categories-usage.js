// Enhanced Categories System - Usage Examples
// This file demonstrates how to use the enhanced categories system

import { enhancedCategories, getBrokersForCategory, getCategoryBySlug, categoryGroups } from '../data/enhancedCategoryMappings';
import { getEnhancedContentGenerator } from '../lib/enhancedContentGeneration';

// Example 1: Get all available categories
export const getAllCategories = () => {
  return enhancedCategories.map(category => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    group: category.categoryGroup,
    description: category.description,
    icon: category.icon,
    color: category.color
  }));
};

// Example 2: Get categories by group
export const getCategoriesByGroup = (group) => {
  return enhancedCategories.filter(category => category.categoryGroup === group);
};

// Example 3: Get popular categories (first 5 from each group)
export const getPopularCategories = () => {
  const popular = [];

  Object.keys(categoryGroups).forEach(group => {
    const categories = categoryGroups[group].slice(0, 5);
    popular.push(...categories);
  });

  return popular;
};

// Example 4: Find brokers for a specific category
export const findBrokersForCategory = (categoryId, allBrokers) => {
  const category = getCategoryBySlug(categoryId);
  if (!category) {
    console.error(`Category not found: ${categoryId}`);
    return [];
  }

  const filteredBrokers = getBrokersForCategory(allBrokers, categoryId);

  return {
    category: category.name,
    totalBrokers: filteredBrokers.length,
    brokers: filteredBrokers.map(broker => ({
      id: broker.id,
      name: broker.name,
      score: broker.score,
      regulation: broker.regulation?.regulators?.join(', ') || 'International',
      platforms: broker.technology?.platforms || [],
      minDeposit: broker.accessibility?.minDeposit || 0,
      isIslamic: broker.isIslamic,
      allowsScalping: broker.tradingConditionsExtended?.scalpingAllowed || false,
      allowsHedging: broker.tradingConditionsExtended?.hedgingAllowed || false,
      leverage: broker.tradingConditions?.maxLeverage || 'Variable'
    }))
  };
};

// Example 5: Generate content for a category
export const generateCategoryContent = async (categoryId, brokers) => {
  const category = getCategoryBySlug(categoryId);
  if (!category) {
    console.error(`Category not found: ${categoryId}`);
    return null;
  }

  const contentGenerator = getEnhancedContentGenerator();

  const brokerSummaries = brokers.slice(0, 10).map(broker => ({
    name: broker.name,
    rating: broker.score || 8.0,
    minDeposit: broker.accessibility?.minDeposit || 100,
    regulation: broker.regulation?.regulators?.join(', ') || 'International',
    keyFeatures: [
      broker.technology?.platforms?.[0] || 'Trading Platform',
      `Min Deposit: $${broker.accessibility?.minDeposit || 100}`,
      broker.accountTypes?.[0]?.name || 'Standard Account',
      broker.coreInfo?.brokerType || 'Standard'
    ].filter(Boolean)
  }));

  try {
    const content = await contentGenerator.generateEnhancedCategoryContent(category, brokerSummaries);
    return {
      title: content.h1,
      introduction: content.intro,
      localContext: content.localContext,
      comparisonHighlights: content.comparisonHighlights,
      faqs: content.faqs,
      seoTitle: content.metaTitle,
      seoDescription: content.metaDescription,
      keywords: content.keywords,
      structuredData: content.structuredData
    };
  } catch (error) {
    console.error('Error generating content:', error);
    return null;
  }
};

// Example 6: Get category statistics
export const getCategoryStatistics = (allBrokers) => {
  const stats = {};

  enhancedCategories.forEach(category => {
    const categoryBrokers = getBrokersForCategory(allBrokers, category.id);
    const avgScore = categoryBrokers.length > 0
      ? (categoryBrokers.reduce((sum, broker) => sum + (broker.score || 0), 0) / categoryBrokers.length).toFixed(1)
      : 0;

    stats[category.id] = {
      name: category.name,
      group: category.categoryGroup,
      totalBrokers: categoryBrokers.length,
      minimumRequired: category.minimumBrokers,
      averageScore: parseFloat(avgScore),
      topBroker: categoryBrokers.length > 0 ? categoryBrokers[0].name : 'None',
      icon: category.icon,
      color: category.color
    };
  });

  return stats;
};

// Example 7: Search categories by keyword
export const searchCategories = (keyword) => {
  const lowerKeyword = keyword.toLowerCase();

  return enhancedCategories.filter(category =>
    category.name.toLowerCase().includes(lowerKeyword) ||
    category.description.toLowerCase().includes(lowerKeyword) ||
    category.localContext.keyFeatures.some(feature =>
      feature.toLowerCase().includes(lowerKeyword)
    )
  ).map(category => ({
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    group: category.categoryGroup,
    relevanceScore: calculateRelevanceScore(category, lowerKeyword)
  })).sort((a, b) => b.relevanceScore - a.relevanceScore);
};

// Helper function for relevance scoring
const calculateRelevanceScore = (category, keyword) => {
  let score = 0;

  if (category.name.toLowerCase().includes(keyword)) {
    score += 10;
  }
  if (category.description.toLowerCase().includes(keyword)) {
    score += 5;
  }
  category.localContext.keyFeatures.forEach(feature => {
    if (feature.toLowerCase().includes(keyword)) {
      score += 3;
    }
  });

  return score;
};

// Example 8: Get category navigation data
export const getCategoryNavigation = () => {
  const navigation = {};

  Object.keys(categoryGroups).forEach(group => {
    navigation[group] = {
      name: group.charAt(0).toUpperCase() + group.slice(1),
      categories: categoryGroups[group].map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        color: cat.color
      })),
      count: categoryGroups[group].length
    };
  });

  return navigation;
};

// Example 9: Validate broker data for categories
export const validateBrokerData = (broker) => {
  const issues = [];
  const warnings = [];

  // Check required fields
  if (!broker.id) issues.push('Missing broker ID');
  if (!broker.name) issues.push('Missing broker name');
  if (!broker.score && broker.score !== 0) issues.push('Missing broker score');

  // Check important optional fields
  if (!broker.technology?.platforms?.length) {
    warnings.push('No platform information available');
  }
  if (!broker.regulation?.regulators?.length) {
    warnings.push('No regulation information available');
  }
  if (!broker.accessibility?.minDeposit && broker.accessibility?.minDeposit !== 0) {
    warnings.push('No minimum deposit information');
  }

  // Check data types
  if (broker.score && typeof broker.score !== 'number') {
    issues.push('Score should be a number');
  }
  if (broker.accessibility?.minDeposit && typeof broker.accessibility.minDeposit !== 'number') {
    issues.push('Min deposit should be a number');
  }

  return {
    isValid: issues.length === 0,
    issues,
    warnings,
    categoryCompatibility: {
      ecnCompatible: broker.coreInfo?.brokerType?.includes('ECN') || false,
      mt4Compatible: broker.technology?.platforms?.includes('MT4') || false,
      mt5Compatible: broker.technology?.platforms?.includes('MT5') || false,
      islamicCompatible: broker.isIslamic || broker.accountManagement?.islamicAccount?.available || false,
      beginnerCompatible: broker.accessibility?.minDeposit <= 200 && broker.coreInfo?.demoAccount || false
    }
  };
};

// Example 10: Export category data for JSON API
export const exportCategoriesForAPI = () => {
  return {
    categories: enhancedCategories.map(category => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      group: category.categoryGroup,
      icon: category.icon,
      color: category.color,
      minimumBrokers: category.minimumBrokers,
      seoTitle: category.seoTitle,
      metaDescription: category.metaDescription
    })),
    groups: Object.keys(categoryGroups).map(group => ({
      id: group,
      name: group.charAt(0).toUpperCase() + group.slice(1),
      categories: categoryGroups[group].map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        icon: cat.icon,
        color: cat.color
      })),
      count: categoryGroups[group].length
    })),
    totalCategories: enhancedCategories.length,
    lastUpdated: new Date().toISOString()
  };
};

// Usage example:
/*
import {
  getAllCategories,
  getCategoriesByGroup,
  findBrokersForCategory,
  generateCategoryContent
} from './enhanced-categories-usage';

// Get all categories
const allCats = getAllCategories();

// Get ECN brokers
const ecnBrokers = findBrokersForCategory('ecn-brokers', allBrokers);

// Generate content for ECN category
const ecnContent = await generateCategoryContent('ecn-brokers', ecnBrokers.brokers);

// Get execution type categories
const executionCategories = getCategoriesByGroup('execution');
*/