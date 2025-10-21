-- Migration 002: Add Country Verification System Tables
-- This migration adds the necessary tables for the Country Verification System (Phase 4)
-- to track regulatory compliance, verification status, evidence storage, and regulatory authorities

-- 1. Create country_regulations table to store regulatory requirements by country
CREATE TABLE IF NOT EXISTS country_regulations (
  id SERIAL PRIMARY KEY,
  country_code VARCHAR(2) NOT NULL REFERENCES countries(code) ON DELETE CASCADE,
  regulation_type VARCHAR(50) NOT NULL, -- 'trading', 'forex', 'crypto', 'securities', 'derivatives'
  regulation_name VARCHAR(200) NOT NULL,
  regulation_description TEXT,
  minimum_capital_requirement DECIMAL(15,2), -- Minimum capital in local currency
  leverage_limit INTEGER, -- Maximum leverage allowed (e.g., 30:1 = 30)
  client_fund_protection BOOLEAN DEFAULT TRUE,
  compensation_scheme VARCHAR(100), -- Name of compensation scheme
  compensation_limit DECIMAL(15,2), -- Maximum compensation amount
  reporting_requirements JSONB, -- Array of reporting requirements
  compliance_deadlines JSONB, -- Key compliance deadlines
  prohibited_activities TEXT[], -- Array of prohibited activities
  required_licenses TEXT[], -- Array of required license types
  regulatory_framework TEXT, -- Description of regulatory framework
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(country_code, regulation_type)
);

-- 2. Create regulatory_authorities table to store information about regulatory bodies worldwide
CREATE TABLE IF NOT EXISTS regulatory_authorities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  acronym VARCHAR(20), -- Short name/acronym (e.g., FCA, SEC, ASIC)
  country_code VARCHAR(2) NOT NULL REFERENCES countries(code) ON DELETE CASCADE,
  authority_type VARCHAR(50) NOT NULL, -- 'financial', 'securities', 'banking', 'derivatives'
  jurisdiction VARCHAR(100), -- Primary jurisdiction
  website VARCHAR(255),
  contact_email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  established_year INTEGER,
  regulatory_scope TEXT, -- Description of regulatory scope
  powers TEXT[], -- Array of regulatory powers
  enforcement_actions JSONB, -- Recent enforcement actions summary
  license_types TEXT[], -- Types of licenses issued
  registration_requirements JSONB, -- Requirements for registration
  compliance_guidelines TEXT, -- Link to compliance guidelines
  international_memberships TEXT[], -- International organizations membership
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create broker_verification_tracking table to track verification status for each broker
CREATE TABLE IF NOT EXISTS broker_verification_tracking (
  id SERIAL PRIMARY KEY,
  broker_id INTEGER NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
  country_code VARCHAR(2) NOT NULL REFERENCES countries(code) ON DELETE CASCADE,
  regulatory_authority_id INTEGER REFERENCES regulatory_authorities(id),
  verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'in_progress', 'verified', 'rejected', 'expired', 'suspended'
  verification_level VARCHAR(20) DEFAULT 'basic', -- 'basic', 'standard', 'enhanced', 'premium'
  application_date TIMESTAMP WITH TIME ZONE,
  verification_date TIMESTAMP WITH TIME ZONE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  last_review_date TIMESTAMP WITH TIME ZONE,
  next_review_date TIMESTAMP WITH TIME ZONE,
  license_numbers TEXT[], -- Array of license numbers
  license_status TEXT[], -- Status of each license
  verification_documents JSONB, -- List of required documents and their status
  compliance_score DECIMAL(5,2) DEFAULT 0.0, -- Overall compliance score (0-100)
  risk_level VARCHAR(20) DEFAULT 'medium', -- 'low', 'medium', 'high', 'critical'
  verification_notes TEXT,
  rejection_reason TEXT,
  suspension_reason TEXT,
  conditions JSONB, -- Special conditions or restrictions
  verified_by VARCHAR(100), -- User who verified the broker
  reviewed_by VARCHAR(100), -- User who last reviewed the broker
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(broker_id, country_code)
);

