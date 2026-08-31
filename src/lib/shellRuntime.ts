export type ShellBackend = 'v86' | 'wasmer'

export type ShellLoadPhase = 'idle' | 'loading' | 'ready' | 'error' | 'unsupported'

export type ShellRuntimeInfo = {
  backend: ShellBackend | null
  phase: ShellLoadPhase
  message: string
}

export const V86_LOAD_TIMEOUT_MS = 90_000
export const WASMER_LOAD_TIMEOUT_MS = 19_000

export function preferredShellBackend(): ShellBackend {
  const env = import.meta.env.VITE_SHELL_BACKEND
  if (env === 'wasmer' || env === 'v86') return env
  return 'v86'
}
