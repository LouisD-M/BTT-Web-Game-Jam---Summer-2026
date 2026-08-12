import BrushSizePicker from './BrushSizePicker';
import ColorPalette from './ColorPalette';
import OpacityPicker from './OpacityPicker';
import ShapeOptions from './ShapeOptions';
import ToolButton from './ToolButton';

import type {
  DrawingTool,
} from './types';

type DrawingToolbarProps = {
  mode?: 'game' | 'avatar';

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

  const shapeTool =
    tool === 'rectangle' ||
    tool === 'circle';

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
      {/* OUTILS */}
      <div className="flex flex-wrap gap-2 p-4">
        <ToolButton
          label="✏️ Crayon"
          title="Crayon (B)"
          active={tool === 'pen'}
          onClick={() =>
            onToolChange('pen')
          }
        />

        <ToolButton
          label="🧽 Gomme"
          title="Gomme (E)"
          active={
            tool === 'eraser'
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
            tool === 'circle'
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
              tool === 'arrow'
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
            tool === 'spray'
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
        />

        <div className="hidden h-8 w-px bg-white/10 lg:block" />

        <BrushSizePicker
          value={
            brushSize
          }
          onChange={
            onBrushSizeChange
          }
        />

        <OpacityPicker
          value={opacity}
          onChange={
            onOpacityChange
          }
        />

        {shapeTool && (
          <ShapeOptions
            filled={filled}
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
          <p className="text-xs text-[#73778b]">
            Ctrl+Z annuler ·
            Ctrl+Y rétablir
          </p>
        ) : (
          <p className="text-xs text-[#73778b]">
            Dessine ton avatar
          </p>
        )}

        <div className="flex gap-2">
          <ToolButton
            label="↶"
            title="Annuler"
            disabled={
              !canUndo
            }
            onClick={
              onUndo
            }
          />

          <ToolButton
            label="↷"
            title="Rétablir"
            disabled={
              !canRedo
            }
            onClick={
              onRedo
            }
          />

          <ToolButton
            label="🗑 Tout effacer"
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