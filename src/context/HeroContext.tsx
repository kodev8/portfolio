import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import type { SelectedItem } from "../types";

interface HeroContextValue {
  isInteracting: boolean;
  setIsInteracting: Dispatch<SetStateAction<boolean>>;
  selectedItem: SelectedItem | null;
  setSelectedItem: Dispatch<SetStateAction<SelectedItem | null>>;
  isAnimating: boolean;
  setIsAnimating: Dispatch<SetStateAction<boolean>>;
  isRoomOpen: boolean;
  setIsRoomOpen: Dispatch<SetStateAction<boolean>>;
}

const HeroContext = createContext<HeroContextValue>({
  isInteracting: false,
  setIsInteracting: () => {},
  selectedItem: null,
  setSelectedItem: () => {},
  isAnimating: false,
  setIsAnimating: () => {},
  isRoomOpen: false,
  setIsRoomOpen: () => {},
});

export const HeroProvider = ({ children }: { children: ReactNode }) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
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
    [isInteracting, selectedItem, isAnimating, isRoomOpen]
  );

  return <HeroContext.Provider value={state}>{children}</HeroContext.Provider>;
};

export const useHero = () => {
  return useContext(HeroContext);
};
