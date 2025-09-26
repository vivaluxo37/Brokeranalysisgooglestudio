-- Sample data for Broker Analysis Platform
-- Run this after creating the schema

-- Sample brokers
INSERT INTO brokers (name, description, website, year_founded, headquarters, min_deposit_amount, max_leverage) VALUES
('XM Group', 'XM Group is a leading online forex and CFD broker with a strong global presence. They offer competitive spreads, multiple account types, and excellent customer support.', 'https://www.xm.com', 2009, 'Limassol, Cyprus', 5.00, '1:888'),
('FXTM', 'ForexTime (FXTM) is a well-established broker offering forex and CFD trading with a focus on educational resources and market analysis.', 'https://www.forextime.com', 2011, 'Limassol, Cyprus', 10.00, '1:1000'),
('IC Markets', 'IC Markets is known for its raw spreads and fast execution, making it popular among scalpers and high-frequency traders.', 'https://www.icmarkets.com', 2007, 'Sydney, Australia', 200.00, '1:500'),
('Pepperstone', 'Pepperstone is an Australian broker offering competitive pricing and a wide range of trading instruments with strong regulatory oversight.', 'https://www.pepperstone.com', 2010, 'Melbourne, Australia', 200.00, '1:500'),
('AvaTrade', 'AvaTrade is a multi-regulated broker offering CFDs on forex, stocks, indices, and cryptocurrencies with a user-friendly platform.', 'https://www.avatrade.com', 2006, 'Dublin, Ireland', 100.00, '1:400');

-- Sample broker regulations
INSERT INTO broker_regulations (broker_id, authority, license_number, status, year_obtained) VALUES
((SELECT id FROM brokers WHERE name = 'XM Group'), 'CySEC', '120/10', 'Active', 2009),
((SELECT id FROM brokers WHERE name = 'XM Group'), 'FCA', '559970', 'Active', 2017),
((SELECT id FROM brokers WHERE name = 'XM Group'), 'ASIC', '443670', 'Active', 2010),

((SELECT id FROM brokers WHERE name = 'FXTM'), 'CySEC', '185/12', 'Active', 2012),
((SELECT id FROM brokers WHERE name = 'FXTM'), 'FCA', '600475', 'Active', 2016),
((SELECT id FROM brokers WHERE name = 'FXTM'), 'FSCA', '46614', 'Active', 2016),

((SELECT id FROM brokers WHERE name = 'IC Markets'), 'ASIC', '335692', 'Active', 2009),
((SELECT id FROM brokers WHERE name = 'IC Markets'), 'CySEC', '362/18', 'Active', 2018),
((SELECT id FROM brokers WHERE name = 'IC Markets'), 'FSA', 'SC6014J', 'Active', 2019),

((SELECT id FROM brokers WHERE name = 'Pepperstone'), 'ASIC', '414530', 'Active', 2010),
((SELECT id FROM brokers WHERE name = 'Pepperstone'), 'FCA', '684312', 'Active', 2018),
((SELECT id FROM brokers WHERE name = 'Pepperstone'), 'CySEC', '388/20', 'Active', 2020),

((SELECT id FROM brokers WHERE name = 'AvaTrade'), 'Central Bank of Ireland', 'C53877', 'Active', 2006),
((SELECT id FROM brokers WHERE name = 'AvaTrade'), 'ASIC', '406684', 'Active', 2012),
((SELECT id FROM brokers WHERE name = 'AvaTrade'), 'FSA', 'BGG202011', 'Active', 2020);

-- Sample broker platforms
INSERT INTO broker_platforms (broker_id, name, type, features) VALUES
((SELECT id FROM brokers WHERE name = 'XM Group'), 'MT4', 'Desktop', ARRAY['Expert Advisors', 'Hedging', 'One-Click Trading']),
((SELECT id FROM brokers WHERE name = 'XM Group'), 'MT5', 'Desktop', ARRAY['Expert Advisors', 'Hedging', 'One-Click Trading', 'More Timeframes']),
((SELECT id FROM brokers WHERE name = 'XM Group'), 'XM WebTrader', 'Web', ARRAY['No Download', 'Customizable Interface', 'Real-time Charts']),

((SELECT id FROM brokers WHERE name = 'FXTM'), 'MT4', 'Desktop', ARRAY['Expert Advisors', 'Hedging', 'One-Click Trading']),
((SELECT id FROM brokers WHERE name = 'FXTM'), 'MT5', 'Desktop', ARRAY['Expert Advisors', 'Hedging', 'One-Click Trading', 'More Timeframes']),
((SELECT id FROM brokers WHERE name = 'FXTM'), 'FXTM Trader', 'Mobile', ARRAY['Push Notifications', 'Real-time Quotes', 'Account Management']),

