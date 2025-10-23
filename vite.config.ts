import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import {
  useSyncExternalStoreShimPlugin,
  useSyncExternalStoreShimEsbuildPlugin,
} from './vite.plugins'

// https://vitejs.dev/config/
export default defineConfig(() => ({
  // Set environment variable for SSR detection
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __SSR_BUILD__: false,
  },
  plugins: [react(), useSyncExternalStoreShimPlugin()],
  publicDir: 'public',
  css: {
    postcss: './postcss.config.js',
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
  },
  // Configure server for stable development
  server: {
    port: Number(process.env.VITE_DEV_PORT) || 3000,
    host: 'localhost',
    open: false, // Don't auto-open to prevent issues
    strictPort: true, // Use specific port to avoid conflicts
    hmr: {
      overlay: false, // Disable error overlay to prevent restart loops
      port: 24679, // Use different port for HMR to avoid conflicts
    },
    watch: {
      usePolling: false, // Disable polling - causes excessive reloads on Windows
      interval: 3000, // Increased interval to reduce rapid restarts
      followSymlinks: false,
      // Enhanced ignore list to prevent restart loops
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
        '**/coverage/**',
        '**/.vite/**',
        '**/.cache/**',
        '**/.temp/**',
        '**/.tmp/**',
        '**/*.log',
        '**/*.log.*',
        '**/scripts/**/*.json',
        '**/backups/**',
        '**/reports/**',
        '**/*audit-report*.json',
        '**/*optimization-report*.json',
        '**/*migration*.json',
        '**/*.csv',
        '**/.DS_Store',
        '**/Thumbs.db',
        // Ignore error boundary and provider files temporarily
        '**/components/error/**',
        '**/src/components/error/**',
        '**/contexts/*Context.tsx',
        '**/contexts/AppProviders.tsx',
        '**/src/contexts/*Context.tsx',
        '**/src/contexts/AppProviders.tsx',
        // Ignore HMR helper to prevent loops
        '**/src/utils/vite-hmr-helper.ts',
        // Ignore large data files
        '**/data/**/*.json',
        '**/*.min.js',
        '**/*.min.css',
        // Ignore lock files
        '**/package-lock.json',
        '**/yarn.lock',
        '**/pnpm-lock.yaml',
        // Ignore configuration files
        '**/*.config.*',
        '**/.env*',
        // Ignore test files
        '**/*.test.*',
        '**/*.spec.*',
        '**/test/**',
        '**/tests/**',
        // Ignore documentation
        '**/*.md',
        '**/*.mdx',
        // Ignore generated files
        '**/*.generated.*',
        '**/Brokeranalysisgooglestudio/**',
      ]
    }
  },

  // Add filesystem settings to reduce pressure
  fs: {
    strict: false,
  },

  // Clear screen management
  clearScreen: false,

  // Configure build for Core Web Vitals optimization
  build: {
    outDir: 'dist/client',
    // Target modern browsers for better optimization
    target: 'es2020',
    // Enable CSS code splitting
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Advanced code splitting strategy
        manualChunks: (id) => {

          // Node modules splitting
          if (id.includes('node_modules')) {
            // React ecosystem (including scheduler to prevent circular dependencies)
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router') || id.includes('scheduler')) {
              return 'react-vendor';
            }
            
            // Chart libraries
            if (id.includes('chart.js') || id.includes('react-chartjs-2') || id.includes('recharts')) {
              return 'charts';
            }
            
            // Icon libraries
            if (id.includes('lucide-react') || id.includes('@heroicons/react')) {
              return 'icons';
            }
            
            // UI libraries
            if (id.includes('@radix-ui') || id.includes('class-variance-authority') || 
                id.includes('clsx') || id.includes('tailwind-merge')) {
              return 'ui-libs';
            }
            
            // Authentication
            if (id.includes('@clerk/clerk-react')) {
              return 'auth';
            }
            
            // Database/Storage
            if (id.includes('@supabase/supabase-js')) {
              return 'database';
            }
            
            // AI/ML libraries
            if (id.includes('@google/generative-ai')) {
              return 'ai-core';
            }
            
            // Testing libraries (shouldn't be in production but just in case)
            if (id.includes('@testing-library') || id.includes('vitest') || id.includes('cypress')) {
              return 'testing';
            }
            
            // Other vendor libraries
            return 'vendor';
          }
          
          // Application code splitting
          if (id.includes('/pages/')) {
            // Extract page-level chunks
            if (id.includes('HomePage') || id.includes('LandingPage')) {
              return 'pages-home';
            }
            if (id.includes('BrokerDetailPage')) {
              return 'pages-brokers';
            }
            if (id.includes('ComparePage')) {
              return 'pages-compare';
            }
            if (id.includes('EducationHubPage') || id.includes('QuizPage')) {
              return 'pages-education';
            }
            if (id.includes('DashboardPage') || id.includes('TradingJournalPage')) {
              return 'pages-dashboard';
            }
            return 'pages-misc';
          }
          
          // Feature-based splitting
          if (id.includes('/components/chatbot/')) {
            return 'feature-chatbot';
          }
          if (id.includes('/components/broker/')) {
            return 'feature-brokers';
          }
          if (id.includes('/components/education/')) {
            return 'feature-education';
          }
          if (id.includes('/components/tools/')) {
            return 'feature-tools';
          }
          
          // UI components
          if (id.includes('/components/ui/')) {
            return 'ui-components';
          }
          
          // Services
          if (id.includes('/services/')) {
            return 'services';
          }
          
          // Hooks
          if (id.includes('/hooks/')) {
            return 'hooks';
          }
          
          // Utils
          if (id.includes('/utils/') || id.includes('/lib/')) {
            return 'utils';
          }
        },
        
        // Optimized asset naming for better caching
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          const name = info[0];
          
          // Images
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return `assets/images/${name}-[hash][extname]`;
          }
          
          // Fonts
          if (/woff2?|ttf|eot|otf/i.test(ext)) {
            return `assets/fonts/${name}-[hash][extname]`;
          }
          
          // CSS
          if (/css/i.test(ext)) {
            return `assets/css/${name}-[hash][extname]`;
          }
          
          // JavaScript
          if (/js|mjs/i.test(ext)) {
            return `assets/js/${name}-[hash][extname]`;
          }
          
          // Media files
          if (/mp4|webm|ogg|mp3|wav/i.test(ext)) {
            return `assets/media/${name}-[hash][extname]`;
          }
          
          // Default
          return `assets/${name}-[hash][extname]`;
        },
        
        // Optimized chunk naming
        chunkFileNames: (chunkInfo) => {
          // Get meaningful name from chunk
          if (chunkInfo.facadeModuleId) {
            const facadeModuleId = chunkInfo.facadeModuleId;
            const parts = facadeModuleId.split('/');
            const fileName = parts[parts.length - 1];
            const name = fileName.replace(/\.(tsx?|jsx?)$/, '');
            
            // Handle specific patterns
            if (name.startsWith('index')) {
              const folder = parts[parts.length - 2] || 'chunk';
              return `js/${folder}-[hash].js`;
            }
            
            return `js/${name}-[hash].js`;
          }
          
          return `js/chunk-[hash].js`;
        },
        
        // Entry file naming
        entryFileNames: `js/[name]-[hash].js`,
      },
      
      // Advanced tree shaking
      treeshake: {
        moduleSideEffects: false,
        propertyReadSideEffects: false,
        unknownGlobalSideEffects: false,
      },
      
      // External dependencies (for production CDN usage)
      external: process.env.NODE_ENV === 'production' ? [
        // Example: 'react', 'react-dom' for CDN
      ] : [],
    },
    
    // Source maps for debugging
    sourcemap: process.env.NODE_ENV === 'development',
    
    // Advanced minification
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console logs in production
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: process.env.NODE_ENV === 'production' ? 
          ['console.log', 'console.info', 'console.debug'] : [],
        // Advanced optimizations
        passes: 2,
        unsafe: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_proto: true,
        unsafe_regexp: true,
      },
      mangle: {
        properties: {
          regex: /^_/, // Mangle private properties
        },
      },
      format: {
        comments: false,
      },
    },
    
    // Report compressed size
    reportCompressedSize: true,
    
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000,
    
    
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-progress',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      '@clerk/clerk-react',
      'cookie'
    ],
    // Exclude problematic dependencies from optimization
    exclude: [
      'react-router-dom',
      'chart.js',
      'react-chartjs-2',
      'lucide-react',
      '@heroicons/react',
      'set-cookie-parser', // Exclude to prevent ESM/CJS issues
      'use-sync-external-store'
    ],
    // Pre-bundle dependencies to avoid chunk loading issues
    force: false, // Force rebundling can cause HMR loops
    // Conservative bundling settings
    esbuildOptions: {
      target: 'es2020',
      treeShaking: true,
      // Allow CommonJS modules
      format: 'esm',
      plugins: [useSyncExternalStoreShimEsbuildPlugin()]
    }
  },
  
  // SSR options for better CommonJS handling
  ssr: {
    noExternal: ['cookie']
  },
  // Resolve aliases
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './') },
      { find: '@/src', replacement: path.resolve(__dirname, './src') },
      { find: '@/components', replacement: path.resolve(__dirname, './components') },
      { find: '@/contexts', replacement: path.resolve(__dirname, './contexts') },
      { find: '@/lib', replacement: path.resolve(__dirname, './lib') },
      { find: '@/utils', replacement: path.resolve(__dirname, './utils') },
      // Fix for set-cookie-parser ESM/CJS issues - Commented out as polyfill doesn't exist
      // {
      //   find: 'set-cookie-parser',
      //   replacement: path.resolve(__dirname, './src/polyfills/set-cookie-parser-fix.ts'),
      // },
      {
        find: 'use-sync-external-store/shim/index.js',
        replacement: path.resolve(
          __dirname,
          './src/mocks/use-sync-external-store/shim/index.js'
        )
      }
    ],
    // Additional resolve options
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    preferBuiltins: false
  },
}))
