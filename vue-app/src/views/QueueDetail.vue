<template>
  <div>
    <div v-longpress="onLongPress" class="no-select">
      <AppHeader :title="queue.name" back-button>
        <QueueActions
          :queue="queue"
          :can-manage="queue.can_manage"
          @delete="handleDelete"
          @share="showShareModal = true"
        />
      </AppHeader>
    </div>
    <div class="queue-detail">
      <div class="queue-content">
        <p class="section-header">Информация</p>
        <div class="queue-meta section">
          <StatusBadge
              :closed="queue.closed"
              :disabled="!queue.can_manage"
              @toggle="toggleQueueStatus"
              v-shimmer="store.queueDetailsLoading"
          />
          <div class="meta-item">
            <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V9h14v11zm0-13H5V6h14v1z" fill="var(--tg-theme-hint-color)"/>
            </svg>
            <span>Создана:</span>
            <strong v-shimmer="store.queueDetailsLoading">{{ store.queueDetailsLoading ? "27 апр. 2025г., 02:20" : formatDate(queue.created_at) }}</strong>
          </div>
          <div class="meta-item">
            <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="var(--tg-theme-hint-color)"/>
            </svg>
            <span>Участников:</span>
            <strong v-shimmer="store.queueDetailsLoading">{{ store.queueDetailsLoading ? 123 : queue.members.length }}</strong>
          </div>
          <div class="meta-item">
            <svg class="icon" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="var(--tg-theme-hint-color)"/>
            </svg>
            <span>Роль:</span>
            <strong v-shimmer="store.queueDetailsLoading">
              {{ store.queueDetailsLoading ? 'Просмотр' : (queue.can_manage ? 'Управление' : 'Просмотр') }}
            </strong>
          </div>
        </div>
        <p class="section-header">Участники</p>
        <MembersEditor
          :members="queue.members"
          :can-manage="queue.can_manage"
          @update="updateMembers"
          class="section"
        />

        <p class="section-header">Доступы</p>
        <ShareItem
            v-for="share in shares.items"
            :key="share.id"
            :share="share"
            :format-date="formatDate"
            @view-share="openViewShareModal"
            @delete-share="deleteShare"
            v-if="!store.sharesLoading || !store.queueDetailsLoading"
            class="section"
        />
        <ShareItemShimmer v-if="store.queueDetailsLoading || (store.sharesLoading && shares.items?.length === 0)" class="section"/>
        <div class="section" v-if="shares.items?.length === 0 && !store.sharesLoading && !store.queueDetailsLoading">
          <p class="empty-list">
            Список приглашений пуст.
            <button class="add-btn-inline" v-if="queue.can_manage" @click="showShareModal = true">
              Поделитесь очередью
            </button>
          </p>

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
    <transition name="fade-scale">
      <div v-if="showRenameSheet" class="popup-overlay" @click.self="cancelRename">
        <div class="popup-card">
          <h4 class="popup-title">Переименовать очередь</h4>
          <input
            v-model="newName"
            @keyup.enter="saveName"
            ref="sheetInput"
            class="popup-input"
            placeholder="Новое название"
          />
          <div class="sheet-actions">
            <button class="btn btn-cancel" @click="cancelRename" :disabled="saving">
              Отмена
            </button>
            <button class="btn btn-save" @click="saveName" :disabled="saving || !newName.trim()">
              {{ saving ? 'Сохраняем…' : 'Сохранить' }}
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQueueStore } from '@/stores/queueStore'
import { formatDate } from '@/utils/helpers'
import AppHeader from '@/components/AppHeader.vue'
import StatusBadge from '@/components/ui/StatusBadge.vue'
import MembersEditor from '@/components/ui/MembersEditor.vue'
import ShareLinkModal from '@/components/ui/ShareLinkModal.vue'
import QueueActions from '@/components/ui/QueueActions.vue'
import {deleteShareQueue} from "@/api/client.js";
import ShareItem from "@/components/ui/ShareItem.vue";
import ShareItemShimmer from "@/components/ui/shimmers/ShareItemShimmer.vue";

const route = useRoute()
const router = useRouter()
const store = useQueueStore()

