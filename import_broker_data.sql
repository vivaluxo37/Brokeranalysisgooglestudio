-- Comprehensive Broker Data Import Script
-- This script imports broker data from TypeScript structure into enhanced Supabase database
-- Includes main brokers table and all specialized related tables

-- Start transaction for data integrity
BEGIN;

-- Function to safely convert array to JSONB
CREATE OR REPLACE FUNCTION safe_array_to_jsonb(arr TEXT[])
RETURNS JSONB AS $$
BEGIN
    RETURN COALESCE(arr, '{}'::TEXT[])::JSONB;
END;
$$ LANGUAGE plpgsql;

-- Function to extract numeric value from string like "From 1.0 pips"
CREATE OR REPLACE FUNCTION extract_numeric_from_string(str TEXT)
RETURNS DECIMAL(10,2) AS $$
DECLARE
    num_str TEXT;
    result DECIMAL(10,2);
BEGIN
    IF str IS NULL THEN
        RETURN NULL;
    END IF;

    -- Extract first numeric value found
    num_str := (SELECT match[1] FROM regexp_matches(str, '(\d+\.?\d*)', 'g') AS match LIMIT 1);

    IF num_str IS NOT NULL THEN
        result := num_str::DECIMAL(10,2);
    ELSE
        result := NULL;
    END IF;

    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Clear existing data (uncomment for fresh import)
-- TRUNCATE TABLE broker_regulations CASCADE;
-- TRUNCATE TABLE broker_fees CASCADE;
-- TRUNCATE TABLE broker_trading_conditions CASCADE;
-- TRUNCATE TABLE broker_platforms CASCADE;
-- TRUNCATE TABLE broker_account_types CASCADE;
-- TRUNCATE TABLE brokers CASCADE;

-- Reset sequence (uncomment for fresh import)
-- ALTER SEQUENCE brokers_id_seq RESTART WITH 1;

-- ============================================
-- MAIN BROKERS TABLE INSERTS
-- ============================================

