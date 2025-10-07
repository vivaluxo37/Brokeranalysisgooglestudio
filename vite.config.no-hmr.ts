/**
 * Emergency Vite Configuration - HMR Disabled
 * Use this as a last resort if continuous reloading persists
 * Run with: npm run dev:no-hmr
 */

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command, ssrBuild }) => ({
  plugins: [react()],
  publicDir: 'public',
  css: {
    postcss: './postcss.config.js',
  },

  // Configure server with HMR disabled
  server: {
    port: 3000,
    host: 'localhost',
    open: true,

    // HMR completely disabled
    hmr: false,

    // Conservative watch configuration
    watch: {
      usePolling: true,
      interval: 2000,  // Slower polling
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
        // Additional patterns
        '**/.next/**',
        '**/.nuxt/**',
        '**/.output/**',
        '**/.vercel/**',
        '**/.netlify/**',
        '**/.firebase/**',
        '**/package-lock.json',
        '**/yarn.lock',
        '**/pnpm-lock.yaml',
        '**/.env*',
        '**/tsconfig*.json',
        '**/.eslintrc*',
        '**/.prettierrc*',
        '**/.editorconfig',
        '**/.gitignore',
        '**/README.md',
        '**/LICENSE',
        '**/*.lock',
        '**/*.tgz',
        '**/*.tar.gz'
      ]
    }
  },

  // Build configuration
  build: {
    outDir: 'dist/client',
    rollupOptions: {
      output: {
        manualChunks: undefined // Disable manual chunking
      }
    },
    sourcemap: true,
    minify: 'terser',
  },

  // Optimize dependencies
  optimizeDeps: {
    force: true,
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ]
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

  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
    __SSR_BUILD__: ssrBuild,
    __HMR_DISABLED__: JSON.stringify(true)
  }
}))