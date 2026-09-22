import { useEffect, useRef, useState } from 'react'
import { MonacoEditor } from '../../components/MonacoEditor.tsx'
import { RuntimeBanner } from '../../components/RuntimeBanner.tsx'
import { RUNNER_PROGRAM } from '../../lib/pyRunner.ts'
import { usePyodide } from '../../lib/usePyodide.ts'
import { runKafkaJavaScript } from './kafkaJsRunner.ts'
import { KAFKA_PYTHON_LIB } from './kafkaPyLib.ts'
import { registerKafkaPyodideBridge } from './kafkaPyodideBridge.ts'
import { subscribeKafkaLab } from './kafkaLabEngine.ts'

export type KafkaSnippet = { label: string; code: string; lang: 'python' | 'javascript' }

type PyCallable = (...args: unknown[]) => unknown

const DEFAULT_SNIPPETS: KafkaSnippet[] = [
  {
    label: 'Produce (Python)',
    lang: 'python',
    code: `from kafka_mini import KafkaProducer, DEFAULT_TOPIC

producer = KafkaProducer()
rec = producer.send(DEFAULT_TOPIC, value="hello from python", key="user-1")
print(rec)
producer.flush()`,
  },
  {
    label: 'Consume (Python)',
    lang: 'python',
    code: `from kafka_mini import KafkaConsumer, DEFAULT_TOPIC

consumer = KafkaConsumer(DEFAULT_TOPIC, group_id="python-lab")
for msg in consumer.poll(max_records=5):
    print(f"p{msg.partition}@{msg.offset}", msg.key, "->", msg.value)`,
  },
  {
    label: 'Produce (JavaScript)',
    lang: 'javascript',
    code: `const producer = new KafkaProducer({ client_id: "js-lab" });
const rec = producer.send(LAB_TOPIC, "hello from javascript", "user-2");
console.log(rec);
producer.flush();`,
  },
  {
    label: 'Consume (JavaScript)',
    lang: 'javascript',
    code: `const consumer = new KafkaConsumer({ group_id: "js-lab", topic: LAB_TOPIC });
const batch = consumer.poll(5);
for (const msg of batch) {
  console.log(\`p\${msg.partition}@\${msg.offset}\`, msg.key, "->", msg.value);
}`,
  },
]

export function KafkaCodeLab({ snippets = DEFAULT_SNIPPETS }: { snippets?: KafkaSnippet[] }) {
  const { pyodide, phase, message, error, retry, skip, skipped } = usePyodide()
  const [lang, setLang] = useState<'python' | 'javascript'>('python')
  const [pyReady, setPyReady] = useState(false)
  const [code, setCode] = useState(snippets[0].code)
  const [output, setOutput] = useState('')
  const runRef = useRef<PyCallable | null>(null)
  const [, bump] = useState(0)

  useEffect(() => subscribeKafkaLab(() => bump((n) => n + 1)), [])

  useEffect(() => {
    if (!pyodide) return
    let cancelled = false
    void (async () => {
      registerKafkaPyodideBridge(pyodide)
      await pyodide.runPythonAsync(KAFKA_PYTHON_LIB)
      if (cancelled) return
      await pyodide.runPythonAsync(RUNNER_PROGRAM)
      if (cancelled) return
      runRef.current = pyodide.globals.get('run_snippet') as PyCallable
      setPyReady(true)
    })()
    return () => {
      cancelled = true
    }
  }, [pyodide])

  const pickSnippet = (s: KafkaSnippet) => {
    setLang(s.lang)
    setCode(s.code)
    setOutput('')
  }

  const run = () => {
    if (lang === 'javascript') {
      setOutput(runKafkaJavaScript(code))
      return
    }
    if (!runRef.current) return
    setOutput((runRef.current(code) as string) || '(no output)')
  }

  const isTraceback = output.includes('Traceback (most recent call last)')
  const filtered = snippets.filter((s) => s.lang === lang)

  useEffect(() => {
    const first = snippets.find((s) => s.lang === lang)
    if (first) setCode(first.code)
    setOutput('')
  }, [lang, snippets])

  const ready = lang === 'javascript' || pyReady

  return (
    <>
      <p className="prose kafka-code-lab-intro">
        Write <strong>Python</strong> (<code>kafka_mini</code>, kafka-python style) or <strong>JavaScript</strong>{' '}
        (<code>KafkaProducer</code> / <code>KafkaConsumer</code>) — same in-browser log as the topic view above.
      </p>

      <div className="kafka-code-lang">
        <button
          type="button"
          className={`chip${lang === 'python' ? ' chip--active' : ''}`}
          onClick={() => setLang('python')}
        >
          Python
        </button>
        <button
          type="button"
          className={`chip${lang === 'javascript' ? ' chip--active' : ''}`}
          onClick={() => setLang('javascript')}
        >
          JavaScript
        </button>
      </div>

      {lang === 'python' && (
        <RuntimeBanner
          phase={phase}
          message={message}
          error={error}
          onRetry={retry}
          onSkip={skip}
          skipped={skipped}
        />
      )}

      {(!skipped || lang === 'javascript') && (
        <div className="panel">
          <div className="ref-snippets">
            {filtered.map((s) => (
              <button key={s.label} type="button" className="chip" onClick={() => pickSnippet(s)}>
                {s.label}
              </button>
            ))}
          </div>
          <MonacoEditor
            value={code}
            onChange={setCode}
            language={lang === 'python' ? 'python' : 'javascript'}
            minLines={8}
            ariaLabel={lang === 'python' ? 'Python Kafka code' : 'JavaScript Kafka code'}
          />
          <div className="ref-run-row">
            <button type="button" className="btn" disabled={!ready} onClick={run}>
              {ready ? '▶ Run' : 'starting Python…'}
            </button>
          </div>
          {output && (
            <pre className={`term-output${isTraceback ? ' error-trace' : ''}`}>{output}</pre>
          )}
        </div>
      )}
    </>
  )
}
