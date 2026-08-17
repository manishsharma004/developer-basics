import { useMemo, useState } from 'react'

interface Commit {
  id: string
  message: string
  parents: string[]
  branch: string
}

const PALETTE = ['#38bdf8', '#a78bfa', '#f472b6', '#34d399', '#fbbf24', '#fb7185']

const INITIAL_COMMITS: Commit[] = [{ id: 'c1', message: 'initial commit', parents: [], branch: 'main' }]

export function CommitGraph() {
  const [commits, setCommits] = useState<Commit[]>(INITIAL_COMMITS)
  const [branches, setBranches] = useState<Record<string, string>>({ main: 'c1' })
  const [head, setHead] = useState('main')
  const [nextId, setNextId] = useState(2)
  const [newBranch, setNewBranch] = useState('feature')
  const [mergeFrom, setMergeFrom] = useState('')

  const branchColor = useMemo(() => {
    const names = Object.keys(branches)
    return (b: string) => PALETTE[Math.max(0, names.indexOf(b)) % PALETTE.length]
  }, [branches])

  const commit = () => {
    const id = `c${nextId}`
    setCommits((cs) => [...cs, { id, message: `work on ${head}`, parents: [branches[head]], branch: head }])
    setBranches((b) => ({ ...b, [head]: id }))
    setNextId((n) => n + 1)
  }

  const createBranch = () => {
    const name = newBranch.trim()
    if (!name || branches[name]) return
    setBranches((b) => ({ ...b, [name]: branches[head] }))
    setHead(name)
  }

  const merge = () => {
    if (!mergeFrom || mergeFrom === head) return
    if (branches[mergeFrom] === branches[head]) return
    const id = `c${nextId}`
    setCommits((cs) => [
      ...cs,
      { id, message: `merge ${mergeFrom} into ${head}`, parents: [branches[head], branches[mergeFrom]], branch: head },
    ])
    setBranches((b) => ({ ...b, [head]: id }))
    setNextId((n) => n + 1)
  }

  const reset = () => {
    setCommits(INITIAL_COMMITS)
    setBranches({ main: 'c1' })
    setHead('main')
    setNextId(2)
    setMergeFrom('')
  }

  const branchNames = Object.keys(branches)
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
            <select value={head} onChange={(e) => setHead(e.target.value)}>
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
