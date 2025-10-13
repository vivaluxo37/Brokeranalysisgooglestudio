import { useSyncExternalStore as nativeHook } from 'react'

export function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
  if (typeof nativeHook === 'function') {
    return arguments.length === 3
      ? nativeHook(subscribe, getSnapshot, getServerSnapshot)
      : nativeHook(subscribe, getSnapshot)
  }

  if (typeof getServerSnapshot === 'function') {
    return getServerSnapshot()
  }

  return getSnapshot()
}

export default { useSyncExternalStore }
