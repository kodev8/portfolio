import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

// Headless chromium ships no GPU, so the hero <Canvas> never gets a WebGL
// context and r3f renders nothing at all. SwiftShader gives it a software one.
const webgl = {
  launchOptions: {
    args: [
      "--use-gl=angle",
      "--use-angle=swiftshader",
      "--enable-unsafe-swiftshader",
    ],
  },
};

export default defineConfig({
  testDir: "./tests/e2e",
  // The writer intro runs for ~9s before the rest of the page mounts.
  timeout: 60_000,
  expect: { timeout: 15_000 },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },

  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"], ...webgl } },
    { name: "mobile", use: { ...devices["Pixel 7"], ...webgl } },
  ],

  // Tests run against the production bundle, which resolves assets from the
  // CDN. See tests/e2e/fixtures.ts for how those fetches are kept off the wire.
  webServer: {
    command: `npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
});