((SELECT id FROM brokers WHERE name = 'IC Markets'), 'MT4', 'Desktop', ARRAY['Expert Advisors', 'Hedging', 'One-Click Trading']),
((SELECT id FROM brokers WHERE name = 'IC Markets'), 'MT5', 'Desktop', ARRAY['Expert Advisors', 'Hedging', 'One-Click Trading', 'More Timeframes']),
((SELECT id FROM brokers WHERE name = 'IC Markets'), 'cTrader', 'Desktop', ARRAY['Level II Pricing', 'Algorithmic Trading', 'Advanced Charting']),

((SELECT id FROM brokers WHERE name = 'Pepperstone'), 'MT4', 'Desktop', ARRAY['Expert Advisors', 'Hedging', 'One-Click Trading']),
((SELECT id FROM brokers WHERE name = 'Pepperstone'), 'MT5', 'Desktop', ARRAY['Expert Advisors', 'Hedging', 'One-Click Trading', 'More Timeframes']),
((SELECT id FROM brokers WHERE name = 'Pepperstone'), 'cTrader', 'Desktop', ARRAY['Level II Pricing', 'Algorithmic Trading', 'Advanced Charting']),

((SELECT id FROM brokers WHERE name = 'AvaTrade'), 'MT4', 'Desktop', ARRAY['Expert Advisors', 'Hedging', 'One-Click Trading']),
((SELECT id FROM brokers WHERE name = 'AvaTrade'), 'MT5', 'Desktop', ARRAY['Expert Advisors', 'Hedging', 'One-Click Trading', 'More Timeframes']),
((SELECT id FROM brokers WHERE name = 'AvaTrade'), 'AvaTradeGO', 'Mobile', ARRAY['Risk Management Tools', 'Real-time Alerts', 'Social Trading']);

-- Sample broker fees
INSERT INTO broker_fees (broker_id, type, amount, description, conditions) VALUES
((SELECT id FROM brokers WHERE name = 'XM Group'), 'Spread', 0.0, 'Variable spreads starting from 0.0 pips', 'On major forex pairs'),
((SELECT id FROM brokers WHERE name = 'XM Group'), 'Commission', 3.5, '$3.5 per lot per side', 'On Zero account'),
((SELECT id FROM brokers WHERE name = 'XM Group'), 'Inactivity', 5.0, '$5 per month after 90 days of inactivity', 'For accounts with balance below $200'),

((SELECT id FROM brokers WHERE name = 'FXTM'), 'Spread', 0.1, 'Variable spreads starting from 0.1 pips', 'On major forex pairs'),
((SELECT id FROM brokers WHERE name = 'FXTM'), 'Commission', 4.0, '$4 per lot per side', 'On ECN account'),
((SELECT id FROM brokers WHERE name = 'FXTM'), 'Withdrawal', NULL, 'Free withdrawals', 'Via credit/debit cards, e-wallets'),

((SELECT id FROM brokers WHERE name = 'IC Markets'), 'Spread', 0.0, 'Raw spreads starting from 0.0 pips', 'On Raw Spread account'),
((SELECT id FROM brokers WHERE name = 'IC Markets'), 'Commission', 3.5, '$3.5 per lot per side', 'On Raw Spread account'),
((SELECT id FROM brokers WHERE name = 'IC Markets'), 'VPS', NULL, 'Free VPS for accounts with $1000+ balance', 'Automated trading'),

((SELECT id FROM brokers WHERE name = 'Pepperstone'), 'Spread', 0.0, 'Raw spreads starting from 0.0 pips', 'On Razor account'),
((SELECT id FROM brokers WHERE name = 'Pepperstone'), 'Commission', 3.5, '$3.5 per lot per side', 'On Razor account'),
((SELECT id FROM brokers WHERE name = 'Pepperstone'), 'Swap', NULL, 'Competitive swap rates', 'Varies by instrument'),

((SELECT id FROM brokers WHERE name = 'AvaTrade'), 'Spread', 0.9, 'Fixed spreads starting from 0.9 pips', 'On major forex pairs'),
((SELECT id FROM brokers WHERE name = 'AvaTrade'), 'Commission', NULL, 'No commission on forex', 'On standard accounts'),
((SELECT id FROM brokers WHERE name = 'AvaTrade'), 'Inactivity', 50.0, '$50 quarterly fee after 3 months', 'For inactive accounts');

