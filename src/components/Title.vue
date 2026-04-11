<script setup>
defineProps({
  tag: {
    type: String,
    default: "h2",
  },
});
</script>

<template>
  <component :is="tag" class="title"><slot /></component>
</template>

<style lang="scss" scoped>
.title {
  font-size: 20px;
  text-align: center;
}
</style>
