-- Best Brokers Directory Database Extensions
-- Add required tables for SEO-optimized broker directory system

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add missing columns to brokers table for category classification
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS execution_type TEXT DEFAULT 'Market Maker';
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS supports_scalping BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS supports_hedging BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS supports_api_trading BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS has_raw_spreads BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS offers_pamm BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS supports_hft BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS has_trailing_stops BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS offers_micro_accounts BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS is_offshore BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS offers_corporate_accounts BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS no_deposit_required BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS max_leverage INTEGER DEFAULT 100;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS supports_crypto_cfds BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS offers_islamic_accounts BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS supports_tradingview BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS offers_stock_cfds BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS supported_countries JSONB DEFAULT '[]';
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS prohibited_countries JSONB DEFAULT '[]';
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS supports_mt4 BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS supports_mt5 BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS eurusd_spread DECIMAL(5,2) DEFAULT 1.0;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS fixed_spreads BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS instant_execution BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS dma_access BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS no_dealing_desk BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS stp_execution BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS a_book_execution BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS high_leverage_available BOOLEAN DEFAULT FALSE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS suitable_for_beginners BOOLEAN DEFAULT TRUE;
ALTER TABLE brokers ADD COLUMN IF NOT EXISTS copy_trading_available BOOLEAN DEFAULT FALSE;

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_brokers_execution_type ON brokers(execution_type);
CREATE INDEX IF NOT EXISTS idx_brokers_supports_scalping ON brokers(supports_scalping);
CREATE INDEX IF NOT EXISTS idx_brokers_supports_mt4 ON brokers(supports_mt4);
CREATE INDEX IF NOT EXISTS idx_brokers_supports_mt5 ON brokers(supports_mt5);
CREATE INDEX IF NOT EXISTS idx_brokers_offers_islamic ON brokers(offers_islamic_accounts);
CREATE INDEX IF NOT EXISTS idx_brokers_eurusd_spread ON brokers(eurusd_spread);
CREATE INDEX IF NOT EXISTS idx_brokers_max_leverage ON brokers(max_leverage);
CREATE INDEX IF NOT EXISTS idx_brokers_suitable_beginners ON brokers(suitable_for_beginners);

-- Country verification cache table
CREATE TABLE IF NOT EXISTS country_verifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id VARCHAR(255) REFERENCES brokers(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL, -- ISO 3166-1 alpha-2
  country_name VARCHAR(255) NOT NULL,
  status VARCHAR(50) CHECK (status IN ('available', 'prohibited', 'check-manually', 'pending')) DEFAULT 'pending',
  evidence JSONB DEFAULT '[]',
  confidence_score INTEGER CHECK (confidence_score >= 0 AND confidence_score <= 100) DEFAULT 0,
  search_queries_used TEXT[],
  sources_found JSONB DEFAULT '[]',
  verification_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  verified_by VARCHAR(50) DEFAULT 'automated',
  manual_override BOOLEAN DEFAULT FALSE,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(broker_id, country_code)
);

-- Generated content cache table for LLM outputs
CREATE TABLE IF NOT EXISTS generated_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_type VARCHAR(50) NOT NULL, -- 'category_summary', 'faq', 'country_intro', 'broker_country_note'
  reference_slug VARCHAR(255) NOT NULL,
  content_language VARCHAR(5) DEFAULT 'en',
  content JSONB NOT NULL,
  prompt_used TEXT,
  model_used VARCHAR(50) DEFAULT 'gemini-1.5-pro',
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '30 days'),
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMP WITH TIME ZONE,
  is_approved BOOLEAN DEFAULT FALSE,
  admin_edited BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(content_type, reference_slug, content_language)
);

-- Page metadata for SEO management
CREATE TABLE IF NOT EXISTS page_metadata (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_type VARCHAR(50) NOT NULL, -- 'category', 'country', 'main-index'
  slug VARCHAR(255) NOT NULL UNIQUE,
  title TEXT NOT NULL,
  meta_description TEXT,
  keywords TEXT[],
  canonical_url TEXT,
  og_title TEXT,
  og_description TEXT,
  og_image_url TEXT,
  structured_data JSONB,
  hreflang_alternates JSONB DEFAULT '{}',
  priority DECIMAL(2,1) DEFAULT 0.7,
  change_frequency VARCHAR(20) DEFAULT 'weekly',
  robots_meta VARCHAR(100) DEFAULT 'index,follow',
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Broker category mappings (for efficient querying)
CREATE TABLE IF NOT EXISTS broker_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  broker_id VARCHAR(255) REFERENCES brokers(id) ON DELETE CASCADE,
  category_slug VARCHAR(255) NOT NULL,
  category_name VARCHAR(255) NOT NULL,
  category_type VARCHAR(50) NOT NULL, -- 'execution', 'strategy', 'features', 'general'
  relevance_score INTEGER DEFAULT 100, -- 0-100, higher = more relevant
  auto_assigned BOOLEAN DEFAULT TRUE,
  manual_override BOOLEAN DEFAULT FALSE,
  reasoning TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(broker_id, category_slug)
);

