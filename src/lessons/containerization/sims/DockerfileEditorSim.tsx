import { useState } from 'react'

const DEFAULT = `FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]`

export function DockerfileEditorSim() {
  const [dockerfile, setDockerfile] = useState(DEFAULT)
  const [result, setResult] = useState<string | null>(null)

  const validate = () => {
    const lines = dockerfile.split('\n').map((l) => l.trim()).filter(Boolean)
    const issues: string[] = []
    if (!lines.some((l) => l.startsWith('FROM'))) issues.push('Missing FROM instruction')
    if (!lines.some((l) => l.startsWith('CMD') || l.startsWith('ENTRYPOINT')))
      issues.push('Add CMD or ENTRYPOINT so the container knows what to run')
    const stages = lines.filter((l) => l.startsWith('FROM')).length
    setResult(
      issues.length
        ? `Issues:\n• ${issues.join('\n• ')}`
        : `Valid ${stages > 1 ? 'multi-stage ' : ''}Dockerfile (${lines.length} instructions). Build with docker build -t myapp .`,
    )
  }

  return (
    <div className="panel">
      <div className="panel-title">Dockerfile editor</div>
      <textarea
        className="code-input"
        rows={14}
        value={dockerfile}
        onChange={(e) => setDockerfile(e.target.value)}
        spellCheck={false}
      />
      <button type="button" className="btn" onClick={validate}>
        Validate &amp; simulate build
      </button>
      {result && <pre className="terminal-output">{result}</pre>}
    </div>
  )
}
