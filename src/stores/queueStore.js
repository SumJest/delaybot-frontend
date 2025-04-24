import { defineStore } from 'pinia'
import {
  listQueues,
  getQueue,
  updateQueue,
  deleteQueue,
  listShareQueues,
  createShareQueue,
  deleteShareQueue
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
    loading: false,
    error: null
  }),
  actions: {
    async fetchQueues(params = {}) {
      this.loading = true
      try {
        const response = await listQueues({
          offset: params.offset || 0,
          limit: params.limit || 10
        })
        this.queues = response
      } catch (error) {
        this.error = error
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteQueue(id) {
      this.loading = true
      try {
        await deleteQueue(id)

        // Безопасное удаление из списка
        if (this.queues?.items) {
          this.queues.items = this.queues.items.filter(q => q.id !== id)
          this.queues.total -= 1
        }

        // Сброс текущей очереди если это она
        if (this.currentQueue?.id === id) {
          this.currentQueue = null
        }

        return true
      } catch (error) {
        this.error = error
        throw error
      } finally {
        this.loading = false
      }
    },
    async fetchQueueDetails(id) {
      this.loading = true
      try {
        this.currentQueue = await getQueue(id)
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
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
      this.loading = true
      try {
        this.shares = await listShareQueues({ queue_id: queueId })
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
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
    }
  }
})