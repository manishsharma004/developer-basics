import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { CommitGraph } from './CommitGraph.tsx'

export default function GitLesson() {
  return (
    <Lesson id="git">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Version control is how teams change code together without chaos. Git — by
          far the most common — lets you record history, try ideas on branches, and
          combine work with merges. Once you picture what Git is actually doing, its
          commands stop feeling like magic incantations.
        </p>
        <Callout kind="why" title="The one idea">
          A Git history is a <strong>graph of snapshots</strong>. Each commit points
          to its parent(s); a branch is just a movable label pointing at a commit.
        </Callout>
      </Section>

      <Section id="model" title="Commits & branches">
        <p className="prose">
          Three concepts do most of the work:
        </p>
        <ul className="prose-list">
          <li><strong>Commit</strong> — a snapshot of your project plus a link to the commit(s) it came from.</li>
          <li><strong>Branch</strong> — a lightweight, movable pointer to a commit. Making a branch is cheap.</li>
          <li><strong>HEAD</strong> — where you are now; the branch your next commit will extend.</li>
        </ul>
        <Callout kind="note">
          Because a branch is just a pointer, "creating a branch" doesn't copy your
          files — it only writes down a commit id. That's why branching is instant.
        </Callout>
      </Section>

      <Section id="playground" title="Build a history">
        <p className="prose">
          Construct a small project history. Commit on <code>main</code>, branch off
          to try something, commit there, then merge it back — and watch the graph
          take shape.
        </p>
        <CommitGraph />
        <TryThis>
          Make a couple of commits on <code>main</code>. Create a branch{' '}
          <code>feature</code> and commit on it. Then <em>checkout</em>{' '}
          <code>main</code> and <em>merge</em> <code>feature</code> in — notice the
          merge commit has <strong>two parents</strong>, tying the histories together.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Commits are content-addressed snapshots">
          <p className="prose">
            Each commit is identified by a hash of its content (the snapshot plus
            metadata and parent ids). Change anything and the id changes. This is
            why history is tamper-evident and why the same commit has the same id on
            every clone.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Merge vs. rebase">
          <p className="prose">
            A <strong>merge</strong> joins two branches with a new commit that has
            two parents, preserving exactly what happened. A <strong>rebase</strong>{' '}
            instead re-applies your commits on top of another branch, producing a
            straight line of history (at the cost of rewriting commit ids). Merge
            preserves history; rebase tidies it.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'commit', def: 'A snapshot of the project plus links to its parent commit(s).' },
            { term: 'branch', def: 'A movable pointer to a commit; cheap to create.' },
            { term: 'HEAD', def: 'Your current position — the branch your next commit extends.' },
            { term: 'merge', def: 'Combining branches with a new commit that has two parents.' },
            { term: 'rebase', def: 'Re-applying commits onto another base for a linear history.' },
            { term: 'hash / commit id', def: "A commit's content-derived identifier." },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'What is a Git branch, really?',
              options: [
                'A full copy of all your files',
                'A movable pointer to a commit',
                'A backup server',
                'A folder',
              ],
              answer: 1,
              explain: 'A branch is just a named pointer to a commit, which is why branching is instant.',
            },
            {
              q: 'How many parents does a typical merge commit have?',
              options: ['0', '1', '2', 'unlimited'],
              answer: 2,
              explain: 'A merge commit ties two histories together, so it has two parents.',
            },
            {
              q: 'What mainly distinguishes rebase from merge?',
              options: [
                'Rebase deletes history',
                'Rebase re-applies commits for a linear history; merge keeps both lines with a merge commit',
                'They are identical',
                'Merge is only for remote branches',
              ],
              answer: 1,
              explain: 'Merge preserves the branching shape; rebase rewrites commits onto a new base for a straight line.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Git history is a <strong>graph of commits</strong>, each pointing at its parent(s).</>,
            <>A <strong>branch</strong> is a movable pointer; <strong>HEAD</strong> is where you are.</>,
            <>A <strong>merge</strong> joins branches with a two-parent commit.</>,
            <>Commits are identified by a content hash, making history tamper-evident.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}
