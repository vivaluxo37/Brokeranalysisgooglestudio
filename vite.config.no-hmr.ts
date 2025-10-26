import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import {
  useSyncExternalStoreShimPlugin,
  useSyncExternalStoreShimEsbuildPlugin,
} from './vite.plugins'

// Configuration without HMR to avoid port conflicts
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
  // Configure server without HMR
  server: {
    port: Number(process.env.VITE_DEV_PORT) || 3010,
    host: '0.0.0.0',
    open: false,
    strictPort: true,
    hmr: false, // Disable HMR completely
    watch: {
      usePolling: false,
      interval: 1000,
      followSymlinks: false,
      // Ignore list to prevent restart loops
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
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Node modules splitting
          if (id.includes('node_modules')) {
            // React ecosystem
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
            
            return 'vendor';
          }
        },
      },
    },
    sourcemap: process.env.NODE_ENV === 'development',
    minify: 'terser',
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-progress',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      '@clerk/clerk-react',
      'cookie',
      '@supabase/supabase-js' // Include supabase in optimize deps
    ],
    exclude: [
      'react-router-dom',
      'chart.js',
      'react-chartjs-2',
      'lucide-react',
      '@heroicons/react',
      'set-cookie-parser',
      'use-sync-external-store'
    ],
    force: true, // Force re-bundling
    esbuildOptions: {
      target: 'es2020',
      treeShaking: true,
      format: 'esm',
      plugins: [useSyncExternalStoreShimEsbuildPlugin()]
    }
  },
  
  // SSR options for better CommonJS handling
  ssr: {
    noExternal: ['cookie', 'set-cookie-parser']
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
      // Fix for set-cookie-parser ESM/CJS issues
      {
        find: 'set-cookie-parser',
        replacement: path.resolve(__dirname, './src/polyfills/set-cookie-parser-fix.ts'),
      },
      {
        find: 'use-sync-external-store/shim/index.js',
        replacement: path.resolve(
          __dirname,
          './src/mocks/use-sync-external-store/shim/index.js'
        )
      }
    ],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    preferBuiltins: false
  },
}))
