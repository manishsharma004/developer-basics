import { useCallback, useRef, useState } from 'react'

export interface FlowStep {
  nodes: string[]
  message: string
  delay?: number
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms))

export function useFlowAnimation() {
  const [stepIndex, setStepIndex] = useState(-1)
  const [running, setRunning] = useState(false)
  const [log, setLog] = useState<string[]>([])
  const runToken = useRef(0)

  const reset = useCallback(() => {
    runToken.current += 1
    setStepIndex(-1)
    setRunning(false)
    setLog([])
  }, [])

  const runSteps = useCallback(async (steps: FlowStep[]) => {
    const token = ++runToken.current
    setRunning(true)
    setStepIndex(-1)
    setLog([])

    for (let i = 0; i < steps.length; i++) {
      if (runToken.current !== token) return
      const step = steps[i]!
      setStepIndex(i)
      setLog((entries) => [...entries, step.message])
      await sleep(step.delay ?? 650)
    }

    if (runToken.current !== token) return
    setRunning(false)
  }, [])

  const activeNodes = (steps: FlowStep[]) =>
    stepIndex >= 0 && stepIndex < steps.length ? steps[stepIndex]!.nodes : []

  return { stepIndex, running, log, reset, runSteps, activeNodes }
}
