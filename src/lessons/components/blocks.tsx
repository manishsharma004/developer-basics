import { useState, type ReactNode } from 'react'

// A titled, anchor-able chunk of a lesson. The `id` matches the entry in the
// lesson's `sections` metadata so the sticky table of contents can link to it.
export function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section className="lesson-section" id={id}>
      <h2 className="lesson-section-title">{title}</h2>
      {children}
    </section>
  )
}

type CalloutKind = 'tip' | 'note' | 'why' | 'warning'

const CALLOUT_ICON: Record<CalloutKind, string> = {
  tip: '💡',
  note: '📝',
  why: '🎯',
  warning: '⚠️',
}

// A highlighted aside for tips, context, or the "why this matters" hook.
export function Callout({ kind = 'note', title, children }: {
  kind?: CalloutKind
  title?: string
  children: ReactNode
}) {
  return (
    <div className={`callout callout--${kind}`}>
      <div className="callout-icon" aria-hidden>{CALLOUT_ICON[kind]}</div>
      <div className="callout-body">
        {title && <div className="callout-title">{title}</div>}
        <div>{children}</div>
      </div>
    </div>
  )
}

// A collapsible panel for the internal details — the "how does this actually
// work underneath" content that builds real system awareness.
export function UnderTheHood({ title = 'Under the hood', children }: { title?: string; children: ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`hood${open ? ' hood--open' : ''}`}>
      <button className="hood-toggle" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span className="hood-caret">{open ? '▾' : '▸'}</span>
        <span className="hood-gear" aria-hidden>🔧</span>
        {title}
      </button>
      {open && <div className="hood-content">{children}</div>}
    </div>
  )
}

// A prompt nudging the learner to actually go do something in the playground.
export function TryThis({ children }: { children: ReactNode }) {
  return (
    <div className="try-this">
      <span className="try-this-tag">Try this</span>
      <div className="try-this-body">{children}</div>
    </div>
  )
}

// The closing takeaways of a lesson.
export function Recap({ items }: { items: ReactNode[] }) {
  return (
    <ul className="recap">
      {items.map((item, i) => (
        <li key={i}>
          <span className="recap-check" aria-hidden>✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}
