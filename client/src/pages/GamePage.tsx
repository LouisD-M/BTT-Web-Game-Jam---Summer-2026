import {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
} from 'react-router-dom';

import DrawingPhase from '../components/game/DrawingPhase';
import ReviewPhase from '../components/game/ReviewPhase';
import VotingPhase from '../components/game/VotingPhase';
import ResultsPhase from '../components/game/ResultsPhase';
import FinalRanking from '../components/game/FinalRanking';

import { socket } from '../socket/socket';

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

  votes: Record<string, number>;

  playerWords: PlayerWord[];
};

export default function GamePage() {
  const { id } = useParams();

  const [
    phase,
    setPhase,
  ] = useState<GamePhase>(
    'drawing',
  );

  const [
    word,
    setWord,
  ] = useState('');

  const [
    rule,
    setRule,
  ] = useState('Normal');

  const [
    players,
    setPlayers,
  ] = useState<Player[]>([]);

  const [
    drawings,
    setDrawings,
  ] = useState<Drawing[]>([]);

  const [
    results,
    setResults,
  ] = useState<ResultData | null>(
    null,
  );

  const [
    round,
    setRound,
  ] = useState(1);

  const [
    totalRounds,
    setTotalRounds,
  ] = useState(5);

  const [
    finalScores,
    setFinalScores,
  ] = useState<ScorePlayer[]>(
    [],
  );

  useEffect(() => {
    if (!id) return;

    const handleRoundStarted = (
      data: {
        round: number;
        totalRounds: number;
      },
    ) => {
      setRound(
        data.round,
      );

      setTotalRounds(
        data.totalRounds,
      );

      setResults(
        null,
      );

      setDrawings([]);

      setPhase(
        'drawing',
      );
    };

    const handleRoundWord = (
      data: {
        word: string;
        rule?: string;
      },
    ) => {
      setWord(
        data.word,
      );

      setRule(
        data.rule ??
          'Normal',
      );
    };

    const handleReviewStarted = (
      data: {
        drawings:
          Drawing[];
      },
    ) => {
      setDrawings(
        data.drawings,
      );

      setPhase(
        'review',
      );
    };

    const handleVotingStarted = (
      data: {
        players:
          Player[];

        drawings?:
          Drawing[];
      },
    ) => {
      setPlayers(
        data.players,
      );

      if (
        data.drawings
      ) {
        setDrawings(
          data.drawings,
        );
      }

      setPhase(
        'voting',
      );
    };

    const handleRoundResults = (
      data: ResultData,
    ) => {
      setResults(
        data,
      );

      setPhase(
        'results',
      );
    };

    const handleGameFinished = (
      data: {
        scores:
          ScorePlayer[];
      },
    ) => {
      setFinalScores(
        data.scores,
      );

      setPhase(
        'finished',
      );
    };

    socket.on(
      'round:started',
      handleRoundStarted,
    );

    socket.on(
      'round:word',
      handleRoundWord,
    );

    socket.on(
      'review:started',
      handleReviewStarted,
    );

    socket.on(
      'voting:started',
      handleVotingStarted,
    );

    socket.on(
      'round:results',
      handleRoundResults,
    );

    socket.on(
      'game:finished',
      handleGameFinished,
    );

    return () => {
      socket.off(
        'round:started',
        handleRoundStarted,
      );

      socket.off(
        'round:word',
        handleRoundWord,
      );

      socket.off(
        'review:started',
        handleReviewStarted,
      );

      socket.off(
        'voting:started',
        handleVotingStarted,
      );

      socket.off(
        'round:results',
        handleRoundResults,
      );

      socket.off(
        'game:finished',
        handleGameFinished,
      );
    };
  }, [id]);

  if (!id) {
    return (
      <p>
        Partie introuvable.
      </p>
    );
  }

  return (
    <main>
      {phase !==
        'finished' && (
        <header>
          <h1>
            Draw Impostor
          </h1>

          <p>
            Manche {round}
            {' / '}
            {totalRounds}
          </p>
        </header>
      )}

      {phase ===
        'drawing' && (
        <DrawingPhase
          lobbyCode={id}
          word={word}
          rule={rule}
        />
      )}

      {phase ===
        'review' && (
        <ReviewPhase
          drawings={
            drawings
          }
        />
      )}

      {phase ===
        'voting' && (
        <VotingPhase
          lobbyCode={id}
          players={
            players
          }
          drawings={
            drawings
          }
        />
      )}

      {phase ===
          'results' &&
        results && (
          <ResultsPhase
            results={
              results
            }
          />
        )}

      {phase ===
        'finished' && (
        <FinalRanking
          scores={
            finalScores
          }
          lobbyCode={id}
        />
      )}
    </main>
  );
}