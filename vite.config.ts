// Fix: Removed `/// <reference types="vitest" />` which was causing a type resolution error.
// The import of `defineConfig` from 'vitest/config' is sufficient for providing types for the `test` property.
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
  },
})