-- Migration to add missing broker-related tables
-- Run this in your Supabase SQL editor or via CLI

-- First, let's update the existing brokers table structure if needed
-- Note: We need to check current structure vs required structure

-- Add missing columns to brokers table (if not already present)
DO $$
BEGIN
    -- Add new columns if they don't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'score') THEN
        ALTER TABLE brokers ADD COLUMN score DECIMAL(3, 2) DEFAULT 0;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'logo_url') THEN
        ALTER TABLE brokers ADD COLUMN logo_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'website_url') THEN
        ALTER TABLE brokers ADD COLUMN website_url VARCHAR(500);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'founding_year') THEN
        ALTER TABLE brokers ADD COLUMN founding_year INTEGER;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'summary') THEN
        ALTER TABLE brokers ADD COLUMN summary TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'broker_type') THEN
        ALTER TABLE brokers ADD COLUMN broker_type VARCHAR(100) DEFAULT 'Market Maker';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'mobile_trading') THEN
        ALTER TABLE brokers ADD COLUMN mobile_trading BOOLEAN DEFAULT true;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'demo_account') THEN
        ALTER TABLE brokers ADD COLUMN demo_account BOOLEAN DEFAULT true;
    END IF;
    
    -- Add JSONB columns for complex data
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'pros') THEN
        ALTER TABLE brokers ADD COLUMN pros TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'cons') THEN
        ALTER TABLE brokers ADD COLUMN cons TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'account_types') THEN
        ALTER TABLE brokers ADD COLUMN account_types JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'fees') THEN
        ALTER TABLE brokers ADD COLUMN fees JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'tradable_instruments') THEN
        ALTER TABLE brokers ADD COLUMN tradable_instruments JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'trading_conditions') THEN
        ALTER TABLE brokers ADD COLUMN trading_conditions JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'deposit_withdrawal') THEN
        ALTER TABLE brokers ADD COLUMN deposit_withdrawal JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'security') THEN
        ALTER TABLE brokers ADD COLUMN security JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'trading_environment') THEN
        ALTER TABLE brokers ADD COLUMN trading_environment JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'platform_features') THEN
        ALTER TABLE brokers ADD COLUMN platform_features JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'account_management') THEN
        ALTER TABLE brokers ADD COLUMN account_management JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'transparency') THEN
        ALTER TABLE brokers ADD COLUMN transparency JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'accessibility') THEN
        ALTER TABLE brokers ADD COLUMN accessibility JSONB;
    END IF;
    
    -- Rating columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'regulation_rating') THEN
        ALTER TABLE brokers ADD COLUMN regulation_rating DECIMAL(3, 2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'costs_rating') THEN
        ALTER TABLE brokers ADD COLUMN costs_rating DECIMAL(3, 2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'platforms_rating') THEN
        ALTER TABLE brokers ADD COLUMN platforms_rating DECIMAL(3, 2);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'brokers' AND column_name = 'support_rating') THEN
        ALTER TABLE brokers ADD COLUMN support_rating DECIMAL(3, 2);
    END IF;
    
END $$;

-- Create missing tables
-- Broker regulations table
CREATE TABLE IF NOT EXISTS broker_regulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id VARCHAR(255) NOT NULL,
    authority VARCHAR(255) NOT NULL,
    license_number VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active',
    year_obtained INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE CASCADE
);

-- Broker platforms table
CREATE TABLE IF NOT EXISTS broker_platforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    features TEXT[],
    api_access BOOLEAN DEFAULT false,
    ea_support BOOLEAN DEFAULT false,
    indicators_count INTEGER DEFAULT 0,
    drawing_tools_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE CASCADE
);

-- Broker fees table
CREATE TABLE IF NOT EXISTS broker_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2),
    description TEXT,
    conditions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE CASCADE
);

-- Broker trading instruments table
CREATE TABLE IF NOT EXISTS broker_trading_instruments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id VARCHAR(255) NOT NULL,
    instrument_type VARCHAR(100) NOT NULL,
    available BOOLEAN DEFAULT true,
    spreads TEXT,
    commission DECIMAL(10, 2),
    total_count INTEGER DEFAULT 0,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE CASCADE
);

-- Broker customer support table
CREATE TABLE IF NOT EXISTS broker_customer_support (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id VARCHAR(255) NOT NULL,
    language VARCHAR(100) NOT NULL,
    availability VARCHAR(255),
    methods TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_broker_regulations_broker_id ON broker_regulations(broker_id);
CREATE INDEX IF NOT EXISTS idx_broker_platforms_broker_id ON broker_platforms(broker_id);
CREATE INDEX IF NOT EXISTS idx_broker_fees_broker_id ON broker_fees(broker_id);
CREATE INDEX IF NOT EXISTS idx_broker_trading_instruments_broker_id ON broker_trading_instruments(broker_id);
CREATE INDEX IF NOT EXISTS idx_broker_customer_support_broker_id ON broker_customer_support(broker_id);

-- Update broker ID type in existing tables if needed (this might fail if data exists)
-- Note: Comment out or modify based on your current data structure
/*
DO $$
BEGIN
    -- This will only work if the brokers table currently uses UUID
    -- and we want to change it to VARCHAR. Skip if already VARCHAR.
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name = 'brokers' AND column_name = 'id' AND data_type = 'uuid') THEN
        -- This is a complex migration that requires data migration
        -- For now, we'll skip this and assume string IDs
        RAISE NOTICE 'Broker ID type change skipped - requires manual data migration';
    END IF;
END $$;
*/

-- Grant necessary permissions (adjust as needed for your RLS policies)
-- These might already exist, so we use IF NOT EXISTS equivalent patterns

DO $$
BEGIN
    -- Create policies for new tables (basic read access)
    -- Adjust these based on your security requirements
    
    -- Allow public read access to broker-related tables
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'broker_regulations' AND policyname = 'Allow public read access') THEN
        CREATE POLICY "Allow public read access" ON broker_regulations FOR SELECT USING (true);
        ALTER TABLE broker_regulations ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'broker_platforms' AND policyname = 'Allow public read access') THEN
        CREATE POLICY "Allow public read access" ON broker_platforms FOR SELECT USING (true);
        ALTER TABLE broker_platforms ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'broker_fees' AND policyname = 'Allow public read access') THEN
        CREATE POLICY "Allow public read access" ON broker_fees FOR SELECT USING (true);
        ALTER TABLE broker_fees ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'broker_trading_instruments' AND policyname = 'Allow public read access') THEN
        CREATE POLICY "Allow public read access" ON broker_trading_instruments FOR SELECT USING (true);
        ALTER TABLE broker_trading_instruments ENABLE ROW LEVEL SECURITY;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'broker_customer_support' AND policyname = 'Allow public read access') THEN
        CREATE POLICY "Allow public read access" ON broker_customer_support FOR SELECT USING (true);
        ALTER TABLE broker_customer_support ENABLE ROW LEVEL SECURITY;
    END IF;
    
EXCEPTION WHEN others THEN
    RAISE NOTICE 'Some policies may already exist or require different permissions';
END $$;