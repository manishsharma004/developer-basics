import { useState } from 'react'

function toBytes(bin: string): string[] {
  const padded = bin.padStart(Math.max(8, Math.ceil(bin.length / 8) * 8), '0')
  const out: string[] = []
  for (let i = 0; i < padded.length; i += 8) out.push(padded.slice(i, i + 8))
  return out
}

export function NumberConverter() {
  const [n, setN] = useState(42)
  const [error, setError] = useState<string | null>(null)

  const update = (base: number, raw: string) => {
    const t = raw.trim()
    if (t === '') {
      setN(0)
      setError(null)
      return
    }
    const v = parseInt(t, base)
    if (Number.isNaN(v) || v < 0 || v > 4294967295) {
      setError('Enter a whole number from 0 to 4,294,967,295.')
      return
    }
    setError(null)
    setN(v)
  }

  const bytes = toBytes(n.toString(2))

  return (
    <div className="panel">
      <div className="panel-title">Number bases</div>
      <div className="conv-grid">
        <label className="conv-field">
          <span>Decimal (base 10)</span>
          <input value={n.toString(10)} onChange={(e) => update(10, e.target.value)} />
        </label>
        <label className="conv-field">
          <span>Hexadecimal (base 16)</span>
          <input value={n.toString(16)} onChange={(e) => update(16, e.target.value)} />
        </label>
        <label className="conv-field">
          <span>Binary (base 2)</span>
          <input value={n.toString(2)} onChange={(e) => update(2, e.target.value)} />
        </label>
        <label className="conv-field">
          <span>Octal (base 8)</span>
          <input value={n.toString(8)} onChange={(e) => update(8, e.target.value)} />
        </label>
      </div>
      {error && <div className="overflow-warn">{error}</div>}
      <div className="byte-view">
        <div className="panel-hint">Binary, grouped into 8-bit bytes:</div>
        <div className="byte-row">
          {bytes.map((b, i) => (
            <span key={i} className="byte-chip">{b}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

export function TextEncoder2() {
  const [text, setText] = useState('Hi ★ 你好')
  const bytes = Array.from(new TextEncoder().encode(text))
  const chars = Array.from(text)

  return (
    <div className="panel">
      <div className="panel-title">Text → bytes (UTF-8)</div>
      <input className="conv-text" value={text} onChange={(e) => setText(e.target.value)} aria-label="text to encode" />
      <div className="text-stats">
        <span><b>{chars.length}</b> characters</span>
        <span><b>{bytes.length}</b> bytes</span>
      </div>
      <div className="cp-list">
        {chars.map((ch, i) => {
          const cp = ch.codePointAt(0) ?? 0
          const chBytes = Array.from(new TextEncoder().encode(ch))
          return (
            <div key={i} className="cp-item">
              <span className="cp-char">{ch === ' ' ? '␣' : ch}</span>
              <span className="cp-code">U+{cp.toString(16).toUpperCase().padStart(4, '0')}</span>
              <span className="cp-bytes">{chBytes.map((b) => b.toString(16).padStart(2, '0')).join(' ')}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
