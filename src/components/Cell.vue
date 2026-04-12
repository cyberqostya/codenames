<script setup>
import { useMainStore } from "@/stores/mainStore";
import { ref } from "vue";
const mainStore = useMainStore();

const props = defineProps({
  cell: Object,
});

const progress = ref(0);
let animationFrame;
function startHold() {
  // Нельзя тап по уже открытым
  if (mainStore.isCapitansMode || props.cell.isActive) return;

  // Мультитач при зуме
  if (event.touches && event.touches.length > 1) return;

  cancelAnimationFrame(animationFrame);
  const duration = 1000;
  const startTime = performance.now();
  const start = progress.value;

  function animate(time) {
    const elapsed = time - startTime;

    const newProgress = Math.min(start + (elapsed / duration) * 100, 100);
    progress.value = newProgress;

    if (progress.value < 100) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      props.cell.isActive = true;
      progress.value = 0;
    }
  }
  animationFrame = requestAnimationFrame(animate);
}
function cancelHold() {
  cancelAnimationFrame(animationFrame);
  const duration = 300;
  const startTime = performance.now();
  const start = progress.value;

  function animateDown(time) {
    const elapsed = time - startTime;
    const newProgress = Math.max(start - (elapsed / duration) * start, 0);
    progress.value = newProgress;
    if (newProgress > 0) {
      requestAnimationFrame(animateDown);
    }
  }
  animationFrame = requestAnimationFrame(animateDown);
}
</script>

<template>
  <button
    :class="['cell', (mainStore.isCapitansMode || props.cell.isActive) && '_team-' + props.cell.team]"
    @mousedown="startHold"
    @touchstart="startHold"
    @mouseup="cancelHold"
    @mouseleave="cancelHold"
    @touchend="cancelHold"
    @touchcancel="cancelHold"
  >
    <div class="progress" :style="{ height: progress + '%' }"></div>

    <span class="text" v-if="props.cell.type === 'text'" :style="{ '--char-count': props.cell.value.length }">{{ props.cell.value }}</span>
    <img class="image" v-else :src="props.cell.value" alt="codename" />
  </button>
</template>

<style lang="scss" scoped>
.cell {
  padding: 5px;
  font-family: roboto;
  text-transform: uppercase;
  text-align: center;
  font-weight: 500;
  border: 1px solid $color-dashed-border;
  border-radius: 6px;

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  overflow: hidden;

  container-type: size;
}

.progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 0%;
  background: rgba($color-gold, 0.4);
  transition: width 0.2s ease;
  z-index: 1;
}

.text {
  width: 100%;
  white-space: nowrap;
  font-style: italic;

  font-size: min(calc((100cqi / var(--char-count)) * 1.4), calc((100cqi / 6) * 1.4));
}

.image {
  object-fit: contain;
  height: 100%;
}
</style>
