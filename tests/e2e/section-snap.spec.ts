import { expect, gotoHome, test } from "./fixtures";

type Page = import("@playwright/test").Page;

/**
 * Section offsets move as fonts and lazy images land, so every assertion
 * re-reads the boundary at the moment it checks rather than trusting a value
 * captured earlier in the test.
 */
const topOf = (page: Page, selector: string) =>
  page.evaluate(
    (sel) =>
      Math.round(
        document.querySelector(sel)!.getBoundingClientRect().top + window.scrollY
      ),
    selector
  );

const settled = async (page: Page) => {
  await gotoHome(page);
  // Let layout stop moving before measuring anything.
  await page.waitForTimeout(2_000);
};

/** Park the scroller at `y`, then let the assist glide. */
const restAt = async (page: Page, y: number) => {
  await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
  await page.waitForTimeout(1_500);
  return page.evaluate(() => Math.round(window.scrollY));
};

test.describe("section snap", () => {
  // The assist is desktop only: touch scrolling has its own momentum, and a
  // nudge on top of that reads as the page yanking itself back.
  test.skip(
    () => test.info().project.name === "mobile",
    "section snap is disabled on touch viewports"
  );

  test("pulls onto a section start when resting just short of it", async ({ page }) => {
    await settled(page);
    const experience = await topOf(page, "#experience");

    const landed = await restAt(page, experience - 120);

    expect(landed).toBe(await topOf(page, "#experience"));
  });

  test("pulls forward when resting just past a section start", async ({ page }) => {
    await settled(page);
    const experience = await topOf(page, "#experience");

    const landed = await restAt(page, experience + 90);

    expect(landed).toBe(await topOf(page, "#experience"));
  });

  test("leaves you alone deep inside a long section", async ({ page }) => {
    // Experience runs well past a viewport; reading it must not be fought.
    await settled(page);
    const target = (await topOf(page, "#experience")) + 700;

    expect(await restAt(page, target)).toBe(target);
  });

  test("does not nudge when already exactly on a section start", async ({ page }) => {
    await settled(page);
    const experience = await topOf(page, "#experience");

    expect(await restAt(page, experience)).toBe(experience);
  });

  test("does not leave the previous section showing at a boundary", async ({
    page,
  }) => {
    // Snapping with a navbar offset landed *inside* the previous section, so
    // Portfolio's sticky horizontal strip stayed visible from Skills.
    await settled(page);
    const skills = await topOf(page, "#skills");

    await restAt(page, skills - 140);

    const stripVisible = await page.evaluate(() => {
      const strip = document.querySelector("#portfolio div")!.getBoundingClientRect();
      return strip.bottom > 0 && strip.top < window.innerHeight;
    });
    expect(stripVisible).toBe(false);
  });

  test("is inert on touch viewports", async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
    });
    const fresh = await context.newPage();
    await fresh.goto("/");
    await expect(fresh.locator("main")).toHaveClass(/opacity-100/, { timeout: 30_000 });
    await fresh.waitForTimeout(1_500);

    const experience = await topOf(fresh, "#experience");
    const target = experience - 120;
    await fresh.evaluate(
      (y) => window.scrollTo({ top: y, behavior: "instant" }),
      target
    );
    await fresh.waitForTimeout(1_500);

    expect(await fresh.evaluate(() => Math.round(window.scrollY))).toBe(target);
    await context.close();
  });

  test("stays out of the way when motion is reduced", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const fresh = await context.newPage();
    await fresh.goto("/");
    await expect(fresh.locator("main")).toHaveClass(/opacity-100/, { timeout: 30_000 });
    await fresh.waitForTimeout(1_500);

    const experience = await topOf(fresh, "#experience");
    const target = experience - 120;
    await fresh.evaluate(
      (y) => window.scrollTo({ top: y, behavior: "instant" }),
      target
    );
    await fresh.waitForTimeout(1_500);

    expect(await fresh.evaluate(() => Math.round(window.scrollY))).toBe(target);
    await context.close();
  });
});
