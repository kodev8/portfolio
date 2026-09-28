import { useProgress } from "@react-three/drei";
import { useEffect, useRef, useState } from "react";
import RoomSpinner from "../ui/RoomSpinner";
import { useLanguage } from "../../context/LanguageContext";
import { heroWords } from "../../constants";

/** Long enough to read as a fade, short enough not to hold up the room. */
const FADE_MS = 300;
/** Grace period before calling it done, so a gap between two loads is not one. */
const SETTLE_MS = 400;

/**
 * Covers the canvas until the scene's assets have finished loading.
 *
 * This sits outside <Canvas> on purpose. useProgress reads three's default
 * loading manager through a plain store, so it works out here, while <Html>
 * — what the old in-canvas loader used — does not. Being outside also means
 * the ring is the same DOM node the hero was already showing during the chunk
 * download, so the visitor sees one indicator the whole way through.
 */
const RoomProgress = () => {
  const { active, progress } = useProgress();
  const { language } = useLanguage();

  const [visible, setVisible] = useState(true);
  const [opacity, setOpacity] = useState(1);
  // Monotonic: three's manager can report a lower figure when a new batch of
  // assets registers, and a bar that walks backwards looks broken.
  const [shown, setShown] = useState(0);
  const doneRef = useRef(false);

  useEffect(() => {
    setShown((current) => (progress > current ? progress : current));
  }, [progress]);

  useEffect(() => {
    // Latched: once the room is up, a late texture must not put the cover
    // back over a scene the visitor is already looking at.
    if (doneRef.current || active) return;

    // Also the path taken when everything is cached and `active` is never
    // true: the cover still lifts, just after one settle period.
    const settle = window.setTimeout(() => {
      doneRef.current = true;
      setShown(100);
      setOpacity(0);
      window.setTimeout(() => setVisible(false), FADE_MS);
    }, SETTLE_MS);

    return () => window.clearTimeout(settle);
  }, [active]);

  if (!visible) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-[6] flex items-center justify-center"
      style={{
        opacity,
        transition: `opacity ${FADE_MS}ms var(--ease-out)`,
      }}
    >
      <RoomSpinner progress={shown} label={heroWords.roomLoading[language]} />
    </div>
  );
};

export default RoomProgress;
