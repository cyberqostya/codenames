<script setup>
import { computed, ref, watch } from "vue";
import { offlineCacheState } from "@/utils/serviceWorker";

const isDoneVisible = ref(false);
const statusMessage = computed(() => {
  if (offlineCacheState.error) {
    return "Ошибка оффлайна";
  }

  if (!offlineCacheState.isSupported) {
    return "Оффлайн недоступен";
  }

  if (offlineCacheState.isRegistering) {
    return "Подключаем оффлайн";
  }

  if (offlineCacheState.isCaching) {
    return "Готовим оффлайн";
  }

  if (offlineCacheState.failedCount) {
    return "Оффлайн частично готов";
  }

  if (offlineCacheState.isReady || isDoneVisible.value) {
    return "Оффлайн готов";
  }

  return "";
});

watch(
  () => offlineCacheState.isReady,
  (isReady) => {
    if (!isReady) return;
    isDoneVisible.value = true;
  },
  { immediate: true },
);
</script>

<template>
  <div v-if="statusMessage" class="offline-cache-status">
    <span
      v-if="offlineCacheState.isRegistering || offlineCacheState.isCaching"
      class="offline-cache-status__spinner"
    />
    {{ statusMessage }}
  </div>
</template>

<style lang="scss" scoped>
.offline-cache-status {
  padding: 8px 12px;
  color: $color-black;
  font-size: 12px;
  letter-spacing: 0.02em;
  text-align: right;
  pointer-events: none;

  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 6px;
}

.offline-cache-status__spinner {
  width: 1em;
  aspect-ratio: 1;
  border: 2px solid rgba($color-black, 0.2);
  border-top-color: $color-black;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    rotate: 360deg;
  }
}
</style>
