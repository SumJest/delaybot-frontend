<template>
  <div>
    <AppHeader title="Мои очереди" />

    <!-- Фильтры: Просмотр / Управление -->
    <div class="filter-container">
      <button
        :class="{ active: !manage }"
        @click="setManage(false)"
      >
        Просмотр
      </button>
      <button
        :class="{ active: manage }"
        @click="setManage(true)"
      >
        Управление
      </button>
    </div>

    <div class="queue-list">
      <QueueCardShimmer v-if="store.listQueuesLoading" />
      <div v-for="queue in queues.items" :key="queue.id" v-else>
        <QueueCard :queue="queue" />
      </div>

      <PaginationControls
        :offset="queues.offset"
        :limit="queues.limit"
        :total="queues.total"
        @update="fetchQueues"
      />
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useQueueStore } from '@/stores/queueStore.js'
import { storeToRefs } from 'pinia'
import AppHeader from '@/components/AppHeader.vue'
import QueueCard from '@/components/ui/QueueCard.vue'
import QueueCardShimmer from '@/components/ui/shimmers/QueueCardShimmer.vue'
import PaginationControls from '@/components/ui/PaginationControls.vue'

export default {
  components: {
    AppHeader,
    QueueCardShimmer,
    QueueCard,
    PaginationControls
  },
  setup() {
    const store = useQueueStore()
    const { queues } = storeToRefs(store)

    // Флаг управления: true — управление, false — просмотр (по умолчанию)
    const manage = ref(false)

    // Установить режим и перезагрузить
    const setManage = (value) => {
      manage.value = value
      fetchQueues()
    }

    // Загрузка очередей с учётом manage
    const fetchQueues = async (offset = 0) => {
      const params = { offset }
      if (manage.value) params.manage = true
      await store.fetchQueues(params)
    }

    onMounted(() => fetchQueues())

    return {
      queues,
      store,
      manage,
      setManage,
      fetchQueues
    }
  }
}
</script>

<style>
.filter-container {
  padding: 16px;
  display: flex;
  gap: 8px;
}

.filter-container button {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background-color: var(--tg-theme-secondary-bg-color);
  color: var(--tg-theme-text-color);
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s;
}

.filter-container button.active {
  background-color: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  box-shadow: 0 0 0 2px var(--tg-theme-button-color);
}

.queue-list {
  padding: 0 16px;
}
</style>
