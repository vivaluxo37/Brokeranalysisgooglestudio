/**
 * Programmatic Route Handler
 * 
 * This component handles routing for programmatic SEO pages. It detects the page type
 * from the URL, fetches the appropriate data, and renders the correct template.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { detectPageType, validatePageParams, PageDetectionResult } from '../../lib/programmatic/pageTypeDetector';
import { ProgrammaticPageTemplate } from './ProgrammaticPageTemplate';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import { pageDataService } from '../../services/programmatic/pageDataService';

interface ProgrammaticRouteHandlerProps {
  fallback?: React.ComponentType;
}

export const ProgrammaticRouteHandler: React.FC<ProgrammaticRouteHandlerProps> = ({ 
  fallback: FallbackComponent 
}) => {
  const location = useLocation();
  const params = useParams();
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pageDetection, setPageDetection] = useState<PageDetectionResult | null>(null);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Detect page type from current path
        const detection = detectPageType(location.pathname);
        
        if (!detection) {
          setError('Page not found');
          setLoading(false);
          return;
        }

        // Validate page parameters
        if (!validatePageParams(detection.type, detection.params)) {
          setError('Invalid page parameters');
          setLoading(false);
          return;
        }

        setPageDetection(detection);

        // Fetch page data
        const data = await pageDataService.getPageData(detection);
        setPageData(data);

      } catch (err) {
        console.error('Error loading programmatic page:', err);
        setError(err instanceof Error ? err.message : 'Failed to load page');
      } finally {
        setLoading(false);
      }
    };

    loadPageData();
  }, [location.pathname, params]);

  // Handle loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage 
          message={error} 
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // Handle fallback component for non-programmatic pages
  if (!pageDetection && FallbackComponent) {
    return <FallbackComponent />;
  }

  // Handle non-programmatic pages without fallback
  if (!pageDetection) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorMessage message="Page not found" />
      </div>
    );
  }

  // Render the programmatic page
  return (
    <ProgrammaticPageTemplate
      pageDetection={pageDetection}
      pageData={pageData}
    />
  );
};

/**
 * Higher-order component that wraps routes with programmatic handling
 */
export const withProgrammaticRouting = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    enableProgrammatic?: boolean;
    fallback?: React.ComponentType;
  }
) => {
  const WrappedComponent = (props: P) => {
    const location = useLocation();
    const isProgrammatic = options?.enableProgrammatic !== false && 
      detectPageType(location.pathname) !== null;

    if (isProgrammatic) {
      return <ProgrammaticRouteHandler fallback={options?.fallback} />;
    }

    return <Component {...props} />;
  };

  WrappedComponent.displayName = `withProgrammaticRouting(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

/**
 * Hook to get current page detection information
 */
export const usePageDetection = () => {
  const location = useLocation();
  const [pageDetection, setPageDetection] = useState<PageDetectionResult | null>(null);

  useEffect(() => {
    const detection = detectPageType(location.pathname);
    setPageDetection(detection);
  }, [location.pathname]);

  return pageDetection;
};

/**
 * Hook to get page data for programmatic pages
 */
export const useProgrammaticPageData = (pageDetection?: PageDetectionResult | null) => {
  const [pageData, setPageData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!pageDetection) return;

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await pageDataService.getPageData(pageDetection);
        setPageData(data);
      } catch (err) {
        console.error('Error loading page data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load page data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [pageDetection]);

  return { pageData, loading, error };
};

/**
 * Component to render breadcrumbs for programmatic pages
 */
export const ProgrammaticBreadcrumbs: React.FC<{ pageDetection: PageDetectionResult }> = ({ 
  pageDetection 
}) => {
  const breadcrumbs = generateBreadcrumbs(pageDetection);

  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
      {breadcrumbs.map((crumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && <span className="text-gray-400">/</span>}
          {crumb.href ? (
            <a 
              href={crumb.href}
              className="hover:text-blue-600 transition-colors"
            >
              {crumb.label}
            </a>
          ) : (
            <span className="text-gray-900 font-medium">{crumb.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

/**
 * Generate breadcrumb navigation for programmatic pages
 */
function generateBreadcrumbs(pageDetection: PageDetectionResult): Array<{
  label: string;
  href?: string;
}> {
  const breadcrumbs: Array<{ label: string; href?: string }> = [
    { label: 'Home', href: '/' }
  ];

  switch (pageDetection.type) {
    case 'category':
      breadcrumbs.push({
        label: formatCategoryName(pageDetection.params.categorySlug as string)
      });
      break;

    case 'country':
      breadcrumbs.push({
        label: pageDetection.params.countryName as string
      });
      break;

    case 'category-country':
      breadcrumbs.push({
        label: formatCategoryName(pageDetection.params.categorySlug as string),
        href: `/${pageDetection.params.categorySlug}`
      });
      breadcrumbs.push({
        label: pageDetection.params.countryName as string
      });
      break;

    case 'strategy':
      breadcrumbs.push({
        label: 'Trading Strategies',
        href: '/strategies'
      });
      breadcrumbs.push({
        label: formatStrategyName(pageDetection.params.strategySlug as string)
      });
      break;

    case 'feature':
      breadcrumbs.push({
        label: 'Broker Features',
        href: '/features'
      });
      breadcrumbs.push({
        label: formatFeatureName(pageDetection.params.featureSlug as string)
      });
      break;

    case 'broker':
      breadcrumbs.push({
        label: 'Broker Reviews',
        href: '/brokers'
      });
      breadcrumbs.push({
        label: formatBrokerName(pageDetection.params.brokerSlug as string)
      });
      break;
  }

  return breadcrumbs;
}

/**
 * Helper functions for formatting names
 */
function formatCategoryName(slug: string): string {
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function formatStrategyName(slug: string): string {
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function formatFeatureName(slug: string): string {
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

function formatBrokerName(slug: string): string {
  return slug.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
}

export default ProgrammaticRouteHandler;