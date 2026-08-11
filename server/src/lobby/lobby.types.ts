export type GamePhase =
  | 'drawing'
  | 'review'
  | 'voting'
  | 'results';

export type Player = {
  id: string;
  nickname: string;
  isHost: boolean;

  drawingFinished: boolean;
  drawing?: string;

  voteFor?: string;

  score: number;
};

export type Lobby = {
  code: string;
  hostId: string;
  players: Player[];

  state: 'waiting' | 'playing';

  round: number;
  totalRounds: number;

  phase?: GamePhase;

  impostorId?: string;

  normalWord?: string;
  impostorWord?: string;
};