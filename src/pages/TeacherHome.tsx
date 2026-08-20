import { Link } from 'react-router-dom'
import { lessons } from '../lessons/index.tsx'
import { teacherGuides } from '../experience/teacherGuides.ts'
import type { Level } from '../lessons/meta.ts'

const LEVELS: Level[] = ['Beginner', 'Intermediate', 'Advanced']

function Home() {
  const totalMinutes = lessons.reduce((s, l) => s + l.minutes, 0)

  return (
    <div className="page">
      <header className="page-header">
        <h1>Teacher Curriculum</h1>
        <p className="lead">
          A ready-to-teach course in developer fundamentals — {lessons.length} lessons
          (~{Math.round(totalMinutes / 60)} hours of material), each with an
          interactive lab, learning objectives, common misconceptions, discussion
          prompts, and assessment ideas. Every lesson below opens its lesson plan;
          use "Open the student lab" from any plan to demo the interactive version.
        </p>
      </header>

      <section className="teacher-tips">
        <div className="teacher-tip">
          <span className="teacher-tip-icon">🎯</span>
          <div><b>Teach the model first.</b> Lead with the "one idea", then let students explore the lab.</div>
        </div>
        <div className="teacher-tip">
          <span className="teacher-tip-icon">🧪</span>
          <div><b>Labs are real.</b> Filesystem, SQL, and Python labs run genuine code in the browser — no setup.</div>
        </div>
        <div className="teacher-tip">
          <span className="teacher-tip-icon">🗺️</span>
          <div><b>Sequence freely.</b> Beginner lessons are self-contained; Intermediate ones build on them.</div>
        </div>
      </section>

      {LEVELS.map((level) => {
        const group = lessons.filter((l) => l.level === level)
        if (group.length === 0) return null
        return (
          <section key={level} className="curriculum-group">
            <h2 className="curriculum-heading">{level}</h2>
            <table className="curriculum-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Lesson</th>
                  <th>Time</th>
                  <th>Objectives</th>
                  <th>Interactive lab</th>
                </tr>
              </thead>
              <tbody>
                {group.map((l) => {
                  const guide = teacherGuides[l.id]
                  return (
                    <tr key={l.id}>
                      <td className="ct-num">{String(lessons.indexOf(l) + 1).padStart(2, '0')}</td>
                      <td>
                        <Link to={l.path} className="ct-title">{l.icon} {l.title}</Link>
                        <div className="ct-tagline">{l.tagline}</div>
                      </td>
                      <td>{l.minutes} min</td>
                      <td>{guide ? guide.objectives.length : '—'}</td>
                      <td className="ct-lab">{guide ? guide.lab.split(':')[0].replace(/^Use the |^Run the |^Build /i, '') : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </section>
        )
      })}
    </div>
  )
}

export default Home
