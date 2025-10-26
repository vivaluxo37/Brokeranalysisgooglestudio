import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import {
  useSyncExternalStoreShimPlugin,
  useSyncExternalStoreShimEsbuildPlugin,
} from './vite.plugins'

/**
 * Stable Vite configuration for development
 * This configuration prioritizes stability over features to prevent restart loops
 */
export default defineConfig(({ command, ssrBuild }) => {
  const isDev = command === 'dev'

  return {
    // Set environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __SSR_BUILD__: ssrBuild,
      __DEV_STABLE__: 'true',
    },

    plugins: [react(), useSyncExternalStoreShimPlugin()],

    publicDir: 'public',

    // Conservative server configuration for stability
    server: isDev ? {
      port: Number(process.env.VITE_DEV_PORT) || 3005, // Use configurable port for dev server
      host: 'localhost',
      open: false, // Don't auto-open to prevent issues
      strictPort: true, // Fail if port is occupied
      hmr: {
        overlay: false, // Disable error overlay to prevent loops
        port: 24678, // Use different HMR port
      },
      watch: {
        usePolling: false, // Use native file watching
        interval: 2000, // Slower interval to reduce CPU usage
        followSymlinks: false,
        // More comprehensive ignore list to prevent restart loops
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
          // Ignore error boundary files temporarily
          '**/components/error/**',
          // Ignore provider files that might cause loops
          '**/contexts/*Context.tsx',
          '**/contexts/AppProviders.tsx',
          // Ignore large data files
          '**/data/**/*.json',
          '**/*.min.js',
          '**/*.min.css',
        ]
      }
    } : undefined,

    // Build configuration (only used in production)
    build: {
      outDir: 'dist/client',
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (!ssrBuild && id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor';
              }
              if (id.includes('react-router')) {
                return 'router';
              }
              if (id.includes('@clerk/clerk-react')) {
                return 'clerk';
              }
              return 'vendor';
            }
            return null;
          },
        },
      },
      sourcemap: true,
      minify: 'terser',
    },

    // Dependency optimization
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@clerk/clerk-react'
      ],
      exclude: ['use-sync-external-store'],
      force: false, // Don't force re-bundling to prevent loops
      esbuildOptions: {
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
            './src/mocks/use-sync-external-store/shim/index.js'
          )
        }
      ],
    },

    // Clear screen on restart for better visibility
    clearScreen: false,

    // Environment prefix
    envPrefix: 'VITE_',

    // Experimental features disabled for stability
    experimental: {},

    // CSS configuration
    css: {
      postcss: './postcss.config.js',
      devSourcemap: false, // Disable CSS source maps in dev for performance
    },

    // Preview configuration
    preview: {
      port: 3002,
      host: 'localhost',
    },
  }
})