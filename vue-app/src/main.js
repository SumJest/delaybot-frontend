import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/telegram.css'
import shimmerDirective from './directives/shimmer'
import './assets/shimmer.css'
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
  Telegram.WebApp.requestFullscreen()

  // // Устанавливаем цвета из Telegram
  // document.documentElement.style.setProperty(
  //   '--tg-theme-bg-color',
  //   Telegram.WebApp.themeParams.background_color
  // )
  // document.documentElement.style.setProperty(
  //   '--tg-theme-text-color',
  //   Telegram.WebApp.themeParams.text_color
  // )
  // console.log(Telegram.WebApp.textColor)
  // document.documentElement.style.setProperty(
  //   '--tg-theme-button-color',
  //   Telegram.WebApp.themeParams.button_color || '#2481cc'
  // )
} else {
  router.push({name: 'ErrorPage', query: {reason: 'uninitialized'}})
}

app.mount('#app')