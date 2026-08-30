/** True when the browser exposes SharedArrayBuffer (required by @wasmer/sdk). */
export function getCrossOriginIsolated(): boolean {
  return typeof globalThis.crossOriginIsolated !== 'undefined' && globalThis.crossOriginIsolated
}

/** Snapshot at module load — prefer getCrossOriginIsolated() after COI service worker activates. */
export const isCrossOriginIsolated = getCrossOriginIsolated()

export const COI_TROUBLESHOOTING =
  'https://docs.wasmer.io/sdk/wasmer-js/explainers/troubleshooting/#sharedarraybuffer-and-cross-origin-isolation'

export const COI_SW_VERSION = '5'

const COI_WAIT_MS = 19_000
const COI_POLL_MS = 200

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/** Clear session flags and unregister service workers, then reload. */
export async function resetCoiServiceWorker(): Promise<void> {
  for (let i = sessionStorage.length - 1; i >= 0; i--) {
    const key = sessionStorage.key(i)
    if (key?.startsWith('coi-activated-')) sessionStorage.removeItem(key)
  }

  if ('serviceWorker' in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations()
    await Promise.all(regs.map((reg) => reg.unregister()))
  }

  window.location.reload()
}

/**
 * Wait for coi-serviceworker to activate (first visit reloads once per SW version).
 * Returns true when crossOriginIsolated becomes available.
 */
export async function waitForCrossOriginIsolation(timeoutMs = COI_WAIT_MS): Promise<boolean> {
  if (getCrossOriginIsolated()) return true
  if (typeof window === 'undefined') return false

  if ('serviceWorker' in navigator) {
    try {
      const reg = await navigator.serviceWorker.getRegistration()
      await reg?.update()
    } catch {
      /* registration may not exist yet */
    }
  }

  const deadline = Date.now() + timeoutMs

  const waitUntil = async (): Promise<boolean> => {
    while (Date.now() < deadline) {
      if (getCrossOriginIsolated()) return true
      await sleep(COI_POLL_MS)
    }
    return getCrossOriginIsolated()
  }

  if (!('serviceWorker' in navigator)) {
    return waitUntil()
  }

  const onController = new Promise<boolean>((resolve) => {
    const check = () => {
      if (getCrossOriginIsolated()) resolve(true)
    }
    navigator.serviceWorker.addEventListener('controllerchange', check)
    void navigator.serviceWorker.ready.then(check)
    setTimeout(() => resolve(getCrossOriginIsolated()), timeoutMs)
  })

  const raced = await Promise.race([waitUntil(), onController])
  return raced || getCrossOriginIsolated()
}
