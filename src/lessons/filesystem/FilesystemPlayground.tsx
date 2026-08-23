import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { usePyodide } from '../../lib/usePyodide.ts'
import { RuntimeBanner } from '../../components/RuntimeBanner.tsx'
import { FILESYSTEM_PROGRAM } from './program.ts'

interface FsNode {
  name: string
  path: string
  type: 'dir' | 'file'
  perms: string
  size: number
  children?: FsNode[]
}

interface FsSnapshot {
  cwd: string
  tree: FsNode
}

interface Line {
  kind: 'input' | 'output' | 'system'
  text: string
  mode?: 'shell' | 'python'
  cwd?: string
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type PyCallable = (...args: any[]) => any

const QUICK_COMMANDS = ['ls -l', 'tree', 'cd projects', 'cat README.md', 'stat README.md']

function TreeView({ node, cwd, onOpen, depth = 0 }: {
  node: FsNode
  cwd: string
  onOpen: (n: FsNode) => void
  depth?: number
}) {
  const isCwd = node.type === 'dir' && node.path === cwd
  return (
    <li>
      <div
        className={`tree-row${isCwd ? ' selected' : ''}`}
        style={{ paddingLeft: `${depth * 14 + 8}px` }}
        onClick={() => onOpen(node)}
        title={`${node.perms}  ${node.size} bytes`}
      >
        <span className="tree-glyph">{node.type === 'dir' ? '📁' : '📄'}</span>
        <span className="tree-name">{node.name}</span>
        <span className="tree-perms">{node.perms}</span>
      </div>
      {node.children && node.children.length > 0 && (
        <ul className="tree-children">
          {node.children.map((child) => (
            <TreeView key={child.path} node={child} cwd={cwd} onOpen={onOpen} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  )
}

function shorten(path: string): string {
  return path.replace(/^\/home\/dev/, '~')
}

export function FilesystemPlayground() {
  const { pyodide, phase, message, error, retry, skip, skipped } = usePyodide()
  const [ready, setReady] = useState(false)
  const [mode, setMode] = useState<'shell' | 'python'>('shell')
  const [history, setHistory] = useState<Line[]>([])
  const [input, setInput] = useState('')
  const [snapshot, setSnapshot] = useState<FsSnapshot | null>(null)
  const [busy, setBusy] = useState(false)

  const shellRef = useRef<PyCallable | null>(null)
  const runPyRef = useRef<PyCallable | null>(null)
  const treeRef = useRef<PyCallable | null>(null)
  const termRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const cmdHistory = useRef<string[]>([])
  const histIdx = useRef(0)

  useEffect(() => {
    if (!pyodide) return
    let cancelled = false
    void (async () => {
      await pyodide.runPythonAsync(FILESYSTEM_PROGRAM)
      if (cancelled) return
      shellRef.current = pyodide.globals.get('shell') as PyCallable
      runPyRef.current = pyodide.globals.get('run_py') as PyCallable
      treeRef.current = pyodide.globals.get('fs_tree') as PyCallable
      const json = treeRef.current('/home/dev') as string
      setSnapshot(JSON.parse(json) as FsSnapshot)
      setHistory([
        {
          kind: 'system',
          text:
            "This shell runs on a REAL filesystem, powered by Python in your browser.\n" +
            "Type 'help' for commands, click entries in the tree, or switch to the Python tab.",
        },
      ])
      setReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [pyodide])

  useEffect(() => {
    const el = termRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [history, busy])

  const refreshTree = () => {
    if (!treeRef.current) return
    const json = treeRef.current('/home/dev') as string
    setSnapshot(JSON.parse(json) as FsSnapshot)
  }

  const execute = (raw: string, forcedMode?: 'shell' | 'python') => {
    const activeMode = forcedMode ?? mode
    const cmd = raw.trim()

    if (activeMode === 'shell' && cmd === 'clear') {
      setHistory([])
      setInput('')
      return
    }

    const cwd = snapshot?.cwd ?? '/home/dev'
    setHistory((h) => [...h, { kind: 'input', mode: activeMode, text: cmd, cwd }])
    setInput('')
    if (!cmd) return

    cmdHistory.current.push(cmd)
    histIdx.current = cmdHistory.current.length

    setBusy(true)
    try {
      const fn = activeMode === 'shell' ? shellRef.current : runPyRef.current
      const out = (fn ? fn(cmd) : '') as string
      if (out && out.length > 0) {
        setHistory((h) => [...h, { kind: 'output', text: out }])
      }
      refreshTree()
    } catch (e) {
      setHistory((h) => [...h, { kind: 'output', text: String(e) }])
    } finally {
      setBusy(false)
    }
  }

  const onOpenNode = (node: FsNode) => {
    if (!ready) return
    if (node.type === 'dir') execute(`cd ${node.path}`, 'shell')
    else execute(`cat ${node.path}`, 'shell')
  }

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (cmdHistory.current.length === 0) return
      histIdx.current = Math.max(0, histIdx.current - 1)
      setInput(cmdHistory.current[histIdx.current] ?? '')
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      histIdx.current = Math.min(cmdHistory.current.length, histIdx.current + 1)
      setInput(cmdHistory.current[histIdx.current] ?? '')
    }
  }

  const promptLabel = (line: Line) =>
    line.mode === 'python' ? '>>>' : `dev:${shorten(line.cwd ?? '/home/dev')}$`

  return (
    <>
      <RuntimeBanner phase={phase} message={message} error={error} onRetry={retry} onSkip={skip} skipped={skipped} />

      <div className="demo-split demo-split--wide">
        <div className="panel panel--terminal">
          <div className="terminal-tabs">
            <button className={`tab${mode === 'shell' ? ' tab--active' : ''}`} onClick={() => setMode('shell')}>
              Shell
            </button>
            <button className={`tab${mode === 'python' ? ' tab--active' : ''}`} onClick={() => setMode('python')}>
              Python
            </button>
            <span className="terminal-hint">
              {mode === 'shell' ? 'ls · cd · cat · mkdir · tree · rm' : 'e.g. import os; os.listdir(".")'}
            </span>
          </div>

          <div className="terminal" ref={termRef} onClick={() => inputRef.current?.focus()}>
            {history.map((line, i) => {
              if (line.kind === 'system') return <div key={i} className="term-system">{line.text}</div>
              if (line.kind === 'input') {
                return (
                  <div key={i} className="term-line">
                    <span className="term-prompt">{promptLabel(line)}</span>
                    <span className="term-cmd">{line.text}</span>
                  </div>
                )
              }
              return <pre key={i} className="term-output">{line.text}</pre>
            })}
            {busy && <div className="term-output term-busy">…</div>}

            <form
              className="term-inputline"
              onSubmit={(e) => {
                e.preventDefault()
                if (ready && !busy) execute(input)
              }}
            >
              <span className="term-prompt">
                {mode === 'python' ? '>>>' : `dev:${shorten(snapshot?.cwd ?? '/home/dev')}$`}
              </span>
              <input
                ref={inputRef}
                className="term-input"
                value={input}
                disabled={!ready || busy}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={ready ? '' : 'starting Python…'}
                autoComplete="off"
                spellCheck={false}
                aria-label="terminal input"
              />
            </form>
          </div>

          <div className="quick-commands">
            {QUICK_COMMANDS.map((c) => (
              <button
                key={c}
                className="chip"
                disabled={!ready || busy}
                onClick={() => {
                  setMode('shell')
                  execute(c, 'shell')
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">Live filesystem tree</div>
          <p className="panel-hint">
            Current directory: <code>{snapshot?.cwd ?? '/home/dev'}</code>
          </p>
          <ul className="tree">
            {snapshot ? (
              <TreeView node={snapshot.tree} cwd={snapshot.cwd} onOpen={onOpenNode} />
            ) : (
              <li className="tree-empty">building the disk…</li>
            )}
          </ul>
        </div>
      </div>
    </>
  )
}
