import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/telegram.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)

// Инициализация Telegram WebApp
if (window.Telegram?.WebApp) {
  Telegram.WebApp.ready()
  Telegram.WebApp.expand()
  Telegram.WebApp.enableClosingConfirmation()

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
}

app.mount('#app')