import { useMemo, useState } from 'react'

const DEFAULTS = { PORT: '3000', LOG_LEVEL: 'info', API_URL: 'http://localhost:8080' }
const FILE_ENV = { PORT: '4000', LOG_LEVEL: 'debug' }

export function ConfigResolver() {
  const [useFile, setUseFile] = useState(true)
  const [useEnv, setUseEnv] = useState(true)
  const [envPort, setEnvPort] = useState('5000')
  const [logSecrets, setLogSecrets] = useState(false)

  const resolved = useMemo(() => {
    const out = { ...DEFAULTS }
    if (useFile) Object.assign(out, FILE_ENV)
    if (useEnv) out.PORT = envPort
    return out
  }, [useFile, useEnv, envPort])

  const logLine = logSecrets
    ? `Starting on port ${resolved.PORT} with API_KEY=sk_live_SECRET123`
    : `Starting on port ${resolved.PORT} (API_KEY=••••••••)`

  return (
    <div className="panel">
      <div className="panel-title">Config precedence</div>
      <p className="panel-hint">Typical order: defaults → config file → environment variables (highest wins).</p>
      <label className="modal-check"><input type="checkbox" checked={useFile} onChange={(e) => setUseFile(e.target.checked)} /> Load .env / config file</label>
      <label className="modal-check"><input type="checkbox" checked={useEnv} onChange={(e) => setUseEnv(e.target.checked)} /> Override PORT from OS env</label>
      {useEnv && (
        <label className="modal-field"><span>PORT env value</span><input value={envPort} onChange={(e) => setEnvPort(e.target.value)} /></label>
      )}
      <label className="modal-check"><input type="checkbox" checked={logSecrets} onChange={(e) => setLogSecrets(e.target.checked)} /> Log secrets (bad!)</label>
      <pre className="term-output">{JSON.stringify(resolved, null, 2)}</pre>
      <pre className={`term-output${logSecrets ? ' error-trace' : ''}`}>{logLine}</pre>
    </div>
  )
}
