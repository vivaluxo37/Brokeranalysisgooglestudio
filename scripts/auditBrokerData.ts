/**
 * Data Audit Script for Programmatic SEO
 *
 * This script audits the current broker data to identify missing attributes
 * needed for programmatic SEO functionality. It generates a comprehensive
 * report with data quality metrics and enrichment recommendations.
 */

import fs from 'fs'
import path from 'path'

import { createClient } from '@supabase/supabase-js'

// Configuration
const SUPABASE_URL = process.env.SUPABASE_URL || 'https://your-project.supabase.co'
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'your-anon-key'

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Types for our audit
interface BrokerData {
  id: number;
  name: string;
  year_founded: number;
  headquarters: string;
  regulation: string[];
  platforms: string[];
  instruments: string[];
  min_deposit: number;
  max_leverage: number;
  supported_countries?: string[];
  country_specific_regulations?: any;
  local_features?: any;
  content_priority?: number;
  last_content_update?: string;
  content_generated?: boolean;
  content_quality_score?: number;
}

interface AuditReport {
  timestamp: string;
  total_brokers: number;
  data_quality: {
    overall_score: number;
    completeness: {
      basic_info: number;
      regulation: number;
      platforms: number;
      instruments: number;
      countries: number;
      content: number;
    };
    missing_fields: {
      field_name: string;
      missing_count: number;
      percentage: number;
    }[];
  };
  country_coverage: {
    total_countries: number;
    covered_countries: string[];
    coverage_by_region: {
      region: string;
      country_count: number;
      broker_coverage: number;
    }[];
  };
  content_status: {
    generated_count: number;
    pending_count: number;
    quality_distribution: {
      high: number; // 0.8+
      medium: number; // 0.5-0.8
      low: number; // <0.5
    };
  };
  recommendations: {
    priority: 'high' | 'medium' | 'low';
    action: string;
    estimated_effort: string;
    impact: string;
  }[];
  broker_details: {
    id: number;
    name: string;
    data_score: number;
    missing_critical_fields: string[];
    recommendations: string[];
  }[];
}

// Country to region mapping
const COUNTRY_REGIONS: Record<string, string> = {
  US: 'North America',
  CA: 'North America',
  MX: 'North America',
  GB: 'Europe',
  DE: 'Europe',
  FR: 'Europe',
  IT: 'Europe',
  ES: 'Europe',
  NL: 'Europe',
  SE: 'Europe',
  NO: 'Europe',
  DK: 'Europe',
  FI: 'Europe',
  AT: 'Europe',
  BE: 'Europe',
  IE: 'Europe',
  PT: 'Europe',
  GR: 'Europe',
  CH: 'Europe',
  PL: 'Europe',
  CZ: 'Europe',
  HU: 'Europe',
  RO: 'Europe',
  BG: 'Europe',
  HR: 'Europe',
  SI: 'Europe',
  SK: 'Europe',
  EE: 'Europe',
  LV: 'Europe',
  LT: 'Europe',
  CY: 'Europe',
  MT: 'Europe',
  LU: 'Europe',
  AU: 'Oceania',
  NZ: 'Oceania',
  JP: 'Asia',
  SG: 'Asia',
  HK: 'Asia',
  CN: 'Asia',
  IN: 'Asia',
  ID: 'Asia',
  MY: 'Asia',
  TH: 'Asia',
  PH: 'Asia',
  VN: 'Asia',
  KH: 'Asia',
  LA: 'Asia',
  MM: 'Asia',
  BD: 'Asia',
  LK: 'Asia',
  PK: 'Asia',
  AE: 'Middle East',
  SA: 'Middle East',
  QA: 'Middle East',
  KW: 'Middle East',
  BH: 'Middle East',
  OM: 'Middle East',
  JO: 'Middle East',
  IL: 'Middle East',
  TR: 'Middle East',
  EG: 'Middle East',
  ZA: 'Africa',
  NG: 'Africa',
  KE: 'Africa',
  GH: 'Africa',
  MA: 'Africa',
  TN: 'Africa',
  BR: 'South America',
  AR: 'South America',
  CL: 'South America',
  CO: 'South America',
  PE: 'South America',
  RU: 'Europe/Asia',
  KZ: 'Asia',
  UZ: 'Asia',
}

