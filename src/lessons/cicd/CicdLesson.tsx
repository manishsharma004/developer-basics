import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { PipelineSimulator } from './PipelineSimulator.tsx'

export default function CicdLesson() {
  return (
    <Lesson id="cicd">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Teams ship dozens of times a day by automating checks on every change.{' '}
          <strong>CI/CD</strong> (continuous integration / continuous delivery)
          runs lint, tests, and builds in a clean environment so broken code is
          caught before users see it.
        </p>
        <Callout kind="why" title="The one idea">
          Push code → automated pipeline runs → green means safe to merge or
          deploy; red means stop and fix.
        </Callout>
      </Section>

      <Section id="model" title="Pipeline stages">
        <ul className="prose-list">
          <li>
            <strong>Lint / format</strong> — style and obvious bugs (unused vars,
            type errors).
          </li>
          <li>
            <strong>Test</strong> — unit and integration tests prove behavior.
          </li>
          <li>
            <strong>Build</strong> — compile or bundle artifacts (
            <code>dist/</code>, Docker image).
          </li>
          <li>
            <strong>Deploy</strong> — promote the artifact to staging or
            production (often manual approval for prod).
          </li>
        </ul>
        <Callout kind="note">
          This repo’s GitHub Actions workflow lints, builds, and publishes to
          Pages on every push to <code>main</code>.
        </Callout>
      </Section>

      <Section id="playground" title="Run a pipeline">
        <p className="prose">
          Drive a four-stage pipeline. Toggle “fail” on a stage and watch later
          stages never run — that is the safety gate CI provides.
        </p>
        <PipelineSimulator />
        <TryThis>
          Fail <strong>Test</strong> and run the pipeline — notice{' '}
          <strong>Build</strong> and <strong>Deploy</strong> are skipped. Then
          clear all failures and run again for a green path.
        </TryThis>
      </Section>

      <Section id="workflow" title="CI vs CD">
        <p className="prose">
          <strong>CI</strong> integrates every change with the main branch by
          building and testing automatically. <strong>CD</strong> extends that
          to delivery: deploy artifacts that passed CI. Some teams stop at CI;
          others deploy to production on every green main build.
        </p>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Clean runners">
          <p className="prose">
            CI jobs start on fresh VMs or containers with a known toolchain. “Works
            on my machine” fails when dependencies or env vars differ — CI exposes
            that early.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Branch protection">
          <p className="prose">
            Git hosting can require a green CI check before merge. That turns the
            pipeline from advice into an enforced gate.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'CI', def: 'Automated build and test on every change.' },
            { term: 'CD', def: 'Automated delivery/deploy of artifacts that passed CI.' },
            { term: 'pipeline', def: 'Ordered stages (lint → test → build → deploy).' },
            { term: 'artifact', def: 'Build output stored for later deploy (binary, image, site).' },
            { term: 'runner', def: 'The machine executing a CI job.' },
            { term: 'branch protection', def: 'Rules requiring reviews or green CI before merge.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'If tests fail in CI, what should happen to deploy?',
              options: ['Deploy anyway', 'Deploy is blocked', 'Only lint reruns', 'Tests are ignored'],
              answer: 1,
              explain: 'A failing stage stops the pipeline — broken code should not ship.',
            },
            {
              q: 'Main benefit of CI over manual testing?',
              options: [
                'Slower feedback',
                'Same environment every run, on every push',
                'No need for tests',
                'Replaces code review',
              ],
              answer: 1,
              explain: 'Repeatable automated checks catch regressions quickly.',
            },
            {
              q: 'Where is this repo’s CI defined?',
              options: [
                'package.json only',
                '.github/workflows/',
                'README.md',
                '.cursor/environment.json',
              ],
              answer: 1,
              explain: 'GitHub Actions workflows live under .github/workflows/.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>CI runs lint, test, and build automatically on each change.</>,
            <>First failure stops the pipeline — fix locally, push again.</>,
            <>CD deploys artifacts that passed CI; protect main with required checks.</>,
            <>Clean runners expose missing deps and env assumptions early.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}