-- Broker rankings cache (for performance)
CREATE TABLE IF NOT EXISTS broker_rankings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_slug VARCHAR(255),
  country_code VARCHAR(2),
  broker_id VARCHAR(255) REFERENCES brokers(id) ON DELETE CASCADE,
  rank_position INTEGER NOT NULL,
  total_score DECIMAL(5,2) NOT NULL,
  score_breakdown JSONB NOT NULL, -- {regulation: 95, cost: 85, features: 90, ...}
  reasoning TEXT,
  calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(category_slug, country_code, broker_id)
);

-- Web search cache (to avoid repeated API calls)
CREATE TABLE IF NOT EXISTS web_search_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  query_hash VARCHAR(64) UNIQUE NOT NULL, -- SHA256 of search query
  search_query TEXT NOT NULL,
  search_type VARCHAR(50) DEFAULT 'country_verification',
  results JSONB NOT NULL,
  source_engine VARCHAR(50) DEFAULT 'google',
  results_count INTEGER DEFAULT 0,
  search_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  used_count INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Admin activity log
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_user_id UUID,
  action_type VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id VARCHAR(255),
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_country_verifications_broker_id ON country_verifications(broker_id);
CREATE INDEX IF NOT EXISTS idx_country_verifications_country_code ON country_verifications(country_code);
CREATE INDEX IF NOT EXISTS idx_country_verifications_status ON country_verifications(status);
CREATE INDEX IF NOT EXISTS idx_country_verifications_expires_at ON country_verifications(expires_at);

CREATE INDEX IF NOT EXISTS idx_generated_content_type_slug ON generated_content(content_type, reference_slug);
CREATE INDEX IF NOT EXISTS idx_generated_content_expires_at ON generated_content(expires_at);
CREATE INDEX IF NOT EXISTS idx_generated_content_approved ON generated_content(is_approved);

CREATE INDEX IF NOT EXISTS idx_page_metadata_page_type ON page_metadata(page_type);
CREATE INDEX IF NOT EXISTS idx_page_metadata_slug ON page_metadata(slug);

CREATE INDEX IF NOT EXISTS idx_broker_categories_category_slug ON broker_categories(category_slug);
CREATE INDEX IF NOT EXISTS idx_broker_categories_category_type ON broker_categories(category_type);
CREATE INDEX IF NOT EXISTS idx_broker_categories_relevance_score ON broker_categories(relevance_score DESC);

CREATE INDEX IF NOT EXISTS idx_broker_rankings_category_slug ON broker_rankings(category_slug);
CREATE INDEX IF NOT EXISTS idx_broker_rankings_country_code ON broker_rankings(country_code);
CREATE INDEX IF NOT EXISTS idx_broker_rankings_rank_position ON broker_rankings(rank_position);
CREATE INDEX IF NOT EXISTS idx_broker_rankings_expires_at ON broker_rankings(expires_at);

CREATE INDEX IF NOT EXISTS idx_web_search_cache_query_hash ON web_search_cache(query_hash);
CREATE INDEX IF NOT EXISTS idx_web_search_cache_expires_at ON web_search_cache(expires_at);

CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin_user_id ON admin_activity_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_action_type ON admin_activity_log(action_type);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at DESC);

-- Enable RLS on new tables
ALTER TABLE country_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_metadata ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_rankings ENABLE ROW LEVEL SECURITY;
ALTER TABLE web_search_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Public read access for most tables (they contain non-sensitive data)
CREATE POLICY "Allow public read access" ON country_verifications
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON generated_content
  FOR SELECT USING (is_approved = true);

CREATE POLICY "Allow public read access" ON page_metadata
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON broker_categories
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access" ON broker_rankings
  FOR SELECT USING (true);

