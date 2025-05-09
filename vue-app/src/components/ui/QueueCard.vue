<template>
  <div class="queue-card tg-theme-text" @click="navigateToDetail">
    <div class="header">
      <h3 class="queue-title">{{ queue.name }}</h3>
      <StatusBadge :closed="queue.closed" />
    </div>
    <div class="meta">
      <div class="meta-item">
        <!-- иконка участников -->
        <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33
               0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84
               1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
            fill="var(--tg-theme-hint-color)"
          />
        </svg>
        <span class="meta-text">{{ queue.members.length }}</span>
      </div>
      <div class="arrow">
        <!-- стрелочка, чтобы понять, что это ссылочный элемент -->
        <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.29 6.71a1 1 0 011.42-1.42l5 5a1 1 0 010 1.42l-5 5a1 1 0 11-1.42-1.42L13.59 12 9.29 7.71z"
            fill="var(--tg-theme-hint-color)"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
import StatusBadge from "@/components/ui/StatusBadge.vue";

export default {
  name: "QueueCard",
  components: { StatusBadge },
  props: {
    queue: {
      type: Object,
      required: true
    }
  },
  methods: {
    navigateToDetail() {
      this.$router.push(`/queue/${this.queue.id}`);
    }
  }
};
</script>

<style scoped>
.queue-card {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: var(--tg-border-radius);
  background-color: var(--tg-theme-section-bg-color);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: transform 0.1s ease, background-color 0.2s ease;
  cursor: pointer;
}

.queue-card:hover {
  transform: translateY(-2px);
  background-color: var(--tg-theme-hover-color);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}
.status-badge {
  transition: transform 0.1s ease, background-color 0.2s ease;
  will-change: transform;
}
.queue-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--tg-theme-title-text-color);
  margin: 0;
}

.meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.meta-text {
  font-size: 0.875rem;
  color: var(--tg-theme-accent-text-color);
  font-weight: 500;
}

.icon {
  width: 18px;
  height: 18px;
}

.arrow {
  display: flex;
  align-items: center;
}
</style>
