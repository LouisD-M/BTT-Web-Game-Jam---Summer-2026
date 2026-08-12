import PlayerAvatar from '../player/PlayerAvatar';

type PlayerWord = {
  id: string;
  nickname: string;
  word: string;
  isImpostor: boolean;
  avatar?: string;
};

type ResultData = {
  impostorId: string;
  normalWord: string;
  impostorWord: string;
  votes: Record<string, number>;
  playerWords: PlayerWord[];
};

type ResultsPhaseProps = {
  results: ResultData;
};

export default function ResultsPhase({
  results,
}: ResultsPhaseProps) {
  const impostor =
    results.playerWords.find(
      (player) =>
        player.isImpostor,
    );

  return (
    <section className="mx-auto w-full max-w-5xl">
      <div
        className="
          rounded-3xl
          border
          border-[#9b5cff]/40
          bg-[#11131f]/90
          p-7
          shadow-2xl
          backdrop-blur-md
        "
      >
        <div className="mb-7 text-center">
          <p className="mb-2 text-sm uppercase tracking-[0.18em] text-[#8d91a5]">
            Résultat de la manche
          </p>

          <h2 className="text-3xl font-bold text-white">
            L'imposteur était{' '}
            <span className="text-[#ff6b8a]">
              {impostor?.nickname ??
                'Inconnu'}
            </span>
          </h2>
        </div>

        <div className="mb-7 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl bg-white/5 p-4 text-center">
            <p className="text-xs uppercase text-[#8d91a5]">
              Mot principal
            </p>

            <strong className="text-xl text-[#36d8ff]">
              {results.normalWord}
            </strong>
          </div>

          <div className="rounded-2xl bg-[#ff6b8a]/10 p-4 text-center">
            <p className="text-xs uppercase text-[#8d91a5]">
              Mot imposteur
            </p>

            <strong className="text-xl text-[#ff8da4]">
              {results.impostorWord}
            </strong>
          </div>
        </div>

        <div className="space-y-3">
          {results.playerWords.map(
            (player) => (
              <div
                key={player.id}
                className={`
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  p-4
                  ${
                    player.isImpostor
                      ? 'border-[#ff6b8a]/40 bg-[#ff6b8a]/10'
                      : 'border-white/10 bg-white/5'
                  }
                `}
              >
<div className="flex items-center gap-3">
  <PlayerAvatar
    nickname={player.nickname}
    avatar={player.avatar}
  />

  <div>
    <h3 className="font-bold text-white">
      {player.nickname}
    </h3>

    <p className="text-sm text-[#c7c9d8]">
      Mot :{' '}
      <strong className="text-white">
        {player.word}
      </strong>
    </p>
  </div>
</div>

                <div className="text-right">
                  {player.isImpostor && (
                    <span className="mb-1 block text-xs font-bold text-[#ff8da4]">
                      IMPOSTEUR
                    </span>
                  )}

                  <strong className="text-[#36d8ff]">
                    {results.votes[
                      player.id
                    ] ?? 0}{' '}
                    vote(s)
                  </strong>
                </div>
              </div>
            ),
          )}
        </div>

        <p className="mt-6 text-center text-sm text-[#8d91a5]">
          Nouvelle manche bientôt...
        </p>
      </div>
    </section>
  );
}