// Main audit function
async function auditBrokerData(): Promise<AuditReport> {
  console.log('Starting broker data audit...')

  // Fetch all broker data
  const { data: brokers, error } = await supabase
    .from('brokers')
    .select('*')

  if (error) {
    console.error('Error fetching broker data:', error)
    throw error
  }

  console.log(`Found ${brokers.length} brokers to audit`)

  // Initialize report
  const report: AuditReport = {
    timestamp: new Date().toISOString(),
    total_brokers: brokers.length,
    data_quality: {
      overall_score: 0,
      completeness: {
        basic_info: 0,
        regulation: 0,
        platforms: 0,
        instruments: 0,
        countries: 0,
        content: 0,
      },
      missing_fields: [],
    },
    country_coverage: {
      total_countries: 0,
      covered_countries: [],
      coverage_by_region: [],
    },
    content_status: {
      generated_count: 0,
      pending_count: 0,
      quality_distribution: {
        high: 0,
        medium: 0,
        low: 0,
      },
    },
    recommendations: [],
    broker_details: [],
  }

  // Analyze each broker
  const allCountries = new Set<string>()
  const regionData: Record<string, { countries: Set<string>, brokers: number }> = {}

  for (const broker of brokers) {
    const brokerScore = calculateBrokerDataScore(broker)
    const missingFields = identifyMissingFields(broker)
    const brokerRecommendations = generateBrokerRecommendations(broker, missingFields)

    // Track country coverage
    if (broker.supported_countries && Array.isArray(broker.supported_countries)) {
      broker.supported_countries.forEach((country: string) => {
        allCountries.add(country)
        const region = COUNTRY_REGIONS[country] || 'Other'
        if (!regionData[region]) {
          regionData[region] = { countries: new Set(), brokers: 0 }
        }
        regionData[region].countries.add(country)
        regionData[region].brokers++
      })
    }

    // Track content status
    if (broker.content_generated) {
      report.content_status.generated_count++
      if (broker.content_quality_score >= 0.8) {
        report.content_status.quality_distribution.high++
      } else if (broker.content_quality_score >= 0.5) {
        report.content_status.quality_distribution.medium++
      } else {
        report.content_status.quality_distribution.low++
      }
    } else {
      report.content_status.pending_count++
    }

    // Add to broker details
    report.broker_details.push({
      id: broker.id,
      name: broker.name,
      data_score: brokerScore,
      missing_critical_fields: missingFields.filter(f => f.critical).map(f => f.field),
      recommendations: brokerRecommendations,
    })
  }

  // Calculate completeness scores
  report.data_quality.completeness.basic_info = calculateCompletenessScore(brokers, ['name', 'year_founded', 'headquarters'])
  report.data_quality.completeness.regulation = calculateCompletenessScore(brokers, ['regulation'])
  report.data_quality.completeness.platforms = calculateCompletenessScore(brokers, ['platforms'])
  report.data_quality.completeness.instruments = calculateCompletenessScore(brokers, ['instruments'])
  report.data_quality.completeness.countries = calculateCompletenessScore(brokers, ['supported_countries'])
  report.data_quality.completeness.content = calculateCompletenessScore(brokers, ['content_generated', 'content_quality_score'])

  // Calculate overall score
  const completenessValues = Object.values(report.data_quality.completeness)
  report.data_quality.overall_score = completenessValues.reduce((sum, score) => sum + score, 0) / completenessValues.length

  // Identify missing fields
  report.data_quality.missing_fields = identifyMissingFieldsAcrossBrokers(brokers)

  // Set country coverage data
  report.country_coverage.total_countries = allCountries.size
  report.country_coverage.covered_countries = Array.from(allCountries).sort()
  report.country_coverage.coverage_by_region = Object.entries(regionData).map(([region, data]) => ({
    region,
    country_count: data.countries.size,
    broker_coverage: data.brokers,
  }))

  // Generate recommendations
  report.recommendations = generateRecommendations(report)

  console.log('Audit completed successfully')
  return report
}

