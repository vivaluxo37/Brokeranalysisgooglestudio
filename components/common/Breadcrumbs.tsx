import React, { useMemo } from 'react';
// Fix: Use namespace import for react-router-dom to handle potential module resolution issues.
import * as ReactRouterDOM from 'react-router-dom';
import { brokers } from '../../data/brokers';
import { categoryPages } from '../../pages/categoryPageData';
import { Icons } from '../../constants';
import JsonLdSchema from './JsonLdSchema';
import { blogPosts } from '../../data/blog';

const breadcrumbNameMap: { [key: string]: string } = {
  '/brokers': 'All Brokers',
  '/compare': 'Compare Brokers',
  '/cost-analyzer': 'Cost Analyzer',
  '/broker-matcher': 'Broker Matcher',
  '/login': 'Login',
  '/register': 'Register',
  '/dashboard': 'My Dashboard',
  '/methodology': 'Methodology',
  '/sources': 'Sources',
  '/blog': 'Blog',
};

const Breadcrumbs: React.FC = () => {
  const location = ReactRouterDOM.useLocation();
  const pathnames = location.pathname.split('/').filter(x => x);
  
  const crumbs = useMemo(() => {
    let currentLink = '';
    const generatedCrumbs = pathnames.map((value, index) => {
      currentLink += `/${value}`;
      const isLast = index === pathnames.length - 1;

      // Try to find a name for the current path
      let name: string | null = null;
      if (breadcrumbNameMap[currentLink]) {
        name = breadcrumbNameMap[currentLink];
      } else {
        const category = categoryPages.find(p => p.path === currentLink);
        if (category) {
          name = category.title;
        } else {
            const pathParts = currentLink.split('/');
            if (pathParts[1] === 'broker' && pathParts[2]) {
                const broker = brokers.find(b => b.id === pathParts[2]);
                name = broker ? broker.name : value;
            } else if (pathParts[1] === 'blog' && pathParts[2]) {
                const post = blogPosts.find(p => p.slug === pathParts[2]);
                name = post ? post.title : value;
            } else if (pathParts[1] === 'compare' && pathParts.length > 2) {
                name = "Duel"
            }
        }
      }

      if (!name) return null;

      return { name, path: currentLink, isLast };
    }).filter(Boolean); // Remove null entries

    return generatedCrumbs;

  }, [location.pathname]);
  
  if (crumbs.length === 0) {
    return null; // Don't render on home page
  }
  
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://brokeranalysis.com/"
      },
      ...crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        "position": index + 2,
        "name": crumb.name,
        "item": crumb.isLast ? undefined : `https://brokeranalysis.com/#${crumb.path}`
      }))
    ]
  };

  return (
    <nav className="bg-card/30 border-b border-input" aria-label="Breadcrumb">
      <JsonLdSchema data={breadcrumbJsonLd} />
      <ol className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center h-12 space-x-2 text-sm text-foreground/70">
        <li>
          <ReactRouterDOM.Link to="/" className="hover:text-primary-400 flex items-center gap-2">
            <Icons.home className="h-4 w-4" />
            <span className="sr-only">Home</span>
          </ReactRouterDOM.Link>
        </li>
        {crumbs.map((crumb, index) => (
          <li key={crumb.path} className="flex items-center">
             <Icons.chevronRight className="h-4 w-4 text-foreground/50" />
            {crumb.isLast ? (
              <span className="ml-2 font-semibold text-foreground">{crumb.name}</span>
            ) : (
              <ReactRouterDOM.Link to={crumb.path} className="ml-2 hover:text-primary-400">
                {crumb.name}
              </ReactRouterDOM.Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;