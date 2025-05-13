import {Base64UrlSafe} from "@aecworks/base64-url-safe";

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const absDiffMs = Math.abs(diffMs);
  const diffSec = Math.floor(absDiffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHrs = Math.floor(diffMin / 3600);

  // Именительный падеж для прошедших
  const weekdaysNom = [
    'воскресенье',
    'понедельник',
    'вторник',
    'среда',
    'четверг',
    'пятница',
    'суббота'
  ];
  // Винительный падеж для будущих с предлогом «в»
  const weekdaysAcc = [
    'в воскресенье',
    'в понедельник',
    'во вторник',
    'в среду',
    'в четверг',
    'в пятницу',
    'в субботу'
  ];

  const dayIdx = date.getDay();
  const dayNom = weekdaysNom[dayIdx];
  const dayAcc = weekdaysAcc[dayIdx];
  const timePart = `${pad(date.getHours())}:${pad(date.getMinutes())}`;

  // Будущее
  if (diffMs < 0) {
    if (diffMin < 60) {
      return `через ${diffMin} мин`;
    }
    if (isSameDay(date, now)) {
      return `сегодня в ${timePart}`;
    }
    if (isSameDay(date, offsetDay(now, 1))) {
      return `завтра в ${timePart}`;
    }
    if (diffHrs < 24 * 7) {
      // используем винительный падеж с предлогом
      return `${dayAcc}, ${timePart}`;
    }
  }

  // Прошедшее
  if (diffMin < 60) {
    if (diffMin < 1) return `только что`
    return `${diffMin} мин назад`;
  }
  if (isSameDay(date, now)) {
    return `сегодня в ${timePart}`;
  }
  if (isSameDay(date, offsetDay(now, -1))) {
    return `вчера в ${timePart}`;
  }
  if (diffHrs < 24 * 7) {
    // именительный, без «в»
    return `${dayNom}, ${timePart}`;
  }

  // Абсолютная дата
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  const datePart = date.toLocaleDateString('ru-RU', options);
  return `${datePart} в ${timePart}`;
};

function pad(num) {
  return num.toString().padStart(2, '0');
}

function isSameDay(a, b) {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

function offsetDay(date, offset) {
  const d = new Date(date);
  d.setDate(d.getDate() + offset);
  return d;
}



/**
 * Возвращает true, если Web App запущен в мобильном приложении (Android или iOS).
 */
export function isMobilePlatform() {
  const p = Telegram.WebApp.platform;
  console.log(p, p === "android" || p === "ios")
  return p === "android" || p === "ios";
}

/**
 * Возвращает true, если Web App запущен в десктопном клиенте (Desktop или Web).
 */
export function isDesktopPlatform() {
  // явное указание для десктопа
  const p = Telegram.WebApp.platform;
  return p === "tdesktop" || p === "web";
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
  let str = encodedStr.replace(/-/g, '+').replace(/_/g, '/');
  while (str.length % 4 !== 0) {
    str += '=';
  }
  const decoded = atob(str);
  const [action, token] = decoded.split(':');
  return { action, token };
}

export const generateTokenLink = (token) => {
  const encoded = encode_payload('share', token)
  return `https://t.me/queueeebot?startapp=${encoded}`
}
