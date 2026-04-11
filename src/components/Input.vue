<script setup>
defineProps({
  tag: {
    type: String,
    default: "input",
  },

  modelValue: {
    type: String,
  },
});

const emit = defineEmits(["update:modelValue"]);
function onInput(event) {
  emit("update:modelValue", event.target.value);
}
</script>

<template>
  <component :is="tag" class="input" type="text" :value="modelValue" @input="onInput" />
</template>

<style lang="scss" scoped>
.input {
  padding: 5px;
  background-color: $color-back-second;
  border-radius: 6px;

  font-size: 14px;
  font-family: opensans;
}
</style>
