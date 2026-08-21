import { useEffect, useState, type ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { getLessonMeta, getNextLesson, type SectionMeta } from '../meta.ts'

interface Props {
  id: string
  children: ReactNode
}

// Shared layout for every lesson: a header, a sticky in-page section nav that
// tracks scroll position, the lesson body, and a link to the next lesson.
export function Lesson({ id, children }: Props) {
  const meta = getLessonMeta(id)
  const next = getNextLesson(id)
  const location = useLocation()
  const sections: SectionMeta[] = meta?.sections ?? []
  const [active, setActive] = useState(sections[0]?.id ?? '')

  useEffect(() => {
    const scrollTo = (location.state as { scrollTo?: string } | null)?.scrollTo
    if (!scrollTo) return
    requestAnimationFrame(() => {
      document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [location.pathname, location.state])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: [0, 0.25, 0.5, 1] },
    )
    for (const s of sections) {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [id, sections])

  const scrollTo = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  if (!meta) return null

  return (
    <div className="lesson">
      <header className="lesson-hero">
        <div className="lesson-hero-top">
          <span className="lesson-hero-icon">{meta.icon}</span>
          <div className="lesson-badges">
            <span className={`badge badge--${meta.level.toLowerCase()}`}>{meta.level}</span>
            <span className="badge badge--muted">{meta.minutes} min</span>
          </div>
        </div>
        <h1>{meta.title}</h1>
        <p className="lesson-hero-tagline">{meta.tagline}</p>
      </header>

      <div className="lesson-body">
        <nav className="lesson-toc" aria-label="Lesson sections">
          <ol>
            {sections.map((s) => (
              <li key={s.id}>
                <button
                  className={`toc-link${active === s.id ? ' toc-link--active' : ''}`}
                  onClick={() => scrollTo(s.id)}
                >
                  {s.title}
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <div className="lesson-content">
          {children}

          <div className="lesson-footer">
            {next ? (
              <Link to={next.path} className="next-lesson">
                <span className="next-lesson-label">Next lesson</span>
                <span className="next-lesson-title">
                  {next.icon} {next.title} →
                </span>
              </Link>
            ) : (
              <Link to="/" className="next-lesson">
                <span className="next-lesson-label">You reached the end</span>
                <span className="next-lesson-title">Back to all lessons →</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
