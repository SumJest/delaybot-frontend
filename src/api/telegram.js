export function initTelegram() {
  if (!window.Telegram || !window.Telegram.WebApp) {
    console.warn('Telegram WebApp API is not available')
    return null
  }
  const tg = window.Telegram.WebApp
  tg.expand()            // пример: разворачиваем WebApp по высоте
  tg.ready()             // сигнал о том, что WebApp инициализирован
  return tg
}

export function sendData(payload) {
  const tg = window.Telegram.WebApp
  tg.sendData(JSON.stringify(payload))
}
