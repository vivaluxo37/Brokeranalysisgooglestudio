import path from 'path'
import type { Plugin } from 'vite'
import type { Plugin as EsbuildPlugin } from 'esbuild'

const shimModulePath = path.resolve(
  __dirname,
  './src/mocks/use-sync-external-store/shim/index.js'
)

export function useSyncExternalStoreShimPlugin(): Plugin {
  return {
    name: 'use-sync-external-store-shim',
    enforce: 'pre',
    resolveId(source) {
      if (
        source === 'use-sync-external-store/shim' ||
        source === 'use-sync-external-store/shim/index.js'
      ) {
        return shimModulePath
      }
      return null
    },
  }
}

export function useSyncExternalStoreShimEsbuildPlugin(): EsbuildPlugin {
  return {
    name: 'use-sync-external-store-shim',
    setup(build) {
      build.onResolve(
        { filter: /^use-sync-external-store\/shim(?:\/index\.js)?$/ },
        () => ({ path: shimModulePath })
      )
    },
  }
}
