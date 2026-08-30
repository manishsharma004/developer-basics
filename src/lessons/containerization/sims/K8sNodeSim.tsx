import { useState } from 'react'

type Node = { name: string; status: 'Ready' | 'SchedulingDisabled'; taints: string[]; pods: number }

export function K8sNodeSim() {
  const [nodes, setNodes] = useState<Node[]>([
    { name: 'node-1', status: 'Ready', taints: [], pods: 8 },
    { name: 'node-2', status: 'Ready', taints: ['gpu=true:NoSchedule'], pods: 2 },
  ])

  const cordon = (name: string) => {
    setNodes((n) => n.map((x) => (x.name === name ? { ...x, status: 'SchedulingDisabled' } : x)))
  }

  const drain = (name: string) => {
    setNodes((n) => n.map((x) => (x.name === name ? { ...x, pods: 0, status: 'SchedulingDisabled' } : x)))
  }

  return (
    <div className="panel">
      <div className="panel-title">Node operations</div>
      <table className="metrics-table">
        <thead>
          <tr>
            <th>Node</th>
            <th>Status</th>
            <th>Taints</th>
            <th>Pods</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {nodes.map((n) => (
            <tr key={n.name}>
              <td>{n.name}</td>
              <td>{n.status}</td>
              <td>{n.taints.join(', ') || '—'}</td>
              <td>{n.pods}</td>
              <td>
                <button type="button" className="btn btn--sm btn--ghost" onClick={() => cordon(n.name)}>
                  cordon
                </button>
                <button type="button" className="btn btn--sm btn--ghost" onClick={() => drain(n.name)}>
                  drain
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="panel-hint">Cordon prevents new pods; drain evicts existing workloads before maintenance.</p>
    </div>
  )
}
