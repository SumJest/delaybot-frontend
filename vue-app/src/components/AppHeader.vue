<template>
  <header class="app-header">
    <div class="app-header-container">
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
    </div>
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
  padding-top: var(--tg-safe-area-inset-top);
    position: sticky;
  top: 0;
  background: var(--tg-theme-header-bg-color, #ffffff);
}
.app-header-container{
  display: flex;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
  padding: var(--tg-safe-area-inset-top) 16px 20px 16px;
}
.tg-back-button {
  background: none;
  border: none;
  padding: 8px;
  margin-right: 12px;
  color: var(--tg-theme-accent-text-color, #ffffff);
  cursor: pointer;
}
.tg-back-button svg{
  fill: #f9f9f9;
}

.tg-title {
  font-size: 20px;
  font-weight: 500;
  margin: 0;
  flex-grow: 1;
  color: var(--tg-theme-text-color, #ffffff);
  text-align: center;
}

</style>