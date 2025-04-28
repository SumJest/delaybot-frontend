
<template>
  <div class="member-item">
    <span class="member-info drag-handle">
            {{ element.first_name || '' }} {{ element.last_name || '' }}
            <small>@{{ element.username || '' }}</small>
          </span>
    <WaveButton
        @click="handleDeleteMember(element.id)"
        v-if="canManage"
        :is-loading="deleteLoading"
        class="tg-button danger small"
    >
      ×
    </WaveButton>
  </div>
</template>

<script setup>

import {ref} from "vue";
import WaveButton from "./WaveButton.vue";

defineProps({
  element: {
    type: Object,
    required: true
  },
  canManage : {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['delete'])
const deleteLoading = ref(false)
const handleDeleteMember = (id) => {
  deleteLoading.value = true
  emit('delete', id)
}
</script>
<style scoped>
.member-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem;
  border-radius: var(--tg-border-radius);
  background: var(--tg-theme-button-color);
  margin: 0.5rem;
}
.member-info {
  flex: 1;
  word-break: break-word;
  color: var(--tg-theme-button-text-color);
}
.tg-button.small {
  padding: 0.3rem 0.5rem;
  width: 2rem;
}
</style>