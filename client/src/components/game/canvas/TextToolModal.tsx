import {
  useState,
} from 'react';

type TextToolModalProps = {
  onCancel: () => void;

  onSubmit: (
    text: string,
    fontSize: number,
  ) => void;
};

export default function TextToolModal({
  onCancel,
  onSubmit,
}: TextToolModalProps) {
  const [
    text,
    setText,
  ] =
    useState('');

  const [
    fontSize,
    setFontSize,
  ] =
    useState(36);

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/70
        p-5
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-md
          rounded-3xl
          border
          border-[#9b5cff]/50
          bg-[#11131f]
          p-6
          shadow-2xl
        "
      >
        <h3 className="text-2xl font-bold text-white">
          Ajouter du texte
        </h3>

        <p className="mt-1 text-sm text-[#9ca3af]">
          Écris ton texte puis clique sur le canvas.
        </p>

        <input
          autoFocus
          value={text}
          maxLength={40}
          onChange={(
            event,
          ) =>
            setText(
              event.target
                .value,
            )
          }
          placeholder="Ton texte..."
          className="
            mt-5
            w-full
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-4
            py-3
            text-white
            outline-none
            placeholder:text-[#666b80]
            focus:border-[#36d8ff]/60
          "
        />

        <div className="mt-5">
          <div className="mb-2 flex justify-between">
            <span className="text-sm text-[#c7c9d8]">
              Taille
            </span>

            <span className="text-sm font-semibold text-[#36d8ff]">
              {fontSize}px
            </span>
          </div>

          <input
            type="range"
            min="16"
            max="100"
            value={
              fontSize
            }
            onChange={(
              event,
            ) =>
              setFontSize(
                Number(
                  event.target
                    .value,
                ),
              )
            }
            className="w-full"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={
              onCancel
            }
            className="
              flex-1
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-4
              py-3
              font-semibold
              text-[#c7c9d8]
              hover:bg-white/10
            "
          >
            Annuler
          </button>

          <button
            type="button"
            disabled={
              !text.trim()
            }
            onClick={() =>
              onSubmit(
                text.trim(),
                fontSize,
              )
            }
            className="
              flex-1
              rounded-xl
              bg-[#36d8ff]
              px-4
              py-3
              font-bold
              text-[#10131c]
              hover:bg-[#67e5ff]
              disabled:opacity-30
            "
          >
            Valider
          </button>
        </div>
      </div>
    </div>
  );
}