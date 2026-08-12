import DrawingPhase from './DrawingPhase';
import ReviewPhase from './ReviewPhase';
import VotingPhase from './VotingPhase';
import ResultsPhase from './ResultsPhase';
import FinalRanking from './FinalRanking';

import type {
  GameModifier,
} from '../../types/game-settings';

type GamePhase =
  | 'drawing'
  | 'review'
  | 'voting'
  | 'results'
  | 'finished';

type Player = {
  id: string;
  nickname: string;
};

type ScorePlayer = {
  id: string;
  nickname: string;
  score: number;
};

type Drawing = {
  id: string;
  nickname: string;
  drawing: string | null;
};

type PlayerWord = {
  id: string;
  nickname: string;
  word: string;
  isImpostor: boolean;
  score?: number;
};

type ResultData = {
  impostorId: string;
  normalWord: string;
  impostorWord: string;

  votes: Record<
    string,
    number
  >;

  playerWords:
    PlayerWord[];
};

type GameContentProps = {
  phase: GamePhase;

  lobbyCode: string;

  round: number;
  totalRounds: number;

  word: string;
  rule: string;

  modifier: GameModifier;

  drawingDuration: number;

  players: Player[];

  drawings: Drawing[];

  results:
    ResultData | null;

  finalScores:
    ScorePlayer[];
};

export default function GameContent({
  phase,
  lobbyCode,
  round,
  totalRounds,
  word,
  rule,
  modifier,
  drawingDuration,
  players,
  drawings,
  results,
  finalScores,
}: GameContentProps) {
  return (
    <div
      className="
        mx-auto
        w-full
        max-w-7xl
      "
    >
      {phase !== 'finished' && (
        <header
          className="
            mb-5
            flex
            items-center
            justify-between
            rounded-2xl
            border
            border-[#9b5cff]/40
            bg-[#11131f]/90
            px-6
            py-3
            shadow-xl
            backdrop-blur-md
          "
        >
          <h1 className="text-2xl font-bold text-white">
            Draw Impostor
          </h1>

          <p className="text-[#c7c9d8]">
            Manche{' '}
            <strong className="text-[#36d8ff]">
              {round}
            </strong>
            {' / '}
            {totalRounds}
          </p>
        </header>
      )}

      {phase === 'drawing' && (
        <DrawingPhase
          lobbyCode={
            lobbyCode
          }
          word={word}
          rule={rule}
          modifier={
            modifier
          }
          drawingDuration={
            drawingDuration
          }
        />
      )}

      {phase === 'review' && (
        <ReviewPhase
          drawings={
            drawings
          }
        />
      )}

      {phase === 'voting' && (
        <VotingPhase
          lobbyCode={
            lobbyCode
          }
          players={
            players
          }
          drawings={
            drawings
          }
        />
      )}

      {phase === 'results' &&
        results && (
          <ResultsPhase
            results={
              results
            }
          />
        )}

      {phase === 'finished' && (
        <FinalRanking
          scores={
            finalScores
          }
          lobbyCode={
            lobbyCode
          }
        />
      )}
    </div>
  );
}