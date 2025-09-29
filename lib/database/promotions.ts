// Database utilities for promotions system
// Provides type-safe database operations for Supabase

import { createClient } from '@supabase/supabase-js';
import type { 
  Promotion, 
  PromotionRate, 
  PromotionFeature, 
  PromotionAnalytics,
  PromotionFilters,
  GetPromotionsRequest,
  GetPromotionsResponse,
  CalculateRebateRequest,
  CalculateRebateResponse,
  CreatePromotionRequest,
  UpdatePromotionRequest,
  PromotionStatsResponse
} from '../../types';

// Database types that match our SQL schema
export interface DatabasePromotion {
  id: string;
  broker_id: number;
  title: string;
  description?: string;
  promotion_type: string;
  is_active: boolean;
  is_featured: boolean;
  is_exclusive: boolean;
  is_popular: boolean;
  start_date: string;
  end_date?: string;
  activation_method: string;
  contact_info?: any;
  requirements: any;
  terms?: string;
  website_url?: string;
  created_at: string;
  updated_at: string;
}

export interface DatabasePromotionRate {
  id: string;
  promotion_id: string;
  tier_name?: string;
  min_volume: number;
  max_volume?: number;
  rate_type: string;
  rate_value: number;
  currency: string;
  frequency: string;
  description?: string;
  display_order: number;
  created_at: string;
}

export interface DatabasePromotionFeature {
  id: string;
  promotion_id: string;
  feature_text: string;
  feature_type: string;
  display_order: number;
  is_highlighted: boolean;
  created_at: string;
}

export interface DatabasePromotionAnalytics {
  id: string;
  promotion_id: string;
  date: string;
  views: number;
  clicks: number;
  conversions: number;
  unique_visitors: number;
  created_at: string;
  updated_at: string;
}

// Transform database types to application types
export const transformDatabasePromotion = (
  dbPromotion: DatabasePromotion & {
    broker?: { name: string; logo_url: string; score: number };
    rates?: DatabasePromotionRate[];
    features?: DatabasePromotionFeature[];
    analytics?: DatabasePromotionAnalytics[];
  }
): Promotion => ({
  id: dbPromotion.id,
  brokerId: dbPromotion.broker_id.toString(),
  broker: dbPromotion.broker ? {
    name: dbPromotion.broker.name,
    logo: dbPromotion.broker.logo_url,
    rating: dbPromotion.broker.score,
    platforms: [] // This would need to be populated from broker data
  } : undefined,
  title: dbPromotion.title,
  description: dbPromotion.description,
  promotionType: dbPromotion.promotion_type as any,
  isActive: dbPromotion.is_active,
  isFeatured: dbPromotion.is_featured,
  isExclusive: dbPromotion.is_exclusive,
  isPopular: dbPromotion.is_popular,
  startDate: dbPromotion.start_date,
  endDate: dbPromotion.end_date,
  activationMethod: dbPromotion.activation_method as any,
  contactInfo: dbPromotion.contact_info,
  requirements: dbPromotion.requirements,
  terms: dbPromotion.terms,
  websiteUrl: dbPromotion.website_url,
  rates: dbPromotion.rates?.map(transformDatabasePromotionRate),
  features: dbPromotion.features?.map(transformDatabasePromotionFeature),
  analytics: dbPromotion.analytics?.map(transformDatabasePromotionAnalytics),
  createdAt: dbPromotion.created_at,
  updatedAt: dbPromotion.updated_at
});

export const transformDatabasePromotionRate = (dbRate: DatabasePromotionRate): PromotionRate => ({
  id: dbRate.id,
  promotionId: dbRate.promotion_id,
  tierName: dbRate.tier_name,
  minVolume: dbRate.min_volume,
  maxVolume: dbRate.max_volume,
  rateType: dbRate.rate_type as any,
  rateValue: dbRate.rate_value,
  currency: dbRate.currency,
  frequency: dbRate.frequency as any,
  description: dbRate.description,
  displayOrder: dbRate.display_order
});

export const transformDatabasePromotionFeature = (dbFeature: DatabasePromotionFeature): PromotionFeature => ({
  id: dbFeature.id,
  promotionId: dbFeature.promotion_id,
  featureText: dbFeature.feature_text,
  featureType: dbFeature.feature_type as any,
  displayOrder: dbFeature.display_order,
  isHighlighted: dbFeature.is_highlighted
});

