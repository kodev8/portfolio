import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MediaProvider, useMedia } from "./MediaContext";
import { VIEWPORTS, setViewportWidth } from "../test/viewport";

/**
 * Drives the real `useMediaQuery` against the test matchMedia rather than
 * mocking react-responsive, so the breakpoints themselves are under test.
 */
const Probe = () => {
  const { isMobile, isTablet, isLaptop, isDesktop } = useMedia();
  return (
    <span data-testid="flags">
      {[isMobile, isTablet, isLaptop, isDesktop].map((v) => (v ? "1" : "0")).join("")}
    </span>
  );
};

const renderAt = (width: number) => {
  setViewportWidth(width);
  return render(
    <MediaProvider>
      <Probe />
    </MediaProvider>
  );
};

const flags = () => screen.getByTestId("flags").textContent;

describe("MediaProvider", () => {
  it("reports nothing on a viewport wider than every breakpoint", () => {
    renderAt(VIEWPORTS.wide);
    expect(flags()).toBe("0000");
  });

  it("lights up every breakpoint on a phone", () => {
    // The breakpoints are nested max-widths, so a phone matches all four.
    renderAt(VIEWPORTS.mobile);
    expect(flags()).toBe("1111");
  });

  it("reports tablet without mobile", () => {
    renderAt(VIEWPORTS.tablet);
    expect(flags()).toBe("0111");
  });

  it("reports laptop and desktop only", () => {
    renderAt(VIEWPORTS.laptop);
    expect(flags()).toBe("0011");
  });

  it("reports only desktop just under the widest breakpoint", () => {
    renderAt(VIEWPORTS.desktop);
    expect(flags()).toBe("0001");
  });

  it("treats 768px as mobile and 769px as not", () => {
    renderAt(768);
    expect(flags()?.[0]).toBe("1");

    setViewportWidth(769);
    expect(flags()?.[0]).toBe("0");
  });

  it("follows a resize without a remount", () => {
    renderAt(VIEWPORTS.wide);
    expect(flags()).toBe("0000");

    setViewportWidth(VIEWPORTS.mobile);

    expect(flags()).toBe("1111");
  });

  it("falls back to all-false outside a provider", () => {
    setViewportWidth(VIEWPORTS.mobile);
    render(<Probe />);
    expect(flags()).toBe("0000");
  });
});
