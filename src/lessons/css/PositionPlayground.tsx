import { useState } from 'react'

export function PositionPlayground() {
  const [mode, setMode] = useState<'relative' | 'absolute' | 'fixed'>('absolute')
  const [top, setTop] = useState(24)
  const [left, setLeft] = useState(24)

  return (
    <div className="panel css-lab">
      <div className="panel-title">Position lab</div>
      <div className="race-controls">
        <label className="conv-field">
          <span>Child position</span>
          <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)}>
            <option value="absolute">absolute</option>
            <option value="relative">relative (offset in flow)</option>
            <option value="fixed">fixed (viewport)</option>
          </select>
        </label>
        <label className="conv-field">
          <span>top {top}px</span>
          <input type="range" min={0} max={80} value={top} onChange={(e) => setTop(Number(e.target.value))} />
        </label>
        <label className="conv-field">
          <span>left {left}px</span>
          <input type="range" min={0} max={120} value={left} onChange={(e) => setLeft(Number(e.target.value))} />
        </label>
      </div>
      <div className="css-lab-position-parent">
        <span className="css-lab-label">parent (position: relative)</span>
        <p className="css-lab-placeholder">In-flow content above the badge.</p>
        <div
          className="css-lab-position-child"
          style={{ position: mode, top, left }}
        >
          {mode} badge
        </div>
        <p className="css-lab-placeholder">Absolute children are removed from normal flow.</p>
      </div>
    </div>
  )
}
