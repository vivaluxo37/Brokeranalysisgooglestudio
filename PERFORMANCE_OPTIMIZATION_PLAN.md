# Performance Optimization Plan

## Overview
Sequential optimization across all areas: bundle analysis, brokers listing, images/fonts, code splitting, lazy loading, runtime rendering, and monitoring.

## Phase 1: Baseline & Bundle Analysis

### 1.1 Bundle Analyzer Setup
- Add rollup-plugin-visualizer to generate stats.html for dev and prod builds
- Create baseline script to collect:
  - Bundle sizes and chunk breakdown
  - Lighthouse metrics for key pages (/, /brokers, /broker/:id, /admin)
  - Web Vitals (LCP, FID, CLS, TTFB, FCP)

### 1.2 Baseline Metrics Collection
- Run build with bundle analyzer
- Collect Lighthouse reports for:
  - Home page (/)
  - Brokers listing (/brokers)
  - Broker detail (/broker/pepperstone)
  - Admin dashboard (/admin)
- Document current performance budget status

## Phase 2: Brokers Listing Optimization

### 2.1 Reduce Initial Data Payload
- Replace static brokers import with async load
- Create lightweight summary dataset for listing
- Implement on-demand detail fetch
- Add HTTP caching (ETag, Cache-Control)

### 2.2 Virtualization & Pagination
- Implement react-window for list virtualization
- Add client-side pagination with sensible defaults (20 items)
- Plan server-side pagination for future

### 2.3 Runtime Performance
- Debounce search input (300ms)
- Use useDeferredValue for filter inputs
- Memoize filtered/sorted arrays with useMemo
- Memoize filter handlers with useCallback

## Phase 3: Images & Fonts Optimization

### 3.1 Image Optimization
- Convert broker logos to WebP/AVIF formats
- Implement responsive srcset/sizes
- Add lazy loading via imageService
- Add blur-up placeholders for better perceived performance

### 3.2 Font Optimization
- Add preconnect to fonts.googleapis.com and fonts.gstatic.com
- Preload critical fonts (Inter, system fonts)
- Enforce font-display: swap across all fonts
- Minimize font weight variants

## Phase 4: Code Splitting & Lazy Loading

### 4.1 Route-Level Splitting
- Convert heavy pages to React.lazy + Suspense
- Add loading skeletons for better UX
- Split admin dashboard components

### 4.2 Component-Level Splitting
- Defer charts behind IntersectionObserver
- Lazy load SEO dashboards
- Split icon libraries into separate chunk
- Load analytics components on demand

### 4.3 Icon Optimization
- Move to per-icon imports from lucide-react/@heroicons
- Create lazy "icons" chunk
- Use tree-shaking to reduce unused icons

## Phase 5: Build & Network Optimization

### 5.1 Vite Build Tuning
- Verify manualChunks for charts/icons
- Refine optimizeDeps includes/excludes
- Adjust chunk size warning limits
- Enable source maps for debugging

### 5.2 Network Optimization
- Enable gzip/brotli compression in production
- Set long-lived cache headers for static assets
- Implement service worker caching strategy
- Add resource hints (preconnect, prefetch)

## Phase 6: Performance Monitoring

### 6.1 Core Web Vitals Tracking
- Add performance monitoring hooks
- Capture LCP, FID, CLS, TTFB, FCP
- Send metrics to analytics endpoint
- Set performance thresholds and alerts

### 6.2 Budget Tracking
- Establish performance budgets
- Bundle size limits per chunk
- Image size limits with compression
- Font loading time budgets

## Implementation Order

1. **Baseline Setup** (Day 1)
   - Add bundle analyzer
   - Create performance baseline script
   - Collect initial metrics

2. **Brokers Listing** (Day 2-3)
   - Implement virtualization
   - Add async data loading
   - Optimize filters/search

3. **Images & Fonts** (Day 4)
   - Optimize image formats
   - Add lazy loading
   - Optimize font loading

4. **Code Splitting** (Day 5-6)
   - Route-level splitting
   - Component lazy loading
   - Icon optimization

5. **Build & Network** (Day 7)
   - Vite configuration tuning
   - Compression and caching

6. **Monitoring** (Day 8)
   - Web Vitals tracking
   - Budget enforcement

## Success Metrics

### Load Time Targets
- Home page: < 1.5s LCP
- Brokers listing: < 2s LCP
- Broker detail: < 1.8s LCP
- Admin dashboard: < 2.5s LCP

### Bundle Size Targets
- Initial JS: < 200KB gzipped
- Icons chunk: < 50KB gzipped
- Charts chunk: < 100KB gzipped
- Total page weight: < 1MB initial load

### Web Vitals Targets
- LCP: < 2.5s
- FID: < 100ms
- CLS: < 0.1
- FCP: < 1.8s
- TTFB: < 600ms

## Files to Create/Modify

### New Files
- `scripts/performance-baseline.cjs` - Baseline collection script
- `scripts/bundle-analyze.cjs` - Bundle analysis script
- `components/common/VirtualizedList.tsx` - React-window wrapper
- `hooks/useDebouncedSearch.ts` - Debounced search hook
- `hooks/useVirtualizedList.ts` - Virtualization hook
- `services/performanceTracker.ts` - Web Vitals tracking

### Modified Files
- `vite.config.ts` - Add bundle analyzer plugin
- `package.json` - Add rollup-plugin-visualizer dependency
- `pages/brokers.tsx` - Implement virtualization and optimizations
- `services/unifiedBrokerService.ts` - Add summary dataset
- `components/common/UnifiedBrokerCard.tsx` - Optimize images
- `App.tsx` - Add route-level code splitting
- `services/imageService.ts` - Enhance with WebP/AVIF support

## Testing Strategy

### Performance Testing
- Lighthouse CI for automated testing
- Bundle size regression testing
- Web Vitals monitoring in production
- Real user monitoring (RUM) implementation

### Manual Testing
- Test on slow 3G networks
- Test on low-end devices
- Test with large datasets
- Test admin dashboard with charts

## Rollout Plan

1. **Development Environment**
   - Implement all optimizations
   - Test with local data
   - Validate performance improvements

2. **Staging Environment**
   - Test with production-like data
   - Validate bundle sizes
   - Test network optimizations

3. **Production Rollout**
   - Feature flag for major changes
   - Monitor performance metrics
   - Rollback plan if needed

## Monitoring & Maintenance

### Ongoing Monitoring
- Weekly performance reports
- Bundle size tracking
- Web Vitals trends
- User experience metrics

### Maintenance Tasks
- Update dependencies for performance
- Optimize new features
- Regular performance audits
- Budget adjustments as needed