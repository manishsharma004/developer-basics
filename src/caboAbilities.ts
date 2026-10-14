export type AbilityKind = 'peek-self' | 'peek-other' | 'swap' | 'penalty'

export type CaboAbility = {
  id: string
  ranks: string
  title: string
  description: string
  kind: AbilityKind
  /** Visual hint on the faux playing card */
  cardFace: string
  cardSub?: string
  suitTone?: 'red' | 'black'
}

/** House rules from the forwarded cheat sheet — power cards only. */
export const CABO_ABILITIES: CaboAbility[] = [
  {
    id: 'seven-eight',
    ranks: '7, 8',
    title: 'See your card',
    description:
      'Peek at one of your own face-down cards. Remember the value — you usually cannot look again unless another effect lets you.',
    kind: 'peek-self',
    cardFace: '7 · 8',
  },
  {
    id: 'nine-ten',
    ranks: '9, 10',
    title: "See another player's card",
    description:
      "Secretly peek at any other player's face-down card. They do not get to see what you looked at.",
    kind: 'peek-other',
    cardFace: '9 · 10',
  },
  {
    id: 'jack-queen',
    ranks: 'J, Q',
    title: 'Unseen swap',
    description:
      "Swap any two face-down cards on the table without revealing them — yours or anyone else's.",
    kind: 'swap',
    cardFace: 'J · Q',
  },
  {
    id: 'king-black',
    ranks: 'K ♠ ♣',
    title: 'Seen swap',
    description:
      'Choose two cards, look at both, then swap them (or put them back). Everyone sees the values you revealed.',
    kind: 'swap',
    cardFace: 'K',
    cardSub: 'black',
    suitTone: 'black',
  },
  {
    id: 'king-red',
    ranks: 'K ♥ ♦',
    title: 'Minus one',
    description:
      'Play this on an opponent to add one point to their score for the round (a “+1” penalty in Cabo terms).',
    kind: 'penalty',
    cardFace: 'K',
    cardSub: 'red',
    suitTone: 'red',
  },
]

export const KIND_LABEL: Record<AbilityKind, string> = {
  'peek-self': 'Peek · self',
  'peek-other': 'Peek · other',
  swap: 'Swap',
  penalty: 'Penalty',
}
