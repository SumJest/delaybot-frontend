<template>
  <div class="share-item">
    <p v-shimmer="true">Токен:</p>
    <p v-shimmer="true">Истекает:</p>
    <p v-shimmer="true">Права: </p>
    <button class="tg-button danger" v-shimmer="true">
      Удалить
    </button>
  </div>
</template>

<style scoped>
.share-item {
  background: rgba(0,0,0,0.05);
  padding: 1rem;
  border-radius: var(--tg-border-radius);
  margin-bottom: 1rem;
  cursor: pointer;
}
</style>