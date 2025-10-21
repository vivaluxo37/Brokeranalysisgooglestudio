/**
 * API Endpoint for Broker Summaries
 * 
 * Provides lightweight broker summaries with HTTP caching
 * for optimal performance.
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// Cache configuration
const CACHE_MAX_AGE = 5 * 60; // 5 minutes
const CACHE_STALE_WHILE_REVALIDATE = 60 * 60; // 1 hour

export default async function handler(req: any, res: any) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if client has a cached version
    const ifNoneMatch = req.headers['if-none-match'];
    const ifModifiedSince = req.headers['if-modified-since'];

    // Get file stats for ETag and Last-Modified
    const summariesPath = join(process.cwd(), 'data/generated/brokerSummaries.json');
    
    if (!existsSync(summariesPath)) {
      console.error('Broker summaries file not found:', summariesPath);
      return res.status(404).json({ error: 'Broker summaries not available' });
    }

    const fileStats = readFileSync(summariesPath, 'utf8');

    // Generate ETag based on file content hash
    const crypto = require('crypto');
    const etag = `"${crypto.createHash('md5').update(fileStats).digest('hex')}"`;

    // Check if client's cache is still valid
    if (ifNoneMatch === etag) {
      res.setHeader('ETag', etag);
      return res.status(304).end();
    }

    // Parse the JSON data
    const summaries = JSON.parse(fileStats);

    // Set caching headers
    res.setHeader('ETag', etag);
    res.setHeader('Cache-Control', 
      `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`
    );
    res.setHeader('Last-Modified', new Date().toUTCString());
    res.setHeader('Vary', 'Accept-Encoding');

    // Add CORS headers for broader compatibility
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Return the response
    return res.status(200).json({
      data: summaries,
      meta: {
        count: summaries.length,
        generated: new Date().toISOString(),
        cache: {
          maxAge: CACHE_MAX_AGE,
          staleWhileRevalidate: CACHE_STALE_WHILE_REVALIDATE
        }
      }
    });

  } catch (error) {
    console.error('Error serving broker summaries:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

// For direct usage with Node.js HTTP server
export async function brokerSummariesAPI(req: any, res: any) {
  return handler(req, res);
}