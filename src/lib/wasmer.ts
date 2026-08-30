import { getCrossOriginIsolated } from './crossOriginIsolation.ts'
import fakeDockerScript from '../lessons/containerization/programs/fake-docker.sh?raw'
import fakeComposeScript from '../lessons/containerization/programs/fake-compose.sh?raw'
import fakeKubectlScript from '../lessons/containerization/programs/fake-kubectl.sh?raw'
import labBashrc from '../lessons/containerization/programs/lab-bashrc?raw'

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
  if (!getCrossOriginIsolated()) {
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

function waitForLayout(container: HTMLElement): Promise<void> {
  if (container.clientWidth >= 200 && container.clientHeight >= 120) {
    return Promise.resolve()
  }
  return new Promise((resolve) => {
    const ro = new ResizeObserver(() => {
      if (container.clientWidth >= 200 && container.clientHeight >= 120) {
        ro.disconnect()
        resolve()
      }
    })
    ro.observe(container)
    requestAnimationFrame(() => {
      if (container.clientWidth >= 200 && container.clientHeight >= 120) {
        ro.disconnect()
        resolve()
      }
    })
  })
}

const LAB_MOUNT = {
  'docker.sh': fakeDockerScript,
  'compose.sh': fakeComposeScript,
  'kubectl.sh': fakeKubectlScript,
  bashrc: labBashrc,
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

  await waitForLayout(container)

  const term = new Terminal({
    cursorBlink: true,
    fontSize: 14,
    lineHeight: 1.15,
    convertEol: true,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", monospace',
    theme: { background: '#0d1117', foreground: '#e6edf3', cursor: '#58a6ff' },
    scrollback: 800,
  })
  const fit = new FitAddon()
  term.loadAddon(fit)
  term.open(container)
  fit.fit()

  report('Fetching bash from Wasmer registry (network required)…')
  const pkg = await Wasmer.fromRegistry('sharrattj/bash')
  report('Mounting simulated docker, compose, and kubectl CLIs…')
  report('Starting bash shell…')

  const instance = await pkg.entrypoint!.run({
    args: ['--rcfile', '/opt/lab/bashrc', '-i'],
    env: {
      HOME: '/root',
      TERM: 'xterm-256color',
    },
    mount: {
      '/opt/lab': LAB_MOUNT,
    },
  })

  report('Shell ready — docker, compose, and kubectl are simulated in this lab.')

  const stdin = instance.stdin?.getWriter()
  const stdout = instance.stdout
  const stderr = instance.stderr

  const writeChunk = (value: Uint8Array) => {
    term.write(value)
  }

  if (stdout) {
    const reader = stdout.getReader()
    void (async () => {
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        if (value) writeChunk(value)
      }
    })()
  }
  if (stderr) {
    const reader = stderr.getReader()
    void (async () => {
      for (;;) {
        const { value, done } = await reader.read()
        if (done) break
        if (value) writeChunk(value)
      }
    })()
  }

  term.onData((data) => {
    void stdin?.write(new TextEncoder().encode(data))
  })

  const onResize = () => {
    try {
      fit.fit()
    } catch {
      /* container may be hidden during layout */
    }
  }
  window.addEventListener('resize', onResize)
  const ro = new ResizeObserver(onResize)
  ro.observe(container)

  return () => {
    window.removeEventListener('resize', onResize)
    ro.disconnect()
    term.dispose()
  }
}
