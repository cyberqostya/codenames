<script setup>
import Header from "@c/Header.vue";
import Settings from "@c/Settings.vue";
import { useMainStore } from "./stores/mainStore";
import Board from "@c/Board.vue";

const mainStore = useMainStore();
mainStore.init();

// Хитрости для скрытия адресной строки в landscape
window.addEventListener("resize", async () => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  window.scrollTo(0, 100);
});
</script>

<template>
  <main>
    <Header />
    <Board v-if="!mainStore.isSettingsOpened" />

    <Settings v-if="mainStore.isSettingsOpened" />
  </main>
</template>

<style scoped></style>
