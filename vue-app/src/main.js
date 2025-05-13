import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/telegram.css'
import shimmerDirective from './directives/shimmer'
import './assets/shimmer.css'
import { isMobilePlatform } from './utils/helpers.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('shimmer', shimmerDirective)
// Инициализация Telegram WebApp
if (window.Telegram?.WebApp?.initData) {
  Telegram.WebApp.ready()
  Telegram.WebApp.expand()
  Telegram.WebApp.disableClosingConfirmation()
  Telegram.WebApp.disableVerticalSwipes()
  if(isMobilePlatform()) {Telegram.WebApp.requestFullscreen()}
} else {
  router.push({name: 'ErrorPage', query: {reason: 'uninitialized'}})
}

app.mount('#app')