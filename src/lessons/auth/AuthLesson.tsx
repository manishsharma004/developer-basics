import { Lesson } from '../components/Lesson.tsx'
import { Section, Callout, UnderTheHood, TryThis, Recap, Quiz, KeyTerms } from '../components/blocks.tsx'
import { SnippetRunner, type Snippet } from '../components/SnippetRunner.tsx'

const SNIPPETS: Snippet[] = [
  {
    label: 'Salt & hash a password',
    code: `import hashlib, secrets

def hash_password(password, salt=None):
    salt = salt or secrets.token_hex(8)     # unique per user
    digest = hashlib.sha256((salt + password).encode()).hexdigest()
    return salt, digest

# On sign-up: store (salt, digest) — never the raw password.
salt, stored = hash_password("hunter2")
print("stored:", salt, stored[:16], "...")

# On login: hash the attempt with the SAME salt and compare.
_, attempt = hash_password("hunter2", salt)
print("login ok:", secrets.compare_digest(stored, attempt))

_, wrong = hash_password("wrong", salt)
print("wrong pw ok:", secrets.compare_digest(stored, wrong))`,
  },
  {
    label: 'Decode a JWT payload',
    code: `import base64, json

# A JWT is three base64url parts: header.payload.signature
jwt = ("eyJhbGciOiJIUzI1NiJ9"
       ".eyJzdWIiOiI3IiwibmFtZSI6IkFkYSIsInJvbGUiOiJhZG1pbiJ9"
       ".c2lnbmF0dXJl")

def b64url(part):
    part += "=" * (-len(part) % 4)          # restore padding
    return base64.urlsafe_b64decode(part)

header, payload, sig = jwt.split(".")
print("header:", json.loads(b64url(header)))
print("payload:", json.loads(b64url(payload)))
print("note: anyone can READ this — it is signed, not encrypted")`,
  },
  {
    label: 'Sessions vs. tokens',
    code: `import secrets

# A session id is an opaque random string; the state lives on the server.
session_id = secrets.token_urlsafe(16)
server_sessions = {session_id: {"user": 7, "role": "admin"}}
print("cookie:", session_id)
print("server looks up:", server_sessions[session_id])

# A token instead CARRIES the claims (the server trusts its own signature).
print("\\nsession  -> tiny cookie, server stores state (easy to revoke)")
print("token    -> self-contained, nothing to store (scales, harder to revoke)")`,
  },
  {
    label: 'Verify a password',
    code: `    import hashlib, secrets
    
    def hash_password(pw):
        salt = secrets.token_hex(8)
        digest = hashlib.sha256((salt + pw).encode()).hexdigest()
        return salt, digest
    
    def verify(pw, salt, digest):
        return hashlib.sha256((salt + pw).encode()).hexdigest() == digest
    
    salt, digest = hash_password("secret")
    print("ok", verify("secret", salt, digest))
    print("bad", verify("wrong", salt, digest))`,
  },

]

