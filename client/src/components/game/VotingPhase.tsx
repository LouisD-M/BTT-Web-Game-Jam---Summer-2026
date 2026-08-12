import {
  useEffect,
  useState,
} from 'react';
import PlayerAvatar from '../player/PlayerAvatar';
import { socket } from '../../socket/socket';

type Player = {
  id: string;
  nickname: string;
  avatar?: string;
};

type Drawing = {
  id: string;
  nickname: string;
  drawing: string | null;
};

type VotingPhaseProps = {
  lobbyCode: string;
  players: Player[];
  drawings: Drawing[];
};

export default function VotingPhase({
  lobbyCode,
  players,
  drawings,
}: VotingPhaseProps) {
  const [
    timeLeft,
    setTimeLeft,
  ] = useState(30);

  const [
    votedPlayerId,
    setVotedPlayerId,
  ] =
    useState<
      string | null
    >(null);

  const [
    selectedDrawing,
    setSelectedDrawing,
  ] =
    useState<
      Drawing | null
    >(null);

  const currentPlayerId =
    socket.id;

  useEffect(() => {
    const interval =
      window.setInterval(
        () => {
          setTimeLeft(
            (current) =>
              Math.max(
                0,
                current - 1,
              ),
          );
        },
        1000,
      );

    return () =>
      window.clearInterval(
        interval,
      );
  }, []);

  const vote = (
    playerId: string,
  ) => {
    if (votedPlayerId) return;

    if (
      playerId ===
      currentPlayerId
    ) {
      return;
    }

    setVotedPlayerId(
      playerId,
    );

    socket.emit(
      'vote:submit',
      {
        code: lobbyCode,
        playerId,
      },
    );
  };

  const showDrawing = (
    playerId: string,
  ) => {
    const drawing =
      drawings.find(
        (drawing) =>
          drawing.id ===
          playerId,
      );

    if (!drawing) return;

    setSelectedDrawing(
      drawing,
    );
  };

  return (
    <section className="mx-auto w-full max-w-4xl">
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
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm text-[#8d91a5]">
              Quelqu'un ment...
            </p>

            <h2 className="text-3xl font-bold text-white">
              Qui est l'imposteur ?
            </h2>
          </div>

          <div className="rounded-2xl bg-white/5 px-5 py-3 text-center">
            <p className="text-xs uppercase tracking-wider text-[#8d91a5]">
              Temps
            </p>

            <strong className="text-2xl text-[#36d8ff]">
              {timeLeft}s
            </strong>
          </div>
        </div>

        <div className="space-y-3">
          {players.map(
            (player) => {
              const isMe =
                player.id ===
                currentPlayerId;

              const hasVotedFor =
                votedPlayerId ===
                player.id;

              return (
                <div
                  key={player.id}
                  className={`
                    flex
                    items-center
                    justify-between
                    gap-4
                    rounded-2xl
                    border
                    p-4
                    transition
                    ${
                      hasVotedFor
                        ? 'border-[#36d8ff]/70 bg-[#36d8ff]/10'
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
    <strong className="text-lg text-white">
      {player.nickname}
    </strong>

    {isMe && (
      <span className="ml-2 rounded-full bg-white/10 px-2 py-1 text-xs text-[#c7c9d8]">
        Vous
      </span>
    )}
  </div>
</div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        showDrawing(
                          player.id,
                        )
                      }
                      className="
                        rounded-xl
                        border
                        border-[#9b5cff]/40
                        bg-[#9b5cff]/10
                        px-4
                        py-2
                        text-sm
                        font-semibold
                        text-[#d4b7ff]
                        transition
                        hover:bg-[#9b5cff]/20
                      "
                    >
                      Voir le dessin
                    </button>

                    {!isMe && (
                      <button
                        type="button"
                        disabled={
                          !!votedPlayerId
                        }
                        onClick={() =>
                          vote(
                            player.id,
                          )
                        }
                        className="
                          rounded-xl
                          bg-[#36d8ff]
                          px-5
                          py-2
                          text-sm
                          font-bold
                          text-[#10131c]
                          transition
                          hover:bg-[#67e5ff]
                          disabled:cursor-not-allowed
                          disabled:opacity-40
                        "
                      >
                        Voter
                      </button>
                    )}
                  </div>
                </div>
              );
            },
          )}
        </div>

        {votedPlayerId && (
          <div
            className="
              mt-5
              rounded-2xl
              border
              border-[#36d8ff]/20
              bg-[#36d8ff]/10
              p-4
              text-center
              text-sm
              text-[#bdefff]
            "
          >
            Vote enregistré ✓
          </div>
        )}
      </div>

      {selectedDrawing && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/75
            p-6
            backdrop-blur-sm
          "
        >
          <div
            className="
              w-full
              max-w-4xl
              rounded-3xl
              border
              border-[#9b5cff]/50
              bg-[#11131f]
              p-6
              shadow-2xl
            "
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-white">
                Dessin de{' '}
                <span className="text-[#36d8ff]">
                  {selectedDrawing.nickname}
                </span>
              </h3>

              <button
                type="button"
                onClick={() =>
                  setSelectedDrawing(
                    null,
                  )
                }
                className="
                  rounded-xl
                  bg-white/10
                  px-4
                  py-2
                  text-white
                  hover:bg-white/20
                "
              >
                Fermer
              </button>
            </div>

            {selectedDrawing.drawing ? (
              <img
                src={
                  selectedDrawing.drawing
                }
                alt={`Dessin de ${selectedDrawing.nickname}`}
                className="
                  aspect-[12/7]
                  w-full
                  rounded-2xl
                  bg-white
                  object-contain
                "
              />
            ) : (
              <div className="flex h-96 items-center justify-center rounded-2xl bg-white">
                Aucun dessin
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}