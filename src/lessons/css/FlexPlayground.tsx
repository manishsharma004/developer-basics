import { useState, type CSSProperties } from 'react'

export function FlexPlayground() {
  const [direction, setDirection] = useState('row')
  const [justify, setJustify] = useState('flex-start')
  const [align, setAlign] = useState('stretch')
  const [gap, setGap] = useState(8)

  return (
    <div className="panel css-lab">
      <div className="panel-title">Flexbox layout lab</div>
      <div className="race-controls">
        <label className="conv-field">
          <span>flex-direction</span>
          <select value={direction} onChange={(e) => setDirection(e.target.value)}>
            <option value="row">row</option>
            <option value="column">column</option>
            <option value="row-reverse">row-reverse</option>
          </select>
        </label>
        <label className="conv-field">
          <span>justify-content</span>
          <select value={justify} onChange={(e) => setJustify(e.target.value)}>
            <option value="flex-start">flex-start</option>
            <option value="center">center</option>
            <option value="space-between">space-between</option>
            <option value="space-around">space-around</option>
          </select>
        </label>
        <label className="conv-field">
          <span>align-items</span>
          <select value={align} onChange={(e) => setAlign(e.target.value)}>
            <option value="stretch">stretch</option>
            <option value="center">center</option>
            <option value="flex-start">flex-start</option>
            <option value="flex-end">flex-end</option>
          </select>
        </label>
        <label className="conv-field">
          <span>gap {gap}px</span>
          <input type="range" min={0} max={24} value={gap} onChange={(e) => setGap(Number(e.target.value))} />
        </label>
      </div>
      <div
        className="css-lab-flex"
        style={{
          display: 'flex',
          flexDirection: direction as CSSProperties['flexDirection'],
          justifyContent: justify as CSSProperties['justifyContent'],
          alignItems: align as CSSProperties['alignItems'],
          gap,
        }}
      >
        {['A', 'B', 'C'].map((label) => (
          <div key={label} className="css-lab-flex-item">
            {label}
          </div>
        ))}
      </div>
    </div>
  )
}
