/**
 * Cache Invalidation Service
 * Handles intelligent cache invalidation for programmatic directory pages
 * when broker data is updated
 */

import { programmaticCache } from './programmaticCache';
import { Broker } from '../types';

export interface InvalidationEvent {
  type: 'broker_update' | 'broker_create' | 'broker_delete' | 'bulk_update' | 'config_change';
  entityId?: string;
  affectedFields?: string[];
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface InvalidationRule {
  eventType: InvalidationEvent['type'];
  patterns: string[];
  dependencies: string[];
  scope: 'specific' | 'category' | 'global';
  priority: number;
}

class CacheInvalidationService {
  private invalidationRules: InvalidationRule[] = [
    // Broker update rules
    {
      eventType: 'broker_update',
      patterns: ['programmatic:*'],
      dependencies: ['brokers:all'],
      scope: 'global',
      priority: 1
    },
    // Broker creation rules
    {
      eventType: 'broker_create',
      patterns: ['programmatic:*'],
      dependencies: ['brokers:all'],
      scope: 'global',
      priority: 2
    },
    // Broker deletion rules
    {
      eventType: 'broker_delete',
      patterns: ['programmatic:*'],
      dependencies: ['brokers:all'],
      scope: 'global',
      priority: 3
    },
    // Configuration change rules
    {
      eventType: 'config_change',
      patterns: ['programmatic:*'],
      dependencies: ['config:*'],
      scope: 'global',
      priority: 4
    }
  ];

  private invalidationQueue: InvalidationEvent[] = [];
  private isProcessing = false;
  private batchTimeout: NodeJS.Timeout | null = null;

  /**
   * Register broker data update
   */
  async onBrokerUpdate(
    brokerId: string,
    updatedFields: string[],
    oldData: Partial<Broker>,
    newData: Partial<Broker>
  ): Promise<void> {
    const event: InvalidationEvent = {
      type: 'broker_update',
      entityId: brokerId,
      affectedFields: updatedFields,
      timestamp: Date.now(),
      metadata: {
        oldData,
        newData,
        significantChange: this.isSignificantChange(updatedFields, oldData, newData)
      }
    };

    await this.queueInvalidation(event);
  }

  /**
   * Register new broker creation
   */
  async onBrokerCreate(broker: Broker): Promise<void> {
    const event: InvalidationEvent = {
      type: 'broker_create',
      entityId: broker.id,
      timestamp: Date.now(),
      metadata: { broker }
    };

    await this.queueInvalidation(event);
  }

  /**
   * Register broker deletion
   */
  async onBrokerDelete(brokerId: string): Promise<void> {
    const event: InvalidationEvent = {
      type: 'broker_delete',
      entityId: brokerId,
      timestamp: Date.now()
    };

    await this.queueInvalidation(event);
  }

  /**
   * Register bulk broker updates
   */
  async onBulkUpdate(brokerIds: string[], operation: string): Promise<void> {
    const event: InvalidationEvent = {
      type: 'bulk_update',
      timestamp: Date.now(),
      metadata: { brokerIds, operation }
    };

    await this.queueInvalidation(event);
  }

  /**
   * Register configuration changes
   */
  async onConfigChange(configType: 'seo' | 'country', affectedPages: string[]): Promise<void> {
    const event: InvalidationEvent = {
      type: 'config_change',
      timestamp: Date.now(),
      metadata: { configType, affectedPages }
    };

    await this.queueInvalidation(event);
  }

  /**
   * Queue invalidation event for batch processing
   */
  private async queueInvalidation(event: InvalidationEvent): Promise<void> {
    this.invalidationQueue.push(event);

    // Batch process invalidations to avoid excessive cache clearing
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
    }

    this.batchTimeout = setTimeout(async () => {
      await this.processInvalidationQueue();
    }, 1000); // 1 second debounce

    // Process immediately for high-priority events
    if (this.isHighPriorityEvent(event)) {
      await this.processInvalidationQueue();
    }
  }

