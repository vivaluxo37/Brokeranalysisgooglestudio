-- Seed script for promotions system
-- This script populates the promotions tables with sample data
-- Run this after the 003_promotions_schema.sql migration

-- ============================================================================
-- SAMPLE PROMOTIONS DATA
-- ============================================================================

-- First, let's get some broker IDs to work with (assuming brokers exist)
-- We'll use the first few brokers in the system

DO $
DECLARE
    broker_1_id BIGINT;
    broker_2_id BIGINT;
    broker_3_id BIGINT;
    broker_4_id BIGINT;
    broker_5_id BIGINT;
    
    -- Promotion IDs for referencing in rates and features
    promo_1_id UUID;
    promo_2_id UUID;
    promo_3_id UUID;
    promo_4_id UUID;
    promo_5_id UUID;
    promo_6_id UUID;
    promo_7_id UUID;
    promo_8_id UUID;
BEGIN
    -- Get some broker IDs (assuming brokers table has data)
    SELECT id INTO broker_1_id FROM brokers ORDER BY id LIMIT 1 OFFSET 0;
    SELECT id INTO broker_2_id FROM brokers ORDER BY id LIMIT 1 OFFSET 1;
    SELECT id INTO broker_3_id FROM brokers ORDER BY id LIMIT 1 OFFSET 2;
    SELECT id INTO broker_4_id FROM brokers ORDER BY id LIMIT 1 OFFSET 3;
    SELECT id INTO broker_5_id FROM brokers ORDER BY id LIMIT 1 OFFSET 4;
    
    -- If we don't have enough brokers, create some sample ones
    IF broker_1_id IS NULL THEN
        INSERT INTO brokers (name, description, website_url, score, founding_year, headquarters)
        VALUES 
            ('Sample Broker 1', 'A reliable forex broker', 'https://example1.com', 8.5, 2010, 'London, UK'),
            ('Sample Broker 2', 'ECN broker with tight spreads', 'https://example2.com', 9.0, 2008, 'Sydney, Australia'),
            ('Sample Broker 3', 'Multi-asset trading platform', 'https://example3.com', 8.2, 2012, 'New York, USA'),
            ('Sample Broker 4', 'Islamic trading accounts available', 'https://example4.com', 7.8, 2015, 'Dubai, UAE'),
            ('Sample Broker 5', 'Copy trading specialist', 'https://example5.com', 8.7, 2011, 'Cyprus')
        RETURNING id INTO broker_1_id;
        
        SELECT id INTO broker_2_id FROM brokers ORDER BY id DESC LIMIT 1 OFFSET 1;
        SELECT id INTO broker_3_id FROM brokers ORDER BY id DESC LIMIT 1 OFFSET 2;
        SELECT id INTO broker_4_id FROM brokers ORDER BY id DESC LIMIT 1 OFFSET 3;
        SELECT id INTO broker_5_id FROM brokers ORDER BY id DESC LIMIT 1 OFFSET 4;
    END IF;
    
    -- ========================================================================
    -- INSERT SAMPLE PROMOTIONS
    -- ========================================================================
    
    -- Promotion 1: High-tier cashback program
    INSERT INTO promotions (
        id, broker_id, title, description, promotion_type, is_active, is_featured, is_exclusive,
        start_date, end_date, activation_method, contact_info, requirements, terms, website_url
    ) VALUES (
        gen_random_uuid(), broker_1_id, 
        'Premium Cashback Program - Up to $15 per lot',
        'Get the highest cashback rates in the industry with our premium program. Earn up to $15 per standard lot traded on major currency pairs.',
        'cashback', true, true, false,
        NOW(), NOW() + INTERVAL '6 months',
        'automatic',
        '{"email": "cashback@broker1.com", "telegram": "@broker1support"}',
        '{"minDeposit": 500, "accountTypes": ["Standard", "ECN"], "newClientsOnly": false}',
        'Cashback is paid monthly. Minimum trading volume of 10 lots per month required.',
        'https://broker1.com/cashback-program'
    ) RETURNING id INTO promo_1_id;
    
    -- Promotion 2: Welcome deposit bonus
    INSERT INTO promotions (
        id, broker_id, title, description, promotion_type, is_active, is_featured, is_popular,
        start_date, activation_method, contact_info, requirements, terms, website_url
    ) VALUES (
        gen_random_uuid(), broker_2_id,
        '100% Welcome Deposit Bonus up to $5,000',
        'Double your trading capital with our generous welcome bonus. Get 100% bonus on your first deposit up to $5,000.',
        'deposit_bonus', true, false, true,
        NOW(),
        'automatic',
        '{"email": "bonus@broker2.com"}',
        '{"minDeposit": 100, "accountTypes": ["Standard"], "newClientsOnly": true, "verificationRequired": true}',
        'Bonus must be traded 30 times before withdrawal. Valid for 90 days from deposit.',
        'https://broker2.com/welcome-bonus'
    ) RETURNING id INTO promo_2_id;
    
    -- Promotion 3: Commission discount program
    INSERT INTO promotions (
        id, broker_id, title, description, promotion_type, is_active, is_featured,
        start_date, end_date, activation_method, contact_info, requirements, terms
    ) VALUES (
        gen_random_uuid(), broker_3_id,
        'VIP Commission Discount - Save up to 50%',
        'Reduce your trading costs with our VIP commission discount program. Higher volume traders get better rates.',
        'commission_discount', true, true,
        NOW(), NOW() + INTERVAL '1 year',
        'contact_required',
        '{"email": "vip@broker3.com", "telegram": "@broker3vip", "phone": "+1-555-0123"}',
        '{"minDeposit": 10000, "accountTypes": ["ECN", "Pro"], "tradingVolume": 100}',
        'Discount applied automatically based on monthly trading volume. Contact VIP team for custom rates.'
    ) RETURNING id INTO promo_3_id;
    
    -- Promotion 4: Copy trading bonus
    INSERT INTO promotions (
        id, broker_id, title, description, promotion_type, is_active, is_popular,
        start_date, activation_method, requirements, terms, website_url
    ) VALUES (
        gen_random_uuid(), broker_4_id,
        'Copy Trading Starter Bonus - $200 Free',
        'Start copy trading with a $200 bonus. Follow successful traders and earn while you learn.',
        'copy_trading', true, true,
        NOW(),
        'manual',
        '{"minDeposit": 250, "accountTypes": ["Copy Trading"], "newClientsOnly": true}',
        'Bonus credited after first copy trade. Must maintain minimum balance for 30 days.',
        'https://broker4.com/copy-trading-bonus'
    ) RETURNING id INTO promo_4_id;
    
    -- Promotion 5: VIP program
    INSERT INTO promotions (
        id, broker_id, title, description, promotion_type, is_active, is_featured, is_exclusive,
        start_date, activation_method, contact_info, requirements, terms
    ) VALUES (
        gen_random_uuid(), broker_5_id,
        'Exclusive VIP Program - Premium Benefits',
        'Join our exclusive VIP program for high-volume traders. Enjoy premium spreads, dedicated support, and exclusive events.',
        'vip_program', true, true, true,
        NOW(),
        'contact_required',
        '{"email": "vip@broker5.com", "phone": "+44-20-7946-0958", "telegram": "@broker5vip"}',
        '{"minDeposit": 25000, "tradingVolume": 500, "accountTypes": ["VIP"]}',
        'VIP status reviewed monthly based on trading activity. Invitation only program.'
    ) RETURNING id INTO promo_5_id;
    
    -- Promotion 6: No deposit bonus
    INSERT INTO promotions (
        id, broker_id, title, description, promotion_type, is_active, is_popular,
        start_date, end_date, activation_method, requirements, terms, website_url
    ) VALUES (
        gen_random_uuid(), broker_1_id,
        'No Deposit Bonus - $50 Free Trading Credit',
        'Start trading without any deposit. Get $50 free trading credit to test our platform and strategies.',
        'no_deposit_bonus', true, true,
        NOW(), NOW() + INTERVAL '3 months',
        'automatic',
        '{"minDeposit": 0, "newClientsOnly": true, "verificationRequired": true}',
        'Profits can be withdrawn after trading 5 lots. Maximum withdrawal $100.',
        'https://broker1.com/no-deposit-bonus'
    ) RETURNING id INTO promo_6_id;
    
    -- Promotion 7: Trading competition
    INSERT INTO promotions (
        id, broker_id, title, description, promotion_type, is_active, is_featured,
        start_date, end_date, activation_method, requirements, terms, website_url
    ) VALUES (
        gen_random_uuid(), broker_2_id,
        'Monthly Trading Championship - $10,000 Prize Pool',
        'Compete with traders worldwide in our monthly championship. Top 10 traders share $10,000 prize pool.',
        'trading_competition', true, true,
        NOW(), NOW() + INTERVAL '1 month',
        'manual',
        '{"minDeposit": 1000, "accountTypes": ["Standard", "ECN"]}',
        'Competition runs monthly. Minimum 50 trades required. Demo accounts not eligible.',
        'https://broker2.com/trading-competition'
    ) RETURNING id INTO promo_7_id;
    
    -- Promotion 8: Platform bonus
    INSERT INTO promotions (
        id, broker_id, title, description, promotion_type, is_active,
        start_date, activation_method, requirements, terms, website_url
    ) VALUES (
        gen_random_uuid(), broker_3_id,
        'Mobile Trading Bonus - Extra $100',
        'Get an extra $100 bonus when you make your first trade on our mobile app. Trade anywhere, anytime.',
        'platform_bonus', true,
        NOW(),
        'automatic',
        '{"minDeposit": 200, "accountTypes": ["Standard"], "newClientsOnly": true}',
        'Bonus credited after first mobile trade. Available on iOS and Android apps.',
        'https://broker3.com/mobile-bonus'
    ) RETURNING id INTO promo_8_id;
    
    -- ========================================================================
    -- INSERT PROMOTION RATES (TIERED RATES FOR CASHBACK AND DISCOUNTS)
    -- ========================================================================
    
    -- Rates for Premium Cashback Program (promo_1_id)
    INSERT INTO promotion_rates (promotion_id, tier_name, min_volume, max_volume, rate_type, rate_value, currency, frequency, description, display_order) VALUES
    (promo_1_id, 'Standard', 0, 50, 'fixed_per_lot', 8.00, 'USD', 'monthly', 'Standard cashback rate for up to 50 lots', 1),
    (promo_1_id, 'Silver', 50, 100, 'fixed_per_lot', 10.00, 'USD', 'monthly', 'Silver tier for 50-100 lots monthly', 2),
    (promo_1_id, 'Gold', 100, 250, 'fixed_per_lot', 12.00, 'USD', 'monthly', 'Gold tier for 100-250 lots monthly', 3),
    (promo_1_id, 'Platinum', 250, NULL, 'fixed_per_lot', 15.00, 'USD', 'monthly', 'Platinum tier for 250+ lots monthly', 4);
    
    -- Rates for VIP Commission Discount (promo_3_id)
    INSERT INTO promotion_rates (promotion_id, tier_name, min_volume, max_volume, rate_type, rate_value, currency, frequency, description, display_order) VALUES
    (promo_3_id, 'VIP Bronze', 100, 300, 'percentage', 20.00, 'USD', 'monthly', '20% commission discount', 1),
    (promo_3_id, 'VIP Silver', 300, 500, 'percentage', 35.00, 'USD', 'monthly', '35% commission discount', 2),
    (promo_3_id, 'VIP Gold', 500, NULL, 'percentage', 50.00, 'USD', 'monthly', '50% commission discount', 3);
    
    -- Rates for Welcome Deposit Bonus (promo_2_id)
    INSERT INTO promotion_rates (promotion_id, tier_name, min_volume, max_volume, rate_type, rate_value, currency, frequency, description, display_order) VALUES
    (promo_2_id, 'Standard Bonus', 100, 5000, 'percentage', 100.00, 'USD', 'one_time', '100% bonus on deposit', 1);
    
    -- Rates for Copy Trading Bonus (promo_4_id)
    INSERT INTO promotion_rates (promotion_id, tier_name, min_volume, max_volume, rate_type, rate_value, currency, frequency, description, display_order) VALUES
    (promo_4_id, 'Copy Bonus', 250, NULL, 'fixed_amount', 200.00, 'USD', 'one_time', '$200 copy trading bonus', 1);
    
    -- Rates for No Deposit Bonus (promo_6_id)
    INSERT INTO promotion_rates (promotion_id, tier_name, min_volume, max_volume, rate_type, rate_value, currency, frequency, description, display_order) VALUES
    (promo_6_id, 'Free Credit', 0, NULL, 'fixed_amount', 50.00, 'USD', 'one_time', '$50 free trading credit', 1);
    
    -- ========================================================================
    -- INSERT PROMOTION FEATURES
    -- ========================================================================
    
    -- Features for Premium Cashback Program (promo_1_id)
    INSERT INTO promotion_features (promotion_id, feature_text, feature_type, display_order, is_highlighted) VALUES
    (promo_1_id, 'Highest cashback rates in the industry', 'advantage', 1, true),
    (promo_1_id, 'Automatic monthly payments', 'advantage', 2, false),
    (promo_1_id, 'No maximum earning limit', 'advantage', 3, true),
    (promo_1_id, 'Minimum 10 lots per month required', 'requirement', 4, false),
    (promo_1_id, 'Available for Standard and ECN accounts', 'note', 5, false);
    
    -- Features for Welcome Deposit Bonus (promo_2_id)
    INSERT INTO promotion_features (promotion_id, feature_text, feature_type, display_order, is_highlighted) VALUES
    (promo_2_id, 'Double your trading capital instantly', 'advantage', 1, true),
    (promo_2_id, 'Up to $5,000 bonus available', 'advantage', 2, true),
    (promo_2_id, 'New clients only', 'requirement', 3, false),
    (promo_2_id, 'Account verification required', 'requirement', 4, false),
    (promo_2_id, '30x trading volume requirement', 'requirement', 5, false),
    (promo_2_id, 'Bonus expires after 90 days', 'warning', 6, false);
    
    -- Features for VIP Commission Discount (promo_3_id)
    INSERT INTO promotion_features (promotion_id, feature_text, feature_type, display_order, is_highlighted) VALUES
    (promo_3_id, 'Save up to 50% on commissions', 'advantage', 1, true),
    (promo_3_id, 'Dedicated VIP account manager', 'advantage', 2, false),
    (promo_3_id, 'Custom rates for high-volume traders', 'advantage', 3, true),
    (promo_3_id, 'Minimum $10,000 deposit required', 'requirement', 4, false),
    (promo_3_id, 'ECN or Pro account required', 'requirement', 5, false),
    (promo_3_id, 'Contact VIP team for activation', 'note', 6, false);
    
    -- Features for Copy Trading Bonus (promo_4_id)
    INSERT INTO promotion_features (promotion_id, feature_text, feature_type, display_order, is_highlighted) VALUES
    (promo_4_id, '$200 free trading credit', 'advantage', 1, true),
    (promo_4_id, 'Access to top-performing traders', 'advantage', 2, false),
    (promo_4_id, 'Risk management tools included', 'advantage', 3, false),
    (promo_4_id, 'Minimum $250 deposit required', 'requirement', 4, false),
    (promo_4_id, 'Must maintain balance for 30 days', 'requirement', 5, false);
    
    -- Features for VIP Program (promo_5_id)
    INSERT INTO promotion_features (promotion_id, feature_text, feature_type, display_order, is_highlighted) VALUES
    (promo_5_id, 'Exclusive premium spreads', 'advantage', 1, true),
    (promo_5_id, '24/7 dedicated support', 'advantage', 2, false),
    (promo_5_id, 'Invitation to exclusive events', 'advantage', 3, true),
    (promo_5_id, 'Priority withdrawal processing', 'advantage', 4, false),
    (promo_5_id, 'Minimum $25,000 deposit', 'requirement', 5, false),
    (promo_5_id, 'Invitation only program', 'requirement', 6, false),
    (promo_5_id, 'Status reviewed monthly', 'note', 7, false);
    
    -- Features for No Deposit Bonus (promo_6_id)
    INSERT INTO promotion_features (promotion_id, feature_text, feature_type, display_order, is_highlighted) VALUES
    (promo_6_id, 'No deposit required', 'advantage', 1, true),
    (promo_6_id, '$50 free trading credit', 'advantage', 2, true),
    (promo_6_id, 'Test platform risk-free', 'advantage', 3, false),
    (promo_6_id, 'Account verification required', 'requirement', 4, false),
    (promo_6_id, 'Trade 5 lots to withdraw profits', 'requirement', 5, false),
    (promo_6_id, 'Maximum withdrawal $100', 'warning', 6, false);
    
    -- Features for Trading Competition (promo_7_id)
    INSERT INTO promotion_features (promotion_id, feature_text, feature_type, display_order, is_highlighted) VALUES
    (promo_7_id, '$10,000 total prize pool', 'advantage', 1, true),
    (promo_7_id, 'Monthly competition', 'advantage', 2, false),
    (promo_7_id, 'Compete with global traders', 'advantage', 3, false),
    (promo_7_id, 'Minimum $1,000 deposit', 'requirement', 4, false),
    (promo_7_id, 'Minimum 50 trades required', 'requirement', 5, false),
    (promo_7_id, 'Live accounts only', 'requirement', 6, false);
    
    -- Features for Mobile Trading Bonus (promo_8_id)
    INSERT INTO promotion_features (promotion_id, feature_text, feature_type, display_order, is_highlighted) VALUES
    (promo_8_id, '$100 mobile trading bonus', 'advantage', 1, true),
    (promo_8_id, 'Available on iOS and Android', 'advantage', 2, false),
    (promo_8_id, 'Full trading functionality', 'advantage', 3, false),
    (promo_8_id, 'Make first trade on mobile app', 'requirement', 4, false),
    (promo_8_id, 'Minimum $200 deposit', 'requirement', 5, false);
    
    -- ========================================================================
    -- INSERT SAMPLE ANALYTICS DATA
    -- ========================================================================
    
    -- Generate some sample analytics data for the past 30 days
    INSERT INTO promotion_analytics (promotion_id, date, views, clicks, conversions, unique_visitors)
    SELECT 
        p.id,
        generate_series(CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, '1 day')::date,
        (random() * 100 + 50)::integer, -- 50-150 views per day
        (random() * 20 + 5)::integer,   -- 5-25 clicks per day
        (random() * 3)::integer,        -- 0-3 conversions per day
        (random() * 80 + 40)::integer   -- 40-120 unique visitors per day
    FROM promotions p
    WHERE p.id IN (promo_1_id, promo_2_id, promo_3_id, promo_4_id, promo_5_id, promo_6_id, promo_7_id, promo_8_id);
    
    RAISE NOTICE 'Successfully seeded promotions system with sample data';
    RAISE NOTICE 'Created % promotions with rates, features, and analytics', 8;
    
END $;