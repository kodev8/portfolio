import { test as base, expect, type Page } from "@playwright/test";

/**
 * Headless Chromium has no audio device, so `HTMLMediaElement.play()` returns a
 * promise that never settles. The writer intro awaits exactly that call before
 * it will reveal the page, so without this the site never appears.
 *
 * This works around the harness, but it also hides a real fragility in the app.
 * intro-resilience.spec.ts deliberately does without it.
 */
const stubMediaPlayback = async (page: Page) => {
  await page.addInitScript(() => {
    HTMLMediaElement.prototype.play = function play() {
      return Promise.resolve();
    };
  });
};

const stubEmailJs = async (page: Page) => {
  // Nothing in the suite may reach the real EmailJS service.
  await page.route("**://api.emailjs.com/**", (route) =>
    route.fulfill({ status: 200, contentType: "text/plain", body: "OK" })
  );
};

export const test = base.extend<{ page: Page }>({
  page: async ({ page }, use) => {
    await stubMediaPlayback(page);
    await stubEmailJs(page);
    await use(page);
  },
});

/** Same fixtures minus the audio stub, for testing the intro's own resilience. */
export const rawTest = base.extend<{ page: Page }>({
  page: async ({ page }, use) => {
    await stubEmailJs(page);
    await use(page);
  },
});

export { expect };

/**
 * Click an in-page nav link, opening the mobile dock first when needed.
 *
 * On phone viewports every `a[href^="#"]` is hidden until the dock toggle is
 * pressed, and that toggle carries no accessible name, so it has to be matched
 * on its classes rather than by role.
 */
export const navigateTo = async (page: Page, hash: string) => {
  const link = () => page.locator(`a[href="${hash}"]:visible`).first();

  if ((await link().count()) === 0) {
    await page.locator("button.rounded-full.bg-neutral-800").first().click();
    await expect(link()).toBeVisible();
  }

  await link().click();
};

/** The intro types out "Kalev" before the rest of the page mounts. */
export const gotoHome = async (page: Page) => {
  await page.goto("/");
  await expect(page.locator("main")).toHaveClass(/opacity-100/, { timeout: 30_000 });
};
