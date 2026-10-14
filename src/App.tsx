import { CABO_ABILITIES, KIND_LABEL } from './caboAbilities'
import './App.css'

function PlayingCard({
  face,
  sub,
  tone,
}: {
  face: string
  sub?: string
  tone?: 'red' | 'black'
}) {
  const toneClass = tone ? `card--${tone}` : ''
  return (
    <div className={`playing-card ${toneClass}`} aria-hidden="true">
      <span className="playing-card__corner playing-card__corner--tl">{face}</span>
      <span className="playing-card__center">
        <span className="playing-card__face">{face}</span>
        {sub ? <span className="playing-card__sub">{sub}</span> : null}
      </span>
      <span className="playing-card__corner playing-card__corner--br">{face}</span>
    </div>
  )
}

function App() {
  return (
    <div className="page">
      <header className="hero">
        <div className="hero__badge">Quick reference</div>
        <h1>Cabo — power cards</h1>
        <p className="hero__lead">
          When you discard a numbered card or face card, its ability fires before the next
          turn. Use this sheet at the table so nobody has to dig through chat history.
        </p>
      </header>

      <section className="abilities" aria-labelledby="abilities-heading">
        <h2 id="abilities-heading" className="section-title">Card abilities</h2>
        <ul className="ability-grid">
          {CABO_ABILITIES.map((ability) => (
            <li key={ability.id}>
              <article className={`ability-card ability-card--${ability.kind}`}>
                <div className="ability-card__top">
                  <PlayingCard
                    face={ability.cardFace}
                    sub={ability.cardSub}
                    tone={ability.suitTone}
                  />
                  <div className="ability-card__meta">
                    <span className="ability-card__ranks">{ability.ranks}</span>
                    <span className={`pill pill--${ability.kind}`}>
                      {KIND_LABEL[ability.kind]}
                    </span>
                  </div>
                </div>
                <h3 className="ability-card__title">{ability.title}</h3>
                <p className="ability-card__desc">{ability.description}</p>
              </article>
            </li>
          ))}
        </ul>
      </section>

      <section className="reminders" aria-labelledby="reminders-heading">
        <h2 id="reminders-heading" className="section-title">At the table</h2>
        <ul className="reminder-list">
          <li>
            <strong>Goal:</strong> lowest total when someone calls Cabo — usually four cards,
            values 0–13 (Cabo = 0).
          </li>
          <li>
            <strong>Draw or discard:</strong> take from the deck, or match the top discard if
            you want that rank.
          </li>
          <li>
            <strong>Power first:</strong> resolve 7–K effects before ending your turn when
            those cards are played from your hand.
          </li>
        </ul>
      </section>

      <footer className="footer">
        <p>House rules vary — confirm peek/swap limits with your group before you start.</p>
      </footer>
    </div>
  )
}

export default App
