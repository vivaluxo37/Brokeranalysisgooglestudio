#!/usr/bin/env node

/**
 * Complete Broker Verification Script
 * Verifies all brokers in the database and generates a comprehensive report
 */

import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Environment configuration
const SUPABASE_URL = 'https://sdanjzsxwczlwsgspihb.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNkYW5qenN4d2N6bHdzZ3NwaWhiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MDUzNzIsImV4cCI6MjA3NDI4MTM3Mn0.DNQWDqHNW72ck0Jw5k_IwTIyQhcD32kwNdqfTyTUrqY';
const GOOGLE_AI_API_KEY = 'AIzaSyAjxTe_IQ11ABiHR_Es4jg_odd9CmwaEuQ';

// Initialize clients
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const genAI = new GoogleGenerativeAI(GOOGLE_AI_API_KEY);

class CompleteBrokerVerifier {
    constructor() {
        this.model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        this.results = [];
        this.summary = {
            totalBrokers: 0,
            verified: 0,
            warnings: 0,
            errors: 0,
            startTime: new Date(),
            endTime: null
        };
    }

    /**
     * Verify a single broker's data
     */
    async verifyBroker(broker) {
        const verificationResult = {
            id: broker.id,
            name: broker.name,
            slug: broker.slug,
            status: 'unknown',
            score: 0,
            issues: [],
            warnings: [],
            recommendations: [],
            timestamp: new Date()
        };

        try {
            console.log(`🔍 Verifying ${broker.name} (${broker.slug})...`);

            // Basic data validation
            const basicChecks = this.performBasicChecks(broker);
            verificationResult.issues.push(...basicChecks.issues);
            verificationResult.warnings.push(...basicChecks.warnings);

            // AI-powered verification
            if (GOOGLE_AI_API_KEY && GOOGLE_AI_API_KEY !== 'your_api_key_here') {
                try {
                    const aiAnalysis = await this.performAIVerification(broker);
                    verificationResult.recommendations.push(...aiAnalysis.recommendations);
                    verificationResult.score = aiAnalysis.trustworthiness;
                } catch (aiError) {
                    console.warn(`⚠️  AI verification failed for ${broker.name}:`, aiError.message);
                    verificationResult.warnings.push('AI verification unavailable');
                }
            }

            // Calculate overall status
            if (verificationResult.issues.length === 0) {
                if (verificationResult.warnings.length === 0) {
                    verificationResult.status = 'verified';
                    this.summary.verified++;
                } else {
                    verificationResult.status = 'warning';
                    this.summary.warnings++;
                }
            } else {
                verificationResult.status = 'error';
                this.summary.errors++;
            }

            console.log(`✅ ${broker.name}: ${verificationResult.status.toUpperCase()} (Score: ${verificationResult.score})`);

        } catch (error) {
            console.error(`❌ Error verifying ${broker.name}:`, error);
            verificationResult.status = 'error';
            verificationResult.issues.push(`Verification failed: ${error.message}`);
            this.summary.errors++;
        }

        return verificationResult;
    }

    /**
     * Perform basic data validation checks
     */
    performBasicChecks(broker) {
        const issues = [];
        const warnings = [];

        // Required fields check
        const requiredFields = ['name', 'slug', 'website'];
        requiredFields.forEach(field => {
            if (!broker[field]) {
                issues.push(`Missing required field: ${field}`);
            }
        });

        // Data quality checks
        if (broker.website && !broker.website.startsWith('http')) {
            warnings.push('Website URL should start with http/https');
        }

        if (broker.minimum_deposit && (broker.minimum_deposit < 0 || broker.minimum_deposit > 100000)) {
            warnings.push('Unusual minimum deposit amount');
        }

        if (broker.overall_rating && (broker.overall_rating < 1 || broker.overall_rating > 10)) {
            issues.push('Overall rating out of valid range (1-10)');
        }

        if (!broker.description || broker.description.length < 50) {
            warnings.push('Description too short or missing');
        }

        if (!broker.headquarters) {
            warnings.push('Headquarters information missing');
        }

        return { issues, warnings };
    }

