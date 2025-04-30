import React, { createContext, useState, useContext, useEffect } from 'react';

const AnimationContext = createContext({
  animationComplete: false,
  setAnimationComplete: () => {},
});

export const AnimationProvider = ({ children }) => {
  const [animationComplete, setAnimationComplete] = useState(false);

  useEffect(() => {
    if (animationComplete) {
      document.body.style.overflowY = "auto";
    } else {
      window.scrollTo(0, 0);
      document.body.style.overflow = "hidden";

    }
  }, [animationComplete]);

  return (
    <AnimationContext.Provider value={{ animationComplete, setAnimationComplete }}>
      {children}
    </AnimationContext.Provider>
  );
};

export const useAnimation = () => useContext(AnimationContext); 