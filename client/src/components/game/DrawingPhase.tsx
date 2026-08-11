import {
  useCallback,
  useRef,
  useState,
} from 'react';

import DrawingCanvas from './DrawingCanvas';
import GameTimer from './GameTimer';
import WordDisplay from './WordDisplay';
import GameRuleBadge from './GameRuleBadge';

import { socket } from '../../socket/socket';

type DrawingPhaseProps = {
  lobbyCode: string;
  word: string;
  rule: string;
};

export default function DrawingPhase({
  lobbyCode,
  word,
  rule,
}: DrawingPhaseProps) {
  const [finished, setFinished] =
    useState(false);

  const getImageRef =
    useRef<(() => string) | null>(
      null,
    );

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
    if (finished) return;

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
        code: lobbyCode,
        drawing,
      },
    );
  };

  return (
    <section>
      <GameTimer duration={30} />

      <WordDisplay
        word={
          word ||
          'Chargement...'
        }
      />

      <GameRuleBadge
        rule={rule}
      />

      {!finished ? (
        <>
          <DrawingCanvas
            onCanvasReady={
              handleCanvasReady
            }
          />

          <button
            onClick={
              finishDrawing
            }
          >
            Terminer le dessin
          </button>
        </>
      ) : (
        <div>
          <h2>
            Dessin terminé
          </h2>

          <p>
            En attente des
            autres joueurs...
          </p>
        </div>
      )}
    </section>
  );
}