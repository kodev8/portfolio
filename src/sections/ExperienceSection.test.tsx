import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import ExperienceSection from "./ExperienceSection";
import { LanguageProvider } from "../context/LanguageContext";
import { MediaProvider } from "../context/MediaContext";
import { NavProvider } from "../context/NavContext";
import {
  expCertifications,
  expEducationCards,
  expWorkCards,
  experienceTabs,
} from "../constants";

const renderSection = () => {
  const user = userEvent.setup();
  const view = render(
    <LanguageProvider>
      <MediaProvider>
        <NavProvider>
          <ExperienceSection />
        </NavProvider>
      </MediaProvider>
    </LanguageProvider>
  );
  return { user, ...view };
};

const tab = (key: keyof typeof experienceTabs) =>
  screen.getByRole("button", { name: experienceTabs[key].tabLabel.en });

describe("ExperienceSection", () => {
  it("renders a button per tab", () => {
    renderSection();
    for (const key of Object.keys(experienceTabs)) {
      expect(
        screen.getByRole("button", {
          name: experienceTabs[key].tabLabel.en,
        })
      ).toBeInTheDocument();
    }
  });

  it("opens on the work tab", () => {
    renderSection();
    expect(screen.getByText(experienceTabs.work.sub.en)).toBeInTheDocument();
  });

  it("lists the work cards first", () => {
    renderSection();
    expect(screen.getByText(expWorkCards[0].title.en)).toBeInTheDocument();
  });

  it("swaps content when a different tab is picked", async () => {
    const { user } = renderSection();

    await user.click(tab("education"));

    expect(screen.getByText(expEducationCards[0].title.en)).toBeInTheDocument();
    expect(screen.queryByText(expWorkCards[0].title.en)).not.toBeInTheDocument();
  });

  it("shows certifications on their tab", async () => {
    const { user } = renderSection();

    await user.click(tab("certifications"));

    expect(screen.getByText(expCertifications[0].title.en)).toBeInTheDocument();
  });

  it("updates the sticky sub-heading with the tab", async () => {
    const { user } = renderSection();

    await user.click(tab("education"));

    expect(screen.getByText(experienceTabs.education.sub.en)).toBeInTheDocument();
    expect(screen.queryByText(experienceTabs.work.sub.en)).not.toBeInTheDocument();
  });

  it("marks only the active tab as bold", async () => {
    const { user } = renderSection();
    expect(tab("work")).toHaveClass("font-bold");
    expect(tab("education")).not.toHaveClass("font-bold");

    await user.click(tab("education"));

    expect(tab("education")).toHaveClass("font-bold");
    expect(tab("work")).not.toHaveClass("font-bold");
  });

  it("can return to the work tab", async () => {
    const { user } = renderSection();

    await user.click(tab("certifications"));
    await user.click(tab("work"));

    expect(screen.getByText(expWorkCards[0].title.en)).toBeInTheDocument();
  });

  it("re-clicking the active tab is a no-op", async () => {
    const { user } = renderSection();

    await user.click(tab("work"));

    expect(screen.getByText(expWorkCards[0].title.en)).toBeInTheDocument();
    expect(tab("work")).toHaveClass("font-bold");
  });

  it("registers itself with the nav for scroll-spy", () => {
    const { container } = renderSection();
    expect(container.querySelector("section#experience")).toBeInTheDocument();
  });

  it("renders every bullet for a card", () => {
    renderSection();
    for (const detail of expWorkCards[0].details.en) {
      expect(screen.getByText(detail)).toBeInTheDocument();
    }
  });
});
