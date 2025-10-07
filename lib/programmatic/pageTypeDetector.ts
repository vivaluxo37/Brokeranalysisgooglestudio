/**
 * Page Type Detector for Programmatic SEO
 * 
 * This utility analyzes URL patterns to determine the type of programmatic page
 * and extracts relevant parameters for content generation and routing.
 */

export type PageType = 'category' | 'country' | 'category-country' | 'strategy' | 'feature' | 'broker' | 'home';

export interface PageDetectionResult {
  type: PageType;
  params: Record<string, string | number>;
  slug: string;
  template: string;
  metadata: {
    title: string;
    description: string;
    keywords: string[];
  };
}

// URL patterns for different page types
const URL_PATTERNS = {
  category: /^\/([a-z-]+)\/?$/i,
  country: /^\/country\/([a-z]{2})\/?$/i,
  'category-country': /^\/([a-z-]+)\/([a-z]{2})\/?$/i,
  strategy: /^\/([a-z-]+)-strategy\/?$/i,
  feature: /^\/([a-z-]+)-feature\/?$/i,
  broker: /^\/broker\/([a-z0-9-]+)\/?$/i,
  home: /^\/?$/
};

// Category mappings
const CATEGORIES: Record<string, { id: number; name: string; description: string }> = {
  'forex': { id: 1, name: 'Forex Trading', description: 'Find the best forex brokers for currency trading' },
  'stocks': { id: 2, name: 'Stock Trading', description: 'Top brokers for stock and equity trading' },
  'crypto': { id: 3, name: 'Cryptocurrency', description: 'Best crypto exchanges and trading platforms' },
  'commodities': { id: 4, name: 'Commodities', description: 'Trade gold, oil, and other commodities' },
  'indices': { id: 5, name: 'Indices', description: 'Trade global stock market indices' },
  'options': { id: 6, name: 'Options Trading', description: 'Best platforms for options trading' },
  'futures': { id: 7, name: 'Futures Trading', description: 'Top futures brokers and platforms' },
  'cfd': { id: 8, name: 'CFD Trading', description: 'Best CFD brokers for leveraged trading' },
  'etf': { id: 9, name: 'ETF Trading', description: 'Trade exchange-traded funds' },
  'bonds': { id: 10, name: 'Bond Trading', description: 'Fixed income and bond trading platforms' }
};

