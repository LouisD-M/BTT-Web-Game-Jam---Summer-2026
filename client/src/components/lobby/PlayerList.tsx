type Player = {
  id: string;
  nickname: string;
  isHost: boolean;
  ready: boolean;
};

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
          <strong>{player.nickname}</strong>

          {player.isHost && (
            <span> - Host</span>
          )}

          <span>
            {" "}
            - {player.ready ? "Prêt" : "Pas prêt"}
          </span>
        </li>
      ))}
    </ul>
  );
}