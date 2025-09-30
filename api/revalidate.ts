import { getCacheManager } from '../lib/cache';

// API handler for cache revalidation
export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Basic authentication check
  const authToken = req.headers.authorization?.replace('Bearer ', '');
  const validToken = process.env.CACHE_REVALIDATE_TOKEN || 'dev-token';
  
  if (authToken !== validToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { action, keys, tags, pattern } = req.body;

  try {
    const cache = getCacheManager();

    switch (action) {
      case 'invalidate':
        // Invalidate specific keys
        if (keys && Array.isArray(keys)) {
          let invalidatedCount = 0;
          keys.forEach((key: string) => {
            if (cache.invalidate(key)) {
              invalidatedCount++;
            }
          });
          
          return res.status(200).json({
            success: true,
            message: `Invalidated ${invalidatedCount} cache entries`,
            invalidated: keys
          });
        }
        
        return res.status(400).json({ error: 'Keys array required for invalidate action' });

      case 'invalidateByTag':
        // Invalidate by tags
        if (tags && Array.isArray(tags)) {
          tags.forEach((tag: string) => {
            cache.invalidateByTag(tag);
          });
          
          return res.status(200).json({
            success: true,
            message: `Invalidated cache entries for tags: ${tags.join(', ')}`,
            tags
          });
        }
        
        return res.status(400).json({ error: 'Tags array required for invalidateByTag action' });

      case 'clear':
        // Clear all cache
        cache.clear();
        
        return res.status(200).json({
          success: true,
          message: 'All cache entries cleared'
        });

      case 'stats':
        // Get cache statistics
        const stats = cache.getStats();
        
        return res.status(200).json({
          success: true,
          stats
        });

      case 'warmup':
        // Warm up cache with common data
        await warmupCache();
        
        return res.status(200).json({
          success: true,
          message: 'Cache warmed up with common data'
        });

      default:
        return res.status(400).json({ 
          error: 'Invalid action. Supported actions: invalidate, invalidateByTag, clear, stats, warmup' 
        });
    }

  } catch (error) {
    console.error('Cache revalidation error:', error);
    return res.status(500).json({
      error: `Cache revalidation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
}

/**
 * Warm up cache with commonly accessed data
 */
async function warmupCache(): Promise<void> {
  const cache = getCacheManager();
  
  try {
    // Import cache functions
    const { getCachedCategories, getCachedCountries, getCachedBrokers } = await import('../lib/cache');
    
    // Preload common data
    await Promise.all([
      getCachedCategories(), // All categories
      getCachedCategories('broker_type'), // Broker type categories
      getCachedCategories('execution'), // Execution categories
      getCachedCategories('features'), // Features categories
      getCachedCountries(), // All countries
      getCachedBrokers(), // All brokers
      getCachedBrokers('ecn-brokers'), // ECN brokers (popular category)
      getCachedBrokers('mt4-brokers'), // MT4 brokers (popular category)
    ]);
    
    console.log('Cache warmed up successfully');
    
  } catch (error) {
    console.error('Cache warmup failed:', error);
    throw error;
  }
}

// Webhook handlers for automatic cache invalidation

/**
 * Handle Supabase webhook for broker data changes
 */
export async function handleBrokerDataWebhook(brokerData: any) {
  const cache = getCacheManager();
  
  // Invalidate broker-related cache
  cache.invalidateByTag('brokers');
  
  // If broker is in specific categories, invalidate those too
  if (brokerData.broker_type) {
    cache.invalidateByTag(brokerData.broker_type);
  }
  
  console.log(`Invalidated cache for broker: ${brokerData.name}`);
}

/**
 * Handle category data changes
 */
export async function handleCategoryDataWebhook(categoryData: any) {
  const cache = getCacheManager();
  
  // Invalidate category-related cache
  cache.invalidateByTag('categories');
  cache.invalidateByTag(categoryData.category_type);
  
  console.log(`Invalidated cache for category: ${categoryData.name}`);
}

/**
 * Handle country data changes
 */
export async function handleCountryDataWebhook(countryData: any) {
  const cache = getCacheManager();
  
  // Invalidate country-related cache
  cache.invalidateByTag('countries');
  cache.invalidateByTag(countryData.slug);
  
  console.log(`Invalidated cache for country: ${countryData.name}`);
}