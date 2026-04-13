import { reactive } from "vue";

export const offlineCacheState = reactive({
  isSupported: false,
  isCaching: false,
  isReady: false,
  failedCount: 0,
});

async function startServiceWorker() {
  const registration = await navigator.serviceWorker.register(
    `${import.meta.env.BASE_URL}sw.js`,
  );

  if (registration.active) {
    cacheOfflineAssets(registration.active);
    return;
  }

  const worker = registration.installing || registration.waiting;
  worker?.addEventListener("statechange", () => {
    if (worker.state === "activated") {
      cacheOfflineAssets(worker);
    }
  });
}

function cacheOfflineAssets(worker) {
  if (!worker) return;

  offlineCacheState.isCaching = true;
  worker.postMessage({ type: "CACHE_OFFLINE_ASSETS" });
}

export function registerServiceWorker() {
  offlineCacheState.isSupported =
    "serviceWorker" in navigator && "caches" in window;

  if (!import.meta.env.PROD || !offlineCacheState.isSupported) return;

  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data?.type === "OFFLINE_CACHE_STARTED") {
      offlineCacheState.isCaching = true;
      offlineCacheState.isReady = false;
      offlineCacheState.failedCount = 0;
    }

    if (event.data?.type === "OFFLINE_CACHE_FINISHED") {
      offlineCacheState.isCaching = false;
      offlineCacheState.isReady = event.data.failedCount === 0;
      offlineCacheState.failedCount = event.data.failedCount;
    }
  });

  if (document.readyState === "complete") {
    startServiceWorker();
  } else {
    window.addEventListener("load", startServiceWorker, { once: true });
  }
}
