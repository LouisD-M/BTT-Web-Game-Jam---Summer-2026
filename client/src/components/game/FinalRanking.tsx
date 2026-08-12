import {
  useNavigate,
} from 'react-router-dom';

import PlayerAvatar from '../player/PlayerAvatar';

type ScorePlayer = {
  id: string;
  nickname: string;
  score: number;
  avatar?: string;
};

type FinalRankingProps = {
  scores: ScorePlayer[];
  lobbyCode: string;
};

export default function FinalRanking({
  scores,
  lobbyCode,
}: FinalRankingProps) {
  const navigate =
    useNavigate();

  const ranking =
    [...scores].sort(
      (a, b) =>
        b.score - a.score,
    );

  const goBackToLobby = () => {
    navigate(
      `/lobby/${lobbyCode}`,
    );
  };

  return (
    <section className="mx-auto w-full max-w-2xl">
      <div
        className="
          rounded-3xl
          border
          border-[#9b5cff]/50
          bg-[#11131f]/90
          p-8
          shadow-2xl
          backdrop-blur-md
        "
      >
        <div className="mb-8 text-center">
          <div className="mb-3 text-5xl">
            🏆
          </div>

          <h1 className="text-4xl font-bold text-white">
            Partie terminée !
          </h1>

          <p className="mt-2 text-[#c7c9d8]">
            Classement final
          </p>
        </div>

        <div className="space-y-3">
          {ranking.map(
            (
              player,
              index,
            ) => (
              <div
                key={player.id}
                className={`
                  flex
                  items-center
                  justify-between
                  rounded-2xl
                  border
                  px-5
                  py-4
                  ${
                    index === 0
                      ? 'border-[#36d8ff]/60 bg-[#36d8ff]/10'
                      : 'border-white/10 bg-white/5'
                  }
                `}
              >
<div className="flex items-center gap-4">
  <span className="w-8 text-xl font-bold text-[#8d91a5]">
    {index + 1}.
  </span>

  <PlayerAvatar
    nickname={player.nickname}
    avatar={player.avatar}
  />

  <strong className="text-lg text-white">
    {player.nickname}
  </strong>
</div>

                <span className="font-bold text-[#36d8ff]">
                  {player.score} point
                  {player.score !== 1
                    ? 's'
                    : ''}
                </span>
              </div>
            ),
          )}
        </div>

        <button
          type="button"
          onClick={goBackToLobby}
          className="
            mt-7
            w-full
            rounded-2xl
            bg-[#9b5cff]
            px-5
            py-3
            font-bold
            text-white
            transition
            hover:bg-[#b479ff]
          "
        >
          Retour au lobby
        </button>
      </div>
    </section>
  );
}