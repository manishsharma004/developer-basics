import { useState } from 'react'

export function K8sNetworkingSim() {
  const [query, setQuery] = useState('api.default.svc.cluster.local')

  const resolve = () => {
    if (query.includes('svc.cluster.local')) return `ClusterIP 10.96.42.10 → endpoints 10.244.1.5, 10.244.2.3`
    if (query.match(/^[a-z-]+$/)) return `Pod IP 10.244.1.${5 + query.length} (per-pod, ephemeral)`
    return 'NXDOMAIN'
  }

  return (
    <div className="panel">
      <div className="panel-title">CoreDNS lookup</div>
      <form
        className="ref-run-row"
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <input className="modal-field input" value={query} onChange={(e) => setQuery(e.target.value)} spellCheck={false} />
        <button type="button" className="btn" onClick={() => {}}>
          nslookup
        </button>
      </form>
      <pre className="terminal-output">{resolve()}</pre>
      <p className="panel-hint">Pods get pod IPs; Services get stable cluster IPs and DNS names.</p>
    </div>
  )
}
