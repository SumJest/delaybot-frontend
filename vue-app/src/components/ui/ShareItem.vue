<template>
  <div class="share-item" @click="handleItemClick(props.share)">
    <div class="share-row">
      <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v16l7-3 7 3V7c0-1.1-.9-2-2-2z" fill="var(--tg-theme-hint-color)" />
      </svg>
      <span>Токен:</span>
      <strong class="token" @click="copyText">{{ props.share.token }}</strong>
    </div>

    <div class="share-row">
      <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8V4l8 8-8 8v-4H4v-8z" fill="var(--tg-theme-hint-color)" />
      </svg>
      <span>Истекает:</span>
      <strong>
        {{ props.formatDate(props.share.expires_at) }}
      </strong>
    </div>

    <div class="share-row">
      <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2a10 10 0 00-7.07 17.07A10 10 0 1012 2z" fill="var(--tg-theme-hint-color)" />
      </svg>
      <span>Права:</span>
      <strong>{{ props.share.can_manage ? 'Управление' : 'Просмотр' }}</strong>
    </div>

    <WaveButton :is-loading="deleteLoading" class="delete-button" @click.stop="handleDelete(props.share)">
      Удалить
    </WaveButton>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import WaveButton from "./WaveButton.vue";

const props = defineProps({
  share: { type: Object, required: true },
  formatDate: { type: Function, required: true }
});
const deleteLoading = ref(false);
const emit = defineEmits(["view-share", "delete-share"]);

function handleItemClick(share) {
  emit('view-share', share);
}

function handleDelete(share) {
  deleteLoading.value = true;
  emit('delete-share', share.id);
}

const copyText = async (event) => {
  event.stopPropagation();
  try {
    const text = event.target.innerText;
    await navigator.clipboard.writeText(text);
    Telegram.WebApp.showAlert('Скопировано в буфер обмена');
  } catch (e) {
    console.error('Ошибка копирования', e);
  }
};

// Вычисляем остаток времени до истечения (поддержка ISO-строки с Z)
const timeRemaining = computed(() => {
  const now = new Date();
  const expires = new Date(props.share.expires_at);
  const diffMs = expires.getTime() - now.getTime();
  if (diffMs <= 0) return 'истёк';
  const diffSec = Math.floor(diffMs / 1000);
  const hours = Math.floor(diffSec / 3600);
  const minutes = Math.floor((diffSec % 3600) / 60);
  const parts = [];
  if (hours) parts.push(`${hours} ч`);
  if (minutes || !hours) parts.push(`${minutes} мин`);
  return parts.join(' ');
});
</script>

<style scoped>
.share-item {
  background-color: unset;
  padding: 1rem;
  border-radius: 12px;
  margin-bottom: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
  transition: background 0.2s;
}

.share-item:hover {
  background-color: var(--tg-theme-bg-color, #f5f5f5);
}

.share-row {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 14px;
}

.icon {
  width: 20px;
  height: 20px;
  margin-right: 8px;
  flex-shrink: 0;
}

span {
  color: var(--tg-theme-hint-color, #6c757d);
  margin-right: 4px;
}

strong {
  color: var(--tg-theme-accent-text-color, #000);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.remaining {
  font-size: 12px;
  color: var(--tg-theme-hint-color);
  margin-left: 4px;
}

.token {
  max-width: 120px;
  display: inline-block;
  cursor: pointer;
  transition: opacity 0.2s;
}

.token:hover {
  opacity: 0.7;
}

.delete-button {
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  background-color: var(--tg-theme-link-color, #f44336);
  color: var(--tg-theme-button-text-color, #fff);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.delete-button:hover {
  opacity: 0.9;
}
</style>