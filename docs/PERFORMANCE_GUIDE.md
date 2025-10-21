# Performance Guide

This guide covers performance optimization strategies and best practices for the Broker Analysis application.

## Overview

The application implements multiple performance optimization layers:
- Bundle optimization and code splitting
- Advanced caching strategies
- Image optimization
- Performance monitoring
- Core Web Vitals tracking

## ⚡ Bundle Optimization

### Code Splitting Strategy

The application uses intelligent code splitting:

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // React ecosystem
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          
          // Chart libraries
          if (id.includes('chart.js') || id.includes('recharts')) {
            return 'charts';
          }
          
          // Feature-based splitting
          if (id.includes('/components/chatbot/')) {
            return 'feature-chatbot';
          }
        }
      }
    }
  }
});
```

### Bundle Analysis

Run the bundle analyzer to identify optimization opportunities:

```bash
npm run analyze:bundle
```

**Target Metrics:**
- Main bundle: < 200KB (gzipped)
- Largest chunk: < 100KB
- Total bundle size: < 1MB
- Time to Interactive: < 3 seconds

### Lazy Loading

Implement lazy loading for heavy components:

```typescript
import { LazyComponent } from '../components/lazy/LazyComponent';

const ChartComponent = LazyComponent(() => import('./ChartComponent'), {
  preload: false,
  fallback: <ChartSkeleton />
});
```

## 🚀 Caching Strategy

### Multi-Layer Caching

1. **Memory Cache** - Fastest access, limited by browser memory
2. **Session Storage** - Persists for the session
3. **Local Storage** - Persists across sessions (when appropriate)
4. **Service Worker** - Offline capabilities

### Cache Implementation

```typescript
import { useCache } from '../hooks/useCache';

const { data, isLoading, error } = useCache(
  () => fetchBrokerData(),
  {
    key: 'broker-data',
    ttl: 30 * 60 * 1000, // 30 minutes
    persist: true,
    tags: ['brokers', 'data']
  }
);
```

### Cache Invalidation

```typescript
// Tag-based invalidation
cacheService.clearByTag('user-preferences');

// Time-based invalidation
cacheService.delete('expired-key');
```

## 🖼️ Image Optimization

### OptimizedImage Component

```typescript
import { OptimizedImage } from '../components/ui/OptimizedImage';

<OptimizedImage
  src="/images/broker-logo.png"
  alt="Broker Logo"
  width={200}
  height={200}
  loading="lazy"
  format="auto"
  quality={80}
  placeholder="blur"
  onLoad={() => console.log('Image loaded')}
/>
```

### Image Formats

- **WebP** - Modern format with better compression
- **AVIF** - Next-generation format (when supported)
- **Responsive Images** - Multiple sizes for different devices

### Image Service

```typescript
import imageService from '../services/imageService';

const optimizedUrl = imageService.generateOptimizedUrl(originalUrl, {
  width: 400,
  height: 300,
  quality: 80,
  format: 'webp'
});
```

## 📊 Performance Monitoring

### Core Web Vitals

The application tracks all Core Web Vitals:

```typescript
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

const { metrics, webVitals, sendMetrics } = usePerformanceMonitor({
  trackPageView: true,
  trackInteractions: true,
  sendToAnalytics: process.env.NODE_ENV === 'production'
});
```

### Custom Metrics

```typescript
// Track API response time
performanceMonitoring.startTiming('api-brokers');
const response = await fetchBrokers();
performanceMonitoring.endTiming('api-brokers');

// Track user interactions
performanceMonitoring.startTiming('click-to-action');
handleButtonClick();
performanceMonitoring.endTiming('click-to-action');
```

### Performance Budgets

```typescript
const performanceBudgets = {
  lcp: 2500,      // Largest Contentful Paint (ms)
  fid: 100,       // First Input Delay (ms)
  cls: 0.1,       // Cumulative Layout Shift
  fcp: 1800,      // First Contentful Paint (ms)
  ttfb: 800,      // Time to First Byte (ms)
  bundleSize: 1024 * 1024 // 1MB
};
```

## 🎯 Optimization Techniques

### 1. Critical Resource Loading

```html
<!-- Preload critical resources -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/critical.css" as="style">

