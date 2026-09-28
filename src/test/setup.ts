import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";
import {
  installIntersectionObserver,
  resetIntersectionObservers,
} from "./intersection";
import { installMatchMedia, resetViewport } from "./viewport";

// EmailJS is mocked for every test so no suite can post to the real service.
vi.mock("@emailjs/browser", () => ({
  default: { sendForm: vi.fn().mockResolvedValue({ status: 200, text: "OK" }) },
  sendForm: vi.fn().mockResolvedValue({ status: 200, text: "OK" }),
}));

// jsdom has no ResizeObserver and radix reaches for it during render. Nothing
// asserts on resize, so a no-op is enough here.
class NoopResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

vi.stubGlobal("ResizeObserver", NoopResizeObserver);

// IntersectionObserver and matchMedia get real implementations instead: a
// no-op IO leaves every scroll-reveal permanently out of view, and a
// hardcoded `matches: false` renders every component's desktop branch.
installIntersectionObserver();
installMatchMedia();

window.scrollTo = vi.fn();
Element.prototype.scrollIntoView = vi.fn();

// Node 25 installs its own experimental `localStorage` global. Without a valid
// `--localstorage-file` it lands on the jsdom window as a bare `{}`, clobbering
// jsdom's Storage, so `.getItem`/`.setItem` blow up. Install a real one.
class MemoryStorage implements Storage {
  #entries = new Map<string, string>();

  get length() {
    return this.#entries.size;
  }

  key(index: number) {
    return [...this.#entries.keys()][index] ?? null;
  }

  getItem(key: string) {
    return this.#entries.get(String(key)) ?? null;
  }

  setItem(key: string, value: string) {
    this.#entries.set(String(key), String(value));
  }

  removeItem(key: string) {
    this.#entries.delete(String(key));
  }

  clear() {
    this.#entries.clear();
  }

  [name: string]: unknown;
}

const localStorageMock = new MemoryStorage();
const sessionStorageMock = new MemoryStorage();

for (const target of [window, globalThis]) {
  Object.defineProperty(target, "localStorage", {
    value: localStorageMock,
    configurable: true,
    writable: true,
  });
  Object.defineProperty(target, "sessionStorage", {
    value: sessionStorageMock,
    configurable: true,
    writable: true,
  });
}

beforeEach(() => {
  localStorageMock.clear();
  sessionStorageMock.clear();
  resetViewport();
  installMatchMedia();
});

afterEach(() => {
  cleanup();
  resetIntersectionObservers();
  vi.clearAllMocks();
});
