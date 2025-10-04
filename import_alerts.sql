-- ============================================
-- Alerts Data Import Script
-- ============================================
-- This script imports alert data from TypeScript mocks
-- into the Supabase database alerts table

BEGIN TRANSACTION;

-- Clear existing alerts data (optional - comment out if you want to append)
TRUNCATE TABLE alerts RESTART IDENTITY CASCADE;

-- Insert mock alerts data
INSERT INTO alerts (
    id,
    broker_id,
    title,
    description,
    alert_date,
    severity,
    is_read,
    created_at,
    updated_at,
    alert_type,
    status,
    metadata
) VALUES
(
    'alert1',
    'pepperstone',
    'FCA Issues Minor Warning',
    'Pepperstone received a minor warning from the FCA regarding marketing materials. The issue has been resolved.',
    '2025-09-10T14:00:00Z',
    'Medium',
    false,
    NOW(),
    NOW(),
    'regulatory',
    'resolved',
    '{"regulator": "FCA", "issue_type": "marketing_materials", "resolution_date": "2025-09-12"}'
),
(
    'alert2',
    'ic-markets',
    'CySEC License Updated',
    'IC Markets has successfully updated its CySEC license, enhancing client fund protection measures.',
    '2025-09-08T09:30:00Z',
    'Low',
    false,
    NOW(),
    NOW(),
    'regulatory',
    'active',
    '{"regulator": "CySEC", "license_type": "updated", "enhancement": "client_fund_protection"}'
),
(
    'alert3',
    'xtb',
    'New Educational Webinars',
    'XTB announces a new series of free educational webinars on risk management for all clients.',
    '2025-09-05T11:00:00Z',
    'Low',
    true,
    NOW(),
    NOW(),
    'feature',
    'active',
    '{"feature_type": "webinars", "topic": "risk_management", "access": "free_for_all_clients"}'
),
(
    'alert4',
    'forex-com',
    'NFA Conducts Routine Audit',
    'Forex.com is undergoing a routine audit by the NFA. No issues have been reported.',
    '2025-08-28T16:20:00Z',
    'Low',
    false,
    NOW(),
    NOW(),
    'regulatory',
    'in_progress',
    '{"regulator": "NFA", "audit_type": "routine", "status": "no_issues_reported"}'
),
(
    'alert5',
    'pepperstone',
    'New Server Maintenance Scheduled',
    'Scheduled maintenance for MT5 servers on Sunday. Expect brief downtime.',
    '2025-09-12T10:00:00Z',
    'Low',
    false,
    NOW(),
    NOW(),
    'maintenance',
    'scheduled',
    '{"server_type": "MT5", "scheduled_date": "2025-09-15", "expected_downtime": "brief"}'
),
(
    'alert6',
    'etoro',
    'Regulatory Fine Issued by ASIC',
    'eToro has been fined by ASIC for misleading statements regarding CFD product risks. The company has paid the fine and updated its disclosures.',
    '2025-09-01T08:00:00Z',
    'High',
    false,
    NOW(),
    NOW(),
    'regulatory',
    'resolved',
    '{"regulator": "ASIC", "fine_amount": "undisclosed", "violation": "misleading_statements", "status": "paid"}'
),
(
    'alert7',
    'ironfx',
    'Critical Risk Detected: Regulatory Warning',
    'IronFX was fined by CySEC for compliance failures. We have raised their risk score to Critical. We advise extreme caution.',
    '2025-08-15T11:00:00Z',
    'High',
    false,
    NOW(),
    NOW(),
    'regulatory',
    'critical',
    '{"regulator": "CySEC", "violation": "compliance_failures", "risk_score": "critical", "recommendation": "extreme_caution"}'
),
(
    'alert8',
    'bitget',
    'Medium Risk Detected: URL Flagged',
    'The domain for Bitget has been flagged by security vendors for suspicious activities. Their risk score is now Medium.',
    '2025-08-20T18:00:00Z',
    'Medium',
    false,
    NOW(),
    NOW(),
    'security',
    'monitoring',
    '{"issue_type": "url_flagged", "detected_by": "security_vendors", "activity": "suspicious", "risk_level": "medium"}'
);

-- Validate broker references
DO $$
DECLARE
    broker_count INTEGER;
    invalid_brokers TEXT[];
BEGIN
    -- Check if all referenced brokers exist
    SELECT COUNT(*) INTO broker_count
    FROM (
        SELECT DISTINCT broker_id FROM alerts
    ) AS alert_brokers
    JOIN brokers ON alert_brokers.broker_id = brokers.id;

    -- Find invalid broker references
    SELECT array_agg(DISTINCT broker_id) INTO invalid_brokers
    FROM alerts
    WHERE broker_id NOT IN (SELECT id FROM brokers);

    IF invalid_brokers IS NOT NULL AND array_length(invalid_brokers, 1) > 0 THEN
        RAISE NOTICE 'Warning: Invalid broker references found: %', invalid_brokers;
    END IF;

    RAISE NOTICE 'Alerts import completed. % valid broker references found.', broker_count;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_alerts_broker_severity ON alerts(broker_id, severity);
CREATE INDEX IF NOT EXISTS idx_alerts_date ON alerts(alert_date DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_type_status ON alerts(alert_type, status);

COMMIT;

-- Verification queries
-- SELECT COUNT(*) as total_alerts FROM alerts;
-- SELECT severity, COUNT(*) as count FROM alerts GROUP BY severity;
-- SELECT alert_type, COUNT(*) as count FROM alerts GROUP BY alert_type;
-- SELECT broker_id, COUNT(*) as alert_count FROM alerts GROUP BY broker_id ORDER BY alert_count DESC;