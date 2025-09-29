-- Promotions Enhancement Migration
-- Creates tables for comprehensive broker promotions system
-- Migration: 003_promotions_schema.sql

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. ENUMS FOR PROMOTION SYSTEM
-- ============================================================================

-- Promotion type enum
CREATE TYPE promotion_type_enum AS ENUM (
    'cashback', 
    'deposit_bonus', 
    'commission_discount', 
    'copy_trading', 
    'vip_program', 
    'platform_bonus',
    'welcome_bonus',
    'no_deposit_bonus',
    'loyalty_program',
    'trading_competition'
);

-- Activation method enum
CREATE TYPE activation_method_enum AS ENUM (
    'automatic', 
    'manual', 
    'contact_required'
);

-- Rate type enum for promotion rates
CREATE TYPE rate_type_enum AS ENUM (
    'percentage', 
    'fixed_per_lot', 
    'fixed_amount'
);

-- Frequency enum for payment frequency
CREATE TYPE frequency_enum AS ENUM (
    'daily', 
    'weekly', 
    'monthly', 
    'quarterly',
    'one_time'
);

-- Feature type enum for promotion features
CREATE TYPE feature_type_enum AS ENUM (
    'advantage', 
    'requirement', 
    'note', 
    'warning'
);

-- ============================================================================
-- 2. MAIN PROMOTIONS TABLE
-- ============================================================================

CREATE TABLE promotions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id BIGINT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    promotion_type promotion_type_enum NOT NULL,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    is_exclusive BOOLEAN DEFAULT false,
    is_popular BOOLEAN DEFAULT false,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    end_date TIMESTAMP WITH TIME ZONE,
    activation_method activation_method_enum NOT NULL DEFAULT 'automatic',
    contact_info JSONB DEFAULT '{}', -- {email, telegram, phone, etc.}
    requirements JSONB NOT NULL DEFAULT '{}', -- {minDeposit, accountTypes, etc.}
    terms TEXT, -- Terms and conditions
    website_url TEXT, -- Direct link to promotion page
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_date_range CHECK (end_date IS NULL OR end_date > start_date),
    CONSTRAINT valid_title_length CHECK (char_length(title) >= 3)
);

-- ============================================================================
-- 3. PROMOTION RATES TABLE (FOR TIERED RATES)
-- ============================================================================

CREATE TABLE promotion_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    tier_name VARCHAR(100), -- e.g., "Standard", "VIP", "Premium"
    min_volume DECIMAL(15,2) DEFAULT 0, -- Minimum trading volume for this tier
    max_volume DECIMAL(15,2), -- Maximum trading volume (NULL for unlimited)
    rate_type rate_type_enum NOT NULL,
    rate_value DECIMAL(10,4) NOT NULL, -- The actual rate (percentage, amount per lot, etc.)
    currency VARCHAR(3) DEFAULT 'USD',
    frequency frequency_enum DEFAULT 'monthly',
    description TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_volume_range CHECK (max_volume IS NULL OR max_volume > min_volume),
    CONSTRAINT valid_rate_value CHECK (rate_value >= 0),
    CONSTRAINT valid_display_order CHECK (display_order >= 0)
);

-- ============================================================================
-- 4. PROMOTION FEATURES TABLE
-- ============================================================================

CREATE TABLE promotion_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    feature_text VARCHAR(255) NOT NULL,
    feature_type feature_type_enum NOT NULL DEFAULT 'advantage',
    display_order INTEGER DEFAULT 0,
    is_highlighted BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_feature_text_length CHECK (char_length(feature_text) >= 1),
    CONSTRAINT valid_display_order CHECK (display_order >= 0)
);

-- ============================================================================
-- 5. PROMOTION ANALYTICS TABLE
-- ============================================================================

CREATE TABLE promotion_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    promotion_id UUID NOT NULL REFERENCES promotions(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    views INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    unique_visitors INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT valid_analytics_values CHECK (
        views >= 0 AND clicks >= 0 AND conversions >= 0 AND unique_visitors >= 0
    ),
    CONSTRAINT valid_conversion_logic CHECK (conversions <= clicks),
    CONSTRAINT valid_click_logic CHECK (clicks <= views),
    
    -- Unique constraint to prevent duplicate entries for same promotion and date
    UNIQUE(promotion_id, date)
);

-- ============================================================================
-- 6. PERFORMANCE INDEXES
-- ============================================================================

-- Promotions table indexes
CREATE INDEX idx_promotions_active ON promotions(is_active) WHERE is_active = true;
CREATE INDEX idx_promotions_featured ON promotions(is_featured) WHERE is_featured = true;
CREATE INDEX idx_promotions_broker_type ON promotions(broker_id, promotion_type);
CREATE INDEX idx_promotions_dates ON promotions(start_date, end_date);
CREATE INDEX idx_promotions_broker_active ON promotions(broker_id, is_active) WHERE is_active = true;
CREATE INDEX idx_promotions_type_active ON promotions(promotion_type, is_active) WHERE is_active = true;

