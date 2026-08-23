import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { lessons } from '../lessons/index.tsx'
import { groups, type LessonGroup, type LessonMeta } from '../lessons/meta.ts'
import { useProgress } from '../progress/ProgressContext.tsx'

function moduleStats(
  group: LessonGroup,
  getProgress: (id: string) => { read?: boolean; quizAnswers?: Record<number, number> } | undefined,
) {
  const items = lessons.filter((l: LessonMeta) => l.group === group.id)
  const read = items.filter((l) => getProgress(l.id)?.read).length
  const quizzed = items.filter((l) => {
    const answers = getProgress(l.id)?.quizAnswers
    return answers && Object.keys(answers).length > 0
  }).length
  return { items, read, quizzed, total: items.length }
}

export function ModuleProgressCard({ group }: { group: LessonGroup }) {
  const { getProgress, ready } = useProgress()
  const [celebrating, setCelebrating] = useState(false)
  const [shareText, setShareText] = useState<string | null>(null)

  const stats = useMemo(() => moduleStats(group, getProgress), [group, getProgress, ready])

  if (!ready || stats.total === 0) return null

  const complete = stats.read === stats.total
  const percent = Math.round((stats.read / stats.total) * 100)

  const share = () => {
    const lines = [
      `I completed the "${group.title}" module in Developer Basics!`,
      `Chapters read: ${stats.read}/${stats.total}`,
      `Date: ${new Date().toLocaleDateString()}`,
      '',
      'Chapters:',
      ...stats.items.filter((l: LessonMeta) => getProgress(l.id)?.read).map((l: LessonMeta) => `✓ ${l.title}`),
    ]
    const text = lines.join('\n')
    setShareText(text)
    if (typeof navigator.share === 'function') {
      void navigator.share({ title: `${group.title} complete`, text }).catch(() => {})
    } else {
      void navigator.clipboard.writeText(text).catch(() => {})
      setCelebrating(true)
    }
  }

  return (
    <div className={`module-progress${complete ? ' module-progress--complete' : ''}`}>
      <div className="module-progress-head">
        <span className="module-progress-title">{group.icon} {group.title}</span>
        <span className="module-progress-pct">{percent}%</span>
      </div>
      <div className="module-progress-bar" aria-hidden>
        <div className="module-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <ul className="module-progress-list">
        {stats.items.map((lesson) => {
          const p = getProgress(lesson.id)
          const done = p?.read
          const triedQuiz = p?.quizAnswers && Object.keys(p.quizAnswers).length > 0
          return (
            <li key={lesson.id} className={done ? 'module-progress-item--done' : ''}>
              <Link to={lesson.path} className="module-progress-link">
                <span className="module-progress-check" aria-hidden>{done ? '✓' : '○'}</span>
                <span>{lesson.title}</span>
                {triedQuiz && <span className="module-progress-quiz" title="Quiz attempted">?</span>}
              </Link>
            </li>
          )
        })}
      </ul>
      {complete && (
        <div className="module-milestone">
          <p className="module-milestone-msg">🎉 You finished {group.title}!</p>
          <button type="button" className="btn btn--sm" onClick={share}>
            Share milestone
          </button>
          {(celebrating || shareText) && (
            <p className="module-milestone-copied" role="status">
              {typeof navigator.share === 'function' ? 'Share sheet opened.' : 'Milestone copied to clipboard.'}
            </p>
          )}
        </div>
      )}
    </div>
  )
}

export function ModuleProgressSummary() {
  return (
    <div className="module-progress-grid">
      {groups.map((group) => (
        <ModuleProgressCard key={group.id} group={group} />
      ))}
    </div>
  )
}
