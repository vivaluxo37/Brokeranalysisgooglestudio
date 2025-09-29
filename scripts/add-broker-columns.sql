-- Add extended JSONB columns to brokers table
ALTER TABLE brokers 
ADD COLUMN IF NOT EXISTS account_types JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS fees JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS tradable_instruments JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS trading_conditions JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS deposit_withdrawal JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS customer_support JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS security JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS trading_environment JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS platform_features JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS account_management JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS transparency JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS platforms JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS pros JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS cons JSONB DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS ratings JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS core_info JSONB DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS accessibility JSONB DEFAULT '{}'::jsonb;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_brokers_account_types ON brokers USING GIN (account_types);
CREATE INDEX IF NOT EXISTS idx_brokers_platforms ON brokers USING GIN (platforms);
CREATE INDEX IF NOT EXISTS idx_brokers_security ON brokers USING GIN (security);
CREATE INDEX IF NOT EXISTS idx_brokers_ratings ON brokers USING GIN (ratings);

-- Add comments for documentation
COMMENT ON COLUMN brokers.account_types IS 'JSONB array of account type objects';
COMMENT ON COLUMN brokers.fees IS 'JSONB object containing trading and non-trading fees';
COMMENT ON COLUMN brokers.platforms IS 'JSONB array of supported trading platforms';