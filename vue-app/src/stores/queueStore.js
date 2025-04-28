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

// Вспомогательная функция для задержки
const withMinDelay = async (promise, minDelay = 300) => {
  const [result] = await Promise.all([
    promise,
    new Promise(resolve => setTimeout(resolve, minDelay))
  ]);
  return result;
}

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
        const requestParams = {
          offset: params.offset || 0,
          limit: params.limit || 10,
        };

        if (params.manage) {
          requestParams.manage = true;
        }

        const response = await withMinDelay(listQueues(requestParams));
        this.queues = response;
      } catch (error) {
        this.error = error;
        throw error;
      } finally {
        this.listQueuesLoading = false;
      }
    },
    async deleteQueue(id) {
      this.deleteQueueLoading = true
      try {
        await withMinDelay(deleteQueue(id));
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
        this.currentQueue = await withMinDelay(getQueue(id));
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
        this.currentQueue = await withMinDelay(updateQueue(this.currentQueue.id, data));
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async fetchShares(queueId) {
      this.sharesLoading = true
      try {
        this.shares = await withMinDelay(listShareQueues({ queue_id: queueId }));
      } catch (error) {
        this.error = error
      } finally {
        this.sharesLoading = false
      }
    },

    async createShare(payload) {
      this.loading = true
      try {
        const share = await withMinDelay(createShareQueue(payload));
        this.shares.items.unshift(share)
        return share
      } catch (error) {
        this.error = error
      } finally {
        this.loading = false
      }
    },

    async searchUsers(username, options = { offset: 0, limit: 10 }) {
      this.userLoading = true
      this.userError = null
      try {
        const response = await withMinDelay(listUsers({
          username: username,
          offset: options.offset,
          limit: options.limit
        }));
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