import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ command, ssrBuild }) => ({
  // Set environment variable for SSR detection
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
  // Configure server for stable development
  server: {
    port: 3000,
    host: '0.0.0.0', // Allow external access
    open: false, // Don't auto-open browser in sandbox
    allowedHosts: [
      'localhost',
      '3000-iehoqspv8juoxncwv77wn-6532622b.e2b.dev',
      '3001-iehoqspv8juoxncwv77wn-6532622b.e2b.dev',
      /.*-iehoqspv8juoxncwv77wn-6532622b\.e2b\.dev$/ // Allow all ports for this sandbox
    ],
    hmr: {
      overlay: true,
      port: 24678, // Use different port for HMR to avoid conflicts
      host: 'localhost',
      protocol: 'ws',
      clientPort: 24678,
      timeout: 10000, // Shorter timeout to detect issues faster
      reconnectInterval: 1000 // Faster reconnection
    },
    watch: {
      usePolling: false, // Keep disabled for Linux - only enable for Windows/WSL2
      interval: 300, // Faster interval for better responsiveness
      followSymlinks: false,
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
        // Additional patterns to prevent reload loops
        '**/.git/objects/**',
        '**/.git/refs/**',
        '**/.git/logs/**',
        '**/tsconfig.tsbuildinfo',
        '**/*.swp',
        '**/*.swo',
        '**/.*~'
      ]
    }
  },
  // Configure build for Core Web Vitals optimization
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      output: {
        // Enhanced code splitting for better performance (client-only)
        manualChunks: (id) => {
          // Only apply manual chunking for client builds, not SSR
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
              if (id.includes('class-variance-authority') || id.includes('clsx') || id.includes('tailwind-merge')) {
                return 'utils';
              }
              if (id.includes('@google/genai')) {
                return 'ai';
              }
              if (id.includes('@clerk/clerk-react')) {
                return 'clerk';
              }
              return 'vendor';
            }
            if (id.includes('components/ui/')) {
              return 'ui';
            }
          }
          return null;
        },
        // Asset filename optimization for caching
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
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()
            : 'chunk';
          return `js/${facadeModuleId}-[hash].js`;
        }
      },
      // Enable tree shaking
      treeshake: true,
    },
    // Enable source maps for production debugging
    sourcemap: true,
    // Minify CSS and JavaScript
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  // Optimize dependencies
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
  // Resolve aliases
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
