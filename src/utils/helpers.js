import {Base64UrlSafe} from "@aecworks/base64-url-safe";

export const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return new Date(dateString).toLocaleDateString('ru-RU', options)
}

export const initTelegramWebApp = () => {
  if (window.Telegram?.WebApp?.initData) {
    Telegram.WebApp.ready()
    Telegram.WebApp.expand()
    Telegram.WebApp.enableClosingConfirmation()
  }
}
export const debounce = (callback, wait) => {
  let timeoutId = null;
  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, wait);
  };
}

export const generateLink = (token) => {
  const payload = JSON.stringify({ action: "share", token })
  const base64Encoded = Base64UrlSafe.encode(payload, true)
  return `https://t.me/queueeebot?startapp=${base64Encoded}`
}