-- Insert Pepperstone
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
    'Pepperstone',
    'https://res.cloudinary.com/tradiiing/image/upload/v1689233075/Broker_Logos/Pepperstone_logo_logotype_2022_bkgw0d.svg',
    'https://pepperstone.com/',
    9.2,
    2010,
    'Melbourne, Australia',
    'Pepperstone is an award-winning online broker known for its fast execution, low spreads, and a wide range of trading platforms. It is regulated by top-tier authorities like ASIC and the FCA.',
    'Our top-rated broker, Pepperstone, excels in offering ultra-low trading costs through its Razor account, making it ideal for scalpers and algorithmic traders. With top-tier regulation from ASIC and the FCA, excellent platform variety including TradingView integration, and no minimum deposit, it''s a superb choice for both new and experienced traders who prioritize performance and safety.',
    ARRAY['Extremely low forex fees on Razor account', 'Fast and reliable ECN trade execution', 'Regulated by top-tier authorities (FCA, ASIC, CySEC)', 'Excellent selection of trading platforms (MT4, MT5, cTrader, TradingView)', 'Seamless and free deposit/withdrawal options', 'No minimum deposit requirement'],
    ARRAY['Stock CFD fees are relatively high', 'Does not offer investor protection for non-EU/UK clients', 'No proprietary mobile platform'],
    '{}'::TEXT[],
    '{"brokerType": "ECN", "mobileTrading": true, "demoAccount": true}'::JSONB,
    '[{"name": "Standard Account", "type": "STP", "minDeposit": 0, "spreads": "From 1.0 pips", "commission": "Zero commission", "bestFor": "Beginners and discretionary traders"}, {"name": "Razor Account", "type": "ECN", "minDeposit": 0, "spreads": "From 0.0 pips", "commission": "~$3.50 per lot per side", "bestFor": "Scalpers and algorithmic traders"}]'::JSONB,
    '{"trading": {"spreadType": "Raw", "averageSpreads": [{"pair": "EUR/USD", "spread": "0.1 pips + commission"}, {"pair": "GBP/USD", "spread": "0.4 pips + commission"}, {"pair": "Gold", "spread": "12 cents"}], "commissionStructure": "$3.50 per lot per side on Razor Account. None on Standard.", "overnightSwapFees": "Competitive, varies by instrument. Islamic swap-free account available."}, "nonTrading": {"inactivityFee": "None", "withdrawalFee": "None for Cards/PayPal/Skrill. Bank transfers may incur fees.", "depositFee": "None. Pepperstone covers fees."}}'::JSONB,
    '{"forexPairs": {"total": 62, "details": "Majors, Minors, Exotics"}, "commodities": {"total": 22, "details": "Metals, Energies, Soft Commodities"}, "indices": {"total": 28, "details": "Global stock indices including US500, UK100"}, "stocks": {"total": 1000, "details": "US, UK, AU, and DE Stock CFDs"}, "cryptocurrencies": {"total": 18, "details": "BTC, ETH, LTC, and more"}, "etfs": {"total": 100, "details": "Various ETF CFDs"}}'::JSONB,
    '{"minTradeSize": 0.01, "scalpingAllowed": true, "hedgingAllowed": true, "eaAllowed": true, "negativeBalanceProtection": true, "marginCallLevel": "80%", "stopOutLevel": "50%"}'::JSONB,
    '{"depositMethods": ["Credit/Debit Card", "Bank Transfer", "PayPal", "Skrill", "Neteller", "UnionPay"], "withdrawalMethods": ["Credit/Debit Card", "Bank Transfer", "PayPal", "Skrill", "Neteller"], "depositFees": "None", "withdrawalFees": "None from Pepperstone''s side", "processingTime": {"deposits": "Instant for cards and e-wallets", "withdrawals": "1-3 business days"}, "minWithdrawal": 20}'::JSONB,
    '{}'::JSONB,
    '{"languages": ["English", "Spanish", "Chinese", "Russian", "Arabic", "Thai"], "channels": ["Live Chat", "Phone", "Email"], "hours": "24/5"}'::JSONB,
    '{"regulatedBy": [{"regulator": "ASIC", "licenseNumber": "414530"}, {"regulator": "FCA", "licenseNumber": "684312"}, {"regulator": "CySEC", "licenseNumber": "388/20"}, {"regulator": "DFSA", "licenseNumber": "F004356"}, {"regulator": "BaFin"}, {"regulator": "CMA"}], "segregatedAccounts": true, "investorCompensationScheme": {"available": true, "amount": "Up to £85,000 (FCA)"}, "twoFactorAuth": true}'::JSONB,
    '{"executionSpeedMs": 30, "slippage": "Low, with positive and negative slippage occurring", "requotes": false, "liquidityProviders": ["20+ Tier 1 Banks and ECNs"], "marketDepth": true, "orderTypes": ["Market", "Limit", "Stop", "Trailing Stop"], "guaranteedStopLoss": {"available": false}}'::JSONB,
    '{"charting": {"indicators": 80, "drawingTools": 50}, "automatedTrading": ["EAs (MQL4/5)", "cAlgo", "API"], "copyTrading": {"available": true, "platforms": ["Myfxbook", "DupliTrade", "MetaTrader Signals"]}, "backtesting": true, "newsIntegration": true}'::JSONB,
    '{"islamicAccount": {"available": true, "conditions": "No swap fees, admin fee charged after 3 days."}, "baseCurrencies": ["AUD", "USD", "JPY", "GBP", "EUR", "CAD", "CHF", "NZD", "SGD", "HKD"], "mamPammSupport": true, "corporateAccounts": true}'::JSONB,
    '{"audited": true, "yearsInBusiness": 13, "tradingVolumeDisclosed": false, "clientBase": "300,000+ clients worldwide"}'::JSONB,
    '{"regulators": ["ASIC", "FCA", "CySEC", "DFSA", "BaFin", "CMA"]}'::JSONB,
    '{"regulation": 9.8, "costs": 9.5, "platforms": 9.0, "support": 9.1}'::JSONB,
    '{"minDeposit": 0, "depositMethods": ["Credit Card", "Debit Card", "Bank Transfer", "PayPal", "Skrill", "Neteller"], "withdrawalMethods": ["Credit Card", "Bank Transfer", "PayPal", "Skrill"], "customerSupport": ["24/5 Live Chat", "Phone", "Email"]}'::JSONB,
    '{"platforms": ["MT4", "MT5", "cTrader", "TradingView"], "executionType": "ECN/STP", "apiAccess": true, "eaSupport": true}'::JSONB,
    '{"spreads": {"eurusd": 0.1, "gbpusd": 0.4, "usdjpy": 0.2}, "commission": "$3.50 per lot", "swapFeeCategory": "Low", "maxLeverage": "1:500", "minLotSize": 0.01}'::JSONB,
    true,
    true,
    false,
    '{"popularityScore": 8.5, "topTradersCount": 15000, "platforms": ["Myfxbook", "DupliTrade"]}'::JSONB,
    '{"score": 15, "level": "Low", "summary": "Low risk broker with excellent regulatory oversight", "signals": []}'::JSONB
) ON CONFLICT DO NOTHING RETURNING id;

-- Get the Pepperstone broker ID
-- Note: In practice, you would get this from the RETURNING clause above
-- For this example, we'll assume it's ID 1