-- Sample trading instruments
INSERT INTO broker_trading_instruments (broker_id, instrument_type, available, spreads, commission) VALUES
-- XM Group instruments
((SELECT id FROM brokers WHERE name = 'XM Group'), 'Forex', true, '0.0-1.0 pips', NULL),
((SELECT id FROM brokers WHERE name = 'XM Group'), 'Indices', true, '0.5-2.0 pips', NULL),
((SELECT id FROM brokers WHERE name = 'XM Group'), 'Commodities', true, '0.1-5.0 pips', NULL),
((SELECT id FROM brokers WHERE name = 'XM Group'), 'Stocks', true, NULL, '0.1%'),
((SELECT id FROM brokers WHERE name = 'XM Group'), 'Cryptocurrencies', true, '1.0-5.0%', NULL),

-- FXTM instruments
((SELECT id FROM brokers WHERE name = 'FXTM'), 'Forex', true, '0.1-1.5 pips', NULL),
((SELECT id FROM brokers WHERE name = 'FXTM'), 'Indices', true, '0.5-2.5 pips', NULL),
((SELECT id FROM brokers WHERE name = 'FXTM'), 'Commodities', true, '0.1-5.0 pips', NULL),
((SELECT id FROM brokers WHERE name = 'FXTM'), 'Stocks', true, NULL, '0.15%'),
((SELECT id FROM brokers WHERE name = 'FXTM'), 'Cryptocurrencies', true, '1.5-6.0%', NULL),

-- IC Markets instruments
((SELECT id FROM brokers WHERE name = 'IC Markets'), 'Forex', true, '0.0-0.8 pips', NULL),
((SELECT id FROM brokers WHERE name = 'IC Markets'), 'Indices', true, '0.4-1.8 pips', NULL),
((SELECT id FROM brokers WHERE name = 'IC Markets'), 'Commodities', true, '0.1-4.0 pips', NULL),
((SELECT id FROM brokers WHERE name = 'IC Markets'), 'Stocks', true, NULL, '0.08%'),
((SELECT id FROM brokers WHERE name = 'IC Markets'), 'Cryptocurrencies', true, '0.8-4.0%', NULL),

-- Pepperstone instruments
((SELECT id FROM brokers WHERE name = 'Pepperstone'), 'Forex', true, '0.0-0.7 pips', NULL),
((SELECT id FROM brokers WHERE name = 'Pepperstone'), 'Indices', true, '0.4-1.6 pips', NULL),
((SELECT id FROM brokers WHERE name = 'Pepperstone'), 'Commodities', true, '0.1-3.5 pips', NULL),
((SELECT id FROM brokers WHERE name = 'Pepperstone'), 'Stocks', true, NULL, '0.07%'),
((SELECT id FROM brokers WHERE name = 'Pepperstone'), 'Cryptocurrencies', true, '0.7-3.5%', NULL),

-- AvaTrade instruments
((SELECT id FROM brokers WHERE name = 'AvaTrade'), 'Forex', true, '0.9-2.0 pips', NULL),
((SELECT id FROM brokers WHERE name = 'AvaTrade'), 'Indices', true, '0.8-3.0 pips', NULL),
((SELECT id FROM brokers WHERE name = 'AvaTrade'), 'Commodities', true, '0.2-6.0 pips', NULL),
((SELECT id FROM brokers WHERE name = 'AvaTrade'), 'Stocks', true, NULL, '0.12%'),
((SELECT id FROM brokers WHERE name = 'AvaTrade'), 'Cryptocurrencies', true, '1.0-5.0%', NULL);

-- Sample customer support
INSERT INTO broker_customer_support (broker_id, language, availability, methods) VALUES
-- XM Group support
((SELECT id FROM brokers WHERE name = 'XM Group'), 'English', '24/7', ARRAY['Live Chat', 'Email', 'Phone', 'Ticket']),
((SELECT id FROM brokers WHERE name = 'XM Group'), 'Arabic', '24/5', ARRAY['Live Chat', 'Email', 'Phone']),
((SELECT id FROM brokers WHERE name = 'XM Group'), 'Spanish', '24/5', ARRAY['Live Chat', 'Email', 'Phone']),
((SELECT id FROM brokers WHERE name = 'XM Group'), 'Chinese', '24/5', ARRAY['Live Chat', 'Email']),

