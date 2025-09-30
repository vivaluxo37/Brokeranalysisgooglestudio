import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
);

// All countries from the requirements with additional data
const COUNTRIES = [
  // Africa
  { slug: 'lesotho-2025', name: 'Lesotho', iso2: 'LS', iso3: 'LSO', flag_emoji: '🇱🇸', region: 'Africa', population: 2142249 },
  { slug: 'botswana-2025', name: 'Botswana', iso2: 'BW', iso3: 'BWA', flag_emoji: '🇧🇼', region: 'Africa', population: 2397241 },
  { slug: 'namibia-2025', name: 'Namibia', iso2: 'NA', iso3: 'NAM', flag_emoji: '🇳🇦', region: 'Africa', population: 2540905 },
  { slug: 'kenya-2025', name: 'Kenya', iso2: 'KE', iso3: 'KEN', flag_emoji: '🇰🇪', region: 'Africa', population: 53771296 },
  { slug: 'nigeria-2025', name: 'Nigeria', iso2: 'NG', iso3: 'NGA', flag_emoji: '🇳🇬', region: 'Africa', population: 218541212 },
  { slug: 'zimbabwe-2025', name: 'Zimbabwe', iso2: 'ZW', iso3: 'ZWE', flag_emoji: '🇿🇼', region: 'Africa', population: 14862924 },
  { slug: 'south-africa-2025', name: 'South Africa', iso2: 'ZA', iso3: 'ZAF', flag_emoji: '🇿🇦', region: 'Africa', population: 59308690 },
  { slug: 'somalia-2025', name: 'Somalia', iso2: 'SO', iso3: 'SOM', flag_emoji: '🇸🇴', region: 'Africa', population: 15893222 },
  { slug: 'ethiopia-2025', name: 'Ethiopia', iso2: 'ET', iso3: 'ETH', flag_emoji: '🇪🇹', region: 'Africa', population: 117876227 },
  { slug: 'rwanda-2025', name: 'Rwanda', iso2: 'RW', iso3: 'RWA', flag_emoji: '🇷🇼', region: 'Africa', population: 12952218 },
  { slug: 'uganda-2025', name: 'Uganda', iso2: 'UG', iso3: 'UGA', flag_emoji: '🇺🇬', region: 'Africa', population: 45741007 },
  { slug: 'tanzania-2025', name: 'Tanzania', iso2: 'TZ', iso3: 'TZA', flag_emoji: '🇹🇿', region: 'Africa', population: 59734218 },
  { slug: 'zambia-2025', name: 'Zambia', iso2: 'ZM', iso3: 'ZMB', flag_emoji: '🇿🇲', region: 'Africa', population: 18383955 },
  { slug: 'ghana-2025', name: 'Ghana', iso2: 'GH', iso3: 'GHA', flag_emoji: '🇬🇭', region: 'Africa', population: 31072940 },
  { slug: 'algeria-2025', name: 'Algeria', iso2: 'DZ', iso3: 'DZA', flag_emoji: '🇩🇿', region: 'Africa', population: 43851044 },
  { slug: 'morocco-2025', name: 'Morocco', iso2: 'MA', iso3: 'MAR', flag_emoji: '🇲🇦', region: 'Africa', population: 36910560 },
  { slug: 'tunisia-2025', name: 'Tunisia', iso2: 'TN', iso3: 'TUN', flag_emoji: '🇹🇳', region: 'Africa', population: 11818619 },
  { slug: 'egypt-2025', name: 'Egypt', iso2: 'EG', iso3: 'EGY', flag_emoji: '🇪🇬', region: 'Africa', population: 102334404 },

  // Asia
  { slug: 'brunei-2025', name: 'Brunei', iso2: 'BN', iso3: 'BRN', flag_emoji: '🇧🇳', region: 'Asia', population: 437479 },
  { slug: 'malaysia-2025', name: 'Malaysia', iso2: 'MY', iso3: 'MYS', flag_emoji: '🇲🇾', region: 'Asia', population: 32365999 },
  { slug: 'afghanistan-2025', name: 'Afghanistan', iso2: 'AF', iso3: 'AFG', flag_emoji: '🇦🇫', region: 'Asia', population: 38928346 },
  { slug: 'singapore-2025', name: 'Singapore', iso2: 'SG', iso3: 'SGP', flag_emoji: '🇸🇬', region: 'Asia', population: 5850342 },
  { slug: 'indonesia-2025', name: 'Indonesia', iso2: 'ID', iso3: 'IDN', flag_emoji: '🇮🇩', region: 'Asia', population: 273523615 },
  { slug: 'cambodia-2025', name: 'Cambodia', iso2: 'KH', iso3: 'KHM', flag_emoji: '🇰🇭', region: 'Asia', population: 16718965 },
  { slug: 'laos-2025', name: 'Laos', iso2: 'LA', iso3: 'LAO', flag_emoji: '🇱🇦', region: 'Asia', population: 7275560 },
  { slug: 'pakistan-2025', name: 'Pakistan', iso2: 'PK', iso3: 'PAK', flag_emoji: '🇵🇰', region: 'Asia', population: 220892340 },
  { slug: 'lebanon-2025', name: 'Lebanon', iso2: 'LB', iso3: 'LBN', flag_emoji: '🇱🇧', region: 'Asia', population: 6825445 },
  { slug: 'syria-2025', name: 'Syria', iso2: 'SY', iso3: 'SYR', flag_emoji: '🇸🇾', region: 'Asia', population: 17500658 },
  { slug: 'qatar-2025', name: 'Qatar', iso2: 'QA', iso3: 'QAT', flag_emoji: '🇶🇦', region: 'Asia', population: 2881053 },
  { slug: 'sri-lanka-2025', name: 'Sri Lanka', iso2: 'LK', iso3: 'LKA', flag_emoji: '🇱🇰', region: 'Asia', population: 21413249 },
  { slug: 'nepal-2025', name: 'Nepal', iso2: 'NP', iso3: 'NPL', flag_emoji: '🇳🇵', region: 'Asia', population: 29136808 },
  { slug: 'bangladesh-2025', name: 'Bangladesh', iso2: 'BD', iso3: 'BGD', flag_emoji: '🇧🇩', region: 'Asia', population: 164689383 },
  { slug: 'iraq-2025', name: 'Iraq', iso2: 'IQ', iso3: 'IRQ', flag_emoji: '🇮🇶', region: 'Asia', population: 40222493 },
  { slug: 'south-korea-2025', name: 'South Korea', iso2: 'KR', iso3: 'KOR', flag_emoji: '🇰🇷', region: 'Asia', population: 51269185 },
  { slug: 'india-2025', name: 'India', iso2: 'IN', iso3: 'IND', flag_emoji: '🇮🇳', region: 'Asia', population: 1380004385 },
  { slug: 'jordan-2025', name: 'Jordan', iso2: 'JO', iso3: 'JOR', flag_emoji: '🇯🇴', region: 'Asia', population: 10203134 },
  { slug: 'thailand-2025', name: 'Thailand', iso2: 'TH', iso3: 'THA', flag_emoji: '🇹🇭', region: 'Asia', population: 69799978 },
  { slug: 'philippines-2025', name: 'Philippines', iso2: 'PH', iso3: 'PHL', flag_emoji: '🇵🇭', region: 'Asia', population: 109581078 },
  { slug: 'uzbekistan-2025', name: 'Uzbekistan', iso2: 'UZ', iso3: 'UZB', flag_emoji: '🇺🇿', region: 'Asia', population: 33469203 },
  { slug: 'vietnam-2025', name: 'Vietnam', iso2: 'VN', iso3: 'VNM', flag_emoji: '🇻🇳', region: 'Asia', population: 97338579 },
  { slug: 'saudi-arabia-2025', name: 'Saudi Arabia', iso2: 'SA', iso3: 'SAU', flag_emoji: '🇸🇦', region: 'Asia', population: 34813871 },
  { slug: 'israel-2025', name: 'Israel', iso2: 'IL', iso3: 'ISR', flag_emoji: '🇮🇱', region: 'Asia', population: 8655535 },
  { slug: 'taiwan-2025', name: 'Taiwan', iso2: 'TW', iso3: 'TWN', flag_emoji: '🇹🇼', region: 'Asia', population: 23816775 },
  { slug: 'iran-2025', name: 'Iran', iso2: 'IR', iso3: 'IRN', flag_emoji: '🇮🇷', region: 'Asia', population: 83992949 },
  { slug: 'united-arab-emirates-2025', name: 'United Arab Emirates', iso2: 'AE', iso3: 'ARE', flag_emoji: '🇦🇪', region: 'Asia', population: 9890402 },
  { slug: 'hong-kong-2025', name: 'Hong Kong', iso2: 'HK', iso3: 'HKG', flag_emoji: '🇭🇰', region: 'Asia', population: 7496981 },

  // Europe
  { slug: 'st-helena-2025', name: 'St. Helena', iso2: 'SH', iso3: 'SHN', flag_emoji: '🇸🇭', region: 'Europe', population: 6077 },
  { slug: 'cyprus-2025', name: 'Cyprus', iso2: 'CY', iso3: 'CYP', flag_emoji: '🇨🇾', region: 'Europe', population: 1207359 },
  { slug: 'united-kingdom-2025', name: 'United Kingdom', iso2: 'GB', iso3: 'GBR', flag_emoji: '🇬🇧', region: 'Europe', population: 67886011 },
  { slug: 'bulgaria-2025', name: 'Bulgaria', iso2: 'BG', iso3: 'BGR', flag_emoji: '🇧🇬', region: 'Europe', population: 6948445 },
  { slug: 'netherlands-2025', name: 'Netherlands', iso2: 'NL', iso3: 'NLD', flag_emoji: '🇳🇱', region: 'Europe', population: 17134872 },
  { slug: 'ireland-2025', name: 'Ireland', iso2: 'IE', iso3: 'IRL', flag_emoji: '🇮🇪', region: 'Europe', population: 4937786 },
  { slug: 'romania-2025', name: 'Romania', iso2: 'RO', iso3: 'ROU', flag_emoji: '🇷🇴', region: 'Europe', population: 19237691 },
  { slug: 'belgium-2025', name: 'Belgium', iso2: 'BE', iso3: 'BEL', flag_emoji: '🇧🇪', region: 'Europe', population: 11589623 },
  { slug: 'austria-2025', name: 'Austria', iso2: 'AT', iso3: 'AUT', flag_emoji: '🇦🇹', region: 'Europe', population: 9006398 },
  { slug: 'russia-2025', name: 'Russia', iso2: 'RU', iso3: 'RUS', flag_emoji: '🇷🇺', region: 'Europe', population: 145934462 },
  { slug: 'italy-2025', name: 'Italy', iso2: 'IT', iso3: 'ITA', flag_emoji: '🇮🇹', region: 'Europe', population: 60461826 },
  { slug: 'germany-2025', name: 'Germany', iso2: 'DE', iso3: 'DEU', flag_emoji: '🇩🇪', region: 'Europe', population: 83783942 },
  { slug: 'spain-2025', name: 'Spain', iso2: 'ES', iso3: 'ESP', flag_emoji: '🇪🇸', region: 'Europe', population: 46754778 },
  { slug: 'czechia-2025', name: 'Czechia', iso2: 'CZ', iso3: 'CZE', flag_emoji: '🇨🇿', region: 'Europe', population: 10708981 },
  { slug: 'sweden-2025', name: 'Sweden', iso2: 'SE', iso3: 'SWE', flag_emoji: '🇸🇪', region: 'Europe', population: 10099265 },
  { slug: 'poland-2025', name: 'Poland', iso2: 'PL', iso3: 'POL', flag_emoji: '🇵🇱', region: 'Europe', population: 37846611 },
  { slug: 'greece-2025', name: 'Greece', iso2: 'GR', iso3: 'GRC', flag_emoji: '🇬🇷', region: 'Europe', population: 10423054 },
  { slug: 'portugal-2025', name: 'Portugal', iso2: 'PT', iso3: 'PRT', flag_emoji: '🇵🇹', region: 'Europe', population: 10196709 },
  { slug: 'hungary-2025', name: 'Hungary', iso2: 'HU', iso3: 'HUN', flag_emoji: '🇭🇺', region: 'Europe', population: 9660351 },
  { slug: 'france-2025', name: 'France', iso2: 'FR', iso3: 'FRA', flag_emoji: '🇫🇷', region: 'Europe', population: 65273511 },
  { slug: 'switzerland-2025', name: 'Switzerland', iso2: 'CH', iso3: 'CHE', flag_emoji: '🇨🇭', region: 'Europe', population: 8654622 },
  { slug: 'ukraine-2025', name: 'Ukraine', iso2: 'UA', iso3: 'UKR', flag_emoji: '🇺🇦', region: 'Europe', population: 43733762 },
  { slug: 'turkey-2025', name: 'Turkey', iso2: 'TR', iso3: 'TUR', flag_emoji: '🇹🇷', region: 'Europe', population: 84339067 },

  // Americas
  { slug: 'jamaica-2025', name: 'Jamaica', iso2: 'JM', iso3: 'JAM', flag_emoji: '🇯🇲', region: 'Americas', population: 2961167 },
  { slug: 'canada-2025', name: 'Canada', iso2: 'CA', iso3: 'CAN', flag_emoji: '🇨🇦', region: 'Americas', population: 37742154 },
  { slug: 'dominican-republic-2025', name: 'Dominican Republic', iso2: 'DO', iso3: 'DOM', flag_emoji: '🇩🇴', region: 'Americas', population: 10847910 },
  { slug: 'venezuela-2025', name: 'Venezuela', iso2: 'VE', iso3: 'VEN', flag_emoji: '🇻🇪', region: 'Americas', population: 28435940 },
  { slug: 'united-states-2025', name: 'United States', iso2: 'US', iso3: 'USA', flag_emoji: '🇺🇸', region: 'Americas', population: 331002651 },
  { slug: 'ecuador-2025', name: 'Ecuador', iso2: 'EC', iso3: 'ECU', flag_emoji: '🇪🇨', region: 'Americas', population: 17643054 },
  { slug: 'colombia-2025', name: 'Colombia', iso2: 'CO', iso3: 'COL', flag_emoji: '🇨🇴', region: 'Americas', population: 50882891 },
  { slug: 'chile-2025', name: 'Chile', iso2: 'CL', iso3: 'CHL', flag_emoji: '🇨🇱', region: 'Americas', population: 19116201 },
  { slug: 'argentina-2025', name: 'Argentina', iso2: 'AR', iso3: 'ARG', flag_emoji: '🇦🇷', region: 'Americas', population: 45195774 },
  { slug: 'peru-2025', name: 'Peru', iso2: 'PE', iso3: 'PER', flag_emoji: '🇵🇪', region: 'Americas', population: 32971854 },
  { slug: 'mexico-2025', name: 'Mexico', iso2: 'MX', iso3: 'MEX', flag_emoji: '🇲🇽', region: 'Americas', population: 128932753 },
  { slug: 'brazil-2025', name: 'Brazil', iso2: 'BR', iso3: 'BRA', flag_emoji: '🇧🇷', region: 'Americas', population: 212559417 },

  // Oceania
  { slug: 'new-zealand-2025', name: 'New Zealand', iso2: 'NZ', iso3: 'NZL', flag_emoji: '🇳🇿', region: 'Oceania', population: 4822233 },
  { slug: 'australia-2025', name: 'Australia', iso2: 'AU', iso3: 'AUS', flag_emoji: '🇦🇺', region: 'Oceania', population: 25499884 }
];

