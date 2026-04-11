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
    <Button class="coin" href="https://t.me/tribute/app?startapp=dq66" icon="coin" />
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
  background: linear-gradient(-45deg, #6a0dad, gold, #23a6d5, #23d5ab);
  background-size: 400% 400%;
  animation: gradientFlow 8s ease infinite;
  @media screen and (orientation: landscape) {
    transform: rotate(90deg);
    transform-origin: center;
  }

  @keyframes gradientFlow {
    0% {
      background-position: 100% 100%;
    }
    25% {
      background-position: 100% 0%;
    }
    50% {
      background-position: 0% 0%;
    }
    75% {
      background-position: 0% 100%;
    }
    100% {
      background-position: 100% 100%;
    }
  }
}
</style>
