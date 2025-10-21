import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import {
  useSyncExternalStoreShimPlugin,
  useSyncExternalStoreShimEsbuildPlugin,
} from './vite.plugins'

/**
 * Loop-free Vite configuration
 * This configuration is optimized to prevent restart loops at all costs
 */
export default defineConfig(({ command, ssrBuild }) => {
  const isDev = command === 'dev'

  return {
    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __SSR_BUILD__: ssrBuild,
      __DEV_NO_LOOP__: 'true',
    },

    plugins: [
      react({
        // Fast refresh optimizations
        fastRefresh: true,
        // Exclude problematic files from fast refresh
        include: '**/*.{ts,tsx,js,jsx}',
        exclude: [
          '**/node_modules/**',
          '**/dist/**',
          '**/src/utils/vite-hmr-helper.ts',
          '**/components/error/**',
        ],
      }),
      useSyncExternalStoreShimPlugin(),
    ],

    publicDir: 'public',

    // Ultra-stable server configuration
    server: isDev ? {
      port: Number(process.env.VITE_DEV_PORT) || 3005, // Configurable dev port
      host: 'localhost',
      open: false, // Don't auto-open
      strictPort: false, // Allow fallback
      hmr: {
        overlay: false, // Disable error overlay completely
        port: 24680, // Fresh HMR port
        // Conservative HMR settings
        timeout: 30000,
        reconnect: 10,
      },
      // Very conservative watching
      watch: {
        usePolling: false, // Native watching is more stable
        interval: 5000, // Much slower interval
        followSymlinks: false,
        // Comprehensive ignore list
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
          '**/scripts/**',
          '**/backups/**',
          '**/reports/**',
          '**/*audit-report*.json',
          '**/*optimization-report*.json',
          '**/*migration*.json',
          '**/*.csv',
          '**/.DS_Store',
          '**/Thumbs.db',
          '**/*.lock',
          '**/package-lock.json',
          '**/yarn.lock',
          '**/pnpm-lock.yaml',
          // HMR helper specifically
          '**/src/utils/vite-hmr-helper.ts',
          // Error boundaries that might cause loops
          '**/components/error/**',
          '**/src/components/error/**',
          // Provider files
          '**/contexts/*Context.tsx',
          '**/contexts/AppProviders.tsx',
          '**/src/contexts/*Context.tsx',
          '**/src/contexts/AppProviders.tsx',
          // Large data files
          '**/data/**/*.json',
          '**/*.min.js',
          '**/*.min.css',
          // Configuration files
          '**/*.config.*',
          '**/.env*',
          // Test files
          '**/*.test.*',
          '**/*.spec.*',
          '**/test/**',
          '**/tests/**',
          // Documentation
          '**/*.md',
          '**/*.mdx',
          // Generated files
          '**/*.generated.*',
          '**/Brokeranalysisgooglestudio/**',
        ],
      },
      // Reduce filesystem pressure
      fs: {
        strict: false,
      },
    } : undefined,

    // Conservative build settings
    build: {
      outDir: 'dist/client',
      rollupOptions: {
        output: {
          manualChunks: undefined, // Disable automatic chunking for stability
        },
        treeshake: 'smallest', // Conservative tree shaking
      },
      sourcemap: true,
      minify: 'esbuild', // Faster minification
    },

    // Minimal dependency optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'cookie', // Include cookie to fix ES module import issues
        'react-router-dom', // Include react-router-dom to pre-bundle its dependencies
      ],
      exclude: [
        // Exclude other problematic packages
        '@clerk/clerk-react',
        'chart.js',
        'lucide-react',
        'use-sync-external-store',
      ],
      force: false, // Never force re-bundling
      // Add CommonJS interop settings
      esbuildOptions: {
        target: 'es2020',
        // Enable tree shaking and other optimizations
        treeShaking: true,
        plugins: [useSyncExternalStoreShimEsbuildPlugin()],
      },
    },

    // Path aliases
    resolve: {
      alias: [
        { find: '@', replacement: path.resolve(__dirname, './') },
        { find: '@/src', replacement: path.resolve(__dirname, './src') },
        { find: '@/components', replacement: path.resolve(__dirname, './components') },
        { find: '@/contexts', replacement: path.resolve(__dirname, './contexts') },
        { find: '@/lib', replacement: path.resolve(__dirname, './lib') },
        { find: '@/utils', replacement: path.resolve(__dirname, './utils') },
        {
          find: 'set-cookie-parser',
          replacement: path.resolve(__dirname, './src/polyfills/set-cookie-parser-fix.ts'),
        },
        {
          find: 'use-sync-external-store/shim/index.js',
          replacement: path.resolve(
            __dirname,
            './src/mocks/use-sync-external-store/shim/index.js',
          ),
        },

      ],
    },

    // Screen management
    clearScreen: false,

    // Environment prefix
    envPrefix: 'VITE_',

    // CSS configuration
    css: {
      postcss: './postcss.config.js',
      devSourcemap: false, // Disable CSS source maps
    },

    // Preview settings
    preview: {
      port: 3004,
      host: 'localhost',
    },

    // Experimental features disabled
    experimental: {},

    // Worker configuration
    worker: {
      format: 'es',
    },
  }
})
