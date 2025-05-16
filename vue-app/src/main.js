import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/telegram.css'
import shimmerDirective from './directives/shimmer'
import longpress from "@/directives/longpress.js";
import './assets/shimmer.css'
import { isMobilePlatform } from './utils/helpers.js'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.directive('shimmer', shimmerDirective)
app.directive('longpress', longpress)
// Инициализация Telegram WebApp
if (window.Telegram?.WebApp?.initData) {
  Telegram.WebApp.ready()
  Telegram.WebApp.expand()
  Telegram.WebApp.disableClosingConfirmation()
  Telegram.WebApp.disableVerticalSwipes()
  if(isMobilePlatform()) {Telegram.WebApp.requestFullscreen()}
} else {
  window.location.href = '/landing.html'
}

app.mount('#app')