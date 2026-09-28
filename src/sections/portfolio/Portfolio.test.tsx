import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import Portfolio from "./Portfolio";
import { LanguageProvider } from "../../context/LanguageContext";
import { MediaProvider } from "../../context/MediaContext";
import { NavProvider } from "../../context/NavContext";
import { portfolioProjects } from "../../constants";
import { observedCount, setAllIntersecting } from "../../test/intersection";
import { VIEWPORTS, setViewportWidth } from "../../test/viewport";

const renderPortfolio = (width: number = VIEWPORTS.wide) => {
  setViewportWidth(width);
  return render(
    <LanguageProvider>
      <MediaProvider>
        <NavProvider>
          <Portfolio />
        </NavProvider>
      </MediaProvider>
    </LanguageProvider>
  );
};

const reveal = (isIntersecting: boolean) =>
  act(() => {
    setAllIntersecting(isIntersecting);
  });

/**
 * The reveal itself is a motion variant swap, and motion does not write inline
 * styles under jsdom, so there is nothing in the DOM to assert on. That the
 * observer actually drives useInView is covered in src/test/intersection.test.tsx;
 * here we pin the wiring and the responsive branches.
 */
describe("Portfolio", () => {
  it("renders every portfolio project", () => {
    renderPortfolio();
    for (const project of portfolioProjects) {
      expect(screen.getByText(project.title)).toBeInTheDocument();
    }
  });

  it("observes its sections for scroll reveal", () => {
    renderPortfolio();
    // One observer per ListSection, i.e. one per pair of projects.
    expect(observedCount()).toBe(Math.ceil(portfolioProjects.length / 2));
  });

  it("keeps the content mounted across a reveal", () => {
    renderPortfolio();
    const title = portfolioProjects[0].title;

    reveal(true);
    expect(screen.getByText(title)).toBeInTheDocument();

    reveal(false);
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it("drops the description on mobile but keeps the title", () => {
    renderPortfolio(VIEWPORTS.mobile);
    const project = portfolioProjects[0];

    expect(screen.getByText(project.title)).toBeInTheDocument();
    expect(screen.queryByText(project.desc.en)).not.toBeInTheDocument();
  });

  it("shows the description on desktop", () => {
    renderPortfolio(VIEWPORTS.wide);
    expect(screen.getByText(portfolioProjects[0].desc.en)).toBeInTheDocument();
  });

  it("pairs projects two to a section", () => {
    renderPortfolio();
    // An odd count would leave the last section with a single item; the guard
    // in ListSection has to hold either way.
    expect(observedCount() * 2).toBeGreaterThanOrEqual(portfolioProjects.length);
  });

  it("registers itself with the nav for scroll-spy", () => {
    const { container } = renderPortfolio();
    expect(container.querySelector("#portfolio")).toBeInTheDocument();
  });
});
