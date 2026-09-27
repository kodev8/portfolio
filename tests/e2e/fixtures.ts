import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { test as base, expect, type Page } from "@playwright/test";

const HAR_DIR = path.join(process.cwd(), "tests", "e2e", ".har");
const HAR_FILE = path.join(HAR_DIR, "cdn.har");

/**
 * Where the 3D models and images come from.
 *
 * The bucket sits on a free Cloudflare plan with a limited egress allowance, so
 * the default replays a recorded HAR: the first run pays for one fetch of each
 * asset, every run after that is free and offline. Delete tests/e2e/.har to
 * re-record, or set E2E_ASSETS=live to always hit the CDN.
 *
 * Once the assets are available locally for dev mode, point playwright at the
 * dev server and drop this shim entirely.
 */
const ASSET_MODE = (process.env.E2E_ASSETS ?? "har") as "har" | "live";

const CDN_GLOB = "**://cdn.kalevkeil.com/**";

/**
 * Headless Chromium has no audio device, so `HTMLMediaElement.play()` returns a
 * promise that never settles. The writer intro awaits exactly that call before
 * it will reveal the page, so without this the site never appears.
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

const routeAssets = async (page: Page) => {
  if (ASSET_MODE === "live") return;

  mkdirSync(HAR_DIR, { recursive: true });
  await page.routeFromHAR(HAR_FILE, {
    url: CDN_GLOB,
    // Record on the first run; `npm run test:e2e:record` forces a refresh.
    update: process.env.E2E_RECORD === "1" || !existsSync(HAR_FILE),
    // A cache, not a wall: anything the recording missed still resolves, at
    // the cost of one small request rather than a cryptic "Failed to fetch".
    notFound: "fallback",
  });
};

export const test = base.extend<{ page: Page }>({
  page: async ({ page }, use) => {
    await stubMediaPlayback(page);
    await stubEmailJs(page);
    await routeAssets(page);
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
