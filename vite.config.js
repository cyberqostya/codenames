import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import fs from "node:fs";
import path from "path";

const base = "/codenames/";
const outDir = "dist";

function offlineServiceWorkerPlugin() {
  return {
    name: "offline-service-worker",
    apply: "build",
    closeBundle() {
      const distDir = path.resolve(process.cwd(), outDir);
      const version = process.env.GITHUB_SHA || Date.now().toString();

      function getFiles(dir) {
        return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
          const fullPath = path.join(dir, entry.name);

          if (entry.isDirectory()) return getFiles(fullPath);
          if (entry.name === "sw.js") return [];

          return [fullPath];
        });
      }

      const files = getFiles(distDir).map((file) => {
        const relativePath = path.relative(distDir, file).replaceAll(path.sep, "/");
        return `${base}${relativePath}`;
      });

      const serviceWorker = `
const CACHE_NAME = "codenames-${version}";
const APP_SHELL = ${JSON.stringify([base, `${base}index.html`, ...files], null, 2)};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith("codenames-") && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("${base}index.html")),
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cachedResponse) => (
      cachedResponse || fetch(request)
    )),
  );
});
`;

      fs.writeFileSync(path.join(distDir, "sw.js"), serviceWorker.trimStart());
    },
  };
}

export default defineConfig({
  base,
  server: {
    host: true,
  },
  plugins: [vue(), offlineServiceWorkerPlugin()],
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
