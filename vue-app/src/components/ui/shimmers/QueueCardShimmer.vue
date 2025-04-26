<template>
  <div class="queue-card tg-theme-bg tg-theme-text">
    <div class="header">
      <h3 v-shimmer="true">Queue</h3>
      <StatusBadge :closed="true" v-shimmer="true"/>
    </div>
    <p v-shimmer="true">Участников: </p>
  </div>
</template>

<script>
import StatusBadge from "@/components/ui/StatusBadge.vue";

export default {
  components: {StatusBadge},
}
</script>

<style scoped>
.queue-card {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: var(--tg-border-radius);
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}
</style>