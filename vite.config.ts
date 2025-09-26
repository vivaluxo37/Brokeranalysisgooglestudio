import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
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
  // Configure server for history API fallback
  server: {
    port: 3000,
    open: true,
  },
  // Configure build for Core Web Vitals optimization
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      output: {
        // Enhanced code splitting for better performance
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['chart.js', 'react-chartjs-2'],
          icons: ['lucide-react'],
          utils: ['class-variance-authority', 'clsx', 'tailwind-merge'],
          ai: ['@google/genai'],
          ui: [
            './components/ui/button.tsx',
            './components/ui/card.tsx',
            './components/ui/badge.tsx',
            './components/ui/input.tsx',
            './components/ui/select.tsx'
          ]
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
    },
  },
  // Performance optimizations
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
})