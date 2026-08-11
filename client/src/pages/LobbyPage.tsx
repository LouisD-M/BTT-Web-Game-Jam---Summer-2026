import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import PlayerList from '../components/PlayerList';
import GameSettingsModal from '../components/lobby/GameSettingsModal';

import { socket } from '../socket/socket';
import type { Lobby } from '../types/lobby';

export default function LobbyPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lobby, setLobby] = useState<Lobby | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const nickname = localStorage.getItem('nickname');

  useEffect(() => {
    if (!nickname || !id) {
      navigate('/');
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    const handleLobbyUpdate = (updatedLobby: Lobby) => {
      setLobby(updatedLobby);
    };

    const handleLobbyError = (data: { message: string }) => {
      console.error('Lobby error:', data.message);
    };

    const handleGameStarted = (data: { code: string }) => {
      navigate(`/game/${data.code}`);
    };

    socket.on('lobby:update', handleLobbyUpdate);
    socket.on('lobby:error', handleLobbyError);
    socket.on('game:started', handleGameStarted);

    socket.emit('lobby:get', {
      code: id,
    });

    return () => {
      socket.off('lobby:update', handleLobbyUpdate);
      socket.off('lobby:error', handleLobbyError);
      socket.off('game:started', handleGameStarted);
    };
  }, [id, navigate, nickname]);

  const copyLobbyCode = async () => {
    if (!id) return;

    await navigator.clipboard.writeText(id);
  };

  const currentPlayer = lobby?.players.find(
    (player) => player.id === socket.id,
  );

  const isHost = currentPlayer?.isHost ?? false;

  const startGame = () => {
    if (!isHost || !id) return;

    socket.emit('game:start', {
      code: id,
    });
  };

  if (!lobby) {
    return <p>Chargement du lobby...</p>;
  }

  return (
    <main>
      <h1>Draw Impostor</h1>

      <p>
        Lobby : <strong>{lobby.code}</strong>
      </p>

      <button onClick={copyLobbyCode}>
        Copier le code
      </button>

      <section>
        <h2>Joueurs ({lobby.players.length})</h2>

        <PlayerList players={lobby.players} />
      </section>

      {isHost ? (
        <section>
          <button onClick={() => setSettingsOpen(true)}>
            Options de la partie
          </button>

          <button
            onClick={startGame}
            disabled={lobby.players.length < 3}
          >
            Lancer la partie
          </button>

          {lobby.players.length < 3 && (
            <p>Il faut au minimum 3 joueurs.</p>
          )}
        </section>
      ) : (
        <p>En attente que l'hôte lance la partie...</p>
      )}

      {settingsOpen && (
        <GameSettingsModal
          onClose={() => setSettingsOpen(false)}
        />
      )}
    </main>
  );
}