/**
 * Seed countries data
 */
async function seedCountries() {
  console.log('🌱 Seeding countries...');
  
  try {
    // Insert countries in batches to avoid overwhelming the database
    const batchSize = 15;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < COUNTRIES.length; i += batchSize) {
      const batch = COUNTRIES.slice(i, i + batchSize);
      
      console.log(`📦 Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(COUNTRIES.length / batchSize)} (${batch.length} countries)...`);
      
      const { data, error } = await supabase
        .from('countries')
        .upsert(batch, { onConflict: 'slug' });

      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
        errorCount += batch.length;
      } else {
        console.log(`✅ Successfully inserted batch ${Math.floor(i / batchSize) + 1}`);
        successCount += batch.length;
      }

      // Small delay to avoid rate limiting
      if (i < COUNTRIES.length - batchSize) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }

    console.log('\n📊 SEEDING SUMMARY');
    console.log('==================');
    console.log(`✅ Successfully seeded: ${successCount} countries`);
    console.log(`❌ Failed: ${errorCount} countries`);
    console.log(`📈 Total processed: ${COUNTRIES.length} countries`);

    // Verify the seeding
    const { count, error: countError } = await supabase
      .from('countries')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('❌ Error verifying seed data:', countError.message);
    } else {
      console.log(`🎯 Total countries in database: ${count}`);
    }

    return { success: true, seeded: successCount, failed: errorCount, total: count };

  } catch (error) {
    console.error('💥 Fatal error during seeding:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Run seeding if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCountries()
    .then(result => {
      if (result.success) {
        console.log('🎉 Countries seeding completed successfully!');
        process.exit(0);
      } else {
        console.error('💥 Countries seeding failed:', result.error);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Fatal error:', error);
      process.exit(1);
    });
}

export { seedCountries, COUNTRIES };