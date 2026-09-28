import { expect, gotoHome, navigateTo, test } from "./fixtures";

const ANCHORS = ["#about", "#experience", "#projects", "#skills", "#contact"];

test.describe("navigation", () => {
  test("exposes every in-page anchor", async ({ page }) => {
    await gotoHome(page);
    for (const href of ANCHORS) {
      await expect(page.locator(`a[href="${href}"]`).first()).toBeAttached();
    }
  });

  test("jumps to the contact section", async ({ page }) => {
    await gotoHome(page);

    await navigateTo(page, "#contact");

    await expect(page.locator("#contact")).toBeInViewport({ timeout: 20_000 });
  });

  test("jumps to the skills section", async ({ page }) => {
    await gotoHome(page);

    await navigateTo(page, "#skills");

    await expect(page.locator("#skills")).toBeInViewport({ timeout: 20_000 });
  });

  test("opens external profiles in a new tab", async ({ page }) => {
    await gotoHome(page);
    const github = page.locator('a[href*="github.com/kodev8"]').first();

    await expect(github).toHaveAttribute("target", "_blank");
    await expect(github).toHaveAttribute("rel", /noopener/);
  });

  test("links the resume", async ({ page }) => {
    await gotoHome(page);
    await expect(page.locator('a[href$="kalev-keil-resume.pdf"]').first()).toBeAttached();
  });

  test("scrolls back to the top of the page", async ({ page }) => {
    await gotoHome(page);
    await navigateTo(page, "#contact");
    await expect(page.locator("#contact")).toBeInViewport({ timeout: 20_000 });

    await navigateTo(page, "#about");

    await expect(page.locator("#about")).toBeInViewport({ timeout: 20_000 });
  });
});
