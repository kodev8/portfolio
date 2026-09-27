import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { LanguageProvider, useLanguage } from "./LanguageContext";

const Probe = () => {
  const { language, updateLanguage } = useLanguage();
  return (
    <div>
      <span data-testid="lang">{language}</span>
      <button onClick={() => updateLanguage("fr")}>fr</button>
      <button onClick={() => updateLanguage("en")}>en</button>
    </div>
  );
};

const renderProbe = () =>
  render(
    <LanguageProvider>
      <Probe />
    </LanguageProvider>
  );

describe("LanguageProvider", () => {
  it("defaults to english when nothing is stored", () => {
    renderProbe();
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
  });

  it("restores a stored language on mount", async () => {
    window.localStorage.setItem("language", "fr");
    renderProbe();
    expect(await screen.findByText("fr", { selector: "[data-testid=lang]" })).toBeInTheDocument();
  });

  it("persists the language when it changes", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "fr" }));

    expect(screen.getByTestId("lang")).toHaveTextContent("fr");
    expect(window.localStorage.getItem("language")).toBe("fr");
  });

  it("round-trips through a remount", async () => {
    const user = userEvent.setup();
    const { unmount } = renderProbe();
    await user.click(screen.getByRole("button", { name: "fr" }));
    unmount();

    renderProbe();

    expect(await screen.findByText("fr", { selector: "[data-testid=lang]" })).toBeInTheDocument();
  });

  it("ignores a junk value in storage instead of rendering it", () => {
    // A stale or hand-edited entry must not reach `content[language]` lookups,
    // which would render undefined across the whole site.
    window.localStorage.setItem("language", "de");
    renderProbe();
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
  });

  it("falls back to english outside a provider rather than throwing", () => {
    // The context ships a real default, so a stray consumer degrades quietly.
    render(<Probe />);
    expect(screen.getByTestId("lang")).toHaveTextContent("en");
  });

  it("does not write to storage until the language actually changes", () => {
    renderProbe();
    expect(window.localStorage.getItem("language")).toBeNull();
  });

  it("switches back to english after being set to french", async () => {
    const user = userEvent.setup();
    renderProbe();

    await user.click(screen.getByRole("button", { name: "fr" }));
    await user.click(screen.getByRole("button", { name: "en" }));

    expect(screen.getByTestId("lang")).toHaveTextContent("en");
    expect(window.localStorage.getItem("language")).toBe("en");
  });

  it("keeps every consumer in sync", async () => {
    const user = userEvent.setup();
    render(
      <LanguageProvider>
        <Probe />
        <Probe />
      </LanguageProvider>
    );

    await act(async () => {
      await user.click(screen.getAllByRole("button", { name: "fr" })[0]);
    });

    for (const node of screen.getAllByTestId("lang")) {
      expect(node).toHaveTextContent("fr");
    }
  });
});