-- Promotion rates indexes
CREATE INDEX idx_promotion_rates_promotion ON promotion_rates(promotion_id);
CREATE INDEX idx_promotion_rates_volume ON promotion_rates(promotion_id, min_volume, max_volume);
CREATE INDEX idx_promotion_rates_display_order ON promotion_rates(promotion_id, display_order);

-- Promotion features indexes
CREATE INDEX idx_promotion_features_promotion ON promotion_features(promotion_id);
CREATE INDEX idx_promotion_features_display_order ON promotion_features(promotion_id, display_order);
CREATE INDEX idx_promotion_features_type ON promotion_features(promotion_id, feature_type);

-- Promotion analytics indexes
CREATE INDEX idx_promotion_analytics_promotion_date ON promotion_analytics(promotion_id, date DESC);
CREATE INDEX idx_promotion_analytics_date ON promotion_analytics(date DESC);
CREATE INDEX idx_promotion_analytics_views ON promotion_analytics(views DESC);
CREATE INDEX idx_promotion_analytics_conversions ON promotion_analytics(conversions DESC);

-- Full-text search index for promotions
CREATE INDEX idx_promotions_search ON promotions USING GIN (
    to_tsvector('english', title || ' ' || COALESCE(description, ''))
);

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all promotion tables
ALTER TABLE promotions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE promotion_analytics ENABLE ROW LEVEL SECURITY;

-- Promotions RLS Policies
CREATE POLICY "Public can view active promotions" ON promotions
    FOR SELECT USING (is_active = true);

CREATE POLICY "Authenticated can view all promotions" ON promotions
    FOR SELECT USING (auth.role() = 'authenticated');

-- Admin can manage promotions (assuming admin role exists)
CREATE POLICY "Admin can manage promotions" ON promotions
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid() 
            AND auth.users.email IN (
                SELECT email FROM auth.users 
                WHERE raw_user_meta_data->>'role' = 'admin'
            )
        )
    );

-- Promotion rates policies
CREATE POLICY "Public can view promotion rates" ON promotion_rates
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM promotions 
            WHERE promotions.id = promotion_rates.promotion_id 
            AND promotions.is_active = true
        )
    );

CREATE POLICY "Admin can manage promotion rates" ON promotion_rates
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Promotion features policies
CREATE POLICY "Public can view promotion features" ON promotion_features
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM promotions 
            WHERE promotions.id = promotion_features.promotion_id 
            AND promotions.is_active = true
        )
    );

CREATE POLICY "Admin can manage promotion features" ON promotion_features
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- Promotion analytics policies (admin only)
CREATE POLICY "Admin can view promotion analytics" ON promotion_analytics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

CREATE POLICY "Admin can manage promotion analytics" ON promotion_analytics
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid() 
            AND auth.users.raw_user_meta_data->>'role' = 'admin'
        )
    );

-- ============================================================================
-- 8. FUNCTIONS AND TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_promotion_updated_at()
RETURNS TRIGGER AS $
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_promotions_updated_at 
    BEFORE UPDATE ON promotions
    FOR EACH ROW EXECUTE FUNCTION update_promotion_updated_at();

CREATE TRIGGER update_promotion_analytics_updated_at 
    BEFORE UPDATE ON promotion_analytics
    FOR EACH ROW EXECUTE FUNCTION update_promotion_updated_at();

-- Function to automatically deactivate expired promotions
CREATE OR REPLACE FUNCTION deactivate_expired_promotions()
RETURNS INTEGER AS $
DECLARE
    deactivated_count INTEGER := 0;
BEGIN
    UPDATE promotions 
    SET is_active = false, updated_at = NOW()
    WHERE is_active = true 
    AND end_date IS NOT NULL 
    AND end_date < NOW();
    
    GET DIAGNOSTICS deactivated_count = ROW_COUNT;
    RETURN deactivated_count;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get promotion statistics
CREATE OR REPLACE FUNCTION get_promotion_stats(promotion_uuid UUID)
RETURNS JSONB AS $
DECLARE
    stats JSONB;
BEGIN
    SELECT jsonb_build_object(
        'total_views', COALESCE(SUM(views), 0),
        'total_clicks', COALESCE(SUM(clicks), 0),
        'total_conversions', COALESCE(SUM(conversions), 0),
        'conversion_rate', CASE 
            WHEN COALESCE(SUM(clicks), 0) > 0 
            THEN ROUND((COALESCE(SUM(conversions), 0)::DECIMAL / SUM(clicks)) * 100, 2)
            ELSE 0 
        END,
        'click_through_rate', CASE 
            WHEN COALESCE(SUM(views), 0) > 0 
            THEN ROUND((COALESCE(SUM(clicks), 0)::DECIMAL / SUM(views)) * 100, 2)
            ELSE 0 
        END,
        'days_active', CASE 
            WHEN COUNT(*) > 0 THEN COUNT(*)
            ELSE 0 
        END
    ) INTO stats
    FROM promotion_analytics 
    WHERE promotion_id = promotion_uuid;
    
    RETURN COALESCE(stats, '{}'::jsonb);
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate rebate for given volume and promotion
CREATE OR REPLACE FUNCTION calculate_promotion_rebate(
    promotion_uuid UUID, 
    trading_volume DECIMAL
)
RETURNS JSONB AS $
DECLARE
    rate_info RECORD;
    calculated_rebate DECIMAL := 0;
    result JSONB;
