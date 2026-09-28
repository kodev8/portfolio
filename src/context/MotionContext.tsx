import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type MotionPreference = "full" | "reduced";

interface MotionContextValue {
  /** The preference in force right now. */
  motion: MotionPreference;
  /** True once the visitor has chosen, rather than inheriting the OS. */
  isExplicit: boolean;
  setMotion: (next: MotionPreference) => void;
  toggleMotion: () => void;
}

const STORAGE_KEY = "motion-preference";
const QUERY = "(prefers-reduced-motion: reduce)";

const MotionContext = createContext<MotionContextValue>({
  motion: "full",
  isExplicit: false,
  setMotion: () => {},
  toggleMotion: () => {},
});

const readStored = (): MotionPreference | null => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "full" || stored === "reduced" ? stored : null;
  } catch {
    // Private mode and blocked storage both throw on access.
    return null;
  }
};

const readSystem = (): MotionPreference =>
  typeof window.matchMedia === "function" && window.matchMedia(QUERY).matches
    ? "reduced"
    : "full";

export const MotionProvider = ({ children }: { children: ReactNode }) => {
  const [stored, setStored] = useState<MotionPreference | null>(null);
  const [system, setSystem] = useState<MotionPreference>("full");

  // Read on mount rather than during render: neither storage nor matchMedia
  // exists while server-rendering or in a test environment that has not yet
  // installed them.
  useEffect(() => {
    setStored(readStored());
    setSystem(readSystem());
  }, []);

  // A visitor who has not chosen keeps following the OS if it changes.
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;
    const list = window.matchMedia(QUERY);
    const onChange = () => setSystem(list.matches ? "reduced" : "full");
    list.addEventListener("change", onChange);
    return () => list.removeEventListener("change", onChange);
  }, []);

  const motion = stored ?? system;

  // The attribute is what the stylesheet keys off, so component code never
  // has to branch on the preference: it just uses var(--dur).
  useEffect(() => {
    document.documentElement.dataset.motion = motion;
  }, [motion]);

  const setMotion = useCallback((next: MotionPreference) => {
    setStored(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Losing the preference is better than breaking the page.
    }
  }, []);

  const toggleMotion = useCallback(
    () => setMotion(motion === "full" ? "reduced" : "full"),
    [motion, setMotion]
  );

  const value = useMemo(
    () => ({ motion, isExplicit: stored !== null, setMotion, toggleMotion }),
    [motion, stored, setMotion, toggleMotion]
  );

  return (
    <MotionContext.Provider value={value}>{children}</MotionContext.Provider>
  );
};

export const useMotion = () => useContext(MotionContext);

export default MotionContext;
