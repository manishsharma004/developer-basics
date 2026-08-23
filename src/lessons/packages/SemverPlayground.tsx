import { useMemo, useState } from 'react'

function satisfies(range: string, version: string): boolean {
  const [maj, min, pat] = version.split('.').map(Number)
  if (range.startsWith('^')) {
    const [rMaj, rMin, rPat] = range.slice(1).split('.').map(Number)
    return maj === rMaj && (min > rMin || (min === rMin && pat >= rPat))
  }
  if (range.startsWith('~')) {
    const [rMaj, rMin, rPat] = range.slice(1).split('.').map(Number)
    return maj === rMaj && min === rMin && pat >= rPat
  }
  return range === version
}

export function SemverPlayground() {
  const [range, setRange] = useState('^1.2.0')
  const [version, setVersion] = useState('1.3.1')
  const [lockPinned, setLockPinned] = useState(true)

  const match = useMemo(() => satisfies(range, version), [range, version])

  return (
    <div className="panel">
      <div className="panel-title">Semver & lockfile checker</div>
      <div className="ref-snippets">
        {['^1.2.0', '~1.2.0', '1.2.3'].map((r) => (
          <button key={r} type="button" className="chip" onClick={() => setRange(r)}>{r}</button>
        ))}
      </div>
      <label className="modal-field">
        <span>Range in package.json</span>
        <input value={range} onChange={(e) => setRange(e.target.value)} />
      </label>
      <label className="modal-field">
        <span>Installed version</span>
        <input value={version} onChange={(e) => setVersion(e.target.value)} />
      </label>
      <label className="modal-check">
        <input type="checkbox" checked={lockPinned} onChange={(e) => setLockPinned(e.target.checked)} />
        Lockfile pins exact version (bun.lock / package-lock.json)
      </label>
      <div className={`quiz-feedback${match ? ' quiz-feedback--ok' : ' quiz-feedback--no'}`}>
        {match ? '✓ Version satisfies range' : '✗ Version outside range'}
        {lockPinned && ' — lockfile would install exactly ' + version + ' on every machine'}
      </div>
      <p className="panel-hint">
        <strong>^</strong> allows minor/patch updates; <strong>~</strong> allows patch only.
        Lockfiles record the exact tree so installs are reproducible.
      </p>
    </div>
  )
}
