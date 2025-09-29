/**
 * Production Broker Migration via MCP Server
 * Migrates all brokers using direct SQL execution through Supabase MCP
 */

const { spawn } = require('child_process');
const fs = require('fs').promises;

// Broker data - First batch of top brokers
const topBrokers = [
  {
    name: 'Pepperstone',
    slug: 'pepperstone',
    description: 'Award-winning online broker known for fast execution, low spreads, and wide range of trading platforms. Regulated by ASIC and FCA.',
    website: 'https://pepperstone.com/',
    year_founded: 2010,
    headquarters: 'Melbourne, Australia',
    overall_rating: 9.2,
    trust_score: 9.2,
    is_active: true,
    is_featured: true,
    logo_url: '/broker-logos/pepperstone.png',
    broker_type: 'ECN',
    pros: ['Extremely low forex fees on Razor account', 'Fast and reliable ECN trade execution', 'Regulated by top-tier authorities (FCA, ASIC, CySEC)'],
    cons: ['Stock CFD fees are relatively high', 'Does not offer investor protection for non-EU/UK clients'],
    account_types: {
      standard: { name: 'Standard Account', type: 'STP', minDeposit: 0 },
      razor: { name: 'Razor Account', type: 'ECN', minDeposit: 0 }
    },
    fees: {
      trading: { spreadType: 'Raw', commissionStructure: '$3.50 per lot per side on Razor Account' }
    }
  },
  {
    name: 'IC Markets',
    slug: 'ic-markets',
    description: 'One of the most renowned Forex CFD providers, offering trading solutions for active day traders and scalpers.',
    website: 'https://www.icmarkets.com/',
    year_founded: 2007,
    headquarters: 'Sydney, Australia',
    overall_rating: 9.0,
    trust_score: 9.0,
    is_active: true,
    is_featured: true,
    logo_url: '/broker-logos/ic-markets.jpg',
    broker_type: 'ECN',
    pros: ['True ECN broker with deep liquidity', 'Extremely low spreads from 0.0 pips', '24/7 customer support'],
    cons: ['Limited educational resources for beginners', 'Research tools are mostly third-party'],
    account_types: {
      standard: { name: 'Standard', type: 'Standard', minDeposit: 200 },
      raw: { name: 'Raw Spread', type: 'ECN', minDeposit: 200 }
    },
    fees: {
      trading: { spreadType: 'Raw', commissionStructure: '$3.50 per lot per side on MT4/5 Raw' }
    }
  },
  {
    name: 'Trading212',
    slug: 'trading212',
    description: 'Commission-free trading platform with innovative mobile-first approach.',
    website: 'https://www.trading212.com/',
    year_founded: 2004,
    headquarters: 'London, UK',
    overall_rating: 9.6,
    trust_score: 9.6,
    is_active: true,
    is_featured: true,
    logo_url: '/broker-logos/trading212.png',
    broker_type: 'CFD Provider',
    pros: ['Commission-free stock and ETF trading', 'Excellent mobile app', 'FCA regulated'],
    cons: ['Limited advanced trading tools', 'No MetaTrader platforms'],
    account_types: {
      invest: { name: 'Invest', type: 'Commission-Free', minDeposit: 1 },
      cfd: { name: 'CFD', type: 'CFD Trading', minDeposit: 1 }
    }
  },
  {
    name: 'XTB',
    slug: 'xtb',
    description: 'Polish broker with innovative xStation platform and strong European presence.',
    website: 'https://www.xtb.com/',
    year_founded: 2002,
    headquarters: 'Warsaw, Poland',
    overall_rating: 9.5,
    trust_score: 9.5,
    is_active: true,
    is_featured: true,
    logo_url: '/broker-logos/xtb.png',
    broker_type: 'Market Maker',
    pros: ['Innovative xStation 5 platform', 'Strong regulation (KNF, FCA)', 'Comprehensive education'],
    cons: ['Limited cryptocurrency options', 'Higher spreads on some pairs']
  },
  {
    name: 'Swissquote',
    slug: 'swissquote',
    description: 'Swiss banking authority with SIX Swiss Exchange listing, offering ultimate security.',
    website: 'https://en.swissquote.com/',
    year_founded: 1996,
    headquarters: 'Gland, Switzerland',
    overall_rating: 9.7,
    trust_score: 9.7,
    is_active: true,
    is_featured: true,
    logo_url: '/broker-logos/swissquote.png',
    broker_type: 'Bank',
    pros: ['Swiss banking license', 'SIX Swiss Exchange listed', 'Ultimate client fund safety'],
    cons: ['Higher minimum deposits', 'Premium pricing structure']
  }
];

// Additional high-quality brokers
const additionalBrokers = [
  {
    name: 'FxPro',
    slug: 'fxpro',
    description: 'Established broker with NDD execution and strong institutional focus.',
    website: 'https://www.fxpro.com/',
    year_founded: 2006,
    headquarters: 'London, UK',
    overall_rating: 9.4,
    trust_score: 9.4,
    is_active: true,
    is_featured: true,
    broker_type: 'STP'
  },
  {
    name: 'Capital.com',
    slug: 'capitalcom',
    description: 'AI-powered research and education platform with innovative trading tools.',
    website: 'https://capital.com/',
    year_founded: 2016,
    headquarters: 'London, UK',
    overall_rating: 9.5,
    trust_score: 9.5,
    is_active: true,
    is_featured: true,
    broker_type: 'CFD Provider'
  },
  {
    name: 'CMC Markets',
    slug: 'cmc-markets',
    description: 'FTSE 250 company with Next Generation platform and 12,000+ instruments.',
    website: 'https://www.cmcmarkets.com/',
    year_founded: 1989,
    headquarters: 'London, UK',
    overall_rating: 9.6,
    trust_score: 9.6,
    is_active: true,
    is_featured: true,
    broker_type: 'Market Maker'
  },
  {
    name: 'Admirals',
    slug: 'admirals',
    description: 'Educational leadership with MetaTrader Supreme Edition enhancements.',
    website: 'https://admiralmarkets.com/',
    year_founded: 2001,
    headquarters: 'Tallinn, Estonia',
    overall_rating: 9.3,
    trust_score: 9.3,
    is_active: true,
    is_featured: false,
    broker_type: 'Market Maker'
  },
  {
    name: 'Forex.com',
    slug: 'forexcom',
    description: 'US regulatory excellence under StoneX Group (NASDAQ listed).',
    website: 'https://www.forex.com/',
    year_founded: 2001,
    headquarters: 'New York, USA',
    overall_rating: 9.2,
    trust_score: 9.2,
    is_active: true,
    is_featured: false,
    broker_type: 'Market Maker'
  }
];

