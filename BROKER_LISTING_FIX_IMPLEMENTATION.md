# 🔧 Broker Listing Fix Implementation Guide

**Priority:** CRITICAL  
**Estimated Time:** 5 days  
**Team Required:** 1-2 developers  

---

## 📋 Implementation Phases Overview

| Phase | Duration | Tasks | Priority |
|-------|----------|-------|----------|
| **Phase 1** | Day 1 | Fix critical data loading issues | CRITICAL |
| **Phase 2** | Day 2 | Standardize components | CRITICAL |
| **Phase 3** | Day 2-3 | Fix routing & links | HIGH |
| **Phase 4** | Day 3-4 | SEO optimization | MEDIUM |
| **Phase 5** | Day 4-5 | Performance & testing | MEDIUM |

---

## 🚨 Phase 1: Fix Critical Data Loading (Day 1)

### Task 1.1: Fix All Brokers Page Data Loading

**File:** `pages/brokers.tsx`

#### Step 1: Remove Mock Data (Lines 107-148)
```typescript
// DELETE ALL OF THIS:
const mockBrokers: Broker[] = [
  {
    id: '1',
    name: 'IC Markets',
    // ... remove all mock data
  }
];

const mockCategories = [...];
const mockRegulators = [...];
const mockPlatforms = [...];

setBrokers(mockBrokers);
// ... etc
```

#### Step 2: Import Proper Services
```typescript
// Add at top of file
import { unifiedBrokerService } from '../services/unifiedBrokerService';
import { Broker } from '../types';
```

#### Step 3: Implement Real Data Fetching
```typescript
const fetchBrokersData = async () => {
  try {
    setLoading(true);
    setError(null);

    // Fetch real broker data
    const brokerData = await unifiedBrokerService.getBrokers();
    
    // Process brokers for display
    const processedBrokers = brokerData.map(broker => ({
      ...broker,
      // Ensure all required fields exist
      slug: broker.id,
      logo_url: broker.logoUrl,
      website_url: broker.websiteUrl,
      overall_rating: broker.score || 0,
      min_deposit: broker.accessibility?.minDeposit || 0,
      min_deposit_currency: '$',
      max_leverage: parseInt(broker.tradingConditions?.maxLeverage?.replace(/[^0-9]/g, '') || '0'),
      spreads_from: parseFloat(broker.tradingConditions?.spreads?.eurusd || '0'),
      regulated: broker.regulation?.regulators?.length > 0,
      regulations: broker.regulation?.regulators?.map(reg => ({
        regulator: reg,
        country: 'Global'
      })) || [],
      platforms: broker.technology?.platforms || [],
      instruments_total: 
        (broker.tradableInstruments?.forexPairs || 0) +
        (broker.tradableInstruments?.stocks || 0) +
        (broker.tradableInstruments?.commodities || 0) +
        (broker.tradableInstruments?.indices || 0) +
        (broker.tradableInstruments?.cryptocurrencies || 0),
      pros: broker.pros || [],
      cons: broker.cons || [],
      cta_text: 'Visit Broker',
      cta_url: broker.websiteUrl,
      founded_year: broker.foundingYear,
      headquarters: broker.headquarters,
      demo_account: broker.coreInfo?.demoAccount,
      features: []
    }));

    setBrokers(processedBrokers);
    setFilteredBrokers(processedBrokers);
    setTotalCount(processedBrokers.length);

    // Extract filter options
    const uniqueRegulators = new Set<string>();
    const uniquePlatforms = new Set<string>();
    
    processedBrokers.forEach(broker => {
      broker.regulations?.forEach(reg => uniqueRegulators.add(reg.regulator));
      broker.platforms?.forEach(platform => uniquePlatforms.add(platform));
    });

    setRegulators(Array.from(uniqueRegulators).sort());
    setPlatforms(Array.from(uniquePlatforms).sort());
    
    // Categories can be hardcoded or fetched
    setCategories([
      { slug: 'ecn-brokers', name: 'ECN Brokers' },
      { slug: 'stp-brokers', name: 'STP Brokers' },
      { slug: 'market-makers', name: 'Market Makers' },
      { slug: 'low-spread', name: 'Low Spread Brokers' },
      { slug: 'mt4-brokers', name: 'MT4 Brokers' },
      { slug: 'mt5-brokers', name: 'MT5 Brokers' }
    ]);

  } catch (err) {
    console.error('Error fetching brokers:', err);
    setError(err instanceof Error ? err.message : 'Failed to load brokers');
  } finally {
    setLoading(false);
  }
};
```

