import { useMemo, useState } from 'react'

type Fn = 'factorial' | 'fibonacci'

interface Node {
  label: string
  result: number
  cached?: boolean
  base?: boolean
  children: Node[]
}

function build(fn: Fn, n: number, memoize: boolean): { root: Node; calls: number } {
  let calls = 0
  const memo: Record<number, number> = {}

  const fact = (k: number): Node => {
    calls++
    if (k <= 1) return { label: `fact(${k})`, result: 1, base: true, children: [] }
    const child = fact(k - 1)
    return { label: `fact(${k})`, result: k * child.result, children: [child] }
  }

  const fib = (k: number): Node => {
    calls++
    if (k <= 1) return { label: `fib(${k})`, result: k, base: true, children: [] }
    if (memoize && memo[k] !== undefined) return { label: `fib(${k})`, result: memo[k], cached: true, children: [] }
    const l = fib(k - 1)
    const r = fib(k - 2)
    const result = l.result + r.result
    if (memoize) memo[k] = result
    return { label: `fib(${k})`, result, children: [l, r] }
  }

  const root = fn === 'factorial' ? fact(n) : fib(n)
  return { root, calls }
}

function TreeNode({ node }: { node: Node }) {
  return (
    <div className="rec-node-wrap">
      <div className={`rec-node${node.base ? ' rec-node--base' : ''}${node.cached ? ' rec-node--cached' : ''}`}>
        <span className="rec-call">{node.label}</span>
        <span className="rec-res">= {node.result}</span>
        {node.base && <span className="rec-tag">base</span>}
        {node.cached && <span className="rec-tag rec-tag--cache">cache hit</span>}
      </div>
      {node.children.length > 0 && (
        <div className="rec-children">
          {node.children.map((c, i) => (
            <TreeNode key={i} node={c} />
          ))}
        </div>
      )}
    </div>
  )
}

export function RecursionViz() {
  const [fn, setFn] = useState<Fn>('fibonacci')
  const [n, setN] = useState(6)
  const [memoize, setMemoize] = useState(false)

  const maxN = fn === 'factorial' ? 10 : 8
  const clampedN = Math.min(n, maxN)
  const { root, calls } = useMemo(() => build(fn, clampedN, memoize), [fn, clampedN, memoize])

  return (
    <div className="panel">
      <div className="rec-controls">
        <div className="algo-picker">
          <button className={`algo-btn${fn === 'factorial' ? ' algo-btn--active' : ''}`} onClick={() => setFn('factorial')}>factorial(n)</button>
          <button className={`algo-btn${fn === 'fibonacci' ? ' algo-btn--active' : ''}`} onClick={() => setFn('fibonacci')}>fibonacci(n)</button>
        </div>
        <label className="conv-field" style={{ maxWidth: 220 }}>
          <span>n = {clampedN} (max {maxN})</span>
          <input type="range" min={0} max={maxN} value={clampedN} onChange={(e) => setN(Number(e.target.value))} />
        </label>
        {fn === 'fibonacci' && (
          <label className="lock-toggle">
            <input type="checkbox" checked={memoize} onChange={(e) => setMemoize(e.target.checked)} />
            Memoize (remember results)
          </label>
        )}
      </div>

      <div className="rec-stat">
        Total function calls: <b>{calls}</b>
        {fn === 'fibonacci' && !memoize && clampedN >= 5 && ' — notice how fast this grows!'}
        {fn === 'fibonacci' && memoize && ' — memoization keeps it linear.'}
      </div>

      <div className="rec-tree">
        <TreeNode node={root} />
      </div>
    </div>
  )
}
