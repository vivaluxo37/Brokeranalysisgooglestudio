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
  demonym?: string; // What to call people from this country
  language?: string; // Primary language
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
    metaDescription: 'Review CFTC and NFA regulated brokers such as IG US, OANDA, FOREX.com, Interactive Brokers, and tastyfx for American traders in 2025. Compare ACH and wire funding, 50:1 leverage caps, and platform technology.',
    keywords: [
      'cftc nfa forex brokers 2025',
      'ach forex broker usa',
      'oanda us review',
      'forex.com united states spreads',
      'interactive brokers forex usa'
    ],
    priority: 100,
    isPopular: true,
    regulatoryNotes: 'NFA/CFTC oversight enforces 50:1 leverage on majors, 20:1 on minors, daily reporting, and risk disclosures for 2025 retail accounts.',
    commonPaymentMethods: ['ACH Bank Transfer', 'Wire Transfer', 'Visa/Mastercard', 'Bank Check'],
    demonym: 'American',
    language: 'English'
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
    metaDescription: 'Compare FCA-regulated forex brokers like Pepperstone, IG, CMC Markets, eToro, Tickmill, and Swissquote for UK traders in 2025. Review GBP accounts, FSCS protection, Faster Payments funding, and negative balance safeguards.',
    keywords: [
      'pepperstone uk forex broker',
      'ig fca regulated 2025',
      'cmc markets uk review',
      'tickmill fca leverage 30:1',
      'faster payments forex brokers'
    ],
    priority: 95,
    isPopular: true,
    regulatoryNotes: 'FCA regulation requires FSCS cover to £85,000, mandatory negative balance protection, and a 30:1 retail leverage cap under 2025 rules.',
    commonPaymentMethods: ['Faster Payments', 'UK Bank Transfer', 'Visa/Mastercard', 'PayPal'],
    demonym: 'British',
    language: 'English'
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
    metaDescription: 'Compare ASIC-regulated brokers such as Pepperstone, IC Markets, FP Markets, CMC Markets, and IG for Australian traders in 2025. Review AUD accounts, PayID/Osko deposits, and ASIC leverage protections.',
    keywords: [
      'pepperstone australia review',
      'ic markets asic 2025',
      'fp markets payid deposits',
      'australian forex brokers aud accounts',
      'asic leverage 30:1'
    ],
    priority: 90,
    isPopular: true,
    regulatoryNotes: 'ASIC product intervention orders keep retail leverage at 30:1 on majors, require negative balance protection, and client money segregation through 2025.',
    commonPaymentMethods: ['PayID/Osko', 'Australian Bank Transfer', 'BPAY', 'Visa/Mastercard']
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
    metaDescription: 'Compare BaFin and ESMA compliant brokers like XTB, Admiral Markets, Pepperstone, IG, and CMC Markets for German traders in 2025. Review EUR accounts, MiFID II protections, and low spread pricing.',
    keywords: [
      'bafin forex brokers 2025',
      'xtb germany review',
      'admiral markets deutschland',
      'pepperstone germany spreads',
      'esma 30:1 leverage germany'
    ],
    priority: 90,
    isPopular: true,
    regulatoryNotes: 'BaFin and ESMA rules cap retail leverage at 30:1, enforce negative balance protection, and require segregated accounts under MiFID II (2025 update).',
    commonPaymentMethods: ['SEPA Bank Transfer', 'Sofort/Klarna', 'Visa/Mastercard', 'PayPal']
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
    metaDescription: 'Découvrez en 2025 les courtiers AMF et ESMA comme CMC Markets, Saxo Bank, Pepperstone, IG et AvaTrade avec comptes en euros, protection Sapin II et méthodes SEPA/Carte.',
    keywords: [
      'courtier forex amf 2025',
      'cmc markets france avis',
      'saxo bank france trading',
      'pepperstone france spreads',
      'forex sepa paiement'
    ],
    priority: 85,
    isPopular: true,
    regulatoryNotes: 'La loi Sapin II impose des comptes à risque limité, levier plafonné à 30:1 et protection des dépôts via le FGDR pour les traders français en 2025.',
    commonPaymentMethods: ['Virement SEPA', 'Carte Bancaire', 'PayPal', 'Skrill']
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
    metaDescription: 'Compare MAS-licensed brokers such as IG Asia, Saxo Markets, CMC Markets, OANDA, and FOREX.com for Singapore traders in 2025. Evaluate SGD accounts, PayNow/FAST funding, and Capital Markets Services safeguards.',
    keywords: [
      'mas regulated forex brokers 2025',
      'ig asia singapore review',
      'saxo markets sg trading',
      'paynow forex deposit',
      'singapore forex brokers sgd'
    ],
    priority: 85,
    isPopular: true,
    regulatoryNotes: 'MAS Capital Markets Services licence requires segregated SGD trust accounts, product risk disclosures, and 2025 conduct rules on leverage (20:1 majors).',
    commonPaymentMethods: ['PayNow', 'FAST Transfer', 'Singapore Bank GIRO', 'Visa/Mastercard']
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
    metaDescription: 'Review SFC Type 3 licensed brokers like IG, Saxo, FP Markets, IC Markets, Pepperstone, and AvaTrade for Hong Kong traders in 2025 with HKD accounts, FPS/PayMe funding, and Chinese-language support.',
    keywords: [
      'sfc forex brokers 2025',
      'ig hong kong review',
      'fp markets hk fps',
      'ic markets hong kong',
      'unionpay forex brokers'
    ],
    priority: 80,
    isPopular: true,
    regulatoryNotes: 'Hong Kong SFC Type 3 licences enforce client asset rules, suitability checks, and 2025 guidance on FX margin trading disclosure.',
    commonPaymentMethods: ['FPS / PayMe', 'HSBC Bank Transfer', 'UnionPay', 'Visa/Mastercard']
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
    metaDescription: '2025年版：Pepperstone、OANDA Japan、IG、Saxo、XMなど金融庁（JFSA）認可の主要FX業者を比較。円建て口座、Zengin入金、25倍レバレッジ規制に対応。',
    keywords: [
      '日本 fx 業者 2025',
      '金融庁 認可 ブローカー',
      'ペッパーストーン 日本',
      'ig 証券 スプレッド',
      'zengin 入金 fx'
    ],
    priority: 90,
    isPopular: true,
    regulatoryNotes: 'JFSA rules cap retail leverage at 25:1, require segregated trust accounts, negative balance protection, and quarterly disclosure under 2025 reforms.',
    commonPaymentMethods: ['Zengin Bank Transfer', 'Net Banking', 'Visa/Mastercard', 'Konbini Payment']
  },
  {
    code: 'CN',
    name: 'China',
    slug: 'china',
    flag: '🇨🇳',
    region: 'Asia',
    currency: 'CNY',
    isHighRegulated: false,
    commonLanguages: ['Mandarin'],
    seoTitle: 'Best Forex Brokers in China 2025 — Chinese Traders Guide',
    metaDescription: 'See 2025 offshore forex brokers accepting Chinese traders such as Fusion Markets, IC Markets, Pepperstone, Global Prime, and Hantec Markets with UnionPay, Alipay, and CNY-friendly funding.',
    keywords: [
      'china forex brokers 2025',
      'unionpay forex deposit',
      'fusion markets china review',
      'ic markets alipay',
      'pepperstone chinese traders'
    ],
    priority: 85,
    isPopular: true,
    regulatoryNotes: 'SAFE capital controls limit onshore leverage, so Chinese residents typically use offshore brokers with UnionPay/Alipay support and transparent CNY conversions (2025 guidance).',
    commonPaymentMethods: ['UnionPay', 'Alipay', 'WeChat Pay', 'International Wire Transfer'],
    demonym: 'Chinese',
    language: 'Mandarin'
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
    metaDescription: 'Discover 2025 brokers like Interactive Brokers, IG, FOREX.com, Pepperstone, and IC Markets that accept Indian traders with compliant USD/EUR funding, LRS guidance, and NSE currency access.',
    keywords: [
      'interactive brokers india forex',
      'ig india review 2025',
      'forex.com india lrs',
      'pepperstone indian traders',
      'international forex brokers india'
    ],
    priority: 85,
    isPopular: true,
    regulatoryNotes: 'RBI and SEBI restrict leveraged forex to NSE currency derivatives; offshore trading must follow Liberalised Remittance Scheme limits and 2025 compliance guidance.',
    commonPaymentMethods: ['International Wire Transfer', 'Visa/Mastercard', 'Skrill', 'Neteller']
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
    metaDescription: 'Compare FSCA-regulated brokers like IG, AvaTrade, Pepperstone, FP Markets, HFM, and Exness for South African traders in 2025 with ZAR accounts, Instant EFT, and local customer care.',
    keywords: [
      'fsca forex brokers 2025',
      'instant eft forex deposits',
      'pepperstone south africa review',
      'avatrade za spreads',
      'fp markets zar account'
    ],
    priority: 70,
    isPopular: true,
    regulatoryNotes: 'FSCA FAIS licensing requires client money segregation, risk disclosures, and 2025 leverage caps for retail traders (30:1 majors).',
    commonPaymentMethods: ['Instant EFT (Ozow)', 'Standard Bank Transfer', 'Visa/Mastercard', 'SnapScan']
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
    metaDescription: 'Compare 2025 CMA-licensed and tier-1 brokers such as Pepperstone, HFM, Exness, XM, and FBS for Kenyan traders with instant M-Pesa deposits and Swahili support.',
    keywords: [
      'mpesa forex brokers 2025',
      'pepperstone kenya review',
      'hfm kenya license',
      'exness mpesa withdrawal',
      'cma regulated forex kenya'
    ],
    priority: 60,
    regulatoryNotes: 'CMA onboards FX brokers with 2025 conduct rules covering M-Pesa integrations, 400:1 leverage ceilings, and client asset ring-fencing.',
    commonPaymentMethods: ['M-Pesa', 'Airtel Money', 'Kenyan Bank Transfer', 'Visa/Mastercard']
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
    metaDescription: 'Review FINMA-supervised brokers like Swissquote, Dukascopy, Saxo Bank, Pepperstone, and IG for Swiss traders in 2025 with CHF accounts and Swiss deposit protection.',
    keywords: [
      'finma forex brokers 2025',
      'swissquote chf trading',
      'dukascopy jforex analysis',
      'pepperstone switzerland review',
      'saxo bank swiss clients'
    ],
    priority: 80,
    regulatoryNotes: 'FINMA banking standards mandate segregated CHF custody, Esisuisse coverage up to CHF 100k, and 2025 negative balance safeguards.',
    commonPaymentMethods: ['Swiss Bank Transfer', 'PostFinance e-finance', 'Visa/Mastercard', 'TWINT']
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
    metaDescription: 'Explore 2025 brokers such as Fusion Markets, Pepperstone, FP Markets, IC Markets, and FBS for Malaysian traders with DuitNow/FPX transfers and MYR-friendly deposits.',
    keywords: [
      'duitnow forex brokers',
      'fpx forex deposit',
      'fusion markets malaysia review',
      'pepperstone malaysia spreads',
      'fp markets myr account'
    ],
    priority: 70,
    isPopular: true,
    regulatoryNotes: 'Securities Commission Malaysia guidance encourages using tier-1 regulated brokers with 2025 DuitNow/FPX compliant payment rails and Sharia options.',
    commonPaymentMethods: ['DuitNow', 'FPX Bank Transfer', 'Maybank/Bank Islam Transfer', 'Visa/Mastercard']
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
    metaDescription: 'Compare 2025 forex brokers like XM, FBS, AvaTrade, Pepperstone, and FP Markets for Filipino traders with PHP-friendly wallets such as GCash, UnionBank, and BPI transfers.',
    keywords: [
      'gcash forex brokers',
      'philippines forex trading 2025',
      'xm philippines review',
      'pepperstone manila support',
      'fbs php deposit'
    ],
    priority: 70,
    regulatoryNotes: 'No SEC CFD licences; choose tier-1 regulated brokers that support PHP wallets like GCash and comply with BSP anti-fraud rules.',
    commonPaymentMethods: ['GCash', 'BPI/UnionBank Transfer', 'Maya (PayMaya)', 'Visa/Mastercard']
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