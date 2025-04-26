// src/stores/queue.js
import { defineStore } from 'pinia'
import {
  listQueues,
  getQueue,
  updateQueue,
  deleteQueue,
  listShareQueues,
  createShareQueue,
  deleteShareQueue,
  listUsers,
  getUser
} from '@/api/client'

export const useQueueStore = defineStore('queue', {
  state: () => ({
    queues: {
      items: [],
      limit: 10,
      offset: 0,
      total: 0
    },
    currentQueue: null,
    shares: {
      items: [],
      limit: 10,
      offset: 0,
      total: 0
    },
    // для работы с поиском пользователей
    userSuggestions: [],
    userLoading: false,
    userError: null,

    loading: false,
    listQueuesLoading: false,
    deleteQueueLoading: false,
    queueDetailsLoading: false,
    sharesLoading: false,
    error: null
  }),
  actions: {
    async fetchQueues(params = {}) {
      this.listQueuesLoading = true
      try {
        const response = await listQueues({
          offset: params.offset || 0,
          limit: params.limit || 10
        })
        console.log(response)
        this.queues = response
      } catch (error) {
        this.error = error
        throw error
      } finally {
        this.listQueuesLoading = false
      }
    },

    async deleteQueue(id) {
      this.deleteQueueLoading = true
      try {
        await deleteQueue(id)
        if (this.queues?.items) {
          this.queues.items = this.queues.items.filter(q => q.id !== id)
          this.queues.total -= 1
        }
        if (this.currentQueue?.id === id) {
          this.currentQueue = null
        }
        return true
      } catch (error) {
        this.error = error
        throw error
      } finally {
        this.deleteQueueLoading = false
      }
    },

    async fetchQueueDetails(id) {
      this.queueDetailsLoading = true
      try {
        this.currentQueue = await getQueue(id)
      } catch (error) {
        this.error = error
      } finally {
        this.queueDetailsLoading = false
      }
    },

    async updateCurrentQueue(data) {
      if (!this.currentQueue) return
      this.loading = true
      try {
        this.currentQueue = await updateQueue(this.currentQueue.id, data)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async fetchShares(queueId) {
      this.sharesLoading = true
      try {
        this.shares = await listShareQueues({ queue_id: queueId })
      } catch (error) {
        this.error = error
      } finally {
        this.sharesLoading = false
      }
    },

    async createShare(payload) {
      this.loading = true
      try {
        const share = await createShareQueue(payload)
        this.shares.items.unshift(share)
        return share
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    // === НОВЫЕ МЕТОДЫ ===

    /**
     * Поиск пользователей по username
     * @param {string} username
     * @param {object} options.limit, options.offset
     */
    async searchUsers(username, options = { offset: 0, limit: 10 }) {
      this.userLoading = true
      this.userError = null
      try {
        const response = await listUsers({
          username: username,
          offset: options.offset,
          limit: options.limit
        })
        // response.items — массив UserSchema
        this.userSuggestions = response.items
        return response.items
      } catch (error) {
        this.userError = error
        this.userSuggestions = []
        throw error
      } finally {
        this.userLoading = false
      }
    },

    /**
     * Загрузка одного пользователя по ID
     * @param {number} id
     * @returns {object} UserSchema
     */
    async fetchUser(id) {
      try {
        return await getUser(id)
      } catch (error) {
        console.error('Error fetching user', error)
        throw error
      }
    }
  }
})
