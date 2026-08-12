import {
  useEffect,
  useRef,
  useState,
} from 'react';

import type {
  MouseEvent as ReactMouseEvent,
} from 'react';

type AvatarCanvasProps = {
  onCanvasReady: (
    getImage: () => string,
  ) => void;
};

export default function AvatarCanvas({
  onCanvasReady,
}: AvatarCanvasProps) {
  const canvasRef =
    useRef<HTMLCanvasElement | null>(null);

  const [drawing, setDrawing] =
    useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context =
      canvas.getContext('2d');

    if (!context) return;

    context.fillStyle = 'white';

    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 6;
    context.strokeStyle = '#111111';

    onCanvasReady(() =>
      canvas.toDataURL('image/png'),
    );
  }, [onCanvasReady]);

  const getCoordinates = (
    event: ReactMouseEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;

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
        (event.clientX - rect.left) *
        (canvas.width / rect.width),

      y:
        (event.clientY - rect.top) *
        (canvas.height / rect.height),
    };
  };

  const startDrawing = (
    event: ReactMouseEvent<HTMLCanvasElement>,
  ) => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context =
      canvas.getContext('2d');

    if (!context) return;

    const { x, y } =
      getCoordinates(event);

    context.beginPath();
    context.moveTo(x, y);

    setDrawing(true);
  };

  const draw = (
    event: ReactMouseEvent<HTMLCanvasElement>,
  ) => {
    if (!drawing) return;

    const canvas = canvasRef.current;

    if (!canvas) return;

    const context =
      canvas.getContext('2d');

    if (!context) return;

    const { x, y } =
      getCoordinates(event);

    context.lineTo(x, y);
    context.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const context =
      canvas.getContext('2d');

    if (!context) return;

    context.clearRect(
      0,
      0,
      canvas.width,
      canvas.height,
    );

    context.fillStyle = 'white';

    context.fillRect(
      0,
      0,
      canvas.width,
      canvas.height,
    );
  };

  return (
    <div className="w-full">
      <div
        className="
          mx-auto
          aspect-square
          w-full
          max-w-sm
          overflow-hidden
          rounded-3xl
          border-4
          border-[#9b5cff]/50
          bg-white
          shadow-2xl
        "
      >
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="
            block
            h-full
            w-full
            cursor-crosshair
            bg-white
          "
        />
      </div>

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={clearCanvas}
          className="
            rounded-xl
            border
            border-white/10
            bg-white/5
            px-4
            py-2
            text-sm
            font-semibold
            text-[#c7c9d8]
            transition
            hover:bg-white/10
            hover:text-white
          "
        >
          Effacer
        </button>
      </div>
    </div>
  );
}