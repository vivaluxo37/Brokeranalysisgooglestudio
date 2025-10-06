import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Minimal Vite configuration to prevent reload loops
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  
  // Simple server configuration optimized for Linux
  server: {
    port: 3000,
    host: 'localhost',
    open: false, // Don't auto-open browser
    strictPort: true, // Fail if port is in use
    
    // Simplified HMR configuration
    hmr: {
      overlay: false, // Disable error overlay that might cause issues
      port: 24679, // Different port to avoid conflicts
    },
    
    // Minimal watch configuration
    watch: {
      usePolling: false, // Native file watching for Linux
      followSymlinks: false,
      ignored: [
        '**/node_modules/**',
        '**/.git/**',
        '**/dist/**',
        '**/.vite/**',
        '**/*.log',
        '**/tsconfig.tsbuildinfo'
      ]
    }
  },
  
  // Essential build configuration only
  build: {
    outDir: 'dist/client',
    sourcemap: false, // Disable sourcemaps for faster builds
  },
  
  // Basic optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ],
  },
  
  // Essential aliases only
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@/src': path.resolve(__dirname, './src'),
      '@/components': path.resolve(__dirname, './components'),
    },
  },
})