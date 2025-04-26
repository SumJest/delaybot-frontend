<template>
  <div class="queue-actions">
    <button class="tg-icon-button" @click="toggleMenu">
      <svg width="24" height="24" viewBox="0 0 24 24">
        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
      </svg>
    </button>

    <div v-if="isMenuOpen" class="actions-menu tg-theme-bg">
      <button class="menu-item" @click="emit('share')">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
        </svg>
        Поделиться
      </button>
      <button class="menu-item danger" @click="confirmDelete">
        <svg width="20" height="20" viewBox="0 0 24 24">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
        Удалить
      </button>
    </div>

    <ConfirmationDialog
      v-if="showConfirm"
      title="Удалить очередь?"
      message="Вы уверены, что хотите удалить эту очередь? Это действие нельзя отменить."
      @confirm="emit('delete')"
      @cancel="showConfirm = false"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ConfirmationDialog from './ConfirmationDialog.vue'

const emit = defineEmits(['share', 'delete'])

const isMenuOpen = ref(false)
const showConfirm = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const confirmDelete = () => {
  isMenuOpen.value = false
  showConfirm.value = true
}
</script>

<style scoped>
.queue-actions {
  display: flex;
}
.tg-icon-button {
  background: none;
  border: none;
  padding: 8px;
  color: var(--tg-theme-text-color, #000000);
  cursor: pointer;
}
.tg-icon-button {
  fill: #f9f9f9;
}

.actions-menu {
  position: absolute;
  right: 0;
  top: 100%;
  min-width: 180px;
  border-radius: var(--tg-border-radius);
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  z-index: 100;
  overflow: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  color: var(--tg-theme-text-color, #000000);
}

.menu-item:hover {
  background: rgba(0,0,0,0.05);
}

.menu-item.danger {
  color: #e53935;
}

.menu-item svg {
  fill: currentColor;
}
</style>