import {
  useCallback,
  useRef,
  useState,
} from 'react';

import DrawingCanvas from '../game/canvas/DrawingCanvas';
import GameTimer from './GameTimer';
import WordDisplay from './WordDisplay';
import GameRuleBadge from './GameRuleBadge';

import { socket } from '../../socket/socket';

import type {
  GameModifier,
} from '../../types/game-settings';

type DrawingPhaseProps = {
  lobbyCode: string;

  word: string;

  rule: string;

  modifier: GameModifier;

  drawingDuration: number;
};

export default function DrawingPhase({
  lobbyCode,
  word,
  rule,
  modifier,
  drawingDuration,
}: DrawingPhaseProps) {
  const [
    finished,
    setFinished,
  ] =
    useState(false);

  const getImageRef =
    useRef<
      (() => string) | null
    >(null);

  const handleCanvasReady =
    useCallback(
      (
        getImage: () => string,
      ) => {
        getImageRef.current =
          getImage;
      },
      [],
    );

  const finishDrawing = () => {
    if (finished) {
      return;
    }

    const drawing =
      getImageRef.current?.();

    if (!drawing) {
      console.error(
        'Impossible de récupérer le dessin',
      );

      return;
    }

    setFinished(true);

    socket.emit(
      'drawing:finished',
      {
        code:
          lobbyCode,

        drawing,
      },
    );
  };

  return (
    <section className="mx-auto w-full max-w-6xl">
      {!finished ? (
        <>
          <div
            className="
              mb-5
              grid
              gap-3
              md:grid-cols-[1fr_1.4fr_1fr]
            "
          >
            <GameTimer
              duration={
                drawingDuration
              }
            />

            <WordDisplay
              word={
                word ||
                'Chargement...'
              }
            />

            <GameRuleBadge
              rule={
                rule
              }
            />
          </div>

          <DrawingCanvas
            modifier={
              modifier
            }
            onCanvasReady={
              handleCanvasReady
            }
          />

          <div className="mt-5 flex justify-center">
            <button
              type="button"
              onClick={
                finishDrawing
              }
              className="
                min-w-72
                rounded-2xl
                bg-[#36d8ff]
                px-8
                py-4
                text-lg
                font-bold
                text-[#10131c]
                shadow-xl
                shadow-[#36d8ff]/20
                transition
                hover:-translate-y-0.5
                hover:bg-[#67e5ff]
                hover:shadow-[#36d8ff]/30
              "
            >
              Terminer le dessin
            </button>
          </div>
        </>
      ) : (
        <div
          className="
            mx-auto
            max-w-xl
            rounded-3xl
            border
            border-[#9b5cff]/50
            bg-[#11131f]/90
            p-10
            text-center
            shadow-2xl
            backdrop-blur-md
          "
        >
          <div className="mb-4 text-5xl">
            ✓
          </div>

          <h2 className="mb-2 text-2xl font-bold text-white">
            Dessin terminé
          </h2>

          <p className="text-[#c7c9d8]">
            En attente des autres joueurs...
          </p>
        </div>
      )}
    </section>
  );
}