import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";
import { resolveBucketUrl } from "./src/constants/bucket";

dotenv.config();

const BUCKET_URL = resolveBucketUrl(
  process.env.VITE_MODE,
  process.env.VITE_BUCKET_URL
);

/**
 * index.html is static, so it cannot read the bucket logic the app uses.
 * Rewrite %BUCKET_URL% with the same answer rather than hardcoding the CDN,
 * which would leave the favicon on the network even in an offline build.
 */
const bucketUrlInHtml = (): Plugin => ({
  name: "bucket-url-in-html",
  transformIndexHtml: (html) => html.replaceAll("%BUCKET_URL%", BUCKET_URL),
});

// https://vite.dev/config/
export default defineConfig({
  publicDir: process.env.VITE_MODE === "development" ? "public" : false,
  plugins: [react(), tailwindcss(), bucketUrlInHtml()],
});
