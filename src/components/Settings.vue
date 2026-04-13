<script setup>
import Title from "@c/Title.vue";
import Button from "@c/Button.vue";
import Input from "@c/Input.vue";
import { useMainStore } from "@/stores/mainStore";
import { ref, computed } from "vue";
import { triggerHaptic } from "@/utils/telegram";

const mainStore = useMainStore();

const cellText = computed({
  get() {
    return mainStore.activeResource.board
      .filter((i) => i.type === "text")
      .map((cell) => cell.value)
      .join(", ");
  },
  set(newVal) {
    const values = newVal.split(",").map((s) => s.trim());
    const boardTextCells = mainStore.activeResource.board.filter(
      (i) => i.type === "text",
    );
    values.forEach((i, ind) => {
      if (boardTextCells[ind]) boardTextCells[ind].value = i;
    });
  },
});

const boardColumnsRangeArray = Array(
  mainStore.MAX_COLUMNS - mainStore.MIN_COLUMNS + 1,
)
  .fill(0)
  .map((_, ind) => mainStore.MIN_COLUMNS + ind);

const columns = ref(mainStore.columns);
const rows = ref(mainStore.rows);
const isNewGame = computed(() => {
  return (
    columns.value !== mainStore.columns ||
    rows.value !== mainStore.rows ||
    mainStore.isReshuffleCards
  );
});
function resume() {
  if (isNewGame.value) {
    // Задаем количество колонок всегда >= строк
    const [c, r] = [columns.value, rows.value].sort((a, b) => b - a);

    mainStore.setColumns(c);
    mainStore.setRows(r);
    mainStore.createBoards();
  } else if (mainStore.isChangeCapitansMap) {
    mainStore.setCapitansKey();
  }

  triggerHaptic("light");

  mainStore.closeSettings();
}

function withVibro(f) {
  triggerHaptic("light");
  f();
}
</script>

<template>
  <section class="settings">
    <Title class="title">Settings</Title>

    <div class="field">
      <span class="field__title">Columns:</span>

      <div class="cards-buttons">
        <Button
          v-for="i in boardColumnsRangeArray"
          :class="{ disabled: i != columns }"
          @click="
            withVibro(() => {
              columns = i;
            })
          "
          :key="i"
        >
          {{ i }}
        </Button>
      </div>
    </div>

    <div class="field">
      <span class="field__title">Rows:</span>

      <div class="cards-buttons">
        <Button
          v-for="i in boardColumnsRangeArray"
          :class="{ disabled: i != rows }"
          @click="
            withVibro(() => {
              rows = i;
            })
          "
          :key="i"
        >
          {{ i }}
        </Button>
      </div>
    </div>

    <div class="field">
      <span class="field__title">Cards:</span>

      <div class="cards-buttons">
        <Button
          v-for="i in mainStore.resources"
          :key="i.title"
          @click="
            withVibro(() => {
              mainStore.setActiveResource(i);
            })
          "
          :class="{ disabled: !i.isActive }"
        >
          {{ i.title }}
        </Button>
      </div>
    </div>

    <div
      class="field"
      v-if="
        !isNewGame &&
        mainStore.activeResource.board.find((i) => i.type === 'text')
      "
    >
      <span class="field__title">Words: (can edit)</span>
      <Input
        tag="textarea"
        class="input"
        v-model="cellText"
        ref="textareaNode"
      />
    </div>

    <div class="field">
      <span class="field__title"></span>

      <div class="cards-buttons">
        <Button
          @click="withVibro(mainStore.toggleIsChangeCapitansMap)"
          :class="{ disabled: !mainStore.isChangeCapitansMap }"
        >
          Change Capitans Map
        </Button>
        <Button
          @click="withVibro(mainStore.toggleIsReshuffleCards)"
          :class="{ disabled: !mainStore.isReshuffleCards }"
        >
          Reshuffle cards
        </Button>
      </div>
    </div>

    <Button color="gold" class="close" @click="resume">
      {{ isNewGame ? "New Game" : "Resume" }}
    </Button>
  </section>
</template>

<style lang="scss" scoped>
.settings {
  position: absolute;
  z-index: 7;
  inset: 0;

  display: flex;
  flex-direction: column;

  background-color: $color-back;
}

.is-telegram .settings {
  margin-top: 42px;
  margin-bottom: 24px;
}

.title {
  border-bottom: 1px dashed $color-dashed-border;
  padding: 5px;
  line-height: 34px;
}

.field {
  padding: 5px 5px;

  display: grid;
  grid-template-columns: 0.5fr 1fr;
  gap: 5px;

  border-bottom: 1px dashed $color-dashed-border;
}

.field__title {
  font-size: 16px;
  font-weight: 600;
  margin-right: auto;
}

.field__data {
  display: flex;
  align-items: center;
  gap: 10px;
}

.cards-buttons {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;

  & > * {
    flex: 1 1 1%;
    min-width: min-content;
  }
}

.input {
  width: 100%;
  height: 8em;
  text-transform: uppercase;
  font-style: italic;
  font-weight: 600;
  resize: vertical;
  line-height: 1.2;
}

.close {
  margin: auto 5px 5px;
  min-height: 64px;
}
</style>
