import { Link } from 'react-router-dom'
import { getLessonMeta } from '../meta.ts'
import { useProgress } from '../../progress/ProgressContext.tsx'

/** Capstone steps mapping to existing lessons. */
export const CAPSTONE_STEPS: { id: string; task: string; lessonId: string }[] = [
  { id: 'model', task: 'Model data with SQL tables and keys', lessonId: 'sql-schema' },
  { id: 'queries', task: 'Write queries and joins', lessonId: 'sql-tables' },
  { id: 'api', task: 'Design REST endpoints', lessonId: 'apis' },
  { id: 'fastapi', task: 'Build a FastAPI route with validation', lessonId: 'fastapi-intro' },
  { id: 'ui', task: 'Create a React component with state', lessonId: 'react-intro' },
  { id: 'auth', task: 'Add authentication concepts', lessonId: 'auth' },
  { id: 'tests', task: 'Write tests for your logic', lessonId: 'testing' },
  { id: 'deploy', task: 'Understand CI/CD deploy flow', lessonId: 'cicd' },
]

export function CapstoneChecklist() {
  const { getProgress } = useProgress()

  const done = CAPSTONE_STEPS.filter((s) => getProgress(s.lessonId)?.read).length
  const total = CAPSTONE_STEPS.length
  const complete = done === total

  return (
    <div className="panel capstone-checklist">
      <div className="panel-title">Capstone: Task tracker app</div>
      <p className="panel-hint">
        Build a small task API + UI by working through these existing chapters in order.
        Each step links to a lesson — no new runtime required.
      </p>
      <div className="start-here-progress-label">Progress: {done}/{total} steps read</div>
      <div className="start-here-progress-bar" aria-hidden>
        <div className="start-here-progress-fill" style={{ width: `${(done / total) * 100}%` }} />
      </div>
      <ol className="start-here-path">
        {CAPSTONE_STEPS.map((step, i) => {
          const meta = getLessonMeta(step.lessonId)
          const read = getProgress(step.lessonId)?.read
          if (!meta) return null
          return (
            <li key={step.id} className={read ? 'start-here-step--done' : ''}>
              <Link to={meta.path} className="start-here-step">
                <span className="start-here-step-num">{i + 1}</span>
                <span className="start-here-step-icon" aria-hidden>{meta.icon}</span>
                <span className="start-here-step-title">{step.task}</span>
                <span className="start-here-step-sub">{meta.title}</span>
                {read && <span className="start-here-step-check" aria-hidden>✓</span>}
              </Link>
            </li>
          )
        })}
      </ol>
      {complete && (
        <div className="module-milestone">
          <p className="module-milestone-msg">🎉 Capstone path complete — you stitched the stack together!</p>
        </div>
      )}
    </div>
  )
}
