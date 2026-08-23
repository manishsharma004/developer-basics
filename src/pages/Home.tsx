import { Link } from 'react-router-dom'
import { lessons } from '../lessons/index.tsx'
import { groups } from '../lessons/meta.ts'
import {
  getBeginnerPathLessons,
  getPathProgress,
  getPathResumeLesson,
  isOnBeginnerPath,
} from '../lessons/beginnerPath.ts'
import { lessonNeedsPython } from '../lib/pythonLessons.ts'
import { useProgress } from '../progress/ProgressContext.tsx'
import { ModuleProgressCard } from '../components/ModuleProgress.tsx'

function Home() {
  const { getProgress, ready } = useProgress()
  const isRead = (id: string) => getProgress(id)?.read ?? false
  const pathLessons = getBeginnerPathLessons()
  const resume = ready ? getPathResumeLesson(isRead) : pathLessons[0]
  const pathStats = ready ? getPathProgress(isRead) : { completed: 0, total: pathLessons.length, percent: 0 }

  return (
    <div className="page">
      <header className="page-header">
        <h1>Developer Basics</h1>
        <p className="lead">
          A hands-on course in the systems every developer relies on, organized into{' '}
          {groups.length} modules and {lessons.length} interactive chapters. Each
          chapter explains the idea in plain language, then lets you experiment with a
          real, live simulation running in your browser. The goal: understand what's
          actually happening underneath, so you can reason about it with confidence.
        </p>
      </header>

      <section className="start-here">
        <div className="start-here-head">
          <h2>Start here</h2>
          <p className="start-here-blurb">
            New to development? Follow this guided path — {pathLessons.length} chapters
            in a sensible order. Teachers can still open any chapter from the sidebar.
          </p>
        </div>
        {ready && (
          <div className="start-here-progress">
            <div className="start-here-progress-label">
              Path progress: {pathStats.completed}/{pathStats.total} chapters read
            </div>
            <div className="start-here-progress-bar" aria-hidden>
              <div className="start-here-progress-fill" style={{ width: `${pathStats.percent}%` }} />
            </div>
          </div>
        )}
        {resume && (
          <Link to={resume.path} className="start-here-continue btn">
            {pathStats.completed > 0 && pathStats.completed < pathStats.total
              ? `Continue: ${resume.icon} ${resume.title}`
              : pathStats.completed === pathStats.total
                ? 'Review the path'
                : `Begin: ${resume.icon} ${resume.title}`}
          </Link>
        )}
        <ol className="start-here-path">
          {pathLessons.map((lesson, i) => {
            const done = isRead(lesson.id)
            const needsPy = lessonNeedsPython(lesson.id)
            return (
              <li key={lesson.id} className={done ? 'start-here-step--done' : ''}>
                <Link to={lesson.path} className="start-here-step">
                  <span className="start-here-step-num">{i + 1}</span>
                  <span className="start-here-step-icon" aria-hidden>{lesson.icon}</span>
                  <span className="start-here-step-title">{lesson.title}</span>
                  {needsPy && <span className="start-here-step-tag" title="Needs Python runtime">🐍</span>}
                  {done && <span className="start-here-step-check" aria-label="Read">✓</span>}
                </Link>
              </li>
            )
          })}
        </ol>
      </section>

      {groups.map((group) => {
        const items = lessons.filter((l) => l.group === group.id)
        if (items.length === 0) return null
        return (
          <section key={group.id} className="home-group">
            <div className="home-group-head">
              <span className="home-group-icon" aria-hidden>{group.icon}</span>
              <div className="home-group-heading">
                <h2 className="home-group-title">{group.title}</h2>
                <p className="home-group-blurb">{group.blurb}</p>
              </div>
              <span className="home-group-count">{items.length} chapters</span>
            </div>

            <ModuleProgressCard group={group} />

            <div className="lesson-grid">
              {items.map((lesson) => (
                <Link key={lesson.id} to={lesson.path} className="lesson-card">
                  <div className="lesson-card-top">
                    <span className="lesson-card-num">
                      {String(lessons.indexOf(lesson) + 1).padStart(2, '0')}
                    </span>
                    <span className="lesson-card-icon">{lesson.icon}</span>
                    {isOnBeginnerPath(lesson.id) && (
                      <span className="lesson-card-path" title="On the beginner path">🧭</span>
                    )}
                    {lessonNeedsPython(lesson.id) && (
                      <span className="lesson-card-python" title="Needs Python runtime">🐍</span>
                    )}
                  </div>
                  <h2>{lesson.title}</h2>
                  <p className="lesson-card-summary">{lesson.summary}</p>
                  <div className="lesson-card-meta">
                    <span className={`badge badge--${lesson.level.toLowerCase()}`}>{lesson.level}</span>
                    <span className="badge badge--muted">{lesson.minutes} min</span>
                    {ready && isRead(lesson.id) && (
                      <span className="badge badge--progress">Read</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )
      })}

      <section className="home-note">
        <h3>How these lessons work</h3>
        <p>
          Read the short explanation, then use the interactive panel to try it
          yourself — a real filesystem, a live CPU scheduler, a stack/heap
          visualizer, and a network request tracer. The "Under the hood" panels go
          a level deeper when you're ready. Everything runs client-side (Python
          via WebAssembly), so nothing is faked and nothing needs a server.
        </p>
        <p>
          Chapters marked with 🐍 need the Python runtime downloaded once (~15 MB).
          If your network is slow, you can still read the prose and try quizzes.
        </p>
      </section>
    </div>
  )
}

export default Home
