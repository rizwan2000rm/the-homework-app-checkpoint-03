import { Line } from "@/classes";
import { drawDotGrid, drawLine, getRelativeCoordinates } from "@/utils";
import { useRef, useLayoutEffect, useState } from "react";

type CanvasProps = {
  isLineToolActive: boolean;
};

const Canvas = ({ isLineToolActive }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [lines, setLines] = useState<Line[]>([]);
  const [drawing, setDrawing] = useState(false);

  console.log(isLineToolActive);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 1;

    drawDotGrid(canvas, ctx);

    lines.forEach((line) => {
      drawLine(ctx, line.start, line.end);
    });
  }, [lines]);

  const handleMouseDown = (event: any) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (isLineToolActive) {
      setDrawing(true);
      const { x, y } = getRelativeCoordinates(canvas, event);
      setLines([...lines, { start: { x, y }, end: { x, y } }]);
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
      const {
        start: { x, y },
      } = lines[index];

      const { x: newX, y: newY } = getRelativeCoordinates(canvas, event);

      const newLines = [...lines];
      newLines[index] = { start: { x, y }, end: { x: newX, y: newY } };
      setLines(newLines);
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
