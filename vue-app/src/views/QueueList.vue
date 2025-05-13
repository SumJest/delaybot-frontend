<template>
  <div>
    <!-- Заголовок с кнопкой '+' -->
    <AppHeader title="Мои очереди">
      <button class="invite-button" @click="enterInviteCode">
        <svg xmlns="http://www.w3.org/2000/svg" width="22px" height="22px" viewBox="0 0 24 24">
          <path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M13,7H11V11H7V13H11V17H13V13H17V11H13V7Z" />
        </svg>
      </button>
    </AppHeader>

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
      <div v-for="i in DEFAULT_PAGE_SIZE" v-if="store.listQueuesLoading">
        <QueueCardShimmer />
      </div>
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
import { useRouter } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import QueueCard from '@/components/ui/QueueCard.vue'
import QueueCardShimmer from '@/components/ui/shimmers/QueueCardShimmer.vue'
import PaginationControls from '@/components/ui/PaginationControls.vue'
import {encode_payload} from "@/utils/helpers.js";

export default {
  components: {
    AppHeader,
    QueueCardShimmer,
    QueueCard,
    PaginationControls
  },
  setup() {
    const router = useRouter()
    const store = useQueueStore()
    const {queues} = storeToRefs(store)
    const DEFAULT_PAGE_SIZE = parseInt(import.meta.env.VITE_DEFAULT_PAGE_SIZE) || 5

    // Флаг управления: true — управление, false — просмотр (по умолчанию)
    const manage = ref(false)

    // Загрузка очередей
    const fetchQueues = async (offset = 0) => {
      const params = {offset, limit: DEFAULT_PAGE_SIZE}
      if (manage.value) params.manage = true
      await store.fetchQueues(params)
    }

    // Установить режим и перезагрузить
    const setManage = (value) => {
      manage.value = value
      fetchQueues()
    }

    // Ввод кода приглашения и редирект
    const enterInviteCode = () => {
      const code = window.prompt('Введите код приглашения')
      if (code && code.trim()) {
        router.push({name: 'ShareActivation', query: {token: code.trim()}})
      }
    }

    onMounted(() => fetchQueues())

    return {
      queues,
      store,
      manage,
      setManage,
      fetchQueues,
      DEFAULT_PAGE_SIZE,
      enterInviteCode
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

/* Стили для кнопки '+' */
.invite-button {
  padding-top: 7px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  line-height: 1;
}
.invite-button svg {
  fill: var(--tg-theme-link-color);
}

.invite-button svg:hover {
  opacity: 0.8;
}
</style>