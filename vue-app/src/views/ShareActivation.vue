<template>
  <div class="activation-page">
    <AppHeader title="Активация доступа" back-button />

    <div class="activation-content">
      <template v-if="loading">
        <p>Проверка токена...</p>
      </template>

      <template v-else-if="error">
        <div class="activation-message error-message">
          <svg width="48" height="48" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <h3>Ошибка активации</h3>
          <p>{{ error }}</p>
          <button class="tg-button" @click="goHome">
            На главную
          </button>
        </div>
      </template>

      <template v-else-if="startLink">
        <div class="activation-message info-message">
          <svg width="48" height="48" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 13l-1.41 1.41L11 11.83V7h2v3.17l4.59 4.59z"/>
          </svg>
          <h3>Нужно запустить бота</h3>
          <p>Для завершения активации доступа нажмите на кнопку ниже:</p>
          <a :href="startLink" class="tg-button">
            Открыть чат с ботом
          </a>
        </div>
      </template>

      <template v-else>
        <div class="activation-message success-message">
          <svg width="48" height="48" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <h3>Доступ активирован!</h3>
          <p>Теперь вы можете управлять очередью в боте.</p>
          <button class="tg-button" @click="goToQueue">
            Перейти к очереди
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {activateShareQueue} from '@/api/client'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref(null)
const startLink = ref(null)
const queueId = ref(null)

onMounted(async () => {
  try {
    const token = route.query.code || route.query.token
    if (!token) throw new Error('Токен не предоставлен')
    const response = await activateShareQueue({token})
    startLink.value = response.start_link
    queueId.value = response.queue_id
  } catch (err) {
    error.value = err.response?.data?.detail || err.message
  } finally {
    loading.value = false
  }
})

const goHome = () => router.push('/')
const goToQueue = () => {
  if (queueId.value) {
    router.push({name: 'QueueDetail', params: {id: queueId.value}})
  } else {
    goHome()
  }
}
</script>

<style scoped>
.activation-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 16px;
  background-color: var(--tg-theme-secondary-bg-color, #f5f5f5);
}

.activation-content {
  width: 100%;
  max-width: 480px;
  padding: 1.5rem;
  background-color: var(--tg-theme-bg-color, #ffffff);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.activation-message svg {
  /* цвета задаются в каждой секции */
}

.error-message svg {
  fill: var(--tg-theme-destructive-text-color);
}

.success-message svg {
  fill: #4caf50;
}

.info-message svg {
  fill: #ff9800;
}

.activation-message h3 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--tg-theme-text-color);
}

.activation-message p {
  margin: 0;
  color: var(--tg-theme-subtitle-text-color);
}

.tg-button {
  margin-top: 16px;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
  cursor: pointer;
  text-decoration: none;
  font-weight: 500;
}
</style>
