<script setup>
const props = defineProps({
  color: {
    type: String,
    default: "gray",
    validator(value) {
      return ["gray", "gold"].includes(value);
    },
  },

  href: {
    type: String,
  },
});
</script>

<template>
  <component
    :class="['button', color]"
    :is="href ? 'a' : 'button'"
    :href="href"
    :target="href && '_blank'"
  >
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.button {
  padding: 10px;
  border-radius: 6px;
  font-size: 16px;
  flex-shrink: 0;
  touch-action: manipulation;
  box-sizing: border-box;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  font-weight: 900;
  font-family: opensans;
  text-transform: uppercase;

  transition: opacity 0.4s;
}
.gold {
  background-color: $color-gold;
  color: #fff;
}
.gray {
  background-color: $color-dashed-border;
  color: $color-black;
}

.button {
  &[disabled],
  &.disabled {
    opacity: 0.4;
  }
}
</style>
