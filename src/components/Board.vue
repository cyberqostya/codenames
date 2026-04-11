<script setup>
import { useMainStore } from "@/stores/mainStore";
import Cell from "@c/Cell.vue";
const mainStore = useMainStore();

function getFontSize() {
  return Math.max(Math.max(window.innerHeight, window.innerWidth) / 37, 14) + "px";
}
</script>

<template>
  <div
    class="board"
    :style="{
      gridTemplateColumns: `repeat(${mainStore.columns}, 1fr)`,
      gridTemplateRows: `repeat(${mainStore.rows}, minmax(calc(${100 / mainStore.rows + '%'} - 5px), 1fr))`,
      fontSize: getFontSize(),
    }"
  >
    <Cell v-for="(cell, ind) in mainStore.board" :cell="cell" :key="ind" />
  </div>
</template>

<style lang="scss" scoped>
.board {
  display: grid;
  grid-auto-rows: 1fr;
  gap: 5px;
  padding: 5px;

  position: absolute;
  top: 0;
  left: 45px;
  width: calc(100% - 45px);
  height: 100%;

  @media screen and (orientation: portrait) {
    top: 45px;
    left: 0;
    transform: rotate(90deg);
    transform-origin: top left;
    width: calc(100dvh - 45px);
    height: 100vw;
    left: 100vw;
  }
}
</style>
