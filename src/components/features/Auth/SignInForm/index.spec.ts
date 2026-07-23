import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'

vi.mock('@/services/auth', () => ({
  signInWithGoogle: vi.fn(),
  signInWithEmail: vi.fn(),
  signUpWithEmail: vi.fn(),
  signOutUser: vi.fn(),
  fetchIsSuperAdmin: vi.fn().mockResolvedValue(false),
  onSessionChange: vi.fn()
}))

import { signInWithEmail } from '@/services/auth'
import SignInForm from '@/components/features/Auth/SignInForm/index.vue'
import { makeTestI18n } from '@tests/fixtures/testI18n'
import { makeTestRouter } from '@tests/fixtures/testRouter'

function mountForm () {
  const pinia = createPinia()
  setActivePinia(pinia)
  return mount(SignInForm, {
    global: { plugins: [pinia, makeTestRouter(), makeTestI18n()] }
  })
}

describe('SignInForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('signs in with the typed email and password', async () => {
    vi.mocked(signInWithEmail).mockResolvedValue({} as never)
    const wrapper = mountForm()

    await wrapper.get('[data-testid="signin-email"] input').setValue('a@b.com')
    await wrapper.get('[data-testid="signin-password"] input').setValue('secret1')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(signInWithEmail).toHaveBeenCalledWith('a@b.com', 'secret1')
    expect(wrapper.find('[data-testid="signin-error"]').exists()).toBe(false)
  })

  it('shows an error message when the sign-in fails', async () => {
    vi.mocked(signInWithEmail).mockRejectedValue(new Error('auth/wrong-password'))
    const wrapper = mountForm()

    await wrapper.get('[data-testid="signin-email"] input').setValue('a@b.com')
    await wrapper.get('[data-testid="signin-password"] input').setValue('bad')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(wrapper.get('[data-testid="signin-error"]').text()).toContain('Wrong email or password')
  })
})
