import { useEffect, useId, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { useTheme } from '../theme/ThemeContext.tsx'
import { THEMES } from '../theme/themes.ts'

export interface MermaidNodeMeta {
  label: string
  description: string
}

export interface MermaidDiagramProps {
  code: string
  title?: string
  caption?: string
  activeNodes?: string[]
  selectedNode?: string | null
  nodeMeta?: Record<string, MermaidNodeMeta>
  onNodeClick?: (nodeId: string) => void
  className?: string
}

let mermaidInitialized = false

function initMermaid(theme: 'default' | 'dark') {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    theme,
    flowchart: { htmlLabels: true, curve: 'basis' },
  })
  mermaidInitialized = true
}

function findNodeGroup(svgRoot: SVGSVGElement, nodeId: string): SVGGElement | null {
  const byId = svgRoot.querySelector(`#${CSS.escape(nodeId)}`)
  if (byId instanceof SVGGElement) return byId
  const flow = svgRoot.querySelector(`[id^="flowchart-${nodeId}-"]`)
  if (flow instanceof SVGGElement) return flow
  const loose = svgRoot.querySelector(`[id*="-${nodeId}-"]`)
  return loose instanceof SVGGElement ? loose : null
}

export function MermaidDiagram({
  code,
  title,
  caption,
  activeNodes = [],
  selectedNode = null,
  nodeMeta,
  onNodeClick,
  className,
}: MermaidDiagramProps) {
  const { resolvedTheme } = useTheme()
  const mode = THEMES.find((t) => t.id === resolvedTheme)?.mode ?? 'dark'
  const mermaidTheme = mode === 'light' ? 'default' : 'dark'
  const baseId = useId().replace(/:/g, '')
  const hostRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mermaidInitialized) initMermaid(mermaidTheme)
    else initMermaid(mermaidTheme)

    let cancelled = false
    ;(async () => {
      try {
        const { svg: rendered } = await mermaid.render(`mm-${baseId}-${Date.now()}`, code.trim())
        if (!cancelled) {
          setSvg(rendered)
          setError(null)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err))
          setSvg('')
        }
      }
    })()

    return () => {
      cancelled = true
    }
  }, [code, mermaidTheme, baseId])

  useEffect(() => {
    const host = hostRef.current
    if (!host || !svg) return

    const svgEl = host.querySelector('svg')
    if (!(svgEl instanceof SVGSVGElement)) return

    const cleanups: (() => void)[] = []

    const allNodeIds = new Set([
      ...Object.keys(nodeMeta ?? {}),
      ...activeNodes,
      ...(selectedNode ? [selectedNode] : []),
    ])

    for (const nodeId of allNodeIds) {
      const group = findNodeGroup(svgEl, nodeId)
      if (!group) continue

      group.classList.remove('mermaid-node--active', 'mermaid-node--selected')
      if (activeNodes.includes(nodeId)) group.classList.add('mermaid-node--active')
      if (selectedNode === nodeId) group.classList.add('mermaid-node--selected')

      if (onNodeClick) {
        group.style.cursor = 'pointer'
        const handler = () => onNodeClick(nodeId)
        group.addEventListener('click', handler)
        cleanups.push(() => group.removeEventListener('click', handler))
      }
    }

    return () => cleanups.forEach((fn) => fn())
  }, [svg, activeNodes, selectedNode, nodeMeta, onNodeClick])

  const detail =
    selectedNode && nodeMeta?.[selectedNode]
      ? nodeMeta[selectedNode]
      : activeNodes.length === 1 && nodeMeta?.[activeNodes[0]!]
        ? nodeMeta[activeNodes[0]!]
        : null

  return (
    <figure className={`mermaid-diagram${className ? ` ${className}` : ''}`}>
      {title && <figcaption className="mermaid-diagram-title">{title}</figcaption>}
      {caption && <p className="mermaid-diagram-caption">{caption}</p>}
      <div
        ref={hostRef}
        className="mermaid-diagram-output"
        dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
      />
      {error && (
        <pre className="term-output mermaid-diagram-fallback">{error}{'\n\n'}{code}</pre>
      )}
      {detail && (
        <div className="mermaid-diagram-detail">
          <strong>{detail.label}</strong>
          <p>{detail.description}</p>
        </div>
      )}
      {onNodeClick && nodeMeta && Object.keys(nodeMeta).length > 0 && !detail && (
        <p className="panel-hint mermaid-diagram-hint">Click a node in the diagram to learn what it does.</p>
      )}
    </figure>
  )
}
