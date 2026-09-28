#!/usr/bin/env node
/**
 * Guard for the offline e2e run.
 *
 * The default Playwright config builds with VITE_MODE=development, which
 * resolves every asset out of public/. If that directory has not been mirrored
 * yet the whole suite fails with a wall of 404s, so fail here instead with
 * something actionable.
 */
import { readdirSync, statSync } from "node:fs";
import path from "node:path";

const PUBLIC_DIR = path.join(process.cwd(), "public");
// The hero scene alone pulls well over a hundred objects; a bare public/ with
// just the handful of committed placeholders is the case worth catching.
const MIN_FILES = 40;

const walk = (dir) => {
  let count = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) count += walk(full);
    else if (statSync(full).size > 0) count += 1;
  }
  return count;
};

let files = 0;
try {
  files = walk(PUBLIC_DIR);
} catch {
  files = 0;
}

if (files < MIN_FILES) {
  console.error(
    [
      "",
      `public/ holds ${files} files, which is too few to run the offline e2e suite.`,
      "",
      "Mirror the bucket first:",
      "  npm run assets:sync",
      "",
      "Or exercise the real CDN instead:",
      "  npm run test:e2e:cdn",
      "",
    ].join("\n")
  );
  process.exit(1);
}

console.log(`public/ has ${files} files; building against local assets.`);
