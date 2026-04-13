<script setup>
defineProps({
  image: {
    type: String,
    required: true,
  },
});

defineEmits(["close"]);
</script>

<template>
  <div class="card-preview" @click="$emit('close')">
    <div class="card-preview__card" @click.stop>
      <img
        class="card-preview__image"
        :src="image"
        alt="codename preview"
        draggable="false"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card-preview {
  position: fixed;
  inset: 0;
  z-index: 80;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba($color-black, 0.42);
  backdrop-filter: blur(3px);
}

.card-preview__card {
  width: min(82vw, 440px);
  aspect-ratio: 1;
  padding: 24px;
  border-radius: 22px;
  background:
    linear-gradient(145deg, rgba(#fff, 0.5), rgba(#fff, 0) 46%),
    linear-gradient(180deg, $color-back-second, $color-back);
  box-shadow:
    0 20px 42px rgba($color-black, 0.28),
    0 2px 5px rgba($color-black, 0.18);

  rotate: 90deg;
}

.card-preview__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  user-select: none;
  -webkit-user-select: none;
  -webkit-user-drag: none;
  -webkit-touch-callout: none;
}
</style>