  /**
   * Process queued invalidation events
   */
  private async processInvalidationQueue(): Promise<void> {
    if (this.isProcessing || this.invalidationQueue.length === 0) {
      return;
    }

    this.isProcessing = true;
    const events = [...this.invalidationQueue];
    this.invalidationQueue = [];

    try {
      console.log(`🗑️ Processing ${events.length} cache invalidation events...`);

      // Group events by type and priority
      const groupedEvents = this.groupEventsByImpact(events);

      // Process each group
      for (const group of groupedEvents) {
        await this.processEventGroup(group);
      }

      console.log('✅ Cache invalidation completed');

    } catch (error) {
      console.error('❌ Error processing cache invalidation:', error);
      
      // Re-queue failed events
      this.invalidationQueue.unshift(...events);

    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Group events by their cache impact
   */
  private groupEventsByImpact(events: InvalidationEvent[]): InvalidationEvent[][] {
    const groups: { [key: string]: InvalidationEvent[] } = {};

    for (const event of events) {
      const impactKey = this.getEventImpactKey(event);
      if (!groups[impactKey]) {
        groups[impactKey] = [];
      }
      groups[impactKey].push(event);
    }

    // Sort groups by priority
    return Object.values(groups).sort((a, b) => {
      const aPriority = Math.min(...a.map(e => this.getEventPriority(e)));
      const bPriority = Math.min(...b.map(e => this.getEventPriority(e)));
      return aPriority - bPriority;
    });
  }

  /**
   * Get event impact key for grouping
   */
  private getEventImpactKey(event: InvalidationEvent): string {
    switch (event.type) {
      case 'broker_update':
        return `broker:${event.entityId}`;
      case 'broker_create':
      case 'broker_delete':
        return 'broker:global';
      case 'bulk_update':
        return 'bulk:global';
      case 'config_change':
        return 'config:global';
      default:
        return 'unknown';
    }
  }

  /**
   * Get event priority
   */
  private getEventPriority(event: InvalidationEvent): number {
    const rule = this.invalidationRules.find(r => r.eventType === event.type);
    return rule?.priority || 999;
  }

  /**
   * Process a group of similar events
   */
  private async processEventGroup(events: InvalidationEvent[]): Promise<void> {
    const event = events[0]; // Representative event
    const rule = this.invalidationRules.find(r => r.eventType === event.type);

    if (!rule) {
      console.warn(`No invalidation rule found for event type: ${event.type}`);
      return;
    }

    switch (rule.scope) {
      case 'specific':
        await this.processSpecificInvalidation(events, rule);
        break;
      case 'category':
        await this.processCategoryInvalidation(events, rule);
        break;
      case 'global':
        await this.processGlobalInvalidation(events, rule);
        break;
    }
  }

  /**
   * Process specific entity invalidation
   */
  private async processSpecificInvalidation(
    events: InvalidationEvent[],
    rule: InvalidationRule
  ): Promise<void> {
    for (const event of events) {
      if (event.entityId) {
        const invalidated = await programmaticCache.invalidate(undefined, `broker:${event.entityId}`);
        console.log(`🎯 Invalidated ${invalidated} specific cache entries for broker ${event.entityId}`);
      }
    }
  }

  /**
   * Process category-level invalidation
   */
  private async processCategoryInvalidation(
    events: InvalidationEvent[],
    rule: InvalidationRule
  ): Promise<void> {
    // Determine affected categories based on broker changes
    const affectedCategories = await this.determineAffectedCategories(events);
    
    for (const category of affectedCategories) {
      const pattern = new RegExp(`programmatic:(category|seo):${category}`);
      const invalidated = await programmaticCache.invalidate(pattern);
      console.log(`📂 Invalidated ${invalidated} category cache entries for ${category}`);
    }
  }

  /**
   * Process global invalidation
   */
  private async processGlobalInvalidation(
    events: InvalidationEvent[],
    rule: InvalidationRule
  ): Promise<void> {
    let totalInvalidated = 0;

    for (const pattern of rule.patterns) {
      const regex = new RegExp(pattern.replace('*', '.*'));
      const invalidated = await programmaticCache.invalidate(regex);
      totalInvalidated += invalidated;
    }

    console.log(`🌐 Global invalidation: ${totalInvalidated} cache entries cleared`);
  }

  /**
   * Determine affected categories from broker changes
   */
  private async determineAffectedCategories(events: InvalidationEvent[]): Promise<string[]> {
    const categories = new Set<string>();

    for (const event of events) {
      if (event.type === 'broker_update' && event.affectedFields) {
        // Check which categories might be affected by the changed fields
        if (event.affectedFields.includes('regulation')) {
          categories.add('ecn-brokers');
          categories.add('stp-brokers');
          categories.add('usa-traders');
          categories.add('uk-fca-regulated');
        }

        if (event.affectedFields.includes('minDeposit')) {
          categories.add('no-minimum-deposit');
          categories.add('low-deposit');
          categories.add('100-deposit');
        }

        if (event.affectedFields.includes('platforms')) {
          categories.add('metatrader4-mt4');
          categories.add('metatrader5-mt5');
          categories.add('ctrader');
        }

        if (event.affectedFields.includes('islamicAccount')) {
          categories.add('islamic-swap-free');
        }

        if (event.affectedFields.includes('copyTrading')) {
          categories.add('copy-trading');
        }
      }
    }

    return Array.from(categories);
  }

  /**
   * Check if broker change is significant enough to invalidate cache
   */
  private isSignificantChange(
    fields: string[],
    oldData: Partial<Broker>,
    newData: Partial<Broker>
  ): boolean {
    const significantFields = [
      'name',
      'score',
      'regulation',
      'minDeposit',
      'spreads',
      'platforms',
      'islamicAccount',
      'copyTrading',
      'status'
    ];

    return fields.some(field => significantFields.includes(field));
  }

  /**
   * Check if event should be processed immediately
   */
  private isHighPriorityEvent(event: InvalidationEvent): boolean {
    return event.type === 'broker_delete' || 
           event.type === 'config_change' ||
           (event.type === 'broker_update' && event.metadata?.significantChange);
  }

  /**
   * Get invalidation statistics
   */
  getStats() {
    return {
      queueLength: this.invalidationQueue.length,
      isProcessing: this.isProcessing,
      rulesCount: this.invalidationRules.length,
      lastProcessed: this.batchTimeout ? 'pending' : 'idle'
    };
  }

  /**
   * Force immediate processing of queue
   */
  async forceProcess(): Promise<void> {
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
    await this.processInvalidationQueue();
  }

  /**
   * Clear invalidation queue
   */
  clearQueue(): void {
    this.invalidationQueue = [];
    if (this.batchTimeout) {
      clearTimeout(this.batchTimeout);
      this.batchTimeout = null;
    }
  }
}

// Create singleton instance
export const cacheInvalidation = new CacheInvalidationService();

// Export convenience hooks
export const useCacheInvalidation = () => {
  return {
    onBrokerUpdate: cacheInvalidation.onBrokerUpdate.bind(cacheInvalidation),
    onBrokerCreate: cacheInvalidation.onBrokerCreate.bind(cacheInvalidation),
    onBrokerDelete: cacheInvalidation.onBrokerDelete.bind(cacheInvalidation),
    onBulkUpdate: cacheInvalidation.onBulkUpdate.bind(cacheInvalidation),
    onConfigChange: cacheInvalidation.onConfigChange.bind(cacheInvalidation),
    getStats: cacheInvalidation.getStats.bind(cacheInvalidation),
    forceProcess: cacheInvalidation.forceProcess.bind(cacheInvalidation)
  };
};

export default cacheInvalidation;