-- Insert IC Markets
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
    'IC Markets',
    'https://res.cloudinary.com/tradiiing/image/upload/v1689233074/Broker_Logos/IC_Markets_logo_logotype_2022_h1csy2.svg',
    'https://www.icmarkets.com/',
    9.0,
    2007,
    'Sydney, Australia',
    'IC Markets is one of the most renowned Forex CFD providers, offering trading solutions for active day traders and scalpers as well as traders that are new to the forex market.',
    'IC Markets is a top choice for high-volume traders and scalpers, boasting some of the lowest spreads in the industry through its true ECN environment. With 24/7 support and a wide range of platforms, it''s a high-performance broker for serious traders.',
    ARRAY['True ECN broker with deep liquidity', 'Extremely low spreads from 0.0 pips', '24/7 customer support', 'No restrictions on trading styles (scalping, EAs allowed)', 'Fast order execution'],
    ARRAY['Limited educational resources for beginners', 'Research tools are mostly third-party', 'Minimum deposit of $200 might be a barrier for some'],
    '{}'::TEXT[],
    '{"brokerType": "ECN", "mobileTrading": true, "demoAccount": true}'::JSONB,
    '[{"name": "Standard", "type": "Standard", "minDeposit": 200, "spreads": "From 0.6 pips", "commission": "Zero", "bestFor": "Discretionary traders"}, {"name": "Raw Spread", "type": "ECN", "minDeposit": 200, "spreads": "From 0.0 pips", "commission": "$3.50 per lot", "bestFor": "Scalpers & Algo traders"}, {"name": "cTrader Raw", "type": "ECN", "minDeposit": 200, "spreads": "From 0.0 pips", "commission": "$3.00 per lot", "bestFor": "cTrader users"}]'::JSONB,
    '{"trading": {"spreadType": "Raw", "averageSpreads": [{"pair": "EUR/USD", "spread": "0.0 pips + commission"}, {"pair": "GBP/USD", "spread": "0.2 pips + commission"}], "commissionStructure": "$3.50 per lot per side on MT4/5 Raw, $3.00 on cTrader Raw.", "overnightSwapFees": "Standard rates, Islamic account available."}, "nonTrading": {"inactivityFee": "None", "withdrawalFee": "None", "depositFee": "None"}}'::JSONB,
    '{"forexPairs": {"total": 61, "details": "All major and minor pairs"}, "commodities": {"total": 19, "details": "Metals, Energies"}, "indices": {"total": 20, "details": "Global indices"}, "stocks": {"total": 1500, "details": "US, UK, AU Stock CFDs"}, "cryptocurrencies": {"total": 10, "details": "BTC, ETH, and more"}}'::JSONB,
    '{"minTradeSize": 0.01, "scalpingAllowed": true, "hedgingAllowed": true, "eaAllowed": true, "negativeBalanceProtection": true, "marginCallLevel": "50%", "stopOutLevel": "30%"}'::JSONB,
    '{"depositMethods": ["Credit Card", "Bank Transfer", "Skrill", "Neteller", "FasaPay", "UnionPay", "Bitcoin"], "withdrawalMethods": ["Credit Card", "Bank Transfer", "Skrill", "Neteller"], "depositFees": "None", "withdrawalFees": "None", "processingTime": {"deposits": "Most methods instant", "withdrawals": "1-3 business days"}, "minWithdrawal": 50}'::JSONB,
    '{}'::JSONB,
    '{"languages": ["English", "Chinese", "Spanish", "Indonesian"], "channels": ["Live Chat", "Phone", "Email"], "hours": "24/7"}'::JSONB,
    '{"regulatedBy": [{"regulator": "ASIC", "licenseNumber": "335692"}, {"regulator": "CySEC", "licenseNumber": "362/18"}, {"regulator": "FSA", "licenseNumber": "SD018"}], "segregatedAccounts": true, "investorCompensationScheme": {"available": true, "amount": "Up to €20,000 (CySEC)"}, "twoFactorAuth": true}'::JSONB,
    '{"executionSpeedMs": 40, "slippage": "Very Low", "requotes": false, "liquidityProviders": ["Over 25 different liquidity sources"], "marketDepth": true, "orderTypes": ["Market", "Limit", "Stop", "Trailing Stop"], "guaranteedStopLoss": {"available": false}}'::JSONB,
    '{"charting": {"indicators": 50, "drawingTools": 30}, "automatedTrading": ["EAs", "cAlgo", "API"], "copyTrading": {"available": true, "platforms": ["ZuluTrade", "Myfxbook"]}, "backtesting": true, "newsIntegration": true}'::JSONB,
    '{"islamicAccount": {"available": true, "conditions": "No swap fees, no admin fee"}, "baseCurrencies": ["AUD", "USD", "EUR", "GBP", "JPY", "CAD", "CHF", "NZD", "SGD"], "mamPammSupport": true, "corporateAccounts": true}'::JSONB,
    '{"audited": true, "yearsInBusiness": 16, "tradingVolumeDisclosed": true, "clientBase": "180,000+ clients globally"}'::JSONB,
    '{"regulators": ["ASIC", "CySEC", "FSA"]}'::JSONB,
    '{"regulation": 9.5, "costs": 9.8, "platforms": 8.5, "support": 9.0}'::JSONB,
    '{"minDeposit": 200, "depositMethods": ["Credit Card", "Bank Transfer", "Skrill", "Neteller", "FasaPay", "UnionPay", "Bitcoin"], "withdrawalMethods": ["Credit Card", "Bank Transfer", "Skrill", "Neteller"], "customerSupport": ["24/7 Live Chat", "Phone", "Email"]}'::JSONB,
    '{"platforms": ["MT4", "MT5", "cTrader"], "executionType": "ECN", "apiAccess": true, "eaSupport": true}'::JSONB,
    '{"spreads": {"eurusd": 0.0, "gbpusd": 0.2, "usdjpy": 0.1}, "commission": "$3.50 per lot", "swapFeeCategory": "Low", "maxLeverage": "1:500", "minLotSize": 0.01}'::JSONB,
    true,
    true,
    false,
    '{"popularityScore": 8.2, "topTradersCount": 12000, "platforms": ["ZuluTrade", "Myfxbook"]}'::JSONB,
    '{"score": 18, "level": "Low", "summary": "Low risk broker with strong regulatory framework", "signals": []}'::JSONB
) ON CONFLICT DO NOTHING;

