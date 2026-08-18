import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getLessonMeta, getNextLesson } from '../lessons/meta.ts'
import { teacherGuides } from './teacherGuides.ts'
import { useExperience } from './ExperienceContext.tsx'

const SECTIONS = [
  { id: 'objectives', title: 'Learning objectives' },
  { id: 'concepts', title: 'Key concepts' },
  { id: 'misconceptions', title: 'Common misconceptions' },
  { id: 'discussion', title: 'Discussion prompts' },
  { id: 'lab', title: 'Interactive lab' },
  { id: 'assess', title: 'Assessment' },
]

export function LessonPlan({ id }: { id: string }) {
  const meta = getLessonMeta(id)
  const guide = teacherGuides[id]
  const next = getNextLesson(id)
  const { setExperience } = useExperience()
  const [active, setActive] = useState('objectives')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    for (const s of SECTIONS) {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [id])

  if (!meta || !guide) return null

  const scrollTo = (sid: string) => document.getElementById(sid)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <div className="lesson">
      <header className="lesson-hero">
        <div className="lesson-hero-top">
          <span className="lesson-hero-icon">{meta.icon}</span>
          <div className="lesson-badges">
            <span className="badge badge--teacher-tag">Lesson plan</span>
            <span className={`badge badge--${meta.level.toLowerCase()}`}>{meta.level}</span>
            <span className="badge badge--muted">{meta.minutes} min</span>
          </div>
        </div>
        <h1>{meta.title}</h1>
        <p className="lesson-hero-tagline">{meta.tagline}</p>
      </header>

      <div className="lesson-body">
        <nav className="lesson-toc" aria-label="Lesson plan sections">
          <ol>
            {SECTIONS.map((s) => (
              <li key={s.id}>
                <button className={`toc-link${active === s.id ? ' toc-link--active' : ''}`} onClick={() => scrollTo(s.id)}>
                  {s.title}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="lesson-content">
          <section className="lesson-section" id="objectives">
            <h2 className="lesson-section-title">Learning objectives</h2>
            <p className="prose">By the end of this lesson, students should be able to:</p>
            <ul className="plan-list">
              {guide.objectives.map((o, i) => <li key={i}>{o}</li>)}
            </ul>
          </section>

          <section className="lesson-section" id="concepts">
            <h2 className="lesson-section-title">Key concepts to convey</h2>
            <ul className="plan-list plan-list--check">
              {guide.keyConcepts.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </section>

          <section className="lesson-section" id="misconceptions">
            <h2 className="lesson-section-title">Common misconceptions</h2>
            <ul className="plan-list plan-list--warn">
              {guide.misconceptions.map((m, i) => <li key={i}>{m}</li>)}
            </ul>
          </section>

          <section className="lesson-section" id="discussion">
            <h2 className="lesson-section-title">Discussion prompts</h2>
            <ul className="plan-list plan-list--ask">
              {guide.discussion.map((d, i) => <li key={i}>{d}</li>)}
            </ul>
          </section>

          <section className="lesson-section" id="lab">
            <h2 className="lesson-section-title">Interactive lab</h2>
            <div className="plan-lab">
              <p className="prose">{guide.lab}</p>
              <Link to={meta.path} className="btn" onClick={() => setExperience('student')}>
                ▶ Open the student lab
              </Link>
            </div>
          </section>

          <section className="lesson-section" id="assess">
            <h2 className="lesson-section-title">Assessment</h2>
            <p className="prose">Quick checks for understanding (the student lab also includes self-check quizzes):</p>
            <ul className="plan-list">
              {guide.assess.map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          </section>

          <div className="lesson-footer">
            {next ? (
              <Link to={next.path} className="next-lesson">
                <span className="next-lesson-label">Next lesson plan</span>
                <span className="next-lesson-title">{next.icon} {next.title} →</span>
              </Link>
            ) : (
              <Link to="/" className="next-lesson">
                <span className="next-lesson-label">End of curriculum</span>
                <span className="next-lesson-title">Back to the curriculum →</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
