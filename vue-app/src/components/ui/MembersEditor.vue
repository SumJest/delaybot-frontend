<template>
  <div class="members-editor">
    <!-- Кнопка для открытия формы добавления -->
    <button v-if="canManage && !adding" class="add-btn" @click="adding = true">
      + Добавить участника
    </button>

    <!-- Встраиваемая форма добавления -->
    <div v-if="adding" class="add-form">
      <div class="add-form-header">
        <p class="section-hint">Выберите способ добавления:</p>
        <button class="close-btn" @click="resetForm">✕</button>
      </div>
      <div class="mode-switch">
        <button
          :class="['mode-btn', { active: mode === 'username' }]"
          @click="mode = 'username'"
        >По username</button>
        <button
          :class="['mode-btn', { active: mode === 'id' }]"
          @click="mode = 'id'"
        >По ID</button>
      </div>

      <div class="input-wrapper">
        <template v-if="mode === 'username'">
          <div class="search-container">
            <input
              v-model="searchQuery"
              @input="onSearchInput"
              type="text"
              placeholder="Начните вводить username"
              class="search-input"
            />
            <div v-if="store.userLoading" class="loader"></div>
          </div>
          <ul v-if="showSuggestions" class="suggestions-list">
            <li
              v-for="user in filteredSuggestions"
              :key="user.id"
              @click="confirmAdd(user)"
              class="suggestion-item"
            >
              <img :src="getUserAvatar(user.id, user.photo_url)" class="avatar" />
              <div class="user-info">
                <div class="name">{{ user.first_name }} {{ user.last_name || '' }}</div>
                <div class="username">@{{ user.username }}</div>
              </div>
            </li>
            <li v-if="store.userError" class="error-item">
              Ошибка при поиске. Попробуйте позже.
            </li>
            <li v-else-if="!store.userLoading && !filteredSuggestions.length && searchQuery.trim().length" class="no-results">
              Нет результатов.
            </li>
          </ul>
        </template>

        <template v-else>
          <div class="id-input-group">
            <input
              v-model="idQuery"
              placeholder="Введите ID"
              class="search-input"
            />
            <WaveButton
              @click="addById"
              :disabled="!canAddById || store.userLoading"
              :is-loading="fetchUserLoading"
              class="add-id-button"
            >
              Ок
            </WaveButton>
          </div>
        </template>
      </div>
    </div>

    <!-- Список текущих участников -->
    <!--      -->
    <draggable
      v-model="localMembers"
      handle=".drag-handle"
      item-key="id"
      class="members-list no-select"
      delay="300"
      chosen-class="drag-chosen"
      ghost-class="drag-ghost"
      drag-class="drag-dragging"
      delay-on-touch-only="true"
      forceFallback="true"
      v-if="!store.queueDetailsLoading"
      :disabled="!canManage"
      :move="makeHaptic"
      @end="emitUpdate"
      @choose="makeHaptic"
    >
      <template #item="{ element, index }">
        <div>
          <MemberItem
              :element="element"
              :can-manage="canManage"
              @delete="removeMember"
          />
          <hr class="tg-separator" v-if="index < localMembers.length - 1"/>
        </div>

      </template>
    </draggable>
    <MemberItemShimmer v-if="store.queueDetailsLoading"/>
    <!-- Плейсхолдер при пустом списке -->
    <p v-if="!localMembers.length && !store.queueDetailsLoading" class="empty-list">
      Список участников пуст.
    </p>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import draggable from 'vuedraggable'
import { useQueueStore } from '@/stores/queueStore.js'
import { debounce } from '@/utils/helpers.js'
import MemberItem from '@/components/ui/MemberItem.vue'
import MemberItemShimmer from "@/components/ui/shimmers/MemberItemShimmer.vue";
import WaveButton from "./WaveButton.vue";
import {getUserAvatar} from "@/utils/avatarUtils.js";

const props = defineProps({
  members: { type: Array, required: true, default: () => [] },
  canManage: { type: Boolean, default: false }
})
const emit = defineEmits(['update'])
const store = useQueueStore()

const localMembers = ref([...props.members])
const adding = ref(false)
const mode = ref('username')
const searchQuery = ref('')
const idQuery = ref('')
const suggestions = ref([])
const fetchUserLoading = ref(false)

watch(
  () => props.members,
  (newVal) => { localMembers.value = [...newVal] },
  { deep: true }
)

function makeHaptic(evt) {
  Telegram.WebApp.HapticFeedback.impactOccurred('medium')
}

const emitUpdate = () => emit('update', localMembers.value)

const debouncedSearch = debounce(async (q) => {
  if (q.length >= 4) {
    try {
      await store.searchUsers(q)
      suggestions.value = store.userSuggestions
    } catch {}
  } else {
    suggestions.value = []
  }
}, 400)
const onSearchInput = () => debouncedSearch(searchQuery.value.trim())

