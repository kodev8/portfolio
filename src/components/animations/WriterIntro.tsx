import { useState, useEffect, useRef, useCallback } from "react";
import { motion, useAnimation } from "motion/react";
import { useNav } from "../../context/NavContext";
import "./WriterIntro.css";
import { useAnimation as useAnimationContext } from "../../context/AnimationContext";
import { cn } from "../../utils";
import { assetsPaths, introText } from "../../constants";
import { useLanguage } from "../../context/LanguageContext";
import { useMotion } from "../../context/MotionContext";

export default function WriterIntro() {
  const containerControls = useAnimation();
  const containerRef = useRef<HTMLDivElement | null>(null);
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
  const { language } = useLanguage();
  const { motion: motionPref } = useMotion();

  // The intro runs for several seconds before the rest of the page mounts.
  // Let people past it, and skip it outright for anyone who has asked for
  // reduced motion.
  const cancelled = useRef(false);

  const skipIntro = useCallback(() => {
    // Revealing the page is not enough on its own: the sequence is a chain of
    // awaited timeouts, so without this flag it keeps typing and animating
    // the logo on top of the site it just uncovered.
    cancelled.current = true;
    setIsAnimating(false);
    setAnimationComplete(true);

    // Jump to the finished mark rather than freezing mid-word: the sequence
    // types "Kalev K", deletes back to "KK", flips the last K and draws the
    // brackets.
    setDisplayText("KK");
    setShowCursor(false);
    setIsLastKFlipped(true);
    setShowBrackets(true);
    setLeftBracketProgress(1);
    setRightBracketProgress(1);
    setLeftBracketFill("#ffffff");
    setRightBracketFill("#ffffff");

    // Park the mark where the flight would have left it, with no transition.
    const logo = logoRef.current;
    const container = containerRef.current;
    if (logo && container) {
      const scaleFactor = 0.5;
      const rect = logo.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      void containerControls.start({
        scale: scaleFactor,
        left: rect.left - (containerRect.width * scaleFactor) / 2,
        top: rect.top - (containerRect.height * scaleFactor) / 2,
        x: 0,
        y: 0,
        transition: { duration: 0 },
      });
    }
  }, [setAnimationComplete, containerControls, logoRef]);

  useEffect(() => {
    if (motionPref === "reduced" && !animationComplete) skipIntro();
  }, [motionPref, animationComplete, skipIntro]);

  useEffect(() => {
    if (animationComplete) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skipIntro();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [animationComplete, skipIntro]);

  useEffect(() => {
    const handleResize = () => {
      if (!animationComplete || isAnimating) return;

      const scaledLeft =
        logoRef.current!.getBoundingClientRect().left -
        containerRef.current!.getBoundingClientRect().width / 2;
      const scaledTop =
        logoRef.current!.getBoundingClientRect().top -
        containerRef.current!.getBoundingClientRect().height / 2;
      containerRef.current!.style.left = scaledLeft + "px";
      containerRef.current!.style.top = scaledTop + "px";
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [animationComplete]);

  useEffect(() => {
    const animationSequence = async () => {
      if (animationComplete) return;
      const stop = () => cancelled.current;
      const audio = new Audio(assetsPaths.sounds.click);
      audio.volume = 0.1;
      setIsAnimating(true);
      const fullText = "Kalev K";
      for (let i = 0; i < fullText.length; i++) {
        if (stop()) return;
        setDisplayText((prev) => prev + fullText[i]);
        audio.currentTime = 0;
        try {
          await audio.play();
        } catch {
          // console.error("Error playing audio:", error);
        }
        await new Promise((resolve) => setTimeout(resolve, 150));
      }

      await new Promise((resolve) => setTimeout(resolve, 500));
      setShowCursor(false);
      setIsLastKFlipped(true);
      await new Promise((resolve) => setTimeout(resolve, 600));
      for (let i = 0; i < "alev ".length; i++) {
        if (stop()) return;
        setDisplayText((prev) => prev.slice(0, -2) + prev.slice(-1));
        audio.currentTime = 0;
        try {
          await audio.play();
        } catch {
          // console.error("Error playing audio:", error);
        }
        await new Promise((resolve) => setTimeout(resolve, 150));
      }
      // "K" and "ꓘ"
      setShowBrackets(true);

      const animateLeftBracket = async () => {
        for (let i = 0; i <= 100; i += 2) {
          if (stop()) return;
          setLeftBracketProgress(i / 100);
          // approx 60fps
          await new Promise((resolve) => setTimeout(resolve, 16));
        }
        setLeftBracketFill("#ffffff");
        await new Promise((resolve) => setTimeout(resolve, 300));
      };

      const animateRightBracket = async () => {
        for (let i = 0; i <= 100; i += 2) {
          if (stop()) return;
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
      if (stop()) return;

      // Flying the logo into the navbar is a flourish. Revealing the site is
      // not, so it happens whether or not the refs are there to animate to.
      if (logoRef?.current && containerRef.current) {
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
      }

      if (stop()) return;
      setIsAnimating(false);
      setAnimationComplete(true);
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
      {!animationComplete && (
        <button
          type="button"
          onClick={skipIntro}
          className="fixed right-6 bottom-6 z-[101] flex h-11 items-center gap-2 rounded-xl border
                     border-[var(--room-line-strong)] bg-room-surface/80 px-4 text-sm font-semibold
                     text-room-mid backdrop-blur-sm transition-colors duration-[var(--dur-fast)]
                     ease-[var(--ease-out)] hover:border-room-accent hover:text-room-hi
                     focus-visible:border-room-accent focus-visible:outline-none"
        >
          {introText.skip[language]}
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M5 4l8 8-8 8M15 4v16" />
          </svg>
        </button>
      )}

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
