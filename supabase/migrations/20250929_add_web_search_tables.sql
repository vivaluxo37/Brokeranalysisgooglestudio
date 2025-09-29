-- Migration to add web search integration tables
-- Run this in your Supabase SQL editor

-- Data Sources table for source reliability management
CREATE TABLE IF NOT EXISTS data_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    domain VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('regulatory', 'news', 'review', 'broker_official', 'analysis')),
    reliability_score DECIMAL(3,1) DEFAULT 5.0 CHECK (reliability_score >= 1.0 AND reliability_score <= 10.0),
    success_rate DECIMAL(3,2) DEFAULT 0.5 CHECK (success_rate >= 0.0 AND success_rate <= 1.0),
    total_checks INTEGER DEFAULT 0,
    successful_checks INTEGER DEFAULT 0,
    last_reviewed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Source Verifications table to track verification history
CREATE TABLE IF NOT EXISTS source_verifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id VARCHAR(255) NOT NULL,
    domain VARCHAR(255) NOT NULL,
    broker_name VARCHAR(255) NOT NULL,
    data_type VARCHAR(255) NOT NULL,
    is_accurate BOOLEAN NOT NULL,
    confidence DECIMAL(3,2) NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    notes TEXT
);

-- Broker Discrepancies table for cross-verification engine
CREATE TABLE IF NOT EXISTS broker_discrepancies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id VARCHAR(255) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    db_value TEXT,
    web_value TEXT,
    confidence_score DECIMAL(3,2) NOT NULL,
    sources_checked TEXT[],
    tolerance_exceeded BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolution_notes TEXT
);

-- Broker Update Queue table for manual review process
CREATE TABLE IF NOT EXISTS broker_update_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id VARCHAR(255) NOT NULL,
    proposed_changes JSONB NOT NULL,
    confidence_score DECIMAL(3,2) NOT NULL,
    sources JSONB NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'in_review')),
    reviewed_by UUID,
    reviewed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical'))
);

-- Broker Change Log table for audit trail
CREATE TABLE IF NOT EXISTS broker_change_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id VARCHAR(255) NOT NULL,
    field_name VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    change_reason TEXT,
    confidence_score DECIMAL(3,2),
    sources_used JSONB,
    user_id UUID,
    change_type VARCHAR(50) DEFAULT 'update' CHECK (change_type IN ('update', 'correction', 'verification', 'manual')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Regulatory Checks Cache table for regulatory authority verification
CREATE TABLE IF NOT EXISTS regulatory_checks_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_name VARCHAR(255) NOT NULL,
    authority VARCHAR(50) NOT NULL,
    license_number VARCHAR(255),
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'suspended', 'revoked', 'not_found', 'error')),
    confidence DECIMAL(3,2) NOT NULL,
    details JSONB,
    verified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
    source VARCHAR(255) NOT NULL,
    UNIQUE(broker_name, authority, license_number)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_data_sources_category ON data_sources(category);
CREATE INDEX IF NOT EXISTS idx_data_sources_reliability ON data_sources(reliability_score DESC);
CREATE INDEX IF NOT EXISTS idx_data_sources_domain ON data_sources(domain);

CREATE INDEX IF NOT EXISTS idx_source_verifications_domain ON source_verifications(domain);
CREATE INDEX IF NOT EXISTS idx_source_verifications_broker ON source_verifications(broker_name);
CREATE INDEX IF NOT EXISTS idx_source_verifications_date ON source_verifications(verified_at);

CREATE INDEX IF NOT EXISTS idx_broker_discrepancies_broker_id ON broker_discrepancies(broker_id);
CREATE INDEX IF NOT EXISTS idx_broker_discrepancies_field ON broker_discrepancies(field_name);
CREATE INDEX IF NOT EXISTS idx_broker_discrepancies_unresolved ON broker_discrepancies(broker_id, resolved_at) WHERE resolved_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_broker_update_queue_status ON broker_update_queue(status);
CREATE INDEX IF NOT EXISTS idx_broker_update_queue_priority ON broker_update_queue(priority, created_at);
CREATE INDEX IF NOT EXISTS idx_broker_update_queue_broker ON broker_update_queue(broker_id);

CREATE INDEX IF NOT EXISTS idx_broker_change_log_broker_id ON broker_change_log(broker_id);
CREATE INDEX IF NOT EXISTS idx_broker_change_log_field ON broker_change_log(field_name);
CREATE INDEX IF NOT EXISTS idx_broker_change_log_date ON broker_change_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_broker_change_log_user ON broker_change_log(user_id);

CREATE INDEX IF NOT EXISTS idx_regulatory_checks_cache_broker ON regulatory_checks_cache(broker_name, authority);
CREATE INDEX IF NOT EXISTS idx_regulatory_checks_cache_expires ON regulatory_checks_cache(expires_at);

-- Set up Row Level Security (RLS) policies
ALTER TABLE data_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE source_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_discrepancies ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_update_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_change_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE regulatory_checks_cache ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access (adjust based on your security requirements)
CREATE POLICY IF NOT EXISTS "Allow public read access to data sources" ON data_sources 
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow public read access to source verifications" ON source_verifications 
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow public read access to broker discrepancies" ON broker_discrepancies 
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow public read access to broker update queue" ON broker_update_queue 
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow public read access to broker change log" ON broker_change_log 
    FOR SELECT USING (true);

CREATE POLICY IF NOT EXISTS "Allow public read access to regulatory checks cache" ON regulatory_checks_cache 
    FOR SELECT USING (true);

