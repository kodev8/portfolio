import { defineConfig, devices } from "@playwright/test";
import { baseConfig, webgl } from "./playwright.config";

const PORT = 4174;

/**
 * The only suite that touches the real bucket.
 *
 * Builds in production mode, so BUCKET_URL is baked in and publicDir is off.
 * Everything the page needs comes over the network, which is the point: this
 * catches a broken VITE_BUCKET_URL or an object missing from R2, neither of
 * which the offline run can see.
 *
 * Run on demand or on a schedule, not on every commit: `npm run test:e2e:cdn`.
 */
export default defineConfig({
  ...baseConfig,
  // One worker, one browser, one page load. Keeps bucket reads to a minimum.
  workers: 1,
  testMatch: ["**/cdn.spec.ts"],

  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },

  projects: [{ name: "cdn", use: { ...devices["Desktop Chrome"], ...webgl } }],

  webServer: {
    command: `VITE_MODE=production npm run build && npx vite preview --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 180_000,
  },
});