-- Insert one more broker for demonstration (FP Markets)
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
    'FP Markets',
    'https://res.cloudinary.com/tradiiing/image/upload/v1689233075/Broker_Logos/FP_Markets_logo_logotype_2022_ywq9x3.svg',
    'https://www.fpmarkets.com/',
    8.5,
    2005,
    'Sydney, Australia',
    'FP Markets is a globally recognized Forex and CFD broker offering superior trading conditions, including competitive spreads, fast execution, and access to multiple trading platforms.',
    'FP Markets combines excellent regulation with competitive pricing and a wide range of tradable instruments. While their platform selection is more limited than some competitors, their execution quality and customer service make them a solid choice for serious traders.',
    ARRAY['Competitive spreads and commissions', 'Strong regulatory oversight (ASIC, CySEC)', 'Wide range of tradable instruments', 'Fast execution speeds', 'Good educational resources'],
    ARRAY['Limited platform selection (no cTrader)', 'Higher minimum deposit than some competitors', 'Copy trading options are limited'],
    '{}'::TEXT[],
    '{"brokerType": "ECN", "mobileTrading": true, "demoAccount": true}'::JSONB,
    '[{"name": "Standard", "type": "Standard", "minDeposit": 100, "spreads": "From 1.0 pips", "commission": "Zero", "bestFor": "Beginners and casual traders"}, {"name": "Raw", "type": "ECN", "minDeposit": 100, "spreads": "From 0.0 pips", "commission": "$3.00 per lot per side", "bestFor": "Scalpers and high-volume traders"}]'::JSONB,
    '{"trading": {"spreadType": "Raw", "averageSpreads": [{"pair": "EUR/USD", "spread": "0.1 pips + commission"}, {"pair": "GBP/USD", "spread": "0.3 pips + commission"}], "commissionStructure": "$3.00 per lot per side on Raw account. None on Standard.", "overnightSwapFees": "Competitive rates, Islamic account available."}, "nonTrading": {"inactivityFee": "None", "withdrawalFee": "None", "depositFee": "None"}}'::JSONB,
    '{"forexPairs": {"total": 60, "details": "Major, minor and exotic pairs"}, "commodities": {"total": 20, "details": "Metals, energies, soft commodities"}, "indices": {"total": 15, "details": "Major global indices"}, "stocks": {"total": 1000, "details": "US, UK, AU stock CFDs"}, "cryptocurrencies": {"total": 12, "details": "Major cryptocurrencies"}, "etfs": {"total": 50, "details": "Popular ETFs"}}'::JSONB,
    '{"minTradeSize": 0.01, "scalpingAllowed": true, "hedgingAllowed": true, "eaAllowed": true, "negativeBalanceProtection": true, "marginCallLevel": "50%", "stopOutLevel": "30%"}'::JSONB,
    '{"depositMethods": ["Credit/Debit Card", "Bank Transfer", "Skrill", "Neteller", "PayPal", "FasaPay", "UnionPay"], "withdrawalMethods": ["Credit/Debit Card", "Bank Transfer", "Skrill", "Neteller", "PayPal"], "depositFees": "None", "withdrawalFees": "None", "processingTime": {"deposits": "Instant for most methods", "withdrawals": "1-3 business days"}, "minWithdrawal": 50}'::JSONB,
    '{}'::JSONB,
    '{"languages": ["English", "Chinese", "Spanish", "Arabic", "Vietnamese"], "channels": ["Live Chat", "Phone", "Email"], "hours": "24/5"}'::JSONB,
    '{"regulatedBy": [{"regulator": "ASIC", "licenseNumber": "286354"}, {"regulator": "CySEC", "licenseNumber": "371/18"}, {"regulator": "FSA"}], "segregatedAccounts": true, "investorCompensationScheme": {"available": true, "amount": "Up to €20,000 (CySEC)"}, "twoFactorAuth": true}'::JSONB,
    '{"executionSpeedMs": 45, "slippage": "Low", "requotes": false, "liquidityProviders": ["Tier 1 banks and liquidity providers"], "marketDepth": true, "orderTypes": ["Market", "Limit", "Stop", "Trailing Stop"], "guaranteedStopLoss": {"available": false}}'::JSONB,
    '{"charting": {"indicators": 50, "drawingTools": 30}, "automatedTrading": ["EAs", "API"], "copyTrading": {"available": true, "platforms": ["Myfxbook"]}, "backtesting": true, "newsIntegration": true}'::JSONB,
    '{"islamicAccount": {"available": true, "conditions": "No swap fees, no admin fee"}, "baseCurrencies": ["AUD", "USD", "EUR", "GBP", "JPY", "CAD", "CHF", "SGD", "NZD"], "mamPammSupport": true, "corporateAccounts": true}'::JSONB,
    '{"audited": true, "yearsInBusiness": 18, "tradingVolumeDisclosed": false, "clientBase": "120,000+ clients worldwide"}'::JSONB,
    '{"regulators": ["ASIC", "CySEC", "FSA"]}'::JSONB,
    '{"regulation": 9.2, "costs": 8.8, "platforms": 8.0, "support": 8.5}'::JSONB,
    '{"minDeposit": 100, "depositMethods": ["Credit/Debit Card", "Bank Transfer", "Skrill", "Neteller", "PayPal", "FasaPay", "UnionPay"], "withdrawalMethods": ["Credit/Debit Card", "Bank Transfer", "Skrill", "Neteller", "PayPal"], "customerSupport": ["24/5 Live Chat", "Phone", "Email"]}'::JSONB,
    '{"platforms": ["MT4", "MT5"], "executionType": "ECN/STP", "apiAccess": true, "eaSupport": true}'::JSONB,
    '{"spreads": {"eurusd": 0.1, "gbpusd": 0.3, "usdjpy": 0.2}, "commission": "$3.00 per lot", "swapFeeCategory": "Low", "maxLeverage": "1:500", "minLotSize": 0.01}'::JSONB,
    true,
    true,
    false,
    '{"popularityScore": 7.5, "topTradersCount": 8000, "platforms": ["Myfxbook"]}'::JSONB,
    '{"score": 22, "level": "Low", "summary": "Low risk broker with good regulatory standing", "signals": []}'::JSONB
) ON CONFLICT DO NOTHING;

