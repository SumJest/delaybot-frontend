// src/api/client.js

import axios from 'axios';
import router from "@/router/index.js";

// Create an axios instance with base URL from env
const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://queuebot.romaaaka.ru/api/',
});
// Automatically attach Telegram initData header for auth on every request
// Header name defined in OpenAPI spec: "X-Telegram-InitData" citeturn0file0
http.interceptors.request.use(config => {
  const token = window.Telegram?.WebApp?.initData;
  if (token) {
    config.headers['X-Telegram-InitData'] = token;
  }
  return config;
});
http.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      // Нет ответа от сервера (например, сетевые ошибки)
      return Promise.reject(error);
    }

    const { status } = error.response;
    console.log(error.config?.skipGlobalErrorHandler, !error.config?.skipGlobalErrorHandler)
    if (status === 401) {
      // Неавторизованный доступ
      router.push({
        name: "ErrorPage",
        query: { reason: "unauthorized" }
      });
    } else if (status === 404 && !error.config?.skipGlobalErrorHandler) {
      // Ресурс не найден
      router.push({
        name: "ErrorPage",
        query: { reason: "not_found" }
      });
    }

    return Promise.reject(error);
  }
);
/**
 * List queues
 * @param {object} params
 * @param {number} params.offset
 * @param {number} params.limit
 * @returns {Promise<object>} OffsetPagination of QueueSchema
 */
export function listQueues({ offset = 0, limit = 10, manage } = {}) {
  const params = { offset, limit };
  if (manage) {
    params.manage = true;
  }
  return http.get('/queue/', { params }).then(res => res.data);
}


/**
 * Retrieve a queue by ID
 * @param {number} queueId
 * @returns {Promise<object>} QueueSchema
 */
export function getQueue(queueId) {
  return http.get(`/queue/${queueId}/`).then(res => res.data);
}

/**
 * Partially update a queue
 * @param {number} queueId
 * @param {object} data - UpdateQueueSchema
 * @returns {Promise<object>} QueueSchema
 */
export function updateQueue(queueId, data) {
  return http.patch(`/queue/${queueId}/`, data).then(res => res.data);
}

/**
 * Delete a queue
 * @param {number} queueId
 * @returns {Promise<void>}
 */
export function deleteQueue(queueId) {
  return http.delete(`/queue/${queueId}/`).then(res => res.data);
}

/**
 * List shared queues
 * @param {object} params
 * @param {number} params.queue_id
 * @param {number} params.offset
 * @param {number} params.limit
 * @returns {Promise<object>} OffsetPagination of QueueShareSchema
 */
export function listShareQueues({ queue_id, offset = 0, limit = 10 }) {
  return http.get('/queue-share/', { params: { queue_id, offset, limit } }).then(res => res.data);
}

/**
 * Create a shared queue
 * @param {object} payload - CreateQueueShareSchema
 * @returns {Promise<object>} QueueShareSchema
 */
export function createShareQueue(payload) {
  return http.post('/queue-share/', payload).then(res => res.data);
}

/**
 * Retrieve a shared queue by ID
 * @param {number} shareId
 * @returns {Promise<object>} QueueShareSchema
 */
export function getShareQueue(shareId) {
  return http.get(`/queue-share/${shareId}/`).then(res => res.data);
}

/**
 * Delete a shared queue by ID
 * @param {number} shareId
 * @returns {Promise<void>}
 */
export function deleteShareQueue(shareId) {
  return http.delete(`/queue-share/${shareId}/`).then(res => res.data);
}

/**
 * Activate a shared queue with token
 * @param {object} payload - ActivateQueueShareSchema
 * @returns {Promise<object>} QueueShareSchema
 */
export function activateShareQueue(payload) {
  return http.post('/queue-share/activate/', payload, {skipGlobalErrorHandler: true}).then(res => res.data);
}

/**
 * List users with optional filter
 * @param {object} params - { filter_query: JSON.stringify({ username: "john" }), offset?, limit? }
 * @returns {Promise<object>} OffsetPagination of UserSchema
 */
export function listUsers(params = {}) {
  return http.get('/user/', { params }).then(res => res.data)
}

/**
 * Get user by ID
 * @param {number} userId
 * @returns {Promise<object>} UserSchema
 */
export function getUser(userId) {
  return http.get(`/user/${userId}/`, {skipGlobalErrorHandler: true}).then(res => res.data)
}