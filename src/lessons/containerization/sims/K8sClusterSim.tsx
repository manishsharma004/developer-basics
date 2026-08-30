import { useState } from 'react'

const COMPONENTS = [
  { id: 'api', label: 'API server', layer: 'control', desc: 'REST front door; validates and persists to etcd' },
  { id: 'etcd', label: 'etcd', layer: 'control', desc: 'Cluster state — source of truth' },
  { id: 'scheduler', label: 'Scheduler', layer: 'control', desc: 'Assigns pods to nodes' },
  { id: 'controller', label: 'Controller manager', layer: 'control', desc: 'Reconciliation loops (Deployments, etc.)' },
  { id: 'kubelet', label: 'kubelet', layer: 'node', desc: 'Runs pods on the node via CRI' },
  { id: 'proxy', label: 'kube-proxy', layer: 'node', desc: 'Service VIP → pod endpoints' },
  { id: 'runtime', label: 'container runtime', layer: 'node', desc: 'containerd — pulls images, runs containers' },
]

export function K8sClusterSim() {
  const [selected, setSelected] = useState('api')

  const info = COMPONENTS.find((c) => c.id === selected)

  return (
    <div className="panel">
      <div className="panel-title">Kubernetes cluster</div>
      <pre className="flow-diagram">{`┌──────────── Control plane ────────────┐
│  API server · etcd · scheduler · CM   │
└──────────────────┬────────────────────┘
                   │ watches / schedules
     ┌─────────────┴─────────────┐
     │ Node 1          Node 2    │
     │ kubelet proxy   kubelet … │
     │ [Pod][Pod]      [Pod]     │
     └───────────────────────────┘`}</pre>
      <div className="ref-run-row" style={{ flexWrap: 'wrap' }}>
        {COMPONENTS.map((c) => (
          <button
            key={c.id}
            type="button"
            className={`btn btn--sm ${selected === c.id ? '' : 'btn--ghost'}`}
            onClick={() => setSelected(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      {info && (
        <p className="panel-hint">
          <strong>{info.label}</strong> ({info.layer}): {info.desc}
        </p>
      )}
    </div>
  )
}
