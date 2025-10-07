-- Manual SQL for creating missing database tables
-- Run this in your Supabase dashboard SQL editor

-- 1. Create ranking_weights table
CREATE TABLE IF NOT EXISTS ranking_weights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    factor_name VARCHAR(100) UNIQUE NOT NULL,
    weight DECIMAL(3,2) NOT NULL DEFAULT 1.0,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create broker_categories table
CREATE TABLE IF NOT EXISTS broker_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category_type VARCHAR(50) NOT NULL,
    meta_title TEXT,
    meta_description TEXT,
    keywords TEXT[],
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create broker_category_map table
CREATE TABLE IF NOT EXISTS broker_category_map (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id INTEGER NOT NULL,
    category_id UUID NOT NULL,
    rank_position INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    match_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create countries table
CREATE TABLE IF NOT EXISTS countries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- 5. Create broker_country_availability table
CREATE TABLE IF NOT EXISTS broker_country_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    broker_id INTEGER NOT NULL,
    country_id UUID NOT NULL,
    available BOOLEAN DEFAULT null,
    confidence_level VARCHAR(20) DEFAULT 'unknown',
    evidence_urls TEXT[],
    evidence_summary TEXT,
    search_queries TEXT[],
    last_checked_at TIMESTAMP WITH TIME ZONE,
    checked_by VARCHAR(50),
    manual_override BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default ranking weights
INSERT INTO ranking_weights (factor_name, weight, description, is_active) VALUES
    ('regulation', 0.25, 'Regulatory compliance and investor protection', true),
    ('execution_spreads', 0.20, 'Execution speed and spread competitiveness', true),
    ('fees_commissions', 0.15, 'Trading costs and commission structure', true),
    ('withdrawal_reliability', 0.10, 'Withdrawal processing and reliability', true),
    ('platform_features', 0.10, 'Trading platform features and tools', true),
    ('country_availability', 0.10, 'Availability in user''s country', true),
    ('user_reviews', 0.10, 'User satisfaction and reviews', true)
ON CONFLICT (factor_name) DO UPDATE SET
    weight = EXCLUDED.weight,
    description = EXCLUDED.description,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Insert sample categories
INSERT INTO broker_categories (slug, name, description, category_type, is_active, sort_order) VALUES
    ('ecn-brokers', 'ECN Brokers', 'True ECN brokers providing direct market access', 'execution', true, 1),
    ('mt4-brokers', 'MT4 Brokers', 'Brokers supporting MetaTrader 4 platform', 'features', true, 2),
    ('mt5-brokers', 'MT5 Brokers', 'Brokers supporting MetaTrader 5 platform', 'features', true, 3),
    ('islamic-accounts-brokers', 'Islamic Account Brokers', 'Brokers offering Sharia-compliant accounts', 'features', true, 4),
    ('scalping-brokers', 'Scalping Brokers', 'Brokers optimized for high-frequency trading', 'strategy', true, 5),
    ('brokers-for-beginners', 'Brokers for Beginners', 'Beginner-friendly brokers with educational resources', 'strategy', true, 6),
    ('most-regulated-brokers', 'Most Regulated Brokers', 'Highly regulated brokers with multiple licenses', 'features', true, 7),
    ('high-leverage-brokers', 'High Leverage Brokers', 'Brokers offering high leverage options', 'features', true, 8)
ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    category_type = EXCLUDED.category_type,
    is_active = EXCLUDED.is_active,
    sort_order = EXCLUDED.sort_order,
    updated_at = NOW();

-- Insert sample countries
INSERT INTO countries (slug, name, iso2, iso3, region, is_active) VALUES
    ('united-states', 'United States', 'US', 'USA', 'North America', true),
    ('united-kingdom', 'United Kingdom', 'GB', 'GBR', 'Europe', true),
    ('australia', 'Australia', 'AU', 'AUS', 'Oceania', true),
    ('canada', 'Canada', 'CA', 'CAN', 'North America', true),
    ('germany', 'Germany', 'DE', 'DEU', 'Europe', true),
    ('france', 'France', 'FR', 'FRA', 'Europe', true),
    ('japan', 'Japan', 'JP', 'JPN', 'Asia', true),
    ('switzerland', 'Switzerland', 'CH', 'CHE', 'Europe', true),
    ('singapore', 'Singapore', 'SG', 'SGP', 'Asia', true),
    ('netherlands', 'Netherlands', 'NL', 'NLD', 'Europe', true)
ON CONFLICT (iso2) DO UPDATE SET
    name = EXCLUDED.name,
    iso3 = EXCLUDED.iso3,
    region = EXCLUDED.region,
    is_active = EXCLUDED.is_active,
    updated_at = NOW();

-- Enable RLS (Row Level Security)
ALTER TABLE ranking_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_category_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE countries ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_country_availability ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public ranking_weights are viewable by everyone." ON ranking_weights FOR SELECT USING (true);
CREATE POLICY "Public broker_categories are viewable by everyone." ON broker_categories FOR SELECT USING (true);
CREATE POLICY "Public broker_category_map is viewable by everyone." ON broker_category_map FOR SELECT USING (true);
CREATE POLICY "Public countries are viewable by everyone." ON countries FOR SELECT USING (true);
CREATE POLICY "Public broker_country_availability is viewable by everyone." ON broker_country_availability FOR SELECT USING (true);

-- Allow authenticated users to insert/update data
CREATE POLICY "Users can insert ranking_weights." ON ranking_weights FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update ranking_weights." ON ranking_weights FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert broker_categories." ON broker_categories FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update broker_categories." ON broker_categories FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert broker_category_map." ON broker_category_map FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update broker_category_map." ON broker_category_map FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert countries." ON countries FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update countries." ON countries FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert broker_country_availability." ON broker_country_availability FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update broker_country_availability." ON broker_country_availability FOR UPDATE USING (auth.role() = 'authenticated');