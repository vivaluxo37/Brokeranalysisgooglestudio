/**
 * Countries Configuration for Best Forex Brokers Directory
 * All countries with country-specific broker verification and pages
 */

export interface CountryConfig {
  code: string; // ISO 3166-1 alpha-2
  name: string;
  slug: string; // URL-friendly slug
  flag: string; // Emoji flag
  region: string;
  currency: string;
  isEuMember?: boolean;
  isHighRegulated?: boolean; // FCA, ESMA, etc.
  commonLanguages: string[];
  seoTitle: string;
  metaDescription: string;
  keywords: string[];
  priority: number; // 0-100, higher = more important market
  isPopular?: boolean;
  regulatoryNotes?: string;
  commonPaymentMethods: string[];
}

export const COUNTRIES: CountryConfig[] = [
  // Popular Western Markets
  {
    code: 'US',
    name: 'United States',
    slug: 'united-states',
    flag: '🇺🇸',
    region: 'North America',
    currency: 'USD',
    isHighRegulated: true,
    commonLanguages: ['English'],
    seoTitle: 'Best Forex Brokers in United States 2025 — US Traders Guide',
    metaDescription: 'Find the best forex brokers accepting US traders in 2025. Compare CFTC-regulated platforms, spreads, and features for American traders.',
    keywords: ['forex brokers usa', 'us forex trading', 'cftc regulated brokers', 'american forex brokers'],
    priority: 100,
    isPopular: true,
    regulatoryNotes: 'Must be NFA/CFTC regulated with strict leverage limits (50:1 major pairs, 20:1 minors)',
    commonPaymentMethods: ['Bank Wire', 'ACH', 'Credit Card', 'Check']
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    slug: 'united-kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    currency: 'GBP',
    isHighRegulated: true,
    commonLanguages: ['English'],
    seoTitle: 'Best Forex Brokers in United Kingdom 2025 — UK Traders Guide',
    metaDescription: 'Discover the best FCA-regulated forex brokers for UK traders in 2025. Compare spreads, platforms, and features from top British brokers.',
    keywords: ['forex brokers uk', 'fca regulated brokers', 'uk forex trading', 'british forex brokers'],
    priority: 95,
    isPopular: true,
    regulatoryNotes: 'Must be FCA regulated with FSCS protection up to £85,000',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'Debit Card', 'PayPal', 'Skrill']
  },
  {
    code: 'AU',
    name: 'Australia',
    slug: 'australia',
    flag: '🇦🇺',
    region: 'Oceania',
    currency: 'AUD',
    isHighRegulated: true,
    commonLanguages: ['English'],
    seoTitle: 'Best Forex Brokers in Australia 2025 — Australian Traders Guide',
    metaDescription: 'Find the top ASIC-regulated forex brokers for Australian traders in 2025. Compare platforms, spreads, and features from leading Aussie brokers.',
    keywords: ['forex brokers australia', 'asic regulated brokers', 'australian forex trading', 'aussie forex brokers'],
    priority: 90,
    isPopular: true,
    regulatoryNotes: 'Must be ASIC regulated with leverage limits (30:1 major pairs for retail clients)',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'PayPal', 'POLi', 'BPay']
  },
  {
    code: 'CA',
    name: 'Canada',
    slug: 'canada',
    flag: '🇨🇦',
    region: 'North America',
    currency: 'CAD',
    isHighRegulated: true,
    commonLanguages: ['English', 'French'],
    seoTitle: 'Best Forex Brokers in Canada 2025 — Canadian Traders Guide',
    metaDescription: 'Discover the best IIROC-regulated forex brokers for Canadian traders in 2025. Compare spreads, platforms, and features from top Canadian brokers.',
    keywords: ['forex brokers canada', 'canadian forex trading', 'iiroc regulated brokers', 'cad forex brokers'],
    priority: 85,
    isPopular: true,
    regulatoryNotes: 'Must be IIROC regulated with CIPF protection',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'Interac', 'PayPal']
  },
  {
    code: 'DE',
    name: 'Germany',
    slug: 'germany',
    flag: '🇩🇪',
    region: 'Europe',
    currency: 'EUR',
    isEuMember: true,
    isHighRegulated: true,
    commonLanguages: ['German'],
    seoTitle: 'Best Forex Brokers in Germany 2025 — German Traders Guide',
    metaDescription: 'Find the best BaFin-regulated forex brokers for German traders in 2025. Compare EU-regulated platforms with ESMA protection.',
    keywords: ['forex brokers germany', 'bafin regulated brokers', 'german forex trading', 'deutsche forex broker'],
    priority: 90,
    isPopular: true,
    regulatoryNotes: 'Must comply with ESMA regulations and BaFin oversight',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'PayPal', 'Skrill', 'Neteller', 'Sofort']
  },
  {
    code: 'FR',
    name: 'France',
    slug: 'france',
    flag: '🇫🇷',
    region: 'Europe',
    currency: 'EUR',
    isEuMember: true,
    isHighRegulated: true,
    commonLanguages: ['French'],
    seoTitle: 'Best Forex Brokers in France 2025 — French Traders Guide',
    metaDescription: 'Découvrez les meilleurs courtiers forex réglementés AMF pour les traders français en 2025. Comparez spreads, plateformes et fonctionnalités.',
    keywords: ['courtiers forex france', 'brokers forex français', 'amf régulation', 'trading forex france'],
    priority: 85,
    isPopular: true,
    regulatoryNotes: 'Must be AMF regulated with EU investor protection',
    commonPaymentMethods: ['Virement Bancaire', 'Carte de Crédit', 'PayPal', 'Skrill']
  },

  // Major Asian Markets
  {
    code: 'SG',
    name: 'Singapore',
    slug: 'singapore',
    flag: '🇸🇬',
    region: 'Asia',
    currency: 'SGD',
    isHighRegulated: true,
    commonLanguages: ['English', 'Mandarin', 'Malay'],
    seoTitle: 'Best Forex Brokers in Singapore 2025 — Singapore Traders Guide',
    metaDescription: 'Find the best MAS-regulated forex brokers for Singapore traders in 2025. Compare spreads, platforms, and features from top Asian brokers.',
    keywords: ['forex brokers singapore', 'mas regulated brokers', 'singapore forex trading', 'asian forex brokers'],
    priority: 85,
    isPopular: true,
    regulatoryNotes: 'Must be MAS regulated for financial security',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'PayNow', 'eNETS']
  },
  {
    code: 'HK',
    name: 'Hong Kong',
    slug: 'hong-kong',
    flag: '🇭🇰',
    region: 'Asia',
    currency: 'HKD',
    isHighRegulated: true,
    commonLanguages: ['English', 'Cantonese', 'Mandarin'],
    seoTitle: 'Best Forex Brokers in Hong Kong 2025 — Hong Kong Traders Guide',
    metaDescription: 'Discover the best SFC-regulated forex brokers for Hong Kong traders in 2025. Compare platforms, spreads, and features from top HK brokers.',
    keywords: ['forex brokers hong kong', 'sfc regulated brokers', 'hong kong forex trading', 'hk forex brokers'],
    priority: 80,
    isPopular: true,
    regulatoryNotes: 'Must be SFC regulated for investor protection',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'Faster Payment System', 'Octopus']
  },
  {
    code: 'JP',
    name: 'Japan',
    slug: 'japan',
    flag: '🇯🇵',
    region: 'Asia',
    currency: 'JPY',
    isHighRegulated: true,
    commonLanguages: ['Japanese'],
    seoTitle: 'Best Forex Brokers in Japan 2025 — Japanese Traders Guide',
    metaDescription: '2025年の日本のトレーダー向け最高のFX業者を見つけましょう。金融庁規制のプラットフォーム、スプレッド、機能を比較。',
    keywords: ['forex brokers japan', 'japanese forex trading', 'fsa japan regulated', 'fx 業者 日本'],
    priority: 90,
    isPopular: true,
    regulatoryNotes: 'Must be FSA Japan regulated with strict leverage limits (25:1)',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'Convenience Store Payment', 'Net Banking']
  },
  {
    code: 'IN',
    name: 'India',
    slug: 'india',
    flag: '🇮🇳',
    region: 'Asia',
    currency: 'INR',
    commonLanguages: ['Hindi', 'English'],
    seoTitle: 'Best Forex Brokers in India 2025 — Indian Traders Guide',
    metaDescription: 'Find the best forex brokers for Indian traders in 2025. Compare international brokers accepting Indian clients with INR support.',
    keywords: ['forex brokers india', 'indian forex trading', 'inr forex brokers', 'india trading platforms'],
    priority: 85,
    isPopular: true,
    regulatoryNotes: 'International brokers only - domestic forex trading restricted by RBI',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'UPI', 'Paytm', 'Net Banking']
  },
  {
    code: 'KR',
    name: 'South Korea',
    slug: 'south-korea',
    flag: '🇰🇷',
    region: 'Asia',
    currency: 'KRW',
    commonLanguages: ['Korean'],
    seoTitle: 'Best Forex Brokers in South Korea 2025 — Korean Traders Guide',
    metaDescription: '2025년 한국 트레이더를 위한 최고의 외환 브로커를 찾아보세요. 한국 고객을 받는 국제 브로커들을 비교하세요.',
    keywords: ['forex brokers korea', 'korean forex trading', 'krw forex brokers', '외환 브로커 한국'],
    priority: 75,
    regulatoryNotes: 'International brokers only - domestic restrictions apply',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'KakaoPay', 'Toss']
  },

  // Middle East & GCC
  {
    code: 'AE',
    name: 'United Arab Emirates',
    slug: 'united-arab-emirates',
    flag: '🇦🇪',
    region: 'Middle East',
    currency: 'AED',
    commonLanguages: ['Arabic', 'English'],
    seoTitle: 'Best Forex Brokers in UAE 2025 — Emirates Traders Guide',
    metaDescription: 'Find the best forex brokers for UAE traders in 2025. Compare international platforms accepting Emirates clients with AED support.',
    keywords: ['forex brokers uae', 'emirates forex trading', 'dubai forex brokers', 'aed forex trading'],
    priority: 80,
    isPopular: true,
    regulatoryNotes: 'International brokers preferred - local regulations developing',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'Islamic Banking']
  },
  {
    code: 'SA',
    name: 'Saudi Arabia',
    slug: 'saudi-arabia',
    flag: '🇸🇦',
    region: 'Middle East',
    currency: 'SAR',
    commonLanguages: ['Arabic'],
    seoTitle: 'Best Forex Brokers in Saudi Arabia 2025 — Saudi Traders Guide',
    metaDescription: 'Discover the best forex brokers for Saudi Arabian traders in 2025. Compare Sharia-compliant platforms and international brokers.',
    keywords: ['forex brokers saudi arabia', 'saudi forex trading', 'islamic forex brokers', 'sar forex trading'],
    priority: 75,
    regulatoryNotes: 'Prefer Sharia-compliant Islamic accounts',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'Islamic Banking']
  },

  // African Markets
  {
    code: 'ZA',
    name: 'South Africa',
    slug: 'south-africa',
    flag: '🇿🇦',
    region: 'Africa',
    currency: 'ZAR',
    isHighRegulated: true,
    commonLanguages: ['English', 'Afrikaans'],
    seoTitle: 'Best Forex Brokers in South Africa 2025 — South African Traders Guide',
    metaDescription: 'Find the best FSCA-regulated forex brokers for South African traders in 2025. Compare ZAR-friendly platforms and international brokers.',
    keywords: ['forex brokers south africa', 'fsca regulated brokers', 'zar forex trading', 'south african forex'],
    priority: 70,
    isPopular: true,
    regulatoryNotes: 'FSCA regulated preferred with investor protection',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'EFT', 'Instant EFT']
  },
  {
    code: 'NG',
    name: 'Nigeria',
    slug: 'nigeria',
    flag: '🇳🇬',
    region: 'Africa',
    currency: 'NGN',
    commonLanguages: ['English'],
    seoTitle: 'Best Forex Brokers in Nigeria 2025 — Nigerian Traders Guide',
    metaDescription: 'Discover the best forex brokers for Nigerian traders in 2025. Compare international platforms accepting NGN and local payment methods.',
    keywords: ['forex brokers nigeria', 'nigerian forex trading', 'ngn forex brokers', 'naira forex trading'],
    priority: 70,
    regulatoryNotes: 'International brokers only - verify local regulations',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'Local Bank Transfer']
  },
  {
    code: 'KE',
    name: 'Kenya',
    slug: 'kenya',
    flag: '🇰🇪',
    region: 'Africa',
    currency: 'KES',
    commonLanguages: ['English', 'Swahili'],
    seoTitle: 'Best Forex Brokers in Kenya 2025 — Kenyan Traders Guide',
    metaDescription: 'Find the best forex brokers for Kenyan traders in 2025. Compare international platforms with KES support and local payment options.',
    keywords: ['forex brokers kenya', 'kenyan forex trading', 'kes forex brokers', 'kenya trading platforms'],
    priority: 60,
    regulatoryNotes: 'International brokers recommended',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'M-Pesa', 'Airtel Money']
  },

  // Latin America
  {
    code: 'BR',
    name: 'Brazil',
    slug: 'brazil',
    flag: '🇧🇷',
    region: 'South America',
    currency: 'BRL',
    commonLanguages: ['Portuguese'],
    seoTitle: 'Best Forex Brokers in Brazil 2025 — Brazilian Traders Guide',
    metaDescription: 'Encontre os melhores corretores forex para traders brasileiros em 2025. Compare plataformas internacionais com suporte BRL.',
    keywords: ['corretores forex brasil', 'forex trading brasil', 'brokers forex brasileiro', 'brl forex trading'],
    priority: 75,
    isPopular: true,
    regulatoryNotes: 'International brokers only - CVM regulations for domestic',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'PIX', 'Boleto']
  },
  {
    code: 'MX',
    name: 'Mexico',
    slug: 'mexico',
    flag: '🇲🇽',
    region: 'North America',
    currency: 'MXN',
    commonLanguages: ['Spanish'],
    seoTitle: 'Best Forex Brokers in Mexico 2025 — Mexican Traders Guide',
    metaDescription: 'Encuentra los mejores brokers forex para traders mexicanos en 2025. Compara plataformas internacionales con soporte MXN.',
    keywords: ['brokers forex mexico', 'trading forex mexico', 'brokers forex mexicanos', 'mxn forex trading'],
    priority: 70,
    regulatoryNotes: 'International brokers preferred',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'SPEI', 'OXXO']
  },
  {
    code: 'AR',
    name: 'Argentina',
    slug: 'argentina',
    flag: '🇦🇷',
    region: 'South America',
    currency: 'ARS',
    commonLanguages: ['Spanish'],
    seoTitle: 'Best Forex Brokers in Argentina 2025 — Argentine Traders Guide',
    metaDescription: 'Encuentra los mejores brokers forex para traders argentinos en 2025. Compara plataformas con soporte ARS y métodos de pago locales.',
    keywords: ['brokers forex argentina', 'trading forex argentina', 'ars forex brokers', 'brokers argentinos'],
    priority: 65,
    regulatoryNotes: 'International brokers recommended due to local restrictions',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'Mercado Pago']
  },
  {
    code: 'CL',
    name: 'Chile',
    slug: 'chile',
    flag: '🇨🇱',
    region: 'South America',
    currency: 'CLP',
    commonLanguages: ['Spanish'],
    seoTitle: 'Best Forex Brokers in Chile 2025 — Chilean Traders Guide',
    metaDescription: 'Encuentra los mejores brokers forex para traders chilenos en 2025. Compara plataformas internacionales con soporte CLP.',
    keywords: ['brokers forex chile', 'trading forex chile', 'clp forex brokers', 'brokers chilenos'],
    priority: 60,
    regulatoryNotes: 'CMF regulation for local brokers',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'Khipu', 'Redcompra']
  },

  // Additional European Markets
  {
    code: 'IT',
    name: 'Italy',
    slug: 'italy',
    flag: '🇮🇹',
    region: 'Europe',
    currency: 'EUR',
    isEuMember: true,
    isHighRegulated: true,
    commonLanguages: ['Italian'],
    seoTitle: 'Best Forex Brokers in Italy 2025 — Italian Traders Guide',
    metaDescription: 'Trova i migliori broker forex CONSOB per traders italiani nel 2025. Confronta spread, piattaforme e funzionalità.',
    keywords: ['broker forex italia', 'trading forex italiano', 'consob broker', 'migliori broker forex'],
    priority: 80,
    isPopular: true,
    regulatoryNotes: 'Must comply with ESMA and CONSOB regulations',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'PayPal', 'PostePay']
  },
  {
    code: 'ES',
    name: 'Spain',
    slug: 'spain',
    flag: '🇪🇸',
    region: 'Europe',
    currency: 'EUR',
    isEuMember: true,
    isHighRegulated: true,
    commonLanguages: ['Spanish'],
    seoTitle: 'Best Forex Brokers in Spain 2025 — Spanish Traders Guide',
    metaDescription: 'Encuentra los mejores brokers forex CNMV para traders españoles en 2025. Compara spreads, plataformas y características.',
    keywords: ['brokers forex españa', 'trading forex español', 'cnmv brokers', 'mejores brokers forex'],
    priority: 80,
    isPopular: true,
    regulatoryNotes: 'Must comply with ESMA and CNMV regulations',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'PayPal', 'Bizum']
  },
  {
    code: 'NL',
    name: 'Netherlands',
    slug: 'netherlands',
    flag: '🇳🇱',
    region: 'Europe',
    currency: 'EUR',
    isEuMember: true,
    isHighRegulated: true,
    commonLanguages: ['Dutch'],
    seoTitle: 'Best Forex Brokers in Netherlands 2025 — Dutch Traders Guide',
    metaDescription: 'Vind de beste AFM-gereguleerde forex brokers voor Nederlandse traders in 2025. Vergelijk spreads, platforms en functies.',
    keywords: ['forex brokers nederland', 'nederlandse forex trading', 'afm gereguleerde brokers', 'beste forex brokers'],
    priority: 75,
    regulatoryNotes: 'Must comply with ESMA and AFM regulations',
    commonPaymentMethods: ['Bank Transfer', 'iDEAL', 'Credit Card', 'PayPal']
  },

  // Additional Countries from the original list
  {
    code: 'CH',
    name: 'Switzerland',
    slug: 'switzerland',
    flag: '🇨🇭',
    region: 'Europe',
    currency: 'CHF',
    isHighRegulated: true,
    commonLanguages: ['German', 'French', 'Italian'],
    seoTitle: 'Best Forex Brokers in Switzerland 2025 — Swiss Traders Guide',
    metaDescription: 'Find the best FINMA-regulated forex brokers for Swiss traders in 2025. Compare premium platforms with CHF support.',
    keywords: ['forex brokers switzerland', 'finma regulated brokers', 'swiss forex trading', 'chf forex brokers'],
    priority: 80,
    regulatoryNotes: 'FINMA regulation provides strong investor protection',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'PostFinance', 'Twint']
  },
  {
    code: 'SE',
    name: 'Sweden',
    slug: 'sweden',
    flag: '🇸🇪',
    region: 'Europe',
    currency: 'SEK',
    isEuMember: true,
    isHighRegulated: true,
    commonLanguages: ['Swedish'],
    seoTitle: 'Best Forex Brokers in Sweden 2025 — Swedish Traders Guide',
    metaDescription: 'Hitta de bästa FI-reglerade forex mäklarna för svenska handlare 2025. Jämför spreadar, plattformar och funktioner.',
    keywords: ['forex mäklare sverige', 'svensk forex trading', 'fi reglerade mäklare', 'bästa forex mäklare'],
    priority: 70,
    regulatoryNotes: 'Must comply with ESMA and FI (Finansinspektionen) regulations',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'Swish', 'Trustly']
  },
  {
    code: 'PL',
    name: 'Poland',
    slug: 'poland',
    flag: '🇵🇱',
    region: 'Europe',
    currency: 'PLN',
    isEuMember: true,
    isHighRegulated: true,
    commonLanguages: ['Polish'],
    seoTitle: 'Best Forex Brokers in Poland 2025 — Polish Traders Guide',
    metaDescription: 'Znajdź najlepszych brokerów forex KNF dla polskich traderów w 2025. Porównaj spready, platformy i funkcje.',
    keywords: ['brokerzy forex polska', 'polski forex trading', 'knf brokerzy', 'najlepsi brokerzy forex'],
    priority: 75,
    regulatoryNotes: 'Must comply with ESMA and KNF regulations',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'PayU', 'Przelewy24']
  },
  {
    code: 'TR',
    name: 'Turkey',
    slug: 'turkey',
    flag: '🇹🇷',
    region: 'Europe/Asia',
    currency: 'TRY',
    commonLanguages: ['Turkish'],
    seoTitle: 'Best Forex Brokers in Turkey 2025 — Turkish Traders Guide',
    metaDescription: 'Türk yatırımcılar için 2025\'te en iyi forex brokerlarını bulun. SPK düzenlemeli ve uluslararası platformları karşılaştırın.',
    keywords: ['forex brokerleri türkiye', 'türk forex trading', 'spk brokerları', 'try forex trading'],
    priority: 70,
    regulatoryNotes: 'Local SPK regulation or international brokers',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'Papara', 'QNB Finansbank']
  },

  // Additional Asian Markets
  {
    code: 'TH',
    name: 'Thailand',
    slug: 'thailand',
    flag: '🇹🇭',
    region: 'Asia',
    currency: 'THB',
    commonLanguages: ['Thai'],
    seoTitle: 'Best Forex Brokers in Thailand 2025 — Thai Traders Guide',
    metaDescription: 'ค้นหาโบรกเกอร์ forex ที่ดีที่สุดสำหรับเทรดเดอร์ไทยในปี 2025 เปรียบเทียบแพลตฟอร์มระดับโลกที่รองรับ THB',
    keywords: ['forex brokers thailand', 'thai forex trading', 'thb forex brokers', 'โบรกเกอร์ forex ไทย'],
    priority: 65,
    regulatoryNotes: 'International brokers recommended',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'PromptPay', 'True Money']
  },
  {
    code: 'MY',
    name: 'Malaysia',
    slug: 'malaysia',
    flag: '🇲🇾',
    region: 'Asia',
    currency: 'MYR',
    commonLanguages: ['Malay', 'English'],
    seoTitle: 'Best Forex Brokers in Malaysia 2025 — Malaysian Traders Guide',
    metaDescription: 'Find the best forex brokers for Malaysian traders in 2025. Compare international platforms with MYR support and local payment methods.',
    keywords: ['forex brokers malaysia', 'malaysian forex trading', 'myr forex brokers', 'malaysia trading platforms'],
    priority: 70,
    isPopular: true,
    regulatoryNotes: 'International brokers preferred - verify with BNM regulations',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'FPX', 'Touch n Go']
  },
  {
    code: 'ID',
    name: 'Indonesia',
    slug: 'indonesia',
    flag: '🇮🇩',
    region: 'Asia',
    currency: 'IDR',
    commonLanguages: ['Indonesian'],
    seoTitle: 'Best Forex Brokers in Indonesia 2025 — Indonesian Traders Guide',
    metaDescription: 'Temukan broker forex terbaik untuk trader Indonesia di 2025. Bandingkan platform internasional dengan dukungan IDR.',
    keywords: ['broker forex indonesia', 'trading forex indonesia', 'idr forex brokers', 'platform trading indonesia'],
    priority: 70,
    isPopular: true,
    regulatoryNotes: 'International brokers only - local forex trading restricted',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'GoPay', 'OVO', 'Dana']
  },
  {
    code: 'PH',
    name: 'Philippines',
    slug: 'philippines',
    flag: '🇵🇭',
    region: 'Asia',
    currency: 'PHP',
    commonLanguages: ['Filipino', 'English'],
    seoTitle: 'Best Forex Brokers in Philippines 2025 — Filipino Traders Guide',
    metaDescription: 'Find the best forex brokers for Filipino traders in 2025. Compare international platforms with PHP support and local payment options.',
    keywords: ['forex brokers philippines', 'filipino forex trading', 'php forex brokers', 'philippines trading platforms'],
    priority: 65,
    regulatoryNotes: 'International brokers recommended',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'GCash', 'PayMaya', 'UnionBank']
  },
  {
    code: 'VN',
    name: 'Vietnam',
    slug: 'vietnam',
    flag: '🇻🇳',
    region: 'Asia',
    currency: 'VND',
    commonLanguages: ['Vietnamese'],
    seoTitle: 'Best Forex Brokers in Vietnam 2025 — Vietnamese Traders Guide',
    metaDescription: 'Tìm các sàn forex tốt nhất cho trader Việt Nam năm 2025. So sánh các nền tảng quốc tế hỗ trợ VND.',
    keywords: ['sàn forex việt nam', 'trading forex vietnam', 'vnd forex brokers', 'nền tảng trading việt nam'],
    priority: 65,
    regulatoryNotes: 'International brokers only - local restrictions apply',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'MoMo', 'ZaloPay', 'VietinBank']
  },

  // Additional Countries to complete the list
  {
    code: 'RU',
    name: 'Russia',
    slug: 'russia',
    flag: '🇷🇺',
    region: 'Europe/Asia',
    currency: 'RUB',
    commonLanguages: ['Russian'],
    seoTitle: 'Best Forex Brokers in Russia 2025 — Russian Traders Guide',
    metaDescription: 'Найдите лучших форекс брокеров для российских трейдеров в 2025. Сравните международные платформы с поддержкой RUB.',
    keywords: ['форекс брокеры россия', 'russian forex trading', 'rub forex brokers', 'российские брокеры'],
    priority: 70,
    regulatoryNotes: 'International brokers may have restrictions due to sanctions',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'Yandex Money', 'QIWI']
  },
  {
    code: 'UA',
    name: 'Ukraine',
    slug: 'ukraine',
    flag: '🇺🇦',
    region: 'Europe',
    currency: 'UAH',
    commonLanguages: ['Ukrainian', 'Russian'],
    seoTitle: 'Best Forex Brokers in Ukraine 2025 — Ukrainian Traders Guide',
    metaDescription: 'Знайдіть найкращих форекс брокерів для українських трейдерів у 2025. Порівняйте міжнародні платформи з підтримкою UAH.',
    keywords: ['форекс брокери україна', 'ukrainian forex trading', 'uah forex brokers', 'українські брокери'],
    priority: 60,
    regulatoryNotes: 'International brokers recommended due to current situation',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'Privat24', 'Monobank']
  },
  {
    code: 'EG',
    name: 'Egypt',
    slug: 'egypt',
    flag: '🇪🇬',
    region: 'Africa/Middle East',
    currency: 'EGP',
    commonLanguages: ['Arabic'],
    seoTitle: 'Best Forex Brokers in Egypt 2025 — Egyptian Traders Guide',
    metaDescription: 'اعثر على أفضل وسطاء الفوركس للمتداولين المصريين في 2025. قارن المنصات الدولية التي تدعم الجنيه المصري.',
    keywords: ['وسطاء فوركس مصر', 'egyptian forex trading', 'egp forex brokers', 'تداول فوركس مصر'],
    priority: 60,
    regulatoryNotes: 'International brokers recommended',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'Fawry', 'Vodafone Cash']
  },
  {
    code: 'IR',
    name: 'Iran',
    slug: 'iran',
    flag: '🇮🇷',
    region: 'Middle East',
    currency: 'IRR',
    commonLanguages: ['Persian'],
    seoTitle: 'Best Forex Brokers in Iran 2025 — Iranian Traders Guide',
    metaDescription: 'بهترین کارگزاران فارکس برای معامله‌گران ایرانی در سال 2025 را پیدا کنید. پلتفرم‌های بین‌المللی با پشتیبانی IRR را مقایسه کنید.',
    keywords: ['کارگزاران فارکس ایران', 'iranian forex trading', 'irr forex brokers', 'معامله فارکس ایران'],
    priority: 50,
    regulatoryNotes: 'Limited access due to international sanctions',
    commonPaymentMethods: ['Local Bank Transfer', 'Cryptocurrency']
  },

  // Complete remaining countries from original list
  {
    code: 'NZ',
    name: 'New Zealand',
    slug: 'new-zealand',
    flag: '🇳🇿',
    region: 'Oceania',
    currency: 'NZD',
    isHighRegulated: true,
    commonLanguages: ['English'],
    seoTitle: 'Best Forex Brokers in New Zealand 2025 — New Zealand Traders Guide',
    metaDescription: 'Find the best FMA-regulated forex brokers for New Zealand traders in 2025. Compare platforms with NZD support and local features.',
    keywords: ['forex brokers new zealand', 'fma regulated brokers', 'nzd forex trading', 'nz forex brokers'],
    priority: 65,
    regulatoryNotes: 'FMA regulated preferred with investor protection',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'POLi', 'Internet Banking']
  },

  // Small but important markets
  {
    code: 'CY',
    name: 'Cyprus',
    slug: 'cyprus',
    flag: '🇨🇾',
    region: 'Europe',
    currency: 'EUR',
    isEuMember: true,
    isHighRegulated: true,
    commonLanguages: ['Greek', 'English'],
    seoTitle: 'Best Forex Brokers in Cyprus 2025 — Cyprus Traders Guide',
    metaDescription: 'Find the best CySEC-regulated forex brokers for Cyprus traders in 2025. Compare EU-regulated platforms with local expertise.',
    keywords: ['forex brokers cyprus', 'cysec regulated brokers', 'cyprus forex trading', 'cypriot forex brokers'],
    priority: 75,
    isPopular: true,
    regulatoryNotes: 'Major EU regulatory hub with CySEC oversight',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'PayPal', 'Skrill']
  },

  // Additional smaller markets to complete the comprehensive list
  {
    code: 'GR',
    name: 'Greece',
    slug: 'greece',
    flag: '🇬🇷',
    region: 'Europe',
    currency: 'EUR',
    isEuMember: true,
    isHighRegulated: true,
    commonLanguages: ['Greek'],
    seoTitle: 'Best Forex Brokers in Greece 2025 — Greek Traders Guide',
    metaDescription: 'Βρείτε τους καλύτερους HCMC ρυθμιζόμενους forex brokers για Έλληνες traders το 2025. Συγκρίνετε spreads, πλατφόρμες και χαρακτηριστικά.',
    keywords: ['forex brokers greece', 'greek forex trading', 'hcmc regulated brokers', 'ελληνικοί forex brokers'],
    priority: 65,
    regulatoryNotes: 'Must comply with ESMA and HCMC regulations',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'PayPal']
  },
  {
    code: 'PT',
    name: 'Portugal',
    slug: 'portugal',
    flag: '🇵🇹',
    region: 'Europe',
    currency: 'EUR',
    isEuMember: true,
    isHighRegulated: true,
    commonLanguages: ['Portuguese'],
    seoTitle: 'Best Forex Brokers in Portugal 2025 — Portuguese Traders Guide',
    metaDescription: 'Encontre os melhores brokers forex CMVM para traders portugueses em 2025. Compare spreads, plataformas e funcionalidades.',
    keywords: ['brokers forex portugal', 'trading forex português', 'cmvm brokers', 'melhores brokers forex'],
    priority: 65,
    regulatoryNotes: 'Must comply with ESMA and CMVM regulations',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'MB WAY', 'PayPal']
  },

  // Add some smaller but significant markets
  {
    code: 'HU',
    name: 'Hungary',
    slug: 'hungary',
    flag: '🇭🇺',
    region: 'Europe',
    currency: 'HUF',
    isEuMember: true,
    isHighRegulated: true,
    commonLanguages: ['Hungarian'],
    seoTitle: 'Best Forex Brokers in Hungary 2025 — Hungarian Traders Guide',
    metaDescription: 'Találja meg a legjobb MNB szabályozott forex brókereket magyar kereskedők számára 2025-ben. Hasonlítsa össze a spread-eket és platformokat.',
    keywords: ['forex brókerek magyarország', 'magyar forex kereskedés', 'mnb szabályozott brókerek', 'huf forex trading'],
    priority: 60,
    regulatoryNotes: 'Must comply with ESMA and MNB regulations',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'PayPal', 'Barion']
  },
  {
    code: 'CZ',
    name: 'Czechia',
    slug: 'czechia',
    flag: '🇨🇿',
    region: 'Europe',
    currency: 'CZK',
    isEuMember: true,
    isHighRegulated: true,
    commonLanguages: ['Czech'],
    seoTitle: 'Best Forex Brokers in Czechia 2025 — Czech Traders Guide',
    metaDescription: 'Najděte nejlepší CNB regulované forex brokery pro české obchodníky v roce 2025. Porovnejte spready, platformy a funkce.',
    keywords: ['forex brokeři česká republika', 'české forex trading', 'cnb regulovaní brokeři', 'czk forex trading'],
    priority: 60,
    regulatoryNotes: 'Must comply with ESMA and CNB regulations',
    commonPaymentMethods: ['Bank Transfer', 'Credit Card', 'PayPal', 'GoPay']
  }
];