-- ============================================
-- SPECIALIZED TABLES INSERTS
-- ============================================

-- Broker Regulations
-- Pepperstone regulations
INSERT INTO broker_regulations (
    broker_id, regulator_name, license_number, license_status, jurisdiction,
    regulatory_body_type, investor_protection_amount, is_segregated,
    compliance_score, last_audit_date, regulatory_requirements, compliance_notes
) SELECT
    id, 'ASIC', '414530', 'ACTIVE', 'Australia',
    'Tier 1 Financial Regulator', 50000.00, true,
    95.5, '2023-06-15', 'AFSL holder, capital adequacy requirements', 'Excellent compliance history'
FROM brokers WHERE name = 'Pepperstone';

INSERT INTO broker_regulations (
    broker_id, regulator_name, license_number, license_status, jurisdiction,
    regulatory_body_type, investor_protection_amount, is_segregated,
    compliance_score, last_audit_date, regulatory_requirements, compliance_notes
) SELECT
    id, 'FCA', '684312', 'ACTIVE', 'United Kingdom',
    'Tier 1 Financial Regulator', 85000.00, true,
    97.0, '2023-07-20', 'FCA regulated, FSCS member', 'Strong compliance record'
FROM brokers WHERE name = 'Pepperstone';

INSERT INTO broker_regulations (
    broker_id, regulator_name, license_number, license_status, jurisdiction,
    regulatory_body_type, investor_protection_amount, is_segregated,
    compliance_score, last_audit_date, regulatory_requirements, compliance_notes
) SELECT
    id, 'CySEC', '388/20', 'ACTIVE', 'Cyprus',
    'EU Financial Regulator', 20000.00, true,
    92.0, '2023-05-10', 'MiFID II compliant', 'Good regulatory standing'
FROM brokers WHERE name = 'Pepperstone';

-- IC Markets regulations
INSERT INTO broker_regulations (
    broker_id, regulator_name, license_number, license_status, jurisdiction,
    regulatory_body_type, investor_protection_amount, is_segregated,
    compliance_score, last_audit_date, regulatory_requirements, compliance_notes
) SELECT
    id, 'ASIC', '335692', 'ACTIVE', 'Australia',
    'Tier 1 Financial Regulator', 50000.00, true,
    94.0, '2023-04-12', 'AFSL holder since 2009', 'Solid compliance history'
FROM brokers WHERE name = 'IC Markets';

INSERT INTO broker_regulations (
    broker_id, regulator_name, license_number, license_status, jurisdiction,
    regulatory_body_type, investor_protection_amount, is_segregated,
    compliance_score, last_audit_date, regulatory_requirements, compliance_notes
) SELECT
    id, 'CySEC', '362/18', 'ACTIVE', 'Cyprus',
    'EU Financial Regulator', 20000.00, true,
    91.5, '2023-03-18', 'MiFID II compliant', 'Good regulatory standing'
FROM brokers WHERE name = 'IC Markets';

-- FP Markets regulations
INSERT INTO broker_regulations (
    broker_id, regulator_name, license_number, license_status, jurisdiction,
    regulatory_body_type, investor_protection_amount, is_segregated,
    compliance_score, last_audit_date, regulatory_requirements, compliance_notes
) SELECT
    id, 'ASIC', '286354', 'ACTIVE', 'Australia',
    'Tier 1 Financial Regulator', 50000.00, true,
    93.0, '2023-06-08', 'AFSL holder since 2005', 'Excellent long-term compliance'
FROM brokers WHERE name = 'FP Markets';

INSERT INTO broker_regulations (
    broker_id, regulator_name, license_number, license_status, jurisdiction,
    regulatory_body_type, investor_protection_amount, is_segregated,
    compliance_score, last_audit_date, regulatory_requirements, compliance_notes
) SELECT
    id, 'CySEC', '371/18', 'ACTIVE', 'Cyprus',
    'EU Financial Regulator', 20000.00, true,
    90.5, '2023-02-22', 'MiFID II compliant', 'Good regulatory standing'
FROM brokers WHERE name = 'FP Markets';

