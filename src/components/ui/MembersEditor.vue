<template>
  <div class="members-editor">
    <h3>Участники очереди</h3>
    <div v-for="(member, index) in localMembers" :key="index" class="member-item">
      <input
        v-model.number="localMembers[index]"
        type="number"
        placeholder="ID пользователя"
      >
      <button @click="removeMember(index)" class="tg-button danger small">
        ×
      </button>
    </div>
    <button @click="addMember" class="tg-button secondary">
      Добавить участника
    </button>
    <button @click="saveChanges" class="tg-button">
      Сохранить изменения
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  members: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update'])

const localMembers = ref([...props.members])

const addMember = () => {
  localMembers.value.push(0)
}

const removeMember = (index) => {
  localMembers.value.splice(index, 1)
}

const saveChanges = () => {
  emit('update', localMembers.value.filter(id => id !== 0))
}

watch(() => props.members, (newVal) => {
  localMembers.value = [...newVal]
}, { deep: true })
</script>

<style scoped>
.members-editor {
  margin-top: 2rem;
}

.member-item {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.member-item input {
  flex: 1;
  padding: 0.5rem;
  border-radius: var(--tg-border-radius);
  border: 1px solid #ddd;
}

.tg-button.secondary {
  background: #78909c;
}

.tg-button.small {
  padding: 0.5rem;
  width: 2.5rem;
}
</style>