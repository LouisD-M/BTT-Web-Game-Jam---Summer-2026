import type { Player } from '../types/lobby';

type PlayerListProps = {
  players: Player[];
};

export default function PlayerList({
  players,
}: PlayerListProps) {
  return (
    <ul>
      {players.map((player) => (
        <li key={player.id}>
          {player.nickname}
          {player.isHost && (
            <strong> - Host</strong>
          )}
        </li>
      ))}
    </ul>
  );
}