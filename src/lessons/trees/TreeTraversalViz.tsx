import { useCallback, useEffect, useMemo, useState } from 'react'

type Mode = 'dfs' | 'bfs' | 'shortest'

interface TreeNode {
  id: string
  label: string
  children: TreeNode[]
}

const TREE: TreeNode = {
  id: '1',
  label: '1',
  children: [
    {
      id: '2',
      label: '2',
      children: [
        { id: '4', label: '4', children: [] },
        { id: '5', label: '5', children: [] },
      ],
    },
    {
      id: '3',
      label: '3',
      children: [{ id: '6', label: '6', children: [] }],
    },
  ],
}

const GRAPH: Record<string, string[]> = {
  A: ['B', 'C'],
  B: ['A', 'D'],
  C: ['A', 'D'],
  D: ['B', 'C', 'E'],
  E: ['D'],
}

function dfsOrder(node: TreeNode): string[] {
  const out: string[] = []
  const walk = (n: TreeNode) => {
    out.push(n.id)
    n.children.forEach(walk)
  }
  walk(node)
  return out
}

function bfsOrder(root: TreeNode): string[] {
  const out: string[] = []
  const q = [root]
  while (q.length) {
    const n = q.shift()!
    out.push(n.id)
    q.push(...n.children)
  }
  return out
}

function shortestPath(start: string, goal: string): string[] {
  const q: string[][] = [[start]]
  const seen = new Set([start])
  while (q.length) {
    const path = q.shift()!
    const node = path[path.length - 1]
    if (node === goal) return path
    for (const nxt of GRAPH[node] ?? []) {
      if (!seen.has(nxt)) {
        seen.add(nxt)
        q.push([...path, nxt])
      }
    }
  }
  return []
}

function TreeLevel({ node, active, visited }: { node: TreeNode; active: string | null; visited: Set<string> }) {
  return (
    <div className="tree-viz-node-wrap">
      <div
        className={`tree-viz-node${active === node.id ? ' tree-viz-node--active' : ''}${visited.has(node.id) ? ' tree-viz-node--visited' : ''}`}
      >
        {node.label}
      </div>
      {node.children.length > 0 && (
        <div className="tree-viz-children">
          {node.children.map((c) => (
            <TreeLevel key={c.id} node={c} active={active} visited={visited} />
          ))}
        </div>
      )}
    </div>
  )
}

export function TreeTraversalViz() {
  const [mode, setMode] = useState<Mode>('dfs')
  const [goal, setGoal] = useState('E')
  const [playing, setPlaying] = useState(false)
  const [step, setStep] = useState(0)

  const order = useMemo(() => {
    if (mode === 'shortest') return shortestPath('A', goal)
    return mode === 'dfs' ? dfsOrder(TREE) : bfsOrder(TREE)
  }, [mode, goal])

  const active = playing || step > 0 ? order[Math.min(step, order.length - 1)] ?? null : null
  const visited = useMemo(() => new Set(order.slice(0, step + 1)), [order, step])

  const reset = useCallback(() => {
    setPlaying(false)
    setStep(0)
  }, [])

  useEffect(() => {
    reset()
  }, [mode, goal, reset])

  useEffect(() => {
    if (!playing) return
    if (step >= order.length - 1) {
      setPlaying(false)
      return
    }
    const t = window.setTimeout(() => setStep((s) => s + 1), 650)
    return () => window.clearTimeout(t)
  }, [playing, step, order.length])

  const play = () => {
    if (step >= order.length - 1) setStep(0)
    setPlaying(true)
  }

  return (
    <div className="panel tree-viz">
      <div className="panel-title">Visual traversal</div>
      <div className="algo-picker">
        <button type="button" className={`algo-btn${mode === 'dfs' ? ' algo-btn--active' : ''}`} onClick={() => setMode('dfs')}>
          DFS (pre-order)
        </button>
        <button type="button" className={`algo-btn${mode === 'bfs' ? ' algo-btn--active' : ''}`} onClick={() => setMode('bfs')}>
          BFS (level order)
        </button>
        <button type="button" className={`algo-btn${mode === 'shortest' ? ' algo-btn--active' : ''}`} onClick={() => setMode('shortest')}>
          BFS shortest path
        </button>
      </div>

      {mode === 'shortest' ? (
        <>
          <p className="panel-hint">
            Graph A—B—D—E and A—C—D—E. BFS finds the shortest unweighted path from A to the goal.
          </p>
          <label className="conv-field" style={{ maxWidth: 200 }}>
            <span>Goal node</span>
            <select value={goal} onChange={(e) => setGoal(e.target.value)}>
              {Object.keys(GRAPH).filter((n) => n !== 'A').map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </label>
          <div className="tree-viz-graph">
            {Object.keys(GRAPH).map((n) => (
              <div
                key={n}
                className={`tree-viz-node tree-viz-node--graph${active === n ? ' tree-viz-node--active' : ''}${visited.has(n) ? ' tree-viz-node--visited' : ''}`}
              >
                {n}
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="tree-viz-tree">
          <TreeLevel node={TREE} active={active} visited={visited} />
        </div>
      )}

      <div className="tree-viz-order">
        Order:{' '}
        {order.map((id, i) => (
          <span key={id} className={`tree-viz-step${i <= step ? ' tree-viz-step--on' : ''}`}>
            {id}
            {i < order.length - 1 ? ' → ' : ''}
          </span>
        ))}
      </div>

      <div className="proc-actions">
        <button type="button" className="btn" onClick={play} disabled={playing}>
          {playing ? 'Animating…' : '▶ Animate'}
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setStep((s) => Math.min(s + 1, order.length - 1))}>
          Step
        </button>
        <button type="button" className="btn btn--ghost" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  )
}