// Calculate data quality score for a single broker
function calculateBrokerDataScore(broker: BrokerData): number {
  let score = 0
  let maxScore = 0

  // Basic info (30%)
  maxScore += 30
  if (broker.name) {score += 10}
  if (broker.year_founded) {score += 10}
  if (broker.headquarters) {score += 10}

  // Regulation (20%)
  maxScore += 20
  if (broker.regulation && Array.isArray(broker.regulation) && broker.regulation.length > 0) {
    score += 20
  }

  // Platforms (15%)
  maxScore += 15
  if (broker.platforms && Array.isArray(broker.platforms) && broker.platforms.length > 0) {
    score += 15
  }

  // Instruments (15%)
  maxScore += 15
  if (broker.instruments && Array.isArray(broker.instruments) && broker.instruments.length > 0) {
    score += 15
  }

  // Countries (10%)
  maxScore += 10
  if (broker.supported_countries && Array.isArray(broker.supported_countries) && broker.supported_countries.length > 0) {
    score += 10
  }

  // Content (10%)
  maxScore += 10
  if (broker.content_generated) {
    score += 5
    if (broker.content_quality_score && broker.content_quality_score > 0) {
      score += 5
    }
  }

  return maxScore > 0 ? (score / maxScore) * 100 : 0
}

// Identify missing fields for a broker
function identifyMissingFields(broker: BrokerData): { field: string; critical: boolean }[] {
  const missingFields: { field: string; critical: boolean }[] = []

  // Critical fields
  if (!broker.name) {missingFields.push({ field: 'name', critical: true })}
  if (!broker.year_founded) {missingFields.push({ field: 'year_founded', critical: true })}
  if (!broker.headquarters) {missingFields.push({ field: 'headquarters', critical: true })}
  if (!broker.regulation || broker.regulation.length === 0) {missingFields.push({ field: 'regulation', critical: true })}

  // Important fields
  if (!broker.platforms || broker.platforms.length === 0) {missingFields.push({ field: 'platforms', critical: false })}
  if (!broker.instruments || broker.instruments.length === 0) {missingFields.push({ field: 'instruments', critical: false })}
  if (!broker.supported_countries || broker.supported_countries.length === 0) {missingFields.push({ field: 'supported_countries', critical: false })}

  // Content fields
  if (!broker.content_generated) {missingFields.push({ field: 'content_generated', critical: false })}
  if (!broker.content_quality_score) {missingFields.push({ field: 'content_quality_score', critical: false })}

  return missingFields
}

// Generate recommendations for a specific broker
function generateBrokerRecommendations(broker: BrokerData, missingFields: { field: string; critical: boolean }[]): string[] {
  const recommendations: string[] = []

  const criticalMissing = missingFields.filter(f => f.critical)
  if (criticalMissing.length > 0) {
    recommendations.push(`Priority: Add missing critical fields: ${criticalMissing.map(f => f.field).join(', ')}`)
  }

  if (!broker.supported_countries || broker.supported_countries.length === 0) {
    recommendations.push('Add supported countries to enable country-specific targeting')
  }

  if (!broker.content_generated) {
    recommendations.push('Generate AI content to improve SEO and user engagement')
  }

  if (!broker.content_quality_score || broker.content_quality_score < 0.7) {
    recommendations.push('Improve content quality to increase SEO effectiveness')
  }

  if (!broker.country_specific_regulations) {
    recommendations.push('Add country-specific regulation information for better targeting')
  }

  if (!broker.local_features) {
    recommendations.push('Document local features and country-specific offerings')
  }

  return recommendations
}

// Calculate completeness score for a specific field across all brokers
function calculateCompletenessScore(brokers: BrokerData[], fields: string[]): number {
  let totalScore = 0

  for (const broker of brokers) {
    let brokerScore = 0
    for (const field of fields) {
      const value = (broker as any)[field]
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          if (value.length > 0) {brokerScore++}
        } else {
          brokerScore++
        }
      }
    }
    totalScore += (brokerScore / fields.length) * 100
  }

  return brokers.length > 0 ? totalScore / brokers.length : 0
}

