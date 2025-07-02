import { createContext, useContext, useState, useEffect, useMemo } from "react";

const HeroContext = createContext({
  isInteracting: false,
  setIsInteracting: () => {},
  selectedItem: null,
  setSelectedItem: () => {},
  isAnimating: false,
  setIsAnimating: () => {},
});

export const HeroProvider = ({ children }) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isRoomOpen, setIsRoomOpen] = useState(false);

  useEffect(() => {
    if (isInteracting) {
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.overflowY = "auto";
    }
  }, [isInteracting]);

  const state = useMemo(
    () => ({
      isInteracting,
      setIsInteracting,
      selectedItem,
      setSelectedItem,
      isAnimating,
      setIsAnimating,
      isRoomOpen,
      setIsRoomOpen,
    }),
    [
      isInteracting,
      setIsInteracting,
      selectedItem,
      setSelectedItem,
      isAnimating,
      setIsAnimating,
      isRoomOpen,
      setIsRoomOpen,
    ]
  );

  return <HeroContext.Provider value={state}>{children}</HeroContext.Provider>;
};

export const useHero = () => {
  return useContext(HeroContext);
};
