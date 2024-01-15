export interface OptionItem {
  value: unknown;
  text?: string;
}

export enum AdminScreen {
  MAIN,
  SYSTEM_SETUP,
  GAME_CONFIGS,
}

export interface MenuItem {
  text: string;
  screen?: AdminScreen;
}
