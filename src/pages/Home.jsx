import { Link } from 'react-router-dom'
import { demos } from '../demos/index.js'

function Home() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Developer Basics</h1>
        <p className="lead">
          Hands-on, interactive explainers for the core concepts every developer
          should understand. Pick a topic to explore — start with the filesystem,
          then dive into how processes work.
        </p>
      </header>

      <section className="card-grid">
        {demos.map((demo) => (
          <Link key={demo.id} to={demo.path} className="topic-card">
            <span className="topic-icon">{demo.icon}</span>
            <h2>{demo.title}</h2>
            <p>{demo.tagline}</p>
            <span className="topic-cta">Explore →</span>
          </Link>
        ))}
      </section>

      <section className="home-note">
        <h3>How to use this</h3>
        <p>
          Each demo pairs a short explanation with something you can click. The
          goal is intuition, not exhaustive detail: poke at the interactive parts
          and watch how the model responds.
        </p>
      </section>
    </div>
  )
}

export default Home
