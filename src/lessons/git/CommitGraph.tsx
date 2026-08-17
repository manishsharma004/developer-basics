import { useMemo, useState } from 'react'

interface Commit {
  id: string
  message: string
  parents: string[]
  branch: string
}

interface GraphState {
  commits: Commit[]
  branches: Record<string, string>
  head: string
  nextId: number
}

const PALETTE = ['#38bdf8', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#fb7185']

const INITIAL: GraphState = {
  commits: [{ id: 'c1', message: 'initial commit', parents: [], branch: 'main' }],
  branches: { main: 'c1' },
  head: 'main',
  nextId: 2,
}

export function CommitGraph() {
  // A single state object keeps commits/branches/head/nextId consistent under
  // React's batching, so rapid clicks can't produce duplicate or lost commits.
  const [state, setState] = useState<GraphState>(INITIAL)
  const [newBranch, setNewBranch] = useState('feature')
  const [mergeFrom, setMergeFrom] = useState('')

  const { commits, branches, head } = state
  const branchNames = Object.keys(branches)

  const branchColor = useMemo(() => {
    return (b: string) => PALETTE[Math.max(0, branchNames.indexOf(b)) % PALETTE.length]
  }, [branchNames])

  const commit = () => {
    setState((s) => {
      const id = `c${s.nextId}`
      return {
        ...s,
        commits: [...s.commits, { id, message: `work on ${s.head}`, parents: [s.branches[s.head]], branch: s.head }],
        branches: { ...s.branches, [s.head]: id },
        nextId: s.nextId + 1,
      }
    })
  }

  const createBranch = () => {
    const name = newBranch.trim()
    setState((s) => {
      if (!name || s.branches[name]) return s
      return { ...s, branches: { ...s.branches, [name]: s.branches[s.head] }, head: name }
    })
  }

  const checkout = (name: string) => setState((s) => ({ ...s, head: name }))

  const merge = () => {
    setState((s) => {
      if (!mergeFrom || mergeFrom === s.head) return s
      if (s.branches[mergeFrom] === s.branches[s.head]) return s
      const id = `c${s.nextId}`
      return {
        ...s,
        commits: [
          ...s.commits,
          { id, message: `merge ${mergeFrom} into ${s.head}`, parents: [s.branches[s.head], s.branches[mergeFrom]], branch: s.head },
        ],
        branches: { ...s.branches, [s.head]: id },
        nextId: s.nextId + 1,
      }
    })
  }

  const reset = () => {
    setState(INITIAL)
    setMergeFrom('')
  }

  const labelsFor = (id: string) => branchNames.filter((b) => branches[b] === id)

  return (
    <div className="demo-split demo-split--wide">
      <div className="panel">
        <div className="panel-title">Actions</div>
        <p className="panel-hint">On branch <b style={{ color: branchColor(head) }}>{head}</b></p>

        <div className="git-actions">
          <button className="btn" onClick={commit}>Commit</button>

          <div className="git-row">
            <input value={newBranch} onChange={(e) => setNewBranch(e.target.value)} aria-label="new branch name" />
            <button className="btn btn--ghost" onClick={createBranch}>Create &amp; switch</button>
          </div>

          <div className="git-row">
            <span className="git-label">Checkout</span>
            <select value={head} onChange={(e) => checkout(e.target.value)}>
              {branchNames.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="git-row">
            <span className="git-label">Merge</span>
            <select value={mergeFrom} onChange={(e) => setMergeFrom(e.target.value)}>
              <option value="">choose branch…</option>
              {branchNames.filter((b) => b !== head).map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
            <button className="btn btn--ghost" onClick={merge} disabled={!mergeFrom}>into {head}</button>
          </div>

          <button className="btn btn--ghost" onClick={reset}>Reset</button>
        </div>
      </div>

      <div className="panel">
        <div className="panel-title">History (newest first)</div>
        <ul className="commit-list">
          {[...commits].reverse().map((c) => (
            <li key={c.id} className="commit-item">
              <span className="commit-dot" style={{ background: branchColor(c.branch) }} />
              <div className="commit-info">
                <div className="commit-top">
                  <code className="commit-id">{c.id}</code>
                  {c.parents.length === 2 && <span className="commit-merge">merge</span>}
                  {labelsFor(c.id).map((b) => (
                    <span key={b} className="branch-tag" style={{ borderColor: branchColor(b), color: branchColor(b) }}>
                      {b}{b === head ? ' (HEAD)' : ''}
                    </span>
                  ))}
                </div>
                <div className="commit-msg">{c.message}</div>
                <div className="commit-parents">
                  {c.parents.length === 0 ? 'root' : `parent${c.parents.length > 1 ? 's' : ''}: ${c.parents.join(', ')}`}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