export default function AuthLesson() {
  return (
    <Lesson id="auth">
      <Section id="intro" title="Why it matters">
        <p className="prose">
          The moment an app has users, it has to answer two questions on every
          request: <em>who are you?</em> and <em>are you allowed to do this?</em> Get
          this wrong and you leak data or hand attackers the keys. The good news:
          the core ideas are small and reusable.
        </p>
        <Callout kind="why" title="The one idea">
          <strong>Authentication</strong> proves identity (login).{' '}
          <strong>Authorization</strong> decides permission (access). Never store raw
          passwords — store a <strong>salted hash</strong> — and treat tokens as{' '}
          <em>signed</em>, not <em>secret</em>.
        </Callout>
      </Section>

      <Section id="model" title="AuthN vs. AuthZ">
        <ul className="prose-list">
          <li>
            <strong>Authentication (AuthN)</strong>: verify a credential — a password,
            a one-time code, a passkey. Result: we know <em>who</em> the caller is.
          </li>
          <li>
            <strong>Authorization (AuthZ)</strong>: given an identity, check whether
            it may perform an action (roles, ownership, scopes). Result: allow or
            deny.
          </li>
          <li>
            After login you need to <strong>stay</strong> logged in. A{' '}
            <strong>session</strong> stores state on the server and hands the client
            an opaque cookie; a <strong>token</strong> (like a JWT) carries signed
            claims so the server can trust it without a lookup.
          </li>
        </ul>
      </Section>

      <Section id="playground" title="Decode a token">
        <p className="prose">
          Run these to see how a password is safely stored and checked, why a JWT's
          contents are readable by anyone (so never put secrets in it), and the
          trade-off between sessions and tokens.
        </p>
        <SnippetRunner snippets={SNIPPETS} />
        <TryThis>
          In <strong>Salt &amp; hash a password</strong>, run it twice and notice the
          salt (and therefore the stored hash) changes every time — that's what stops
          attackers from using precomputed tables. Then in{' '}
          <strong>Decode a JWT payload</strong>, confirm you can read the role without
          any key.
        </TryThis>
      </Section>

      <Section id="hood" title="Under the hood">
        <UnderTheHood title="Why a JWT is signed, not encrypted">
          <p className="prose">
            A JWT's payload is only <strong>base64url-encoded</strong> — trivially
            readable, as the playground shows. Its security comes from the{' '}
            <strong>signature</strong>: the server signs{' '}
            <code>header.payload</code> with a secret key, so it can detect if anyone
            tampered with the claims. Never put passwords or secrets in a JWT, and
            always verify the signature before trusting it.
          </p>
        </UnderTheHood>
        <UnderTheHood title="Why passwords need a slow, salted hash">
          <p className="prose">
            A <strong>salt</strong> makes every user's hash unique, defeating
            precomputed "rainbow tables". But fast hashes like SHA-256 can be brute
            forced billions of times per second, so real systems use{' '}
            <strong>deliberately slow</strong> algorithms (bcrypt, scrypt, Argon2)
            that make each guess expensive. Compare hashes with a constant-time check
            (<code>compare_digest</code>) to avoid timing leaks.
          </p>
        </UnderTheHood>
      </Section>

      <Section id="terms" title="Key terms">
        <KeyTerms
          terms={[
            { term: 'authentication (AuthN)', def: 'Proving who you are (login).' },
            { term: 'authorization (AuthZ)', def: 'Deciding what you are allowed to do.' },
            { term: 'salt', def: 'Random data mixed into a password before hashing, unique per user.' },
            { term: 'session', def: 'Server-stored login state referenced by an opaque cookie.' },
            { term: 'token / JWT', def: 'A signed, self-contained set of claims the server can verify.' },
            { term: 'signature', def: 'A keyed check proving a token has not been tampered with.' },
          ]}
        />
      </Section>

      <Section id="check" title="Check yourself">
        <Quiz
          questions={[
            {
              q: 'What is the difference between authentication and authorization?',
              options: [
                'They are the same thing',
                'AuthN proves identity; AuthZ decides permission',
                'AuthN is for admins; AuthZ is for users',
                'AuthZ happens first',
              ],
              answer: 1,
              explain: 'First prove who you are (AuthN), then check what you may do (AuthZ).',
            },
            {
              q: 'Why should you never store a raw password?',
              options: [
                'It uses too much space',
                'A database breach would expose every real password',
                'Passwords cannot be compared',
                'It is against JSON rules',
              ],
              answer: 1,
              explain: 'Store a salted (ideally slow) hash so a breach does not reveal passwords.',
            },
            {
              q: 'A JWT payload is:',
              options: [
                'Encrypted and unreadable',
                'Base64-encoded and readable by anyone, but signed against tampering',
                'Stored only on the server',
                'A password',
              ],
              answer: 1,
              explain: 'JWTs are signed, not secret — never put confidential data in one.',
            },

            {
              q: 'Authentication proves:',
              options: [
                'What you may do',
              'Who you are',
              'Server location',
              'JSON schema',
              ],
              answer: 1,
              explain: 'AuthN = identity; AuthZ = permissions.',
            },
            {
              q: 'JWT payload is:',
              options: [
                'Encrypted secret',
              'Base64-encoded JSON — not secret',
              'Always empty',
              'Only for DNS',
              ],
              answer: 1,
              explain: 'Anyone can read the payload; the signature proves integrity.',
            },
          ]}
        />
      </Section>

      <Section id="recap" title="Recap">
        <Recap
          items={[
            <><strong>AuthN</strong> proves identity; <strong>AuthZ</strong> grants permission.</>,
            <>Store passwords as a <strong>salted, slow hash</strong> — never plain text.</>,
            <>A <strong>JWT</strong> is signed, not encrypted: readable, but tamper-evident.</>,
            <><strong>Sessions</strong> store state server-side; <strong>tokens</strong> carry it and scale.</>,
          ]}
        />
      </Section>
    </Lesson>
  )
}
