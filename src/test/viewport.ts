import { act } from "@testing-library/react";

/**
 * A `matchMedia` that actually answers against a viewport width, so component
 * tests can exercise the mobile branches instead of always getting desktop.
 *
 * Only handles the `(max-width: Npx)` / `(min-width: Npx)` forms the app uses.
 * Anything else returns false rather than pretending to understand it.
 */
const WIDTH_QUERY = /\((max|min)-width:\s*(\d+)px\)/;

type Listener = (event: MediaQueryListEvent) => void;

const lists = new Set<{ query: string; notify: () => void }>();

export const DEFAULT_WIDTH = 1440;

let currentWidth = DEFAULT_WIDTH;

const evaluate = (query: string, width: number): boolean => {
  const match = WIDTH_QUERY.exec(query);
  if (!match) return false;
  const [, kind, value] = match;
  return kind === "max" ? width <= Number(value) : width >= Number(value);
};

export const installMatchMedia = () => {
  window.matchMedia = ((query: string) => {
    const listeners = new Set<Listener>();
    const list = {
      get matches() {
        return evaluate(query, currentWidth);
      },
      media: query,
      onchange: null,
      addEventListener: (_: string, fn: Listener) => void listeners.add(fn),
      removeEventListener: (_: string, fn: Listener) => void listeners.delete(fn),
      // Deprecated pair, still used by some libraries.
      addListener: (fn: Listener) => void listeners.add(fn),
      removeListener: (fn: Listener) => void listeners.delete(fn),
      dispatchEvent: () => true,
    };

    lists.add({
      query,
      notify: () => {
        const event = { matches: evaluate(query, currentWidth), media: query };
        for (const fn of listeners) fn(event as MediaQueryListEvent);
      },
    });

    return list as unknown as MediaQueryList;
  }) as typeof window.matchMedia;
};

/** Point every live media query at a new width and let React re-render. */
export const setViewportWidth = (width: number) => {
  currentWidth = width;
  window.innerWidth = width;
  act(() => {
    for (const list of lists) list.notify();
    window.dispatchEvent(new Event("resize"));
  });
};

export const resetViewport = () => {
  currentWidth = DEFAULT_WIDTH;
  window.innerWidth = DEFAULT_WIDTH;
  lists.clear();
};

/** Widths that sit either side of the app's breakpoints. */
export const VIEWPORTS = {
  mobile: 390,
  tablet: 900,
  laptop: 1200,
  desktop: 1400,
  wide: 1920,
} as const;
