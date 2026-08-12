type ColorPaletteProps = {
  selectedColor: string;

  onColorChange: (
    color: string,
  ) => void;
};

const COLORS = [
  '#111111',
  '#ffffff',
  '#6b7280',

  '#ef4444',
  '#f97316',
  '#facc15',

  '#84cc16',
  '#22c55e',
  '#14b8a6',

  '#06b6d4',
  '#3b82f6',
  '#6366f1',

  '#8b5cf6',
  '#a855f7',
  '#ec4899',

  '#92400e',
];

export default function ColorPalette({
  selectedColor,
  onColorChange,
}: ColorPaletteProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {COLORS.map(
        (color) => (
          <button
            key={color}
            type="button"
            title={color}
            onClick={() =>
              onColorChange(
                color,
              )
            }
            className={`
              h-8
              w-8
              rounded-full
              border-2
              transition

              hover:
                scale-110

              ${
                selectedColor ===
                color
                  ? `
                    scale-110
                    border-[#36d8ff]
                    shadow-[0_0_12px_rgba(54,216,255,0.45)]
                  `
                  : `
                    border-white/20
                  `
              }
            `}
            style={{
              backgroundColor:
                color,
            }}
          />
        ),
      )}

      <label
        className="
          relative
          flex
          h-9
          w-9
          cursor-pointer
          items-center
          justify-center
          rounded-xl
          border
          border-white/20
          bg-white/5
          text-lg
          text-white
        "
        title="Couleur personnalisée"
      >
        🎨

        <input
          type="color"
          value={
            selectedColor
          }
          onChange={(
            event,
          ) =>
            onColorChange(
              event.target
                .value,
            )
          }
          className="
            absolute
            inset-0
            cursor-pointer
            opacity-0
          "
        />
      </label>
    </div>
  );
}