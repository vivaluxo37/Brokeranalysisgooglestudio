/**
 * Development-specific Vite configuration
 * Use this file for enhanced development debugging
 * Run with: npx vite --config vite.config.dev.ts
 */

import { defineConfig, createLogger } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import baseConfig from './vite.config'

// Development logger with detailed HMR debugging
const devLogger = createLogger('info')
const originalWarn = devLogger.warn
const originalInfo = devLogger.info

devLogger.warn = (msg, options) => {
  if (msg.includes('[vite]')) {
    console.log(`🔄 Vite: ${msg}`)
  } else {
    originalWarn(msg, options)
  }
}

devLogger.info = (msg, options) => {
  if (msg.includes('[vite]')) {
    console.log(`ℹ️  Vite: ${msg}`)
  } else {
    originalInfo(msg, options)
  }
}

export default defineConfig(({ command, mode }) => ({
  ...baseConfig({ command, ssrBuild: false }),

  // Development-specific overrides
  logLevel: 'info',
  customLogger: devLogger,

  server: {
    ...baseConfig({ command, ssrBuild: false }).server,

    // Enhanced development server configuration
    strictPort: true, // Fail if port is occupied instead of trying next
    cors: true, // Enable CORS for development

    hmr: {
      ...baseConfig({ command, ssrBuild: false }).server.hmr,
      // Development HMR settings
      overlay: {
        warning: true,
        error: true
      },
      // Additional HMR stability settings for development
      port: 3005,
      host: 'localhost',
      protocol: 'ws',
      clientPort: 3005,
      timeout: 30000,
      reconnect: 10,
      reconnectInterval: 2000,
    },

    watch: {
      // More aggressive watch configuration for development
      usePolling: true,
      interval: 500, // Faster polling for development
      followSymlinks: false,

      // Comprehensive ignore patterns for development
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

        // Development-specific ignores
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
        '**/*.tar.gz',

        // Additional patterns that cause issues
        '**/*.pid',
        '**/*.seed',
        '**/*.pid.lock',
        '**/.npm',
        '**/.eslintcache',
        '**/.stylelintcache',
        '**/.vscode/**',
        '**/.idea/**',
        '**/*.swp',
        '**/*.swo',
        '**/*~',
        '**/.DS_Store?',
        '**/._*',
        '**/.Spotlight-V100',
        '**/.Trashes',
        '**/ehthumbs.db',
        '**/Thumbs.db'
      ]
    }
  },

  // Development-specific build settings
  build: {
    ...baseConfig({ command, ssrBuild: false }).build,

    // Faster builds for development
    sourcemap: true,
    minify: false, // Don't minify in development for faster builds
    target: 'esnext', // Modern browsers for development

    rollupOptions: {
      ...baseConfig({ command, ssrBuild: false }).build.rollupOptions,

      // Simplified chunking for development
      output: {
        ...baseConfig({ command, ssrBuild: false }).build.rollupOptions.output,
        manualChunks: undefined // Disable manual chunking for faster dev builds
      }
    }
  },

  // Development-specific optimizeDeps
  optimizeDeps: {
    ...baseConfig({ command, ssrBuild: false }).optimizeDeps,

    // Force optimization of problematic dependencies
    force: true,

    // Include additional dependencies that cause issues
    include: [
      ...baseConfig({ command, ssrBuild: false }).optimizeDeps.include,
      'react',
      'react-dom',
      'react-router-dom'
    ]
  },

  // Development plugins
  plugins: [
    ...baseConfig({ command, ssrBuild: false }).plugins,

    // Add any development-specific plugins here
  ],

  // Define development environment variables
  define: {
    ...baseConfig({ command, ssrBuild: false }).define,
    __DEV__: JSON.stringify(true),
    __DEV_MODE__: JSON.stringify('development')
  }
}))