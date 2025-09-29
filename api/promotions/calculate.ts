/**
 * POST /api/promotions/calculate - Calculate rebate for a promotion
 * Handles rebate calculations based on trading volume and promotion parameters
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';
import { cors } from '../middleware/cors';
import { checkRateLimit, createRateLimitResponse } from '../middleware/rateLimit';
import type { 
  CalculateRebateRequest, 
  CalculateRebateResponse, 
  ApiError,
  Promotion 
} from '../../types';
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

const validateCalculateRebateRequest = (body: any): CalculateRebateRequest => {
  if (!body || typeof body !== 'object') {
    throw new Error('Request body is required');
  }

  const { promotionId, monthlyVolume, accountType } = body;

  // Validate promotion ID
  if (!promotionId || typeof promotionId !== 'string') {
    throw new Error('Promotion ID is required and must be a string');
  }

  // Basic UUID validation
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(promotionId)) {
    throw new Error('Invalid promotion ID format');
  }

  // Validate monthly volume
  if (monthlyVolume === undefined || monthlyVolume === null) {
    throw new Error('Monthly volume is required');
  }

  const volume = parseFloat(monthlyVolume);
  if (isNaN(volume) || volume < 0) {
    throw new Error('Monthly volume must be a non-negative number');
  }

  if (volume > 1000000) { // Reasonable upper limit
    throw new Error('Monthly volume exceeds maximum allowed value (1,000,000 lots)');
  }

  // Validate account type (optional)
  if (accountType !== undefined && (typeof accountType !== 'string' || accountType.trim().length === 0)) {
    throw new Error('Account type must be a non-empty string if provided');
  }

  return {
    promotionId,
    monthlyVolume: volume,
    accountType: accountType?.trim()
  };
};

const parseRequestBody = async (req: VercelRequest): Promise<any> => {
  return new Promise((resolve, reject) => {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        resolve(parsed);
      } catch (error) {
        reject(new Error('Invalid JSON in request body'));
      }
    });
    
    req.on('error', (error) => {
      reject(error);
    });
  });
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

  // Only allow POST requests
  if (req.method !== 'POST') {
    return createErrorResponse(res, 'METHOD_NOT_ALLOWED', 'Method not allowed', 405);
  }

  try {
    // Rate limiting - use calculator-specific limits
    const rateLimitResult = await checkRateLimit(req, 'calculator');
    if (!rateLimitResult.success) {
      const rateLimitResponse = createRateLimitResponse(rateLimitResult.remainingPoints, rateLimitResult.msBeforeNext);
      return res.status(rateLimitResponse.status).set(rateLimitResponse.headers).json(JSON.parse(rateLimitResponse.body));
    }

    // Parse and validate request body
    const body = await parseRequestBody(req);
    const request = validateCalculateRebateRequest(body);

    // Get services
    const promotionService = PromotionServiceFactory.create();
    const calculationService = PromotionServiceFactory.createCalculationService();

    // Fetch promotion
    const promotion: Promotion | null = await promotionService.getPromotionById(request.promotionId);

    if (!promotion) {
      return createErrorResponse(res, 'PROMOTION_NOT_FOUND', 'Promotion not found', 404);
    }

    // Check if promotion is active
    if (!promotion.isActive) {
      return createErrorResponse(res, 'PROMOTION_INACTIVE', 'Promotion is no longer active', 400);
    }

    // Check if promotion has expired
    if (promotion.endDate && new Date(promotion.endDate) < new Date()) {
      return createErrorResponse(res, 'PROMOTION_EXPIRED', 'Promotion has expired', 400);
    }

    // Check if promotion has rates
    if (!promotion.rates || promotion.rates.length === 0) {
      return createErrorResponse(res, 'NO_RATES_AVAILABLE', 'No rates available for this promotion', 400);
    }

    // Validate account type against promotion requirements
    if (request.accountType && promotion.requirements.accountTypes) {
      const validAccountTypes = promotion.requirements.accountTypes.map(type => type.toLowerCase());
      if (!validAccountTypes.includes(request.accountType.toLowerCase())) {
        return createErrorResponse(
          res,
          'INVALID_ACCOUNT_TYPE', 
          `Account type '${request.accountType}' is not eligible for this promotion. Valid types: ${promotion.requirements.accountTypes.join(', ')}`,
          400
        );
      }
    }

    // Check minimum volume requirement
    if (promotion.requirements.tradingVolume && request.monthlyVolume < promotion.requirements.tradingVolume) {
      return createErrorResponse(
        res,
        'INSUFFICIENT_VOLUME', 
        `Minimum trading volume of ${promotion.requirements.tradingVolume} lots required`,
        400
      );
    }

    // Calculate rebate
    const calculationResult = await calculationService.calculateRebate(
      promotion, 
      request.monthlyVolume, 
      request.accountType
    );

    // Get recommendations for similar promotions (optional enhancement)
    let recommendations: Promotion[] = [];
    try {
      const allPromotions = await promotionService.getPromotions({
        filters: { 
          isActive: true,
          promotionTypes: [promotion.promotionType]
        },
        pagination: { page: 1, limit: 5 }
      });
      
      // Filter out current promotion and get top alternatives
      recommendations = allPromotions.promotions
        .filter(p => p.id !== promotion.id)
        .slice(0, 3);
    } catch (error) {
      console.warn('Failed to fetch recommendations:', error);
      // Continue without recommendations
    }

    const response: CalculateRebateResponse = {
      result: calculationResult,
      recommendations: recommendations.length > 0 ? recommendations : undefined
    };

    // Track calculation event (fire and forget)
    promotionService.trackPromotionEvent(request.promotionId, 'click', {
      action: 'calculate_rebate',
      monthlyVolume: request.monthlyVolume,
      accountType: request.accountType,
      calculatedRebate: calculationResult.rebateAmount,
      userAgent: req.headers['user-agent'],
      ip: req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown'
    }).catch(error => {
      console.warn('Failed to track calculation event:', error);
    });

    // Set cache headers (short cache for dynamic calculations)
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=120'); // 1 min client, 2 min CDN

    return res.status(200).json(response);

  } catch (error) {
    console.error('Error in POST /api/promotions/calculate:', error);

    if (error instanceof Error) {
      if (error.message.includes('Invalid') || error.message.includes('required') || error.message.includes('must be')) {
        return createErrorResponse(res, 'VALIDATION_ERROR', error.message, 400);
      }
      if (error.message.includes('not found')) {
        return createErrorResponse(res, 'PROMOTION_NOT_FOUND', error.message, 404);
      }
      if (error.message.includes('No applicable rate')) {
        return createErrorResponse(res, 'NO_APPLICABLE_RATE', 'No rate tier found for the specified volume', 400);
      }
    }

    return createErrorResponse(
      res,
      'INTERNAL_SERVER_ERROR', 
      'An unexpected error occurred during calculation', 
      500,
      process.env.NODE_ENV === 'development' ? error : undefined
    );
  }
}