-- Admin-only access for sensitive operations
CREATE POLICY "Admin full access" ON country_verifications
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access" ON generated_content
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access" ON page_metadata
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin full access" ON admin_activity_log
  FOR ALL USING (auth.jwt() ->> 'role' = 'admin');

-- Functions for automated updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at columns
CREATE TRIGGER update_country_verifications_updated_at 
  BEFORE UPDATE ON country_verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_generated_content_updated_at 
  BEFORE UPDATE ON generated_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_page_metadata_updated_at 
  BEFORE UPDATE ON page_metadata
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_broker_categories_updated_at 
  BEFORE UPDATE ON broker_categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
BEGIN
  -- Clean expired country verifications
  DELETE FROM country_verifications WHERE expires_at < NOW() AND manual_override = FALSE;
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Clean expired generated content
  DELETE FROM generated_content WHERE expires_at < NOW() AND admin_edited = FALSE;
  
  -- Clean expired broker rankings
  DELETE FROM broker_rankings WHERE expires_at < NOW();
  
  -- Clean expired web search cache
  DELETE FROM web_search_cache WHERE expires_at < NOW();
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-assign broker categories based on attributes
CREATE OR REPLACE FUNCTION assign_broker_categories()
RETURNS INTEGER AS $$
DECLARE
  broker_record RECORD;
  assigned_count INTEGER := 0;
BEGIN
  FOR broker_record IN SELECT * FROM brokers WHERE is_active = true
  LOOP
    -- Clear existing auto-assigned categories
    DELETE FROM broker_categories 
    WHERE broker_id = broker_record.id AND auto_assigned = true;
    
    -- Assign execution-based categories
    IF broker_record.execution_type = 'ECN' THEN
      INSERT INTO broker_categories (broker_id, category_slug, category_name, category_type, relevance_score)
      VALUES (broker_record.id, 'ecn-brokers', 'ECN Brokers', 'execution', 100)
      ON CONFLICT (broker_id, category_slug) DO NOTHING;
      assigned_count := assigned_count + 1;
    END IF;
    
    IF broker_record.execution_type = 'STP' OR broker_record.stp_execution = true THEN
      INSERT INTO broker_categories (broker_id, category_slug, category_name, category_type, relevance_score)
      VALUES (broker_record.id, 'stp-forex-brokers', 'STP Forex Brokers', 'execution', 95)
      ON CONFLICT (broker_id, category_slug) DO NOTHING;
      assigned_count := assigned_count + 1;
    END IF;
    
    IF broker_record.no_dealing_desk = true THEN
      INSERT INTO broker_categories (broker_id, category_slug, category_name, category_type, relevance_score)
      VALUES (broker_record.id, 'no-dealing-desk', 'No Dealing Desk', 'execution', 90)
      ON CONFLICT (broker_id, category_slug) DO NOTHING;
      assigned_count := assigned_count + 1;
    END IF;
    
    IF broker_record.instant_execution = true THEN
      INSERT INTO broker_categories (broker_id, category_slug, category_name, category_type, relevance_score)
      VALUES (broker_record.id, 'instant-execution-brokers', 'Instant Execution Brokers', 'execution', 85)
      ON CONFLICT (broker_id, category_slug) DO NOTHING;
      assigned_count := assigned_count + 1;
    END IF;
    
    -- Assign strategy-based categories
    IF broker_record.supports_scalping = true THEN
      INSERT INTO broker_categories (broker_id, category_slug, category_name, category_type, relevance_score)
      VALUES (broker_record.id, 'scalping-brokers', 'Scalping Brokers', 'strategy', 100)
      ON CONFLICT (broker_id, category_slug) DO NOTHING;
      assigned_count := assigned_count + 1;
    END IF;
    
    IF broker_record.supports_hft = true THEN
      INSERT INTO broker_categories (broker_id, category_slug, category_name, category_type, relevance_score)
      VALUES (broker_record.id, 'hft-brokers', 'HFT Brokers', 'strategy', 95)
      ON CONFLICT (broker_id, category_slug) DO NOTHING;
      assigned_count := assigned_count + 1;
    END IF;
    
    IF broker_record.suitable_for_beginners = true THEN
      INSERT INTO broker_categories (broker_id, category_slug, category_name, category_type, relevance_score)
      VALUES (broker_record.id, 'forex-brokers-for-beginners', 'Forex Brokers for Beginners', 'strategy', 80)
      ON CONFLICT (broker_id, category_slug) DO NOTHING;
      assigned_count := assigned_count + 1;
    END IF;
    
    -- Assign feature-based categories
    IF broker_record.supports_mt4 = true THEN
      INSERT INTO broker_categories (broker_id, category_slug, category_name, category_type, relevance_score)
      VALUES (broker_record.id, 'mt4-brokers', 'MT4 Brokers', 'features', 90)
      ON CONFLICT (broker_id, category_slug) DO NOTHING;
      assigned_count := assigned_count + 1;
    END IF;
    
    IF broker_record.supports_mt5 = true THEN
      INSERT INTO broker_categories (broker_id, category_slug, category_name, category_type, relevance_score)
      VALUES (broker_record.id, 'mt5-brokers', 'MT5 Brokers', 'features', 90)
      ON CONFLICT (broker_id, category_slug) DO NOTHING;
      assigned_count := assigned_count + 1;
    END IF;
    
    IF broker_record.offers_islamic_accounts = true THEN
      INSERT INTO broker_categories (broker_id, category_slug, category_name, category_type, relevance_score)
      VALUES (broker_record.id, 'islamic-accounts', 'Islamic Accounts', 'features', 100)
      ON CONFLICT (broker_id, category_slug) DO NOTHING;
      assigned_count := assigned_count + 1;
    END IF;
    
    IF broker_record.supports_crypto_cfds = true THEN
      INSERT INTO broker_categories (broker_id, category_slug, category_name, category_type, relevance_score)
      VALUES (broker_record.id, 'crypto-cfd-brokers', 'Crypto CFD Brokers', 'features', 85)
      ON CONFLICT (broker_id, category_slug) DO NOTHING;
      assigned_count := assigned_count + 1;
    END IF;
    
    -- Assign high leverage category
    IF broker_record.max_leverage > 500 THEN
      INSERT INTO broker_categories (broker_id, category_slug, category_name, category_type, relevance_score)
      VALUES (broker_record.id, 'forex-brokers-with-high-leverage', 'Forex Brokers With High Leverage', 'features', 90)
      ON CONFLICT (broker_id, category_slug) DO NOTHING;
      assigned_count := assigned_count + 1;
    END IF;
    
    -- Assign minimum deposit categories
    IF broker_record.min_deposit_amount = 0 OR broker_record.no_deposit_required = true THEN
      INSERT INTO broker_categories (broker_id, category_slug, category_name, category_type, relevance_score)
      VALUES (broker_record.id, 'forex-brokers-with-no-minimum-deposit', 'Forex Brokers With No Minimum Deposit', 'features', 100)
      ON CONFLICT (broker_id, category_slug) DO NOTHING;
      assigned_count := assigned_count + 1;
    END IF;
    
  END LOOP;
  
  RETURN assigned_count;
