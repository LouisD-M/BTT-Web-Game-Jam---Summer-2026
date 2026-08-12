import BrushSizePicker from './BrushSizePicker';
import ColorPalette from './ColorPalette';
import OpacityPicker from './OpacityPicker';
import ShapeOptions from './ShapeOptions';
import ToolButton from './ToolButton';

import type {
  GameModifier,
} from '../../../types/game-settings';

import type {
  DrawingTool,
} from './types';

type DrawingToolbarProps = {
  mode?: 'game' | 'avatar';

  modifier?: GameModifier;

  tool: DrawingTool;

  color: string;

  brushSize: number;

  opacity: number;

  filled: boolean;

  canUndo: boolean;

  canRedo: boolean;

  onToolChange: (
    tool: DrawingTool,
  ) => void;

  onColorChange: (
    color: string,
  ) => void;

  onBrushSizeChange: (
    size: number,
  ) => void;

  onOpacityChange: (
    opacity: number,
  ) => void;

  onFilledChange: (
    value: boolean,
  ) => void;

  onUndo: () => void;

  onRedo: () => void;

  onClear: () => void;
};

export default function DrawingToolbar({
  mode = 'game',
  modifier = 'normal',
  tool,
  color,
  brushSize,
  opacity,
  filled,
  canUndo,
  canRedo,
  onToolChange,
  onColorChange,
  onBrushSizeChange,
  onOpacityChange,
  onFilledChange,
  onUndo,
  onRedo,
  onClear,
}: DrawingToolbarProps) {
  const isAvatar =
    mode === 'avatar';

  const isOneStroke =
    mode === 'game' &&
    modifier ===
      'oneStroke';

  const isTwoColors =
    mode === 'game' &&
    modifier ===
      'twoColors';

  const shapeTool =
    tool ===
      'rectangle' ||
    tool ===
      'circle';

  return (
    <div
      className="
        mb-4
        overflow-hidden
        rounded-3xl
        border
        border-[#9b5cff]/40
        bg-[#11131f]/95
        shadow-xl
        backdrop-blur-md
      "
    >
      {/* RÈGLE SPÉCIALE */}

      {isTwoColors && (
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            border-b
            border-[#9b5cff]/20
            bg-[#9b5cff]/10
            px-4
            py-3
          "
        >
          <div>
            <p
              className="
                text-sm
                font-bold
                text-white
              "
            >
              🎨 Deux couleurs
            </p>

            <p
              className="
                text-xs
                text-[#a5a8b8]
              "
            >
              Seulement noir et
              violet sont disponibles
              pendant cette manche.
            </p>
          </div>

          <span
            className="
              rounded-full
              border
              border-[#9b5cff]/30
              bg-[#9b5cff]/10
              px-3
              py-1
              text-xs
              font-bold
              text-[#cdb8ff]
            "
          >
            MODE SPÉCIAL
          </span>
        </div>
      )}

      {/* OUTILS */}

      <div
        className="
          flex
          flex-wrap
          gap-2
          p-4
        "
      >
        <ToolButton
          label="✏️ Crayon"
          title="Crayon (B)"
          active={
            tool === 'pen'
          }
          disabled={
            isOneStroke &&
            tool !== 'pen'
          }
          onClick={() =>
            onToolChange(
              'pen',
            )
          }
        />

        <ToolButton
          label="🧽 Gomme"
          title="Gomme (E)"
          active={
            tool ===
            'eraser'
          }
          disabled={
            isOneStroke
          }
          onClick={() =>
            onToolChange(
              'eraser',
            )
          }
        />

        {!isAvatar && (
          <ToolButton
            label="📏 Ligne"
            title="Ligne (L)"
            active={
              tool === 'line'
            }
            disabled={
              isOneStroke
            }
            onClick={() =>
              onToolChange(
                'line',
              )
            }
          />
        )}

        <ToolButton
          label="▭ Rectangle"
          title="Rectangle (R)"
          active={
            tool ===
            'rectangle'
          }
          disabled={
            isOneStroke
          }
          onClick={() =>
            onToolChange(
              'rectangle',
            )
          }
        />

        <ToolButton
          label="○ Cercle"
          title="Cercle (C)"
          active={
            tool ===
            'circle'
          }
          disabled={
            isOneStroke
          }
          onClick={() =>
            onToolChange(
              'circle',
            )
          }
        />

        {!isAvatar && (
          <ToolButton
            label="➜ Flèche"
            title="Flèche (A)"
            active={
              tool ===
              'arrow'
            }
            disabled={
              isOneStroke
            }
            onClick={() =>
              onToolChange(
                'arrow',
              )
            }
          />
        )}

        <ToolButton
          label="💨 Spray"
          title="Spray"
          active={
            tool ===
            'spray'
          }
          disabled={
            isOneStroke
          }
          onClick={() =>
            onToolChange(
              'spray',
            )
          }
        />

        <ToolButton
          label="🖍 Surligneur"
          title="Surligneur"
          active={
            tool ===
            'highlighter'
          }
          disabled={
            isOneStroke
          }
          onClick={() =>
            onToolChange(
              'highlighter',
            )
          }
        />

        <ToolButton
          label="🪣 Remplir"
          title="Remplissage (F)"
          active={
            tool === 'fill'
          }
          disabled={
            isOneStroke
          }
          onClick={() =>
            onToolChange(
              'fill',
            )
          }
        />

        <ToolButton
          label="💧 Pipette"
          title="Pipette (I)"
          active={
            tool ===
            'eyedropper'
          }
          disabled={
            isOneStroke
          }
          onClick={() =>
            onToolChange(
              'eyedropper',
            )
          }
        />

        {!isAvatar && (
          <ToolButton
            label="🔤 Texte"
            title="Texte (T)"
            active={
              tool === 'text'
            }
            disabled={
              isOneStroke
            }
            onClick={() =>
              onToolChange(
                'text',
              )
            }
          />
        )}
      </div>

      {/* OPTIONS */}

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-x-6
          gap-y-4
          border-t
          border-white/10
          p-4
        "
      >
        <ColorPalette
          selectedColor={
            color
          }
          onColorChange={
            onColorChange
          }
          limited={
            isTwoColors
          }
        />

        <div
          className="
            hidden
            h-8
            w-px
            bg-white/10
            lg:block
          "
        />

        <BrushSizePicker
          value={
            brushSize
          }
          onChange={
            onBrushSizeChange
          }
        />

        <OpacityPicker
          value={
            opacity
          }
          onChange={
            onOpacityChange
          }
        />

        {shapeTool &&
          !isOneStroke && (
            <ShapeOptions
              filled={
                filled
              }
              onFilledChange={
                onFilledChange
              }
            />
          )}
      </div>

      {/* ACTIONS */}

      <div
        className="
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
          border-t
          border-white/10
          px-4
          py-3
        "
      >
        {!isAvatar ? (
          <p
            className="
              text-xs
              text-[#73778b]
            "
          >
            {isOneStroke
              ? '〰️ Un seul trait autorisé'
              : 'Ctrl+Z annuler · Ctrl+Y rétablir'}
          </p>
        ) : (
          <p
            className="
              text-xs
              text-[#73778b]
            "
          >
            Dessine ton avatar
          </p>
        )}

        <div className="flex gap-2">
          <ToolButton
            label="↶"
            title="Annuler"
            disabled={
              !canUndo ||
              isOneStroke
            }
            onClick={
              onUndo
            }
          />

          <ToolButton
            label="↷"
            title="Rétablir"
            disabled={
              !canRedo ||
              isOneStroke
            }
            onClick={
              onRedo
            }
          />

          <ToolButton
            label="🗑 Tout effacer"
            title={
              isOneStroke
                ? 'Impossible en mode Un seul trait'
                : 'Tout effacer'
            }
            disabled={
              isOneStroke
            }
            danger
            onClick={
              onClear
            }
          />
        </div>
      </div>
    </div>
  );
}