<template>
  <button
      class="btn-wave"
      :class="{ loading: isLoading }"
      :style="cssVars"
      :disabled="isLoading"
      @click="handleClick"
  >
    <!-- Показываем слот или анимацию волны -->
    <!-- Содержимое кнопки всегда в DOM, но скрывается при загрузке -->
    <span class="btn-content" :class="{ hidden: isLoading }">
      <slot />
    </span>
    <!-- Анимация волны поверх содержимого -->
    <span v-if="isLoading" class="wave"></span>
  </button>
</template>

<script setup>
import {computed} from 'vue'

// Флаг загрузки теперь передается в пропсах
const props = defineProps({
  isLoading: {type: Boolean, default: false}
})
const emit = defineEmits(['click'])

// CSS-переменные из темы Telegram WebApp
const cssVars = computed(() => ({
  '--btn-bg': window.Telegram.WebApp.themeParams.button_color,
  '--wave-color': window.Telegram.WebApp.themeParams.button_text_color + '33'
}))

function handleClick(e) {
  emit('click', e)
}
</script>

<style scoped>
.btn-wave {
  position: relative;
  display: inline-block;
  padding: 0.6em 1.2em;
  background: var(--btn-bg);
  color: var(--tg-theme-button-text-color, #fff);
  border: none;
  border-radius: var(--tg-border-radius);
  overflow: hidden;
  cursor: pointer;
}

.wave {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  border-radius: var(--tg-border-radius);
  background: var(--wave-color);
  animation: wave 1.2s ease-in-out infinite;
}

@keyframes wave {
  0% {
    left: -100%;
  }
  50% {
    left: 100%;
  }
  100% {
    left: -100%;
  }
}

.btn-wave.loading {
  pointer-events: none;
}
</style>
