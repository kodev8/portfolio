import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { AnimationProvider } from "./context/AnimationContext";
import { MediaProvider } from "./context/MediaContext";
import { NavProvider } from "./context/NavContext";
import { LanguageProvider } from "./context/LanguageContext";
import { Leva } from "leva";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <LanguageProvider>
    <MediaProvider>
      <AnimationProvider>
        <NavProvider>
          <App />
        </NavProvider>
      </AnimationProvider>
    </MediaProvider>
  </LanguageProvider>
  // </StrictMode>
);
