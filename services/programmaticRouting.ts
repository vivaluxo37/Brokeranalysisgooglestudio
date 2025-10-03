import { allSEOPageConfigs } from '../data/seoPageConfigs';

export interface ProgrammaticRoute {
  path: string;
  component: string;
  params?: Record<string, string>;
  priority: number;
  changefreq: 'daily' | 'weekly' | 'monthly';
}

/**
 * Generate all programmatic routes for the application
 */
export function generateProgrammaticRoutes(): ProgrammaticRoute[] {
  const routes: ProgrammaticRoute[] = [];

  // Add SEO category routes from configurations
  allSEOPageConfigs.forEach(config => {
    // Handle /brokers/[seoSlug] routes
    if (config.path.startsWith('/brokers/')) {
      const seoSlug = config.path.replace('/brokers/', '');
      routes.push({
        path: config.path,
        component: 'brokers/[seoSlug]/index',
        params: { seoSlug },
        priority: config.priority,
        changefreq: config.changefreq
      });
    }
    
    // Handle /best-brokers/[category] routes
    if (config.path.startsWith('/best-brokers/') && config.path !== '/best-brokers') {
      const category = config.path.replace('/best-brokers/', '');
      routes.push({
        path: config.path,
        component: 'best-brokers/[category]/index',
        params: { category },
        priority: config.priority,
        changefreq: config.changefreq
      });
    }
  });

  // Add country routes - these would be dynamically generated from country data
  const countries = [
    'united-states',
    'united-kingdom', 
    'australia',
    'germany',
    'canada',
    'france',
    'italy',
    'spain',
    'netherlands',
    'switzerland',
    'singapore',
    'hong-kong',
    'japan',
    'south-africa',
    'new-zealand',
    'belgium',
    'sweden',
    'norway',
    'denmark',
    'finland',
    'poland',
    'czech-republic',
    'austria',
    'ireland',
    'portugal',
    'greece',
    'cyprus',
    'malta',
    'luxembourg',
    'estonia',
    'latvia',
    'lithuania',
    'slovakia',
    'slovenia',
    'hungary',
    'romania',
    'bulgaria',
    'croatia',
    'serbia',
    'bosnia-herzegovina',
    'montenegro',
    'albania',
    'macedonia'
  ];

  countries.forEach(country => {
    routes.push({
      path: `/best-forex-brokers/${country}`,
      component: 'best-forex-brokers/[country]/index',
      params: { country },
      priority: 0.8,
      changefreq: 'weekly'
    });
  });

  return routes;
}

/**
 * Check if a path is a programmatic route
 */
export function isProgrammaticRoute(path: string): boolean {
  const routes = generateProgrammaticRoutes();
  return routes.some(route => route.path === path);
}

/**
 * Get route configuration for a specific path
 */
export function getRouteConfig(path: string): ProgrammaticRoute | null {
  const routes = generateProgrammaticRoutes();
  return routes.find(route => route.path === path) || null;
}

/**
 * Generate sitemap entries for all programmatic routes
 */
export function generateSitemapEntries(baseUrl: string = 'https://brokeranalysis.com'): Array<{
  url: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}> {
  const routes = generateProgrammaticRoutes();
  const lastmod = new Date().toISOString().split('T')[0];

  return routes.map(route => ({
    url: `${baseUrl}${route.path}`,
    lastmod,
    changefreq: route.changefreq,
    priority: route.priority
  }));
}

/**
 * Validate that all programmatic routes have corresponding components
 */
export function validateProgrammaticRoutes(): {
  valid: boolean;
  missing: string[];
  errors: string[];
} {
  const routes = generateProgrammaticRoutes();
  const missing: string[] = [];
  const errors: string[] = [];

  routes.forEach(route => {
    // Check if component file would exist (this is a theoretical check)
    const componentPath = `pages/${route.component}.tsx`;
    
    // In a real implementation, you'd check if the file exists
    // For now, we'll just validate the route structure
    if (!route.path || !route.component) {
      errors.push(`Invalid route configuration: ${JSON.stringify(route)}`);
    }

    if (!route.params) {
      errors.push(`Route ${route.path} missing required params`);
    }
  });

  return {
    valid: missing.length === 0 && errors.length === 0,
    missing,
    errors
  };
}

/**
 * Get all unique parameter names used in programmatic routes
 */
export function getProgrammaticRouteParams(): string[] {
  const routes = generateProgrammaticRoutes();
  const params = new Set<string>();

  routes.forEach(route => {
    if (route.params) {
      Object.keys(route.params).forEach(param => params.add(param));
    }
  });

  return Array.from(params);
}

/**
 * Generate route patterns for React Router
 */
export function getReactRouterPatterns(): Array<{
  path: string;
  component: string;
}> {
  return [
    {
      path: '/brokers/:seoSlug',
      component: 'brokers/[seoSlug]/index'
    },
    {
      path: '/best-brokers/:category',
      component: 'best-brokers/[category]/index'
    },
    {
      path: '/best-forex-brokers/:country',
      component: 'best-forex-brokers/[country]/index'
    }
  ];
}

/**
 * Get all configured SEO page slugs for validation
 */
export function getConfiguredSEOSlugs(): string[] {
  return allSEOPageConfigs.map(config => {
    if (config.path.startsWith('/brokers/')) {
      return config.path.replace('/brokers/', '');
    }
    if (config.path.startsWith('/best-brokers/')) {
      return config.path.replace('/best-brokers/', '');
    }
    return config.path.replace('/', '');
  }).filter(slug => slug.length > 0);
}