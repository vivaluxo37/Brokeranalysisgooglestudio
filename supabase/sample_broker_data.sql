-- Sample data insertion examples for the enhanced brokers table
-- This file shows how to properly format the JSONB fields for each broker

-- Example 1: Insert a comprehensive broker record
INSERT INTO brokers (
  name, logo_url, website_url, score, founding_year, headquarters, description, summary,
  core_info, account_types, fees, tradable_instruments, trading_conditions_extended,
  deposit_withdrawal, promotions, customer_support, security, trading_environment,
  platform_features, account_management, transparency, regulation, ratings, accessibility,
  technology, trading_conditions, copy_trading, is_islamic, provides_signals, social_trading,
  risk_profile
) VALUES (
  'IC Markets',
  'https://example.com/logos/icmarkets.png',
  'https://www.icmarkets.com',
  9.2,
  2007,
  'Sydney, Australia',
  'IC Markets is a leading CFD provider offering forex, indices, commodities, stocks and cryptocurrencies trading.',
  'ECN broker with raw spreads and high liquidity',

  -- core_info
  '{
    "brokerType": "ECN",
    "mobileTrading": true,
    "demoAccount": true
  }'::jsonb,

  -- account_types
  '[{
    "name": "Raw ECN",
    "type": "ECN",
    "minDeposit": 200,
    "spreads": "From 0.0 pips",
    "commission": "$3.50 per lot",
    "bestFor": "Scalpers and algorithmic traders"
  }, {
    "name": "Standard",
    "type": "Standard",
    "minDeposit": 200,
    "spreads": "From 1.0 pips",
    "commission": "None",
    "bestFor": "Beginners and casual traders"
  }]'::jsonb,

  -- fees
  '{
    "trading": {
      "spreadType": "Raw",
      "averageSpreads": [
        {"pair": "EUR/USD", "spread": "0.1"},
        {"pair": "GBP/USD", "spread": "0.3"},
        {"pair": "USD/JPY", "spread": "0.2"}
      ],
      "commissionStructure": "$3.50 per lot per side",
      "overnightSwapFees": "Competitive swap rates"
    },
    "nonTrading": {
      "inactivityFee": "None",
      "withdrawalFee": "Free for most methods",
      "depositFee": "None",
      "conversionFee": "2.5% for currency conversion"
    }
  }'::jsonb,

  -- tradable_instruments
  '{
    "forexPairs": {"total": 64, "details": "Major, minor and exotic currency pairs"},
    "commodities": {"total": 22, "details": "Energy, metals and agricultural products"},
    "indices": {"total": 19, "details": "Global equity indices"},
    "stocks": {"total": 2300, "details": "Australian, US and international stocks"},
    "cryptocurrencies": {"total": 12, "details": "Major cryptocurrencies"},
    "etfs": {"total": 200, "details": "Exchange traded funds"}
  }'::jsonb,

  -- trading_conditions_extended
  '{
    "minTradeSize": 0.01,
    "scalpingAllowed": true,
    "hedgingAllowed": true,
    "eaAllowed": true,
    "negativeBalanceProtection": true,
    "marginCallLevel": "100%",
    "stopOutLevel": "50%"
  }'::jsonb,

  -- deposit_withdrawal
  '{
    "depositMethods": ["Credit Card", "Bank Wire", "PayPal", "Skrill", "Neteller", "Bitcoin"],
    "withdrawalMethods": ["Bank Wire", "Credit Card", "PayPal", "Skrill", "Neteller", "Bitcoin"],
    "depositFees": "None",
    "withdrawalFees": "Free for most methods",
    "processingTime": {
      "deposits": "Instant for e-wallets, 1-3 days for bank transfer",
      "withdrawals": "1-3 business days"
    },
    "minWithdrawal": 50
  }'::jsonb,

  -- promotions
  '{
    "welcomeBonus": "50% deposit bonus up to $2000",
    "depositBonus": "Available on certain deposits",
    "loyaltyProgram": true
  }'::jsonb,

  -- customer_support
  '{
    "languages": ["English", "Chinese", "Spanish", "Arabic", "German", "French"],
    "channels": ["Live Chat", "Phone", "Email", "WhatsApp"],
    "hours": "24/7"
  }'::jsonb,

  -- security
  '{
    "regulatedBy": [
      {"regulator": "ASIC", "licenseNumber": "335692"},
      {"regulator": "CySEC", "licenseNumber": "362/18"},
      {"regulator": "FSA", "licenseNumber": "SD123"}
    ],
    "segregatedAccounts": true,
    "investorCompensationScheme": {
      "available": true,
      "amount": "up to €20,000"
    },
    "twoFactorAuth": true
  }'::jsonb,

  -- trading_environment
  '{
    "executionSpeedMs": 40,
    "slippage": "Low",
    "requotes": false,
    "liquidityProviders": ["Goldman Sachs", "JPMorgan", "Barclays"],
    "marketDepth": true,
    "orderTypes": ["Market", "Limit", "Stop", "Trailing Stop", "OCO"],
    "guaranteedStopLoss": {
      "available": false,
      "cost": null
    }
  }'::jsonb,

  -- platform_features
  '{
    "charting": {
      "indicators": 85,
      "drawingTools": 31
    },
    "automatedTrading": ["EAs", "cTrader Automate", "API"],
    "copyTrading": {
      "available": true,
      "platforms": ["ZuluTrade", "Myfxbook"]
    },
    "backtesting": true,
    "newsIntegration": true
  }'::jsonb,

  -- account_management
  '{
    "islamicAccount": {
      "available": true,
      "conditions": "Available with no overnight fees"
    },
    "baseCurrencies": ["USD", "EUR", "GBP", "AUD", "CHF", "JPY", "CAD", "NZD"],
    "mamPammSupport": true,
    "corporateAccounts": true
  }'::jsonb,

  -- transparency
  '{
    "audited": true,
    "yearsInBusiness": 17,
    "tradingVolumeDisclosed": true,
    "clientBase": "200,000+ clients worldwide"
  }'::jsonb,

  -- Legacy fields
  '{
    "regulators": ["ASIC", "CySEC", "FSA"],
    "regulation": {
      "regulators": ["ASIC", "CySEC", "FSA"]
    }
  }'::jsonb,

  '{
    "regulation": 9.5,
    "costs": 9.0,
    "platforms": 9.0,
    "support": 8.5
  }'::jsonb,

  '{
    "minDeposit": 200,
    "depositMethods": ["Credit Card", "Bank Wire", "PayPal", "Skrill", "Neteller"],
    "withdrawalMethods": ["Bank Wire", "Credit Card", "PayPal", "Skrill", "Neteller"],
    "customerSupport": ["24/7 Live Chat", "Phone", "Email"]
  }'::jsonb,

  '{
    "platforms": ["MT4", "MT5", "cTrader", "WebTrader"],
    "executionType": "ECN",
    "apiAccess": true,
    "eaSupport": true
  }'::jsonb,

  '{
    "spreads": {
      "eurusd": 0.1,
      "gbpusd": 0.3,
      "usdjpy": 0.2
    },
    "commission": "$3.50 per lot",
    "swapFeeCategory": "Low",
    "maxLeverage": "1:500",
    "minLotSize": 0.01
  }'::jsonb,

  true,  -- copy_trading
  true,  -- is_islamic
  true,  -- provides_signals
  '{
    "popularityScore": 85,
    "topTradersCount": 15000,
    "platforms": ["ZuluTrade", "Myfxbook", "cTrader Copy"]
  }'::jsonb,

  -- risk_profile
  '{
    "score": 95,
    "level": "Low",
    "summary": "Well-regulated broker with strong track record and multiple regulatory licenses",
    "signals": [
      {
        "type": "REGULATOR_WARNING",
        "source": "None",
        "description": "No regulatory warnings found",
        "scoreWeight": 0,
        "timestamp": "2024-01-01T00:00:00Z"
      }
    ]
  }'::jsonb
);

