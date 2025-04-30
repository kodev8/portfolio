import { Html, useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";

const CanvasLoader = () => {
  const { progress } = useProgress();
  const pathRef = useRef(null);
  const [pathLength, setPathLength] = useState(0);
  const [strokeDashoffset, setStrokeDashoffset] = useState(0);
  const [smoothProgress, setSmoothProgress] = useState(0);
  const lastProgressRef = useRef(0);

  const infinityPath =
    "M93.9,46.4c9.3,9.5,13.8,17.9,23.5,17.9s17.5-7.8,17.5-17.5s-7.8-17.6-17.5-17.5c-9.7,0.1-13.3,7.2-22.1,17.1c-8.9,8.8-15.7,17.9-25.4,17.9s-17.5-7.8-17.5-17.5s7.8-17.5,17.5-17.5S86.2,38.6,93.9,46.4z";

  useEffect(() => {
    if (progress > lastProgressRef.current) {
      lastProgressRef.current = progress;
      setSmoothProgress(progress);
    }
  }, [progress]);

  useEffect(() => {
    if (pathRef.current) {
      const length = pathRef.current.getTotalLength();
      setPathLength(length);
      const offset = length * (1 - smoothProgress / 100);
      setStrokeDashoffset(offset);
    }
  }, [smoothProgress, pathRef]);

  return (
    <Html
      as="div"
      center
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
      }}
    >
      <div className="flex-col-center">
        <div style={{ position: "relative" }}>
          {/* Base SVG (faded background) */}
          <svg
            width="600px"
            height="400px"
            viewBox="0 0 187.3 93.7"
            style={{ position: "absolute", top: 0, left: 0 }}
          >
            <path
              d={infinityPath}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {/* Animated SVG with gradient */}
          <svg width="600px" height="400px" viewBox="0 0 187.3 93.7">
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#001f3f" />
                <stop offset="25%" stopColor="#0074D9" />
                <stop offset="50%" stopColor="#00BFFF" />
                <stop offset="75%" stopColor="#7FDBFF" />
                <stop offset="100%" stopColor="#E0F7FA" />
              </linearGradient>
            </defs>
            <path
              ref={pathRef}
              d={infinityPath}
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: pathLength,
                strokeDashoffset: strokeDashoffset,
                filter: "drop-shadow(0 0 2px rgba(0, 191, 255, 0.5))",
              }}
            />
          </svg>
        </div>

        {/* Progress text */}
        <div
          style={{
            marginTop: "20px",
            fontSize: "18px",
            fontFamily: "Mona Sans, sans-serif",
            color: "#E0F7FA",
          }}
        >
          {Math.round(smoothProgress)}%
        </div>
      </div>
    </Html>
  );
};

export default CanvasLoader;
