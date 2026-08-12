import {
  useEffect,
  useState,
} from 'react';

import {
  useNavigate,
  useParams,
} from 'react-router-dom';

import LobbyContent from '../components/lobby/LobbyContent';

import { socket } from '../socket/socket';

import type {
  Lobby,
} from '../types/lobby';

export default function LobbyPage() {
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const [
    lobby,
    setLobby,
  ] =
    useState<Lobby | null>(
      null,
    );

  const [
    settingsOpen,
    setSettingsOpen,
  ] =
    useState(false);

  const nickname =
    localStorage.getItem(
      'nickname',
    );

  useEffect(() => {
    if (
      !nickname ||
      !id
    ) {
      navigate('/');

      return;
    }

    if (
      !socket.connected
    ) {
      socket.connect();
    }

    const handleLobbyUpdate = (
      updatedLobby:
        Lobby,
    ) => {
      setLobby(
        updatedLobby,
      );
    };

    const handleLobbyError = (
      data: {
        message: string;
      },
    ) => {
      console.error(
        'Lobby error:',
        data.message,
      );
    };

    const handleGameStarted = (
      data: {
        code: string;
      },
    ) => {
      navigate(
        `/game/${data.code}`,
      );
    };

    socket.on(
      'lobby:update',
      handleLobbyUpdate,
    );

    socket.on(
      'lobby:error',
      handleLobbyError,
    );

    socket.on(
      'game:started',
      handleGameStarted,
    );

    socket.emit(
      'lobby:get',
      {
        code: id,
      },
    );

    return () => {
      socket.off(
        'lobby:update',
        handleLobbyUpdate,
      );

      socket.off(
        'lobby:error',
        handleLobbyError,
      );

      socket.off(
        'game:started',
        handleGameStarted,
      );
    };
  }, [
    id,
    navigate,
    nickname,
  ]);

  const copyLobbyCode =
    async () => {
      if (!id) {
        return;
      }

      await navigator.clipboard.writeText(
        id,
      );
    };

  const isHost =
    lobby?.hostId ===
      socket.id ||
    lobby?.players.some(
      (
        player,
      ) =>
        player.id ===
          socket.id &&
        player.isHost,
    ) === true;

  const startGame = () => {
    if (
      !isHost ||
      !id
    ) {
      return;
    }

    socket.emit(
      'game:start',
      {
        code: id,
      },
    );
  };

  if (!lobby) {
    return (
      <p>
        Chargement du lobby...
      </p>
    );
  }

  return (
    <main
      className="
        relative
        flex
        min-h-screen
        w-full
        items-center
        justify-center
        bg-[url('/bg_lobby.png')]
        bg-cover
        bg-center
        bg-no-repeat
        p-6
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-black/20
        "
      />

      <div
        className="
          relative
          z-10
          flex
          w-full
          justify-center
        "
      >
        <LobbyContent
          lobby={lobby}
          isHost={isHost}
          settingsOpen={
            settingsOpen
          }
          copyLobbyCode={
            copyLobbyCode
          }
          startGame={
            startGame
          }
          setSettingsOpen={
            setSettingsOpen
          }
        />
      </div>
    </main>
  );
}