"use client";

import { useState } from "react";
import Canvas from "@/components/canvas";
import "../styles/globals.scss";

const Home = () => {
  const [isLineToolActive, setIsLineToolActive] = useState(false);

  const onLineToolClick = () => {
    setIsLineToolActive(!isLineToolActive);
  };

  return (
    <main className="container">
      <div className="fill" />
      <Canvas isLineToolActive={isLineToolActive} />
      <div className="fill" />
      <div className="tools">
        <span
          className={`tool ${isLineToolActive ? "active" : ""}`}
          onClick={onLineToolClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            fill="currentColor"
            viewBox="0 0 256 256"
          >
            <path d="M214.64,41.36a32,32,0,0,0-50.2,38.89L80.25,164.44a32.06,32.06,0,0,0-38.89,4.94h0a32,32,0,1,0,50.2,6.37l84.19-84.19a32,32,0,0,0,38.89-50.2Zm-139.33,162a16,16,0,0,1-22.64-22.64h0a16,16,0,0,1,22.63,0h0A16,16,0,0,1,75.31,203.33Zm128-128a16,16,0,1,1,0-22.63A16,16,0,0,1,203.33,75.3Z"></path>
          </svg>
        </span>
      </div>
    </main>
  );
};

export default Home;
