import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { TimeConverter } from './TimeConverter.tsx'

export default function TimeLesson() {
  return (
    <Lesson id="time">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          Time is deceptively hard. Timezones, daylight saving, leap years, and
          ambiguous formats cause a steady stream of real bugs — reminders firing an
          hour off, logs that don't line up, "it works on my machine" scheduling
          issues. A few solid habits prevent almost all of them.
        </p>
        <Callout kind="why" title="The one idea">
          Store and compute time as a single absolute instant (a{' '}
          <strong>Unix timestamp</strong> in UTC). Convert to a local timezone only
          when <em>displaying</em> it to a human.
        </Callout>
      </Section>

      <Section id="model" title="Epoch, UTC & offsets">
        <ul className="prose-list">
          <li>
            A <strong>Unix timestamp</strong> is the number of seconds since{' '}
            <code>1970-01-01 00:00:00 UTC</code> (the "epoch"). It's a single number
            that means the same instant everywhere.
          </li>
          <li>
            <strong>UTC</strong> is the global reference time. A{' '}
            <strong>timezone</strong> is UTC plus an offset (e.g. New York is UTC−5,
            or UTC−4 during daylight saving).
          </li>
          <li>
            The <strong>same instant</strong> shows different wall-clock readings in
            different zones — but it's still one moment in time.
          </li>
        </ul>
      </Section>

      <Section id="playground" title="Convert time">
        <p className="prose">
          Enter a timestamp (or hit "Now") and see the same instant rendered across
          several timezones. Add an hour or a day and watch every zone move together.
        </p>
        <TimeConverter />
        <TryThis>
          Hit <strong>Now</strong>, then compare New York and Tokyo — the offset
          between them is the difference. Add <strong>+1 day</strong> and note that
          the timestamp changed by exactly 86,400 seconds.
        </TryThis>
      </Section>

      <Section id="formats" title="Formats & pitfalls">
        <ul className="prose-list">
          <li>
            Prefer <strong>ISO 8601</strong> strings when you must store text, e.g.{' '}
            <code>2026-08-21T05:30:00Z</code> (<code>Z</code> means UTC). Avoid
            ambiguous forms like <code>08/21/26</code>.
          </li>
          <li>
            Milliseconds vs seconds: APIs disagree. JavaScript{' '}
            <code>Date.now()</code> is ms; classic Unix time is seconds. Mixing them
            shifts dates by ~500× — always check the unit.
          </li>
          <li>
            <strong>Naive</strong> datetimes (no timezone attached) are a trap: the
            same digits mean different instants in different places. Attach an
            offset or store UTC.
          </li>
          <li>
            Scheduling “every day at 9:00 local” is not the same as “every 86,400
            seconds” — DST nights are 23 or 25 hours long.
          </li>
        </ul>
        <Callout kind="warning" title="Parse, don't guess">
          Hand-rolled date parsing is a bug farm. Use a library (or the platform's{' '}
          <code>Intl</code> / timezone database) that knows historical DST rules.
        </Callout>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Why 'store UTC, display local' saves you">
          <p className="prose">
            If you store local times, you can't reliably compare or order events, and
            daylight-saving transitions create times that are ambiguous or don't
            exist. Storing an absolute UTC timestamp sidesteps all of that — you only
            deal with timezone rules at the edges (input and display), where a good
            date library applies the correct historical offsets for you.
          </p>
        </UnderTheHood>
        <UnderTheHood title="The year-2038 problem">
          <p className="prose">
            A signed 32-bit timestamp overflows on 2038-01-19 (it can't count past
            ~2.1 billion seconds) — the same integer-overflow idea from the Data &
            Encoding lesson. Modern systems use 64-bit timestamps, which are safe for
            billions of years.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'Unix timestamp / epoch', def: 'Seconds since 1970-01-01 UTC; one number for an instant.' },
            { term: 'UTC', def: 'The global reference time with no daylight saving.' },
            { term: 'offset', def: "A timezone's difference from UTC, e.g. +05:30." },
            { term: 'daylight saving', def: 'Seasonal shifting of local clocks, changing the offset.' },
            { term: 'ISO 8601', def: 'A standard unambiguous date/time string format.' },
            { term: 'wall-clock time', def: 'What a local clock reads for a given instant.' },
            { term: 'naive datetime', def: 'A date/time value with no timezone — ambiguous across regions.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'How should you store timestamps in a system used across timezones?',
              options: ['Local time strings', 'UTC (e.g. a Unix timestamp)', 'Whatever the user typed', 'Only the date'],
              answer: 1,
              explain: 'Store an absolute UTC instant; convert to local only for display.',
            },
            {
              q: 'A Unix timestamp counts seconds since when?',
              options: ['The year 0', '1900-01-01', '1970-01-01 UTC', 'Program start'],
              answer: 2,
              explain: 'The Unix epoch is 1970-01-01 00:00:00 UTC.',
            },
            {
              q: 'Two servers show the same event one hour apart. A likely cause is:',
              options: ['Different CPUs', 'A timezone/DST mismatch in display or storage', 'Network latency', 'A hashing bug'],
              answer: 1,
              explain: 'One-hour discrepancies typically come from timezone or daylight-saving handling.',
            },
            {
              q: 'Which string form is least ambiguous for APIs?',
              options: ['08/21/26 5:30 PM', '2026-08-21T17:30:00Z', 'tomorrow afternoon', '21-08-26'],
              answer: 1,
              explain: 'ISO 8601 with a Z/offset states the instant clearly.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <>A <strong>Unix timestamp</strong> is one absolute instant in UTC.</>,
            <>Timezones are UTC plus an <strong>offset</strong>; the instant is the same everywhere.</>,
            <><strong>Store UTC, display local</strong> to avoid a whole class of bugs.</>,
            <>Prefer <strong>ISO 8601</strong>; watch ms vs s; avoid naive datetimes.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}
