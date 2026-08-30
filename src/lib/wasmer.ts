import { isCrossOriginIsolated } from './crossOriginIsolation.ts'

let initPromise: Promise<void> | null = null

export type WasmerLoadPhase = 'idle' | 'loading' | 'ready' | 'error' | 'unsupported'

type ProgressListener = (message: string) => void

const listeners = new Set<ProgressListener>()

function emit(message: string) {
  for (const listener of listeners) listener(message)
}

export function onWasmerProgress(listener: ProgressListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function resetWasmerLoad(): void {
  initPromise = null
}

export async function ensureWasmer(onProgress?: (msg: string) => void): Promise<void> {
  if (!isCrossOriginIsolated) {
    throw new Error('Cross-origin isolation required for Wasmer (SharedArrayBuffer).')
  }
  const report = (msg: string) => {
    emit(msg)
    onProgress?.(msg)
  }
  if (!initPromise) {
    initPromise = (async () => {
      report('Downloading Wasmer WebAssembly runtime…')
      const { init } = await import('@wasmer/sdk')
      await init()
      report('Wasmer runtime initialized.')
    })().catch((err) => {
      initPromise = null
      throw err
    })
  } else {
    report('Wasmer runtime already loaded.')
  }
  return initPromise
}

export async function runBashTerminal(
  container: HTMLElement,
  onProgress?: (msg: string) => void,
): Promise<() => void> {
  const report = (msg: string) => {
    emit(msg)
    onProgress?.(msg)
  }

  await ensureWasmer(report)

  report('Loading terminal UI…')
  const [{ Terminal }, { FitAddon }, { Wasmer }] = await Promise.all([
    import('xterm'),
    import('xterm-addon-fit'),
    import('@wasmer/sdk'),
  ])

  await import('xterm/css/xterm.css')

  const term = new Terminal({ cursorBlink: true, fontSize: 13, theme: { background: '#0d1117' } })
  const fit = new FitAddon()
  term.loadAddon(fit)
  term.open(container)
  fit.fit()

  report('Fetching bash from Wasmer registry (network required)…')
  const pkg = await Wasmer.fromRegistry('sharrattj/bash')
  report('Starting bash shell…')
  const instance = await pkg.entrypoint!.run()
  report('Shell ready — type commands in the terminal.')

  const stdin = instance.stdin?.getWriter()
  const stdout = instance.stdout
  const stderr = instance.stderr

  if (stdout) {
    const reader = stdout.getReader()
    void (async () => {
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        if (value) term.write(value)
      }
    })()
  }
  if (stderr) {
    const reader = stderr.getReader()
    void (async () => {
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        if (value) term.write(value)
      }
    })()
  }

  term.onData((data) => {
    void stdin?.write(new TextEncoder().encode(data))
  })

  const onResize = () => fit.fit()
  window.addEventListener('resize', onResize)

  return () => {
    window.removeEventListener('resize', onResize)
    term.dispose()
  }
}