END;
$$ LANGUAGE plpgsql;

-- Create initial page metadata for main index
INSERT INTO page_metadata (page_type, slug, title, meta_description, keywords, priority)
VALUES (
  'main-index',
  'best-brokers',
  'Best Forex Brokers 2025 — Compare Top Trading Brokers | BrokerAnalysis',
  'Discover the best forex brokers of 2025. Compare spreads, regulation, features & more. Expert reviews of 75+ brokers with detailed analysis and ratings.',
  ARRAY['best forex brokers', 'forex broker comparison', 'trading brokers 2025', 'regulated brokers'],
  1.0
) ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  meta_description = EXCLUDED.meta_description,
  updated_at = NOW();

-- Comments for documentation
COMMENT ON TABLE country_verifications IS 'Cache for broker availability verification in different countries';
COMMENT ON TABLE generated_content IS 'Cache for AI-generated content (summaries, FAQs, etc.)';
COMMENT ON TABLE page_metadata IS 'SEO metadata for all pages in the broker directory';
COMMENT ON TABLE broker_categories IS 'Many-to-many mapping of brokers to directory categories';
COMMENT ON TABLE broker_rankings IS 'Cached ranking results for category/country combinations';
COMMENT ON TABLE web_search_cache IS 'Cache for web search results to avoid API rate limits';
COMMENT ON TABLE admin_activity_log IS 'Audit log for administrative actions';

-- Final message
DO $$
BEGIN
  RAISE NOTICE 'Best Brokers Directory tables created successfully!';
  RAISE NOTICE 'Run SELECT assign_broker_categories(); to auto-assign initial categories';
  RAISE NOTICE 'Run SELECT clean_expired_cache(); periodically to clean old cache entries';
END $$;