<template>
  <div class="pagination-controls">
    <button
      class="tg-button"
      :disabled="offset === 0"
      @click="handlePageChange(offset - limit)"
    >
      Назад
    </button>
    <span class="page-info">
      {{ offset + 1 }}-{{ Math.min(offset + limit, total) }} из {{ total }}
    </span>
    <button
      class="tg-button"
      :disabled="offset + limit >= total"
      @click="handlePageChange(offset + limit)"
    >
      Вперед
    </button>
  </div>
</template>

<script setup>
defineProps({
  offset: {
    type: Number,
    required: true
  },
  limit: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['update'])

const handlePageChange = (newOffset) => {
  emit('update', newOffset)
}
</script>

<style scoped>
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 20px;
  padding: 16px 0;
}

.page-info {
  font-size: 14px;
  color: var(--tg-hint-color);
}
</style>