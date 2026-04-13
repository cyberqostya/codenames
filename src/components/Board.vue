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
    <Cell
      v-for="(cell, idx) in mainStore.activeResource.board"
      :idx="idx"
      :key="cell.value"
    />
  </div>
</template>

<style lang="scss" scoped>
.board {
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  grid-auto-rows: 1fr;
  gap: 3px;
  padding: 5px;
  height: 100%;
}

.is-telegram .board {
  padding-bottom: calc(24px + 5px);
}
</style>
