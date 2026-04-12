<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const containerNode = ref(null);
const isLandscapeBoard = ref(false);

let resizeObserver;

function updateState(entries) {
  const entry = entries?.[0];
  if (!entry) return;

  const { width, height } = entry.contentRect;
  isLandscapeBoard.value = width > height;
}

onMounted(() => {
  if (!containerNode.value) return;

  resizeObserver = new ResizeObserver(updateState);
  resizeObserver.observe(containerNode.value);
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});
</script>

<template>
  <div ref="containerNode" class="guard">
    <slot />

    <div v-if="isLandscapeBoard" class="guard__overlay">
      <p class="guard__text">Для идеального отображения интерфейса рекомендую использовать вертикальный режим.</p>
      <p class="guard__text">А также заблокировать поворот экрана для удобства.</p>
      <img src="/images/rotatelock.webp" alt="lock screen" class="guard__image" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.guard {
  position: relative;
  flex: 1;
  min-height: 0;
}

.guard__overlay {
  position: absolute;
  inset: 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: $color-back;
  text-align: center;
}

.guard__text {
  width: 80%;
  font-family: roboto;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.3;
  color: $color-gray-400;
  margin-top: 1em;
}

.guard__image {
  width: 40px;
  aspect-ratio: 1;
  margin-top: 0.5em;
}
</style>
