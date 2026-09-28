import { act, render, screen } from "@testing-library/react";
import { useInView } from "motion/react";
import { useRef } from "react";
import { describe, expect, it } from "vitest";
import { observedCount, setAllIntersecting, setIntersecting } from "./intersection";

/**
 * Proves the IntersectionObserver fake actually drives `useInView`, which is
 * what every scroll-reveal in the app is built on. Without this the fake could
 * silently regress to the no-op it replaced and nothing would notice.
 */
const Watcher = ({ name }: { name: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  return (
    <div ref={ref} data-testid={name}>
      {inView ? "in" : "out"}
    </div>
  );
};

const state = (name: string) => screen.getByTestId(name).textContent;

describe("intersection observer fake", () => {
  it("registers each observed element", () => {
    render(<Watcher name="a" />);
    expect(observedCount()).toBe(1);
  });

  it("counts several watchers", () => {
    render(
      <>
        <Watcher name="a" />
        <Watcher name="b" />
      </>
    );
    expect(observedCount()).toBe(2);
  });

  it("starts out of view", () => {
    render(<Watcher name="a" />);
    expect(state("a")).toBe("out");
  });

  it("brings everything into view", () => {
    render(<Watcher name="a" />);

    act(() => setAllIntersecting(true));

    expect(state("a")).toBe("in");
  });

  it("takes everything back out of view", () => {
    render(<Watcher name="a" />);
    act(() => setAllIntersecting(true));

    act(() => setAllIntersecting(false));

    expect(state("a")).toBe("out");
  });

  it("targets a single element without disturbing the others", () => {
    render(
      <>
        <Watcher name="a" />
        <Watcher name="b" />
      </>
    );

    act(() => setIntersecting(screen.getByTestId("a"), true));

    expect(state("a")).toBe("in");
    expect(state("b")).toBe("out");
  });

  it("stops observing once unmounted", () => {
    const { unmount } = render(<Watcher name="a" />);
    expect(observedCount()).toBe(1);

    unmount();

    expect(observedCount()).toBe(0);
  });

  it("resets between tests", () => {
    // The afterEach in setup.ts clears the registry; nothing should leak in.
    expect(observedCount()).toBe(0);
  });
});
