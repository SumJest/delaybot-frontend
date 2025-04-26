<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content tg-theme-bg">
      <header class="modal-header">
        <h3>{{ viewing ? 'Просмотр доступа' : 'Поделиться очередью' }}</h3>
        <button class="close-btn" @click="close" aria-label="Закрыть модальное окно">
          ✕
        </button>
      </header>

      <div class="form-group">
          <div class="form-switch">
              <label class="switch">
              <input type="checkbox" v-model="canManage" :disabled="viewing && !isLinkNew">
              <span class="slider"></span>
            </label>
            <span class="switch-label">Разрешить управление</span>
          </div>
      </div>

      <div v-if="createdLink" class="share-link">
        <div class="qr-wrapper" v-if="createdLink">
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
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, watch, onMounted, nextTick} from 'vue'
import { useQueueStore } from '@/stores/queueStore'
import { generateTokenLink } from '@/utils/helpers.js'
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
const createdLink = ref(props.share ? generateTokenLink(props.share.token) : '')
const loading = ref(false)
const qrCode = ref(null)
const qrCodeRef = ref(null)

const initializeQRCode = () => {
  qrCode.value = new QRCodeStyling({
    width: 240,
    height: 240,
    type: 'svg',
    data: createdLink.value,
    image: telegramLogo,
    dotsOptions: {
      color: '#000b10',
      type: 'extra-rounded'
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
      color: '#000b10'
    },
    cornersDotOptions: {
      type: 'dot',
      color: '#000b10'
    }
  })

  if (qrCodeRef.value) {
    qrCodeRef.value.innerHTML = ''
    qrCode.value.append(qrCodeRef.value)
  }
}

watch(createdLink, (newVal) => {
  if (newVal) {
    nextTick(() => {
      if (qrCode.value) {
        qrCode.value.update({ data: newVal })
      } else {
        initializeQRCode()
      }
    })
  }
})

onMounted(() => {
  if (createdLink.value) {
    initializeQRCode()
  }
})

const viewing = computed(() => !!props.share)
const isLinkNew = computed(() => !props.share?.id)

const handleSubmit = async () => {
  await createShare()
}

const createShare = async () => {
  loading.value = true
  try {
    const share = await store.createShare({
      queue_id: props.queueId,
      can_manage: canManage.value
    })
    createdLink.value = generateTokenLink(share.token)
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
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: var(--tg-theme-bg-color);
  border-radius: var(--tg-border-radius);
  width: 400px;
  max-width: 95%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid var(--tg-theme-secondary-bg-color);
}
.modal-header h3 {
  margin: 0;
  font-size: 1.125rem;
  color: var(--tg-theme-text-color);
}
.close-btn {
  background: none;
  border: none;
  font-size: 1.25rem;
  cursor: pointer;
  color: var(--tg-theme-hint-color);
}
.share-link {
  margin: 1rem 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin: 1rem 0;
  width: 100%;
}
.form-switch {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}
.switch {
  position: relative;
  width: 40px;
  height: 20px;
}

.switch input { display: none; }
.switch .slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--tg-theme-secondary-bg-color);
  border-radius: 10px;
  transition: background-color 0.2s;
}
.switch .slider::before {
  content: '';
  position: absolute;
  height: 16px;
  width: 16px;
  left: 2px;
  top: 2px;
  background-color: var(--tg-theme-bg-color);
  border-radius: 50%;
  transition: transform 0.2s;
}
.switch input:checked + .slider {
  background-color: var(--tg-theme-link-color);
}
.switch input:checked + .slider::before {
  transform: translateX(20px);
}

.switch-label {
  font-size: 14px;
  color: var(--tg-theme-text-color);
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
  margin: 1rem 0 1rem 0;
  justify-content: center;
  width: 100%;
}

.copy-icon {
  width: 24px;
  height: 24px;
  fill: currentColor;
}
</style>