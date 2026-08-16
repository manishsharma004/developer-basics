import { Link } from 'react-router-dom'
import { demos } from '../demos/index.ts'

function Home() {
  return (
    <div className="page">
      <header className="page-header">
        <h1>Developer Basics</h1>
        <p className="lead">
          Hands-on, interactive explainers for the core concepts every developer
          should understand. These aren't slideshows — each demo runs a real
          simulation in your browser (Python via WebAssembly), so you can poke at
          it and watch the model respond.
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
        <h3>Powered by real code</h3>
        <p>
          The filesystem demo is a genuine Unix-like shell over a live in-browser
          filesystem, and the process demo runs an actual CPU-scheduling
          simulation. Both execute Python through <code>Pyodide</code>, compiled
          to WebAssembly — no server required, even on GitHub Pages.
        </p>
      </section>
    </div>
  )
}

export default Home
