<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content tg-theme-bg">
      <h3>Поделиться очередью</h3>

      <div class="form-group">
        <label>
          <input type="checkbox" v-model="canManage">
          Разрешить управление
        </label>
      </div>

      <div v-if="createdLink" class="share-link">
        <p>Ссылка для доступа:</p>
        <input :value="createdLink" readonly>
        <button class="tg-button" @click="copyLink">
          Копировать
        </button>
      </div>

      <div class="modal-actions">
        <button class="tg-button" @click="createShare" :disabled="loading">
          {{ createdLink ? 'Создать еще' : 'Создать' }}
        </button>
        <button class="tg-button secondary" @click="close">
          Закрыть
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useQueueStore } from '@/stores/queueStore'
import {Base64UrlSafe} from "@aecworks/base64-url-safe";

const props = defineProps({
  queueId: {
    type: Number,
    required: true
  }
})

const emit = defineEmits(['close', 'created'])

const store = useQueueStore()
const canManage = ref(false)
const createdLink = ref('')
const loading = ref(false)

const createShare = async () => {
  loading.value = true
  try {
    const share = await store.createShare({
      queue_id: props.queueId,
      can_manage: canManage.value
    })
    const payload = JSON.stringify({
      action: "share",
      token: share.token,
    });

    const base64Encoded = Base64UrlSafe.encode(payload, true)


    createdLink.value = `https://t.me/queueeebot/webapp?startapp=${base64Encoded}`
    emit('created', share)
  } finally {
    loading.value = false
  }
}

const copyLink = () => {
  navigator.clipboard.writeText(createdLink.value)
  Telegram.WebApp.showAlert('Ссылка скопирована в буфер обмена')
}

const close = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  padding: 2rem;
  border-radius: var(--tg-border-radius);
  max-width: 90%;
  width: 400px;
}

.form-group {
  margin: 1rem 0;
}

.share-link {
  margin: 1rem 0;
}

.share-link input {
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border-radius: var(--tg-border-radius);
  border: 1px solid #ddd;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
</style>