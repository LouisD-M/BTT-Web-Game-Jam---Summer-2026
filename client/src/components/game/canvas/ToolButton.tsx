type ToolButtonProps = {
  label: string;
  title?: string;

  active?: boolean;

  disabled?: boolean;

  danger?: boolean;

  onClick: () => void;
};

export default function ToolButton({
  label,
  title,
  active = false,
  disabled = false,
  danger = false,
  onClick,
}: ToolButtonProps) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`
        rounded-xl
        border
        px-3
        py-2
        text-sm
        font-semibold
        transition

        ${
          active
            ? `
              border-[#36d8ff]/70
              bg-[#36d8ff]/15
              text-[#67e5ff]
              shadow-[0_0_16px_rgba(54,216,255,0.15)]
            `
            : `
              border-white/10
              bg-white/5
              text-[#c7c9d8]
              hover:border-white/20
              hover:bg-white/10
              hover:text-white
            `
        }

        ${
          danger
            ? `
              hover:border-[#ff6b8a]/50
              hover:bg-[#ff6b8a]/10
              hover:text-[#ff9aad]
            `
            : ''
        }

        disabled:cursor-not-allowed
        disabled:opacity-30
      `}
    >
      {label}
    </button>
  );
}