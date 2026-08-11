type WordDisplayProps = {
  word: string;
};

export default function WordDisplay({
  word,
}: WordDisplayProps) {
  return (
    <div>
      <p>Ton mot</p>

      <h2>{word}</h2>
    </div>
  );
}