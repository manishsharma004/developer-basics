import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SqlPlayground } from './SqlPlayground.tsx'

export default function SqlLesson() {
  return (
    <Lesson id="sql">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Most applications keep their data in a relational database and talk to it
          with <strong>SQL</strong>. It's one of the most durable skills in software
          — the same queries you learn today work across Postgres, MySQL, SQLite,
          and more. And SQL is <em>declarative</em>: you say <em>what</em> you want,
          not how to fetch it.
        </p>
        <Callout kind="why" title="The one idea">
          Data lives in <strong>tables</strong> (rows and columns). You{' '}
          <strong>query</strong> it by describing the result you want; the database
          figures out how to produce it.
        </Callout>
      </Section>

      <Section id="model" title="Tables & queries">
        <p className="prose">
          Our database has two tables: <code>customers</code> (id, name, city) and{' '}
          <code>orders</code> (id, customer_id, product, amount). The building
          blocks of a query:
        </p>
        <ul className="prose-list">
          <li><code>SELECT</code> columns <code>FROM</code> a table.</li>
          <li><code>WHERE</code> filters rows by a condition.</li>
          <li><code>ORDER BY</code> sorts; <code>LIMIT</code> caps the count.</li>
          <li><code>JOIN</code> combines rows from two tables on a matching key.</li>
          <li><code>GROUP BY</code> with <code>COUNT</code>/<code>SUM</code> aggregates.</li>
        </ul>
      </Section>

      <Section id="playground" title="Run SQL live">
        <p className="prose">
          This is a real SQLite database running in your browser. Edit the query
          and run it — try the sample buttons to see filtering, joining, and
          grouping.
        </p>
        <SqlPlayground />
        <TryThis>
          Start with <code>SELECT * FROM customers;</code>. Then try the JOIN sample
          to attach each order to its customer, and the GROUP BY sample to total
          spending per city. Change <code>amount &gt; 100</code> and re-run.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Indexes: the database's table of contents">
          <p className="prose">
            Without help, finding rows means scanning the whole table (O(n)). An{' '}
            <strong>index</strong> is a sorted structure (usually a B-tree) on a
            column that lets the database jump straight to matching rows — turning a
            scan into a fast lookup. That's why queries on indexed columns are fast
            and why adding the right index is the classic performance fix.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Why parameterize queries (SQL injection)">
          <p className="prose">
            Never build queries by pasting user input into a string. If a value like{' '}
            <code>'; DROP TABLE users;--</code> gets concatenated in, the database
            executes it. <strong>Parameterized queries</strong> send the query and
            the values separately, so input can never be interpreted as SQL.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'table', def: 'A set of rows with typed columns.' },
            { term: 'row / record', def: 'A single entry in a table.' },
            { term: 'primary key', def: 'A column uniquely identifying each row.' },
            { term: 'JOIN', def: 'Combining rows from tables on a matching key.' },
            { term: 'aggregate', def: 'A function like COUNT/SUM over grouped rows.' },
            { term: 'index', def: 'A structure that speeds up lookups on a column.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'Which clause filters which rows are returned?',
              options: ['SELECT', 'WHERE', 'ORDER BY', 'JOIN'],
              answer: 1,
              explain: 'WHERE applies a condition to include/exclude rows.',
            },
            {
              q: 'What does a JOIN do?',
              options: ['Sorts rows', 'Combines rows from two tables on a matching key', 'Deletes rows', 'Counts rows'],
              answer: 1,
              explain: 'JOIN matches rows across tables using related columns.',
            },
            {
              q: 'How do you prevent SQL injection?',
              options: ['Trust the input', 'Use parameterized queries', 'Uppercase the SQL', 'Add more JOINs'],
              answer: 1,
              explain: 'Parameters keep data separate from SQL code, so input cannot become commands.',
            },

            {
              q: 'PRIMARY KEY ensures:',
              options: [
                'Fast network',
              'Each row has a unique identifier',
              'UTF-8 encoding',
              'No NULLs anywhere',
              ],
              answer: 1,
              explain: 'Primary keys uniquely identify rows in a table.',
            },
            {
              q: 'JOIN combines rows based on:',
              options: [
                'Random order',
              'Related columns between tables',
              'File size',
              'CPU count',
              ],
              answer: 1,
              explain: 'Joins link tables via foreign keys or shared columns.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>Relational data lives in <strong>tables</strong> of rows and columns.</>,
            <>SQL is declarative: <code>SELECT … FROM … WHERE … JOIN … GROUP BY</code>.</>,
            <><strong>Indexes</strong> turn full scans into fast lookups.</>,
            <>Always use <strong>parameterized queries</strong> to avoid SQL injection.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}
