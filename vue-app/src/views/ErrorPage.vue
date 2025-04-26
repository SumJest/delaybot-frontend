<template>
  <div class="error-page">
    <div class="error-content">
      <!-- Иконка ошибки -->
      <div class="error-icon">
        <svg fill="var(--tg-theme-destructive-text-color)" width="40" height="40" viewBox="0 0 36 36" version="1.1"  preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
          <title>error-solid</title>
          <path class="clr-i-solid clr-i-solid-path-1" d="M18,6A12,12,0,1,0,30,18,12,12,0,0,0,18,6Zm-1.49,6a1.49,1.49,0,0,1,3,0v6.89a1.49,1.49,0,1,1-3,0ZM18,25.5a1.72,1.72,0,1,1,1.72-1.72A1.72,1.72,0,0,1,18,25.5Z"></path>
          <rect x="0" y="0" width="36" height="36" fill-opacity="0"/>
        </svg>
      </div>
      <h1 class="error-title">{{ errorTitle }}</h1>
      <p class="error-description">{{ errorDescription }}</p>

      <div v-if="errorDetails" class="error-details">
        <p><strong>Детали:</strong> {{ errorDetails }}</p>
      </div>

<!--      <button @click="handleRetry" class="button retry-button">Попробовать снова</button>-->
      <button @click="goHome" class="button home-button">На главную</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const errorTitle = ref('Ошибка')
const errorDescription = ref('Что-то пошло не так')
const errorDetails = ref(null)

const errorReasons = {
  invalid_token: 'Неверный токен активации',
  decode_failed: 'Ошибка обработки ссылки',
  uninitialized: 'Ошибка инициализации',
  unauthorized: 'Ошибка авторизации',
  not_found: 'Ресурс не найден',
  default: 'Произошла ошибка'
}

function getErrorDescription(reason) {
  const descriptions = {
    invalid_token: 'Токен активации недействителен или срок его действия истёк.',
    decode_failed: 'Не удалось обработать ссылку. Пожалуйста, проверьте её правильность.',
    uninitialized: 'Telegram приложение не вернуло данные, попробуйте ещё раз.',
    unauthorized: 'Не удалось авторизовать запрос, попробуйте ещё раз.',
    not_found: 'Ресурс не найден или вы не имеете к нему доступ.',
    default: 'Пожалуйста, попробуйте ещё раз или обратитесь в поддержку.'
  }
  return descriptions[reason] || descriptions.default
}

onMounted(() => {
  const reason = route.query.reason
  const details = route.query.details

  errorTitle.value = errorReasons[reason] || errorReasons.default
  errorDescription.value = getErrorDescription(reason)
  errorDetails.value = details || null
})

function handleRetry() {
  if (window.Telegram?.WebApp?.close) {
    Telegram.WebApp.close()
  } else {
    router.go(-1)
  }
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.error-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background-color: var(--tg-theme-secondary-bg-color, #f5f5f5);
}

.error-content {
  width: 100%;
  max-width: 480px;
  padding: 1.5rem;
  background-color: var(--tg-theme-bg-color, #ffffff);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.error-icon {
  margin-bottom: 1rem;
}

.error-title {
  color: var(--tg-theme-destructive-text-color, #f44336);
  font-size: 1.5rem;
  margin-bottom: 0.75rem;
}

.error-description {
  color: var(--tg-theme-subtitle-text-color, #000000);
  margin-bottom: 1rem;
}

.error-details {
  background-color: var(--tg-theme-bg-color, #f8f9fa);
  color: var(--tg-theme-subtitle-color, #6c757d);
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
  text-align: left;
}

.button {
  display: inline-block;
  min-width: 120px;
  padding: 0.5rem 1rem;
  margin: 0.5rem;
  border: none;
  border-radius: var(--tg-border-radius );
  background-color: var(--tg-theme-button-color, #3498db);
  color: var(--tg-theme-button-text-color, #ffffff);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
}

.home-button {
  background-color: var(--tg-theme-button-color, #2ecc71);
}
</style>
