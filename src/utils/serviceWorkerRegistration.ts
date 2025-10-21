/**
 * Service Worker Registration Utility
 *
 * Handles service worker registration with proper error handling
 * and development mode detection.
 */

export interface ServiceWorkerConfig {
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onError?: (error: Error) => void;
}

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
  window.location.hostname === '[::1]' ||
  window.location.hostname.match(
    /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/,
  ),
)

export function register(config?: ServiceWorkerConfig): void {
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(process.env.PUBLIC_URL || '', window.location.href)
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return
    }

    window.addEventListener('load', () => {
      const swUrl = '/sw.js'

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config)
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config)
      }
    })
  }
}

function registerValidSW(swUrl: string, config?: ServiceWorkerConfig): void {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      console.log('[SW] Service worker registered successfully:', registration)

      // Check for updates periodically
      setInterval(() => {
        registration.update()
      }, 60 * 60 * 1000) // Check every hour

      registration.onupdatefound = () => {
        const installingWorker = registration.installing
        if (installingWorker == null) {
          return
        }

        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log('[SW] New content is available and will be used when all tabs are closed.')

              // Execute callback
              if (config?.onUpdate) {
                config.onUpdate(registration)
              }

              // Show update notification to user
              showUpdateNotification(registration)
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('[SW] Content is cached for offline use.')

              // Execute callback
              if (config?.onSuccess) {
                config.onSuccess(registration)
              }
            }
          }
        }
      }
    })
    .catch(error => {
      console.error('[SW] Error during service worker registration:', error)
      if (config?.onError) {
        config.onError(error)
      }
    })
}

function checkValidServiceWorker(swUrl: string, config?: ServiceWorkerConfig): void {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then(response => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type')
      if (
        response.status === 404 ||
        (contentType != null && !contentType.includes('javascript'))
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then(registration => {
          registration.unregister().then(() => {
            window.location.reload()
          })
        })
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config)
      }
    })
    .catch(() => {
      console.log('[SW] No internet connection found. App is running in offline mode.')
    })
}

export function unregister(): void {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister()
      })
      .catch(error => {
        console.error(error.message)
      })
  }
}

/**
 * Show update notification to user
 */
function showUpdateNotification(registration: ServiceWorkerRegistration): void {
  // Create a simple notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('App Update Available', {
      body: 'A new version of the app is available. Click to refresh.',
      icon: '/vite.svg',
      tag: 'app-update',
    }).onclick = () => {
      window.location.reload()
    }
  } else {
    // Fallback: show a custom UI notification
    showCustomUpdateUI(registration)
  }
}

/**
 * Show custom update UI
 */
function showCustomUpdateUI(registration: ServiceWorkerRegistration): void {
  // Create update banner
  const updateBanner = document.createElement('div')
  updateBanner.id = 'app-update-banner'
  updateBanner.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    background: #2563eb;
    color: white;
    padding: 12px 20px;
    text-align: center;
    z-index: 9999;
    font-family: system-ui, -apple-system, sans-serif;
    font-size: 14px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  `

  updateBanner.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; gap: 12px;">
      <span>A new version is available</span>
      <button id="update-refresh-btn" style="
        background: white;
        color: #2563eb;
        border: none;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
      ">Refresh</button>
      <button id="update-dismiss-btn" style="
        background: transparent;
        color: white;
        border: 1px solid white;
        padding: 6px 12px;
        border-radius: 4px;
        font-size: 12px;
        cursor: pointer;
      ">Dismiss</button>
    </div>
  `

  document.body.appendChild(updateBanner)

  // Add event listeners
  const refreshBtn = document.getElementById('update-refresh-btn')
  const dismissBtn = document.getElementById('update-dismiss-btn')

  if (refreshBtn) {
    refreshBtn.addEventListener('click', () => {
      window.location.reload()
    })
  }

  if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
      updateBanner.remove()
    })
  }

  // Auto-dismiss after 30 seconds
  setTimeout(() => {
    if (document.getElementById('app-update-banner')) {
      updateBanner.remove()
    }
  }, 30000)
}

/**
 * Get service worker status
 */
export async function getServiceWorkerStatus(): Promise<{
  supported: boolean;
  registered: boolean;
  controlled: boolean;
  updateAvailable: boolean;
}> {
  const status = {
    supported: 'serviceWorker' in navigator,
    registered: false,
    controlled: false,
    updateAvailable: false,
  }

  if (!status.supported) {
    return status
  }

  try {
    const registration = await navigator.serviceWorker.ready
    status.registered = !!registration
    status.controlled = !!navigator.serviceWorker.controller
    status.updateAvailable = !!registration.waiting
  } catch (error) {
    console.warn('[SW] Error getting service worker status:', error)
  }

  return status
}

/**
 * Force service worker update
 */
export async function forceUpdate(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready
    await registration.update()
    return true
  } catch (error) {
    console.error('[SW] Error forcing update:', error)
    return false
  }
}

/**
 * Clear service worker caches
 */
export async function clearCaches(): Promise<boolean> {
  try {
    const registration = await navigator.serviceWorker.ready
    const messageChannel = new MessageChannel()

    return new Promise((resolve) => {
      messageChannel.port1.onmessage = (event) => {
        resolve(event.data.success)
      }

      registration.active?.postMessage(
        { type: 'CACHE_CLEAR' },
        [messageChannel.port2],
      )
    })
  } catch (error) {
    console.error('[SW] Error clearing caches:', error)
    return false
  }
}
