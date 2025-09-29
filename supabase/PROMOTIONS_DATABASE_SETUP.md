# Promotions Database Setup Guide

This guide explains how to set up the comprehensive promotions system database schema for the Broker Analysis platform.

## Overview

The promotions system consists of four main tables:
- `promotions` - Main promotions table
- `promotion_rates` - Tiered rate structures (cashback, discounts, etc.)
- `promotion_features` - Key features and requirements for each promotion
- `promotion_analytics` - Daily analytics tracking for promotion performance

## Database Schema

### Tables Structure

#### 1. Promotions Table
```sql
promotions (
    id UUID PRIMARY KEY,
    broker_id BIGINT REFERENCES brokers(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    promotion_type promotion_type_enum NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_exclusive BOOLEAN DEFAULT false,
    is_popular BOOLEAN DEFAULT false,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    activation_method activation_method_enum NOT NULL,
    contact_info JSONB DEFAULT '{}',
    requirements JSONB NOT NULL DEFAULT '{}',
    terms TEXT,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
)
```

#### 2. Promotion Rates Table
```sql
promotion_rates (
    id UUID PRIMARY KEY,
    promotion_id UUID REFERENCES promotions(id),
    tier_name VARCHAR(100),
    min_volume DECIMAL(15,2) DEFAULT 0,
    max_volume DECIMAL(15,2),
    rate_type rate_type_enum NOT NULL,
    rate_value DECIMAL(10,4) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    frequency frequency_enum DEFAULT 'monthly',
    description TEXT,
    display_order INTEGER DEFAULT 0
)
```

#### 3. Promotion Features Table
```sql
promotion_features (
    id UUID PRIMARY KEY,
    promotion_id UUID REFERENCES promotions(id),
    feature_text VARCHAR(255) NOT NULL,
    feature_type feature_type_enum NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_highlighted BOOLEAN DEFAULT false
)
```

#### 4. Promotion Analytics Table
```sql
promotion_analytics (
    id UUID PRIMARY KEY,
    promotion_id UUID REFERENCES promotions(id),
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    UNIQUE(promotion_id, date)
)
```

### Enums

The system uses several enums for type safety:

```sql
-- Promotion types
CREATE TYPE promotion_type_enum AS ENUM (
    'cashback', 'deposit_bonus', 'commission_discount', 
    'copy_trading', 'vip_program', 'platform_bonus',
    'welcome_bonus', 'no_deposit_bonus', 'loyalty_program', 
    'trading_competition'
);

-- Activation methods
CREATE TYPE activation_method_enum AS ENUM (
    'automatic', 'manual', 'contact_required'
);

-- Rate types for calculations
CREATE TYPE rate_type_enum AS ENUM (
    'percentage', 'fixed_per_lot', 'fixed_amount'
);

-- Payment frequencies
CREATE TYPE frequency_enum AS ENUM (
    'daily', 'weekly', 'monthly', 'quarterly', 'one_time'
);

-- Feature types for UI display
CREATE TYPE feature_type_enum AS ENUM (
    'advantage', 'requirement', 'note', 'warning'
);
```

## Installation Steps

### 1. Run the Migration

Execute the migration file to create the schema:

```bash
# Using Supabase CLI
supabase db reset
supabase migration up

# Or apply the specific migration
psql -h your-db-host -U your-user -d your-db -f supabase/migrations/003_promotions_schema.sql
```

### 2. Apply Additional Functions

Run the additional functions for enhanced functionality:

```bash
psql -h your-db-host -U your-user -d your-db -f supabase/functions/promotion_functions.sql
```

### 3. Seed Sample Data (Optional)

To populate the database with sample promotions for testing:

```bash
psql -h your-db-host -U your-user -d your-db -f supabase/seed_promotions.sql
```

## Key Features

### 1. Tiered Rate System
The `promotion_rates` table supports complex tiered rate structures:
- Volume-based tiers (e.g., different cashback rates for different trading volumes)
- Multiple rate types: percentage, fixed per lot, or fixed amount
- Flexible frequency options (daily, weekly, monthly, etc.)

### 2. Flexible Requirements System
The `requirements` JSONB field supports various promotion requirements:
```json
{
  "minDeposit": 500,
  "accountTypes": ["Standard", "ECN"],
  "tradingVolume": 100,
  "newClientsOnly": true,
  "verificationRequired": true,
  "eligibleCountries": ["US", "UK", "AU"],
  "excludedCountries": ["FR", "DE"]
}
```

### 3. Contact Information
The `contact_info` JSONB field stores multiple contact methods:
```json
{
  "email": "support@broker.com",
  "telegram": "@brokersupport",
  "phone": "+1-555-0123",
  "whatsapp": "+1-555-0123"
}
```

### 4. Analytics Tracking
Built-in analytics system tracks:
- Daily views, clicks, and conversions
- Unique visitors per day
- Conversion rates and performance metrics

