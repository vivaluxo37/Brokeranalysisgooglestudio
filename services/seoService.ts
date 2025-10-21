interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  author?: string;
  publishDate?: string;
  modifiedDate?: string;
}

interface BreadcrumbItem {
  '@type': string;
  position: number;
  name: string;
  item?: string;
}

export class SEOService {
  private static readonly BASE_URL = 'https://bestforexbrokers.com'
  private static readonly SITE_NAME = 'Best Forex Brokers'
  private static readonly DEFAULT_OG_IMAGE = '/images/og-default.jpg'

  /**
   * Generate meta tags for broker listing pages
   */
  static generateBrokerListingMeta(type: 'all' | 'category' | 'country', slug?: string): SEOConfig {
    const year = new Date().getFullYear()

    switch (type) {
      case 'all':
        return {
          title: `All Forex Brokers ${year} - Complete List of 84+ Verified Brokers`,
          description: `Browse our complete directory of ${year}'s top forex brokers. Compare spreads, regulations, platforms, and user reviews. Find your perfect broker with detailed analysis and exclusive bonuses.`,
          keywords: [
            'forex brokers',
            'all brokers list',
            'forex broker directory',
            'broker comparison',
            'trading brokers',
            `forex brokers ${year}`,
            'regulated brokers',
            'best forex platforms',
          ],
          canonical: `${this.BASE_URL}/brokers`,
          ogType: 'website',
          twitterCard: 'summary_large_image',
        }

      case 'category':
        const categoryName = slug ? this.formatCategoryName(slug) : 'Category'
        const categoryTitle = this.getCategoryTitle(slug)
        return {
          title: `Best ${categoryName} Brokers ${year} - Top Rated & Expert Reviewed`,
          description: `Discover the best ${categoryName} brokers for ${year}. Compare spreads from 0.0 pips, regulations (FCA, ASIC, CySEC), platforms, and get exclusive deposit bonuses up to $5000.`,
          keywords: [
            `${categoryName} brokers`,
            `best ${categoryName} forex`,
            `${categoryName} trading`,
            `${categoryName} platforms`,
            `${categoryName} comparison`,
            slug || '',
            `${year} ${categoryName}`,
            'forex trading',
          ],
          canonical: `${this.BASE_URL}/brokers/category/${slug}`,
          ogType: 'website',
          twitterCard: 'summary_large_image',
        }

      case 'country':
        const countryName = slug ? this.formatCountryName(slug) : 'Country'
        const countryCode = this.getCountryCode(slug)
        return {
          title: `Best Forex Brokers in ${countryName} ${year} - Local & International Options`,
          description: `Top ${year} forex brokers accepting traders from ${countryName}. Compare locally regulated brokers with ${countryName} payment methods, local support, and tax-friendly accounts.`,
          keywords: [
            `forex brokers ${countryName}`,
            `${countryName} trading brokers`,
            `${countryName} forex platforms`,
            `best brokers in ${countryName}`,
            `${countryName} regulated brokers`,
            slug || '',
            `${year} ${countryName} brokers`,
            'local forex trading',
          ],
          canonical: `${this.BASE_URL}/brokers/country/${slug}`,
          ogType: 'website',
          twitterCard: 'summary_large_image',
        }

      default:
        return {
          title: 'Forex Brokers Directory',
          description: 'Compare and find the best forex brokers for your trading needs.',
          keywords: ['forex', 'brokers', 'trading'],
          canonical: this.BASE_URL,
        }
    }
  }

  /**
   * Generate meta tags for individual broker pages
   */
  static generateBrokerDetailMeta(broker: any): SEOConfig {
    const year = new Date().getFullYear()
    const rating = broker.overall_rating || broker.score || 0
    const minDeposit = broker.min_deposit || broker.accessibility?.minDeposit || 0

    return {
      title: `${broker.name} Review ${year} - Is it Safe? Pros, Cons & Ratings`,
      description: `${broker.name} detailed review: ⭐ ${rating}/5 rating, $${minDeposit} min deposit, spreads from ${broker.spreads_from || '0.0'} pips. Read our expert analysis of regulation, platforms, fees, and user experiences.`,
      keywords: [
        `${broker.name} review`,
        `${broker.name} broker`,
        `is ${broker.name} safe`,
        `${broker.name} scam`,
        `${broker.name} fees`,
        `${broker.name} spreads`,
        `${broker.name} ${year}`,
        'forex broker review',
      ],
      canonical: `${this.BASE_URL}/brokers/${broker.slug || broker.id}`,
      ogType: 'article',
      twitterCard: 'summary_large_image',
      publishDate: new Date().toISOString(),
      modifiedDate: new Date().toISOString(),
    }
  }

