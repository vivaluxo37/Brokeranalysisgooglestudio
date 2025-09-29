/**
 * PromotionRepository - Data access layer for promotions
 * Handles database operations with filtering, sorting, and pagination
 */

import type { 
  Promotion, 
  CreatePromotionRequest, 
  UpdatePromotionRequest,
  GetPromotionsRequest,
  GetPromotionsResponse,
  PromotionStatsResponse,
  PromotionFilters,
  AvailableFilters
} from '../types';

export interface PromotionRepository {
  findPromotions(request: GetPromotionsRequest): Promise<GetPromotionsResponse>;
  findById(id: string): Promise<Promotion | null>;
  findByBrokerId(brokerId: string, activeOnly?: boolean): Promise<Promotion[]>;
  findFeatured(limit: number): Promise<Promotion[]>;
  create(request: CreatePromotionRequest): Promise<Promotion>;
  update(request: UpdatePromotionRequest): Promise<Promotion>;
  deactivate(id: string): Promise<void>;
  trackEvent(promotionId: string, eventType: 'view' | 'click' | 'conversion', metadata?: Record<string, any>): Promise<void>;
  getStats(promotionId: string): Promise<PromotionStatsResponse>;
  getAvailableFilters(): Promise<AvailableFilters>;
  deactivateExpired(): Promise<number>;
}

/**
 * In-memory implementation for testing and development
 * In production, this would be replaced with a database-backed implementation
 */
export class InMemoryPromotionRepository implements PromotionRepository {
  private promotions: Map<string, Promotion> = new Map();
  private analytics: Map<string, any> = new Map();
  private nextId = 1;

  constructor() {
    // Initialize with some sample data for testing
    this.initializeSampleData();
  }

  async findPromotions(request: GetPromotionsRequest): Promise<GetPromotionsResponse> {
    let promotions = Array.from(this.promotions.values());

    // Apply filters
    if (request.filters) {
      promotions = this.applyFilters(promotions, request.filters);
    }

    // Apply sorting
    if (request.sort) {
      promotions = this.applySorting(promotions, request.sort);
    }

    // Get total count before pagination
    const totalCount = promotions.length;

    // Apply pagination
    const page = request.pagination?.page || 1;
    const limit = request.pagination?.limit || 20;
    const offset = (page - 1) * limit;
    const paginatedPromotions = promotions.slice(offset, offset + limit);

    return {
      promotions: paginatedPromotions,
      totalCount,
      hasMore: (offset + limit) < totalCount,
      filters: await this.getAvailableFilters()
    };
  }

  async findById(id: string): Promise<Promotion | null> {
    return this.promotions.get(id) || null;
  }

  async findByBrokerId(brokerId: string, activeOnly: boolean = true): Promise<Promotion[]> {
    const promotions = Array.from(this.promotions.values());
    return promotions.filter(p => 
      p.brokerId === brokerId && 
      (!activeOnly || p.isActive)
    );
  }

