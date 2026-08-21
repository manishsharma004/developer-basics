import { useEffect, useState } from 'react'
import { NavLink, Route, Routes, useLocation } from 'react-router-dom'
import { lessons } from './lessons/index.tsx'
import { groups, type Level } from './lessons/meta.ts'
import Home from './pages/Home.tsx'
import TeacherHome from './pages/TeacherHome.tsx'
import { useExperience } from './experience/ExperienceContext.tsx'
import { LessonPlan } from './experience/LessonPlan.tsx'
import { useTheme } from './theme/ThemeContext.tsx'
import { THEMES, type ThemeId } from './theme/themes.ts'
import { FeedbackDialog } from './components/FeedbackDialog.tsx'
import { GlobalSearch, searchShortcutLabel, useGlobalSearchShortcut } from './components/GlobalSearch.tsx'
import { useProgress } from './progress/ProgressContext.tsx'

const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced']
const COLLAPSE_KEY = 'devbasics.sidebarCollapsed'

function navLinkClass(isActive: boolean, read: boolean, base = 'nav-link') {
  let cls = base
  if (isActive) cls += ' active'
  if (read) cls += ' nav-link--read'
  return cls
}

function App() {
  const { experience, setExperience } = useExperience()
  const { theme, setTheme } = useTheme()
  const teacher = experience === 'teacher'
  const location = useLocation()

  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(COLLAPSE_KEY) === '1'
    } catch {
      return false
    }
  })
  const [mobileOpen, setMobileOpen] = useState(false)
  const [feedbackOpen, setFeedbackOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [closedGroups, setClosedGroups] = useState<Record<string, boolean>>({})

  const { getProgress } = useProgress()

  const activeLesson = lessons.find((l) => l.path === location.pathname)

  const toggleGroup = (id: string) =>
    setClosedGroups((g) => ({ ...g, [id]: !g[id] }))

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      const next = !c
      try {
        localStorage.setItem(COLLAPSE_KEY, next ? '1' : '0')
      } catch {
        /* ignore */
      }
      return next
    })
  }

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useGlobalSearchShortcut(() => setSearchOpen(true))

  const closeMobile = () => setMobileOpen(false)
  const shortcut = searchShortcutLabel()

  const renderLink = (to: string, icon: string, label: string, end = false) => (
    <NavLink to={to} end={end} className="nav-link" title={label} onClick={closeMobile}>
      <span className="nav-icon">{icon}</span>
      <span className="nav-label">{label}</span>
    </NavLink>
  )

  return (
    <div
      className={`app${teacher ? ' app--teacher' : ''}${collapsed ? ' app--collapsed' : ''}${
        mobileOpen ? ' app--mobnav-open' : ''
      }`}
    >
      <header className="topbar">
        <button
          className="topbar-toggle"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((o) => !o)}
        >
          <span className="hamburger" aria-hidden />
        </button>
        <span className="topbar-title">Developer Basics</span>
        <button
          className="topbar-search"
          onClick={() => setSearchOpen(true)}
          aria-label="Search topics"
          title={`Search topics (${shortcut})`}
        >
          🔍
        </button>
        <button className="topbar-feedback" onClick={() => setFeedbackOpen(true)} aria-label="Request or report an issue" title="Request / report">
          💬
        </button>
        <span className={`topbar-mode${teacher ? ' topbar-mode--teacher' : ''}`}>
          {teacher ? '🧑‍🏫 Teacher' : '🎓 Student'}
        </span>
      </header>

      <button className="mobile-backdrop" aria-label="Close navigation" tabIndex={-1} onClick={closeMobile} />

      <aside className="sidebar">
        <div className="sidebar-head">
          <div className="brand">
            <span className="brand-mark">{'</>'}</span>
            <div className="brand-text">
              <div className="brand-title">Developer Basics</div>
              <div className="brand-sub">{teacher ? 'teach with confidence' : 'learn by doing'}</div>
            </div>
          </div>
          <button
            className="collapse-btn"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            onClick={toggleCollapsed}
          >
            {collapsed ? '»' : '«'}
          </button>
        </div>

        <div className="exp-switch" role="tablist" aria-label="Experience">
          <button
            role="tab"
            aria-selected={!teacher}
            className={`exp-btn${!teacher ? ' exp-btn--active' : ''}`}
            onClick={() => setExperience('student')}
            title="Student experience"
          >
            <span className="exp-icon">🎓</span>
            <span className="exp-label">Student</span>
          </button>
          <button
            role="tab"
            aria-selected={teacher}
            className={`exp-btn${teacher ? ' exp-btn--active' : ''}`}
            onClick={() => setExperience('teacher')}
            title="Teacher experience"
          >
            <span className="exp-icon">🧑‍🏫</span>
            <span className="exp-label">Teacher</span>
          </button>
        </div>

        <button
          type="button"
          className="global-search-trigger"
          onClick={() => setSearchOpen(true)}
          title={`Search topics (${shortcut})`}
          aria-label="Search topics"
        >
          <span className="nav-icon" aria-hidden>
            🔍
          </span>
          <span className="nav-label global-search-trigger-label">Search topics…</span>
          <kbd className="global-search-trigger-kbd nav-label">{shortcut}</kbd>
        </button>

        <nav className="nav">
          {renderLink('/', teacher ? '📋' : '🏠', teacher ? 'Curriculum' : 'All lessons', true)}

          {teacher ? (
            LEVELS.map((level) => {
              const group = lessons.filter((l) => l.level === level)
              if (group.length === 0) return null
              return (
                <div key={level} className="nav-group">
                  <div className="nav-group-title">{level}</div>
                  {group.map((lesson) => (
                    <NavLink
                      key={lesson.id}
                      to={lesson.path}
                      className={({ isActive }) =>
                        navLinkClass(isActive, getProgress(lesson.id)?.read ?? false)
                      }
                      title={lesson.title}
                      onClick={closeMobile}
                    >
                      <span className="nav-icon">{lesson.icon}</span>
                      <span className="nav-label">{lesson.title}</span>
                    </NavLink>
                  ))}
                </div>
              )
            })
          ) : (
            groups.map((group) => {
              const items = lessons.filter((l) => l.group === group.id)
              if (items.length === 0) return null
              // When the rail is collapsed to icons, always show the lessons so
              // every chapter icon stays reachable.
              const open =
                collapsed || !closedGroups[group.id] || activeLesson?.group === group.id
              return (
                <div
                  key={group.id}
                  className={`nav-group nav-group--collapsible${open ? ' nav-group--open' : ''}`}
                >
                  <button
                    type="button"
                    className="nav-group-toggle"
                    aria-expanded={open}
                    onClick={() => toggleGroup(group.id)}
                    title={group.title}
                  >
                    <span className="nav-icon" aria-hidden>{group.icon}</span>
                    <span className="nav-group-toggle-title nav-label">{group.title}</span>
                    <span className="nav-group-caret nav-label" aria-hidden>{open ? '▾' : '▸'}</span>
                  </button>
                  {open &&
                    items.map((lesson) => (
                      <NavLink
                        key={lesson.id}
                        to={lesson.path}
                        className={({ isActive }) =>
                          navLinkClass(isActive, getProgress(lesson.id)?.read ?? false, 'nav-link nav-link--child')
                        }
                        title={lesson.title}
                        onClick={closeMobile}
                      >
                        <span className="nav-icon">{lesson.icon}</span>
                        <span className="nav-label">{lesson.title}</span>
                      </NavLink>
                    ))}
                </div>
              )
            })
          )}
        </nav>

        <div className="theme-picker">
          <label className="theme-picker-label nav-label" htmlFor="theme-select">
            Theme
          </label>
          <div className="theme-select-wrap">
            <span
              className="theme-select-swatch"
              style={{ background: THEMES.find((t) => t.id === theme)?.swatch }}
              aria-hidden
            />
            <select
              id="theme-select"
              className="theme-select"
              value={theme}
              onChange={(e) => setTheme(e.target.value as ThemeId)}
              aria-label="Color theme"
              title={THEMES.find((t) => t.id === theme)?.label}
            >
              <optgroup label="Dark">
                {THEMES.filter((t) => t.mode === 'dark').map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Light">
                {THEMES.filter((t) => t.mode === 'light').map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        <div className="sidebar-footer">
          <button className="feedback-btn" onClick={() => setFeedbackOpen(true)}>
            <span className="nav-icon">💬</span>
            <span className="nav-label">Request / feedback</span>
          </button>
          <a href="https://github.com/manishsharma004/developer-basics" target="_blank" rel="noreferrer">
            <span className="nav-icon">↗</span>
            <span className="nav-label">View source</span>
          </a>
        </div>
      </aside>

      <main className="content">
        {teacher && <div className="mode-ribbon">🧑‍🏫 Teacher mode — lesson plans &amp; teaching notes</div>}
        <Routes>
          <Route path="/" element={teacher ? <TeacherHome /> : <Home />} />
          {lessons.map(({ id, path, Component }) => (
            <Route key={id} path={path} element={teacher ? <LessonPlan id={id} /> : <Component />} />
          ))}
          <Route path="*" element={teacher ? <TeacherHome /> : <Home />} />
        </Routes>
      </main>

      {feedbackOpen && <FeedbackDialog onClose={() => setFeedbackOpen(false)} />}
      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </div>
  )
}

export default App
