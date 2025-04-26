import { createRouter, createWebHistory } from 'vue-router'
import QueueList from '../views/QueueList.vue'
import QueueDetail from '../views/QueueDetail.vue'
import ErrorPage from "@/views/ErrorPage.vue";

const routes = [
  {
    path: '/',
    name: 'QueueList',
    component: QueueList
  },
  {
    path: '/queue/:id',
    name: 'QueueDetail',
    component: QueueDetail,
    props: true
  },
  {
    path: '/activate',
    name: 'ShareActivation',
    component: () => import('../views/ShareActivation.vue')
  },
  {
    path: '/error',
    name: 'ErrorPage',
    component: ErrorPage,
    props: (route) => ({
      errorReason: route.query.reason,
      errorDetails: route.query.details
    })
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router