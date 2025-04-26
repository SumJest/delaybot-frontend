<template>
  <button
    class="status-badge"
    :class="{ 'closed': closed }"
    @click="$emit('toggle')"
  >
    {{ closed ? 'Закрыта' : 'Активна' }}
  </button>
</template>

<script setup>
defineProps({
  closed: {
    type: Boolean,
    required: true
  }
})

defineEmits(['toggle'])
</script>

<style scoped>
.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: #4caf50;
  color: white;
}

.status-badge.closed {
  background: #f44336;
}
</style>