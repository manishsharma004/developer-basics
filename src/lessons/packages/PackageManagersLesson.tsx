import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SemverPlayground } from './SemverPlayground.tsx'

export default function PackageManagersLesson() {
  return (
    <Lesson id="package-managers">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Every project depends on libraries. Package managers (npm, pip, bun) download
          them, resolve versions, and write lockfiles so teammates get the same tree.
        </p>
        <Callout kind="why" title="The one idea">
          <code>package.json</code> declares <em>ranges</em>; the <strong>lockfile</strong>{' '}
          pins the exact versions that were resolved.
        </Callout>
      </Section>

      <Section id="model" title="How installs work">
        <ul className="prose-list">
          <li><strong>Registry</strong> — npm, PyPI, etc. host published packages.</li>
          <li><strong>Semantic versioning</strong> — MAJOR.MINOR.PATCH; ranges use <code>^</code> and <code>~</code>.</li>
          <li><strong>Transitive deps</strong> — your deps have their own deps (A → B → C).</li>
          <li><strong>node_modules</strong> — flat/nested folder where installed packages live.</li>
        </ul>
      </Section>

      <Section id="playground" title="Try semver ranges">
        <SemverPlayground />
        <TryThis>
          Set range <code>^1.2.0</code> and try version <code>2.0.0</code> vs <code>1.9.0</code>.
          Toggle the lockfile checkbox and discuss reproducible CI builds.
        </TryThis>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms terms={[
          { term: 'semver', def: 'Versioning scheme: breaking.feature.fix.' },
          { term: 'lockfile', def: 'File recording exact resolved versions for reproducible installs.' },
          { term: 'transitive dependency', def: 'A dependency of your dependency.' },
        ]} />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz questions={[
          { q: 'What does ^1.2.0 allow?', options: ['Only 1.2.0', '1.x.x where x≥2', 'Any version', 'Only patches on 1.2'], answer: 1 },
          { q: 'Why commit the lockfile?', options: ['Smaller repo', 'Same installs on every machine', 'Faster git', 'Required by law'], answer: 1 },
        ]} />
      </Section>

      <Section id="recap" title="Recap">
        <Recap items={[
          <>Ranges in manifest files; lockfiles pin exact trees.</>,
          <>Understand ^ vs ~ before debugging version conflicts.</>,
        ]} />
      </Section>
    </Lesson>
  )
}
