/** True when the browser exposes SharedArrayBuffer (required by @wasmer/sdk). */
export const isCrossOriginIsolated =
  typeof globalThis.crossOriginIsolated !== 'undefined' && globalThis.crossOriginIsolated

export const COI_TROUBLESHOOTING =
  'https://docs.wasmer.io/sdk/wasmer-js/explainers/troubleshooting/#sharedarraybuffer-and-cross-origin-isolation'
