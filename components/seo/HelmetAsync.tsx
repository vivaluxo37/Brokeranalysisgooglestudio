import React from 'react';

// React 19 compatible helmet replacement
interface HelmetProps {
  title?: string;
  meta?: Array<{
    name?: string;
    property?: string;
    content: string;
  }>;
  link?: Array<{
    rel: string;
    href: string;
    [key: string]: any;
  }>;
  children?: React.ReactNode;
}

export const Helmet: React.FC<HelmetProps> = ({ title, meta, link, children }) => {
  React.useEffect(() => {
    if (title) {
      document.title = title;
    }

    // Update meta tags
    if (meta) {
      meta.forEach((metaTag) => {
        const tag = document.querySelector(
          metaTag.name
            ? `meta[name="${metaTag.name}"]`
            : `meta[property="${metaTag.property}"]`
        ) || document.createElement('meta');

        if (metaTag.name) {
          tag.setAttribute('name', metaTag.name);
        }
        if (metaTag.property) {
          tag.setAttribute('property', metaTag.property);
        }
        tag.setAttribute('content', metaTag.content);

        if (!document.head.contains(tag)) {
          document.head.appendChild(tag);
        }
      });
    }

    // Update link tags
    if (link) {
      link.forEach((linkTag) => {
        const tag = document.querySelector(
          `link[rel="${linkTag.rel}"][href="${linkTag.href}"]`
        ) || document.createElement('link');

        Object.entries(linkTag).forEach(([key, value]) => {
          tag.setAttribute(key, String(value));
        });

        if (!document.head.contains(tag)) {
          document.head.appendChild(tag);
        }
      });
    }

    // Process child elements (meta tags, title, etc.)
    if (children) {
      const processChildElements = (element: React.ReactNode) => {
        React.Children.forEach(element, (child) => {
          if (React.isValidElement(child)) {
            const { type, props } = child;

            if (type === 'title' && props.children) {
              document.title = props.children;
            } else if (type === 'meta') {
              const metaTag = document.querySelector(
                props.name
                  ? `meta[name="${props.name}"]`
                  : props.property
                  ? `meta[property="${props.property}"]`
                  : props.charset
                  ? `meta[charset="${props.charset}"]`
                  : null
              ) || document.createElement('meta');

              Object.entries(props).forEach(([key, value]) => {
                if (key !== 'key') {
                  metaTag.setAttribute(key, String(value));
                }
              });

              if (!document.head.contains(metaTag)) {
                document.head.appendChild(metaTag);
              }
            } else if (type === 'link') {
              const linkTag = document.querySelector(
                `link[rel="${props.rel}"]`
              ) || document.createElement('link');

              Object.entries(props).forEach(([key, value]) => {
                if (key !== 'key') {
                  linkTag.setAttribute(key, String(value));
                }
              });

              if (!document.head.contains(linkTag)) {
                document.head.appendChild(linkTag);
              }
            } else if (type === 'script') {
              // Handle script tags (like JSON-LD)
              const scriptTag = document.querySelector(
                props.type ? `script[type="${props.type}"]` : 'script:not([type])'
              ) || document.createElement('script');

              Object.entries(props).forEach(([key, value]) => {
                if (key !== 'key' && key !== 'children') {
                  scriptTag.setAttribute(key, String(value));
                }
              });

              if (props.children) {
                scriptTag.textContent = props.children;
              }

              if (!document.head.contains(scriptTag)) {
                document.head.appendChild(scriptTag);
              }
            } else if (props.children) {
              processChildElements(props.children);
            }
          }
        });
      };

      processChildElements(children);
    }
  }, [title, meta, link, children]);

  // This component doesn't render anything to the DOM
  return null;
};

interface HelmetProviderProps {
  children: React.ReactNode;
}

export const HelmetProvider: React.FC<HelmetProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export default Helmet;