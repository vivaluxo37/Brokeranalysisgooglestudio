-- Broker Regulations Table
CREATE TABLE broker_regulations (
    id BIGSERIAL PRIMARY KEY,
    broker_id BIGINT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    regulator_name VARCHAR(255) NOT NULL,
    license_number VARCHAR(100),
    license_status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
    jurisdiction VARCHAR(100) NOT NULL,
    regulatory_body_type VARCHAR(100) NOT NULL,
    investor_protection_amount DECIMAL(15,2),
    is_segregated BOOLEAN DEFAULT FALSE,
    compliance_score DECIMAL(3,2) CHECK (compliance_score >= 0 AND compliance_score <= 100),
    last_audit_date DATE,
    regulatory_requirements TEXT,
    compliance_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Broker Fees Table
CREATE TABLE broker_fees (
    id BIGSERIAL PRIMARY KEY,
    broker_id BIGINT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    fee_type VARCHAR(20) NOT NULL CHECK (
        fee_type IN ('spread', 'commission', 'swap', 'inactivity', 'withdrawal', 'deposit')
    ),
    instrument_type VARCHAR(100),
    fee_amount DECIMAL(15,6) NOT NULL,
    fee_currency VARCHAR(3) NOT NULL,
    fee_structure VARCHAR(50),
    min_amount DECIMAL(15,6),
    max_amount DECIMAL(15,6),
    is_negotiable BOOLEAN DEFAULT FALSE,
    effective_date DATE NOT NULL DEFAULT NOW(),
    expiry_date DATE,
    fee_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Broker Trading Conditions Table
CREATE TABLE broker_trading_conditions (
    id BIGSERIAL PRIMARY KEY,
    broker_id BIGINT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    min_deposit DECIMAL(15,2) NOT NULL,
    max_leverage VARCHAR(20) NOT NULL,
    margin_call_level DECIMAL(5,2) NOT NULL,
    stop_out_level DECIMAL(5,2) NOT NULL,
    min_lot_size DECIMAL(15,8) NOT NULL,
    max_lot_size DECIMAL(15,8),
    scalping_allowed BOOLEAN DEFAULT TRUE,
    hedging_allowed BOOLEAN DEFAULT TRUE,
    ea_allowed BOOLEAN DEFAULT TRUE,
    slippage DECIMAL(8,5),
    execution_speed_ms INTEGER,
    guaranteed_stop_loss BOOLEAN DEFAULT FALSE,
    islamic_accounts BOOLEAN DEFAULT FALSE,
    news_trading_allowed BOOLEAN DEFAULT TRUE,
    weekend_trading BOOLEAN DEFAULT FALSE,
    minimum_position_size DECIMAL(15,8),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Broker Platforms Table
CREATE TABLE broker_platforms (
    id BIGSERIAL PRIMARY KEY,
    broker_id BIGINT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    platform_name VARCHAR(50) NOT NULL CHECK (
        platform_name IN ('MT4', 'MT5', 'cTrader', 'TradingView', 'Proprietary')
    ),
    platform_features JSONB,
    availability VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
    mobile_app BOOLEAN DEFAULT FALSE,
    web_trader BOOLEAN DEFAULT FALSE,
    api_access BOOLEAN DEFAULT FALSE,
    vps_support BOOLEAN DEFAULT FALSE,
    trading_signals BOOLEAN DEFAULT FALSE,
    copy_trading BOOLEAN DEFAULT FALSE,
    platform_version VARCHAR(50),
    platform_description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Broker Account Types Table
CREATE TABLE broker_account_types (
    id BIGSERIAL PRIMARY KEY,
    broker_id BIGINT NOT NULL REFERENCES brokers(id) ON DELETE CASCADE,
    account_name VARCHAR(100) NOT NULL,
    account_type VARCHAR(20) NOT NULL CHECK (
        account_type IN ('ECN', 'STP', 'Standard', 'NDD')
    ),
    min_deposit DECIMAL(15,2) NOT NULL,
    spread_type VARCHAR(50),
    commission_structure TEXT,
    leverage VARCHAR(20),
    swap_free BOOLEAN DEFAULT FALSE,
    best_for_trader_type VARCHAR(100),
    additional_features JSONB,
    account_description TEXT,
    is_recommended BOOLEAN DEFAULT FALSE,
    demo_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance optimization
CREATE INDEX idx_broker_regulations_broker_id ON broker_regulations(broker_id);
CREATE INDEX idx_broker_regulations_jurisdiction ON broker_regulations(jurisdiction);
CREATE INDEX idx_broker_regulations_license_status ON broker_regulations(license_status);
CREATE INDEX idx_broker_regulations_compliance_score ON broker_regulations(compliance_score);

CREATE INDEX idx_broker_fees_broker_id ON broker_fees(broker_id);
CREATE INDEX idx_broker_fees_fee_type ON broker_fees(fee_type);
CREATE INDEX idx_broker_fees_instrument_type ON broker_fees(instrument_type);
CREATE INDEX idx_broker_fees_effective_date ON broker_fees(effective_date);
CREATE INDEX idx_broker_fees_currency ON broker_fees(fee_currency);

CREATE INDEX idx_broker_trading_conditions_broker_id ON broker_trading_conditions(broker_id);
CREATE INDEX idx_broker_trading_conditions_min_deposit ON broker_trading_conditions(min_deposit);
CREATE INDEX idx_broker_trading_conditions_max_leverage ON broker_trading_conditions(max_leverage);

CREATE INDEX idx_broker_platforms_broker_id ON broker_platforms(broker_id);
CREATE INDEX idx_broker_platforms_platform_name ON broker_platforms(platform_name);
CREATE INDEX idx_broker_platforms_availability ON broker_platforms(availability);

CREATE INDEX idx_broker_account_types_broker_id ON broker_account_types(broker_id);
CREATE INDEX idx_broker_account_types_account_type ON broker_account_types(account_type);
CREATE INDEX idx_broker_account_types_min_deposit ON broker_account_types(min_deposit);

-- Unique constraints
CREATE UNIQUE INDEX idx_unique_broker_platform ON broker_platforms(broker_id, platform_name);
CREATE UNIQUE INDEX idx_unique_broker_account_type ON broker_account_types(broker_id, account_name);

-- Row Level Security (RLS) Policies
ALTER TABLE broker_regulations ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_fees ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_trading_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_platforms ENABLE ROW LEVEL SECURITY;
ALTER TABLE broker_account_types ENABLE ROW LEVEL SECURITY;

-- Broker Regulations RLS Policies
CREATE POLICY "Allow public read access to broker regulations" ON broker_regulations
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert broker regulations" ON broker_regulations
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update their own broker regulations" ON broker_regulations
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete their own broker regulations" ON broker_regulations
    FOR DELETE USING (auth.role() = 'authenticated');

-- Broker Fees RLS Policies
CREATE POLICY "Allow public read access to broker fees" ON broker_fees
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert broker fees" ON broker_fees
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update their own broker fees" ON broker_fees
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete their own broker fees" ON broker_fees
    FOR DELETE USING (auth.role() = 'authenticated');

-- Broker Trading Conditions RLS Policies
CREATE POLICY "Allow public read access to broker trading conditions" ON broker_trading_conditions
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert broker trading conditions" ON broker_trading_conditions
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update their own broker trading conditions" ON broker_trading_conditions
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete their own broker trading conditions" ON broker_trading_conditions
    FOR DELETE USING (auth.role() = 'authenticated');

-- Broker Platforms RLS Policies
CREATE POLICY "Allow public read access to broker platforms" ON broker_platforms
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert broker platforms" ON broker_platforms
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update their own broker platforms" ON broker_platforms
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete their own broker platforms" ON broker_platforms
    FOR DELETE USING (auth.role() = 'authenticated');

-- Broker Account Types RLS Policies
CREATE POLICY "Allow public read access to broker account types" ON broker_account_types
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated users to insert broker account types" ON broker_account_types
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update their own broker account types" ON broker_account_types
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete their own broker account types" ON broker_account_types
    FOR DELETE USING (auth.role() = 'authenticated');

-- Update timestamps trigger function (if not already exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Update timestamps triggers
CREATE TRIGGER update_broker_regulations_updated_at
    BEFORE UPDATE ON broker_regulations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_broker_fees_updated_at
    BEFORE UPDATE ON broker_fees
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_broker_trading_conditions_updated_at
    BEFORE UPDATE ON broker_trading_conditions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_broker_platforms_updated_at
    BEFORE UPDATE ON broker_platforms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_broker_account_types_updated_at
    BEFORE UPDATE ON broker_account_types
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Comments for documentation
COMMENT ON TABLE broker_regulations IS 'Regulatory information and compliance details for brokers';
COMMENT ON TABLE broker_fees IS 'Fee structure and pricing information for broker services';
COMMENT ON TABLE broker_trading_conditions IS 'Trading conditions and platform specifications';
COMMENT ON TABLE broker_platforms IS 'Trading platforms and their features';
COMMENT ON TABLE broker_account_types IS 'Different account types offered by brokers';