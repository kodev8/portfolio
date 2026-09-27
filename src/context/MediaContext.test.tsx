import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { MediaProvider, useMedia } from "./MediaContext";

const matches = vi.hoisted(() => ({ value: new Set<string>() }));

vi.mock("react-responsive", () => ({
  useMediaQuery: ({ query }: { query: string }) => matches.value.has(query),
}));

const MOBILE = "(max-width: 768px)";
const TABLET = "(max-width: 1024px)";
const LAPTOP = "(max-width: 1280px)";
const DESKTOP = "(max-width: 1440px)";

const Probe = () => {
  const { isMobile, isTablet, isLaptop, isDesktop } = useMedia();
  return (
    <span data-testid="flags">
      {[isMobile, isTablet, isLaptop, isDesktop].map((v) => (v ? "1" : "0")).join("")}
    </span>
  );
};

const renderAt = (...queries: string[]) => {
  matches.value = new Set(queries);
  return render(
    <MediaProvider>
      <Probe />
    </MediaProvider>
  );
};

beforeEach(() => {
  matches.value = new Set();
});

describe("MediaProvider", () => {
  it("reports nothing on a viewport wider than every breakpoint", () => {
    renderAt();
    expect(screen.getByTestId("flags")).toHaveTextContent("0000");
  });

  it("lights up every breakpoint on a phone", () => {
    // Breakpoints are nested max-widths, so a phone matches all four.
    renderAt(MOBILE, TABLET, LAPTOP, DESKTOP);
    expect(screen.getByTestId("flags")).toHaveTextContent("1111");
  });

  it("reports tablet without mobile", () => {
    renderAt(TABLET, LAPTOP, DESKTOP);
    expect(screen.getByTestId("flags")).toHaveTextContent("0111");
  });

  it("reports only desktop just under the widest breakpoint", () => {
    renderAt(DESKTOP);
    expect(screen.getByTestId("flags")).toHaveTextContent("0001");
  });

  it("falls back to all-false outside a provider", () => {
    render(<Probe />);
    expect(screen.getByTestId("flags")).toHaveTextContent("0000");
  });
});
