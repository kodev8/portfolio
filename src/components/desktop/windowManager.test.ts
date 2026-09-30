import { describe, expect, it } from "vitest";
import {
  activeWindowId,
  clampPosition,
  initialWindowState,
  windowReducer,
  windowRect,
  type DesktopArea,
  type WindowAction,
  type WindowManagerState,
} from "./windowManager";

const area: DesktopArea = { width: 800, height: 480, top: 0, bottom: 40 };

const run = (...actions: WindowAction[]) =>
  actions.reduce<WindowManagerState>(windowReducer, initialWindowState);

const open = (id: string, extra: Partial<WindowAction> = {}) =>
  ({ type: "open", id, area, ...extra }) as WindowAction;

describe("windowReducer", () => {
  it("opens a window on top and gives it focus", () => {
    const state = run(open("projects"), open("videos"));

    expect(state.windows.map((w) => w.id)).toEqual(["projects", "videos"]);
    expect(activeWindowId(state)).toBe("videos");
  });

  it("cascades new windows so they don't stack exactly", () => {
    const [a, b] = run(open("projects"), open("videos")).windows;
    expect(b.x).toBeGreaterThan(a.x);
    expect(b.y).toBeGreaterThan(a.y);
  });

  it("fits new windows inside the usable area", () => {
    for (const w of run(open("a"), open("b"), open("c"), open("d"), open("e"))
      .windows) {
      expect(w.x).toBeGreaterThanOrEqual(0);
      expect(w.x + w.width).toBeLessThanOrEqual(area.width);
      expect(w.y + w.height).toBeLessThanOrEqual(area.height - area.bottom);
    }
  });

  it("re-opening an open window raises it instead of duplicating it", () => {
    const state = run(open("projects"), open("videos"), open("projects"));

    expect(state.windows).toHaveLength(2);
    expect(activeWindowId(state)).toBe("projects");
  });

  it("re-opening a minimized window restores it", () => {
    const state = run(
      open("projects"),
      { type: "minimize", id: "projects" },
      open("projects")
    );
    expect(state.windows[0].minimized).toBe(false);
  });

  it("hands focus to the next window down when the top one is minimized", () => {
    const state = run(open("a"), open("b"), open("c"), { type: "minimize", id: "c" });
    expect(activeWindowId(state)).toBe("b");
  });

  it("hands focus on when the top one is closed", () => {
    const state = run(open("a"), open("b"), { type: "close", id: "b" });
    expect(activeWindowId(state)).toBe("a");
  });

  it("has no active window when everything is minimized", () => {
    const state = run(open("a"), { type: "minimize", id: "a" });
    expect(activeWindowId(state)).toBeNull();
  });

  it("focusing raises a window above the rest", () => {
    const state = run(open("a"), open("b"), { type: "focus", id: "a" });
    expect(activeWindowId(state)).toBe("a");
  });

  it("can open straight into maximized, for small screens", () => {
    const state = run(open("a", { maximized: true } as Partial<WindowAction>));
    expect(windowRect(state.windows[0], area)).toEqual({
      x: 0,
      y: 0,
      width: 800,
      height: 440,
    });
  });

  it("toggles maximize and keeps the restored geometry", () => {
    const opened = run(open("a"));
    const before = windowRect(opened.windows[0], area);
    const state = [
      { type: "toggleMaximize", id: "a" },
      { type: "toggleMaximize", id: "a" },
    ].reduce<WindowManagerState>((s, a) => windowReducer(s, a as WindowAction), opened);

    expect(windowRect(state.windows[0], area)).toEqual(before);
  });

  it("maximized windows fill the space between the bars", () => {
    const withMenuBar = { ...area, top: 24, bottom: 56 };
    const state = run(
      { type: "open", id: "a", area: withMenuBar },
      { type: "toggleMaximize", id: "a" }
    );
    expect(windowRect(state.windows[0], withMenuBar)).toEqual({
      x: 0,
      y: 24,
      width: 800,
      height: 400,
    });
  });

  it("does not move a maximized window", () => {
    const state = run(
      open("a"),
      { type: "toggleMaximize", id: "a" },
      { type: "move", id: "a", x: 300, y: 200, area }
    );
    expect(windowRect(state.windows[0], area).x).toBe(0);
  });

  it("ignores actions for windows that aren't open", () => {
    const state = run(open("a"));
    for (const type of ["focus", "minimize", "toggleMaximize"] as const) {
      expect(windowReducer(state, { type, id: "nope" })).toBe(state);
    }
  });
});

describe("clampPosition", () => {
  const win = { width: 400 };

  it("leaves a position inside the desktop alone", () => {
    expect(clampPosition(win, 100, 50, area)).toEqual({ x: 100, y: 50 });
  });

  it("keeps a sliver of the window on screen horizontally", () => {
    expect(clampPosition(win, -1000, 50, area).x).toBe(64 - 400);
    expect(clampPosition(win, 5000, 50, area).x).toBe(800 - 64);
  });

  it("never lets the title bar go under a bar or off the top", () => {
    const bars = { ...area, top: 24, bottom: 56 };
    expect(clampPosition(win, 0, -50, bars).y).toBe(24);
    expect(clampPosition(win, 0, 5000, bars).y).toBe(480 - 56 - 32);
  });
});
