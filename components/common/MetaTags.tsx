
import React, { useEffect } from 'react';

interface MetaTagsProps {
  title: string;
  description: string;
  canonicalUrl: string;
  imageUrl?: string;
}

const MetaTags: React.FC<MetaTagsProps> = ({ title, description, canonicalUrl, imageUrl }) => {
  useEffect(() => {
    // Set Title
    document.title = title;

    // Helper to set/create meta tags by finding an attribute and updating content
    const setMetaTag = (attr: 'name' | 'property', value: string, content: string) => {
      let element = document.querySelector(`meta[${attr}='${value}']`) as HTMLMetaElement;
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, value);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper to set/create link tags
    const setLinkTag = (rel: string, href: string) => {
        let element = document.querySelector(`link[rel='${rel}']`) as HTMLLinkElement;
        if (!element) {
            element = document.createElement('link');
            element.setAttribute('rel', rel);
            document.head.appendChild(element);
        }
        element.setAttribute('href', href);
    }

    // Standard Meta Tags
    setMetaTag('name', 'description', description);
    setLinkTag('canonical', canonicalUrl);

    // Open Graph (for Facebook, LinkedIn, etc.)
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', 'website');
    if (imageUrl) {
      setMetaTag('property', 'og:image', imageUrl);
    }

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    if (imageUrl) {
      setMetaTag('name', 'twitter:image', imageUrl);
    }

  }, [title, description, canonicalUrl, imageUrl]);

  return null; // This component does not render any visible elements
};

export default MetaTags;
