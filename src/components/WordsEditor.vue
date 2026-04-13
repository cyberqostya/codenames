<script setup>
import Input from "@c/Input.vue";
import { onBeforeUnmount, onMounted, ref } from "vue";

defineProps({
  cells: {
    type: Array,
    required: true,
  },
});

const wordDrafts = ref(new Map());

function getWordKey(cell, index) {
  return `${index}:${cell.team}`;
}

function getWordDraft(cell, index) {
  const key = getWordKey(cell, index);

  if (!wordDrafts.value.has(key)) {
    wordDrafts.value.set(key, {
      value: cell.value,
      lastValidValue: cell.value,
    });
  }

  return wordDrafts.value.get(key);
}

function getWordValue(cell, index) {
  return getWordDraft(cell, index).value;
}

function updateWord(cell, index, value) {
  const draft = getWordDraft(cell, index);
  draft.value = value;

  const trimmedValue = value.trim();
  if (!trimmedValue) return;

  draft.lastValidValue = trimmedValue;
  cell.value = trimmedValue;
}

function restoreWordIfEmpty(cell, index) {
  const draft = getWordDraft(cell, index);
  const trimmedValue = draft.value.trim();

  draft.value = trimmedValue || draft.lastValidValue;
  cell.value = draft.value;
}

function closeKeyboardOnOutsideTap(event) {
  if (event.target.closest("input, textarea")) return;

  document.activeElement?.blur();
}

onMounted(() => {
  document.addEventListener("pointerdown", closeKeyboardOnOutsideTap);
});

onBeforeUnmount(() => {
  document.removeEventListener("pointerdown", closeKeyboardOnOutsideTap);
});
</script>

<template>
  <div class="words-editor">
    <Input
      v-for="(cell, index) in cells"
      :key="getWordKey(cell, index)"
      class="word-input"
      :model-value="getWordValue(cell, index)"
      @update:model-value="updateWord(cell, index, $event)"
      @blur="restoreWordIfEmpty(cell, index)"
    />
  </div>
</template>

<style lang="scss" scoped>
.words-editor {
  padding: 5px;
  border-bottom: 1px dashed $color-dashed-border;
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(auto-fit, minmax(90px, 1fr));
}

.word-input {
  width: 100%;
  text-transform: uppercase;
  font-style: italic;
  font-weight: 600;
}
</style>
