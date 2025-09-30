-- Migration: Best Brokers Directory System
-- Description: Adds tables for categories, countries, verification, and ranking
-- Date: 2025-09-30
-- Version: 1.0.0

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BROKER CATEGORIES TABLE
-- Stores all broker categories for the directory system
CREATE TABLE IF NOT EXISTS broker_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category_type VARCHAR(50) NOT NULL, -- 'broker_type', 'execution', 'strategy', 'features'
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT[],
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. BROKER CATEGORY MAPPING TABLE
-- Maps brokers to categories with ranking positions
CREATE TABLE IF NOT EXISTS broker_category_map (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id INTEGER NOT NULL,
    category_id UUID NOT NULL,
    rank_position INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    match_reason TEXT, -- Why this broker fits this category
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES broker_categories(id) ON DELETE CASCADE,
    UNIQUE(broker_id, category_id)
);

-- 3. COUNTRIES TABLE
-- All countries for country-specific broker pages
CREATE TABLE IF NOT EXISTS countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    iso2 VARCHAR(2) UNIQUE NOT NULL,
    iso3 VARCHAR(3),
    flag_emoji TEXT,
    region TEXT,
    population BIGINT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. BROKER COUNTRY AVAILABILITY TABLE
-- Tracks broker availability in each country with verification data
CREATE TABLE IF NOT EXISTS broker_country_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id INTEGER NOT NULL,
    country_id UUID NOT NULL,
    available BOOLEAN DEFAULT null, -- null = not checked, true = available, false = not available
    confidence_level VARCHAR(20) DEFAULT 'unknown', -- 'high', 'medium', 'low', 'unknown', 'manual_check'
    evidence_urls TEXT[],
    evidence_summary TEXT,
    search_queries TEXT[],
    last_checked_at TIMESTAMP WITH TIME ZONE,
    checked_by VARCHAR(50), -- 'auto' or admin user id
    manual_override BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE CASCADE,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
    UNIQUE(broker_id, country_id)
);

-- 5. RANKING WEIGHTS TABLE
-- Configurable weights for broker ranking algorithm
CREATE TABLE IF NOT EXISTS ranking_weights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    factor_name VARCHAR(100) UNIQUE NOT NULL, -- 'regulation', 'costs', 'execution', etc.
    weight DECIMAL(3,2) NOT NULL DEFAULT 1.0, -- 0.0 to 1.0
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. SEO PAGES CACHE TABLE
-- Caches generated SEO content for better performance
CREATE TABLE IF NOT EXISTS seo_pages_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    page_type VARCHAR(50) NOT NULL, -- 'category', 'country'
    page_slug TEXT NOT NULL,
    title TEXT,
    meta_description TEXT,
    h1_title TEXT,
    intro_content TEXT,
    faq_data JSONB,
    last_generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(page_type, page_slug)
);

-- 7. VERIFICATION LOGS TABLE
-- Detailed logs of country verification attempts
CREATE TABLE IF NOT EXISTS verification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id INTEGER NOT NULL,
    country_id UUID NOT NULL,
    search_engine VARCHAR(20) NOT NULL, -- 'google', 'bing'
    query_used TEXT NOT NULL,
    results_found INTEGER DEFAULT 0,
    result_urls TEXT[],
    result_snippets TEXT[],
    processing_time_ms INTEGER,
    success BOOLEAN DEFAULT false,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE CASCADE,
    FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_broker_categories_type ON broker_categories(category_type);
