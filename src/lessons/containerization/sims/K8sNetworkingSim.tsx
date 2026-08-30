import { useState } from 'react'

export function K8sNetworkingSim() {
  const [query, setQuery] = useState('api.default.svc.cluster.local')
  const [result, setResult] = useState('')

  const resolve = (name: string) => {
    if (name.includes('svc.cluster.local')) {
      return `Server:  10.96.0.10 (CoreDNS)\nName:    ${name}\nAddress: 10.96.42.10 (ClusterIP)\nEndpoints: 10.244.1.5, 10.244.2.3`
    }
    if (name.match(/^[a-z0-9-]+$/)) {
      return `Server:  10.96.0.10\nName:    ${name}.default.pod.cluster.local\nAddress: 10.244.1.${5 + (name.length % 50)} (pod IP, ephemeral)`
    }
    return `** server can't find ${name}: NXDOMAIN`
  }

  return (
    <div className="panel">
      <div className="panel-title">CoreDNS lookup</div>
      <form
        className="ref-run-row"
        onSubmit={(e) => {
          e.preventDefault()
          setResult(resolve(query))
        }}
      >
        <input className="modal-field input" value={query} onChange={(e) => setQuery(e.target.value)} spellCheck={false} />
        <button type="submit" className="btn">
          nslookup
        </button>
      </form>
      <pre className="terminal-output">{result || 'Click nslookup to resolve the name.'}</pre>
      <p className="panel-hint">Pods get pod IPs; Services get stable cluster IPs and DNS names ending in .svc.cluster.local.</p>
    </div>
  )
}
