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

export function preferredShellBackend(): ShellBackend {
  const env = import.meta.env.VITE_SHELL_BACKEND
  if (env === 'wasmer' || env === 'v86') return env
  return 'v86'
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
    blurb: 'Lightweight bash — quick to load on any device.',
  },
  v86: {
    short: 'Real VM',
    title: 'v86 Podman VM',
    blurb: 'Full Linux with real Podman — needs the built VM image.',
  },
}
