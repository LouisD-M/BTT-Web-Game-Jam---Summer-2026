import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import DrawingToolbar from './DrawingToolbar';
import TextToolModal from './TextToolModal';

import {
  createId,
  rgbToHex,
} from './canvasUtils';

import {
  renderCanvas,
} from './canvasRenderer';

import type {
  DrawAction,
  DrawingTool,
  Point,
} from './types';

type DrawingCanvasProps = {
  onCanvasReady: (
    getImage: () => string,
  ) => void;

  mode?: 'game' | 'avatar';
};

export default function DrawingCanvas({
  onCanvasReady,
  mode = 'game',
}: DrawingCanvasProps) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null,
    );

    const isAvatar =
  mode === 'avatar';

const canvasWidth =
  isAvatar ? 600 : 1200;

const canvasHeight =
  isAvatar ? 600 : 700;
    

  const [
    tool,
    setTool,
  ] =
    useState<DrawingTool>(
      'pen',
    );

  const [
    color,
    setColor,
  ] =
    useState('#111111');

  const [
    brushSize,
    setBrushSize,
  ] =
    useState(7);

  const [
    opacity,
    setOpacity,
  ] =
    useState(1);

  const [
    filled,
    setFilled,
  ] =
    useState(false);

  const [
    actions,
    setActions,
  ] =
    useState<
      DrawAction[]
    >([]);

  const [
    redoStack,
    setRedoStack,
  ] =
    useState<
      DrawAction[]
    >([]);

  const [
    currentAction,
    setCurrentAction,
  ] =
    useState<
      DrawAction | null
    >(null);

  const [
    textModalOpen,
    setTextModalOpen,
  ] =
    useState(false);

  const [
    pendingText,
    setPendingText,
  ] =
    useState<{
      text: string;
      fontSize: number;
    } | null>(null);

  const getCoordinates =
    useCallback(
      (
        event:
          React.PointerEvent<HTMLCanvasElement>,
      ): Point => {
        const canvas =
          canvasRef.current;

        if (!canvas) {
          return {
            x: 0,
            y: 0,
          };
        }

        const rect =
          canvas.getBoundingClientRect();

        return {
          x:
            (event.clientX -
              rect.left) *
            (canvas.width /
              rect.width),

          y:
            (event.clientY -
              rect.top) *
            (canvas.height /
              rect.height),
        };
      },
      [],
    );

  const repaint =
    useCallback(() => {
      const canvas =
        canvasRef.current;

      if (!canvas) {
        return;
      }

      renderCanvas(
        canvas,
        actions,
        currentAction,
      );
    }, [
      actions,
      currentAction,
    ]);

  useEffect(() => {
    repaint();
  }, [repaint]);

  useEffect(() => {
    onCanvasReady(() => {
      const canvas =
        canvasRef.current;

      if (!canvas) {
        return '';
      }

      renderCanvas(
        canvas,
        actions,
        null,
      );

      return canvas.toDataURL(
        'image/png',
      );
    });
  }, [
    actions,
    onCanvasReady,
  ]);

  const commitAction =
    useCallback(
      (
        action:
          DrawAction,
      ) => {
        setActions(
          (current) => [
            ...current,
            action,
          ],
        );

        setRedoStack([]);
      },
      [],
    );

  const undo =
    useCallback(() => {
      setActions(
        (current) => {
          if (
            current.length ===
            0
          ) {
            return current;
          }

          const last =
            current[
              current.length -
                1
            ];

          setRedoStack(
            (redo) => [
              ...redo,
              last,
            ],
          );

          return current.slice(
            0,
            -1,
          );
        },
      );
    }, []);

  const redo =
    useCallback(() => {
      setRedoStack(
        (current) => {
          if (
            current.length ===
            0
          ) {
            return current;
          }

          const last =
            current[
              current.length -
                1
            ];

          setActions(
            (actions) => [
              ...actions,
              last,
            ],
          );

          return current.slice(
            0,
            -1,
          );
        },
      );
    }, []);

  const clear =
    useCallback(() => {
      setActions([]);
      setRedoStack([]);
      setCurrentAction(
        null,
      );
    }, []);

