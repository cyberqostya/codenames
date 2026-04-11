import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  server: {
    host: true,
  },
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@c": path.resolve(__dirname, "./src/components"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        includePaths: ["src"],
        additionalData: `@use "@/styles/enterpoint" as *;`,
      },
    },
  },
});
