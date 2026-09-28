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
// Hosts allowed to reach the dev/preview server through a tunnel. Vite
// rejects any Host header it does not recognise, which is what "Blocked
// request. This host is not allowed" means when testing on a phone.
// A leading dot allows that domain and every subdomain (Vite has no `*`).
const TUNNEL_HOSTS = [".kalevkeil.com", ".kk-codev.workers.dev"];

export default defineConfig({
  publicDir: process.env.VITE_MODE === "development" ? "public" : false,
  server: {
    // Listen on the LAN too, so a device on the same network can reach it.
    host: true,
    allowedHosts: TUNNEL_HOSTS,
  },
  preview: {
    host: true,
    allowedHosts: TUNNEL_HOSTS,
  },
  plugins: [react(), tailwindcss(), bucketUrlInHtml()],
  // publicDir and the index.html rewrite read process.env, while app code
  // reads Vite's own .env loading. Those are two sources that can disagree —
  // `VITE_MODE=production npm run build` switched the config but not the app.
  // Pin the app to the same value the config used.
  define: {
    "import.meta.env.VITE_MODE": JSON.stringify(process.env.VITE_MODE ?? ""),
    "import.meta.env.VITE_BUCKET_URL": JSON.stringify(
      process.env.VITE_BUCKET_URL ?? ""
    ),
  },
});
