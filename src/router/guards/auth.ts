import type { NavigationGuardWithThis } from 'vue-router'
import { auth } from '@/store/auth'

export const authGuard: NavigationGuardWithThis<undefined> = (to) => {
  if (!to.meta.requiresAuth) return true
  const authStore = auth()
  if (authStore.isLoggedIn) return true
  authStore.setRedirect(to.fullPath)
  return { name: 'auth' }
}
