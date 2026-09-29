import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import ProjectCarousel, { slideDurationMs } from "./ProjectCarousel";

const IMAGES = ["/a.png", "/b.png", "/c.png"];

type Props = Partial<React.ComponentProps<typeof ProjectCarousel>>;

/** Real timers: fine for anything that doesn't need to skip ahead in time. */
const setup = (props: Props = {}) => {
  const user = userEvent.setup();
  const view = render(<ProjectCarousel images={IMAGES} {...props} />);
  return { user, ...view };
};

/**
 * Fake timers, for the 500ms transition lock and the 5s autoplay tick.
 * `shouldAdvanceTime` keeps userEvent's internal waits from deadlocking.
 */
const setupWithClock = (props: Props = {}) => {
  vi.useFakeTimers({ shouldAdvanceTime: true });
  const user = userEvent.setup({ advanceTimers: (ms) => vi.advanceTimersByTime(ms) });
  const view = render(<ProjectCarousel images={IMAGES} {...props} />);
  return { user, ...view };
};

const counter = () => screen.getByText(/^\d+\/\d+$/);
/** The element carrying the hover handlers: the counter's parent. */
const stage = () => counter().parentElement as HTMLElement;
const next = () => screen.getByRole("button", { name: /next image/i });
const prev = () => screen.getByRole("button", { name: /previous image/i });

beforeEach(() => {
  // jsdom has no media pipeline; these would otherwise throw "not implemented".
  HTMLMediaElement.prototype.play = vi.fn().mockResolvedValue(undefined);
  HTMLMediaElement.prototype.pause = vi.fn();
});

afterEach(() => {
  vi.useRealTimers();
});

