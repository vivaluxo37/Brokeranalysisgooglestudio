
import React, { useEffect } from 'react';

interface MetaTagsProps {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl?: string;
  type?: 'website' | 'article' | 'product' | 'broker';
  publishDate?: string;
  modifiedDate?: string;
  author?: string;
  keywords?: string[];
  locale?: string;
  noIndex?: boolean;
  breadcrumbs?: Array<{ name: string; url: string }>;
  price?: string;
  currency?: string;
  availability?: 'in stock' | 'out of stock' | 'preorder';
  rating?: number;
  reviewCount?: number;
}

const MetaTags: React.FC<MetaTagsProps> = ({
  title,
  description,
  canonicalUrl,
  imageUrl,
  type = 'website',
  publishDate,
  modifiedDate,
  author,
  keywords = [],
  locale = 'en_US',
  noIndex = false,
  breadcrumbs,
  price,
  currency = 'USD',
  availability,
  rating,
  reviewCount,
}) => {
  useEffect(() => {
    // Set Title with site name
    const siteName = 'BrokerAnalysis';
    const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;
    document.title = fullTitle;

    // Helper to set/create meta tags
    const setMetaTag = (attr: 'name' | 'property' | 'http-equiv', value: string, content: string) => {
      let element = document.querySelector(`meta[${attr}='${value}']`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, value);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set/create link tags
    const setLinkTag = (rel: string, href: string, attributes?: Record<string, string>) => {
      let element = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement;
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          element.setAttribute(key, value);
        });
      }
    };

    // Remove existing tags to avoid duplicates
    const cleanupTags = () => {
      const tagsToRemove = document.querySelectorAll('meta[data-dynamic="true"]');
      tagsToRemove.forEach(tag => tag.remove());
    };

    cleanupTags();

    // Robots meta tag
    if (noIndex) {
      setMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag('name', 'robots', 'index, follow');
    }

    // Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords.join(', '));
    setMetaTag('name', 'author', author || 'BrokerAnalysis Team');
    setLinkTag('canonical', canonicalUrl);

    // Viewport and compatibility
    setMetaTag('name', 'viewport', 'width=device-width, initial-scale=1');
    setMetaTag('http-equiv', 'Content-Type', 'text/html; charset=utf-8');
    setMetaTag('name', 'theme-color', '#2563eb');

    // Open Graph (Facebook, LinkedIn, etc.)
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', siteName);
    setMetaTag('property', 'og:locale', locale);

    if (imageUrl) {
      setMetaTag('property', 'og:image', imageUrl);
      setMetaTag('property', 'og:image:width', '1200');
      setMetaTag('property', 'og:image:height', '630');
      setMetaTag('property', 'og:image:alt', title);
    }

    // Article specific Open Graph tags
    if (type === 'article' && publishDate) {
      setMetaTag('property', 'article:published_time', publishDate);
      if (modifiedDate) {
        setMetaTag('property', 'article:modified_time', modifiedDate);
      }
      if (author) {
        setMetaTag('property', 'article:author', author);
      }
    }

    // Product specific tags
    if (type === 'product' && price) {
      setMetaTag('property', 'product:price:amount', price);
      setMetaTag('property', 'product:price:currency', currency);
      if (availability) {
        setMetaTag('property', 'product:availability', availability);
      }
    }

    // Twitter Card
    setMetaTag('name', 'twitter:card', imageUrl ? 'summary_large_image' : 'summary');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:site', '@brokeranalysis');

    if (imageUrl) {
      setMetaTag('name', 'twitter:image', imageUrl);
      setMetaTag('name', 'twitter:image:alt', title);
    }

    // Additional SEO tags
    setMetaTag('name', 'format-detection', 'telephone=no');
    setMetaTag('name', 'apple-mobile-web-app-capable', 'yes');
    setMetaTag('name', 'apple-mobile-web-app-status-bar-style', 'default');
    setMetaTag('name', 'apple-mobile-web-app-title', siteName);

    // Hreflang tags for international SEO
    const supportedLocales = ['en_US', 'en_GB', 'en_AU', 'en_CA'];
    supportedLocales.forEach(loc => {
      setLinkTag('alternate', canonicalUrl.replace(/\/$/, ''), { hreflang: loc.toLowerCase() });
    });

    // DNS prefetch for performance
    const prefetchDomains = [
      'https://fonts.googleapis.com',
      'https://fonts.gstatic.com',
      'https://s3.tradingview.com'
    ];

    prefetchDomains.forEach(domain => {
      setLinkTag('dns-prefetch', domain);
    });

    // Preconnect for critical third-party resources
    setLinkTag('preconnect', 'https://fonts.googleapis.com', { crossorigin: 'anonymous' });
    setLinkTag('preconnect', 'https://fonts.gstatic.com', { crossorigin: 'anonymous' });

    // Mark dynamic tags for cleanup
    document.querySelectorAll('meta[content], link[href]').forEach(tag => {
      if (!tag.hasAttribute('data-dynamic')) {
        tag.setAttribute('data-dynamic', 'true');
      }
    });

  }, [title, description, canonicalUrl, imageUrl, type, publishDate, modifiedDate, author, keywords, locale, noIndex, breadcrumbs, price, currency, availability, rating, reviewCount]);

  return null;
};

export default MetaTags;
