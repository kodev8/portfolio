import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// Kept separate from vite.config.ts so the app build never loads test-only
// plugins, and so `publicDir: false` in prod mode can't affect fixtures.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/test/setup.ts"],
    // e2e lives in tests/e2e and is driven by Playwright, not Vitest.
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/test/**",
        "src/types/**",
        "src/vite-env.d.ts",
        "src/main.tsx",
        // gltfjsx output: generated mesh trees, nothing to assert
        "src/components/models/{Bedroom,Cleats,Computer,Dumbbell,Football,Pikachu,Room,Rubik,Spiderman,Ttflag}.tsx",
      ],
    },
  },
});