export const transformDatabasePromotionAnalytics = (dbAnalytics: DatabasePromotionAnalytics): PromotionAnalytics => ({
  id: dbAnalytics.id,
  promotionId: dbAnalytics.promotion_id,
  date: dbAnalytics.date,
  views: dbAnalytics.views,
  clicks: dbAnalytics.clicks,
  conversions: dbAnalytics.conversions,
  uniqueVisitors: dbAnalytics.unique_visitors
});

// Database service class
export class PromotionDatabase {
  constructor(private supabase: ReturnType<typeof createClient>) {}

  // Get promotions with filtering, sorting, and pagination
  async getPromotions(request: GetPromotionsRequest): Promise<GetPromotionsResponse> {
    let query = this.supabase
      .from('active_promotions_with_broker')
      .select('*');

    // Apply filters
    if (request.filters) {
      const { filters } = request;
      
      if (filters.brokers?.length) {
        query = query.in('broker_id', filters.brokers.map(id => parseInt(id)));
      }
      
      if (filters.promotionTypes?.length) {
        query = query.in('promotion_type', filters.promotionTypes);
      }
      
      if (filters.activationMethod?.length) {
        query = query.in('activation_method', filters.activationMethod);
      }
      
      if (filters.rebateRange) {
        // This would require a more complex query joining with rates
        // For now, we'll implement this in the application layer
      }
    }

    // Apply sorting
    if (request.sort) {
      const { field, order } = request.sort;
      query = query.order(field, { ascending: order === 'asc' });
    } else {
      // Default sorting: featured first, then by creation date
      query = query.order('is_featured', { ascending: false })
                   .order('created_at', { ascending: false });
    }

    // Apply pagination
    const page = request.pagination?.page || 1;
    const limit = request.pagination?.limit || 20;
    const offset = (page - 1) * limit;
    
    query = query.range(offset, offset + limit - 1);

    const { data, error, count } = await query;
    
    if (error) {
      throw new Error(`Failed to fetch promotions: ${error.message}`);
    }

    // Get total count for pagination
    const { count: totalCount } = await this.supabase
      .from('promotions')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    const promotions = (data || []).map(transformDatabasePromotion);
    
    return {
      promotions,
      totalCount: totalCount || 0,
      hasMore: (offset + limit) < (totalCount || 0),
      filters: await this.getAvailableFilters()
    };
  }

  // Get a single promotion with all details
  async getPromotionById(id: string): Promise<Promotion | null> {
    const { data, error } = await this.supabase
      .from('promotion_details')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null; // Not found
      throw new Error(`Failed to fetch promotion: ${error.message}`);
    }