### Task 1.2: Fix BrokerCard Import

**File:** `pages/brokers.tsx` (Line 4)

#### Current (Wrong):
```typescript
import BrokerCard from '../components/brokers/BrokerCard';
```

#### Fix to:
```typescript
import BrokerCard from '../components/common/BrokerCard';
```

---

## 🎨 Phase 2: Standardize Components (Day 2)

### Task 2.1: Create Unified BrokerCard Component

**Create New File:** `components/common/UnifiedBrokerCard.tsx`

```typescript
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  StarIcon, 
  CheckIcon, 
  XMarkIcon,
  ShieldCheckIcon,
  BuildingOffice2Icon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface UnifiedBrokerCardProps {
  broker: any; // Will be properly typed
  showCountryBadge?: string;
  onQuickView?: (broker: any) => void;
  variant?: 'compact' | 'detailed' | 'comparison';
  className?: string;
  priority?: number;
}

export const UnifiedBrokerCard: React.FC<UnifiedBrokerCardProps> = ({
  broker,
  showCountryBadge,
  onQuickView,
  variant = 'compact',
  className = '',
  priority
}) => {
  // Normalize broker data from different sources
  const normalizedBroker = {
    id: broker.id || broker.slug,
    name: broker.name,
    slug: broker.slug || broker.id,
    logoUrl: broker.logo_url || broker.logoUrl || `/images/brokers/${broker.slug || broker.id}.png`,
    websiteUrl: broker.website_url || broker.websiteUrl || broker.cta_url,
    rating: broker.overall_rating || broker.score || 0,
    minDeposit: broker.min_deposit || broker.accessibility?.minDeposit || 0,
    currency: broker.min_deposit_currency || '$',
    maxLeverage: broker.max_leverage || broker.tradingConditions?.maxLeverage,
    spreads: broker.spreads_from || broker.tradingConditions?.spreads?.eurusd,
    regulators: broker.regulations || broker.regulation?.regulators || [],
    platforms: broker.platforms || broker.technology?.platforms || [],
    pros: broker.pros || [],
    cons: broker.cons || [],
    headquarters: broker.headquarters,
    foundedYear: broker.founded_year || broker.foundingYear
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<StarSolidIcon key={i} className="h-4 w-4 text-yellow-400" />);
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <StarIcon className="h-4 w-4 text-gray-300" />
            <StarSolidIcon 
              className="h-4 w-4 text-yellow-400 absolute top-0 left-0" 
              style={{ clipPath: 'inset(0 50% 0 0)' }}
            />
          </div>
        );
      } else {
        stars.push(<StarIcon key={i} className="h-4 w-4 text-gray-300" />);
      }
    }
    return stars;
  };

  if (variant === 'compact') {
    return (
      <div className={`bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              {/* Logo */}
              <div className="w-12 h-12 bg-gray-50 rounded-lg p-1 flex items-center justify-center">
                {normalizedBroker.logoUrl ? (
                  <img
                    src={normalizedBroker.logoUrl}
                    alt={`${normalizedBroker.name} logo`}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/broker-placeholder.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {normalizedBroker.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>

              {/* Name and Rating */}
              <div>
                <Link
                  to={`/broker/${normalizedBroker.slug}`}
                  className="font-semibold text-gray-900 hover:text-blue-600 transition-colors"
                >
                  {normalizedBroker.name}
                </Link>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="flex">{renderStars(normalizedBroker.rating)}</div>
                  <span className="text-sm text-gray-600">
                    {normalizedBroker.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Country Badge (if applicable) */}
            {showCountryBadge && (
              <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                Available
              </div>
            )}
          </div>
        </div>

        {/* Key Info */}
        <div className="p-4">
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-gray-500">Min Deposit</dt>
              <dd className="font-semibold text-gray-900">
                {normalizedBroker.minDeposit === 0 
                  ? 'No minimum' 
                  : `${normalizedBroker.currency}${normalizedBroker.minDeposit}`}
              </dd>
            </div>
            {normalizedBroker.maxLeverage && (
              <div>
                <dt className="text-gray-500">Max Leverage</dt>
                <dd className="font-semibold text-gray-900">
                  {normalizedBroker.maxLeverage}:1
                </dd>
              </div>
            )}
          </div>

          {/* Regulation */}
          {normalizedBroker.regulators.length > 0 && (
            <div className="mt-3">
              <div className="flex flex-wrap gap-1">
                {normalizedBroker.regulators.slice(0, 2).map((reg: any, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                  >
                    <ShieldCheckIcon className="h-3 w-3 mr-1" />
                    {typeof reg === 'string' ? reg : reg.regulator}
                  </span>
                ))}
                {normalizedBroker.regulators.length > 2 && (
                  <span className="text-xs text-gray-500">
                    +{normalizedBroker.regulators.length - 2} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 pb-4 flex items-center justify-between">
          <Link
            to={`/broker/${normalizedBroker.slug}`}
            className="text-sm font-medium text-blue-600 hover:text-blue-700"
          >
            Read Review →
          </Link>
          
          {normalizedBroker.websiteUrl && (
            <a
              href={normalizedBroker.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Visit Broker
            </a>
          )}
        </div>

        {/* Quick View Button (if handler provided) */}
        {onQuickView && (
          <button
            onClick={() => onQuickView(normalizedBroker)}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </button>
        )}
      </div>
    );
  }

  // Add detailed and comparison variants as needed
  return null;
};

export default UnifiedBrokerCard;
```

### Task 2.2: Update All Pages to Use UnifiedBrokerCard

#### Update in `pages/brokers.tsx`:
```typescript
// Replace old import
import UnifiedBrokerCard from '../components/common/UnifiedBrokerCard';

// In render, update component usage:
{currentBrokers.map((broker, index) => (
  <UnifiedBrokerCard
    key={broker.id}
    broker={broker}
    priority={startIndex + index + 1}
    variant="compact"
  />
))}
```

#### Update in `pages/best-brokers/[category]/index.tsx`:
```typescript
import UnifiedBrokerCard from '../../../components/common/UnifiedBrokerCard';

// Replace BrokerCard usage
<UnifiedBrokerCard
  broker={broker}
  variant="compact"
  showCountryBadge={countryCode}
/>
```

#### Update in `pages/best-forex-brokers/[country]/index.tsx`:
```typescript
import UnifiedBrokerCard from '../../../components/common/UnifiedBrokerCard';

// Add missing onQuickView handler
const [selectedBroker, setSelectedBroker] = useState(null);

const handleQuickView = (broker) => {
  setSelectedBroker(broker);
  // Open modal or quick view
};

// Update component usage
<UnifiedBrokerCard
  broker={broker}
  showCountryBadge={country}
  onQuickView={handleQuickView}
  variant="compact"
/>
```

---

## 🔗 Phase 3: Fix Routing & Links (Day 2-3)

### Task 3.1: Standardize Routes in App.tsx

**File:** `App.tsx`

```typescript
// Update routes to be consistent
<Routes>
  {/* Main broker routes */}
  <Route path="/brokers" element={<AllBrokersPage />} />
  <Route path="/brokers/category/:category" element={<BrokerCategoryPage />} />
  <Route path="/brokers/country/:country" element={<BrokerCountryPage />} />
  <Route path="/brokers/compare" element={<ComparePage />} />
  <Route path="/brokers/advanced-screening" element={<AdvancedScreeningPage />} />
  <Route path="/brokers/:brokerId" element={<BrokerDetailPage />} />
  
  {/* Legacy redirects for SEO */}
  <Route path="/best-brokers/:category" element={<Navigate to="/brokers/category/:category" replace />} />
  <Route path="/best-forex-brokers/:country" element={<Navigate to="/brokers/country/:country" replace />} />
  <Route path="/broker/:id" element={<Navigate to="/brokers/:id" replace />} />
</Routes>
```

### Task 3.2: Create Redirect Component for Legacy URLs

**Create:** `components/routing/LegacyRedirect.tsx`

```typescript
import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const LegacyRedirect: React.FC<{ type: 'category' | 'country' | 'broker' }> = ({ type }) => {
  const params = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const slug = params.slug || params.category || params.country || params.id;
    
    if (slug) {
      const newPath = type === 'category' 
        ? `/brokers/category/${slug}`
        : type === 'country'
        ? `/brokers/country/${slug}`
        : `/brokers/${slug}`;
        
      navigate(newPath, { replace: true });
    }
  }, [params, navigate, type]);

  return null;
};
```

---

## 🔍 Phase 4: SEO Optimization (Day 3-4)

### Task 4.1: Create SEO Service

**Create:** `services/seoService.ts`

```typescript
interface SEOConfig {
  title: string;
  description: string;
  keywords: string[];
  canonical: string;
  ogImage?: string;
}

export class SEOService {
  static generateBrokerListingMeta(type: 'all' | 'category' | 'country', slug?: string): SEOConfig {
    const year = new Date().getFullYear();
    const baseUrl = 'https://yoursite.com';
    
    switch (type) {
      case 'all':
        return {
          title: `All Forex Brokers ${year} - Complete List of 84+ Brokers`,
          description: `Compare all ${year} forex brokers. Detailed reviews, regulations, spreads, and exclusive bonuses. Find your perfect broker today.`,
          keywords: ['forex brokers', 'all brokers', 'broker list', 'forex trading'],
          canonical: `${baseUrl}/brokers`
        };
        
      case 'category':
        const categoryName = slug ? this.formatCategoryName(slug) : 'Category';
        return {
          title: `Best ${categoryName} Brokers ${year} - Top Rated & Reviewed`,
          description: `Find the best ${categoryName} brokers for ${year}. Compare spreads, regulations, platforms, and get exclusive bonuses.`,
          keywords: [`${categoryName} brokers`, 'forex', slug || ''],
          canonical: `${baseUrl}/brokers/category/${slug}`
        };
        
      case 'country':
        const countryName = slug ? this.formatCountryName(slug) : 'Country';
        return {
          title: `Best Forex Brokers in ${countryName} ${year} - Local & International`,
          description: `Top forex brokers accepting traders from ${countryName}. Compare regulated brokers with local support and payment methods.`,
          keywords: [`forex brokers ${countryName}`, `${countryName} trading`, slug || ''],
          canonical: `${baseUrl}/brokers/country/${slug}`
        };
        
      default:
        return {
          title: 'Forex Brokers',
          description: 'Compare forex brokers',
          keywords: ['forex'],
          canonical: baseUrl
        };
    }
  }
  
  static formatCategoryName(slug: string): string {
    const mappings: Record<string, string> = {
      'ecn-brokers': 'ECN',
      'stp-brokers': 'STP',
      'market-makers': 'Market Maker',
      'mt4-brokers': 'MetaTrader 4',
      'mt5-brokers': 'MetaTrader 5',
      'low-spread': 'Low Spread'
    };
    
    return mappings[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
  
  static formatCountryName(slug: string): string {
    const mappings: Record<string, string> = {
      'philippines': 'Philippines',
      'india': 'India',
      'south-africa': 'South Africa',
      'united-states': 'United States',
      'united-kingdom': 'United Kingdom',
      'australia': 'Australia'
    };
    
    return mappings[slug] || slug.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }
  
  static generateStructuredData(type: string, data: any) {
    // Implementation for JSON-LD structured data
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      // ... structured data
    };
  }
}
```

### Task 4.2: Implement SEO in Pages

**Update each page with proper SEO:**

```typescript
// In pages/brokers.tsx
import { SEOService } from '../services/seoService';

const BrokersPage: React.FC = () => {
  const seoConfig = SEOService.generateBrokerListingMeta('all');
  
  return (
    <>
      <MetaTags
        title={seoConfig.title}
        description={seoConfig.description}
        keywords={seoConfig.keywords.join(', ')}
        canonical={seoConfig.canonical}
      />
      
      <JsonLdSchema 
        data={SEOService.generateStructuredData('brokerList', filteredBrokers)}
      />
      
      {/* Rest of component */}
    </>
  );
};
```

---

## ⚡ Phase 5: Performance Optimization (Day 4-5)

### Task 5.1: Implement Pagination

**Update:** `pages/brokers.tsx`

```typescript
const ITEMS_PER_PAGE = 20;

const BrokersPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Paginate results
  const paginatedBrokers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredBrokers.slice(startIndex, endIndex);
  }, [filteredBrokers, currentPage]);
  
  const totalPages = Math.ceil(filteredBrokers.length / ITEMS_PER_PAGE);
  
  // Pagination component
  const Pagination = () => (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 border rounded-lg disabled:opacity-50"
      >
        Previous
      </button>
      
      <span className="px-4 py-2">
        Page {currentPage} of {totalPages}
      </span>
      
      <button
        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
        disabled={currentPage === totalPages}
        className="px-4 py-2 border rounded-lg disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
  
  return (
    <>
      {/* Render paginated brokers */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedBrokers.map(broker => (
          <UnifiedBrokerCard key={broker.id} broker={broker} />
        ))}
      </div>
      
      <Pagination />
    </>
  );
};
```

### Task 5.2: Add Lazy Loading for Images

**Create:** `components/ui/LazyImage.tsx`

```typescript
import { useState, useEffect, useRef } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  fallback = '/images/broker-placeholder.png',
  className = ''
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let observer: IntersectionObserver;
    
    if (imageRef && !imageSrc) {
      observer = new IntersectionObserver(
        entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setImageSrc(src);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1 }
      );
      
      observer.observe(imageRef);
    }
    
    return () => {
      if (observer && observer.disconnect) {
        observer.disconnect();
      }
    };
  }, [imageRef, imageSrc, src]);

  return (
    <img
      ref={setImageRef}
      src={error ? fallback : (imageSrc || fallback)}
      alt={alt}
      className={className}
      onError={() => setError(true)}
      loading="lazy"
    />
  );
};
```

---

## 🧪 Testing Implementation

### Create Test Suite

**Create:** `tests/brokerListing.test.tsx`

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import BrokersPage from '../pages/brokers';
import { unifiedBrokerService } from '../services/unifiedBrokerService';

jest.mock('../services/unifiedBrokerService');

describe('Broker Listing Pages', () => {
  test('All Brokers page loads all brokers', async () => {
    const mockBrokers = Array(84).fill(null).map((_, i) => ({
      id: `broker-${i}`,
      name: `Broker ${i}`,
      // ... other fields
    }));
    
    (unifiedBrokerService.getBrokers as jest.Mock).mockResolvedValue(mockBrokers);
    
    render(
      <BrowserRouter>
        <BrokersPage />
      </BrowserRouter>
    );
    
    await waitFor(() => {
      const brokerCards = screen.getAllByTestId('broker-card');
      expect(brokerCards).toHaveLength(20); // First page with pagination
    });
  });
  
  test('Broker card links to detail page', async () => {
    render(
      <BrowserRouter>
        <UnifiedBrokerCard broker={mockBroker} />
      </BrowserRouter>
    );
    
    const link = screen.getByText('Read Review');
    expect(link).toHaveAttribute('href', '/brokers/pepperstone');
  });
  
  test('Category filter works correctly', async () => {
    // Test implementation
  });
  
  test('SEO meta tags are present', async () => {
    // Test implementation
  });
});
```

