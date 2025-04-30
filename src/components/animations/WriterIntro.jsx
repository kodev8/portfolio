import { useState, useEffect, useRef } from "react";
import { motion, useAnimation } from "motion/react";
import { useNav } from "../../context/NavContext";
import "./WriterIntro.css";
import { useAnimation as useAnimationContext } from "../../context/AnimationContext";
import { cn } from "../../utils";

export default function WriterIntro() {
  const containerControls = useAnimation();
  const containerRef = useRef(null);
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isLastKFlipped, setIsLastKFlipped] = useState(false);
  const [showBrackets, setShowBrackets] = useState(false);
  const [leftBracketProgress, setLeftBracketProgress] = useState(0);
  const [rightBracketProgress, setRightBracketProgress] = useState(0);
  const [leftBracketFill, setLeftBracketFill] = useState("transparent");
  const [rightBracketFill, setRightBracketFill] = useState("transparent");
  const [isAnimating, setIsAnimating] = useState(false);
  const { animationComplete, setAnimationComplete } = useAnimationContext();
  const { logoRef } = useNav();

  useEffect(() => {
    const handleResize = () => {
      if (!animationComplete || isAnimating) return;

      const scaledLeft =
        logoRef.current.getBoundingClientRect().left -
        containerRef.current.getBoundingClientRect().width / 2;
      const scaledTop =
        logoRef.current.getBoundingClientRect().top -
        containerRef.current.getBoundingClientRect().height / 2;
      containerRef.current.style.left = scaledLeft + "px";
      containerRef.current.style.top = scaledTop + "px";
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [animationComplete]);

  useEffect(() => {
    const animationSequence = async () => {
      if (animationComplete) return;
      const audio = new Audio("/sounds/click.mp3");
      audio.volume = 0.1;
      setIsAnimating(true);
      const fullText = "Kalev K";
      for (let i = 0; i < fullText.length; i++) {
        setDisplayText((prev) => prev + fullText[i]);
        audio.currentTime = 0;
        try {
          await audio.play();
        } catch (error) {
          // console.error("Error playing audio:", error);
        }
        await new Promise((resolve) => setTimeout(resolve, 150));
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      setShowCursor(false);
      setIsLastKFlipped(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      for (let i = 0; i < "alev ".length; i++) {
        setDisplayText((prev) => prev.slice(0, -2) + prev.slice(-1)); 
        audio.currentTime = 0;
        try {
          await audio.play();
        } catch (error) {
          // console.error("Error playing audio:", error);
        }
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
      // "K" and "ꓘ"
      setShowBrackets(true);

      const animateLeftBracket = async () => {
        for (let i = 0; i <= 100; i += 2) {
          setLeftBracketProgress(i / 100);
          // approx 60fps
          await new Promise((resolve) => setTimeout(resolve, 16)); 
        }
        setLeftBracketFill("#ffffff");
        await new Promise((resolve) => setTimeout(resolve, 300));
      };

      const animateRightBracket = async () => {
        for (let i = 0; i <= 100; i += 2) {
          setRightBracketProgress(i / 100);
          await new Promise((resolve) => setTimeout(resolve, 16));
        }
        setRightBracketFill("#ffffff");
        await new Promise((resolve) => setTimeout(resolve, 800));
      };

      // run both animations concurrently
      const animateBrackets = async () => {
        await Promise.all([animateLeftBracket(), animateRightBracket()]);
      };

      await animateBrackets();

      if (logoRef?.current) {
        const scaleFactor = 0.5;

        const rect = logoRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

      
        await containerControls.start({
          scale: scaleFactor,
          left: rect.left - (containerRect.width * scaleFactor) / 2,
          top: rect.top - (containerRect.height * scaleFactor) / 2,
          x: 0,
          y: 0,
          transition: { duration: 0.8, ease: "easeInOut" },
        });
        setIsAnimating(false);
        setAnimationComplete(true);
      }
    };

    animationSequence();
  }, [containerControls, logoRef]);

  const getDisplayParts = () => {
    if (!displayText) return { firstPart: "", lastChar: "" };

    if (displayText.length === 1) {
      return { firstPart: displayText, lastChar: "" };
    }

    return {
      firstPart: displayText.slice(0, -1),
      lastChar: displayText.slice(-1),
    };
  };

  const { firstPart, lastChar } = getDisplayParts();

  const leftBracketPath =
    "M365.46 357.74L147.04 255.89l218.47-101.88c16.02-7.47 22.95-26.51 15.48-42.53l-13.52-29C360 66.46 340.96 59.53 324.94 67L18.48 209.91a32.014 32.014 0 0 0-18.48 29v34.24c0 12.44 7.21 23.75 18.48 29l306.31 142.83c16.06 7.49 35.15.54 42.64-15.52l13.56-29.08c7.49-16.06.54-35.15-15.53-42.64z";
  const rightBracketPath =
    "M365.52 209.85L59.22 67.01c-16.06-7.49-35.15-.54-42.64 15.52L3.01 111.61c-7.49 16.06-.54 35.15 15.52 42.64L236.96 256.1 18.49 357.99C2.47 365.46-4.46 384.5 3.01 400.52l13.52 29C24 445.54 43.04 452.47 59.06 445l306.47-142.91a32.003 32.003 0 0 0 18.48-29v-34.23c-.01-12.45-7.21-23.76-18.49-29.01z";

  return (
    <div
      className={cn(
        "absolute top-0 left-0 w-screen h-screen !z-[100] transition-all duration-300",
        {
          "h-0 w-0": animationComplete,
        }
      )}
    >
      <motion.div
        ref={containerRef}
        onClick={() => {
          if (animationComplete) {
            window.location.href = "/#about";
          }
        }}
        className={
          "logo-container fixed cursor-pointer font-mono font-bold text-7xl text-white tracking-wider !z-[100]"
        }
        initial={{
          left: window.innerWidth / 2,
          top: window.innerHeight / 2,
          x: "-50%",
          y: "-50%",
        }}
        animate={containerControls}
      >
        <div className="relative flex items-center">
          {showBrackets && (
            <svg
              className="h-12 md:h-16 w-6 md:w-8 mr-1"
              viewBox="-64 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={leftBracketPath}
                stroke="#ffffff"
                strokeWidth="8"
                fill={leftBracketFill}
                strokeDasharray="1000"
                strokeDashoffset={1000 - leftBracketProgress * 1000}
                style={{ transition: "fill 0.3s ease" }}
              />
            </svg>
          )}

          <span className="inline-block text-4xl md:text-6xl">{firstPart}</span>

          <motion.span
            className="inline-block text-4xl md:text-6xl"
            style={{
              transformStyle: "preserve-3d",
              perspective: "1000px",
            }}
            animate={{
              rotateY: isLastKFlipped ? 180 : 0,
              transition: { duration: 0.6, ease: "easeInOut" },
            }}
          >
            {lastChar}
          </motion.span>

          {showCursor && <span className="cursor text-4xl md:text-6xl"></span>}

          {showBrackets && (
            <svg
              className="h-12 md:h-16 w-6 md:w-8 ml-1"
              viewBox="-64 0 512 512"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d={rightBracketPath}
                stroke="#ffffff"
                strokeWidth="8"
                fill={rightBracketFill}
                strokeDasharray="1000"
                strokeDashoffset={1000 - rightBracketProgress * 1000}
                style={{ transition: "fill 0.3s ease" }}
              />
            </svg>
          )}
        </div>
      </motion.div>
    </div>
  );
}
