"use client";

import { useState } from "react";
import Canvas from "@/components/canvas";
import ClearTool from "@/components/clear-tool";
import LineTool from "@/components/line-tool";
import { Line } from "@/classes";
import "../styles/globals.scss";

const Home = () => {
  const [lines, setLines] = useState<Line[]>([]);
  const [isLineToolActive, setIsLineToolActive] = useState(false);

  const onLineToolClick = () => {
    setIsLineToolActive(!isLineToolActive);
  };

  const onClearToolClick = () => setLines([]);

  const ToolBar = (
    <div className="tools">
      <LineTool
        isLineToolActive={isLineToolActive}
        onLineToolClick={onLineToolClick}
      />
      <ClearTool onClearToolClick={onClearToolClick} />
    </div>
  );

  return (
    <main className="container">
      <div className="fill" />
      <Canvas
        lines={lines}
        setLines={setLines}
        isLineToolActive={isLineToolActive}
      />
      <div className="fill" />
      {ToolBar}
    </main>
  );
};

export default Home;
