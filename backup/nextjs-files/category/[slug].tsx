import { GetStaticPaths, GetStaticProps } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { FunnelIcon, AdjustmentsHorizontalIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import MainLayout from '@/components/layout/MainLayout';
import BrokerCard from '@/components/common/BrokerCard';
import { CATEGORIES, getCategoryBySlug, getCategoriesByType } from '@/lib/constants/categories';

interface CategoryPageProps {
  category: any;
  brokers: any[];
  totalCount: number;
  relatedCategories: any[];
  seoContent: {
    title: string;
    description: string;
    keywords: string;
    h1: string;
    introText: string;
    faqs: Array<{
      question: string;
      answer: string;
    }>;
  };
}

interface FilterState {
  minDeposit: string;
  regulation: string;
  platforms: string[];
  leverage: string;
  spreads: string;
  sortBy: string;
}

export default function CategoryPage({ 
  category, 
  brokers, 
  totalCount, 
  relatedCategories,
  seoContent 
}: CategoryPageProps) {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    minDeposit: '',
    regulation: '',
    platforms: [],
    leverage: '',
    spreads: '',
    sortBy: 'rating'
  });
  const [showFilters, setShowFilters] = useState(false);

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  const breadcrumbs = [
    { label: 'Categories', href: '/categories' },
    { label: category.name }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": seoContent.title,
    "description": seoContent.description,
    "url": `https://bestforexbrokers.com/category/${category.slug}`,
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": totalCount,
      "itemListElement": brokers.map((broker, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://bestforexbrokers.com/broker/${broker.slug}`,
        "name": broker.name
      }))
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    // TODO: Apply filters and update results
  };

  const clearFilters = () => {
    setFilters({
      minDeposit: '',
      regulation: '',
      platforms: [],
      leverage: '',
      spreads: '',
      sortBy: 'rating'
    });
  };

  return (
    <MainLayout
      title={seoContent.title}
      description={seoContent.description}
      keywords={seoContent.keywords}
      canonical={`https://bestforexbrokers.com/category/${category.slug}`}
      breadcrumbs={breadcrumbs}
      jsonLd={jsonLd}
    >
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {seoContent.h1}
            </h1>
            <p className="text-xl text-gray-600 mb-6">
              {seoContent.introText}
            </p>
            
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {category.type.replace('_', ' ').toUpperCase()}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                {totalCount} Brokers
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 flex-shrink-0">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
              >
                <FunnelIcon className="h-5 w-5 mr-2" />
                Filters
                <ChevronDownIcon className={`ml-2 h-4 w-4 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
            </div>

            {/* Filters */}
            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Clear All
                  </button>
                </div>

                {/* Sort By */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="popular">Most Popular</option>
                    <option value="min_deposit">Lowest Min Deposit</option>
                    <option value="spreads">Tightest Spreads</option>
                    <option value="leverage">Highest Leverage</option>
                  </select>
                </div>

                {/* Minimum Deposit */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Deposit
                  </label>
                  <select
                    value={filters.minDeposit}
                    onChange={(e) => handleFilterChange('minDeposit', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Any Amount</option>
                    <option value="0">No Minimum</option>
                    <option value="1-100">$1 - $100</option>
                    <option value="101-500">$101 - $500</option>
                    <option value="501-1000">$501 - $1,000</option>
                    <option value="1000+">$1,000+</option>
                  </select>
                </div>

                {/* Regulation */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Regulation
                  </label>
                  <select
                    value={filters.regulation}
                    onChange={(e) => handleFilterChange('regulation', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Regulators</option>
                    <option value="fca">FCA (UK)</option>
                    <option value="asic">ASIC (Australia)</option>
                    <option value="cysec">CySEC (Cyprus)</option>
                    <option value="cftc">CFTC (US)</option>
                    <option value="bafin">BaFin (Germany)</option>
                    <option value="finma">FINMA (Switzerland)</option>
                  </select>
                </div>

                {/* Maximum Leverage */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Leverage
                  </label>
                  <select
                    value={filters.leverage}
                    onChange={(e) => handleFilterChange('leverage', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Any Leverage</option>
                    <option value="1-30">1:1 - 30:1</option>
                    <option value="31-100">31:1 - 100:1</option>
                    <option value="101-500">101:1 - 500:1</option>
                    <option value="500+">500:1+</option>
                  </select>
                </div>

                {/* Platforms */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Trading Platforms
                  </label>
                  <div className="space-y-2">
                    {['MetaTrader 4', 'MetaTrader 5', 'cTrader', 'TradingView', 'Proprietary'].map(platform => (
                      <label key={platform} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.platforms.includes(platform)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleFilterChange('platforms', [...filters.platforms, platform]);
                            } else {
                              handleFilterChange('platforms', filters.platforms.filter(p => p !== platform));
                            }
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        />
                        <span className="text-sm text-gray-700">{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Related Categories */}
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Related Categories</h3>
                <div className="space-y-2">
                  {relatedCategories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/category/${cat.slug}`}
                      className="block text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {totalCount} {category.name} Found
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Showing brokers that match your criteria
                </p>
              </div>

              <div className="hidden sm:flex items-center space-x-2">
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" />
                <span className="text-sm text-gray-500">
                  Sorted by {filters.sortBy.replace('_', ' ')}
                </span>
              </div>
            </div>

            {/* Broker Cards */}
            <div className="space-y-6 mb-12">
              {brokers.map((broker, index) => (
                <BrokerCard
                  key={broker.id}
                  broker={broker}
                  priority={index + 1}
                  className="lg:flex lg:items-center lg:space-x-6"
                />
              ))}
            </div>

            {/* Pagination */}
            {totalCount > 10 && (
              <div className="flex items-center justify-center space-x-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  Previous
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
                  1
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  2
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  Next
                </button>
              </div>
            )}
          </div>
        </div>

        {/* FAQ Section */}
        {seoContent.faqs && seoContent.faqs.length > 0 && (
          <div className="mt-16 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {seoContent.faqs.map((faq, index) => (
                <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Generate paths for all categories
  const paths = CATEGORIES.map((category) => ({
    params: { slug: category.slug }
  }));

  return {
    paths,
    fallback: false
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return {
      notFound: true
    };
  }

  // TODO: Fetch actual broker data based on category criteria
  // For now, we'll use mock data
  const brokers = [
    {
      id: '1',
      name: 'IC Markets',
      slug: 'ic-markets',
      overall_rating: 4.8,
      min_deposit: 200,
      min_deposit_currency: '$',
      max_leverage: 500,
      spreads_from: 0.0,
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
    }
  ];

  // Get related categories from the same type
  const relatedCategories = getCategoriesByType(category.type)
    .filter(cat => cat.slug !== category.slug)
    .slice(0, 6);

  const seoContent = {
    title: category.seoTitle,
    description: category.metaDescription,
    keywords: category.keywords.join(', '),
    h1: `Best ${category.name} 2025`,
    introText: `Discover the top ${category.name.toLowerCase()} for 2025. Compare features, spreads, and regulation to find the perfect broker for your trading needs.`,
    faqs: [
      {
        question: `What are ${category.name.toLowerCase()}?`,
        answer: category.description
      },
      {
        question: `How do I choose the best ${category.name.toLowerCase().slice(0, -1)}?`,
        answer: `When choosing ${category.name.toLowerCase()}, consider factors like regulation, spreads, platforms offered, minimum deposit requirements, and customer service quality. Our reviews provide detailed analysis of each broker to help you make an informed decision.`
      }
    ]
  };

  return {
    props: {
      category,
      brokers,
      totalCount: brokers.length,
      relatedCategories,
      seoContent
    },
    revalidate: 3600
  };
};