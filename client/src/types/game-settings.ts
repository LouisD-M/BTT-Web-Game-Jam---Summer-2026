export type GameModifier =
  | 'normal'
  | 'twoColors'
  | 'oneStroke'
  | 'reverseMouse'
  | 'speedDraw'
  | 'blindDraw'
  | 'sharedCanvas';

export type GameSettings = {
  rounds: number;

  drawingTime: number;

  modifiers: GameModifier[];
};