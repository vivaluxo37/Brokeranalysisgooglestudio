-- Broker Database Schema
-- This replaces the large brokers.ts file with a proper database structure

-- Main brokers table
CREATE TABLE brokers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    logo_url VARCHAR(255),
    website_url VARCHAR(255),
    score DECIMAL(3,1),
    founding_year INTEGER,
    headquarters VARCHAR(255),
    description TEXT,
    summary TEXT,
    broker_type VARCHAR(50), -- ECN, STP, Market Maker, etc.
    mobile_trading BOOLEAN DEFAULT TRUE,
    demo_account BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Trading fees and conditions
CREATE TABLE broker_fees (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    broker_id VARCHAR(50) REFERENCES brokers(id),
    spread_type VARCHAR(20), -- Fixed, Variable, Raw
    eur_usd_spread DECIMAL(4,2),
    gbp_usd_spread DECIMAL(4,2),
    usd_jpy_spread DECIMAL(4,2),
    commission_structure TEXT,
    overnight_swap_fees TEXT,
    inactivity_fee VARCHAR(100),
    withdrawal_fee VARCHAR(100),
    deposit_fee VARCHAR(100),
    max_leverage VARCHAR(10),
    min_lot_size DECIMAL(4,2)
);

-- Account types
CREATE TABLE broker_account_types (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    broker_id VARCHAR(50) REFERENCES brokers(id),
    name VARCHAR(100),
    type VARCHAR(50),
    min_deposit INTEGER,
    spreads VARCHAR(100),
    commission VARCHAR(100),
    best_for VARCHAR(200)
);

-- Trading platforms
CREATE TABLE broker_platforms (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    broker_id VARCHAR(50) REFERENCES brokers(id),
    name VARCHAR(100),
    type VARCHAR(20), -- desktop, mobile, web
    api_access BOOLEAN DEFAULT FALSE,
    ea_support BOOLEAN DEFAULT FALSE,
    indicators_count INTEGER,
    drawing_tools_count INTEGER
);

-- Regulatory information
CREATE TABLE broker_regulations (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    broker_id VARCHAR(50) REFERENCES brokers(id),
    regulator VARCHAR(100),
    license_number VARCHAR(100),
    jurisdiction VARCHAR(100)
);

-- Trading instruments
CREATE TABLE broker_instruments (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    broker_id VARCHAR(50) REFERENCES brokers(id),
    instrument_type VARCHAR(50), -- forex, stocks, commodities, indices, crypto, etfs
    total_count INTEGER,
    details TEXT
);

-- Customer support
CREATE TABLE broker_support (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    broker_id VARCHAR(50) REFERENCES brokers(id),
    support_hours VARCHAR(50),
    channels JSON, -- ["Live Chat", "Phone", "Email"]
    languages JSON -- ["English", "German", "French"]
);

-- Broker pros and cons
CREATE TABLE broker_pros_cons (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    broker_id VARCHAR(50) REFERENCES brokers(id),
    type ENUM('pro', 'con'),
    description TEXT
);

-- Broker reviews
CREATE TABLE broker_reviews (
    id VARCHAR(50) PRIMARY KEY,
    broker_id VARCHAR(50) REFERENCES brokers(id),
    user_id VARCHAR(50),
    user_name VARCHAR(100),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Broker rankings/scores by category
CREATE TABLE broker_ratings (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    broker_id VARCHAR(50) REFERENCES brokers(id),
    regulation_rating DECIMAL(3,1),
    costs_rating DECIMAL(3,1),
    platforms_rating DECIMAL(3,1),
    support_rating DECIMAL(3,1),
    overall_rating DECIMAL(3,1)
);

-- Deposit/Withdrawal methods
CREATE TABLE broker_payment_methods (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    broker_id VARCHAR(50) REFERENCES brokers(id),
    method_type ENUM('deposit', 'withdrawal'),
    method_name VARCHAR(100),
    processing_time VARCHAR(100),
    fees VARCHAR(100),
    min_amount DECIMAL(10,2)
);

-- Safety features
CREATE TABLE broker_safety_features (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    broker_id VARCHAR(50) REFERENCES brokers(id),
    feature_name VARCHAR(100),
    available BOOLEAN DEFAULT FALSE,
    details TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_brokers_score ON brokers(score);
CREATE INDEX idx_brokers_founding_year ON brokers(founding_year);
CREATE INDEX idx_broker_fees_broker_id ON broker_fees(broker_id);
CREATE INDEX idx_broker_reviews_broker_id ON broker_reviews(broker_id);
CREATE INDEX idx_broker_reviews_rating ON broker_reviews(rating);