<template>
  <div class="error-page">
    <div class="error-content">
      <h1>{{ errorTitle }}</h1>
      <p>{{ errorDescription }}</p>

      <div v-if="errorDetails" class="error-details">
        <p><strong>Детали:</strong> {{ errorDetails }}</p>
      </div>

      <button @click="handleRetry" class="retry-button">Попробовать снова</button>
      <button @click="goHome" class="home-button">На главную</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const errorReasons = {
  invalid_token: 'Неверный токен активации',
  decode_failed: 'Ошибка обработки ссылки',
  default: 'Произошла ошибка'
}

const errorTitle = ref('Ошибка')
const errorDescription = ref('Что-то пошло не так')
const errorDetails = ref(null)

onMounted(() => {
  // Получаем причину ошибки из URL
  const reason = route.query.reason
  const details = route.query.details

  // Устанавливаем соответствующий текст ошибки
  errorTitle.value = errorReasons[reason] || errorReasons.default
  errorDescription.value = getErrorDescription(reason)
  errorDetails.value = details || null
})

function getErrorDescription(reason) {
  const descriptions = {
    invalid_token: 'Токен активации недействителен или срок его действия истёк.',
    decode_failed: 'Не удалось обработать ссылку. Пожалуйста, проверьте её правильность.',
    default: 'Пожалуйста, попробуйте ещё раз или обратитесь в поддержку.'
  }
  return descriptions[reason] || descriptions.default
}

function handleRetry() {
  if (window.Telegram?.WebApp?.close) {
    Telegram.WebApp.close()
  } else {
    router.go(-1) // Возврат на предыдущую страницу
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
  padding: 20px;
  background-color: #f5f5f5;
}

.error-content {
  max-width: 500px;
  padding: 30px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

h1 {
  color: #e74c3c;
  margin-bottom: 20px;
}

.error-details {
  margin: 20px 0;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
  font-size: 14px;
}

button {
  margin: 10px;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.retry-button {
  background-color: #3498db;
  color: white;
}

.home-button {
  background-color: #2ecc71;
  color: white;
}
</style>