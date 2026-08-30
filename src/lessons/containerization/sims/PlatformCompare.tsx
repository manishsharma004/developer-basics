import { useState } from 'react'

const PLATFORMS = {
  eks: { name: 'Amazon EKS', control: 'AWS managed', nodes: 'Managed node groups / Fargate', notes: 'IAM OIDC, IRSA for pod IAM' },
  gke: { name: 'Google GKE', control: 'Google managed', nodes: 'Autopilot or Standard node pools', notes: 'Workload Identity for GCP APIs' },
  aks: { name: 'Azure AKS', control: 'Azure managed', nodes: 'Node pools + AAD integration', notes: 'Azure AD workload identity' },
  ecs: { name: 'Amazon ECS', control: 'AWS (no k8s API)', nodes: 'Fargate or EC2 tasks', notes: 'Task definitions + services, simpler than k8s' },
  rancher: { name: 'Rancher', control: 'Self / partner hosted UI', nodes: 'RKE2, K3s, imported clusters', notes: 'Multi-cluster catalog & RBAC' },
  desktop: { name: 'Docker Desktop', control: 'Local', nodes: 'Single-node k8s toggle', notes: 'Compose + kubectl for dev' },
} as const

type Key = keyof typeof PLATFORMS

export function PlatformCompare({ keys }: { keys: Key[] }) {
  const [sel, setSel] = useState<Key>(keys[0])

  const p = PLATFORMS[sel]

  return (
    <div className="panel">
      <div className="panel-title">Platform comparison</div>
      <div className="ref-run-row" style={{ flexWrap: 'wrap' }}>
        {keys.map((k) => (
          <button key={k} type="button" className={`btn btn--sm ${sel === k ? '' : 'btn--ghost'}`} onClick={() => setSel(k)}>
            {PLATFORMS[k].name}
          </button>
        ))}
      </div>
      <table className="metrics-table">
        <tbody>
          <tr>
            <th>Control plane</th>
            <td>{p.control}</td>
          </tr>
          <tr>
            <th>Compute</th>
            <td>{p.nodes}</td>
          </tr>
          <tr>
            <th>Notes</th>
            <td>{p.notes}</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
