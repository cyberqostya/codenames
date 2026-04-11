<script setup>
import Button from "@c/Button.vue";
import { useMainStore } from "@/stores/mainStore";
const mainStore = useMainStore();
</script>

<template>
  <header class="header">
    <Button color="gold" @click="mainStore.toggleCapitansMode" :class="!mainStore.isCapitansMode && 'disabled'">Captain</Button>

    <div class="counters">
      <p :class="['counter', '_team-' + color]" v-for="(color, index) in ['red', 'blue']" :key="index">
        <span>{{ mainStore.board.filter((i) => i.team === color && !i.isActive).length }}</span>
      </p>
    </div>

    <Button color="gold" @click="mainStore.toggleSettings" icon="cog" />
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

  @media screen and (orientation: landscape) {
    position: absolute;
    bottom: -45px;

    transform: rotate(-90deg);
    transform-origin: top left;
    width: 100dvh;

    z-index: 6;

    border-top: 1px dashed $color-dashed-border;
  }
}

.counters {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;

  margin: auto;
}

.counter {
  width: 2em;
  line-height: 34px;
  border-radius: 6px;

  font-family: roboto;
  font-weight: 600;
  font-size: 34px;

  display: flex;
  align-items: center;
  justify-content: center;

  span {
    @media screen and (orientation: landscape) {
      transform: rotate(90deg);
      transform-origin: center;
      font-size: 30px;
    }
  }
}

.coin {
  position: relative;
  padding: 0;
  background: transparent;
  display: grid;
  place-items: center;
  overflow: visible;

  @media screen and (orientation: landscape) {
    transform: rotate(90deg);
    transform-origin: center;
  }

  img {
    width: 34px;
    height: 34px;
    filter: drop-shadow(0 4px 8px rgba(151, 101, 11, 0.25));
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
    filter: drop-shadow(0 4px 8px rgba(151, 101, 11, 0.2)) brightness(0.98) saturate(0.96);
  }
  4% {
    filter: drop-shadow(0 5px 11px rgba(176, 123, 18, 0.28)) brightness(1.12) saturate(1.08);
  }
  8% {
    filter: drop-shadow(0 4px 9px rgba(151, 101, 11, 0.22)) brightness(1.02) saturate(1);
  }
  10% {
    filter: drop-shadow(0 4px 8px rgba(151, 101, 11, 0.2)) brightness(0.98) saturate(0.96);
  }
  100% {
    filter: drop-shadow(0 4px 8px rgba(151, 101, 11, 0.2)) brightness(0.98) saturate(0.96);
  }
}
</style>
