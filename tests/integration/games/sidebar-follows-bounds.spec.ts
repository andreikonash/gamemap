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
import { games } from '@/store/games'
import { makeTestI18n } from '@tests/fixtures/testI18n'
import { makeTestRouter } from '@tests/fixtures/testRouter'
import { makeGame } from '@tests/fixtures/gameFixtures'

describe('integration: sidebar shows only games inside the map bounds', () => {
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

  it('shows the empty state before the map reports bounds', () => {
    const store = games()
    store.games = [makeGame()]

    const wrapper = mountSidebar()

    expect(wrapper.find('[data-testid="games-sidebar-empty"]').exists()).toBe(true)
    expect(wrapper.findAll('[data-testid="game-card"]')).toHaveLength(0)
  })

  it('updates the list when the map bounds change', async () => {
    const store = games()
    const wroclawGame = makeGame({ id: 'wro', location: { lat: 51.11, lng: 17.03 } })
    const krakowGame = makeGame({ id: 'krk', location: { lat: 50.06, lng: 19.94 } })
    store.games = [wroclawGame, krakowGame]

    const wrapper = mountSidebar()

    store.setBounds({ north: 51.2, south: 51.0, east: 17.2, west: 16.9 })
    await wrapper.vm.$nextTick()

    let cards = wrapper.findAll('[data-testid="game-card"]')
    expect(cards).toHaveLength(1)
    expect(cards[0].attributes('data-game-id')).toBe('wro')

    store.setBounds({ north: 50.2, south: 49.9, east: 20.1, west: 19.8 })
    await wrapper.vm.$nextTick()

    cards = wrapper.findAll('[data-testid="game-card"]')
    expect(cards).toHaveLength(1)
    expect(cards[0].attributes('data-game-id')).toBe('krk')
  })
})
