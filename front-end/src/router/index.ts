import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/item/:id',
    name: 'viewItem',
    component: () => import('@/views/Item.vue'),
    props: route => route.params
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