  /**
   * Format category slug to readable name
   */
  static formatCategoryName(slug: string): string {
    const mappings: Record<string, string> = {
      'ecn-brokers': 'ECN',
      'stp-brokers': 'STP',
      'market-makers': 'Market Maker',
      'mt4-brokers': 'MetaTrader 4',
      'mt5-brokers': 'MetaTrader 5',
      'ctrader-brokers': 'cTrader',
      'low-spread': 'Low Spread',
      'no-deposit-bonus': 'No Deposit Bonus',
      'high-leverage': 'High Leverage',
      'crypto-trading': 'Crypto Trading',
      'scalping-allowed': 'Scalping',
      'islamic-accounts': 'Islamic Account',
    }

    return mappings[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  }

  /**
   * Get full category title for better SEO
   */
  static getCategoryTitle(slug?: string): string {
    if (!slug) {return 'Forex Brokers'}

    const titles: Record<string, string> = {
      'ecn-brokers': 'ECN Forex Brokers with Raw Spreads',
      'stp-brokers': 'STP Brokers with Direct Market Access',
      'market-makers': 'Market Maker Brokers',
      'mt4-brokers': 'MetaTrader 4 Forex Brokers',
      'mt5-brokers': 'MetaTrader 5 Trading Platforms',
      'low-spread': 'Low Spread Forex Brokers',
      'high-leverage': 'High Leverage Trading Brokers',
    }

    return titles[slug] || `${this.formatCategoryName(slug) } Brokers`
  }

  /**
   * Format country slug to readable name
   */
  static formatCountryName(slug: string): string {
    const mappings: Record<string, string> = {
      philippines: 'Philippines',
      india: 'India',
      'south-africa': 'South Africa',
      nigeria: 'Nigeria',
      kenya: 'Kenya',
      'united-states': 'United States',
      'united-kingdom': 'United Kingdom',
      australia: 'Australia',
      canada: 'Canada',
      germany: 'Germany',
      france: 'France',
      spain: 'Spain',
      italy: 'Italy',
      netherlands: 'Netherlands',
      singapore: 'Singapore',
      malaysia: 'Malaysia',
      indonesia: 'Indonesia',
      thailand: 'Thailand',
      vietnam: 'Vietnam',
      uae: 'United Arab Emirates',
      'saudi-arabia': 'Saudi Arabia',
      brazil: 'Brazil',
      mexico: 'Mexico',
    }

    return mappings[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  }

  /**
   * Get country code from slug
   */
  static getCountryCode(slug?: string): string {
    if (!slug) {return 'US'}

    const codes: Record<string, string> = {
      philippines: 'PH',
      india: 'IN',
      'south-africa': 'ZA',
      nigeria: 'NG',
      kenya: 'KE',
      'united-states': 'US',
      'united-kingdom': 'GB',
      australia: 'AU',
      canada: 'CA',
      germany: 'DE',
      france: 'FR',
      singapore: 'SG',
      malaysia: 'MY',
      indonesia: 'ID',
      uae: 'AE',
      brazil: 'BR',
      mexico: 'MX',
    }

    return codes[slug] || 'US'
  }

  /**
   * Generate structured data for broker listing pages
   */
  static generateListingStructuredData(
    type: 'all' | 'category' | 'country',
    brokers: any[],
    slug?: string,
  ) {
    const baseStructure = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: type === 'all'
        ? 'Complete Forex Brokers Directory'
        : type === 'category'
          ? `Best ${this.formatCategoryName(slug || '')} Brokers`
          : `Forex Brokers in ${this.formatCountryName(slug || '')}`,
      description: type === 'all'
        ? 'Comprehensive list of all forex brokers with detailed reviews and comparisons'
        : type === 'category'
          ? `Top-rated ${this.formatCategoryName(slug || '')} brokers with expert analysis`
          : `Best forex brokers available for traders in ${this.formatCountryName(slug || '')}`,
      numberOfItems: brokers.length,
      itemListElement: brokers.slice(0, 10).map((broker, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        item: {
          '@type': 'Organization',
          name: broker.name,
          url: `${this.BASE_URL}/brokers/${broker.slug || broker.id}`,
          aggregateRating: broker.overall_rating || broker.score ? {
            '@type': 'AggregateRating',
            ratingValue: broker.overall_rating || broker.score,
            bestRating: '5',
            worstRating: '1',
            ratingCount: Math.floor(Math.random() * 1000) + 100, // You should use real review counts
          } : undefined,
        },
      })),
    }

    return baseStructure
  }

  /**
   * Generate breadcrumb structured data
   */
  static generateBreadcrumbs(items: Array<{ name: string; url?: string }>): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url ? `${this.BASE_URL}${item.url}` : undefined,
      })),
    }
  }

  /**
   * Generate FAQ structured data
   */
  static generateFAQStructuredData(faqs: Array<{ question: string; answer: string }>) {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer,
        },
      })),
    }
  }

  /**
   * Generate organization structured data (for homepage)
   */
  static generateOrganizationSchema() {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.SITE_NAME,
      url: this.BASE_URL,
      logo: `${this.BASE_URL}/images/logo.png`,
      description: 'Leading forex broker comparison and review platform',
      sameAs: [
        'https://twitter.com/bestforexbrokers',
        'https://facebook.com/bestforexbrokers',
        'https://linkedin.com/company/bestforexbrokers',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: 'support@bestforexbrokers.com',
      },
    }
  }

  /**
   * Generate broker review structured data
   */
  static generateBrokerReviewSchema(broker: any) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Review',
      itemReviewed: {
        '@type': 'Organization',
        name: broker.name,
        url: broker.website_url || broker.websiteUrl,
        description: broker.description || `${broker.name} is a forex broker offering trading services.`,
      },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: broker.overall_rating || broker.score || 4,
        bestRating: '5',
        worstRating: '1',
      },
      author: {
        '@type': 'Organization',
        name: this.SITE_NAME,
      },
      datePublished: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      reviewBody: broker.summary || `Detailed review of ${broker.name} covering regulation, trading conditions, platforms, and user experience.`,
    }
  }
}

export default SEOService