// Identify missing fields across all brokers
function identifyMissingFieldsAcrossBrokers(brokers: BrokerData[]): { field_name: string; missing_count: number; percentage: number }[] {
  const fieldStats: Record<string, { present: number; total: number }> = {
    name: { present: 0, total: brokers.length },
    year_founded: { present: 0, total: brokers.length },
    headquarters: { present: 0, total: brokers.length },
    regulation: { present: 0, total: brokers.length },
    platforms: { present: 0, total: brokers.length },
    instruments: { present: 0, total: brokers.length },
    min_deposit: { present: 0, total: brokers.length },
    max_leverage: { present: 0, total: brokers.length },
    supported_countries: { present: 0, total: brokers.length },
    country_specific_regulations: { present: 0, total: brokers.length },
    local_features: { present: 0, total: brokers.length },
    content_priority: { present: 0, total: brokers.length },
    last_content_update: { present: 0, total: brokers.length },
    content_generated: { present: 0, total: brokers.length },
    content_quality_score: { present: 0, total: brokers.length },
  }

  for (const broker of brokers) {
    for (const [field, stats] of Object.entries(fieldStats)) {
      const value = (broker as any)[field]
      if (value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          if (value.length > 0) {stats.present++}
        } else {
          stats.present++
        }
      }
    }
  }

  return Object.entries(fieldStats)
    .map(([field, stats]) => ({
      field_name: field,
      missing_count: stats.total - stats.present,
      percentage: ((stats.total - stats.present) / stats.total) * 100,
    }))
    .filter(item => item.missing_count > 0)
    .sort((a, b) => b.percentage - a.percentage)
}

// Generate overall recommendations based on audit results
function generateRecommendations(report: AuditReport): { priority: 'high' | 'medium' | 'low'; action: string; estimated_effort: string; impact: string }[] {
  const recommendations: { priority: 'high' | 'medium' | 'low'; action: string; estimated_effort: string; impact: string }[] = []

  // High priority recommendations
  if (report.data_quality.overall_score < 70) {
    recommendations.push({
      priority: 'high',
      action: 'Improve overall data quality by focusing on missing critical fields',
      estimated_effort: '2-3 weeks',
      impact: 'Significant improvement in SEO and user experience',
    })
  }

  if (report.data_quality.completeness.countries < 50) {
    recommendations.push({
      priority: 'high',
      action: 'Add supported countries to all brokers to enable country-specific targeting',
      estimated_effort: '1-2 weeks',
      impact: 'Enables programmatic SEO for country-specific pages',
    })
  }

  if (report.content_status.pending_count > report.total_brokers * 0.5) {
    recommendations.push({
      priority: 'high',
      action: 'Generate AI content for brokers without content',
      estimated_effort: '1-2 weeks',
      impact: 'Immediate improvement in SEO and page quality',
    })
  }

  // Medium priority recommendations
  if (report.data_quality.completeness.regulation < 80) {
    recommendations.push({
      priority: 'medium',
      action: 'Complete regulation information for all brokers',
      estimated_effort: '1 week',
      impact: 'Improves trust signals and compliance information',
    })
  }

  if (report.country_coverage.total_countries < 30) {
    recommendations.push({
      priority: 'medium',
      action: 'Expand country coverage to at least 30 countries',
      estimated_effort: '2-3 weeks',
      impact: 'Increases potential audience reach significantly',
    })
  }

  // Low priority recommendations
  if (report.data_quality.completeness.content < 80) {
    recommendations.push({
      priority: 'low',
      action: 'Improve content quality scores across all brokers',
      estimated_effort: '1-2 weeks',
      impact: 'Incremental improvement in SEO rankings',
    })
  }

  recommendations.push({
    priority: 'low',
    action: 'Add local features and country-specific regulations',
    estimated_effort: '3-4 weeks',
    impact: 'Enhances targeting and user relevance',
  })

  return recommendations
}

