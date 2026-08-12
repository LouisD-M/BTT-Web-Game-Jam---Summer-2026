export type DrawingTool =
  | 'pen'
  | 'eraser'
  | 'line'
  | 'rectangle'
  | 'circle'
  | 'arrow'
  | 'spray'
  | 'highlighter'
  | 'fill'
  | 'eyedropper'
  | 'text';

export type Point = {
  x: number;
  y: number;
};

export type DrawAction = {
  id: string;

  tool: DrawingTool;

  color: string;

  size: number;

  opacity: number;

  points: Point[];

  filled?: boolean;

  text?: string;

  fontSize?: number;
};