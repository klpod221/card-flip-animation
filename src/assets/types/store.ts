import { Card } from './card';
import { GameResult, GameStatus } from './game';
import { Station } from './station';

export type InsuranceConfig = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];

export type ChipConfig = [number, number, number, number, number];

export interface GameConfigs {
  [GameResult.PLAYER]: number;
  [GameResult.BANKER]: number;
  [GameResult.TIE]: number;
  [GameResult.BANKER_PAIR]: number;
  [GameResult.PLAYER_PAIR]: number;
  MIN_PAIR_BET: number;
  MAX_PAIR_BET: number;
  MIN_TIE_BET: number;
  MAX_TIE_BET: number;
  MIN_BET: number;
  MAX_BET: number;
  INSURANCE_RATIO: InsuranceConfig;
  CHIPS: ChipConfig;
  NUM_OF_DECKS: number;
  PENETRATION_MARK: number;
  NUM_OF_GAME_BEFORE_SHUFFLE: number;
  EITHER_PAIR_ODD?: number;
  SUPER_6_ODD?: number;
  COMBO_BET?: string;
  MIN_LONE_TIE_BET?: number;
  MAX_LONE_TIE_BET?: number;
  MIN_TABLE_BET?: number;
  MAX_TABLE_BET?: number;
  MIN_TABLE_TIE_BET?: number;
  MAX_TABLE_TIE_BET?: number;
  MIN_TABLE_SIDE_BET?: number;
  MAX_TABLE_SIDE_BET?: number;
  MIN_EITHER_BET?: number;
  MAX_EITHER_BET?: number;
  MIN_SUPER_6_BET?: number;
  MAX_SUPER_6_BET?: number;
  MIN_BANKER_INSURANCE_SCORE: number;
  MIN_PLAYER_INSURANCE_SCORE: number;
  MIN_PLAYER_FIRST_2_CARDS_INSURANCE_SCORE: number;
}

export interface GameState {
  dealingShoe: Card[];
  lastDealtCardIndex: number;
  gameStatus: GameStatus;
  gameResult?: GameResult;
  playerCards: Card[];
  playerScore?: number;
  bankerCards: Card[];
  bankerScore?: number;
  isDealingCards: boolean;
  isClearingTable: boolean;
  isBankerModalVisible: boolean;
  burnCard?: Card;
  isClearingBurnCard: boolean;
  isCardShuffling: boolean;
  shouldShuffle: boolean;
  isShowRedCard: boolean;
  gamesAfterRedCard: number;
  isLastGame: boolean;
  plankCards: Card[];
  stations: Station[];
  stationsBetBanker: Station[];
  stationsBetPlayer: Station[];
  betChipsReceive: {
    [GameResult.PLAYER]: number[];
    [GameResult.TIE]: number[];
    [GameResult.BANKER]: number[];
  };
  gameLoading: boolean;
  gameConfigs: GameConfigs;
  nextGameConfigs?: GameConfigs;
  bankerInsuranceRatio: number;
  playerInsuranceRatio: number;
  isNotifiedPlayerToRevealCard: boolean;
}
