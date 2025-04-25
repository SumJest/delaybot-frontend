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
        <StatusBadge
            :closed="queue.closed"
            @toggle="toggleQueueStatus"
            v-shimmer="store.queueDetailsLoading"
        />
        <p v-shimmer="store.queueDetailsLoading">Создана: {{ formatDate(queue.created_at) }}</p>
        <p v-shimmer="store.queueDetailsLoading">Кол-во участников: {{ queue.members.length }}</p>
      </div>
      <MembersEditor
        :members="queue.members"
        @update="updateMembers"
      />
      <MemberItemShimmer v-for="i in [0, 1]" v-if="store.queueDetailsLoading"/>

      <div class="shares-section" v-if="shares.items?.length || store.queueDetailsLoading">
        <h3>Доступы</h3>
        <ShareItem
            v-for="share in shares.items"
            :key="share.id"
            :share="share"
            :format-date="formatDate"
            @view-share="openViewShareModal"
            @delete-share="deleteShare"
            v-if="!store.queueDetailsLoading" />
        <ShareItemShimmer v-else />
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
import Shimmer from "@/components/ui/shimmers/Shimmer.vue";
import MemberItemShimmer from "@/components/ui/shimmers/MemberItemShimmer.vue";
import ShareItem from "@/components/ui/ShareItem.vue";
import ShareItemShimmer from "@/components/ui/shimmers/ShareItemShimmer.vue";

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
</style>