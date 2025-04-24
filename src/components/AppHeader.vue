<template>
  <header class="app-header">
    <button
      v-if="backButton"
      class="tg-back-button"
      @click="handleBack"
    >
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
      </svg>
    </button>
    <h1 class="tg-title">{{ title }}</h1>
    <slot></slot>
  </header>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  backButton: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()

const handleBack = () => {
  if (window.history.state.back) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--tg-theme-bg-color, #ffffff);
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.tg-back-button {
  background: none;
  border: none;
  padding: 8px;
  margin-right: 12px;
  color: var(--tg-theme-text-color, #ffffff);
  cursor: pointer;
}

.tg-title {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
  flex-grow: 1;
  color: var(--tg-theme-text-color, #ffffff);
}
</style>