import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(() => ({
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __SSR_BUILD__: false,
  },
  plugins: [react()],
  publicDir: 'public',
  css: {
    postcss: './postcss.config.js',
  },

  server: {
    port: Number(process.env.VITE_DEV_PORT) || 3000,
    host: 'localhost',
    open: false,
    strictPort: true,
    hmr: {
      overlay: false,
      port: 24679,
    },
  },

  build: {
    outDir: 'dist/client',
    target: 'es2020',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            if (id.includes('@clerk')) {
              return 'auth'
            }
            if (id.includes('set-cookie-parser') || id.includes('cookie')) {
              return 'cookie-utils'
            }
            return 'vendor'
          }
        },
      },
    },
    sourcemap: process.env.NODE_ENV === 'development',
    minify: 'terser',
    reportCompressedSize: true,
    chunkSizeWarningLimit: 1000,
  },

  // Fixed optimizeDeps configuration
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-progress',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      '@clerk/clerk-react',
    ],
    exclude: [],
    esbuildOptions: {
      target: 'es2020',
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/src': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './components'),
      '@/contexts': path.resolve(__dirname, './contexts'),
      '@/lib': path.resolve(__dirname, './lib'),
      '@/utils': path.resolve(__dirname, './utils'),
      // Fix for set-cookie-parser module resolution
      'set-cookie-parser': path.resolve(
        __dirname,
        'src/polyfills/set-cookie-parser-fix.ts',
      ),
    },
    mainFields: ['browser', 'module', 'main'],
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
}))
