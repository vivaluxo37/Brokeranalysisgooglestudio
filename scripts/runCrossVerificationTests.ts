import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { promises as fs } from 'fs';
import { join } from 'path';

dotenv.config();

/**
 * Comprehensive Cross-Verification Test Suite
 * Tests the entire verification pipeline with real broker data
 */

interface TestBroker {
  id: string;
  name: string;
  year_founded: number;
  headquarters: string;
  website: string;
  minimum_deposit: number;
  regulation_status: string;
  overall_rating: number;
  trust_score: number;
}

interface TestResult {
  broker: TestBroker;
  testStarted: Date;
  testCompleted: Date;
  processingTime: number;
  status: 'passed' | 'failed' | 'partial';
  verificationResult?: any;
  errors: string[];
  fieldsTestedCount: number;
  discrepanciesFound: number;
  sourcesConsulted: number;
  overallConfidence: number;
}

class CrossVerificationTestSuite {
  private supabase: any;
  private testResults: TestResult[] = [];

  constructor() {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  /**
   * Main test runner
   */
  async runTests(): Promise<void> {
    console.log('🚀 Starting Cross-Verification Test Suite...\n');
    console.log(`📅 Test Started: ${new Date().toISOString()}`);
    console.log('=' .repeat(80));

    try {
      // Step 1: Setup and validation
      await this.validateSetup();

      // Step 2: Get test brokers
      const testBrokers = await this.getTestBrokers();
      
      // Step 3: Run verification tests
      for (const broker of testBrokers) {
        await this.testBrokerVerification(broker);
        
        // Wait between tests to be respectful to APIs
        if (testBrokers.indexOf(broker) < testBrokers.length - 1) {
          console.log('⏳ Waiting 15 seconds before next test...\n');
          await this.sleep(15000);
        }
      }

      // Step 4: Generate comprehensive report
      await this.generateTestReport();

    } catch (error) {
      console.error('💥 Test suite failed:', error);
    }
  }

  /**
   * Validate test environment setup
   */
  private async validateSetup(): Promise<void> {
    console.log('🔧 Validating test environment...');

    // Test database connection
    const { error } = await this.supabase
      .from('brokers')
      .select('count(*)', { count: 'exact', head: true });

    if (error) {
      throw new Error(`Database connection failed: ${error.message}`);
    }
    console.log('✅ Database connection verified');

    // Test API keys
    if (!process.env.SERPAPI_KEY) {
      console.warn('⚠️  SERPAPI_KEY not found - web searches may fail');
    } else {
      console.log('✅ SERPAPI_KEY configured');
    }

    // Check if verification modules can be imported
    try {
      const modules = [
        '../services/verification/searchEngine',
        '../services/verification/webScrapers',
        '../services/verification/regAuthorityVerifier',
        '../services/verification/sourceReliability',
        '../validators/fieldRules'
      ];

      for (const modulePath of modules) {
        await import(modulePath);
      }
      console.log('✅ All verification modules can be imported');
    } catch (error) {
      console.warn('⚠️  Some verification modules failed to import:', error);
    }

    console.log();
  }

  /**
   * Get brokers for testing
   */
  private async getTestBrokers(): Promise<TestBroker[]> {
    console.log('📊 Fetching test brokers...');

    const { data, error } = await this.supabase
      .from('brokers')
      .select(`
        id, name, year_founded, headquarters, website, 
        minimum_deposit, regulation_status, overall_rating, trust_score
      `)
      .eq('is_active', true)
      .limit(3); // Test with 3 brokers

    if (error) {
      throw new Error(`Failed to fetch test brokers: ${error.message}`);
    }

    if (!data || data.length === 0) {
      throw new Error('No active brokers found for testing');
    }

    console.log(`✅ Found ${data.length} brokers for testing:`);
    data.forEach((broker, index) => {
      console.log(`   ${index + 1}. ${broker.name} (Founded: ${broker.year_founded})`);
    });
    console.log();

    return data;
  }

  /**
   * Test verification for a single broker
   */
  private async testBrokerVerification(broker: TestBroker): Promise<void> {
    const testResult: TestResult = {
      broker,
      testStarted: new Date(),
      testCompleted: new Date(),
      processingTime: 0,
      status: 'failed',
      errors: [],
      fieldsTestedCount: 0,
      discrepanciesFound: 0,
      sourcesConsulted: 0,
      overallConfidence: 0
    };

    console.log('=' .repeat(80));
    console.log(`🔍 Testing: ${broker.name}`);
    console.log('=' .repeat(80));

    try {
      // Import the cross-verifier dynamically to handle any import issues
      const { crossVerifier } = await import('../services/verification/crossVerifier');

      // Map database structure to TypeScript interface for cross-verifier
      const mappedBroker = this.mapDatabaseBrokerToInterface(broker);

      console.log('📋 Mapped broker data for verification:');
      console.log(`   Name: ${mappedBroker.name}`);
      console.log(`   Founded: ${mappedBroker.foundingYear}`);
      console.log(`   Website: ${mappedBroker.websiteUrl}`);
      console.log(`   Min Deposit: ${mappedBroker.accessibility?.minDeposit}`);
      console.log(`   Headquarters: ${mappedBroker.headquarters}`);
      console.log();

      // Configure verification options for testing
      const verificationOptions = {
        fieldsToCheck: ['name', 'foundingYear', 'headquarters', 'minDeposit'],
        maxSources: 3,
        confidenceThreshold: 0.4, // Lower threshold for testing
        skipRegulatory: true, // Skip regulatory checks for now
        enableAlerts: false,
        saveDiscrepancies: false // Don't save during testing
      };

      console.log('🧪 Starting verification with options:');
      console.log(`   Fields to check: ${verificationOptions.fieldsToCheck.join(', ')}`);
      console.log(`   Max sources: ${verificationOptions.maxSources}`);
      console.log(`   Confidence threshold: ${verificationOptions.confidenceThreshold}`);
      console.log();

      // Run the verification
      const verificationResult = await crossVerifier.verifyBroker(mappedBroker, verificationOptions);

      // Update test result
      testResult.testCompleted = new Date();
      testResult.processingTime = verificationResult.processingTime;
      testResult.verificationResult = verificationResult;
      testResult.fieldsTestedCount = verificationResult.totalFieldsChecked;
      testResult.discrepanciesFound = verificationResult.fieldsWithDiscrepancies;
      testResult.sourcesConsulted = verificationResult.sourcesUsed.length;
      testResult.overallConfidence = verificationResult.overallConfidence;
      testResult.status = verificationResult.status === 'failed' ? 'failed' : 'passed';

      // Display detailed results
      this.displayVerificationResults(verificationResult);

    } catch (error) {
      testResult.errors.push(`Verification failed: ${error.message || error}`);
      testResult.testCompleted = new Date();
      testResult.processingTime = testResult.testCompleted.getTime() - testResult.testStarted.getTime();
      
      console.error('❌ Verification test failed:', error);
    }

    this.testResults.push(testResult);
  }

  /**
   * Map database broker structure to TypeScript interface
   */
  private mapDatabaseBrokerToInterface(dbBroker: TestBroker): any {
    return {
      id: dbBroker.id.toString(),
      name: dbBroker.name,
      foundingYear: dbBroker.year_founded,
      headquarters: dbBroker.headquarters,
      websiteUrl: dbBroker.website,
      score: dbBroker.overall_rating,
      logoUrl: '',
      description: '',
      regulation: {
        regulators: []
      },
      accessibility: {
        minDeposit: dbBroker.minimum_deposit,
        depositMethods: [],
        withdrawalMethods: [],
        customerSupport: []
      },
      technology: {
        platforms: [],
        executionType: '',
        apiAccess: false,
        eaSupport: false
      },
      tradingConditions: {
        spreads: { eurusd: 0, gbpusd: 0, usdjpy: 0 },
        commission: '',
        swapFeeCategory: 'Standard' as const,
        maxLeverage: '',
        minLotSize: 0.01
      },
      ratings: {
        regulation: 0,
        costs: 0,
        platforms: 0,
        support: 0
      }
    };
  }

  /**
   * Display detailed verification results
   */
  private displayVerificationResults(result: any): void {
    console.log('\n📊 VERIFICATION RESULTS:');
    console.log(`   Status: ${result.status}`);
    console.log(`   Overall Confidence: ${result.overallConfidence.toFixed(3)}`);
    console.log(`   Processing Time: ${result.processingTime}ms`);
    console.log(`   Fields Checked: ${result.totalFieldsChecked}`);
    console.log(`   Discrepancies: ${result.fieldsWithDiscrepancies}`);
    console.log(`   Sources Consulted: ${result.sourcesUsed.length}`);

    if (result.sourcesUsed.length > 0) {
      console.log('\n🌐 Sources Used:');
      result.sourcesUsed.forEach((source, index) => {
        console.log(`   ${index + 1}. ${source.domain}`);
        console.log(`      Confidence: ${source.confidence.toFixed(3)}`);
        console.log(`      Reliability: ${source.reliability.toFixed(3)}`);
        console.log(`      Relevance: ${source.relevanceScore.toFixed(3)}`);
      });
    }

    if (result.discrepancies.length > 0) {
      console.log('\n⚠️  Discrepancies Found:');
      result.discrepancies.forEach((disc, index) => {
        console.log(`   ${index + 1}. Field: ${disc.fieldName}`);
        console.log(`      DB Value: ${JSON.stringify(disc.dbValue)}`);
        console.log(`      Web Value: ${JSON.stringify(disc.aggregatedWebValue)}`);
        console.log(`      Severity: ${disc.severity}`);
        console.log(`      Action: ${disc.recommendedAction}`);
        console.log(`      Confidence: ${disc.confidenceScore.toFixed(3)}`);
        console.log(`      Reasoning: ${disc.reasoning}`);
        console.log();
      });
    }

    if (result.recommendations.length > 0) {
      console.log('💡 Recommendations:');
      result.recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec}`);
      });
    }
  }

  /**
   * Generate comprehensive test report
   */
  private async generateTestReport(): Promise<void> {
    console.log('\n' + '=' .repeat(80));
    console.log('📋 CROSS-VERIFICATION TEST REPORT');
    console.log('=' .repeat(80));

    const totalTests = this.testResults.length;
    const passedTests = this.testResults.filter(r => r.status === 'passed').length;
    const failedTests = this.testResults.filter(r => r.status === 'failed').length;
    const totalDiscrepancies = this.testResults.reduce((sum, r) => sum + r.discrepanciesFound, 0);
    const avgConfidence = this.testResults.reduce((sum, r) => sum + r.overallConfidence, 0) / totalTests;
    const avgProcessingTime = this.testResults.reduce((sum, r) => sum + r.processingTime, 0) / totalTests;
    const totalSources = this.testResults.reduce((sum, r) => sum + r.sourcesConsulted, 0);

    console.log(`\n📊 Overall Statistics:`);
    console.log(`   Total Tests Run: ${totalTests}`);
    console.log(`   Passed: ${passedTests} (${((passedTests/totalTests)*100).toFixed(1)}%)`);
    console.log(`   Failed: ${failedTests} (${((failedTests/totalTests)*100).toFixed(1)}%)`);
    console.log(`   Total Discrepancies Found: ${totalDiscrepancies}`);
    console.log(`   Average Confidence Score: ${avgConfidence.toFixed(3)}`);
    console.log(`   Average Processing Time: ${avgProcessingTime.toFixed(0)}ms`);
    console.log(`   Total Sources Consulted: ${totalSources}`);

    console.log(`\n📋 Test Results by Broker:`);
    this.testResults.forEach((result, index) => {
      console.log(`\n   ${index + 1}. ${result.broker.name}`);
      console.log(`      Status: ${result.status}`);
      console.log(`      Processing Time: ${result.processingTime}ms`);
      console.log(`      Confidence: ${result.overallConfidence.toFixed(3)}`);
      console.log(`      Discrepancies: ${result.discrepanciesFound}`);
      console.log(`      Sources: ${result.sourcesConsulted}`);
      
      if (result.errors.length > 0) {
        console.log(`      Errors: ${result.errors.join('; ')}`);
      }
    });

    // Save detailed report to file
    await this.saveReportToFile();

    console.log(`\n✅ Test Suite Completed!`);
    console.log(`📁 Detailed report saved to: reports/cross-verification-test-report.json`);
  }

  /**
   * Save detailed test report to file
   */
  private async saveReportToFile(): Promise<void> {
    const reportData = {
      testSuiteCompleted: new Date().toISOString(),
      summary: {
        totalTests: this.testResults.length,
        passedTests: this.testResults.filter(r => r.status === 'passed').length,
        failedTests: this.testResults.filter(r => r.status === 'failed').length,
        averageConfidence: this.testResults.reduce((sum, r) => sum + r.overallConfidence, 0) / this.testResults.length,
        averageProcessingTime: this.testResults.reduce((sum, r) => sum + r.processingTime, 0) / this.testResults.length
      },
      results: this.testResults
    };

    try {
      // Ensure reports directory exists
      const reportsDir = join(process.cwd(), 'reports');
      try {
        await fs.access(reportsDir);
      } catch {
        await fs.mkdir(reportsDir, { recursive: true });
      }

      const reportPath = join(reportsDir, 'cross-verification-test-report.json');
      await fs.writeFile(reportPath, JSON.stringify(reportData, null, 2));
      
    } catch (error) {
      console.warn('⚠️  Failed to save report to file:', error);
    }
  }

  /**
   * Utility sleep function
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Run the test suite
if (import.meta.url === `file://${process.argv[1]}`) {
  const testSuite = new CrossVerificationTestSuite();
  testSuite.runTests()
    .then(() => {
      console.log('\n👋 Test suite finished successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Test suite crashed:', error);
      process.exit(1);
    });
}

export { CrossVerificationTestSuite };