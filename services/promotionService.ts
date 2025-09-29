/**
 * PromotionService - Core service for managing promotion data operations
 * Provides CRUD operations and business logic for promotions
 */

import type { 
  Promotion, 
  CreatePromotionRequest, 
  UpdatePromotionRequest,
  GetPromotionsRequest,
  GetPromotionsResponse,
  PromotionStatsResponse,
  PromotionFilters
} from '../types';
import { PromotionRepository } from './promotionRepository';
import { CalculationService } from './calculationService';

export class PromotionService {
  constructor(
    private promotionRepository: PromotionRepository,
    private calculationService: CalculationService
  ) {}

  /**
   * Get promotions with filtering, sorting, and pagination
   */
  async getPromotions(request: GetPromotionsRequest): Promise<GetPromotionsResponse> {
    try {
      // Validate request parameters
      this.validateGetPromotionsRequest(request);
      
      // Apply default values
      const normalizedRequest = this.normalizeGetPromotionsRequest(request);
      
      // Fetch promotions from repository
      const result = await this.promotionRepository.findPromotions(normalizedRequest);
      
      // Enrich promotions with calculated data if needed
      const enrichedPromotions = await this.enrichPromotions(result.promotions);
      
      return {
        ...result,
        promotions: enrichedPromotions
      };
    } catch (error) {
      throw new Error(`Failed to get promotions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get a single promotion by ID
   */
  async getPromotionById(id: string): Promise<Promotion | null> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid promotion ID');
      }

      const promotion = await this.promotionRepository.findById(id);
      
      if (!promotion) {
        return null;
      }

      // Enrich with calculated data
      const enrichedPromotions = await this.enrichPromotions([promotion]);
      return enrichedPromotions[0];
    } catch (error) {
      throw new Error(`Failed to get promotion: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get active promotions for a specific broker
   */
  async getPromotionsByBrokerId(brokerId: string): Promise<Promotion[]> {
    try {
      if (!brokerId || typeof brokerId !== 'string') {
        throw new Error('Invalid broker ID');
      }

      const promotions = await this.promotionRepository.findByBrokerId(brokerId, true);
      return this.enrichPromotions(promotions);
    } catch (error) {
      throw new Error(`Failed to get broker promotions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get featured promotions
   */
  async getFeaturedPromotions(limit: number = 10): Promise<Promotion[]> {
    try {
      if (limit <= 0 || limit > 100) {
        throw new Error('Invalid limit: must be between 1 and 100');
      }

      const promotions = await this.promotionRepository.findFeatured(limit);
      return this.enrichPromotions(promotions);
    } catch (error) {
      throw new Error(`Failed to get featured promotions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new promotion (admin only)
   */
  async createPromotion(request: CreatePromotionRequest): Promise<Promotion> {
    try {
      // Validate request
      this.validateCreatePromotionRequest(request);
      
      // Check if broker exists
      await this.validateBrokerExists(request.brokerId);
      
      // Create promotion
      const promotion = await this.promotionRepository.create(request);
      
      // Enrich and return
      const enrichedPromotions = await this.enrichPromotions([promotion]);
      return enrichedPromotions[0];
    } catch (error) {
      throw new Error(`Failed to create promotion: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Update an existing promotion (admin only)
   */
  async updatePromotion(request: UpdatePromotionRequest): Promise<Promotion> {
    try {
      // Validate request
      this.validateUpdatePromotionRequest(request);
      
      // Check if promotion exists
      const existingPromotion = await this.promotionRepository.findById(request.id);
      if (!existingPromotion) {
        throw new Error('Promotion not found');
      }
      
      // Update promotion
      const promotion = await this.promotionRepository.update(request);
      
      // Enrich and return
      const enrichedPromotions = await this.enrichPromotions([promotion]);
      return enrichedPromotions[0];
    } catch (error) {
      throw new Error(`Failed to update promotion: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Deactivate a promotion (admin only)
   */
  async deactivatePromotion(id: string): Promise<void> {
    try {
      if (!id || typeof id !== 'string') {
        throw new Error('Invalid promotion ID');
      }

      const existingPromotion = await this.promotionRepository.findById(id);
      if (!existingPromotion) {
        throw new Error('Promotion not found');
      }

      await this.promotionRepository.deactivate(id);
    } catch (error) {
      throw new Error(`Failed to deactivate promotion: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Track promotion analytics (views, clicks, conversions)
   */
  async trackPromotionEvent(
    promotionId: string, 
    eventType: 'view' | 'click' | 'conversion',
    metadata?: Record<string, any>
  ): Promise<void> {
    try {
      if (!promotionId || typeof promotionId !== 'string') {
        throw new Error('Invalid promotion ID');
      }

      if (!['view', 'click', 'conversion'].includes(eventType)) {
        throw new Error('Invalid event type');
      }

      await this.promotionRepository.trackEvent(promotionId, eventType, metadata);
    } catch (error) {
      // Don't throw for analytics errors - log and continue
      console.error(`Failed to track promotion event: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get promotion statistics
   */
  async getPromotionStats(promotionId: string): Promise<PromotionStatsResponse> {
    try {
      if (!promotionId || typeof promotionId !== 'string') {
        throw new Error('Invalid promotion ID');
      }

      return await this.promotionRepository.getStats(promotionId);
    } catch (error) {
      throw new Error(`Failed to get promotion stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get available filter options
   */
  async getAvailableFilters(): Promise<any> {
    try {
      return await this.promotionRepository.getAvailableFilters();
    } catch (error) {
      throw new Error(`Failed to get available filters: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Deactivate expired promotions (maintenance function)
   */
  async deactivateExpiredPromotions(): Promise<number> {
    try {
      return await this.promotionRepository.deactivateExpired();
    } catch (error) {
      throw new Error(`Failed to deactivate expired promotions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Private helper methods

  private validateGetPromotionsRequest(request: GetPromotionsRequest): void {
    if (request.pagination) {
      const { page, limit } = request.pagination;
      if (page !== undefined && (page < 1 || !Number.isInteger(page))) {
        throw new Error('Invalid page number: must be a positive integer');
      }
      if (limit !== undefined && (limit < 1 || limit > 100 || !Number.isInteger(limit))) {
        throw new Error('Invalid limit: must be between 1 and 100');
      }
    }

    if (request.sort) {
      const validSortFields = ['rating', 'rebate_amount', 'popularity', 'newest', 'created_at', 'updated_at'];
      if (!validSortFields.includes(request.sort.field)) {
        throw new Error(`Invalid sort field: ${request.sort.field}`);
      }
      if (!['asc', 'desc'].includes(request.sort.order)) {
        throw new Error(`Invalid sort order: ${request.sort.order}`);
      }
    }
  }

  private normalizeGetPromotionsRequest(request: GetPromotionsRequest): GetPromotionsRequest {
    return {
      ...request,
      pagination: {
        page: request.pagination?.page || 1,
        limit: request.pagination?.limit || 20
      },
      sort: request.sort || {
        field: 'created_at',
        order: 'desc'
      }
    };
  }

  private validateCreatePromotionRequest(request: CreatePromotionRequest): void {
    if (!request.brokerId || typeof request.brokerId !== 'string') {
      throw new Error('Invalid broker ID');
    }
    if (!request.title || typeof request.title !== 'string' || request.title.trim().length === 0) {
      throw new Error('Title is required');
    }
    if (!request.promotionType) {
      throw new Error('Promotion type is required');
    }
    if (!request.activationMethod) {
      throw new Error('Activation method is required');
    }
    if (!request.startDate) {
      throw new Error('Start date is required');
    }
    if (request.endDate && new Date(request.endDate) <= new Date(request.startDate)) {
      throw new Error('End date must be after start date');
    }
    if (!request.rates || request.rates.length === 0) {
      throw new Error('At least one rate is required');
    }
    
    // Validate rates
    request.rates.forEach((rate, index) => {
      if (rate.minVolume < 0) {
        throw new Error(`Rate ${index + 1}: minimum volume cannot be negative`);
      }
      if (rate.maxVolume !== undefined && rate.maxVolume <= rate.minVolume) {
        throw new Error(`Rate ${index + 1}: maximum volume must be greater than minimum volume`);
      }
      if (rate.rateValue <= 0) {
        throw new Error(`Rate ${index + 1}: rate value must be positive`);
      }
    });
  }

  private validateUpdatePromotionRequest(request: UpdatePromotionRequest): void {
    if (!request.id || typeof request.id !== 'string') {
      throw new Error('Invalid promotion ID');
    }
    
    // Apply same validations as create, but only for provided fields
    if (request.title !== undefined) {
      if (typeof request.title !== 'string' || request.title.trim().length === 0) {
        throw new Error('Title cannot be empty');
      }
    }
    
    if (request.startDate && request.endDate) {
      if (new Date(request.endDate) <= new Date(request.startDate)) {
        throw new Error('End date must be after start date');
      }
    }
    
    if (request.rates) {
      request.rates.forEach((rate, index) => {
        if (rate.minVolume < 0) {
          throw new Error(`Rate ${index + 1}: minimum volume cannot be negative`);
        }
        if (rate.maxVolume !== undefined && rate.maxVolume <= rate.minVolume) {
          throw new Error(`Rate ${index + 1}: maximum volume must be greater than minimum volume`);
        }
        if (rate.rateValue <= 0) {
          throw new Error(`Rate ${index + 1}: rate value must be positive`);
        }
      });
    }
  }

  private async validateBrokerExists(brokerId: string): Promise<void> {
    // This would typically check if the broker exists in the database
    // For now, we'll assume it's valid if it's a non-empty string
    if (!brokerId || typeof brokerId !== 'string') {
      throw new Error('Invalid broker ID');
    }
  }

  private async enrichPromotions(promotions: Promotion[]): Promise<Promotion[]> {
    // This method can be used to add calculated fields, 
    // fetch related data, or perform other enrichment operations
    return promotions.map(promotion => ({
      ...promotion,
      // Add any calculated or enriched fields here
    }));
  }
}