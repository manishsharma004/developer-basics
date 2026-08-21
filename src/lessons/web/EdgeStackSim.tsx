import { useMemo, useState } from 'react'
import { MermaidDiagram } from '../../components/MermaidDiagram.tsx'
import { useFlowAnimation } from '../../components/useFlowAnimation.ts'
import { EDGE_STACK_DIAGRAM, WEB_NODE_META } from './diagrams.ts'

const WALKTHROUGH = [
  { nodes: ['client'], message: '1. Client opens https://api.example.com/orders' },
  { nodes: ['dns'], message: '2. DNS resolves api.example.com → load balancer IP' },
  { nodes: ['lb'], message: '3. Load balancer picks a healthy nginx instance' },
  { nodes: ['nginx'], message: '4. nginx terminates TLS, matches location /api/' },
  { nodes: ['gw'], message: '5. API gateway validates JWT / API key (optional layer)' },
  { nodes: ['limit'], message: '6. Rate limiter checks token bucket — 429 or pass' },
  { nodes: ['app'], message: '7. FastAPI handles business logic' },
  { nodes: ['data'], message: '8. App queries Postgres / Redis — response flows back' },
]

export function EdgeStackSim() {
  const [selected, setSelected] = useState<string | null>(null)
  const [manualStep, setManualStep] = useState(-1)
  const { stepIndex, running, log, reset, runSteps } = useFlowAnimation()

  const steps = useMemo(() => WALKTHROUGH, [])
  const displayStep = running || stepIndex >= 0 ? stepIndex : manualStep
  const highlightNodes =
    displayStep >= 0 ? steps[displayStep]?.nodes ?? [] : selected ? [selected] : []

  const walk = () => {
    setManualStep(-1)
    reset()
    void runSteps(steps)
  }

  const stepOnce = () => {
    reset()
    const next = Math.min(manualStep + 1, steps.length - 1)
    setManualStep(next)
  }

  const clear = () => {
    reset()
    setManualStep(-1)
    setSelected(null)
  }

  const currentMessage = displayStep >= 0 ? steps[displayStep]?.message : null

  return (
    <div className="panel web-lab">
      <div className="panel-title">Production edge stack</div>
      <p className="panel-hint">
        Walk a real request through every layer — click nodes to read what each hop does.
      </p>

      <MermaidDiagram
        code={EDGE_STACK_DIAGRAM}
        title="Full request path"
        activeNodes={highlightNodes}
        selectedNode={selected}
        nodeMeta={WEB_NODE_META}
        onNodeClick={setSelected}
      />

      <div className="proc-actions">
        <button className="btn" onClick={walk} disabled={running}>
          {running ? 'Walking…' : '▶ Walk full request'}
        </button>
        <button
          className="btn btn--ghost"
          onClick={stepOnce}
          disabled={running || manualStep >= steps.length - 1}
        >
          Next hop
        </button>
        <button className="btn btn--ghost" onClick={clear}>
          Reset
        </button>
      </div>

      {currentMessage && <p className="panel-hint web-lab-step">{currentMessage}</p>}

      {log.length > 0 && <pre className="term-output">{log.join('\n')}</pre>}
    </div>
  )
}
