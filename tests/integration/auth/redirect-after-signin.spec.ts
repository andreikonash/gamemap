import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import type { ISessionUser } from '@/types/auth'

const sessionCallbacks: Array<(user: ISessionUser | null) => void> = []

vi.mock('@/services/auth', () => ({
  signInWithGoogle: vi.fn(),
  signInWithEmail: vi.fn(async () => {
    sessionCallbacks.forEach((callback) => callback({ uid: 'u1', email: null, displayName: null }))
  }),
  signUpWithEmail: vi.fn(),
  signOutUser: vi.fn(),
  fetchIsSuperAdmin: vi.fn().mockResolvedValue(false),
  onSessionChange: vi.fn((callback: (user: ISessionUser | null) => void) => {
    sessionCallbacks.push(callback)
  })
}))

import SignInForm from '@/components/features/Auth/SignInForm/index.vue'
import { auth } from '@/store/auth'
import { makeTestI18n } from '@tests/fixtures/testI18n'
import { makeTestRouter } from '@tests/fixtures/testRouter'

describe('integration: guarded page redirects to sign-in and back', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    sessionCallbacks.length = 0
    vi.clearAllMocks()
  })

  it('sends a guest from the cabinet to sign-in, then returns after sign-in', async () => {
    const pinia = createPinia()
    setActivePinia(pinia)
    const router = makeTestRouter()
    const authStore = auth()
    authStore.listenToSession()

    await router.push('/cabinet')
    expect(router.currentRoute.value.name).toBe('auth')

    const wrapper = mount(SignInForm, {
      global: { plugins: [pinia, router, makeTestI18n()] }
    })
    await wrapper.get('[data-testid="signin-email"] input').setValue('a@b.com')
    await wrapper.get('[data-testid="signin-password"] input').setValue('secret1')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(authStore.isLoggedIn).toBe(true)
    expect(router.currentRoute.value.path).toBe('/cabinet')
  })
})
