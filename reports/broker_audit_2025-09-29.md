# Broker Database Audit Report

**Date:** 2025-09-29  
**Time:** 12:22:08 UTC  
**Total Brokers Analyzed:** 78  

## Executive Summary

Data audit completed for 78 brokers. Overall data quality: Excellent (8.333333333333334/10). 79 critical errors found that require immediate attention.

## Data Quality Scores

| Metric | Score | Status |
|--------|-------|---------|
| **Overall Quality** | 8.33/10 | 🟡 Good |
| **Data Completeness** | 10/10 | 🟢 Excellent |
| **Data Consistency** | 5/10 | 🟠 Fair |
| **Validation Score** | 10/10 | 🟢 Excellent |

## Field Analysis

| Field | Completeness | Null Count | Valid Values | Invalid Values | Unique Values | Common Issues |
|-------|-------------|------------|--------------|----------------|---------------|---------------|
| id | 100% | 0 | 78 | 0 | 78 | None |
| name | 100% | 0 | 78 | 0 | 76 | None |
| logoUrl | 100% | 0 | 78 | 0 | 76 | None |
| websiteUrl | 100% | 0 | 78 | 0 | 78 | None |
| score | 100% | 0 | 78 | 0 | 21 | None |
| foundingYear | 100% | 0 | 78 | 0 | 32 | None |
| headquarters | 100% | 0 | 78 | 0 | 34 | None |
| description | 100% | 0 | 78 | 0 | 78 | None |
| minDeposit | 100% | 0 | 78 | 0 | 12 | None |
| maxLeverage | 98.72% | 1 | 77 | 0 | 22 | Missing required field |
| eurUsdSpread | 98.72% | 1 | 76 | 1 | 21 | Missing required field, Invalid type: expected number |
| regulators | 100% | 0 | 78 | 0 | 60 | None |
| platforms | 100% | 0 | 78 | 0 | 53 | None |
| overallRating | 78.21% | 17 | 61 | 0 | 17 | None |

## Critical Errors (79)

### MEDIUM: Pepperstone (pepperstone)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: IC Markets (ic-markets)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: XTB (xtb)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Forex.com (forex-com)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: IG (ig)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Saxo Bank (saxo-bank)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Interactive Brokers (interactive-brokers)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: eToro (etoro)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Plus500 (plus500)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: AvaTrade (avatrade)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: OANDA (oanda)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: FxPro (fxpro)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Axi (axi)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: FP Markets (fp-markets)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: CMC Markets (cmc-markets)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Admirals (admirals)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Tickmill (tickmill)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Swissquote (swissquote)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Dukascopy (dukascopy)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: ThinkMarkets (thinkmarkets)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: FXCM (fxcm)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: XM (xm)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Exness (exness)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: HF Markets (hf-markets)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: FBS (fbs)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: OctaFX (octafx)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: RoboForex (roboforex)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: HYCM (hycm)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: City Index (city-index)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: ActivTrades (activtrades)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: ATFX (atfx)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: LCG (lcg)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Markets.com (markets-com)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: IronFX (ironfx)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: GMO Click (gmo-click)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: GKFX (gkfx)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Bitget (CFD) (bitget)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Tradeview (tradeview)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: NordFX (nordfx)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: FXOpen (fxopen)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Royal (royal)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: CapTrader (captrader)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Mexem (mexem)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Trading 212 (trading212)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: VT Markets (vt-markets)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: TMGM (tmgm)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Trade Nation (trade-nation)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: FX Trading.com (fx-trading)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Multibank (multibank)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Tradestation Global (tradestation-global)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Spreadex (spreadex)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Fusion Markets (fusion-markets)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Eightcap (eightcap)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Missing trading conditions, using defaults

### MEDIUM: Eightcap (eightcap)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Hantec Markets (hantec-markets)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Global Prime (global-prime)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Go Markets (go-markets)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Moneta Markets (moneta-markets)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: BlackBull Markets (blackbull)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: StarTrader (startrader)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Libertex (libertex)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Capital.com (capital-com)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: BlackBull Markets (blackbull-markets)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: IC Trading (ictrading)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: EasyMarkets (easymarkets)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Freedom24 (freedom24)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: FXORO (fxoro)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: StarTrader (startrader-global)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: PU Prime (puprime)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: GBE Brokers (gbe-brokers)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Thunder Markets (thunder-markets)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: SuperForex (superforex)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: InstaForex (instaforex)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: LifeFinance (lifefinance)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: FXGT (fxgt)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: TradersTrust (traderstrust)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: FreshForex (freshforex)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: Windsor Brokers (windsor-broker)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)

### MEDIUM: TastyFX (tastyfx)
- **Field:** unknown
- **Error Type:** invalid_format
- **Current Value:** NULL
- **Recommendation:** Broker data may be outdated (last checked: 999 days ago)


## Data Inconsistencies (3)

### DATA MISMATCH - HIGH Impact
- **Description:** Duplicate broker names found: "blackbull markets"
- **Affected Brokers:** blackbull, blackbull-markets
- **Suggested Fix:** Review and consolidate duplicate entries

### DATA MISMATCH - HIGH Impact
- **Description:** Duplicate broker names found: "startrader"
- **Affected Brokers:** startrader, startrader-global
- **Suggested Fix:** Review and consolidate duplicate entries

### DATA MISMATCH - MEDIUM Impact
- **Description:** Mismatch between regulation.regulators and security.regulatedBy
- **Affected Brokers:** avatrade
- **Suggested Fix:** Synchronize regulatory information across fields


## Recommendations

- Improve data completeness for fields: overallRating
- Resolve 2 high-impact data inconsistencies

## Next Steps

1. **Immediate Actions:**
   - Address all critical errors
   - Resolve high-impact inconsistencies
   - Fill missing data for required fields

2. **Short-term (1-2 weeks):**
   - Implement data validation rules
   - Set up monitoring for data quality
   - Create data entry guidelines

3. **Long-term (1 month+):**
   - Automate data quality checks
   - Implement real-time validation
   - Set up alerts for data quality degradation

---
*Report generated by Broker Data Auditor v1.0*