BEGIN
    -- Find the appropriate rate tier for the given volume
    SELECT * INTO rate_info
    FROM promotion_rates 
    WHERE promotion_id = promotion_uuid
    AND min_volume <= trading_volume
    AND (max_volume IS NULL OR max_volume >= trading_volume)
    ORDER BY min_volume DESC
    LIMIT 1;
    
    IF rate_info IS NOT NULL THEN
        CASE rate_info.rate_type
            WHEN 'percentage' THEN
                calculated_rebate := trading_volume * (rate_info.rate_value / 100);
            WHEN 'fixed_per_lot' THEN
                calculated_rebate := trading_volume * rate_info.rate_value;
            WHEN 'fixed_amount' THEN
                calculated_rebate := rate_info.rate_value;
        END CASE;
        
        result := jsonb_build_object(
            'rebate_amount', calculated_rebate,
            'rate_value', rate_info.rate_value,
            'rate_type', rate_info.rate_type,
            'tier_name', rate_info.tier_name,
            'currency', rate_info.currency,
            'frequency', rate_info.frequency
        );
    ELSE
        result := jsonb_build_object(
            'rebate_amount', 0,
            'error', 'No rate tier found for the given volume'
        );
    END IF;
    
    RETURN result;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 9. VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for active promotions with broker details
CREATE VIEW active_promotions_with_broker AS
SELECT 
    p.*,
    b.name as broker_name,
    b.logo_url as broker_logo,
    b.score as broker_rating,
    b.website_url as broker_website,
    get_promotion_stats(p.id) as analytics_stats
FROM promotions p
JOIN brokers b ON p.broker_id = b.id
WHERE p.is_active = true
ORDER BY p.is_featured DESC, p.created_at DESC;

-- View for promotion details with rates and features
CREATE VIEW promotion_details AS
SELECT 
    p.*,
    b.name as broker_name,
    b.logo_url as broker_logo,
    COALESCE(
        jsonb_agg(
            DISTINCT jsonb_build_object(
                'id', pr.id,
                'tier_name', pr.tier_name,
                'min_volume', pr.min_volume,
                'max_volume', pr.max_volume,
                'rate_type', pr.rate_type,
                'rate_value', pr.rate_value,
                'currency', pr.currency,
                'frequency', pr.frequency,
                'description', pr.description,
                'display_order', pr.display_order
            )
        ) FILTER (WHERE pr.id IS NOT NULL), 
        '[]'::jsonb
    ) as rates,
    COALESCE(
        jsonb_agg(
            DISTINCT jsonb_build_object(
                'id', pf.id,
                'feature_text', pf.feature_text,
                'feature_type', pf.feature_type,
                'is_highlighted', pf.is_highlighted,
                'display_order', pf.display_order
            )
        ) FILTER (WHERE pf.id IS NOT NULL), 
        '[]'::jsonb
    ) as features
FROM promotions p
JOIN brokers b ON p.broker_id = b.id
LEFT JOIN promotion_rates pr ON p.id = pr.promotion_id
LEFT JOIN promotion_features pf ON p.id = pf.promotion_id
WHERE p.is_active = true
GROUP BY p.id, b.name, b.logo_url
ORDER BY p.is_featured DESC, p.created_at DESC;

-- ============================================================================
-- 10. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE promotions IS 'Main promotions table storing broker promotional offers';
COMMENT ON TABLE promotion_rates IS 'Tiered rate structure for promotions (e.g., different rebate rates based on volume)';
COMMENT ON TABLE promotion_features IS 'Key features, advantages, and requirements for each promotion';
COMMENT ON TABLE promotion_analytics IS 'Daily analytics data for promotion performance tracking';

COMMENT ON COLUMN promotions.contact_info IS 'JSON object containing contact methods for manual activation: {email, telegram, phone, etc.}';
COMMENT ON COLUMN promotions.requirements IS 'JSON object containing promotion requirements: {minDeposit, accountTypes, tradingVolume, etc.}';
COMMENT ON COLUMN promotion_rates.rate_value IS 'The actual rate value - interpretation depends on rate_type';
COMMENT ON COLUMN promotion_analytics.unique_visitors IS 'Number of unique users who viewed the promotion on this date';

-- Create indexes on JSONB fields for better query performance
CREATE INDEX idx_promotions_contact_info ON promotions USING GIN (contact_info);
CREATE INDEX idx_promotions_requirements ON promotions USING GIN (requirements);