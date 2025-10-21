import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import {
  useSyncExternalStoreShimPlugin,
  useSyncExternalStoreShimEsbuildPlugin,
} from './vite.plugins'

// Minimal config that bypasses set-cookie-parser issue
export default defineConfig({
  plugins: [react(), useSyncExternalStoreShimPlugin()],

  server: {
    port: 3000,
    host: 'localhost',
    open: false,
  },

  build: {
    rollupOptions: {
      external: ['set-cookie-parser'], // Externalize the problematic module
    },
  },

  optimizeDeps: {
    exclude: ['set-cookie-parser', '@clerk/clerk-react'], // Exclude problematic deps
    esbuildOptions: {
      plugins: [useSyncExternalStoreShimEsbuildPlugin()],
    },
  },

  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, './') },
      {
        find: 'set-cookie-parser',
        replacement: path.resolve(__dirname, './src/polyfills/set-cookie-parser-fix.ts'),
      },
      {
        find: 'use-sync-external-store/shim/index.js',
        replacement: path.resolve(
          __dirname,
          'src/mocks/use-sync-external-store/shim/index.js',
        ),
      },
    ],
  },
})
