/**
 * Stable Vite Configuration - Fixes Auto-Reload Issues
 * This configuration is optimized to prevent unwanted reloads
 * Run with: npm run dev:stable
 */

import { defineConfig, createLogger } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Custom logger to suppress noise
const customLogger = createLogger()
const originalError = customLogger.error
const originalWarn = customLogger.warn

customLogger.error = (msg, options) => {
  if (msg.includes("WebSocket server error: Port is already in use")) {
    return
  }
  originalError(msg, options)
}

customLogger.warn = (msg, options) => {
  if (msg.includes('HMR') || msg.includes('hmr')) {
    return
  }
  originalWarn(msg, options)
}

export default defineConfig(({ command, ssrBuild }) => ({
  logLevel: 'info',
  customLogger,
  
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __SSR_BUILD__: ssrBuild,
  },
  
  plugins: [react()],
  publicDir: 'public',
  
  css: {
    postcss: './postcss.config.js',
  },
  
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
  },
  
  server: {
    port: 5173,
    host: 'localhost',
    open: false, // Don't auto-open to reduce conflicts
    strictPort: true, // Fail if the port is taken
    
    // Stable HMR configuration
    hmr: {
      overlay: true,
      port: 24680, // Unique port to avoid conflicts
      host: 'localhost',
      protocol: 'ws',
      clientPort: 24680,
      timeout: 60000, // Longer timeout
    },
    
    // Optimized watch configuration for Windows
    watch: {
      // Use native file watching (more efficient on Windows)
      usePolling: false,

      // Debounce bursts of FS events (prevents rapid reload loops)
      awaitWriteFinish: {
        stabilityThreshold: 500,
        pollInterval: 100
      },
      ignoreInitial: true,
      
      // Narrow the watch scope aggressively: only watch core app folders
      // Everything else is ignored via the function below
      ignored: (filePath: string) => {
        const norm = filePath.replace(/\\/g, '/').toLowerCase()
        const allow = [
          '/src/',
          '/components/',
          '/contexts/',
          '/lib/',
          '/utils/',
          '/public/',
          '/index.html'
        ]
        // Do not ignore if path contains any allow-listed segment
        const isAllowed = allow.some(seg => norm.includes(seg))
        if (isAllowed) return false
        // Ignore everything else by default
        return true
      },
      // All other paths are ignored via the function above
    }
  },
  
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (!ssrBuild) {
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'vendor';
              }
              if (id.includes('react-router')) {
                return 'router';
              }
              if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
                return 'charts';
              }
              if (id.includes('lucide-react')) {
                return 'icons';
              }
              return 'vendor';
            }
            if (id.includes('components/ui/')) {
              return 'ui';
            }
          }
          return null;
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js'
      },
      treeshake: true,
    },
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@clerk/clerk-react',
      'chart.js',
      'react-chartjs-2',
      'lucide-react',
      'class-variance-authority',
      'clsx',
      'tailwind-merge'
    ],
  },
  
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
}))
