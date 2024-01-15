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

export enum CardEdge {
	TOP = 'TOP',
	LEFT = 'LEFT',
	RIGHT = 'RIGHT',
	BOTTOM = 'BOTTOM',
}

export type CardSqueezeEvent = {
	index: number;
	origin?: CardEdge;
	x?: number;
	y?: number;
	destination?: CardEdge;
};