export const REGIONS = {
  'North America': 'North America',
  'Europe': 'Europe',
  'Asia': 'Asia',
  'Middle East': 'Middle East',
  'Africa': 'Africa',
  'South America': 'South America',
  'Oceania': 'Oceania',
  'Europe/Asia': 'Europe/Asia',
  'Africa/Middle East': 'Africa/Middle East'
} as const;

export const POPULAR_COUNTRIES = COUNTRIES.filter(country => country.isPopular);
export const HIGH_REGULATED_COUNTRIES = COUNTRIES.filter(country => country.isHighRegulated);

export const getCountryByCode = (code: string): CountryConfig | undefined => {
  return COUNTRIES.find(country => country.code === code);
};

export const getCountryBySlug = (slug: string): CountryConfig | undefined => {
  return COUNTRIES.find(country => country.slug === slug);
};

export const getCountriesByRegion = (region: string): CountryConfig[] => {
  return COUNTRIES.filter(country => country.region === region);
};

export const generateCountryTitle = (countryName: string): string => {
  return `Best Forex Brokers in ${countryName} 2025`;
};

export const generateCountryMetaDescription = (country: CountryConfig, brokerCount?: number): string => {
  const count = brokerCount || 10;
  return `Find the top ${count} forex brokers for ${country.name} traders in 2025. Compare spreads, regulation, and features. Expert reviews and analysis.`;
};

// Search queries for country verification
export const generateVerificationQueries = (brokerName: string, countryName: string): string[] => {
  return [
    `"${brokerName}" accepts clients from ${countryName}`,
    `"${brokerName}" ${countryName} account`,
    `"${brokerName}" terms and conditions ${countryName}`,
    `"${brokerName}" prohibited countries`,
    `"${brokerName}" restricted countries ${countryName}`,
    `"${brokerName}" regulation ${countryName}`,
    `site:${brokerName.toLowerCase().replace(/\s+/g, '')}.com ${countryName}`
  ];
};