### 5. Row Level Security (RLS)
Comprehensive RLS policies ensure:
- Public can view active promotions
- Authenticated users can view all promotions
- Admin users can manage promotions
- Analytics data is admin-only

## Database Functions

### Core Functions

#### `calculate_promotion_rebate(promotion_uuid, trading_volume)`
Calculates rebate amount based on promotion rates and trading volume.

```sql
SELECT calculate_promotion_rebate('promotion-id', 100.0);
-- Returns: {"rebate_amount": 800.00, "rate_type": "fixed_per_lot", ...}
```

#### `get_promotion_stats(promotion_uuid)`
Returns comprehensive statistics for a promotion.

```sql
SELECT get_promotion_stats('promotion-id');
-- Returns: {"total_views": 1500, "conversion_rate": 2.5, ...}
```

#### `deactivate_expired_promotions()`
Maintenance function to automatically deactivate expired promotions.

### Analytics Functions

#### `increment_promotion_analytics(promotion_uuid, date, field_name)`
Safely increments analytics counters.

#### `get_trending_promotions(days_back, limit_count)`
Returns trending promotions based on recent activity.

#### `search_promotions(search_query, limit_count, offset_count)`
Full-text search across promotions and broker names.

## Views

### `active_promotions_with_broker`
Optimized view for displaying active promotions with broker information.

### `promotion_details`
Complete promotion details including rates and features for detailed views.

## Performance Optimizations

### Indexes
- Composite indexes on frequently queried combinations
- Partial indexes for active promotions
- GIN indexes for JSONB fields and full-text search
- Unique constraints to prevent data duplication

### Materialized Views
Consider creating materialized views for:
- Promotion rankings by performance
- Broker promotion summaries
- Analytics dashboards

## Usage Examples

### Creating a Cashback Promotion

```sql
-- Insert main promotion
INSERT INTO promotions (broker_id, title, description, promotion_type, activation_method, requirements)
VALUES (1, 'Premium Cashback Program', 'Up to $15 per lot cashback', 'cashback', 'automatic', 
        '{"minDeposit": 500, "accountTypes": ["Standard", "ECN"]}');

-- Add tiered rates
INSERT INTO promotion_rates (promotion_id, tier_name, min_volume, max_volume, rate_type, rate_value)
VALUES 
  ('promotion-id', 'Standard', 0, 50, 'fixed_per_lot', 8.00),
  ('promotion-id', 'Gold', 50, 100, 'fixed_per_lot', 12.00),
  ('promotion-id', 'Platinum', 100, NULL, 'fixed_per_lot', 15.00);

-- Add features
INSERT INTO promotion_features (promotion_id, feature_text, feature_type, is_highlighted)
VALUES 
  ('promotion-id', 'Highest cashback rates', 'advantage', true),
  ('promotion-id', 'Monthly payments', 'advantage', false),
  ('promotion-id', 'Minimum 10 lots required', 'requirement', false);
```

### Querying Promotions

```sql
-- Get all active cashback promotions
SELECT * FROM active_promotions_with_broker 
WHERE promotion_type = 'cashback' 
ORDER BY is_featured DESC;

-- Get promotion with full details
SELECT * FROM promotion_details WHERE id = 'promotion-id';

-- Calculate rebate for 75 lots
SELECT calculate_promotion_rebate('promotion-id', 75.0);
```

## Maintenance

### Regular Tasks

1. **Deactivate Expired Promotions**
   ```sql
   SELECT deactivate_expired_promotions();
   ```

2. **Clean Old Analytics Data**
   ```sql
   DELETE FROM promotion_analytics 
   WHERE date < CURRENT_DATE - INTERVAL '1 year';
   ```

3. **Update Statistics**
   ```sql
   ANALYZE promotions;
   ANALYZE promotion_analytics;
   ```

### Monitoring

Monitor these metrics:
- Promotion performance (conversion rates)
- Database query performance
- Storage usage for analytics data
- RLS policy effectiveness

## Security Considerations

1. **RLS Policies**: Ensure proper access control
2. **Input Validation**: Use the `validate_promotion_data()` function
3. **Rate Limiting**: Implement application-level rate limiting for analytics
4. **Audit Logging**: Consider adding audit trails for admin actions

## Troubleshooting

### Common Issues

1. **Foreign Key Violations**: Ensure broker exists before creating promotions
2. **Date Range Errors**: Validate end_date > start_date
3. **Analytics Performance**: Use appropriate indexes and consider partitioning
4. **RLS Access Issues**: Check user roles and policy conditions

### Performance Tuning

1. **Slow Queries**: Use EXPLAIN ANALYZE to identify bottlenecks
2. **Index Usage**: Monitor pg_stat_user_indexes
3. **JSONB Queries**: Use appropriate GIN indexes
4. **Analytics Aggregation**: Consider pre-computed summaries

This completes the database setup for the comprehensive promotions system. The schema is designed to be flexible, performant, and secure while supporting complex promotion structures and analytics tracking.