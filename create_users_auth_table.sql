-- Enhanced Users Table for Authentication
-- This script creates the users table with authentication-related fields
-- Compatible with Clerk authentication system

-- Drop existing table if it exists (use with caution in production)
-- DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY, -- Clerk user ID
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    
    -- Authentication metadata
    clerk_user_id VARCHAR(255) UNIQUE, -- Redundant but useful for migrations
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    last_sign_in TIMESTAMP WITH TIME ZONE,
    
    -- Trading profile
    trading_level VARCHAR(20) CHECK (trading_level IN ('beginner', 'intermediate', 'advanced')),
    trading_experience TEXT,
    preferred_instruments JSONB DEFAULT '[]'::jsonb,
    risk_tolerance VARCHAR(20) CHECK (risk_tolerance IN ('low', 'medium', 'high')),
    base_currency VARCHAR(3) DEFAULT 'USD',
    
    -- User preferences
    language VARCHAR(10) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark')),
    email_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false,
    
    -- Account status
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    is_premium BOOLEAN DEFAULT false,
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'basic', 'premium', 'enterprise')),
    
    -- Additional metadata
    signup_source VARCHAR(100), -- 'web', 'api', 'oauth_google', etc.
    referral_code VARCHAR(50),
    referred_by_user_id VARCHAR(255) REFERENCES users(id),
    
    -- JSON fields for extensibility
    metadata JSONB DEFAULT '{}'::jsonb,
    preferences JSONB DEFAULT '{}'::jsonb
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_last_sign_in ON users(last_sign_in);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_trading_level ON users(trading_level);
CREATE INDEX IF NOT EXISTS idx_users_subscription_tier ON users(subscription_tier);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own data
CREATE POLICY "Users can view own profile"
    ON users FOR SELECT
    USING (auth.uid()::text = id);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own profile"
    ON users FOR UPDATE
    USING (auth.uid()::text = id);

-- Policy: Service role can do everything (for API operations)
CREATE POLICY "Service role full access"
    ON users FOR ALL
    USING (auth.role() = 'service_role');

-- Policy: Allow insert for new user registration
CREATE POLICY "Allow user registration"
    ON users FOR INSERT
    WITH CHECK (auth.uid()::text = id);

-- Create user_sessions table for tracking user activity
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    
    -- Session metadata
    device_type VARCHAR(50), -- 'desktop', 'mobile', 'tablet'
    browser VARCHAR(100),
    os VARCHAR(100),
    country VARCHAR(2),
    city VARCHAR(100)
);

-- Indexes for user_sessions
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_created_at ON user_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_user_sessions_is_active ON user_sessions(is_active);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires_at ON user_sessions(expires_at);

-- RLS for user_sessions
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
    ON user_sessions FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Service role full access sessions"
    ON user_sessions FOR ALL
    USING (auth.role() = 'service_role');

-- Create user_audit_log table for tracking user actions
CREATE TABLE IF NOT EXISTS user_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(255) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL, -- 'login', 'logout', 'profile_update', 'password_change', etc.
    details JSONB DEFAULT '{}'::jsonb,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Indexes for audit log
CREATE INDEX IF NOT EXISTS idx_user_audit_log_user_id ON user_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_user_audit_log_action ON user_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_user_audit_log_created_at ON user_audit_log(created_at);

-- RLS for audit log
ALTER TABLE user_audit_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audit log"
    ON user_audit_log FOR SELECT
    USING (auth.uid()::text = user_id);

CREATE POLICY "Service role full access audit"
    ON user_audit_log FOR ALL
    USING (auth.role() = 'service_role');

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION create_audit_log_entry(
    p_user_id VARCHAR(255),
    p_action VARCHAR(100),
    p_details JSONB DEFAULT '{}'::jsonb,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO user_audit_log (user_id, action, details, ip_address, user_agent)
    VALUES (p_user_id, p_action, p_details, p_ip_address, p_user_agent)
    RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

GRANT SELECT, INSERT, UPDATE ON users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON user_sessions TO authenticated;
GRANT SELECT, INSERT ON user_audit_log TO authenticated;

GRANT ALL ON users TO service_role;
GRANT ALL ON user_sessions TO service_role;
GRANT ALL ON user_audit_log TO service_role;

-- Create sample data for testing (optional)
-- INSERT INTO users (id, email, name, trading_level, subscription_tier) 
-- VALUES 
--     ('user_test_123', 'test@example.com', 'Test User', 'intermediate', 'premium'),
--     ('user_test_456', 'demo@example.com', 'Demo User', 'beginner', 'free')
-- ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE users IS 'Main users table integrated with Clerk authentication';
COMMENT ON TABLE user_sessions IS 'Tracks user sessions and login activity';
COMMENT ON TABLE user_audit_log IS 'Audit log for user actions and security events';