type WordDisplayProps = {
  word: string;
};

export default function WordDisplay({
  word,
}: WordDisplayProps) {
  return (
    <div
      className="
        flex
        min-h-24
        flex-col
        justify-center
        rounded-2xl
        border
        border-[#36d8ff]/40
        bg-[#11131f]/90
        px-6
        py-3
        text-center
        shadow-xl
        backdrop-blur-md
      "
    >
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8d91a5]">
        Ton mot
      </p>

      <h2 className="mt-1 text-3xl font-bold text-white">
        {word}
      </h2>
    </div>
  );
}