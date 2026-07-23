import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia, type Pinia } from 'pinia'

vi.mock('@/services/games', () => ({
  fetchGame: vi.fn(),
  subscribeToGames: vi.fn()
}))

vi.mock('@/services/auth', () => ({
  signInWithGoogle: vi.fn(),
  signInWithEmail: vi.fn(),
  signUpWithEmail: vi.fn(),
  signOutUser: vi.fn(),
  fetchIsSuperAdmin: vi.fn().mockResolvedValue(false),
  onSessionChange: vi.fn()
}))

import GamesSidebar from '@/components/features/GamesSidebar/index.vue'
import { booking } from '@/store/booking'
import { games } from '@/store/games'
import { GAME_STATUS } from '@/types/game'
import { makeTestI18n } from '@tests/fixtures/testI18n'
import { makeTestRouter } from '@tests/fixtures/testRouter'
import { makeGame, makeRegistration } from '@tests/fixtures/gameFixtures'

describe('integration: sidebar games can be narrowed by the All/Open/Assigned filters', () => {
  let pinia: Pinia

  beforeEach(() => {
    pinia = createPinia()
    setActivePinia(pinia)
  })

  function mountSidebar () {
    return mount(GamesSidebar, {
      global: { plugins: [pinia, makeTestRouter(), makeTestI18n()] }
    })
  }

  it('shows every game in bounds under the All filter by default', () => {
    const store = games()
    store.games = [
      makeGame({ id: 'open', status: GAME_STATUS.OPEN }),
      makeGame({ id: 'full', status: GAME_STATUS.FULL })
    ]
    store.setBounds({ north: 52, south: 51, east: 18, west: 17 })

    const wrapper = mountSidebar()

    expect(wrapper.findAll('[data-testid="game-card"]')).toHaveLength(2)
  })

  it('narrows to games with free seats when Open is selected', async () => {
    const store = games()
    const openGame = makeGame({ id: 'open', status: GAME_STATUS.OPEN })
    const fullGame = makeGame({ id: 'full', status: GAME_STATUS.FULL })
    store.games = [openGame, fullGame]
    store.setBounds({ north: 52, south: 51, east: 18, west: 17 })

    const wrapper = mountSidebar()
    await wrapper.get('[data-testid="status-filter-open"]').trigger('click')

    const cards = wrapper.findAll('[data-testid="game-card"]')
    expect(cards).toHaveLength(1)
    expect(cards[0].attributes('data-game-id')).toBe('open')
  })

  it('narrows to games the user has joined when Assigned is selected', async () => {
    const store = games()
    const bookingStore = booking()
    store.games = [makeGame({ id: 'joined' }), makeGame({ id: 'other' })]
    store.setBounds({ north: 52, south: 51, east: 18, west: 17 })
    bookingStore.myRegistrations = [makeRegistration({ gameId: 'joined' })]

    const wrapper = mountSidebar()
    await wrapper.get('[data-testid="status-filter-assigned"]').trigger('click')

    const cards = wrapper.findAll('[data-testid="game-card"]')
    expect(cards).toHaveLength(1)
    expect(cards[0].attributes('data-game-id')).toBe('joined')
  })

  it('shows a filtered-empty message when Assigned hides every game in bounds', async () => {
    const store = games()
    store.games = [makeGame({ id: 'g1' })]
    store.setBounds({ north: 52, south: 51, east: 18, west: 17 })

    const wrapper = mountSidebar()
    await wrapper.get('[data-testid="status-filter-assigned"]').trigger('click')

    expect(wrapper.find('[data-testid="games-sidebar-filtered-empty"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="games-sidebar-empty"]').exists()).toBe(false)
  })
})
