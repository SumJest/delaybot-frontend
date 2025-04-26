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
import AppHeader from "@/components/AppHeader.vue";
import {useQueueStore} from "@/stores/queueStore.js";
import {storeToRefs} from "pinia";
import Shimmer from "@/components/ui/shimmers/Shimmer.vue";
import StatusBadge from "@/components/ui/StatusBadge.vue";
import QueueCardShimmer from "@/components/ui/shimmers/QueueCardShimmer.vue";

export default {
  components: {QueueCardShimmer, StatusBadge, Shimmer, AppHeader, QueueCard, PaginationControls },
  setup() {
    const store = useQueueStore()
    const {queues} = storeToRefs(store)

    onMounted(() => store.fetchQueues())

    return { fetchQueues: store.fetchQueues,
            queues,
    store}
  }
}
</script>

<style>
.queue-card {
  transition: transform 0.1s ease, background-color 0.2s ease;
  will-change: transform;
}
.queue-card:active {
  transform: scale(0.95);
  background-color: var(--tg-theme-hover-color);
}
</style>