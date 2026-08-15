import { useMemo, useState } from 'react'

// A sample process tree, similar to what `pstree`/`ps` would show. Every process
// (except the very first) has a parent, forming a tree rooted at PID 1.
const PROCESS_TREE = {
  pid: 1,
  name: 'systemd',
  state: 'Sleeping',
  memMB: 12,
  children: [
    {
      pid: 420,
      name: 'sshd',
      state: 'Sleeping',
      memMB: 8,
      children: [
        {
          pid: 1337,
          name: 'bash',
          state: 'Sleeping',
          memMB: 6,
          children: [
            { pid: 2001, name: 'node', state: 'Running', memMB: 180, children: [] },
            { pid: 2002, name: 'vim', state: 'Sleeping', memMB: 22, children: [] },
          ],
        },
      ],
    },
    {
      pid: 512,
      name: 'nginx',
      state: 'Sleeping',
      memMB: 24,
      children: [
        { pid: 5121, name: 'nginx: worker', state: 'Running', memMB: 30, children: [] },
        { pid: 5122, name: 'nginx: worker', state: 'Waiting', memMB: 28, children: [] },
      ],
    },
  ],
}

// A process's virtual address space, from high addresses (stack) to low (text).
const MEMORY_SEGMENTS = [
  { name: 'Stack', color: '#f472b6', desc: 'Local variables & call frames. Grows downward.', size: 12 },
  { name: '↓ free ↑', color: '#334155', desc: 'Unused gap the stack and heap grow into.', size: 30, muted: true },
  { name: 'Heap', color: '#fbbf24', desc: 'Dynamically allocated memory (malloc/new). Grows upward.', size: 18 },
  { name: 'BSS', color: '#34d399', desc: 'Uninitialized global/static variables.', size: 10 },
  { name: 'Data', color: '#38bdf8', desc: 'Initialized global/static variables.', size: 10 },
  { name: 'Text', color: '#a78bfa', desc: 'The read-only program code (machine instructions).', size: 20 },
]

// A simplified process lifecycle state machine and its allowed transitions.
const LIFECYCLE = {
  New: { next: [{ to: 'Ready', label: 'admit' }], desc: 'The process is being created.' },
  Ready: { next: [{ to: 'Running', label: 'schedule' }], desc: 'Waiting for the CPU scheduler to pick it.' },
  Running: {
    next: [
      { to: 'Waiting', label: 'I/O request' },
      { to: 'Ready', label: 'time slice expires' },
      { to: 'Terminated', label: 'exit' },
    ],
    desc: 'Instructions are executing on the CPU right now.',
  },
  Waiting: { next: [{ to: 'Ready', label: 'I/O complete' }], desc: 'Blocked until an event (like disk I/O) completes.' },
  Terminated: { next: [], desc: 'Finished executing; the OS reclaims its resources.' },
}

const stateClass = (state) => `state-badge state-${state.toLowerCase().replace(/[^a-z]/g, '')}`

function ProcNode({ node, depth, selectedPid, onSelect }) {
  return (
    <li>
      <div
        className={`tree-row${selectedPid === node.pid ? ' selected' : ''}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={() => onSelect(node)}
      >
        <span className="tree-glyph">▪</span>
        <span className="tree-name">{node.name}</span>
        <span className="proc-pid">pid {node.pid}</span>
        <span className={stateClass(node.state)}>{node.state}</span>
      </div>
      {node.children?.length > 0 && (
        <ul className="tree-children">
          {node.children.map((child) => (
            <ProcNode
              key={child.pid}
              node={child}
              depth={depth + 1}
              selectedPid={selectedPid}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  )
}

function findParent(root, pid, parent = null) {
  if (root.pid === pid) return parent
  for (const child of root.children ?? []) {
    const found = findParent(child, pid, root)
    if (found !== undefined) return found
  }
  return undefined
}

function ProcessDemo() {
  const [selected, setSelected] = useState(PROCESS_TREE.children[0].children[0].children[0])
  const [state, setState] = useState('New')
  const [history, setHistory] = useState(['New'])

  const parent = useMemo(() => findParent(PROCESS_TREE, selected.pid), [selected])
  const totalSize = MEMORY_SEGMENTS.reduce((sum, s) => sum + s.size, 0)

  const transition = (to) => {
    setState(to)
    setHistory((h) => [...h, to])
  }

  const reset = () => {
    setState('New')
    setHistory(['New'])
  }

  return (
    <div className="page">
      <header className="page-header">
        <h1>⚙️ Process Architecture</h1>
        <p className="lead">
          A process is a running program with its own memory space. The OS tracks
          each one, arranges them in a tree, and cycles them through a lifecycle
          as they compete for the CPU.
        </p>
      </header>

      <div className="demo-split">
        <div className="panel">
          <div className="panel-title">Process tree</div>
          <ul className="tree">
            <ProcNode
              node={PROCESS_TREE}
              depth={0}
              selectedPid={selected.pid}
              onSelect={setSelected}
            />
          </ul>
        </div>

        <div className="panel">
          <div className="panel-title">Selected process</div>
          <dl className="meta">
            <div>
              <dt>Name</dt>
              <dd><code>{selected.name}</code></dd>
            </div>
            <div>
              <dt>PID</dt>
              <dd>{selected.pid}</dd>
            </div>
            <div>
              <dt>Parent (PPID)</dt>
              <dd>{parent ? `${parent.name} (${parent.pid})` : '— (none)'}</dd>
            </div>
            <div>
              <dt>State</dt>
              <dd><span className={stateClass(selected.state)}>{selected.state}</span></dd>
            </div>
            <div>
              <dt>Resident memory</dt>
              <dd>{selected.memMB} MB</dd>
            </div>
            <div>
              <dt>Children</dt>
              <dd>{selected.children?.length ?? 0}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="demo-split">
        <div className="panel">
          <div className="panel-title">Virtual memory layout</div>
          <p className="panel-hint">High addresses at the top, low at the bottom.</p>
          <div className="memmap">
            {MEMORY_SEGMENTS.map((seg) => (
              <div
                key={seg.name}
                className={`memseg${seg.muted ? ' memseg--muted' : ''}`}
                style={{
                  height: `${(seg.size / totalSize) * 100}%`,
                  background: seg.color,
                }}
                title={seg.desc}
              >
                <span className="memseg-name">{seg.name}</span>
                <span className="memseg-desc">{seg.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-title">Process lifecycle</div>
          <p className="panel-hint">
            Current state: <span className={stateClass(state)}>{state}</span>
          </p>
          <p className="lifecycle-desc">{LIFECYCLE[state].desc}</p>

          <div className="lifecycle-actions">
            {LIFECYCLE[state].next.length === 0 ? (
              <span className="lifecycle-end">No further transitions — process is done.</span>
            ) : (
              LIFECYCLE[state].next.map((t) => (
                <button key={t.to} className="btn" onClick={() => transition(t.to)}>
                  {t.label} → {t.to}
                </button>
              ))
            )}
            <button className="btn btn--ghost" onClick={reset}>
              Reset
            </button>
          </div>

          <div className="lifecycle-path">
            {history.map((s, i) => (
              <span key={i} className="path-step">
                {s}
                {i < history.length - 1 ? <span className="path-arrow">→</span> : null}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProcessDemo
