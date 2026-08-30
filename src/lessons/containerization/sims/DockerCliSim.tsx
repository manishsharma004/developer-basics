import { useCallback, useState, type FormEvent } from 'react'

type Container = {
  id: string
  name: string
  image: string
  status: 'running' | 'stopped' | 'exited'
  ports: string
  logs: string[]
}

export function DockerCliSim() {
  const [imageBuilt, setImageBuilt] = useState(false)
  const [containers, setContainers] = useState<Container[]>([])
  const [volume, setVolume] = useState('my-data')
  const [cmd, setCmd] = useState('')
  const [output, setOutput] = useState<string[]>(['$ docker --help'])
  const [nextId, setNextId] = useState(1)

  const run = useCallback(
    (line: string) => {
      const trimmed = line.trim()
      if (!trimmed) return
      setOutput((o) => [...o, `$ ${trimmed}`])

      const parts = trimmed.split(/\s+/)
      const sub = parts[1]

      if (parts[0] !== 'docker') {
        setOutput((o) => [...o, 'docker: command simulation only supports docker subcommands'])
        return
      }

      if (sub === 'build') {
        setImageBuilt(true)
        setOutput((o) => [...o, 'Successfully tagged myapp:1.0'])
        return
      }
      if (sub === 'run') {
        if (!imageBuilt) {
          setOutput((o) => [...o, 'Error: image myapp:1.0 not found — run docker build first'])
          return
        }
        const id = `c${nextId}`
        const name = parts.includes('--name') ? parts[parts.indexOf('--name') + 1] : id
        setNextId((n) => n + 1)
        setContainers((c) => [
          ...c,
          {
            id,
            name,
            image: 'myapp:1.0',
            status: 'running',
            ports: '8080→80',
            logs: [`[${name}] listening on :80`, `volume mounted: ${volume}`],
          },
        ])
        setOutput((o) => [...o, id])
        return
      }
      if (sub === 'ps') {
        const rows = containers.map((c) => `${c.id}\t${c.image}\t${c.ports}\t${c.status}`)
        setOutput((o) => [...o, rows.length ? rows.join('\n') : '(no containers)'])
        return
      }
      if (sub === 'stop' && parts[2]) {
        setContainers((c) => c.map((x) => (x.id === parts[2] ? { ...x, status: 'stopped' } : x)))
        setOutput((o) => [...o, parts[2]])
        return
      }
      if (sub === 'rm' && parts[2]) {
        setContainers((c) => c.filter((x) => x.id !== parts[2]))
        setOutput((o) => [...o, parts[2]])
        return
      }
      if (sub === 'logs' && parts[2]) {
        const c = containers.find((x) => x.id === parts[2])
        setOutput((o) => [...o, c ? c.logs.join('\n') : 'No such container'])
        return
      }
      setOutput((o) => [...o, `Unknown: ${trimmed}`])
    },
    [containers, imageBuilt, nextId, volume],
  )

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    run(cmd)
    setCmd('')
  }

  return (
    <div className="panel">
      <div className="panel-title">Docker CLI simulator</div>
      <p className="panel-hint">
        Try: <code>docker build -t myapp:1.0 .</code>, <code>docker run --name web myapp:1.0</code>,{' '}
        <code>docker ps</code>, <code>docker logs c1</code>, <code>docker stop c1</code>
      </p>
      <label className="modal-field">
        <span>Volume</span>
        <input value={volume} onChange={(e) => setVolume(e.target.value)} />
      </label>
      <form onSubmit={onSubmit} className="ref-run-row">
        <input
          className="modal-field input"
          style={{ flex: 1 }}
          value={cmd}
          onChange={(e) => setCmd(e.target.value)}
          placeholder="docker build -t myapp:1.0 ."
          spellCheck={false}
        />
        <button type="submit" className="btn">
          Run
        </button>
      </form>
      <pre className="terminal-output">{output.join('\n')}</pre>
      <div className="metrics-table-wrap">
        <table className="metrics-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Image</th>
              <th>Ports</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {containers.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.name}</td>
                <td>{c.image}</td>
                <td>{c.ports}</td>
                <td>{c.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
