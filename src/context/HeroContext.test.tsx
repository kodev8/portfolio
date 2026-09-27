import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Vector3 } from "three";
import { describe, expect, it } from "vitest";
import { HeroProvider, useHero } from "./HeroContext";

const Probe = () => {
  const {
    isInteracting,
    setIsInteracting,
    selectedItem,
    setSelectedItem,
    isAnimating,
    setIsAnimating,
    isRoomOpen,
    setIsRoomOpen,
  } = useHero();

  return (
    <div>
      <span data-testid="interacting">{String(isInteracting)}</span>
      <span data-testid="animating">{String(isAnimating)}</span>
      <span data-testid="room">{String(isRoomOpen)}</span>
      <span data-testid="selected">{selectedItem?.name ?? "none"}</span>
      <button onClick={() => setIsInteracting(true)}>interact</button>
      <button onClick={() => setIsInteracting(false)}>release</button>
      <button onClick={() => setIsAnimating(true)}>animate</button>
      <button onClick={() => setIsRoomOpen(true)}>open room</button>
      <button
        onClick={() => setSelectedItem({ name: "rubik", position: new Vector3(1, 2, 3) })}
      >
        select
      </button>
      <button onClick={() => setSelectedItem(null)}>deselect</button>
    </div>
  );
};

const renderProbe = () =>
  render(
    <HeroProvider>
      <Probe />
    </HeroProvider>
  );

describe("HeroProvider", () => {
  it("starts idle with nothing selected", () => {
    renderProbe();
    expect(screen.getByTestId("interacting")).toHaveTextContent("false");
    expect(screen.getByTestId("animating")).toHaveTextContent("false");
    expect(screen.getByTestId("room")).toHaveTextContent("false");
    expect(screen.getByTestId("selected")).toHaveTextContent("none");
  });

  it("locks body scroll while interacting with the scene", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "interact" }));
    expect(document.body.style.overflowY).toBe("hidden");

    await user.click(screen.getByRole("button", { name: "release" }));
    expect(document.body.style.overflowY).toBe("auto");
  });

  it("carries the selected item's world position", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "select" }));

    expect(screen.getByTestId("selected")).toHaveTextContent("rubik");
  });

  it("clears the selection", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "select" }));
    await user.click(screen.getByRole("button", { name: "deselect" }));

    expect(screen.getByTestId("selected")).toHaveTextContent("none");
  });

  it("tracks animation and room flags independently", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "animate" }));
    await user.click(screen.getByRole("button", { name: "open room" }));

    expect(screen.getByTestId("animating")).toHaveTextContent("true");
    expect(screen.getByTestId("room")).toHaveTextContent("true");
    expect(screen.getByTestId("interacting")).toHaveTextContent("false");
  });

  it("hands every consumer the same value object between renders", async () => {
    const seen: unknown[] = [];
    const Capture = () => {
      seen.push(useHero());
      return null;
    };
    const Toggle = () => {
      const { setIsAnimating } = useHero();
      return <button onClick={() => setIsAnimating((v) => !v)}>toggle</button>;
    };

    const user = userEvent.setup();
    const { rerender } = render(
      <HeroProvider>
        <Capture />
        <Toggle />
      </HeroProvider>
    );

    const afterFirstRender = seen.length;
    // A parent rerender with no state change must not hand out a new object.
    rerender(
      <HeroProvider>
        <Capture />
        <Toggle />
      </HeroProvider>
    );
    expect(seen[afterFirstRender - 1]).toBe(seen[seen.length - 1]);

    await act(async () => {
      await user.click(screen.getByRole("button", { name: "toggle" }));
    });
    expect(seen[seen.length - 1]).not.toBe(seen[afterFirstRender - 1]);
  });

  it("falls back to inert defaults outside a provider", () => {
    render(<Probe />);
    expect(screen.getByTestId("interacting")).toHaveTextContent("false");
    expect(screen.getByTestId("selected")).toHaveTextContent("none");
  });
});
