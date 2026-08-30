import { getCrossOriginIsolated } from './crossOriginIsolation.ts'
import fakeDockerScript from '../lessons/containerization/programs/fake-docker.sh?raw'
import fakeComposeScript from '../lessons/containerization/programs/fake-compose.sh?raw'
import fakeKubectlScript from '../lessons/containerization/programs/fake-kubectl.sh?raw'

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
}

const LAB_ALIAS_SETUP =
  "alias docker='bash /opt/lab/docker.sh' && alias kubectl='bash /opt/lab/kubectl.sh'"

function connectStreams(
  instance: {
    stdin?: WritableStream<Uint8Array>
    stdout: ReadableStream<Uint8Array>
    stderr: ReadableStream<Uint8Array>
  },
  term: import('xterm').Terminal,
  container: HTMLElement,
) {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const stdinStream = instance.stdin
  let bootstrapped = false
  let bootstrapping = false
  let outputTail = ''
  let writeChain: Promise<void> = Promise.resolve()

  const enqueueStdin = (data: string, charDelayMs = 0) => {
    writeChain = writeChain.then(async () => {
      if (!stdinStream) return
      const writer = stdinStream.getWriter()
      try {
        for (const char of data) {
          await writer.write(encoder.encode(char))
          if (charDelayMs > 0) {
            await new Promise((resolve) => setTimeout(resolve, charDelayMs))
          }
        }
        await writer.ready
      } finally {
        writer.releaseLock()
      }
    })
    return writeChain
  }

  const waitForNewPrompt = async (afterLen: number, timeoutMs = 8_000) => {
    const start = Date.now()
    while (Date.now() - start < timeoutMs) {
      const tail = outputTail.slice(afterLen)
      if (/bash-dist#|lab\$/.test(tail)) return
      await new Promise((resolve) => setTimeout(resolve, 40))
    }
    throw new Error('Timed out waiting for shell prompt')
  }

  const trackOutput = (chunk: Uint8Array) => {
    outputTail += decoder.decode(chunk)
    if (outputTail.length > 4096) outputTail = outputTail.slice(-2048)
    if (!bootstrapped && /bash-dist#|lab\$/.test(outputTail)) {
      bootstrapped = true
      bootstrapping = true
      void (async () => {
        try {
          await new Promise((resolve) => setTimeout(resolve, 200))
          const mark = outputTail.length
          await enqueueStdin(`${LAB_ALIAS_SETUP}\r`, 12)
          await waitForNewPrompt(mark)
        } finally {
          bootstrapping = false
          container.dataset.shellBootstrapped = 'true'
        }
      })()
    }
    term.write(chunk)
  }

  term.onData((data) => {
    if (bootstrapping) return
    void enqueueStdin(data)
  })

  void instance.stdout.pipeTo(
    new WritableStream<Uint8Array>({
      write(chunk) {
        trackOutput(chunk)
      },
    }),
  )

  void instance.stderr.pipeTo(
    new WritableStream<Uint8Array>({
      write(chunk) {
        trackOutput(chunk)
      },
    }),
  )
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
  container.replaceChildren()

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

  // wasmer-js wasmer.sh pattern: default entrypoint + xterm stream piping only.
  // Lab scripts mount under /opt/lab; aliases register after the bash-dist prompt.
  const instance = await pkg.entrypoint!.run({
    mount: {
      '/opt/lab': LAB_MOUNT,
    },
  })

  connectStreams(instance, term, container)
  term.focus()

  report('Shell ready — type docker, compose, or kubectl commands.')

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
