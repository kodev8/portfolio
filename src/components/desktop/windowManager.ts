/**
 * Window state for the monitor's desktop, shared by both OS shells.
 *
 * A pure reducer so the stacking, cascading and clamping rules can be tested
 * without a browser; `useWindowManager` wraps it for components.
 */

export type OsKind = "windows" | "macos";

/** The usable desktop, in the screen's CSS pixels. Bars are carved out of it. */
export interface DesktopArea {
  width: number;
  height: number;
  /** Space taken at the top (macOS menu bar). */
  top: number;
  /** Space taken at the bottom (taskbar or dock). */
  bottom: number;
}

export interface WindowState {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

export interface WindowManagerState {
  windows: WindowState[];
  topZ: number;
}

export type WindowAction =
  | { type: "open"; id: string; area: DesktopArea; maximized?: boolean }
  | { type: "close"; id: string }
  | { type: "focus"; id: string }
  | { type: "minimize"; id: string }
  | { type: "toggleMaximize"; id: string }
  | { type: "move"; id: string; x: number; y: number; area: DesktopArea };

export const initialWindowState: WindowManagerState = { windows: [], topZ: 0 };

const CASCADE = 24;
const CASCADE_STEPS = 5;
/** How much of a window must stay on screen so it can always be dragged back. */
const KEEP_VISIBLE = 64;
const TITLE_BAR = 32;

const usableHeight = (area: DesktopArea) => area.height - area.top - area.bottom;

/** Where a newly opened window goes: centred, stepped down-right per window. */
export const placeNewWindow = (area: DesktopArea, openCount: number) => {
  const width = Math.round(Math.min(560, area.width * 0.72));
  const height = Math.round(Math.min(380, usableHeight(area) * 0.82));
  const step = (openCount % CASCADE_STEPS) * CASCADE;
  const x = Math.round((area.width - width) / 2 - CASCADE * 2 + step);
  const y = Math.round(area.top + 12 + step);

  // The cascade must never push a window under the taskbar or off the side.
  return {
    x: Math.min(Math.max(0, x), area.width - width),
    y: Math.min(y, area.height - area.bottom - height),
    width,
    height,
  };
};

/** Keeps a dragged window's title bar reachable inside the desktop. */
export const clampPosition = (
  win: Pick<WindowState, "width">,
  x: number,
  y: number,
  area: DesktopArea
) => ({
  x: Math.min(Math.max(x, KEEP_VISIBLE - win.width), area.width - KEEP_VISIBLE),
  y: Math.min(Math.max(y, area.top), area.height - area.bottom - TITLE_BAR),
});

/** Box a window actually occupies, accounting for maximize. */
export const windowRect = (win: WindowState, area: DesktopArea) =>
  win.maximized
    ? { x: 0, y: area.top, width: area.width, height: usableHeight(area) }
    : { x: win.x, y: win.y, width: win.width, height: win.height };

/** The window that has focus: the top-most one that isn't minimized. */
export const activeWindowId = (state: WindowManagerState) =>
  state.windows
    .filter((w) => !w.minimized)
    .reduce<WindowState | null>((top, w) => (!top || w.z > top.z ? w : top), null)
    ?.id ?? null;

const update = (
  state: WindowManagerState,
  id: string,
  patch: (win: WindowState) => Partial<WindowState>
): WindowManagerState => ({
  ...state,
  windows: state.windows.map((w) => (w.id === id ? { ...w, ...patch(w) } : w)),
});

const raise = (state: WindowManagerState, id: string): WindowManagerState => {
  const topZ = state.topZ + 1;
  return { ...update(state, id, () => ({ z: topZ, minimized: false })), topZ };
};

export const windowReducer = (
  state: WindowManagerState,
  action: WindowAction
): WindowManagerState => {
  const existing = state.windows.find((w) => w.id === action.id);

  switch (action.type) {
    case "open": {
      if (existing) return raise(state, action.id);
      const topZ = state.topZ + 1;
      const placed = placeNewWindow(action.area, state.windows.length);
      return {
        topZ,
        windows: [
          ...state.windows,
          {
            id: action.id,
            ...placed,
            z: topZ,
            minimized: false,
            maximized: action.maximized ?? false,
          },
        ],
      };
    }

    case "close":
      return { ...state, windows: state.windows.filter((w) => w.id !== action.id) };

    case "focus":
      return existing ? raise(state, action.id) : state;

    case "minimize":
      return existing ? update(state, action.id, () => ({ minimized: true })) : state;

    case "toggleMaximize":
      if (!existing) return state;
      return raise(
        update(state, action.id, (w) => ({ maximized: !w.maximized })),
        action.id
      );

    case "move":
      if (!existing || existing.maximized) return state;
      return update(state, action.id, (w) =>
        clampPosition(w, action.x, action.y, action.area)
      );
  }
};
