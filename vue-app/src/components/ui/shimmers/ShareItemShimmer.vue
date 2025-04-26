<template>
  <div class="share-item">
    <div class="share-row">
      <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v16l7-3 7 3V7c0-1.1-.9-2-2-2z" fill="var(--tg-theme-hint-color)"/>
      </svg>
      <span>Токен:</span>
      <strong class="truncate" v-shimmer="true">share.token</strong>
    </div>
    <div class="share-row">
      <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8V4l8 8-8 8v-4H4v-8z" fill="var(--tg-theme-hint-color)" />
      </svg>
      <span>Истекает:</span>
      <strong v-shimmer="true">27 апр. 2025г., 02:20</strong>
    </div>
    <div class="share-row">
      <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2a10 10 0 00-7.07 17.07A10 10 0 1012 2z" fill="var(--tg-theme-hint-color)" />
      </svg>
      <span>Права:</span>
      <strong v-shimmer="true">Управление</strong>
    </div>

    <button class="delete-button" v-shimmer="true">
      Удалить
    </button>
  </div>
</template>

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
  color: var(--tg-theme-accent-color, #000);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.truncate {
  max-width: 120px;
  display: inline-block;
}

.delete-button {
  margin-top: 0.5rem;
  width: 100%;
  padding: 0.5rem;
  background-color: unset;
  color: unset;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.delete-button:hover {
  opacity: 0.9;
}
</style>
<script setup>
</script>