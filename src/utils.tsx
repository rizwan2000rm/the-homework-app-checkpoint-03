import { Coordinate, Line } from "./classes";
import { DOT_PER_ROW, ERROR_MARGIN, PI2, VERTEX_LABELS } from "./constant";

export const drawDot = (
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number
) => {
  ctx.fillRect(x, y, 1, 1);
};

export const drawLine = (
  ctx: CanvasRenderingContext2D,
  start: Coordinate,
  end: Coordinate
) => {
  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(end.x, end.y);

  const distance = calculateDistance(start, end);
  ctx.fillText(
    `${distance.toFixed(2)}cm`,
    (start.x + end.x) / 2,
    (start.y + end.y) / 2
  );

  ctx.stroke();
};

export const drawAngle = (
  ctx: CanvasRenderingContext2D,
  vertex3: Coordinate,
  vertex2: Coordinate,
  vertex1: Coordinate
) => {
  var dx1 = vertex1.x - vertex2.x;
  var dy1 = vertex1.y - vertex2.y;
  var dx2 = vertex3.x - vertex2.x;
  var dy2 = vertex3.y - vertex2.y;
  var a1 = Math.atan2(dy1, dx1);
  var a2 = Math.atan2(dy2, dx2);
  var a = (((a1 - a2) * 180) / Math.PI + 360) % 360;

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(vertex2.x, vertex2.y);
  ctx.fillText(`${a.toFixed(0)}°`, vertex2.x + 15, vertex2.y);
};

export const drawAngles = (
  ctx: CanvasRenderingContext2D,
  lines: Line[],
  vertices: Coordinate[]
) => {
  if (vertices.length < 2) return;

  for (var i = 0; i < vertices.length - 2; i++) {
    drawAngle(ctx, vertices[i], vertices[i + 1], vertices[i + 2]);
  }

  if (isFormingPolygon(lines)) {
    var n = vertices.length;
    drawAngle(ctx, vertices[n - 2], vertices[n - 1], vertices[0]);
    drawAngle(ctx, vertices[n - 1], vertices[0], vertices[1]);
  }
};

export const drawAnchors = (
  ctx: CanvasRenderingContext2D,
  vertex: Coordinate
) => {
  ctx.beginPath();
  ctx.arc(vertex.x, vertex.y, 3, 0, PI2);
  ctx.closePath();
  ctx.fillStyle = "#000";
  ctx.fill();
};

export const drawDotGrid = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D
) => {
  const canvasWidth = canvas.clientWidth;

  const dotSize = canvasWidth / DOT_PER_ROW;

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

export const arePointsClose = (pointA: Coordinate, pointB: Coordinate) => {
  const distanceSquared =
    (pointA.x - pointB.x) ** 2 + (pointA.y - pointB.y) ** 2;
  return distanceSquared <= ERROR_MARGIN ** 2;
};

export const nameVertices = (
  ctx: CanvasRenderingContext2D,
  vertex: Coordinate,
  idx: number
) => {
  ctx.fillText(VERTEX_LABELS[idx], vertex.x, vertex.y - 10);
};

export const roundToDecimals = (num: number, decimals: number = 2) =>
  Number(num.toFixed(decimals));

export const getUniqueVertices = (
  lines: Line[],
  decimals: number = 2
): Coordinate[] => {
  const uniqueVertices: { [key: string]: Coordinate } = {};

  lines.forEach((line) => {
    const roundedStart = {
      x: roundToDecimals(line.start.x, decimals),
      y: roundToDecimals(line.start.y, decimals),
    };

    const addStart = !Object.values(uniqueVertices).some((vertex) =>
      arePointsClose(roundedStart, vertex)
    );
    if (addStart)
      uniqueVertices[`${roundedStart.x},${roundedStart.y}`] = roundedStart;

    const roundedEnd = {
      x: roundToDecimals(line.end.x, decimals),
      y: roundToDecimals(line.end.y, decimals),
    };

    const addEnd = !Object.values(uniqueVertices).some((vertex) =>
      arePointsClose(roundedEnd, vertex)
    );
    if (addEnd) uniqueVertices[`${roundedEnd.x},${roundedEnd.y}`] = roundedEnd;
  });

  return Object.values(uniqueVertices);
};

export const calculateDistance = (
  start: Coordinate,
  end: Coordinate
): number => {
  const deltaX = end.x - start.x;
  const deltaY = end.y - start.y;
  const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);
  return distance;
};

export const calculateDistanceSquared = (
  coordA: Coordinate,
  coordB: Coordinate
): number => {
  return (coordA.x - coordB.x) ** 2 + (coordA.y - coordB.y) ** 2;
};

export const getClosestCoordinateWithinProximity = (
  coordinates: Coordinate[],
  vertex: Coordinate
): Coordinate | false => {
  let closestCoordinate: Coordinate | null = null;
  let closestDistanceSquared = ERROR_MARGIN * ERROR_MARGIN;

  for (const coord of coordinates) {
    const distanceSquared = calculateDistanceSquared(coord, vertex);
    if (distanceSquared <= closestDistanceSquared) {
      closestCoordinate = coord;
      closestDistanceSquared = distanceSquared;
    }
  }

  if (closestCoordinate === null) {
    return false;
  }

  return closestCoordinate;
};

export const areCoordinatesEqual = (
  coord1: Coordinate,
  coord2: Coordinate
): boolean => {
  return coord1.x === coord2.x && coord1.y === coord2.y;
};

export const isFormingPolygon = (lines: Line[]): boolean => {
  if (lines.length < 3) {
    // A polygon should have at least 3 sides.
    return false;
  }

  // Check if the first and last coordinates of the lines match to form a closed shape.
  const firstLine = lines[0];
  const lastLine = lines[lines.length - 1];

  if (!areCoordinatesEqual(firstLine.start, lastLine.end)) {
    return false;
  }

  // Check if all other lines connect to each other.
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    const previousLine = lines[i - 1];

    if (!areCoordinatesEqual(currentLine.start, previousLine.end)) {
      return false;
    }
  }

  // All checks passed, the lines form a polygon.
  return true;
};
