export enum GameStatus {
  SHUFFLE = 'Shuffle',
  NEW_GAME = 'New Game',
  ADD_CARD_MARK = 'Add Card Mark',
  REVEAL_FIRST_4_CARDS = 'Reveal First 4 Cards',
  PLAYER_DRAWS = 'Player Draws',
  REVEAL_PLAYER_3RD_CARD = 'Reveal Player 3rd Card',
  BANKER_DRAWS = 'Banker Draws',
  REVEAL_BANKER_3RD_CARD = 'Reveal Banker 3rd Card',
  CLEAR_GAME = 'Clear Game',
}

export enum GameResult {
  BANKER = 'BANKER',
  PLAYER = 'PLAYER',
  TIE = 'TIE',
  BANKER_PAIR = 'BANKER_PAIR',
  PLAYER_PAIR = 'PLAYER_PAIR',
  INSURANCE_BANKER = 'INSURANCE_BANKER',
  INSURANCE_PLAYER = 'INSURANCE_PLAYER',
}
