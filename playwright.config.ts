import {
  defineConfig,
  devices,
  type PlaywrightTestConfig,
} from "@playwright/test";

const PORT = 4173;

// Headless chromium ships no GPU, so the hero <Canvas> never gets a WebGL
// context and r3f renders nothing at all. SwiftShader gives it a software one.
export const webgl = {
  launchOptions: {
    args: [
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  },
};

export const baseConfig: PlaywrightTestConfig = {
  testDir: "./tests/e2e",
  // The writer intro runs for ~9s before the rest of the page mounts.
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : [["list"]],
};

/**
 * Default run: a production bundle built with VITE_MODE=development, which
 * points every asset path at `public/` and copies that directory into dist.
 * Same bundle the CDN build produces, but entirely offline.
 *
 * Populate public/ first with `npm run assets:sync`.
 * The CDN wiring itself is covered separately by playwright.cdn.config.ts.
 */
export default defineConfig({
  ...baseConfig,
  workers: process.env.CI ? 1 : undefined,
  // cdn.spec.ts needs the production-mode build; it has its own config.
  testIgnore: ["**/cdn.spec.ts"],

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], ...webgl } },
    { name: "mobile", use: { ...devices["Pixel 7"], ...webgl } },
  ],

  webServer: {
    command: `node scripts/check-assets.mjs && VITE_MODE=development npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    // Always rebuild. Reusing a server left running by hand meant the suite
    // could pass against a stale bundle.
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