// Country mappings
const COUNTRIES: Record<string, { code: string; name: string; region: string; currency: string }> = {
  'us': { code: 'US', name: 'United States', region: 'North America', currency: 'USD' },
  'gb': { code: 'GB', name: 'United Kingdom', region: 'Europe', currency: 'GBP' },
  'de': { code: 'DE', name: 'Germany', region: 'Europe', currency: 'EUR' },
  'fr': { code: 'FR', name: 'France', region: 'Europe', currency: 'EUR' },
  'it': { code: 'IT', name: 'Italy', region: 'Europe', currency: 'EUR' },
  'es': { code: 'ES', name: 'Spain', region: 'Europe', currency: 'EUR' },
  'nl': { code: 'NL', name: 'Netherlands', region: 'Europe', currency: 'EUR' },
  'se': { code: 'SE', name: 'Sweden', region: 'Europe', currency: 'SEK' },
  'no': { code: 'NO', name: 'Norway', region: 'Europe', currency: 'NOK' },
  'dk': { code: 'DK', name: 'Denmark', region: 'Europe', currency: 'DKK' },
  'fi': { code: 'FI', name: 'Finland', region: 'Europe', currency: 'EUR' },
  'at': { code: 'AT', name: 'Austria', region: 'Europe', currency: 'EUR' },
  'be': { code: 'BE', name: 'Belgium', region: 'Europe', currency: 'EUR' },
  'ie': { code: 'IE', name: 'Ireland', region: 'Europe', currency: 'EUR' },
  'pt': { code: 'PT', name: 'Portugal', region: 'Europe', currency: 'EUR' },
  'gr': { code: 'GR', name: 'Greece', region: 'Europe', currency: 'EUR' },
  'ch': { code: 'CH', name: 'Switzerland', region: 'Europe', currency: 'CHF' },
  'pl': { code: 'PL', name: 'Poland', region: 'Europe', currency: 'PLN' },
  'cz': { code: 'CZ', name: 'Czech Republic', region: 'Europe', currency: 'CZK' },
  'hu': { code: 'HU', name: 'Hungary', region: 'Europe', currency: 'HUF' },
  'ro': { code: 'RO', name: 'Romania', region: 'Europe', currency: 'RON' },
  'bg': { code: 'BG', name: 'Bulgaria', region: 'Europe', currency: 'BGN' },
  'hr': { code: 'HR', name: 'Croatia', region: 'Europe', currency: 'HRK' },
  'si': { code: 'SI', name: 'Slovenia', region: 'Europe', currency: 'EUR' },
  'sk': { code: 'SK', name: 'Slovakia', region: 'Europe', currency: 'EUR' },
  'ee': { code: 'EE', name: 'Estonia', region: 'Europe', currency: 'EUR' },
  'lv': { code: 'LV', name: 'Latvia', region: 'Europe', currency: 'EUR' },
  'lt': { code: 'LT', name: 'Lithuania', region: 'Europe', currency: 'EUR' },
  'cy': { code: 'CY', name: 'Cyprus', region: 'Europe', currency: 'EUR' },
  'mt': { code: 'MT', name: 'Malta', region: 'Europe', currency: 'EUR' },
  'lu': { code: 'LU', name: 'Luxembourg', region: 'Europe', currency: 'EUR' },
  'ca': { code: 'CA', name: 'Canada', region: 'North America', currency: 'CAD' },
  'au': { code: 'AU', name: 'Australia', region: 'Oceania', currency: 'AUD' },
  'nz': { code: 'NZ', name: 'New Zealand', region: 'Oceania', currency: 'NZD' },
  'jp': { code: 'JP', name: 'Japan', region: 'Asia', currency: 'JPY' },
  'sg': { code: 'SG', name: 'Singapore', region: 'Asia', currency: 'SGD' },
  'hk': { code: 'HK', name: 'Hong Kong', region: 'Asia', currency: 'HKD' },
  'cn': { code: 'CN', name: 'China', region: 'Asia', currency: 'CNY' },
  'in': { code: 'IN', name: 'India', region: 'Asia', currency: 'INR' },
  'id': { code: 'ID', name: 'Indonesia', region: 'Asia', currency: 'IDR' },
  'my': { code: 'MY', name: 'Malaysia', region: 'Asia', currency: 'MYR' },
  'th': { code: 'TH', name: 'Thailand', region: 'Asia', currency: 'THB' },
  'ph': { code: 'PH', name: 'Philippines', region: 'Asia', currency: 'PHP' },
  'vn': { code: 'VN', name: 'Vietnam', region: 'Asia', currency: 'VND' },
  'ae': { code: 'AE', name: 'United Arab Emirates', region: 'Middle East', currency: 'AED' },
  'sa': { code: 'SA', name: 'Saudi Arabia', region: 'Middle East', currency: 'SAR' },
  'za': { code: 'ZA', name: 'South Africa', region: 'Africa', currency: 'ZAR' },
  'br': { code: 'BR', name: 'Brazil', region: 'South America', currency: 'BRL' },
  'mx': { code: 'MX', name: 'Mexico', region: 'North America', currency: 'MXN' }
};

// Strategy keywords
const STRATEGY_KEYWORDS = [
  'day-trading', 'swing-trading', 'position-trading', 'scalping',
  'momentum', 'breakout', 'support-resistance', 'trend-following',
  'mean-reversion', 'arbitrage', 'carry-trade', 'news-trading'
];

// Feature keywords
const FEATURE_KEYWORDS = [
  'low-spreads', 'high-leverage', 'fast-execution', 'mobile-trading',
  'copy-trading', 'algorithmic-trading', 'social-trading', 'islamic-account',
  'demo-account', 'micro-account', 'managed-account', 'vip-account'
];

/**
 * Detect page type from URL path
 */
