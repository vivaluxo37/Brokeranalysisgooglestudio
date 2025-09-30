import { GetStaticProps } from 'next';
import Link from 'next/link';
import { 
  ChartBarIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  CogIcon,
  AcademicCapIcon,
  DevicePhoneMobileIcon
} from '@heroicons/react/24/outline';
import MainLayout from '@/components/layout/MainLayout';

interface Category {
  slug: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  broker_count: number;
  featured_brokers: string[];
  color: string;
  gradient: string;
}

interface CategoriesPageProps {
  categories: Category[];
  totalBrokers: number;
}

const categoryIcons: { [key: string]: React.ComponentType<any> } = {
  'ecn-brokers': ChartBarIcon,
  'market-makers': CurrencyDollarIcon,
  'stp-brokers': GlobeAltIcon,
  'regulated-brokers': ShieldCheckIcon,
  'social-trading': UserGroupIcon,
  'micro-account': CogIcon,
  'educational-brokers': AcademicCapIcon,
  'mobile-trading': DevicePhoneMobileIcon
};

export default function CategoriesPage({ categories, totalBrokers }: CategoriesPageProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Forex Broker Categories - Browse by Type",
    "description": "Browse forex brokers by category. Find ECN brokers, market makers, STP brokers, and more specialized trading categories.",
    "url": "https://bestforexbrokers.com/categories",
    "mainEntity": {
      "@type": "ItemList",
      "numberOfItems": categories.length,
      "itemListElement": categories.map((category, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://bestforexbrokers.com/categories/${category.slug}`,
        "name": category.name,
        "description": category.description
      }))
    }
  };

  return (
    <MainLayout
      title="Forex Broker Categories 2025 - Browse by Type"
      description="Browse forex brokers by category. Find ECN brokers, market makers, STP brokers, regulated brokers, and more specialized trading categories."
      keywords="forex broker categories, ECN brokers, market makers, STP brokers, regulated brokers, social trading brokers"
      canonical="https://bestforexbrokers.com/categories"
      breadcrumbs={[{ label: 'Categories' }]}
      jsonLd={jsonLd}
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Browse Brokers by Category
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Find the perfect forex broker for your trading style. Browse our {categories.length} specialized 
              categories covering {totalBrokers} brokers worldwide.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
              <Link
                href="/brokers"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                View All Brokers
              </Link>
              <Link
                href="/compare"
                className="border border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
              >
                Compare Brokers
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {categories.map((category) => {
            const IconComponent = category.icon;
            
            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group block"
              >
                <div className={`relative overflow-hidden rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${category.gradient}`}>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent to-black/20"></div>
                  
                  <div className="relative p-8 text-white">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-lg bg-white/20 backdrop-blur-sm`}>
                        <IconComponent className="h-8 w-8" />
                      </div>
                      <span className="text-sm font-medium bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                        {category.broker_count} brokers
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-100 transition-colors">
                      {category.name}
                    </h3>
                    
                    <p className="text-white/90 mb-4 line-clamp-2">
                      {category.description}
                    </p>
                    
                    {category.featured_brokers.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-white/80">Featured brokers:</p>
                        <div className="flex flex-wrap gap-2">
                          {category.featured_brokers.slice(0, 3).map((broker) => (
                            <span
                              key={broker}
                              className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded"
                            >
                              {broker}
                            </span>
                          ))}
                          {category.featured_brokers.length > 3 && (
                            <span className="text-xs bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
                              +{category.featured_brokers.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Popular Categories Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Most Popular Categories
          </h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            These are the most searched broker categories by traders worldwide.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {categories
              .sort((a, b) => b.broker_count - a.broker_count)
              .slice(0, 4)
              .map((category) => {
                const IconComponent = category.icon;
                
                return (
                  <Link
                    key={`popular-${category.slug}`}
                    href={`/categories/${category.slug}`}
                    className="group flex items-center p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
                  >
                    <div className={`p-4 rounded-lg mr-6 ${category.color}`}>
                      <IconComponent className="h-8 w-8 text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 mb-2 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="font-medium">{category.broker_count} brokers</span>
                        <span className="mx-2">•</span>
                        <span>{category.featured_brokers.length} featured</span>
                      </div>
                    </div>
                    
                    <div className="text-blue-600 group-hover:translate-x-1 transition-transform">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gray-50 rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Can't Find What You're Looking For?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Browse our complete directory of forex brokers or use our advanced search 
            to find brokers that match your specific requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/brokers"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Browse All Brokers
            </Link>
            <Link
              href="/search"
              className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Advanced Search
            </Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  // TODO: Fetch actual category data from database
  // For now, we'll use mock data
  const mockCategories: Category[] = [
    {
      slug: 'ecn-brokers',
      name: 'ECN Brokers',
      description: 'Electronic Communication Network brokers offering direct market access with tight spreads and transparent pricing.',
      icon: categoryIcons['ecn-brokers'],
      broker_count: 45,
      featured_brokers: ['IC Markets', 'Pepperstone', 'FP Markets'],
      color: 'bg-blue-600',
      gradient: 'bg-gradient-to-br from-blue-500 to-blue-700'
    },
    {
      slug: 'market-makers',
      name: 'Market Makers',
      description: 'Brokers that provide liquidity by taking the opposite side of your trades, often with fixed spreads.',
      icon: categoryIcons['market-makers'],
      broker_count: 38,
      featured_brokers: ['OANDA', 'FXCM', 'Plus500'],
      color: 'bg-green-600',
      gradient: 'bg-gradient-to-br from-green-500 to-green-700'
    },
    {
      slug: 'stp-brokers',
      name: 'STP Brokers',
      description: 'Straight Through Processing brokers that route orders directly to liquidity providers without dealing desk intervention.',
      icon: categoryIcons['stp-brokers'],
      broker_count: 52,
      featured_brokers: ['XM', 'FXTM', 'Admiral Markets'],
      color: 'bg-purple-600',
      gradient: 'bg-gradient-to-br from-purple-500 to-purple-700'
    },
    {
      slug: 'regulated-brokers',
      name: 'Highly Regulated',
      description: 'Brokers regulated by top-tier financial authorities like FCA, ASIC, CySEC, and CFTC.',
      icon: categoryIcons['regulated-brokers'],
      broker_count: 67,
      featured_brokers: ['eToro', 'Interactive Brokers', 'Saxo Bank'],
      color: 'bg-red-600',
      gradient: 'bg-gradient-to-br from-red-500 to-red-700'
    },
    {
      slug: 'social-trading',
      name: 'Social Trading',
      description: 'Brokers offering copy trading and social trading features to follow and copy successful traders.',
      icon: categoryIcons['social-trading'],
      broker_count: 23,
      featured_brokers: ['eToro', 'ZuluTrade', 'Darwinex'],
      color: 'bg-indigo-600',
      gradient: 'bg-gradient-to-br from-indigo-500 to-indigo-700'
    },
    {
      slug: 'micro-account',
      name: 'Micro Accounts',
      description: 'Brokers offering micro accounts with low minimum deposits, perfect for beginners and small-scale traders.',
      icon: categoryIcons['micro-account'],
      broker_count: 41,
      featured_brokers: ['XM', 'Exness', 'HotForex'],
      color: 'bg-yellow-600',
      gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-700'
    },
    {
      slug: 'educational-brokers',
      name: 'Educational Resources',
      description: 'Brokers providing comprehensive educational materials, webinars, and trading courses for skill development.',
      icon: categoryIcons['educational-brokers'],
      broker_count: 29,
      featured_brokers: ['XM', 'Admiral Markets', 'AvaTrade'],
      color: 'bg-teal-600',
      gradient: 'bg-gradient-to-br from-teal-500 to-teal-700'
    },
    {
      slug: 'mobile-trading',
      name: 'Mobile Trading',
      description: 'Brokers with excellent mobile trading apps and platforms optimized for smartphone and tablet trading.',
      icon: categoryIcons['mobile-trading'],
      broker_count: 56,
      featured_brokers: ['IG', 'Plus500', 'Capital.com'],
      color: 'bg-pink-600',
      gradient: 'bg-gradient-to-br from-pink-500 to-pink-700'
    }
  ];

  const totalBrokers = mockCategories.reduce((sum, cat) => sum + cat.broker_count, 0);

  return {
    props: {
      categories: mockCategories,
      totalBrokers
    },
    revalidate: 3600 // Revalidate every hour
  };
};