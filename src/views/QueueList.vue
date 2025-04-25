<template>
  <div class="queue-list">
    <AppHeader title="Мои очереди" />
    <QueueCardShimmer v-if="store.listQueuesLoading" />
    <div v-for="queue in queues.items" :key="queue.id" v-else>
      <QueueCard :queue="queue" />
    </div>

    <PaginationControls
      :offset="queues.offset"
      :limit="queues.limit"
      :total="queues.total"
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
import {useQueueStore} from "@/stores/queueStore.js";
import {storeToRefs} from "pinia";
import Shimmer from "@/components/ui/shimmers/Shimmer.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import QueueCardShimmer from "@/components/ui/shimmers/QueueCardShimmer.vue";

export default {
  components: {QueueCardShimmer, StatusBadge, Shimmer, AppHeader, QueueCard, PaginationControls },
  setup() {
    // const queues = ref([])
    // const total = ref(0)
    // const offset = ref(0)
    // const limit = ref(10)

    const store = useQueueStore()
    const {queues} = storeToRefs(store)

    onMounted(() => store.fetchQueues())

    return { fetchQueues: store.fetchQueues,
            queues,
    store}
  }
}
</script>