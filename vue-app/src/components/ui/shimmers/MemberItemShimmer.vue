
<template>
  <div class="member-item"  v-shimmer="true">
    <span class="member-info"></span>
    <button
        class="tg-button danger small"
    >
      ×
    </button>
  </div>
</template>

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
<script setup lang="ts">
</script>