/**
 * PromotionServiceFactory - Factory for creating promotion service instances
 * Provides dependency injection and configuration for promotion services
 */

import { PromotionService } from './promotionService';
import { InMemoryPromotionRepository, SupabasePromotionRepository, type PromotionRepository } from './promotionRepository';
import { CalculationService } from './calculationService';
import { supabase } from './supabase';

export interface PromotionServiceConfig {
  repositoryType: 'memory' | 'supabase';
  supabaseClient?: any;
}

export class PromotionServiceFactory {
  private static instance: PromotionService | null = null;
  private static config: PromotionServiceConfig = {
    repositoryType: 'memory' // Default to in-memory for development
  };

  /**
   * Configure the factory with specific settings
   */
  static configure(config: Partial<PromotionServiceConfig>): void {
    this.config = { ...this.config, ...config };
    // Reset instance to force recreation with new config
    this.instance = null;
  }

  /**
   * Get or create a singleton instance of PromotionService
   */
  static getInstance(): PromotionService {
    if (!this.instance) {
      this.instance = this.createService();
    }
    return this.instance;
  }

  /**
   * Create a new instance of PromotionService (for testing or multiple instances)
   */
  static createService(config?: Partial<PromotionServiceConfig>): PromotionService {
    const effectiveConfig = config ? { ...this.config, ...config } : this.config;
    
    const repository = this.createRepository(effectiveConfig);
    const calculationService = new CalculationService();
    
    return new PromotionService(repository, calculationService);
  }

  /**
   * Create repository based on configuration
   */
  private static createRepository(config: PromotionServiceConfig): PromotionRepository {
    switch (config.repositoryType) {
      case 'supabase':
        const client = config.supabaseClient || supabase;
        return new SupabasePromotionRepository(client);
      
      case 'memory':
      default:
        return new InMemoryPromotionRepository();
    }
  }

  /**
   * Reset the singleton instance (useful for testing)
   */
  static reset(): void {
    this.instance = null;
  }
}

// Export convenience functions for common use cases
export const getPromotionService = () => PromotionServiceFactory.getInstance();
export const createPromotionService = (config?: Partial<PromotionServiceConfig>) => 
  PromotionServiceFactory.createService(config);

// Export individual services for direct use
export { PromotionService } from './promotionService';
export { InMemoryPromotionRepository, SupabasePromotionRepository } from './promotionRepository';
export { CalculationService, CalculationUtils } from './calculationService';

// Export types
export type { PromotionRepository } from './promotionRepository';