describe("ProjectCarousel", () => {
  describe("rendering", () => {
    it("renders one slide per image", () => {
      setup();
      expect(screen.getAllByRole("img")).toHaveLength(IMAGES.length);
    });

    it("starts on the first slide", () => {
      setup();
      expect(counter()).toHaveTextContent("1/3");
    });

    it("numbers slides from 1 when there is no video", () => {
      setup();
      expect(screen.getByAltText("Slide 1")).toBeInTheDocument();
      expect(screen.getByAltText("Slide 3")).toBeInTheDocument();
    });

    it("offsets image numbering when a video takes the first slot", () => {
      setup({ videoUrl: "/clip.mp4" });
      expect(screen.getByAltText("Slide 2")).toBeInTheDocument();
      expect(screen.queryByAltText("Slide 1")).not.toBeInTheDocument();
    });

    it("counts the video as an extra slide", () => {
      setup({ videoUrl: "/clip.mp4" });
      expect(counter()).toHaveTextContent("1/4");
    });

    it("hides the counter when there is nothing to page through", () => {
      setup({ images: ["/only.png"] });
      expect(screen.queryByText(/^\d+\/\d+$/)).not.toBeInTheDocument();
    });

    it("gives every slide an accessible name", () => {
      setup({ videoUrl: "/clip.mp4" });
      for (const img of screen.getAllByRole("img")) {
        expect(img).toHaveAccessibleName();
      }
    });

    it("gives both nav controls an accessible name", () => {
      setup({ controls: true });
      expect(next()).toBeInTheDocument();
      expect(prev()).toBeInTheDocument();
    });
  });

  describe("navigation", () => {
    it("advances with the next control", async () => {
      const { user } = setup({ controls: true });

      await user.click(next());

      expect(counter()).toHaveTextContent("2/3");
    });

    it("wraps past the last slide back to the first", async () => {
      const { user } = setupWithClock({ controls: true });

      for (let i = 0; i < 3; i++) {
        await user.click(next());
        await act(async () => {
          vi.advanceTimersByTime(slideDurationMs());
        });
      }

      expect(counter()).toHaveTextContent("1/3");
    });

    it("wraps backwards from the first slide to the last", async () => {
      const { user } = setup({ controls: true });

      await user.click(prev());

      expect(counter()).toHaveTextContent("3/3");
    });

    it("locks out a second click while the transition is running", async () => {
      const { user } = setupWithClock({ controls: true });

      await user.click(next());
      expect(next()).toBeDisabled();

      expect(counter()).toHaveTextContent("2/3");
    });

    it("accepts the next click once the transition clears", async () => {
      const { user } = setupWithClock({ controls: true });

      await user.click(next());
      await act(async () => {
        vi.advanceTimersByTime(slideDurationMs());
      });
      await user.click(next());

      expect(counter()).toHaveTextContent("3/3");
    });

    it("offers no navigation for a single image", () => {
      setup({ images: ["/only.png"], controls: true });

      expect(
        screen.queryByRole("button", { name: /next image/i })
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole("button", { name: /previous image/i })
      ).not.toBeInTheDocument();
    });

    it("offsets the slide track by one viewport per index", async () => {
      const { user, container } = setup({ controls: true });
      const track = container.querySelector(".transition-transform") as HTMLElement;
      expect(track).toHaveStyle({ transform: "translateX(-0%)" });

      await user.click(next());

      expect(track).toHaveStyle({ transform: "translateX(-100%)" });
    });

    it("reveals navigation on hover when controls are off", async () => {
      const { user } = setup();
      expect(
        screen.queryByRole("button", { name: /next image/i })
      ).not.toBeInTheDocument();

      await user.hover(stage());

      expect(
        await screen.findByRole("button", { name: /next image/i })
      ).toBeInTheDocument();
    });
  });

  describe("autoplay", () => {
    it("advances after five seconds of hover", async () => {
      const { user } = setupWithClock({ autoplay: true });

      await user.hover(stage());
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      expect(counter()).toHaveTextContent("2/3");
    });

    it("stays put while the pointer is away", async () => {
      setupWithClock({ autoplay: true });

      await act(async () => {
        vi.advanceTimersByTime(15000);
      });

      expect(counter()).toHaveTextContent("1/3");
    });
  });

  describe("video slide", () => {
    it("renders the video muted and without autoplay", () => {
      const { container } = setup({ videoUrl: "/clip.mp4" });
      const video = container.querySelector("video") as HTMLVideoElement;

      expect(video).toHaveAttribute("src", "/clip.mp4");
      expect(video.muted).toBe(true);
      expect(video.autoplay).toBe(false);
    });

    it("uses the first image as the poster", () => {
      const { container } = setup({ videoUrl: "/clip.mp4" });
      expect(container.querySelector("video")).toHaveAttribute("poster", IMAGES[0]);
    });

    it("holds autoplay on the video until the clip ends", async () => {
      const { user } = setupWithClock({ videoUrl: "/clip.mp4", autoplay: true });

      await user.hover(stage());
      await act(async () => {
        vi.advanceTimersByTime(5000);
      });

      expect(counter()).toHaveTextContent("1/4");
    });

    it("moves past the video once it reports ended", async () => {
      const { container } = setup({ videoUrl: "/clip.mp4", autoplay: true });
      const video = container.querySelector("video") as HTMLVideoElement;

      await act(async () => {
        video.dispatchEvent(new Event("ended"));
      });

      await waitFor(() => expect(counter()).toHaveTextContent("2/4"));
    });

    it("pauses the video when navigating away from it", async () => {
      const { user } = setup({ videoUrl: "/clip.mp4", controls: true });

      await user.click(next());

      expect(HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    });
  });

  describe("expanded dialog", () => {
    it("titles the dialog with the project name", async () => {
      // projectTitle only surfaces in the modal, not on the inline carousel.
      const { user } = setup({ projectTitle: "Statroom" });

      await user.click(screen.getByRole("button", { name: /expand/i }));

      expect(
        within(await screen.findByRole("dialog")).getByText("Statroom")
      ).toBeInTheDocument();
    });

    it("falls back to a generic dialog title", async () => {
      const { user } = setup();

      await user.click(screen.getByRole("button", { name: /expand/i }));

      expect(
        within(await screen.findByRole("dialog")).getByText("Project Gallery")
      ).toBeInTheDocument();
    });
  });
});
