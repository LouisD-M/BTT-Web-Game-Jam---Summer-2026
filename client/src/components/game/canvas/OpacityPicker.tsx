type OpacityPickerProps = {
  value: number;

  onChange: (
    value: number,
  ) => void;
};

export default function OpacityPicker({
  value,
  onChange,
}: OpacityPickerProps) {
  return (
    <div className="flex min-w-48 items-center gap-3">
      <span className="text-xs font-semibold text-[#9ca3af]">
        Opacité
      </span>

      <input
        type="range"
        min="0.1"
        max="1"
        step="0.1"
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
        className="w-24 cursor-pointer"
      />

      <span className="w-10 text-xs text-[#c7c9d8]">
        {Math.round(
          value * 100,
        )}
        %
      </span>
    </div>
  );
}