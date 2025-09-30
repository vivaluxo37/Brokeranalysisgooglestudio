/**
 * Country-Broker Mappings for Best Forex Brokers Directory
 * 
 * This file maps each country to a curated list of brokers that:
 * 1. Accept clients from that country
 * 2. Comply with local regulations
 * 3. Provide appropriate payment methods and support
 * 
 * Minimum 10 brokers per country as per SEO requirements.
 * 
 * Broker selection criteria:
 * - Regulatory compatibility (FCA, ASIC, CySEC, etc.)
 * - Geographic restrictions (US, EU, etc.)
 * - Islamic account availability (Middle East)
 * - Local payment method support
 * - Language support
 */

export type CountrySlug = string;
export type BrokerId = string;

/**
 * Global brokers with widespread availability (Tier 1)
 * These brokers typically accept clients from most countries
 */
const GLOBAL_TIER_1 = [
  'pepperstone',
  'ic-markets',
  'xtb',
  'forex-com',
  'ig',
  'saxo-bank',
  'avatrade',
  'oanda',
  'fxpro',
  'axi',
  'fp-markets',
  'cmc-markets'
];

/**
 * EU-focused brokers (comply with ESMA regulations)
 */
const EU_BROKERS = [
  'xtb',
  'admirals',
  'saxo-bank',
  'swissquote',
  'dukascopy',
  'activtrades',
  'markets-com',
  'trading212',
  'capital-com',
  'freedom24'
];

/**
 * UK-focused brokers (FCA regulated)
 */
const UK_BROKERS = [
  'ig',
  'cmc-markets',
  'city-index',
  'lcg',
  'spreadex',
  'trade-nation',
  'forex-com',
  'pepperstone',
  'oanda',
  'activtrades'
];

/**
 * Asia-Pacific brokers
 */
const APAC_BROKERS = [
  'pepperstone',
  'ic-markets',
  'axi',
  'fp-markets',
  'thinkmarkets',
  'fxpro',
  'xm',
  'exness',
  'hf-markets',
  'octafx',
  'go-markets',
  'vt-markets',
  'tmgm',
  'eightcap'
];

/**
 * Middle East & Islamic brokers (swap-free accounts)
 */
const ISLAMIC_BROKERS = [
  'xm',
  'exness',
  'hf-markets',
  'fbs',
  'octafx',
  'fxpro',
  'avatrade',
  'hycm',
  'atfx',
  'multibank',
  'easymarkets',
  'fxgt'
];

/**
 * Offshore/International brokers (fewer restrictions)
 */
const OFFSHORE_BROKERS = [
  'exness',
  'xm',
  'hf-markets',
  'fbs',
  'octafx',
  'roboforex',
  'fxopen',
  'libertex',
  'instaforex',
  'fxgt',
  'puprime',
  'superforex'
];

/**
 * US-compliant brokers (NFA/CFTC regulated)
 */
const US_BROKERS = [
  'forex-com',
  'oanda',
  'interactive-brokers',
  'tastyfx',
  'ig',
  'saxo-bank'
];

/**
 * Main country-broker mapping
 * Each country gets a minimum of 10 brokers
 */
