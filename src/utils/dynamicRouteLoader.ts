import { lazy } from 'react'

import { lazyWithRetry } from '../lib/performance/lazyWithRetry'

/**
 * Dynamic route loader for optimal code splitting
 * Loads routes only when they are actually needed
 */

// Cache for loaded components
const componentCache = new Map<string, React.ComponentType<any>>()

/**
 * Load a component dynamically with caching
 */
export function loadComponent(componentPath: string, componentName: string): React.ComponentType<any> {
  const cacheKey = `${componentPath}:${componentName}`

  // Return cached component if available
  if (componentCache.has(cacheKey)) {
    return componentCache.get(cacheKey)!
  }

  // Create and cache the lazy component
  const LazyComponent = lazyWithRetry(
    () => import(/* @vite-ignore */ componentPath).then(module => ({
      default: module[componentName],
    })),
    componentName,
  )

  componentCache.set(cacheKey, LazyComponent)
  return LazyComponent
}

/**
 * Predefined route loaders for better type safety
 */
export const routeLoaders = {
  // Main pages
  home: () => loadComponent('../pages/HomePage', 'HomePage'),
  allBrokers: () => loadComponent('../pages/AllBrokersPage', 'AllBrokersPage'),
  brokerDetail: () => loadComponent('../pages/BrokerDetailPage', 'BrokerDetailPage'),
  compare: () => loadComponent('../pages/ComparePage', 'ComparePage'),
  blog: () => loadComponent('../pages/BlogPage', 'BlogPage'),
  blogPost: () => loadComponent('../pages/BlogPostPage', 'BlogPostPage'),

  // Education pages
  educationHub: () => loadComponent('../pages/EducationHubPage', 'EducationHubPage'),
  quizzes: () => loadComponent('../pages/QuizzesPage', 'QuizzesPage'),

  // Tools pages
  economicCalendar: () => loadComponent('../pages/EconomicCalendarPage', 'EconomicCalendarPage'),
  marketData: () => loadComponent('../pages/MarketDataPage', 'MarketDataPage'),
  calculators: () => loadComponent('../pages/CalculatorsPage', 'CalculatorsPage'),

  // Admin pages
  adminLogin: () => loadComponent('../pages/admin/AdminLogin', 'AdminLogin'),
  adminDashboard: () => loadComponent('../pages/admin/AdminDashboard', 'AdminDashboard'),

  // Best brokers pages
  bestBrokers: () => loadComponent('../pages/BestBrokersPage', 'BestBrokersPage'),
  bestBrokersCategory: () => loadComponent('../pages/BestBrokersCategoryPage', 'BestBrokersCategoryPage'),
  bestBrokersCountry: () => loadComponent('../pages/CountryPage', 'CountryPage'),
} as const

/**
 * Type for route loader keys
 */
export type RouteKey = keyof typeof routeLoaders;

/**
 * Get a lazy component for a route
 */
export function getLazyRoute(routeKey: RouteKey): React.ComponentType<any> {
  return routeLoaders[routeKey]()
}

/**
 * Preload a route for better performance
 */
export async function preloadRoute(routeKey: RouteKey): Promise<void> {
  try {
    // Dynamically import the module to trigger chunk loading
    const componentPath = getComponentPath(routeKey)
    const componentName = getComponentName(routeKey)

    await import(/* @vite-ignore */ componentPath)
    console.log(`[RouteLoader] Preloaded route: ${routeKey}`)
  } catch (error) {
    console.warn(`[RouteLoader] Failed to preload route: ${routeKey}`, error)
  }
}

/**
 * Get component path for a route key
 */
function getComponentPath(routeKey: RouteKey): string {
  const pathMap: Record<RouteKey, string> = {
    home: '../pages/HomePage',
    allBrokers: '../pages/AllBrokersPage',
    brokerDetail: '../pages/BrokerDetailPage',
    compare: '../pages/ComparePage',
    blog: '../pages/BlogPage',
    blogPost: '../pages/BlogPostPage',
    educationHub: '../pages/EducationHubPage',
    quizzes: '../pages/QuizzesPage',
    economicCalendar: '../pages/EconomicCalendarPage',
    marketData: '../pages/MarketDataPage',
    calculators: '../pages/CalculatorsPage',
    adminLogin: '../pages/admin/AdminLogin',
    adminDashboard: '../pages/admin/AdminDashboard',
    bestBrokers: '../pages/BestBrokersPage',
    bestBrokersCategory: '../pages/BestBrokersCategoryPage',
    bestBrokersCountry: '../pages/CountryPage',
  }

  return pathMap[routeKey]
}

/**
 * Get component name for a route key
 */
function getComponentName(routeKey: RouteKey): string {
  const nameMap: Record<RouteKey, string> = {
    home: 'HomePage',
    allBrokers: 'AllBrokersPage',
    brokerDetail: 'BrokerDetailPage',
    compare: 'ComparePage',
    blog: 'BlogPage',
    blogPost: 'BlogPostPage',
    educationHub: 'EducationHubPage',
    quizzes: 'QuizzesPage',
    economicCalendar: 'EconomicCalendarPage',
    marketData: 'MarketDataPage',
    calculators: 'CalculatorsPage',
    adminLogin: 'AdminLogin',
    adminDashboard: 'AdminDashboard',
    bestBrokers: 'BestBrokersPage',
    bestBrokersCategory: 'BestBrokersCategoryPage',
    bestBrokersCountry: 'CountryPage',
  }

  return nameMap[routeKey]
}

/**
 * Preload critical routes on hover or before navigation
 */
export function setupRoutePreloading(): void {
  if (typeof window === 'undefined') {return}

  // Preload home page immediately
  preloadRoute('home')

  // Preload other critical routes on idle
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      preloadRoute('allBrokers')
      preloadRoute('compare')
    })
  } else {
    setTimeout(() => {
      preloadRoute('allBrokers')
      preloadRoute('compare')
    }, 2000)
  }
}
