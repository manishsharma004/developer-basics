import type { ReactNode } from 'react'
import { ShellTerminal } from './ShellTerminal.tsx'

type ContainerShellProps = {
  /** Built-in React simulator shown while loading or when the shell is unavailable. */
  fallback?: ReactNode
  /** Short hint for TryThis blocks — defaults to full toolkit commands. */
  hint?: string
}

const DEFAULT_HINT =
  'podman build -t sample-img ., podman compose up -d, kubectl get pods'

export function ContainerShell({ fallback, hint = DEFAULT_HINT }: ContainerShellProps) {
  return (
    <div className="container-shell">
      <div className="container-shell-welcome panel-hint">
        <p>
          <strong>Containerization lab ready</strong> — shell starts in <code>~/lab</code> with a
          sample app, <code>Dockerfile</code>, and <code>podman</code> / <code>kubectl</code> CLIs.
        </p>
        <p>
          Try: <code>{hint}</code>
        </p>
      </div>
      <p className="panel-hint container-shell-hint">
        Run <code>ls</code> and <code>cat Dockerfile</code>, then{' '}
        <code>podman build -t sample-img .</code> before <code>podman run</code>. The v86 VM uses real
        Podman; <code>docker</code> is an alias. Build the VM image once with{' '}
        <code>bun run v86:build-image</code> (requires Docker).
      </p>
      <ShellTerminal fallback={fallback} />
    </div>
  )
}

export { DEFAULT_HINT as CONTAINER_SHELL_HINT }
