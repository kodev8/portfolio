import {
  createContext,
  useContext,
  useState,
  useEffect,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

interface AnimationContextValue {
  animationComplete: boolean;
  setAnimationComplete: Dispatch<SetStateAction<boolean>>;
}

const AnimationContext = createContext<AnimationContextValue>({
  animationComplete: false,
  setAnimationComplete: () => {},
});

export const AnimationProvider = ({ children }: { children: ReactNode }) => {
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
