<template>
  <div class="share-activation tg-theme-bg">
    <AppHeader title="Активация доступа" back-button />

    <div class="activation-content">
      <template v-if="loading">
        <p>Проверка токена...</p>
      </template>

      <template v-else-if="error">
        <div class="error-message">
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
        <div class="info-message">
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
        <div class="success-message">
          <svg width="48" height="48" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          <h3>Доступ активирован!</h3>
          <p>Теперь вы можете управлять очередью в боте.</p>
          <button class="tg-button" @click="goHome">
            На главную
          </button>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { activateShareQueue } from '@/api/client'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref(null)
const startLink = ref(null)

onMounted(async () => {
  try {
    const token = route.query.token
    if (!token) {
      throw new Error('Токен не предоставлен')
    }

    const response = await activateShareQueue({token})
    startLink.value = response.start_link
  } catch (err) {
    error.value = err.response?.data?.detail || err.message
  } finally {
    loading.value = false
  }
})

const goHome = () => {
  router.push('/')
}
</script>

<style scoped>
.share-activation {
  min-height: 100vh;
  padding: 16px;
}

.activation-content {
  max-width: 400px;
  margin: 0 auto;
  text-align: center;
  padding-top: 32px;
}

.error-message,
.success-message,
.info-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.error-message svg {
  fill: var(--tg-theme-destructive-text-color)
}

.success-message svg {
  fill: #4caf50;
}

.info-message svg {
  fill: #ff9800;
}

.tg-button {
  margin-top: 16px;
  display: inline-block;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  background: var(--tg-theme-button-color);
  color: var(--tg-theme-button-text-color);
}
</style>