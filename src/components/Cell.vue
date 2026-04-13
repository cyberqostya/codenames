<script setup>
import { useMainStore } from "@/stores/mainStore";
import { ref } from "vue";
const mainStore = useMainStore();

import { triggerHaptic } from "@/utils/telegram";

const props = defineProps({
  idx: Number,
});

const emit = defineEmits(["previewImage"]);

const progress = ref(0);
let animationFrame;
let pressStartTime = 0;
let isHoldCompleted = false;

const HOLD_TO_OPEN_MS = 1000;
const TAP_PREVIEW_MAX_MS = 220;

const cell = mainStore.activeResource.board[props.idx];

function startHold(event) {
  pressStartTime = performance.now();
  isHoldCompleted = false;
  // Нельзя тап по уже открытым
  if (mainStore.isCapitansMode || cell.isActive) return;

  // Мультитач при зуме
  if (event?.touches && event.touches.length > 1) return;
  if (event?.isPrimary === false) return;

  event?.preventDefault();

  triggerHaptic("light");

  cancelAnimationFrame(animationFrame);
  const duration = HOLD_TO_OPEN_MS;
  const startTime = performance.now();
  const start = progress.value;

  function animate(time) {
    const elapsed = time - startTime;

    const newProgress = Math.min(start + (elapsed / duration) * 100, 100);
    progress.value = newProgress;

    if (progress.value < 100) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      isHoldCompleted = true;
      // cell.isActive = true;
      // вместо
      // Добавление isActive всем ресурсам
      mainStore.resources.forEach((resource) => {
        resource.board[props.idx].isActive = true;
      });

      progress.value = 0;

      triggerHaptic("medium");
      setTimeout(() => {
        triggerHaptic("heavy");
      }, 120);
    }
  }
  animationFrame = requestAnimationFrame(animate);
}
function cancelHold(shouldPreview = false) {
  cancelAnimationFrame(animationFrame);

  const pressDuration = performance.now() - pressStartTime;

  if (
    shouldPreview &&
    cell.type === "image" &&
    !isHoldCompleted &&
    pressDuration <= TAP_PREVIEW_MAX_MS
  ) {
    emit("previewImage", cell.value);
  }

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
    :class="[
      'cell',
      (mainStore.isCapitansMode || cell.isActive) && '_team-' + cell.team,
    ]"
    @mousedown="startHold"
    @touchstart="startHold"
    @mouseup="cancelHold(true)"
    @mouseleave="cancelHold"
    @touchend="cancelHold(true)"
    @touchcancel="cancelHold"
    @contextmenu.prevent
  >
    <div class="progress" :style="{ width: progress + '%' }"></div>

    <span
      class="text"
      v-if="cell.type === 'text'"
      :style="{ '--char-count': cell.value.length }"
      >{{ cell.value }}</span
    >
    <img
      class="image"
      v-else
      :src="cell.value"
      alt="codename"
      draggable="false"
    />
  </button>
</template>

<style lang="scss" scoped>
.cell {
  padding: 5px;
  border-radius: 8px;
  background:
    linear-gradient(145deg, rgba(#fff, 0.34), rgba(#fff, 0) 42%),
    linear-gradient(180deg, $color-back-second, $color-back);
  box-shadow:
    0 -1px 0 rgba($color-gray-400, 0.08) inset,
    0 7px 12px rgba($color-gray-400, 0.16),
    0 2px 3px rgba($color-black, 0.12);

  display: flex;
  align-items: center;
  justify-content: center;

  position: relative;
  overflow: hidden;

  container-type: size;
  transform: translateY(0);
  transition:
    box-shadow 0.2s ease,
    transform 0.2s ease,
    filter 0.2s ease;

  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: transparent;
}

.cell::before {
  content: "";
  position: absolute;
  inset: 1px;
  border-radius: inherit;
  pointer-events: none;
  background: radial-gradient(
    circle at 24% 16%,
    rgba(#fff, 0.38),
    rgba(#fff, 0) 34%
  );
  z-index: 1;
}
.cell[class*="team"]::before {
  display: none;
}

.progress {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0%;
  height: 100%;
  background: rgba($color-gold, 0.4);
  z-index: 2;
}

.text {
  white-space: nowrap;
  font-family: roboto;
  text-transform: uppercase;
  text-align: center;
  font-weight: 400;
  font-style: italic;
  letter-spacing: -0.05em;

  transform: rotate(90deg);
  font-size: min(
    calc((100cqh / var(--char-count)) * 1.4),
    calc((100cqh / 6) * 1.4)
  );
  position: relative;
  z-index: 3;

  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

.image {
  object-fit: contain;
  transform: rotate(90deg);
  width: 100cqh;
  height: 100cqi;
  position: relative;
  z-index: 3;
  filter: drop-shadow(0 2px 2px rgba($color-black, 0.1));

  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}
</style>
