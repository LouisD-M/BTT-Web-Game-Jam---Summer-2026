import {
  floodFill,
} from './floodFill';

import type {
  DrawAction,
} from './types';

function drawPen(
  context:
    CanvasRenderingContext2D,
  action:
    DrawAction,
) {
  if (
    action.points.length ===
    0
  ) {
    return;
  }

  const first =
    action.points[0];

  context.save();

  context.globalAlpha =
    action.opacity;

  context.strokeStyle =
    action.tool ===
    'eraser'
      ? '#ffffff'
      : action.color;

  context.lineWidth =
    action.tool ===
    'highlighter'
      ? action.size * 2
      : action.size;

  context.lineCap =
    'round';

  context.lineJoin =
    'round';

  if (
    action.tool ===
    'highlighter'
  ) {
    context.globalAlpha =
      Math.min(
        action.opacity,
        0.3,
      );
  }

  context.beginPath();

  context.moveTo(
    first.x,
    first.y,
  );

  if (
    action.points.length ===
    1
  ) {
    context.lineTo(
      first.x + 0.01,
      first.y + 0.01,
    );
  }

  for (
    let index = 1;
    index <
    action.points.length;
    index += 1
  ) {
    const point =
      action.points[index];

    context.lineTo(
      point.x,
      point.y,
    );
  }

  context.stroke();

  context.restore();
}

function getShapePoints(
  action:
    DrawAction,
) {
  const start =
    action.points[0];

  const end =
    action.points[
      action.points.length -
        1
    ];

  return {
    start,
    end,
  };
}

function configureShape(
  context:
    CanvasRenderingContext2D,
  action:
    DrawAction,
) {
  context.globalAlpha =
    action.opacity;

  context.strokeStyle =
    action.color;

  context.fillStyle =
    action.color;

  context.lineWidth =
    action.size;

  context.lineCap =
    'round';

  context.lineJoin =
    'round';
}

function drawLine(
  context:
    CanvasRenderingContext2D,
  action:
    DrawAction,
) {
  const {
    start,
    end,
  } =
    getShapePoints(
      action,
    );

  context.save();

  configureShape(
    context,
    action,
  );

  context.beginPath();

  context.moveTo(
    start.x,
    start.y,
  );

  context.lineTo(
    end.x,
    end.y,
  );

  context.stroke();

  context.restore();
}

function drawRectangle(
  context:
    CanvasRenderingContext2D,
  action:
    DrawAction,
) {
  const {
    start,
    end,
  } =
    getShapePoints(
      action,
    );

  const width =
    end.x - start.x;

  const height =
    end.y - start.y;

  context.save();

  configureShape(
    context,
    action,
  );

  if (action.filled) {
    context.fillRect(
      start.x,
      start.y,
      width,
      height,
    );
  } else {
    context.strokeRect(
      start.x,
      start.y,
      width,
      height,
    );
  }

  context.restore();
}

function drawCircle(
  context:
    CanvasRenderingContext2D,
  action:
    DrawAction,
) {
  const {
    start,
    end,
  } =
    getShapePoints(
      action,
    );

  const centerX =
    (start.x +
      end.x) /
    2;

  const centerY =
    (start.y +
      end.y) /
    2;

  const radiusX =
    Math.abs(
      end.x - start.x,
    ) / 2;

  const radiusY =
    Math.abs(
      end.y - start.y,
    ) / 2;

  context.save();

  configureShape(
    context,
    action,
  );

  context.beginPath();

  context.ellipse(
    centerX,
    centerY,
    radiusX,
    radiusY,
    0,
    0,
    Math.PI * 2,
  );

  if (action.filled) {
    context.fill();
  } else {
    context.stroke();
  }

  context.restore();
}

function drawArrow(
  context:
    CanvasRenderingContext2D,
  action:
    DrawAction,
) {
  const {
    start,
    end,
  } =
    getShapePoints(
      action,
    );

  const angle =
    Math.atan2(
      end.y - start.y,
      end.x - start.x,
    );

  const headLength =
    Math.max(
      18,
      action.size * 4,
    );

  context.save();

  configureShape(
    context,
    action,
  );

  context.beginPath();

  context.moveTo(
    start.x,
    start.y,
  );

  context.lineTo(
    end.x,
    end.y,
  );

  context.moveTo(
    end.x,
    end.y,
  );

  context.lineTo(
    end.x -
      headLength *
        Math.cos(
          angle -
            Math.PI / 6,
        ),
    end.y -
      headLength *
        Math.sin(
          angle -
            Math.PI / 6,
        ),
  );

  context.moveTo(
    end.x,
    end.y,
  );

  context.lineTo(
    end.x -
      headLength *
        Math.cos(
          angle +
            Math.PI / 6,
        ),
    end.y -
      headLength *
        Math.sin(
          angle +
            Math.PI / 6,
        ),
  );

  context.stroke();

  context.restore();
}

function drawSpray(
  context:
    CanvasRenderingContext2D,
  action:
    DrawAction,
) {
  context.save();

  context.globalAlpha =
    action.opacity;

  context.fillStyle =
    action.color;

  for (
    const point of
    action.points
  ) {
    context.beginPath();

    context.arc(
      point.x,
      point.y,
      Math.max(
        1,
        action.size / 8,
      ),
      0,
      Math.PI * 2,
    );

    context.fill();
  }

  context.restore();
}

function drawText(
  context:
    CanvasRenderingContext2D,
  action:
    DrawAction,
) {
  const point =
    action.points[0];

  if (
    !point ||
    !action.text
  ) {
    return;
  }

  context.save();

  context.globalAlpha =
    action.opacity;

  context.fillStyle =
    action.color;

  context.font = `700 ${
    action.fontSize ??
    32
  }px Arial, sans-serif`;

  context.textBaseline =
    'top';

  context.fillText(
    action.text,
    point.x,
    point.y,
  );

  context.restore();
}

export function renderAction(
  context:
    CanvasRenderingContext2D,
  canvas:
    HTMLCanvasElement,
  action:
    DrawAction,
) {
  if (
    action.points.length ===
    0
  ) {
    return;
  }

  switch (
    action.tool
  ) {
    case 'pen':
    case 'eraser':
    case 'highlighter':
      drawPen(
        context,
        action,
      );
      break;

    case 'line':
      drawLine(
        context,
        action,
      );
      break;

    case 'rectangle':
      drawRectangle(
        context,
        action,
      );
      break;

    case 'circle':
      drawCircle(
        context,
        action,
      );
      break;

    case 'arrow':
      drawArrow(
        context,
        action,
      );
      break;

    case 'spray':
      drawSpray(
        context,
        action,
      );
      break;

    case 'fill': {
      const point =
        action.points[0];

      floodFill(
        context,
        canvas,
        {
          x: point.x,
          y: point.y,
          color:
            action.color,
        },
      );

      break;
    }

    case 'text':
      drawText(
        context,
        action,
      );
      break;
  }
}

export function renderCanvas(
  canvas:
    HTMLCanvasElement,
  actions:
    DrawAction[],
  preview?: DrawAction | null,
) {
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

  context.clearRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  context.fillStyle =
    '#ffffff';

  context.fillRect(
    0,
    0,
    canvas.width,
    canvas.height,
  );

  for (
    const action of actions
  ) {
    renderAction(
      context,
      canvas,
      action,
    );
  }

  if (preview) {
    renderAction(
      context,
      canvas,
      preview,
    );
  }
}