import { Link } from 'react-router-dom'
import { lessons } from '../lessons/index.tsx'

function Home() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Developer Basics</h1>
        <p className="lead">
          A hands-on course in the systems every developer relies on — the
          filesystem, processes, memory, and the network. Each lesson explains the
          idea in plain language, then lets you experiment with a real, live
          simulation running in your browser. The goal: understand what's actually
          happening underneath, so you can reason about it with confidence.
        </p>
      </header>

      <section className="lesson-grid">
        {lessons.map((lesson, i) => (
          <Link key={lesson.id} to={lesson.path} className="lesson-card">
            <div className="lesson-card-top">
              <span className="lesson-card-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="lesson-card-icon">{lesson.icon}</span>
            </div>
            <h2>{lesson.title}</h2>
            <p className="lesson-card-summary">{lesson.summary}</p>
            <div className="lesson-card-meta">
              <span className={`badge badge--${lesson.level.toLowerCase()}`}>{lesson.level}</span>
              <span className="badge badge--muted">{lesson.minutes} min</span>
            </div>
          </Link>
        ))}
      </section>

      <section className="home-note">
        <h3>How these lessons work</h3>
        <p>
          Read the short explanation, then use the interactive panel to try it
          yourself — a real filesystem, a live CPU scheduler, a stack/heap
          visualizer, and a network request tracer. The "Under the hood" panels go
          a level deeper when you're ready. Everything runs client-side (Python
          via WebAssembly), so nothing is faked and nothing needs a server.
        </p>
      </section>
    </div>
  )
}

export default Home
