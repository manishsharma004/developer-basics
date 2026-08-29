import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { lessonsMeta } from '../lessons/meta.ts'
import { useExperience } from '../experience/ExperienceContext.tsx'
import { useTheme } from '../theme/ThemeContext.tsx'

const REPO = 'https://github.com/manishsharma004/developer-basics'

type IssueType = 'feature' | 'bug' | 'question'

const TYPES: { id: IssueType; label: string; ghLabel: string; prefix: string }[] = [
  { id: 'feature', label: '✨ Feature request', ghLabel: 'enhancement', prefix: '[Feature]' },
  { id: 'bug', label: '🐛 Bug report', ghLabel: 'bug', prefix: '[Bug]' },
  { id: 'question', label: '❓ Question', ghLabel: 'question', prefix: '[Question]' },
]

export function FeedbackDialog({ onClose }: { onClose: () => void }) {
  const location = useLocation()
  const { experience } = useExperience()
  const { preference, resolvedTheme } = useTheme()
  const [type, setType] = useState<IssueType>('feature')
  const [title, setTitle] = useState('')
  const [details, setDetails] = useState('')
  const [includeContext, setIncludeContext] = useState(true)

  const current = lessonsMeta.find((l) => l.path === location.pathname)
  const selected = TYPES.find((x) => x.id === type)!

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  const buildUrl = (): string => {
    const fullTitle = `${selected.prefix} ${title.trim()}`
    const lines: string[] = [details.trim() || '_Describe what you need…_']
    if (includeContext) {
      lines.push(
        '',
        '---',
        '**Context** (auto-filled)',
        `- Page: ${current ? `${current.title} (${location.pathname})` : location.pathname || '/'}`,
        `- Experience: ${experience}`,
        `- Theme: ${preference === 'system' ? `system (${resolvedTheme})` : preference}`,
        `- URL: ${typeof window !== 'undefined' ? window.location.href : ''}`,
      )
    }
    const params = new URLSearchParams({
      title: fullTitle,
      body: lines.join('\n'),
      labels: selected.ghLabel,
    })
    return `${REPO}/issues/new?${params.toString()}`
  }

  const submit = () => {
    if (!title.trim()) return
    window.open(buildUrl(), '_blank', 'noopener')
    onClose()
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Request or report an issue" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <h2>Request something or report an issue</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">×</button>
        </div>

        <p className="modal-note">
          This opens a pre-filled issue on GitHub in a new tab — you review and submit it there.
          A free GitHub account is required to post.
        </p>

        <div className="modal-types">
          {TYPES.map((x) => (
            <button
              key={x.id}
              className={`type-btn${type === x.id ? ' type-btn--active' : ''}`}
              onClick={() => setType(x.id)}
            >
              {x.label}
            </button>
          ))}
        </div>

        <label className="modal-field">
          <span>Title</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Short summary of your request"
            autoFocus
          />
        </label>

        <label className="modal-field">
          <span>Details</span>
          <textarea
            rows={5}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="What do you need? For bugs: steps, what you expected, what happened."
          />
        </label>

        <label className="modal-check">
          <input type="checkbox" checked={includeContext} onChange={(e) => setIncludeContext(e.target.checked)} />
          Include the current page, experience, and theme as context
        </label>

        <div className="modal-actions">
          <button className="btn btn--ghost" onClick={onClose}>Cancel</button>
          <button className="btn" disabled={!title.trim()} onClick={submit}>↗ Open GitHub issue</button>
        </div>
      </div>
    </div>
  )
}