    /**
     * AI-powered verification using Google AI
     */
    async performAIVerification(broker) {
        const prompt = `
Analyze this broker data and provide a trustworthiness assessment:

Broker: ${broker.name}
Website: ${broker.website}
Headquarters: ${broker.headquarters || 'Unknown'}
Founded: ${broker.year_founded || 'Unknown'}
Regulation: ${broker.regulation_status || 'Unknown'}
Description: ${broker.description || 'No description'}

Please provide:
1. A trustworthiness score (1-10)
2. Up to 3 key recommendations for improvement
3. Any red flags or concerns

Format as JSON: {
  "trustworthiness": number,
  "recommendations": ["rec1", "rec2", "rec3"],
  "concerns": ["concern1", "concern2"]
}`;

        const result = await this.model.generateContent(prompt);
        const response = result.response.text();
        
        try {
            // Extract JSON from response
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const analysis = JSON.parse(jsonMatch[0]);
                return {
                    trustworthiness: analysis.trustworthiness || 5,
                    recommendations: analysis.recommendations || [],
                    concerns: analysis.concerns || []
                };
            }
        } catch (parseError) {
            console.warn('Failed to parse AI response');
        }

        return {
            trustworthiness: 5,
            recommendations: ['AI analysis unavailable'],
            concerns: []
        };
    }

    /**
     * Fetch all brokers from database
     */
    async fetchAllBrokers() {
        console.log('📊 Fetching all brokers from database...');
        
        const { data, error, count } = await supabase
            .from('brokers')
            .select('*', { count: 'exact' })
            .order('overall_rating', { ascending: false });

        if (error) {
            throw new Error(`Failed to fetch brokers: ${error.message}`);
        }

        console.log(`✅ Found ${count} brokers in database`);
        this.summary.totalBrokers = count;
        
        return data;
    }

    /**
     * Generate comprehensive report
     */
    generateReport() {
        this.summary.endTime = new Date();
        const duration = Math.round((this.summary.endTime - this.summary.startTime) / 1000);

        const report = {
            metadata: {
                generatedAt: this.summary.endTime,
                duration: `${duration} seconds`,
                totalBrokers: this.summary.totalBrokers,
                verified: this.summary.verified,
                warnings: this.summary.warnings,
                errors: this.summary.errors,
                successRate: `${((this.summary.verified / this.summary.totalBrokers) * 100).toFixed(1)}%`
            },
            summary: {
                topRatedBrokers: this.results
                    .filter(r => r.status === 'verified')
                    .sort((a, b) => b.score - a.score)
                    .slice(0, 10),
                brokersWithIssues: this.results
                    .filter(r => r.status === 'error')
                    .sort((a, b) => b.issues.length - a.issues.length),
                brokersWithWarnings: this.results
                    .filter(r => r.status === 'warning')
                    .sort((a, b) => b.warnings.length - a.warnings.length)
            },
            detailedResults: this.results,
            recommendations: {
                immediate: [
                    'Fix all brokers with error status',
                    'Review brokers with multiple warnings',
                    'Ensure all required fields are populated'
                ],
                longTerm: [
                    'Implement automated data quality checks',
                    'Regular broker information updates',
                    'Enhanced verification process'
                ]
            }
        };

        return report;
    }

    /**
     * Run complete verification process
     */
    async run() {
        try {
            console.log('🚀 Starting complete broker verification...');
            console.log('=' .repeat(50));

            // Fetch all brokers
            const brokers = await this.fetchAllBrokers();

            // Verify each broker
            for (const broker of brokers) {
                const result = await this.verifyBroker(broker);
                this.results.push(result);
                
                // Small delay to avoid overwhelming the API
                await new Promise(resolve => setTimeout(resolve, 100));
            }

            // Generate and save report
            const report = this.generateReport();
            const filename = `broker-verification-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
            writeFileSync(filename, JSON.stringify(report, null, 2));

            console.log('=' .repeat(50));
            console.log('📋 VERIFICATION COMPLETE');
            console.log('=' .repeat(50));
            console.log(`📊 Total Brokers: ${this.summary.totalBrokers}`);
            console.log(`✅ Verified: ${this.summary.verified}`);
            console.log(`⚠️  Warnings: ${this.summary.warnings}`);
            console.log(`❌ Errors: ${this.summary.errors}`);
            console.log(`📈 Success Rate: ${((this.summary.verified / this.summary.totalBrokers) * 100).toFixed(1)}%`);
            console.log(`📄 Report saved: ${filename}`);
            console.log('=' .repeat(50));

            return report;

        } catch (error) {
            console.error('💥 Verification process failed:', error);
            throw error;
        }
    }
}

// Run the verification
const verifier = new CompleteBrokerVerifier();
verifier.run()
    .then(() => {
        console.log('✅ All done!');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Process failed:', error);
        process.exit(1);
    });

export default CompleteBrokerVerifier;