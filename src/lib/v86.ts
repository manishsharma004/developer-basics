import v86WasmUrl from 'v86/build/v86.wasm?url'
import * as V86Sdk from 'v86/build/libv86.mjs'
import { getCrossOriginIsolated } from './crossOriginIsolation.ts'
import {
  fetchLabManifest,
  labRootfsFilesystem,
  V86_BIOS,
  V86_LAB_UNAVAILABLE_HINT,
} from './v86Assets.ts'

export type V86LoadPhase = 'idle' | 'loading' | 'ready' | 'error' | 'unsupported'

type ProgressListener = (message: string) => void

const listeners = new Set<ProgressListener>()
const SNAPSHOT_DB = 'developer-basics-v86'
const SNAPSHOT_STORE = 'snapshots'
const SNAPSHOT_KEY = 'alpine-podman-lab-v3'

let initPromise: Promise<void> | null = null

function emit(message: string) {
  for (const listener of listeners) listener(message)
}

export function onV86Progress(listener: ProgressListener): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function resetV86Load(): void {
  initPromise = null
}

export async function isV86LabImageAvailable(): Promise<boolean> {
  const manifest = await fetchLabManifest()
  return manifest !== null && manifest.profile === 'alpine-podman-lab' && manifest.version >= 3
}

async function openSnapshotDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(SNAPSHOT_DB, 1)
    req.onupgradeneeded = () => {
      req.result.createObjectStore(SNAPSHOT_STORE)
    }
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function loadSnapshot(): Promise<ArrayBuffer | null> {
  try {
    const db = await openSnapshotDb()
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(SNAPSHOT_STORE, 'readonly')
      const req = tx.objectStore(SNAPSHOT_STORE).get(SNAPSHOT_KEY)
      req.onsuccess = () => resolve((req.result as ArrayBuffer | undefined) ?? null)
      req.onerror = () => reject(req.error)
    })
  } catch {
    return null
  }
}

async function saveSnapshot(buffer: ArrayBuffer): Promise<void> {
  try {
    const db = await openSnapshotDb()
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(SNAPSHOT_STORE, 'readwrite')
      const req = tx.objectStore(SNAPSHOT_STORE).put(buffer, SNAPSHOT_KEY)
      req.onsuccess = () => resolve()
      req.onerror = () => reject(req.error)
    })
  } catch {
    /* snapshot is best-effort */
  }
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

function waitForEmulatorLoaded(
  emulator: { add_listener: (event: string, fn: () => void) => void },
  timeoutMs: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(
      () => reject(new Error('Timed out waiting for v86 emulator to initialize')),
      timeoutMs,
    )
    emulator.add_listener('emulator-loaded', () => {
      window.clearTimeout(timer)
      resolve()
    })
  })
}

function createV86Emulator(options: Record<string, unknown>) {
  return new V86Sdk.V86(options)
}

function waitForSerialPrompt(
  emulator: { add_listener: (event: string, fn: (...args: unknown[]) => void) => void },
  timeoutMs: number,
): Promise<void> {
  return new Promise((resolve, reject) => {
    let output = ''
    const timer = window.setTimeout(() => reject(new Error('Timed out waiting for Linux shell prompt')), timeoutMs)
    emulator.add_listener('serial0-output-byte', (byte: unknown) => {
      const code = typeof byte === 'number' ? byte : 0
      const char = String.fromCharCode(code)
      if (char === '\r') return
      output += char
      if (output.length > 4096) output = output.slice(-2048)
      if (/lab-vm#|Podman lab ready/.test(output)) {
        window.clearTimeout(timer)
        resolve()
      }
    })
  })
}

export async function runV86Terminal(
  container: HTMLElement,
  onProgress?: (msg: string) => void,
): Promise<() => void> {
  const report = (msg: string) => {
    emit(msg)
    onProgress?.(msg)
  }

  if (!getCrossOriginIsolated()) {
    throw new Error('Cross-origin isolation required for v86 (SharedArrayBuffer).')
  }

  const manifest = await fetchLabManifest()
  if (!manifest) {
    throw new Error(V86_LAB_UNAVAILABLE_HINT)
  }

  report('Loading v86 emulator…')
  const [{ Terminal }, { FitAddon }] = await Promise.all([
    import('xterm'),
    import('xterm-addon-fit'),
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

  report('Downloading BIOS…')
  const snapshot = await loadSnapshot()

  const fs = labRootfsFilesystem(manifest)
  const options: Record<string, unknown> = {
    wasm_path: v86WasmUrl,
    memory_size: manifest.memoryMb * 1024 * 1024,
    vga_memory_size: 8 * 1024 * 1024,
    bios: { url: V86_BIOS.bios },
    vga_bios: { url: V86_BIOS.vga_bios },
    filesystem: fs,
    bzimage_initrd_from_filesystem: true,
    cmdline: manifest.cmdline,
    autostart: true,
    disable_keyboard: true,
    disable_mouse: true,
    net_device: { type: 'virtio' },
  }

  if (snapshot) {
    report('Restoring saved VM snapshot…')
    options.initial_state = { buffer: snapshot }
  } else {
    report('Booting Alpine Linux (first boot may take up to a minute)…')
  }

  const emulator = createV86Emulator(options)

  emulator.add_listener('serial0-output-byte', (byte: unknown) => {
    const code = typeof byte === 'number' ? byte : 0
    const char = String.fromCharCode(code)
    if (char !== '\r') term.write(char)
  })

  term.onData((data) => {
    emulator.serial0_send(data)
  })

  // WASM + BIOS + rootfs load asynchronously; run() before init causes
  // "Cannot read properties of undefined (reading 'run')". autostart boots the CPU.
  await waitForEmulatorLoaded(emulator, 120_000)

  if (!snapshot) {
    try {
      await waitForSerialPrompt(emulator, 75_000)
      report('Saving VM snapshot for faster reloads…')
      const state = await emulator.save_state()
      if (state instanceof ArrayBuffer) {
        await saveSnapshot(state)
      }
    } catch {
      report('Shell ready (snapshot skipped).')
    }
  }

  container.dataset.shellBootstrapped = 'true'
  container.dataset.shellBackend = 'v86'
  term.focus()
  report('Podman lab ready — try: podman build -t sample-img .')

  const onResize = () => {
    try {
      fit.fit()
    } catch {
      /* hidden */
    }
  }
  window.addEventListener('resize', onResize)
  const ro = new ResizeObserver(onResize)
  ro.observe(container)

  return () => {
    window.removeEventListener('resize', onResize)
    ro.disconnect()
    void emulator.destroy()
    term.dispose()
  }
}

export async function ensureV86(onProgress?: (msg: string) => void): Promise<void> {
  if (!getCrossOriginIsolated()) {
    throw new Error('Cross-origin isolation required for v86.')
  }
  const report = (msg: string) => {
    emit(msg)
    onProgress?.(msg)
  }
  if (!initPromise) {
    initPromise = (async () => {
      const ok = await isV86LabImageAvailable()
      if (!ok) {
        throw new Error('v86 lab image not available')
      }
      report('v86 lab image found.')
    })().catch((err) => {
      initPromise = null
      throw err
    })
  }
  return initPromise
}