---

## 📋 Deployment Checklist

### Pre-Deployment
- [ ] All 84 brokers load on main page
- [ ] Pagination works (20 per page)
- [ ] Filters work correctly
- [ ] All broker cards use UnifiedBrokerCard
- [ ] Links to detail pages work
- [ ] No console errors
- [ ] SEO meta tags present on all pages
- [ ] Images lazy load properly
- [ ] Mobile responsive

### Post-Deployment
- [ ] Monitor error logs
- [ ] Check Google Search Console for crawl errors
- [ ] Verify all broker detail pages accessible
- [ ] Test on real mobile devices
- [ ] Monitor page load times
- [ ] Check 404 error rate

---

## 📊 Success Metrics

Monitor these after deployment:

| Metric | Target | How to Measure |
|--------|--------|----------------|
| Brokers Displayed | 84 | Count on /brokers page |
| 404 Error Rate | <1% | Google Search Console |
| Page Load Time | <2s | Lighthouse/GTmetrix |
| SEO Score | >85 | Lighthouse SEO audit |
| Bounce Rate | <40% | Google Analytics |
| Console Errors | 0 | Browser DevTools |

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install

# Run tests
npm test

# Check for TypeScript errors
npm run type-check

# Build for production
npm run build

# Run production build locally
npm run preview
```

---

*Implementation Guide v1.0*  
*Last Updated: January 11, 2025*
