import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

const base = process.env.ADMIN_BASE || "";

export default defineConfig({
  envPrefix: "ADMIN_",

  base: `/${base}`,

  server: {
    port: 8080,
  },

  build: {
    outDir: `dist/${base}`
  },

  plugins: [vue()],

  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
});
