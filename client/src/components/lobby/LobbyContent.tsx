import { useState } from 'react';

import PlayerList from '../lobby/PlayerList';
import GameSettingsModal from './GameSettingsModal';
import AvatarModal from '../avatar/AvatarModal';

import type { Lobby } from '../../types/lobby';
import { socket } from '../../socket/socket';

type LobbyContentProps = {
  lobby: Lobby;
  isHost: boolean;
  settingsOpen: boolean;
  copyLobbyCode: () => void;
  startGame: () => void;
  setSettingsOpen: (value: boolean) => void;
};

export default function LobbyContent({
  lobby,
  isHost,
  settingsOpen,
  copyLobbyCode,
  startGame,
  setSettingsOpen,
}: LobbyContentProps) {
  const [avatarOpen, setAvatarOpen] =
    useState(false);

const saveAvatar = (
  avatar: string,
) => {
  socket.emit(
    'avatar:update',
    {
      code: lobby.code,
      avatar,
    },
  );
};

  return (
    <div
      className="
        w-full
        max-w-2xl
        rounded-3xl
        border
        border-[#9b5cff]/50
        bg-[#11131f]/85
        p-8
        shadow-2xl
        backdrop-blur-md
      "
    >
      <h1 className="mb-4 text-4xl font-bold text-white">
        Draw Impostor
      </h1>

      <p className="mb-4 text-[#c7c9d8]">
        Lobby :
        <strong className="ml-2 font-mono text-[#36d8ff]">
          {lobby.code}
        </strong>
      </p>

      <div className="mb-8 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={copyLobbyCode}
          className="
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-4
            py-2
            text-sm
            font-semibold
            text-white
            transition
            hover:bg-white/10
          "
        >
          Copier le code
        </button>

        <button
          type="button"
          onClick={() =>
            setAvatarOpen(true)
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
            hover:border-[#9b5cff]/70
            hover:bg-[#9b5cff]/20
          "
        >
          Personnaliser mon avatar
        </button>
      </div>

      <section className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">
            Joueurs
          </h2>

          <span
            className="
              rounded-full
              border
              border-white/10
              bg-white/5
              px-3
              py-1
              text-sm
              font-semibold
              text-[#c7c9d8]
            "
          >
            {lobby.players.length}
          </span>
        </div>

        <PlayerList
          players={lobby.players}
        />
      </section>

      {isHost ? (
        <section className="flex flex-col gap-3">
          <button
            type="button"
            onClick={() =>
              setSettingsOpen(true)
            }
            className="
              w-full
              rounded-xl
              border
              border-[#9b5cff]/50
              bg-[#9b5cff]/10
              px-4
              py-3
              font-semibold
              text-[#c9a7ff]
              transition
              hover:bg-[#9b5cff]/20
            "
          >
            Options de la partie
          </button>

          <button
            type="button"
            onClick={startGame}
            disabled={
              lobby.players.length < 3
            }
            className="
              w-full
              rounded-xl
              bg-[#36d8ff]
              px-4
              py-3
              font-semibold
              text-[#10131c]
              transition
              hover:bg-[#67e5ff]
              disabled:cursor-not-allowed
              disabled:opacity-40
            "
          >
            Lancer la partie
          </button>

          {lobby.players.length < 3 && (
            <p className="text-center text-sm text-[#ffb86b]">
              Il faut au minimum 3 joueurs.
            </p>
          )}
        </section>
      ) : (
        <div
          className="
            rounded-2xl
            border
            border-white/10
            bg-white/5
            p-4
            text-center
            text-sm
            text-[#c7c9d8]
          "
        >
          En attente que l'hôte lance la partie...
        </div>
      )}

      {settingsOpen && (
<GameSettingsModal
  lobbyCode={lobby.code}
  initialSettings={
    lobby.settings
  }
  onClose={() =>
    setSettingsOpen(false)
  }
/>
      )}

      {avatarOpen && (
        <AvatarModal
          onClose={() =>
            setAvatarOpen(false)
          }
          onSave={saveAvatar}
        />
      )}
    </div>
  );
}