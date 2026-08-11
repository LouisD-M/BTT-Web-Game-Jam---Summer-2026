type GameRuleBadgeProps = {
  rule: string;
};

export default function GameRuleBadge({
  rule,
}: GameRuleBadgeProps) {
  return (
    <div>
      <span>
        Règle : <strong>{rule}</strong>
      </span>
    </div>
  );
}