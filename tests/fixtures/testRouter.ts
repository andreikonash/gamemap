import { createRouter, createMemoryHistory, type Router } from 'vue-router'
import { authGuard } from '@/router/guards/auth'

const stubPage = { template: '<div />' }

function makeTestRouter (routeOverrides: Record<string, object> = {}): Router {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [
      { path: '/', name: 'map', component: stubPage },
      { path: '/game/:id', name: 'game', component: stubPage, ...routeOverrides.game },
      {
        path: '/cabinet',
        name: 'cabinet',
        component: stubPage,
        meta: { requiresAuth: true },
        ...routeOverrides.cabinet
      },
      { path: '/auth', name: 'auth', component: stubPage, ...routeOverrides.auth },
      { path: '/terms', name: 'terms', component: stubPage },
      { path: '/privacy', name: 'privacy', component: stubPage },
      { path: '/safety', name: 'safety', component: stubPage },
      { path: '/support', name: 'support', component: stubPage }
    ]
  })
  router.beforeEach(authGuard)
  return router
}

export { makeTestRouter }
