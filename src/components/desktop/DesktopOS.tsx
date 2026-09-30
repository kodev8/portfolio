import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "../../context/LanguageContext";
import type { Language } from "../../types";
import { BOOT_MS, BootSplash, OsChooser } from "./BootScreen";
import { useNow } from "./hooks";
import MacShell, { MAC_DOCK, MAC_MENU_BAR } from "./MacShell";
import { useDesk } from "./desk";
import type { DesktopArea, OsKind } from "./windowManager";
import WindowsShell, { WINDOWS_TASKBAR } from "./WindowsShell";

interface ShellProps {
  os: OsKind;
  language: Language;
  width: number;
  height: number;
  compact: boolean;
  getScale: () => number;
  onSwitch: (next: OsKind) => void;
}

const Shell = ({
  os,
  language,
  width,
  height,
  compact,
  getScale,
  onSwitch,
}: ShellProps) => {
  const now = useNow();
  const area = useMemo<DesktopArea>(
    () =>
      os === "windows"
        ? { width, height, top: 0, bottom: WINDOWS_TASKBAR }
        : { width, height, top: MAC_MENU_BAR, bottom: MAC_DOCK },
    [os, width, height]
  );
  const desk = useDesk({
    os,
    language,
    area,
    compact,
    now,
    getScale,
    switchOs: () => onSwitch(os === "windows" ? "macos" : "windows"),
  });

  return os === "windows" ? <WindowsShell desk={desk} /> : <MacShell desk={desk} />;
};

/**
 * The monitor's operating system: a chooser the first time, a short boot
 * splash, then the picked desktop. Sized in the screen's own CSS pixels.
 */
const DesktopOS = ({
  width,
  height,
  compact,
  os,
  onOsChange,
}: {
  width: number;
  height: number;
  /** Small screens: open every window maximized. */
  compact: boolean;
  /** The picked desktop, or null to show the chooser. Owned by the monitor,
   * which also paints it on the screen from across the room. */
  os: OsKind | null;
  onOsChange: (next: OsKind) => void;
}) => {
  const { language } = useLanguage();
  const [booting, setBooting] = useState<OsKind | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!booting) return;
    const id = window.setTimeout(() => {
      onOsChange(booting);
      setBooting(null);
    }, BOOT_MS);
    return () => window.clearTimeout(id);
  }, [booting, onOsChange]);

  // The 3D view scales this whole element; drags need screen px -> CSS px.
  const getScale = useCallback(() => {
    const el = rootRef.current;
    if (!el?.offsetWidth) return 1;
    return el.getBoundingClientRect().width / el.offsetWidth || 1;
  }, []);

  return (
    <div ref={rootRef} className="h-full w-full overflow-hidden font-sans">
      {booting ? (
        <BootSplash os={booting} language={language} />
      ) : os ? (
        <Shell
          // A fresh desktop per OS: switching reboots with no windows open.
          key={os}
          os={os}
          language={language}
          width={width}
          height={height}
          compact={compact}
          getScale={getScale}
          onSwitch={setBooting}
        />
      ) : (
        <OsChooser language={language} onChoose={setBooting} />
      )}
    </div>
  );
};

export default DesktopOS;
