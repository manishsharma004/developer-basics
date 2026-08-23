import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { CommitGraph } from './CommitGraph.tsx'
import { ConflictSimulator } from './ConflictSimulator.tsx'

export default function GitAdvancedLesson() {
  return (
    <Lesson id="git-advanced">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Solo learners hit walls at merge conflicts, rebases, and pull requests.
          These workflows are how real teams integrate work safely.
        </p>
        <Callout kind="why" title="The one idea">
          Conflicts mean Git couldn't auto-merge — you choose the correct combined
          result, then continue the merge or rebase.
        </Callout>
      </Section>

      <Section id="conflicts" title="Merge conflicts">
        <p className="prose">
          When two branches edit the same lines, Git inserts conflict markers. You edit
          the file, remove markers, <code>git add</code>, then <code>git commit</code>{' '}
          (merge) or <code>git rebase --continue</code>.
        </p>
        <ConflictSimulator />
      </Section>

      <Section id="rebase" title="Rebase vs merge">
        <p className="prose">
          <strong>Rebase</strong> replays your commits on top of updated main for a linear
          history. <strong>Merge</strong> preserves the branch topology. Use rebase on
          feature branches before opening a PR; never rebase public shared branches casually.
        </p>
        <CommitGraph />
        <TryThis>
          Create a feature branch, commit, checkout main, commit again, then merge feature —
          compare with the basic Git lesson flow.
        </TryThis>
      </Section>

      <Section id="pr" title="Pull request workflow">
        <ul className="prose-list">
          <li>Push your branch and open a PR against <code>main</code>.</li>
          <li>CI runs tests; reviewers leave comments.</li>
          <li>Keep branch updated: <code>git fetch && git rebase origin/main</code>.</li>
          <li>Merge when green — squash or merge commit per team policy.</li>
        </ul>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms terms={[
          { term: 'conflict marker', def: '<<<<<<< / ======= / >>>>>>> blocks showing competing edits.' },
          { term: 'pull request', def: 'Request to merge a branch after review and CI.' },
          { term: 'force-push', def: 'Overwrites remote history — dangerous on shared branches.' },
        ]} />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz questions={[
          { q: 'After resolving conflicts you should:', options: ['git push --force immediately', 'git add && continue merge/rebase', 'Delete the repo', 'git reset --hard'], answer: 1 },
          { q: 'Rebase rewrites:', options: ['Remote server IP', 'Commit ids by replaying patches', 'File permissions only', 'Nothing'], answer: 1 },
        ]} />
      </Section>

      <Section id="recap" title="Recap">
        <Recap items={[
          <>Conflicts are normal — resolve markers, then continue.</>,
          <>PRs add review + CI before merging to main.</>,
        ]} />
      </Section>
    </Lesson>
  )
}
