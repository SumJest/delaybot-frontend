<template>
  <div :class="['shimmer', variantClass, customClass]" :style="styleObject"></div>
</template>

<script setup>
import { computed, onMounted } from 'vue'

const props = defineProps({
  width: { type: String, default: '100%' },
  height: { type: String, default: '1rem' },
  borderRadius: { type: String, default: '4px' },
  customClass: { type: String, default: '' },
  variant: {
    type: String,
    default: 'rect',
    validator: v => ['text', 'circle', 'thumbnail', 'rect'].includes(v),
  },
})

const variantClass = computed(() => {
  switch (props.variant) {
    case 'circle':
      return 'shimmer--circle'
    case 'text':
      return 'shimmer--text'
    case 'thumbnail':
      return 'shimmer--thumbnail'
    default:
      return ''
  }
})

const styleObject = computed(() => ({
  width: props.width,
  height: props.height,
  borderRadius: props.variant === 'circle' ? '50%' : props.borderRadius,
}))
</script>

<style scoped>
.shimmer {
  background: linear-gradient(
      to right,
      var(--tg-theme-secondary-bg-color, #eeeeee) 0%,
      var(--tg-theme-hint-color, #dddddd) 20%,
      var(--tg-theme-secondary-bg-color, #eeeeee) 40%,
      var(--tg-theme-secondary-bg-color, #eeeeee) 100%
  );
  background-size: 1000px 100%;
  animation: shimmer 1.5s infinite linear;
  display: block;
  margin-top: 5px;
}

@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

/* Variants */

.shimmer--circle {
  aspect-ratio: 1 / 1;
  border-radius: 50% !important;
}

.shimmer--text {
  height: 1em;
  border-radius: 4px;
}

.shimmer--thumbnail {
  width: 100%;
  height: 200px;
  border-radius: 12px;
}
</style>
