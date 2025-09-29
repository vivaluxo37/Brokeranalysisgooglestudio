# Promotion Services

This directory contains the core promotion data services for the broker promotions enhancement system. The services provide a complete solution for managing promotional offers including cashback programs, deposit bonuses, commission discounts, and other trading incentives.

## Architecture Overview

The promotion services follow a layered architecture pattern:

```
┌─────────────────────────────────────┐
│           Service Layer             │
│  (Business Logic & Validation)      │
├─────────────────────────────────────┤
│         Repository Layer            │
│     (Data Access & Persistence)     │
├─────────────────────────────────────┤
│        Calculation Layer            │
│   (Rebate & Financial Calculations) │
└─────────────────────────────────────┘
```

## Core Services

### 1. PromotionService

The main service class that provides business logic and orchestrates operations between different layers.

**Key Features:**
- CRUD operations for promotions
- Input validation and error handling
- Business rule enforcement
- Analytics tracking
- Promotion lifecycle management

**Usage:**
```typescript
import { getPromotionService } from './services/promotionServiceFactory';

const service = getPromotionService();

// Get promotions with filtering and pagination
const promotions = await service.getPromotions({
  filters: {
    promotionTypes: ['cashback'],
    brokers: ['1', '2']
  },
  pagination: { page: 1, limit: 20 },
  sort: { field: 'rebate_amount', order: 'desc' }
});

// Create a new promotion
const newPromotion = await service.createPromotion({
  brokerId: '1',
  title: 'High Cashback Program',
  promotionType: 'cashback',
  activationMethod: 'automatic',
  requirements: { minDeposit: 100 },
  rates: [{
    tierName: 'Standard',
    minVolume: 0,
    rateType: 'fixed_per_lot',
    rateValue: 8,
    currency: 'USD',
    frequency: 'monthly',
    displayOrder: 1
  }],
  features: [],
  startDate: '2024-01-01T00:00:00Z'
});
```

### 2. PromotionRepository

The data access layer that handles persistence operations with support for filtering, sorting, and pagination.

**Implementations:**
- `InMemoryPromotionRepository`: In-memory implementation for development and testing
- `SupabasePromotionRepository`: Database-backed implementation using Supabase

**Key Features:**
- Flexible filtering and sorting
- Pagination support
- Analytics tracking
- Automatic expiration handling

### 3. CalculationService

Handles complex rebate calculations with support for tiered rates and multiple calculation scenarios.

**Key Features:**
- Multi-tier rate calculations
- Support for different rate types (fixed per lot, percentage, fixed amount)
- Frequency-based calculations (daily, weekly, monthly, quarterly)
- Break-even analysis
- Cost savings calculations
- Volume scenario modeling

**Usage:**
```typescript
import { CalculationService } from './services/calculationService';

const calculationService = new CalculationService();

// Calculate rebate for a promotion and trading volume
const result = await calculationService.calculateRebate(promotion, 25); // 25 lots

console.log(`Monthly rebate: $${result.monthlyRebate}`);
console.log(`Yearly rebate: $${result.yearlyRebate}`);
console.log(`Cost reduction: ${result.effectiveCostReduction}%`);

// Compare multiple promotions
const bestRebates = await calculationService.calculateBestRebates(
  promotions, 
  monthlyVolume
);

// Analyze different volume scenarios
const scenarios = await calculationService.calculateVolumeScenarios(
  promotion,
  [5, 10, 25, 50, 100]
);
```

## Service Factory

The `PromotionServiceFactory` provides dependency injection and configuration management:

```typescript
import { PromotionServiceFactory, getPromotionService } from './services/promotionServiceFactory';

// Configure the factory
PromotionServiceFactory.configure({
  repositoryType: 'supabase', // or 'memory'
  supabaseClient: customSupabaseClient
});

// Get singleton instance
const service = getPromotionService();

// Create new instance with custom config
const testService = createPromotionService({
  repositoryType: 'memory'
});
```

## Data Models

### Promotion
```typescript
interface Promotion {
  id: string;
  brokerId: string;
  broker?: BrokerInfo;
  title: string;
  description?: string;
  promotionType: PromotionType;
  isActive: boolean;
  isFeatured: boolean;
  isExclusive: boolean;
  isPopular: boolean;
  startDate: string;
  endDate?: string;
  activationMethod: ActivationMethod;
  contactInfo?: ContactInfo;
  requirements: PromotionRequirements;
  terms?: string;
  websiteUrl?: string;
  rates?: PromotionRate[];
  features?: PromotionFeature[];
  analytics?: PromotionAnalytics[];
  createdAt: string;
  updatedAt: string;
}
```

### PromotionRate
```typescript
interface PromotionRate {
  id: string;
  promotionId: string;
  tierName?: string;
  minVolume: number;
  maxVolume?: number;
  rateType: RateType; // 'percentage' | 'fixed_per_lot' | 'fixed_amount'
  rateValue: number;
  currency: string;
  frequency: PaymentFrequency;
  description?: string;
  displayOrder: number;
}
```