-- FXTM support
((SELECT id FROM brokers WHERE name = 'FXTM'), 'English', '24/5', ARRAY['Live Chat', 'Email', 'Phone', 'Ticket']),
((SELECT id FROM brokers WHERE name = 'FXTM'), 'Arabic', '24/5', ARRAY['Live Chat', 'Email', 'Phone']),
((SELECT id FROM brokers WHERE name = 'FXTM'), 'Russian', '24/5', ARRAY['Live Chat', 'Email', 'Phone']),
((SELECT id FROM brokers WHERE name = 'FXTM'), 'Indonesian', '24/5', ARRAY['Live Chat', 'Email']),

-- IC Markets support
((SELECT id FROM brokers WHERE name = 'IC Markets'), 'English', '24/7', ARRAY['Live Chat', 'Email', 'Phone']),
((SELECT id FROM brokers WHERE name = 'IC Markets'), 'Chinese', '24/5', ARRAY['Live Chat', 'Email']),
((SELECT id FROM brokers WHERE name = 'IC Markets'), 'Japanese', '24/5', ARRAY['Email', 'Phone']),
((SELECT id FROM brokers WHERE name = 'IC Markets'), 'Korean', '24/5', ARRAY['Email', 'Phone']),

-- Pepperstone support
((SELECT id FROM brokers WHERE name = 'Pepperstone'), 'English', '24/5', ARRAY['Live Chat', 'Email', 'Phone']),
((SELECT id FROM brokers WHERE name = 'Pepperstone'), 'Chinese', '24/5', ARRAY['Live Chat', 'Email']),
((SELECT id FROM brokers WHERE name = 'Pepperstone'), 'Arabic', '24/5', ARRAY['Email', 'Phone']),
((SELECT id FROM brokers WHERE name = 'Pepperstone'), 'Spanish', '24/5', ARRAY['Email', 'Phone']),

-- AvaTrade support
((SELECT id FROM brokers WHERE name = 'AvaTrade'), 'English', '24/5', ARRAY['Live Chat', 'Email', 'Phone', 'Ticket']),
((SELECT id FROM brokers WHERE name = 'AvaTrade'), 'French', '24/5', ARRAY['Live Chat', 'Email', 'Phone']),
((SELECT id FROM brokers WHERE name = 'AvaTrade'), 'German', '24/5', ARRAY['Live Chat', 'Email', 'Phone']),
((SELECT id FROM brokers WHERE name = 'AvaTrade'), 'Italian', '24/5', ARRAY['Live Chat', 'Email', 'Phone']);

-- Sample reviews
INSERT INTO reviews (user_id, broker_id, rating, title, content, verified) VALUES
-- Sample user IDs will be created separately
-- (These will be updated with actual user IDs after user creation)
('00000000-0000-0000-0000-000000000001', (SELECT id FROM brokers WHERE name = 'XM Group'), 5, 'Excellent broker', 'XM Group has been my broker for over 2 years. Great spreads, fast execution, and excellent customer support. Highly recommended!', true),
('00000000-0000-0000-0000-000000000002', (SELECT id FROM brokers WHERE name = 'XM Group'), 4, 'Good overall experience', 'Solid broker with competitive spreads. The only downside is the inactivity fee, but otherwise very happy with their service.', true),
('00000000-0000-0000-0000-000000000003', (SELECT id FROM brokers WHERE name = 'FXTM'), 5, 'Great for beginners', 'FXTM offers excellent educational resources and market analysis. Perfect for traders who want to learn while trading.', true),
('00000000-0000-0000-0000-000000000004', (SELECT id FROM brokers WHERE name = 'IC Markets'), 5, 'Best for scalpers', 'IC Markets offers the rawest spreads I''ve found. Perfect for my scalping strategy. Execution is lightning fast.', true),
('00000000-0000-0000-0000-000000000005', (SELECT id FROM brokers WHERE name = 'Pepperstone'), 4, 'Reliable broker', 'Been trading with Pepperstone for 3 years. Never had any issues with withdrawals or platform stability.', true),
('00000000-0000-0000-0000-000000000006', (SELECT id FROM brokers WHERE name = 'AvaTrade'), 3, 'Mixed feelings', 'Good broker but spreads are a bit wide compared to others. Customer support is helpful though.', true);

