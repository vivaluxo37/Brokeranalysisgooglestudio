/**
 * API Route for Broker Summaries
 * 
 * Provides lightweight broker summaries with HTTP caching
 * for optimal performance.
 */

import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import { join } from 'path';

// Cache configuration
const CACHE_MAX_AGE = 5 * 60; // 5 minutes
const CACHE_STALE_WHILE_REVALIDATE = 60 * 60; // 1 hour

export async function GET(request: NextRequest) {
  try {
    // Check if client has a cached version
    const ifNoneMatch = request.headers.get('if-none-match');
    const ifModifiedSince = request.headers.get('if-modified-since');

    // Get file stats for ETag and Last-Modified
    const summariesPath = join(process.cwd(), 'data/generated/brokerSummaries.json');
    let fileStats;
    
    try {
      fileStats = readFileSync(summariesPath, 'utf8');
    } catch (error) {
      console.error('Broker summaries file not found:', error);
      return NextResponse.json(
        { error: 'Broker summaries not available' },
        { status: 404 }
      );
    }

    // Generate ETag based on file content hash
    const crypto = require('crypto');
    const etag = `"${crypto.createHash('md5').update(fileStats).digest('hex')}"`;

    // Check if client's cache is still valid
    if (ifNoneMatch === etag) {
      return new NextResponse(null, { status: 304 });
    }

    // Parse the JSON data
    const summaries = JSON.parse(fileStats);

    // Create response with caching headers
    const response = NextResponse.json({
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

    // Set caching headers
    response.headers.set('ETag', etag);
    response.headers.set('Cache-Control', 
      `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_STALE_WHILE_REVALIDATE}`
    );
    response.headers.set('Last-Modified', new Date().toUTCString());
    response.headers.set('Vary', 'Accept-Encoding');

    // Add CORS headers for broader compatibility
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');

    return response;

  } catch (error) {
    console.error('Error serving broker summaries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS() {
  const response = new NextResponse(null, { status: 200 });
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, If-None-Match, If-Modified-Since');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
  return response;
}