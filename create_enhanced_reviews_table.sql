-- Create enhanced reviews table with comprehensive features
CREATE TABLE reviews (
    -- Primary identification
    id BIGSERIAL PRIMARY KEY,

    -- Basic review information
    broker_id BIGINT NOT NULL,
    user_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,

    -- Rating information
    rating DECIMAL(3,2) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    rating_breakdown JSONB DEFAULT '{}'::jsonb,

    -- Verification information
    is_verified BOOLEAN DEFAULT FALSE,
    verified_by UUID,
    verification_method VARCHAR(50),
    verification_date TIMESTAMP WITH TIME ZONE,

    -- Trading experience
    account_type VARCHAR(100),
    trading_duration VARCHAR(100),
    instruments_traded TEXT[],

    -- Withdrawal experience
    withdrawal_days INTEGER,
    withdrawal_method VARCHAR(100),
    withdrawal_fee DECIMAL(10,2),

    -- Review metadata
    helpful_count INTEGER DEFAULT 0,
    report_count INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,

    -- Moderation
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    moderated_by UUID,
    moderation_notes TEXT,

    -- Broker reply information
    broker_reply TEXT,
    broker_reply_date TIMESTAMP WITH TIME ZONE,
    broker_reply_by UUID,

    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraints with cascade delete
ALTER TABLE reviews
    ADD CONSTRAINT reviews_broker_id_fkey
    FOREIGN KEY (broker_id)
    REFERENCES brokers(id)
    ON DELETE CASCADE;

ALTER TABLE reviews
    ADD CONSTRAINT reviews_user_id_fkey
    FOREIGN KEY (user_id)
    REFERENCES auth.users(id)
    ON DELETE CASCADE;

-- Add unique constraint to prevent duplicate reviews by user for same broker
ALTER TABLE reviews
    ADD CONSTRAINT reviews_unique_user_broker
    UNIQUE (user_id, broker_id);

-- Create indexes for performance optimization
CREATE INDEX idx_reviews_broker_id ON reviews(broker_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_status ON reviews(status);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX idx_reviews_is_verified ON reviews(is_verified);
CREATE INDEX idx_reviews_is_featured ON reviews(is_featured);

-- Add check constraints for data validation
ALTER TABLE reviews
    ADD CONSTRAINT reviews_withdrawal_days_non_negative
    CHECK (withdrawal_days IS NULL OR withdrawal_days >= 0);

ALTER TABLE reviews
    ADD CONSTRAINT reviews_withdrawal_fee_non_negative
    CHECK (withdrawal_fee IS NULL OR withdrawal_fee >= 0);

ALTER TABLE reviews
    ADD CONSTRAINT_reviews_helpful_count_non_negative
    CHECK (helpful_count >= 0);

ALTER TABLE reviews
    ADD CONSTRAINT reviews_report_count_non_negative
    CHECK (report_count >= 0);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for review management

-- Policy: Users can view all approved reviews
CREATE POLICY "Users can view approved reviews" ON reviews
    FOR SELECT
    USING (status = 'approved');

-- Policy: Users can view their own reviews regardless of status
CREATE POLICY "Users can view their own reviews" ON reviews
    FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can create reviews
CREATE POLICY "Users can create reviews" ON reviews
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own reviews (if not moderated)
CREATE POLICY "Users can update their own reviews" ON reviews
    FOR UPDATE
    USING (auth.uid() = user_id AND status = 'pending')
    WITH CHECK (auth.uid() = user_id AND status = 'pending');

-- Policy: Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews" ON reviews
    FOR DELETE
    USING (auth.uid() = user_id);

-- Policy: Admins can manage all reviews
CREATE POLICY "Admins can manage all reviews" ON reviews
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Policy: Moderators can moderate reviews
CREATE POLICY "Moderators can moderate reviews" ON reviews
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role IN ('admin', 'moderator')
        )
    );

-- Add comments for documentation
COMMENT ON TABLE reviews IS 'Enhanced reviews table with comprehensive features for broker reviews including verification, trading experience, and moderation';

COMMENT ON COLUMN reviews.id IS 'Unique identifier for the review';
COMMENT ON COLUMN reviews.broker_id IS 'Foreign key to the broker being reviewed';
COMMENT ON COLUMN reviews.user_id IS 'Foreign key to the user who wrote the review';
COMMENT ON COLUMN reviews.title IS 'Title of the review';
COMMENT ON COLUMN reviews.content IS 'Main content of the review';
COMMENT ON COLUMN reviews.rating IS 'Overall rating from 1.0 to 5.0';
COMMENT ON COLUMN reviews.rating_breakdown IS 'JSON object containing detailed ratings for different aspects (e.g., platform, support, fees)';
COMMENT ON COLUMN reviews.is_verified IS 'Whether the review has been verified as legitimate';
COMMENT ON COLUMN reviews.verified_by IS 'User ID of the verifier';
COMMENT ON COLUMN reviews.verification_method IS 'Method used for verification (e.g., email, document, trading account)';
COMMENT ON COLUMN reviews.verification_date IS 'Timestamp when review was verified';
COMMENT ON COLUMN reviews.account_type IS 'Type of trading account used (e.g., Standard, Premium, ECN)';
COMMENT ON COLUMN reviews.trading_duration IS 'How long the user traded with the broker';
COMMENT ON COLUMN reviews.instruments_traded IS 'Array of financial instruments traded';
COMMENT ON COLUMN reviews.withdrawal_days IS 'Number of days taken for withdrawal processing';
COMMENT ON COLUMN reviews.withdrawal_method IS 'Method used for withdrawal';
COMMENT ON COLUMN reviews.withdrawal_fee IS 'Fee charged for withdrawal';
COMMENT ON COLUMN reviews.helpful_count IS 'Number of users who found this review helpful';
COMMENT ON COLUMN reviews.report_count IS 'Number of times this review was reported';
COMMENT ON COLUMN reviews.is_featured IS 'Whether this review is featured/promoted';
COMMENT ON COLUMN reviews.status IS 'Review moderation status: pending, approved, or rejected';
COMMENT ON COLUMN reviews.moderated_by IS 'User ID of the moderator';
COMMENT ON COLUMN reviews.moderation_notes IS 'Notes from moderation process';
COMMENT ON COLUMN reviews.broker_reply IS 'Reply from the broker to this review';
COMMENT ON COLUMN reviews.broker_reply_date IS 'Timestamp when broker replied';
COMMENT ON COLUMN reviews.broker_reply_by IS 'User ID of the broker representative who replied';