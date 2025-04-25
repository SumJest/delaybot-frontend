<template>
  <div class="members-editor">
    <h3>Участники очереди</h3>

    <!-- Поисковый инпут -->
    <div class="search-wrapper">
      <input
          v-model="searchQuery"
          @input="onSearchInput"
          type="text"
          placeholder="Поиск по username"
          class="search-input"
      />
      <ul v-if="suggestions.length" class="suggestions-list">
        <li
            v-for="user in suggestions"
            :key="user.id"
            @click="selectUser(user)"
            class="suggestion-item"
        >
          {{ user.first_name }} {{ user.last_name || '' }} (@{{ user.username }})
        </li>
      </ul>
    </div>

    <!-- Список выбранных участников с drag-and-drop -->
    <draggable
        v-model="localMembers"
        handle=".drag-handle"
        item-key="id"
        class="members-list"
        @end="onDragEnd"
    >
      <template #item="{ element }">
        <MemberItem :element="element" @delete="removeMember" class="drag-handle" />
      </template>
    </draggable>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { useQueueStore } from "@/stores/queueStore.js";
import {debounce} from "@/utils/helpers.js"
import MemberItem from "@/components/ui/MemberItem.vue";

const props = defineProps({
  members: {
    type: Array,
    required: true,
    default: () => []
  }
})

const store = useQueueStore()
const emit = defineEmits(['update'])

const localMembers = ref([...props.members])
const searchQuery = ref('')
const suggestions = ref([])

// Добавляем обработчик изменения порядка
const onDragEnd = () => {
  emit('update', localMembers.value)
}

watch(() => props.members, (newVal) => {
  localMembers.value = [...newVal]
}, { deep: true })

// Debounce версия поиска (задержка 1 секунда)
const debouncedSearch = debounce(async (query) => {
  if (query.length >= 4) {
    await store.searchUsers(query)
    suggestions.value = store.userSuggestions
  } else {
    suggestions.value = []
  }
}, 500)

const onSearchInput = () => {
  debouncedSearch(searchQuery.value.trim())
}

const selectUser = (user) => {
  if (!localMembers.value.some(u => u.id === user.id)) {
    localMembers.value = [...localMembers.value, user]
    emit('update', localMembers.value)
  }
  searchQuery.value = ''
  suggestions.value = []
}

const removeMember = (id) => {
  localMembers.value = localMembers.value.filter(m => m.id !== id)
  emit('update', localMembers.value)
}
</script>

<style scoped>
/* Ваши стили остаются без изменений */
.members-editor {
  margin-top: 1rem;
}

.search-wrapper {
  position: relative;
  margin-bottom: 1rem;
}

.search-input {
  width: 100%;
  padding: 0.5rem;
  border-radius: var(--tg-border-radius);
  border: 1px solid #ddd;
}

.suggestions-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--tg-theme-bg-color);
  border: 1px solid #ddd;
  border-top: none;
  max-height: 200px;
  overflow-y: auto;
  z-index: 10;
}

.suggestion-item {
  padding: 0.5rem;
  cursor: pointer;
}

.suggestion-item:hover {
  background: #f0f0f0;
}

.drag-handle {
  cursor: grab;
  user-select: none;
}
</style>