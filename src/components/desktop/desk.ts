import { useCallback, useReducer } from "react";
import { windowLabels } from "../../constants";
import type { Language } from "../../types";
import {
  activeWindowId,
  initialWindowState,
  windowReducer,
  type DesktopArea,
  type OsKind,
  type WindowManagerState,
} from "./windowManager";

export type AppId = keyof typeof windowLabels;
export const APP_IDS = Object.keys(windowLabels) as AppId[];

/** Everything a shell needs to draw its desktop and drive the windows. */
export interface Desk {
  os: OsKind;
  language: Language;
  area: DesktopArea;
  state: WindowManagerState;
  active: string | null;
  /** Small screens open every window maximized. */
  compact: boolean;
  now: Date;
  getScale: () => number;
  open: (id: AppId) => void;
  close: (id: string) => void;
  focus: (id: string) => void;
  minimize: (id: string) => void;
  toggleMaximize: (id: string) => void;
  move: (id: string, x: number, y: number) => void;
  isOpen: (id: string) => boolean;
  switchOs: () => void;
}

export const useDesk = (
  base: Omit<
    Desk,
    | "state"
    | "active"
    | "open"
    | "close"
    | "focus"
    | "minimize"
    | "toggleMaximize"
    | "move"
    | "isOpen"
  >
): Desk => {
  const [state, dispatch] = useReducer(windowReducer, initialWindowState);
  const { area, compact } = base;

  const open = useCallback(
    (id: AppId) => dispatch({ type: "open", id, area, maximized: compact }),
    [area, compact]
  );
  const move = useCallback(
    (id: string, x: number, y: number) => dispatch({ type: "move", id, x, y, area }),
    [area]
  );

  return {
    ...base,
    state,
    active: activeWindowId(state),
    open,
    move,
    close: (id) => dispatch({ type: "close", id }),
    focus: (id) => dispatch({ type: "focus", id }),
    minimize: (id) => dispatch({ type: "minimize", id }),
    toggleMaximize: (id) => dispatch({ type: "toggleMaximize", id }),
    isOpen: (id) => state.windows.some((w) => w.id === id),
  };
};

export const appTitle = (id: string, language: Language) =>
  windowLabels[id]?.header[language] ?? id;

export const localeOf = (language: Language) => (language === "fr" ? "fr-FR" : "en-US");
