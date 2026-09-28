import { useEffect } from "react";
import { useMotion } from "../context/MotionContext";
import { useMedia } from "../context/MediaContext";

/**
 * Glide the page onto a section start when scrolling comes to rest near one.
 *
 * CSS scroll-snap cannot express what this layout needs. `mandatory` forces
 * the scroller to rest on a snap point, which makes a section taller than the
 * viewport (Experience runs to ~2400px) impossible to read. `proximity` only
 * engages when the rest position is already close to a snap point, which
 * almost never happens when the points are thousands of pixels apart. So the
 * assist lives here: free scrolling everywhere, and a nudge onto the section
 * start only when you stop within reach of one.
 */

/** How close to a section start counts as "meant to land here". */
const THRESHOLD_RATIO = 0.3;
/** Ignore nudges smaller than this; they read as jitter, not intent. */
const MIN_NUDGE = 12;
/**
 * How long the scroller must be quiet before acting. Trackpad momentum keeps
 * firing scroll events well after the fingers lift, so acting too early
 * fights the user — which is what made this feel bouncy.
 */
const IDLE_MS = 220;
const GLIDE_MS = 420;

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export const useSectionSnap = (enabled = true) => {
  const { motion } = useMotion();
  const { isMobile } = useMedia();

  useEffect(() => {
    if (!enabled || motion === "reduced") return;
    // Touch scrolling has its own momentum and rubber-banding; a nudge on top
    // of that reads as the page yanking itself back, so leave phones alone.
    if (isMobile) return;
    if (typeof window === "undefined") return;

    let idleTimer: number | undefined;
    let frame: number | undefined;
    let gliding = false;
    /**
     * Anchor clicks do their own smooth scroll. Without this the assist saw
     * the mid-flight position, decided a different section was nearest and
     * hijacked the journey — clicking "Contact" never arrived.
     */
    let suppressUntil = 0;

    const cancelGlide = () => {
      if (frame !== undefined) cancelAnimationFrame(frame);
      frame = undefined;
      gliding = false;
    };

    /**
     * Tween it here rather than with scrollTo({ behavior: "smooth" }). The
     * native one composes badly with trackpad momentum and with the global
     * `scroll-behavior: smooth`, and that combination is where the bounce
     * came from.
     */
    const glideTo = (to: number) => {
      const from = window.scrollY;
      const distance = to - from;
      const started = performance.now();
      gliding = true;

      const step = (now: number) => {
        if (!gliding) return;
        const t = Math.min(1, (now - started) / GLIDE_MS);
        // "instant" matters: the stylesheet sets scroll-behavior: smooth, so
        // without it every frame of this tween would itself be animated and
        // the two would fight each other.
        window.scrollTo({
          top: from + distance * easeOutCubic(t),
          behavior: "instant",
        });
        if (t < 1) {
          frame = requestAnimationFrame(step);
        } else {
          cancelGlide();
        }
      };
      frame = requestAnimationFrame(step);
    };

    /*
     * Land on the section boundary exactly, with no navbar offset.
     *
     * Offsetting by --nav-h put the rest position *inside* the previous
     * section: Portfolio ends at 7490 and Skills starts at 7554, so snapping
     * to 7434 left 56px of Portfolio's sticky strip showing at the top of the
     * viewport — the tail of its horizontal scroll visible from Skills.
     * Clearing the navbar is the sticky section header's job, and it already
     * offsets itself by --nav-h.
     */
    const settle = () => {
      if (gliding) return;
      if (performance.now() < suppressUntil) return;

      const targets = [...document.querySelectorAll<HTMLElement>(".main-section")].map(
        (el) => Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY))
      );
      if (!targets.length) return;

      const nearest = targets.reduce((best, top) =>
        Math.abs(top - window.scrollY) < Math.abs(best - window.scrollY) ? top : best
      );

      const distance = Math.abs(nearest - window.scrollY);
      if (distance < MIN_NUDGE) return;
      if (distance > window.innerHeight * THRESHOLD_RATIO) return;

      glideTo(nearest);
    };

    const arm = () => {
      window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(settle, IDLE_MS);
    };

    const onScroll = () => {
      if (gliding) return; // our own scrolling, not the user's
      arm();
    };

    // Fresh input abandons the glide at once, so the assist never fights
    // someone who changed their mind mid-animation.
    const onInput = () => {
      cancelGlide();
      arm();
    };

    const onAnchorNavigation = () => {
      cancelGlide();
      suppressUntil = performance.now() + 1400;
    };

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      if (target?.closest?.('a[href^="#"]')) onAnchorNavigation();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onInput, { passive: true });
    window.addEventListener("hashchange", onAnchorNavigation);
    document.addEventListener("click", onDocumentClick, true);
    window.addEventListener("touchstart", onInput, { passive: true });
    window.addEventListener("keydown", onInput);

    return () => {
      window.clearTimeout(idleTimer);
      cancelGlide();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onInput);
      window.removeEventListener("hashchange", onAnchorNavigation);
      document.removeEventListener("click", onDocumentClick, true);
      window.removeEventListener("touchstart", onInput);
      window.removeEventListener("keydown", onInput);
    };
  }, [enabled, motion, isMobile]);
};

export default useSectionSnap;
