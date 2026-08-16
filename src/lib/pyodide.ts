import { loadPyodide, version as pyodideVersion, type PyodideInterface } from 'pyodide'

// A single shared Pyodide instance for the whole app. Loading the CPython
// runtime is expensive (a few MB of wasm), so we do it once, lazily, and hand
// the same promise to every caller.
let pyodidePromise: Promise<PyodideInterface> | null = null

export type LoadPhase = 'idle' | 'loading' | 'ready' | 'error'

type ProgressListener = (message: string) => void

const listeners = new Set<ProgressListener>()

function emit(message: string) {
  for (const listener of listeners) listener(message)
}

export function onPyodideProgress(listener: ProgressListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function getPyodide(): Promise<PyodideInterface> {
  if (!pyodidePromise) {
    emit('Downloading the CPython runtime…')
    pyodidePromise = loadPyodide({
      // Fetch the runtime + stdlib from the jsDelivr CDN, pinned to the exact
      // version of the installed npm package so the loader shim and assets match.
      indexURL: `https://cdn.jsdelivr.net/pyodide/v${pyodideVersion}/full/`,
    })
      .then((py) => {
        emit('Python ready.')
        return py
      })
      .catch((err) => {
        // Reset so a later mount can retry from scratch.
        pyodidePromise = null
        throw err
      })
  }
  return pyodidePromise
}

export { pyodideVersion }
