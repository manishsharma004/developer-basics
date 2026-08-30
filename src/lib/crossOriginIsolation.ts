/** True when the browser exposes SharedArrayBuffer (required by @wasmer/sdk). */
export function getCrossOriginIsolated(): boolean {
  return typeof globalThis.crossOriginIsolated !== 'undefined' && globalThis.crossOriginIsolated
}

/** Snapshot at module load — prefer getCrossOriginIsolated() after COI service worker activates. */
export const isCrossOriginIsolated = getCrossOriginIsolated()

export const COI_TROUBLESHOOTING =
  'https://docs.wasmer.io/sdk/wasmer-js/explainers/troubleshooting/#sharedarraybuffer-and-cross-origin-isolation'

const COI_WAIT_MS = 10_000
const COI_POLL_MS = 150

/**
 * Wait for coi-serviceworker to activate (first visit reloads once).
 * Returns true when crossOriginIsolated becomes available.
 */
export async function waitForCrossOriginIsolation(timeoutMs = COI_WAIT_MS): Promise<boolean> {
  if (getCrossOriginIsolated()) return true

  const deadline = Date.now() + timeoutMs
  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, COI_POLL_MS))
    if (getCrossOriginIsolated()) return true
  }
  return getCrossOriginIsolated()
}
