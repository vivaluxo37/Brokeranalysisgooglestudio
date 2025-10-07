-- Broker Data Import Validation Script
-- This script validates the imported broker data and checks for data integrity

-- Check total record counts
SELECT 'Data Import Summary' as section;

SELECT
    'brokers' as table_name,
    COUNT(*) as total_records,
    'Main broker information' as description
FROM brokers
UNION ALL
SELECT
    'broker_regulations' as table_name,
    COUNT(*) as total_records,
    'Regulatory information' as description
FROM broker_regulations
UNION ALL
SELECT
    'broker_fees' as table_name,
    COUNT(*) as total_records,
    'Fee structures' as description
FROM broker_fees
UNION ALL
SELECT
    'broker_trading_conditions' as table_name,
    COUNT(*) as total_records,
    'Trading conditions' as description
FROM broker_trading_conditions
UNION ALL
SELECT
    'broker_platforms' as table_name,
    COUNT(*) as total_records,
    'Trading platforms' as description
FROM broker_platforms
UNION ALL
SELECT
    'broker_account_types' as table_name,
    COUNT(*) as total_records,
    'Account types' as description
FROM broker_account_types;

-- Check broker completeness (how many related records each broker has)
SELECT '' as section;
SELECT 'Broker Data Completeness Check' as section;

SELECT
    b.name,
    b.score as broker_score,
    COUNT(DISTINCT br.id) as regulations,
    COUNT(DISTINCT bf.id) as fees,
    COUNT(DISTINCT btc.id) as trading_conditions,
    COUNT(DISTINCT bp.id) as platforms,
    COUNT(DISTINCT bat.id) as account_types,
    CASE
        WHEN COUNT(DISTINCT br.id) = 0 THEN 'Missing Regulations'
        WHEN COUNT(DISTINCT bf.id) = 0 THEN 'Missing Fees'
        WHEN COUNT(DISTINCT btc.id) = 0 THEN 'Missing Trading Conditions'
        WHEN COUNT(DISTINCT bp.id) = 0 THEN 'Missing Platforms'
        WHEN COUNT(DISTINCT bat.id) = 0 THEN 'Missing Account Types'
        ELSE 'Complete'
    END as status
FROM brokers b
LEFT JOIN broker_regulations br ON b.id = br.broker_id
LEFT JOIN broker_fees bf ON b.id = bf.broker_id
LEFT JOIN broker_trading_conditions btc ON b.id = btc.broker_id
LEFT JOIN broker_platforms bp ON b.id = bp.broker_id
LEFT JOIN broker_account_types bat ON b.id = bat.broker_id
GROUP BY b.id, b.name, b.score
ORDER BY b.score DESC;

-- Check for data quality issues
SELECT '' as section;
SELECT 'Data Quality Validation' as section;

-- Check for brokers without regulations
SELECT
    'Brokers without regulations' as issue_type,
    COUNT(*) as count,
    string_agg(b.name, ', ') as brokers_affected
FROM brokers b
LEFT JOIN broker_regulations br ON b.id = br.broker_id
WHERE br.id IS NULL
HAVING COUNT(*) > 0

UNION ALL

-- Check for brokers without fees
SELECT
    'Brokers without fee information' as issue_type,
    COUNT(*) as count,
    string_agg(b.name, ', ') as brokers_affected
FROM brokers b
LEFT JOIN broker_fees bf ON b.id = bf.broker_id
WHERE bf.id IS NULL
HAVING COUNT(*) > 0

UNION ALL

-- Check for brokers without trading conditions
SELECT
    'Brokers without trading conditions' as issue_type,
    COUNT(*) as count,
    string_agg(b.name, ', ') as brokers_affected
FROM brokers b
LEFT JOIN broker_trading_conditions btc ON b.id = btc.broker_id
WHERE btc.id IS NULL
HAVING COUNT(*) > 0;

-- Score distribution analysis
SELECT '' as section;
SELECT 'Score Distribution Analysis' as section;

SELECT
    CASE
        WHEN b.score >= 9.0 THEN 'Excellent (9.0+)'
        WHEN b.score >= 8.0 THEN 'Very Good (8.0-8.9)'
        WHEN b.score >= 7.0 THEN 'Good (7.0-7.9)'
        WHEN b.score >= 6.0 THEN 'Average (6.0-6.9)'
        ELSE 'Below Average (<6.0)'
    END as score_range,
    COUNT(*) as broker_count,
    ROUND(AVG(b.founding_year), 0) as avg_founding_year,
    STRING_AGG(b.name, ', ') as brokers
FROM brokers b
GROUP BY
    CASE
        WHEN b.score >= 9.0 THEN 'Excellent (9.0+)'
        WHEN b.score >= 8.0 THEN 'Very Good (8.0-8.9)'
        WHEN b.score >= 7.0 THEN 'Good (7.0-7.9)'
        WHEN b.score >= 6.0 THEN 'Average (6.0-6.9)'
        ELSE 'Below Average (<6.0)'
    END
ORDER BY MIN(b.score) DESC;

-- Platform popularity analysis
SELECT '' as section;
SELECT 'Platform Analysis' as section;

SELECT
    bp.platform_name,
    COUNT(*) as broker_count,
    STRING_AGG(b.name, ', ') as brokers
FROM broker_platforms bp
JOIN brokers b ON bp.broker_id = b.id
GROUP BY bp.platform_name
ORDER BY COUNT(*) DESC;

-- Fee structure analysis
SELECT '' as section;
SELECT 'Fee Structure Analysis' as section;