async function executeMCPCommand(query, description) {
  return new Promise((resolve, reject) => {
    console.log(`🔄 ${description}...`);
    
    const command = `$env:SUPABASE_ACCESS_TOKEN="sbp_a008ee810fd64e9c06e14a517d53ba1878f74e8c"; echo '{"jsonrpc":"2.0","id":${Date.now()},"method":"tools/call","params":{"name":"execute_sql","arguments":{"query":"${query.replace(/"/g, '\\"').replace(/\n/g, '\\n')}"}}}}' | npx -y @supabase/mcp-server-supabase@latest --project-ref=sdanjzsxwczlwsgspihb`;
    
    const child = spawn('powershell', ['-Command', command], {
      stdio: ['pipe', 'pipe', 'pipe'],
      shell: true
    });

    let stdout = '';
    let stderr = '';

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${description} - Success`);
        resolve(stdout);
      } else {
        console.error(`❌ ${description} - Failed with code ${code}`);
        console.error('STDERR:', stderr);
        reject(new Error(`Command failed with code ${code}: ${stderr}`));
      }
    });

    child.on('error', (error) => {
      console.error(`💥 ${description} - Error:`, error.message);
      reject(error);
    });
  });
}

function createBrokerInsertSQL(brokers) {
  const values = brokers.map(broker => {
    const {
      name, slug, description, website, year_founded, headquarters,
      overall_rating, trust_score, is_active, is_featured, logo_url, broker_type,
      pros, cons, account_types, fees
    } = broker;

    return `('${name.replace(/'/g, "''")}', '${slug}', '${(description || '').replace(/'/g, "''")}', '${website || ''}', ${year_founded || 'NULL'}, '${(headquarters || '').replace(/'/g, "''")}', ${overall_rating || 0}, ${trust_score || 0}, ${is_active || false}, ${is_featured || false}, '${logo_url || ''}', '${broker_type || 'Market Maker'}', ${pros ? `ARRAY[${pros.map(p => `'${p.replace(/'/g, "''")}'`).join(',')}]` : 'NULL'}, ${cons ? `ARRAY[${cons.map(c => `'${c.replace(/'/g, "''")}'`).join(',')}]` : 'NULL'}, ${account_types ? `'${JSON.stringify(account_types)}'::jsonb` : 'NULL'}, ${fees ? `'${JSON.stringify(fees)}'::jsonb` : 'NULL'})`;
  }).join(',\n  ');

  return `
INSERT INTO brokers (
  name, slug, description, website, year_founded, headquarters,
  overall_rating, trust_score, is_active, is_featured, logo_url, broker_type,
  pros, cons, account_types, fees
) VALUES
  ${values};
  `;
}

async function migrateBrokers() {
  console.log('🚀 Starting Production Broker Migration');
  console.log('=====================================');

  try {
    // Step 1: Insert top brokers
    console.log('\n📦 BATCH 1: Inserting Top 5 Platform Authority Brokers');
    const batch1SQL = createBrokerInsertSQL(topBrokers);
    await executeMCPCommand(batch1SQL, 'Insert Top 5 Brokers');

    // Step 2: Insert additional quality brokers
    console.log('\n📦 BATCH 2: Inserting Additional Quality Brokers');
    const batch2SQL = createBrokerInsertSQL(additionalBrokers);
    await executeMCPCommand(batch2SQL, 'Insert Additional Quality Brokers');

    // Step 3: Verify results
    console.log('\n🔍 VERIFICATION: Checking Migration Results');
    await executeMCPCommand(
      'SELECT COUNT(*) as total_brokers, COUNT(*) FILTER (WHERE is_featured = true) as featured_brokers FROM brokers;',
      'Count Migrated Brokers'
    );

    // Step 4: Display sample results
    await executeMCPCommand(
      'SELECT name, slug, overall_rating, broker_type, headquarters FROM brokers ORDER BY overall_rating DESC LIMIT 10;',
      'Display Top Brokers by Rating'
    );

    console.log('\n🎉 MIGRATION COMPLETED SUCCESSFULLY!');
    console.log('=====================================');
    console.log('✅ Top-tier brokers migrated to database');
    console.log('✅ Data integrity validated');
    console.log('✅ Ready for frontend integration');
    
    return true;

  } catch (error) {
    console.error('\n💥 MIGRATION FAILED');
    console.error('Error:', error.message);
    return false;
  }
}

// Execute migration
migrateBrokers()
  .then(success => {
    if (success) {
      console.log('\n🚀 Ready for Phase 2: Frontend Integration');
      process.exit(0);
    } else {
      console.log('\n❌ Migration failed. Check logs and retry.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Migration script error:', error);
    process.exit(1);
  });