-- Broker Fees
-- Pepperstone fees
INSERT INTO broker_fees (
    broker_id, fee_type, instrument_type, fee_amount, fee_currency, fee_structure,
    min_amount, max_amount, is_negotiable, effective_date, fee_description
) SELECT
    id, 'spread', 'Forex', 0.10, 'USD', 'Variable Raw Spread',
    0.00, NULL, false, '2023-01-01', 'EUR/USD spread from 0.1 pips on Razor account'
FROM brokers WHERE name = 'Pepperstone';

INSERT INTO broker_fees (
    broker_id, fee_type, instrument_type, fee_amount, fee_currency, fee_structure,
    min_amount, max_amount, is_negotiable, effective_date, fee_description
) SELECT
    id, 'commission', 'Forex', 3.50, 'USD', 'Per lot per side',
    0.01, NULL, false, '2023-01-01', 'Commission on Razor account'
FROM brokers WHERE name = 'Pepperstone';

INSERT INTO broker_fees (
    broker_id, fee_type, instrument_type, fee_amount, fee_currency, fee_structure,
    min_amount, max_amount, is_negotiable, effective_date, fee_description
) SELECT
    id, 'spread', 'Forex', 1.00, 'USD', 'Variable STP Spread',
    0.00, NULL, false, '2023-01-01', 'EUR/USD spread from 1.0 pips on Standard account'
FROM brokers WHERE name = 'Pepperstone';

INSERT INTO broker_fees (
    broker_id, fee_type, instrument_type, fee_amount, fee_currency, fee_structure,
    min_amount, max_amount, is_negotiable, effective_date, fee_description
) SELECT
    id, 'spread', 'Gold', 0.12, 'USD', 'Variable Spread',
    0.01, NULL, false, '2023-01-01', 'Gold XAU/USD spread from 12 cents'
FROM brokers WHERE name = 'Pepperstone';

-- IC Markets fees
INSERT INTO broker_fees (
    broker_id, fee_type, instrument_type, fee_amount, fee_currency, fee_structure,
    min_amount, max_amount, is_negotiable, effective_date, fee_description
) SELECT
    id, 'spread', 'Forex', 0.00, 'USD', 'Raw ECN Spread',
    0.00, NULL, false, '2023-01-01', 'EUR/USD spread from 0.0 pips on Raw accounts'
FROM brokers WHERE name = 'IC Markets';

INSERT INTO broker_fees (
    broker_id, fee_type, instrument_type, fee_amount, fee_currency, fee_structure,
    min_amount, max_amount, is_negotiable, effective_date, fee_description
) SELECT
    id, 'commission', 'Forex', 3.50, 'USD', 'Per lot per side',
    0.01, NULL, false, '2023-01-01', 'Commission on MT4/5 Raw account'
FROM brokers WHERE name = 'IC Markets';

INSERT INTO broker_fees (
    broker_id, fee_type, instrument_type, fee_amount, fee_currency, fee_structure,
    min_amount, max_amount, is_negotiable, effective_date, fee_description
) SELECT
    id, 'commission', 'Forex', 3.00, 'USD', 'Per lot per side',
    0.01, NULL, false, '2023-01-01', 'Commission on cTrader Raw account'
FROM brokers WHERE name = 'IC Markets';

-- Broker Trading Conditions
-- Pepperstone trading conditions
INSERT INTO broker_trading_conditions (
    broker_id, min_deposit, max_leverage, margin_call_level, stop_out_level,
    min_lot_size, max_lot_size, scalping_allowed, hedging_allowed, ea_allowed,
    slippage, execution_speed_ms, guaranteed_stop_loss, islamic_accounts,
    news_trading_allowed, weekend_trading, minimum_position_size
) SELECT
    id, 0.00, '1:500', 80.00, 50.00,
    0.01, 100.00, true, true, true,
    0.00010, 30, false, true,
    true, false, 0.01
FROM brokers WHERE name = 'Pepperstone';

-- IC Markets trading conditions
INSERT INTO broker_trading_conditions (
    broker_id, min_deposit, max_leverage, margin_call_level, stop_out_level,
    min_lot_size, max_lot_size, scalping_allowed, hedging_allowed, ea_allowed,
    slippage, execution_speed_ms, guaranteed_stop_loss, islamic_accounts,
    news_trading_allowed, weekend_trading, minimum_position_size
) SELECT
    id, 200.00, '1:500', 50.00, 30.00,
    0.01, 100.00, true, true, true,
    0.00005, 40, false, true,
    true, false, 0.01
FROM brokers WHERE name = 'IC Markets';

-- FP Markets trading conditions
INSERT INTO broker_trading_conditions (
    broker_id, min_deposit, max_leverage, margin_call_level, stop_out_level,
    min_lot_size, max_lot_size, scalping_allowed, hedging_allowed, ea_allowed,
    slippage, execution_speed_ms, guaranteed_stop_loss, islamic_accounts,
    news_trading_allowed, weekend_trading, minimum_position_size
) SELECT
    id, 100.00, '1:500', 50.00, 30.00,
    0.01, 100.00, true, true, true,
    0.00015, 45, false, true,
    true, false, 0.01
FROM brokers WHERE name = 'FP Markets';

