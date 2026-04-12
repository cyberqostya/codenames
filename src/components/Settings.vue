<script setup>
import Title from "@c/Title.vue";
import Button from "@c/Button.vue";
import Input from "@c/Input.vue";
import { useMainStore } from "@/stores/mainStore";
import { ref, computed } from "vue";

const mainStore = useMainStore();

function handleClick(ind) {
  mainStore.setActiveResourceIndex(ind);
  mainStore.setBoard();
}

const cellText = computed({
  get() {
    return mainStore.board
      .filter((i) => i.type === "text")
      .map((cell) => cell.value)
      .join(", ");
  },
  set(newVal) {
    const values = newVal.split(",").map((s) => s.trim());
    const boardTextCells = mainStore.board.filter((i) => i.type === "text");
    values.forEach((i, ind) => {
      if (boardTextCells[ind]) boardTextCells[ind].value = i;
    });
    // for (let i = 0; i < values.length; i++) {
    //   if (mainStore.board[i]) {
    //     mainStore.board[i].value = values[i];
    //   }
    // }
  },
});
</script>

<template>
  <section class="settings">
    <Title class="title">Settings</Title>

    <div class="field">
      <span class="field__title">Columns:</span>

      <div class="arrows">
        <Button :class="mainStore.columns !== i && 'disabled'" @click="mainStore.setColRow('columns', i)" v-for="i in [2, 3, 4, 5, 6]" style="width: 34px">{{ i }}</Button>
      </div>
    </div>

    <div class="field">
      <span class="field__title">Rows:</span>

      <div class="arrows">
        <Button :class="mainStore.rows !== i && 'disabled'" @click="mainStore.setColRow('rows', i)" v-for="i in [2, 3, 4, 5, 6]" style="width: 34px">{{ i }}</Button>
      </div>
    </div>

    <div class="field">
      <span class="field__title">Cards:</span>

      <div class="cards-buttons">
        <Button v-for="(i, ind) in mainStore.resources" :key="ind" @click="handleClick(ind)" :class="mainStore.activeResourceIndex !== ind && 'disabled'">{{ i.title }}</Button>
      </div>
    </div>

    <div class="field" v-if="mainStore.board.find((i) => i.type === 'text')">
      <span class="field__title">Words: (can edit)</span>
      <Input tag="textarea" class="input" v-model="cellText" ref="textareaNode" />
    </div>

    <Button color="gold" style="margin: auto 5px 5px" @click="mainStore.startGame">Resume</Button>
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

.title {
  border-bottom: 1px dashed $color-dashed-border;
  padding: 5px;
  line-height: 34px;
}

.field {
  padding: 0.5em 5px;

  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 5px;

  border-bottom: 1px dashed $color-dashed-border;
}

.field__title {
  font-size: 16px;
  font-weight: 600;
  font-style: italic;

  margin-right: auto;
}

.field__data {
  display: flex;
  align-items: center;
  gap: 10px;
}

.arrows {
  display: flex;
  gap: 5px;
}
.arrows-texts {
  display: flex;
  gap: 5px;

  b {
    font-size: 20px;
  }
}

.cards-buttons {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
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
</style>