    return transformDatabasePromotion(data);
  }

  // Calculate rebate for given promotion and volume
  async calculateRebate(request: CalculateRebateRequest): Promise<CalculateRebateResponse> {
    const { data, error } = await this.supabase
      .rpc('calculate_promotion_rebate', {
        promotion_uuid: request.promotionId,
        trading_volume: request.monthlyVolume
      });

    if (error) {
      throw new Error(`Failed to calculate rebate: ${error.message}`);
    }

    const result = data || {};
    
    // Calculate additional metrics
    const dailyRebate = result.rebate_amount / 30; // Approximate daily
    const yearlyRebate = result.rebate_amount * 12; // If monthly frequency
    
    return {
      result: {
        rebateAmount: result.rebate_amount || 0,
        rateValue: result.rate_value || 0,
        rateType: result.rate_type || 'fixed_amount',
        tierName: result.tier_name,
        currency: result.currency || 'USD',
        frequency: result.frequency || 'monthly',
        dailyRebate,
        monthlyRebate: result.rebate_amount || 0,
        yearlyRebate
      }
    };
  }

  // Create a new promotion (admin only)
  async createPromotion(request: CreatePromotionRequest): Promise<Promotion> {
    const { data: promotionData, error: promotionError } = await this.supabase
      .from('promotions')
      .insert({
        broker_id: parseInt(request.brokerId),
        title: request.title,
        description: request.description,
        promotion_type: request.promotionType,
        activation_method: request.activationMethod,
        contact_info: request.contactInfo,
        requirements: request.requirements,
        start_date: request.startDate,
        end_date: request.endDate,
        is_featured: request.isFeatured || false,
        is_exclusive: request.isExclusive || false,
        is_popular: request.isPopular || false,
        terms: request.terms,
        website_url: request.websiteUrl
      })
      .select()
      .single();

    if (promotionError) {
      throw new Error(`Failed to create promotion: ${promotionError.message}`);
    }

    const promotionId = promotionData.id;

    // Insert rates
    if (request.rates.length > 0) {
      const { error: ratesError } = await this.supabase
        .from('promotion_rates')
        .insert(
          request.rates.map(rate => ({
            promotion_id: promotionId,
            tier_name: rate.tierName,
            min_volume: rate.minVolume,
            max_volume: rate.maxVolume,
            rate_type: rate.rateType,
            rate_value: rate.rateValue,
            currency: rate.currency,
            frequency: rate.frequency,
            description: rate.description,
            display_order: rate.displayOrder
          }))
        );

      if (ratesError) {
        throw new Error(`Failed to create promotion rates: ${ratesError.message}`);
      }
    }

    // Insert features
    if (request.features.length > 0) {
      const { error: featuresError } = await this.supabase
        .from('promotion_features')
        .insert(
          request.features.map(feature => ({
            promotion_id: promotionId,
            feature_text: feature.featureText,
            feature_type: feature.featureType,
            display_order: feature.displayOrder,
            is_highlighted: feature.isHighlighted
          }))
        );

      if (featuresError) {
        throw new Error(`Failed to create promotion features: ${featuresError.message}`);
      }
    }

    // Return the created promotion with all details
    const createdPromotion = await this.getPromotionById(promotionId);
    if (!createdPromotion) {
      throw new Error('Failed to retrieve created promotion');
    }

    return createdPromotion;
  }

  // Update promotion analytics (track views, clicks, conversions)
  async updatePromotionAnalytics(
    promotionId: string, 
    type: 'view' | 'click' | 'conversion',
    date: string = new Date().toISOString().split('T')[0]
  ): Promise<void> {
    const updateField = type === 'view' ? 'views' : 
                       type === 'click' ? 'clicks' : 'conversions';

    const { error } = await this.supabase
      .rpc('increment_promotion_analytics', {
        promotion_uuid: promotionId,
        analytics_date: date,
        field_name: updateField
      });

    if (error) {
      console.error(`Failed to update promotion analytics: ${error.message}`);
      // Don't throw error for analytics - it shouldn't break the main flow
    }
  }

  // Get promotion statistics
  async getPromotionStats(promotionId: string): Promise<PromotionStatsResponse> {
    const { data, error } = await this.supabase
      .rpc('get_promotion_stats', { promotion_uuid: promotionId });

    if (error) {
      throw new Error(`Failed to get promotion stats: ${error.message}`);
    }

    const stats = data || {};
    
    return {
      promotionId,
      totalViews: stats.total_views || 0,
      totalClicks: stats.total_clicks || 0,
      totalConversions: stats.total_conversions || 0,
      conversionRate: stats.conversion_rate || 0,
      clickThroughRate: stats.click_through_rate || 0,
      daysActive: stats.days_active || 0
    };
  }

  // Get available filter options
  private async getAvailableFilters() {
    // This would be implemented to return available filter options
    // For now, return empty structure
    return {
      brokers: [],
      promotionTypes: [],
      activationMethods: [],
      rebateRanges: []
    };
  }

  // Deactivate expired promotions (maintenance function)
  async deactivateExpiredPromotions(): Promise<number> {
    const { data, error } = await this.supabase
      .rpc('deactivate_expired_promotions');

    if (error) {
      throw new Error(`Failed to deactivate expired promotions: ${error.message}`);
    }

    return data || 0;
  }
}

// Helper function to create database instance
export const createPromotionDatabase = (supabaseUrl: string, supabaseKey: string) => {
  const supabase = createClient(supabaseUrl, supabaseKey);
  return new PromotionDatabase(supabase);
};

// Export default instance (will be configured with environment variables)
export const promotionDb = new PromotionDatabase(
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  )
);