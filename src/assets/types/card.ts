export enum CardName {
  Ace = 'A',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',
  Ten = '10',
  Jack = 'J',
  Queen = 'Q',
  King = 'K',
  // Joker = 'Joker',
}

export enum CardNameExtended {
  Red = 'Red',
}

export enum Suit {
  Clubs = 'Clubs',
  Spades = 'Spades',
  Diamonds = 'Diamonds',
  Hearts = 'Hearts',
}

export type Card = {
  name: CardName | CardNameExtended;
  suit: Suit;
  value: number;
  isFacingDown: boolean;
  isSentToPlayer: boolean;
};

export enum TouchOrigin {
  TOP_LEFT = 'TOP LEFT',
  TOP_MIDDLE = 'TOP MIDDLE',
  TOP_RIGHT = 'TOP RIGHT',
  LEFT_MIDDLE = 'LEFT MIDDLE',
  RIGHT_MIDDLE = 'RIGHT MIDDLE',
  BOTTOM_LEFT = 'BOTTOM LEFT',
  BOTTOM_MIDDLE = 'BOTTOM MIDDLE',
  BOTTOM_RIGHT = 'BOTTOM RIGHT',
}
