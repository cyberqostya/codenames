<script setup>
import { ref } from "vue";

defineProps({
  tag: {
    type: String,
    default: "input",
  },

  modelValue: {
    type: String,
  },
});

const emit = defineEmits(["update:modelValue", "blur"]);
const inputNode = ref(null);

function onInput(event) {
  emit("update:modelValue", event.target.value);
}

function onBlur(event) {
  emit("blur", event);
}

function blur() {
  inputNode.value?.blur();
}

defineExpose({
  blur,
});
</script>

<template>
  <component
    :is="tag"
    ref="inputNode"
    class="input"
    type="text"
    :value="modelValue"
    @input="onInput"
    @blur="onBlur"
  />
</template>

<style lang="scss" scoped>
.input {
  padding: 5px;
  background-color: $color-back-second;
  border-radius: 6px;

  font-size: 16px;
  font-family: opensans;
}
</style>
