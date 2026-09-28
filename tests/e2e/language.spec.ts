import { expect, gotoHome, test } from "./fixtures";

const picker = (page: import("@playwright/test").Page) =>
  page.getByRole("combobox").first();

test.describe("language", () => {
  test("starts in english", async ({ page }) => {
    await gotoHome(page);
    await expect(picker(page)).toHaveText(/en/i);
  });

  test("offers both locales", async ({ page }) => {
    await gotoHome(page);

    await picker(page).click();

    await expect(page.getByRole("option")).toHaveCount(2);
  });

  test("switches the interface to french", async ({ page }) => {
    await gotoHome(page);

    await picker(page).click();
    await page.getByRole("option", { name: /fr/i }).click();

    // The work tab label is unambiguous; "Travail" also appears in the nav.
    await expect(page.locator("button.tab-work")).toHaveText("Travail");
  });

  test("remembers the choice across a reload", async ({ page }) => {
    await gotoHome(page);
    await picker(page).click();
    await page.getByRole("option", { name: /fr/i }).click();
    await expect(page.locator("button.tab-work")).toHaveText("Travail");

    await gotoHome(page);

    await expect(picker(page)).toHaveText(/fr/i);
    await expect(page.locator("button.tab-work")).toHaveText("Travail");
  });

  test("persists the choice to localStorage", async ({ page }) => {
    await gotoHome(page);

    await picker(page).click();
    await page.getByRole("option", { name: /fr/i }).click();

    await expect
      .poll(() => page.evaluate(() => localStorage.getItem("language")))
      .toBe("fr");
  });

  test("switches back to english", async ({ page }) => {
    await gotoHome(page);
    await picker(page).click();
    await page.getByRole("option", { name: /fr/i }).click();
    await expect(page.locator("button.tab-work")).toHaveText("Travail");

    await picker(page).click();
    await page.getByRole("option", { name: /en/i }).click();

    await expect(page.locator("button.tab-work")).toHaveText("Work");
  });
});
