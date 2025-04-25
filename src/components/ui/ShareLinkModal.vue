<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content tg-theme-bg">
      <h3>{{ viewing ? 'Просмотр доступа' : 'Поделиться очередью' }}</h3>

      <div class="form-group">
        <label>
          <input type="checkbox" v-model="canManage" :disabled="viewing && !isLinkNew">
          Разрешить управление
        </label>
      </div>

      <div v-if="createdLink" class="share-link">
        <div class="qr-wrapper">
          <div ref="qrCodeRef"></div>
        </div>

        <div class="link-input-container">
          <input :value="createdLink" readonly class="tg-input">
          <button class="icon-button" @click="copyLink" title="Копировать">
            <svg class="copy-icon" viewBox="0 0 24 24">
              <path d="M19 21H8V7h11m0-2H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2m-3-4H4a2 2 0 0 0-2 2v14h2V3h12V1z"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="modal-actions">
        <button v-if="!viewing" class="tg-button" @click="handleSubmit" :disabled="loading">
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
import {ref, computed, watch, onMounted} from 'vue'
import { useQueueStore } from '@/stores/queueStore'
import { generateLink } from '@/utils/helpers.js'
import telegramLogo from '@/assets/telegram-logo.svg'
import QRCodeStyling from "qr-code-styling";

const props = defineProps({
  queueId: {
    type: Number,
    required: true
  },
  share: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'created', 'updated'])

const store = useQueueStore()
const canManage = ref(props.share?.can_manage || false)
const createdLink = ref(props.share ? generateLink(props.share.token) : '')
const loading = ref(false)
const qrCodeRef = ref(null)
onMounted(() => {
  const qrCode = new QRCodeStyling({
    width: 240,
    height: 240,
    type: 'svg',
    data: createdLink.value,
    image: telegramLogo,
    dotsOptions: {
      color: '#0088cc',
      type: 'rounded'
    },
    backgroundOptions: {
      color: '#f9f9f9'
    },
    imageOptions: {
      crossOrigin: 'anonymous',
      margin: 8,
      imageSize: 0.3
    },
    cornersSquareOptions: {
      type: 'extra-rounded',
      color: '#0088cc'
    },
    cornersDotOptions: {
      type: 'dot',
      color: '#0088cc'
    }
  })

  qrCode.append(qrCodeRef.value)
})

const viewing = computed(() => !!props.share)
const isLinkNew = computed(() => !props.share?.id)

const handleSubmit = async () => {
    await createShare()
}
watch(() => createdLink, (newVal) => {
  localMembers.value = [...newVal]
}, { deep: true })


const createShare = async () => {
  loading.value = true
  try {
    const share = await store.createShare({
      queue_id: props.queueId,
      can_manage: canManage.value
    })
    createdLink.value = generateLink(share.token)
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
  background: rgba(0, 0, 0, 0.5);
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
  /* Добавлено для центрирования содержимого */
  display: flex;
  flex-direction: column;
  align-items: center;
}

h3 {
  text-align: center;
  width: 100%;
}

.form-group {
  margin: 1rem 0;
  width: 100%;
  text-align: center;
}

.share-link {
  margin: 1rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.qr-wrapper {
  display: flex;
  width: 255px;
  height: 255px;
  justify-content: center;
  align-items: center;
  background: #f9f9f9;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.link-input-container {
  position: relative;
  display: flex;
  gap: 8px;
  width: 100%;
  max-width: 300px;
  margin-top: 1rem;
}

.tg-input {
  width: 100%;
  padding: 0.75rem;
  border-radius: var(--tg-border-radius);
  border: 1px solid var(--tg-theme-secondary-bg-color);
  background: var(--tg-theme-secondary-bg-color);
  color: var(--tg-theme-text-color);
  padding-right: 40px;
}

.icon-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 8px;
  cursor: pointer;
  color: var(--tg-theme-text-color);
}

.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  justify-content: center;
  width: 100%;
}

.copy-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}
</style>