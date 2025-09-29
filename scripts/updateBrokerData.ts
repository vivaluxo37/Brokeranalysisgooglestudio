/**
 * Update Broker Data Script
 * Main script to apply researched broker data to the existing broker database
 */

import { BrokerDataResearcher, BrokerResearchData } from './brokerDataResearch';
import { BrokerDataTransformer, BrokerData } from './brokerDataTransformer';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export class BrokerDataUpdater {
  
  /**
   * Priority order for broker updates
   */
  private static readonly PRIORITY_BROKERS = [
    'interactive-brokers',
    'etoro',
    'plus500',
    'pepperstone',
    'ig',
    'saxo-bank',
    'ic-markets',
    'xm',
    'oanda',
    'fxcm'
  ];

  /**
   * Load existing broker data from JSON file
   */
  private static loadExistingBrokerData(filePath: string): any[] {
    try {
      const data = readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading broker data:', error);
      return [];
    }
  }

  /**
   * Save updated broker data to JSON file
   */
  private static saveBrokerData(filePath: string, data: any[]): void {
    try {
      const jsonString = JSON.stringify(data, null, 2);
      writeFileSync(filePath, jsonString, 'utf8');
      console.log(`✅ Broker data saved to ${filePath}`);
    } catch (error) {
      console.error('Error saving broker data:', error);
    }
  }

  /**
   * Get all available researched broker data
   */
  private static getResearchedBrokerData(): BrokerResearchData[] {
    return [
      BrokerDataResearcher.getInteractiveBrokersData(),
      BrokerDataResearcher.getEToroData(),
      BrokerDataResearcher.getPlus500Data(),
      BrokerDataResearcher.getPepperstoneData()
    ];
  }

  /**
   * Update broker data with researched information
   */
  public static updateBrokerDatabase(dataFilePath: string): void {
    console.log('🔄 Starting broker data update process...');
    
    // Load existing data
    const existingBrokers = this.loadExistingBrokerData(dataFilePath);
    console.log(`📊 Loaded ${existingBrokers.length} existing brokers`);
    
    // Get researched data
    const researchedData = this.getResearchedBrokerData();
    console.log(`🔍 Found ${researchedData.length} researched brokers`);
    
    // Create a map for quick lookup
    const researchMap = new Map(researchedData.map(r => [r.id, r]));
    
    // Update existing brokers with research data
    let updatedCount = 0;
    const updatedBrokers = existingBrokers.map((broker: any) => {
      const researchData = researchMap.get(broker.id);
      if (researchData) {
        console.log(`📝 Updating ${broker.name || broker.id}...`);
        
        // Transform research data to broker format
        const transformedData = BrokerDataTransformer.transformToBrokerData(researchData);
        
        // Merge with existing data, keeping existing structure
        const updatedBroker = {
          ...broker,
          // Core information
          name: transformedData.name,
          description: transformedData.description,
          website: transformedData.website,
          country: transformedData.country,
          regulation: transformedData.regulation,
          founded: transformedData.founded,
          
          // Trading conditions
          minDeposit: transformedData.minDeposit,
          maxLeverage: transformedData.maxLeverage,
          spreads: transformedData.spreads,
          
          // Platforms and assets
          platforms: transformedData.platforms,
          accountTypes: transformedData.accountTypes,
          assets: transformedData.assets,
          
          // Ratings (calculated from research)
          ratings: transformedData.ratings,
          
          // Detailed information
          pros: transformedData.pros,
          cons: transformedData.cons,
          fees: transformedData.fees,
          
          // Additional data
          executionType: transformedData.executionType,
          support: transformedData.support,
          languages: transformedData.languages,
          lastUpdated: transformedData.lastUpdated,
          
          // Preserve existing logo if available
          logo: broker.logo || transformedData.logo
        };
        
        updatedCount++;
        return updatedBroker;
      }
      
      return broker; // Return unchanged if no research data available
    });
    
    console.log(`✨ Updated ${updatedCount} brokers with researched data`);
    
    // Save updated data
    this.saveBrokerData(dataFilePath, updatedBrokers);
    
    // Generate update report
    this.generateUpdateReport(updatedBrokers, researchedData);
  }

  /**
   * Generate a report of the update process
   */
  private static generateUpdateReport(brokers: any[], researchData: BrokerResearchData[]): void {
    console.log('\n📋 UPDATE REPORT');
    console.log('================');
    
    const updatedBrokerIds = new Set(researchData.map(r => r.id));
    const updatedBrokers = brokers.filter(b => updatedBrokerIds.has(b.id));
    
    console.log(`📊 Total brokers in database: ${brokers.length}`);
    console.log(`🔄 Brokers updated with research: ${updatedBrokers.length}`);
    console.log(`📈 Update coverage: ${((updatedBrokers.length / brokers.length) * 100).toFixed(1)}%`);
    
    console.log('\n🎯 PRIORITY BROKERS STATUS:');
    this.PRIORITY_BROKERS.forEach((brokerId, index) => {
      const hasResearch = updatedBrokerIds.has(brokerId);
      const status = hasResearch ? '✅' : '⏳';
      const brokerName = researchData.find(r => r.id === brokerId)?.name || brokerId;
      console.log(`${index + 1}. ${status} ${brokerName}`);
    });
    
    console.log('\n🔍 UPDATED BROKERS DETAILS:');
    updatedBrokers.forEach(broker => {
      const research = researchData.find(r => r.id === broker.id);
      if (research) {
        console.log(`\n• ${broker.name}`);
        console.log(`  Rating: ${broker.ratings.overall}/5.0`);
        console.log(`  Min Deposit: $${broker.minDeposit}`);
        console.log(`  EUR/USD Spread: ${broker.spreads.EUR_USD} pips`);
        console.log(`  Regulation: ${broker.regulation.join(', ')}`);
        console.log(`  Platforms: ${broker.platforms.length}`);
      }
    });
    
    console.log('\n⏭️  NEXT STEPS:');
    const remainingBrokers = this.PRIORITY_BROKERS.filter(id => !updatedBrokerIds.has(id));
    if (remainingBrokers.length > 0) {
      console.log('Priority brokers still needing research:');
      remainingBrokers.forEach((id, index) => {
        console.log(`${index + 1}. ${id}`);
      });
    } else {
      console.log('✅ All priority brokers have been updated!');
    }
  }

  /**
   * Validate updated data quality
   */
  public static validateUpdatedData(brokers: any[]): {
    isValid: boolean;
    issues: string[];
    recommendations: string[];
  } {
    const issues: string[] = [];
    const recommendations: string[] = [];
    
    brokers.forEach((broker, index) => {
      const brokerName = broker.name || `Broker ${index + 1}`;
      
      // Check for missing essential data
      if (!broker.name) issues.push(`${brokerName}: Missing name`);
      if (!broker.regulation || broker.regulation.length === 0) {
        issues.push(`${brokerName}: Missing regulation information`);
      }
      if (!broker.minDeposit && broker.minDeposit !== 0) {
        issues.push(`${brokerName}: Missing minimum deposit`);
      }
      if (!broker.spreads || !broker.spreads.EUR_USD) {
        issues.push(`${brokerName}: Missing spread information`);
      }
      
      // Check for data quality issues
      if (broker.spreads && broker.spreads.EUR_USD > 3.0) {
        issues.push(`${brokerName}: Unusually high EUR/USD spread (${broker.spreads.EUR_USD})`);
      }
      if (broker.minDeposit > 5000) {
        issues.push(`${brokerName}: Very high minimum deposit ($${broker.minDeposit})`);
      }
      
      // Generate recommendations
      if (!broker.description || broker.description.length < 50) {
        recommendations.push(`${brokerName}: Add detailed description`);
      }
      if (!broker.pros || broker.pros.length === 0) {
        recommendations.push(`${brokerName}: Add pros/advantages`);
      }
      if (!broker.cons || broker.cons.length === 0) {
        recommendations.push(`${brokerName}: Add cons/disadvantages`);
      }
    });
    
    return {
      isValid: issues.length === 0,
      issues,
      recommendations
    };
  }

  /**
   * Create backup of existing data before update
   */
  public static createBackup(dataFilePath: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = dataFilePath.replace('.json', `_backup_${timestamp}.json`);
    
    try {
      const data = readFileSync(dataFilePath, 'utf8');
      writeFileSync(backupPath, data, 'utf8');
      console.log(`💾 Backup created: ${backupPath}`);
      return backupPath;
    } catch (error) {
      console.error('Error creating backup:', error);
      throw error;
    }
  }

  /**
   * Main update function with safety checks
   */
  public static safeUpdateBrokerData(dataFilePath: string): void {
    try {
      // Create backup first
      console.log('📦 Creating backup...');
      const backupPath = this.createBackup(dataFilePath);
      
      // Perform update
      this.updateBrokerDatabase(dataFilePath);
      
      // Validate results
      console.log('🔍 Validating updated data...');
      const updatedBrokers = this.loadExistingBrokerData(dataFilePath);
      const validation = this.validateUpdatedData(updatedBrokers);
      
      if (validation.isValid) {
        console.log('✅ Data validation passed!');
      } else {
        console.log('⚠️  Data validation found issues:');
        validation.issues.forEach(issue => console.log(`  - ${issue}`));
        
        if (validation.recommendations.length > 0) {
          console.log('\n💡 Recommendations:');
          validation.recommendations.forEach(rec => console.log(`  - ${rec}`));
        }
      }
      
      console.log('\n🎉 Broker data update completed successfully!');
      console.log(`📁 Backup available at: ${backupPath}`);
      
    } catch (error) {
      console.error('❌ Error during broker data update:', error);
      throw error;
    }
  }
}

// Script execution (if run directly)
if (require.main === module) {
  const dataFilePath = process.argv[2] || './data/brokers.json';
  
  console.log('🚀 Starting Broker Data Update...');
  console.log(`📁 Target file: ${dataFilePath}`);
  
  BrokerDataUpdater.safeUpdateBrokerData(dataFilePath);
}