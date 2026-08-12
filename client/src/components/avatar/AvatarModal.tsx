import {
  useCallback,
  useRef,
} from 'react';

import AvatarCanvas from './AvatarCanvas';

type AvatarModalProps = {
  onClose: () => void;
  onSave: (avatar: string) => void;
};

export default function AvatarModal({
  onClose,
  onSave,
}: AvatarModalProps) {
  const getImageRef =
    useRef<(() => string) | null>(
      null,
    );

  const handleCanvasReady =
    useCallback(
      (
        getImage: () => string,
      ) => {
        getImageRef.current =
          getImage;
      },
      [],
    );

  const saveAvatar = () => {
    const avatar =
      getImageRef.current?.();

    if (!avatar) return;

    onSave(avatar);
    onClose();
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/70
        p-6
        backdrop-blur-sm
      "
    >
      <div
        className="
          w-full
          max-w-xl
          rounded-3xl
          border
          border-[#9b5cff]/50
          bg-[#11131f]/95
          p-7
          shadow-2xl
        "
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8d91a5]">
              Profil
            </p>

            <h2 className="text-3xl font-bold text-white">
              Dessine ton avatar
            </h2>

            <p className="mt-2 text-sm text-[#a5a8b8]">
              Fais quelque chose de beau. Ou pas.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-xl
              bg-white/5
              text-xl
              text-[#a5a8b8]
              hover:bg-white/10
              hover:text-white
            "
          >
            ×
          </button>
        </div>

        <AvatarCanvas
          onCanvasReady={
            handleCanvasReady
          }
        />

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="
              flex-1
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-5
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
            onClick={saveAvatar}
            className="
              flex-1
              rounded-xl
              bg-[#36d8ff]
              px-5
              py-3
              font-bold
              text-[#10131c]
              hover:bg-[#67e5ff]
            "
          >
            Sauvegarder
          </button>
        </div>
      </div>
    </div>
  );
}