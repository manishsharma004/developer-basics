import { useState } from 'react'

export function ConfigSecretsSim() {
  const [mount, setMount] = useState<'env' | 'volume'>('env')
  const [logLevel, setLogLevel] = useState('info')
  const secret = 'c2VjcmV0LXRva2Vu' // base64 demo

  return (
    <div className="panel">
      <div className="panel-title">ConfigMap vs Secret</div>
      <label className="modal-field">
        <span>ConfigMap: LOG_LEVEL</span>
        <select value={logLevel} onChange={(e) => setLogLevel(e.target.value)}>
          <option value="debug">debug</option>
          <option value="info">info</option>
          <option value="warn">warn</option>
        </select>
      </label>
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
          ? `Pod env:\n  LOG_LEVEL=${logLevel}\n  DB_HOST=postgres.default\n  API_KEY=(from secret, decoded at runtime)`
          : `Files in /etc/config:\n  app.yaml → LOG_LEVEL: ${logLevel}\n  /etc/secrets/token → ${atob(secret)}`}
      </pre>
      <p className="panel-hint">
        Changing ConfigMap values does not reload running pods — restart or use a watcher. Secrets are base64 in etcd;
        use sealed-secrets or KMS in production.
      </p>
    </div>
  )
}
