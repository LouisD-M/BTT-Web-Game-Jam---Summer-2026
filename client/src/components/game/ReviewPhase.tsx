import {
  useEffect,
  useState,
} from 'react';

type Drawing = {
  id: string;
  nickname: string;
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

    if (
      drawings.length <= 1
    ) {
      return;
    }

    const interval =
      window.setInterval(
        () => {
          setIndex(
            (current) => {
              if (
                current >=
                drawings.length -
                  1
              ) {
                return current;
              }

              return (
                current + 1
              );
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
      <p>
        Aucun dessin à
        afficher.
      </p>
    );
  }

  return (
    <section>
      <h2>
        Dessin de{' '}
        {current.nickname}
      </h2>

      {current.drawing ? (
        <img
          src={current.drawing}
          alt={`Dessin de ${current.nickname}`}
          style={{
            maxWidth: '800px',
            width: '100%',
            border:
              '1px solid black',
          }}
        />
      ) : (
        <p>
          Aucun dessin
          terminé.
        </p>
      )}

      <p>
        {index + 1} /{' '}
        {drawings.length}
      </p>
    </section>
  );
}