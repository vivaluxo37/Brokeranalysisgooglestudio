/**
 * GET /api/promotions - Get promotions with filtering and pagination
 * Handles promotion listing with comprehensive filtering, sorting, and pagination
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from '../middleware/cors';
import { checkRateLimit, createRateLimitResponse } from '../middleware/rateLimit';
import type { 
  GetPromotionsRequest, 
  GetPromotionsResponse, 
  ApiError,
  PromotionType,
  ActivationMethod 
} from '../../types';
import { PromotionServiceFactory } from '../../services/promotionServiceFactory';

// Input validation schema
const validateGetPromotionsRequest = (query: any): GetPromotionsRequest => {
  const request: GetPromotionsRequest = {};

  // Parse filters
  if (query.brokerIds) {
    const brokerIds = Array.isArray(query.brokerIds) ? query.brokerIds : [query.brokerIds];
    request.filters = { ...request.filters, brokerIds };
  }

  if (query.promotionTypes) {
    const types = Array.isArray(query.promotionTypes) ? query.promotionTypes : [query.promotionTypes];
    const validTypes: PromotionType[] = [
      'cashback', 'deposit_bonus', 'commission_discount', 'copy_trading', 
      'vip_program', 'platform_bonus', 'welcome_bonus', 'no_deposit_bonus',
      'loyalty_program', 'trading_competition'
    ];
    const promotionTypes = types.filter(type => validTypes.includes(type as PromotionType)) as PromotionType[];
    if (promotionTypes.length > 0) {
      request.filters = { ...request.filters, promotionTypes };
    }
  }

  if (query.activationMethod) {
    const methods = Array.isArray(query.activationMethod) ? query.activationMethod : [query.activationMethod];
    const validMethods: ActivationMethod[] = ['automatic', 'manual', 'contact_required'];
    const activationMethod = methods.filter(method => validMethods.includes(method as ActivationMethod)) as ActivationMethod[];
    if (activationMethod.length > 0) {
      request.filters = { ...request.filters, activationMethod };
    }
  }

  if (query.accountTypes) {
    const accountTypes = Array.isArray(query.accountTypes) ? query.accountTypes : [query.accountTypes];
    request.filters = { ...request.filters, accountTypes };
  }

  if (query.isActive !== undefined) {
    request.filters = { ...request.filters, isActive: query.isActive === 'true' };
  }

  if (query.isFeatured !== undefined) {
    request.filters = { ...request.filters, isFeatured: query.isFeatured === 'true' };
  }

  if (query.minRebate !== undefined) {
    const minRebate = parseFloat(query.minRebate);
    if (!isNaN(minRebate) && minRebate >= 0) {
      request.filters = { ...request.filters, minRebate };
    }
  }

  if (query.maxRebate !== undefined) {
    const maxRebate = parseFloat(query.maxRebate);
    if (!isNaN(maxRebate) && maxRebate >= 0) {
      request.filters = { ...request.filters, maxRebate };
    }
  }

  // Parse sorting
  if (query.sortBy) {
    const validSortFields = ['rating', 'rebate_amount', 'popularity', 'newest', 'created_at', 'updated_at'];
    if (validSortFields.includes(query.sortBy)) {
      request.sort = {
        field: query.sortBy,
        order: query.sortOrder === 'asc' ? 'asc' : 'desc'
      };
    }
  }

  // Parse pagination
  const page = parseInt(query.page) || 1;
  const limit = Math.min(parseInt(query.limit) || 20, 100); // Max 100 items per page

  if (page > 0 && limit > 0) {
    request.pagination = { page, limit };
  }

  return request;
};

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

    // Validate and parse request
    const request = validateGetPromotionsRequest(req.query);

    // Get promotion service
    const promotionService = PromotionServiceFactory.create();

    // Fetch promotions
    const response: GetPromotionsResponse = await promotionService.getPromotions(request);

    // Set cache headers for better performance
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=600'); // 5 min client, 10 min CDN

    return res.status(200).json(response);

  } catch (error) {
    console.error('Error in GET /api/promotions:', error);

    if (error instanceof Error) {
      if (error.message.includes('Invalid')) {
        return createErrorResponse(res, 'VALIDATION_ERROR', error.message, 400);
      }
      if (error.message.includes('not found')) {
        return createErrorResponse(res, 'NOT_FOUND', error.message, 404);
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