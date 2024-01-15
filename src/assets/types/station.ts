import { GameResult } from './game';

export enum StationType {
  station_1 = 'station_1',
  station_2 = 'station_2',
  station_3 = 'station_3',
  station_4 = 'station_4',
  station_5 = 'station_5',
}

export type Bet = {
  [GameResult.PLAYER]?: number[];
  [GameResult.BANKER]?: number[];
  [GameResult.TIE]?: number[];
  [GameResult.PLAYER_PAIR]?: number[];
  [GameResult.BANKER_PAIR]?: number[];
  [GameResult.INSURANCE_BANKER]?: number[];
  [GameResult.INSURANCE_PLAYER]?: number[];
};

export type Credit = {
  totalBet: number;
  lastWon: number;
  credit: number;
};

export type Station = {
  type: StationType;
  account: Credit;
  bet?: Bet;
  isRevealSoon?: boolean;
  webContentsId: number;
};
