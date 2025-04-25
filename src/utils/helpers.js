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

export function encode_payload(action, token) {
  return btoa(`${action}:${token}`)
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decode_payload(encodedStr) {
  const str = encodedStr.replace(/-/g, '+').replace(/_/g, '/');
  const decoded = atob(str + '=='.slice(0, str.length % 3));
  const [action, token] = decoded.split(':');
  return { action, token };
}

export const generateTokenLink = (token) => {
  const encoded = encode_payload('share', token)
  return `https://t.me/queueeebot?startapp=${encoded}`
}
