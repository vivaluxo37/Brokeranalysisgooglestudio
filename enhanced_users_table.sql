-- Enhanced Users Table for Supabase
-- This table extends the auth.users table with comprehensive user features

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the enhanced users table
CREATE TABLE public.users (
    -- Primary Key and Reference to auth.users
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,

    -- Basic Profile Information
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    avatar_url TEXT,
    bio TEXT,
    phone TEXT,
    location TEXT,
    website TEXT,

    -- Preferences
    theme TEXT DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'system')),
    language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es', 'fr', 'de', 'zh', 'ja')),
    notification_settings JSONB DEFAULT '{
        "email_notifications": true,
        "push_notifications": true,
        "sms_notifications": false,
        "marketing_emails": true,
        "broker_updates": true,
        "educational_content": true,
        "trading_alerts": true
    }'::jsonb,

    -- Trading Preferences
    risk_tolerance TEXT DEFAULT 'moderate' CHECK (risk_tolerance IN ('conservative', 'moderate', 'aggressive', 'very_aggressive')),
    trading_experience TEXT DEFAULT 'beginner' CHECK (trading_experience IN ('beginner', 'intermediate', 'advanced', 'expert')),
    preferred_instruments TEXT[] DEFAULT ARRAY['stocks', 'etfs'],
    investment_goals TEXT[] DEFAULT ARRAY['growth', 'income'],
    trading_strategy TEXT,

    -- Account Status
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    account_suspended BOOLEAN DEFAULT false,
    suspension_reason TEXT,

    -- Broker-related Metrics
    favorite_brokers_count INTEGER DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    trading_journal_entries_count INTEGER DEFAULT 0,
    portfolio_value DECIMAL(15, 2) DEFAULT 0.00,
    total_trades INTEGER DEFAULT 0,

    -- Education Progress (JSONB for flexible structure)
    quiz_progress JSONB DEFAULT '{}'::jsonb,
    webinar_progress JSONB DEFAULT '{}'::jsonb,
    course_progress JSONB DEFAULT '{}'::jsonb,
    achievements JSONB DEFAULT '[]'::jsonb,

    -- Onboarding
    onboarding_completed BOOLEAN DEFAULT false,
    onboarding_step INTEGER DEFAULT 0,
    onboarding_completed_at TIMESTAMP WITH TIME ZONE,

    -- Subscription Information
    subscription_plan TEXT DEFAULT 'free' CHECK (subscription_plan IN ('free', 'basic', 'premium', 'enterprise')),
    subscription_ends_at TIMESTAMP WITH TIME ZONE,
    subscription_auto_renew BOOLEAN DEFAULT true,
    payment_method_id TEXT,

    -- Social and Engagement
    social_profiles JSONB DEFAULT '{}'::jsonb,
    followers_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,

    -- Privacy Settings
    profile_visibility TEXT DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'friends')),
    show_trading_activity BOOLEAN DEFAULT true,
    allow_messages BOOLEAN DEFAULT true,

    -- Analytics and Tracking
    user_agent TEXT,
    ip_address TEXT,
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES public.users(id),

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Constraints
    CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$'),
    CONSTRAINT non_negative_counts CHECK (
        favorite_brokers_count >= 0 AND
        reviews_count >= 0 AND
        trading_journal_entries_count >= 0 AND
        login_count >= 0 AND
        followers_count >= 0 AND
        following_count >= 0 AND
        total_trades >= 0
    ),
    CONSTRAINT portfolio_value_non_negative CHECK (portfolio_value >= 0)
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_is_active ON public.users(is_active);
CREATE INDEX idx_users_is_verified ON public.users(is_verified);
CREATE INDEX idx_users_subscription_plan ON public.users(subscription_plan);
CREATE INDEX idx_users_created_at ON public.users(created_at);
CREATE INDEX idx_users_last_login_at ON public.users(last_login_at);
CREATE INDEX idx_users_referral_code ON public.users(referral_code);
CREATE INDEX idx_users_referred_by ON public.users(referred_by);

-- Create function to automatically create user profile when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER handle_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Row Level Security (RLS) Policies

-- Enable RLS on the users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can insert their own profile (handled by trigger, but for safety)
CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Allow public access to basic profile information (optional)
CREATE POLICY "Public can view basic profile info" ON public.users
    FOR SELECT USING (
        is_active = true AND
        profile_visibility = 'public' AND
        -- Only allow public fields to be accessed
        id IN (
            SELECT id FROM public.users
            WHERE profile_visibility = 'public' AND is_active = true
        )
    );

-- Policy: Admin users can access all profiles (if you have an admin role)
CREATE POLICY "Admin users can access all profiles" ON public.users
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM auth.users
            JOIN auth.user_roles ON auth.users.id = auth.user_roles.user_id
            JOIN auth.roles ON auth.user_roles.role_id = auth.roles.id
            WHERE auth.users.id = auth.uid() AND auth.roles.name = 'admin'
        )
    );

-- Create view for public user profiles (hides sensitive information)
CREATE VIEW public.user_profiles AS
SELECT
    u.id,
    u.name,
    u.avatar_url,
    u.bio,
    u.location,
    u.website,
    u.followers_count,
    u.following_count,
    u.reviews_count,
    u.trading_experience,
    u.risk_tolerance,
    u.preferred_instruments,
    u.profile_visibility,
    u.created_at
FROM public.users u
WHERE u.is_active = true AND u.profile_visibility = 'public';

-- Grant permissions
GRANT SELECT ON public.user_profiles TO authenticated;
GRANT SELECT ON public.user_profiles TO anon;

-- Add comments for documentation
COMMENT ON TABLE public.users IS 'Enhanced user profiles extending auth.users with trading preferences, education progress, and broker interactions';
COMMENT ON COLUMN public.users.id IS 'Primary key referencing auth.users.id';
COMMENT ON COLUMN public.users.email IS 'User email address (unique)';
COMMENT ON COLUMN public.users.notification_settings IS 'JSON object containing user notification preferences';
COMMENT ON COLUMN public.users.quiz_progress IS 'JSON object tracking quiz completion progress';
COMMENT ON COLUMN public.users.webinar_progress IS 'JSON object tracking webinar viewing progress';
COMMENT ON COLUMN public.users.subscription_plan IS 'Current subscription plan tier';
COMMENT ON COLUMN public.users.referral_code IS 'Unique referral code for user referrals';