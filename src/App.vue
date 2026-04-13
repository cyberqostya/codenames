<script setup>
import Header from "@c/Header.vue";
import Settings from "@c/Settings.vue";
import BoardOrientationGuard from "@c/BoardOrientationGuard.vue";
import CapitansCountdown from "@c/CapitansCountdown.vue";
import { useMainStore } from "./stores/mainStore";
import Board from "@c/Board.vue";

const mainStore = useMainStore();
mainStore.createBoards();
</script>

<template>
  <main class="main">
    <Header />

    <BoardOrientationGuard v-if="!mainStore.isSettingsOpened">
      <Board />
    </BoardOrientationGuard>

    <Settings v-if="mainStore.isSettingsOpened" />

    <CapitansCountdown />
  </main>
</template>

<style lang="scss" scoped>
.main {
  @media (min-width: 600px) {
    max-width: 600px;
    right: 0;
    margin-inline: auto;
    border-left: 1px dashed $color-dashed-border;
    border-right: 1px dashed $color-dashed-border;
  }
}

:global(.is-telegram) .main {
  padding-top: env(safe-area-inset-top, 0px);
  padding-top: var(--tg-safe-area-inset-top, env(safe-area-inset-top, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  padding-bottom: var(
    --tg-safe-area-inset-bottom,
    env(safe-area-inset-bottom, 0px)
  );
  box-sizing: border-box;
}
</style>
