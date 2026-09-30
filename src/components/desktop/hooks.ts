import { useCallback, useEffect, useState } from "react";
import type { OsKind } from "./windowManager";

const OS_KEY = "kk-desk-os";

const readOs = (): OsKind | null => {
  try {
    const value = window.localStorage.getItem(OS_KEY);
    return value === "windows" || value === "macos" ? value : null;
  } catch {
    // Private mode or blocked storage: just ask again next visit.
    return null;
  }
};

/**
 * Which desktop the visitor picked on the boot screen, remembered per browser.
 * `null` until they choose, which is what shows the boot screen.
 */
export const useOsChoice = () => {
  const [os, setOsState] = useState<OsKind | null>(readOs);

  const setOs = useCallback((next: OsKind) => {
    setOsState(next);
    try {
      window.localStorage.setItem(OS_KEY, next);
    } catch {
      // Not persisting is fine; the choice still holds for this visit.
    }
  }, []);

  return [os, setOs] as const;
};

/** The current time, refreshed every `intervalMs`, for the taskbar/menu bar clock. */
export const useNow = (intervalMs = 15_000) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), intervalMs);
    return () => window.clearInterval(id);
  }, [intervalMs]);

  return now;
};
