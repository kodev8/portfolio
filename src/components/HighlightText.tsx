import React, { createContext, useContext, useRef, useState, useEffect } from "react";

interface HighLightContextValue {
  sequenceActive: boolean;
  startSequence: () => void;
  delay: number;
}

const HighLightContext = createContext<HighLightContextValue>({
  sequenceActive: false,
  startSequence: () => {},
  delay: 0,
});

const HighLightProvider = ({ children }: { children?: React.ReactNode }) => {
  const [sequenceActive, setSequenceActive] = useState(false);
  const [lastTriggerTime, setLastTriggerTime] = useState(0);
  const delay = 400;
  const cooldownPeriod = 3000; // 3 second cooldown

  const startSequence = () => {
    const now = Date.now();
    // Only start a new sequence if enough time has passed since the last one
    if (!sequenceActive && now - lastTriggerTime > cooldownPeriod) {
      setSequenceActive(true);
      setLastTriggerTime(now);

      // Auto-reset the sequence after completion
      setTimeout(() => {
        setSequenceActive(false);
        // Reset all active classes
        document.querySelectorAll(".hero-important").forEach((el) => {
          el.classList.remove("active");
        });
      }, 5000); // Adjust based on total animation time
    }
  };

  return (
    <HighLightContext.Provider
      value={{
        sequenceActive,
        startSequence,
        delay,
      }}
    >
      {children}
    </HighLightContext.Provider>
  );
};

interface HighLightTextProps {
  text: string;
  index: number;
}

const HighLightText = ({ text, index }: HighLightTextProps) => {
  const { sequenceActive, startSequence, delay } = useContext(HighLightContext);
  const ref = useRef<HTMLSpanElement | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (sequenceActive) {
      timeoutRef.current = setTimeout(() => {
        if (ref.current) {
          ref.current.classList.add("active");
        }
      }, index * delay);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [sequenceActive, index, delay]);

  return (
    <span
      ref={ref}
      onMouseEnter={startSequence}
      onClick={startSequence}
      className="hero-important cursor-cell break-words whitespace-pre-wrap"
    >
      {text}
    </span>
  );
};

export { HighLightProvider, HighLightText };
