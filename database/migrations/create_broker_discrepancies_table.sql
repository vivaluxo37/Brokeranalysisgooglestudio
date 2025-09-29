-- Create broker_discrepancies table for storing cross-verification results
-- This table tracks discrepancies found between database data and web sources

CREATE TABLE IF NOT EXISTS broker_discrepancies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  broker_id UUID NOT NULL,
  field_name TEXT NOT NULL,
  db_value TEXT, -- JSON stringified database value
  web_value TEXT, -- JSON stringified web aggregated value
  confidence_score DECIMAL(3,2) NOT NULL DEFAULT 0.00,
  sources_checked TEXT[] DEFAULT '{}', -- Array of domain names that were checked
  tolerance_exceeded BOOLEAN DEFAULT FALSE,
  severity TEXT CHECK (severity IN ('critical', 'high', 'medium', 'low')) DEFAULT 'medium',
  recommended_action TEXT CHECK (recommended_action IN ('update', 'review', 'ignore')) DEFAULT 'review',
  status TEXT CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')) DEFAULT 'pending',
  reviewed_by UUID, -- User ID who reviewed this discrepancy
  reviewed_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  notes TEXT, -- Admin notes about this discrepancy
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Foreign key constraint
  CONSTRAINT fk_broker_discrepancies_broker_id FOREIGN KEY (broker_id) REFERENCES brokers(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_broker_discrepancies_broker_id ON broker_discrepancies(broker_id);
CREATE INDEX IF NOT EXISTS idx_broker_discrepancies_field_name ON broker_discrepancies(field_name);
CREATE INDEX IF NOT EXISTS idx_broker_discrepancies_severity ON broker_discrepancies(severity);
CREATE INDEX IF NOT EXISTS idx_broker_discrepancies_status ON broker_discrepancies(status);
CREATE INDEX IF NOT EXISTS idx_broker_discrepancies_created_at ON broker_discrepancies(created_at);
CREATE INDEX IF NOT EXISTS idx_broker_discrepancies_confidence_score ON broker_discrepancies(confidence_score);

-- Create a compound index for common queries
CREATE INDEX IF NOT EXISTS idx_broker_discrepancies_broker_status ON broker_discrepancies(broker_id, status);
CREATE INDEX IF NOT EXISTS idx_broker_discrepancies_severity_status ON broker_discrepancies(severity, status);

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE broker_discrepancies ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to see all discrepancies
-- CREATE POLICY "Admin can view all discrepancies" ON broker_discrepancies
--   FOR SELECT USING (auth.jwt() ->> 'role' = 'admin');

-- Policy to allow admins to update discrepancies
-- CREATE POLICY "Admin can update discrepancies" ON broker_discrepancies
--   FOR UPDATE USING (auth.jwt() ->> 'role' = 'admin');

-- Policy to allow system to insert discrepancies (for automated checks)
-- CREATE POLICY "System can insert discrepancies" ON broker_discrepancies
--   FOR INSERT WITH CHECK (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_broker_discrepancies_updated_at 
  BEFORE UPDATE ON broker_discrepancies 
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE broker_discrepancies IS 'Stores discrepancies found between database data and web sources during cross-verification';
COMMENT ON COLUMN broker_discrepancies.broker_id IS 'Foreign key reference to the broker being verified';
COMMENT ON COLUMN broker_discrepancies.field_name IS 'Name of the field where discrepancy was found';
COMMENT ON COLUMN broker_discrepancies.db_value IS 'JSON stringified value from database';
COMMENT ON COLUMN broker_discrepancies.web_value IS 'JSON stringified aggregated value from web sources';
COMMENT ON COLUMN broker_discrepancies.confidence_score IS 'Confidence score of the web data (0.00-1.00)';
COMMENT ON COLUMN broker_discrepancies.sources_checked IS 'Array of domain names that were consulted';
COMMENT ON COLUMN broker_discrepancies.tolerance_exceeded IS 'Whether the difference exceeds acceptable tolerance';
COMMENT ON COLUMN broker_discrepancies.severity IS 'Severity level of the discrepancy';
COMMENT ON COLUMN broker_discrepancies.recommended_action IS 'Recommended action to take for this discrepancy';
COMMENT ON COLUMN broker_discrepancies.status IS 'Current status of this discrepancy';
COMMENT ON COLUMN broker_discrepancies.reviewed_by IS 'User who reviewed this discrepancy';
COMMENT ON COLUMN broker_discrepancies.notes IS 'Admin notes about the discrepancy and resolution';