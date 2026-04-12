<script setup>
import { useMainStore } from "@/stores/mainStore";
import Cell from "@c/Cell.vue";
const mainStore = useMainStore();
</script>

<template>
  <div
    class="board"
    :style="{
      '--columns': mainStore.columns,
    }"
  >
    <Cell v-for="(cell, ind) in mainStore.board" :cell="cell" :key="ind" />
  </div>
</template>

<style lang="scss" scoped>
.board {
  --columns: 5;
  --rows: 4;

  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  grid-auto-rows: 1fr;
  gap: 5px;
  padding: 5px;
  container-type: size;

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
