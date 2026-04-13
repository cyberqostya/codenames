<script setup>
import { computed, ref, watch } from "vue";
import { offlineCacheState } from "@/utils/serviceWorker";

const isDoneVisible = ref(false);
const statusMessage = computed(() => {
  if (offlineCacheState.isCaching) {
    return "\u0413\u043e\u0442\u043e\u0432\u0438\u043c \u043e\u0444\u0444\u043b\u0430\u0439\u043d";
  }

  if (offlineCacheState.failedCount) {
    return "\u041e\u0444\u0444\u043b\u0430\u0439\u043d \u0447\u0430\u0441\u0442\u0438\u0447\u043d\u043e \u0433\u043e\u0442\u043e\u0432";
  }

  if (offlineCacheState.isReady || isDoneVisible.value) {
    return "\u041e\u0444\u0444\u043b\u0430\u0439\u043d \u0433\u043e\u0442\u043e\u0432";
  }

  return "";
});

const message = computed(() => {
  if (offlineCacheState.isCaching) return "Готовим оффлайн";
  if (offlineCacheState.failedCount) return "Оффлайн частично готов";
  if (isDoneVisible.value) return "Оффлайн готов";
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
      v-if="offlineCacheState.isCaching"
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
