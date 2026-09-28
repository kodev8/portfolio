import { beforeEach, describe, expect, it, vi } from "vitest";
import { resolveZoom } from "./scene";

beforeEach(() => {
  // resolveZoom still carries a debug console.log; keep the suite output clean.
  vi.spyOn(console, "log").mockImplementation(() => {});
});

describe("resolveZoom", () => {
  it("uses the wide idle range when not interacting", () => {
    for (const isMobile of [true, false]) {
      for (const isScreen of [true, false]) {
        expect(resolveZoom({ isInteracting: false, isMobile, isScreen })).toEqual({
          maxDistance: 14,
          minDistance: 10,
        });
      }
    }
  });

  it("pulls the camera in on desktop while interacting", () => {
    expect(
      resolveZoom({ isInteracting: true, isMobile: false, isScreen: false })
    ).toEqual({ maxDistance: 10, minDistance: 3 });
  });

  it("ignores isScreen on desktop", () => {
    expect(
      resolveZoom({ isInteracting: true, isMobile: false, isScreen: true })
    ).toEqual({ maxDistance: 10, minDistance: 3 });
  });

  it("lets mobile get closer than desktop", () => {
    const mobile = resolveZoom({
      isInteracting: true,
      isMobile: true,
      isScreen: false,
    });
    const desktop = resolveZoom({
      isInteracting: true,
      isMobile: false,
      isScreen: false,
    });
    expect(mobile.minDistance).toBeLessThan(desktop.minDistance);
    expect(mobile).toEqual({ maxDistance: 10, minDistance: 1.5 });
  });

  it("holds the screen slightly further back on mobile", () => {
    expect(
      resolveZoom({ isInteracting: true, isMobile: true, isScreen: true })
    ).toEqual({ maxDistance: 10, minDistance: 1.8 });
  });

  it("always leaves minDistance below maxDistance", () => {
    for (const isInteracting of [true, false]) {
      for (const isMobile of [true, false]) {
        for (const isScreen of [true, false]) {
          const { maxDistance, minDistance } = resolveZoom({
            isInteracting,
            isMobile,
            isScreen,
          });
          expect(minDistance).toBeLessThan(maxDistance);
        }
      }
    }
  });
});