  async findFeatured(limit: number): Promise<Promotion[]> {
    const promotions = Array.from(this.promotions.values());
    return promotions
      .filter(p => p.isFeatured && p.isActive)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  async create(request: CreatePromotionRequest): Promise<Promotion> {
    const id = `promo_${this.nextId++}`;
    const now = new Date().toISOString();
    
    const promotion: Promotion = {
      id,
      brokerId: request.brokerId,
      title: request.title,
      description: request.description,
      promotionType: request.promotionType,
      isActive: true,
      isFeatured: request.isFeatured || false,
      isExclusive: request.isExclusive || false,
      isPopular: request.isPopular || false,
      startDate: request.startDate,
      endDate: request.endDate,
      activationMethod: request.activationMethod,
      contactInfo: request.contactInfo,
      requirements: request.requirements,
      terms: request.terms,
      websiteUrl: request.websiteUrl,
      rates: request.rates.map((rate, index) => ({
        id: `rate_${id}_${index}`,
        promotionId: id,
        ...rate
      })),
      features: request.features.map((feature, index) => ({
        id: `feature_${id}_${index}`,
        promotionId: id,
        ...feature
      })),
      createdAt: now,
      updatedAt: now
    };

    this.promotions.set(id, promotion);
    return promotion;
  }

  async update(request: UpdatePromotionRequest): Promise<Promotion> {
    const existing = this.promotions.get(request.id);
    if (!existing) {
      throw new Error('Promotion not found');
    }

    const updated: Promotion = {
      ...existing,
      ...request,
      updatedAt: new Date().toISOString()
    };

    // Handle rates and features updates
    if (request.rates) {
      updated.rates = request.rates.map((rate, index) => ({
        id: rate.id || `rate_${request.id}_${index}`,
        promotionId: request.id,
        ...rate
      }));
    }

    if (request.features) {
      updated.features = request.features.map((feature, index) => ({
        id: feature.id || `feature_${request.id}_${index}`,
        promotionId: request.id,
        ...feature
      }));
    }

    this.promotions.set(request.id, updated);
    return updated;
  }

  async deactivate(id: string): Promise<void> {
    const promotion = this.promotions.get(id);
    if (!promotion) {
      throw new Error('Promotion not found');
    }

    promotion.isActive = false;
    promotion.updatedAt = new Date().toISOString();
    this.promotions.set(id, promotion);
  }

  async trackEvent(
    promotionId: string, 
    eventType: 'view' | 'click' | 'conversion', 
    metadata?: Record<string, any>
  ): Promise<void> {
    const today = new Date().toISOString().split('T')[0];
    const key = `${promotionId}_${today}`;
    
    if (!this.analytics.has(key)) {
      this.analytics.set(key, {
        promotionId,
        date: today,
        views: 0,
        clicks: 0,
        conversions: 0,
        uniqueVisitors: 0
      });
    }

    const analytics = this.analytics.get(key);
    analytics[eventType === 'view' ? 'views' : eventType === 'click' ? 'clicks' : 'conversions']++;
    
    if (eventType === 'view') {
      analytics.uniqueVisitors++;
    }

    this.analytics.set(key, analytics);
  }

  async getStats(promotionId: string): Promise<PromotionStatsResponse> {
    const analyticsEntries = Array.from(this.analytics.values())
      .filter(entry => entry.promotionId === promotionId);

    const totalViews = analyticsEntries.reduce((sum, entry) => sum + entry.views, 0);
    const totalClicks = analyticsEntries.reduce((sum, entry) => sum + entry.clicks, 0);
    const totalConversions = analyticsEntries.reduce((sum, entry) => sum + entry.conversions, 0);

    const conversionRate = totalViews > 0 ? (totalConversions / totalViews) * 100 : 0;
    const clickThroughRate = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0;

    const promotion = this.promotions.get(promotionId);
    const daysActive = promotion ? 
      Math.ceil((Date.now() - new Date(promotion.startDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;

    return {
      promotionId,
      totalViews,
      totalClicks,
      totalConversions,
      conversionRate,
      clickThroughRate,
      daysActive
    };
  }

  async getAvailableFilters(): Promise<AvailableFilters> {
    const promotions = Array.from(this.promotions.values()).filter(p => p.isActive);
    
    // Get unique brokers
    const brokerMap = new Map<string, { id: string; name: string; count: number }>();
    promotions.forEach(p => {
      if (p.broker) {
        const existing = brokerMap.get(p.brokerId);
        if (existing) {
          existing.count++;
        } else {
          brokerMap.set(p.brokerId, {
            id: p.brokerId,
            name: p.broker.name,
            count: 1
          });
        }
      }
    });

    // Get promotion types
    const typeMap = new Map<string, number>();
    promotions.forEach(p => {
      const existing = typeMap.get(p.promotionType);
      typeMap.set(p.promotionType, (existing || 0) + 1);
    });

    // Get activation methods
    const methodMap = new Map<string, number>();
    promotions.forEach(p => {
      const existing = methodMap.get(p.activationMethod);
      methodMap.set(p.activationMethod, (existing || 0) + 1);
    });

    return {
      brokers: Array.from(brokerMap.values()),
      promotionTypes: Array.from(typeMap.entries()).map(([type, count]) => ({
        type: type as any,
        count
      })),
      activationMethods: Array.from(methodMap.entries()).map(([method, count]) => ({
        method: method as any,
        count
      })),
      rebateRanges: [
        { min: 0, max: 5, count: 0 },
        { min: 5, max: 15, count: 0 },
        { min: 15, max: 50, count: 0 },
        { min: 50, max: 999999, count: 0 }
      ]
    };
  }

  async deactivateExpired(): Promise<number> {
    const now = new Date();
    let count = 0;

    for (const [id, promotion] of this.promotions.entries()) {
      if (promotion.endDate && new Date(promotion.endDate) < now && promotion.isActive) {
        promotion.isActive = false;
        promotion.updatedAt = new Date().toISOString();
        this.promotions.set(id, promotion);
        count++;
      }
    }

    return count;
  }

  // Private helper methods

  private applyFilters(promotions: Promotion[], filters: PromotionFilters): Promotion[] {
    let filtered = promotions;

    if (filters.brokers?.length) {
      filtered = filtered.filter(p => filters.brokers!.includes(p.brokerId));
    }

    if (filters.promotionTypes?.length) {
      filtered = filtered.filter(p => filters.promotionTypes!.includes(p.promotionType));
    }

    if (filters.activationMethod?.length) {
      filtered = filtered.filter(p => filters.activationMethod!.includes(p.activationMethod));
    }

    if (filters.rebateRange) {
      const { min, max } = filters.rebateRange;
      filtered = filtered.filter(p => {
        if (!p.rates || p.rates.length === 0) return false;
        const maxRate = Math.max(...p.rates.map(r => r.rateValue));
        return maxRate >= min && maxRate <= max;
      });
    }

    return filtered;
  }

  private applySorting(promotions: Promotion[], sort: { field: string; order: 'asc' | 'desc' }): Promotion[] {
    return promotions.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sort.field) {
        case 'rating':
          aValue = a.broker?.rating || 0;
          bValue = b.broker?.rating || 0;
          break;
        case 'rebate_amount':
          aValue = a.rates ? Math.max(...a.rates.map(r => r.rateValue)) : 0;
          bValue = b.rates ? Math.max(...b.rates.map(r => r.rateValue)) : 0;
          break;
        case 'popularity':
          aValue = a.isPopular ? 1 : 0;
          bValue = b.isPopular ? 1 : 0;
          break;
        case 'newest':
        case 'created_at':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          aValue = 0;
          bValue = 0;
      }

      if (sort.order === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }

  private initializeSampleData(): void {
    // Add some sample promotions for testing
    const samplePromotions: Promotion[] = [
      {
        id: 'promo_1',
        brokerId: '1',
        broker: {
          name: 'Sample Broker 1',
          logo: '/logos/broker1.png',
          rating: 4.5,
          platforms: ['MT4', 'MT5']
        },
        title: 'High Cashback Program',
        description: 'Get up to $15 per lot traded',
        promotionType: 'cashback',
        isActive: true,
        isFeatured: true,
        isExclusive: false,
        isPopular: true,
        startDate: '2024-01-01T00:00:00Z',
        endDate: '2024-12-31T23:59:59Z',
        activationMethod: 'automatic',
        requirements: {
          minDeposit: 100,
          accountTypes: ['Standard', 'ECN'],
          newClientsOnly: false
        },
        rates: [
          {
            id: 'rate_1_1',
            promotionId: 'promo_1',
            tierName: 'Standard',
            minVolume: 0,
            maxVolume: 10,
            rateType: 'fixed_per_lot',
            rateValue: 8,
            currency: 'USD',
            frequency: 'monthly',
            displayOrder: 1
          },
          {
            id: 'rate_1_2',
            promotionId: 'promo_1',
            tierName: 'VIP',
            minVolume: 10,
            rateType: 'fixed_per_lot',
            rateValue: 15,
            currency: 'USD',
            frequency: 'monthly',
            displayOrder: 2
          }
        ],
        features: [
          {
            id: 'feature_1_1',
            promotionId: 'promo_1',
            featureText: 'Automated rebate payments',
            featureType: 'advantage',
            displayOrder: 1,
            isHighlighted: true
          },
          {
            id: 'feature_1_2',
            promotionId: 'promo_1',
            featureText: 'No minimum volume required',
            featureType: 'advantage',
            displayOrder: 2,
            isHighlighted: false
          }
        ],
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      }
    ];

    samplePromotions.forEach(promotion => {
      this.promotions.set(promotion.id, promotion);
    });

    this.nextId = samplePromotions.length + 1;
  }
}

/**
 * Database-backed implementation using Supabase
 * This would be the production implementation
 */
export class SupabasePromotionRepository implements PromotionRepository {
  constructor(private supabaseClient: any) {}

  async findPromotions(request: GetPromotionsRequest): Promise<GetPromotionsResponse> {
    // Implementation would use the existing PromotionDatabase class
    // from lib/database/promotions.ts
    throw new Error('Not implemented - use PromotionDatabase from lib/database/promotions.ts');
  }

  async findById(id: string): Promise<Promotion | null> {
    throw new Error('Not implemented');
  }

  async findByBrokerId(brokerId: string, activeOnly?: boolean): Promise<Promotion[]> {
    throw new Error('Not implemented');
  }

  async findFeatured(limit: number): Promise<Promotion[]> {
    throw new Error('Not implemented');
  }

  async create(request: CreatePromotionRequest): Promise<Promotion> {
    throw new Error('Not implemented');
  }

  async update(request: UpdatePromotionRequest): Promise<Promotion> {
    throw new Error('Not implemented');
  }

  async deactivate(id: string): Promise<void> {
    throw new Error('Not implemented');
  }

  async trackEvent(promotionId: string, eventType: 'view' | 'click' | 'conversion', metadata?: Record<string, any>): Promise<void> {
    throw new Error('Not implemented');
  }

  async getStats(promotionId: string): Promise<PromotionStatsResponse> {
    throw new Error('Not implemented');
  }

  async getAvailableFilters(): Promise<AvailableFilters> {
    throw new Error('Not implemented');
  }

  async deactivateExpired(): Promise<number> {
    throw new Error('Not implemented');
  }
}