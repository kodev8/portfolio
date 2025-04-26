import React, {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

const HighLightContext = createContext({
  sequenceActive: false,
  startSequence: () => {},
  delay: 0,
});

const HighLightProvider = ({ children }) => {
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

const HighLightText = ({ text, index }) => {
  const { sequenceActive, startSequence, delay } = useContext(HighLightContext);
  const ref = useRef(null);
  const timeoutRef = useRef(null);

  // Handle animation based on sequence state
  useEffect(() => {
    if (sequenceActive) {
      // Set timeout for this specific item based on its index
      timeoutRef.current = setTimeout(() => {
        if (ref.current) {
          ref.current.classList.add("active");
        }
      }, index * delay);
    }

    // Cleanup function
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
      className="hero-important cursor-cell"
    >
      {text}
    </span>
  );
};

export { HighLightProvider, HighLightText };
