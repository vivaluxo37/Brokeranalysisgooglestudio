/**
 * Phase 2 Enhanced Brokers Validation Script
 * Validates the 6 enhanced brokers for data completeness and accuracy
 */

const fs = require('fs');
const path = require('path');

// Read and parse the brokers data
const brokersFilePath = path.join(__dirname, '..', 'data', 'brokers.ts');
const brokersContent = fs.readFileSync(brokersFilePath, 'utf8');

// Extract brokers array (simple regex approach)
const brokersMatch = brokersContent.match(/export const brokers = (\[[\s\S]*\]);/);
if (!brokersMatch) {
    console.error('Could not parse brokers data');
    process.exit(1);
}

// Phase 2 broker IDs to validate
const phase2Brokers = ['ig', 'saxo-bank', 'ic-markets', 'xm', 'oanda', 'fxcm'];

console.log('🔍 PHASE 2 ENHANCED BROKERS VALIDATION');
console.log('======================================');

// Count brokers found
const brokerMatches = brokersContent.match(/id: '(ig|saxo-bank|ic-markets|xm|oanda|fxcm)'/g) || [];
const foundBrokers = brokerMatches.map(match => match.replace(/id: '([^']+)'/, '$1'));

console.log(`✅ Found ${foundBrokers.length}/6 Phase 2 brokers in data file`);

// Validation checks
const validationChecks = [
    { name: 'Regulatory License Numbers', pattern: /licenseNumber: '[^']+'/g },
    { name: 'Enhanced Headquarters', pattern: /headquarters: '[^']{30,}'/g },
    { name: 'Detailed Spreads', pattern: /averageSpreads: \[[^\]]+\]/g },
    { name: 'Complete Platform Lists', pattern: /platforms: \[[^\]]+\]/g },
    { name: 'Updated Instrument Counts', pattern: /total: \d{3,}/g }
];

validationChecks.forEach(check => {
    const matches = brokersContent.match(check.pattern);
    const count = matches ? matches.length : 0;
    console.log(`${count >= 6 ? '✅' : '⚠️'} ${check.name}: ${count} instances found`);
});

// Specific enhancements check
const specificEnhancements = [
    { name: 'IG Group LSE Mention', pattern: /LSE: IGG/ },
    { name: 'Saxo Bank Client Assets', pattern: /\$90B\+/ },
    { name: 'IC Markets ECN Liquidity', pattern: /50\+ tier-1/ },
    { name: 'XM Group Global Reach', pattern: /190\+ countries/ },
    { name: 'OANDA API Leadership', pattern: /API leadership/ },
    { name: 'FXCM Stock CFDs', pattern: /4,400\+/ }
];

console.log('\n📊 SPECIFIC ENHANCEMENTS VERIFICATION:');
specificEnhancements.forEach(enhancement => {
    const found = enhancement.pattern.test(brokersContent);
    console.log(`${found ? '✅' : '❌'} ${enhancement.name}: ${found ? 'Found' : 'Missing'}`);
});

// Summary
const totalChecks = validationChecks.length + specificEnhancements.length;
const passedChecks = validationChecks.filter(check => (brokersContent.match(check.pattern) || []).length >= 6).length + 
                   specificEnhancements.filter(enhancement => enhancement.pattern.test(brokersContent)).length;

console.log('\n🎯 VALIDATION SUMMARY:');
console.log(`✅ Passed: ${passedChecks}/${totalChecks} checks`);
console.log(`📈 Success Rate: ${Math.round((passedChecks/totalChecks) * 100)}%`);

if (passedChecks === totalChecks) {
    console.log('🏆 ALL VALIDATIONS PASSED - Phase 2 enhancements successfully applied!');
} else {
    console.log('⚠️ Some validations failed - review needed');
}

console.log('\n✅ Phase 2 Validation Complete');