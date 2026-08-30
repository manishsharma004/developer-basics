import { useState } from 'react'

export function K8sStorageSim() {
  const [mode, setMode] = useState<'static' | 'dynamic'>('dynamic')
  const [bound, setBound] = useState(false)

  const provision = () => {
    if (mode === 'static') setBound(true)
    else setTimeout(() => setBound(true), 800)
  }

  return (
    <div className="panel">
      <div className="panel-title">PV / PVC binding</div>
      <div className="ref-run-row">
        <button type="button" className={`btn ${mode === 'dynamic' ? '' : 'btn--ghost'}`} onClick={() => setMode('dynamic')}>
          StorageClass (dynamic)
        </button>
        <button type="button" className={`btn ${mode === 'static' ? '' : 'btn--ghost'}`} onClick={() => setMode('static')}>
          Pre-provisioned PV
        </button>
      </div>
      <button type="button" className="btn" onClick={provision}>
        kubectl apply -f pvc.yaml
      </button>
      <pre className="flow-diagram">
        {bound
          ? mode === 'dynamic'
            ? 'PVC pending → provisioner creates PV → Bound → mounted in Pod'
            : 'PVC Pending → matched existing PV → Bound → mounted in Pod'
          : 'PVC: Pending — waiting for volume'}
      </pre>
    </div>
  )
}
