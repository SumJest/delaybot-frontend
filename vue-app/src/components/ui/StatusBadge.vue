<template>
  <WaveButton
    class="status-badge"
    :class="{ 'closed': closed }"
    @click="handleToggle"
    :is-loading="toggleLoading"
  >
    {{ closed ? 'Закрыта' : 'Открыта' }}
  </WaveButton>
</template>

<script setup>
import WaveButton from "./WaveButton.vue";
import {ref} from "vue";

const toggleLoading = ref(false);

defineProps({
  closed: {
    type: Boolean,
    required: true
  }
})

const emit = defineEmits(['toggle'])

const handleComplete = () => {toggleLoading.value = false}

const handleToggle = () => {
  toggleLoading.value = true
  emit("toggle", handleComplete);
}

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
  min-width: 77px;
}

.status-badge.closed {
  background: #f44336;
}
</style>