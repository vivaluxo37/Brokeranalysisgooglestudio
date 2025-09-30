import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import Breadcrumbs from './Breadcrumbs';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  showBreadcrumbs?: boolean;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
  }>;
  jsonLd?: object;
  className?: string;
}

export default function MainLayout({
  children,
  title = 'Best Forex Brokers 2025 - Compare Top Trading Platforms',
  description = 'Find the best forex brokers in 2025. Compare spreads, regulation, platforms and features. Expert reviews and analysis of top trading platforms.',
  keywords = 'forex brokers, best forex brokers, forex trading, trading platforms, broker comparison',
  canonical,
  ogImage,
  showBreadcrumbs = true,
  breadcrumbs,
  jsonLd,
  className = ''
}: MainLayoutProps) {
  const defaultOgImage = '/images/og-default.jpg';
  const siteUrl = import.meta.env.VITE_SITE_URL || 'https://bestforexbrokers.com';
  
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let meta = document.querySelector(selector) as HTMLMetaElement;
      if (!meta) {
        meta = document.createElement('meta');
        if (property) {
          meta.setAttribute('property', name);
        } else {
          meta.setAttribute('name', name);
        }
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', content);
    };
    
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:image', ogImage || defaultOgImage, true);
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', ogImage || defaultOgImage);
    
    // Handle JSON-LD
    if (jsonLd) {
      let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }
  }, [title, description, keywords, canonical, ogImage, jsonLd]);
  
  return (
    <>

      <div className={`min-h-screen bg-gray-50 ${className}`}>
        <Header />
        
        <main className="flex-1">
          {showBreadcrumbs && breadcrumbs && (
            <div className="bg-white border-b">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <Breadcrumbs items={breadcrumbs} />
              </div>
            </div>
          )}
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  );
}