export function detectPageType(path: string): PageDetectionResult | null {
  // Normalize path
  const normalizedPath = path.toLowerCase().replace(/\/+$/, '');
  
  // Check each pattern
  for (const [type, pattern] of Object.entries(URL_PATTERNS)) {
    const match = normalizedPath.match(pattern);
    if (match) {
      return buildPageDetectionResult(type as PageType, match, normalizedPath);
    }
  }
  
  return null;
}

/**
 * Build page detection result from pattern match
 */
function buildPageDetectionResult(type: PageType, match: RegExpMatchArray, path: string): PageDetectionResult {
  const params: Record<string, string | number> = {};
  let title = '';
  let description = '';
  const keywords: string[] = [];
  
  switch (type) {
    case 'category': {
      const categorySlug = match[1];
      const category = CATEGORIES[categorySlug];
      
      if (category) {
        params.categoryId = category.id;
        params.categorySlug = categorySlug;
        title = `Best ${category.name} Brokers 2025`;
        description = category.description;
        keywords.push(category.name.toLowerCase(), 'brokers', 'trading', '2025');
      }
      break;
    }
    
    case 'country': {
      const countryCode = match[1].toUpperCase();
      const country = COUNTRIES[countryCode.toLowerCase()];
      
      if (country) {
        params.countryCode = countryCode;
        params.countryName = country.name;
        params.region = country.region;
        title = `Best Trading Brokers in ${country.name} 2025`;
        description = `Find the top regulated brokers for traders in ${country.name}. Compare fees, platforms and features.`;
        keywords.push(country.name.toLowerCase(), 'brokers', 'trading', 'regulated', country.currency.toLowerCase());
      }
      break;
    }
    
    case 'category-country': {
      const categorySlug = match[1];
      const countryCode = match[2].toUpperCase();
      const category = CATEGORIES[categorySlug];
      const country = COUNTRIES[countryCode.toLowerCase()];
      
      if (category && country) {
        params.categoryId = category.id;
        params.categorySlug = categorySlug;
        params.countryCode = countryCode;
        params.countryName = country.name;
        title = `Best ${category.name} Brokers in ${country.name} 2025`;
        description = `Top ${category.name.toLowerCase()} brokers for traders in ${country.name}. Compare regulated platforms with competitive fees.`;
        keywords.push(
          category.name.toLowerCase(),
          country.name.toLowerCase(),
          'brokers',
          'trading',
          'regulated',
          country.currency.toLowerCase()
        );
      }
      break;
    }
    
    case 'strategy': {
      const strategySlug = match[1];
      params.strategySlug = strategySlug;
      const strategyName = formatStrategyName(strategySlug);
      title = `${strategyName} Strategy Guide 2025`;
      description = `Learn ${strategyName.toLowerCase()} strategies with our comprehensive guide. Find brokers that support ${strategyName.toLowerCase()}.`;
      keywords.push(strategyName.toLowerCase(), 'strategy', 'trading', 'guide', 'brokers');
      break;
    }
    
    case 'feature': {
      const featureSlug = match[1];
      params.featureSlug = featureSlug;
      const featureName = formatFeatureName(featureSlug);
      title = `Brokers with ${featureName} 2025`;
      description = `Find brokers offering ${featureName.toLowerCase()}. Compare the best platforms with ${featureName.toLowerCase()} features.`;
      keywords.push(featureName.toLowerCase(), 'brokers', 'trading', 'platforms', 'features');
      break;
    }
    
    case 'broker': {
      const brokerSlug = match[1];
      params.brokerSlug = brokerSlug;
      title = `Broker Review - ${formatBrokerName(brokerSlug)}`;
      description = `Read our comprehensive review of ${formatBrokerName(brokerSlug)}. Learn about fees, platforms, regulations and features.`;
      keywords.push(formatBrokerName(brokerSlug).toLowerCase(), 'broker', 'review', 'trading', 'fees');
      break;
    }
    
    case 'home': {
      title = 'Best Online Trading Brokers 2025 | Compare & Choose';
      description = 'Compare the best online trading brokers for 2025. Find regulated platforms for forex, stocks, crypto and more with competitive fees.';
      keywords.push('trading brokers', 'online brokers', 'forex', 'stocks', 'crypto', 'compare', '2025');
      break;
    }
  }
  
  return {
    type,
    params,
    slug: path,
    template: getTemplateForPageType(type),
    metadata: {
      title,
      description,
      keywords
    }
  };
}

