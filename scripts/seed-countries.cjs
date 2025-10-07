const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY
);

// Country data from the migration script
const countries = [
  { code: 'US', name: 'United States', region: 'North America', currency: 'USD', languages: ['en'], regulatory_authority: 'NFA/CFTC', trading_popularity: 1 },
  { code: 'GB', name: 'United Kingdom', region: 'Europe', currency: 'GBP', languages: ['en'], regulatory_authority: 'FCA', trading_popularity: 2 },
  { code: 'DE', name: 'Germany', region: 'Europe', currency: 'EUR', languages: ['de', 'en'], regulatory_authority: 'BaFin', trading_popularity: 3 },
  { code: 'FR', name: 'France', region: 'Europe', currency: 'EUR', languages: ['fr', 'en'], regulatory_authority: 'AMF', trading_popularity: 4 },
  { code: 'IT', name: 'Italy', region: 'Europe', currency: 'EUR', languages: ['it', 'en'], regulatory_authority: 'CONSOB', trading_popularity: 5 },
  { code: 'ES', name: 'Spain', region: 'Europe', currency: 'EUR', languages: ['es', 'en'], regulatory_authority: 'CNMV', trading_popularity: 6 },
  { code: 'NL', name: 'Netherlands', region: 'Europe', currency: 'EUR', languages: ['nl', 'en'], regulatory_authority: 'AFM', trading_popularity: 7 },
  { code: 'SE', name: 'Sweden', region: 'Europe', currency: 'SEK', languages: ['sv', 'en'], regulatory_authority: 'Finansinspektionen', trading_popularity: 8 },
  { code: 'NO', name: 'Norway', region: 'Europe', currency: 'NOK', languages: ['no', 'en'], regulatory_authority: 'Finanstilsynet', trading_popularity: 9 },
  { code: 'DK', name: 'Denmark', region: 'Europe', currency: 'DKK', languages: ['da', 'en'], regulatory_authority: 'FSA', trading_popularity: 10 },
  { code: 'FI', name: 'Finland', region: 'Europe', currency: 'EUR', languages: ['fi', 'en'], regulatory_authority: 'FIN-FSA', trading_popularity: 11 },
  { code: 'AT', name: 'Austria', region: 'Europe', currency: 'EUR', languages: ['de', 'en'], regulatory_authority: 'FMA', trading_popularity: 12 },
  { code: 'BE', name: 'Belgium', region: 'Europe', currency: 'EUR', languages: ['nl', 'fr', 'en'], regulatory_authority: 'FSMA', trading_popularity: 13 },
  { code: 'IE', name: 'Ireland', region: 'Europe', currency: 'EUR', languages: ['en', 'ga'], regulatory_authority: 'CBI', trading_popularity: 14 },
  { code: 'PT', name: 'Portugal', region: 'Europe', currency: 'EUR', languages: ['pt', 'en'], regulatory_authority: 'CMVM', trading_popularity: 15 },
  { code: 'GR', name: 'Greece', region: 'Europe', currency: 'EUR', languages: ['el', 'en'], regulatory_authority: 'HCMC', trading_popularity: 16 },
  { code: 'CH', name: 'Switzerland', region: 'Europe', currency: 'CHF', languages: ['de', 'fr', 'it', 'en'], regulatory_authority: 'FINMA', trading_popularity: 17 },
  { code: 'PL', name: 'Poland', region: 'Europe', currency: 'PLN', languages: ['pl', 'en'], regulatory_authority: 'KNF', trading_popularity: 18 },
  { code: 'CZ', name: 'Czech Republic', region: 'Europe', currency: 'CZK', languages: ['cs', 'en'], regulatory_authority: 'CNB', trading_popularity: 19 },
  { code: 'HU', name: 'Hungary', region: 'Europe', currency: 'HUF', languages: ['hu', 'en'], regulatory_authority: 'MNB', trading_popularity: 20 },
  { code: 'RO', name: 'Romania', region: 'Europe', currency: 'RON', languages: ['ro', 'en'], regulatory_authority: 'FSA', trading_popularity: 21 },
  { code: 'BG', name: 'Bulgaria', region: 'Europe', currency: 'BGN', languages: ['bg', 'en'], regulatory_authority: 'FSC', trading_popularity: 22 },
  { code: 'HR', name: 'Croatia', region: 'Europe', currency: 'HRK', languages: ['hr', 'en'], regulatory_authority: 'HANFA', trading_popularity: 23 },
  { code: 'SI', name: 'Slovenia', region: 'Europe', currency: 'EUR', languages: ['sl', 'en'], regulatory_authority: 'ATVP', trading_popularity: 24 },
  { code: 'SK', name: 'Slovakia', region: 'Europe', currency: 'EUR', languages: ['sk', 'en'], regulatory_authority: 'NBS', trading_popularity: 25 },
  { code: 'EE', name: 'Estonia', region: 'Europe', currency: 'EUR', languages: ['et', 'en'], regulatory_authority: 'FI', trading_popularity: 26 },
  { code: 'LV', name: 'Latvia', region: 'Europe', currency: 'EUR', languages: ['lv', 'en'], regulatory_authority: 'FC', trading_popularity: 27 },
  { code: 'LT', name: 'Lithuania', region: 'Europe', currency: 'EUR', languages: ['lt', 'en'], regulatory_authority: 'LB', trading_popularity: 28 },
  { code: 'CY', name: 'Cyprus', region: 'Europe', currency: 'EUR', languages: ['el', 'en', 'tr'], regulatory_authority: 'CySEC', trading_popularity: 29 },
  { code: 'MT', name: 'Malta', region: 'Europe', currency: 'EUR', languages: ['mt', 'en'], regulatory_authority: 'MFSA', trading_popularity: 30 },
  { code: 'LU', name: 'Luxembourg', region: 'Europe', currency: 'EUR', languages: ['fr', 'de', 'en'], regulatory_authority: 'CSSF', trading_popularity: 31 },
  { code: 'CA', name: 'Canada', region: 'North America', currency: 'CAD', languages: ['en', 'fr'], regulatory_authority: 'CIRO', trading_popularity: 32 },
  { code: 'AU', name: 'Australia', region: 'Oceania', currency: 'AUD', languages: ['en'], regulatory_authority: 'ASIC', trading_popularity: 33 },
  { code: 'NZ', name: 'New Zealand', region: 'Oceania', currency: 'NZD', languages: ['en'], regulatory_authority: 'FMA', trading_popularity: 34 },
  { code: 'JP', name: 'Japan', region: 'Asia', currency: 'JPY', languages: ['ja'], regulatory_authority: 'FSA', trading_popularity: 35 },
  { code: 'SG', name: 'Singapore', region: 'Asia', currency: 'SGD', languages: ['en'], regulatory_authority: 'MAS', trading_popularity: 36 },
  { code: 'HK', name: 'Hong Kong', region: 'Asia', currency: 'HKD', languages: ['zh', 'en'], regulatory_authority: 'SFC', trading_popularity: 37 },
  { code: 'CN', name: 'China', region: 'Asia', currency: 'CNY', languages: ['zh'], regulatory_authority: 'CSRC', trading_popularity: 38 },
  { code: 'IN', name: 'India', region: 'Asia', currency: 'INR', languages: ['hi', 'en'], regulatory_authority: 'SEBI', trading_popularity: 39 },
  { code: 'ID', name: 'Indonesia', region: 'Asia', currency: 'IDR', languages: ['id', 'en'], regulatory_authority: 'Bappebti', trading_popularity: 40 },
  { code: 'MY', name: 'Malaysia', region: 'Asia', currency: 'MYR', languages: ['ms', 'en'], regulatory_authority: 'SC', trading_popularity: 41 },
  { code: 'TH', name: 'Thailand', region: 'Asia', currency: 'THB', languages: ['th', 'en'], regulatory_authority: 'SEC', trading_popularity: 42 },
  { code: 'PH', name: 'Philippines', region: 'Asia', currency: 'PHP', languages: ['tl', 'en'], regulatory_authority: 'SEC', trading_popularity: 43 },
  { code: 'VN', name: 'Vietnam', region: 'Asia', currency: 'VND', languages: ['vi', 'en'], regulatory_authority: 'SSC', trading_popularity: 44 },
  { code: 'KH', name: 'Cambodia', region: 'Asia', currency: 'KHR', languages: ['km', 'en'], regulatory_authority: 'SECC', trading_popularity: 45 },
  { code: 'LA', name: 'Laos', region: 'Asia', currency: 'LAK', languages: ['lo', 'en'], regulatory_authority: 'BOL', trading_popularity: 46 },
  { code: 'MM', name: 'Myanmar', region: 'Asia', currency: 'MMK', languages: ['my', 'en'], regulatory_authority: 'SECC', trading_popularity: 47 },
  { code: 'BD', name: 'Bangladesh', region: 'Asia', currency: 'BDT', languages: ['bn', 'en'], regulatory_authority: 'BSEC', trading_popularity: 48 },
  { code: 'LK', name: 'Sri Lanka', region: 'Asia', currency: 'LKR', languages: ['si', 'ta', 'en'], regulatory_authority: 'SEC', trading_popularity: 49 },
  { code: 'PK', name: 'Pakistan', region: 'Asia', currency: 'PKR', languages: ['ur', 'en'], regulatory_authority: 'SECP', trading_popularity: 50 },
  { code: 'AE', name: 'United Arab Emirates', region: 'Middle East', currency: 'AED', languages: ['ar', 'en'], regulatory_authority: 'SCA', trading_popularity: 51 },
  { code: 'SA', name: 'Saudi Arabia', region: 'Middle East', currency: 'SAR', languages: ['ar', 'en'], regulatory_authority: 'CMA', trading_popularity: 52 },
  { code: 'QA', name: 'Qatar', region: 'Middle East', currency: 'QAR', languages: ['ar', 'en'], regulatory_authority: 'QFCRA', trading_popularity: 53 },
  { code: 'KW', name: 'Kuwait', region: 'Middle East', currency: 'KWD', languages: ['ar', 'en'], regulatory_authority: 'CMA', trading_popularity: 54 },
  { code: 'BH', name: 'Bahrain', region: 'Middle East', currency: 'BHD', languages: ['ar', 'en'], regulatory_authority: 'CBB', trading_popularity: 55 },
  { code: 'OM', name: 'Oman', region: 'Middle East', currency: 'OMR', languages: ['ar', 'en'], regulatory_authority: 'CMA', trading_popularity: 56 },
  { code: 'JO', name: 'Jordan', region: 'Middle East', currency: 'JOD', languages: ['ar', 'en'], regulatory_authority: 'JSC', trading_popularity: 57 },
  { code: 'IL', name: 'Israel', region: 'Middle East', currency: 'ILS', languages: ['he', 'ar', 'en'], regulatory_authority: 'ISA', trading_popularity: 58 },
  { code: 'TR', name: 'Turkey', region: 'Middle East', currency: 'TRY', languages: ['tr', 'en'], regulatory_authority: 'CMB', trading_popularity: 59 },
  { code: 'EG', name: 'Egypt', region: 'Middle East', currency: 'EGP', languages: ['ar', 'en'], regulatory_authority: 'FRA', trading_popularity: 60 },
  { code: 'ZA', name: 'South Africa', region: 'Africa', currency: 'ZAR', languages: ['en', 'af', 'zu'], regulatory_authority: 'FSCA', trading_popularity: 61 },
  { code: 'NG', name: 'Nigeria', region: 'Africa', currency: 'NGN', languages: ['en', 'ha', 'yo', 'ig'], regulatory_authority: 'SEC', trading_popularity: 62 },
  { code: 'KE', name: 'Kenya', region: 'Africa', currency: 'KES', languages: ['en', 'sw'], regulatory_authority: 'CMA', trading_popularity: 63 },
  { code: 'GH', name: 'Ghana', region: 'Africa', currency: 'GHS', languages: ['en'], regulatory_authority: 'SEC', trading_popularity: 64 },
  { code: 'MA', name: 'Morocco', region: 'Africa', currency: 'MAD', languages: ['ar', 'fr', 'en'], regulatory_authority: 'AMMC', trading_popularity: 65 },
  { code: 'TN', name: 'Tunisia', region: 'Africa', currency: 'TND', languages: ['ar', 'fr', 'en'], regulatory_authority: 'CMF', trading_popularity: 66 },
  { code: 'BR', name: 'Brazil', region: 'South America', currency: 'BRL', languages: ['pt'], regulatory_authority: 'CVM', trading_popularity: 67 },
  { code: 'AR', name: 'Argentina', region: 'South America', currency: 'ARS', languages: ['es'], regulatory_authority: 'CNV', trading_popularity: 68 },
  { code: 'CL', name: 'Chile', region: 'South America', currency: 'CLP', languages: ['es'], regulatory_authority: 'CMF', trading_popularity: 69 },
  { code: 'CO', name: 'Colombia', region: 'South America', currency: 'COP', languages: ['es'], regulatory_authority: 'SFC', trading_popularity: 70 },
  { code: 'PE', name: 'Peru', region: 'South America', currency: 'PEN', languages: ['es'], regulatory_authority: 'SMV', trading_popularity: 71 },
  { code: 'MX', name: 'Mexico', region: 'North America', currency: 'MXN', languages: ['es'], regulatory_authority: 'CNBV', trading_popularity: 72 },
  { code: 'RU', name: 'Russia', region: 'Europe/Asia', currency: 'RUB', languages: ['ru'], regulatory_authority: 'CBR', trading_popularity: 73 },
  { code: 'KZ', name: 'Kazakhstan', region: 'Asia', currency: 'KZT', languages: ['kk', 'ru'], regulatory_authority: 'AFSA', trading_popularity: 74 },
  { code: 'UZ', name: 'Uzbekistan', region: 'Asia', currency: 'UZS', languages: ['uz', 'ru'], regulatory_authority: 'CRR', trading_popularity: 75 }
];

async function seedCountries() {
  try {
    console.log('🌱 Seeding countries data...');

    // Insert countries in batches to avoid timeout
    const batchSize = 10;
    let insertedCount = 0;

    for (let i = 0; i < countries.length; i += batchSize) {
      const batch = countries.slice(i, i + batchSize);

      const { data, error } = await supabase
        .from('countries')
        .upsert(batch, { onConflict: 'code' })
        .select();

      if (error) {
        console.error('❌ Error inserting batch', i + 1, ':', error);
      } else {
        insertedCount += data?.length || 0;
        console.log(`✅ Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(countries.length/batchSize)}`);
      }
    }

    console.log(`✅ Successfully seeded ${insertedCount} countries`);

    // Verify the data
    const { count, error: countError } = await supabase
      .from('countries')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error counting countries:', countError);
    } else {
      console.log(`✅ Total countries in database: ${count}`);
    }

  } catch (error) {
    console.error('❌ Error seeding countries:', error);
  }
}

if (require.main === module) {
  seedCountries();
}

module.exports = { seedCountries };