-- Create policies for service role access (full access)
CREATE POLICY IF NOT EXISTS "Allow service role full access to data sources" ON data_sources 
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Allow service role full access to source verifications" ON source_verifications 
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Allow service role full access to broker discrepancies" ON broker_discrepancies 
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Allow service role full access to broker update queue" ON broker_update_queue 
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Allow service role full access to broker change log" ON broker_change_log 
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY IF NOT EXISTS "Allow service role full access to regulatory checks cache" ON regulatory_checks_cache 
    FOR ALL USING (auth.role() = 'service_role');

-- Insert initial data sources
INSERT INTO data_sources (domain, name, category, reliability_score, success_rate, total_checks, successful_checks, last_reviewed, is_active)
VALUES 
    ('fca.org.uk', 'Financial Conduct Authority', 'regulatory', 10.0, 0.95, 0, 0, NOW(), true),
    ('asic.gov.au', 'Australian Securities and Investments Commission', 'regulatory', 10.0, 0.95, 0, 0, NOW(), true),
    ('cysec.gov.cy', 'Cyprus Securities and Exchange Commission', 'regulatory', 10.0, 0.90, 0, 0, NOW(), true),
    ('finra.org', 'Financial Industry Regulatory Authority', 'regulatory', 10.0, 0.95, 0, 0, NOW(), true),
    ('sec.gov', 'Securities and Exchange Commission', 'regulatory', 10.0, 0.95, 0, 0, NOW(), true),
    
    ('forexpeacearmy.com', 'Forex Peace Army', 'review', 8.0, 0.80, 0, 0, NOW(), true),
    ('fxempire.com', 'FX Empire', 'analysis', 7.0, 0.75, 0, 0, NOW(), true),
    ('babypips.com', 'Baby Pips', 'analysis', 7.0, 0.75, 0, 0, NOW(), true),
    ('dailyfx.com', 'DailyFX', 'analysis', 7.0, 0.75, 0, 0, NOW(), true),
    ('investopedia.com', 'Investopedia', 'analysis', 8.0, 0.85, 0, 0, NOW(), true),
    ('financemagnates.com', 'Finance Magnates', 'news', 7.0, 0.75, 0, 0, NOW(), true),
    
    ('bloomberg.com', 'Bloomberg', 'news', 8.0, 0.85, 0, 0, NOW(), true),
    ('reuters.com', 'Reuters', 'news', 8.0, 0.85, 0, 0, NOW(), true),
    ('ft.com', 'Financial Times', 'news', 8.0, 0.85, 0, 0, NOW(), true),
    ('wsj.com', 'Wall Street Journal', 'news', 8.0, 0.85, 0, 0, NOW(), true)
ON CONFLICT (domain) DO NOTHING;

-- Create a function to clean up expired regulatory checks
CREATE OR REPLACE FUNCTION cleanup_expired_regulatory_checks()
RETURNS void AS $$
BEGIN
    DELETE FROM regulatory_checks_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Create a function to update source reliability scores
CREATE OR REPLACE FUNCTION update_source_reliability(
    p_domain VARCHAR(255),
    p_is_accurate BOOLEAN,
    p_confidence DECIMAL(3,2)
)
RETURNS void AS $$
DECLARE
    current_source RECORD;
    new_score DECIMAL(3,1);
BEGIN
    -- Get current source data
    SELECT * INTO current_source FROM data_sources WHERE domain = p_domain;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Source with domain % not found', p_domain;
    END IF;
    
    -- Calculate new reliability score
    -- Simple algorithm: adjust based on accuracy and confidence
    IF p_is_accurate AND p_confidence > 0.7 THEN
        new_score := LEAST(10.0, current_source.reliability_score + 0.1);
    ELSIF p_is_accurate AND p_confidence > 0.5 THEN
        new_score := LEAST(10.0, current_source.reliability_score + 0.05);
    ELSIF NOT p_is_accurate THEN
        new_score := GREATEST(1.0, current_source.reliability_score - 0.2);
    ELSE
        new_score := current_source.reliability_score;
    END IF;
    
    -- Update the source
    UPDATE data_sources 
    SET 
        reliability_score = new_score,
        total_checks = total_checks + 1,
        successful_checks = successful_checks + CASE WHEN p_is_accurate AND p_confidence > 0.5 THEN 1 ELSE 0 END,
        success_rate = (successful_checks + CASE WHEN p_is_accurate AND p_confidence > 0.5 THEN 1 ELSE 0 END) / (total_checks + 1)::DECIMAL,
        last_reviewed = NOW(),
        updated_at = NOW()
    WHERE domain = p_domain;
END;
$$ LANGUAGE plpgsql;

COMMENT ON TABLE data_sources IS 'Tracks reliability and performance of different data sources used for broker verification';
COMMENT ON TABLE source_verifications IS 'Historical log of verification attempts and their outcomes';
COMMENT ON TABLE broker_discrepancies IS 'Records differences found between database data and web-sourced data';
COMMENT ON TABLE broker_update_queue IS 'Queue of pending broker data updates for manual review';
COMMENT ON TABLE broker_change_log IS 'Audit trail of all changes made to broker data';
COMMENT ON TABLE regulatory_checks_cache IS 'Cache for regulatory authority verification results';

COMMENT ON FUNCTION cleanup_expired_regulatory_checks() IS 'Removes expired regulatory verification cache entries';
COMMENT ON FUNCTION update_source_reliability(VARCHAR, BOOLEAN, DECIMAL) IS 'Updates source reliability scores based on verification outcomes';