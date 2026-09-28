import { expect, gotoHome, test } from "./fixtures";

/**
 * Runs only under playwright.cdn.config.ts, against a production-mode build.
 *
 * Everything else in tests/e2e runs offline against public/, which cannot see
 * a wrong VITE_BUCKET_URL or an object missing from the bucket. This suite is
 * deliberately small: one page load, a handful of assertions.
 */
const CDN_HOST = "cdn.kalevkeil.com";

test.describe("cdn wiring @cdn", () => {
  test("serves the page with assets from the bucket", async ({ page }) => {
    const fromCdn: string[] = [];
    const failed: string[] = [];

    page.on("response", (res) => {
      if (res.url().includes(CDN_HOST)) fromCdn.push(`${res.status()} ${res.url()}`);
      if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
    });
    page.on("requestfailed", (req) => {
      const error = req.failure()?.errorText ?? "";
      // Chromium aborts range requests for <video> it decides not to buffer.
      // That is normal, and says nothing about whether the bucket served it.
      if (error.includes("ERR_ABORTED")) return;
      failed.push(`${error} ${req.url()}`);
    });

    await gotoHome(page);
    await page.getByRole("button", { name: /Enter My Room/i }).click();
    await expect(page.locator("canvas")).toHaveCount(1, { timeout: 30_000 });
    await page.waitForTimeout(5_000); // let the models finish

    // The build really is pointing at the bucket, not at public/.
    expect(fromCdn.length).toBeGreaterThan(0);
    expect(failed).toEqual([]);
  });

  test("resolves the hero models", async ({ page }) => {
    const models = new Set<string>();
    page.on("response", (res) => {
      if (res.url().endsWith(".glb") && res.ok()) models.add(res.url());
    });

    await gotoHome(page);
    await page.getByRole("button", { name: /Enter My Room/i }).click();
    await expect(page.locator("canvas")).toHaveCount(1, { timeout: 30_000 });
    await page.waitForTimeout(5_000);

    expect(models.size).toBeGreaterThan(0);
    for (const url of models) expect(url).toContain(CDN_HOST);
  });

  test("serves the resume", async ({ page, request }) => {
    await gotoHome(page);
    const href = await page
      .locator('a[href$="kalev-keil-resume.pdf"]')
      .first()
      .getAttribute("href");

    expect(href).toContain(CDN_HOST);
    const res = await request.head(href!);
    expect(res.status()).toBe(200);
  });
});
