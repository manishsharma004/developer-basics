import { useState } from 'react'

type OverflowMode = 'visible' | 'hidden' | 'scroll' | 'auto'

export function OverflowPlayground() {
  const [mode, setMode] = useState<OverflowMode>('auto')
  const [tall, setTall] = useState(true)

  return (
    <div className="panel css-lab">
      <div className="panel-title">Overflow lab</div>
      <div className="race-controls">
        <label className="conv-field">
          <span>overflow</span>
          <select value={mode} onChange={(e) => setMode(e.target.value as OverflowMode)}>
            <option value="visible">visible</option>
            <option value="hidden">hidden</option>
            <option value="scroll">scroll</option>
            <option value="auto">auto</option>
          </select>
        </label>
        <label className="conv-field">
          <span>Tall content</span>
          <select value={tall ? 'yes' : 'no'} onChange={(e) => setTall(e.target.value === 'yes')}>
            <option value="yes">Yes — overflows box</option>
            <option value="no">No — fits</option>
          </select>
        </label>
      </div>
      <div className="css-lab-overflow-box" style={{ overflow: mode }}>
        {Array.from({ length: tall ? 8 : 2 }, (_, i) => (
          <p key={i} className="css-lab-overflow-line">
            Line {i + 1} — content inside a fixed-height container.
          </p>
        ))}
      </div>
      <p className="panel-hint">
        <code>hidden</code> clips; <code>scroll</code> always shows bars; <code>auto</code> adds
        scrollbars only when needed.
      </p>
    </div>
  )
}
