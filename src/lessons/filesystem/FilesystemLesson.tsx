import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { FilesystemPlayground } from './FilesystemPlayground.tsx'

export default function FilesystemLesson() {
  return (
    <Lesson id="filesystem">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Almost everything you do as a developer touches the filesystem: source
          files, config, logs, build artifacts, environment files, caches. If you
          understand how it's organized, a huge amount of day-to-day confusion —
          "where did that file go?", "why can't the app read this?", "what does
          <code> ./ </code> mean?" — simply disappears.
        </p>
        <Callout kind="why" title="The one idea">
          A filesystem is a <strong>tree</strong>. Every file and folder has a
          single path from the root <code>/</code> down to it. Master paths and
          permissions and you've mastered most of the filesystem.
        </Callout>
      </Section>

      <Section id="model" title="The mental model">
        <p className="prose">
          Directories (folders) contain files and other directories. That nesting
          forms a tree with one root, written <code>/</code>. A <em>path</em> is
          the route through that tree to a specific entry.
        </p>
        <ul className="prose-list">
          <li>
            <strong>Absolute path</strong> — starts at the root, e.g.
            <code> /home/dev/README.md</code>. Unambiguous from anywhere.
          </li>
          <li>
            <strong>Relative path</strong> — starts from your{' '}
            <em>current working directory</em>, e.g. <code>projects/webapp</code>.
            <code> .</code> means "here" and <code>..</code> means "one level up".
          </li>
          <li>
            <strong>Permissions</strong> — every entry records who may read (
            <code>r</code>), write (<code>w</code>), or execute (<code>x</code>) it.
          </li>
        </ul>
        <Callout kind="tip">
          The prompt in the playground shows your current directory (<code>~</code>{' '}
          is short for your home folder). Watch it change as you <code>cd</code>.
        </Callout>
      </Section>

      <Section id="playground" title="Try it live">
        <p className="prose">
          This is a real filesystem running in your browser (via Python compiled
          to WebAssembly). Commands genuinely create, read, and delete files, and
          the tree on the right updates as you go.
        </p>
        <FilesystemPlayground />
        <TryThis>
          Run <code>tree</code>, then <code>cd projects/webapp</code> and{' '}
          <code>ls -l</code>. Create something with{' '}
          <code>mkdir demo</code> and <code>touch demo/hello.txt</code> and watch
          the tree update. Then switch to the <strong>Python</strong> tab and run{' '}
          <code>import os; os.listdir('.')</code> — same files, seen from code.
        </TryThis>
      </Section>

      <Section id="ops" title="Working with files">
        <p className="prose">
          A handful of commands cover most day-to-day file work. They all take
          paths (absolute or relative), so everything you learned about paths
          applies directly.
        </p>
        <ul className="prose-list">
          <li><code>cp a b</code> — copy a file; <code>mv a b</code> — move or rename it.</li>
          <li><code>wc file</code> — count lines, words, and characters.</li>
          <li><code>ln target name</code> — a <strong>hard link</strong> (a second name for the same inode).</li>
          <li><code>ln -s target name</code> — a <strong>symbolic link</strong> (a pointer to a path).</li>
        </ul>
        <TryThis>
          Run <code>ln README.md README.hard</code> then <code>ls -l</code> — notice
          the <em>link count</em> (the number after the permissions) went up to 2:
          two names, one inode. Now try <code>ln -s README.md README.soft</code> and
          <code> ls -l</code> to see the <code>l</code> type and separate link.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <p className="prose">
          The name you see in a folder isn't really the file — it's a pointer.
          Understanding this removes a lot of mystery.
        </p>
        <UnderTheHood title="Names, inodes, and what a file really is">
          <p className="prose">
            On disk, a file's data and metadata (size, permissions, timestamps)
            live in a structure called an <strong>inode</strong>, identified by a
            number. A directory is just a table mapping <em>names</em> to inode
            numbers. So a filename is a label pointing at an inode — which is why
            the same file can have several names (hard links), and why renaming is
            cheap (you only change the label). Run <code>stat README.md</code> to
            see the inode number and link count.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Hard links vs. symbolic links">
          <p className="prose">
            A <strong>hard link</strong> is another directory entry pointing at the
            same inode; the file's data survives until the <em>last</em> name is
            removed (that's the link count reaching zero). A{' '}
            <strong>symbolic link</strong> is a tiny file that just stores a path —
            if the target moves or is deleted, the symlink dangles.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Reading a permission string like -rw-r--r--">
          <p className="prose">
            The first character is the type (<code>-</code> file, <code>d</code>{' '}
            directory, <code>l</code> symlink). The next nine are three groups of{' '}
            <code>rwx</code> for the <strong>owner</strong>, the{' '}
            <strong>group</strong>, and <strong>everyone else</strong>. So{' '}
            <code>-rw-r--r--</code> means the owner can read/write, everyone else
            can only read.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'path', def: 'The route through the tree to a file or directory.' },
            { term: 'working directory', def: 'The folder your relative paths are resolved against.' },
            { term: 'inode', def: "A structure holding a file's data pointers and metadata, identified by a number." },
            { term: 'hard link', def: 'An additional name pointing at the same inode.' },
            { term: 'symbolic link', def: 'A small file that stores a path to another file.' },
            { term: 'permissions', def: 'Read/write/execute bits for owner, group, and others.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: <>Your working directory is <code>/home/dev</code>. Which path refers to the same file as <code>/home/dev/projects/app.py</code>?</>,
              options: ['/projects/app.py', 'projects/app.py', '../projects/app.py', '~/app.py'],
              answer: 1,
              explain: <>A relative path is resolved from the working directory, so <code>projects/app.py</code> → <code>/home/dev/projects/app.py</code>.</>,
            },
            {
              q: 'What does the link count in `ls -l` tell you?',
              options: [
                'How many bytes the file uses',
                'How many directory names point at the same inode',
                'How many times the file was edited',
                'The permission level',
              ],
              answer: 1,
              explain: 'Each hard link is a name pointing at the inode; the count is how many names exist.',
            },
            {
              q: <>What does <code>-rw-r--r--</code> allow for "everyone else"?</>,
              options: ['read and write', 'read only', 'nothing', 'execute only'],
              answer: 1,
              explain: 'The last triple is r--, i.e. read but not write or execute.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>The filesystem is a tree rooted at <code>/</code>.</>,
            <>Absolute paths start at <code>/</code>; relative paths start at your current directory (<code>.</code> and <code>..</code>).</>,
            <>Permissions are <code>rwx</code> for owner, group, and others.</>,
            <>A filename is a label pointing at an <strong>inode</strong>; hard links share one, symlinks store a path.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}
