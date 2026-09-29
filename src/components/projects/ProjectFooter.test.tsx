import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import ProjectFooter from "./ProjectFooter";
import { LanguageProvider } from "../../context/LanguageContext";
import { viewGitHubText, viewLiveText } from "../../constants";
import type { Project } from "../../types";

const project = (overrides: Partial<Project> = {}): Project => ({
  id: 1,
  title: "Statroom",
  desc: { en: "stats", fr: "stats" },
  stack: ["React", "TypeScript"],
  category: "personal",
  ...overrides,
});

const renderFooter = (p: Project, language: "en" | "fr" = "en") => {
  if (language === "fr") window.localStorage.setItem("language", "fr");
  return render(
    <LanguageProvider>
      <ProjectFooter project={p} />
    </LanguageProvider>
  );
};

describe("ProjectFooter", () => {
  it("renders a badge per stack entry", () => {
    renderFooter(project());
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("TypeScript")).toBeInTheDocument();
  });

  it("renders no badges for an empty stack", () => {
    const { container } = renderFooter(project({ stack: [] }));
    expect(container.querySelectorAll("[data-slot=badge]")).toHaveLength(0);
  });

  it("omits both links when the project has neither", () => {
    renderFooter(project());
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("links out to the live site", () => {
    renderFooter(project({ liveUrl: "https://example.com" }));
    const link = screen.getByRole("link", { name: viewLiveText.en });
    expect(link).toHaveAttribute("href", "https://example.com");
  });

  it("links out to github", () => {
    renderFooter(project({ githubUrl: "https://github.com/x/y" }));
    expect(screen.getByRole("link", { name: viewGitHubText.en })).toHaveAttribute(
      "href",
      "https://github.com/x/y"
    );
  });

  it("opens external links safely in a new tab", () => {
    renderFooter(
      project({ liveUrl: "https://example.com", githubUrl: "https://gh.com" })
    );
    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", expect.stringContaining("noopener"));
    }
  });

  it("labels the buttons in the active language", async () => {
    renderFooter(project({ liveUrl: "https://example.com" }), "fr");
    expect(await screen.findByText(viewLiveText.fr)).toBeInTheDocument();
  });
});
