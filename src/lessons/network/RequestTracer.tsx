import { useEffect, useRef, useState } from 'react'

interface Stage {
  id: string
  label: string
  detail: string
  ms: number
}

type StageStatus = 'idle' | 'active' | 'done'

const PALETTE: Record<string, string> = {
  parse: '#94a3b8',
  dns: '#38bdf8',
  tcp: '#a78bfa',
  tls: '#f472b6',
  http: '#34d399',
  render: '#fbbf24',
}

function buildStages(rtt: number, opts: { dnsCached: boolean; keepAlive: boolean; https: boolean }): Stage[] {
  const stages: Stage[] = [{ id: 'parse', label: 'Parse URL', detail: 'split scheme, host, path (local, instant)', ms: 1 }]
  stages.push({
    id: 'dns',
    label: 'DNS lookup',
    detail: opts.dnsCached ? 'cache hit — name already resolved' : 'ask a DNS server for the IP (~1 round trip)',
    ms: opts.dnsCached ? 1 : rtt,
  })
  if (!opts.keepAlive) {
    stages.push({ id: 'tcp', label: 'TCP handshake', detail: 'SYN → SYN-ACK → ACK (~1 round trip)', ms: rtt })
    if (opts.https) {
      stages.push({ id: 'tls', label: 'TLS handshake', detail: 'negotiate encryption keys (~1 round trip)', ms: rtt })
    }
  }
  stages.push({
    id: 'http',
    label: 'Request → response',
    detail: `send request, server works (~30ms), response comes back (~1 round trip)`,
    ms: rtt + 30,
  })
  stages.push({ id: 'render', label: 'Render', detail: 'parse the response and paint (local)', ms: 6 })
  return stages
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

export function RequestTracer() {
  const [rtt, setRtt] = useState(40)
  const [dnsCached, setDnsCached] = useState(false)
  const [keepAlive, setKeepAlive] = useState(false)
  const [https, setHttps] = useState(true)
  const [status, setStatus] = useState<Record<string, StageStatus>>({})
  const [running, setRunning] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const runId = useRef(0)

  const stages = buildStages(rtt, { dnsCached, keepAlive, https })
  const total = stages.reduce((sum, s) => sum + s.ms, 0)

  useEffect(() => {
    // Reset visuals whenever the configuration changes.
    runId.current += 1
    setRunning(false)
    setStatus({})
    setLog([])
  }, [rtt, dnsCached, keepAlive, https])

  const send = async () => {
    const myRun = ++runId.current
    setRunning(true)
    setStatus({})
    setLog([`→ Sending request (estimated ${total} ms)`])
    for (const s of stages) {
      if (runId.current !== myRun) return
      setStatus((prev) => ({ ...prev, [s.id]: 'active' }))
      setLog((l) => [...l, `… ${s.label}: ${s.detail} [${s.ms} ms]`])
      await sleep(Math.min(Math.max(s.ms * 6, 140), 1100))
      if (runId.current !== myRun) return
      setStatus((prev) => ({ ...prev, [s.id]: 'done' }))
    }
    if (runId.current !== myRun) return
    setLog((l) => [...l, `✓ 200 OK — done in ~${total} ms`])
    setRunning(false)
  }

  return (
    <div className="panel">
      <div className="net-controls">
        <label className="net-range">
          Network round-trip: <b>{rtt} ms</b>
          <input type="range" min={10} max={200} step={5} value={rtt} onChange={(e) => setRtt(Number(e.target.value))} />
        </label>
        <div className="net-toggles">
          <label><input type="checkbox" checked={dnsCached} onChange={(e) => setDnsCached(e.target.checked)} /> DNS cached</label>
          <label><input type="checkbox" checked={keepAlive} onChange={(e) => setKeepAlive(e.target.checked)} /> Reuse connection (keep-alive)</label>
          <label><input type="checkbox" checked={https} onChange={(e) => setHttps(e.target.checked)} /> HTTPS (TLS)</label>
        </div>
        <button className="btn" disabled={running} onClick={send}>{running ? 'Sending…' : '▶ Send request'}</button>
      </div>

      <div className="waterfall">
        {stages.map((s) => {
          const st = status[s.id] ?? 'idle'
          return (
            <div key={s.id} className="waterfall-row">
              <span className={`waterfall-label${st === 'active' ? ' waterfall-label--active' : ''}`}>{s.label}</span>
              <div className="waterfall-track">
                <div
                  className={`waterfall-bar waterfall-bar--${st}`}
                  style={{ width: `${(s.ms / total) * 100}%`, background: PALETTE[s.id] }}
                >
                  <span className="waterfall-ms">{s.ms} ms</span>
                </div>
              </div>
            </div>
          )
        })}
        <div className="waterfall-total">Total latency budget: <b>{total} ms</b></div>
      </div>

      {log.length > 0 && (
        <pre className="term-output net-log">{log.join('\n')}</pre>
      )}
    </div>
  )
}

const URL_PARTS: { part: string; label: string; cls: string }[] = [
  { part: 'https', label: 'scheme', cls: 'scheme' },
  { part: '://', label: '', cls: 'sep' },
  { part: 'api.example.com', label: 'host', cls: 'host' },
  { part: ':443', label: 'port', cls: 'port' },
  { part: '/v1/users', label: 'path', cls: 'path' },
  { part: '?active=true', label: 'query', cls: 'query' },
]

export function UrlAnatomy() {
  return (
    <div className="url-anatomy">
      <div className="url-string">
        {URL_PARTS.map((p, i) => (
          <span key={i} className={`url-part url-part--${p.cls}`}>{p.part}</span>
        ))}
      </div>
      <div className="url-legend">
        {URL_PARTS.filter((p) => p.label).map((p, i) => (
          <div key={i} className="url-legend-item">
            <span className={`url-swatch url-part--${p.cls}`} />
            <span><b>{p.label}</b> — <code>{p.part}</code></span>
          </div>
        ))}
      </div>
    </div>
  )
}
