import {
  useEffect,
  useRef,
  useState,
} from 'react';

import type {
  MouseEvent as ReactMouseEvent,
} from 'react';

type DrawingCanvasProps = {
  onCanvasReady: (
    getImage: () => string,
  ) => void;
};

export default function DrawingCanvas({
  onCanvasReady,
}: DrawingCanvasProps) {
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
    context.lineWidth = 4;
    context.strokeStyle = 'black';

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
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={500}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        style={{
          border: '1px solid black',
          width: '100%',
          maxWidth: '800px',
          backgroundColor: 'white',
          cursor: 'crosshair',
        }}
      />

      <div>
        <button onClick={clearCanvas}>
          Effacer
        </button>
      </div>
    </div>
  );
}