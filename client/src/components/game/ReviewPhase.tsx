import {
  useEffect,
  useState,
} from 'react';
import PlayerAvatar from '../player/PlayerAvatar';

type Drawing = {
  id: string;
  nickname: string;
  avatar?: string;
  drawing: string | null;
};

type ReviewPhaseProps = {
  drawings: Drawing[];
};

export default function ReviewPhase({
  drawings,
}: ReviewPhaseProps) {
  const [index, setIndex] =
    useState(0);

  useEffect(() => {
    setIndex(0);

    if (drawings.length <= 1) {
      return;
    }

    const interval =
      window.setInterval(
        () => {
          setIndex(
            (current) => {
              if (
                current >=
                drawings.length - 1
              ) {
                return current;
              }

              return current + 1;
            },
          );
        },
        4000,
      );

    return () => {
      window.clearInterval(
        interval,
      );
    };
  }, [drawings]);

  const current =
    drawings[index];

  if (!current) {
    return (
      <p className="text-center text-white">
        Aucun dessin à afficher.
      </p>
    );
  }

  return (
    <section className="mx-auto w-full max-w-5xl">
      <div
        className="
          rounded-3xl
          border
          border-[#9b5cff]/40
          bg-[#11131f]/90
          p-6
          shadow-2xl
          backdrop-blur-md
        "
      >
        <div className="mb-5 flex items-center justify-between">
            <PlayerAvatar
                nickname={current.nickname}
                avatar={current.avatar}
            />
          <div>
 
            <p className="text-sm text-[#8d91a5]">
              À vous de juger...
            </p>

            <h2 className="text-2xl font-bold text-white">
              Dessin de{' '}
              <span className="text-[#36d8ff]">
                {current.nickname}
              </span>
            </h2>
          </div>

          <span
            className="
              rounded-full
              bg-white/10
              px-4
              py-2
              text-sm
              font-semibold
              text-[#c7c9d8]
            "
          >
            {index + 1} / {drawings.length}
          </span>
        </div>

        <div
          className="
            overflow-hidden
            rounded-3xl
            border-4
            border-[#9b5cff]/40
            bg-white
          "
        >
          {current.drawing ? (
            <img
              src={current.drawing}
              alt={`Dessin de ${current.nickname}`}
              className="
                aspect-[12/7]
                w-full
                object-contain
              "
            />
          ) : (
            <div className="flex aspect-[12/7] items-center justify-center text-[#555]">
              Aucun dessin terminé.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}