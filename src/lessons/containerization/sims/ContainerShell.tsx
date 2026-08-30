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
      <div className="container-shell-welcome panel-hint">
        <p>
          <strong>Containerization lab ready</strong> — shell starts in <code>~/lab</code> with a
          sample app, <code>Dockerfile</code>, and simulated <code>docker</code> / <code>kubectl</code>{' '}
          CLIs.
        </p>
        <p>
          Try: <code>{hint}</code>
        </p>
      </div>
      <p className="panel-hint container-shell-hint">
        Run <code>ls</code> and <code>cat Dockerfile</code>, then <code>docker build -t myapp:1.0 .</code>{' '}
        before <code>docker run</code>. At the <code>bash-dist#</code> prompt, commands behave like a real
        workstation.
      </p>
      <WasmerShell fallback={fallback} />
    </div>
  )
}

export { DEFAULT_HINT as CONTAINER_SHELL_HINT }
