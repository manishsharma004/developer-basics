import { useState } from 'react'

const STAGES = ['HTML', 'DOM', 'CSSOM', 'Render tree', 'Layout', 'Paint', 'Composite'] as const

export function RenderPipeline() {
  const [stage, setStage] = useState(0)
  const [wideBox, setWideBox] = useState(false)
  const [changeColor, setChangeColor] = useState(false)

  const invalidateFrom = wideBox ? 3 : changeColor ? 5 : -1

  return (
    <div className="panel">
      <div className="panel-title">Rendering pipeline</div>
      <div className="render-pipeline-steps">
        {STAGES.map((s, i) => (
          <button
            key={s}
            type="button"
            className={`chip${stage === i ? ' chip--active' : ''}${invalidateFrom >= 0 && i >= invalidateFrom ? ' chip--warn' : ''}`}
            onClick={() => setStage(i)}
          >
            {i + 1}. {s}
          </button>
        ))}
      </div>
      <div
        className="render-pipeline-demo"
        style={{
          width: wideBox ? '100%' : '60%',
          background: changeColor ? 'var(--accent)' : 'var(--panel-2)',
          padding: '1rem',
          borderRadius: 8,
          transition: 'width 0.3s, background 0.3s',
        }}
      >
        Demo box — stage: {STAGES[stage]}
      </div>
      <div className="ref-run-row">
        <button type="button" className="btn btn--ghost" onClick={() => setWideBox((v) => !v)}>Toggle width (layout)</button>
        <button type="button" className="btn btn--ghost" onClick={() => setChangeColor((v) => !v)}>Toggle color (paint)</button>
      </div>
      <p className="panel-hint">
        Width changes invalidate <strong>layout</strong> and everything after. Color-only
        changes skip layout and hit <strong>paint</strong>. That's why animating{' '}
        <code>transform</code> is cheaper than <code>width</code>.
      </p>
    </div>
  )
}
