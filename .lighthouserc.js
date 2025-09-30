module.exports = {
  ci: {
    collect: {
      // URLs to audit
      url: [
        'http://localhost:3000/',
        'http://localhost:3000/best-brokers',
        'http://localhost:3000/best-brokers/ecn-brokers',
        'http://localhost:3000/best-forex-brokers/united-kingdom-2025',
        'http://localhost:3000/admin/login',
      ],
      // Lighthouse settings
      settings: {
        // Use desktop configuration for more realistic results
        preset: 'desktop',
        // Chrome flags for better performance testing
        chromeFlags: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-gpu',
          '--no-zygote',
          '--remote-debugging-port=9222',
          '--remote-debugging-address=0.0.0.0',
          '--hide-scrollbars',
          '--disable-web-security',
          '--disable-features=TranslateUI',
          '--disable-ipc-flooding-protection',
        ],
      },
      // Number of runs per URL
      numberOfRuns: 3,
      // Start server configuration
      startServerCommand: 'npm run dev',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000,
    },
    assert: {
      // Performance thresholds
      assertions: {
        'categories:performance': ['error', { minScore: 0.85 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.90 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        
        // Core Web Vitals thresholds
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        
        // Resource optimization
        'unused-css-rules': ['warn', { maxLength: 2 }],
        'unused-javascript': ['warn', { maxLength: 2 }],
        'modern-image-formats': ['warn', { maxLength: 0 }],
        'uses-webp-images': ['warn', { maxLength: 0 }],
        'uses-optimized-images': ['warn', { maxLength: 0 }],
        'uses-responsive-images': ['warn', { maxLength: 1 }],
        
        // Caching and compression
        'uses-long-cache-ttl': ['warn', { maxLength: 2 }],
        'uses-text-compression': ['error', { maxLength: 0 }],
        
        // JavaScript optimization
        'unminified-css': ['error', { maxLength: 0 }],
        'unminified-javascript': ['error', { maxLength: 0 }],
        'tree-shaking': ['warn', { maxLength: 1 }],
        
        // Network efficiency
        'render-blocking-resources': ['warn', { maxLength: 2 }],
        'eliminate-render-blocking-resources': ['warn', { maxLength: 1 }],
        
        // User experience
        'interactive': ['error', { maxNumericValue: 3500 }],
        'max-potential-fid': ['error', { maxNumericValue: 130 }],
      },
    },
    upload: {
      // Configure for CI/CD integration
      target: 'temporary-public-storage',
      // For production, use LHCI server or other storage
      // target: 'lhci',
      // serverBaseUrl: 'https://your-lhci-server.com',
      // token: 'your-lhci-token',
    },
    server: {
      // LHCI server configuration (optional)
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite',
        sqlDatabasePath: './lhci.db',
      },
    },
  },
  
  // Custom budget configuration
  budgets: [
    {
      // Resource size budgets
      resourceSizes: [
        {
          resourceType: 'script',
          budget: 400, // KB
        },
        {
          resourceType: 'stylesheet',
          budget: 100, // KB
        },
        {
          resourceType: 'image',
          budget: 300, // KB
        },
        {
          resourceType: 'media',
          budget: 200, // KB
        },
        {
          resourceType: 'font',
          budget: 100, // KB
        },
        {
          resourceType: 'document',
          budget: 50, // KB
        },
        {
          resourceType: 'other',
          budget: 200, // KB
        },
      ],
      // Resource count budgets
      resourceCounts: [
        {
          resourceType: 'script',
          budget: 15,
        },
        {
          resourceType: 'stylesheet',
          budget: 8,
        },
        {
          resourceType: 'image',
          budget: 20,
        },
        {
          resourceType: 'font',
          budget: 4,
        },
      ],
    },
  ],
};