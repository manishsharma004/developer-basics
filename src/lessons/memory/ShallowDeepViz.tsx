import { useState } from 'react'

type Mode = 'alias' | 'shallow' | 'deep'

export function ShallowDeepViz() {
  const [mode, setMode] = useState<Mode>('alias')
  const [sharedInner, setSharedInner] = useState<number[]>([1])
  const [independentInner, setIndependentInner] = useState<number[]>([1])

  const aInner = sharedInner
  const bInner = mode === 'deep' ? independentInner : sharedInner
  const shared = mode !== 'deep'

  const mutate = () => {
    const next = (prev: number[]) => [...prev, prev.length + 1]
    if (mode === 'deep') {
      setIndependentInner(next)
    } else {
      setSharedInner(next)
    }
  }

  const switchMode = (m: Mode) => {
    setMode(m)
    setSharedInner([1])
    setIndependentInner([1])
  }

  return (
    <div className="panel copy-viz">
      <div className="panel-title">Shallow vs deep copy — visual</div>
      <div className="proc-actions">
        <button type="button" className={`btn${mode === 'alias' ? '' : ' btn--ghost'}`} onClick={() => switchMode('alias')}>
          Alias (b = a)
        </button>
        <button type="button" className={`btn${mode === 'shallow' ? '' : ' btn--ghost'}`} onClick={() => switchMode('shallow')}>
          Shallow (.copy())
        </button>
        <button type="button" className={`btn${mode === 'deep' ? '' : ' btn--ghost'}`} onClick={() => switchMode('deep')}>
          Deep (deepcopy)
        </button>
      </div>
      <div className="copy-viz-row">
        <div className="copy-viz-var">
          <div className="copy-viz-label">a = [[…]]</div>
          <div className="copy-viz-outer">
            outer (new)
            <div className="copy-viz-inner">inner: [{aInner.join(', ')}]</div>
          </div>
        </div>
        <div className="copy-viz-arrow">{shared ? '⇄ shared inner' : '↔ independent inner'}</div>
        <div className="copy-viz-var">
          <div className="copy-viz-label">b = {mode === 'alias' ? 'a' : 'a.copy() / deepcopy()'}</div>
          <div className="copy-viz-outer">
            {mode === 'alias' ? 'same outer' : 'new outer'}
            <div className={`copy-viz-inner${shared ? ' copy-viz-inner--shared' : ''}`}>inner: [{bInner.join(', ')}]</div>
          </div>
        </div>
      </div>
      <button type="button" className="btn" onClick={mutate}>
        b[0].append(next) — mutate through b
      </button>
      <p className="panel-hint">
        {mode === 'alias' && 'Both names reference the same inner list — a changes too.'}
        {mode === 'shallow' && 'New outer list, but inner is still shared — a[0] changes when b mutates.'}
        {mode === 'deep' && 'Fully independent inner list — mutating b does not affect a.'}
      </p>
    </div>
  )
}
