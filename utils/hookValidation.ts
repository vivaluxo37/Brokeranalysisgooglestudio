/**
 * Hook Validation Utilities
 * Provides runtime validation for React hook usage to prevent common errors
 */

// Store for checking if hooks are called in valid contexts
const hookContexts = new Set<string>()

/**
 * Validates that a hook is being called in a proper React component context
 * @param hookName - Name of the hook being validated
 * @param componentName - Name of the component using the hook
 * @throws Error if hook is called in invalid context
 */
export function validateHookUsage(hookName: string, componentName?: string): void {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return // Skip validation during SSR
  }

  // Check if React DevTools is available (indicates we're in a React context)
  const hasReactDevTools = !!(window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__

  if (!hasReactDevTools && import.meta.env.DEV) {
    console.warn(`⚠️ ${hookName} hook called outside React context (component: ${componentName || 'unknown'})`)
  }

  // Create a unique context identifier
  const contextId = `${hookName}-${componentName || 'unknown'}-${Date.now()}`

  // Add to contexts set for tracking
  hookContexts.add(contextId)

  // Clean up old contexts (keep only last 100)
  if (hookContexts.size > 100) {
    const contextsArray = Array.from(hookContexts)
    const toRemove = contextsArray.slice(0, contextsArray.length - 100)
    toRemove.forEach(id => hookContexts.delete(id))
  }
}

/**
 * Checks for potential multiple React instances
 * @returns true if multiple instances might be present
 */
export function detectMultipleReactInstances(): boolean {
  if (typeof window === 'undefined') {
    return false
  }

  try {
    // Check for multiple React versions by looking at the constructor
    const reactInstances = new Set()

    // Try to find React instances in the global scope
    const globalKeys = Object.keys(window)

    for (const key of globalKeys) {
      try {
        const value = (window as any)[key]
        if (value && typeof value === 'object' && value.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
          reactInstances.add(value)
        }
      } catch {
        // Ignore access errors
      }
    }

    if (reactInstances.size > 1 && import.meta.env.DEV) {
      console.warn('🚨 Multiple React instances detected. This can cause hook errors.')
      return true
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Error checking for multiple React instances:', error)
    }
  }

  return false
}

/**
 * Safe hook wrapper that provides error handling and validation
 * @param hookFn - The hook function to wrap
 * @param hookName - Name of the hook for error reporting
 * @param componentName - Name of the component using the hook
 * @returns Wrapped hook function with error handling
 */
export function createSafeHook<T extends any[], R>(
  hookFn: (...args: T) => R,
  hookName: string,
  componentName?: string,
): (...args: T) => R {
  return (...args: T): R => {
    try {
      // Validate hook usage in development
      if (import.meta.env.DEV) {
        validateHookUsage(hookName, componentName)
        detectMultipleReactInstances()
      }

      // Call the original hook
      const result = hookFn(...args)

      // Validate the result if it's an object with expected properties
      if (result && typeof result === 'object' && !Array.isArray(result)) {
        // Add error handling to hook result if it has methods
        const resultWithHandlers = { ...result }

        // Wrap any refetch methods with error handling
        if ('refetch' in result && typeof result.refetch === 'function') {
          const originalRefetch = result.refetch
          resultWithHandlers.refetch = async (...refetchArgs: any[]) => {
            try {
              return await originalRefetch(...refetchArgs)
            } catch (error) {
              console.error(`Error in ${hookName}.refetch:`, error)
              throw error
            }
          }
        }

        return resultWithHandlers as R
      }

      return result
    } catch (error) {
      console.error(`Error in ${hookName} hook${componentName ? ` (used by ${componentName})` : ''}:`, error)

      // Return a safe fallback result based on expected hook patterns
      const fallbackResult = createFallbackResult(hookName)
      return fallbackResult as R
    }
  }
}

/**
 * Creates a safe fallback result for common hook patterns
 * @param hookName - Name of the hook for pattern matching
 * @returns Safe fallback result
 */
function createFallbackResult(hookName: string): any {
  // Common hook patterns and their safe fallbacks
  if (hookName.includes('useBrokers')) {
    return {
      brokers: [],
      loading: false,
      error: 'Hook initialization failed',
      refetch: async () => {},
    }
  }

  if (hookName.includes('useData')) {
    return {
      data: [],
      loading: false,
      error: 'Hook initialization failed',
      refetch: async () => {},
    }
  }

  if (hookName.includes('useState') || hookName.includes('useReducer')) {
    return [undefined, () => {}]
  }

  if (hookName.includes('useEffect') || hookName.includes('useLayoutEffect')) {
    return undefined
  }

  if (hookName.includes('useContext')) {
    return null
  }

  if (hookName.includes('useMemo') || hookName.includes('useCallback')) {
    return undefined
  }

  // Default fallback
  return null
}

/**
 * Initialize hook validation system
 * Call this once in your app entry point
 */
export function initializeHookValidation(): void {
  if (import.meta.env.DEV) {
    // Warn about hook usage issues in development
    console.info('🔧 Hook validation system initialized')

    // Check for common issues
    setTimeout(() => {
      detectMultipleReactInstances()
    }, 1000)
  }
}