const showSuggestions = computed(
  () => mode.value === 'username' && searchQuery.value.trim().length > 0
)

const filteredSuggestions = computed(() => {
  const existingIds = new Set(localMembers.value.map(m => m.id))
  return suggestions.value.filter(s => !existingIds.has(s.id))
})

const confirmAdd = (user) => {
  selectUser(user)
  resetForm()
}

const selectUser = (user) => {
  if (!localMembers.value.some(u => u.id === user.id)) {
    localMembers.value.push(user)
    emitUpdate()
  }
}

const removeMember = (id) => {
  localMembers.value = localMembers.value.filter(m => m.id !== id)
  emitUpdate()
}

const canAddById = computed(() =>
  /^\d+$/.test(idQuery.value.trim())
)

const addById = async () => {
  const id = Number(idQuery.value.trim())
  try {
    fetchUserLoading.value = true
    const user = await store.fetchUser(id)
    if (user) selectUser(user)
  } catch {alert("Пользователь не найден")}
  finally {
    fetchUserLoading.value = false

  }
  resetForm()
}

const resetForm = () => {
  adding.value = false
  searchQuery.value = ''
  idQuery.value = ''
  suggestions.value = []
  mode.value = 'username'
}

const sortableOptions = {
  delay: 300,
  touchStartThreshold: 5,
  forceFallback: true,
}

</script>


<style scoped>
.add-btn,
.add-btn-inline {
  background: none;
  border: none;
  color: var(--tg-theme-accent-text-color);
  font-size: 14px;
  cursor: pointer;
  margin: 8px 0;
}

.add-form {
  position: relative;
  padding: 0 12px 12px 12px;
  background: var(--tg-theme-section-bg-color);
  border-radius: var(--tg-border-radius);
  margin-bottom: 16px;
}
.add-form-header {
  display: flex;
  justify-content: space-between;
}
.close-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: var(--tg-theme-accent-text-color)
}

.section-hint {
  font-size: 14px;
  color: var(--tg-theme-hint-color);
  margin-bottom: 8px;
}

.mode-switch {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.mode-btn {
  flex: 1;
  padding: 8px;
  border: 0 solid var(--tg-theme-hint-color);
  background: var(--tg-theme-secondary-bg-color);
  color: var(--tg-theme-secondary-text-color);
  border-radius: var(--tg-border-radius);
  font-size: 14px;
  cursor: pointer;
}

.mode-btn.active {
  background: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
}

.input-wrapper {
  position: relative;
}

.search-container {
  position: relative;
}

.search-input,
.id-input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--tg-theme-hint-color);
  border-radius: var(--tg-border-radius);
  background: var(--tg-theme-input-bg-color);
  color: var(--tg-theme-input-text-color);
  font-size: 14px;
    box-sizing: border-box;
}

.loader {
  position: absolute;
  right: 12px;
  top: 50%;
  width: 16px;
  height: 16px;
  margin-top: -8px;
  border: 2px solid var(--tg-theme-button-color);
  border-top: 2px solid transparent;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.id-input-group {
  display: flex;
  gap: 8px;
  margin-top: 8px;
}

.add-id-button {
  padding: 8px 16px;
  border: none;
  background: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  border-radius: var(--tg-border-radius);
  font-size: 14px;
  cursor: pointer;
}

.add-id-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.suggestions-list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background: var(--tg-theme-secondary-bg-color);
  border: 1px solid var(--tg-theme-hint-color);
  border-radius: 0 0 var(--tg-border-radius) var(--tg-border-radius);
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
  padding-inline-start: 10px
}

.suggestion-item {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  gap: 1rem;
}

.suggestion-item:hover {
  background: var(--tg-theme-hover-color);
}

.error-item,
.no-results {
  padding: 8px;
  text-align: center;
  font-size: 12px;
  color: var(--tg-theme-hint-color);
}

.error-item {
  color: var(--tg-theme-destructive-color);
}

.members-list {
  margin-top: 8px;
}

.empty-list {
  margin-top: 12px;
  font-size: 14px;
  color: var(--tg-theme-hint-color);
  text-align: center;
}
.avatar {
  width: 40px;
  height: 40px;
}
svg.avatar {
  fill: var(--tg-theme-hint-color);
}
.member-row {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: var(--tg-theme-secondary-bg-color);
  transition: background 0.2s, transform 0.2s;
}

.member-row.is-dragging {
  background: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  transform: scale(1.02);
}

.drag-handle {
  cursor: grab;
  user-select: none;
  padding: 4px;
  color: var(--tg-theme-hint-color);
}

.drag-chosen {
  opacity: 0.6;
}

.drag-ghost {
  opacity: 0.4;
}
.no-select {
  -webkit-user-select: none;
  -moz-user-select: none;
  user-select: none;
}

hr.tg-separator {
  border: none;
  border-top: 1px solid var(--tg-theme-section-separator-color, #707579);
  margin-left: 6%;
  margin-right: 6%;
}
</style>
