import { expect, gotoHome, test } from "./fixtures";

const toggle = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: /reduce animation|turn animation back on/i });

const motionAttr = (page: import("@playwright/test").Page) =>
  page.evaluate(() => document.documentElement.dataset.motion);

test.describe("motion preference", () => {
  test("offers the toggle in the header", async ({ page }) => {
    await gotoHome(page);
    await expect(toggle(page)).toBeVisible();
  });

  test("starts at full motion", async ({ page }) => {
    await gotoHome(page);
    await expect.poll(() => motionAttr(page)).toBe("full");
    await expect(toggle(page)).toHaveAttribute("aria-pressed", "false");
  });

  test("switches to reduced", async ({ page }) => {
    await gotoHome(page);

    await toggle(page).click();

    await expect.poll(() => motionAttr(page)).toBe("reduced");
    await expect(toggle(page)).toHaveAttribute("aria-pressed", "true");
  });

  test("remembers the choice across a reload", async ({ page }) => {
    await gotoHome(page);
    await toggle(page).click();
    await expect.poll(() => motionAttr(page)).toBe("reduced");

    await gotoHome(page);

    await expect.poll(() => motionAttr(page)).toBe("reduced");
  });

  test("switches back to full motion", async ({ page }) => {
    await gotoHome(page);
    await toggle(page).click();
    await expect.poll(() => motionAttr(page)).toBe("reduced");

    await toggle(page).click();

    await expect.poll(() => motionAttr(page)).toBe("full");
  });

  test("collapses transition durations when reduced", async ({ page }) => {
    await gotoHome(page);

    await toggle(page).click();

    // The stylesheet keys off the attribute, so component code never branches.
    // Compare the parsed value: browsers serialise 0.01ms back as ".01ms".
    await expect
      .poll(() =>
        page.evaluate(() =>
          parseFloat(
            getComputedStyle(document.documentElement).getPropertyValue("--dur")
          )
        )
      )
      .toBeLessThan(1);
  });

  test("follows an OS that asks to reduce, with no choice stored", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const fresh = await context.newPage();
    await fresh.goto("/");
    await expect(fresh.locator("main")).toHaveClass(/opacity-100/, { timeout: 30_000 });

    await expect
      .poll(() => fresh.evaluate(() => document.documentElement.dataset.motion))
      .toBe("reduced");

    await context.close();
  });

  test("lets an explicit choice override an OS that asks to reduce", async ({
    browser,
  }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const fresh = await context.newPage();
    await fresh.goto("/");
    await expect(fresh.locator("main")).toHaveClass(/opacity-100/, { timeout: 30_000 });

    await fresh.getByRole("button", { name: /turn animation back on/i }).click();

    await expect
      .poll(() => fresh.evaluate(() => document.documentElement.dataset.motion))
      .toBe("full");

    await context.close();
  });
});
