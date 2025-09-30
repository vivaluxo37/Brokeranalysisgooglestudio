import { GetStaticProps } from 'next';
import Link from 'next/link';
import { ChevronRightIcon, StarIcon, TrophyIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import MainLayout from '@/components/layout/MainLayout';
import BrokerCard from '@/components/common/BrokerCard';
import { CATEGORIES, getCategoriesByType } from '@/lib/constants/categories';
import { POPULAR_COUNTRIES } from '@/lib/constants/countries';

interface HomePageProps {
  featuredBrokers: any[];
  topBrokers: any[];
  categories: any[];
  popularCountries: any[];
}

export default function HomePage({ 
  featuredBrokers, 
  topBrokers, 
  categories, 
  popularCountries 
}: HomePageProps) {
  
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Best Forex Brokers",
    "url": "https://bestforexbrokers.com",
    "description": "Independent reviews and comparisons of the world's best forex brokers. Find the perfect trading platform for your needs.",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://bestforexbrokers.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <MainLayout
      title="Best Forex Brokers 2025 - Compare Top Trading Platforms"
      description="Find the best forex brokers in 2025. Compare spreads, regulation, platforms and features. Expert reviews and analysis of top trading platforms."
      keywords="forex brokers, best forex brokers, forex trading, trading platforms, broker comparison, forex reviews"
      jsonLd={jsonLd}
      showBreadcrumbs={false}
    >
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Find the Best<br />
              <span className="text-blue-200">Forex Brokers</span> in 2025
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Independent reviews, detailed comparisons, and expert analysis to help you choose 
              the perfect trading platform for your needs.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Link
                href="/brokers"
                className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center"
              >
                Browse All Brokers
                <ChevronRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <Link
                href="/compare"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
              >
                Compare Brokers
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrophyIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">500+ Brokers Reviewed</h3>
                <p className="text-blue-100 text-sm">Comprehensive analysis of global brokers</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ShieldCheckIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Independent Reviews</h3>
                <p className="text-blue-100 text-sm">Unbiased analysis and transparent methodology</p>
              </div>
              
              <div className="text-center">
                <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                  <StarIcon className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Expert Analysis</h3>
                <p className="text-blue-100 text-sm">Professional traders and industry experts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Brokers */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Top Rated Brokers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our highest-rated brokers based on comprehensive analysis of regulation, 
              spreads, platforms, and customer service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredBrokers.map((broker, index) => (
              <BrokerCard
                key={broker.id}
                broker={broker}
                priority={index + 1}
              />
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/brokers"
              className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              View All Brokers
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Find Brokers by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover brokers that match your specific trading style and requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.slice(0, 12).map((category) => (
              <Link
                key={category.slug}
                href={`/category/${category.slug}`}
                className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-200 hover:border-blue-200"
              >
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                    <span className="text-blue-600 font-semibold text-lg">
                      {category.name.charAt(0)}
                    </span>
                  </div>
                  <h3 className="ml-3 font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {category.name}
                  </h3>
                </div>
                
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                  {category.description}
                </p>
                
                <div className="flex items-center text-blue-600 text-sm font-medium">
                  Browse {category.name}
                  <ChevronRightIcon className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/categories"
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              View All Categories
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Popular Countries */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Brokers by Country
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the best brokers available in your country with local regulation and support.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {popularCountries.map((country) => (
              <Link
                key={country.slug}
                href={`/country/${country.slug}`}
                className="group bg-gray-50 p-4 rounded-lg hover:bg-blue-50 transition-colors text-center"
              >
                <div className="text-3xl mb-2">{country.flag}</div>
                <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors text-sm">
                  {country.name}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link
              href="/countries"
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              View All Countries
              <ChevronRightIcon className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Trust Our Reviews?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              We provide the most comprehensive and unbiased broker reviews in the industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Regulation Check</h3>
              <p className="text-gray-300 text-sm">
                We verify regulatory status and licensing for every broker we review.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Expert Testing</h3>
              <p className="text-gray-300 text-sm">
                Real accounts, live trading, and comprehensive platform testing.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Transparent Scoring</h3>
              <p className="text-gray-300 text-sm">
                Clear methodology and scoring system for fair comparisons.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChevronRightIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Regular Updates</h3>
              <p className="text-gray-300 text-sm">
                Reviews updated regularly to reflect the latest changes and offerings.
              </p>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // TODO: Replace with actual API calls to get broker data
  // For now, we'll use mock data
  const featuredBrokers = [
    {
      id: '1',
      name: 'IC Markets',
      slug: 'ic-markets',
      logo_url: '/images/brokers/ic-markets.png',
      overall_rating: 4.8,
      min_deposit: 200,
      min_deposit_currency: '$',
      max_leverage: 500,
      spreads_from: 0.0,
      regulated: true,
      regulations: [
        { regulator: 'ASIC', license_number: '335692' },
        { regulator: 'CySEC', license_number: '362/18' }
      ],
      platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader'],
      instruments_count: 232,
      pros: ['Raw spreads from 0.0 pips', 'Excellent execution speeds'],
      cons: ['High minimum deposit for some accounts'],
      cta_text: 'Visit IC Markets',
      cta_url: 'https://icmarkets.com'
    },
    {
      id: '2',
      name: 'Pepperstone',
      slug: 'pepperstone',
      overall_rating: 4.7,
      min_deposit: 200,
      min_deposit_currency: '$',
      max_leverage: 400,
      spreads_from: 0.1,
      regulated: true,
      regulations: [
        { regulator: 'ASIC', license_number: '414530' },
        { regulator: 'FCA', license_number: '684312' }
      ],
      platforms: ['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'TradingView'],
      instruments_count: 1200,
      pros: ['TradingView integration', 'Fast execution'],
      cons: ['Limited educational resources'],
      cta_text: 'Visit Pepperstone',
      cta_url: 'https://pepperstone.com'
    },
    {
      id: '3',
      name: 'XM',
      slug: 'xm',
      overall_rating: 4.5,
      min_deposit: 5,
      min_deposit_currency: '$',
      max_leverage: 1000,
      spreads_from: 0.6,
      regulated: true,
      regulations: [
        { regulator: 'CySEC', license_number: '120/10' },
        { regulator: 'ASIC', license_number: '443670' }
      ],
      platforms: ['MetaTrader 4', 'MetaTrader 5'],
      instruments_count: 1000,
      pros: ['Very low minimum deposit', 'Excellent education'],
      cons: ['Higher spreads on standard account'],
      promotion_text: '$30 No Deposit Bonus',
      cta_text: 'Visit XM',
      cta_url: 'https://xm.com'
    }
  ];

  const categories = [
    ...getCategoriesByType('broker_type').slice(0, 4),
    ...getCategoriesByType('execution').slice(0, 3),
    ...getCategoriesByType('feature').slice(0, 5)
  ];

  return {
    props: {
      featuredBrokers,
      topBrokers: featuredBrokers, // Same for now
      categories,
      popularCountries: POPULAR_COUNTRIES.slice(0, 12)
    },
    revalidate: 3600 // Revalidate every hour
  };
};