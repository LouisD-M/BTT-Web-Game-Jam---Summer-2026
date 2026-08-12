type GameRuleBadgeProps = {
  rule: string;
};

export default function GameRuleBadge({
  rule,
}: GameRuleBadgeProps) {
  return (
    <div
      className="
        flex
        min-h-24
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-[#9b5cff]/40
        bg-[#11131f]/85
        px-5
        py-3
        shadow-xl
        backdrop-blur-md
      "
    >
      <span className="text-xs font-semibold uppercase tracking-[0.15em] text-[#8d91a5]">
        Règle
      </span>

      <strong
        className="
          mt-2
          rounded-full
          border
          border-[#9b5cff]/40
          bg-[#9b5cff]/15
          px-4
          py-1
          text-sm
          text-[#d4b7ff]
        "
      >
        {rule}
      </strong>
    </div>
  );
}