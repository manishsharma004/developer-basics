import { useEffect, useState, type ReactNode } from 'react'
import { CodePreview } from '../../components/CodePreview.tsx'
import { useCurrentLessonId } from '../../progress/CurrentLessonContext.tsx'
import { useLessonProgress, useProgress } from '../../progress/ProgressContext.tsx'

export { CodePreview }

/** Monospace ASCII flow diagram (not syntax-highlighted). */
export function FlowDiagram({ code }: { code: string }) {
  return <pre className="flow-diagram">{code.trimEnd()}</pre>
}

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

/** Sim vs reality — what transfers from the in-browser lab and what doesn't. */
export function SimReality({ inSim, inReality }: { inSim: ReactNode; inReality: ReactNode }) {
  return (
    <div className="sim-reality" role="note" aria-label="Simulation vs real world">
      <div className="sim-reality-col sim-reality-col--sim">
        <div className="sim-reality-label">In this sim</div>
        <div className="sim-reality-body">{inSim}</div>
      </div>
      <div className="sim-reality-col sim-reality-col--real">
        <div className="sim-reality-label">In the real world</div>
        <div className="sim-reality-body">{inReality}</div>
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

export interface QuizQuestion {
  q: ReactNode
  options: string[]
  answer: number
  explain?: ReactNode
}

// A lightweight multiple-choice knowledge check. Each question reveals whether
// the choice was right (with an explanation) as soon as it's picked.
export function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const lessonId = useCurrentLessonId()
  const { saveQuizAnswer } = useProgress()
  const { progress, ready } = useLessonProgress(lessonId ?? undefined)
  const [picked, setPicked] = useState<Record<number, number>>({})

  useEffect(() => {
    if (!lessonId || !ready) return
    if (progress?.quizAnswers) {
      setPicked(progress.quizAnswers)
    }
  }, [lessonId, ready, progress?.quizAnswers])

  const choose = (questionIndex: number, optionIndex: number) => {
    setPicked((current) => ({ ...current, [questionIndex]: optionIndex }))
    if (lessonId) void saveQuizAnswer(lessonId, questionIndex, optionIndex)
  }

  return (
    <div className="quiz">
      {questions.map((question, qi) => {
        const chosen = picked[qi]
        const answered = chosen !== undefined
        return (
          <div key={qi} className="quiz-q">
            <div className="quiz-prompt">
              <span className="quiz-num">Q{qi + 1}</span>
              <span>{question.q}</span>
            </div>
            <div className="quiz-options">
              {question.options.map((opt, oi) => {
                const isChosen = chosen === oi
                const isCorrect = oi === question.answer
                let cls = 'quiz-option'
                if (answered && isCorrect) cls += ' quiz-option--correct'
                else if (answered && isChosen && !isCorrect) cls += ' quiz-option--wrong'
                return (
                  <button
                    key={oi}
                    className={cls}
                    disabled={answered}
                    onClick={() => choose(qi, oi)}
                  >
                    <span className="quiz-marker">
                      {answered && isCorrect ? '✓' : answered && isChosen ? '✗' : String.fromCharCode(65 + oi)}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
            {answered && (
              <div className={`quiz-feedback${chosen === question.answer ? ' quiz-feedback--ok' : ' quiz-feedback--no'}`}>
                {chosen === question.answer ? 'Correct. ' : 'Not quite. '}
                {question.explain}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

// A compact glossary of the key terms introduced in a lesson.
export function KeyTerms({ terms }: { terms: { term: string; def: ReactNode }[] }) {
  return (
    <dl className="key-terms">
      {terms.map((t) => (
        <div key={t.term} className="key-term">
          <dt>{t.term}</dt>
          <dd>{t.def}</dd>
        </div>
      ))}
    </dl>
  )
}
