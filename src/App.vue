<template>
  <router-view />
</template>

<script>
import { onMounted } from 'vue'
import { useQueueStore } from './stores/queueStore'
import {Base64UrlSafe} from "@aecworks/base64-url-safe";
import {useRouter} from "vue-router";

export default {
  setup() {
    const store = useQueueStore()
    const router = useRouter()
    onMounted(() => {
      Telegram.WebApp.expand()
      Telegram.WebApp.disableClosingConfirmation()
      Telegram.WebApp.setHeaderColor('#2481cc')
      Telegram.WebApp.setBackgroundColor('#f5f5f5')
      console.log(window.Telegram?.WebApp?.initDataUnsafe?.start_param)
      if (window.Telegram?.WebApp?.initDataUnsafe?.start_param) {
        try {
          // 1. Декодируем Base64UrlSafe → JSON
          console.log(Telegram.WebApp.initDataUnsafe.start_param)
          const decodedPayload = Base64UrlSafe.decode(Telegram.WebApp.initDataUnsafe.start_param);
          console.log(decodedPayload)
          const { action, token } = JSON.parse(decodedPayload);
          console.log(action, token)
          // 2. Если действие "share" — редирект с токеном
          if (action === 'share' && token) {
            router.push({
              path: '/activate',
              query: { token } // -> /activate?token=4oUf8igo
            });
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
  background: var(--tg-theme-bg-color, #f5f5f5);
  color: var(--tg-theme-text-color, #000000);
}

#app {
  max-width: 100%;
  overflow-x: hidden;
}
</style>