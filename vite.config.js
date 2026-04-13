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
        const relativePath = path
          .relative(distDir, file)
          .replaceAll(path.sep, "/");
        return `${base}${relativePath}`;
      });

      const serviceWorker = `
const CACHE_NAME = "codenames-${version}";
const PRECACHE_URLS = ${JSON.stringify([base, `${base}index.html`, ...files], null, 2)};
const CORE_URLS = PRECACHE_URLS.filter((url) => !/\\.(png|jpe?g|webp|avif|svg)$/i.test(url));

async function cacheUrls(urls) {
  const cache = await caches.open(CACHE_NAME);
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const response = await fetch(url, { cache: "reload" });

      if (!response.ok) {
        throw new Error(\`Failed to cache \${url}: \${response.status}\`);
      }

      await cache.put(url, response);
    }),
  );

  return results.filter((result) => result.status === "rejected").length;
}

async function notifyClients(message) {
  const clients = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });

  clients.forEach((client) => client.postMessage(message));
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    cacheUrls(CORE_URLS).then(() => self.skipWaiting()),
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

self.addEventListener("message", (event) => {
  if (event.data?.type !== "CACHE_OFFLINE_ASSETS") return;

  event.waitUntil(
    notifyClients({ type: "OFFLINE_CACHE_STARTED" })
      .then(() => cacheUrls(PRECACHE_URLS))
      .then((failedCount) => notifyClients({
        type: "OFFLINE_CACHE_FINISHED",
        failedCount,
      })),
  );
});

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).catch(() => caches.match("${base}index.html", { ignoreSearch: true })),
    );
    return;
  }

  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then(async (cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      try {
        const response = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
      } catch {
        return new Response("Offline", { status: 503, statusText: "Offline" });
      }
    }),
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
