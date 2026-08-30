import { useState } from 'react'

export function ConfigSecretsSim() {
  const [mount, setMount] = useState<'env' | 'volume'>('env')
  const secret = 'c2VjcmV0LXRva2Vu' // base64 demo

  return (
    <div className="panel">
      <div className="panel-title">ConfigMap vs Secret</div>
      <div className="ref-run-row">
        <button type="button" className={`btn ${mount === 'env' ? '' : 'btn--ghost'}`} onClick={() => setMount('env')}>
          envFrom
        </button>
        <button type="button" className={`btn ${mount === 'volume' ? '' : 'btn--ghost'}`} onClick={() => setMount('volume')}>
          volumeMount
        </button>
      </div>
      <pre className="terminal-output">
        {mount === 'env'
          ? `Pod env:\n  DB_HOST=postgres.default\n  API_KEY=(from secret, decoded at runtime)`
          : `Files in /etc/config:\n  app.yaml\n  /etc/secrets/token → ${atob(secret)}`}
      </pre>
      <p className="panel-hint">
        Secrets are base64-encoded in etcd by default — not encryption. Use sealed-secrets or cloud KMS in production.
      </p>
    </div>
  )
}
