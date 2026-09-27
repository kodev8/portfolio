import { act, render, screen } from "@testing-library/react";
import { useEffect, useRef } from "react";
import { describe, expect, it } from "vitest";
import { NavProvider, useNav } from "./NavContext";

/** Stands in for a real section: a div with a fixed offsetTop/offsetHeight. */
const Section = ({
  id,
  top,
  height,
}: {
  id: string;
  top: number;
  height: number;
}) => {
  const ref = useRef<HTMLElement | null>(null);
  const { registerSection } = useNav();

  useEffect(() => {
    if (ref.current) {
      Object.defineProperty(ref.current, "offsetTop", { value: top, configurable: true });
      Object.defineProperty(ref.current, "offsetHeight", { value: height, configurable: true });
    }
    registerSection(id, ref);
  }, [id, top, height, registerSection]);

  return <section ref={ref as React.RefObject<HTMLElement>} data-testid={`section-${id}`} />;
};

const ActiveNav = () => {
  const { activeNav } = useNav();
  return <span data-testid="active">{activeNav ?? "none"}</span>;
};

const SectionCount = () => {
  const { sections } = useNav();
  return <span data-testid="count">{Object.keys(sections).length}</span>;
};

const scrollTo = async (y: number) => {
  await act(async () => {
    window.scrollY = y;
    window.dispatchEvent(new Event("scroll"));
  });
};

describe("NavProvider", () => {
  it("starts with no active section", () => {
    render(
      <NavProvider>
        <ActiveNav />
      </NavProvider>
    );
    expect(screen.getByTestId("active")).toHaveTextContent("none");
  });

  it("registers each section once", async () => {
    render(
      <NavProvider>
        <SectionCount />
        <Section id="about" top={0} height={500} />
        <Section id="contact" top={500} height={500} />
      </NavProvider>
    );
    expect(await screen.findByText("2", { selector: "[data-testid=count]" })).toBeInTheDocument();
  });

  it("activates the section under the scroll position", async () => {
    render(
      <NavProvider>
        <ActiveNav />
        <Section id="about" top={0} height={500} />
        <Section id="contact" top={500} height={500} />
      </NavProvider>
    );

    await scrollTo(600);

    expect(screen.getByTestId("active")).toHaveTextContent("contact");
  });

  it("reports the portfolio section as 'projects'", async () => {
    // The nav link is #projects but the section registers itself as portfolio.
    render(
      <NavProvider>
        <ActiveNav />
        <Section id="portfolio" top={0} height={500} />
      </NavProvider>
    );

    await scrollTo(100);

    expect(screen.getByTestId("active")).toHaveTextContent("projects");
  });

  it("follows the scroll from one section to the next", async () => {
    render(
      <NavProvider>
        <ActiveNav />
        <Section id="about" top={0} height={500} />
        <Section id="experience" top={500} height={500} />
        <Section id="contact" top={1000} height={500} />
      </NavProvider>
    );

    await scrollTo(100);
    expect(screen.getByTestId("active")).toHaveTextContent("about");

    await scrollTo(700);
    expect(screen.getByTestId("active")).toHaveTextContent("experience");

    await scrollTo(1200);
    expect(screen.getByTestId("active")).toHaveTextContent("contact");
  });

  it("keeps the last match when scrolling into a gap between sections", async () => {
    render(
      <NavProvider>
        <ActiveNav />
        <Section id="about" top={0} height={200} />
        <Section id="contact" top={1000} height={200} />
      </NavProvider>
    );

    await scrollTo(100);
    expect(screen.getByTestId("active")).toHaveTextContent("about");

    await scrollTo(600); // nothing covers this offset
    expect(screen.getByTestId("active")).toHaveTextContent("about");
  });

  it("ignores sections whose ref never attached", async () => {
    const Unattached = () => {
      const { registerSection } = useNav();
      const ref = useRef<HTMLElement | null>(null);
      useEffect(() => registerSection("ghost", ref), [registerSection]);
      return null;
    };

    render(
      <NavProvider>
        <ActiveNav />
        <Unattached />
        <Section id="about" top={0} height={500} />
      </NavProvider>
    );

    await scrollTo(100);

    expect(screen.getByTestId("active")).toHaveTextContent("about");
  });

  it("stops listening once unmounted", async () => {
    const { unmount } = render(
      <NavProvider>
        <ActiveNav />
        <Section id="about" top={0} height={500} />
      </NavProvider>
    );

    unmount();

    // Would throw on a detached tree if the listener were still attached.
    await scrollTo(100);
  });
});
