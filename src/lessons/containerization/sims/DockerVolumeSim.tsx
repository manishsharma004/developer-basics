import { useState } from 'react'

export function DockerVolumeSim() {
  const [mount, setMount] = useState<'none' | 'volume' | 'bind'>('volume')
  const [data, setData] = useState('user-upload-1.db')
  const [containerAlive, setContainerAlive] = useState(true)

  const hostData = mount === 'none' ? '(lost on rm)' : data

  return (
    <div className="panel">
      <div className="panel-title">Ephemeral FS vs volumes</div>
      <div className="ref-run-row">
        {(['none', 'volume', 'bind'] as const).map((m) => (
          <button
            key={m}
            type="button"
            className={`btn ${mount === m ? '' : 'btn--ghost'}`}
            onClick={() => setMount(m)}
          >
            {m === 'none' ? 'No volume' : m === 'volume' ? 'Named volume' : 'Bind mount'}
          </button>
        ))}
      </div>
      <label className="modal-field">
        <span>Write to /data/app.db</span>
        <input value={data} onChange={(e) => setData(e.target.value)} />
      </label>
      <div className="ref-run-row">
        <button type="button" className="btn" onClick={() => setContainerAlive(true)}>
          docker run
        </button>
        <button type="button" className="btn btn--ghost" onClick={() => setContainerAlive(false)}>
          docker rm -f
        </button>
      </div>
      <pre className="terminal-output">
        {containerAlive
          ? `Container running — /data/app.db = "${data}"`
          : `Container removed.\nHost ${mount === 'none' ? 'has no copy' : `still has: "${hostData}"`}`}
      </pre>
    </div>
  )
}
