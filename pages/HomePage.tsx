
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Icons } from '../constants';
import { useBrokers } from '../hooks/useBrokers';
import JsonLdSchema from '../components/common/JsonLdSchema';
import { useTranslation } from '../hooks/useTranslation';
import TradingViewWidget from '../components/tools/tradingview/TradingViewWidget';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import { categoryPageGroups } from './categoryPageData';
import { getCategoriesByType, POPULAR_CATEGORIES } from '../lib/constants/categories';
import { POPULAR_COUNTRIES } from '../lib/constants/countries';

// New AccordionItem component
const AccordionItem: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-input last:border-b-0">
      <button
        className="flex justify-between items-center w-full py-5 text-left text-lg font-semibold"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <Icons.chevronDown className={`h-6 w-6 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      <div
        className={`grid transition-all duration-300 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="pb-5 text-card-foreground/70">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

const AdvancedChartWidget: React.FC = () => (
    <div className="h-[400px] md:h-[500px] rounded-xl overflow-hidden border border-input">
        <TradingViewWidget
            widgetType="advanced_chart"
            options={{
                "autosize": true,
                "symbol": "FX:EURUSD",
                "interval": "D",
                "timezone": "Etc/UTC",
                "theme": "dark", // Adapted by component
                "style": "1",
                "locale": "en",
                "enable_publishing": false,
                "allow_symbol_change": true,
                "container_id": "tradingview_advanced_chart"
            }}
        />
    </div>
);


const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { brokers, loading, error } = useBrokers();
  const brokerLogos = brokers.slice(0, 6).map(b => ({ name: b.name, logoUrl: b.logoUrl, websiteUrl: b.websiteUrl }));
  const features = [
    { 
      icon: <Icons.data className="h-8 w-8 text-blue-600" />, 
      title: t('home.features.data.title'), 
      description: t('home.features.data.description') 
    },
    { 
      icon: <Icons.brainCircuit className="h-8 w-8 text-blue-600" />, 
      title: t('home.features.matching.title'), 
      description: t('home.features.matching.description') 
    },
    { 
      icon: <Icons.layers className="h-8 w-8 text-blue-600" />, 
      title: t('home.features.comparison.title'), 
      description: t('home.features.comparison.description')
    },
    { 
      icon: <Icons.shieldCheck className="h-8 w-8 text-blue-600" />, 
      title: t('home.features.trust.title'), 
      description: t('home.features.trust.description')
    }
  ];

  // Remove popularCategories - we'll use the cleaner POPULAR_CATEGORIES instead

  const regionalCategories = categoryPageGroups.region.map(region => ({
    name: region.name,
    path: region.path,
    flag: getRegionFlag(region.name)
  }));

  const toolsAndResources = [
    { title: 'Broker Comparison', href: '/compare', description: 'Side-by-side detailed comparison', icon: <Icons.layers className="h-6 w-6 text-blue-600" /> },
    { title: 'Cost Analyzer', href: '/cost-analyzer', description: 'Calculate your trading costs', icon: <Icons.calculator className="h-6 w-6 text-blue-600" /> },
    { title: 'Broker Matcher', href: '/broker-matcher', description: 'Find your perfect broker', icon: <Icons.target className="h-6 w-6 text-blue-600" /> },
    { title: 'Economic Calendar', href: '/tools/economic-calendar', description: 'Track market events', icon: <Icons.calendar className="h-6 w-6 text-blue-600" /> }
  ];

  function getRegionFlag(regionName: string): string {
    if (regionName.includes('Europe')) return '🇪🇺';
    if (regionName.includes('North America')) return '🇺🇸';
    if (regionName.includes('Asia-Pacific')) return '🌏';
    if (regionName.includes('Middle East')) return '🕌';
    if (regionName.includes('Africa')) return '🌍';
    if (regionName.includes('International')) return '🌐';
    return '🌍';
  }

  const faqs = [
    {
      q: t('home.faqs.1.q'),
      a: t('home.faqs.1.a')
    },
    {
      q: t('home.faqs.2.q'),
      a: t('home.faqs.2.a')
    },
    {
      q: t('home.faqs.3.q'),
      a: t('home.faqs.3.a')
    }
  ];

  const faqJsonLd = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
          "@type": "Question",
          "name": faq.q,
          "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.a
          }
      }))
  };

  return (
    <div className="space-y-24 md:space-y-32">
      <JsonLdSchema data={faqJsonLd} />
      {/* Hero Section */}
      <div className="text-center pt-16 md:pt-24">
        <div className="mb-6">
          <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
            🎆 New: Best Brokers Directory 2025
          </span>
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-card-foreground">
            Find Your Perfect
            <span className="text-blue-600"> Trading Broker</span>
            <br />in 2025
        </h1>
        <p className="mt-6 max-w-4xl mx-auto text-lg md:text-xl text-gray-600 leading-relaxed">
            Browse our comprehensive directory of <strong>50+ broker categories</strong> and <strong>80+ countries</strong>. 
            Find ECN brokers, scalping specialists, copy trading platforms, and more with expert analysis.
        </p>
        <p className="mt-4 text-sm text-gray-500">
            🛡️ Independent reviews • 📊 Real data • 🎆 Updated for 2025
        </p>
        <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/best-brokers" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
                    🏆 Explore Best Brokers Directory
                </Button>
            </Link>
            <Link to="/broker-matcher" className="w-full sm:w-auto">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto border-2 border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-4">
                    🎯 Broker Matcher
                </Button>
            </Link>
        </div>
        
        {/* Quick Access Pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/best-brokers/ecn-brokers" className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                ECN Brokers
            </Link>
            <Link to="/best-brokers/scalping" className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                Scalping Brokers
            </Link>
            <Link to="/best-brokers/copy-trading" className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                Copy Trading
            </Link>
            <Link to="/best-brokers/metatrader4-mt4" className="bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 px-4 py-2 rounded-full text-sm font-medium transition-colors">
                MT4 Brokers
            </Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-foreground/70">
            {(t('home.hero.trustBadges') as string[]).map((badge: string, index: number) => (
                <span key={index} className="flex items-center gap-2">
                    <Icons.checkCircle className="h-4 w-4 text-blue-500" />
                    {badge}
                </span>
            ))}
        </div>
        <div className="mt-16">
            <p className="text-sm text-foreground/60 uppercase tracking-wider">{t('home.trustedBy')}</p>
            <div className="mt-4 flex justify-center items-center gap-6 sm:gap-8 flex-wrap">
                {loading ? (
                    <div className="flex items-center gap-4">
                        <Spinner size="sm" />
                        <span className="text-sm text-muted-foreground">Loading brokers...</span>
                    </div>
                ) : error ? (
                    <div className="text-sm text-red-500">Failed to load brokers</div>
                ) : (
                    brokerLogos.map(logo => (
                        <a key={logo.name} href={logo.websiteUrl} target="_blank" rel="noopener noreferrer" title={`Visit ${logo.name}`}>
                            <img src={logo.logoUrl} alt={logo.name} className="h-8 object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all" />
                        </a>
                    ))
                )}
            </div>
        </div>
      </div>
      
      {/* Best Brokers Directory Showcase */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20 -mx-4 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-blue-600 text-white p-3 rounded-full mr-4">
              <Icons.star className="h-8 w-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Best Brokers Directory 2025
            </h2>
          </div>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            The most comprehensive broker directory with 50+ categories and country-specific listings
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Icons.layers className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">50+ Categories</h3>
              <p className="text-gray-600">Browse by execution type, trading strategy, platform features, and more</p>
              <Link to="/best-brokers" className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium">
                Explore Categories →
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Icons.globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">80+ Countries</h3>
              <p className="text-gray-600">Find brokers available in your country with local regulation</p>
              <Link to="/countries" className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium">
                Browse Countries →
              </Link>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Icons.shieldCheck className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Expert Analysis</h3>
              <p className="text-gray-600">Independent reviews with detailed scoring and comparison</p>
              <Link to="/methodology" className="inline-block mt-4 text-blue-600 hover:text-blue-700 font-medium">
                Our Method →
              </Link>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/best-brokers">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
                🎆 Explore Directory
              </Button>
            </Link>
            <Link to="/compare">
              <Button size="lg" variant="secondary" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
                🔍 Compare Brokers
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Live Chart Section */}
      <div className="max-w-6xl mx-auto">
         <AdvancedChartWidget />
      </div>

      {/* Features Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-10">{t('home.whyChoose')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map(feature => (
            <div key={feature.title} className="p-6 bg-white rounded-lg border border-gray-200 text-left flex flex-col items-start hover:border-blue-300 hover:shadow-lg transition-all">
                <div className="p-3 bg-blue-50 rounded-full mb-4">
                    {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600 flex-grow">{feature.description}</p>
            </div>
            ))}
        </div>
      </div>
      
       {/* New Tools Section */}
       <div className="text-center">
        <h2 className="text-3xl font-bold mb-10">{t('home.newTools.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link to="/tools/economic-calendar" className="group block p-6 bg-white rounded-lg border border-gray-200 text-left hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="p-3 bg-blue-50 rounded-full mb-4 inline-block group-hover:bg-blue-100 transition-colors">
                    <Icons.calendar className="h-8 w-8 text-blue-600"/>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{t('home.newTools.calendar.title')}</h3>
                <p className="mt-2 text-gray-600">{t('home.newTools.calendar.description')}</p>
            </Link>
             <Link to="/tools/calculators" className="group block p-6 bg-white rounded-lg border border-gray-200 text-left hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="p-3 bg-blue-50 rounded-full mb-4 inline-block group-hover:bg-blue-100 transition-colors">
                    <Icons.calculator className="h-8 w-8 text-blue-600"/>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{t('home.newTools.calculators.title')}</h3>
                <p className="mt-2 text-gray-600">{t('home.newTools.calculators.description')}</p>
            </Link>
        </div>
       </div>

      {/* Popular Broker Categories Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Popular Broker Categories</h2>
        <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">Find the perfect broker for your specific trading needs</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {POPULAR_CATEGORIES.slice(0, 8).map(category => (
            <Link to={`/best-brokers/${category.slug}`} key={category.slug} className="group block p-6 bg-white rounded-lg border border-gray-200 text-left hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="p-3 bg-blue-50 rounded-full mb-4 inline-block group-hover:bg-blue-100 transition-colors">
                    <Icons.star className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{category.shortName}</h3>
                <p className="text-gray-600 text-sm line-clamp-2">{category.description.slice(0, 80)}...</p>
                <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
                  Explore Category 
                  <Icons.chevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
            </Link>
            ))}
        </div>
        
        <div className="mt-10">
          <Link to="/best-brokers">
            <Button size="lg" variant="secondary" className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-8 py-3">
              View All 50+ Categories →
            </Button>
          </Link>
        </div>
      </div>

      {/* Popular Countries Section */}
      <div className="text-center bg-gradient-to-br from-blue-50 to-indigo-100 -mx-4 px-4 py-20">
        <h2 className="text-3xl font-bold mb-4 text-gray-900">Find Brokers by Country</h2>
        <p className="text-lg text-gray-600 mb-10 max-w-3xl mx-auto">Discover brokers available in your country with local regulation and support</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 max-w-6xl mx-auto mb-10">
            {POPULAR_COUNTRIES.slice(0, 12).map(country => (
            <Link to={`/best-forex-brokers/${country.slug}`} key={country.slug} className="group block p-4 bg-white rounded-lg shadow-sm border border-gray-200 text-center hover:border-blue-500 hover:shadow-md hover:-translate-y-1 transition-all">
                <div className="text-4xl mb-2">{country.flag}</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{country.name}</h3>
                <p className="text-xs text-gray-500">View Brokers</p>
            </Link>
            ))}
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/countries">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3">
              🌍 View All Countries
            </Button>
          </Link>
          <Link to="/best-brokers">
            <Button size="lg" variant="secondary" className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3">
              Browse by Category
            </Button>
          </Link>
        </div>
      </div>

      {/* Tools & Resources Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-4">Trading Tools & Resources</h2>
        <p className="text-lg text-foreground/70 mb-10 max-w-3xl mx-auto">Powerful tools to enhance your trading experience</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {toolsAndResources.map(tool => (
            <Link to={tool.href} key={tool.title} className="group block p-6 bg-white rounded-lg border border-gray-200 text-left hover:border-blue-500 hover:shadow-lg hover:-translate-y-1 transition-all">
                <div className="p-3 bg-blue-50 rounded-full mb-4 inline-block group-hover:bg-blue-100 transition-colors">
                    {tool.icon}
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{tool.title}</h3>
                <p className="text-gray-600 text-sm">{tool.description}</p>
            </Link>
            ))}
        </div>
      </div>


      {/* How it Works Section */}
       <div className="text-center max-w-4xl mx-auto">
         <h2 className="text-3xl font-bold mb-10">{t('home.howItWorksTitle')}</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Dashed line connector for desktop */}
            <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-0 w-full h-px border-t-2 border-dashed border-input -z-10"></div>
            
            <div className="flex flex-col items-center p-6 bg-card border border-input rounded-lg">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-900/50 border-2 border-primary-700 text-2xl font-bold text-primary-300 mb-4">1</div>
                <h3 className="text-xl font-bold mb-2">{t('home.steps.1.title')}</h3>
                <p className="text-card-foreground/80">{t('home.steps.1.description')}</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-card border border-input rounded-lg">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-900/50 border-2 border-primary-700 text-2xl font-bold text-primary-300 mb-4">2</div>
                <h3 className="text-xl font-bold mb-2">{t('home.steps.2.title')}</h3>
                <p className="text-card-foreground/80">{t('home.steps.2.description')}</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-card border border-input rounded-lg">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary-900/50 border-2 border-primary-700 text-2xl font-bold text-primary-300 mb-4">3</div>
                <h3 className="text-xl font-bold mb-2">{t('home.steps.3.title')}</h3>
                <p className="text-card-foreground/80">{t('home.steps.3.description')}</p>
            </div>
         </div>
       </div>

      {/* Social Proof Section */}
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-10">{t('home.socialProofTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-6 bg-card rounded-lg border border-input text-left">
                <p className="text-card-foreground/90 italic">{t('home.testimonials.1.quote')}</p>
                <p className="mt-4 font-semibold text-primary-400">{t('home.testimonials.1.author')}</p>
            </div>
             <div className="p-6 bg-card rounded-lg border border-input text-left">
                <p className="text-card-foreground/90 italic">{t('home.testimonials.2.quote')}</p>
                <p className="mt-4 font-semibold text-primary-400">{t('home.testimonials.2.author')}</p>
            </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">{t('home.faqTitle')}</h2>
        <div className="bg-card rounded-lg border border-input divide-y divide-input">
            {faqs.map(faq => (
                <AccordionItem key={faq.q} title={faq.q}>
                    <p>{faq.a}</p>
                </AccordionItem>
            ))}
        </div>
      </div>

    </div>
  );
};

export default HomePage;
