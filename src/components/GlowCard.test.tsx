import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import GlowCard from "./GlowCard";

const card = (props: Partial<React.ComponentProps<typeof GlowCard>> = {}) =>
  render(
    <GlowCard index={0} {...props}>
      <p>inner</p>
    </GlowCard>
  );

/** The card root is the element that owns the --start custom property. */
const root = () => screen.getByText("inner").closest(".card") as HTMLElement;

describe("GlowCard", () => {
  it("renders its children", () => {
    card();
    expect(screen.getByText("inner")).toBeInTheDocument();
  });

  it("appends a custom class name", () => {
    card({ className: "extra-class" });
    expect(root()).toHaveClass("extra-class");
  });

  it("renders no stars by default", () => {
    card();
    expect(screen.queryByAltText("star")).not.toBeInTheDocument();
  });

  it("renders a five-star row whenever stars is positive", () => {
    // The component ignores the actual number and always draws five.
    card({ stars: 3 });
    expect(screen.getAllByAltText("star")).toHaveLength(5);
  });

  it("sets the glow angle from the pointer position", () => {
    card();
    const el = root();
    el.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 200, height: 200 }) as DOMRect;

    fireEvent.mouseMove(el, { clientX: 200, clientY: 100 });

    // Pointer due east of centre: atan2(0, 100) = 0deg, plus the 60 offset.
    expect(el.style.getPropertyValue("--start")).toBe("60");
  });

  it("normalises a negative angle into 0-360 before offsetting", () => {
    card();
    const el = root();
    el.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 200, height: 200 }) as DOMRect;

    fireEvent.mouseMove(el, { clientX: 100, clientY: 0 });

    // Due north: atan2(-100, 0) = -90deg, normalised to 270, plus 60.
    expect(el.style.getPropertyValue("--start")).toBe("330");
  });

  it("writes a plain number string, not a px value", () => {
    card();
    const el = root();
    el.getBoundingClientRect = () =>
      ({ left: 0, top: 0, width: 100, height: 100 }) as DOMRect;

    fireEvent.mouseMove(el, { clientX: 100, clientY: 50 });

    expect(el.style.getPropertyValue("--start")).toMatch(/^-?\d+(\.\d+)?$/);
  });

  it("survives a pointer move before the ref is populated", () => {
    // index falls outside cardRefs, so the handler must bail rather than throw.
    render(
      <GlowCard index={99}>
        <p>inner</p>
      </GlowCard>
    );
    expect(() => fireEvent.mouseMove(root())).not.toThrow();
  });
});
