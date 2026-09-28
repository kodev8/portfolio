import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useMediaQuery } from "react-responsive";

interface MediaContextValue {
  isMobile: boolean;
  isTablet: boolean;
  isLaptop: boolean;
  isDesktop: boolean;
}

const MediaContext = createContext<MediaContextValue>({
  isMobile: false,
  isTablet: false,
  isLaptop: false,
  isDesktop: false,
});

export const MediaProvider = ({ children }: { children: ReactNode }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const isLaptop = useMediaQuery({ query: "(max-width: 1280px)" });
  const isDesktop = useMediaQuery({ query: "(max-width: 1440px)" });
  const state = useMemo(
    () => ({
      isMobile,
      isTablet,
      isLaptop,
      isDesktop,
    }),
    [isMobile, isTablet, isLaptop, isDesktop]
  );

  return <MediaContext.Provider value={state}>{children}</MediaContext.Provider>;
};

export const useMedia = () => useContext(MediaContext);
