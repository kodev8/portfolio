import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { MotionProvider, useMotion } from "./MotionContext";
import { setViewportWidth } from "../test/viewport";

const Probe = () => {
  const { motion, isExplicit, toggleMotion, setMotion } = useMotion();
  return (
    <div>
      <span data-testid="motion">{motion}</span>
      <span data-testid="explicit">{String(isExplicit)}</span>
      <button onClick={toggleMotion}>toggle</button>
      <button onClick={() => setMotion("reduced")}>reduce</button>
    </div>
  );
};

const renderProbe = () =>
  render(
    <MotionProvider>
      <Probe />
    </MotionProvider>
  );

const value = () => screen.getByTestId("motion").textContent;

/** The test matchMedia answers width queries; force the reduce query too. */
const prefersReduced = (reduce: boolean) => {
  const real = window.matchMedia;
  window.matchMedia = ((query: string) =>
    query.includes("prefers-reduced-motion")
      ? {
          matches: reduce,
          media: query,
          onchange: null,
          addEventListener: () => {},
          removeEventListener: () => {},
          addListener: () => {},
          removeListener: () => {},
          dispatchEvent: () => true,
        }
      : real(query)) as typeof window.matchMedia;
};

afterEach(() => {
  delete document.documentElement.dataset.motion;
});

describe("MotionProvider", () => {
  it("defaults to full motion", async () => {
    renderProbe();
    expect(
      await screen.findByText("full", { selector: "[data-testid=motion]" })
    ).toBeInTheDocument();
  });

  it("follows the OS when it asks to reduce", async () => {
    setViewportWidth(1440);
    prefersReduced(true);

    renderProbe();

    expect(
      await screen.findByText("reduced", { selector: "[data-testid=motion]" })
    ).toBeInTheDocument();
  });

  it("reports that an inherited preference is not explicit", async () => {
    prefersReduced(true);
    renderProbe();
    await screen.findByText("reduced", { selector: "[data-testid=motion]" });

    expect(screen.getByTestId("explicit")).toHaveTextContent("false");
  });

  it("writes the preference onto the document element", async () => {
    renderProbe();
    await screen.findByText("full", { selector: "[data-testid=motion]" });

    expect(document.documentElement.dataset.motion).toBe("full");
  });

  it("toggles to reduced and back", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "toggle" }));
    expect(value()).toBe("reduced");
    expect(document.documentElement.dataset.motion).toBe("reduced");

    await user.click(screen.getByRole("button", { name: "toggle" }));
    expect(value()).toBe("full");
  });

  it("persists an explicit choice", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "reduce" }));

    expect(window.localStorage.getItem("motion-preference")).toBe("reduced");
    expect(screen.getByTestId("explicit")).toHaveTextContent("true");
  });

  it("restores the stored choice on a later visit", async () => {
    window.localStorage.setItem("motion-preference", "reduced");

    renderProbe();

    expect(
      await screen.findByText("reduced", { selector: "[data-testid=motion]" })
    ).toBeInTheDocument();
  });

  it("lets an explicit full choice override an OS that asks to reduce", async () => {
    // The whole point of the toggle: the visitor gets the last word.
    prefersReduced(true);
    window.localStorage.setItem("motion-preference", "full");

    renderProbe();

    expect(
      await screen.findByText("full", { selector: "[data-testid=motion]" })
    ).toBeInTheDocument();
  });

  it("ignores a junk value in storage", async () => {
    window.localStorage.setItem("motion-preference", "sideways");

    renderProbe();

    expect(
      await screen.findByText("full", { selector: "[data-testid=motion]" })
    ).toBeInTheDocument();
  });

  it("falls back to full motion outside a provider", () => {
    render(<Probe />);
    expect(value()).toBe("full");
  });
});
