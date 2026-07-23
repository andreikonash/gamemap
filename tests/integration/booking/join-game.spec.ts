import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'
import type { ISessionUser } from '@/types/auth'

vi.mock('@/services/games', () => ({
  fetchGame: vi.fn(),
  subscribeToGames: vi.fn()
}))

vi.mock('@/services/bookings', () => ({
  createRegistration: vi.fn(),
  fetchMyRegistrations: vi.fn(),
  markRegistrationPaid: vi.fn()
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

import { fetchGame } from '@/services/games'
import { createRegistration, markRegistrationPaid } from '@/services/bookings'
import GamePage from '@/pages/game/index.vue'
import { auth } from '@/store/auth'
import { GAME_STATUS } from '@/types/game'
import { REGISTRATION_STATUS } from '@/types/booking'
import { makeTestI18n } from '@tests/fixtures/testI18n'
import { makeTestRouter } from '@tests/fixtures/testRouter'
import { makeGame, makeRegistration } from '@tests/fixtures/gameFixtures'

describe('integration: joining a game', () => {
  let pinia: Pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
    sessionCallbacks.length = 0
    vi.clearAllMocks()
  })

  async function mountGamePage () {
    const router = makeTestRouter({ game: { component: GamePage } })
    await router.push('/game/g1')
    const wrapper = mount({ template: '<router-view />' }, {
      global: { plugins: [pinia, router, makeTestI18n()] }
    })
    await flushPromises()
    return { wrapper, router }
  }

  function signIn () {
    const authStore = auth()
    authStore.listenToSession()
    sessionCallbacks.forEach((callback) => callback({ uid: 'u1', email: null, displayName: null }))
    return authStore
  }

  it('authed user joins an open game: registration stored, follow-up shown, pay marks it paid', async () => {
    const game = makeGame()
    const registration = makeRegistration()
    vi.mocked(fetchGame).mockResolvedValue(game)
    vi.mocked(createRegistration).mockResolvedValue(registration)
    vi.mocked(markRegistrationPaid).mockResolvedValue()
    signIn()

    const { wrapper } = await mountGamePage()

    await wrapper.get('[data-testid="join-button"]').trigger('click')
    await flushPromises()

    expect(createRegistration).toHaveBeenCalledWith(game, 'u1')
    expect(wrapper.find('[data-testid="payment-followup"]').exists()).toBe(true)

    await wrapper.get('[data-testid="payment-pay"]').trigger('click')
    await flushPromises()

    expect(markRegistrationPaid).toHaveBeenCalledWith(registration.id)
    expect(wrapper.find('[data-testid="payment-success"]').exists()).toBe(true)
  })

  it('a full game shows no join action', async () => {
    vi.mocked(fetchGame).mockResolvedValue(makeGame({ status: GAME_STATUS.FULL, seatsTaken: 10 }))
    signIn()

    const { wrapper } = await mountGamePage()

    expect(wrapper.find('[data-testid="join-button"]').exists()).toBe(false)
  })

  it('a guest clicking join is sent to sign-in with a saved return path', async () => {
    vi.mocked(fetchGame).mockResolvedValue(makeGame())

    const { wrapper, router } = await mountGamePage()

    await wrapper.get('[data-testid="join-button"]').trigger('click')
    await flushPromises()

    expect(createRegistration).not.toHaveBeenCalled()
    expect(router.currentRoute.value.name).toBe('auth')
    expect(auth().redirectPath).toBe('/game/g1')
  })

  it('registration status starts as pending payment', () => {
    expect(makeRegistration().status).toBe(REGISTRATION_STATUS.PENDING_PAYMENT)
  })
})
