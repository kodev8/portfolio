import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AnimationProvider } from "./context/AnimationContext.jsx";
import { MediaProvider } from "./context/MediaContext.jsx";
import { NavProvider } from "./context/NavContext.jsx";
import { LanguageProvider } from "./context/LanguageContext.jsx";
import { Leva } from "leva";

createRoot(document.getElementById("root")).render(
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