// Save audit report to file
function saveAuditReport(report: AuditReport): void {
  const reportsDir = path.join(process.cwd(), 'reports')
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true })
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const filename = `broker-data-audit-${timestamp}.json`
  const filepath = path.join(reportsDir, filename)

  fs.writeFileSync(filepath, JSON.stringify(report, null, 2))
  console.log(`Audit report saved to: ${filepath}`)

  // Also save a summary report
  const summaryFilename = `broker-data-audit-summary-${timestamp}.md`
  const summaryFilepath = path.join(reportsDir, summaryFilename)

  const summary = generateMarkdownSummary(report)
  fs.writeFileSync(summaryFilepath, summary)
  console.log(`Summary report saved to: ${summaryFilepath}`)
}

// Generate markdown summary of the audit
function generateMarkdownSummary(report: AuditReport): string {
  return `# Broker Data Audit Summary

**Generated:** ${new Date(report.timestamp).toLocaleString()}

## Overview
- **Total Brokers:** ${report.total_brokers}
- **Overall Data Quality Score:** ${report.data_quality.overall_score.toFixed(1)}%

## Data Completeness
- **Basic Info:** ${report.data_quality.completeness.basic_info.toFixed(1)}%
- **Regulation:** ${report.data_quality.completeness.regulation.toFixed(1)}%
- **Platforms:** ${report.data_quality.completeness.platforms.toFixed(1)}%
- **Instruments:** ${report.data_quality.completeness.instruments.toFixed(1)}%
- **Countries:** ${report.data_quality.completeness.countries.toFixed(1)}%
- **Content:** ${report.data_quality.completeness.content.toFixed(1)}%

## Country Coverage
- **Total Countries:** ${report.country_coverage.total_countries}
- **Covered Countries:** ${report.country_coverage.covered_countries.join(', ')}

### Coverage by Region
${report.country_coverage.coverage_by_region.map(region =>
    `- **${region.region}:** ${region.country_count} countries, ${region.broker_coverage} broker coverages`,
  ).join('\n')}

## Content Status
- **Generated Content:** ${report.content_status.generated_count} brokers
- **Pending Content:** ${report.content_status.pending_count} brokers
- **Quality Distribution:**
  - High (0.8+): ${report.content_status.quality_distribution.high}
  - Medium (0.5-0.8): ${report.content_status.quality_distribution.medium}
  - Low (<0.5): ${report.content_status.quality_distribution.low}

## Top Missing Fields
${report.data_quality.missing_fields.slice(0, 5).map(field =>
    `- **${field.field_name}:** ${field.missing_count} brokers (${field.percentage.toFixed(1)}%)`,
  ).join('\n')}

## Recommendations
${report.recommendations.map(rec =>
    `### ${rec.priority.toUpperCase()} Priority
- **Action:** ${rec.action}
- **Estimated Effort:** ${rec.estimated_effort}
- **Impact:** ${rec.impact}
`).join('\n\n')}

## Top 10 Brokers by Data Quality
${report.broker_details
    .sort((a, b) => b.data_score - a.data_score)
    .slice(0, 10)
    .map((broker, index) =>
      `${index + 1}. **${broker.name}** - Score: ${broker.data_score.toFixed(1)}%`,
    ).join('\n')}

## Bottom 10 Brokers by Data Quality
${report.broker_details
    .sort((a, b) => a.data_score - b.data_score)
    .slice(0, 10)
    .map((broker, index) =>
      `${index + 1}. **${broker.name}** - Score: ${broker.data_score.toFixed(1)}%`,
    ).join('\n')}
`
}

// Main execution
async function main() {
  try {
    const report = await auditBrokerData()
    saveAuditReport(report)

    console.log('\n=== Audit Summary ===')
    console.log(`Total Brokers: ${report.total_brokers}`)
    console.log(`Overall Data Quality: ${report.data_quality.overall_score.toFixed(1)}%`)
    console.log(`Country Coverage: ${report.country_coverage.total_countries} countries`)
    console.log(`Content Generated: ${report.content_status.generated_count}/${report.total_brokers} brokers`)
    console.log(`High Priority Recommendations: ${report.recommendations.filter(r => r.priority === 'high').length}`)

  } catch (error) {
    console.error('Audit failed:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { auditBrokerData, AuditReport }
