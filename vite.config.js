import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "./",
  server: {
    proxy: {
      "/api": {
        target: "https://k9txelite.pythonanywhere.com",
        changeOrigin: true,
        secure: true,
      },
      "/media": {
        target: "https://k9txelite.pythonanywhere.com",
        changeOrigin: true,
        secure: true,
      },
    },
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