SELECT
    bf.fee_type,
    bf.instrument_type,
    AVG(bf.fee_amount) as avg_fee_amount,
    MIN(bf.fee_amount) as min_fee_amount,
    MAX(bf.fee_amount) as max_fee_amount,
    COUNT(*) as record_count
FROM broker_fees bf
GROUP BY bf.fee_type, bf.instrument_type
ORDER BY bf.fee_type, bf.instrument_type;

-- Regulatory compliance analysis
SELECT '' as section;
SELECT 'Regulatory Compliance Analysis' as section;

SELECT
    br.regulator_name,
    COUNT(*) as broker_count,
    AVG(br.compliance_score) as avg_compliance_score,
    STRING_AGG(b.name, ', ') as regulated_brokers
FROM broker_regulations br
JOIN brokers b ON br.broker_id = b.id
GROUP BY br.regulator_name
ORDER BY COUNT(*) DESC;

-- Account type analysis
SELECT '' as section;
SELECT 'Account Type Analysis' as section;

SELECT
    bat.account_type,
    COUNT(*) as broker_count,
    AVG(bat.min_deposit) as avg_min_deposit,
    MIN(bat.min_deposit) as min_deposit,
    MAX(bat.min_deposit) as max_deposit,
    STRING_AGG(b.name, ', ') as brokers
FROM broker_account_types bat
JOIN brokers b ON bat.broker_id = b.id
GROUP BY bat.account_type
ORDER BY COUNT(*) DESC;

-- Trading conditions analysis
SELECT '' as section;
SELECT 'Trading Conditions Analysis' as section;

SELECT
    'Leverage Distribution' as metric,
    btc.max_leverage as value,
    COUNT(*) as broker_count,
    STRING_AGG(b.name, ', ') as brokers
FROM broker_trading_conditions btc
JOIN brokers b ON btc.broker_id = b.id
GROUP BY btc.max_leverage
ORDER BY COUNT(*) DESC;

SELECT '' as section;
SELECT 'Execution Speed Analysis' as metric;

SELECT
    CASE
        WHEN btc.execution_speed_ms <= 30 THEN 'Very Fast (≤30ms)'
        WHEN btc.execution_speed_ms <= 50 THEN 'Fast (31-50ms)'
        WHEN btc.execution_speed_ms <= 100 THEN 'Average (51-100ms)'
        ELSE 'Slow (>100ms)'
    END as speed_category,
    COUNT(*) as broker_count,
    ROUND(AVG(btc.execution_speed_ms), 1) as avg_speed_ms,
    STRING_AGG(b.name, ', ') as brokers
FROM broker_trading_conditions btc
JOIN brokers b ON btc.broker_id = b.id
GROUP BY
    CASE
        WHEN btc.execution_speed_ms <= 30 THEN 'Very Fast (≤30ms)'
        WHEN btc.execution_speed_ms <= 50 THEN 'Fast (31-50ms)'
        WHEN btc.execution_speed_ms <= 100 THEN 'Average (51-100ms)'
        ELSE 'Slow (>100ms)'
    END
ORDER BY MIN(btc.execution_speed_ms);

-- JSONB field validation
SELECT '' as section;
SELECT 'JSONB Field Validation' as section;

-- Check for empty JSONB fields
SELECT
    b.name,
    CASE
        WHEN b.core_info::text = '{}' THEN 'Missing core_info'
        WHEN b.fees::text = '{}' THEN 'Missing fees'
        WHEN b.tradable_instruments::text = '{}' THEN 'Missing tradable_instruments'
        WHEN b.trading_conditions_extended::text = '{}' THEN 'Missing trading_conditions_extended'
        WHEN b.security::text = '{}' THEN 'Missing security'
        WHEN b.platform_features::text = '{}' THEN 'Missing platform_features'
        ELSE 'All JSONB fields populated'
    END as validation_status
FROM brokers b
WHERE b.core_info::text = '{}' OR b.fees::text = '{}' OR b.tradable_instruments::text = '{}'
   OR b.trading_conditions_extended::text = '{}' OR b.security::text = '{}' OR b.platform_features::text = '{}'
ORDER BY b.name;

-- Final validation summary
SELECT '' as section;
SELECT 'Import Validation Summary' as section;

SELECT
    'Total Brokers Imported' as metric,
    COUNT(*) as value,
    CASE
        WHEN COUNT(*) >= 40 THEN 'Good coverage'
        WHEN COUNT(*) >= 20 THEN 'Moderate coverage'
        ELSE 'Low coverage - more brokers needed'
    END as status
FROM brokers

UNION ALL

SELECT
    'Brokers with Complete Data' as metric,
    COUNT(*) as value,
    'Good' as status
FROM brokers b
WHERE EXISTS (SELECT 1 FROM broker_regulations br WHERE br.broker_id = b.id)
  AND EXISTS (SELECT 1 FROM broker_fees bf WHERE bf.broker_id = b.id)
  AND EXISTS (SELECT 1 FROM broker_trading_conditions btc WHERE btc.broker_id = b.id)
  AND EXISTS (SELECT 1 FROM broker_platforms bp WHERE bp.broker_id = b.id)
  AND EXISTS (SELECT 1 FROM broker_account_types bat WHERE bat.broker_id = b.id)

UNION ALL

SELECT
    'Average Broker Score' as metric,
    ROUND(AVG(score), 2) as value,
    'Good' as status
FROM brokers
WHERE score >= 8.0

UNION ALL

SELECT
    'Regulatory Coverage' as metric,
    COUNT(DISTINCT br.regulator_name) as value,
    'Good' as status
FROM broker_regulations br;