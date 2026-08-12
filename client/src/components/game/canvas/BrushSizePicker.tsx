type BrushSizePickerProps = {
  value: number;

  onChange: (
    value: number,
  ) => void;
};

export default function BrushSizePicker({
  value,
  onChange,
}: BrushSizePickerProps) {
  return (
    <div className="flex min-w-52 items-center gap-3">
      <span className="text-xs font-semibold text-[#9ca3af]">
        Taille
      </span>

      <input
        type="range"
        min="1"
        max="50"
        step="1"
        value={value}
        onChange={(
          event,
        ) =>
          onChange(
            Number(
              event.target
                .value,
            ),
          )
        }
        className="w-28 cursor-pointer"
      />

      <div
        className="
          flex
          h-10
          w-10
          shrink-0
          items-center
          justify-center
          rounded-xl
          border
          border-white/10
          bg-white/5
        "
      >
        <div
          className="
            rounded-full
            bg-white
          "
          style={{
            width:
              Math.max(
                2,
                Math.min(
                  value,
                  28,
                ),
              ),

            height:
              Math.max(
                2,
                Math.min(
                  value,
                  28,
                ),
              ),
          }}
        />
      </div>

      <span className="w-10 text-xs text-[#c7c9d8]">
        {value}px
      </span>
    </div>
  );
}