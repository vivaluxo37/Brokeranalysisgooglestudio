/**
 * GET /api/promotions/[id] - Get individual promotion details
 * Handles fetching detailed information for a specific promotion
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from '../middleware/cors';
import { checkRateLimit, createRateLimitResponse } from '../middleware/rateLimit';
import type { Promotion, ApiError } from '../../types';
import { PromotionServiceFactory } from '../../services/promotionServiceFactory';

const createErrorResponse = (
  res: VercelResponse,
  code: string, 
  message: string, 
  status: number = 400, 
  details?: any
) => {
  const error: ApiError = {
    code,
    message,
    details,
    timestamp: new Date().toISOString()
  };

  return res.status(status).json({ error });
};

const validatePromotionId = (id: any): string => {
  if (!id || typeof id !== 'string') {
    throw new Error('Invalid promotion ID');
  }

  // Basic UUID validation (adjust based on your ID format)
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    throw new Error('Invalid promotion ID format');
  }

  return id;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Handle CORS
  const corsResult = cors(req);
  Object.entries(corsResult.headers).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET requests
  if (req.method !== 'GET') {
    return createErrorResponse(res, 'METHOD_NOT_ALLOWED', 'Method not allowed', 405);
  }

  try {
    // Rate limiting
    const rateLimitResult = await checkRateLimit(req, 'general');
    if (!rateLimitResult.success) {
      const rateLimitResponse = createRateLimitResponse(rateLimitResult.remainingPoints, rateLimitResult.msBeforeNext);
      return res.status(rateLimitResponse.status).set(rateLimitResponse.headers).json(JSON.parse(rateLimitResponse.body));
    }

    // Validate promotion ID
    const promotionId = validatePromotionId(req.query.id);

    // Get promotion service
    const promotionService = PromotionServiceFactory.create();

    // Fetch promotion
    const promotion: Promotion | null = await promotionService.getPromotionById(promotionId);

    if (!promotion) {
      return createErrorResponse(res, 'PROMOTION_NOT_FOUND', 'Promotion not found', 404);
    }

    // Check if promotion is active
    if (!promotion.isActive) {
      return createErrorResponse(res, 'PROMOTION_INACTIVE', 'Promotion is no longer active', 410);
    }

    // Check if promotion has expired
    if (promotion.endDate && new Date(promotion.endDate) < new Date()) {
      return createErrorResponse(res, 'PROMOTION_EXPIRED', 'Promotion has expired', 410);
    }

    // Track promotion view (fire and forget - don't wait for completion)
    promotionService.trackPromotionEvent(promotionId, 'view', {
      userAgent: req.headers['user-agent'],
      referer: req.headers.referer,
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown'
    }).catch(error => {
      console.warn('Failed to track promotion view:', error);
    });

    // Set cache headers
    res.setHeader('Cache-Control', 'public, max-age=600, s-maxage=1200'); // 10 min client, 20 min CDN

    return res.status(200).json(promotion);

  } catch (error) {
    console.error('Error in GET /api/promotions/[id]:', error);

    if (error instanceof Error) {
      if (error.message.includes('Invalid')) {
        return createErrorResponse(res, 'VALIDATION_ERROR', error.message, 400);
      }
      if (error.message.includes('not found')) {
        return createErrorResponse(res, 'PROMOTION_NOT_FOUND', error.message, 404);
      }
    }

    return createErrorResponse(
      res,
      'INTERNAL_SERVER_ERROR', 
      'An unexpected error occurred', 
      500,
      process.env.NODE_ENV === 'development' ? error : undefined
    );
  }
}