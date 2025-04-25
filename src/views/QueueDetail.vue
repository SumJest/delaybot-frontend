<template>
  <div class="queue-detail tg-theme-bg">
    <AppHeader :title="queue.name" back-button>
      <QueueActions
        :queue="queue"
        @delete="handleDelete"
        @share="showShareModal = true"
      />
    </AppHeader>

    <div class="queue-content">
      <div class="queue-meta">
        <StatusBadge :closed="queue.closed" @toggle="toggleQueueStatus" />
        <p>Создана: {{ formatDate(queue.created_at) }}</p>
        <p>Участников: {{ queue.members.length }}</p>
      </div>

      <MembersEditor
        :members="queue.members"
        @update="updateMembers"
      />

      <div class="shares-section" v-if="shares.items?.length">
        <h3>Доступы</h3>
        <div
            v-for="share in shares.items"
            :key="share.id"
            class="share-item"
            @click="openViewShareModal(share)"
        >
          <p>Токен: {{ share.token }}</p>
          <p>Истекает: {{ formatDate(share.expires_at) }}</p>
          <p>Права: {{ share.can_manage ? 'Управление' : 'Просмотр' }}</p>
          <button class="tg-button danger" @click.stop="deleteShare(share.id)">
            Удалить
          </button>
        </div>
      </div>

      <ShareLinkModal
          v-if="showShareModal"
          :queue-id="queue.id"
          :share="selectedShare"
          @close="closeShareModal"
          @created="handleShareCreated"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQueueStore } from '@/stores/queueStore'
import { formatDate } from '@/utils/helpers'
import AppHeader from '@/components/AppHeader.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import MembersEditor from '@/components/ui/MembersEditor.vue'
import ShareLinkModal from '@/components/ui/ShareLinkModal.vue'
import QueueActions from '@/components/ui/QueueActions.vue'
import {deleteShareQueue} from "@/api/client.js";

const route = useRoute()
const router = useRouter()
const store = useQueueStore()

const showShareModal = ref(false)
const selectedShare = ref(null)

const queue = ref({ members: [] })

const shares = ref({ items: [] })

const openViewShareModal = (share) => {
  selectedShare.value = share
  showShareModal.value = true
}

onMounted(async () => {
  await store.fetchQueueDetails(route.params.id)
  queue.value = {
    ...store.currentQueue,
    members: [...store.currentQueue.members] // Клонируем массив
  }
  await store.fetchShares(route.params.id)
  shares.value = store.shares
})

const toggleQueueStatus = async () => {
  await store.updateCurrentQueue({ closed: !queue.value.closed })
  queue.value.closed = !queue.value.closed
}

const updateMembers = async (newMembers) => {
  await store.updateCurrentQueue({
    members: newMembers.map(u => u.id) // Отправляем только ID на сервер
  })
  queue.value.members = [...newMembers] // Обновляем локальные данные полными объектами
}

const handleDelete = async () => {
  await store.deleteQueue(route.params.id)
  router.push('/')
}

const deleteShare = async (shareId) => {
  await deleteShareQueue(shareId)
  await store.fetchShares(route.params.id)
  shares.value = store.shares
}

const closeShareModal = () => {
  selectedShare.value = null
  showShareModal.value = false
}

const handleShareCreated = async () => {
  await store.fetchShares(route.params.id)
  shares.value = store.shares
}

</script>

<style scoped>
.queue-detail {
  padding: 1rem;
  min-height: 100vh;
}

.queue-content {
  margin-top: 1rem;
}

.queue-meta {
  margin-bottom: 2rem;
}

.shares-section {
  margin-top: 2rem;
}

.share-item {
  background: rgba(0,0,0,0.05);
  padding: 1rem;
  border-radius: var(--tg-border-radius);
  margin-bottom: 1rem;
}

.tg-button.danger {
  background: #e53935;
}
</style>