-- Example 2: Insert a simpler broker record (Market Maker)
INSERT INTO brokers (
  name, logo_url, website_url, score, founding_year, headquarters, description,
  core_info, fees, tradable_instruments, deposit_withdrawal, customer_support,
  security, technology, trading_conditions
) VALUES (
  'EasyMarkets',
  'https://example.com/logos/easymarkets.png',
  'https://www.easymarkets.com',
  8.5,
  2001,
  'Limassol, Cyprus',
  'EasyMarkets offers simple trading with fixed spreads and guaranteed stop loss.',

  '{"brokerType": "Market Maker", "mobileTrading": true, "demoAccount": true}'::jsonb,

  '{
    "trading": {
      "spreadType": "Fixed",
      "averageSpreads": [{"pair": "EUR/USD", "spread": "1.8"}],
      "commissionStructure": "Included in spread",
      "overnightSwapFees": "Standard swap rates"
    },
    "nonTrading": {
      "inactivityFee": "None",
      "withdrawalFee": "Free",
      "depositFee": "None"
    }
  }'::jsonb,

  '{
    "forexPairs": {"total": 50, "details": "Major and minor currency pairs"},
    "commodities": {"total": 12, "details": "Energy and metals"},
    "indices": {"total": 12, "details": "Major equity indices"},
    "stocks": {"total": 0, "details": "Not available"},
    "cryptocurrencies": {"total": 0, "details": "Not available"}
  }'::jsonb,

  '{
    "depositMethods": ["Credit Card", "Bank Wire", "PayPal", "Neteller"],
    "withdrawalMethods": ["Bank Wire", "Credit Card", "PayPal", "Neteller"],
    "depositFees": "None",
    "withdrawalFees": "Free",
    "processingTime": {
      "deposits": "Instant",
      "withdrawals": "1-3 days"
    },
    "minWithdrawal": 50
  }'::jsonb,

  '{
    "languages": ["English", "Spanish", "Arabic", "Chinese"],
    "channels": ["Live Chat", "Phone", "Email"],
    "hours": "24/5"
  }'::jsonb,

  '{
    "regulatedBy": [
      {"regulator": "CySEC", "licenseNumber": "079/07"},
      {"regulator": "ASIC", "licenseNumber": "246566"}
    ],
    "segregatedAccounts": true,
    "investorCompensationScheme": {
      "available": true,
      "amount": "up to €20,000"
    },
    "twoFactorAuth": false
  }'::jsonb,

  '{
    "platforms": ["MT4", "WebTrader", "Mobile"],
    "executionType": "Market Maker",
    "apiAccess": false,
    "eaSupport": true
  }'::jsonb,

  '{
    "spreads": {
      "eurusd": 1.8,
      "gbpusd": 2.2,
      "usdjpy": 1.6
    },
    "commission": "Included in spread",
    "swapFeeCategory": "Standard",
    "maxLeverage": "1:400",
    "minLotSize": 0.01
  }'::jsonb
);

