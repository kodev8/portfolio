import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AnimationProvider, useAnimation } from "./AnimationContext";

const Probe = () => {
  const { animationComplete, setAnimationComplete } = useAnimation();
  return (
    <div>
      <span data-testid="complete">{String(animationComplete)}</span>
      <button onClick={() => setAnimationComplete(true)}>finish</button>
    </div>
  );
};

const renderProbe = () =>
  render(
    <AnimationProvider>
      <Probe />
    </AnimationProvider>
  );

describe("AnimationProvider", () => {
  it("starts incomplete", () => {
    renderProbe();
    expect(screen.getByTestId("complete")).toHaveTextContent("false");
  });

  it("locks the page and pins it to the top during the intro", () => {
    renderProbe();
    expect(document.body.style.overflow).toBe("hidden");
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("releases scroll once the intro finishes", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "finish" }));

    expect(screen.getByTestId("complete")).toHaveTextContent("true");
    expect(document.body.style.overflowY).toBe("auto");
  });

  it("does not re-pin the scroll after completion", async () => {
    const user = userEvent.setup();
    renderProbe();
    await user.click(screen.getByRole("button", { name: "finish" }));

    vi.mocked(window.scrollTo).mockClear();
    await user.click(screen.getByRole("button", { name: "finish" }));

    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});
