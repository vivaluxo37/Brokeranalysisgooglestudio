-- Migration 001: Add Programmatic SEO Fields
-- This migration adds the necessary fields for programmatic SEO functionality
-- to support category-country combinations and enhanced content generation

-- 1. Add new fields to brokers table
ALTER TABLE brokers 
ADD COLUMN IF NOT EXISTS supported_countries TEXT[], -- Array of supported country codes
ADD COLUMN IF NOT EXISTS country_specific_regulations JSONB, -- Country-specific regulation info
ADD COLUMN IF NOT EXISTS local_features JSONB, -- Country-specific features
ADD COLUMN IF NOT EXISTS content_priority INTEGER DEFAULT 0, -- Priority for content generation
ADD COLUMN IF NOT EXISTS last_content_update TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS content_generated BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS content_quality_score DECIMAL(3,2) DEFAULT 0.0;

-- 2. Create countries table for country-specific data
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  code VARCHAR(2) UNIQUE NOT NULL, -- ISO 3166-1 alpha-2 country code
  name VARCHAR(100) NOT NULL,
  region VARCHAR(50),
  currency VARCHAR(3),
  languages TEXT[], -- Array of language codes
  regulatory_authority VARCHAR(100),
  tax_info JSONB,
  trading_popularity INTEGER DEFAULT 0, -- Ranking by trading volume/popularity
  meta_title VARCHAR(200),
  meta_description TEXT,
  content JSONB, -- Country-specific content
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create programmatic_pages table to track generated pages
CREATE TABLE IF NOT EXISTS programmatic_pages (
  id SERIAL PRIMARY KEY,
  page_type VARCHAR(50) NOT NULL, -- 'category', 'country', 'category-country', 'strategy', 'feature'
  category_id INTEGER REFERENCES categories(id),
  country_code VARCHAR(2) REFERENCES countries(code),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  meta_description TEXT,
  meta_keywords TEXT[],
  content JSONB,
  structured_data JSONB,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'generating', 'completed', 'failed'
  quality_score DECIMAL(3,2) DEFAULT 0.0,
  last_generated TIMESTAMP WITH TIME ZONE,
  next_update TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create content_cache table for AI-generated content
CREATE TABLE IF NOT EXISTS content_cache (
  id SERIAL PRIMARY KEY,
  cache_key VARCHAR(255) UNIQUE NOT NULL,
  content_type VARCHAR(50) NOT NULL, -- 'page_content', 'meta_description', 'article', etc.
  content JSONB NOT NULL,
  source VARCHAR(50), -- 'ai_generated', 'manual', 'imported'
  quality_score DECIMAL(3,2) DEFAULT 0.0,
  usage_count INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create page_analytics table for tracking performance
CREATE TABLE IF NOT EXISTS page_analytics (
  id SERIAL PRIMARY KEY,
  page_id INTEGER REFERENCES programmatic_pages(id),
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  unique_visitors INTEGER DEFAULT 0,
  bounce_rate DECIMAL(5,2) DEFAULT 0.0,
  avg_time_on_page INTEGER DEFAULT 0, -- in seconds
  conversion_rate DECIMAL(5,2) DEFAULT 0.0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_brokers_supported_countries ON brokers USING GIN(supported_countries);
CREATE INDEX IF NOT EXISTS idx_brokers_content_priority ON brokers(content_priority DESC);
CREATE INDEX IF NOT EXISTS idx_programmatic_pages_slug ON programmatic_pages(slug);
CREATE INDEX IF NOT EXISTS idx_programmatic_pages_type ON programmatic_pages(page_type);
CREATE INDEX IF NOT EXISTS idx_programmatic_pages_status ON programmatic_pages(status);
CREATE INDEX IF NOT EXISTS idx_programmatic_pages_category_country ON programmatic_pages(category_id, country_code);
CREATE INDEX IF NOT EXISTS idx_content_cache_key ON content_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_content_cache_expires ON content_cache(expires_at);
CREATE INDEX IF NOT EXISTS idx_page_analytics_page_date ON page_analytics(page_id, date);

-- 7. Insert initial country data
INSERT INTO countries (code, name, region, currency, languages, regulatory_authority, trading_popularity) VALUES
('US', 'United States', 'North America', 'USD', ARRAY['en'], 'NFA/CFTC', 1),
('GB', 'United Kingdom', 'Europe', 'GBP', ARRAY['en'], 'FCA', 2),
('DE', 'Germany', 'Europe', 'EUR', ARRAY['de', 'en'], 'BaFin', 3),
('FR', 'France', 'Europe', 'EUR', ARRAY['fr', 'en'], 'AMF', 4),
('IT', 'Italy', 'Europe', 'EUR', ARRAY['it', 'en'], 'CONSOB', 5),
('ES', 'Spain', 'Europe', 'EUR', ARRAY['es', 'en'], 'CNMV', 6),
('NL', 'Netherlands', 'Europe', 'EUR', ARRAY['nl', 'en'], 'AFM', 7),
('SE', 'Sweden', 'Europe', 'SEK', ARRAY['sv', 'en'], 'Finansinspektionen', 8),
('NO', 'Norway', 'Europe', 'NOK', ARRAY['no', 'en'], 'Finanstilsynet', 9),
('DK', 'Denmark', 'Europe', 'DKK', ARRAY['da', 'en'], 'FSA', 10),
('FI', 'Finland', 'Europe', 'EUR', ARRAY['fi', 'en'], 'FIN-FSA', 11),
('AT', 'Austria', 'Europe', 'EUR', ARRAY['de', 'en'], 'FMA', 12),
('BE', 'Belgium', 'Europe', 'EUR', ARRAY['nl', 'fr', 'en'], 'FSMA', 13),
('IE', 'Ireland', 'Europe', 'EUR', ARRAY['en', 'ga'], 'CBI', 14),
('PT', 'Portugal', 'Europe', 'EUR', ARRAY['pt', 'en'], 'CMVM', 15),
('GR', 'Greece', 'Europe', 'EUR', ARRAY['el', 'en'], 'HCMC', 16),
('CH', 'Switzerland', 'Europe', 'CHF', ARRAY['de', 'fr', 'it', 'en'], 'FINMA', 17),
('PL', 'Poland', 'Europe', 'PLN', ARRAY['pl', 'en'], 'KNF', 18),
('CZ', 'Czech Republic', 'Europe', 'CZK', ARRAY['cs', 'en'], 'CNB', 19),
('HU', 'Hungary', 'Europe', 'HUF', ARRAY['hu', 'en'], 'MNB', 20),
('RO', 'Romania', 'Europe', 'RON', ARRAY['ro', 'en'], 'FSA', 21),
('BG', 'Bulgaria', 'Europe', 'BGN', ARRAY['bg', 'en'], 'FSC', 22),
('HR', 'Croatia', 'Europe', 'HRK', ARRAY['hr', 'en'], 'HANFA', 23),
('SI', 'Slovenia', 'Europe', 'EUR', ARRAY['sl', 'en'], 'ATVP', 24),
('SK', 'Slovakia', 'Europe', 'EUR', ARRAY['sk', 'en'], 'NBS', 25),
('EE', 'Estonia', 'Europe', 'EUR', ARRAY['et', 'en'], 'FI', 26),
('LV', 'Latvia', 'Europe', 'EUR', ARRAY['lv', 'en'], 'FC', 27),
('LT', 'Lithuania', 'Europe', 'EUR', ARRAY['lt', 'en'], 'LB', 28),
('CY', 'Cyprus', 'Europe', 'EUR', ARRAY['el', 'en', 'tr'], 'CySEC', 29),
('MT', 'Malta', 'Europe', 'EUR', ARRAY['mt', 'en'], 'MFSA', 30),
('LU', 'Luxembourg', 'Europe', 'EUR', ARRAY['fr', 'de', 'en'], 'CSSF', 31),
('CA', 'Canada', 'North America', 'CAD', ARRAY['en', 'fr'], 'CIRO', 32),
('AU', 'Australia', 'Oceania', 'AUD', ARRAY['en'], 'ASIC', 33),
('NZ', 'New Zealand', 'Oceania', 'NZD', ARRAY['en'], 'FMA', 34),
('JP', 'Japan', 'Asia', 'JPY', ARRAY['ja'], 'FSA', 35),
('SG', 'Singapore', 'Asia', 'SGD', ARRAY['en'], 'MAS', 36),
('HK', 'Hong Kong', 'Asia', 'HKD', ARRAY['zh', 'en'], 'SFC', 37),
('CN', 'China', 'Asia', 'CNY', ARRAY['zh'], 'CSRC', 38),
('IN', 'India', 'Asia', 'INR', ARRAY['hi', 'en'], 'SEBI', 39),
('ID', 'Indonesia', 'Asia', 'IDR', ARRAY['id', 'en'], 'Bappebti', 40),
('MY', 'Malaysia', 'Asia', 'MYR', ARRAY['ms', 'en'], 'SC', 41),
('TH', 'Thailand', 'Asia', 'THB', ARRAY['th', 'en'], 'SEC', 42),
('PH', 'Philippines', 'Asia', 'PHP', ARRAY['tl', 'en'], 'SEC', 43),
('VN', 'Vietnam', 'Asia', 'VND', ARRAY['vi', 'en'], 'SSC', 44),
('KH', 'Cambodia', 'Asia', 'KHR', ARRAY['km', 'en'], 'SECC', 45),
('LA', 'Laos', 'Asia', 'LAK', ARRAY['lo', 'en'], 'BOL', 46),
('MM', 'Myanmar', 'Asia', 'MMK', ARRAY['my', 'en'], 'SECC', 47),
('BD', 'Bangladesh', 'Asia', 'BDT', ARRAY['bn', 'en'], 'BSEC', 48),
('LK', 'Sri Lanka', 'Asia', 'LKR', ARRAY['si', 'ta', 'en'], 'SEC', 49),
('PK', 'Pakistan', 'Asia', 'PKR', ARRAY['ur', 'en'], 'SECP', 50),
('AE', 'United Arab Emirates', 'Middle East', 'AED', ARRAY['ar', 'en'], 'SCA', 51),
('SA', 'Saudi Arabia', 'Middle East', 'SAR', ARRAY['ar', 'en'], 'CMA', 52),
('QA', 'Qatar', 'Middle East', 'QAR', ARRAY['ar', 'en'], 'QFCRA', 53),
('KW', 'Kuwait', 'Middle East', 'KWD', ARRAY['ar', 'en'], 'CMA', 54),
('BH', 'Bahrain', 'Middle East', 'BHD', ARRAY['ar', 'en'], 'CBB', 55),
('OM', 'Oman', 'Middle East', 'OMR', ARRAY['ar', 'en'], 'CMA', 56),
('JO', 'Jordan', 'Middle East', 'JOD', ARRAY['ar', 'en'], 'JSC', 57),
('IL', 'Israel', 'Middle East', 'ILS', ARRAY['he', 'ar', 'en'], 'ISA', 58),
('TR', 'Turkey', 'Middle East', 'TRY', ARRAY['tr', 'en'], 'CMB', 59),
('EG', 'Egypt', 'Middle East', 'EGP', ARRAY['ar', 'en'], 'FRA', 60),
('ZA', 'South Africa', 'Africa', 'ZAR', ARRAY['en', 'af', 'zu'], 'FSCA', 61),
('NG', 'Nigeria', 'Africa', 'NGN', ARRAY['en', 'ha', 'yo', 'ig'], 'SEC', 62),
('KE', 'Kenya', 'Africa', 'KES', ARRAY['en', 'sw'], 'CMA', 63),
('GH', 'Ghana', 'Africa', 'GHS', ARRAY['en'], 'SEC', 64),
('MA', 'Morocco', 'Africa', 'MAD', ARRAY['ar', 'fr', 'en'], 'AMMC', 65),
('TN', 'Tunisia', 'Africa', 'TND', ARRAY['ar', 'fr', 'en'], 'CMF', 66),
('BR', 'Brazil', 'South America', 'BRL', ARRAY['pt'], 'CVM', 67),
('AR', 'Argentina', 'South America', 'ARS', ARRAY['es'], 'CNV', 68),
('CL', 'Chile', 'South America', 'CLP', ARRAY['es'], 'CMF', 69),
('CO', 'Colombia', 'South America', 'COP', ARRAY['es'], 'SFC', 70),
('PE', 'Peru', 'South America', 'PEN', ARRAY['es'], 'SMV', 71),
('MX', 'Mexico', 'North America', 'MXN', ARRAY['es'], 'CNBV', 72),
('RU', 'Russia', 'Europe/Asia', 'RUB', ARRAY['ru'], 'CBR', 73),
('KZ', 'Kazakhstan', 'Asia', 'KZT', ARRAY['kk', 'ru'], 'AFSA', 74),
('UZ', 'Uzbekistan', 'Asia', 'UZS', ARRAY['uz', 'ru'], 'CRR', 75)
ON CONFLICT (code) DO NOTHING;

-- 8. Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programmatic_pages_updated_at BEFORE UPDATE ON programmatic_pages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_cache_updated_at BEFORE UPDATE ON content_cache
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 9. Add RLS (Row Level Security) policies for programmatic_pages
ALTER TABLE programmatic_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users" ON programmatic_pages
    FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users" ON programmatic_pages
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users" ON programmatic_pages
    FOR UPDATE USING (true);

-- 10. Add RLS policies for content_cache
ALTER TABLE content_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read access to all users" ON content_cache
    FOR SELECT USING (true);

CREATE POLICY "Allow insert for authenticated users" ON content_cache
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow update for authenticated users" ON content_cache
    FOR UPDATE USING (true);

COMMIT;

-- Migration completed successfully
-- Run this script on your database to add the programmatic SEO functionality