<template>
  <div class="share-item" @click="handleItemClick">
    <p>Токен: {{ share.token }}</p>
    <p>Истекает: {{ formatDate(share.expires_at) }}</p>
    <p>Права: {{ share.can_manage ? 'Управление' : 'Просмотр' }}</p>
    <button class="tg-button danger" @click.stop="handleDelete">
      Удалить
    </button>
  </div>
</template>

<script>
export default {
  props: {
    share: {
      type: Object,
      required: true
    },
    formatDate: {
      type: Function,
      required: true
    }
  },
  methods: {
    handleItemClick() {
      this.$emit('view-share', this.share)
    },
    handleDelete() {
      this.$emit('delete-share', this.share.id)
    }
  }
}
</script>

<style scoped>
.share-item {
  background: rgba(0,0,0,0.05);
  padding: 1rem;
  border-radius: var(--tg-border-radius);
  margin-bottom: 1rem;
  cursor: pointer;
}
</style>