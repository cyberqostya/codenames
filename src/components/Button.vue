<script setup>
import { computed, defineAsyncComponent } from "vue";

const props = defineProps({
  color: {
    type: String,
    default: "gray",
    validator(value) {
      return ["gray", "gold"].includes(value);
    },
  },

  icon: {
    type: String,
    validator(value) {
      return ["arrow", "cog", "coin"].includes(value);
    },
  },

  href: {
    type: String,
  },
});

// Динамический импорт нужной картинки
const iconMap = {
  arrow: () => import("@c/SVG/Arrow.vue"),
  cog: () => import("@c/SVG/Cog.vue"),
  coin: () => import("@c/SVG/Coin.vue"),
};
const iconComponent = computed(() => {
  if (props.icon) {
    return defineAsyncComponent(iconMap[props.icon]);
  }
});

const colors = {
  gray: "#1d1d1d",
  gold: "#fff",
};
</script>

<template>
  <component :class="['button', color, icon && 'icon']" :is="href ? 'a' : 'button'" :href="href" :target="href && '_blank'">
    <template v-if="icon">
      <component :is="iconComponent" :color="colors[color]" />
    </template>

    <template v-else>
      <slot />
    </template>
  </component>
</template>

<style lang="scss" scoped>
.button {
  padding: 10px;
  border-radius: 6px;
  font-size: 14px;
  flex-shrink: 0;
  touch-action: manipulation;
  box-sizing: border-box;
  overflow: hidden;
  -webkit-tap-highlight-color: transparent;
  font-weight: 900;
  letter-spacing: -0.05em;
  font-family: opensans;
  text-transform: uppercase;
  letter-spacing: -1px;

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

.icon {
  padding: 5px;
}
</style>
