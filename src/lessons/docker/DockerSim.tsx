import { useState } from 'react'

type Container = { id: string; image: string; status: 'stopped' | 'running'; port: string }

export function DockerSim() {
  const [imageBuilt, setImageBuilt] = useState(false)
  const [containers, setContainers] = useState<Container[]>([])
  const [volume, setVolume] = useState('my-data')

  const build = () => {
    setImageBuilt(true)
  }

  const run = () => {
    if (!imageBuilt) return
    const id = `c${containers.length + 1}`
    setContainers((c) => [...c, { id, image: 'myapp:1.0', status: 'running', port: '8080→80' }])
  }

  const stop = (id: string) => {
    setContainers((c) => c.map((x) => (x.id === id ? { ...x, status: 'stopped' } : x)))
  }

  return (
    <div className="panel">
      <div className="panel-title">Docker workflow</div>
      <p className="panel-hint">
        Image = recipe (layers). Container = running instance. Volume = persistent data outside the container FS.
      </p>
      <div className="ref-run-row">
        <button type="button" className="btn" onClick={build}>docker build -t myapp:1.0 .</button>
        <button type="button" className="btn" disabled={!imageBuilt} onClick={run}>docker run -p 8080:80 -v {volume} myapp:1.0</button>
      </div>
      <label className="modal-field"><span>Volume name</span><input value={volume} onChange={(e) => setVolume(e.target.value)} /></label>
      <div className="metrics-table-wrap">
        <table className="metrics-table">
          <thead><tr><th>ID</th><th>Image</th><th>Ports</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {imageBuilt && (
              <tr><td colSpan={5}><em>Image myapp:1.0 ready (layers cached)</em></td></tr>
            )}
            {containers.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td><td>{c.image}</td><td>{c.port}</td><td>{c.status}</td>
                <td>{c.status === 'running' && <button type="button" className="btn btn--sm btn--ghost" onClick={() => stop(c.id)}>stop</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="panel-hint">Volume <code>{volume}</code> survives <code>docker rm</code> — data persists on the host.</p>
    </div>
  )
}