### CalculationResult
```typescript
interface CalculationResult {
  rebateAmount: number;
  rateValue: number;
  rateType: RateType;
  tierName?: string;
  currency: string;
  frequency: PaymentFrequency;
  dailyRebate?: number;
  monthlyRebate?: number;
  yearlyRebate?: number;
  effectiveCostReduction?: number;
  nextTierVolume?: number;
  nextTierRebate?: number;
}
```

## Error Handling

All services implement comprehensive error handling:

- **Validation Errors**: Input validation with descriptive error messages
- **Business Logic Errors**: Enforcement of business rules and constraints
- **Data Access Errors**: Graceful handling of database and network issues
- **Analytics Errors**: Non-blocking error handling for analytics operations

```typescript
try {
  const promotion = await service.createPromotion(invalidData);
} catch (error) {
  if (error.message.includes('Invalid broker ID')) {
    // Handle validation error
  } else if (error.message.includes('Database error')) {
    // Handle data access error
  }
}
```

## Testing

The services include comprehensive test coverage:

- **Unit Tests**: Individual service and method testing
- **Integration Tests**: End-to-end workflow testing
- **Edge Case Tests**: Error scenarios and boundary conditions

Run tests:
```bash
# Run all service tests
npx vitest run tests/services/

# Run specific test file
npx vitest run tests/services/promotionService.test.ts

# Run with coverage
npx vitest run tests/services/ --coverage
```

## Performance Considerations

### Caching
- Repository layer supports caching for frequently accessed data
- Calculation results can be cached for common volume scenarios
- Analytics data is aggregated to minimize database queries

### Pagination
- All list operations support pagination to handle large datasets
- Configurable page sizes with reasonable defaults
- Efficient counting queries for total record counts

### Indexing
- Database indexes on commonly filtered fields (broker_id, promotion_type, etc.)
- Composite indexes for complex filter combinations
- Date-based indexes for time-range queries

## Configuration

### Environment Variables
```env
# Repository configuration
PROMOTION_REPOSITORY_TYPE=supabase  # or 'memory'

# Supabase configuration (if using Supabase repository)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

# Calculation defaults
DEFAULT_COMMISSION_PER_LOT=7
DEFAULT_DAILY_VOLUME=2
```

### Service Configuration
```typescript
// Configure at application startup
PromotionServiceFactory.configure({
  repositoryType: process.env.PROMOTION_REPOSITORY_TYPE as 'memory' | 'supabase',
  supabaseClient: customSupabaseClient
});
```

## Best Practices

### Service Usage
1. Use the factory pattern for service creation
2. Handle errors appropriately at the service boundary
3. Validate inputs before calling service methods
4. Use pagination for large result sets
5. Cache frequently accessed data when appropriate

### Repository Implementation
1. Implement proper error handling and logging
2. Use transactions for multi-table operations
3. Optimize queries with appropriate indexes
4. Handle connection pooling and timeouts
5. Implement proper data validation

### Calculation Service
1. Validate calculation inputs thoroughly
2. Handle edge cases (zero volume, invalid rates)
3. Use appropriate precision for financial calculations
4. Cache calculation results for performance
5. Provide clear error messages for invalid scenarios

## Future Enhancements

### Planned Features
- Real-time promotion updates via WebSocket
- Advanced analytics and reporting
- A/B testing support for promotions
- Machine learning-based promotion recommendations
- Multi-currency support with exchange rates
- Promotion template system
- Bulk operations for promotion management

### Performance Optimizations
- Redis caching layer
- Database query optimization
- CDN integration for static assets
- Background job processing for analytics
- Horizontal scaling support

## Contributing

When contributing to the promotion services:

1. Follow the existing architecture patterns
2. Add comprehensive tests for new features
3. Update documentation for API changes
4. Follow TypeScript best practices
5. Ensure backward compatibility when possible

### Adding New Rate Types
```typescript
// 1. Update the RateType enum in types.ts
export type RateType = 'percentage' | 'fixed_per_lot' | 'fixed_amount' | 'new_type';

// 2. Update the calculation logic in CalculationService
private calculateRebateAmount(rate: PromotionRate, volume: number): number {
  switch (rate.rateType) {
    case 'new_type':
      return this.calculateNewTypeRebate(rate, volume);
    // ... existing cases
  }
}

// 3. Add tests for the new rate type
it('should calculate rebate for new_type rate type', async () => {
  // Test implementation
});
```

### Adding New Filters
```typescript
// 1. Update the PromotionFilters interface
interface PromotionFilters {
  // ... existing filters
  newFilter?: string[];
}

// 2. Update repository implementation
private applyFilters(promotions: Promotion[], filters: PromotionFilters): Promotion[] {
  if (filters.newFilter?.length) {
    filtered = filtered.filter(p => filters.newFilter!.includes(p.newField));
  }
  // ... existing filter logic
}

// 3. Add tests for the new filter
```

This comprehensive service layer provides a solid foundation for the broker promotions enhancement system, with room for future growth and optimization.