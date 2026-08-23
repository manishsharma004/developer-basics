import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { ConfigResolver } from './ConfigResolver.tsx'

export default function EnvConfigLesson() {
  return (
    <Lesson id="env-config">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Apps need different settings per environment: database URLs, API keys, ports.
          Environment variables and <code>.env</code> files are the standard pattern —
          but they're easy to misuse.
        </p>
        <Callout kind="warning" title="Never commit secrets">
          <code>.env</code> with real keys belongs in <code>.gitignore</code>. Use
          platform secrets in production (GitHub Actions secrets, Vercel env, etc.).
        </Callout>
      </Section>

      <Section id="model" title="The config model">
        <ul className="prose-list">
          <li><strong>12-factor config</strong> — store config in the environment, not in code.</li>
          <li><strong>Precedence</strong> — defaults &lt; file &lt; process env.</li>
          <li><strong>Build-time vs runtime</strong> — Vite exposes <code>VITE_*</code> at build; server secrets load at runtime.</li>
          <li><strong>Redaction</strong> — never log API keys or tokens.</li>
        </ul>
      </Section>

      <Section id="playground" title="Resolve config">
        <ConfigResolver />
        <TryThis>
          Toggle file and env overrides and watch PORT change. Turn on "Log secrets" and
          discuss why that's dangerous in production logs.
        </TryThis>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms terms={[
          { term: 'environment variable', def: 'Key/value pair set outside the app process (OS or platform).' },
          { term: '.env', def: 'Local file loader tools read for dev; not for committed secrets.' },
        ]} />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz questions={[
          { q: 'Where should production API keys live?', options: ['Committed .env', 'Platform secret store / env', 'Hard-coded in source', 'README'], answer: 1 },
          { q: 'If env PORT=5000 and .env PORT=4000, typical precedence gives:', options: ['4000', '5000', '3000', 'Random'], answer: 1 },
        ]} />
      </Section>

      <Section id="recap" title="Recap">
        <Recap items={[
          <>Config flows: defaults → file → environment.</>,
          <>Never commit secrets; redact them in logs.</>,
        ]} />
      </Section>
    </Lesson>
  )
}
