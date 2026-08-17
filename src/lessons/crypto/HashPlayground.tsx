import { useEffect, useState } from 'react'

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s))
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function HashPlayground() {
  const [text, setText] = useState('hello')
  const [h1, setH1] = useState('')
  const [h2, setH2] = useState('')

  useEffect(() => {
    let cancelled = false
    void (async () => {
      const a = await sha256Hex(text)
      const b = await sha256Hex(text + '!')
      if (!cancelled) {
        setH1(a)
        setH2(b)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [text])

  const diffCount = h1 && h2 ? [...h1].filter((c, i) => c !== h2[i]).length : 0
  const diffPct = h1 ? Math.round((diffCount / h1.length) * 100) : 0

  return (
    <div className="panel">
      <label className="conv-field"><span>Input</span>
        <input className="conv-text" value={text} onChange={(e) => setText(e.target.value)} aria-label="text to hash" />
      </label>

      <div className="hash-block">
        <div className="hash-label">SHA-256 of "<b>{text}</b>"</div>
        <code className="hash-hex">{h1}</code>
      </div>

      <div className="hash-block">
        <div className="hash-label">SHA-256 of "<b>{text}!</b>" (one extra character)</div>
        <code className="hash-hex">
          {[...h2].map((c, i) => (
            <span key={i} className={h1[i] !== c ? 'hash-diff' : undefined}>{c}</span>
          ))}
        </code>
      </div>

      <div className="race-verdict race-verdict--ok">
        Avalanche effect: adding one character changed <b>{diffCount}</b> of 64 hex
        digits (~{diffPct}%). A hash reveals nothing about how similar the inputs were.
      </div>
    </div>
  )
}