useEffect(() => {
  const handleKeyDown = (
    event: KeyboardEvent,
  ) => {
    const target =
      event.target as HTMLElement;

    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA'
    ) {
      return;
    }

    if (
      (event.ctrlKey ||
        event.metaKey) &&
      event.key.toLowerCase() === 'z'
    ) {
      event.preventDefault();

      if (event.shiftKey) {
        redo();
      } else {
        undo();
      }

      return;
    }

    if (
      (event.ctrlKey ||
        event.metaKey) &&
      event.key.toLowerCase() === 'y'
    ) {
      event.preventDefault();

      redo();

      return;
    }

    switch (
      event.key.toLowerCase()
    ) {
      case 'b':
        setTool('pen');
        break;

      case 'e':
        setTool('eraser');
        break;

      case 'l':
        if (mode !== 'avatar') {
          setTool('line');
        }
        break;

      case 'r':
        setTool('rectangle');
        break;

      case 'c':
        setTool('circle');
        break;

      case 'a':
        if (mode !== 'avatar') {
          setTool('arrow');
        }
        break;

      case 'f':
        setTool('fill');
        break;

      case 'i':
        setTool('eyedropper');
        break;

      case 't':
        if (mode !== 'avatar') {
          setTool('text');
        }
        break;
    }
  };

  window.addEventListener(
    'keydown',
    handleKeyDown,
  );

  return () =>
    window.removeEventListener(
      'keydown',
      handleKeyDown,
    );
}, [
  redo,
  undo,
  mode,
]);

  const useEyedropper = (
    point: Point,
  ) => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    const context =
      canvas.getContext(
        '2d',
        {
          willReadFrequently:
            true,
        },
      );

    if (!context) {
      return;
    }

    const pixel =
      context.getImageData(
        Math.floor(
          point.x,
        ),
        Math.floor(
          point.y,
        ),
        1,
        1,
      ).data;

    const pickedColor =
      rgbToHex(
        pixel[0],
        pixel[1],
        pixel[2],
      );

    setColor(
      pickedColor,
    );

    setTool('pen');
  };

  const createSprayPoints = (
    center: Point,
  ) => {
    const points: Point[] =
      [];

    const radius =
      Math.max(
        10,
        brushSize * 2,
      );

    const quantity =
      Math.max(
        10,
        Math.round(
          brushSize * 1.5,
        ),
      );

    for (
      let index = 0;
      index < quantity;
      index += 1
    ) {
      const angle =
        Math.random() *
        Math.PI *
        2;

      const randomRadius =
        Math.sqrt(
          Math.random(),
        ) * radius;

      points.push({
        x:
          center.x +
          Math.cos(
            angle,
          ) *
            randomRadius,

        y:
          center.y +
          Math.sin(
            angle,
          ) *
            randomRadius,
      });
    }

    return points;
  };

  const handlePointerDown = (
    event:
      React.PointerEvent<HTMLCanvasElement>,
  ) => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    canvas.setPointerCapture(
      event.pointerId,
    );

    const point =
      getCoordinates(
        event,
      );

    if (
      tool ===
      'eyedropper'
    ) {
      useEyedropper(
        point,
      );

      return;
    }

    if (
      tool === 'fill'
    ) {
      commitAction({
        id: createId(),

        tool: 'fill',

        color,

        size:
          brushSize,

        opacity,

        points: [
          point,
        ],
      });

      return;
    }

    if (
      tool === 'text'
    ) {
      if (pendingText) {
        commitAction({
          id: createId(),

          tool: 'text',

          color,

          size:
            brushSize,

          opacity,

          points: [
            point,
          ],

          text:
            pendingText.text,

          fontSize:
            pendingText.fontSize,
        });

        setPendingText(
          null,
        );

        return;
      }

      setTextModalOpen(
        true,
      );

      return;
    }

    const firstPoints =
      tool ===
      'spray'
        ? createSprayPoints(
            point,
          )
        : [point];

    setCurrentAction({
      id: createId(),

      tool,

      color,

      size:
        brushSize,

      opacity,

      points:
        firstPoints,

      filled,
    });

    setRedoStack([]);
  };

  const handlePointerMove = (
    event:
      React.PointerEvent<HTMLCanvasElement>,
  ) => {
    if (
      !currentAction
    ) {
      return;
    }

    const point =
      getCoordinates(
        event,
      );

    setCurrentAction(
      (current) => {
        if (!current) {
          return null;
        }

        if (
          current.tool ===
          'spray'
        ) {
          return {
            ...current,

            points: [
              ...current.points,
              ...createSprayPoints(
                point,
              ),
            ],
          };
        }

        if (
          current.tool ===
            'line' ||
          current.tool ===
            'rectangle' ||
          current.tool ===
            'circle' ||
          current.tool ===
            'arrow'
        ) {
          return {
            ...current,

            points: [
              current
                .points[0],
              point,
            ],
          };
        }

        return {
          ...current,

          points: [
            ...current.points,
            point,
          ],
        };
      },
    );
  };

  const handlePointerUp = (
    event:
      React.PointerEvent<HTMLCanvasElement>,
  ) => {
    const canvas =
      canvasRef.current;

    if (
      canvas?.hasPointerCapture(
        event.pointerId,
      )
    ) {
      canvas.releasePointerCapture(
        event.pointerId,
      );
    }

    if (
      !currentAction
    ) {
      return;
    }

    commitAction(
      currentAction,
    );

    setCurrentAction(
      null,
    );
  };

  const handleToolChange = (
    nextTool:
      DrawingTool,
  ) => {
    setTool(
      nextTool,
    );

    if (
      nextTool === 'text'
    ) {
      setTextModalOpen(
        true,
      );
    }
  };

  const handleColorChange = (
    nextColor: string,
  ) => {
    setColor(
      nextColor,
    );

    if (
      tool ===
      'eraser' ||
      tool ===
      'eyedropper'
    ) {
      setTool('pen');
    }
  };

  return (
    <>
      <div className="w-full">
        <DrawingToolbar
            mode={mode}
          tool={tool}
          color={color}
          brushSize={
            brushSize
          }
          opacity={opacity}
          filled={filled}
          canUndo={
            actions.length >
            0
          }
          canRedo={
            redoStack.length >
            0
          }
          onToolChange={
            handleToolChange
          }
          onColorChange={
            handleColorChange
          }
          onBrushSizeChange={
            setBrushSize
          }
          onOpacityChange={
            setOpacity
          }
          onFilledChange={
            setFilled
          }
          onUndo={undo}
          onRedo={redo}
          onClear={
            clear
          }
        />

<div
  className={`
    relative
    overflow-hidden
    rounded-3xl
    border-4
    border-[#9b5cff]/50
    bg-white
    shadow-2xl
    shadow-black/40
    pointer-events-auto

    ${
      isAvatar
        ? 'mx-auto max-w-lg'
        : 'w-full'
    }
  `}
>
<canvas
  ref={canvasRef}
  width={canvasWidth}
  height={canvasHeight}
  onPointerDown={handlePointerDown}
  onPointerMove={handlePointerMove}
  onPointerUp={handlePointerUp}
  onPointerCancel={handlePointerUp}
  onContextMenu={(event) =>
    event.preventDefault()
  }
  className={`
    block
    w-full
    bg-white
    touch-none
    select-none
    pointer-events-auto

    ${
      isAvatar
        ? 'aspect-square'
        : 'aspect-[12/7]'
    }

    ${
      tool === 'fill'
        ? 'cursor-cell'
        : tool === 'eyedropper'
        ? 'cursor-copy'
        : 'cursor-crosshair'
    }
  `}
/>

          <div
            className="
              pointer-events-none
              absolute
              bottom-3
              left-3
              rounded-full
              border
              border-black/10
              bg-white/80
              px-3
              py-1
              text-xs
              font-semibold
              text-[#202335]
              shadow-sm
              backdrop-blur
            "
          >
            {
              {
                pen:
                  '✏️ Crayon',
                eraser:
                  '🧽 Gomme',
                line:
                  '📏 Ligne',
                rectangle:
                  '▭ Rectangle',
                circle:
                  '○ Cercle',
                arrow:
                  '➜ Flèche',
                spray:
                  '💨 Spray',
                highlighter:
                  '🖍 Surligneur',
                fill:
                  '🪣 Remplissage',
                eyedropper:
                  '💧 Pipette',
                text:
                  '🔤 Texte',
              }[tool]
            }
          </div>
        </div>
      </div>

      {textModalOpen && (
        <TextToolModal
          onCancel={() => {
            setTextModalOpen(
              false,
            );

            setTool(
              'pen',
            );
          }}
          onSubmit={(
            text,
            fontSize,
          ) => {
            setPendingText({
              text,
              fontSize,
            });

            setTextModalOpen(
              false,
            );

            setTool(
              'text',
            );
          }}
        />
      )}
    </>
  );
}