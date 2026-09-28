import { expect, test } from "./fixtures";

const skip = (page: import("@playwright/test").Page) =>
  page.getByRole("button", { name: /skip intro|passer l'intro/i });

test.describe("skip intro", () => {
  test("offers a skip control while the intro runs", async ({ page }) => {
    await page.goto("/");
    await expect(skip(page)).toBeVisible();
  });

  test("reveals the page immediately when skipped", async ({ page }) => {
    await page.goto("/");
    await skip(page).click();

    // The intro otherwise runs for about nine seconds.
    await expect(page.locator("main")).toHaveClass(/opacity-100/, { timeout: 3_000 });
  });

  test("removes itself once the intro is done", async ({ page }) => {
    await page.goto("/");
    await skip(page).click();
    await expect(page.locator("main")).toHaveClass(/opacity-100/, { timeout: 3_000 });

    await expect(skip(page)).toHaveCount(0);
  });

  test("escape skips it too", async ({ page }) => {
    await page.goto("/");
    await expect(skip(page)).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(page.locator("main")).toHaveClass(/opacity-100/, { timeout: 3_000 });
  });

  test("skips the intro outright for reduced motion", async ({ browser }) => {
    const context = await browser.newContext({ reducedMotion: "reduce" });
    const fresh = await context.newPage();

    await fresh.goto("/");

    // No waiting through the typing sequence when motion is turned down.
    await expect(fresh.locator("main")).toHaveClass(/opacity-100/, { timeout: 5_000 });
    await context.close();
  });

  test("stops the sequence rather than running it over the page", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(skip(page)).toBeVisible();
    await page.waitForTimeout(600); // let a few letters type
    await skip(page).click();
    await expect(page.locator("main")).toHaveClass(/opacity-100/, { timeout: 3_000 });

    const read = () =>
      page.evaluate(() => {
        const el = document.querySelector(".logo-container");
        const r = el!.getBoundingClientRect();
        return `${el!.textContent?.trim()}|${Math.round(r.top)}|${Math.round(r.left)}`;
      });

    const settled = await read();
    await page.waitForTimeout(3_000);

    // The intro is a chain of awaited timeouts; if it were still running the
    // mark would keep typing and flying about on top of the revealed page.
    expect(await read()).toBe(settled);
    expect(settled.startsWith("KK|")).toBe(true);
  });

  test("still plays the intro at full motion", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(1_200);

    // Mid-intro the page is still hidden and the control is still offered.
    await expect(page.locator("main")).toHaveClass(/opacity-0/);
    await expect(skip(page)).toBeVisible();
  });
});
