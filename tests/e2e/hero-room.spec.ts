import { expect, gotoHome, test } from "./fixtures";

/**
 * The only suite that mounts WebGL and pulls the .glb models. Tagged so it can
 * be skipped when the CDN budget matters: `--grep-invert @3d`.
 */
const enterRoom = async (page: import("@playwright/test").Page) => {
  await gotoHome(page);
  await page.getByRole("button", { name: /Enter My Room/i }).click();
};

test.describe("hero room @3d", () => {
  test("mounts a canvas once the room is opened", async ({ page }) => {
    await enterRoom(page);
    await expect(page.locator("canvas")).toHaveCount(1, { timeout: 30_000 });
  });

  test("gets a working webgl context", async ({ page }) => {
    await enterRoom(page);
    await expect(page.locator("canvas")).toHaveCount(1, { timeout: 30_000 });

    const hasContext = await page
      .locator("canvas")
      .first()
      .evaluate((el: HTMLCanvasElement) => !!(el.getContext("webgl2") || el.getContext("webgl")));

    expect(hasContext).toBe(true);
  });

  test("renders the room without page errors", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (err) => errors.push(err.message));

    await enterRoom(page);
    await expect(page.locator("canvas")).toHaveCount(1, { timeout: 30_000 });
    await page.waitForTimeout(3_000); // let the models settle

    expect(errors).toEqual([]);
  });

  test("paints something other than a blank canvas", async ({ page }) => {
    await enterRoom(page);
    const canvas = page.locator("canvas").first();
    await expect(canvas).toBeVisible({ timeout: 30_000 });
    await page.waitForTimeout(3_000);

    const box = await canvas.boundingBox();
    expect(box?.width ?? 0).toBeGreaterThan(0);
    expect(box?.height ?? 0).toBeGreaterThan(0);
  });

  test("closes the room again", async ({ page }) => {
    // KNOWN BUG: the exit button is an <Html> pinned to a 3D point
    // (itemData.exitButton at [-3.5, 5, 4]). At phone viewports it lands off
    // screen, so there is no way out of the room on mobile - Escape only works
    // on a physical keyboard. Re-enable this project once that is fixed.
    test.skip(
      test.info().project.name === "mobile",
      "exit button renders off screen on mobile"
    );
    await enterRoom(page);
    await expect(page.locator("canvas")).toHaveCount(1, { timeout: 30_000 });

    await page.getByRole("button", { name: "⬅️" }).click();

    await expect(page.locator("canvas")).toHaveCount(0);
  });
});