<!-- DNS prefetch for external domains -->
<link rel="dns-prefetch" href="//api.example.com">
```

### 2. Resource Hints

```typescript
// Preload important resources
const preloadImage = (src: string) => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
};
```

### 3. Intersection Observer

```typescript
const useIntersectionObserver = (ref, onIntersect) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onIntersect();
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [onIntersect]);
};
```

### 4. Virtual Scrolling

For large lists, implement virtual scrolling:

```typescript
import { FixedSizeList as List } from 'react-window';

const VirtualList = ({ items }) => (
  <List
    height={400}
    itemCount={items.length}
    itemSize={50}
    itemData={items}
  >
    {({ index, style, data }) => (
      <div style={style}>
        {data[index].name}
      </div>
    )}
  </List>
);
```

## 🔧 Performance Tools

### Built-in Tools

1. **Bundle Analyzer**
   ```bash
   npm run analyze:bundle
   ```

2. **TypeScript Migration Helper**
   ```bash
   npm run type-check:migrate
   ```

3. **Performance Tests**
   ```bash
   npm run test:performance
   ```

### Browser Tools

1. **Lighthouse** - Audits for performance, accessibility, and more
2. **Performance Tab** - Runtime performance analysis
3. **Network Tab** - Resource loading analysis
4. **Coverage Tab** - JavaScript code coverage

### Third-party Tools

1. **WebPageTest** - Detailed performance analysis
2. **GTmetrix** - Performance monitoring and optimization
3. **SpeedCurve** - Real user monitoring
4. **Bundlephobia** - Bundle size analysis

## 📈 Performance Metrics

### Key Metrics to Track

1. **Core Web Vitals**
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)
   - CLS (Cumulative Layout Shift)

2. **Custom Metrics**
   - API response times
   - Component render times
   - User interaction delays

3. **Resource Metrics**
   - Bundle sizes
   - Image load times
   - Cache hit rates

### Performance Targets

```typescript
const performanceTargets = {
  // Core Web Vitals
  lcp: { good: 2500, needsImprovement: 4000 },
  fid: { good: 100, needsImprovement: 300 },
  cls: { good: 0.1, needsImprovement: 0.25 },
  
  // Custom metrics
  apiResponse: { good: 200, needsImprovement: 1000 },
  pageLoad: { good: 3000, needsImprovement: 5000 },
  
  // Resource metrics
  bundleSize: { good: 250 * 1024, needsImprovement: 1024 * 1024 }, // 250KB / 1MB
  imageLoad: { good: 500, needsImprovement: 2000 }
};
```

## 🚨 Performance Issues and Solutions

### Common Issues

1. **Large Bundle Size**
   - **Problem**: Slow initial load
   - **Solution**: Code splitting, tree shaking, dynamic imports

2. **Slow API Responses**
   - **Problem**: Poor user experience
   - **Solution**: Caching, API optimization, pagination

3. **Layout Shifts**
   - **Problem**: Poor user experience
   - **Solution**: Image dimensions, skeleton loading, proper sizing

4. **Memory Leaks**
   - **Problem**: Performance degradation over time
   - **Solution**: Proper cleanup, avoid memory hoarding

### Debugging Performance

```typescript
// Performance timing
console.time('component-render');
// ... component logic
console.timeEnd('component-render');

// Memory usage
console.log('Memory usage:', performance.memory);

// Navigation timing
const navigation = performance.getEntriesByType('navigation')[0];
console.log('Page load time:', navigation.loadEventEnd - navigation.startTime);
```

## 📅 Performance Monitoring Schedule

### Daily

- Check Core Web Vitals in production
- Monitor error rates
- Review API response times

### Weekly

- Analyze bundle size trends
- Review cache hit rates
- Check for performance regressions

### Monthly

- Run comprehensive performance audits
- Update performance budgets
- Review optimization opportunities

## 📚 Additional Resources

- [Web.dev Performance](https://web.dev/performance/)
- [Core Web Vitals](https://web.dev/vitals/)
- [React Performance](https://reactjs.org/docs/optimizing-performance.html)
- [Vite Performance](https://vitejs.dev/guide/build.html#build-optimizations)

---

**Last Updated:** January 2025
**Review Frequency:** Monthly
**Maintainer:** Development Team
