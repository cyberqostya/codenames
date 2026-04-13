<script setup>
import { computed, ref, watch } from "vue";
import { offlineCacheState } from "@/utils/serviceWorker";

const isDoneVisible = ref(false);

const message = computed(() => {
  if (offlineCacheState.isCaching) return "Готовим офлайн";
  if (offlineCacheState.failedCount) return "Офлайн частично готов";
  if (isDoneVisible.value) return "Офлайн готов";
  return "";
});

const isVisible = computed(() => Boolean(message.value));

watch(
  () => offlineCacheState.isReady,
  (isReady) => {
    if (!isReady) return;

    isDoneVisible.value = true;
    setTimeout(() => {
      isDoneVisible.value = false;
    }, 2200);
  },
);
</script>

<template>
  <div
    v-if="isVisible"
    :class="[
      'offline-cache-status',
      offlineCacheState.failedCount && 'is-warning',
    ]"
  >
    {{ message }}
  </div>
</template>

<style lang="scss" scoped>
.offline-cache-status {
  padding: 8px 12px;
  color: white;
  background: rgba($color-black, 0.78);
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  font-family: roboto;
  font-size: 13px;
  letter-spacing: 0.02em;
  text-align: center;
  box-shadow: 0 8px 22px rgba($color-black, 0.2);
  pointer-events: none;
}

.is-warning {
  background: rgba(128, 72, 0, 0.82);
}
</style>
