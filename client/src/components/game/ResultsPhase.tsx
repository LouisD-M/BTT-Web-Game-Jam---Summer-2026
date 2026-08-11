type PlayerWord = {
  id: string;
  nickname: string;
  word: string;
  isImpostor: boolean;
};

type ResultData = {
  impostorId: string;
  normalWord: string;
  impostorWord: string;

  votes: Record<
    string,
    number
  >;

  playerWords:
    PlayerWord[];
};

type ResultsPhaseProps = {
  results: ResultData;
};

export default function ResultsPhase({
  results,
}: ResultsPhaseProps) {
  const impostor =
    results.playerWords.find(
      (player) =>
        player.isImpostor,
    );

  return (
    <section>
      <h2>
        Résultat de la manche
      </h2>

      <h3>
        L'imposteur était{' '}
        <strong>
          {impostor?.nickname ??
            'Inconnu'}
        </strong>
      </h3>

      <div>
        {results.playerWords.map(
          (player) => (
            <div key={player.id}>
              <h3>
                {
                  player.nickname
                }
              </h3>

              <p>
                Mot :{' '}
                <strong>
                  {player.word}
                </strong>
              </p>

              <p>
                Votes reçus :{' '}
                {results.votes[
                  player.id
                ] ?? 0}
              </p>

              {player.isImpostor && (
                <strong>
                  IMPOSTEUR
                </strong>
              )}
            </div>
          ),
        )}
      </div>

      <hr />

      <p>
        Mot principal :{' '}
        <strong>
          {
            results.normalWord
          }
        </strong>
      </p>

      <p>
        Mot imposteur :{' '}
        <strong>
          {
            results.impostorWord
          }
        </strong>
      </p>

      <p>
        Nouvelle manche
        bientôt...
      </p>
    </section>
  );
}