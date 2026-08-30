import { isCrossOriginIsolated } from './crossOriginIsolation.ts'

let initPromise: Promise<void> | null = null

export type WasmerPhase = 'idle' | 'loading' | 'ready' | 'error' | 'unsupported'

export async function ensureWasmer(onProgress?: (msg: string) => void): Promise<void> {
  if (!isCrossOriginIsolated) {
    throw new Error('Cross-origin isolation required for Wasmer (SharedArrayBuffer).')
  }
  if (!initPromise) {
    initPromise = (async () => {
      onProgress?.('Loading Wasmer runtime…')
      const { init } = await import('@wasmer/sdk')
      await init()
      onProgress?.('Wasmer ready.')
    })().catch((err) => {
      initPromise = null
      throw err
    })
  }
  return initPromise
}

export async function runBashTerminal(
  container: HTMLElement,
  onProgress?: (msg: string) => void,
): Promise<() => void> {
  await ensureWasmer(onProgress)

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

  onProgress?.('Fetching bash package from Wasmer registry…')
  const pkg = await Wasmer.fromRegistry('sharrattj/bash')
  const instance = await pkg.entrypoint!.run()

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
