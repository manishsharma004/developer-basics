import { useState } from 'react'

export function BoxModelPlayground() {
  const [padding, setPadding] = useState(16)
  const [margin, setMargin] = useState(12)
  const [border, setBorder] = useState(4)
  const [borderBox, setBorderBox] = useState(true)
  const width = 200

  return (
    <div className="panel css-lab">
      <div className="panel-title">Box model explorer</div>
      <div className="race-controls">
        <label className="conv-field">
          <span>Padding {padding}px</span>
          <input type="range" min={0} max={40} value={padding} onChange={(e) => setPadding(Number(e.target.value))} />
        </label>
        <label className="conv-field">
          <span>Margin {margin}px</span>
          <input type="range" min={0} max={40} value={margin} onChange={(e) => setMargin(Number(e.target.value))} />
        </label>
        <label className="conv-field">
          <span>Border {border}px</span>
          <input type="range" min={0} max={12} value={border} onChange={(e) => setBorder(Number(e.target.value))} />
        </label>
        <label className="conv-field">
          <span>box-sizing</span>
          <select value={borderBox ? 'border-box' : 'content-box'} onChange={(e) => setBorderBox(e.target.value === 'border-box')}>
            <option value="border-box">border-box</option>
            <option value="content-box">content-box</option>
          </select>
        </label>
      </div>
      <div className="css-lab-stage">
        <div className="css-lab-margin" style={{ padding: margin }}>
          <span className="css-lab-label">margin</span>
          <div
            className="css-lab-border"
            style={{
              border: `${border}px solid var(--accent)`,
              boxSizing: borderBox ? 'border-box' : 'content-box',
              width,
            }}
          >
            <span className="css-lab-label">border</span>
            <div className="css-lab-padding" style={{ padding }}>
              <span className="css-lab-label">padding</span>
              <div className="css-lab-content">content<br />width: {width}px</div>
            </div>
          </div>
        </div>
      </div>
      <p className="panel-hint">
        With <code>content-box</code>, padding and border <em>add</em> to the declared width.{' '}
        <code>border-box</code> keeps the outer width at {width}px — usually what you want.
      </p>
    </div>
  )
}
