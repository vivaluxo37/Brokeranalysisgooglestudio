import { defineConfig } from 'vite'
import compression from 'vite-plugin-compression'
import { VitePWA } from 'vite-plugin-pwa'

export const compressionConfig = {
  // Enable gzip compression
  gzip: {
    algorithm: 'gzip' as const,
    ext: '.gz',
    threshold: 10240, // Only compress files larger than 10KB
    compressionOptions: {
      level: 9, // Maximum compression
    },
    deleteOriginalAsset: false, // Keep original files for fallback
  },

  // Enable brotli compression (better than gzip)
  brotli: {
    algorithm: 'brotliCompress' as const,
    ext: '.br',
    threshold: 10240, // Only compress files larger than 10KB
    compressionOptions: {
      level: 11, // Maximum compression for brotli
    },
    deleteOriginalAsset: false,
  },
}

// Cache headers configuration
export const cacheHeaders = {
  // Static assets that should be cached long-term
  assets: {
    match: /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf|eot)$/,
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable', // 1 year
      Expires: new Date(Date.now() + 31536000 * 1000).toUTCString(),
    },
  },

  // HTML files should be cached but revalidated
  html: {
    match: /\.html$/,
    headers: {
      'Cache-Control': 'public, max-age=3600, must-revalidate', // 1 hour
    },
  },

  // API responses should be cached briefly
  api: {
    match: /^\/api\//,
    headers: {
      'Cache-Control': 'public, max-age=300, must-revalidate', // 5 minutes
    },
  },

  // Broker summaries should be cached longer
  brokerData: {
    match: /^\/api\/brokers-summaries/,
    headers: {
      'Cache-Control': 'public, max-age=1800, must-revalidate', // 30 minutes
      ETag: 'true',
      Vary: 'Accept-Encoding',
    },
  },
}

// PWA configuration for offline caching
export const pwaConfig = {
  registerType: 'autoUpdate' as const,
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/api\./i,
        handler: 'NetworkFirst' as const,
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24, // 24 hours
          },
          cacheKeyWillBeUsed: async ({ request }: { request: Request }) => {
            return `${request.url}?v=${Date.now()}`
          },
        },
      },
      {
        urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
        handler: 'CacheFirst' as const,
        options: {
          cacheName: 'images-cache',
          expiration: {
            maxEntries: 200,
            maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
          },
        },
      },
      {
        urlPattern: /\.(?:js|css)$/,
        handler: 'StaleWhileRevalidate' as const,
        options: {
          cacheName: 'static-resources',
          expiration: {
            maxEntries: 100,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
          },
        },
      },
    ],
  },
  includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
  manifest: {
    name: 'Broker Analysis Platform',
    short_name: 'BrokerAnalysis',
    description: 'Compare and analyze forex brokers',
    theme_color: '#2563eb',
    background_color: '#ffffff',
    display: 'standalone' as const,
    icons: [
      {
        src: 'pwa-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'pwa-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },
}

// Export the complete configuration
export const networkOptimizationConfig = {
  plugins: [
    // Gzip compression
    compression(compressionConfig.gzip),

    // Brotli compression
    compression(compressionConfig.brotli),

    // PWA for offline caching
    VitePWA(pwaConfig),
  ],

  // Configure server headers for development
  server: {
    headers: (url: string) => {
      // Apply cache headers based on URL patterns
      for (const [name, config] of Object.entries(cacheHeaders)) {
        if (config.match.test(url)) {
          return config.headers
        }
      }
      return {}
    },
  },

  // Configure build headers for production
  preview: {
    headers: (url: string) => {
      // Apply cache headers based on URL patterns
      for (const [name, config] of Object.entries(cacheHeaders)) {
        if (config.match.test(url)) {
          return config.headers
        }
      }
      return {}
    },
  },

  // Optimize build for better caching
  build: {
    // Enable source maps for debugging
    sourcemap: true,

    // Generate manifest for asset caching
    manifest: true,

    // Rollup options for better chunking
    rollupOptions: {
      output: {
        // Add content hash to filenames for cache busting
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]',

        // Manual chunk optimization (already configured in main vite.config.ts)
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react'],
          charts: ['recharts'],
          icons: ['lucide-react'],
        },
      },
    },

    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },
}
