
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { MetaTagData, metaTagOptimizer, useMetaTagOptimizer } from '../../services/metaTagOptimizer';

interface MetaTagsProps {
  // Legacy props for backward compatibility
  title?: string;
  description?: string;
  canonicalUrl?: string;
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
  
  // New advanced props
  metaTagData?: MetaTagData;
  optimized?: boolean;
  performanceTracking?: boolean;
}

// Function to create legacy meta tags format (moved outside component)
const createLegacyMetaTags = ({
  title,
  description,
  canonicalUrl,
  imageUrl,
  type,
  keywords,
  siteName,
  author,
  noIndex
}: any): MetaTagData => {
  const fullTitle = title.includes(siteName) ? title : `${title} | ${siteName}`;

  return {
    title: fullTitle,
    description: description,
    keywords: keywords || [],
    canonical: canonicalUrl,
    robots: noIndex ? 'noindex, nofollow' : 'index, follow',
    og: {
      title: fullTitle,
      description: description,
      type: type || 'website',
      url: canonicalUrl,
      image: imageUrl || 'https://brokeranalysis.com/images/og-default.jpg',
      imageAlt: title,
      siteName: siteName,
      locale: 'en_US'
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      site: '@brokeranalysis',
      creator: '@brokeranalysis',
      title: fullTitle,
      description: description,
      image: imageUrl || 'https://brokeranalysis.com/images/og-default.jpg',
      imageAlt: title
    },
    customMeta: [
      { name: 'author', content: author || 'Broker Analysis Team' },
      { name: 'theme-color', content: '#2563eb' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  };
};

// Function to apply meta tags to document (moved outside component)
const applyMetaTagsToDocument = (
  metaTags: MetaTagData,
  siteName: string,
  legacyProps?: {
    publishDate?: string;
    modifiedDate?: string;
    type?: string;
    price?: string;
    currency?: string;
    availability?: string;
  }
) => {
  try {
    // Set document title
    document.title = metaTags.title;

    // Helper to set/create meta tags
    const setMetaTag = (attr: 'name' | 'property' | 'http-equiv', value: string, content: string) => {
      try {
        let element = document.querySelector(`meta[${attr}='${value}']`) as HTMLMetaElement;
        if (!element) {
          element = document.createElement('meta');
          element.setAttribute(attr, value);
          document.head.appendChild(element);
        }
        element.setAttribute('content', content);
        element.setAttribute('data-dynamic', 'true');
      } catch (error) {
        console.error(`Error setting meta tag ${attr}="${value}":`, error);
      }
    };

    // Helper to set/create link tags
    const setLinkTag = (rel: string, href: string, attributes?: Record<string, string>) => {
      try {
        let element = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement;
        if (!element) {
          element = document.createElement('link');
          element.setAttribute('rel', rel);
          document.head.appendChild(element);
        }
        element.setAttribute('href', href);
        element.setAttribute('data-dynamic', 'true');
        if (attributes) {
          Object.entries(attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
          });
        }
      } catch (error) {
        console.error(`Error setting link tag rel="${rel}":`, error);
      }
    };

    // Clean up existing dynamic tags
    const cleanupTags = () => {
      try {
        const tagsToRemove = document.querySelectorAll('meta[data-dynamic="true"], link[data-dynamic="true"]');
        tagsToRemove.forEach(tag => tag.remove());
      } catch (error) {
        console.error('Error cleaning up meta tags:', error);
      }
    };

    cleanupTags();

    // Apply standard meta tags
    setMetaTag('name', 'description', metaTags.description);
    setMetaTag('name', 'keywords', metaTags.keywords.join(', '));
    setMetaTag('name', 'robots', metaTags.robots);
    setLinkTag('canonical', metaTags.canonical);

    // Apply Open Graph tags
    setMetaTag('property', 'og:title', metaTags.og.title);
    setMetaTag('property', 'og:description', metaTags.og.description);
    setMetaTag('property', 'og:type', metaTags.og.type);
    setMetaTag('property', 'og:url', metaTags.og.url);
    setMetaTag('property', 'og:image', metaTags.og.image);
    setMetaTag('property', 'og:image:alt', metaTags.og.imageAlt);
    setMetaTag('property', 'og:site_name', metaTags.og.siteName);
    setMetaTag('property', 'og:locale', metaTags.og.locale);
    setMetaTag('property', 'og:image:width', '1200');
    setMetaTag('property', 'og:image:height', '630');

    // Apply Twitter Card tags
    setMetaTag('name', 'twitter:card', metaTags.twitter.card);
    setMetaTag('name', 'twitter:site', metaTags.twitter.site);
    setMetaTag('name', 'twitter:creator', metaTags.twitter.creator);
    setMetaTag('name', 'twitter:title', metaTags.twitter.title);
    setMetaTag('name', 'twitter:description', metaTags.twitter.description);
    setMetaTag('name', 'twitter:image', metaTags.twitter.image);
    setMetaTag('name', 'twitter:image:alt', metaTags.twitter.imageAlt);

    // Apply custom meta tags
    metaTags.customMeta?.forEach(meta => {
      if (meta.name) {
        setMetaTag('name', meta.name, meta.content);
      } else if (meta.property) {
        setMetaTag('property', meta.property, meta.content);
      } else if (meta.httpEquiv) {
        setMetaTag('http-equiv', meta.httpEquiv, meta.content);
      }
    });

    // Legacy compatibility - apply additional tags for backward compatibility
    if (legacyProps?.publishDate && legacyProps.type === 'article') {
      setMetaTag('property', 'article:published_time', legacyProps.publishDate);
      if (legacyProps.modifiedDate) {
        setMetaTag('property', 'article:modified_time', legacyProps.modifiedDate);
      }
    }

    if (legacyProps?.price && legacyProps.type === 'product') {
      setMetaTag('property', 'product:price:amount', legacyProps.price);
      setMetaTag('property', 'product:price:currency', legacyProps.currency || 'USD');
      if (legacyProps.availability) {
        setMetaTag('property', 'product:availability', legacyProps.availability);
      }
    }

    // Standard performance and compatibility tags
    setMetaTag('name', 'format-detection', 'telephone=no');
    setMetaTag('name', 'mobile-web-app-capable', 'yes');
    setMetaTag('name', 'apple-mobile-web-app-status-bar-style', 'default');
    setMetaTag('name', 'apple-mobile-web-app-title', siteName);

    // Alternate language tags
    metaTags.alternateLanguages?.forEach(alt => {
      setLinkTag('alternate', alt.href, { hreflang: alt.hreflang });
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

    // Preconnect for critical resources
    setLinkTag('preconnect', 'https://fonts.googleapis.com', { crossorigin: 'anonymous' });
    setLinkTag('preconnect', 'https://fonts.gstatic.com', { crossorigin: 'anonymous' });

  } catch (error) {
    console.error('Error applying meta tags:', error);
  }
};

const MetaTags: React.FC<MetaTagsProps> = ({
  // Legacy props
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

  // New advanced props
  metaTagData,
  optimized = false,
  performanceTracking = true
}) => {
  const [appliedMetaTags, setAppliedMetaTags] = useState<MetaTagData | null>(null);
  const { getSEOMetrics } = useMetaTagOptimizer();

  // Memoize the legacy meta tags creation to prevent unnecessary recalculations
  const legacyMetaTags = useMemo(() => {
    if (metaTagData) return metaTagData;

    const siteName = 'Broker Analysis';
    return createLegacyMetaTags({
      title: title || '',
      description: description || '',
      canonicalUrl: canonicalUrl || '',
      imageUrl,
      type,
      keywords,
      siteName,
      author,
      noIndex
    });
  }, [
    metaTagData,
    title,
    description,
    canonicalUrl,
    imageUrl,
    type,
    keywords,
    author,
    noIndex
  ]);

  // Memoize the apply meta tags function to prevent recreation
  const applyTags = useCallback(() => {
    if (!legacyMetaTags) return;

    try {
      const siteName = 'Broker Analysis';
      setAppliedMetaTags(legacyMetaTags);

      // Apply meta tags to document with legacy props
      applyMetaTagsToDocument(legacyMetaTags, siteName, {
        publishDate,
        modifiedDate,
        type,
        price,
        currency,
        availability
      });

      // Track performance metrics if enabled
      if (performanceTracking && canonicalUrl) {
        const metrics = getSEOMetrics(`meta:${canonicalUrl}`);
        if (metrics && process.env.NODE_ENV === 'development') {
          console.log('SEO Metrics:', metrics);
        }
      }
    } catch (error) {
      console.error('Error in MetaTags useEffect:', error);
    }
  }, [legacyMetaTags, canonicalUrl, performanceTracking, getSEOMetrics, publishDate, modifiedDate, type, price, currency, availability]);

  useEffect(() => {
    applyTags();
  }, [applyTags]);

  
  // Development mode: display SEO metrics
  if (process.env.NODE_ENV === 'development' && appliedMetaTags && performanceTracking) {
    return (
      <div 
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '12px',
          zIndex: 9999,
          maxWidth: '300px'
        }}
      >
        <div><strong>SEO Debug Info</strong></div>
        <div>Title Length: {appliedMetaTags.title.length}</div>
        <div>Description Length: {appliedMetaTags.description.length}</div>
        <div>Keywords: {appliedMetaTags.keywords.length}</div>
        <div>Robots: {appliedMetaTags.robots}</div>
        <div>OG Image: {appliedMetaTags.og.image ? '✓' : '✗'}</div>
        <div>Twitter Card: {appliedMetaTags.twitter.card}</div>
      </div>
    );
  }

  return null;
};

// Enhanced component that integrates with the meta tag optimizer
interface OptimizedMetaTagsProps {
  pageType: 'category' | 'country' | 'seo';
  pageSlug: string;
  brokers?: any[];
  config?: any;
  additionalContext?: any;
}

export const OptimizedMetaTags: React.FC<OptimizedMetaTagsProps> = ({
  pageType,
  pageSlug,
  brokers = [],
  config,
  additionalContext
}) => {
  const [metaTags, setMetaTags] = useState<MetaTagData | null>(null);
  const [loading, setLoading] = useState(true);
  const { generateOptimizedMetaTags } = useMetaTagOptimizer();

  useEffect(() => {
    const generateMetaTags = async () => {
      if (!config) return;
      
      try {
        setLoading(true);
        const optimizedTags = await generateOptimizedMetaTags(
          pageType,
          pageSlug,
          brokers,
          config,
          additionalContext
        );
        setMetaTags(optimizedTags);
      } catch (error) {
        console.error('Failed to generate optimized meta tags:', error);
      } finally {
        setLoading(false);
      }
    };

    generateMetaTags();
  }, [pageType, pageSlug, brokers, config, additionalContext]);

  if (loading || !metaTags) {
    return null;
  }

  return (
    <MetaTags
      metaTagData={metaTags}
      optimized={true}
      performanceTracking={true}
    />
  );
};

export default MetaTags;
