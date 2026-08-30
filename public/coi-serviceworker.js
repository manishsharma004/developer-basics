/*! coi-serviceworker — Safari-safe (require-corp). Keep registered on GitHub Pages. */
const COI_SW_VERSION = '5'

if (typeof window === 'undefined') {
  self.addEventListener('install', () => self.skipWaiting())
  self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

  self.addEventListener('fetch', (event) => {
    const request = event.request
    if (request.cache === 'only-if-cached' && request.mode !== 'same-origin') {
      return
    }

    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.status === 0) {
            return response
          }

          const headers = new Headers(response.headers)
          if (!headers.has('Cross-Origin-Embedder-Policy')) {
            headers.set('Cross-Origin-Embedder-Policy', 'require-corp')
          }
          if (!headers.has('Cross-Origin-Opener-Policy')) {
            headers.set('Cross-Origin-Opener-Policy', 'same-origin')
          }

          return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers,
          })
        })
        .catch((error) => {
          console.error(error)
          return fetch(request)
        }),
    )
  })
} else {
  ;(() => {
    const coi = {
      shouldRegister: () => true,
      doReload: () => window.location.reload(),
      quiet: false,
      ...window.coi,
    }

    const nav = navigator
    const reloadKey = `coi-activated-${COI_SW_VERSION}`

    if (window.crossOriginIsolated) {
      sessionStorage.setItem(reloadKey, '1')
      return
    }

    if (window.crossOriginIsolated !== false || !coi.shouldRegister()) return

    if (!window.isSecureContext) {
      !coi.quiet && console.log('COI service worker requires HTTPS.')
      return
    }

    if (!nav.serviceWorker) return

    const script = document.currentScript
    if (!script || !('src' in script) || !script.src) return

    const reloadOnce = () => {
      if (sessionStorage.getItem(reloadKey) === '1') return
      sessionStorage.setItem(reloadKey, '1')
      coi.doReload()
    }

    nav.serviceWorker.register(script.src).then(
      (registration) => {
        !coi.quiet && console.log('COI service worker registered', registration.scope)
        void registration.update()

        registration.addEventListener('updatefound', () => {
          !coi.quiet && console.log('Reloading for updated COI service worker.')
          sessionStorage.removeItem(reloadKey)
          reloadOnce()
        })

        if (registration.active && !nav.serviceWorker.controller) {
          !coi.quiet && console.log('Reloading to activate COI service worker.')
          reloadOnce()
        }
      },
      (err) => {
        !coi.quiet && console.error('COI service worker registration failed:', err)
      },
    )
  })()
}
