import { drawDotGrid, getRelativeCoordinates } from "@/utils";
import { useRef, useEffect } from "react";

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvas = canvasRef.current;
  const ctx = canvas && canvas.getContext("2d");

  useEffect(() => {
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#222222";
    ctx.lineWidth = 2;

    drawDotGrid(canvas, ctx);
  }, [canvas, ctx]);

  useEffect(() => {
    if (!ctx) return;

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mouseup", handleMouseUp);
  }, [canvas, ctx]);

  const handleMouseDown = (event: MouseEvent) => {
    if (!ctx) return;

    const { x, y } = getRelativeCoordinates(canvas, event);

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (!ctx) return;

    const { x, y } = getRelativeCoordinates(canvas, event);

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  return <canvas className="canvas" height={300} ref={canvasRef} />;
};

export default Canvas;
