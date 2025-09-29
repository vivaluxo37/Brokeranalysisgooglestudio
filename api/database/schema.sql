-- Broker Analysis Platform Database Schema
-- Created for Vercel serverless backend with Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    trading_level VARCHAR(50),
    trading_experience TEXT,
    preferred_instruments TEXT[],
    risk_tolerance VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Brokers table
CREATE TABLE brokers (
    id VARCHAR(255) PRIMARY KEY, -- Using string IDs like 'pepperstone', 'ic-markets'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    logo_url TEXT,
    website_url VARCHAR(500),
    score DECIMAL(3, 2) DEFAULT 0,
    founding_year INTEGER,
    headquarters VARCHAR(255),
    summary TEXT,
    broker_type VARCHAR(100) DEFAULT 'Market Maker',
    mobile_trading BOOLEAN DEFAULT true,
    demo_account BOOLEAN DEFAULT true,
    min_deposit_amount DECIMAL(10, 2) DEFAULT 0,
    max_leverage VARCHAR(50),
    average_rating DECIMAL(3, 2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    
    -- Store complex data as JSONB for flexibility
    pros TEXT[], -- Array of pros
    cons TEXT[], -- Array of cons
    account_types JSONB, -- Store account types as JSON
    fees JSONB, -- Store fee structure as JSON
    tradable_instruments JSONB, -- Store instrument data as JSON
    trading_conditions JSONB, -- Store trading conditions as JSON
    deposit_withdrawal JSONB, -- Store payment methods as JSON
    security JSONB, -- Store security features as JSON
    trading_environment JSONB, -- Store execution data as JSON
    platform_features JSONB, -- Store platform features as JSON
    account_management JSONB, -- Store account management features as JSON
    transparency JSONB, -- Store transparency data as JSON
    accessibility JSONB, -- Store accessibility data as JSON
    
    -- Rating breakdown
    regulation_rating DECIMAL(3, 2),
    costs_rating DECIMAL(3, 2),
    platforms_rating DECIMAL(3, 2),
    support_rating DECIMAL(3, 2),
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Broker regulations table
CREATE TABLE broker_regulations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id VARCHAR(255) REFERENCES brokers(id) ON DELETE CASCADE,
    authority VARCHAR(255) NOT NULL,
    license_number VARCHAR(255),
    status VARCHAR(50) DEFAULT 'Active',
    year_obtained INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Broker platforms table
CREATE TABLE broker_platforms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id VARCHAR(255) REFERENCES brokers(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100),
    features TEXT[],
    api_access BOOLEAN DEFAULT false,
    ea_support BOOLEAN DEFAULT false,
    indicators_count INTEGER DEFAULT 0,
    drawing_tools_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Broker fees table
CREATE TABLE broker_fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id VARCHAR(255) REFERENCES brokers(id) ON DELETE CASCADE,
    type VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2),
    description TEXT,
    conditions TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Broker trading instruments table
CREATE TABLE broker_trading_instruments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id VARCHAR(255) REFERENCES brokers(id) ON DELETE CASCADE,
    instrument_type VARCHAR(100) NOT NULL,
    available BOOLEAN DEFAULT true,
    spreads TEXT,
    commission DECIMAL(10, 2),
    total_count INTEGER DEFAULT 0,
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Broker customer support table
CREATE TABLE broker_customer_support (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    broker_id VARCHAR(255) REFERENCES brokers(id) ON DELETE CASCADE,
    language VARCHAR(100) NOT NULL,
    availability VARCHAR(255),
    methods TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    broker_id VARCHAR(255) REFERENCES brokers(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    content TEXT NOT NULL,
    verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorites table
CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, broker_id)
);

-- Comparisons table
CREATE TABLE comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Broker comparisons junction table
CREATE TABLE broker_comparisons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    comparison_id UUID REFERENCES comparisons(id) ON DELETE CASCADE,
    broker_id UUID REFERENCES brokers(id) ON DELETE CASCADE,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(comparison_id, broker_id)
);

-- Trading journals table
CREATE TABLE trading_journals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    broker_id VARCHAR(255) REFERENCES brokers(id),
    strategy TEXT,
    entry_price DECIMAL(15, 5),
    exit_price DECIMAL(15, 5),
    position_size DECIMAL(15, 2),
    instrument_type VARCHAR(100),
    profit_loss DECIMAL(15, 2),
    status VARCHAR(50) DEFAULT 'Open',
    notes TEXT,
    trade_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education progress table
CREATE TABLE education_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    course_id VARCHAR(255) NOT NULL,
    lesson_id VARCHAR(255),
    progress DECIMAL(5, 2) DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    last_accessed TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discussions table
