import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import type { ISessionUser } from '@/types/auth'

vi.mock('@/services/bookings', () => ({
  createRegistration: vi.fn(),
  fetchMyRegistrations: vi.fn(),
  markRegistrationPaid: vi.fn(),
  cancelRegistration: vi.fn()
}))

const sessionCallbacks: Array<(user: ISessionUser | null) => void> = []

vi.mock('@/services/auth', () => ({
  signInWithGoogle: vi.fn(),
  signInWithEmail: vi.fn(),
  signUpWithEmail: vi.fn(),
  signOutUser: vi.fn(),
  fetchIsSuperAdmin: vi.fn().mockResolvedValue(false),
  onSessionChange: vi.fn((callback: (user: ISessionUser | null) => void) => {
    sessionCallbacks.push(callback)
  })
}))

import { fetchMyRegistrations } from '@/services/bookings'
import CabinetPage from '@/pages/cabinet/index.vue'
import { auth } from '@/store/auth'
import { makeTestI18n } from '@tests/fixtures/testI18n'
import { makeTestRouter } from '@tests/fixtures/testRouter'
import { makeRegistration } from '@tests/fixtures/gameFixtures'

describe('integration: personal cabinet', () => {
  let pinia: Pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    sessionCallbacks.length = 0
    vi.clearAllMocks()
  })

  function signIn () {
    const authStore = auth()
    authStore.listenToSession()
    sessionCallbacks.forEach((callback) => callback({ uid: 'u1', email: null, displayName: null }))
  }

  function mountCabinet () {
    return mount(CabinetPage, {
      global: { plugins: [pinia, makeTestRouter(), makeTestI18n()] }
    })
  }

  it('lists the games the user joined', async () => {
    const recentCreatedAt = new Date().toISOString()
    vi.mocked(fetchMyRegistrations).mockResolvedValue([
      makeRegistration({ id: 'r1', gameTitle: 'Evening football', createdAt: recentCreatedAt }),
      makeRegistration({ id: 'r2', gameTitle: 'Sunday basketball', createdAt: recentCreatedAt })
    ])
    signIn()

    const wrapper = mountCabinet()
    await flushPromises()

    expect(fetchMyRegistrations).toHaveBeenCalledWith('u1')
    const items = wrapper.findAll('[data-testid="cabinet-game"]')
    expect(items).toHaveLength(2)
    expect(wrapper.text()).toContain('Evening football')
    expect(wrapper.text()).toContain('Sunday basketball')
  })

  it('shows the empty state for a user with no games', async () => {
    vi.mocked(fetchMyRegistrations).mockResolvedValue([])
    signIn()

    const wrapper = mountCabinet()
    await flushPromises()

    expect(wrapper.find('[data-testid="cabinet-empty"]').exists()).toBe(true)
  })
})
