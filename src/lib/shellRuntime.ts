export type ShellBackend = 'v86' | 'wasmer'

export type ShellLoadPhase = 'idle' | 'loading' | 'ready' | 'error' | 'unsupported'

export type ShellRuntimeInfo = {
  backend: ShellBackend | null
  phase: ShellLoadPhase
  message: string
}

export const SHELL_BACKEND_STORAGE_KEY = 'developer-basics:shell-backend'

export const V86_LOAD_TIMEOUT_MS = 90_000
export const WASMER_LOAD_TIMEOUT_MS = 19_000

/** Phones and small touch devices — default to the lighter Wasmer shell. */
export function isLikelyMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  const coarsePointer = window.matchMedia('(pointer: coarse)').matches
  const narrow = window.matchMedia('(max-width: 768px)').matches
  const touch =
    typeof navigator !== 'undefined' &&
    (navigator.maxTouchPoints > 0 || 'ontouchstart' in window)
  return narrow || (coarsePointer && touch)
}

export function preferredShellBackend(): ShellBackend {
  const env = import.meta.env.VITE_SHELL_BACKEND
  if (env === 'wasmer' || env === 'v86') return env
  return isLikelyMobileDevice() ? 'wasmer' : 'v86'
}

export function readStoredShellBackend(): ShellBackend | null {
  if (typeof localStorage === 'undefined') return null
  const value = localStorage.getItem(SHELL_BACKEND_STORAGE_KEY)
  return value === 'wasmer' || value === 'v86' ? value : null
}

export function writeStoredShellBackend(backend: ShellBackend): void {
  try {
    localStorage.setItem(SHELL_BACKEND_STORAGE_KEY, backend)
  } catch {
    /* private mode */
  }
}

export function resolveInitialShellBackend(): ShellBackend {
  return readStoredShellBackend() ?? preferredShellBackend()
}

export const SHELL_BACKEND_LABELS: Record<
  ShellBackend,
  { short: string; title: string; blurb: string }
> = {
  wasmer: {
    short: 'Fast',
    title: 'Wasmer shell',
    blurb: 'Lightweight bash — best on phones and slow networks.',
  },
  v86: {
    short: 'Real VM',
    title: 'v86 Podman VM',
    blurb: 'Full Linux with real Podman — needs the built VM image.',
  },
}