-- Create sample users (these should be replaced with actual Clerk user IDs)
INSERT INTO users (id, email, name, trading_level, trading_experience, risk_tolerance) VALUES
('00000000-0000-0000-0000-000000000001', 'john.doe@example.com', 'John Doe', 'Intermediate', '3-5 years', 'Medium'),
('00000000-0000-0000-0000-000000000002', 'jane.smith@example.com', 'Jane Smith', 'Advanced', '5+ years', 'High'),
('00000000-0000-0000-0000-000000000003', 'mike.wilson@example.com', 'Mike Wilson', 'Beginner', '0-1 years', 'Low'),
('00000000-0000-0000-0000-000000000004', 'sarah.johnson@example.com', 'Sarah Johnson', 'Intermediate', '2-3 years', 'Medium'),
('00000000-0000-0000-0000-000000000005', 'david.brown@example.com', 'David Brown', 'Advanced', '7+ years', 'High'),
('00000000-0000-0000-0000-000000000006', 'lisa.davis@example.com', 'Lisa Davis', 'Beginner', '0-1 years', 'Low');

-- Update the broker average ratings and review counts
UPDATE brokers SET average_rating = 4.5, review_count = 2 WHERE name = 'XM Group';
UPDATE brokers SET average_rating = 5.0, review_count = 1 WHERE name = 'FXTM';
UPDATE brokers SET average_rating = 5.0, review_count = 1 WHERE name = 'IC Markets';
UPDATE brokers SET average_rating = 4.0, review_count = 1 WHERE name = 'Pepperstone';
UPDATE brokers SET average_rating = 3.0, review_count = 1 WHERE name = 'AvaTrade';

-- Sample discussions
INSERT INTO discussions (user_id, broker_id, title, content, category, view_count) VALUES
('00000000-0000-0000-0000-000000000001', (SELECT id FROM brokers WHERE name = 'XM Group'), 'Best strategies for scalping on XM?', 'I''ve been using XM for a few months and want to start scalping. What strategies work best on their platform? Any tips for avoiding slippage?', 'Strategy', 150),
('00000000-0000-0000-0000-000000000002', (SELECT id FROM brokers WHERE name = 'IC Markets'), 'Raw Spread account vs Standard account', 'Is the Raw Spread account worth the commission? I''m trading about 5 lots per month. Any advice would be appreciated.', 'Account Types', 200),
('00000000-0000-0000-0000-000000000003', (SELECT id FROM brokers WHERE name = 'FXTM'), 'FXTM withdrawal times', 'How long does it usually take to withdraw to Skrill? My withdrawal has been pending for 48 hours. Is this normal?', 'Withdrawals', 300),
('00000000-0000-0000-0000-000000000004', NULL, 'Choosing between MT4 and MT5', 'I''m new to trading and can''t decide between MT4 and MT5. What are the main differences and which one would you recommend for a beginner?', 'Platforms', 500),
('00000000-0000-0000-0000-000000000005', (SELECT id FROM brokers WHERE name = 'Pepperstone'), 'Pepperstone customer support experience', 'Had an amazing experience with Pepperstone support today. They resolved my account issue in under 10 minutes via live chat.', 'Customer Service', 80);

-- Sample discussion replies
INSERT INTO discussion_replies (discussion_id, user_id, content) VALUES
((SELECT id FROM discussions WHERE title = 'Best strategies for scalping on XM?'), '00000000-0000-0000-0000-000000000002', 'I''ve been scalping EUR/USD on XM for about a year. The key is to trade during major news releases and use tight stop losses. Their spreads are tightest during London session.'),
((SELECT id FROM discussions WHERE title = 'Best strategies for scalping on XM?'), '00000000-0000-0000-0000-000000000004', 'Make sure you''re on their Zero account for the best spreads. I trade about 2-3 lots per day and the $3.5 commission per lot is worth it for the raw spreads.'),
((SELECT id FROM discussions WHERE title = 'Raw Spread account vs Standard account'), '00000000-0000-0000-0000-000000000001', 'At 5 lots per month, you''re probably better off with the Raw Spread account. The tighter spreads will save you more than the commission costs, especially on major pairs.'),
((SELECT id FROM discussions WHERE title = 'Choosing between MT4 and MT5'), '00000000-0000-0000-0000-000000000003', 'I''d recommend starting with MT4. It''s simpler, has more educational resources, and most brokers support it well. You can always switch to MT5 later when you''re more experienced.'),
((SELECT id FROM discussions WHERE title = 'Choosing between MT4 and MT5'), '00000000-0000-0000-0000-000000000005', 'MT5 has more timeframes and better charting tools, but MT4 has more indicators and EAs available. For a beginner, MT4 is definitely the way to go.');