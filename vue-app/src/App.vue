<template>
  <div class="main-container">
    <router-view />
  </div>
</template>

<script>
import { onMounted } from 'vue'
import { useQueueStore } from './stores/queueStore'
import {decode_payload} from './utils/helpers.js'
import {useRouter} from "vue-router";

export default {
  setup() {
    const store = useQueueStore()
    const router = useRouter()
    onMounted(() => {
      if (window.Telegram?.WebApp?.initDataUnsafe?.start_param) {
        try {
          const { action, token } = decode_payload(Telegram.WebApp.initDataUnsafe.start_param);
          // 2. Если действие "share" — редирект с токеном
          if (action === 'share' && token) {
            router.push({
              path: '/activate',
              query: { token } // -> /activate?token=4oUf8igo
            });
          } else if (action === 'queue' && token) {
            router.push({
              name: 'QueueDetail',
              params: {id: token}
            })
          }
        } catch (e) {
          console.error('Ошибка декодирования deeplink:', e);
          // Можно перенаправить на страницу ошибки
          router.push('/error?reason=invalid_token');
        }
      }
    })

    return { store }
  }
}
</script>

<style>
@import './assets/telegram.css';

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--tg-theme-secondary-bg-color, #f5f5f5);
  color: var(--tg-theme-text-color, #000000);
  padding: 0 var(--tg-safe-area-inset-right) var(--tg-safe-area-inset-bottom) var(--tg-safe-area-inset-left);
}

#app {
  max-width: 100%;
}
</style>