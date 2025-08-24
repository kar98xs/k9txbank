import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [react()],
  build: {
    outDir: "dist",
    sourcemap: true,
  },
  server: {
    port: 5173,
    strictPort: true,
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
});
