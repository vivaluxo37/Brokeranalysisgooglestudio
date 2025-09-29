import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useSEO } from '../../contexts/SEOContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { Globe, MapPin } from 'lucide-react';

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
    <div className="geom-multilingual-seo">
      {/* Language Switcher */}
      <div className="bg-white border-b border-gray-200 py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">
                Available in {supportedLocales.length} languages
              </span>
            </div>

            <div className="flex items-center gap-2">
              {supportedLocales.map(locale => (
                <button
                  key={locale}
                  onClick={() => changeLanguage(locale)}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    currentLocale === locale
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {locale.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Geo Targeting Info */}
      {geoTargeting && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">
              Localized for {geoTargeting.country}
              {geoTargeting.region && `, ${geoTargeting.region}`}
              {geoTargeting.city && ` - ${geoTargeting.city}`}
            </h3>
          </div>
          <p className="text-sm text-blue-700">
            This content is optimized for traders in {geoTargeting.country}.
            {geoTargeting.region && ` Local regulations and market conditions for ${geoTargeting.region} are considered.`}
          </p>
        </div>
      )}

      {/* Structured Data for Geo and Language */}
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
    </div>
  );
};

export default GEOMultilingualSEO;