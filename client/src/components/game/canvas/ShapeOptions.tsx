type ShapeOptionsProps = {
  filled: boolean;

  onFilledChange: (
    value: boolean,
  ) => void;
};

export default function ShapeOptions({
  filled,
  onFilledChange,
}: ShapeOptionsProps) {
  return (
    <label
      className="
        flex
        cursor-pointer
        items-center
        gap-3
        rounded-xl
        border
        border-white/10
        bg-white/5
        px-3
        py-2
      "
    >
      <input
        type="checkbox"
        checked={filled}
        onChange={(
          event,
        ) =>
          onFilledChange(
            event.target
              .checked,
          )
        }
        className="
          h-4
          w-4
          accent-[#36d8ff]
        "
      />

      <span className="text-sm text-[#c7c9d8]">
        Forme pleine
      </span>
    </label>
  );
}