import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSEO } from '../../contexts/SEOContext';
import { useLanguage } from '../../contexts/LanguageContext';
// Removed Globe and MapPin imports as they are no longer used

interface GEOMultilingualSEOProps {
  title: string;
  description: string;
  keywords: string[];
  imageUrl?: string;
  geoTargeting?: {
    country: string;
    region?: string;
    city?: string;
  };
  translations?: Record<string, {
    title: string;
    description: string;
    keywords: string[];
  }>;
}

const GEOMultilingualSEO: React.FC<GEOMultilingualSEOProps> = ({
  title,
  description,
  keywords,
  imageUrl,
  geoTargeting,
  translations = {}
}) => {
  const location = useLocation();
  const { generateHreflangTags, generateCanonicalUrl, generateMetaKeywords } = useSEO();
  const { currentLocale, supportedLocales, changeLanguage } = useLanguage();

  useEffect(() => {
    try {
      // Generate hreflang tags
      const hreflangTags = generateHreflangTags(location.pathname);

      // Remove existing hreflang tags
      const existingTags = document.querySelectorAll('link[rel="alternate"]');
      existingTags.forEach(tag => tag.remove());

      // Add new hreflang tags
      hreflangTags.forEach(({ hreflang, href }) => {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.hreflang = hreflang;
        link.href = href;
        document.head.appendChild(link);
      });

      // Add geo meta tags if geo targeting is enabled
      if (geoTargeting) {
        const geoMetaTags = [
          { name: 'geo.country', content: geoTargeting.country },
          { name: 'geo.region', content: geoTargeting.region || geoTargeting.country },
          ...(geoTargeting.city ? [{ name: 'geo.placename', content: geoTargeting.city }] : [])
        ];

        geoMetaTags.forEach(({ name, content }) => {
          try {
            let meta = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
            if (!meta) {
              meta = document.createElement('meta');
              meta.name = name;
              document.head.appendChild(meta);
            }
            meta.content = content;
          } catch (error) {
            console.error(`Error setting geo meta tag for ${name}:`, error);
          }
        });
      }
    } catch (error) {
      console.error('Error in GEOMultilingualSEO useEffect:', error);
    }
  }, [location.pathname, geoTargeting, generateHreflangTags]);

  // Get current translation or fallback to default
  const currentTranslation = translations[currentLocale] || {
    title,
    description,
    keywords
  };

  const optimizedKeywords = generateMetaKeywords(
    currentTranslation.title,
    currentTranslation.description
  );

  return (
    <>
      {/* Structured Data for Geo and Language - SEO Only, No Visible UI */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: currentTranslation.title,
          description: currentTranslation.description,
          inLanguage: currentLocale,
          ...(geoTargeting && {
            contentLocation: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressCountry: geoTargeting.country,
                ...(geoTargeting.region && { addressRegion: geoTargeting.region }),
                ...(geoTargeting.city && { addressLocality: geoTargeting.city })
              }
            }
          }),
          keywords: optimizedKeywords.join(', '),
          potentialAction: {
            '@type': 'SearchAction',
            target: {
              '@type': 'EntryPoint',
              urlTemplate: `${window.location.origin}/search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
          }
        }, null, 2)}
      </script>
    </>
  );
};

export default GEOMultilingualSEO;