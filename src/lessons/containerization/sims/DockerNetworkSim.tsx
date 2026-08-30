import { useState } from 'react'

export function DockerNetworkSim() {
  const [mode, setMode] = useState<'bridge' | 'host'>('bridge')
  const [hostPort, setHostPort] = useState('8080')
  const [containerPort, setContainerPort] = useState('80')

  return (
    <div className="panel">
      <div className="panel-title">Port mapping &amp; networks</div>
      <div className="ref-run-row">
        <button type="button" className={`btn ${mode === 'bridge' ? '' : 'btn--ghost'}`} onClick={() => setMode('bridge')}>
          bridge (default)
        </button>
        <button type="button" className={`btn ${mode === 'host' ? '' : 'btn--ghost'}`} onClick={() => setMode('host')}>
          host
        </button>
      </div>
      <div className="ref-run-row">
        <label className="modal-field">
          <span>Host port (-p)</span>
          <input value={hostPort} onChange={(e) => setHostPort(e.target.value)} />
        </label>
        <label className="modal-field">
          <span>Container port</span>
          <input value={containerPort} onChange={(e) => setContainerPort(e.target.value)} />
        </label>
      </div>
      <pre className="flow-diagram">
        {mode === 'bridge'
          ? `Browser ──► localhost:${hostPort}
                    │
            docker NAT / iptables
                    │
            container:${containerPort} (private bridge network)`
          : `Browser ──► host:${containerPort}
            (container shares host network namespace — no -p mapping)`}
      </pre>
      <p className="panel-hint">
        User-defined networks give containers DNS names — <code>curl http://api:3000</code> from another
        container on the same network.
      </p>
    </div>
  )
}
