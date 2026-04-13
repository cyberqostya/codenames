<script setup>
import { computed } from "vue";
import { useMainStore } from "@/stores/mainStore";
import { triggerHaptic } from "@/utils/telegram";

const mainStore = useMainStore();
const stepDuration = computed(() => mainStore.CAPITANS_MODE_COUNTDOWN_MS / 3);

function offCountdown() {
  mainStore.toggleCapitansMode();

  triggerHaptic("light");
  setTimeout(() => {
    triggerHaptic("light");
  }, 80);
}
</script>

<template>
  <div
    v-if="mainStore.isCapitansModeCountdown"
    class="countdown"
    @click="offCountdown"
  >
    <span
      :key="mainStore.capitansModeCountdownValue"
      class="countdown__number"
      :style="{ '--step-duration': `${stepDuration}ms` }"
    >
      {{ mainStore.capitansModeCountdownValue }}
    </span>
  </div>
</template>

<style lang="scss" scoped>
.countdown {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  perspective: 700px;
  background: rgba($color-black, 0.3);
}

.countdown__number {
  color: white;
  font-family: roboto;
  font-size: clamp(120px, 42vw, 280px);
  font-weight: 600;
  line-height: 1;
  text-shadow: 0 18px 45px rgba($color-black, 0.28);
  animation: countdownDrop var(--step-duration)
    cubic-bezier(0.18, 0.86, 0.32, 1) both;
  transform-origin: center;
  pointer-events: none;

  rotate: 90deg;
}

@keyframes countdownDrop {
  0% {
    opacity: 0;
    transform: translateZ(420px) scale(2.2);
    filter: blur(8px);
  }

  32% {
    opacity: 1;
    transform: translateZ(0) scale(1);
    filter: blur(0);
  }

  100% {
    opacity: 0;
    transform: translateZ(-220px) scale(0.58);
    filter: blur(2px);
  }
}
</style>
