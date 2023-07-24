import { DOT_PER_ROW } from "./constant";

export const drawDot = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) => {
  ctx.fillRect(x, y, 2, 2);
};

export const drawDotGrid = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) => {
  const canvasWidth = canvas.clientWidth;

  // Calculate the dot size based on the number of dots per row and column
  const dotSize = canvasWidth / DOT_PER_ROW;

  // Loop through the grid and draw the dots
  for (let x = 0; x < DOT_PER_ROW; x++) {
    for (let y = 0; y < DOT_PER_ROW; y++) {
      const dotX = Math.floor(x * dotSize);
      const dotY = Math.floor(y * dotSize);
      drawDot(ctx, dotX, dotY);
    }
  }
};

export const getRelativeCoordinates = (
  canvas: HTMLCanvasElement,
  event: MouseEvent | Touch
) => {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (event.clientX - rect.left) * scaleX;
  const y = (event.clientY - rect.top) * scaleY;
  return { x, y };
};
