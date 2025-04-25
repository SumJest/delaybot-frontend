<template>
  <div class="queue-list">
    <AppHeader title="Мои очереди" />

    <div v-for="queue in queues" :key="queue.id">
      <QueueCard :queue="queue" />
    </div>

    <PaginationControls
      :offset="offset"
      :limit="limit"
      :total="total"
      @update="fetchQueues"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import QueueCard from '@/components/ui/QueueCard.vue'
import PaginationControls from '@/components/ui/PaginationControls.vue'
import {listQueues} from "@/api/client.js";
import AppHeader from "@/components/AppHeader.vue";

export default {
  components: {AppHeader, QueueCard, PaginationControls },
  setup() {
    const queues = ref([])
    const total = ref(0)
    const offset = ref(0)
    const limit = ref(10)

    const fetchQueues = async (newOffset = 0) => {
      try {
        const data = await listQueues({limit: limit.value, offset: newOffset})
        queues.value = data.items
        total.value = data.total
        offset.value = newOffset
      } catch (error) {
        console.error('Ошибка загрузки очередей:', error)
      }
    }

    onMounted(fetchQueues)

    return { queues, total, offset, limit, fetchQueues }
  }
}
</script>