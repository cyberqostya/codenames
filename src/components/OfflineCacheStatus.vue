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
  <div class="offline-cache-status">
    {{ message }}
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
}
</style>
