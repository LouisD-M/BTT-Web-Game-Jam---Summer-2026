import { useNavigate } from 'react-router-dom';

type ScorePlayer = {
  id: string;
  nickname: string;
  score: number;
};

type FinalRankingProps = {
  scores: ScorePlayer[];
  lobbyCode: string;
};

export default function FinalRanking({
  scores,
  lobbyCode,
}: FinalRankingProps) {
  const navigate = useNavigate();

  const ranking = [...scores].sort(
    (a, b) => b.score - a.score,
  );

  const goBackToLobby = () => {
    navigate(`/lobby/${lobbyCode}`);
  };

  return (
    <section>
      <h1>Partie terminée !</h1>

      <h2>Classement final</h2>

      {ranking.map((player, index) => (
        <div key={player.id}>
          <h3>
            {index === 0 && '🏆 '}
            {index + 1}. {player.nickname}
          </h3>

          <p>
            {player.score} point
            {player.score !== 1 ? 's' : ''}
          </p>
        </div>
      ))}

      <button onClick={goBackToLobby}>
        Retour au lobby
      </button>
    </section>
  );
}