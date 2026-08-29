import { Link } from 'react-router-dom'
import { getLessonMeta } from '../meta.ts'
import { CAPSTONE_TASK_TRACKER_ID, useProgress } from '../../progress/ProgressContext.tsx'

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

export function capstoneProgress(
  isDone: (stepId: string, lessonId: string) => boolean,
): { done: number; total: number; percent: number } {
  const total = CAPSTONE_STEPS.length
  const done = CAPSTONE_STEPS.filter((s) => isDone(s.id, s.lessonId)).length
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 }
}

export function CapstoneChecklist() {
  const { isCapstoneStepDone, setCapstoneStepDone } = useProgress()
  const isDone = (stepId: string, lessonId: string) =>
    isCapstoneStepDone(CAPSTONE_TASK_TRACKER_ID, stepId, lessonId)
  const { done, total } = capstoneProgress(isDone)
  const complete = done === total

  return (
    <div className="panel capstone-checklist">
      <div className="panel-title">Capstone: Task tracker app</div>
      <p className="panel-hint">
        Build a small task API + UI by working through these existing chapters in order.
        Each step links to a lesson — no new runtime required. Check steps off as you go;
        marking a linked chapter as read also completes its step.
      </p>
      <div className="start-here-progress-label">Progress: {done}/{total} steps complete</div>
      <div className="start-here-progress-bar" aria-hidden>
        <div className="start-here-progress-fill" style={{ width: `${(done / total) * 100}%` }} />
      </div>
      <ol className="start-here-path">
        {CAPSTONE_STEPS.map((step, i) => {
          const meta = getLessonMeta(step.lessonId)
          const doneStep = isDone(step.id, step.lessonId)
          if (!meta) return null
          return (
            <li key={step.id} className={doneStep ? 'start-here-step--done' : ''}>
              <div className="start-here-step capstone-step">
                <label className="capstone-step-check">
                  <input
                    type="checkbox"
                    checked={doneStep}
                    onChange={(e) =>
                      void setCapstoneStepDone(CAPSTONE_TASK_TRACKER_ID, step.id, e.target.checked)
                    }
                    aria-label={`Mark step ${i + 1} complete: ${step.task}`}
                  />
                </label>
                <Link to={meta.path} className="capstone-step-link">
                  <span className="start-here-step-num">{i + 1}</span>
                  <span className="start-here-step-icon" aria-hidden>{meta.icon}</span>
                  <span className="start-here-step-title">{step.task}</span>
                  <span className="start-here-step-sub">{meta.title}</span>
                </Link>
              </div>
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
