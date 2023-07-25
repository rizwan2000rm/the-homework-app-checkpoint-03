import { useRef, useState, useEffect } from "react";
import { Coordinate, Line } from "@/classes";
import {
  drawAnchors,
  drawAngles,
  drawDotGrid,
  drawLine,
  getClosestCoordinateWithinProximity,
  getRelativeCoordinates,
  getUniqueVertices,
  nameVertices,
  roundToDecimals,
} from "@/utils";

type CanvasProps = {
  lines: Line[];
  setLines: (lines: Line[]) => void;
  isLineToolActive: boolean;
};

const Canvas = ({ lines, setLines, isLineToolActive }: CanvasProps) => {
  const vertices = getUniqueVertices(lines);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [drawing, setDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;
    ctx.font = "10px Times New Roman";

    drawDotGrid(canvas, ctx);

    vertices.map((vertex: Coordinate, idx: number) => {
      nameVertices(ctx, vertex, idx);
      drawAnchors(ctx, vertex);
    });

    lines.forEach((line) => {
      drawLine(ctx, line.start, line.end);
    });

    drawAngles(ctx, lines, vertices);
  }, [lines, vertices]);

  const handleMouseDown = (event: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    if (isLineToolActive) {
      setDrawing(true);
      const { x, y } = getRelativeCoordinates(canvas, event);
      const snappedVertex = getClosestCoordinateWithinProximity(vertices, {
        x,
        y,
      });

      if (snappedVertex) {
        setLines([...lines, { start: snappedVertex, end: snappedVertex }]);
      } else {
        const coordinates = {
          x: roundToDecimals(x),
          y: roundToDecimals(y),
        };
        setLines([...lines, { start: coordinates, end: coordinates }]);
      }
    }
  };

  const handleMouseUp = (event: any) => {
    setDrawing(false);
  };

  const handleMouseMove = (event: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!drawing) return;

    if (isLineToolActive) {
      const index = lines.length - 1;
      const { start } = lines[index];

      let end = getRelativeCoordinates(canvas, event);

      const snappedVertex = getClosestCoordinateWithinProximity(vertices, end);

      if (snappedVertex) {
        const newLines = [...lines];
        newLines[index] = { start, end: snappedVertex };
        setLines(newLines);
      } else {
        const newLines = [...lines];
        const coordinates = {
          x: roundToDecimals(end.x),
          y: roundToDecimals(end.y),
        };
        newLines[index] = { start, end: coordinates };
        setLines(newLines);
      }
    }
  };

  return (
    <canvas
      className="canvas"
      height={300}
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    />
  );
};

export default Canvas;