-- Query examples

-- Query brokers by broker type
SELECT name, score, core_info->>'brokerType' as broker_type
FROM brokers
WHERE core_info->>'brokerType' = 'ECN'
ORDER BY score DESC;

-- Query brokers with specific account types
SELECT name, account_types
FROM brokers
WHERE account_types @> '[{"type": "ECN"}]';

-- Query brokers with specific deposit methods
SELECT name, deposit_withdrawal->'depositMethods' as deposit_methods
FROM brokers
WHERE deposit_withdrawal->'depositMethods' @> '["PayPal"]';

-- Query brokers by regulation
SELECT name, security->'regulatedBy' as regulators
FROM brokers
WHERE security->'regulatedBy' @> '[{"regulator": "ASIC"}]';

-- Query brokers with specific trading features
SELECT name, trading_conditions_extended->'scalpingAllowed' as scalping_allowed
FROM brokers
WHERE trading_conditions_extended->>'scalpingAllowed' = 'true';

-- Query brokers with low risk profile
SELECT name, risk_profile->>'level' as risk_level, risk_profile->>'score' as risk_score
FROM brokers
WHERE risk_profile->>'score'::numeric > 90;

-- Query brokers with Islamic accounts
SELECT name, account_management->'islamicAccount' as islamic_account
FROM brokers
WHERE account_management->'islamicAccount'->>'available' = 'true';

-- Complex query: Find regulated ECN brokers with copy trading
SELECT
  name,
  score,
  core_info->>'brokerType' as broker_type,
  copy_trading,
  security->'regulatedBy' as regulators
FROM brokers
WHERE core_info->>'brokerType' = 'ECN'
  AND copy_trading = true
  AND security->'regulatedBy' @> '[{"regulator": "ASIC"}]'
ORDER BY score DESC;

-- Query for risk assessment: Brokers with regulatory warnings
SELECT
  name,
  risk_profile->>'level' as risk_level,
  risk_profile->>'score' as risk_score,
  risk_profile->'signals' as signals
FROM brokers
WHERE risk_profile->'signals' @> '[{"type": "REGULATOR_WARNING"}]';