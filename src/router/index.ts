import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import StatsView from '../views/StatsView.vue'
import RevenueView from '@/views/RevenueView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/user/:user',
      name: 'userStat',
      component: StatsView
    },
    {
      path: '/org/:org',
      name: 'orgStat',
      component: StatsView
    },
    {
      path: '/revenue',
      name: 'revenueStats',
      component: RevenueView
    }
  ]
})

export default router
