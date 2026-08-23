import { useState } from 'react'

type Scenario = 'ok' | '404' | '500' | 'timeout'

export function FetchPlayground() {
  const [scenario, setScenario] = useState<Scenario>('ok')
  const [retries, setRetries] = useState(0)
  const [maxRetries] = useState(3)
  const [log, setLog] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const mockFetch = async (): Promise<Response> => {
    await new Promise((r) => setTimeout(r, 600))
    if (scenario === 'timeout') throw new Error('Timeout after 600ms')
    if (scenario === '404') return new Response(JSON.stringify({ error: 'Not found' }), { status: 404 })
    if (scenario === '500') return new Response('Server error', { status: 500 })
    return new Response(JSON.stringify({ data: 'success' }), { status: 200 })
  }

  const run = async () => {
    setLoading(true)
    setRetries(0)
    setLog([])
    let attempt = 0
    while (attempt <= maxRetries) {
      setLog((l) => [...l, `Attempt ${attempt + 1}…`])
      try {
        const res = await mockFetch()
        setLog((l) => [...l, `→ ${res.status} ${res.statusText}`])
        if (res.ok) {
          const body = await res.text()
          setLog((l) => [...l, `✓ ${body}`])
          break
        }
        if (res.status >= 500 && attempt < maxRetries) {
          const backoff = Math.pow(2, attempt) * 200
          setLog((l) => [...l, `Retrying in ${backoff}ms (5xx is often transient)`])
          await new Promise((r) => setTimeout(r, backoff))
          attempt++
          setRetries(attempt)
          continue
        }
        setLog((l) => [...l, '✗ Not retrying (4xx or max retries)'])
        break
      } catch (err) {
        setLog((l) => [...l, `✗ ${err instanceof Error ? err.message : String(err)}`])
        break
      }
    }
    setLoading(false)
  }

  return (
    <div className="panel">
      <div className="panel-title">HTTP client simulator</div>
      <div className="ref-snippets">
        {(['ok', '404', '500', 'timeout'] as Scenario[]).map((s) => (
          <button key={s} type="button" className={`chip${scenario === s ? ' chip--active' : ''}`} onClick={() => setScenario(s)}>{s}</button>
        ))}
      </div>
      <div className="ref-run-row">
        <button type="button" className="btn" disabled={loading} onClick={() => void run()}>
          {loading ? 'Fetching…' : '▶ fetch(url)'}
        </button>
        {retries > 0 && <span className="badge badge--muted">Retries: {retries}</span>}
      </div>
      <pre className="term-output">{log.join('\n') || 'Press fetch to simulate a request…'}</pre>
    </div>
  )
}
