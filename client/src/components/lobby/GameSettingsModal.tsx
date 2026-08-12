import { useState } from 'react';

type GameSettingsModalProps = {
  onClose: () => void;
};

export default function GameSettingsModal({
  onClose,
}: GameSettingsModalProps) {
  const [rounds, setRounds] = useState(5);
  const [drawingTime, setDrawingTime] = useState(120);

  const [normal, setNormal] = useState(true);
  const [twoColors, setTwoColors] = useState(false);
  const [oneStroke, setOneStroke] = useState(false);
  const [reverseMouse, setReverseMouse] = useState(false);
  const [speedDraw, setSpeedDraw] = useState(false);
  const [blindDraw, setBlindDraw] = useState(false);
  const [sharedCanvas, setSharedCanvas] = useState(false);

  const saveSettings = () => {
    console.log({
      rounds,
      drawingTime,
      modifiers: {
        normal,
        twoColors,
        oneStroke,
        reverseMouse,
        speedDraw,
        blindDraw,
        sharedCanvas,
      },
    });

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
          max-w-2xl
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
            <p
              className="
                mb-1
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#8d91a5]
              "
            >
              Configuration
            </p>

            <h2 className="text-3xl font-bold text-white">
              Options de la partie
            </h2>

            <p className="mt-2 text-sm text-[#a5a8b8]">
              Personnalise les manches et les règles du jeu.
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
              transition
              hover:bg-white/10
              hover:text-white
            "
          >
            ×
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="rounds"
              className="mb-2 block text-sm font-medium text-[#c7c9d8]"
            >
              Nombre de manches
            </label>

            <select
              id="rounds"
              value={rounds}
              onChange={(event) =>
                setRounds(
                  Number(event.target.value),
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-[#1b1f2e]
                px-4
                py-3
                text-white
                outline-none
                focus:border-[#9b5cff]
                focus:ring-2
                focus:ring-[#9b5cff]/20
              "
            >
              <option value={3}>3 manches</option>
              <option value={5}>5 manches</option>
              <option value={7}>7 manches</option>
              <option value={10}>10 manches</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="drawingTime"
              className="mb-2 block text-sm font-medium text-[#c7c9d8]"
            >
              Temps de dessin
            </label>

            <select
              id="drawingTime"
              value={drawingTime}
              onChange={(event) =>
                setDrawingTime(
                  Number(event.target.value),
                )
              }
              className="
                w-full
                rounded-xl
                border
                border-white/10
                bg-[#1b1f2e]
                px-4
                py-3
                text-white
                outline-none
                focus:border-[#36d8ff]
                focus:ring-2
                focus:ring-[#36d8ff]/20
              "
            >
              <option value={10}>10 secondes</option>
              <option value={20}>20 secondes</option>
              <option value={30}>30 secondes</option>
              <option value={45}>45 secondes</option>
              <option value={60}>60 secondes</option>
            </select>
          </div>
        </div>

        <div className="my-6 h-px bg-white/10" />

        <div>
          <h3 className="mb-1 text-lg font-bold text-white">
            Règles disponibles
          </h3>

          <p className="mb-4 text-sm text-[#8d91a5]">
            Active ou désactive les variantes utilisées pendant la partie.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            <SettingToggle
              label="Normal"
              description="Règles classiques"
              checked={normal}
              onChange={setNormal}
            />

            <SettingToggle
              label="Deux couleurs"
              description="Palette limitée"
              checked={twoColors}
              onChange={setTwoColors}
            />

            <SettingToggle
              label="Un seul trait"
              description="Impossible de relâcher"
              checked={oneStroke}
              onChange={setOneStroke}
            />

            <SettingToggle
              label="Souris inversée"
              description="Mouvements inversés"
              checked={reverseMouse}
              onChange={setReverseMouse}
            />

            <SettingToggle
              label="Speed Draw"
              description="Temps réduit"
              checked={speedDraw}
              onChange={setSpeedDraw}
            />

            <SettingToggle
              label="Dessin à l'aveugle"
              description="Le canvas disparaît"
              checked={blindDraw}
              onChange={setBlindDraw}
            />

            <SettingToggle
              label="Canvas partagé"
              description="Plusieurs joueurs, un canvas"
              checked={sharedCanvas}
              onChange={setSharedCanvas}
            />
          </div>
        </div>

        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="
              rounded-xl
              border
              border-white/10
              bg-white/5
              px-5
              py-3
              font-semibold
              text-[#c7c9d8]
              transition
              hover:bg-white/10
              hover:text-white
            "
          >
            Annuler
          </button>

          <button
            type="button"
            onClick={saveSettings}
            className="
              rounded-xl
              bg-[#36d8ff]
              px-6
              py-3
              font-bold
              text-[#10131c]
              transition
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

type SettingToggleProps = {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
};

function SettingToggle({
  label,
  description,
  checked,
  onChange,
}: SettingToggleProps) {
  return (
    <label
      className={`
        flex
        cursor-pointer
        items-center
        justify-between
        gap-4
        rounded-2xl
        border
        p-4
        transition
        ${
          checked
            ? 'border-[#9b5cff]/40 bg-[#9b5cff]/10'
            : 'border-white/10 bg-white/5'
        }
      `}
    >
      <div className="text-left">
        <p className="font-semibold text-white">
          {label}
        </p>

        <p className="text-xs text-[#8d91a5]">
          {description}
        </p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onChange(event.target.checked)
        }
        className="
          h-5
          w-5
          cursor-pointer
          accent-[#9b5cff]
        "
      />
    </label>
  );
}