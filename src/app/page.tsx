"use client";

import Canvas from "@/components/canvas";
import { useState } from "react";

const Home = () => {
  const [isLineToolActive, setIsLineToolActive] = useState(false);

  const onLineToolClick = () => {
    setIsLineToolActive(!isLineToolActive);
  };

  return (
    <main className="container">
      <div className="fill" />
      <Canvas />
      <div className="fill" />
      <div className="tools">
        <span className="tool" onClick={onLineToolClick}>
          Line Tool
        </span>
      </div>
    </main>
  );
};

export default Home;
