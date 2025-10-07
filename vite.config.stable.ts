import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

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

    plugins: [react()],

    publicDir: 'public',

    // Conservative server configuration for stability
    server: isDev ? {
      port: 3001, // Use different port to avoid conflicts
      host: 'localhost',
      open: false, // Don't auto-open to prevent issues
      strictPort: true, // Fail if port is occupied
      hmr: {
        overlay: false, // Disable error overlay to prevent loops
        port: 24679, // Use different HMR port
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
        '@clerk/clerk-react',
      ],
      force: false, // Don't force re-bundling to prevent loops
    },

    // Path aliases
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './'),
        '@/src': path.resolve(__dirname, './src'),
        '@/components': path.resolve(__dirname, './components'),
        '@/contexts': path.resolve(__dirname, './contexts'),
        '@/lib': path.resolve(__dirname, './lib'),
        '@/utils': path.resolve(__dirname, './utils'),
      },
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