export type GamePhase =
  | 'drawing'
  | 'voting'
  | 'results';

export type Player = {
  id: string;
  nickname: string;
  isHost: boolean;

  drawingFinished: boolean;
  voteFor?: string;
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