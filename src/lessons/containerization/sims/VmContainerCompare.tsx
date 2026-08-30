import { useState } from 'react'

export function VmContainerCompare() {
  const [mode, setMode] = useState<'vm' | 'container'>('container')

  return (
    <div className="panel">
      <div className="panel-title">VM vs container stack</div>
      <div className="ref-run-row">
        <button type="button" className={`btn ${mode === 'vm' ? '' : 'btn--ghost'}`} onClick={() => setMode('vm')}>
          Virtual machine
        </button>
        <button type="button" className={`btn ${mode === 'container' ? '' : 'btn--ghost'}`} onClick={() => setMode('container')}>
          Container
        </button>
      </div>
      <pre className="flow-diagram">
        {mode === 'vm'
          ? `┌─────────────────────────────┐
│         Your app            │
├─────────────────────────────┤
│    Guest OS (full kernel)   │
├─────────────────────────────┤
│         Hypervisor          │
├─────────────────────────────┤
│         Host OS             │
└─────────────────────────────┘
Boot: seconds–minutes · Strong isolation`
          : `┌──────────┐ ┌──────────┐
│  App A   │ │  App B   │  ← isolated processes
├──────────┴─┴──────────┤
│   container runtime     │  (containerd/docker)
├─────────────────────────┤
│      Host OS kernel     │  ← shared kernel
└─────────────────────────┘
Start: sub-second · Process-level isolation`}
      </pre>
      <p className="panel-hint">
        {mode === 'vm'
          ? 'VMs bundle a full OS — heavy but strong isolation for legacy workloads.'
          : 'Containers share the host kernel — lightweight, fast to start, ideal for microservices.'}
      </p>
    </div>
  )
}
