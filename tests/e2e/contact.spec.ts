import { expect, gotoHome, navigateTo, test } from "./fixtures";

const openContact = async (page: import("@playwright/test").Page) => {
  await gotoHome(page);
  await navigateTo(page, "#contact");
  await expect(page.locator("#contact")).toBeInViewport({ timeout: 20_000 });
};

test.describe("contact form", () => {
  test("renders every field", async ({ page }) => {
    await openContact(page);

    await expect(page.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('textarea[name="message"]')).toBeVisible();
  });

  test("marks every field required", async ({ page }) => {
    await openContact(page);

    for (const selector of ['input[name="name"]', 'input[name="email"]', 'textarea[name="message"]']) {
      await expect(page.locator(selector)).toHaveAttribute("required", "");
    }
  });

  test("uses a real email input so the browser validates the format", async ({ page }) => {
    await openContact(page);
    await expect(page.locator('input[name="email"]')).toHaveAttribute("type", "email");
  });

  test("blocks submission while the form is empty", async ({ page }) => {
    await openContact(page);
    let posted = false;
    page.on("request", (req) => {
      if (req.url().includes("emailjs")) posted = true;
    });

    await page.getByRole("button", { name: /send|envoyer/i }).click();

    expect(posted).toBe(false);
    await expect(page.locator('input[name="name"]')).toBeFocused();
  });

  test("accepts what the user types", async ({ page }) => {
    await openContact(page);

    await page.locator('input[name="name"]').fill("Ada");
    await page.locator('input[name="email"]').fill("ada@example.com");
    await page.locator('textarea[name="message"]').fill("Hello there");

    await expect(page.locator('input[name="name"]')).toHaveValue("Ada");
    await expect(page.locator('input[name="email"]')).toHaveValue("ada@example.com");
    await expect(page.locator('textarea[name="message"]')).toHaveValue("Hello there");
  });

  test("rejects a malformed email before submitting", async ({ page }) => {
    await openContact(page);
    let posted = false;
    page.on("request", (req) => {
      if (req.url().includes("emailjs")) posted = true;
    });

    await page.locator('input[name="name"]').fill("Ada");
    await page.locator('input[name="email"]').fill("not-an-email");
    await page.locator('textarea[name="message"]').fill("Hello there");
    await page.getByRole("button", { name: /send|envoyer/i }).click();

    expect(posted).toBe(false);
    await expect(page.locator('input[name="email"]')).toBeFocused();
  });
});
