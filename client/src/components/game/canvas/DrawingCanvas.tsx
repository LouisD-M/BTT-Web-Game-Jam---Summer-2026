import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import type {
  GameModifier,
} from '../../../types/game-settings';

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

  modifier?: GameModifier;
};

const MODIFIER_LABELS: Record<
  GameModifier,
  string
> = {
  normal:
    '✏️ Normal',

  twoColors:
    '🎨 Deux couleurs',

  oneStroke:
    '〰️ Un seul trait',

  reverseMouse:
    '🔄 Souris inversée',

  speedDraw:
    '⚡ Speed Draw',

  blindDraw:
    "🙈 Dessin à l'aveugle",

  sharedCanvas:
    '👥 Canvas partagé',
};

export default function DrawingCanvas({
  onCanvasReady,
  mode = 'game',
  modifier = 'normal',
}: DrawingCanvasProps) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(
      null,
    );

  const isAvatar =
    mode === 'avatar';

  const isReverseMouse =
    mode === 'game' &&
    modifier ===
      'reverseMouse';

  const isOneStroke =
    mode === 'game' &&
    modifier ===
      'oneStroke';

  const isBlindDraw =
    mode === 'game' &&
    modifier ===
      'blindDraw';

  const canvasWidth =
    isAvatar
      ? 600
      : 1200;

  const canvasHeight =
    isAvatar
      ? 600
      : 700;

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
    useState(
      '#111111',
    );

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
    } | null>(
      null,
    );

  /*
   * =====================================================
   * COORDONNÉES
   * =====================================================
   */

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

        let x =
          (event.clientX -
            rect.left) *
          (canvas.width /
            rect.width);

        let y =
          (event.clientY -
            rect.top) *
          (canvas.height /
            rect.height);

        /*
         * SOURIS INVERSÉE
         *
         * Haut → bas
         * Gauche → droite
         */
        if (
          isReverseMouse
        ) {
          x =
            canvas.width -
            x;

          y =
            canvas.height -
            y;
        }

        return {
          x,
          y,
        };
      },
      [
        isReverseMouse,
      ],
    );

  /*
   * =====================================================
   * RENDER
   * =====================================================
   */

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
  }, [
    repaint,
  ]);

  /*
   * =====================================================
   * EXPORT PNG
   * =====================================================
   */

  useEffect(() => {
    onCanvasReady(
      () => {
        const canvas =
          canvasRef.current;

        if (!canvas) {
          return '';
        }

        /*
         * On exporte uniquement
         * les actions validées.
         */
        renderCanvas(
          canvas,
          actions,
          null,
        );

        return canvas.toDataURL(
          'image/png',
        );
      },
    );
  }, [
    actions,
    onCanvasReady,
  ]);

  /*
   * =====================================================
   * MODIFIER : ONE STROKE
   * =====================================================
   */

  useEffect(() => {
    if (
      !isOneStroke
    ) {
      return;
    }

    /*
     * Un seul trait doit être
     * réellement un trait.
     */
    setTool(
      'pen',
    );

    setFilled(
      false,
    );

    setOpacity(
      1,
    );

    setPendingText(
      null,
    );

    setTextModalOpen(
      false,
    );
  }, [
    isOneStroke,
  ]);

  /*
   * =====================================================
   * ACTIONS
   * =====================================================
   */

  const commitAction =
    useCallback(
      (
        action:
          DrawAction,
      ) => {
        setActions(
          (
            current,
          ) => [
            ...current,
            action,
          ],
        );

        setRedoStack(
          [],
        );
      },
      [],
    );

  const undo =
    useCallback(() => {
      /*
       * Impossible de tricher
       * en One Stroke.
       */
      if (
        isOneStroke
      ) {
        return;
      }

      setActions(
        (
          current,
        ) => {
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
            (
              redo,
            ) => [
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
    }, [
      isOneStroke,
    ]);

  const redo =
    useCallback(() => {
      if (
        isOneStroke
      ) {
        return;
      }

      setRedoStack(
        (
          current,
        ) => {
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
            (
              currentActions,
            ) => [
              ...currentActions,
              last,
            ],
          );

          return current.slice(
            0,
            -1,
          );
        },
      );
    }, [
      isOneStroke,
    ]);

  const clear =
    useCallback(() => {
      if (
        isOneStroke
      ) {
        return;
      }

      setActions(
        [],
      );

      setRedoStack(
        [],
      );

      setCurrentAction(
        null,
      );
    }, [
      isOneStroke,
    ]);

  /*
   * =====================================================
   * RACCOURCIS CLAVIER
   * =====================================================
   */

  useEffect(() => {
    const handleKeyDown = (
      event:
        KeyboardEvent,
    ) => {
      const target =
        event.target as
          HTMLElement;

      if (
        target.tagName ===
          'INPUT' ||
        target.tagName ===
          'TEXTAREA'
      ) {
        return;
      }

      /*
       * CTRL + Z
       */
      if (
        (
          event.ctrlKey ||
          event.metaKey
        ) &&
        event.key.toLowerCase() ===
          'z'
      ) {
        event.preventDefault();

        if (
          isOneStroke
        ) {
          return;
        }

        if (
          event.shiftKey
        ) {
          redo();
        } else {
          undo();
        }

        return;
      }

      /*
       * CTRL + Y
       */
      if (
        (
          event.ctrlKey ||
          event.metaKey
        ) &&
        event.key.toLowerCase() ===
          'y'
      ) {
        event.preventDefault();

        if (
          isOneStroke
        ) {
          return;
        }

        redo();

        return;
      }

      /*
       * One Stroke :
       * aucun changement
       * d'outil autorisé.
       */
      if (
        isOneStroke
      ) {
        return;
      }

      switch (
        event.key.toLowerCase()
      ) {
        case 'b':
          setTool(
            'pen',
          );
          break;

        case 'e':
          setTool(
            'eraser',
          );
          break;

        case 'l':
          if (
            mode !==
            'avatar'
          ) {
            setTool(
              'line',
            );
          }

          break;

        case 'r':
          setTool(
            'rectangle',
          );
          break;

        case 'c':
          setTool(
            'circle',
          );
          break;

        case 'a':
          if (
            mode !==
            'avatar'
          ) {
            setTool(
              'arrow',
            );
          }

          break;

        case 'f':
          setTool(
            'fill',
          );
          break;

        case 'i':
          setTool(
            'eyedropper',
          );
          break;

        case 't':
          if (
            mode !==
            'avatar'
          ) {
            setTool(
              'text',
            );
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
    isOneStroke,
  ]);

  /*
   * =====================================================
   * EYEDROPPER
   * =====================================================
   */

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

    setTool(
      'pen',
    );
  };

  /*
   * =====================================================
   * SPRAY
   * =====================================================
   */

  const createSprayPoints = (
    center: Point,
  ) => {
    const points:
      Point[] =
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
          brushSize *
            1.5,
        ),
      );

    for (
      let index = 0;
      index <
      quantity;
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

  /*
   * =====================================================
   * POINTER DOWN
   * =====================================================
   */

  const handlePointerDown = (
    event:
      React.PointerEvent<HTMLCanvasElement>,
  ) => {
    const canvas =
      canvasRef.current;

    if (!canvas) {
      return;
    }

    /*
     * ONE STROKE :
     *
     * Une action a déjà
     * été enregistrée.
     */
    if (
      isOneStroke &&
      actions.length >
        0
    ) {
      return;
    }

    /*
     * Empêche un deuxième
     * pointer pendant qu'un
     * dessin est déjà actif.
     */
    if (
      currentAction
    ) {
      return;
    }

    canvas.setPointerCapture(
      event.pointerId,
    );

    const point =
      getCoordinates(
        event,
      );

    /*
     * PIPETTE
     */
    if (
      tool ===
      'eyedropper'
    ) {
      useEyedropper(
        point,
      );

      return;
    }

    /*
     * REMPLISSAGE
     */
    if (
      tool === 'fill'
    ) {
      commitAction({
        id:
          createId(),

        tool:
          'fill',

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

    /*
     * TEXTE
     */
    if (
      tool === 'text'
    ) {
      if (
        pendingText
      ) {
        commitAction({
          id:
            createId(),

          tool:
            'text',

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
        : [
            point,
          ];

    setCurrentAction({
      id:
        createId(),

      tool,

      color,

      size:
        brushSize,

      opacity,

      points:
        firstPoints,

      filled,
    });

    setRedoStack(
      [],
    );
  };

  /*
   * =====================================================
   * POINTER MOVE
   * =====================================================
   */

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
      (
        current,
      ) => {
        if (!current) {
          return null;
        }

        /*
         * SPRAY
         */
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

        /*
         * FORMES
         */
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

        /*
         * CRAYON /
         * GOMME /
         * SURLIGNEUR
         */
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

  /*
   * =====================================================
   * POINTER UP
   * =====================================================
   */

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

  /*
   * =====================================================
   * TOOL CHANGE
   * =====================================================
   */

  const handleToolChange = (
    nextTool:
      DrawingTool,
  ) => {
    if (
      isOneStroke
    ) {
      setTool(
        'pen',
      );

      return;
    }

    setTool(
      nextTool,
    );

    if (
      nextTool ===
      'text'
    ) {
      setTextModalOpen(
        true,
      );
    }
  };

  /*
   * =====================================================
   * COLOR CHANGE
   * =====================================================
   */

  const handleColorChange = (
    nextColor:
      string,
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
      setTool(
        'pen',
      );
    }
  };

  /*
   * =====================================================
   * UI
   * =====================================================
   */

  return (
    <>
      <div className="w-full">
        <DrawingToolbar
          mode={
            mode
          }
          modifier={modifier}
          tool={
            tool
          }
          color={
            color
          }
          brushSize={
            brushSize
          }
          opacity={
            opacity
          }
          filled={
            filled
          }
          canUndo={
            !isOneStroke &&
            actions.length >
              0
          }
          canRedo={
            !isOneStroke &&
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
          onUndo={
            undo
          }
          onRedo={
            redo
          }
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
                ? `
                  mx-auto
                  max-w-lg
                `
                : `
                  w-full
                `
            }
          `}
        >
          {/* MODIFIER COURANT */}

          {mode ===
            'game' &&
            modifier !==
              'normal' && (
              <div
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-3
                  z-30
                  rounded-full
                  border
                  border-[#9b5cff]/40
                  bg-[#11131f]/90
                  px-4
                  py-2
                  text-xs
                  font-bold
                  text-white
                  shadow-lg
                  backdrop-blur
                "
              >
                {
                  MODIFIER_LABELS[
                    modifier
                  ]
                }
              </div>
            )}

          {/* MODE AVEUGLE */}

          {isBlindDraw && (
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                z-20
                flex
                items-center
                justify-center
              "
            >
              <div
                className="
                  max-w-sm
                  rounded-3xl
                  border
                  border-[#9b5cff]/30
                  bg-white/90
                  px-8
                  py-6
                  text-center
                  shadow-2xl
                  backdrop-blur-sm
                "
              >
                <div className="text-5xl">
                  🙈
                </div>

                <p
                  className="
                    mt-3
                    text-xl
                    font-black
                    text-[#202335]
                  "
                >
                  Dessine à
                  l'aveugle
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    text-[#686c7f]
                  "
                >
                  Ton dessin est
                  enregistré, mais
                  tu ne peux pas le
                  voir.
                </p>
              </div>
            </div>
          )}

          <canvas
            ref={
              canvasRef
            }
            width={
              canvasWidth
            }
            height={
              canvasHeight
            }
            onPointerDown={
              handlePointerDown
            }
            onPointerMove={
              handlePointerMove
            }
            onPointerUp={
              handlePointerUp
            }
            onPointerCancel={
              handlePointerUp
            }
            onContextMenu={(
              event,
            ) =>
              event.preventDefault()
            }
            className={`
              block
              w-full
              bg-white
              touch-none
              select-none
              pointer-events-auto
              transition-opacity
              duration-300

              ${
                isAvatar
                  ? 'aspect-square'
                  : 'aspect-[12/7]'
              }

              ${
                isBlindDraw
                  ? 'opacity-0'
                  : 'opacity-100'
              }

              ${
                tool ===
                'fill'
                  ? 'cursor-cell'
                  : tool ===
                      'eyedropper'
                    ? 'cursor-copy'
                    : 'cursor-crosshair'
              }
            `}
          />

          {/* OUTIL COURANT */}

          {!isBlindDraw && (
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
                }[
                  tool
                ]
              }
            </div>
          )}

          {/* INFO ONE STROKE */}

          {isOneStroke &&
            actions.length >
              0 && (
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-x-0
                  bottom-4
                  flex
                  justify-center
                "
              >
                <div
                  className="
                    rounded-full
                    bg-[#11131f]/90
                    px-5
                    py-2
                    text-sm
                    font-bold
                    text-white
                    shadow-xl
                  "
                >
                  〰️ Trait terminé !
                </div>
              </div>
            )}
        </div>
      </div>

      {textModalOpen &&
        !isOneStroke && (
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