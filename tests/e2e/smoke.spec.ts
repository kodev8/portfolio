import { expect, gotoHome, test } from "./fixtures";

const SECTIONS = ["about", "experience", "projects", "portfolio", "skills", "contact"];

test.describe("smoke", () => {
  test("serves the page with the right title", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Kalev Keil/i);
  });

  test("mounts the app into #root", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#root")).not.toBeEmpty();
  });

  test("reveals the page once the intro finishes", async ({ page }) => {
    await gotoHome(page);
    await expect(page.locator("main")).toBeVisible();
  });

  test("renders every section the nav points at", async ({ page }) => {
    await gotoHome(page);
    for (const id of SECTIONS) {
      await expect(page.locator(`#${id}`).first()).toBeAttached();
    }
  });

  test("loads without page errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await gotoHome(page);

    expect(errors).toEqual([]);
  });

  test("leaves no failed requests", async ({ page }) => {
    const failed: string[] = [];
    page.on("response", (res) => {
      if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`);
    });

    await gotoHome(page);

    expect(failed).toEqual([]);
  });

  test("shows the hero copy", async ({ page }) => {
    await gotoHome(page);
    await expect(
      page.getByRole("heading", { name: /into Innovative Solutions/i })
    ).toBeVisible();
  });

  test("uses every element id only once", async ({ page }) => {
    await gotoHome(page);

    const duplicates = await page.evaluate(() => {
      const counts = new Map<string, number>();
      for (const el of document.querySelectorAll("[id]")) {
        counts.set(el.id, (counts.get(el.id) ?? 0) + 1);
      }
      return [...counts].filter(([, n]) => n > 1).map(([id, n]) => `${id} x${n}`);
    });

    expect(duplicates).toEqual([]);
  });

  test("keeps the 3D room behind its own button", async ({ page }) => {
    // The hero canvas is opt-in; nothing should mount WebGL on first paint.
    await gotoHome(page);
    await expect(page.locator("canvas")).toHaveCount(0);
  });
});
