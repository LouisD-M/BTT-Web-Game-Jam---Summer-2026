import type {
  Point,
} from './types';

export function createId() {
  return crypto.randomUUID();
}

export function distance(
  a: Point,
  b: Point,
) {
  return Math.sqrt(
    Math.pow(
      b.x - a.x,
      2,
    ) +
      Math.pow(
        b.y - a.y,
        2,
      ),
  );
}

export function hexToRgb(
  hex: string,
) {
  const normalized =
    hex.replace('#', '');

  if (
    normalized.length !== 6
  ) {
    return {
      r: 0,
      g: 0,
      b: 0,
    };
  }

  return {
    r: parseInt(
      normalized.substring(
        0,
        2,
      ),
      16,
    ),

    g: parseInt(
      normalized.substring(
        2,
        4,
      ),
      16,
    ),

    b: parseInt(
      normalized.substring(
        4,
        6,
      ),
      16,
    ),
  };
}

export function rgbToHex(
  r: number,
  g: number,
  b: number,
) {
  return (
    '#' +
    [r, g, b]
      .map((value) =>
        value
          .toString(16)
          .padStart(2, '0'),
      )
      .join('')
  );
}