-- 4. Create evidence_storage table to store evidence of regulatory compliance
CREATE TABLE IF NOT EXISTS evidence_storage (
  id SERIAL PRIMARY KEY,
  broker_verification_id INTEGER NOT NULL REFERENCES broker_verification_tracking(id) ON DELETE CASCADE,
  evidence_type VARCHAR(50) NOT NULL, -- 'license', 'certificate', 'financial_statement', 'compliance_report', 'audit_report', 'other'
  evidence_title VARCHAR(200) NOT NULL,
  evidence_description TEXT,
  file_path VARCHAR(500), -- Path to stored file
  file_name VARCHAR(255),
  file_type VARCHAR(50), -- 'pdf', 'jpg', 'png', 'doc', 'docx', etc.
  file_size INTEGER, -- File size in bytes
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expiry_date TIMESTAMP WITH TIME ZONE, -- When evidence expires
  verification_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'verified', 'rejected', 'expired'
  verified_by VARCHAR(100),
  verification_date TIMESTAMP WITH TIME ZONE,
  verification_notes TEXT,
  metadata JSONB, -- Additional metadata about the evidence
  is_public BOOLEAN DEFAULT FALSE, -- Whether evidence can be shown publicly
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create indexes for performance optimization
CREATE INDEX IF NOT EXISTS idx_country_regulations_country_code ON country_regulations(country_code);
CREATE INDEX IF NOT EXISTS idx_country_regulations_type ON country_regulations(regulation_type);
CREATE INDEX IF NOT EXISTS idx_country_regulations_active ON country_regulations(is_active);
CREATE INDEX IF NOT EXISTS idx_regulatory_authorities_country_code ON regulatory_authorities(country_code);
CREATE INDEX IF NOT EXISTS idx_regulatory_authorities_type ON regulatory_authorities(authority_type);
CREATE INDEX IF NOT EXISTS idx_regulatory_authorities_active ON regulatory_authorities(is_active);
CREATE INDEX IF NOT EXISTS idx_broker_verification_broker_country ON broker_verification_tracking(broker_id, country_code);
CREATE INDEX IF NOT EXISTS idx_broker_verification_status ON broker_verification_tracking(verification_status);
CREATE INDEX IF NOT EXISTS idx_broker_verification_level ON broker_verification_tracking(verification_level);
CREATE INDEX IF NOT EXISTS idx_broker_verification_authority ON broker_verification_tracking(regulatory_authority_id);
CREATE INDEX IF NOT EXISTS idx_broker_verification_expiry ON broker_verification_tracking(expiry_date);
CREATE INDEX IF NOT EXISTS idx_broker_verification_active ON broker_verification_tracking(is_active);
CREATE INDEX IF NOT EXISTS idx_evidence_storage_verification_id ON evidence_storage(broker_verification_id);
CREATE INDEX IF NOT EXISTS idx_evidence_storage_type ON evidence_storage(evidence_type);
CREATE INDEX IF NOT EXISTS idx_evidence_storage_status ON evidence_storage(verification_status);
CREATE INDEX IF NOT EXISTS idx_evidence_storage_expiry ON evidence_storage(expiry_date);
CREATE INDEX IF NOT EXISTS idx_evidence_storage_active ON evidence_storage(is_active);

-- 6. Create triggers for updated_at timestamps
CREATE TRIGGER update_country_regulations_updated_at BEFORE UPDATE ON country_regulations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_regulatory_authorities_updated_at BEFORE UPDATE ON regulatory_authorities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_broker_verification_tracking_updated_at BEFORE UPDATE ON broker_verification_tracking
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_evidence_storage_updated_at BEFORE UPDATE ON evidence_storage
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 7. Add Row Level Security (RLS) policies
ALTER TABLE country_regulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to country_regulations" ON country_regulations
    FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated users on country_regulations" ON country_regulations
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users on country_regulations" ON country_regulations
    FOR UPDATE USING (true);

ALTER TABLE regulatory_authorities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to regulatory_authorities" ON regulatory_authorities
    FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated users on regulatory_authorities" ON regulatory_authorities
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users on regulatory_authorities" ON regulatory_authorities
    FOR UPDATE USING (true);

ALTER TABLE broker_verification_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to broker_verification_tracking" ON broker_verification_tracking
    FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated users on broker_verification_tracking" ON broker_verification_tracking
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users on broker_verification_tracking" ON broker_verification_tracking
    FOR UPDATE USING (true);

ALTER TABLE evidence_storage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to evidence_storage" ON evidence_storage
    FOR SELECT USING (true);
CREATE POLICY "Allow insert for authenticated users on evidence_storage" ON evidence_storage
    FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update for authenticated users on evidence_storage" ON evidence_storage
    FOR UPDATE USING (true);

-- 8. Insert initial regulatory authorities data
INSERT INTO regulatory_authorities (name, acronym, country_code, authority_type, jurisdiction, website, established_year) VALUES
('Financial Conduct Authority', 'FCA', 'GB', 'financial', 'United Kingdom', 'https://www.fca.org.uk', 2013),
('National Futures Association', 'NFA', 'US', 'financial', 'United States', 'https://www.nfa.futures.org', 1982),
('Commodity Futures Trading Commission', 'CFTC', 'US', 'financial', 'United States', 'https://www.cftc.gov', 1974),
('Australian Securities and Investments Commission', 'ASIC', 'AU', 'securities', 'Australia', 'https://www.asic.gov.au', 1991),
('Financial Markets Authority', 'FMA', 'NZ', 'financial', 'New Zealand', 'https://www.fma.govt.nz', 2011),
('Financial Services Agency', 'FSA', 'JP', 'financial', 'Japan', 'https://www.fsa.go.jp', 2000),
('Monetary Authority of Singapore', 'MAS', 'SG', 'financial', 'Singapore', 'https://www.mas.gov.sg', 1971),
('Securities and Futures Commission', 'SFC', 'HK', 'securities', 'Hong Kong', 'https://www.sfc.hk', 1989),
('Cyprus Securities and Exchange Commission', 'CySEC', 'CY', 'securities', 'Cyprus', 'https://www.cysec.gov.cy', 2001),
('Financial Supervisory Commission', 'FSC', 'TW', 'financial', 'Taiwan', 'https://www.fsc.gov.tw', 2004),
('Bundesanstalt für Finanzdienstleistungsaufsicht', 'BaFin', 'DE', 'financial', 'Germany', 'https://www.bafin.de', 2002),
('Autorité des Marchés Financiers', 'AMF', 'FR', 'financial', 'France', 'https://www.amf-france.org', 2003),
('Commissione Nazionale per le Società e la Borsa', 'CONSOB', 'IT', 'securities', 'Italy', 'https://www.consob.it', 1974),
('Comisión Nacional del Mercado de Valores', 'CNMV', 'ES', 'securities', 'Spain', 'https://www.cnmv.es', 1988),
('Autoriteit Financiële Markten', 'AFM', 'NL', 'financial', 'Netherlands', 'https://www.afm.nl', 2002),
('Finansinspektionen', 'FI', 'SE', 'financial', 'Sweden', 'https://www.finansinspektionen.se', 1991),
('Finanstilsynet', 'FIN', 'NO', 'financial', 'Norway', 'https://www.finanstilsynet.no', 1986),
('Financial Supervisory Authority', 'FIN-FSA', 'FI', 'financial', 'Finland', 'https://www.finanssivalvonta.fi', 1993),
('Swiss Financial Market Supervisory Authority', 'FINMA', 'CH', 'financial', 'Switzerland', 'https://www.finma.ch', 2007),
('Polish Financial Supervision Authority', 'KNF', 'PL', 'financial', 'Poland', 'https://www.knf.gov.pl', 2006),
('Canadian Investment Regulatory Organization', 'CIRO', 'CA', 'securities', 'Canada', 'https://www.ciro.ca', 2023),
('Securities and Exchange Board of India', 'SEBI', 'IN', 'securities', 'India', 'https://www.sebi.gov.in', 1988),
('Financial Services Commission', 'SC', 'MY', 'financial', 'Malaysia', 'https://www.sc.com.my', 1993),
('Securities and Exchange Commission', 'SEC', 'TH', 'securities', 'Thailand', 'https://www.sec.or.th', 1992),
('Securities and Exchange Commission', 'SEC', 'PH', 'securities', 'Philippines', 'https://www.sec.gov.ph', 1936),
('State Securities Commission', 'SSC', 'VN', 'securities', 'Vietnam', 'https://www.ssc.gov.vn', 1984),
('Securities and Commodities Authority', 'SCA', 'AE', 'securities', 'United Arab Emirates', 'https://www.sca.gov.ae', 2000),
('Capital Market Authority', 'CMA', 'SA', 'securities', 'Saudi Arabia', 'https://www.cma.org.sa', 2003),
('Financial Sector Conduct Authority', 'FSCA', 'ZA', 'financial', 'South Africa', 'https://www.fsca.co.za', 2018),
('Securities and Exchange Commission', 'SEC', 'NG', 'securities', 'Nigeria', 'https://www.sec.gov.ng', 1979),
('Capital Markets Authority', 'CMA', 'KE', 'securities', 'Kenya', 'https://www.cma.or.ke', 1989),
('Securities and Exchange Commission', 'CVM', 'BR', 'securities', 'Brazil', 'https://www.cvm.gov.br', 1976),
('Comisión Nacional de Valores', 'CNV', 'AR', 'securities', 'Argentina', 'https://www.cnv.gob.ar', 1968),
('Financial Market Commission', 'CMF', 'CL', 'financial', 'Chile', 'https://www.cmf.gob.cl', 2018),
('Financial Superintendence', 'SFC', 'CO', 'financial', 'Colombia', 'https://www.superfinanciera.gov.co', 2005),
('Securities Market Commission', 'SMV', 'PE', 'securities', 'Peru', 'https://www.smv.gob.pe', 2013),
('National Banking and Securities Commission', 'CNBV', 'MX', 'banking', 'Mexico', 'https://www.gob.mx/cnbv', 1995),
('Central Bank of Russia', 'CBR', 'RU', 'banking', 'Russia', 'https://www.cbr.ru', 1990)
ON CONFLICT DO NOTHING;

-- 9. Insert sample country regulations data
INSERT INTO country_regulations (country_code, regulation_type, regulation_name, regulation_description, minimum_capital_requirement, leverage_limit, client_fund_protection, compensation_scheme, compensation_limit) VALUES
('GB', 'forex', 'FCA Forex Regulations', 'Regulations for forex brokers operating in the UK under FCA supervision', 730000.00, 30, TRUE, 'FSCS', 85000.00),
('US', 'forex', 'NFA/CFTC Forex Regulations', 'Regulations for forex brokers operating in the US under NFA and CFTC supervision', 20000000.00, 50, TRUE, 'NFA', 0.00),
('AU', 'forex', 'ASIC Forex Regulations', 'Regulations for forex brokers operating in Australia under ASIC supervision', 1000000.00, 30, TRUE, 'FCS', 0.00),
('CY', 'forex', 'CySEC Forex Regulations', 'Regulations for forex brokers operating in Cyprus under CySEC supervision', 350000.00, 30, TRUE, 'ICF', 20000.00),
('DE', 'forex', 'BaFin Forex Regulations', 'Regulations for forex brokers operating in Germany under BaFin supervision', 730000.00, 30, TRUE, 'EdW', 0.00),
('JP', 'forex', 'FSA Japan Forex Regulations', 'Regulations for forex brokers operating in Japan under FSA supervision', 50000000.00, 25, TRUE, 'JIPF', 0.00),
('SG', 'forex', 'MAS Forex Regulations', 'Regulations for forex brokers operating in Singapore under MAS supervision', 1000000.00, 20, TRUE, 'SDIC', 0.00),
('CA', 'forex', 'CIRO Forex Regulations', 'Regulations for forex brokers operating in Canada under CIRO supervision', 250000.00, 50, TRUE, 'CIPF', 1000000.00)
ON CONFLICT (country_code, regulation_type) DO NOTHING;

COMMIT;

-- Migration completed successfully
-- Run this script on your database to add the Country Verification System functionality