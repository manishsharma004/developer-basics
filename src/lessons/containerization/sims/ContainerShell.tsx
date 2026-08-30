import type { ReactNode } from 'react'
import { WasmerShell } from './WasmerShell.tsx'

type ContainerShellProps = {
  /** Built-in React simulator shown while loading or when Wasmer is unavailable. */
  fallback?: ReactNode
  /** Short hint for TryThis blocks — defaults to full toolkit commands. */
  hint?: string
}

const DEFAULT_HINT =
  'docker build -t myapp:1.0 ., docker compose up -d, kubectl get pods'

export function ContainerShell({ fallback, hint = DEFAULT_HINT }: ContainerShellProps) {
  return (
    <div className="container-shell">
      <p className="panel-hint container-shell-hint">
        Simulated CLIs in bash when isolated: <code>{hint}</code>
        {' '}At the <code>bash-dist#</code> prompt, run{' '}
        <code>source /opt/lab/lab-bashrc</code> once to enable <code>docker</code> and{' '}
        <code>kubectl</code> shortcuts.
      </p>
      <WasmerShell fallback={fallback} />
    </div>
  )
}

export { DEFAULT_HINT as CONTAINER_SHELL_HINT }
