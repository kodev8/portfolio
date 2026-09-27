import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import dotenv from "dotenv";

dotenv.config();
// https://vite.dev/config/
// console.log(process.env.VITE_BUCKET_URL);
export default defineConfig({
  publicDir: process.env.VITE_MODE === "development" ? "public" : false,
  plugins: [react(), tailwindcss()],
});
