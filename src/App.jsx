import { NavLink, Route, Routes } from 'react-router-dom'
import { demos } from './demos/index.js'
import Home from './pages/Home.jsx'

function App() {
  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">{'</>'}</span>
          <div>
            <div className="brand-title">Developer Basics</div>
            <div className="brand-sub">interactive fundamentals</div>
          </div>
        </div>

        <nav className="nav">
          <NavLink to="/" end className="nav-link">
            <span className="nav-icon">🏠</span>
            <span>Home</span>
          </NavLink>
          {demos.map((demo) => (
            <NavLink key={demo.id} to={demo.path} className="nav-link">
              <span className="nav-icon">{demo.icon}</span>
              <span>{demo.title}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a
            href="https://github.com/manishsharma004/developer-basics"
            target="_blank"
            rel="noreferrer"
          >
            View source
          </a>
        </div>
      </aside>

      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          {demos.map(({ id, path, Component }) => (
            <Route key={id} path={path} element={<Component />} />
          ))}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
