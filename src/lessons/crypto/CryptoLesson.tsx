import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { HashPlayground } from './HashPlayground.tsx'

export default function CryptoLesson() {
  return (
    <Lesson id="crypto">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          You don't have to be a cryptographer, but you do need to know the basics
          to avoid dangerous mistakes: storing passwords safely, verifying
          downloads, and understanding what HTTPS actually protects. The first step
          is separating two ideas that get confused constantly: <strong>hashing</strong>{' '}
          and <strong>encryption</strong>.
        </p>
        <Callout kind="why" title="The one idea">
          Hashing is <strong>one-way</strong> (you can't get the input back) and is
          for verifying integrity/identity. Encryption is <strong>reversible</strong>{' '}
          with a key and is for keeping data secret.
        </Callout>
      </Section>

      <Section id="model" title="Hash vs. encrypt">
        <ul className="prose-list">
          <li>
            <strong>Hash</strong> — a fixed-size fingerprint of any input. Same input
            → same hash; a tiny change → a totally different hash; you can't reverse
            it. Used for password storage, checksums, and Git commit ids.
          </li>
          <li>
            <strong>Encryption</strong> — scrambles data so only someone with the key
            can read it. Two-way by design. Used for HTTPS, disk encryption, and
            secrets at rest.
          </li>
          <li>
            <strong>Encoding</strong> (like Base64) is <em>neither</em> — it's just a
            reversible representation with no secret. Don't mistake it for security.
          </li>
        </ul>
      </Section>

      <Section id="playground" title="Hash it live">
        <p className="prose">
          This computes a real <strong>SHA-256</strong> hash in your browser. Type
          anything and watch the 64-hex-digit fingerprint. Notice that adding a
          single character changes about half of it — the <strong>avalanche
          effect</strong>.
        </p>
        <HashPlayground />
        <TryThis>
          Type your name, then add or remove one letter and watch the hash change
          completely. Try typing the same text twice — the hash is always identical
          for identical input, which is exactly what makes it useful for verification.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Why you never store plain passwords">
          <p className="prose">
            Store a <em>hash</em> of the password, not the password. To log a user
            in, hash what they typed and compare. Even a database leak doesn't reveal
            passwords — but only if you use a <strong>slow, salted</strong> password
            hash (bcrypt, scrypt, Argon2). A raw fast hash like SHA-256 alone is{' '}
            <em>not</em> enough, because attackers can guess billions per second.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Salts and rainbow tables">
          <p className="prose">
            A <strong>salt</strong> is a random value added to each password before
            hashing, so identical passwords get different hashes and precomputed
            "rainbow table" attacks don't work. The salt is stored alongside the hash
            — it isn't secret, it just has to be unique per user.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'hash function', def: 'A one-way map from any input to a fixed-size fingerprint.' },
            { term: 'avalanche effect', def: 'A tiny input change flips about half the output bits.' },
            { term: 'encryption', def: 'Reversible scrambling of data using a key.' },
            { term: 'salt', def: 'A random per-item value added before hashing.' },
            { term: 'encoding', def: 'A reversible representation (e.g. Base64) — not security.' },
            { term: 'collision resistance', def: 'It is infeasible to find two inputs with the same hash.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'What is the key difference between hashing and encryption?',
              options: [
                'Hashing is faster',
                'Hashing is one-way; encryption is reversible with a key',
                'They are the same',
                'Encryption cannot be undone',
              ],
              answer: 1,
              explain: 'You cannot recover input from a hash; encryption is designed to be decrypted with a key.',
            },
            {
              q: 'How should you store user passwords?',
              options: ['In plain text', 'Base64-encoded', 'As a salted, slow password hash', 'Encrypted with a shared key'],
              answer: 2,
              explain: 'Use a slow, salted password hash (bcrypt/scrypt/Argon2), never plaintext or reversible encoding.',
            },
            {
              q: 'Is Base64 a form of security?',
              options: ['Yes, strong', 'Yes, weak', 'No — it is just reversible encoding', 'Only with a key'],
              answer: 2,
              explain: 'Base64 has no secret and is trivially reversible; it provides no confidentiality.',
            },

            {
              q: 'Hashing is one-way — you cannot:',
              options: [
                'Hash twice',
              'Recover the original input from the hash',
              'Use SHA-256',
              'Compare hashes',
              ],
              answer: 1,
              explain: 'Hashes are designed to be irreversible (unlike encryption).',
            },
            {
              q: 'Salting passwords helps against:',
              options: [
                'DNS spoofing',
              'Rainbow table attacks',
              'HTTP caching',
              'Git merges',
              ],
              answer: 1,
              explain: 'Unique salts force attackers to crack each password separately.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <><strong>Hashing</strong> is one-way (fingerprint); <strong>encryption</strong> is reversible with a key.</>,
            <>A tiny input change flips ~half the hash — the <strong>avalanche effect</strong>.</>,
            <>Store passwords as <strong>salted, slow</strong> hashes, never plaintext.</>,
            <>Encoding (Base64) is not security.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}