const queue = ref({ members: [] })
const shares = ref({ items: [] })
const showShareModal = ref(false)
const selectedShare = ref(null)

const showRenameSheet = ref(false)
const newName = ref('')
const saving = ref(false)
const sheetInput = ref(null)

onMounted(async () => {
  await store.fetchQueueDetails(route.params.id)
  queue.value = {
    ...store.currentQueue,
    members: [...store.currentQueue.members]
  }
  await store.fetchShares(route.params.id)
  shares.value = store.shares
})

const onLongPress = () => {
  // 1) Haptic Feedback
  const H = window.Telegram?.WebApp?.HapticFeedback;
  if (H && H.impactOccurred) {
    H.impactOccurred('light');
  }
  // 2) открываем попап
  if (queue.value.can_manage) {
    showRenameSheet.value = true;
  }
};
watch(showRenameSheet, async (val) => {
  if (val) {
    newName.value = queue.value.name
    await nextTick()
    sheetInput.value?.focus()
  }
})

const saveName = async () => {
  const name = newName.value.trim();
  if (!name || name === queue.value.name) {
    return cancelRename();
  }
  saving.value = true;
  try {
    await store.updateCurrentQueue({ name });
    queue.value.name = name;
  } finally {
    saving.value = false;
    showRenameSheet.value = false;
  }
};

const cancelRename = () => {
  showRenameSheet.value = false
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

const toggleQueueStatus = async (callback) => {
  await store.updateCurrentQueue({ closed: !queue.value.closed })
  queue.value.closed = !queue.value.closed
  callback()
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

const openViewShareModal = (share) => {
  selectedShare.value = share
  showShareModal.value = true
}

</script>

<style scoped>
.header-wrapper {
  /* чтобы захватить весь AppHeader */
}
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.popup-card {
  background: var(--tg-theme-secondary-bg-color);
  color: var(--tg-theme-text-color);
  border-radius: var(--tg-border-radius);
  padding: 1.5rem;
  width: 90%;
  max-width: 350px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.2);
  transform-origin: center center;
}

.popup-title {
  margin: 0 0 0.75rem;
  font-size: 1.1rem;
  color: var(--tg-theme-secondary-text-color);
}

.popup-input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid var(--tg-theme-hint-color);
  border-radius: 6px;
  background: var(--tg-theme-input-bg-color, #fff);
  color: var(--tg-theme-input-text-color, #000);
  outline: none;
}

.sheet-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--tg-border-radius);
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-cancel {
  background: var(--tg-theme-button-secondary-bg-color, #f0f0f0);
  color: var(--tg-theme-button-secondary-text-color, #555);
}

.btn-save {
  background: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color, #fff);
}

/* Анимация */
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.2s ease;
}
.fade-scale-enter-from,
.fade-scale-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
.section-header{
  color: var(--tg-theme-subtitle-text-color);
  font-weight: lighter;
}
.queue-detail {
  min-height: 100vh;
  padding: 0 16px 0 16px;
}

.queue-content {
  margin-top: 1rem;
}

.queue-meta {
  margin-bottom: 2rem;
}
.empty-list {
  margin-top: 12px;
  font-size: 14px;
  color: var(--tg-theme-hint-color);
  text-align: center;
}
.shares-section {
  margin-top: 2rem;
}
.section {
  background-color: var(--tg-theme-section-bg-color);
  padding: 1rem;
  border-radius: var(--tg-border-radius);
}
.status-badge {
  transition: transform 0.1s ease, background-color 0.2s ease;
  will-change: transform;
}
.status-badge:active {
  transform: scale(0.95);
  background-color: var(--tg-theme-hover-color);
}
.meta-item {
  display: flex;
  margin-top: 10px;
  gap: 4px;
  color: var(--tg-theme-hint-color, #000);
  font-size: 14px;
}

.meta-item strong {
  margin-left: 2px;
  color: var(--tg-theme-accent-text-color, #3498db);
}

.meta-item .icon {
  width: 18px;
  height: 18px;
}
.add-btn-inline {
  background: none;
  border: none;
  color: var(--tg-theme-accent-text-color, #3498db);
  font-size: 14px;
  cursor: pointer;
  margin: 8px 0;
}
</style>