CREATE TABLE discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    broker_id VARCHAR(255) REFERENCES brokers(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100),
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Discussion replies table
CREATE TABLE discussion_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discussion_id UUID REFERENCES discussions(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_reply_id UUID REFERENCES discussion_replies(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_reviews_broker_id ON reviews(broker_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at);
CREATE INDEX idx_reviews_verified ON reviews(verified);

CREATE INDEX idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX idx_user_favorites_broker_id ON user_favorites(broker_id);

CREATE INDEX idx_comparisons_user_id ON comparisons(user_id);
CREATE INDEX idx_comparisons_created_at ON comparisons(created_at);

CREATE INDEX idx_broker_comparisons_comparison_id ON broker_comparisons(comparison_id);
CREATE INDEX idx_broker_comparisons_broker_id ON broker_comparisons(broker_id);

CREATE INDEX idx_trading_journals_user_id ON trading_journals(user_id);
CREATE INDEX idx_trading_journals_broker_id ON trading_journals(broker_id);
CREATE INDEX idx_trading_journals_status ON trading_journals(status);

CREATE INDEX idx_education_progress_user_id ON education_progress(user_id);
CREATE INDEX idx_education_progress_course_id ON education_progress(course_id);

CREATE INDEX idx_discussions_user_id ON discussions(user_id);
CREATE INDEX idx_discussions_broker_id ON discussions(broker_id);
CREATE INDEX idx_discussions_category ON discussions(category);
CREATE INDEX idx_discussions_created_at ON discussions(created_at);

CREATE INDEX idx_discussion_replies_discussion_id ON discussion_replies(discussion_id);
CREATE INDEX idx_discussion_replies_user_id ON discussion_replies(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE comparisons ENABLE ROW LEVEL SECURITY;
ALTER TABLE trading_journals ENABLE ROW LEVEL SECURITY;
ALTER TABLE education_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_replies ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view their own data
CREATE POLICY "Users can view own data" ON users
    FOR SELECT USING (auth.uid() = id);

-- Users can insert their own data
CREATE POLICY "Users can insert own data" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Users can update their own data
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Reviews are publicly viewable
CREATE POLICY "Reviews are publicly viewable" ON reviews
    FOR SELECT USING (true);

-- Users can insert their own reviews
CREATE POLICY "Users can insert own reviews" ON reviews
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews" ON reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- User favorites are viewable by owner
CREATE POLICY "Users can view own favorites" ON user_favorites
    FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own favorites
CREATE POLICY "Users can manage own favorites" ON user_favorites
    FOR ALL USING (auth.uid() = user_id);

-- Comparisons are viewable by owner
CREATE POLICY "Users can view own comparisons" ON comparisons
    FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own comparisons
CREATE POLICY "Users can manage own comparisons" ON comparisons
    FOR ALL USING (auth.uid() = user_id);

-- Trading journals are viewable by owner
CREATE POLICY "Users can view own trading journals" ON trading_journals
    FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own trading journals
CREATE POLICY "Users can manage own trading journals" ON trading_journals
    FOR ALL USING (auth.uid() = user_id);

-- Education progress is viewable by owner
CREATE POLICY "Users can view own education progress" ON education_progress
    FOR SELECT USING (auth.uid() = user_id);

-- Users can manage their own education progress
CREATE POLICY "Users can manage own education progress" ON education_progress
    FOR ALL USING (auth.uid() = user_id);

-- Discussions are publicly viewable
CREATE POLICY "Discussions are publicly viewable" ON discussions
    FOR SELECT USING (true);

-- Users can insert discussions
CREATE POLICY "Users can insert discussions" ON discussions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own discussions
CREATE POLICY "Users can update own discussions" ON discussions
    FOR UPDATE USING (auth.uid() = user_id);

-- Discussion replies are publicly viewable
CREATE POLICY "Discussion replies are publicly viewable" ON discussion_replies
    FOR SELECT USING (true);

-- Users can insert discussion replies
CREATE POLICY "Users can insert discussion replies" ON discussion_replies
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own discussion replies
CREATE POLICY "Users can update own discussion replies" ON discussion_replies
    FOR UPDATE USING (auth.uid() = user_id);

-- Create triggers for updated_at timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_brokers_updated_at
    BEFORE UPDATE ON brokers
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_comparisons_updated_at
    BEFORE UPDATE ON comparisons
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_trading_journals_updated_at
    BEFORE UPDATE ON trading_journals
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER handle_discussion_replies_updated_at
    BEFORE UPDATE ON discussion_replies
    FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- Create function to update broker average rating
CREATE OR REPLACE FUNCTION update_broker_average_rating()
RETURNS TRIGGER AS $$
DECLARE
    avg_rating DECIMAL(3, 2);
    review_count INTEGER;
BEGIN
    IF TG_OP = 'INSERT' AND NEW.verified = true THEN
        -- Update average rating when a new verified review is inserted
        SELECT
            AVG(rating),
            COUNT(*)
        INTO avg_rating, review_count
        FROM reviews
        WHERE broker_id = NEW.broker_id AND verified = true;

        UPDATE brokers
        SET
            average_rating = COALESCE(avg_rating, 0),
            review_count = COALESCE(review_count, 0)
        WHERE id = NEW.broker_id;

    ELSIF TG_OP = 'UPDATE' THEN
        -- Update average rating when a review verification status changes
        IF OLD.verified != NEW.verified THEN
            SELECT
                AVG(rating),
                COUNT(*)
            INTO avg_rating, review_count
            FROM reviews
            WHERE broker_id = NEW.broker_id AND verified = true;

            UPDATE brokers
            SET
                average_rating = COALESCE(avg_rating, 0),
                review_count = COALESCE(review_count, 0)
            WHERE id = NEW.broker_id;
        END IF;

    ELSIF TG_OP = 'DELETE' AND OLD.verified = true THEN
        -- Update average rating when a verified review is deleted
        SELECT
            AVG(rating),
            COUNT(*)
        INTO avg_rating, review_count
        FROM reviews
        WHERE broker_id = OLD.broker_id AND verified = true;

        UPDATE brokers
        SET
            average_rating = COALESCE(avg_rating, 0),
            review_count = COALESCE(review_count, 0)
        WHERE id = OLD.broker_id;
    END IF;

    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_broker_rating_update
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_broker_average_rating();