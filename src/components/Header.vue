<script setup>
import Button from "@c/Button.vue";
import { useMainStore } from "@/stores/mainStore";
import { computed } from "vue";
import Cog from "@c/SVG/Cog.vue";
import { triggerHaptic } from "@/utils/telegram";
const mainStore = useMainStore();

const counters = computed(() => {
  return mainStore.activeResource.board.reduce(
    (acc, item) => {
      if (item.team in acc && !item.isActive) {
        acc[item.team]++;
      }
      return acc;
    },
    Object.fromEntries(mainStore.teamNames.map((color) => [color, 0])),
  );
});

function toggleCapitansMode() {
  triggerHaptic("light");
  mainStore.toggleCapitansMode();
}
</script>

<template>
  <header class="header">
    <Button
      color="gold"
      @click="toggleCapitansMode"
      :class="['captain', !mainStore.isCapitansMode && 'disabled']"
    >
      Captain
    </Button>

    <div class="counters">
      <p
        :class="['counter', '_team-' + color]"
        v-for="color in mainStore.teamNames"
        :key="color"
      >
        <span>
          {{ counters[color] }}
        </span>
      </p>
    </div>

    <button class="settings" @click="mainStore.openSettings"><Cog /></button>

    <a class="coin" href="https://pay.cloudtips.ru/p/656a5ae1" target="_blank">
      <img src="/images/coin.png" />
    </a>
  </header>
</template>

<style lang="scss" scoped>
.header {
  padding: 5px;
  border-bottom: 1px dashed $color-dashed-border;

  display: flex;
  align-items: center;
  gap: 5px;
}

.is-telegram .header {
  margin-top: 42px;
}

.counters {
  margin: auto;
  display: flex;
  justify-content: center;
  height: 38px;
  gap: 5px;
}

.counter {
  font-size: 34px;
  width: 2.5ch;
  height: 100%;
  line-height: 1;
  border-radius: 6px;

  font-family: roboto;
  font-weight: 600;

  display: flex;
  align-items: center;
  justify-content: center;

  span {
    rotate: 90deg;
    letter-spacing: -0.15em;
    margin-top: -0.2em;
  }
}

.settings {
  width: 34px;
  aspect-ratio: 1;
}

.coin {
  position: relative;
  padding: 0;
  background: transparent;
  display: grid;
  place-items: center;
  overflow: visible;

  img {
    width: 34px;
    height: 34px;
    animation:
      coinFloat 8s ease-in-out infinite,
      coinShine 22s ease-in-out infinite;
    transform-origin: center;
  }
}
@keyframes coinFloat {
  0% {
    transform: translateY(0px) rotate(-4deg) scale(1);
  }
  50% {
    transform: translateY(-3px) rotate(4deg) scale(1.03);
  }
  100% {
    transform: translateY(0px) rotate(-4deg) scale(1);
  }
}
@keyframes coinShine {
  0% {
    filter: drop-shadow(0 4px 8px rgba(151, 101, 11, 0.2)) brightness(0.98)
      saturate(0.96);
  }
  4% {
    filter: drop-shadow(0 5px 11px rgba(176, 123, 18, 0.28)) brightness(1.12)
      saturate(1.08);
  }
  8% {
    filter: drop-shadow(0 4px 9px rgba(151, 101, 11, 0.22)) brightness(1.02)
      saturate(1);
  }
  10% {
    filter: drop-shadow(0 4px 8px rgba(151, 101, 11, 0.2)) brightness(0.98)
      saturate(0.96);
  }
  100% {
    filter: drop-shadow(0 4px 8px rgba(151, 101, 11, 0.2)) brightness(0.98)
      saturate(0.96);
  }
}
</style>
