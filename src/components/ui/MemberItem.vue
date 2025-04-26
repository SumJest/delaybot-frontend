
<template>
  <div class="member-item">
    <span class="member-info drag-handle">
            {{ element.first_name || '' }} {{ element.last_name || '' }}
            <small>@{{ element.username || '' }}</small>
          </span>
    <button
        @click="handleDeleteMember(element.id)"
        class="tg-button danger small"
    >
      ×
    </button>
  </div>
</template>

<script setup>

defineProps({
  element: {
    type: Object,
    required: true
  }
})
const emit = defineEmits(['delete'])

const handleDeleteMember = (id) => {
  emit('delete', id)
}
</script>
<style scoped>
.member-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: var(--tg-border-radius);
  background: var(--tg-theme-secondary-bg-color);
  margin: 0.5rem;
}
.member-info {
  flex: 1;
  word-break: break-word;
}
.tg-button.small {
  padding: 0.3rem 0.5rem;
  width: 2rem;
}
</style>