-- Broker Platforms
-- Pepperstone platforms
INSERT INTO broker_platforms (
    broker_id, platform_name, platform_features, availability,
    mobile_app, web_trader, api_access, vps_support,
    trading_signals, copy_trading, platform_version, platform_description
) SELECT
    id, 'MT4', '{"indicators": 50, "timeframes": 9, "expertAdvisors": true}', 'AVAILABLE',
    true, false, true, true,
    true, true, 'Build 1380', 'MetaTrader 4 with full Pepperstone integration'
FROM brokers WHERE name = 'Pepperstone';

INSERT INTO broker_platforms (
    broker_id, platform_name, platform_features, availability,
    mobile_app, web_trader, api_access, vps_support,
    trading_signals, copy_trading, platform_version, platform_description
) SELECT
    id, 'MT5', '{"indicators": 80, "timeframes": 21, "hedging": true}', 'AVAILABLE',
    true, false, true, true,
    true, true, 'Build 3280', 'MetaTrader 5 with advanced features'
FROM brokers WHERE name = 'Pepperstone';

INSERT INTO broker_platforms (
    broker_id, platform_name, platform_features, availability,
    mobile_app, web_trader, api_access, vps_support,
    trading_signals, copy_trading, platform_version, platform_description
) SELECT
    id, 'cTrader', '{"indicators": 50, "depthOfMarket": true, "levelIIPricing": true}', 'AVAILABLE',
    true, true, true, true,
    true, true, '4.2', 'cTrader platform with advanced charting and automation'
FROM brokers WHERE name = 'Pepperstone';

INSERT INTO broker_platforms (
    broker_id, platform_name, platform_features, availability,
    mobile_app, web_trader, api_access, vps_support,
    trading_signals, copy_trading, platform_version, platform_description
) SELECT
    id, 'TradingView', '{"indicators": 100, "drawingTools": 50, "customIndicators": true}', 'AVAILABLE',
    true, true, true, false,
    false, false, 'Latest', 'TradingView integration with Pepperstone pricing'
FROM brokers WHERE name = 'Pepperstone';

-- IC Markets platforms
INSERT INTO broker_platforms (
    broker_id, platform_name, platform_features, availability,
    mobile_app, web_trader, api_access, vps_support,
    trading_signals, copy_trading, platform_version, platform_description
) SELECT
    id, 'MT4', '{"indicators": 50, "timeframes": 9, "expertAdvisors": true}', 'AVAILABLE',
    true, false, true, true,
    true, true, 'Build 1380', 'MetaTrader 4 with IC Markets pricing'
FROM brokers WHERE name = 'IC Markets';

INSERT INTO broker_platforms (
    broker_id, platform_name, platform_features, availability,
    mobile_app, web_trader, api_access, vps_support,
    trading_signals, copy_trading, platform_version, platform_description
) SELECT
    id, 'MT5', '{"indicators": 80, "timeframes": 21, "hedging": true}', 'AVAILABLE',
    true, false, true, true,
    true, true, 'Build 3280', 'MetaTrader 5 with IC Markets integration'
FROM brokers WHERE name = 'IC Markets';

INSERT INTO broker_platforms (
    broker_id, platform_name, platform_features, availability,
    mobile_app, web_trader, api_access, vps_support,
    trading_signals, copy_trading, platform_version, platform_description
) SELECT
    id, 'cTrader', '{"indicators": 50, "depthOfMarket": true, "levelIIPricing": true}', 'AVAILABLE',
    true, true, true, true,
    true, true, '4.2', 'cTrader with IC Markets raw spreads'
FROM brokers WHERE name = 'IC Markets';

-- FP Markets platforms
INSERT INTO broker_platforms (
    broker_id, platform_name, platform_features, availability,
    mobile_app, web_trader, api_access, vps_support,
    trading_signals, copy_trading, platform_version, platform_description
) SELECT
    id, 'MT4', '{"indicators": 50, "timeframes": 9, "expertAdvisors": true}', 'AVAILABLE',
    true, false, true, true,
    true, true, 'Build 1380', 'MetaTrader 4 with FP Markets integration'
FROM brokers WHERE name = 'FP Markets';

INSERT INTO broker_platforms (
    broker_id, platform_name, platform_features, availability,
    mobile_app, web_trader, api_access, vps_support,
    trading_signals, copy_trading, platform_version, platform_description
) SELECT
    id, 'MT5', '{"indicators": 80, "timeframes": 21, "hedging": true}', 'AVAILABLE',
    true, false, true, true,
    true, true, 'Build 3280', 'MetaTrader 5 with FP Markets pricing'
FROM brokers WHERE name = 'FP Markets';

-- Broker Account Types
-- Pepperstone account types
INSERT INTO broker_account_types (
    broker_id, account_name, account_type, min_deposit, spread_type,
    commission_structure, leverage, swap_free, best_for_trader_type,
    additional_features, account_description, is_recommended, demo_available
) SELECT
    id, 'Standard Account', 'STP', 0.00, 'Variable',
    'No commission', '1:500', false, 'Beginners and discretionary traders',
    '{"riskManagement": true, "educationalResources": true}', 'Standard account with variable spreads and no commission', true, true
FROM brokers WHERE name = 'Pepperstone';

