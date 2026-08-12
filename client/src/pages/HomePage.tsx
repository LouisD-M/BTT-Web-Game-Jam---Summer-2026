import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { socket } from '../socket/socket';

import type { Lobby } from '../types/lobby';

import HomeForm from '../components/home/HomeForm';

export default function HomePage() {
  const navigate =
    useNavigate();

  const [
    nickname,
    setNickname,
  ] =
    useState('');

  const [
    lobbyCode,
    setLobbyCode,
  ] =
    useState('');

  const [
    error,
    setError,
  ] =
    useState('');

  useEffect(() => {
    const handleLobbyCreated = (
      lobby: Lobby,
    ) => {
      navigate(
        `/lobby/${lobby.code}`,
      );
    };

    const handleLobbyUpdate = (
      lobby: Lobby,
    ) => {
      navigate(
        `/lobby/${lobby.code}`,
      );
    };

    const handleLobbyError = (
      data: {
        message: string;
      },
    ) => {
      console.error(
        'Erreur lobby :',
        data.message,
      );

      setError(
        data.message,
      );
    };

    socket.on(
      'lobby:created',
      handleLobbyCreated,
    );

    socket.on(
      'lobby:update',
      handleLobbyUpdate,
    );

    socket.on(
      'lobby:error',
      handleLobbyError,
    );

    return () => {
      socket.off(
        'lobby:created',
        handleLobbyCreated,
      );

      socket.off(
        'lobby:update',
        handleLobbyUpdate,
      );

      socket.off(
        'lobby:error',
        handleLobbyError,
      );
    };
  }, [
    navigate,
  ]);

  const createLobby = () => {
    const cleanNickname =
      nickname.trim();

    if (!cleanNickname) {
      setError(
        'Entre un pseudo',
      );

      return;
    }

    setError('');

    localStorage.setItem(
      'nickname',
      cleanNickname,
    );

    socket.emit(
      'lobby:create',
      {
        nickname:
          cleanNickname,
      },
    );
  };

  const joinLobby = () => {
    const cleanNickname =
      nickname.trim();

    const cleanLobbyCode =
      lobbyCode
        .trim()
        .toUpperCase();

    if (!cleanNickname) {
      setError(
        'Entre un pseudo',
      );

      return;
    }

    if (!cleanLobbyCode) {
      setError(
        'Entre le code du lobby',
      );

      return;
    }

    setError('');

    localStorage.setItem(
      'nickname',
      cleanNickname,
    );

    socket.emit(
      'lobby:join',
      {
        code:
          cleanLobbyCode,

        nickname:
          cleanNickname,
      },
    );
  };

  return (
    <main
      className="
        flex
        min-h-screen
        w-full
        items-center
        justify-center
        bg-[url('/bg_homepage.png')]
        bg-cover
        bg-center
        bg-no-repeat
        p-6
      "
    >
      <HomeForm
        nickname={
          nickname
        }
        setNickname={
          setNickname
        }
        lobbyCode={
          lobbyCode
        }
        setLobbyCode={
          setLobbyCode
        }
        createLobby={
          createLobby
        }
        joinLobby={
          joinLobby
        }
        error={
          error
        }
      />
    </main>
  );
}