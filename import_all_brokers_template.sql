-- Template for importing all 45 brokers from TypeScript data
-- This is a template showing the pattern for each broker import
-- You would need to extract the actual data from the brokers.ts file

BEGIN;

-- Helper function to convert string arrays to proper PostgreSQL arrays
CREATE OR REPLACE FUNCTION to_pg_array(arr JSONB)
RETURNS TEXT[] AS $$
BEGIN
    RETURN ARRAY(
        SELECT jsonb_array_elements_text(arr)
    );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to safely handle JSONB field extraction
CREATE OR REPLACE FUNCTION safe_jsonb_field(obj JSONB, field TEXT, default_val JSONB)
RETURNS JSONB AS $$
BEGIN
    RETURN COALESCE(obj->field, default_val);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Pattern for importing each broker (repeat this pattern for all 45 brokers)

-- Example: Broker 1 - Pepperstone (already implemented in main script)
-- Example: Broker 2 - IC Markets (already implemented in main script)
-- Example: Broker 3 - FP Markets (already implemented in main script)

-- Template for additional brokers:
/*
INSERT INTO brokers (
    name,
    logo_url,
    website_url,
    score,
    founding_year,
    headquarters,
    description,
    summary,
    pros,
    cons,
    restricted_countries,
    core_info,
    account_types,
    fees,
    tradable_instruments,
    trading_conditions_extended,
    deposit_withdrawal,
    promotions,
    customer_support,
    security,
    trading_environment,
    platform_features,
    account_management,
    transparency,
    regulation,
    ratings,
    accessibility,
    technology,
    trading_conditions,
    copy_trading,
    is_islamic,
    provides_signals,
    social_trading,
    risk_profile
) VALUES (
    'BROKER_NAME',
    'LOGO_URL',
    'WEBSITE_URL',
    SCORE,
    FOUNDING_YEAR,
    'HEADQUARTERS',
    'DESCRIPTION',
    'SUMMARY',
    ARRAY['PROS_1', 'PROS_2', 'PROS_3'],
    ARRAY['CONS_1', 'CONS_2'],
    ARRAY['RESTRICTED_COUNTRY_1', 'RESTRICTED_COUNTRY_2'],
    '{"brokerType": "ECN", "mobileTrading": true, "demoAccount": true}'::JSONB,
    '[{"name": "Account Type 1", "type": "ECN", "minDeposit": 100, "spreads": "From 0.0 pips", "commission": "$3.50 per lot", "bestFor": "Scalpers"}]'::JSONB,
    '{"trading": {"spreadType": "Raw", "averageSpreads": [{"pair": "EUR/USD", "spread": "0.1 pips"}], "commissionStructure": "$3.50 per lot", "overnightSwapFees": "Standard"}, "nonTrading": {"inactivityFee": "None", "withdrawalFee": "None", "depositFee": "None"}}'::JSONB,
    '{"forexPairs": {"total": 60, "details": "Major and minor pairs"}, "commodities": {"total": 20, "details": "Metals and energies"}}'::JSONB,
    '{"minTradeSize": 0.01, "scalpingAllowed": true, "hedgingAllowed": true, "eaAllowed": true, "negativeBalanceProtection": true, "marginCallLevel": "50%", "stopOutLevel": "30%"}'::JSONB,
    '{"depositMethods": ["Credit Card", "Bank Transfer"], "withdrawalMethods": ["Credit Card", "Bank Transfer"], "depositFees": "None", "withdrawalFees": "None", "processingTime": {"deposits": "Instant", "withdrawals": "1-3 days"}, "minWithdrawal": 50}'::JSONB,
    '{}'::JSONB,
    '{"languages": ["English"], "channels": ["Live Chat", "Email"], "hours": "24/5"}'::JSONB,
    '{"regulatedBy": [{"regulator": "ASIC", "licenseNumber": "123456"}], "segregatedAccounts": true, "investorCompensationScheme": {"available": true, "amount": "Up to $50,000"}, "twoFactorAuth": true}'::JSONB,
    '{"executionSpeedMs": 30, "slippage": "Low", "requotes": false, "liquidityProviders": ["Tier 1 Banks"], "marketDepth": true, "orderTypes": ["Market", "Limit", "Stop"], "guaranteedStopLoss": {"available": false}}'::JSONB,
    '{"charting": {"indicators": 50, "drawingTools": 30}, "automatedTrading": ["EAs", "API"], "copyTrading": {"available": false, "platforms": []}, "backtesting": true, "newsIntegration": true}'::JSONB,
    '{"islamicAccount": {"available": true, "conditions": "No swap fees"}, "baseCurrencies": ["USD", "EUR", "GBP"], "mamPammSupport": true, "corporateAccounts": true}'::JSONB,
    '{"audited": true, "yearsInBusiness": 10, "tradingVolumeDisclosed": false, "clientBase": "50,000+ clients"}'::JSONB,
    '{"regulators": ["ASIC", "FCA"]}'::JSONB,
    '{"regulation": 9.0, "costs": 8.5, "platforms": 8.0, "support": 8.5}'::JSONB,
    '{"minDeposit": 100, "depositMethods": ["Credit Card", "Bank Transfer"], "withdrawalMethods": ["Credit Card", "Bank Transfer"], "customerSupport": ["24/5 Support"]}'::JSONB,
    '{"platforms": ["MT4", "MT5"], "executionType": "ECN", "apiAccess": true, "eaSupport": true}'::JSONB,
    '{"spreads": {"eurusd": 0.1, "gbpusd": 0.2, "usdjpy": 0.1}, "commission": "$3.50 per lot", "swapFeeCategory": "Low", "maxLeverage": "1:500", "minLotSize": 0.01}'::JSONB,
    false,
    false,
    false,
    '{"popularityScore": 7.0, "topTradersCount": 5000, "platforms": []}'::JSONB,
    '{"score": 25, "level": "Low", "summary": "Low risk broker", "signals": []}'::JSONB
) ON CONFLICT (name) DO UPDATE SET
    score = EXCLUDED.score,
    logo_url = EXCLUDED.logo_url,
    website_url = EXCLUDED.website_url,
    updated_at = NOW()
RETURNING id;
*/

