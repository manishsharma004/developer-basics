import { useCallback, useState } from 'react'

type Pod = { name: string; status: string; node: string }
type Deploy = { name: string; replicas: number; ready: number }

const INITIAL_PODS: Pod[] = [
  { name: 'web-7d4f8-abc', status: 'Running', node: 'node-1' },
  { name: 'web-7d4f8-def', status: 'Running', node: 'node-2' },
  { name: 'api-9k2-x1', status: 'Running', node: 'node-1' },
]

const INITIAL_DEPLOYS: Deploy[] = [{ name: 'web', replicas: 2, ready: 2 }]

export function KubectlLab() {
  const [pods, setPods] = useState(INITIAL_PODS)
  const [deploys, setDeploys] = useState(INITIAL_DEPLOYS)
  const [cmd, setCmd] = useState('kubectl get pods')
  const [out, setOut] = useState<string[]>(['$ kubectl get pods'])

  const exec = useCallback(
    (line: string) => {
      setOut((o) => [...o, `$ ${line}`])
      const p = line.trim().split(/\s+/)
      if (p[0] !== 'kubectl') {
        setOut((o) => [...o, 'simulation: kubectl only'])
        return
      }
      if (p[1] === 'get' && p[2] === 'pods') {
        setOut((o) => [
          ...o,
          pods.map((x) => `${x.name}\t${x.status}\t${x.node}`).join('\n') || '(no pods)',
        ])
        return
      }
      if (p[1] === 'get' && p[2] === 'deploy') {
        setOut((o) => [
          ...o,
          deploys.map((d) => `${d.name}\t${d.ready}/${d.replicas}`).join('\n'),
        ])
        return
      }
      if (p[1] === 'scale' && p[2] === 'deploy' && p[4]) {
        const n = Number(p[4])
        const name = p[3]
        setDeploys((d) => d.map((x) => (x.name === name ? { ...x, replicas: n, ready: Math.min(x.ready, n) } : x)))
        setOut((o) => [...o, `deployment/${name} scaled`])
        return
      }
      if (p[1] === 'delete' && p[2] === 'pod' && p[3]) {
        setPods((ps) => ps.filter((x) => x.name !== p[3]))
        setOut((o) => [...o, `pod "${p[3]}" deleted`])
        return
      }
      if (p[1] === 'logs' && p[2]) {
        setOut((o) => [...o, `[${p[2]}] GET /health 200`])
        return
      }
      setOut((o) => [...o, 'unknown command — try: get pods, get deploy, scale deploy web --replicas=3'])
    },
    [deploys, pods],
  )

  return (
    <div className="panel">
      <div className="panel-title">kubectl simulator</div>
      <form
        className="ref-run-row"
        onSubmit={(e) => {
          e.preventDefault()
          exec(cmd)
          setCmd('')
        }}
      >
        <input className="modal-field input" style={{ flex: 1 }} value={cmd} onChange={(e) => setCmd(e.target.value)} spellCheck={false} />
        <button type="submit" className="btn">
          Run
        </button>
      </form>
      <pre className="terminal-output">{out.join('\n')}</pre>
    </div>
  )
}
