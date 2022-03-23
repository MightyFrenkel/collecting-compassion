import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/draw',
      name: 'draw',
      component: () => import('../views/DrawView.vue')
    },
    {
      path: '/total/:filter?',
      name: 'total',
      component: () => import('../views/TotalView.vue')
    },
    {
      path: '/latest',
      name: 'latest',
      component: () => import('../views/LatestView.vue')
    }
  ]
})

export default router
