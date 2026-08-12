import {
  useEffect,
  useState,
} from 'react';

import {
  useParams,
} from 'react-router-dom';

import GameContent from '../components/game/GameContent';

import { socket } from '../socket/socket';

import type {
  GameModifier,
} from '../types/game-settings';

type GamePhase =
  | 'drawing'
  | 'review'
  | 'voting'
  | 'results'
  | 'finished';

type Player = {
  id: string;
  nickname: string;
  avatar?: string;
};

type ScorePlayer = {
  id: string;
  nickname: string;
  avatar?: string;
  score: number;
};

type Drawing = {
  id: string;
  nickname: string;
  avatar?: string;
  drawing: string | null;
};

type PlayerWord = {
  id: string;
  nickname: string;
  avatar?: string;
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

export default function GamePage() {
  const { id } =
    useParams();

  const [
    phase,
    setPhase,
  ] =
    useState<GamePhase>(
      'drawing',
    );

  const [
    word,
    setWord,
  ] =
    useState('');

  const [
    rule,
    setRule,
  ] =
    useState('Normal');

  const [
    modifier,
    setModifier,
  ] =
    useState<GameModifier>(
      'normal',
    );

  const [
    drawingDuration,
    setDrawingDuration,
  ] =
    useState(30);

  const [
    players,
    setPlayers,
  ] =
    useState<Player[]>([]);

  const [
    drawings,
    setDrawings,
  ] =
    useState<Drawing[]>([]);

  const [
    results,
    setResults,
  ] =
    useState<ResultData | null>(
      null,
    );

  const [
    round,
    setRound,
  ] =
    useState(1);

  const [
    totalRounds,
    setTotalRounds,
  ] =
    useState(5);

  const [
    finalScores,
    setFinalScores,
  ] =
    useState<
      ScorePlayer[]
    >([]);

  useEffect(() => {
    if (!id) {
      return;
    }

    const handleRoundStarted = (
      data: {
        round: number;

        totalRounds:
          number;

        duration?: number;

        modifier?:
          GameModifier;
      },
    ) => {
      setRound(
        data.round,
      );

      setTotalRounds(
        data.totalRounds,
      );

      if (
        typeof data.duration ===
        'number'
      ) {
        setDrawingDuration(
          data.duration,
        );
      }

      if (
        data.modifier
      ) {
        setModifier(
          data.modifier,
        );
      }

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

        modifier?:
          GameModifier;

        duration?: number;
      },
    ) => {
      setWord(
        data.word,
      );

      setRule(
        data.rule ??
          'normal',
      );

      if (
        data.modifier
      ) {
        setModifier(
          data.modifier,
        );
      }

      if (
        typeof data.duration ===
        'number'
      ) {
        setDrawingDuration(
          data.duration,
        );
      }
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
      data:
        ResultData,
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

    socket.emit(
      'game:get-state',
      {
        code: id,
      },
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
    <main
      className="
        relative
        min-h-screen
        w-full
        bg-[url('/bg_game.png')]
        bg-cover
        bg-center
        bg-no-repeat
        p-6
      "
    >
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative z-10">
        <GameContent
          phase={phase}
          lobbyCode={id}
          round={round}
          totalRounds={
            totalRounds
          }
          word={word}
          rule={rule}
          modifier={
            modifier
          }
          drawingDuration={
            drawingDuration
          }
          players={players}
          drawings={
            drawings
          }
          results={
            results
          }
          finalScores={
            finalScores
          }
        />
      </div>
    </main>
  );
}