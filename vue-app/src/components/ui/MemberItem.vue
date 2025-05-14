
<template>
  <div class="member-item">
    <img :src="getUserAvatar(element.id, element.photo_url)" class="avatar" />
    <span class="member-info drag-handle">
            {{ element.first_name || '' }} {{ element.last_name || '' }}<br/>
      <small v-if="element.username">@{{ element.username }}</small>
      <small v-else>({{ element.id }})</small>
          </span>
    <svg v-if="canManage" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="delete-icon" @click="handleDeleteMember(element.id)"><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" /></svg>
  </div>
</template>

<script setup>

import {ref} from "vue";
import WaveButton from "./WaveButton.vue";
import {getUserAvatar} from "@/utils/avatarUtils.js";

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
  margin: 0.5rem;
}
.member-info {
  flex: 1;
  word-break: break-word;
  color: var(--tg-theme-text-color);
}
.member-info small {
  flex: 1;
  word-break: break-word;
  color: var(--tg-theme-hint-color);
}
svg.delete-icon {
  fill: var(--tg-theme-hint-color);
  width: 25px;
  height: 25px;
}
.avatar {
  width: 40px;
  height: 40px;
}
svg.avatar {
  fill: var(--tg-theme-hint-color);
}
img.avatar {
  border-radius: 50%;
}
</style>