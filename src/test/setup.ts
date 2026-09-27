import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, beforeEach, vi } from "vitest";

// EmailJS is mocked for every test so no suite can post to the real service.
vi.mock("@emailjs/browser", () => ({
  default: { sendForm: vi.fn().mockResolvedValue({ status: 200, text: "OK" }) },
  sendForm: vi.fn().mockResolvedValue({ status: 200, text: "OK" }),
}));

// jsdom ships none of these, and react-responsive / motion / radix all reach
// for them during render.
class MockObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

vi.stubGlobal("ResizeObserver", MockObserver);
vi.stubGlobal("IntersectionObserver", MockObserver);

if (!window.matchMedia) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
}

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
});

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});
