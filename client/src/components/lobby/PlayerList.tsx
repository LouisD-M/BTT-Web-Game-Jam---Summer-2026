import type { Player } from '../../types/lobby';

type PlayerListProps = {
  players: Player[];
};

export default function PlayerList({
  players,
}: PlayerListProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {players.map((player) => (
        <div
          key={player.id}
          className="
            flex
            items-center
            gap-4
            rounded-2xl
            border
            border-white/10
            bg-white/5
            p-3
            transition
            hover:border-[#9b5cff]/40
            hover:bg-white/10
          "
        >
          <div
            className="
              flex
              h-14
              w-14
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-2xl
              border
              border-[#9b5cff]/40
              bg-[#1b1f2e]
              text-xl
              font-bold
              text-[#d4b7ff]
            "
          >
            {player.avatar ? (
            <img
                src={player.avatar}
                alt={`Avatar de ${player.nickname}`}
                className="
                h-full
                w-full
                object-cover
                "
            />
            ) : (
            player.nickname
                .charAt(0)
                .toUpperCase()
            )}
          </div>

          <div className="min-w-0 flex-1 text-left">
            <div className="flex items-center gap-2">
              <span
                className="
                  truncate
                  font-semibold
                  text-white
                "
              >
                {player.nickname}
              </span>

              {player.isHost && (
                <span
                  className="
                    rounded-full
                    border
                    border-[#36d8ff]/30
                    bg-[#36d8ff]/10
                    px-2
                    py-0.5
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-wider
                    text-[#67e5ff]
                  "
                >
                  Host
                </span>
              )}
            </div>

            <p className="mt-1 text-xs text-[#8d91a5]">
              Prêt à jouer
            </p>
          </div>

          <div
            className="
              h-2.5
              w-2.5
              shrink-0
              rounded-full
              bg-[#47e29a]
              shadow-[0_0_10px_rgba(71,226,154,0.7)]
            "
          />
        </div>
      ))}
    </div>
  );
}