CREATE INDEX IF NOT EXISTS idx_broker_categories_active ON broker_categories(is_active, sort_order);
CREATE INDEX IF NOT EXISTS idx_broker_category_map_broker ON broker_category_map(broker_id);
CREATE INDEX IF NOT EXISTS idx_broker_category_map_category ON broker_category_map(category_id);
CREATE INDEX IF NOT EXISTS idx_broker_category_map_rank ON broker_category_map(rank_position);
CREATE INDEX IF NOT EXISTS idx_countries_active ON countries(is_active);
CREATE INDEX IF NOT EXISTS idx_countries_region ON countries(region);
CREATE INDEX IF NOT EXISTS idx_broker_country_availability_broker ON broker_country_availability(broker_id);
CREATE INDEX IF NOT EXISTS idx_broker_country_availability_country ON broker_country_availability(country_id);
CREATE INDEX IF NOT EXISTS idx_broker_country_availability_available ON broker_country_availability(available);
CREATE INDEX IF NOT EXISTS idx_broker_country_availability_checked ON broker_country_availability(last_checked_at);
CREATE INDEX IF NOT EXISTS idx_ranking_weights_active ON ranking_weights(is_active);
CREATE INDEX IF NOT EXISTS idx_seo_pages_cache_type_slug ON seo_pages_cache(page_type, page_slug);
CREATE INDEX IF NOT EXISTS idx_seo_pages_cache_expires ON seo_pages_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_verification_logs_broker_country ON verification_logs(broker_id, country_id);
CREATE INDEX IF NOT EXISTS idx_verification_logs_created ON verification_logs(created_at);

-- Insert default ranking weights
INSERT INTO ranking_weights (factor_name, weight, description) VALUES
('regulation', 0.25, 'Regulatory strength and compliance score'),
('execution_spreads', 0.20, 'Trading costs, spreads, and execution quality'),
('fees_commissions', 0.15, 'Non-trading fees and commission structure'),
('withdrawal_reliability', 0.10, 'Withdrawal processing and reliability'),
('platform_features', 0.10, 'Trading platform features and tools'),
('country_availability', 0.10, 'Availability and support in target country'),
('user_reviews', 0.10, 'User satisfaction and community trust score')
ON CONFLICT (factor_name) DO NOTHING;

-- Create RLS (Row Level Security) policies
ALTER TABLE broker_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_category_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_country_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE ranking_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_pages_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_logs ENABLE ROW LEVEL SECURITY;

-- Public read access policies
CREATE POLICY "Allow public read access" ON broker_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access" ON broker_category_map FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON countries FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access" ON broker_country_availability FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON ranking_weights FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access" ON seo_pages_cache FOR SELECT USING (is_active = true);
CREATE POLICY "Allow public read access" ON verification_logs FOR SELECT USING (false); -- Private data

-- Admin write access policies (adjust based on your auth setup)
-- These would typically check for admin role in JWT
CREATE POLICY "Allow authenticated admin writes" ON broker_categories FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated admin writes" ON broker_category_map FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated admin writes" ON countries FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated admin writes" ON broker_country_availability FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated admin writes" ON ranking_weights FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated admin writes" ON seo_pages_cache FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Allow authenticated admin writes" ON verification_logs FOR ALL USING (auth.role() = 'authenticated');

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_broker_categories_updated_at BEFORE UPDATE ON broker_categories FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_broker_category_map_updated_at BEFORE UPDATE ON broker_category_map FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_broker_country_availability_updated_at BEFORE UPDATE ON broker_country_availability FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_ranking_weights_updated_at BEFORE UPDATE ON ranking_weights FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_seo_pages_cache_updated_at BEFORE UPDATE ON seo_pages_cache FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Add helpful functions for the ranking system
CREATE OR REPLACE FUNCTION get_broker_score_for_category(broker_id_param INTEGER, category_slug_param TEXT)
RETURNS DECIMAL AS $$
DECLARE
    total_score DECIMAL := 0;
    weight_sum DECIMAL := 0;
    regulation_score DECIMAL := 0;
    cost_score DECIMAL := 0;
BEGIN
    -- This is a simplified scoring function
    -- In production, you'd implement more sophisticated scoring logic
    
    SELECT COALESCE(overall_rating, 0) INTO regulation_score 
    FROM brokers WHERE id = broker_id_param;
    
    -- Calculate weighted score based on active ranking weights
    SELECT SUM(weight) INTO weight_sum FROM ranking_weights WHERE is_active = true;
    
    -- Simple calculation - in reality you'd have more complex logic
    total_score := regulation_score * (SELECT COALESCE(weight, 0.25) FROM ranking_weights WHERE factor_name = 'regulation' AND is_active = true);
    
    RETURN COALESCE(total_score, 0);
END;
$$ LANGUAGE plpgsql;

-- Migration complete
-- Remember to run the seed scripts next to populate categories and countries