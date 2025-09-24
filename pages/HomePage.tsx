import React, { useState } from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import Button from '../components/ui/Button';
import { Icons } from '../constants';
import { brokers } from '../data/brokers';
import JsonLdSchema from '../components/common/JsonLdSchema';
import { useTranslation } from '../hooks/useTranslation';
import TradingViewWidget from '../components/tools/tradingview/TradingViewWidget';

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
  const brokerLogos = brokers.slice(0, 6).map(b => ({ name: b.name, logoUrl: b.logoUrl, websiteUrl: b.websiteUrl }));
  const features = [
    { 
      icon: <Icons.data className="h-8 w-8 text-primary-400" />, 
      title: t('home.features.data.title'), 
      description: t('home.features.data.description') 
    },
    { 
      icon: <Icons.brainCircuit className="h-8 w-8 text-primary-400" />, 
      title: t('home.features.matching.title'), 
      description: t('home.features.matching.description') 
    },
    { 
      icon: <Icons.layers className="h-8 w-8 text-primary-400" />, 
      title: t('home.features.comparison.title'), 
      description: t('home.features.comparison.description')
    },
    { 
      icon: <Icons.shieldCheck className="h-8 w-8 text-primary-400" />, 
      title: t('home.features.trust.title'), 
      description: t('home.features.trust.description')
    }
  ];

  const popularCategories = [
    { 
      icon: <Icons.bookOpen className="h-8 w-8 text-primary-400" />, 
      title: t('home.categories.beginners.title'), 
      path: "/brokers/type/beginners",
      description: t('home.categories.beginners.description')
    },
     { 
      icon: <Icons.layers className="h-8 w-8 text-primary-400" />, 
      title: t('home.categories.ecn.title'), 
      path: "/brokers/type/ecn",
      description: t('home.categories.ecn.description')
    },
     { 
      icon: <Icons.users className="h-8 w-8 text-primary-400" />, 
      title: t('home.categories.copy.title'), 
      path: "/brokers/type/copy-trading",
      description: t('home.categories.copy.description')
    },
     { 
      icon: <Icons.trendingUp className="h-8 w-8 text-primary-400" />, 
      title: t('home.categories.leverage.title'), 
      path: "/brokers/type/high-leverage",
      description: t('home.categories.leverage.description')
    }
  ];

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
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-card-foreground">
            {t('home.hero.h1')}
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-foreground/80">
            {t('home.hero.h2')}
        </p>
        <p className="mt-3 text-sm text-foreground/60">
            {t('home.hero.supportLine')}
        </p>
        <div className="mt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <ReactRouterDOM.Link to="/broker-matcher">
                <Button size="lg" variant="primary" className="animate-pulse w-full sm:w-auto">
                    <span role="img" aria-label="search" className="ltr:mr-2 rtl:ml-2">🔍</span> {t('home.hero.ctaPrimary')}
                </Button>
            </ReactRouterDOM.Link>
            <ReactRouterDOM.Link to="/brokers">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                    {t('home.hero.ctaSecondary')}
                </Button>
            </ReactRouterDOM.Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-sm text-foreground/70">
            {(t('home.hero.trustBadges') as string[]).map((badge: string, index: number) => (
                <span key={index} className="flex items-center gap-2">
                    <Icons.checkCircle className="h-4 w-4 text-green-500" />
                    {badge}
                </span>
            ))}
        </div>
        <div className="mt-16">
            <p className="text-sm text-foreground/60 uppercase tracking-wider">{t('home.trustedBy')}</p>
            <div className="mt-4 flex justify-center items-center gap-6 sm:gap-8 flex-wrap">
                {brokerLogos.map(logo => (
                    <a key={logo.name} href={logo.websiteUrl} target="_blank" rel="noopener noreferrer" title={`Visit ${logo.name}`}>
                        <img src={logo.logoUrl} alt={logo.name} className="h-8 object-contain grayscale opacity-60 hover:opacity-100 hover:grayscale-0 transition-all" />
                    </a>
                ))}
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
            <div key={feature.title} className="p-6 bg-card rounded-lg border border-input text-left flex flex-col items-start">
                <div className="p-3 bg-input rounded-full mb-4">
                    {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-primary-400">{feature.title}</h3>
                <p className="mt-2 text-card-foreground/80 flex-grow">{feature.description}</p>
            </div>
            ))}
        </div>
      </div>
      
       {/* New Tools Section */}
       <div className="text-center">
        <h2 className="text-3xl font-bold mb-10">{t('home.newTools.title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <ReactRouterDOM.Link to="/tools/economic-calendar" className="group block p-6 bg-card rounded-lg border border-input text-left hover:border-primary-600 hover:-translate-y-1 transition-all">
                <div className="p-3 bg-input rounded-full mb-4 inline-block group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <Icons.calendar className="h-8 w-8 text-primary-400"/>
                </div>
                <h3 className="text-xl font-bold text-primary-400">{t('home.newTools.calendar.title')}</h3>
                <p className="mt-2 text-card-foreground/80">{t('home.newTools.calendar.description')}</p>
            </ReactRouterDOM.Link>
             <ReactRouterDOM.Link to="/tools/calculators" className="group block p-6 bg-card rounded-lg border border-input text-left hover:border-primary-600 hover:-translate-y-1 transition-all">
                <div className="p-3 bg-input rounded-full mb-4 inline-block group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <Icons.calculator className="h-8 w-8 text-primary-400"/>
                </div>
                <h3 className="text-xl font-bold text-primary-400">{t('home.newTools.calculators.title')}</h3>
                <p className="mt-2 text-card-foreground/80">{t('home.newTools.calculators.description')}</p>
            </ReactRouterDOM.Link>
        </div>
       </div>

       {/* Popular Categories Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-10">{t('home.popularCategoriesTitle')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {popularCategories.map(category => (
            <ReactRouterDOM.Link to={category.path} key={category.title} className="group block p-6 bg-card rounded-lg border border-input text-left hover:border-primary-600 hover:-translate-y-1 transition-all">
                <div className="p-3 bg-input rounded-full mb-4 inline-block group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    {category.icon}
                </div>
                <h3 className="text-xl font-bold text-primary-400">{category.title}</h3>
                <p className="mt-2 text-card-foreground/80">{category.description}</p>
            </ReactRouterDOM.Link>
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