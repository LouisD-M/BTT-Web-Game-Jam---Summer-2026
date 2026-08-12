import {
  useState,
} from 'react';

import {
  socket,
} from '../../socket/socket';

import type {
  GameModifier,
  GameSettings,
} from '../../types/game-settings';

type GameSettingsModalProps = {
  lobbyCode: string;

  initialSettings?: GameSettings;

  onClose: () => void;
};

type ModifierDefinition = {
  id: GameModifier;

  label: string;

  description: string;

  emoji: string;
};

const MODIFIERS: ModifierDefinition[] = [
  {
    id: 'normal',
    label: 'Normal',
    description:
      'Règles classiques',
    emoji: '✏️',
  },

  {
    id: 'twoColors',
    label: 'Deux couleurs',
    description:
      'Seulement deux couleurs disponibles',
    emoji: '🎨',
  },

  {
    id: 'oneStroke',
    label: 'Un seul trait',
    description:
      'Une fois le crayon levé, terminé',
    emoji: '〰️',
  },

  {
    id: 'reverseMouse',
    label: 'Souris inversée',
    description:
      'Tes mouvements sont inversés',
    emoji: '🔄',
  },

  {
    id: 'speedDraw',
    label: 'Speed Draw',
    description:
      'Seulement 10 secondes pour dessiner',
    emoji: '⚡',
  },

  {
    id: 'blindDraw',
    label: "Dessin à l'aveugle",
    description:
      'Ton dessin devient invisible pendant la manche',
    emoji: '🙈',
  },

  {
    id: 'sharedCanvas',
    label: 'Canvas partagé',
    description:
      'Tous les joueurs dessinent ensemble',
    emoji: '👥',
  },
];

export default function GameSettingsModal({
  lobbyCode,
  initialSettings,
  onClose,
}: GameSettingsModalProps) {
  const [
    rounds,
    setRounds,
  ] =
    useState(
      initialSettings?.rounds ??
        5,
    );

  const [
    drawingTime,
    setDrawingTime,
  ] =
    useState(
      initialSettings
        ?.drawingTime ??
        30,
    );

  const [
    modifiers,
    setModifiers,
  ] =
    useState<
      GameModifier[]
    >(
      initialSettings
        ?.modifiers ??
        ['normal'],
    );

  const toggleModifier = (
    modifier:
      GameModifier,
  ) => {
    setModifiers(
      (current) => {
        if (
          current.includes(
            modifier,
          )
        ) {
          /*
           * Toujours au moins
           * une règle active.
           */
          if (
            current.length ===
            1
          ) {
            return current;
          }

          return current.filter(
            (item) =>
              item !==
              modifier,
          );
        }

        return [
          ...current,
          modifier,
        ];
      },
    );
  };

  const saveSettings =
    () => {
      socket.emit(
        'settings:update',
        {
          code:
            lobbyCode,

          settings: {
            rounds,
            drawingTime,
            modifiers,
          },
        },
      );

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
          max-h-[95vh]
          w-full
          max-w-3xl
          overflow-y-auto
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
              Choisis les règles qui
              pourront apparaître pendant
              les manches.
            </p>
          </div>

          <button
            type="button"
            onClick={
              onClose
            }
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
              value={
                rounds
              }
              onChange={(
                event,
              ) =>
                setRounds(
                  Number(
                    event
                      .target
                      .value,
                  ),
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
              "
            >
              <option value={3}>
                3 manches
              </option>

              <option value={5}>
                5 manches
              </option>

              <option value={7}>
                7 manches
              </option>

              <option value={10}>
                10 manches
              </option>
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
              value={
                drawingTime
              }
              onChange={(
                event,
              ) =>
                setDrawingTime(
                  Number(
                    event
                      .target
                      .value,
                  ),
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
              "
            >
              <option value={10}>
                10 secondes
              </option>

              <option value={20}>
                20 secondes
              </option>

              <option value={30}>
                30 secondes
              </option>

              <option value={45}>
                45 secondes
              </option>

              <option value={60}>
                60 secondes
              </option>
            </select>
          </div>
        </div>

        <div className="my-6 h-px bg-white/10" />

        <div>
          <h3 className="mb-1 text-lg font-bold text-white">
            Règles disponibles
          </h3>

          <p className="mb-4 text-sm text-[#8d91a5]">
            Une règle active sera tirée au
            sort au début de chaque manche.
          </p>

          <div className="grid gap-3 md:grid-cols-2">
            {MODIFIERS.map(
              (
                modifier,
              ) => (
                <SettingToggle
                  key={
                    modifier.id
                  }
                  emoji={
                    modifier.emoji
                  }
                  label={
                    modifier.label
                  }
                  description={
                    modifier.description
                  }
                  checked={modifiers.includes(
                    modifier.id,
                  )}
                  onChange={() =>
                    toggleModifier(
                      modifier.id,
                    )
                  }
                />
              ),
            )}
          </div>
        </div>

        <div
          className="
            mt-7
            flex
            flex-col-reverse
            gap-3
            sm:flex-row
            sm:justify-end
          "
        >
          <button
            type="button"
            onClick={
              onClose
            }
            className="
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
            onClick={
              saveSettings
            }
            className="
              rounded-xl
              bg-[#36d8ff]
              px-6
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

type SettingToggleProps = {
  emoji: string;

  label: string;

  description: string;

  checked: boolean;

  onChange: () => void;
};

function SettingToggle({
  emoji,
  label,
  description,
  checked,
  onChange,
}: SettingToggleProps) {
  return (
    <button
      type="button"
      onClick={
        onChange
      }
      className={`
        flex
        items-center
        justify-between
        gap-4
        rounded-2xl
        border
        p-4
        text-left
        transition

        ${
          checked
            ? `
              border-[#9b5cff]/60
              bg-[#9b5cff]/15
            `
            : `
              border-white/10
              bg-white/5
              hover:bg-white/10
            `
        }
      `}
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">
          {emoji}
        </div>

        <div>
          <p className="font-semibold text-white">
            {label}
          </p>

          <p className="text-xs text-[#8d91a5]">
            {description}
          </p>
        </div>
      </div>

      <div
        className={`
          flex
          h-6
          w-6
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          text-xs

          ${
            checked
              ? `
                border-[#9b5cff]
                bg-[#9b5cff]
                text-white
              `
              : `
                border-white/20
                text-transparent
              `
          }
        `}
      >
        ✓
      </div>
    </button>
  );
}