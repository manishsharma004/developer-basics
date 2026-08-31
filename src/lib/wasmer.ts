import { getCrossOriginIsolated } from './crossOriginIsolation.ts'
import fakeDockerScript from '../lessons/containerization/programs/fake-docker.sh?raw'
import fakeComposeScript from '../lessons/containerization/programs/fake-compose.sh?raw'
import fakeKubectlScript from '../lessons/containerization/programs/fake-kubectl.sh?raw'
import labDockerfile from '../lessons/containerization/programs/lab/Dockerfile?raw'
import labPackageJson from '../lessons/containerization/programs/lab/package.json?raw'
import labReadme from '../lessons/containerization/programs/lab/README.md?raw'
import labAppJs from '../lessons/containerization/programs/lab/src/app.js?raw'

let initPromise: Promise<void> | null = null

export type WasmerLoadPhase = 'idle' | 'loading' | 'ready' | 'error' | 'unsupported'

type ProgressListener = (message: string) => void

type LabDirectory = {
  readDir(path: string): Promise<Array<{ name: string; type: string }>>
  writeFile(path: string, contents: string): Promise<void>
}

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

const LAB_PROJECT_MOUNT = {
  Dockerfile: labDockerfile,
  'package.json': labPackageJson,
  'README.md': labReadme,
  'src/app.js': labAppJs,
}

const LAB_HOME = '/home/lab'
const LAB_STATE = '/var/lab'

const LAB_ALIAS_SETUP =
  `cd ${LAB_HOME} && alias docker='bash /opt/lab/docker.sh' && alias kubectl='bash /opt/lab/kubectl.sh'`

function normalizePath(path: string): string {
  const parts = path.split('/').filter(Boolean)
  const out: string[] = []
  for (const part of parts) {
    if (part === '.') continue
    if (part === '..') {
      out.pop()
      continue
    }
    out.push(part)
  }
  return '/' + out.join('/')
}

function resolvePath(cwd: string, target: string): string {
  if (target.startsWith('/')) return normalizePath(target)
  return normalizePath(`${cwd}/${target}`)
}

async function listVarLab(labState: LabDirectory): Promise<string[]> {
  const entries = await labState.readDir('/')
  return entries.map((entry) => entry.name).sort()
}

async function handleLabFilesystemCommand(
  line: string,
  labState: LabDirectory,
  cwd: { current: string },
): Promise<{ handled: boolean; output?: string }> {
  const trimmed = line.trim()
  if (!trimmed) return { handled: false }

  const parts = trimmed.split(/\s+/).filter(Boolean)
  const cmd = parts[0]

  if (cmd === 'cd' && parts[1]) {
    cwd.current = resolvePath(cwd.current, parts[1])
    return { handled: true }
  }

  if (cmd === 'pwd') {
    return { handled: true, output: cwd.current }
  }

  if (cmd === 'touch') {
    for (const arg of parts.slice(1)) {
      if (arg.startsWith('-')) continue
      const target = resolvePath(cwd.current, arg)
      if (target === LAB_STATE || target.startsWith(`${LAB_STATE}/`)) {
        const rel = target === LAB_STATE ? '.keep' : target.slice(`${LAB_STATE}/`.length)
        await labState.writeFile(`/${rel}`, '')
      }
    }
    if (parts.length > 1) return { handled: true }
  }

  if (cmd === 'ls') {
    const showAll = parts.some((arg) => arg === '-a' || arg.includes('a'))
    const pathArg = parts.find((arg) => !arg.startsWith('-') && arg !== 'ls')
    const target = pathArg ? resolvePath(cwd.current, pathArg) : cwd.current

    if (target === LAB_HOME || target === `${LAB_HOME}/`) {
      return { handled: true, output: 'Dockerfile\npackage.json\nREADME.md\nsrc' }
    }

    if (target === LAB_STATE || target === `${LAB_STATE}/`) {
      const names = await listVarLab(labState)
      const lines: string[] = []
      if (showAll) lines.push('.', '..')
      for (const name of names) {
        if (showAll || !name.startsWith('.')) lines.push(name)
      }
      return { handled: true, output: lines.join('\n') }
    }

    if (target.startsWith(`${LAB_STATE}/`)) {
      const rel = target.slice(`${LAB_STATE}/`.length)
      if (rel && !rel.includes('/')) {
        const names = await listVarLab(labState)
        if (names.includes(rel)) {
          return { handled: true, output: rel }
        }
        return { handled: true, output: '' }
      }
    }
  }

  return { handled: false }
}

function couldBecomeLabCommand(line: string): boolean {
  const cmds = ['cd', 'pwd', 'touch', 'ls']
  for (const cmd of cmds) {
    if (cmd.startsWith(line)) return true
    if (line === cmd || line.startsWith(`${cmd} `)) return true
  }
  return false
}

function connectStreams(
  instance: {
    stdin?: WritableStream<Uint8Array>
    stdout: ReadableStream<Uint8Array>
    stderr: ReadableStream<Uint8Array>
  },
  term: import('xterm').Terminal,
  container: HTMLElement,
  labState: LabDirectory,
) {
  const encoder = new TextEncoder()
  const decoder = new TextDecoder()
  const stdinStream = instance.stdin
  let bootstrapped = false
  let bootstrapping = false
  let outputTail = ''
  let writeChain: Promise<void> = Promise.resolve()
  let lineBuffer = ''
  let interceptInput = false
  let interceptChain: Promise<void> = Promise.resolve()
  const shellCwd = { current: LAB_HOME }

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

  const writePrompt = () => {
    term.write('bash-dist# ')
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

    if (data === '\r') {
      if (interceptInput) {
        const line = lineBuffer
        lineBuffer = ''
        interceptInput = false
        term.write('\r\n')
        interceptChain = interceptChain.then(async () => {
          const result = await handleLabFilesystemCommand(line, labState, shellCwd)
          if (result.handled) {
            if (result.output) term.write(`${result.output}\r\n`)
            writePrompt()
            return
          }
          await enqueueStdin(`${line}\r`)
        })
        return
      }
      lineBuffer = ''
      void enqueueStdin(data)
      return
    }

    if (data === '\u007f') {
      if (interceptInput) {
        if (lineBuffer.length > 0) {
          lineBuffer = lineBuffer.slice(0, -1)
          term.write('\b \b')
        }
        return
      }
      if (lineBuffer.length > 0) {
        lineBuffer = lineBuffer.slice(0, -1)
      }
      void enqueueStdin(data)
      return
    }

    if (data === '\u0003') {
      lineBuffer = ''
      interceptInput = false
      void enqueueStdin(data)
      return
    }

    const nextLine = lineBuffer + data
    if (!interceptInput && couldBecomeLabCommand(nextLine)) {
      interceptInput = true
      lineBuffer = nextLine
      term.write(data)
      return
    }

    if (interceptInput) {
      if (!couldBecomeLabCommand(nextLine)) {
        interceptInput = false
        lineBuffer = ''
        void enqueueStdin(nextLine)
        return
      }
      lineBuffer = nextLine
      term.write(data)
      return
    }

    lineBuffer = nextLine
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

  const { Directory } = await import('@wasmer/sdk')
  const labState = new Directory()

  const instance = await pkg.entrypoint!.run({
    env: {
      HOME: LAB_HOME,
    },
    cwd: LAB_HOME,
    mount: {
      '/opt/lab': LAB_MOUNT,
      [LAB_HOME]: LAB_PROJECT_MOUNT,
      '/var/lab': labState,
    },
  })

  connectStreams(instance, term, container, labState)
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
