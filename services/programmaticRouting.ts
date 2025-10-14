/**
 * Programmatic Routing Service
 * Handles validation and route generation for programmatic directory pages
 */

import { allSEOPageConfigs, getSEOPageConfigBySlug } from '../data/seoPageConfigs';
import { getCountryBySlug } from '../lib/constants/countries';

export interface ProgrammaticRoute {
  path: string;
  type: 'category' | 'country' | 'seo';
  isValid: boolean;
  config?: any;
}

/**
 * Validates if a category slug exists in SEO page configs
 */
export const validateCategoryRoute = (categorySlug: string): ProgrammaticRoute => {
  const normalizedSlug = (categorySlug || '')
    .split('?')[0]
    .replace(/\/+$/, '')
    .toLowerCase();
  const config = getSEOPageConfigBySlug(normalizedSlug);

  return {
    path: `/best-brokers/${normalizedSlug}`,
    type: 'category',
    isValid: !!config,
    config
  };
};

/**
 * Validates if a country slug exists in countries config
 */
export const validateCountryRoute = (countrySlug: string): ProgrammaticRoute => {
  const config = getCountryBySlug(countrySlug);

  return {
    path: `/best-forex-brokers/${countrySlug}`,
    type: 'country',
    isValid: !!config,
    config
  };
};

/**
 * Validates if an SEO slug exists in SEO page configs
 */
export const validateSEORoute = (seoSlug: string): ProgrammaticRoute => {
  const normalizedSlug = (seoSlug || '')
    .split('?')[0]
    .replace(/\/+$/, '')
    .toLowerCase();
  const config = getSEOPageConfigBySlug(normalizedSlug);

  return {
    path: `/brokers/${normalizedSlug}`,
    type: 'seo',
    isValid: !!config,
    config
  };
};

/**
 * Get all valid programmatic routes
 */
export const getAllProgrammaticRoutes = (): ProgrammaticRoute[] => {
  const routes: ProgrammaticRoute[] = [];

  // Add category routes
  allSEOPageConfigs.forEach(config => {
    const pathSegment = config.path.split('/').pop();
    if (pathSegment) {
      routes.push({
        path: `/best-brokers/${pathSegment}`,
        type: 'category',
        isValid: true,
        config
      });
    }
  });

  // Add SEO routes
  allSEOPageConfigs.forEach(config => {
    const pathSegment = config.path.split('/').pop();
    if (pathSegment) {
      routes.push({
        path: `/brokers/${pathSegment}`,
        type: 'seo',
        isValid: true,
        config
      });
    }
  });

  return routes;
};

/**
 * Generate URL for a programmatic route
 */
export const generateProgrammaticUrl = (type: 'category' | 'country' | 'seo', slug: string): string => {
  switch (type) {
    case 'category':
      return `/best-brokers/${slug}`;
    case 'country':
      return `/best-forex-brokers/${slug}`;
    case 'seo':
      return `/brokers/${slug}`;
    default:
      return '/';
  }
};

/**
 * Check if a path is a programmatic route
 */
export const isProgrammaticRoute = (path: string): boolean => {
  const patterns = [
    /^\/best-brokers\/[^\/]+$/,
    /^\/best-forex-brokers\/[^\/]+$/,
    /^\/brokers\/[^\/]+$/
  ];

  return patterns.some(pattern => pattern.test(path));
};

/**
 * Extract slug from programmatic path
 */
export const extractSlugFromPath = (path: string): string | null => {
  const segments = path.split('/');
  return segments[segments.length - 1] || null;
};

/**
 * Get route type from path
 */
export const getRouteType = (path: string): 'category' | 'country' | 'seo' | null => {
  if (path.startsWith('/best-brokers/')) return 'category';
  if (path.startsWith('/best-forex-brokers/')) return 'country';
  if (path.startsWith('/brokers/')) return 'seo';
  return null;
};