export const countryBrokerMap: Record<CountrySlug, BrokerId[]> = {
  // North America
  'united-states': [
    'forex-com',
    'oanda',
    'interactive-brokers',
    'ig',
    'tastyfx',
    'saxo-bank',
    'tradestation-global',
    'thinkorswim', // TD Ameritrade
    'nadex',
    'forex-trading'
  ],
  
  'canada': [
    'oanda',
    'forex-com',
    'interactive-brokers',
    'pepperstone',
    'ig',
    'saxo-bank',
    'cmc-markets',
    'avatrade',
    'forex-com',
    'activtrades',
    'fxpro',
    'thinkmarkets'
  ],
  
  // Western Europe
  'united-kingdom': [
    'ig',
    'cmc-markets',
    'pepperstone',
    'city-index',
    'lcg',
    'saxo-bank',
    'oanda',
    'forex-com',
    'activtrades',
    'spreadex',
    'trade-nation',
    'xtb'
  ],
  
  'germany': [
    'xtb',
    'admirals',
    'saxo-bank',
    'ig',
    'pepperstone',
    'activtrades',
    'gbe-brokers',
    'captrader',
    'trading212',
    'capital-com',
    'avatrade',
    'markets-com'
  ],
  
  'france': [
    'xtb',
    'saxo-bank',
    'ig',
    'avatrade',
    'activtrades',
    'admirals',
    'trading212',
    'capital-com',
    'markets-com',
    'libertex',
    'forex-com',
    'pepperstone'
  ],
  
  'italy': [
    'xtb',
    'avatrade',
    'ig',
    'admirals',
    'markets-com',
    'capital-com',
    'trading212',
    'libertex',
    'plus500',
    'etoro',
    'pepperstone',
    'fxpro'
  ],
  
  'spain': [
    'xtb',
    'avatrade',
    'admirals',
    'markets-com',
    'capital-com',
    'trading212',
    'plus500',
    'libertex',
    'etoro',
    'ig',
    'pepperstone',
    'activtrades'
  ],
  
  'netherlands': [
    'saxo-bank',
    'xtb',
    'ig',
    'avatrade',
    'admirals',
    'trading212',
    'capital-com',
    'plus500',
    'etoro',
    'pepperstone',
    'interactive-brokers',
    'degiro'
  ],
  
  'switzerland': [
    'saxo-bank',
    'swissquote',
    'dukascopy',
    'ig',
    'interactive-brokers',
    'cornèrtrader',
    'postfinance',
    'pepperstone',
    'activtrades',
    'xtb',
    'admirals',
    'avatrade'
  ],
  
  'sweden': [
    'saxo-bank',
    'xtb',
    'avatrade',
    'admirals',
    'capital-com',
    'trading212',
    'pepperstone',
    'ig',
    'nordnet',
    'avanza',
    'activtrades',
    'plus500'
  ],
  
  'poland': [
    'xtb',
    'admirals',
    'avatrade',
    'capital-com',
    'trading212',
    'ig',
    'saxo-bank',
    'pepperstone',
    'plus500',
    'libertex',
    'etoro',
    'fxpro'
  ],
  
  'hungary': [
    'xtb',
    'avatrade',
    'admirals',
    'capital-com',
    'trading212',
    'ig',
    'saxo-bank',
    'pepperstone',
    'plus500',
    'libertex',
    'etoro',
    'fxpro'
  ],
  
  'czechia': [
    'xtb',
    'avatrade',
    'admirals',
    'capital-com',
    'trading212',
    'saxo-bank',
    'ig',
    'pepperstone',
    'plus500',
    'libertex',
    'etoro',
    'fxpro'
  ],
  
  'turkey': [
    'xm',
    'exness',
    'hf-markets',
    'fbs',
    'octafx',
    'avatrade',
    'fxpro',
    'hycm',
    'atfx',
    'easymarkets',
    'roboforex',
    'libertex'
  ],
  
  // Southern Europe
  'portugal': [
    'xtb',
    'avatrade',
    'admiral',
    'capital-com',
    'trading212',
    'ig',
    'pepperstone',
    'plus500',
    'etoro',
    'libertex',
    'markets-com',
    'activtrades'
  ],
  
  'greece': [
    'xtb',
    'avatrade',
    'admirals',
    'capital-com',
    'trading212',
    'plus500',
    'etoro',
    'pepperstone',
    'fxpro',
    'hycm',
    'libertex',
    'xm'
  ],
  
  'cyprus': [
    'fxpro',
    'hycm',
    'hf-markets',
    'ironfx',
    'avatrade',
    'xm',
    'plus500',
    'etoro',
    'pepperstone',
    'tickmill',
    'atfx',
    'easymarkets'
  ],
  
  // Oceania
  'australia': [
    'pepperstone',
    'ic-markets',
    'fp-markets',
    'axi',
    'cmc-markets',
    'ig',
    'city-index',
    'thinkmarkets',
    'go-markets',
    'eightcap',
    'vt-markets',
    'tmgm',
    'global-prime'
  ],
  
  'new-zealand': [
    'pepperstone',
    'ic-markets',
    'fp-markets',
    'axi',
    'ig',
    'cmc-markets',
    'thinkmarkets',
    'eightcap',
    'blackbull',
    'go-markets',
    'avatrade',
    'oanda'
  ],
  
  // Asia - Major Markets
  'singapore': [
    'saxo-bank',
    'ig',
    'phillip-securities',
    'oanda',
    'interactive-brokers',
    'cmc-markets',
    'pepperstone',
    'ic-markets',
    'fp-markets',
    'exness',
    'thinkmarkets',
    'avatrade'
  ],
  
  'hong-kong': [
    'saxo-bank',
    'interactive-brokers',
    'ig',
    'pepperstone',
    'ic-markets',
    'fp-markets',
    'thinkmarkets',
    'avatrade',
    'fxpro',
    'exness',
    'hf-markets',
    'octafx'
  ],
  
  'japan': [
    'saxo-bank',
    'oanda',
    'gmo-click',
    'ig',
    'forex-com',
    'rakuten-securities',
    'sbi-securities',
    'pepperstone',
    'avatrade',
    'fxpro',
    'interactive-brokers',
    'thinkmarkets'
  ],
  
  'india': [
    'exness',
    'xm',
    'hf-markets',
    'octafx',
    'fbs',
    'ic-markets',
    'pepperstone',
    'fp-markets',
    'roboforex',
    'fxopen',
    'avatrade',
    'hycm',
    'atfx'
  ],
  
  'south-korea': [
    'saxo-bank',
    'ig',
    'pepperstone',
    'ic-markets',
    'fp-markets',
    'exness',
    'xm',
    'hf-markets',
    'avatrade',
    'thinkmarkets',
    'fxpro',
    'octafx'
  ],
  
  // Southeast Asia
  'thailand': [
    'exness',
    'xm',
    'hf-markets',
    'octafx',
    'fbs',
    'ic-markets',
    'fp-markets',
    'pepperstone',
    'avatrade',
    'fxpro',
    'roboforex',
    'easymarkets'
  ],
  
  'malaysia': [
    'exness',
    'xm',
    'hf-markets',
    'octafx',
    'fbs',
    'ic-markets',
    'pepperstone',
    'fp-markets',
    'avatrade',
    'fxpro',
    'easymarkets',
    'roboforex'
  ],
  
  'indonesia': [
    'exness',
    'xm',
    'hf-markets',
    'octafx',
    'fbs',
    'pepperstone',
    'ic-markets',
    'fp-markets',
    'avatrade',
    'fxpro',
    'roboforex',
    'fxgt'
  ],
  
  'philippines': [
    'exness',
    'xm',
    'hf-markets',
    'octafx',
    'fbs',
    'pepperstone',
    'ic-markets',
    'fp-markets',
    'avatrade',
    'fxpro',
    'easymarkets',
    'roboforex'
  ],
  
  'vietnam': [
    'exness',
    'xm',
    'hf-markets',
    'octafx',
    'fbs',
    'ic-markets',
    'pepperstone',
    'fp-markets',
    'avatrade',
    'fxpro',
    'roboforex',
    'fxgt'
  ],
  
  // Middle East
  'united-arab-emirates': [
    'exness',
    'xm',
    'hf-markets',
    'avatrade',
    'hycm',
    'atfx',
    'fxpro',
    'multibank',
    'easymarkets',
    'fxgt',
    'octafx',
    'pepperstone'
  ],
  
  'saudi-arabia': [
    'exness',
    'xm',
    'hf-markets',
    'avatrade',
    'hycm',
    'atfx',
    'fxpro',
    'multibank',
    'easymarkets',
    'octafx',
    'fbs',
    'fxgt'
  ],
  
  'egypt': [
    'exness',
    'xm',
    'hf-markets',
    'octafx',
    'fbs',
    'avatrade',
    'hycm',
    'fxpro',
    'atfx',
    'easymarkets',
    'roboforex',
    'fxgt'
  ],
  
  'iran': [
    'exness',
    'fxgt',
    'roboforex',
    'fxopen',
    'nordfx',
    'amarkets',
    'freshforex',
    'instaforex',
    'octafx',
    'alpari'
  ],
  
  // Africa
  'south-africa': [
    'pepperstone',
    'ic-markets',
    'fp-markets',
    'avatrade',
    'hycm',
    'hf-markets',
    'exness',
    'xm',
    'fxpro',
    'thinkmarkets',
    'octafx',
    'easymarkets'
  ],
  
  'nigeria': [
    'exness',
    'xm',
    'hf-markets',
    'octafx',
    'fbs',
    'roboforex',
    'fxpro',
    'avatrade',
    'hycm',
    'atfx',
    'easymarkets',
    'fxgt'
  ],
  
  'kenya': [
    'exness',
    'xm',
    'hf-markets',
    'octafx',
    'fbs',
    'avatrade',
    'hycm',
    'fxpro',
    'roboforex',
    'easymarkets',
    'atfx',
    'fxgt'
  ],
  
  // Latin America
  'brazil': [
    'avatrade',
    'xm',
    'exness',
    'hf-markets',
    'fbs',
    'octafx',
    'roboforex',
    'fxpro',
    'ic-markets',
    'pepperstone',
    'easymarkets',
    'libertex'
  ],
  
  'mexico': [
    'avatrade',
    'xm',
    'exness',
    'hf-markets',
    'fbs',
    'octafx',
    'fxpro',
    'roboforex',
    'easymarkets',
    'libertex',
    'pepperstone',
    'ic-markets'
  ],
  
  'argentina': [
    'xm',
    'exness',
    'hf-markets',
    'fbs',
    'octafx',
    'avatrade',
    'roboforex',
    'fxpro',
    'easymarkets',
    'libertex',
    'fxgt',
    'instaforex'
  ],
  
  'chile': [
    'avatrade',
    'xm',
    'exness',
    'hf-markets',
    'fbs',
    'octafx',
    'roboforex',
    'fxpro',
    'easymarkets',
    'libertex',
    'ic-markets',
    'pepperstone'
  ],
  
  // Eastern Europe
  'russia': [
    'roboforex',
    'exness',
    'fxopen',
    'alpari',
    'amarkets',
    'instaforex',
    'nordfx',
    'freshforex',
    'gerchik',
    'teletrade'
  ],
  
  'ukraine': [
    'roboforex',
    'exness',
    'fxopen',
    'xm',
    'hf-markets',
    'octafx',
    'fbs',
    'libertex',
    'amarkets',
    'instaforex',
    'fxgt',
    'easymarkets'
  ]
};

/**
 * Get brokers for a specific country
 * Returns at least 10 brokers or empty array if country not found
 */
export function getBrokersForCountry(countrySlug: string): BrokerId[] {
  return countryBrokerMap[countrySlug] || [];
}

/**
 * Validate that all countries have minimum required brokers
 */
export function validateCountryBrokerMappings(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const MIN_BROKERS = 10;
  
  Object.entries(countryBrokerMap).forEach(([country, brokers]) => {
    if (brokers.length < MIN_BROKERS) {
      errors.push(`${country}: Only ${brokers.length} brokers (minimum ${MIN_BROKERS} required)`);
    }
    
    // Check for duplicates
    const uniqueBrokers = new Set(brokers);
    if (uniqueBrokers.size !== brokers.length) {
      errors.push(`${country}: Contains duplicate broker entries`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Get all countries that have broker mappings
 */
export function getAllMappedCountries(): string[] {
  return Object.keys(countryBrokerMap);
}

/**
 * Get broker count for a country
 */
export function getBrokerCountForCountry(countrySlug: string): number {
  return (countryBrokerMap[countrySlug] || []).length;
}