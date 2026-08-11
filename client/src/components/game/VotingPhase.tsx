import {
  useEffect,
  useState,
} from 'react';

import { socket } from '../../socket/socket';

type Player = {
  id: string;
  nickname: string;
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
    if (votedPlayerId) {
      return;
    }

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
        code:
          lobbyCode,

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
    <section>
      <h2>
        Qui est
        l'imposteur ?
      </h2>

      <p>
        Temps restant :{' '}
        {timeLeft}s
      </p>

      {players.map(
        (player) => {
          const isMe =
            player.id ===
            currentPlayerId;

          return (
            <div
              key={
                player.id
              }
            >
              <strong>
                {
                  player.nickname
                }
              </strong>

              <button
                onClick={() =>
                  showDrawing(
                    player.id,
                  )
                }
              >
                Voir le dessin
              </button>

              {isMe ? (
                <span>
                  {' '}
                  - Vous
                </span>
              ) : (
                <button
                  disabled={
                    !!votedPlayerId
                  }
                  onClick={() =>
                    vote(
                      player.id,
                    )
                  }
                >
                  Voter
                </button>
              )}
            </div>
          );
        },
      )}

      {votedPlayerId && (
        <p>
          Vote enregistré.
        </p>
      )}

      {selectedDrawing && (
        <div>
          <hr />

          <h3>
            Dessin de{' '}
            {
              selectedDrawing.nickname
            }
          </h3>

          {selectedDrawing.drawing ? (
            <img
              src={
                selectedDrawing.drawing
              }
              alt={`Dessin de ${selectedDrawing.nickname}`}
              style={{
                width:
                  '100%',
                maxWidth:
                  '800px',
              }}
            />
          ) : (
            <p>
              Aucun dessin.
            </p>
          )}

          <button
            onClick={() =>
              setSelectedDrawing(
                null,
              )
            }
          >
            Fermer
          </button>
        </div>
      )}
    </section>
  );
}