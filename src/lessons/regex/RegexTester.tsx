import { useMemo, useState, type ReactNode } from 'react'

const SAMPLE = `Contact: ada@math.org, grace@navy.mil
Call 555-0142 or 555-9930
Order #10023 shipped; order #10024 pending`

const PRESETS = [
  { label: 'emails', pattern: '\\b[\\w.]+@[\\w.]+\\b' },
  { label: 'phone numbers', pattern: '\\d{3}-\\d{4}' },
  { label: 'order ids', pattern: '#(\\d+)' },
  { label: 'words', pattern: '\\w+' },
]

interface Segment {
  text: string
  match: boolean
}

export function RegexTester() {
  const [pattern, setPattern] = useState('\\b[\\w.]+@[\\w.]+\\b')
  const [flags, setFlags] = useState({ g: true, i: false, m: false })
  const [text, setText] = useState(SAMPLE)

  const flagStr = `${flags.g ? 'g' : ''}${flags.i ? 'i' : ''}${flags.m ? 'm' : ''}`

  const { segments, error, count } = useMemo(() => {
    let re: RegExp
    try {
      re = new RegExp(pattern, flagStr.includes('g') ? flagStr : flagStr + 'g')
    } catch (e) {
      return { segments: [{ text, match: false }] as Segment[], error: (e as Error).message, count: 0 }
    }
    const segs: Segment[] = []
    let last = 0
    let n = 0
    for (const m of text.matchAll(re)) {
      const i = m.index ?? 0
      if (m[0].length === 0) break // avoid zero-length infinite loop
      if (i > last) segs.push({ text: text.slice(last, i), match: false })
      segs.push({ text: m[0], match: true })
      last = i + m[0].length
      n++
    }
    if (last < text.length) segs.push({ text: text.slice(last), match: false })
    return { segments: segs, error: null as string | null, count: n }
  }, [pattern, flagStr, text])

  const highlighted: ReactNode = segments.map((s, i) =>
    s.match ? <mark key={i} className="rx-match">{s.text}</mark> : <span key={i}>{s.text}</span>,
  )

  return (
    <div className="panel">
      <div className="rx-row">
        <span className="rx-slash">/</span>
        <input className="term-input rx-pattern" value={pattern} spellCheck={false} onChange={(e) => setPattern(e.target.value)} aria-label="regex pattern" />
        <span className="rx-slash">/{flagStr}</span>
      </div>
      <div className="rx-flags">
        {(['g', 'i', 'm'] as const).map((f) => (
          <label key={f}>
            <input type="checkbox" checked={flags[f]} onChange={(e) => setFlags((p) => ({ ...p, [f]: e.target.checked }))} /> {f}
            <span className="rx-flag-desc">{f === 'g' ? 'global' : f === 'i' ? 'ignore case' : 'multiline'}</span>
          </label>
        ))}
      </div>
      <div className="quick-commands">
        {PRESETS.map((p) => (
          <button key={p.label} className="chip" onClick={() => setPattern(p.pattern)}>{p.label}</button>
        ))}
      </div>

      {error ? (
        <div className="overflow-warn">Invalid pattern: {error}</div>
      ) : (
        <div className="rx-count">{count} match{count === 1 ? '' : 'es'}</div>
      )}

      <div className="rx-text">{highlighted}</div>
      <textarea className="code-editor" rows={4} value={text} spellCheck={false} onChange={(e) => setText(e.target.value)} aria-label="test text" />
    </div>
  )
}
