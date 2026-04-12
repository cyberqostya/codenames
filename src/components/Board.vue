<script setup>
import { useMainStore } from "@/stores/mainStore";
import Cell from "@c/Cell.vue";
const mainStore = useMainStore();
</script>

<template>
  <div
    class="board"
    :style="{
      '--columns': mainStore.rows,
    }"
  >
    <Cell v-for="(cell, ind) in mainStore.board" :cell="cell" :key="ind" />
  </div>
</template>

<style lang="scss" scoped>
.board {
  --columns: 5;

  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  grid-auto-rows: 1fr;
  gap: 5px;
  padding: 5px;
  height: 100%;
}
</style>
