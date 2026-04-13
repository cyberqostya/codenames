<script setup>
import { useMainStore } from "@/stores/mainStore";
import { ref } from "vue";
import Cell from "@c/Cell.vue";
import CardPreviewOverlay from "@c/CardPreviewOverlay.vue";
const mainStore = useMainStore();

const previewImage = ref("");
</script>

<template>
  <div class="board-wrap">
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
        @preview-image="previewImage = $event"
      />
    </div>

    <CardPreviewOverlay
      v-if="previewImage"
      :image="previewImage"
      @close="previewImage = ''"
    />
  </div>
</template>

<style lang="scss" scoped>
.board-wrap {
  height: 100%;
}

.board {
  display: grid;
  grid-template-columns: repeat(var(--columns), 1fr);
  grid-auto-rows: 1fr;
  gap: 5px;
  padding: 5px;
  height: 100%;
}

.is-telegram .board {
  padding-bottom: calc(24px + 5px);
}
</style>
