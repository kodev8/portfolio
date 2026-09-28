import { expect, rawTest as test } from "./fixtures";

/**
 * The rest of the suite stubs `HTMLMediaElement.play()` so the writer intro can
 * get past it. That stub is a workaround for headless Chromium, but it also
 * conceals a real failure mode, so this file reproduces it instead.
 *
 * WriterIntro awaits `audio.play()` once per typed character. The surrounding
 * try/catch handles a *rejected* promise; a promise that never settles simply
 * stops the sequence, `setAnimationComplete(true)` is never reached, and the
 * whole site stays at opacity-0 forever.
 */
test.describe("intro resilience", () => {
  test("reveals the page even when audio playback never settles", async ({ page }) => {
    test.fail(
      true,
      "WriterIntro awaits audio.play(); a pending promise strands the page at opacity-0"
    );

    await page.addInitScript(() => {
      HTMLMediaElement.prototype.play = function play() {
        return new Promise<void>(() => {});
      };
    });

    await page.goto("/");

    await expect(page.locator("main")).toHaveClass(/opacity-100/, { timeout: 20_000 });
  });

  test("reveals the page when audio playback is rejected", async ({ page }) => {
    // This path the component does handle: a rejected play() is caught and the
    // sequence carries on. Pins that the try/catch stays.
    await page.addInitScript(() => {
      HTMLMediaElement.prototype.play = function play() {
        return Promise.reject(new DOMException("NotAllowedError"));
      };
    });

    await page.goto("/");

    await expect(page.locator("main")).toHaveClass(/opacity-100/, { timeout: 30_000 });
  });

  test("reveals the page when the audio file itself 404s", async ({ page }) => {
    await page.route("**/sounds/**", (route) => route.fulfill({ status: 404 }));

    await page.goto("/");

    await expect(page.locator("main")).toHaveClass(/opacity-100/, { timeout: 30_000 });
  });
});