-- After inserting each broker, you would need to insert related data:
-- 1. Broker regulations
-- 2. Broker fees
-- 3. Broker trading conditions
-- 4. Broker platforms
-- 5. Broker account types

-- Example pattern for related tables (replace BROKER_ID with actual ID from above):
/*
-- Regulations
INSERT INTO broker_regulations (broker_id, regulator_name, license_number, license_status, jurisdiction, regulatory_body_type, investor_protection_amount, is_segregated, compliance_score)
SELECT id, 'ASIC', '123456', 'ACTIVE', 'Australia', 'Tier 1 Financial Regulator', 50000.00, true, 95.0
FROM brokers WHERE name = 'BROKER_NAME';

-- Fees
INSERT INTO broker_fees (broker_id, fee_type, instrument_type, fee_amount, fee_currency, fee_structure, effective_date, fee_description)
SELECT id, 'spread', 'Forex', 0.10, 'USD', 'Variable Raw Spread', '2023-01-01', 'EUR/USD spread'
FROM brokers WHERE name = 'BROKER_NAME';

-- Trading conditions
INSERT INTO broker_trading_conditions (broker_id, min_deposit, max_leverage, margin_call_level, stop_out_level, min_lot_size, scalping_allowed, hedging_allowed, ea_allowed)
SELECT id, 100.00, '1:500', 50.00, 30.00, 0.01, true, true, true
FROM brokers WHERE name = 'BROKER_NAME';

-- Platforms
INSERT INTO broker_platforms (broker_id, platform_name, availability, mobile_app, web_trader, api_access, platform_description)
SELECT id, 'MT4', 'AVAILABLE', true, false, true, 'MetaTrader 4 platform'
FROM brokers WHERE name = 'BROKER_NAME';

-- Account types
INSERT INTO broker_account_types (broker_id, account_name, account_type, min_deposit, spread_type, commission_structure, best_for_trader_type, is_recommended)
SELECT id, 'Standard', 'Standard', 100.00, 'Variable', 'No commission', 'Beginners', true
FROM brokers WHERE name = 'BROKER_NAME';
*/

-- Drop helper functions when done
DROP FUNCTION IF EXISTS to_pg_array(JSONB);
DROP FUNCTION IF EXISTS safe_jsonb_field(JSONB, TEXT, JSONB);

COMMIT;

-- Sample query to verify import
SELECT COUNT(*) as total_brokers FROM brokers;