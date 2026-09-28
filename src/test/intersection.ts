/**
 * A controllable `IntersectionObserver`.
 *
 * jsdom has none, and a no-op stub means `useInView` never fires, so every
 * scroll-reveal in the app renders as permanently out of view and its
 * animations go untested. This one records what is being observed and lets a
 * test say when something came into view.
 */
type Entry = Pick<IntersectionObserverEntry, "target" | "isIntersecting">;

interface Registered {
  callback: IntersectionObserverCallback;
  observer: IntersectionObserver;
  targets: Set<Element>;
}

const registered = new Set<Registered>();

class ControllableIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly scrollMargin = "0px";
  readonly thresholds = [0];

  #entry: Registered;

  constructor(callback: IntersectionObserverCallback) {
    this.#entry = { callback, observer: this, targets: new Set() };
    registered.add(this.#entry);
  }

  observe(target: Element) {
    this.#entry.targets.add(target);
  }

  unobserve(target: Element) {
    this.#entry.targets.delete(target);
  }

  disconnect() {
    this.#entry.targets.clear();
    registered.delete(this.#entry);
  }

  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

export const installIntersectionObserver = () => {
  globalThis.IntersectionObserver =
    ControllableIntersectionObserver as unknown as typeof IntersectionObserver;
  window.IntersectionObserver =
    ControllableIntersectionObserver as unknown as typeof IntersectionObserver;
};

export const resetIntersectionObservers = () => registered.clear();

const build = (target: Element, isIntersecting: boolean): Entry => ({
  target,
  isIntersecting,
});

/**
 * Report every observed element as in or out of view.
 *
 * Callers wrap this in `act()` themselves, so a test can assert on the state
 * in between two transitions.
 */
export const setAllIntersecting = (isIntersecting: boolean) => {
  for (const { callback, observer, targets } of registered) {
    const entries = [...targets].map((t) => build(t, isIntersecting));
    if (entries.length) {
      callback(entries as IntersectionObserverEntry[], observer);
    }
  }
};

/** Report one specific element as in or out of view. */
export const setIntersecting = (target: Element, isIntersecting: boolean) => {
  for (const { callback, observer, targets } of registered) {
    if (!targets.has(target)) continue;
    callback([build(target, isIntersecting)] as IntersectionObserverEntry[], observer);
  }
};

/** How many elements are currently under observation. */
export const observedCount = () =>
  [...registered].reduce((total, entry) => total + entry.targets.size, 0);
