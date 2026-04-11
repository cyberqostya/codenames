<script setup>
defineProps({ color: { type: String } });
</script>

<template>
  <img class="coin" src="/coin.png" />
</template>

<style lang="scss" scoped>
.coin {
  width: 24px;
  height: 24px;
}
</style>
