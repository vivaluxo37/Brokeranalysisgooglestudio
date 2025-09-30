import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: any;
  noIndex?: boolean;
  hreflang?: { [key: string]: string };
}

const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = '/images/default-og-image.jpg',
  ogType = 'website',
  jsonLd,
  noIndex = false,
  hreflang = {}
}) => {
  // Ensure title is within optimal length
  const optimizedTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  
  // Ensure description is within optimal length
  const optimizedDescription = description.length > 160 
    ? description.substring(0, 157) + '...' 
    : description;

  // Generate keywords meta tag
  const keywordsContent = keywords.length > 0 ? keywords.join(', ') : undefined;

  // Get current URL (with fallback for SSR)
  const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');

  // Generate OG image URL (with fallback for SSR)
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://brokeranalysis.com';
  const fullOgImage = ogImage.startsWith('http') 
    ? ogImage 
    : `${origin}${ogImage}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{optimizedTitle}</title>
      <meta name="description" content={optimizedDescription} />
      {keywordsContent && <meta name="keywords" content={keywordsContent} />}
      
      {/* Canonical URL */}
      <link rel="canonical" href={currentUrl} />
      
      {/* Robots */}
      {noIndex && <meta name="robots" content="noindex,nofollow" />}
      
      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="BrokerAnalysis" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={fullOgImage} />
      
      {/* Additional Meta Tags for SEO */}
      <meta name="author" content="BrokerAnalysis" />
      <meta name="publisher" content="BrokerAnalysis" />
      <meta name="language" content="en" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Hreflang Tags */}
      {Object.entries(hreflang).map(([lang, url]) => (
        <link key={lang} rel="alternate" hreflang={lang} href={url} />
      ))}
      
      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd, null, 2)}
        </script>
      )}
      
      {/* Additional Schema.org Organization Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "BrokerAnalysis",
          "url": origin,
          "logo": `${origin}/images/logo.png`,
          "sameAs": [
            "https://twitter.com/brokeranalysis",
            "https://linkedin.com/company/brokeranalysis"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "customer service",
            "email": "support@brokeranalysis.com"
          }
        }, null, 2)}
      </script>
    </Helmet>
  );
};

export default SEOHead;