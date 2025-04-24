<template>
  <div class="confirmation-overlay">
    <div class="confirmation-dialog tg-theme-bg">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="dialog-actions">
        <button class="tg-button secondary" @click="$emit('cancel')">
          Отмена
        </button>
        <button class="tg-button danger" @click="$emit('confirm')">
          Удалить
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: 'Подтверждение'
  },
  message: {
    type: String,
    required: true
  }
})

defineEmits(['confirm', 'cancel'])
</script>

<style scoped>
.confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.confirmation-dialog {
  padding: 20px;
  border-radius: var(--tg-border-radius);
  max-width: 90%;
  width: 300px;
}

.confirmation-dialog h3 {
  margin-top: 0;
}

.dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.tg-button.danger {
  background: #e53935;
}

.tg-button.secondary {
  background: #78909c;
}
</style>