/**
 * Get template name for page type
 */
function getTemplateForPageType(type: PageType): string {
  const templateMap: Record<PageType, string> = {
    category: 'CategoryPage',
    country: 'CountryPage',
    'category-country': 'CategoryCountryPage',
    strategy: 'StrategyPage',
    feature: 'FeaturePage',
    broker: 'BrokerReviewPage',
    home: 'HomePage'
  };
  
  return templateMap[type];
}

/**
 * Format strategy slug to readable name
 */
function formatStrategyName(slug: string): string {
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

/**
 * Format feature slug to readable name
 */
function formatFeatureName(slug: string): string {
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

/**
 * Format broker slug to readable name
 */
function formatBrokerName(slug: string): string {
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

/**
 * Generate all possible programmatic URLs
 */
export function generateProgrammaticUrls(): string[] {
  const urls: string[] = [];
  
  // Home page
  urls.push('/');
  
  // Category pages
  Object.keys(CATEGORIES).forEach(categorySlug => {
    urls.push(`/${categorySlug}`);
  });
  
  // Country pages
  Object.keys(COUNTRIES).forEach(countryCode => {
    urls.push(`/country/${countryCode}`);
  });
  
  // Category-country combinations
  Object.keys(CATEGORIES).forEach(categorySlug => {
    Object.keys(COUNTRIES).forEach(countryCode => {
      urls.push(`/${categorySlug}/${countryCode}`);
    });
  });
  
  // Strategy pages
  STRATEGY_KEYWORDS.forEach(strategySlug => {
    urls.push(`/${strategySlug}-strategy`);
  });
  
  // Feature pages
  FEATURE_KEYWORDS.forEach(featureSlug => {
    urls.push(`/${featureSlug}-feature`);
  });
  
  return urls.sort();
}

/**
 * Check if a URL is a programmatic page
 */
export function isProgrammaticPage(path: string): boolean {
  return detectPageType(path) !== null;
}

/**
 * Get category info by slug
 */
export function getCategoryBySlug(slug: string): typeof CATEGORIES[keyof typeof CATEGORIES] | null {
  return CATEGORIES[slug.toLowerCase()] || null;
}

/**
 * Get country info by code
 */
export function getCountryByCode(code: string): typeof COUNTRIES[keyof typeof COUNTRIES] | null {
  return COUNTRIES[code.toLowerCase()] || null;
}

/**
 * Get all categories
 */
export function getAllCategories(): typeof CATEGORIES {
  return CATEGORIES;
}

/**
 * Get all countries
 */
export function getAllCountries(): typeof COUNTRIES {
  return COUNTRIES;
}

/**
 * Get countries by region
 */
export function getCountriesByRegion(region: string): typeof COUNTRIES {
  const result: typeof COUNTRIES = {};
  Object.entries(COUNTRIES).forEach(([code, country]) => {
    if (country.region === region) {
      result[code] = country;
    }
  });
  return result;
}

/**
 * Validate page parameters
 */
export function validatePageParams(type: PageType, params: Record<string, string | number>): boolean {
  switch (type) {
    case 'category':
      return params.categorySlug && getCategoryBySlug(params.categorySlug as string) !== null;
    
    case 'country':
      return params.countryCode && getCountryByCode(params.countryCode as string) !== null;
    
    case 'category-country':
      return (
        params.categorySlug && getCategoryBySlug(params.categorySlug as string) !== null &&
        params.countryCode && getCountryByCode(params.countryCode as string) !== null
      );
    
    case 'strategy':
      return params.strategySlug && STRATEGY_KEYWORDS.includes(params.strategySlug as string);
    
    case 'feature':
      return params.featureSlug && FEATURE_KEYWORDS.includes(params.featureSlug as string);
    
    case 'broker':
      return params.brokerSlug && typeof params.brokerSlug === 'string' && params.brokerSlug.length > 0;
    
    case 'home':
      return true;
    
    default:
      return false;
  }
}