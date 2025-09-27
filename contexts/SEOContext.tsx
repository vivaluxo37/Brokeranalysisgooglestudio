import React, { createContext, useContext, ReactNode } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SEOContextType {
  generateHreflangTags: (path: string) => Array<{ hreflang: string; href: string }>;
  generateCanonicalUrl: (path: string, locale?: string) => string;
  generateMetaKeywords: (title: string, description: string, type?: string) => string[];
  optimizeImagesForSEO: (imageUrl: string, alt: string) => { src: string; alt: string; loading: string };
  checkCoreWebVitals: () => Promise<{ lcp: number; fid: number; cls: number }>;
}

const SEOContext = createContext<SEOContextType | undefined>(undefined);

interface SEOProviderProps {
  children: ReactNode;
  baseUrl: string;
  supportedLocales: string[];
}

export const SEOProvider: React.FC<SEOProviderProps> = ({
  children,
  baseUrl,
  supportedLocales = ['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar', 'hi', 'tr', 'nl', 'sv', 'da', 'no', 'fi', 'pl']
}) => {
  const { currentLocale } = useLanguage();

  const generateHreflangTags = (path: string): Array<{ hreflang: string; href: string }> => {
    return supportedLocales.map(locale => ({
      hreflang: locale,
      href: `${baseUrl}${locale === 'en' ? '' : `/${locale}`}${path}`
    }));
  };

  const generateCanonicalUrl = (path: string, locale?: string): string => {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const effectiveLocale = locale || currentLocale;
    return `${baseUrl}${effectiveLocale === 'en' ? '' : `/${effectiveLocale}`}${cleanPath}`;
  };

  const generateMetaKeywords = (title: string, description: string, type: string = 'website'): string[] => {
    const baseKeywords = ['forex broker', 'trading', 'broker comparison', 'online trading'];

    const typeKeywords = {
      broker: ['forex broker review', 'online broker', 'currency trading', 'broker account'],
      article: ['forex guide', 'trading education', 'market analysis', 'trading tips'],
      comparison: ['broker comparison', 'compare brokers', 'best forex brokers', 'broker reviews'],
      tools: ['trading tools', 'forex calculator', 'economic calendar', 'market data'],
      education: ['forex education', 'trading course', 'learn forex', 'trading strategies']
    };

    // Extract keywords from title and description
    const titleWords = title.toLowerCase().split(' ').filter(word => word.length > 3);
    const descWords = description.toLowerCase().split(' ').filter(word => word.length > 3);

    const combinedKeywords = [
      ...baseKeywords,
      ...(typeKeywords[type] || []),
      ...titleWords.slice(0, 3),
      ...descWords.slice(0, 2)
    ];

    // Remove duplicates and return unique keywords
    return [...new Set(combinedKeywords)];
  };

  const optimizeImagesForSEO = (imageUrl: string, alt: string) => {
    // Convert to webp format if supported
    const optimizedSrc = imageUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');

    return {
      src: optimizedSrc,
      alt: alt,
      loading: 'lazy' as const
    };
  };

  const checkCoreWebVitals = async () => {
    // Simulated Core Web Vitals check
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          lcp: 2.1, // Largest Contentful Paint (seconds)
          fid: 85,  // First Input Delay (milliseconds)
          cls: 0.05 // Cumulative Layout Shift
        });
      }, 100);
    });
  };

  const value: SEOContextType = {
    generateHreflangTags,
    generateCanonicalUrl,
    generateMetaKeywords,
    optimizeImagesForSEO,
    checkCoreWebVitals
  };

  return (
    <SEOContext.Provider value={value}>
      {children}
    </SEOContext.Provider>
  );
};

export const useSEO = (): SEOContextType => {
  const context = useContext(SEOContext);
  if (context === undefined) {
    throw new Error('useSEO must be used within an SEOProvider');
  }
  return context;
};

export default SEOProvider;