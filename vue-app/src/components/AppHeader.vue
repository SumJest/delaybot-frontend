<template>
  <header class="app-header">
    <div class="app-header-container">
      <!-- Левая область: кнопка назад или заглушка -->
      <div class="side-placeholder">
        <button
          v-if="backButton"
          class="tg-back-button"
          @click="handleBack"
        >
          <svg width="24" height="24" viewBox="0 0 24 24">
            <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
          </svg>
        </button>
      </div>

      <!-- Заголовок по центру -->
      <h1 class="tg-title">{{ title }}</h1>

      <!-- Правая область: слот или заглушка -->
      <div class="side-placeholder">
        <slot></slot>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  title: String,
  backButton: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const handleBack = () => {
  if (window.history.state.back) router.back()
  else router.push('/')
}
</script>

<style scoped>
.app-header {
  padding-top: var(--tg-safe-area-inset-top);
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--tg-theme-header-bg-color, #ffffffcc);
  backdrop-filter: blur(10px);
}

.app-header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  padding: var(--tg-safe-area-inset-top) 16px 20px;
}

.side-placeholder {
  /* фиксированная ширина для обеих боковых областей */
  width: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tg-back-button {
  background: none;
  border: none;
  padding: 8px;
  color: var(--tg-theme-text-color, #000000);
  cursor: pointer;
}
.tg-back-button svg { fill: var(--tg-theme-text-color, #000000); }

.tg-title {
  flex: 1;
  font-size: 20px;
  font-weight: 500;
  margin: 0;
  color: var(--tg-theme-text-color, #ffffff);
  text-align: center;
}
</style>