INSERT INTO broker_account_types (
    broker_id, account_name, account_type, min_deposit, spread_type,
    commission_structure, leverage, swap_free, best_for_trader_type,
    additional_features, account_description, is_recommended, demo_available
) SELECT
    id, 'Razor Account', 'ECN', 0.00, 'Raw',
    '$3.50 per lot per side', '1:500', false, 'Scalpers and algorithmic traders',
    '{"marketDepth": true, "apiAccess": true}', 'ECN account with raw spreads and commission', true, true
FROM brokers WHERE name = 'Pepperstone';

-- IC Markets account types
INSERT INTO broker_account_types (
    broker_id, account_name, account_type, min_deposit, spread_type,
    commission_structure, leverage, swap_free, best_for_trader_type,
    additional_features, account_description, is_recommended, demo_available
) SELECT
    id, 'Standard', 'Standard', 200.00, 'Variable',
    'No commission', '1:500', false, 'Discretionary traders',
    '{"riskManagement": true}', 'Standard account with variable spreads', true, true
FROM brokers WHERE name = 'IC Markets';

INSERT INTO broker_account_types (
    broker_id, account_name, account_type, min_deposit, spread_type,
    commission_structure, leverage, swap_free, best_for_trader_type,
    additional_features, account_description, is_recommended, demo_available
) SELECT
    id, 'Raw Spread', 'ECN', 200.00, 'Raw',
    '$3.50 per lot per side', '1:500', false, 'Scalpers & Algo traders',
    '{"marketDepth": true, "apiAccess": true}', 'Raw spread account with commission', true, true
FROM brokers WHERE name = 'IC Markets';

INSERT INTO broker_account_types (
    broker_id, account_name, account_type, min_deposit, spread_type,
    commission_structure, leverage, swap_free, best_for_trader_type,
    additional_features, account_description, is_recommended, demo_available
) SELECT
    id, 'cTrader Raw', 'ECN', 200.00, 'Raw',
    '$3.00 per lot per side', '1:500', false, 'cTrader users',
    '{"depthOfMarket": true, "advancedCharting": true}', 'cTrader raw spread account', false, true
FROM brokers WHERE name = 'IC Markets';

-- FP Markets account types
INSERT INTO broker_account_types (
    broker_id, account_name, account_type, min_deposit, spread_type,
    commission_structure, leverage, swap_free, best_for_trader_type,
    additional_features, account_description, is_recommended, demo_available
) SELECT
    id, 'Standard', 'Standard', 100.00, 'Variable',
    'No commission', '1:500', false, 'Beginners and casual traders',
    '{"riskManagement": true, "educationalResources": true}', 'Standard account with variable spreads', true, true
FROM brokers WHERE name = 'FP Markets';

INSERT INTO broker_account_types (
    broker_id, account_name, account_type, min_deposit, spread_type,
    commission_structure, leverage, swap_free, best_for_trader_type,
    additional_features, account_description, is_recommended, demo_available
) SELECT
    id, 'Raw', 'ECN', 100.00, 'Raw',
    '$3.00 per lot per side', '1:500', false, 'Scalpers and high-volume traders',
    '{"marketDepth": true, "apiAccess": true}', 'Raw spread account with commission', true, true
FROM brokers WHERE name = 'FP Markets';

-- Update statistics
ANALYZE brokers;
ANALYZE broker_regulations;
ANALYZE broker_fees;
ANALYZE broker_trading_conditions;
ANALYZE broker_platforms;
ANALYZE broker_account_types;

-- Drop helper functions (optional - keep if needed for future imports)
DROP FUNCTION IF EXISTS safe_array_to_jsonb(TEXT[]);
DROP FUNCTION IF EXISTS extract_numeric_from_string(TEXT);

-- Verify data import
SELECT
    'brokers' as table_name, COUNT(*) as record_count
FROM brokers
UNION ALL
SELECT
    'broker_regulations' as table_name, COUNT(*) as record_count
FROM broker_regulations
UNION ALL
SELECT
    'broker_fees' as table_name, COUNT(*) as record_count
FROM broker_fees
UNION ALL
SELECT
    'broker_trading_conditions' as table_name, COUNT(*) as record_count
FROM broker_trading_conditions
UNION ALL
SELECT
    'broker_platforms' as table_name, COUNT(*) as record_count
FROM broker_platforms
UNION ALL
SELECT
    'broker_account_types' as table_name, COUNT(*) as record_count
FROM broker_account_types;

-- Sample broker data verification
SELECT
    b.name,
    b.score,
    b.founding_year,
    COUNT(DISTINCT br.id) as regulation_count,
    COUNT(DISTINCT bf.id) as fee_count,
    COUNT(DISTINCT btc.id) as trading_conditions_count,
    COUNT(DISTINCT bp.id) as platform_count,
    COUNT(DISTINCT bat.id) as account_type_count
FROM brokers b
LEFT JOIN broker_regulations br ON b.id = br.broker_id
LEFT JOIN broker_fees bf ON b.id = bf.broker_id
LEFT JOIN broker_trading_conditions btc ON b.id = btc.broker_id
LEFT JOIN broker_platforms bp ON b.id = bp.broker_id
LEFT JOIN broker_account_types bat ON b.id = bat.broker_id
GROUP BY b.id, b.name, b.score, b.founding_year
ORDER BY b.score DESC;

-- Complete transaction
COMMIT;

-- Output success message
SELECT 'Broker data import completed successfully!' as status;