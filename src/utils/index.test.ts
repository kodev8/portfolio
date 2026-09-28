import { describe, expect, it } from "vitest";
import { cn } from "./index";

describe("cn", () => {
  it("joins plain class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy entries", () => {
    expect(cn("a", false, null, undefined, "", "b")).toBe("a b");
  });

  it("lets the later tailwind class win a conflict", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-white", "text-black")).toBe("text-black");
  });

  it("keeps non-conflicting tailwind classes side by side", () => {
    expect(cn("px-2", "py-4")).toBe("px-2 py-4");
  });

  it("accepts conditional object syntax", () => {
    expect(cn({ "text-white": true, hidden: false })).toBe("text-white");
  });

  it("flattens nested arrays", () => {
    expect(cn(["a", ["b", "c"]])).toBe("a b c");
  });

  it("returns an empty string for no input", () => {
    expect(cn()).toBe("");
  });
});
