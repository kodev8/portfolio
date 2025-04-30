import React, { useState, useEffect } from "react";
import { useAnimation } from "./context/AnimationContext";
import NavBar from "./components/NavBar";
import Hero from "./sections/Hero";
import Showcase from "./sections/Showcase";
import ExperienceSection from "./sections/ExperienceSection";
import TechStack from "./sections/TechStack";
import Contact from "./sections/Contact";
import Portfolio from "./sections/portfolio/Portfolio";
import NavBar2 from "./components/NavBar2";
import { cn } from "./utils";
import { HeroProvider } from "./context/HeroContext";
import WriterIntro from "./components/animations/WriterIntro";
import { Toaster } from "./components/ui/Sonner.tsx";
import { useMedia } from "./context/MediaContext";
function App() {
  const { animationComplete, setAnimationComplete } = useAnimation();
  const { isMobile } = useMedia();

  // useEffect(() => {
  //   setAnimationComplete(true); 
  // }, []);

  return (
    <div>
      <WriterIntro />
      <main
        className={cn("opacity-0", {
          "opacity-100 top-0 left-0 w-full transition-opacity duration-300":
            animationComplete,
        })}
      >
        <NavBar />
        <NavBar2 />

        <HeroProvider>
          <Hero />
        </HeroProvider>

        {animationComplete && (
          <>
            <ExperienceSection />
            <Showcase />
            <Portfolio />
            <TechStack />
          </>
        )}
        <Contact />
        <Toaster position={isMobile ? "bottom-center" : "bottom-right"} />
      </main>
    </div>
  );
}

export default App;
