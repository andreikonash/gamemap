import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from '@/router/guards/auth'

const routes = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@/pages/landing/index.vue'),
    meta: { hideChrome: true }
  },
  {
    path: '/discover',
    name: 'map',
    component: () => import('@/pages/index.vue')
  },
  {
    path: '/game/:id',
    name: 'game',
    component: () => import('@/pages/game/index.vue')
  },
  {
    path: '/cabinet',
    name: 'cabinet',
    component: () => import('@/pages/cabinet/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/auth',
    name: 'auth',
    component: () => import('@/pages/auth/index.vue')
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/pages/settings/index.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/communities',
    name: 'communities',
    component: () => import('@/pages/communities/index.vue')
  },
  {
    path: '/create-game',
    name: 'create-game',
    component: () => import('@/pages/create-game/index.vue'),
    meta: { requiresAuth: true, hideChrome: true }
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/pages/terms/index.vue')
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/pages/privacy/index.vue')
  },
  {
    path: '/safety',
    name: 'safety',
    component: () => import('@/pages/safety/index.vue')
  },
  {
    path: '/support',
    name: 'support',
    component: () => import('@/pages/support/index.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/pages/not-found/index.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(authGuard)

export { router, routes }
