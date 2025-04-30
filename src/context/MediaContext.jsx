import React, { createContext, useState, useContext, useMemo } from "react";
import { useMediaQuery } from "react-responsive";

const MediaContext = createContext({
  isMobile: false,
  isTablet: false,
  isLaptop: false,
  isDesktop: false,
});

export const MediaProvider = ({ children }) => {
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

  return (
    <MediaContext.Provider value={state}>{children}</MediaContext.Provider>
  );
};

export const useMedia = () => useContext(MediaContext);
