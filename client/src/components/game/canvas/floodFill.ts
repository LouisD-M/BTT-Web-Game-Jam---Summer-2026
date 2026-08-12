import {
  hexToRgb,
} from './canvasUtils';

type FloodFillOptions = {
  x: number;
  y: number;
  color: string;
};

export function floodFill(
  context:
    CanvasRenderingContext2D,
  canvas:
    HTMLCanvasElement,
  options:
    FloodFillOptions,
) {
  const width =
    canvas.width;

  const height =
    canvas.height;

  const startX =
    Math.floor(options.x);

  const startY =
    Math.floor(options.y);

  if (
    startX < 0 ||
    startY < 0 ||
    startX >= width ||
    startY >= height
  ) {
    return;
  }

  const imageData =
    context.getImageData(
      0,
      0,
      width,
      height,
    );

  const pixels =
    imageData.data;

  const startIndex =
    (startY * width +
      startX) *
    4;

  const target = {
    r: pixels[startIndex],
    g:
      pixels[
        startIndex + 1
      ],
    b:
      pixels[
        startIndex + 2
      ],
    a:
      pixels[
        startIndex + 3
      ],
  };

  const replacement =
    hexToRgb(
      options.color,
    );

  if (
    target.r ===
      replacement.r &&
    target.g ===
      replacement.g &&
    target.b ===
      replacement.b
  ) {
    return;
  }

  const visited =
    new Uint8Array(
      width * height,
    );

  const stack: Array<
    [number, number]
  > = [
    [startX, startY],
  ];

  const tolerance = 20;

  const matches = (
    index: number,
  ) => {
    return (
      Math.abs(
        pixels[index] -
          target.r,
      ) <= tolerance &&
      Math.abs(
        pixels[index + 1] -
          target.g,
      ) <= tolerance &&
      Math.abs(
        pixels[index + 2] -
          target.b,
      ) <= tolerance &&
      Math.abs(
        pixels[index + 3] -
          target.a,
      ) <= tolerance
    );
  };

  while (
    stack.length > 0
  ) {
    const [x, y] =
      stack.pop()!;

    if (
      x < 0 ||
      y < 0 ||
      x >= width ||
      y >= height
    ) {
      continue;
    }

    const pixelPosition =
      y * width + x;

    if (
      visited[
        pixelPosition
      ]
    ) {
      continue;
    }

    visited[
      pixelPosition
    ] = 1;

    const index =
      pixelPosition * 4;

    if (!matches(index)) {
      continue;
    }

    pixels[index] =
      replacement.r;

    pixels[index + 1] =
      replacement.g;

    pixels[index + 2] =
      replacement.b;

    pixels[index + 3] =
      255;

    stack.push(
      [x + 1, y],
      [x - 1, y],
      [x, y + 1],
      [x, y - 1],
    );
  }

  context.putImageData(
    imageData,
    0,
    0,
  );
}